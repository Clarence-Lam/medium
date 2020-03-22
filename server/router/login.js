const Router = require('koa-router')
const router = new Router()
const loginController = require('../controller/login')
const captchaController = require('../controller/svgCaptcha')
const userController = require('../controller/user')
// const settingController = require('../controller/setting')

router.prefix('/api')

router
  .post('/login', loginController.login)
  .post('/adminLogin', loginController.adminLogin)
  .post('/phoneLogin', loginController.phoneLogin)
//   .post('/register', settingController.register)
  .get('/info', loginController.info)
  .post('/logout', loginController.logout)
//   .post('/test', loginController.test)

// register
  .get('/getSvgCaptcha', captchaController.getSvgCaptcha)
  .post('/getSmsCaptcha', captchaController.getSmsCaptcha)
  .post('/register', userController.register)
  .post('/resetting', userController.resetting)

module.exports = router
