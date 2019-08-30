const userModel = require('../model/user.js')
const DBHelper = require('../helper/DBHelper.js')
const Orders = require('../model/orders.js')
const uuidv1 = require('uuid/v1')
const moment = require('moment')
const bcrypt = require('bcrypt')
const _ = require('lodash')

class OrderController {
  async addOrder(ctx) {
    console.log(111)
    const { name, time, mark, content } = ctx.request.body
    const params = {
      id: uuidv1(),
      customer_id: ctx.session.userId,
      customer_name: ctx.session.userName,
      title: name,
      url: content,
      finish_time: time,
      mark,
      created_by: ctx.session.userName,
      created_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    DBHelper.addRow('orders', params).then(() => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '成功添加标签'
      }
    })
  }
  async getCommitTable(ctx) {
    const { dept, search } = ctx.request.body
    const pageNum = parseInt(ctx.request.body.page || 1, 10)
    const end = 10 // 默认页数
    const start = (pageNum - 1) * end
    const limit = [start, end]
    const inArr = []
    let orderBy = ''
    const params = {
      dept,
      status: 1
    }
    for (const item in search) {
      if (search[item] !== null) {
        inArr.push(search[item])
      }
    }
    // await Orders.getOrderCases('article_type', [0, 1000], {}, inArr).then(result => {
    //   const inStr = {
    //     id: []
    //   }
    //   for (const item of result) {
    //     inStr.id.push(item.cases_id)
    //   }

    //   return Promise.all(
    //     [
    //       Orders.getOrderCases('article_cases', limit, params, inStr),
    //       Orders.getOrderCasesTotal('article_cases', params, inStr)
    //     ]).then(result => {
    //     ctx.body = {
    //       status: 200,
    //       statusText: 'ok',
    //       data: result[0],
    //       num: result[1][0].count
    //     }
    //   })
    // })
    if (inArr.length > 0) {
      const arr = []
      for (const item of inArr) {
        const a = []
        await Orders.getArticleType(item).then(result => {
          for (const field of result) {
            a.push(field.cases_id)
            if (field.type_field_name === '价格') {
              orderBy = 'general_price'
            } else if (field.type_field_name === '权重') {
              orderBy = 'baidu'
            }
          }
          arr.push(a)
        })
      }

      const inStr = {
        id: []
      }
      const array = mixed(arr)
      console.log(array.length)
      if (array.length > 0) {
        for (const item of array) {
          inStr.id.push(item)
        }
        return Promise.all(
          [
            Orders.getOrderCases('article_cases', limit, params, inStr, orderBy),
            Orders.getOrderCasesTotal('article_cases', params, inStr, orderBy)
          ]).then(result => {
          ctx.body = {
            status: 200,
            statusText: 'ok',
            data: result[0],
            num: result[1][0].count
          }
        })
      } else {
        ctx.body = {
          status: 200,
          statusText: 'ok',
          data: [],
          num: 0
        }
      }
    } else {
      return Promise.all(
        [
          DBHelper.getList('article_cases', limit, { dept }),
          DBHelper.getListTotal('article_cases', { dept })
        ]).then(result => {
        ctx.body = {
          status: 200,
          statusText: 'ok',
          data: result[0],
          num: result[1][0].count
        }
      })
    }
  }
}
// 处理数组，保留重复，去重
function unique(arr) {
  const Arr = filterUnique(arr)
  const res = new Map()
  return (Arr.filter((a) => !res.has(a) && res.set(a, 1)))
}
// 数组保留重复
const filterUnique = arr => arr.filter(i => arr.indexOf(i) !== arr.lastIndexOf(i))

// 二维数组取交集
function mixed(arr) {
  if (arr.length > 0) {
    var jiaoji = arr[0]
    for (const item in arr) {
      jiaoji = jiaoji.filter(function(n) {
        return arr[item].indexOf(n) !== -1
      })
    }
    return jiaoji
  } else {
    return []
  }
}

module.exports = new OrderController()
