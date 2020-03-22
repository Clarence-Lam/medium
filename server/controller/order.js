// const userModel = require('../model/user.js')
const DBHelper = require('../helper/DBHelper.js')
const Helper = require('../helper/index.js')
const Orders = require('../model/orders.js')
const uuidv1 = require('uuid/v1')
const moment = require('moment')
// const bcrypt = require('bcrypt')
const _ = require('lodash')
var fs = require('fs')
const path = require('path')

class OrderController {
  async addOrder(ctx) {
    const { form, togetherForm } = ctx.request.body
    let money = form.money
    if (togetherForm && Object.keys(togetherForm).length > 0) {
      money += togetherForm.money
    }

    const usableMoney = await Helper.getUsableMoney(ctx.session.userId)
    if (usableMoney < money) {
      ctx.body = {
        status: 400,
        statusText: 'fail',
        msg: '金额不足，请前往充值'
      }
      return
    }
    return createOrder(form, ctx).then(res => {
      if (res && togetherForm && Object.keys(togetherForm).length > 0) {
        createOrder(togetherForm, ctx)
      }
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '创建订单'
      }
      return
    }).catch(() => {
      ctx.body = {
        status: 500,
        statusText: 'fail',
        msg: '创建订单失败，请重试'
      }
      return
    })
  }
  // 确认订单时查询案例
  async getCommitTable(ctx) {
    let onlyCollection = false

    const { dept, search, fuzzySearch } = ctx.request.body
    const pageNum = parseInt(ctx.request.body.page || 1, 10)
    const end = 10 // 默认页数
    const start = (pageNum - 1) * end
    let limit = [start, end]
    const inArr = []
    let orderBy = ''
    const params = {
      dept,
      status: 1
    }

    for (const item in search) {
      if (search[item] !== null) {
        // inArr.push(search[item])
        console.log(search[item])
        await DBHelper.getList('types_field', [0, 1], { id: search[item] }).then(result => {
          const res = result[0]
          //   console.log(res)
          if (res && res.name === '收藏') {
            onlyCollection = true
          } else {
            inArr.push(search[item])
          }
        })
      }
    }

    const originalLimit = limit
    if (onlyCollection) {
      limit = [0, 1000]
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
            Orders.getOrderCases('article_cases', limit, params, inStr, orderBy, fuzzySearch).then(result => {
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
            Orders.getOrderCasesTotal('article_cases', params, inStr, orderBy, fuzzySearch)
          ]).then(result => {
          // 特殊处理收藏
          if (onlyCollection) {
            const collArr = []
            for (const item of result[0]) {
              if (item.is_collection) {
                collArr.push(item)
              }
            }
            ctx.body = {
              status: 200,
              statusText: 'ok',
              data: _.slice(collArr, originalLimit[0], originalLimit[0] + originalLimit[1]),
              num: collArr.length
            }
          } else {
            ctx.body = {
              status: 200,
              statusText: 'ok',
              data: result[0],
              num: result[1][0].count
            }
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
          Orders.getOrderCases('article_cases', limit, params, [], '', fuzzySearch).then(result => {
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
          Orders.getOrderCasesTotal('article_cases', params, [], '', fuzzySearch)
        ]).then(result => {
        if (onlyCollection) {
          const collArr = []
          for (const item of result[0]) {
            if (item.is_collection) {
              collArr.push(item)
            }
          }
          ctx.body = {
            status: 200,
            statusText: 'ok',
            data: _.slice(collArr, originalLimit[0], originalLimit[0] + originalLimit[1]),
            num: collArr.length
          }
        } else {
          ctx.body = {
            status: 200,
            statusText: 'ok',
            data: result[0],
            num: result[1][0].count
          }
        }
      })
    }
  }
  // 后台人员查询订单
  async getOrderTable(ctx) {
    // ctx.session.role = 'technology'
    const { request_state, customer_id, created_time, published_time, custName, orderId } = ctx.query
    const params = { state: request_state }
    const pageNum = parseInt(ctx.query.page || 1, 10)// 页码
    const end = 10 // 默认页数
    const start = (pageNum - 1) * end
    const limit = [start, end]
    const userRole = ctx.session.role
    if (customer_id) {
      params['customer_id'] = customer_id
    }
    let created_timeArr = null
    if (created_time) {
      created_timeArr = created_time.split('|')
    }
    let published_timeArr = null
    if (published_time) {
      published_timeArr = published_time.split('|')
    }
    let state = null
    if (userRole === 'admin' || userRole === 'service') {
      state = null
    } else if (userRole === 'technology') {
      state = ['plan', 'working', 'stop', 'uphold', 'complaining', 'finish', 'discard']
    } else {
      ctx.body = {
        status: 200,
        statusText: '没有权限访问',
        data: [],
        num: 0
      }
    }
    const likeParams = {}
    if (custName) {
      likeParams['customer_name'] = custName
    }
    let id = null
    if (orderId && orderId.length === 32) {
      id = `${orderId.slice(0, 8)}-${orderId.slice(8, 12)}-${orderId.slice(12, 16)}-${orderId.slice(16, 20)}-${orderId.slice(20)}`
      params['id'] = id
    }
    return Promise.all(
      [
        Orders.getOrderTable(params, state, limit, { created_time: created_timeArr, published_time: published_timeArr }, likeParams),
        Orders.getOrderTableTotal(params, state, { created_time: created_timeArr, published_time: published_timeArr }, likeParams)
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
    const { id, state, mark } = ctx.request.body
    const params = {
      state,
      mark,
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
    const { id, state, refuse_reason, mark } = ctx.request.body
    const params = {
      state,
      mark,
      updated_by: ctx.session.userName,
      updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    if (refuse_reason) {
      params['refuse_reason'] = refuse_reason
    }
    await DBHelper.updateRow('orders', id, params).then(result => {
      DBHelper.getList('freeze_flow', [0, 1], { order_id: id }).then(res => {
        if (res.length === 1 && res[0].type === 'freeze') {
          DBHelper.addRow('freeze_flow', {
            id: uuidv1(),
            customer_id: res[0].customer_id,
            customer_name: res[0].customer_name,
            type: 'unfreeze',
            order_id: id,
            order_name: res[0].order_name,
            money: res[0].money,
            created_by: ctx.session.userName,
            created_time: moment().format('YYYY-MM-DD HH:mm:ss')
          })
        }
      })
      ctx.body = {
        status: 200,
        statusText: 'ok'
      }
    })
  }

  async finishState(ctx) {
    const { id, state, mark } = ctx.request.body
    const params = {
      state,
      mark,
      updated_by: ctx.session.userName,
      updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    await DBHelper.updateRow('orders', id, params).then(result => {
      DBHelper.getList('freeze_flow', [0, 1], { order_id: id }).then(res => {
        if (res.length === 1 && res[0].type === 'freeze') {
          DBHelper.addRow('freeze_flow', {
            id: uuidv1(),
            customer_id: res[0].customer_id,
            customer_name: res[0].customer_name,
            type: 'unfreeze',
            order_id: id,
            order_name: res[0].order_name,
            money: res[0].money,
            created_by: ctx.session.userName,
            created_time: moment().format('YYYY-MM-DD HH:mm:ss')
          })
          DBHelper.addRow('capital_flow', {
            id: uuidv1(),
            customer_id: res[0].customer_id,
            customer_name: res[0].customer_name,
            type: 'sub',
            order_id: id,
            order_name: res[0].order_name,
            money: -res[0].money,
            created_by: ctx.session.userName,
            created_time: moment().format('YYYY-MM-DD HH:mm:ss')
          })
        }
      })
      ctx.body = {
        status: 200,
        statusText: 'ok'
      }
    })
  }

  async submitOrder(ctx) {
    const { id, urlArr, mark } = ctx.request.body
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
        } else if (res[0].sign === 'write') {
          state = 'finish'
        }

        const params = {
          state: state,
          mark,
          published_time: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        await DBHelper.updateRow('orders', id, params).then(async result => {
          if (result.changedRows === 1) {
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
            if (state === 'finish') {
              DBHelper.getList('freeze_flow', [0, 1], { order_id: id }).then(res => {
                if (res.length === 1 && res[0].type === 'freeze') {
                  DBHelper.addRow('freeze_flow', {
                    id: uuidv1(),
                    customer_id: res[0].customer_id,
                    customer_name: res[0].customer_name,
                    type: 'unfreeze',
                    order_id: id,
                    order_name: res[0].order_name,
                    money: res[0].money,
                    created_by: ctx.session.userName,
                    created_time: moment().format('YYYY-MM-DD HH:mm:ss')
                  })
                  DBHelper.addRow('capital_flow', {
                    id: uuidv1(),
                    customer_id: res[0].customer_id,
                    customer_name: res[0].customer_name,
                    type: 'sub',
                    order_id: id,
                    order_name: res[0].order_name,
                    money: -res[0].money,
                    created_by: ctx.session.userName,
                    created_time: moment().format('YYYY-MM-DD HH:mm:ss')
                  })
                }
              })
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

  async submitOrderRar(ctx) {
    const { id, mark, fileID, fileName } = ctx.request.body
    await DBHelper.getList('orders', [0, 10], { id }).then(async res => {
      console.log(1)
      if (res.length > 0 && res[0].state === 'working') {
        await fs.mkdir(path.join(__dirname, `../../upload/${id}`), err => {
          console.log(2)

          if (err) {
            ctx.body = {
              status: 400,
              statusText: '上传失败，请稍后再试。'
            }
          }
          const suffix = getSuffixName(fileName)
          fs.renameSync(path.join(__dirname, `../../upload/temp/${fileID}.${suffix}`), path.join(__dirname, `../../upload/${id}/${fileName}`))
          console.log(3)
        })
        const params = {
          state: 'uphold',
          mark,
          published_time: moment().format('YYYY-MM-DD HH:mm:ss'),
          updated_by: ctx.session.userName,
          updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        await DBHelper.updateRow('orders', id, params).then(async result => {
          console.log(4)
          if (result.changedRows === 1) {
            const uploadParams = {
              id: uuidv1(),
              order_id: id,
              order_name: res[0].title,
              sign: 'first',
              name: fileName,
              file_url: `${id}/${fileName}`,
              created_by: ctx.session.userName,
              created_time: moment().format('YYYY-MM-DD HH:mm:ss'),
              updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            await DBHelper.addRow('order_upload', uploadParams).then(() => {
              console.log(5)

              ctx.body = {
                status: 200,
                statusText: 'ok'
              }
            })
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

  // post
  async getMyOrder(ctx) {
    const { search } = ctx.request.body
    const { state } = search
    const params = {}
    if (state) {
      params['state'] = state
    }
    const pageNum = parseInt(ctx.request.body.page || 1, 10)// 页码
    const end = 10 // 默认页数
    const start = (pageNum - 1) * end
    const limit = [start, end]
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
    return DBHelper.getList('orders', [0, 1], { id: order_id }).then(res => {
      if (res[0].sign === 'copy_write') {
        return DBHelper.getList('order_url', [0, 1000], { order_id }).then(result => {
          ctx.body = {
            status: 200,
            statusText: 'ok',
            data: result,
            sign: 'copy_write',
            order_name: res[0].title
          }
        })
      } else {
        return DBHelper.getList('order_upload', [0, 1], { order_id }).then(result => {
          ctx.body = {
            status: 200,
            statusText: 'ok',
            data: result,
            sign: 'write',
            order_name: res[0].title
          }
        })
      }
    })
  }

  async applyUrl(ctx) {
    const { id, order_id, reason, sign } = ctx.request.body
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
    const table = sign === 'copy_write' ? 'order_url' : 'order_upload'
    return Promise.all(
      [
        DBHelper.updateRow('orders', order_id, params),
        DBHelper.updateRow(table, id, urlParams)
      ]).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok'
      }
    })
  }

  async addUrl(ctx) {
    const { id, order_id, url, type, sign } = ctx.request.body
    if (sign === 'copy_write') {
      const params = {
        is_add: '0',
        added: '1',
        //   add_url,
        updated_by: ctx.session.userName,
        updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      if (type === 'change') {
        params['url'] = url
      } else {
        params['add_url'] = url
      }
      return DBHelper.updateRow('order_url', id, params).then(async result => {
        DBHelper.updateRow('orders', order_id, {
          state: 'uphold',
          updated_by: ctx.session.userName,
          updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
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
    } else if (sign === 'write') {
      const file = ctx.request.files.file
      const fileName = file.name
      if (file.path) {
        const postfix = getSuffixName(fileName)
        if (postfix === 'rar' || postfix === 'zip') {
          const reader = fs.createReadStream(file.path)
          const fileID = uuidv1()
          const prefix = type === 'change' ? '' : '补单-'
          const filePath = path.join(__dirname, `../../upload/${order_id}/`) + `${prefix}${fileName}`
          const upStream = fs.createWriteStream(filePath)
          reader.pipe(upStream)
          const changeValue = {}
          if (type === 'change') {
            changeValue['sign'] = 'change'
            changeValue['name'] = fileName
            changeValue['file_url'] = `${order_id}/${fileName}`
            changeValue['updated_by'] = ctx.session.userName
            changeValue['updated_time'] = moment().format('YYYY-MM-DD HH:mm:ss')
          } else {
            changeValue['sign'] = 'add'
            changeValue['add_name'] = fileName
            changeValue['add_file_url'] = `${order_id}/补单-${fileName}`
            changeValue['updated_by'] = ctx.session.userName
            changeValue['updated_time'] = moment().format('YYYY-MM-DD HH:mm:ss')
          }
          return DBHelper.updateByParams('order_upload', changeValue, { order_id }).then(result => {
            DBHelper.updateRow('orders', order_id, {
              state: 'uphold',
              updated_by: ctx.session.userName,
              updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
            })
            ctx.body = {
              code: 200,
              msg: '上传成功',
              data: {
                fileID,
                fileName
              }}
          })
        } else {
          ctx.body = { code: -1, msg: '请上传rar或zip格式的文件' }
        }
      }
    }
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
// 创建订单，传入form
function createOrder(form, ctx) {
  const { title, finish_time, mark, url, dept, cases, num, money, sign, type_article, work_nunber } = form
  const id = uuidv1()
  const promise = new Promise(function(resolve, reject) {
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
    DBHelper.addRow('orders', params).then(async() => {
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
      DBHelper.addRow('freeze_flow', {
        id: uuidv1(),
        customer_id: ctx.session.userId,
        customer_name: ctx.session.userName,
        type: 'freeze',
        order_id: id,
        order_name: title,
        money,
        created_by: ctx.session.userName,
        created_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }).catch(err => {
        console.log('冻结金额失败')
        reject(err)
      })
      resolve(true)
    }).catch(err => {
      console.log('创建订单失败')
      console.log(err)
      reject(err)
    })
  })
  return promise
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

// 获取文件后缀
function getSuffixName(fileName) {
  const nameList = fileName.split('.')
  return nameList[nameList.length - 1]
}

module.exports = new OrderController()
