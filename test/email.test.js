'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../lib/server');

const { getCleanText } = require('./../lib/helpers');

describe('POST /email', () => {

    let server;

    beforeEach(async () => {

        server = await init();
    });

    afterEach(async () => {

        await server.stop();
    });

    it('responds with 200', async () => {

        const res = await server.inject({
            method: 'POST',
            url: '/email',
            payload: {
                to: 'fake@example.com',
                to_name: 'Mr. Fake',
                from: 'noreply@mybrightwheel.com',
                from_name: 'Brightwheel',
                subject: 'A Message from Brightwheel',
                body: '<h1>Your Bill</h1><p>$10</p>'
            }
        });

        expect(res.statusCode).to.equal(200);
    });
});

describe('POST /email', () => {

    let server;

    beforeEach(async () => {

        server = await init();
    });

    afterEach(async () => {

        await server.stop();
    });

    it('responds with 400', async () => {

        const res = await server.inject({
            method: 'POST',
            url: '/email',
            payload: {
                to_name: 'Mrs. Fake',
                subject: 'This message will fail',
                body: 'No HTML message'
            }
        });

        expect(res.statusCode).to.equal(400);
    });
});

describe('getCleanText', () => {

    let server;

    beforeEach(async () => {

        server = await init();
    });

    afterEach(async () => {

        await server.stop();
    });

    it('removes HTML tabs', () => {

        const html = '<h1>hello</h1><br/><p>here is some stuff</p>';
        const result = getCleanText(html);

        expect(result).to.equal('hello here is some stuff');
    });
});
