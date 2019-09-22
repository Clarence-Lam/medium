const { query, format } = require('../config')

// exports.login = (value) => {
//   const sql = 'SELECT*FROM user'
//   return query(sql, value)
// }

exports.register = (value) => {
  const sql = 'insert into user set ?;'
  return query(sql, value)
}

exports.hasUser = (value) => {
  const sql = 'SELECT*FROM user where phone = ?;'
  return query(sql, value)
}

exports.login = (value) => {
  const sql = 'SELECT*FROM user WHERE phone=?'
  return query(sql, value)
}

exports.hasRepUser = (id, phone) => {
  const sql = `SELECT*FROM user WHERE phone = '${phone}' AND id NOT IN ('${id}')`
  return query(sql)
}

exports.loginForCust = (value) => {
  const sql = 'SELECT*FROM customer WHERE phone=?'
  return query(sql, value)
}

// 模糊搜索用户,params:精确搜索条件，values:模糊搜索条件
exports.searchCusts = (params, values, limit) => {
  let str = ''
  for (const item in params) {
    str += ` AND ${item} = '${params[item]}'`
  }
  for (const item in values) {
    if (values[item]) {
      str += ` AND ${item} LIKE '%${values[item]}%'`
    }
  }
  const sql = `SELECT*FROM customer WHERE 1=1 ${params || values ? str : ''} ORDER BY created_time DESC limit ${limit[0]}, ${limit[1]}`
  return query(sql)
}

exports.searchCustsTotal = (params, values) => {
  let str = ''
  for (const item in params) {
    str += ` AND ${item} = '${params[item]}'`
  }
  for (const item in values) {
    if (values[item]) {
      str += ` AND ${item} LIKE '%${values[item]}%'`
    }
  }
  const sql = `SELECT COUNT(*) AS count FROM customer WHERE 1=1 ${params || values ? str : ''} ORDER BY created_time DESC `
  return query(sql)
}
