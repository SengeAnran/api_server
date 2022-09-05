const path = require('path');
const db = require('../db/index');
exports.addArticle = (req, res) => {
  // console.log(req.body) // 文本类型的数据
  // console.log('--------分割线----------')
  // console.log(req.file) // 文件类型的数据
  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面为必选参数');
  const fileType = path.extname(req.file.originalname);
  const articleInfo = {
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', req.file.filename + fileType),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.user.id,
  }
  const sqlStr = 'insert into ev_articles set ?';
  db.query(sqlStr, articleInfo, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('发布文章失败!');
    res.cc('发布文章成功!', 0);
  })
  // res.send('ok');
}