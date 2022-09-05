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
//获取用户信息
exports.getUserInfo = (req, res) => {
  // 根据用户的 id，查询用户的基本信息
  // 注意：为了防止用户的密码泄露，需要排除 password 字段
  console.log(req.user)
  const sqlStr = 'select id, username, nickname,email, user_pic from ev_users where id=?';
  // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
  db.query(sqlStr,req.user.id,(err, result) => {
    if (err) return res.cc(err);
    if (result.length !== 1) {
      return res.cc('未查到该用户');
    }
    res.send({
      status: 0,
      data: result[0],
      msg: 'ok',
    });
  })

}

// 更新用户信息
exports.updateUserInfo = (req, res) => {
  const sqlStr = 'update ev_users set nickname = ?, email = ? where id=?';
  db.query(sqlStr, [req.body.nickname, req.body.email, req.body.id ], (err, result) => {
    if(err) return res.cc(err);
    // 执行 SQL 语句成功，但影响行数不为 1
    if (result.affectedRows !== 1) return res.cc('该用户的基本信息修改失败！');
    res.cc('修改用户基本信息成功！', 0);
  })
}
// 修改密码
exports.updatepwd =(req, res) => {
  const info = req.body;
  // if (info.oldPwd === info.newPwd) return res.cc('新旧密码相同，请重新设置！');
  db.query('select password from ev_users where id =?', req.user.id, (err, result) => {
    if (err) return res.cc(err);
    if (result.length !== 1) return res.cc('没有该用户！');
    if (!bcrypt.compareSync(info.oldPwd, result[0].password)) return res.cc('原密码错误!');
    const password = bcrypt.hashSync(info.newPwd, 10);
    const sqlStr = 'update ev_users set password = ? where id = ?';
    db.query(sqlStr,[password, req.user.id], (err, result) => {
      if (err) return res.cc(err);
      if (result.affectedRows !== 1) return res.cc('修改密码失败');
      res.cc('修改密码成功！', 0);
    })
  })
}
exports.updateuserpic = (req, res) => {
  const sqlStr = 'update ev_users set user_pic = ? where id = ?';
  db.query(sqlStr, [req.body.user_pic, req.user.id], (err, result) => {
    if (err) return res.cc(err);
    if (result.affectedRows !== 1) return  res.cc('头像更新失败！');
    res.cc('头像更新成功！',0);
  })
  // res.send('ok');
}