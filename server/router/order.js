const Router = require('koa-router')
const router = new Router()
const orderController = require('../controller/order')

router.prefix('/api/order')

router
  .post('/getCommitTable', orderController.getCommitTable)
//   .post('/addOrder', orderController.addOrder)

module.exports = router

