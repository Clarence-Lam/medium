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
  .get('/getTypesContent', settingController.getTypesContent)
  .del('/delTag/del/:id', settingController.delTag)
  .post('/addTypesContent', settingController.addTypesContent)

  .get('/getNothing', settingController.getNothing)
  .post('/addNothing', settingController.addNothing)
  .del('/delNothing/del/:id', settingController.delNothing)

  .get('/getSelects', settingController.getSelects)

module.exports = router

