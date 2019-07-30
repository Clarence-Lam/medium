const Router = require('koa-router')
const router = new Router()

router.prefix('/goods')

router.get('/:id', async(ctx, next) => {
  console.log('get goods detail')
})

router.get('/', async(ctx, next) => {
  console.log('get all goods')
})

router.post('/', async(ctx, next) => {
  console.log('add goods')
})

router.put('/:id', async(ctx, next) => {
  console.log('update goods')
})

router.del('/:id', async(ctx, next) => {
  console.log('delete goods')
})

module.exports = router
