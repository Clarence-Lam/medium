const Router = require('koa-router')
const router = new Router()
const userController = require('../controller/user')

router.prefix('/api')

router
  .post('/updateInfo', userController.updateInfo)
  .get('/getCustInfo', userController.getCustInfo)
  .get('/getMyself', userController.getMyself)// 客户自己查询信息
  .post('/updateMyself', userController.updateMyself)
  .post('/updatePhone', userController.updatePhone)

module.exports = router
