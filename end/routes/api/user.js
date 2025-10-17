var express = require('express');
var router = express.Router();
const User = require('../../models/User');
const mongoose = require('mongoose');
const sendResponse = require('../../utils/response');

router.get('/create_test', async (req, res, next) => {
  try {
    const newUser = new User({
      username: 'admin',
      password: '111111',
      role: 'admin'
    });
    await newUser.save();
    res.json({ message: 'User created', user: newUser });
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  const { username, password, role } = req.body.user;
  console.log(req.body);
  let user = await User.findByUsername(username);
  if (user) {
    return sendResponse(res, {}, '用户名已存在', -1);
  }
  user = new User({
    username,
    password,
    role: role || 'user'
  });
  await user.save();
  return sendResponse(res, user, '注册成功', 0);
});

router.post('/delete', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super') {
      return sendResponse(res, {}, '权限不足', -1);
    }
    const { id } = req.body;
    await User.deleteById(id);
    return sendResponse(res, {}, '用户删除成功', 0);
  } catch (err) {
    next(err);
  }
});

router.post('/update', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super') {
      return sendResponse(res, {}, '权限不足', -1);
    }
    const { id, username, role } = req.body;
    let user = await User.findById(id);
    if (!user) {
      return sendResponse(res, {}, '用户不存在', -1);
    }
    user.username = username || user.username;
    user.role = role || user.role;
    await user.save();
    return sendResponse(res, user, '用户更新成功', 0);
  } catch (err) {
    next(err);
  }
});


router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  user = await User.findByUsername(username);
  console.log(user);
  if (!user) {
    return sendResponse(res, {}, '找不到该用户', -1);
  } else if (user.password !== password) {
    return sendResponse(res, {}, '密码错误', -1);
  }else {
    return sendResponse(res, user, '登录成功', 0);
  }
});

router.post('/list', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super') {
      return sendResponse(res, {}, '权限不足', -1);
    }
    const users = await User.fetch();
    sendResponse(res, users, '用户列表获取成功', 0);
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
