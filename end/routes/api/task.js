const router = require('express').Router();
const Task = require('../../models/Task');

router.get('/', (req, res) => {
    res.send('Task Home Page');
});

module.exports = router;