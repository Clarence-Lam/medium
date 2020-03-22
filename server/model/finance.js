const { query, format } = require('../config')

exports.getFinanceList = (customer_id, type, time, limit) => {
  let typeStr = ''
  let timeStr = ''
  if (type !== 'all') {
    typeStr = `AND type = '${type}'`
  }
  if (time.length === 2) {
    timeStr = `AND CREATED_TIME BETWEEN '${time[0]} 00:00:00' AND '${time[1]} 23:59:59'`
  }
  const sql = `SELECT * FROM capital_flow WHERE customer_id = '${customer_id}' ${typeStr} ${timeStr} ORDER BY CREATED_TIME DESC limit ${limit[0]}, ${limit[1]}`
  return query(sql)
}
exports.getFinanceListTotal = (customer_id, type, time, limit) => {
  let typeStr = ''
  let timeStr = ''
  if (type !== 'all') {
    typeStr = `AND type = '${type}'`
  }
  if (time.length === 2) {
    timeStr = `AND CREATED_TIME BETWEEN '${time[0]} 00:00:00' AND '${time[1]} 23:59:59'`
  }
  const sql = `SELECT COUNT(*) AS count FROM capital_flow WHERE customer_id = '${customer_id}' ${typeStr} ${timeStr} limit ${limit[0]}, ${limit[1]}`
  return query(sql)
}
