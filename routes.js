const Joi = require('@hapi/joi')
const request = require('request')
const env2 = require('env2')('.env')
const MailgunMessage = require('./models/MailgunMessage')
const MandrillMessage = require('./models/MandrillMessage')
const helpers = require('./helpers')

module.exports = {
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
    }