const config = require('../config.json');

module.exports = Object.assign(
    {},
    config.default,
    config[process.env.NODE_ENV] || {}
);
