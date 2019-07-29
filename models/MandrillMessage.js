'use strict';

/**
 * This model is used for the post object for the Mandrill email provider
 * Constructor takes in the payload object and converts it to the message object
 * Also includes the key for the Mandrill API
 */
class MandrillMessage {
    constructor(payload) {

        this.key = process.env.MANDRILL_APIKEY;
        this.message = {
            to : [{ email: payload.to, name: payload.to_name }],
            from_email : payload.from,
            from_name : payload.from_name,
            subject : payload.subject,
            text : payload.body
        };
    }
}

module.exports = MandrillMessage;
