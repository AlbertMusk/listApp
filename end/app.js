var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const sendResponse = require('./utils/response');
const User = require('./models/User');

var app = express();


app.use(cors());

// 连接mongodb
const connectDB = require('./db');
// 调用连接函数
connectDB();

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

// 全局验证token
app.use(async (req, res, next) => {
  // 跳过登录和公开接口
  if (req.path === '/api/user/login' || req.path === '/' || req.path.startsWith('/public')) {
    return next()
  }

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return sendResponse(res, {}, '未提供 token', -1)
  }

  // token 一般格式：Bearer xxx
  const token = authHeader.split(' ')[1]

  try {
    console.log(token);
    const user = await User.findByToken(token)
    console.log(user);
    if (!user) {
      return sendResponse(res, {}, '无效的 token', -1)
    }
    req.user = user // 把解析的用户信息放到 req 上
    next()
  } catch (error) {
    return sendResponse(res, {}, '无效的 token', -1)
  }
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const PORT = process.env.PORT || 3000;
app.listen(3005, () => {
  console.log(`服务器已启动，监听端口 ${PORT}`);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
