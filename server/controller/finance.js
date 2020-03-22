const uuidv1 = require('uuid/v1')
const moment = require('moment')
const DBHelper = require('../helper/DBHelper.js')
const Helper = require('../helper/index.js')
const Finance = require('../model/finance.js')

const config = require('../config/config')
const AliPayHelper = require('../helper/AliPayHelper.js')

class FinanceController {
  // 创建充值订单，并返回前端链接
  async orderPay(ctx) {
    const { type, money } = ctx.request.body

    if (money < 0.01 && money > 100000000) {
      ctx.body = {
        status: -1,
        statusText: 'fail',
        msg: '金额无效'
      }
    }

    if (ctx.session.role === 'customer') {
      if (type === 'alipay') {
        const outTradeNo = uuidv1()
        const total_amount = money
        const subject = 'TM媒介' + money
        const body = 'TM媒介充值' + money

        const AliPay = new AliPayHelper('mtmeijie@163.com')
        const payUrl = await AliPay.buildPayUrl(outTradeNo, total_amount, subject, body)
        DBHelper.addRow('trade_pay', {
          id: outTradeNo,
          format_id: outTradeNo,
          customer_id: ctx.session.userId,
          customer_name: ctx.session.userName,
          keywords: type,
          subject,
          body,
          total_amount,
          app_id: config.alipay.APP_ID,
          method: 'alipay.trade.page.pay',
          created_by: ctx.session.userName,
          created_time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        ctx.body = {
          status: 200,
          statusText: 'ok',
          payUrl
        }
      }
    } else {
      ctx.body = {
        status: -100,
        statusText: 'fail',
        msg: '管理人员无财务体系，请使用客户账号充值'
      }
    }
  }
  async getAccountMoney(ctx) {
    const money = await Helper.getAccount(ctx.session.userId)
    ctx.body = {
      status: 200,
      statusText: 'ok',
      account: Math.floor(money * 100) / 100
    }
  }

  async getFreezeMoney(ctx) {
    const money = await Helper.getFreezeMoney(ctx.session.userId)
    ctx.body = {
      status: 200,
      statusText: 'ok',
      account: Math.floor(money * 100) / 100
    }
  }

  async getUsableMoney(ctx) {
    const money = await Helper.getUsableMoney(ctx.session.userId)
    ctx.body = {
      status: 200,
      statusText: 'ok',
      account: Math.floor(money * 100) / 100
    }
  }

  // 获取客户个人财务
  async getFinanceList(ctx) {
    const { time, page, type, customer_id } = ctx.query
    const pageNum = parseInt(page || 1, 10)
    const end = 10 // 默认页数
    const start = (pageNum - 1) * end
    const limit = [start, end]
    let timeArr = []
    if (time) {
      timeArr = time.split('|')
    }
    const typeStr = type || 'all'

    const customerID = customer_id || ctx.session.userId
    return Promise.all(
      [
        Finance.getFinanceList(customerID, typeStr, timeArr, limit),
        Finance.getFinanceListTotal(customerID, typeStr, timeArr, limit)
      ]).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result[0],
        num: result[1][0].count
      }
    })
  }

  async changeMoney(ctx) {
    const { customer_id, customer_name, type, money, real_name, alipay, mark } = ctx.request.body
    let real_money = money
    if (type === 'sub' || type === 'cash') {
      real_money = -money
    }
    const capital = {
      id: uuidv1(),
      customer_id,
      customer_name,
      type,
      money: real_money,
      created_by: ctx.session.userName,
      created_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    const withdraw = {
      id: uuidv1(),
      customer_id,
      customer_name,
      real_name,
      money,
      alipay,
      mark,
      created_by: ctx.session.userName,
      created_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    return Promise.all(
      [
        DBHelper.addRow('capital_flow', capital),
        DBHelper.addRow('withdraw', withdraw)
      ]).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '操作成功'
      }
    })
  }

  async getWithdrawList(ctx) {
    const pageNum = parseInt(ctx.query.page || 1, 10)// 页码
    const end = 10 // 默认页数
    const start = (pageNum - 1) * end
    const limit = [start, end]
    const params = {
      customer_id: ctx.session.userId
    }
    return Promise.all(
      [
        DBHelper.getList('withdraw', limit, params),
        DBHelper.getListTotal('withdraw', params)
      ]).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result[0],
        num: result[1][0].count
      }
    })
  }

  async getUsableBill(ctx) {
    const customer_id = ctx.session.userId
    return Promise.all(
      [
        DBHelper.getList('capital_flow', [0, 10000], { customer_id, type: 'add' }),
        DBHelper.getList('bill', [0, 10000], { customer_id, state: '已开票' })
      ]).then(result => {
      let subMoney = 0
      let billMoney = 0
      for (const item of result[0]) {
        subMoney += item.money
      }
      for (const item of result[1]) {
        billMoney += item.invoice_money
      }
      ctx.body = {
        status: 200,
        statusText: 'ok',
        usableBill: Math.floor((Math.abs(subMoney) - Math.abs(billMoney)) * 100) / 100
      }
    })
  }

  async submitBill(ctx) {
    const {
      address, detailed_invoice, invoice_money, name, phone, tax_registry_number, title, type
    } = ctx.request.body
    const params = {
      id: uuidv1(),
      customer_id: ctx.session.userId,
      customer_name: ctx.session.name,
      address, detailed_invoice, invoice_money, name, phone, tax_registry_number, title, type,
      created_by: ctx.session.userName,
      created_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    return DBHelper.addRow('bill', params).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '申请发票成功'
      }
    })
  }

  async getInvoiceList(ctx) {
    const pageNum = parseInt(ctx.query.page || 1, 10)// 页码
    const end = 10 // 默认页数
    const start = (pageNum - 1) * end
    const limit = [start, end]
    return Promise.all(
      [
        DBHelper.getList('bill', limit),
        DBHelper.getListTotal('bill')
      ]).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result[0],
        num: result[1][0].count
      }
    })
  }

  async updateBill(ctx) {
    const {
      id, state, real_money, mark
    } = ctx.request.body
    const params = {
      state, real_money, mark,
      updated_by: ctx.session.userName,
      updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    return DBHelper.updateRow('bill', id, params).then(() => {
      ctx.body = {
        status: 200,
        statusText: 'ok'
      }
    })
  }

  async getfinances(ctx) {
    const { customerName, recommender, daterange, page } = ctx.query
    const pageNum = parseInt(page || 1, 10)
    const end = 10 // 默认页数
    const start = (pageNum - 1) * end
    const limit = [start, end]

    let timeArr = []
    if (daterange) {
      console.log(1)
      timeArr = daterange.split('|')
    }
    const userID = []
    if (recommender) {
      await DBHelper.getListsInLike('user', [0, 1000], {}, {}, { name: recommender }, {}).then(result => {
        for (const item of result) {
          userID.push(item.id)
        }
      })
    }
    const data = []

    return Promise.all([
      DBHelper.getListsInLike('customer', limit, {}, { recommender: userID }, { name: customerName }, {}),
      DBHelper.getListsInLikeTotal('customer', {}, { recommender: userID }, { name: customerName }, {})
    ]).then(async r => {
      const result = r[0]
      const num = r[1][0].count
      for await (const item of result) {
        await Promise.all(
          [
            DBHelper.getList('user', [0, 1], { id: item.recommender }),
            //   DBHelper.getList('capital_flow', [0, 100000], { customer_id: item.id })
            DBHelper.getListsInLike('capital_flow', [0, 100000], { customer_id: item.id }, {}, {}, { created_time: timeArr })
          ]).then(async result => {
          const res = result[1]
          let allIn = 0
          let giftAll = 0
          let allAmount = 0
          let actualConsumption = 0
          let withdrawalAmount = 0
          let balanceAmount = 0
          let giftAmount = 0
          for await (const i of res) {
            switch (i.type) {
              case 'add':
                allIn += Math.abs(i.money)
                break
              case 'gift':
                giftAll += Math.abs(i.money)
                break
              case 'cash':
                withdrawalAmount += Math.abs(i.money)
                break
              case 'sub':
                actualConsumption += Math.abs(i.money)
                break
              default:
                break
            }
          }
          allAmount = allIn + giftAll
          balanceAmount = (allIn - actualConsumption - withdrawalAmount) > 0 ? allIn - actualConsumption - withdrawalAmount : 0
          giftAmount = (allIn - actualConsumption - withdrawalAmount) > 0 ? giftAll : allAmount - actualConsumption - withdrawalAmount
          data.push({
            id: item.id,
            custName: item.name,
            allIn, giftAll, allAmount,
            actualConsumption: actualConsumption,
            withdrawalAmount: withdrawalAmount,
            balanceAmount, giftAmount,
            recommender: result[0].length > 0 ? result[0][0].name : null
          })
        })
      }
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data,
        num
      }
    })
  }

  async getPersonalFinance(ctx) {
    const { customer_id } = ctx.query
    return DBHelper.getList('capital_flow', [0, 100000], { customer_id }).then(result => {
      let allIn = 0
      let giftAll = 0
      let allAmount = 0
      let actualConsumption = 0
      let withdrawalAmount = 0
      let balanceAmount = 0
      let giftAmount = 0
      for (const i of result) {
        switch (i.type) {
          case 'add':
            allIn += Math.abs(i.money)
            break
          case 'gift':
            giftAll += Math.abs(i.money)
            break
          case 'cash':
            withdrawalAmount += Math.abs(i.money)
            break
          case 'sub':
            actualConsumption += Math.abs(i.money)
            break
          default:
            break
        }
      }
      allAmount = allIn + giftAll
      balanceAmount = (allIn - actualConsumption - withdrawalAmount) > 0 ? allIn - actualConsumption - withdrawalAmount : 0
      giftAmount = (allIn - actualConsumption - withdrawalAmount) > 0 ? giftAll : allAmount - actualConsumption - withdrawalAmount
      ctx.body = {
        status: 200,
        statusText: 'ok',
        allIn, giftAll, allAmount, actualConsumption, withdrawalAmount, balanceAmount, giftAmount
      }
    })
  }
}

module.exports = new FinanceController()
