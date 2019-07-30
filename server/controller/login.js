const userModel = require('../model/user.js')
const bcrypt = require('bcrypt')

class LoginController {
  async login(ctx) {
    const { phone, password } = ctx.request.body
    await userModel.login([phone]).then(result => {
      if (result.length !== 0) {
        result.map((item) => {
          const hash = item.password
          if (bcrypt.compareSync(password, hash)) {
            ctx.session.isLogin = true
            ctx.session.userName = item.name
            ctx.session.userId = item.id
            ctx.session.token = item.id
            ctx.session.role = item.role
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
        roles: ctx.session.role,
        // introduction: 'I am an editor',
        // avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: ctx.session.name
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
    ctx.body = {
      status: 200,
      statusText: 'ok',
      currentAuthority: ''
    }
  }
}

module.exports = new LoginController()
