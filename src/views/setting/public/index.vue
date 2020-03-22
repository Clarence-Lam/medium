<template>
  <div class="app-container">
    <h3 class="app-container-title">公告和支付提示</h3>
    <hr class="app-container-hr">
    <el-card class="box-card">
        <h3 style="padding-left: 20px;">公告设置</h3>
      <el-input
        v-model="textarea"
        type="textarea"
        :rows="2"
        placeholder="公告内容建议简明扼要，建议不超过200字，上限不能超过500字"
      />
      <el-button type="success" class="public-btn" @click="addPublic">确定</el-button>
      <el-button type="primary" class="public-btn sec-btn" @click="open">预览</el-button>
    </el-card>
    <el-card class="box-card" style="margin-top:20px">
        <h3 style="padding-left: 20px;">支付提示文字</h3>
      <el-input
        v-model="tips"
        type="textarea"
        :rows="2"
        placeholder="支付提示文字位于充值页面下方"
      />
      <el-button type="success" class="public-btn" @click="addTips">确定</el-button>
    </el-card>
  </div>
</template>
<script>
import notice_icon from '@/assets/images/notice_icon.png'
import { getLastPublic,addPublic,addTips,getTips } from '@/api/setting'

export default {
  data() {
    return {
      textarea: '',
      tips:''
    }
  },
  created() {
    this.getLastPublic()
    this.getTips()
  },
  methods: {
    open() {
      this.$alert(`
                <div class="img-btn">
                    <img src=${notice_icon} alt="提示">
                    <h2 class="title">通知</h2>
                </div>
                <div class="welcome text">
                    亲爱的<span class="user">${this.$store.state.user.name}</span>,您好！
                </div>
                <div class="content text">
                    ${this.textarea}
                </div>
            `, {
        dangerouslyUseHTMLString: true,
        showCancelButton: false,
        showConfirmButton: false
      })
    },
    getLastPublic() {
      getLastPublic().then(res => {
          if(res.data[0]){

              this.textarea = res.data[0].content
          }
      })
    },
    getTips() {
      getTips().then(res => {
          if(res.data[0]){
              this.tips = res.data[0].content
          }
      })
    },
    addPublic() {
        if(this.textarea!==''){
            addPublic({content:this.textarea}).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
      })
        }else{
            this.$message({
            message: '请输入公告内容',
            type: 'warning'
          })
        }
      
    },
    addTips(){
       if(this.tips!==''){
            addTips({content:this.tips}).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
      })
        }else{
            this.$message({
            message: '请输入提示文字',
            type: 'warning'
          })
        } 
    }
  }
}
</script>
<style scope>
    .public-btn{
        margin: 20px 0 20px;
        float: right;
    }
    .sec-btn{
        margin-right: 20px
    }
    .img-btn{
        margin: 0 auto;
        text-align: center
    }
    .title{
        margin-top: 0;
    }
    .user{
        color: red
    }
    .content{
        text-indent: 2em;
        margin-top: 20px;
    }
    .text{
        font-size: 1.3em;
    }
</style>
