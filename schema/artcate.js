const joi = require('joi');

const name = joi.string().min(1).max(20).required();
const alias = joi.string().alphanum().required();
const id = joi.number().integer().min(1).required();

exports.reg_addartcates_schema = {
  body: {
    name,
    alias,
  }
}
exports.delete_cate_schema = {
  params: {
    id,
  }
}
exports.update_cate_schema = {
  body: {
    id,
    name,
    alias,
  }
}