'use strict';

const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi')
const mailgun = require("mailgun-js");
const DOMAIN = "";
const apiKey = "";
const Wreck = require('@hapi/wreck');
const Https = require('https');

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
        handler: (request, h) => {
            const data = {
                from: "Mailgun Sandbox <postmaster@sandbox2250e442e4c24b55b13d12eb7919ad3b.mailgun.org>",
                to: "elisa.hobbs@colorado.edu",
                subject: "Hello",
                text: "Testing some Mailgun awesomness!"
            };
            // mg.messages().send(data, function (error, body) {
            //     console.log(body, error);
            // });
            //h.redirect('https://api.mailgun.net/v3/sandbox2250e442e4c24b55b13d12eb7919ad3b.mailgun.org', data)
            const wreck = Wreck.defaults({
                headers: { 'content-tyoe' : 'application/json'},
                // agents: {
                //     https: new Https.Agent({ maxSockets: 100 }),
                //     // http: new Http.Agent({ maxSockets: 1000 }),
                //     httpsAllowUnauthorized: new Https.Agent({ maxSockets: 100, rejectUnauthorized: false })
                // }
            });
            const basic = new Buffer(`api:${apiKey}`).toString('base64');
            console.log(basic)
            const options = {
                payload: data,
                headers: { 
                   'content-tyoe' : 'application/json',
                   'Authorization': `Basic ${basic}` 
                }
            }
            //Wreck.post(`https://api:${apiKey}@api.mailgun.net/v3/${DOMAIN}/messages`, data).then(c => console.log(c)).catch(err => console.dir(err))
            //Wreck.request('POST', `https://api:${apiKey}@api.mailgun.net/v3/${DOMAIN}/messages`, options).then(r => console.log(r)).catch(err => console.dir(err))
            Wreck.request('POST', `https://api.mailgun.net/v3/${DOMAIN}/messages`, options).catch(r => console.log(r))

            //console.log(payload.toString())
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