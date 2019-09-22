const userModel = require('../model/user.js')
const DBHelper = require('../helper/DBHelper.js')
const bcrypt = require('bcrypt')
const moment = require('moment')

class LoginController {
  async login(ctx) {
    const { phone, password } = ctx.request.body
    await userModel.loginForCust([phone]).then(result => {
      if (result.length > 0) {
        const item = result[0]
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
          ctx.body = {
            status: 400,
            statusText: '帐号或密码错误',
            currentAuthority: 'guest'
          }
        }
      } else {
        ctx.body = {
          status: 400,
          statusText: '帐号或密码错误',
          currentAuthority: 'guest'
        }
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
        lastTime: ctx.session.lastTime
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

module.exports = new LoginController()
