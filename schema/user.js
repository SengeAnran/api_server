const joi = require('joi')
/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 2. 定义验证规则
// 注意：如果客户端提交的某些参数项未在 schema 中定义，
// 此时，这些多余的参数项默认会被忽略掉
  // 用户名
const username = joi.string().alphanum().min(1).max(10).required();

// 密码

const password = joi.string().pattern(/^[\S]{6,12}$/).required();
// id
const id = joi.number().integer().min(1).required();
// 别名
const nickname = joi.string().required();
// 邮箱
const email = joi.string().email().required();
// 头像
// dataUri() 指的是如下格式的字符串数据： 
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const user_pic = joi.string().dataUri().required();
exports.reg_login_scheme = {
  body: {
    username,
    password,
  },
}
exports.update_userinfo_scheme = {
  body: {
    id,
    nickname,
    email,
  }
}
exports.update_password_scheme = {
  body: {
    oldPwd: password,
    // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
    // 解读：
    // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
    // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
    // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
    newPwd: joi.not(joi.ref('oldPwd')).concat(password),
  },
}
exports.update_userpic_scheme = {
  body: {
    user_pic,
  }
}