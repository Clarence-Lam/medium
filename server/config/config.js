const path = require('path')

var config = {
  database: {
    DATABASE: 'advert',
    USERNAME: 'root',
    PASSWORD: 'LJie88665482',
    PORT: '3306',
    HOST: 'localhost',
    timezone: 'Asia/Shanghai'
  },
  sms: {
    sid: 'c0e7828b48a6c3e05b4d8ee252ab6396', // 开发者账号id
    token: '1ee1fe53e9e34072d827050cb8d6716f', // 开发者token
    appid: '48f2119e62694f86bead92051c22dcee', // 应用id
    templateid: {
      register: '505757',
      resettingPass: '512734',
      universal: '512735'
    }, // 短信模板id
    uid: '' // 透传uid   可为空
  },
  alipay: {
    APP_ID: '2019092767878206',
    // APP_ID: '2019092767878206',//沙箱appid
    APP_GATEWAY_URL: 'https://openapi.alipay.com/gateway.do', // 用于接收支付宝异步通知
    // APP_GATEWAY_URL: 'https://openapi.alipay.com/gateway.do', // 沙箱地址
    AUTH_REDIRECT_URL: 'xxxxxxx', // 第三方授权或用户信息授权后回调地址。授权链接中配置的redirect_uri的值必须与此值保持一致。
    APP_PRIVATE_KEY_PATH: path.join(__dirname, 'pem', 'alipay', 'app-private.pem'), // 应用私钥
    APP_PUBLIC_KEY_PATH: path.join(__dirname, 'pem', 'alipay', 'app-public.pem'), // 应用公钥
    ALI_PUBLIC_KEY_PATH: path.join(__dirname, 'pem', 'alipay', 'ali-public.pem'), // 阿里公钥
    AES_PATH: path.join(__dirname, 'pem', 'alipay', 'aes.txt'), // aes加密（暂未使用）
    RETURN_URL: 'https://www.tmmeijie.com/tmadmin/#/user/pay', // 回调链接
    NOTIFY_URL: 'https://www.tmmeijie.com/api/alipay/gateway' // 支付结果异步链接
    // RETURN_URL: 'http://localhost:9527/#/user/pay', // 回调链接
    // NOTIFY_URL: 'http://lamzone.xyz:3000/api/alipay/gateway' // 支付结果异步链接
  }
}

module.exports = config
