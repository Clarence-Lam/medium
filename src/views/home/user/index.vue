<template>
  <div>
    <h2 class="home-title">个人信息</h2>
    <el-form ref="form" class="home-form" :model="form" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="用户级别">
        <el-select v-model="form.level" placeholder="请选择级别">
          <el-option label="级别1" value="1" />
          <el-option label="级别2" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="余额">
        <el-input v-model="form.money" />
      </el-form-item>
      <el-form-item label="充值">
        <el-button>前往充值</el-button>
      </el-form-item>

      <!-- <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: '越光科技',
        phone: '135****0707',
        level: '',
        money: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>
