<template>
  <div>
    <h2 class="home-title">客户经理</h2>
    <el-form ref="form" class="home-form" :model="form" label-width="120px">
      <el-form-item label="联系人">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="QQ">
        <el-input v-model="form.QQ" />
      </el-form-item>
      <el-form-item label="微信">
        <el-input v-model="form.wechat" />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="微信二维码">
        <img
          style="width: 300px; height: 450px"
          :src="url"
        >
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
        QQ: '475***284',
        wechat: '135****0707'
      },
      url: 'https://s2.ax1x.com/2019/07/10/Zgy8W6.jpg'
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
