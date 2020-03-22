<template>
  <div class="app-container documentation-container">
    <h3 class="app-container-title">文章发布</h3>
    <hr class="app-container-hr">
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="5">
        <div class="box">
          <img src="@/assets/home/platform.jpg" alt="平台推广" style="width: 100%;">
          <div class="btn-box">
            <el-button type="warning" plain @click.prevent="showModel('platform')">发布</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="box">
          <img src="@/assets/home/medium.jpg" alt="平台推广" style="width: 100%;">
          <div class="btn-box">
            <el-button type="warning" plain @click.prevent="showModel('medium')">发布</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="box">
          <img src="@/assets/home/question.jpg" alt="平台推广" style="width: 100%;">
          <div class="btn-box">
            <el-button type="warning" plain @click.prevent="showModel('question')">发布</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="选择类型" :visible.sync="model" width="30%">
      <div class="dialog-center">
        <router-link v-if="dept==='platform'" to="copy-write-platform">
          <el-button type="primary" class="diglog-btn">已有文案直接发布</el-button>
        </router-link>
        <router-link v-if="dept==='platform'" to="write-platform">
          <el-button type="success">无文案需代编辑</el-button>
        </router-link>
        <router-link v-if="dept==='medium'" to="copy-write-medium">
          <el-button type="primary" class="diglog-btn">已有文案直接发布</el-button>
        </router-link>
        <router-link v-if="dept==='medium'" to="write-medium">
          <el-button type="success">无文案需代编辑</el-button>
        </router-link>
        <router-link v-if="dept==='question'" to="copy-write-question">
          <el-button type="primary" class="diglog-btn">已有文案直接发布</el-button>
        </router-link>
        <router-link v-if="dept==='question'" to="write-question">
          <el-button type="success">无文案需代编辑</el-button>
        </router-link>
      </div>

    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
// import { test } from '@/api/setting'
import { getCustInfo } from '@/api/user'
export default {
  name: 'Publish',
  data() {
    return {
      model: false,
      dept: ''
    }
  },
  methods: {
    async showModel(s) {
      if (this.$store.state.user.roles[0] === 'customer') {
        await getCustInfo().then(res => {
          const data = res.data
          if (!data.name || !data.qq || !data.channel) {
            this.$confirm('为了保障您能正常使用系统，请先前往完善资料。', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$router.push(`/user/user`)
            }).catch(() => {
              return
            })
          } else {
            this.model = true
            this.dept = s
          }
        })
      } else {
        this.$message({
          message: '仅限客户账号下单',
          type: 'warning'
        })
      }
    },
    nothing() {
      this.$message({
        message: '没有内容',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.row-bg{
    margin-top: 100px;
}
.box{
    position: relative;
}
.btn-box{
    position: absolute;
    bottom: 14%;
    text-align: center;
    width: 100%;
}
.dialog-center{
    text-align: center;
}
.diglog-btn{
    margin: 5px
}

</style>
