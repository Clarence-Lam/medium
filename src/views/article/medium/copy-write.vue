<template>
  <div class="components-container">
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
            accept=".docx"
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
        </el-form-item>
        <el-form-item label="项目名称：" prop="name">
          <el-input v-model="form.name" style="width:300px" />
        </el-form-item>
        <tinymce ref="setContent" v-model="content" :height="300" />
        <el-form-item label="备注：" style="margin-top:20px">
          <el-input v-model="form.mark" style="width:300px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="float:right" @click="onSubmit">下一步</el-button>
          <el-button type="primary" style="float:right;margin-right:20px" @click="showDetail">预览</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import { getExpectedTime } from '@/api/setting'

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      uploading: false,
      disabled: false,
      expectedTime: [],
      form: {
        time: '',
        name: '',
        mark: ''
      },
      rules: {
        time: [{ required: true, message: '请选择制作时间', trigger: 'change' }],
        name: [{ required: true, message: '请输入文案名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }]
      },
      content:
      `<h1 style="text-align: center;">稿件发布方法</h1>
        <ul>
            <li>上传文档</li>
            <li>直接这里输入格式为，只要格式人工看得懂均可直接复制进去
                <p>文章标题1：</p>
                <p>文章内容1：</p>
                <p>文章标题2：</p>
                <p>文章内容2：</p>
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
    }
  },
  methods: {
    onSubmit() {
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
                dept: 'medium'
              }
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
      getExpectedTime({ dept: 'medium' }).then(res => {
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
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>
