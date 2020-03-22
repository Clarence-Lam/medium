
const uuidv1 = require('uuid/v1')
const DBHelper = require('../helper/DBHelper.js')
const moment = require('moment')

const AliPayHelper = require('../helper/AliPayHelper.js')

class AliPayController {
  async test(ctx) {
    console.log(ctx)
    const body = { gmt_create: '2019-10-12 00:26:16',
      charset: 'utf-8',
      gmt_payment: '2019-10-12 00:26:38',
      notify_time: '2019-10-12 00:29:47',
      subject: 'tm媒介',
      sign:
     'Y5KH00/sSDuewTpmd2MC6Y/o7TpmVvSeVO668Uj1jxSVaui3YDvzmpUIiBdNtAXUaeqcgKMyf21YxLMFVEDEmw3ZPMB1IHkwQrvPfeYQRdz1qmJmxfShBfo2X6FkfPqTglMsCBCoxjfpCAOuHEnYrmTPFbfECXzQ2k+QUL99MKfUBgznbFwjRHiNDplCTZCCJTnCVANUTUp0C+5eQ9EUe0XJZA7pyjYL1Vd3cyh8CX+KJhNIYR1FNVzEx4OoSIJJMNrE2cqkbJ1ZW0/j5L/4LygxSKtW6f1Cy7c/2PUPViry2TR6uQTwQ2qtNMcKHnAEMCiqZzv+zK+gT2mzCto9IA==',
      buyer_id: '2088012862765052',
      body: 'tm媒介充值100',
      invoice_amount: '0.01',
      version: '1.0',
      notify_id: '2019101200222002638065051402101720',
      fund_bill_list: '[{"amount":"0.01","fundChannel":"ALIPAYACCOUNT"}]',
      notify_type: 'trade_status_sync',
      out_trade_no: 'd8cb0ae0-ec43-11e9-a52a-51ce934d5cb2',
      total_amount: '0.01',
      trade_status: 'TRADE_SUCCESS',
      trade_no: '2019101222001465051400898569',
      auth_app_id: '2019092767885318',
      receipt_amount: '0.01',
      point_amount: '0.00',
      buyer_pay_amount: '0.01',
      app_id: '2019092767885318',
      sign_type: 'RSA2',
      seller_id: '2088802753055715' }

    const AliPay = new AliPayHelper('mtmeijie@163.com')
    console.log(AliPay.verifySign(body))

    console.log(AliPay.checkNotifySign(body))
    ctx.body = {
      asd: 11
    }
  }
  async gateway(ctx) {
    const requestBody = ctx.request.body
    const AliPay = new AliPayHelper('mtmeijie@163.com')
    if (AliPay.checkNotifySign(requestBody)) {
      const {
        gmt_payment, // 支付时间
        notify_time, // 异步结果通知时间
        subject, // 名称
        buyer_id, // 买家支付宝id
        body, // 商品描述
        out_trade_no, // 订单id
        total_amount, // 金额
        trade_status, // 交易状态，交易关闭：TRADE_CLOSED；交易完结：TRADE_FINISHED；支付成功：TRADE_SUCCESS；交易创建：WAIT_BUYER_PAY
        trade_no, // 支付宝交易号
        receipt_amount, // 商家实收金额（单位元，保留两位小数）
        buyer_pay_amount, // 买家实付金额（单位元，保留两位小数）
        app_id,
        seller_id// 买家id
      } = ctx.request.body
      const params = {
        id: uuidv1(),
        keywords: 'alipay',
        gmt_payment, notify_time, subject, buyer_id, body, out_trade_no, total_amount, trade_status,
        trade_no, receipt_amount, buyer_pay_amount, app_id, seller_id, created_by: ctx.session.userName,
        created_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      DBHelper.addRow('gateway_flow', params)
      return DBHelper.getList('trade_pay', [0, 1], { id: out_trade_no }).then(result => {
        if (result.length > 0) {
          let state = 'waiting'
          if (trade_status === 'TRADE_FINISHED') { // 交易状态TRADE_FINISHED的通知触发条件是商户签约的产品不支持退款功能的前提下，买家付款成功；或者，商户签约的产品支持退款功能的前提下，交易已经成功并且已经超过可退款期限。
            state = 'succuess'
          } else if (trade_status === 'TRADE_SUCCESS') { // 状态TRADE_SUCCESS的通知触发条件是商户签约的产品支持退款功能的前提下，买家付款成功
            state = 'succuess'
          } else if (trade_status === 'WAIT_BUYER_PAY') {
            state = 'waiting'
          } else if (trade_status === 'TRADE_CLOSED') {
            state = 'close'
          }

          const updateParams = {
            state,
            updated_by: '支付宝回调',
            updated_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            gmt_payment, notify_time, buyer_id, trade_status, trade_no, receipt_amount, buyer_pay_amount, seller_id
          }
          DBHelper.updateRow('trade_pay', out_trade_no, updateParams)

          if (state === 'succuess') {
            return DBHelper.getList('capital_flow', [0, 10], { order_id: out_trade_no }).then(res => {
              if (res.length === 0) {
                const capitalParams = {
                  id: uuidv1(),
                  customer_id: result[0].customer_id,
                  customer_name: result[0].customer_name,
                  type: 'add',
                  order_id: out_trade_no,
                  order_name: subject,
                  money: total_amount,
                  created_by: '支付宝充值',
                  created_time: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                DBHelper.addRow('capital_flow', capitalParams)
                ctx.body = {
                  status: 200,
                  statusText: 'ok',
                  msg: '成功接收回调数据并充值成功'
                }
              } else {
                ctx.body = {
                  status: 200,
                  statusText: 'ok',
                  msg: '已存在充值记录'
                }
              }
            })
          }
          ctx.body = {
            status: 200,
            statusText: 'ok',
            msg: '成功接收回调数据'
          }
        } else {
          ctx.body = {
            status: -1,
            statusText: 'fail',
            msg: '无法查询到充值订单'
          }
        }
      })
    }
  }
  async verifySign(ctx) {
    const query = ctx.request.body.query
    const AliPay = new AliPayHelper('mtmeijie@163.com')
    if (AliPay.verifySign(query)) {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '验签成功'
      }
    } else {
      ctx.body = {
        status: -1,
        statusText: 'fail',
        msg: '验签失败，请求非法'
      }
    }
  }
}
module.exports = new AliPayController()
