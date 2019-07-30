const { query, format } = require('../config')

exports.getList = (table, limit, value) => {
  let str = ''
  for (const item in value) {
    str += ` AND ${item} = '${value[item]}'`
  }
  const sql = `SELECT*FROM ${table} WHERE STATUS='1' ${value ? str : ''} limit ${limit[0]}, ${limit[1]}`
  return query(sql, value)
}

exports.getListTotal = (table, value) => {
  let str = ''
  for (const item in value) {
    str += ` AND ${item} = '${value[item]}'`
  }
  const sql = `SELECT COUNT(*) AS count FROM ${table} WHERE STATUS='1' ${value ? str : ''}`
  return query(sql, value)
}

exports.delRow = (table, id) => {
  const sql = `UPDATE ${table} SET status = '0' where id = '${id}'`
  return query(sql)
}

exports.updateRow = (table, id, value) => {
  const sql = `UPDATE ${table} SET ? WHERE id='${id}'`
  return query(sql, value)
}

exports.addRow = (table, value) => {
  const sql = `insert into ${table} set ?`
  return query(sql, value)
}
