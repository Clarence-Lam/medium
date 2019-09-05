const DBHelper = require('../helper/DBHelper.js')
const moment = require('moment')

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
        if (typeof (date) === 'number' && date > 0) {
        //   console.log(item.published_time)
          const endTime = (moment(item.published_time).add(date, 'days').format('YYYY-MM-DD HH:mm:ss'))
          //   console.log(endTime)
          if (!moment().isAfter(endTime)) {
            const params = {
              state: 'finish',
              updated_by: 'system',
              updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            DBHelper.updateRow('orders', item.id, params)
          }
        }
      }
    })
  }
}
module.exports = new CronController()
