'use strict';

const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi')
const env2 = require('env2')('.env')
const DOMAIN = process.env.DOMAIN;
const apiKey = process.env.APIKEY;
const request = require('request')

const MailgunMessage = require('./models/MailgunMessage')
const MandrillMessage = require('./models/MandrillMessage')
const helpers = require('./helpers')


const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'POST',
        path:'/email',
        options: {
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
        handler: (req, h) => {
            let message = {}
            let url = ''
            if (process.env.DEFAULT_MAIL_SERVICE == 'MAILGUN') {
                message = new MailgunMessage(req.payload)
                url = helpers.getMailgunUrl()
            }
            else {
                message = new MandrillMessage(req.payload)
                url = 'https://mandrillapp.com/api/1.0/messages/send.json'
            }

            request.post({url:url, form: message}, function(err,httpResponse,body){ 
                console.log(httpResponse, err, body)
            })

            return 'Hello World!';
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
