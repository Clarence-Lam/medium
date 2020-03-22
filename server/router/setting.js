const Router = require('koa-router')
const router = new Router()
const settingController = require('../controller/setting')

router.prefix('/api/setting')

router
  .get('/user/userlist', settingController.userlist)
  .post('/user/createUser', settingController.createUser)
  .post('/user/updateUser', settingController.updateUser)
  .del('/user/del/:id', settingController.delUser)

  .get('/getTypesNameList', settingController.getTypesNameList)
  .get('/getExpectedTime', settingController.getExpectedTime)
  .get('/getTypesContent', settingController.getTypesContent)
  .del('/delTag/del/:id', settingController.delTag)
  .post('/addTypesContent', settingController.addTypesContent)
  .post('/addExpectedTime', settingController.addExpectedTime)
  .del('/delExpectedTime/:id', settingController.delExpectedTime)
  .post('/changeDefault', settingController.changeDefault)

  .get('/getNothing', settingController.getNothing)
  .post('/addNothing', settingController.addNothing)
  .del('/delNothing/del/:id', settingController.delNothing)

  .get('/getSelects', settingController.getSelects)
  .get('/getCasesList', settingController.getCasesList)
  .get('/getArticleType', settingController.getArticleType)
  .post('/createCase', settingController.createCase)
  .post('/updateCase', settingController.updateCase)
  .del('/deleteCase/:id', settingController.deleteCase)

  .get('/getLastPublic', settingController.getLastPublic)
  .post('/addPublic', settingController.addPublic)
  .get('/getTips', settingController.getTips)
  .post('/addTips', settingController.addTips)

  .get('/getCustomer', settingController.getCustomer)
  .post('/updateCust', settingController.updateCust)

  .post('/updatePass', settingController.updatePass)

  .get('/getDot', settingController.getDot)
  .post('/changeFirstTime', settingController.changeFirstTime)

  // 广告管理
  .get('/getAllAd', settingController.getAllAd)
  .post('/addAd', settingController.addAd)
  .post('/changeAd', settingController.changeAd)
  .get('/getAdList', settingController.getAdList)
module.exports = router

