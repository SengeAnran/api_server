/**
 * 路由模块
 */
const express = require('express');
const router = express.Router();

// 导入验证表单数据中间件
const expressJoi = require('@escook/express-joi');
// 导入需要验证规则对象
const { reg_login_scheme }  = require('../schema/user');

// 导入用户路由处理函数模块
const userHander = require('../router_handler/user');
// 注册用户
router.post('/register',expressJoi(reg_login_scheme), userHander.register);
// 登陆
router.post('/login', expressJoi(reg_login_scheme) ,userHander.login);
module.exports = router;