<template>
  <div class="app-container">
    <h3>{{ textMap[this.$route.params.dialogStatus] }}</h3>
    <el-form ref="caseForm" :model="caseForm" :rules="rules" label-width="150px" label-position="left" style="width: 400px; margin-left:50px;">
      <el-form-item label="案例名称：" prop="name">
        <el-input v-model="caseForm.name" />
      </el-form-item>
      <el-form-item label="案例链接：" prop="url">
        <el-input v-model="caseForm.url" />
      </el-form-item>
      <el-form-item label="平台：" required prop="platform">
        <el-input v-model="caseForm.platform" />
      </el-form-item>
      <el-form-item label="代理价格：" prop="agent_price">
        <el-input v-model="caseForm.agent_price" />
      </el-form-item>
      <el-form-item label="普通用户价格：" prop="general_price">
        <el-input v-model="caseForm.general_price" />
      </el-form-item>
      <el-form-item label="百度权重：" prop="baidu">
        <el-input v-model="caseForm.baidu" />
      </el-form-item>
      <el-form-item label="起始下单量：" prop="start_num">
        <el-input v-model="caseForm.start_num" />
      </el-form-item>
      <el-form-item v-for="item in selectData" :key="item[0].type" :label="item[0].type_name+'：'" :prop="caseForm.tags[item[0].type]">
        {{ caseForm.tags[item[0].type] }}
        {{ caseForm.start_num }}
        <el-select v-model="caseForm.tags[item[0].type]" placeholder="请选择" value-key="id" @change="show">
          <el-option
            v-for="op in item"
            :key="op.id"
            :label="op.name"
            :value="op.id"
          />
          <!-- <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" /> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('caseForm')">立即创建</el-button>
        <!-- <el-button @click="resetForm('caseForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getSelects } from '@/api/setting'
export default {
  data() {
    return {
      dialogStatus: '',
      textMap: {
        update: '修改案例',
        create: '新增案例'
      },
      caseForm: {
        name: '',
        url: '',
        platform: '',
        agent_price: '',
        general_price: '',
        baidu: '',
        start_num: '',
        tags: {},
        test: ''
      },
      selectData: {},
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        platform: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        agent_price: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        general_price: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        start_num: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // console.log(this.$route)
    this.getSelects()
  },
  methods: {
    handleData(value) {
      alert(value)
    },
    getSelects() {
      getSelects({ dept: 'platform' }).then(res => {
        const data = this.selectData = res.data
        // const tags = {}
        for (const item in data) {
        //   const s = data[item][0].type
        //   this.caseForm.tags.prototype[s] = '1'
          this.caseForm.tags[data[item][0].type] = '123'
        //   console.log(data[item][0].type)
        }
        // this.caseForm.tags = tags
        // this.$set(this.caseForm.tags, tags)
        console.log(this.caseForm)
      })
    },
    submitForm() {
      console.log(this.selectData)
      console.log(this.caseForm)
    },
    show(value) {
    //   this.caseForm.start_num = '123'
    //   this.caseForm.tags = {}
      //   this.caseForm.tags = this.caseForm.tags
    //   console.log(this.caseForm.tags)
    //   console.log(value)
    //   alert()
    }
  }
}
</script>
