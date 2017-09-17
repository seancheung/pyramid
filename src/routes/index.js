const { Router } = require('express');

const router = Router({ mergeParams: true });

router.use('/install', require('./install'));

router.use((req, res, next) => {
    if (res.app.get('db')) {
        next();
    } else {
        res.redirect('/install');
    }
});

module.exports = router;
