const { query, format } = require('../config')

exports.getArticleType = (value) => {
  const sql = 'SELECT*FROM article_type WHERE cases_id=?'
  return query(sql, value)
}

exports.delArticleType = (value) => {
  const sql = 'DELETE FROM article_type WHERE cases_id=?'
  return query(sql, value)
}
// 获取首页广告
exports.getAdList = (end_time) => {
  const sql = 'SELECT*FROM ad WHERE state=\'audited\' AND end_time> ?'
  return query(sql, end_time)
}
