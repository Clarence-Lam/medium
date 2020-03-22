const Router = require('koa-router')
const router = new Router()
const financeController = require('../controller/finance')

router.prefix('/api/finance')

router
  .post('/orderPay', financeController.orderPay)
  .post('/getAccountMoney', financeController.getAccountMoney)
  .post('/getFreezeMoney', financeController.getFreezeMoney)
  .post('/getUsableMoney', financeController.getUsableMoney)
  .get('/getFinanceList', financeController.getFinanceList)// 客户个人财务
  .get('/getWithdrawList', financeController.getWithdrawList)
  .post('/changeMoney', financeController.changeMoney)
  .get('/getUsableBill', financeController.getUsableBill)
  .post('/submitBill', financeController.submitBill)
  .get('/getInvoiceList', financeController.getInvoiceList)
  .post('/updateBill', financeController.updateBill)
  .get('/getfinances', financeController.getfinances)
  .get('/getPersonalFinance', financeController.getPersonalFinance)

module.exports = router

