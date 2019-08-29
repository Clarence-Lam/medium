const mammoth = require('mammoth')

class SettingController {
  async wordToHtml(ctx) {
    const { abc } = ctx.request.body
    console.log(abc)
    // console.log(ctx.request.files)
    // console.log(ctx.request.files.file)
    const path = ctx.request.files.file.path
    const fileName = ctx.request.files.file.name
    if (path) {
      if (getSuffixName(fileName) === 'docx' ||
            getSuffixName(fileName) === 'doc') {
        return new Promise(async(resolve, reject) => {
          mammoth
            .convertToHtml({ path })
            .then(async result => {
              ctx.body = { code: 200, html: result.value }
              resolve(true)
            })
            .done()
        })
      } else {
        ctx.body = { code: -1, msg: '请上传正确的word文档' }
      }
    } else {
      ctx.body = { code: -1, msg: '上传失败,请重新上传' }
    }
  }
}
// 获取文件后缀
function getSuffixName(fileName) {
  const nameList = fileName.split('.')
  return nameList[nameList.length - 1]
}
module.exports = new SettingController()
