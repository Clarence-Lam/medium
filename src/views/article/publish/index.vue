<template>
  <div class="app-container documentation-container">
    <a
      class="document-btn"
      target="_blank"
      href="https://panjiachen.github.io/vue-element-admin-site/"
      @click.prevent="showModel('platform')"
    >平台推广</a>
    <a
      class="document-btn"
      target="_blank"
      href="https://github.com/PanJiaChen/vue-element-admin/"
      @click.prevent="showModel('medium')"
    >媒体推广</a>
    <a
      class="document-btn"
      target="_blank"
      href="https://panjiachen.gitee.io/vue-element-admin-site/zh/"
      @click.prevent="showModel('question')"
    >问答推广</a>
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

      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="model = false">取 消</el-button>
        <el-button type="primary" @click="model = false">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
// import { test } from '@/api/setting'
export default {
  name: 'Publish',
  data() {
    return {
      model: false,
      dept: ''
    }
  },
  methods: {
    showModel(s) {
      this.model = true
      this.dept = s
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
.documentation-container {
  margin: 50px;
  .document-btn {
    // float: left;
    margin: 50px auto 0;
    display: block;
    cursor: pointer;
    // background: black;
    // background-image: linear-gradient( 135deg, #3B2667 10%, #BC78EC 100%);
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
    border-radius: 10px;
  }
  .document-btn:first-child {
//       background: #4B79A1;  /* fallback for old browsers */
// background: -webkit-linear-gradient(to right, #283E51, #4B79A1);  /* Chrome 10-25, Safari 5.1-6 */
// background: linear-gradient(to right, #283E51, #4B79A1); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
background: #4169e1c9;
  }
  .document-btn:nth-child(2){
//       background: #1D4350;  /* fallback for old browsers */
// background: -webkit-linear-gradient(to right, #A43931, #1D4350);  /* Chrome 10-25, Safari 5.1-6 */
// background: linear-gradient(to right, #A43931, #1D4350); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
background: #4169e1c9;
  }
  .document-btn:nth-child(3){
//     background: #000428; /* fallback for old browsers */
//   background: -webkit-linear-gradient(to right, #000428, #004e92); /* Chrome 10-25, Safari 5.1-6 */
//   background: linear-gradient(to right, #000428, #004e92); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
background: #4169e1c9;
  }
}
.dialog-center{
    text-align: center;
}
.diglog-btn{
    margin: 5px
}

</style>
