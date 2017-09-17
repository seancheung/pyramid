const path = require('path');
const fs = require('fs');
const stringcase = require('stringcase');

module.exports = function(sequelize) {
    fs
        .readdirSync(path.join(__dirname, './schemas'))
        .filter(f => /.js$/.test(f))
        .forEach(filename => {
            const file = path.join(__dirname, './schemas', filename);
            const schema = require(file);
            const name =
                schema.name || path.basename(filename, path.extname(filename));
            const attributes =
                typeof schema.attributes === 'function'
                    ? schema.attributes(sequelize.Sequelize.DataTypes)
                    : schema.attributes;
            sequelize.define(
                stringcase.snakecase(name),
                attributes,
                schema.options
            );
        });
    require('./relations')(sequelize);
    if (!process.env.NO_MODEL_HOOKS) {
        require('./hooks')(sequelize);
    }
    require('./attach')(sequelize);
};
