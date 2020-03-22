const userModel = require('../model/user.js')
const DBHelper = require('../helper/DBHelper.js')
const bcrypt = require('bcrypt')
const moment = require('moment')

class LoginController {
  async login(ctx) {
    const { phone, password } = ctx.request.body
    await userModel.loginForCust([phone]).then(async result => {
      if (result.length > 0) {
        verifyPass(ctx, phone, result[0], password)
      } else {
        // 20191210增加用户名登录
        await DBHelper.getList('customer', [0, 100], { name: phone }).then(async result => {
          let status = false
          for await (const res of result) {
            status = verifyPass(ctx, phone, res, password)
            if (status) {
              break
            }
          }
          if (!status) {
            ctx.body = {
              status: 400,
              statusText: '帐号或密码错误',
              currentAuthority: 'guest'
            }
          }
        })
      }
    })
  }

  async adminLogin(ctx) {
    const { phone, password } = ctx.request.body
    await userModel.login([phone]).then(async result => {
      if (result.length !== 0) {
        result.map((item) => {
          const hash = item.password
          if (bcrypt.compareSync(password, hash)) {
            const id = item.id
            ctx.session.isLogin = true
            ctx.session.userName = item.name
            ctx.session.userId = item.id
            ctx.session.token = item.id
            ctx.session.role = item.role
            ctx.session.lastTime = item.last_time
            ctx.session.firstTime = item.first_time
            DBHelper.updateRow('user', id, { last_time: moment().format('YYYY-MM-DD HH:mm:ss') })

            ctx.body = {
              status: 200,
              statusText: 'ok',
              currentAuthority: 'user',
              user: item.username,
              name: item.name,
              role: item.role,
              userId: item.id,
              token: item.id
            }
          } else {
            ctx.body = {
              status: 400,
              statusText: '帐号或密码错误',
              currentAuthority: 'guest'
            }
          }
          return item
        })
      } else {
        ctx.body = {
          status: 400,
          statusText: '帐号或密码错误',
          currentAuthority: 'guest'
        }
      }
    })
  }

  async phoneLogin(ctx) {
    const { phone, smsCaptcha } = ctx.request.body
    const timestamp = new Date().getTime()
    if (ctx.session.smsCaptchaTime && timestamp - ctx.session.smsCaptchaTime < 1000 * 60 * 3) {
      if (smsCaptcha === ctx.session.smsCaptcha) {
        await userModel.loginForCust([phone]).then(result => {
          if (result.length > 0) {
            const item = result[0]
            const status = item.status
            if (status === '1') {
              const id = item.id
              ctx.session.isLogin = true
              ctx.session.userName = item.name
              ctx.session.userId = item.id
              ctx.session.token = item.id
              ctx.session.level = item.level
              ctx.session.role = 'customer'
              ctx.session.lastTime = item.last_time
              ctx.session.firstTime = item.first_time
              DBHelper.updateRow('customer', id, { last_time: moment().format('YYYY-MM-DD HH:mm:ss') })
              ctx.body = {
                status: 200,
                statusText: 'ok',
                currentAuthority: 'customer',
                user: item.account,
                name: item.name,
                level: item.level,
                userId: item.id,
                token: item.id,
                role: 'customer'
              }
            } else {
              ctx.body = {
                status: 400,
                statusText: '该账号已被禁用，如有疑问，请咨询管理员',
                currentAuthority: 'guest'
              }
            }
          } else {
            // 可以增加管理人员登录
            ctx.body = {
              status: 400,
              statusText: '改号码暂未注册，请前往注册使用。',
              currentAuthority: 'guest'
            }
          }
        })
      } else {
        ctx.body = {
          status: 201,
          statusText: '短信验证码输入错误，请重新输入',
          msg: '短信验证码输入错误，请重新输入'
        }
      }
    } else {
      ctx.body = {
        status: 504,
        statusText: '短信验证码超过有效期，请重新获取',
        msg: '短信验证码超过有效期，请重新获取'
      }
    }
  }

  async info(ctx) {
    const token = ctx.query.token
    if (token === ctx.session.token) {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        roles: [ctx.session.role],
        level: ctx.session.level,
        // introduction: 'I am an editor',
        // avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: ctx.session.userName,
        lastTime: ctx.session.lastTime,
        firstTime: ctx.session.firstTime

      }
    } else {
      ctx.body = {
        status: 50008,
        statusText: 'token失效'
      }
    }
  }
  async test(ctx) {
    ctx.body = {
      status: 200,
      statusText: 'test'
    }
  }

  async logout(ctx) {
    ctx.session.isLogin = false
    ctx.session.userName = ''
    ctx.session.userId = ''
    ctx.session.name = ''
    ctx.session.role = ''
    ctx.session.level = ''
    ctx.body = {
      status: 200,
      statusText: 'ok',
      currentAuthority: ''
    }
  }
}

function verifyPass(ctx, account, result, password) {
  const item = result
  const hash = item.password
  if (bcrypt.compareSync(password, hash)) {
    const status = item.status
    if (status === '1') {
      const id = item.id
      ctx.session.isLogin = true
      ctx.session.userName = item.name
      ctx.session.userId = item.id
      ctx.session.token = item.id
      ctx.session.level = item.level
      ctx.session.role = 'customer'
      ctx.session.lastTime = item.last_time
      ctx.session.firstTime = item.first_time
      DBHelper.updateRow('customer', id, { last_time: moment().format('YYYY-MM-DD HH:mm:ss') })
      ctx.body = {
        status: 200,
        statusText: 'ok',
        currentAuthority: 'customer',
        user: item.account,
        name: item.name,
        level: item.level,
        userId: item.id,
        token: item.id,
        role: 'customer'
      }
      return true
    } else {
      ctx.body = {
        status: 400,
        statusText: '该账号已被禁用，如有疑问，请咨询管理员',
        currentAuthority: 'guest'
      }
      return true
    }
  } else {
    const reg = /^1[3456789]\d{9}$/
    if (reg.test(account)) {
      ctx.body = {
        status: 400,
        statusText: '帐号或密码错误',
        currentAuthority: 'guest'
      }
    }
    return false
  }
}

module.exports = new LoginController()
