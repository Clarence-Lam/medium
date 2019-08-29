const Router = require('koa-router')
const router = new Router()
const loginController = require('../controller/login')
// const settingController = require('../controller/setting')

router.prefix('/api')

router
  .post('/login', loginController.login)
//   .post('/register', settingController.register)
  .get('/info', loginController.info)
  .post('/logout', loginController.logout)
  .post('/test', loginController.test)

module.exports = router
