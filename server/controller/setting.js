const userModel = require('../model/user.js')
const DBHelper = require('../helper/DBHelper.js')
const SettingModel = require('../model/setting.js')
const uuidv1 = require('uuid/v1')
const moment = require('moment')
const bcrypt = require('bcrypt')
const _ = require('lodash')

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

  async getExpectedTime(ctx) {
    const dept = ctx.query.dept
    const params = {
      dept
    }
    await DBHelper.getList('expected_time', [0, 100], params).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: _.sortBy(result, function(item) {
          return item.name
        })
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

  async addExpectedTime(ctx) {
    const { name, dept } = ctx.request.body
    const params = {
      id: uuidv1(),
      name,
      dept,
      created_by: ctx.session.userName,
      created_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    await DBHelper.addRow('expected_time', params).then(() => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '成功添加标签'
      }
    })
  }

  async delExpectedTime(ctx) {
    await DBHelper.delRow('expected_time', ctx.params.id).then(() => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '成功删除标签'
      }
    })
  }

  async changeDefault(ctx) {
    const { id, dept } = ctx.request.body
    const values = {
      is_default: '0',
      updated_by: ctx.session.userName,
      created_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    const conditions = {
      dept
    }
    return DBHelper.updateByParams('expected_time', values, conditions).then(() => {
      return DBHelper.updateRow('expected_time', id, { is_default: '1' }).then(() => {
        ctx.body = {
          status: 200,
          statusText: 'ok',
          msg: '成功更改默认时间'
        }
      })
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

  async getSelects(ctx) {
    const { dept } = ctx.query
    return DBHelper.getList('types_field', [0, 1000], { dept }).then(result => {
    //   const data = {}
      //   for (const item of result) {
      //     console.log(item)
      //   }
      const Setting = new SettingController()
      const data = Setting.formateArrData(result, 'type_name')
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data
      }
    })
  }

  async createCase(ctx) {
    const Setting = new SettingController()
    const { name, agent_price, general_price, baidu, platform, start_num, tags, url, dept, mark, yiwenjida, fens_num } = ctx.request.body
    const caseID = uuidv1()
    const params = {
      id: caseID,
      name, agent_price, general_price, baidu, platform, start_num, type_json: JSON.stringify(tags), url,
      dept, mark,
      created_by: ctx.session.userName,
      created_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      yiwenjida, fens_num
    }
    await DBHelper.addRow('article_cases', params).then(async() => {
    //   for (const item of tags) {
      ctx.body = await Setting.createArticleType(caseID, tags, ctx, dept)
      //   }
    })
  }

  async updateCase(ctx) {
    const { id, name, agent_price, general_price, baidu, platform, start_num, tags, url, dept, mark, yiwenjida, fens_num } = ctx.request.body

    return SettingModel.delArticleType(id).then(async() => {
      const params = {
        name, agent_price, general_price, baidu, platform, start_num, type_json: JSON.stringify(tags), url,
        dept, mark,
        updated_by: ctx.session.userName,
        updated_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        yiwenjida, fens_num
      }
      return await DBHelper.updateRow('article_cases', id, params).then(async() => {
        const Setting = new SettingController()
        ctx.body = await Setting.createArticleType(id, tags, ctx, dept)
      })
    })
  }

  async getCasesList(ctx) {
    const { dept } = ctx.query
    const pageNum = parseInt(ctx.query.page || 1, 10)// 页码
    const end = 10 // 默认页数
    const start = (pageNum - 1) * end
    const limit = [start, end]
    return Promise.all(
      [
        DBHelper.getList('article_cases', limit, { dept }),
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

  async deleteCase(ctx) {
    await DBHelper.delRow('article_cases', ctx.params.id).then(() => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '成功删除产品'
      }
    })
  }

  async getArticleType(ctx) {
    const cases_id = ctx.query.cases_id
    return SettingModel.getArticleType(cases_id).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result
      }
    })
  }

  async createArticleType(caseID, tags, ctx, dept) {
    for await (const item of tags) {
      const params_type = {
        id: uuidv1(),
        cases_id: caseID,
        types_id: item.type,
        types_name: item.type_name,
        type_field_id: item.id,
        type_field_name: item.name,
        created_by: ctx.session.userName,
        created_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      DBHelper.addRow('article_type', params_type)
    }
    if (dept) {
      await DBHelper.getList('types_field', [0, 1000], { type_name: '排序', dept }).then(async result => {
        for await (const item of result) {
          const params_type = {
            id: uuidv1(),
            cases_id: caseID,
            types_id: item.type,
            types_name: item.type_name,
            type_field_id: item.id,
            type_field_name: item.name,
            created_by: ctx.session.userName,
            created_time: moment().format('YYYY-MM-DD HH:mm:ss')
          }
          DBHelper.addRow('article_type', params_type)
        }
      })
    }
    return {
      status: 200,
      statusText: 'ok'
    }
  }

  async getLastPublic(ctx) {
    return DBHelper.getList('public', [0, 1], {}).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result
      }
    })
  }

  async addPublic(ctx) {
    const params = {
      id: uuidv1(),
      content: ctx.request.body.content,
      created_by: ctx.session.userName,
      created_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    await DBHelper.addRow('public', params).then(() => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '成功创建公告'
      }
    })
  }

  async getCustomer(ctx) {
    const { name } = ctx.query
    const pageNum = parseInt(ctx.query.page || 1, 10)// 页码
    const end = 10 // 默认页数
    const start = (pageNum - 1) * end
    const limit = [start, end]
    return Promise.all(
      [
        userModel.searchCusts({}, { name }, limit),
        userModel.searchCustsTotal({}, { name }, limit)
      ]).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result[0],
        num: result[1][0].count
      }
    })
  }

  async updateCust(ctx) {
    const { id, infoForm } = ctx.request.body
    const params = {
      ...infoForm,
      updated_by: ctx.session.userName,
      updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    return DBHelper.updateRow('customer', id, params).then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        msg: '更新成功'
      }
    })
  }

  // 数据分组
  formateArrData(initialArr, name) {
    // 判定传参是否符合规则
    if (!(initialArr instanceof Array)) {
      return '请传入正确格式的数组'
    }
    if (!name) {
      return '请传入对象属性'
    }
    // 先获取一下这个数组中有多少个"name"
    const nameArr = []
    for (const i in initialArr) {
      if (nameArr.indexOf(initialArr[i][`${name}`]) === -1) {
        nameArr.push(initialArr[i][`${name}`])
      }
    }
    // 新建一个包含多个list的结果对象
    const tempObj = {}
    // 根据不同的"name"生成多个数组
    for (const k in nameArr) {
      for (const j in initialArr) {
        if (initialArr[j][`${name}`] === nameArr[k]) {
          // 每次外循环时新建一个对应"name"的数组, 内循环时当前数组不变
          tempObj[nameArr[k]] = tempObj[nameArr[k]] || []
          tempObj[nameArr[k]].push(initialArr[j])
        }
      }
    }
    return tempObj
  }
}

module.exports = new SettingController()
