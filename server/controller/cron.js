const DBHelper = require('../helper/DBHelper.js')
const moment = require('moment')
const uuidv1 = require('uuid/v1')

class CronController {
  async text() {
    console.log('--------开始执行定时任务--------')
    const params = {
      state: 'uphold',
      status: 1
    }
    DBHelper.getList('orders', [0, 1000], params).then(result => {
      for (const item of result) {
        let date = 0
        if (item.case_id_json) {
          for (const value of JSON.parse(item.case_id_json)) {
            for (const type of JSON.parse(value.type_json)) {
              if (type.type_name === '包补时间') {
                const dateArr = type.name.split('天')
                if (dateArr.length === 2) {
                  if (dateArr[1] !== '以上') {
                    const d = parseInt(dateArr[0], 10)
                    if (d > date) {
                      date = d
                    }
                  }
                }
              }
            }
          }
        }

        if (typeof (date) === 'number' && date > 0) {
        //   console.log(item.published_time)
          const endTime = (moment(item.published_time).add(date, 'days').format('YYYY-MM-DD HH:mm:ss'))
          //   console.log(endTime)
          if (moment().isAfter(endTime)) {
            const params = {
              state: 'finish',
              updated_by: 'system',
              updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            DBHelper.updateRow('orders', item.id, params)
            // 解冻金额并扣除金额
            DBHelper.getList('freeze_flow', [0, 1], { order_id: item.id }).then(res => {
              if (res.length === 1 && res[0].type === 'freeze') {
                DBHelper.addRow('freeze_flow', {
                  id: uuidv1(),
                  customer_id: res[0].customer_id,
                  customer_name: res[0].customer_name,
                  type: 'unfreeze',
                  order_id: item.id,
                  order_name: res[0].order_name,
                  money: res[0].money,
                  created_by: 'system',
                  created_time: moment().format('YYYY-MM-DD HH:mm:ss')
                })
                DBHelper.addRow('capital_flow', {
                  id: uuidv1(),
                  customer_id: res[0].customer_id,
                  customer_name: res[0].customer_name,
                  type: 'sub',
                  order_id: item.id,
                  order_name: res[0].order_name,
                  money: -res[0].money,
                  created_by: 'system',
                  created_time: moment().format('YYYY-MM-DD HH:mm:ss')
                })
              }
            })
          }
        }
      }
    })
  }
}
module.exports = new CronController()
