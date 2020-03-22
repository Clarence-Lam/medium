<template>
  <div class="components-container">
    <h3 class="app-container-title">问答推广发布</h3>
    <hr class="app-container-hr">
    <div>
      <el-form ref="orderForm" :model="form" :rules="rules">
        <el-form-item label="上传：">
          <el-upload
            class="upload-demo"
            action="/api/upload"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-progress="toUpload"
            :disabled="disabled"
            accept=".docx,.doc"
          >
            <el-button size="small" type="primary" :loading="uploading">上传文档，支持DOCX格式，office2007,2010,2013,2016</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="希望多久完成：" prop="time">
          <el-radio-group v-model="form.time">
            <!-- <el-radio label="1">1天</el-radio>
            <el-radio label="3">3天</el-radio>
            <el-radio label="7">7天</el-radio> -->
            <el-radio v-for="item of expectedTime" :key="item.label" :label="item.label">{{ item.name }}</el-radio>
          </el-radio-group>
          <span style="margin-left:10px;color:red">(注：以实际完成时间为准)</span>
        </el-form-item>
        <el-form-item label="标题：" prop="name">
          <el-input v-model="form.name" style="width:300px" />
        </el-form-item>
        <tinymce ref="setContent" v-model="content" :height="300" />
        <el-form-item label="备注：" style="margin-top:20px">
          <el-input v-model="form.mark" style="width:300px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="float:right" @click="onSubmit">下一步</el-button>
          <el-button type="primary" style="float:right;margin:0 20px 0" @click="showDetail">预览</el-button>
          <el-button v-if="this.$route.params.orderTogether" type="warning" style="float:right" @click="goBack">上一步</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import { getExpectedTime } from '@/api/setting'
import { getCustInfo } from '@/api/user'

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      dept: 'question',
      uploading: false,
      disabled: false,
      expectedTime: [],
      form: {
        time: '',
        name: '',
        mark: ''
      },
      rules: {
        time: [{ message: '请选择制作时间', trigger: 'change' }],
        name: [{ required: true, message: '请输入文案名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }]
      },
      content:
      `<h1 style="text-align: center;">稿件发布方法</h1>
        <ul>
            <li>上传文档</li>
            <li>直接这里输入格式为，只要格式人工看得懂均可直接复制进去
                <p>问题1</p>
                <p>问题1描述（没有可以去掉）</p>
                <p>回答1:</p>
                <p>问题2</p>
                <p>问题2描述（没有可以去掉）</p>
                <p>回答2:</p>
            </li>
            <li>一定要预览一下准确无误再进行下一步</li>
        </ul>
        <p style='color: red;'>注意：问答如果原文发布不上去，技术会在不改变原意，自由修改问答内容</p>
        `
    }
  },
  created() {
    this.getExpectedTime()
    if (this.$route.params.goback) {
      this.form.name = this.$store.state.title
      this.form.time = this.$store.state.time
      this.form.mark = this.$store.state.mark
      this.content = this.$store.state.url
    } else if (this.$route.params.repeat) {
      this.form.name = this.$route.params.row.title
      this.form.time = this.$route.params.row.time
      this.form.mark = this.$route.params.row.mark
      this.content = this.$route.params.row.url
    } else if (this.dept === this.$store.state.order.pay) {
      this.form.name = this.$store.state.order.cpWriteForm.title
      this.form.time = this.$store.state.order.cpWriteForm.time
      this.form.mark = this.$store.state.order.cpWriteForm.mark
      this.content = this.$store.state.order.cpWriteForm.url
    }
  },
  methods: {
    async onSubmit() {
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
            this.$refs['orderForm'].validate((valid) => {
              if (valid) {
              //   this.addOrder()
                this.$store.state.title = this.form.name
                this.$store.state.time = this.form.time
                this.$store.state.mark = this.form.mark
                this.$store.state.url = this.content
                this.$router.push(
                  {
                    name: 'commit',
                    params: {
                      dept: 'question',
                      isSelection: this.$route.params.isSelection ? this.$route.params.isSelection : false,
                      orderTogether: this.$route.params.orderTogether ? this.$route.params.orderTogether : false
                    }
                  }
                )
              } else {
                console.log('error submit!!')
                return false
              }
            })
          }
        })
      } else {
        this.$message({
          message: '仅限客户账号下单',
          type: 'warning'
        })
      }
    },
    uploadSuccess(response, file, fileList) {
      this.uploading = false
      this.disabled = false
      if (response.code === 200) {
        this.$refs.setContent.setContent(response.html)
      } else if (response.code === 403) {
        this.$message.error('连接超时，请重新登录')
        this.$store.dispatch('user/logout').then(
          this.$router.push(`/login`)
        )
      } else {
        this.$message.error(response.msg)
      }
    },
    uploadError() {
      console.log('失败')
      this.uploading = false
      this.disabled = false
      this.$message.error('上传失败，请重新上传')
    },
    toUpload() {
      this.uploading = true
      this.disabled = true
    },
    showDetail() {
    //   this.$router.push(`/preview`)
      const { href } = this.$router.resolve({
        name: 'preview',
        params: {
          asdasda: '12312312',
          content: this.content
        },
        query: {
          content: this.content
        }
      })
      window.open(href, '_blank')
    },
    getExpectedTime() {
      getExpectedTime({ dept: 'question' }).then(res => {
        for (const item of res.data) {
          const param = {
            label: item.name.split('天')[0],
            name: item.name
          }
          this.expectedTime.push(param)
          if (item.is_default === '1' && !this.$route.params.goback) {
            this.form.time = item.name.split('天')[0]
          }
        }
      })
    },
    goBack() {
      const router = {
        platform: 'write-platform',
        medium: 'write-medium',
        question: 'write-question'
      }
      this.$router.push(
        {
          name: router[this.dept],
          params: {
            goback: true
          }
        }
      )
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>
