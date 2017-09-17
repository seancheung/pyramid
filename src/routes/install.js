const Promise = require('bluebird');
const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    if (res.app.get('db')) {
        res.redirect('/');
    } else {
        res.render('install');
    }
});

router.post('/', (req, res, next) => {
    const conn = {
        dialect: req.body.dialect,
        database: req.body.database,
        host: req.body.host,
        port: req.body.port,
        username: req.body.username,
        password: req.body.password
    };
    Promise.try(() => require('../db/boot')(conn)).then(db => {
        return db
            .authenticate()
            .then(() => {
                const fs = require('fs-extra');
                const path = require('path');
                const config = require('../config');
                const file = path.join(__dirname, `../../${config.init}`);

                return Promise.promisify(fs.writeJSON)(file, conn);
            })
            .then(() => {
                res.app.set('db', db);
                res.redirect('/');
            })
            .catch(next);
    });
});

module.exports = router;
