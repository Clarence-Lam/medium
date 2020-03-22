var schedule = require('node-schedule')
const CronController = require('../controller/cron')
// var j = schedule.scheduleJob('00 * * * *', function() {
//   console.log('The answer to life, the universe, and everything!')
// })

// 定义规则
const rule = new schedule.RecurrenceRule()
rule.hour = 1
rule.minute = 0
rule.second = 0

// 启动任务
const job = schedule.scheduleJob(rule, () => {
  CronController.text()
})
