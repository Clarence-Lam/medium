const uuidv1 = require('uuid/v1')
const DBHelper = require('../helper/DBHelper.js')

class Helper {
  async getuuid(ctx) {
    const uuid = uuidv1()
    return uuid.replace('-')
  }
  async getAccount(id) {
    return DBHelper.getList('capital_flow', [0, 10000], { customer_id: id }).then(result => {
      let money = 0
      for (const item of result) {
        money += item.money
      }
      return Math.floor(money * 100) / 100
    })
  }

  /**
   * 已冻结金额
   * @param {customer_id} id
   * return money
   */
  async getFreezeMoney(id) {
    return DBHelper.getList('freeze_flow', [0, 10000], { customer_id: id }).then(result => {
      let money = 0
      for (const item of result) {
        if (item.type === 'freeze') {
          money += item.money
        } else {
          money -= item.money
        }
      }
      return money > 0 ? Math.floor(money * 100) / 100 : 0
    })
  }
  /**
   * 获取可用金额
   * @param {custoner} id
   */
  async getUsableMoney(id) {
    const Help = new Helper()
    const all = await Help.getAccount(id)
    const freeze = await Help.getFreezeMoney(id)
    return Math.floor((all - freeze) * 100) / 100
  }
}

module.exports = new Helper()
