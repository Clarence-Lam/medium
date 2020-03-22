const Router = require('koa-router')
const router = new Router()
const aliPayController = require('../controller/aliPay')

router.prefix('/api/alipay')

router
  .get('/test', aliPayController.test)
  .post('/gateway', aliPayController.gateway)
  .post('/verifySign', aliPayController.verifySign)

module.exports = router
