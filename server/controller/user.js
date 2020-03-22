const userModel = require('../model/user.js')
const DBHelper = require('../helper/DBHelper.js')
const bcrypt = require('bcrypt')
const moment = require('moment')
const uuidv1 = require('uuid/v1')

const SALT_WORK_FACTOR = 10

class UserController {
  async updateInfo(ctx) {
    const { name, phone, elmail, qq } = ctx.request.body
    const id = ctx.session.userId
    return DBHelper.getList('customer', [0, 10], { phone }).then(result => {
      if ((result.length > 0 && result[0].id === id) || result.length === 0) {
        const params = {
          name, phone, elmail, qq,
          updated_by: ctx.session.userName,
          updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        return DBHelper.updateRow('customer', id, params).then(() => {
          ctx.body = {
            status: 200,
            statusText: 'ok',
            msg: '资料更新成功'
          }
          ctx.session.userName = name
        })
      } else {
        ctx.body = {
          status: 300,
          statusText: 'ok',
          msg: '手机号已存在'
        }
      }
    })
  }
  async getCustInfo(ctx) {
    const id = ctx.session.userId
    return DBHelper.getList('customer', [0, 1], { id }).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result[0]
      }
    })
  }
  async register(ctx) {
    const { name, phone, password, smsCaptcha, svgCaptcha, recommender } = ctx.request.body
    const timestamp = new Date().getTime()
    if (ctx.session.smsCaptchaTime && timestamp - ctx.session.smsCaptchaTime < 1000 * 60 * 3) {
      if (ctx.session.captchaTime && timestamp - ctx.session.captchaTime < 1000 * 60 * 5) {
        if (smsCaptcha === ctx.session.smsCaptcha) {
          if (svgCaptcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {
            return DBHelper.getList('customer', [0, 1], { phone }).then(async result => {
              if (result.length === 0) {
                let recommenderID = null
                if (recommender) {
                  const recommenderRow = await userModel.getRecommender(recommender)
                  recommenderID = recommenderRow[0].id
                }
                const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
                const hash = bcrypt.hashSync(password, salt)
                const params = {
                  id: uuidv1(),
                  name,
                  account: name,
                  phone,
                  password: hash,
                  recommender: recommenderID,
                  created_by: ctx.session.userName,
                  created_time: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                return DBHelper.addRow('customer', params).then(res => {
                  ctx.body = {
                    status: 200,
                    statusText: 'ok',
                    msg: '注册成功，请登录'
                  }
                })
              } else {
                ctx.body = {
                  status: 201,
                  statusText: 'fail',
                  msg: '手机号码已存在，请尝试登录。'
                }
              }
            })
          } else {
            ctx.body = {
              status: 201,
              statusText: 'fail',
              msg: '验证码输入错误，请重新输入'
            }
          }
        } else {
          ctx.body = {
            status: 201,
            statusText: 'fail',
            msg: '短信验证码输入错误，请重新输入'
          }
        }
      } else {
        ctx.body = {
          status: 504,
          statusText: 'fail',
          msg: '图形短信验证码超过有效期，请重新获取'
        }
      }
    } else {
      ctx.body = {
        status: 504,
        statusText: 'fail',
        msg: '短信验证码超过有效期，请重新获取'
      }
    }
    // console.log(name)
    // console.log(phone)
    // console.log(password)
    // console.log(smsCaptcha)
    // console.log(svgCaptcha)
    // console.log(recommender)
    // console.log(ctx.session)
    // console.log(ctx.session.smsCaptcha)
    // console.log(ctx.session.smsCaptchaTime)
    // console.log(ctx.session.captcha)
    // console.log(ctx.session.captchaTime)
  }

  async getMyself(ctx) {
    const customer_id = ctx.session.userId
    return DBHelper.getList('customer', [0, 1], { id: customer_id }).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result[0]
      }
    })
  }

  async updateMyself(ctx) {
    const { name, channel, qq, wechat, company } = ctx.request.body
    const customer_id = ctx.session.userId
    const params = {
      name, channel, qq, wechat, company,
      updated_by: ctx.session.userName,
      updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    return DBHelper.updateRow('customer', customer_id, params).then(result => {
      ctx.session.userName = name
      ctx.body = {
        status: 200,
        statusText: 'ok'
      }
    })
  }

  async updatePhone(ctx) {
    const { phone, smsCaptcha } = ctx.request.body

    const timestamp = new Date().getTime()
    if (ctx.session.smsCaptchaTime && timestamp - ctx.session.smsCaptchaTime < 1000 * 60 * 3) {
      if (smsCaptcha === ctx.session.smsCaptcha) {
        return DBHelper.getList('customer', [0, 1], { phone }).then(async result => {
          if (result.length === 0) {
            const params = {
              phone,
              updated_by: ctx.session.userName,
              updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            return DBHelper.updateRow('customer', ctx.session.userId, params).then(result => {
              ctx.body = {
                status: 200,
                statusText: 'ok'
              }
            })
          } else {
            ctx.body = {
              status: 201,
              statusText: 'fail',
              msg: '手机号码已存在，请更换号码。'
            }
          }
        })
      } else {
        ctx.body = {
          status: 201,
          statusText: 'fail',
          msg: '短信验证码输入错误，请重新输入'
        }
      }
    } else {
      ctx.body = {
        status: 504,
        statusText: 'fail',
        msg: '短信验证码超过有效期，请重新获取'
      }
    }
  }

  async resetting(ctx) {
    const { phone, password, smsCaptcha, svgCaptcha } = ctx.request.body
    const timestamp = new Date().getTime()
    if (ctx.session.smsCaptchaTime && timestamp - ctx.session.smsCaptchaTime < 1000 * 60 * 3) {
      if (ctx.session.captchaTime && timestamp - ctx.session.captchaTime < 1000 * 60 * 5) {
        if (smsCaptcha === ctx.session.smsCaptcha) {
          if (svgCaptcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {
            return DBHelper.getList('customer', [0, 1], { phone }).then(async result => {
              if (result.length !== 0) {
                const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
                const hash = bcrypt.hashSync(password, salt)
                return DBHelper.updateRow('customer', result[0].id, { password: hash }).then(res => {
                  ctx.body = {
                    status: 200,
                    statusText: 'ok',
                    msg: '密码重置成功，请前往登录'
                  }
                })
              } else {
                ctx.body = {
                  status: 201,
                  statusText: 'fail',
                  msg: '该账号未注册或已禁用，请前往注册或联系客服。'
                }
              }
            })
          } else {
            ctx.body = {
              status: 201,
              statusText: 'fail',
              msg: '验证码输入错误，请重新输入'
            }
          }
        } else {
          ctx.body = {
            status: 201,
            statusText: 'fail',
            msg: '短信验证码输入错误，请重新输入'
          }
        }
      } else {
        ctx.body = {
          status: 504,
          statusText: 'fail',
          msg: '图形短信验证码超过有效期，请重新获取'
        }
      }
    } else {
      ctx.body = {
        status: 504,
        statusText: 'fail',
        msg: '短信验证码超过有效期，请重新获取'
      }
    }
  }
}

module.exports = new UserController()
