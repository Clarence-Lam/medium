<template>
  <div class="app-container">
    <h3 class="app-container-title">在线充值</h3>
    <hr class="app-container-hr">
    <el-card class="box-card">
      <el-row>
        <el-col :span="24" :offset="1">
          <p style="color:red">温馨提示：发布违法违规稿件会直接封号不退款,并提交公安机关报警处理!</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" :offset="1">
          <el-form ref="payForm" :model="payForm" label-width="90px" :rules="rules">
            <el-form-item label="充值方式:" prop="type">
              <el-radio-group v-model="payForm.type" class="payType">
                <el-radio :border="true" label="alipay">
                  <span>
                    <img :src="getImgUrl('alipay')" alt="支付宝" style="width: 120px;">
                  </span>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="充值金额:" prop="money">
              <el-radio-group v-model="payForm.money">
                <el-radio :label="500" border>500</el-radio>
                <el-radio :label="1000" border>1000</el-radio>
                <el-radio :label="5000" border>5000</el-radio>
                <el-radio :label="10000" border>10000</el-radio>
                <el-radio :label="-1" border>自定义</el-radio>
              </el-radio-group>
              <el-input v-show="payForm.money===-1" v-model.number="payForm.custom" type="number" placeholder="请输入金额" style="width:200px">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-form>
          <p style="color:red">{{ tips }}</p>
          <el-button type="primary" :loading="loading" @click="submit">确定</el-button>

        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { orderPay, aliVerifySign } from '@/api/finance'
import { getTips } from '@/api/setting'

export default {
  name: 'Pay',
  data() {
    return {
      loading: false,
      tips: '',
      payForm: {
        type: 'alipay',
        money: null,
        custom: null // 自定义金额
      },
      rules: {
        type: [
          { required: true, message: '请至少选择一个支付方式', trigger: 'change' }
        ],
        money: [
          { required: true, message: '请至少选择一个支付方式', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.callback()
    this.getTips()
  },
  methods: {
    getImgUrl(type) {
      if (type === 'alipay') {
        return require('@/assets/images/alipay.png')
      }
    },
    callback() {
    //   const url = decodeURIComponent(location.search)
    //   console.log(this.$route.params)
    //   console.log(this.$route.query)

      const query = this.$route.query
      if (query.method === 'alipay.trade.page.pay.return') {
        aliVerifySign({ query: query }).then(res => {
          if (res.status === 200) {
            this.$message({
              message: '充值成功，正在跳转',
              type: 'success'
            })
            const _this = this
            setTimeout(function() {
              _this.$router.push(`/home/home`)
            }, 2000)
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    submit() {
      this.$refs['payForm'].validate((valid) => {
        if (valid) {
        //   this.loading = true
        //   this.loading = false
          if (this.payForm.money === -1) {
            const money = this.payForm.custom
            console.log(money)
            if (money) {
              if (money < 0) {
                this.$message({
                  message: '最少充值100元',
                  type: 'warning'
                })
                return
              } else if (money > 100000000) {
                this.$message({
                  message: '充值金额超过限制',
                  type: 'warning'
                })
                return
              }
            } else {
              this.$message({
                message: '请输入金额',
                type: 'warning'
              })
              return
            }
          }
          const params = {
            type: 'alipay',
            money: this.payForm.money === -1 ? this.payForm.custom : this.payForm.money
          }
          const tempPage = window.open('', '_blank')
          orderPay(params).then(res => {
            if (res.status === 200) {
            //   window.open(res.payUrl, '_blank')
              tempPage.location = res.payUrl

              this.$confirm('请在弹出页面完成支付', '确认信息', {
                distinguishCancelAndClose: true,
                confirmButtonText: '好的',
                cancelButtonText: '取消支付'
              })
                .then(() => {
                  // 路由跳转到首页
                  this.$router.push(`/home/home`)
                })
                .catch(action => {
                  console.log('取消支付')
                })
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    getTips() {
      getTips().then(res => {
        if (res.data[0]) {
          this.tips = res.data[0].content
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
/deep/.el-radio__input {
    display: none
}
.payType .el-radio--medium.is-bordered{
    height: 60px;
}
</style>
