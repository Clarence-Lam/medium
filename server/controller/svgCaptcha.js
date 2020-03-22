var svgCaptcha = require('svg-captcha')
const SMS = require('../helper/sms.js')
const DBHelper = require('../helper/DBHelper.js')
const uuidv1 = require('uuid/v1')
const moment = require('moment')
const config = require('../config/config')

class CaptchaController {
  async getSvgCaptcha(ctx) {
    const captcha = svgCaptcha.create({ color: true })
    const text = captcha.text
    ctx.session.captcha = text
    ctx.session.captchaTime = new Date().getTime()
    const svg = captcha.data
    ctx.body = {
      status: 200,
      statusText: 'ok',
      svg
    }
  }

  // 注册短信
  async getSmsCaptcha(ctx) {
    const { phone, type } = ctx.request.body
    let templateid = config.sms.templateid.register
    if (type) {
      templateid = config.sms.templateid[type]
    }
    const param = ('000000' + Math.floor(Math.random() * 999999)).slice(-6)
    ctx.session.smsCaptcha = param
    ctx.session.smsCaptchaTime = new Date().getTime()
    console.log(templateid)
    return SMS.getResult(param, phone, templateid).then(function(response) {
      if (response.data.code === '000000') {
        const params = {
          id: uuidv1(),
          phone,
          smsid: response.data.smsid,
          created_by: ctx.session.userName,
          created_time: moment().format('YYYY-MM-DD HH:mm:ss'),
          param,
          templateid
        }
        DBHelper.addRow('sms', params)
        ctx.session.smsCaptcha = param
        ctx.session.smsCaptchaTime = new Date().getTime()
        ctx.body = {
          status: 200,
          statusText: 'ok'
        }
      } else {
        ctx.body = {
          status: 400,
          statusText: 'fail',
          msg: response.data.msg
        }
      }
    }, function(err) {
      console.log(err)
      ctx.body = {
        status: 400,
        statusText: 'fail',
        msg: '发送失败'
      }
    })
  }
}
module.exports = new CaptchaController()
