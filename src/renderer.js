const nunjucks = require('nunjucks');
const path = require('path');

const env = new nunjucks.Environment(
    [new nunjucks.FileSystemLoader(path.join(__dirname, 'views'))],
    {
        trimBlocks: true,
        lstripBlocks: true
    }
);

module.exports = app => {
    env.express(app);
    app.set('view engine', 'njk');
};
