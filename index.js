'use strict';

const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi')
const mailgun = require("mailgun-js");
const env2 = require('env2')('.env')
const DOMAIN = process.env.DOMAIN;
const apiKey = process.env.APIKEY;
const Wreck = require('@hapi/wreck');
const Https = require('https');
const request = require('request')


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
            const data = {
                from: "Mailgun Sandbox <postmaster@sandbox2250e442e4c24b55b13d12eb7919ad3b.mailgun.org>",
                to: "elisa.hobbs@colorado.edu",
                subject: "Hello",
                text: "Testing some Mailgun awesomness!"
            };
            
            request.post({url:`https://api:${apiKey}@api.mailgun.net/v3/${DOMAIN}/messages`, form: data}, function(err,httpResponse,body){ 
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

// const example = async function () {

//     const data = {
//         from: "Mailgun Sandbox <postmaster@sandbox2250e442e4c24b55b13d12eb7919ad3b.mailgun.org>",
//         to: "elisa.hobbs@colorado.edu",
//         subject: "Hello",
//         text: "Testing some Mailgun awesomness!"
//     };
//     const basic = new Buffer(`api:${apiKey}`).toString('base64');
//             // console.log(basic)
//     const options = {
//         payload: JSON.stringify(data),
//         json: true,
//         headers: { 
//             'content-tyoe' : 'application/json',
//             'Authorization': `Basic ${basic}` 
//         }
//     }
//     // console.log(Buffer.from(JSON.stringify(data)))
//     // console.dir(options)
//     const { res, payload } = await Wreck.post(`https://api:${apiKey}@api.mailgun.net/v3/${DOMAIN}/messages`, {payload: data, json: true} );
//     console.log(payload.toString());
// };

// try {
//     example();
// }
// catch (ex) {
//     console.error(ex);
// }