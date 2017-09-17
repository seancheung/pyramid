module.exports = function(config) {
    if (!config) {
        throw new Error('configuration required');
    }
    const options = { dialect: config.dialect || 'sqlite' };
    if (options.dialect === 'sqlite') {
        options.storage =
            config.storage || config.database || 'database.sqlite';
        if (options.storage !== ':memory:') {
            const path = require('path');
            if (!path.isAbsolute(options.storage)) {
                options.storage = path.join(
                    __dirname,
                    '../../',
                    options.storage
                );
            }
            if (path.extname(options.storage) !== '.sqlite') {
                options.storage = path.join(
                    path.dirname(options.storage),
                    path.basename(
                        options.storage,
                        path.extname(options.storage)
                    ) + '.sqlite'
                );
            }
            require('fs-extra').ensureFileSync(options.storage);
        }
    } else if (options.dialect === 'mysql') {
        options.host = config.host || 'localhost';
        options.port = config.port || 3306;
        options.database = config.database;
        options.username = config.username;
        options.password = config.password;
    } else {
        throw new Error('unsupported database dialect');
    }
    const Sequelize = require('sequelize');
    const sequelize = new Sequelize(options);

    require('./models/boot')(sequelize);

    return sequelize;
};
