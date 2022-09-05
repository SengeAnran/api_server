/**
 * 路由模块
 */
const express = require('express');
const router = express.Router();

// 导入验证表单数据中间件
const expressJoi = require('@escook/express-joi');
// 导入需要验证规则对象
const { update_userinfo_scheme, update_password_scheme, update_userpic_scheme }  = require('../schema/user');

// 导入用户路由处理函数模块
const userInfoHander = require('../router_handler/userInfo');
// 获取用户信息
router.get('/userinfo', userInfoHander.getUserInfo);
// 更新用户信息
router.post('/userinfo', expressJoi(update_userinfo_scheme),  userInfoHander.updateUserInfo);
// 更新密码路由
router.post('/updatepwd',expressJoi(update_password_scheme), userInfoHander.updatepwd);
// 更新用户头像
router.post('/updateuserpic', expressJoi(update_userpic_scheme), userInfoHander.updateuserpic);
module.exports = router;