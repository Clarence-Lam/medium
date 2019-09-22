const Router = require('koa-router')
const router = new Router()
const orderController = require('../controller/order')

router.prefix('/api/order')

router
  .post('/getCommitTable', orderController.getCommitTable)
  .post('/addOrder', orderController.addOrder)
  .get('/getOrderTable', orderController.getOrderTable)
  .get('/getOrderDetail', orderController.getOrderDetail)
  .post('/saveState', orderController.saveState)
  .post('/failState', orderController.failState)
  .post('/finishState', orderController.finishState)
  .post('/submitOrder', orderController.submitOrder)
  .get('/getMyOrder', orderController.getMyOrder)
  .get('/getUrl', orderController.getUrl)
  .post('/applyUrl', orderController.applyUrl)
  .post('/addUrl', orderController.addUrl)

  .post('/toggleCollection', orderController.toggleCollection)

module.exports = router

