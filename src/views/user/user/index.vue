<template>
  <div class="app-container">
    <h3 class="app-container-title">资料修改</h3>
    <hr class="app-container-hr">
    <div style="width:50%">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="ruleForm.name" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="ruleForm.phone" style="width:50%" :disabled="true" />
          <a target="_blank" style="color:blue" @click.prevent="showPhone=true">修改</a>
        </el-form-item>
        <el-form-item label="QQ/微信" prop="qq">
          <el-input v-model="ruleForm.qq" />
        </el-form-item>
        <!-- <el-form-item label="微信号" prop="wechat">
          <el-input v-model="ruleForm.wechat" />
        </el-form-item> -->
        <el-form-item label="公司名" prop="company">
          <el-input v-model="ruleForm.company" />
        </el-form-item>
        <el-form-item label="通过*进来的" prop="channel">
          <el-select v-model="ruleForm.channel" placeholder="请选择方式">
            <el-option label="Q群" value="Q群" />
            <el-option label="淘宝" value="淘宝" />
            <el-option label="百度搜索" value="百度搜索" />
            <el-option label="推荐人" value="推荐人" />
            <el-option label="其他方式" value="其他方式" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="$store.state.user.roles[0]!=='customer'" @click="submitForm('ruleForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="修改手机号码" :visible.sync="showPhone">
      <el-form ref="phoneForm" :model="phoneForm" :rules="phoneRules">
        <el-form-item label="手机号码" label-width="120px">
          <el-input v-model="phoneForm.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="验证码" label-width="120px">
          <el-input v-model="phoneForm.smsCaptcha" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" :disabled="smsSetting.smsLoading" @click="getSmsCaptcha">{{ smsSetting.content }}</el-button>
        <el-button type="primary" @click="updatePhone()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMyself, updateMyself, getSmsCaptcha, updatePhone } from '@/api/user'
import { validPhone } from '@/utils/validate'

export default {
  name: 'UpdateNews',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请确认手机号码是否正确'))
      } else {
        callback()
      }
    }
    return {
      showPhone: false,
      smsSetting: {
        smsLoading: false,
        content: '获取验证码',
        cutTime: 60
      },
      ruleForm: {
        name: '',
        channel: '',
        phone: '',
        qq: '',
        wechat: '',
        company: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入称呼', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        channel: [
          { required: true, message: '请选择方式', trigger: 'change' }
        ],
        qq: [
          { required: true, message: '请输入qq或微信', trigger: 'blur' },
          { min: 5, max: 15, message: '请输入正确的qq号码或微信', trigger: 'blur' }
        ]
      },
      phoneForm: {
        phone: '',
        smsCaptcha: ''
      },
      phoneRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        smsCaptcha: [{ required: true, message: '短信验证码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getMyself()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.ruleForm.name,
            channel: this.ruleForm.channel,
            qq: this.ruleForm.qq,
            wechat: this.ruleForm.wechat,
            company: this.ruleForm.company

          }
          updateMyself(params).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.getMyself()
              this.$store.dispatch('user/getInfo')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getMyself() {
      getMyself().then(res => {
        this.ruleForm.name = res.data.name
        this.ruleForm.channel = res.data.channel
        this.ruleForm.phone = res.data.phone
        this.ruleForm.qq = res.data.qq
        this.ruleForm.wechat = res.data.wechat
        this.ruleForm.company = res.data.company
      })
    },
    getSmsCaptcha() {
      if (this.validatePhone(this.phoneForm.phone)) {
        this.smsSetting.smsLoading = true
        this.smsSetting.content = this.smsSetting.cutTime + 's后获取'
        const clock = window.setInterval(() => {
          this.smsSetting.cutTime--
          this.smsSetting.content = this.smsSetting.cutTime + 's后获取'
          if (this.smsSetting.cutTime < 0) {
            window.clearInterval(clock)
            this.smsSetting.content = '获取验证码'
            this.smsSetting.cutTime = 60
            this.smsSetting.smsLoading = false
          }
        }, 1000)
        getSmsCaptcha({ phone: this.phoneForm.phone, type: 'universal' }).then(res => {
          if (res.status === 200) {
            this.$message({
              message: '验证短信已下发，请注意查收',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
      }
    },
    validatePhone(phone) {
      if (!validPhone(phone)) {
        this.$message.error('请确认手机号码是否正确')
        return false
      } else {
        if (phone === this.ruleForm.phone) {
          this.$message.error('手机号码不能于之前相同')
          return false
        }
        return true
      }
    },
    updatePhone() {
      if (this.validatePhone(this.phoneForm.phone)) {
        updatePhone({ phone: this.phoneForm.phone, smsCaptcha: this.phoneForm.smsCaptcha }).then(res => {
          if (res.status === 200) {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.showPhone = false
            this.getMyself()
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
