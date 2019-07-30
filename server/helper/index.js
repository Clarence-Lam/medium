const uuidv1 = require('uuid/v1')
class Helper {
  async getuuid(ctx) {
    const uuid = uuidv1()
    return uuid.replace('-')
  }
}
module.exports = new Helper()
