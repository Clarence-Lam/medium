var schedule = require('node-schedule')
const CronController = require('../controller/cron')
// var j = schedule.scheduleJob('00 * * * *', function() {
//   console.log('The answer to life, the universe, and everything!')
// })

// 定义规则
const rule = new schedule.RecurrenceRule()
rule.hour = 21
rule.minute = 54
rule.second = 5

// 启动任务
const job = schedule.scheduleJob(rule, () => {
  CronController.text()
})
