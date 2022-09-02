const express = require('express');
// 倒入cors中间件
const cors = require('cors');
const joi = require('joi');
const userRouter = require('./router/user');
// 解析token
const expressJWT = require('express-jwt');
const config = require('./config');
// 创建服务器实例
const app = express();
// 将cors注册为全局中间件
app.use(cors());
// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
// 注意该中间件只能解析application/x-www-form-urlencoded 格式的数据
app.use(express.urlencoded({extended:false})); // 固定写法
// 响应数据的中间件
app.use((req, res, next) => {
  res.cc = (err, status =1 ) => {
    res.send({
      // 状态
      status,
      // 状态描述,判断 err 是 错误对象 还是 字符串
      massage: err instanceof Error ? err.message : err,
    });
  }
  next();
})
// 解析token 中间件
//// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({secret: config.jwtSecretKey}).unless({path:[/^\/api\//]}));
// 服务器挂载路由接口
app.use('/api',userRouter);
// 全局错误中间件
app.use((err, req,res,next) => {
  // 表单校验错误
  if (err instanceof joi.ValidationError) {
    return res.cc(err);
  }
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！');
  // 未知错误
  res.cc(err);
  // 注：在我们的res里不能多次调用res.send(), http通讯是单次的
  next();
})
app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007');
})