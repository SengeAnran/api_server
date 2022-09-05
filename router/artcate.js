const express = require('express');
const artcate = require('../router_handler/artcate');
const expressJoi = require('@escook/express-joi');
const {reg_addartcates_schema, delete_cate_schema, update_cate_schema} = require('../schema/artcate')

const router = express.Router();

//  获取分类列表
router.get('/cates', artcate.getactcates);

// 新增分类
router.post('/addcates',expressJoi(reg_addartcates_schema), artcate.addcates);

// 根据id删除分类
router.get('/deletecate/:id',expressJoi(delete_cate_schema), artcate.deletecate);
// 根据 Id 获取文章分类数据
router.get('/cates/:id',expressJoi(delete_cate_schema), artcate.getArtCateById);
// 根据 Id 更新文章分类数据
router.post('/updatecate', expressJoi(update_cate_schema), artcate.updateCateById);
module.exports = router;