'use strict';

/**
 * This model is used for the post object for the Mailgun email provider
 * Constructor takes in the payload object and converts it to their format
 */
class MailgunMessage {
    constructor(payload) {

        this.to = `${payload.to_name} <${payload.to}>`;
        this.from = `${payload.from_name} <${payload.from}>`;
        this.subject = payload.subject;
        this.text = payload.body;
    }
}

module.exports = MailgunMessage;
