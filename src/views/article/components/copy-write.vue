<template>
  <div class="components-container">
    <div>
      <el-form :model="form">
        <el-form-item label="希望多久完成：">
          <el-radio-group v-model="form.time">
            <el-radio label="1天" />
            <el-radio label="3天" />
            <el-radio label="7天" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目名称：">
          <el-input v-model="form.name" style="width:300px" />
        </el-form-item>
        <tinymce v-model="content" :height="300" />
        <el-form-item label="备注：" style="margin-top:20px">
          <el-input v-model="form.mark" style="width:300px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="float:right" @click="onSubmit">下一步</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      form: {
        time: '',
        name: '',
        mark: ''
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
  methods: {
    onSubmit() {
      this.$message.error('不明白要干啥')
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>
