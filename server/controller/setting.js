const userModel = require('../model/user.js')
const DBHelper = require('../helper/DBHelper.js')
const uuidv1 = require('uuid/v1')
const moment = require('moment')
const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10
const roles = {
  '管理员': 'admin',
  '技术': 'technology',
  '客服': 'service'
}
const depts = {
  '管理员': '管理',
  '技术': '技术部',
  '客服': '客服部'
}

class SettingController {
  async userlist(ctx) {
    const pageNum = parseInt(ctx.query.page || 1, 10)// 页码
    const end = 10 // 默认页数
    const start = (pageNum - 1) * end
    const limit = [start, end]

    return Promise.all(
      [
        DBHelper.getList('user', limit),
        DBHelper.getListTotal('user')
      ]).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result[0],
        total: result[1][0].count
      }
    })
  }

  async createUser(ctx) {
    const user = new SettingController()

    const { name, phone, password, position } = ctx.request.body
    if (phone && await user.hasUser(phone)) {
      const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
      const hash = bcrypt.hashSync(password, salt)
      const created_time = moment().format('YYYY-MM-DD HH:mm:ss')

      const role = roles[position]
      const dept = depts[position]

      const params = {
        id: uuidv1(),
        name,
        phone,
        password: hash,
        role,
        dept,
        position,
        created_by: ctx.session.userName,
        created_time
      }
      await userModel.register(params).then(result => {
        console.log(result)
      })
      ctx.body = {
        status: 200,
        statusText: 'ok',
        currentAuthority: role
      }
    } else {
      if (!phone) {
        ctx.body = {
          status: 201,
          statusText: 'ok',
          msg: '请完善信息'
        }
      } else {
        ctx.body = {
          status: 202,
          statusText: 'ok',
          msg: '手机号码已存在'
        }
      }
    }
  }

  async updateUser(ctx) {
    const { id, name, phone, password, position } = ctx.request.body
    const result = await userModel.hasRepUser(id, phone).then(result => {
      return result
    })
    if (result.length === 0) {
      const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
      const hash = bcrypt.hashSync(password, salt)
      const params = {
        name,
        phone,
        position,
        role: roles[position],
        dept: depts[position],
        password: hash,
        updated_by: ctx.session.userName,
        updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      await DBHelper.updateRow('user', id, params).then(result => {
        ctx.body = {
          status: 200,
          statusText: 'ok',
          msg: '更新成功'
        }
      })
    } else {
      ctx.body = {
        status: 201,
        statusText: 'ok',
        msg: '手机号码已存在'
      }
    }
  }

  async delUser(ctx) {
    await DBHelper.delRow('user', ctx.params.id).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '删除用户成功'
      }
    })
  }

  async hasUser(phone) {
    return await userModel.hasUser(phone).then(result => {
      if (result.length === 0) {
        return true
      } else {
        return false
      }
    })
  }

  async getTypesNameList(ctx) {
    const dept = ctx.query.dept
    const params = {
      dept
    }
    await DBHelper.getList('types', [0, 100], params).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result
      }
    })
  }

  async getTypesContent(ctx) {
    const id = ctx.query.id
    await DBHelper.getList('types_field', [0, 100], { type: id }).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result
      }
    })
  }

  async delTag(ctx) {
    await DBHelper.delRow('types_field', ctx.params.id).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '删除标签成功'
      }
    })
  }

  async addTypesContent(ctx) {
    const { id, name, type_name, dept } = ctx.request.body
    const params = {
      id: uuidv1(),
      type: id,
      type_name,
      name,
      dept,
      created_by: ctx.session.userName,
      created_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    await DBHelper.addRow('types_field', params).then(() => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '成功添加标签'
      }
    })
  }

  async getNothing(ctx) {
    const { dept } = ctx.query

    return Promise.all(
      [
        DBHelper.getList('no_types_field', [0, 100], { dept, sign: 'num' }),
        DBHelper.getList('no_types_field', [0, 100], { dept, sign: 'genre' })
      ]).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        num: result[0],
        genre: result[1]
      }
    })
  }

  async addNothing(ctx) {
    const { name, dept, sign, num, money } = ctx.request.body
    const params = {
      id: uuidv1(),
      name, dept, sign, num, money,
      created_by: ctx.session.userName,
      created_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    await DBHelper.addRow('no_types_field', params).then(() => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '成功添加标签'
      }
    })
  }

  async delNothing(ctx) {
    await DBHelper.delRow('no_types_field', ctx.params.id).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '删除标签成功'
      }
    })
  }

  async test(ctx) {
    ctx.body = {
      status: 200,
      statusText: 'test'
    }
  }
}

module.exports = new SettingController()
