<template>
  <div class="app-container">
    <h3 class="app-container-title">发票申请</h3>
    <hr class="app-container-hr">
    <div style="width:50%">
      <p style="color:red;margin-left:50px">特别提醒：票面显示为3个点</p>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="发票类型" prop="type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio label="增值税普通发票(6%税点)" />
            <el-radio label="增值税专用发票(6%税点)" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票抬头" prop="title">
          <el-input v-model="ruleForm.title" />
        </el-form-item>
        <el-form-item label="税务登记证号" prop="tax_registry_number">
          <el-input v-model="ruleForm.tax_registry_number" />
        </el-form-item>
        <el-form-item label="发票明细" prop="detailed_invoice">
          <el-input v-model="ruleForm.detailed_invoice" :disabled="true" />
        </el-form-item>
        <el-form-item label="发票金额" prop="invoice_money">
          <el-input v-model.number="ruleForm.invoice_money" type="number" style="width:50%" />
          <span style="color:red">可开票金额：{{ usableBill }}元</span>
        </el-form-item>
        <el-form-item label="收件人姓名" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="ruleForm.phone" />
        </el-form-item>
        <el-form-item label="收件地址" prop="address">
          <el-input v-model="ruleForm.address" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submitForm('ruleForm')">立即申请</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import { getUsableBill, submitBill } from '@/api/finance'

export default {
  name: 'Bill',
  data() {
    return {
      loading: false,
      usableBill: 0,
      ruleForm: {
        type: '',
        title: '',
        tax_registry_number: '',
        detailed_invoice: '信息系统服务费',
        invoice_money: null,
        name: '',
        phone: '',
        address: ''
      },
      rules: {
        type: [
          { required: true, message: '请选择发票类型', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入发票抬头', trigger: 'blur' }
        ],
        tax_registry_number: [
          { required: true, message: '请输入税务登记证号', trigger: 'blur' }
        ],
        detailed_invoice: [
          { required: true, message: '请输入发票明细', trigger: 'blur' }
        ],
        invoice_money: [
          { required: true, message: '请输入发票金额', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入收件人姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入收件地址', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUsableBill()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.invoice_money <= 0) {
            this.$message({
              message: '开票金额必须大于0',
              type: 'warning'
            })
            return
          }
          if (this.usableBill < this.ruleForm.invoice_money) {
            this.$message({
              message: '开票金额不能大于可开票金额',
              type: 'warning'
            })
            return
          }
          this.loading = true
          submitBill(this.ruleForm).then(res => {
            this.loading = false
            this.$message({
              message: res.msg,
              type: 'success'
            })
            const _this = this
            setTimeout(function() {
              _this.$router.push(`/home/home`)
            }, 2000)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getUsableBill() {
      getUsableBill().then(res => {
        this.usableBill = res.usableBill
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// .dashboard {
//   &-container {
//     margin: 30px;
//   }
//   &-text {
//     font-size: 30px;
//     line-height: 46px;
//   }
// }
</style>
