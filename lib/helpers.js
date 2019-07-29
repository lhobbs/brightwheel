'use strict';

/**
 * Returns the URL needed for Mailgun
 */
const getMailgunUrl = () => {

    return `https://api:${process.env.MAILGUN_APIKEY}@api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`;
};

/**
 * Returns text of body without HTML tags
 */
const getCleanText = (body) => {

    return body.replace(/<br\/>/gm, ' ').replace(/<[^>]*>?/gm, '');
};

module.exports = { getMailgunUrl, getCleanText };
