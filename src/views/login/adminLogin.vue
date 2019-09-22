<template>
  <div class="login_bg">
    <div class="unit">
      <div class="fl_div">
        <!-- <img src="/static/index/images/login/login.png"> -->
        <h2>
          后台管理登录
        </h2>

        <div class="line" />
        <div class="call_tel">
          <div class="text">注册咨询热线</div>
          <div class="tel">0754-8888-8888</div>
        </div>
        <ul>
          <li><a href="/index.php/index/index/index.html">返回首页</a></li>
          <li><a href="/index.php/index/index/about.html?type=1">关于我们</a></li>
          <li><a href="/index.php/index/index/about.html?type=3">联系我们</a></li>
        </ul>
      </div>
      <div class="login-container ">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form loginForm" auto-complete="on" label-position="left">

          <!-- <div class="title-container">
          <h3 class="title">Login Form</h3>
        </div> -->
          <br><br><br>
          <el-form-item prop="phone">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="phone"
              v-model="loginForm.phone"
              placeholder="手机号码"
              name="phone"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

          <p class="foot-p">
            <a target="_blank" @click.prevent="register()">注册</a>
          </p>
          <!-- <div class="tips">
          <span style="margin-right:20px;">username: admin</span>
          <span> password: any</span>
        </div> -->

        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { validPhone } from '@/utils/validate'
// import axios from 'axios'
export default {
  name: 'Login',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请确认手机号码是否正确'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('至少输入6位数密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        phone: '',
        password: ''
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    register() {
      this.$router.push({ path: 'register' })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/adminLogin', this.loginForm).then((res) => {
            console.log(res)
            if (res.role === 'customer') {
              this.$router.push({ path: '/home/home' })
            } else {
              this.$router.push({ path: '/order/controller' })
            }
            this.loading = false
          }).catch((msg) => {
            this.$message.error(msg)
            this.loading = false
          })
        //   axios
        //     .post('/api/register', {
        //       phone: this.loginForm.phone,
        //       password: this.loginForm.password,
        //       name: 'Clarence',
        //       role: 'admin'
        //     })
        //     .then((response) => {
        //       console.log(response)
        //     })
        //     .catch((error) => {
        //       console.log(error)
        //     })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
body {
  background: #fff;
  color: #555;
  font-size: 14px;
  font-family: "Microsoft YaHei", "Arial", "黑体", "宋体", sans-serif;
}
td,
th {
  font-size: 14px;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: normal;
  font-size: 100%;
}
a {
  color: #555;
  text-decoration: none;
}
img {
  border: none;
  vertical-align: middle;
}
ul,
li {
  list-style: none;
}
input,
textarea,
select,
button {
  font: 14px "Microsoft YaHei", "Arial", "黑体", "宋体", sans-serif;
}
.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1;
}
.lf {
  float: left;
}
.rt {
  float: right;
}
.w1200 {
  width: 1200px;
  margin: 0 auto;
}

.login_bg {
  width: 100%;
  height: 100%;
  background: #524e4f url('../../assets/images/login_bg.jpg');
  background-size: cover;
}
.main {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1; /* background-color:black;*/
}
.unit {
  width: 794px;
  height: 470px;
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  margin-left: -397px;
  margin-top: -235px; /*background-color: red;transform: translate(-50%, -50%);-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);*/
}
.loginForm h4.title {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 12px;
  position: relative;
  color: #df5151;
  font-size: 18px;
}
.loginForm h4.title:before {
  content: "";
  width: 30px;
  height: 2px;
  background-color: #df5151;
  border-radius: 1px;
  position: absolute;
  left: 50%;
  margin-left: -15px;
  bottom: 0px;
}
.fl_div {
  margin-top: 53px;
  width: 471px;
  height: 364px;
  background: url(../../assets/images/fl_div_bg.png);
  background-size: cover;
  padding-top: 30px;
  padding-left: 28px;
  color: #fff;
}
.fl_div .line {
  margin-top: 22px;
  margin-bottom: 20px;
  width: 40px;
  height: 2px;
  background-color: #ffffff;
}
.fl_div .text {
  font-size: 16px;
}
.fl_div .tel {
  font-size: 24px;
  margin-top: 13px;
  margin-bottom: 107px;
}
.fl_div ul li {
  display: inline-block;
}
.fl_div ul li a {
  display: block;
  height: 26px;
  line-height: 26px;
  padding-left: 31px;
  padding-right: 31px;
  font-size: 14px;
  color: #fff;
  position: relative;
}
.fl_div ul li a:after {
  content: "";
  position: absolute;
  right: 0px;
  top: 0px;
  width: 1px;
  height: 100%;
  background-color: #ffffff;
  opacity: 0.8;
}
.fl_div ul li:first-child a {
  padding-left: 0;
}
.fl_div ul li:last-child a:after {
  background-color: transparent;
}
.loginForm {
  width: 410px;
  height: 100%;
  background-color: #ffffff;
  box-shadow: -13px 13px 19px 1px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -236px;
  padding: 40px 35px;
}
.inputBox {
  position: relative;
}
.inputBox input {
  padding-left: 14px;
  padding-right: 14px;
  width: 100%;
  height: 48px;
  line-height: 48px;
  border-radius: 3px;
  border: solid 1px #cbcbcb;
  margin-bottom: 15px;
}
.yanzCode input {
  width: 170px;
}
.yanzCode a {
  display: flex;
  width: 157px;
  height: 48px;
  border-radius: 3px;
  border: solid 1px #cbcbcb;
  position: absolute;
  right: 0;
  top: 0;
  justify-content: center;
  align-items: center;
  background-color: #f3fbfe;
}
.verifCode input {
  padding-right: 105px;
}
.verifCode a {
  width: 105px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 14px;
  color: #666;
  position: absolute;
  right: 0;
  top: 0;
}
.privacy {
  display: flex;
  justify-content: flex-start;
  padding-left: 20px;
  position: relative;
  color: #999;
  font-size: 12px;
  margin-bottom: 15px;
}
.privacy input[type="checkbox"] {
  display: none;
}
.privacy label {
  cursor: pointer;
}
.privacy label:before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url(/static/index/images/login/checked_no.png);
  background-size: cover;
  position: absolute;
  left: 0;
  top: 2px;
}
.privacy input[type="checkbox"]:checked + label:before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url(/static/index/images/login/checked.png);
  background-size: cover;
  position: absolute;
  left: 0;
  top: 2px;
}
.privacy a {
  color: #666;
}
.errorTip {
  padding-bottom: 12px;
}
.tips {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  color: #e45547;
}
.tips img {
  margin-right: 10px;
}
a.submit {
  display: block;
  width: 100%;
  height: 46px;
  line-height: 46px;
  text-align: center;
  background-color: #c7483b;
  border-radius: 4px;
  color: #fff;
  font-size: 18px;
  margin-bottom: 16px;
}
.bottom {
  display: flex;
}
.bottom .fll {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  font-size: 14px;
}
.bottom .fll:nth-of-type(2) {
  justify-content: flex-end;
}
.bottom .fll:nth-of-type(1) a {
  color: #ca3939;
}
.bottom .fll span {
  color: #999;
}
.bottom .fll:nth-of-type(2) a {
  color: #666666;
}
.loginForm .titleUnit {
  width: 100%;
  height: 30px;
  margin-bottom: 40px;
}
.titleUnit .unite {
  width: 50%;
  height: 30px;
  position: relative;
  float: left;
  cursor: pointer;
}
.titleUnit .unite:nth-of-type(1):after {
  content: "";
  width: 1px;
  height: 20px;
  background-color: #cbcbcb;
  position: absolute;
  top: 0px;
  right: 0px;
}

.titleUnit .unite h3.title {
  text-align: center;
  color: #999;
  font-size: 18px;
}
.titleUnit .unite.current h3.title {
  color: #df5151;
}
.titleUnit .unite.current:before {
  content: "";
  width: 30px;
  height: 2px;
  background-color: #df5151;
  border-radius: 1px;
  position: absolute;
  left: 50%;
  margin-left: -15px;
  bottom: 0px;
}
.foot-p{
    text-align: center
}
.foot-p a{
    color: #2a6496;
}
</style>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $bg;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #454545;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  // min-height: 100%;
  // width: 100%;
  // background-color: $bg;
  // overflow: hidden;

  // .login-form {
  //   position: relative;
  //   width: 520px;
  //   max-width: 100%;
  //   padding: 160px 35px 0;
  //   margin: 0 auto;
  //   overflow: hidden;
  // }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .el-button--primary{
    background-color: #a71918;
    border-color: #ad201e;
  }
}
</style>
