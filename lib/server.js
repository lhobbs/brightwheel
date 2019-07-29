'use strict';

const Hapi = require('@hapi/hapi');

// imports for Swagger documentation
const HapiSwagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');

// import email routes
const Routes = require('../routes/email');

// creates hapi server
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// Pull in the routes
server.route(Routes);

// init and start are spilt up for testing purposes
exports.init = async () => {

    await server.initialize();
    return server;
};

exports.start = async () => {

    // basic Swagger info
    const swaggerOptions = {
        info: {
            title: 'Brightwheel API Documentation',
            version: '1.0'
        }
    };

    // register Swagger
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    await server.start();

    console.log(`Server running at: ${server.info.uri}`);
    return server;
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});
