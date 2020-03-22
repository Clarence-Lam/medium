<template>
  <div class="navbar">
    <hamburger v-if="!sidebar.opened" id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
        <message-reminder class="right-menu-item" />
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <span>{{ $store.state.user.name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link> -->
          <!-- <router-link to="/"> -->
          <el-dropdown-item v-if="$store.state.user.roles[0]==='customer'" command="show">个人资料</el-dropdown-item>
          <!-- </router-link> -->
          <!-- <router-link to="/"> -->
          <el-dropdown-item command="change">修改密码</el-dropdown-item>
          <!-- </router-link> -->
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="个人资料" :visible.sync="personal" :modal-append-to-body="false" width="30%">
      <el-form ref="form" :model="form" :rules="formRules">
        <el-form-item label="真实姓名" :label-width="'80px'" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机" :label-width="'80px'" prop="phone">
          <el-input v-model="form.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="'80px'" prop="elmail">
          <el-input v-model="form.elmail" autocomplete="off" />
        </el-form-item>
        <el-form-item label="QQ/微信" :label-width="'80px'" prop="qq">
          <el-input v-model="form.qq" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="personal = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <el-drawer
      title="修改密码"
      :visible.sync="drawer"
      :direction="'rtl'"
    >
      <el-form ref="passForm" :model="passForm" :rules="rules">
        <el-form-item label="原密码" :label-width="'120px'" prop="oldPass">
          <el-input v-model="passForm.oldPass" autocomplete="off" style="width:80%" />
        </el-form-item>
        <el-form-item label="新密码" :label-width="'120px'" prop="newPass">
          <el-input v-model="passForm.newPass" autocomplete="off" style="width:80%" />
        </el-form-item>
        <el-form-item label="确认密码" :label-width="'120px'" prop="pass">
          <el-input v-model="passForm.pass" autocomplete="off" style="width:80%" />
        </el-form-item>
      </el-form>
      <el-button type="primary" :loading="loading" class="subBtn" @click="updatePass">确定</el-button>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import MessageReminder from '../components/MessageReminder'
import { updatePass } from '@/api/setting'
import { updateInfo, getCustInfo } from '@/api/user'
import { validPhone, validEmail } from '@/utils/validate'

// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    MessageReminder
    // ErrorLog,
    // Screenfull,
    // SizeSelect,
    // Search
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('至少输入6位数密码'))
      } else {
        callback()
      }
    }
    const confirmPass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('至少输入6位数密码'))
      } else {
        if (value !== this.passForm.newPass) {
          callback(new Error('两次密码输入不一致'))
        } else {
          callback()
        }
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请确认手机号码是否正确'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请确认邮箱是否正确'))
      } else {
        callback()
      }
    }
    const validateQQ = (rule, value, callback) => {
    //   if (!validQQ(value)) {
      if (value.length < 5 || value.length > 20) {
        callback(new Error('请确认QQ是否正确'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '',
        phone: '',
        elmail: '',
        qq: ''
      },
      passForm: {
        oldPass: '',
        newPass: '',
        pass: ''
      },
      personal: false,
      drawer: false,
      loading: false,
      rules: {
        oldPass: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        newPass: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        pass: [{ required: true, validator: confirmPass, trigger: 'blur' }]
      },
      formRules: {
        name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        elmail: [{ validator: validateEmail, trigger: 'blur' }],
        qq: [{ validator: validateQQ, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  created() {
    this.getCustInfo()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      const role = this.$store.state.user.roles[0]
      await this.$store.dispatch('user/logout')
      if (role === 'customer') {
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      } else {
        this.$router.push(`/adminLogin?redirect=${this.$route.fullPath}`)
      }
    },
    handleCommand(command) {
      if (command === 'show') {
        this.personal = true
      } else if (command === 'change') {
        this.drawer = true
      }
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            name: this.form.name,
            phone: this.form.phone,
            elmail: this.form.elmail,
            qq: this.form.qq
          }
          updateInfo(params).then(res => {
            this.loading = false
            if (res.status === 200) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.personal = false
              this.getCustInfo()
              this.$store.dispatch('user/getInfo')
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }
          })
        }
      })
    },
    updatePass() {
      this.$refs['passForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          updatePass({ oldPass: this.passForm.oldPass, newPass: this.passForm.newPass }).then(res => {
            this.loading = false
            if (res.status === 200) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.drawer = false
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }
          })
        }
      })
    },
    getCustInfo() {
      getCustInfo().then(res => {
        const data = res.data
        Object.keys(this.form).forEach(key => { this.form[key] = data[key] || '' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: rgb(27,28,35);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 18px;
          font-size: 12px;
        }
      }
    }
  }
}
.subBtn{
    float: right;
    margin-right: 4em;
}
</style>
