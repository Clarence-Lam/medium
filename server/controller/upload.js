const mammoth = require('mammoth')
const fs = require('fs')
const textract = require('textract')
const _path = require('path')
const uuidv1 = require('uuid/v1')

class SettingController {
  async wordToHtml(ctx) {
    // console.log(ctx.request.files)
    // console.log(ctx.request.files.file)
    const path = ctx.request.files.file.path
    const fileName = ctx.request.files.file.name
    // console.log(filePath)
    if (path) {
      if (getSuffixName(fileName) === 'docx' || getSuffixName(fileName) === 'DOCX') {
        return new Promise(async(resolve, reject) => {
          mammoth
            .convertToHtml({ path })
            .then(async result => {
              ctx.body = { code: 200, html: result.value }
              resolve(true)
            })
            .done()
        })
      } else if (getSuffixName(fileName) === 'doc' || getSuffixName(fileName) === 'DOC') {
        return new Promise(async(resolve, reject) => {
          fs.readFile(path, function(err, data) {
            if (err) {
              return console.error(err)
            }
            textract.fromBufferWithName(fileName, data, function(error, text) {
              if (error) {
                console.log('error')
                console.log(error)
              } else {
                console.log('success')
                ctx.body = { code: 200, html: text }
                resolve(true)
              }
            })
          })
        })
      } else {
        ctx.body = { code: -1, msg: '请上传正确的word文档' }
      }
    } else {
      ctx.body = { code: -1, msg: '上传失败,请重新上传' }
    }
  }

  async uploadRar(ctx) {
    // console.log('上传文件')
    const file = ctx.request.files.file
    const fileName = file.name

    if (file.path) {
      const postfix = getSuffixName(fileName)
      if (postfix === 'rar' || postfix === 'zip') {
        const reader = fs.createReadStream(file.path)
        const fileID = uuidv1()
        const filePath = _path.join(__dirname, '../../upload/temp/') + `${fileID}.${postfix}`
        const upStream = fs.createWriteStream(filePath)
        reader.pipe(upStream)
        ctx.body = {
          code: 200,
          msg: '上传成功',
          data: {
            fileID,
            fileName
          }}
      } else {
        ctx.body = { code: -1, msg: '请上传rar或zip格式的文件' }
      }
    }
  }
}
// 获取文件后缀
function getSuffixName(fileName) {
  const nameList = fileName.split('.')
  return nameList[nameList.length - 1]
}
module.exports = new SettingController()
