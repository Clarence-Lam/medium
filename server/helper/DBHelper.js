const { query, format } = require('../config')

exports.getList = (table, limit, value) => {
  let str = ''
  for (const item in value) {
    str += ` AND ${item} = '${value[item]}'`
  }
  const sql = `SELECT*FROM ${table} WHERE STATUS='1' ${value ? str : ''} ORDER BY created_time DESC limit ${limit[0]}, ${limit[1]}`
  return query(sql, value)
}

exports.getListTotal = (table, value) => {
  let str = ''
  for (const item in value) {
    str += ` AND ${item} = '${value[item]}'`
  }
  const sql = `SELECT COUNT(*) AS count FROM ${table} WHERE STATUS='1' ${value ? str : ''} ORDER BY created_time DESC`
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

exports.addRowFormat = (table, value) => {
  const sql = `insert into ${table} set ?`
  return format(sql, value)
}

exports.getListFormat = (table, limit, value) => {
  let str = ''
  for (const item in value) {
    str += ` AND ${item} = '${value[item]}'`
  }
  const sql = `SELECT*FROM ${table} WHERE STATUS='1' ${value ? str : ''} limit ${limit[0]}, ${limit[1]}`
  return format(sql, value)
}

exports.getListInRow = (table, limit, value, inArr) => {
  let str = ''
  for (const item in value) {
    str += ` AND ${item} = '${value[item]}'`
  }
  for (const arr in inArr) {
    const strArr = []
    for (const item of inArr[arr]) {
      // str += ` AND ${arr} IN ('${value[item]}')`
      strArr.push(`'${item}'`)
    }
    str += ` AND ${arr} IN (${strArr.join(',')})`
  }
  const sql = `SELECT*FROM ${table} WHERE STATUS='1' ${value || inArr ? str : ''} limit ${limit[0]}, ${limit[1]}`
  return format(sql, value)
}

exports.updateByParams = (table, values, conditions) => {
  let str = ''
  for (const item in conditions) {
    str += ` AND ${item} = '${conditions[item]}'`
  }
  const sql = `UPDATE ${table} SET ? WHERE STATUS='1' ${str}`
  return query(sql, values, conditions)
}
