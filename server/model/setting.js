const { query, format } = require('../config')

exports.getArticleType = (value) => {
  const sql = 'SELECT*FROM article_type WHERE cases_id=?'
  return query(sql, value)
}

exports.delArticleType = (value) => {
  const sql = 'DELETE FROM article_type WHERE cases_id=?'
  return query(sql, value)
}
