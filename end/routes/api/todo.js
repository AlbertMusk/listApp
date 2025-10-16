const router = require('express').Router();
const Todo = require('../../models/Todo');

router.get('/', (req, res) => {
    res.send('Todo Home Page');
});

module.exports = router;