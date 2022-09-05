/**
 *
 * user相关的处理函数模块
 */
// 导入数据库连接对象
const db = require('../db/index');
// 密码加密模块引入
const bcrypt = require('bcryptjs');

//jwk token生成
const jwk = require('jsonwebtoken');
const config = require('../config');

// 校验中间件
// const e

// 注册用户的处理函数
exports.register = (req, res) => {
  // 接收表单数据
  const userinfo = req.body;
  // // 判断数据是否合法
  // if (!userinfo.username || !userinfo.password) {
  //   return res.cc('用户名或密码不能为空!');
  // }
  db.query('SELECT count(*) AS total FROM ev_users WHERE username =?', userinfo.username, (err , results) => {
    if (err) {
      return res.send({status: 1, message: err.message,});
    } // 查询错误
    if (results[0].total !== 0) { // 已存在该用户
      return res.cc('该用户已被注册!');
    }
    // 在注册用户的处理函数中，确认用户名可用之后，调用 bcrypt.hashSync(明文密码, 随机盐的长度) 方法，对用户的密码进行加密处理：
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    // bcrype优点
    // 加密之后的密码，无法被逆向破解
    // 同一明文密码多次加密，得到的加密结果各不相同，保证了安全性
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    console.log(userinfo.password);
    const sqlStr = `INSERT INTO ev_users SET ?`;
    db.query(sqlStr, userinfo, (err, results) => {
      if (err) {
        return res.cc(err);
      }// 插入错误
      if(results.affectedRows !==1) {
        return res.cc('注册用户失败，请稍后再试！');
      }
      res.send({ status: 0, message: '注册成功！',})
    })
  })
}
// 登陆的处理函数
exports.login = (req, res) => {
  const userInfo = req.body;
  const sqlStr = 'select * from ev_users where username = ?';
  db.query(sqlStr, userInfo.username, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) {
      return  res.cc('用户名错误');
    }
    // bcrypt.compareSync(用户提交的密码, 数据库中的密码)
    if (!bcrypt.compareSync(userInfo.password, results[0].password)) {
      return res.cc('密码错误');
    }
    //通过 ES6 的高级语法，快速剔除 密码 和 头像 的值
    // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
    const user = {...results[0], password: '', user_pic: ''};
    const tokenStr = jwk.sign(user, config.jwtSecretKey,{
      expiresIn: 10000, // token 有效期为10小时
    })
    res.send({
      status: 0,
      message: '登陆成功！',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: 'Bearer ' + tokenStr,
    })
  })
}