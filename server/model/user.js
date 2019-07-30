const { query, format } = require('../config')

exports.login = (value) => {
  const sql = 'SELECT*FROM USER'
  return query(sql, value)
}

exports.register = (value) => {
  const sql = 'insert into user set ?;'
  return query(sql, value)
}

exports.hasUser = (value) => {
  const sql = 'SELECT*FROM USER where phone = ?;'
  return query(sql, value)
}

exports.login = (value) => {
  const sql = 'SELECT*FROM USER WHERE phone=?'
  return query(sql, value)
}

exports.hasRepUser = (id, phone) => {
  const sql = `SELECT*FROM user WHERE phone = '${phone}' AND id NOT IN ('${id}')`
  return query(sql)
}
