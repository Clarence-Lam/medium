const Router = require('koa-router')
const router = new Router()
const uploadController = require('../controller/upload')

router.prefix('/api')

router
  .post('/upload', uploadController.wordToHtml)
  .post('/uploadRar', uploadController.uploadRar)

module.exports = router
