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

exports.reg_login_scheme = {
  body: {
    username,
    password,
  },
}