const router = require('express').Router();
const Order = require('../../models/Order');

router.get('/', (req, res) => {
    res.send('Order Home Page');
});

module.exports = router;