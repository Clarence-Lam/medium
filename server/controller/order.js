const userModel = require('../model/user.js')
const DBHelper = require('../helper/DBHelper.js')
const Orders = require('../model/orders.js')
const uuidv1 = require('uuid/v1')
const moment = require('moment')
const bcrypt = require('bcrypt')
const _ = require('lodash')

class OrderController {
  async verification(ctx) {
    // 验证账户余额
  }

  async addOrder(ctx) {
    const { title, finish_time, mark, url, dept, cases, num, money, sign, type_article, work_nunber } = ctx.request.body
    const id = uuidv1()
    const params = {
      id,
      customer_id: ctx.session.userId,
      customer_name: ctx.session.userName,
      customer_level: ctx.session.level,
      title,
      url,
      finish_time,
      dept,
      mark,
      case_id_json: JSON.stringify(cases),
      num,
      money,
      state: 'start',
      created_by: ctx.session.userName,
      created_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      sign, type_article, work_nunber
    }
    return DBHelper.addRow('orders', params).then(async() => {
      if (cases) {
        await cases.forEach(item => {
          const caseParams = {
            id: uuidv1(),
            order_id: id,
            case_id: item.id,
            case_name: item.name,
            created_by: ctx.session.userName,
            created_time: moment().format('YYYY-MM-DD HH:mm:ss')
          }
          DBHelper.addRow('order_case', caseParams)
        })
      }

      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '创建订单'
      }
    })
  }
  // 确认订单时查询案例
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

    const collection = await DBHelper.getList('collection', [0, 1000], { customer_id: ctx.session.userId })

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
      if (array.length > 0) {
        for (const item of array) {
          inStr.id.push(item)
        }
        return Promise.all(
          [
            Orders.getOrderCases('article_cases', limit, params, inStr, orderBy).then(result => {
              const res = []
              for (const item in result) {
                const obj = result[item]
                obj['is_collection'] = false
                for (const val of collection) {
                  if (val.case_id === result[item].id) {
                    obj['is_collection'] = true
                  }
                }
                res.push(obj)
              }
              return res
            }),
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
          DBHelper.getList('article_cases', limit, { dept }).then(result => {
            const res = []
            for (const item in result) {
              const obj = result[item]
              obj['is_collection'] = false
              for (const val of collection) {
                if (val.case_id === result[item].id) {
                  obj['is_collection'] = true
                }
              }
              res.push(obj)
            }
            return res
          }),
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
  // 后台人员查询订单
  async getOrderTable(ctx) {
    // ctx.session.role = 'technology'
    const { request_state } = ctx.query
    const params = { state: request_state }
    const pageNum = parseInt(ctx.query.page || 1, 10)// 页码
    const end = 10 // 默认页数
    const start = (pageNum - 1) * end
    const limit = [start, end]
    console.log(params)
    const userRole = ctx.session.role
    let state = null
    if (userRole === 'admin' || userRole === 'service') {
      state = null
    } else if (userRole === 'technology') {
      state = ['plan', 'working', 'stop', 'uphold']
    } else {
      ctx.body = {
        status: 200,
        statusText: '没有权限访问',
        data: [],
        num: 0
      }
    }
    return Promise.all(
      [
        Orders.getOrderTable(params, state, limit),
        Orders.getOrderTableTotal(params, state)
      ]).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result[0],
        num: result[1][0].count
      }
    })
  }

  async getOrderDetail(ctx) {
    const id = ctx.query.id
    await DBHelper.getList('orders', [0, 1], { id }).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result[0]
      }
    })
  }

  async saveState(ctx) {
    const { id, state } = ctx.request.body
    const params = {
      state,
      updated_by: ctx.session.userName,
      updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    await DBHelper.updateRow('orders', id, params).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok'
      }
    })
  }

  async failState(ctx) {
    const { id, state, refuse_reason } = ctx.request.body
    const params = {
      state,
      updated_by: ctx.session.userName,
      updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    if (refuse_reason) {
      params['refuse_reason'] = refuse_reason
    }
    await DBHelper.updateRow('orders', id, params).then(result => {
      // TODO 恢复金额
      ctx.body = {
        status: 200,
        statusText: 'ok'
      }
    })
  }

  async finishState(ctx) {
    const { id, state } = ctx.request.body
    const params = {
      state,
      updated_by: ctx.session.userName,
      updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    await DBHelper.updateRow('orders', id, params).then(result => {
      // TODO 结算金额
      ctx.body = {
        status: 200,
        statusText: 'ok'
      }
    })
  }

  async submitOrder(ctx) {
    const { id, urlArr } = ctx.request.body
    // TODO 更改不包补状态为finish
    await DBHelper.getList('orders', [0, 10], { id }).then(async res => {
      let state = 'uphold'
      if (res.length > 0 && res[0].state === 'working') {
        if (res[0].case_id_json) {
          for (const value of JSON.parse(res[0].case_id_json)) {
            for (const type of JSON.parse(value.type_json)) {
              if (type.type_name === '包补时间') {
                if (type.name === '不包补') {
                  state = 'finish'
                }
              }
            }
          }
        }

        const params = {
          state: state,
          published_time: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        await DBHelper.updateRow('orders', id, params).then(async result => {
          if (result.changedRows === 1) {
            // TODO 结算金额
            for await (const item of urlArr) {
              const params = {
                id: uuidv1(),
                order_id: id,
                order_name: res[0].title,
                name: item.name,
                url: item.url,
                created_by: ctx.session.userName,
                created_time: moment().format('YYYY-MM-DD HH:mm:ss')
              }
              DBHelper.addRow('order_url', params)
            }
            ctx.body = {
              status: 200,
              statusText: 'ok'
            }
          }
        })
      } else {
        ctx.body = {
          status: 400,
          statusText: '查询不到订单或状态不正确'
        }
      }
    })
  }

  async getMyOrder(ctx) {
    const { search } = ctx.query
    const params = { ...search }
    const pageNum = parseInt(ctx.query.page || 1, 10)// 页码
    const end = 10 // 默认页数
    const start = (pageNum - 1) * end
    const limit = [start, end]
    console.log(ctx.session.userId)
    params['customer_id'] = ctx.session.userId
    return Promise.all(
      [
        DBHelper.getList('orders', limit, params),
        DBHelper.getListTotal('orders', params)
      ]).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result[0],
        num: result[1][0].count
      }
    })
  }

  async getUrl(ctx) {
    const { order_id } = ctx.query
    return DBHelper.getList('order_url', [0, 1000], { order_id }).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result
      }
    })
  }

  async applyUrl(ctx) {
    const { id, order_id, reason } = ctx.request.body
    const urlParams = {
      is_add: '1',
      reason,
      updated_by: ctx.session.userName,
      updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    const params = {
      is_add: '1',
      updated_by: ctx.session.userName,
      updated_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      state: 'complaining'
    }
    return Promise.all(
      [
        DBHelper.updateRow('orders', order_id, params),
        DBHelper.updateRow('order_url', id, urlParams)
      ]).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok'
      }
    })
  }

  async addUrl(ctx) {
    const { id, order_id, add_url } = ctx.request.body
    const params = {
      is_add: '0',
      added: '1',
      add_url,
      updated_by: ctx.session.userName,
      updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    return DBHelper.updateRow('order_url', id, params).then(async result => {
      return await DBHelper.getList('order_url', [0, 1000], { id: order_id }).then(async res => {
        let isAdd = true
        for (const item of res) {
          if (item.is_add === '1') {
            isAdd = false
          }
        }
        if (isAdd) {
          const orderParams = {
            is_add: '0',
            updated_by: ctx.session.userName,
            updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
          }
          return await DBHelper.updateRow('orders', order_id, orderParams).then(res1 => {
            ctx.body = {
              status: 200,
              statusText: 'ok'
            }
          })
        }
      })
    })
  }

  async toggleCollection(ctx) {
    const { case_id, collection } = ctx.request.body
    if (collection) {
      const params = {
        id: uuidv1(),
        customer_id: ctx.session.userId,
        case_id,
        created_by: ctx.session.userName,
        created_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      return DBHelper.addRow('collection', params).then(() => {
        ctx.body = {
          status: 200,
          statusText: 'ok',
          mag: '收藏成功'
        }
      })
    } else {
      return Orders.delCollectionByCaseId(case_id, ctx.session.userId).then(() => {
        ctx.body = {
          status: 200,
          statusText: 'ok',
          mag: '取消收藏'
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
