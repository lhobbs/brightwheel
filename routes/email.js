'use strict';

// Joi is used for validation
const Joi = require('@hapi/joi');

// Boom is used for error handling
const Boom = require('@hapi/boom');

// request is used to make http request to mail services
const Request = require('request');

// env2 is used to pull in environment variables and settings
// const Env2 = require('env2')('.env');

// models used for mail messages
const MailgunMessage = require('../models/MailgunMessage');
const MandrillMessage = require('../models/MandrillMessage');

// include helper functions
const { getMailgunUrl, getCleanText } = require('./../lib/helpers');

module.exports = [{
    method: 'POST',
    path:'/email',
    options: {
        tags: ['api'],
        description: 'Sends email by http request through either Mandrill or Mailgun',
        notes: 'Determins which email service to use from env settings. All fields are required.',
        validate: {
            payload: {
                to: Joi.string().required(),
                to_name: Joi.string().required(),
                from: Joi.string().required(),
                from_name: Joi.string().required(),
                subject: Joi.string().required(),
                body: Joi.string().required()
            }
        }
    },
    handler: async (req, h) => {

        // inital data
        let message = {};
        let url = '';
        let statusCode = 200;

        // remove html tags
        req.payload.body = getCleanText(req.payload.body);

        if (process.env.DEFAULT_MAIL_SERVICE === 'MAILGUN') {
            message = new MailgunMessage(req.payload);
            url = getMailgunUrl();
        }
        else {
            message = new MandrillMessage(req.payload);
            url = 'https://mandrillapp.com/api/1.0/messages/send.json';
        }

        // send email
        await Request.post({ url, form: message }, (err, response, body) => {

            if (err || response.statusCode !== 200) {
                statusCode = response.statusCode;
            }
        });

        if (statusCode !== 200) {
            throw Boom.badRequest();
        }

        return 'Email sent successfully';
    }
}];
