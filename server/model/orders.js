const { query, format } = require('../config')

exports.getOrderCases = (table, limit, value, inArr, orderBy) => {
  let str = ''
  for (const item in value) {
    str += ` AND ${item} = '${value[item]}'`
  }
  for (const arr in inArr) {
    const strArr = []
    for (const item of inArr[arr]) {
      strArr.push(`'${item}'`)
    }
    if (strArr.length > 0) {
      str += `AND ${arr} IN (${strArr.join(',')})`
    }
  }
  const sql = `SELECT*FROM ${table} WHERE 1=1 ${inArr || value ? str : ''} ${orderBy !== '' ? 'ORDER BY ' + orderBy + ' ASC' : ''} limit ${limit[0]}, ${limit[1]}`
  console.log(sql)
  return query(sql)
}

exports.getOrderCasesTotal = (table, value, inArr, orderBy) => {
  let str = ''
  for (const item in value) {
    str += ` AND ${item} = '${value[item]}'`
  }
  for (const arr in inArr) {
    const strArr = []
    for (const item of inArr[arr]) {
      strArr.push(`'${item}'`)
    }
    if (strArr.length > 0) {
      str += `AND ${arr} IN (${strArr.join(',')})`
    }
  }
  const sql = `SELECT COUNT(*) AS count FROM ${table} WHERE 1=1 ${inArr || value ? str : ''}`
  return query(sql)
}

exports.getArticleType = (value) => {
  const sql = `SELECT * FROM article_type where type_field_id = '${value}'`
  return query(sql)
}
