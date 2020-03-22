const { query, format } = require('../config')

exports.getOrderCases = (table, limit, value, inArr, orderBy, fuzzySearch) => {
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
  for (const item in fuzzySearch) {
    str += `AND ${item} LIKE '%${fuzzySearch[item]}%'`
  }
  const sql = `SELECT*FROM ${table} WHERE 1=1 ${inArr || value || fuzzySearch ? str : ''} ${orderBy !== '' ? 'ORDER BY ' + orderBy + ' ASC' : ''} limit ${limit[0]}, ${limit[1]}`
  return query(sql)
}

exports.getOrderCasesTotal = (table, value, inArr, orderBy, fuzzySearch) => {
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
  for (const item in fuzzySearch) {
    str += `AND ${item} LIKE '%${fuzzySearch[item]}%'`
  }
  const sql = `SELECT COUNT(*) AS count FROM ${table} WHERE 1=1 ${inArr || value || fuzzySearch ? str : ''}`
  return query(sql)
}

exports.getArticleType = (value) => {
  const sql = `SELECT * FROM article_type where type_field_id = '${value}'`
  return query(sql)
}

exports.getOrderTable = (params, state, limit, daterange, likeParams) => {
  let str = ''
  for (const item in params) {
    if (params[item]) {
      str += ` AND ${item} = '${params[item]}'`
    }
  }

  if (state !== null) {
    str += `AND state IN ('${state.join("','")}')`
  }
  for (const item in daterange) {
    if (daterange[item] && daterange[item][0] && daterange[item][1]) {
      str += `AND ${item} BETWEEN '${daterange[item][0]} 00:00:00' AND '${daterange[item][1]} 23:59:59'`
    }
  }
  for (const item in likeParams) {
    if (likeParams[item]) {
      str += ` AND ${item} LIKE '%${likeParams[item]}%'`
    }
  }
  const sql = `SELECT*FROM orders WHERE status = '1'  ${params || state ? str : ''} order by created_time desc limit ${limit[0]}, ${limit[1]}`
  return query(sql)
}
exports.getOrderTableTotal = (params, state, daterange, likeParams) => {
  let str = ''
  for (const item in params) {
    if (params[item]) {
      str += ` AND ${item} = '${params[item]}'`
    }
  }

  if (state !== null) {
    str += `AND state IN ('${state.join("','")}')`
  }
  for (const item in daterange) {
    if (daterange[item] && daterange[item][0] && daterange[item][1]) {
      str += `AND ${item} BETWEEN '${daterange[item][0]} 00:00:00' AND '${daterange[item][1]} 23:59:59'`
    }
  }
  for (const item in likeParams) {
    if (likeParams[item]) {
      str += ` AND ${item} LIKE '%${likeParams[item]}%'`
    }
  }
  const sql = `SELECT COUNT(*) AS count FROM orders WHERE status = '1'  ${params || state ? str : ''}`
  return query(sql)
}

exports.delCollectionByCaseId = (caseid, userid) => {
  const sql = `DELETE FROM collection WHERE case_id='${caseid}' AND customer_id='${userid}'`
  return query(sql)
}
