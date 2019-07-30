<template>
  <div class="app-container documentation-container">
    <a
      class="document-btn"
      target="_blank"
      href="https://panjiachen.github.io/vue-element-admin-site/"
      @click.prevent="showModel1()"
    >问答推广</a>
    <a
      class="document-btn"
      target="_blank"
      href="https://github.com/PanJiaChen/vue-element-admin/"
      @click.prevent="nothing()"
    >平台推广</a>
    <a
      class="document-btn"
      target="_blank"
      href="https://panjiachen.gitee.io/vue-element-admin-site/zh/"
      @click.prevent="test1()"
    >媒体推广</a>
    <el-dialog title="选择类型" :visible.sync="model1" width="30%">
      <div class="dialog-center">
        <router-link to="copy-write">
          <el-button type="info">已有文案直接发布</el-button>
        </router-link>
        <router-link to="/">
          <el-button type="info">无文案需代编辑</el-button>
        </router-link>
      </div>

      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="model1 = false">取 消</el-button>
        <el-button type="primary" @click="model1 = false">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
import { test } from '@/api/setting'
export default {
  name: 'Publish',
  data() {
    return {
      model1: false
    }
  },
  methods: {
    showModel1(s) {
      this.model1 = true
    },
    nothing() {
      this.$message({
        message: '没有内容',
        type: 'warning'
      })
    },
    test1() {
    //   axios
    //     .post('/api/test')
    //     .then((response) => {
    //       console.log(response)
    //       //   if (response.data.status === 200) {

      //     //   } else {
      //     //     Message.warning('帐号或密码错误')
      //     //   }
      //     })
      //     .catch((error) => {
      //       console.log(error)
      //     })

      test().then((res) => {
        console.log(res)
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.documentation-container {
  margin: 50px;
  .document-btn {
    float: left;
    margin-left: 50px;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
.dialog-center{
    text-align: center;
}
</style>
