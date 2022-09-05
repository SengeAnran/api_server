// 导入数据库连接对象
const db = require('../db/index');
const {date} = require('joi');

//获取文章分类列表
exports.getactcates = (req, res) => {
  const sqlStr = 'select * from ev_article_cate where is_delete = 0 ';
  db.query(sqlStr, (err, result) => {
    if (err) return res.cc(err);
    res.send({
      status: 1,
      data: result,
      msg: '获取分类列表成功！',
    });
  })
}

// 新增分类
exports.addcates = (req, res) => {
  const addData = req.body;
  addData.is_delete = 0;
  const sqlStr = 'select * from ev_article_cate where name = ? or alias =?';
  db.query(sqlStr, [addData.name, addData.alias], (err, results) => {
    if (err) return res.cc(err);
    // 分类名称 和 分类别名 都被占用
    if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
    // 分类名称 或 分类别名 被占用
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
    const sqlStr = 'insert into ev_article_cate set ?';
    db.query(sqlStr, addData, (err, result) => {
      if (err) return res.cc(err);
      if (result.affectedRows !== 1) return  res.cc('新增失败！');
      res.cc('新增分类成功！',0);
    })
  })
}

// 根据id删除分类
exports.deletecate = (req, res) => {
  const sqlStr = 'select * from ev_article_cate where id = ? and is_delete = 0';
  db.query(sqlStr, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length === 0) return res.cc('要删除的分类不存在！');
    const sqlStr = 'update ev_article_cate set is_delete = 1 where id = ?';
    db.query(sqlStr, req.params.id, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc('分类删除失败！');
      res.cc('分类删除成功！', 0);
    })
  })

}

// 根据 Id 获取文章分类数据
exports.getArtCateById = (req, res) => {
  const sqlStr = 'select * from ev_article_cate where id = ?';
  db.query(sqlStr, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('没有该分类');
    res.send({
      status: 0,
      data: results[0],
      msg: '查询成功！',
    });
  })
}

// 根据 Id 更新文章分类数据
exports.updateCateById = (req, res) => {
  const sqlStr = 'select * from ev_article_cate where id = ?';
  db.query(sqlStr, req.body.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('没有该分类');
    const sqlStr = 'select * from ev_article_cate where name = ? or alias =?';
    db.query(sqlStr, [req.body.name, req.body.alias], (err, results) => {
      if (err) return res.cc(err);
      // 分类名称 和 分类别名 都被占用
      if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
      if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
      // 分类名称 或 分类别名 被占用
      if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
      if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
      const sqlStr = 'update ev_article_cate set ? where id = ?';
      db.query(sqlStr, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('修改失败');
        res.cc('分类修改成功！', 0);
      })
    })
  })
}