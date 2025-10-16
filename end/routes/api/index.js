var express = require('express');
var router = express.Router();

const userRouter = require('./user');
const todoRouter = require('./todo');
const taskRouter = require('./task');
const orderRouter = require('./order');

router.use('/user', userRouter);
router.use('/todo', todoRouter);
router.use('/task', taskRouter);
router.use('/order', orderRouter);

module.exports = router;