var express = require('express');
var router = express.Router();
const User = require('../../models/User');
const mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('User Home Page');
});

router.get('/create', async (req, res, next) => {
  try {
    const newUser = new User({
      username: '韩嘉泰',
      password: 'examplePass'
    });
    await newUser.save();
    res.json({ message: 'User created', user: newUser });
  } catch (err) {
    next(err);
  }
});
router.get('/list', async (req, res, next) => {
  try {
    const users = await User.fetch();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/get/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
