<template>
  <div class="app-container">
    <h3>{{ textMap[this.$route.params.dialogStatus] }}</h3>
    <el-form ref="caseForm" :model="caseForm" :rules="rules" label-width="150px" label-position="left" style="width: 400px; margin-left:50px;">
      <el-form-item label="产品名称：" prop="name">
        <el-input v-model="caseForm.name" />
      </el-form-item>
      <el-form-item label="产品链接：" prop="url">
        <el-input v-model="caseForm.url" />
      </el-form-item>
      <el-form-item label="平台：" required prop="platform">
        <el-input v-model="caseForm.platform" />
      </el-form-item>
      <el-form-item label="代理价格：" prop="agent_price">
        <el-input v-model.number="caseForm.agent_price" />
      </el-form-item>
      <el-form-item label="普通用户价格：" prop="general_price">
        <el-input v-model.number="caseForm.general_price" />
      </el-form-item>
      <el-form-item label="百度权重：" prop="baidu">
        <el-input v-model.number="caseForm.baidu" />
      </el-form-item>
      <el-form-item label="起始下单量：" prop="start_num">
        <el-input v-model.number="caseForm.start_num" />
      </el-form-item>
      <template v-for="item in selectData">
        <el-form-item
          v-if="item[0].type_name!=='排序'"
          :key="item[0].id"
          required
          :label="item[0].type_name+'：'"
          :prop="item[0].type"
        >
          <el-select v-model="caseForm[item[0].type]" placeholder="请选择" value-key="id" @change="changeData($event, item)">
            <el-option
              v-for="op in item"
              :key="op.id"
              :label="op.name"
              :value="op.id"
            />
          </el-select>
        </el-form-item>
      </template>
      <el-form-item label="备注：" prop="mark">
        <el-input
          v-model="caseForm.mark"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('caseForm')">确定</el-button>
        <!-- <el-button @click="resetForm('caseForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getSelects, createCase, getArticleType, updateCase } from '@/api/setting'
export default {
  data() {
    return {
      dialogStatus: '',
      textMap: {
        update: '修改产品',
        create: '新增产品'
      },
      caseForm: {
        name: '',
        url: '',
        platform: '',
        agent_price: null,
        general_price: null,
        baidu: null,
        start_num: null,
        tags: {},
        mark: ''
      },
      tagsValue: {},
      selectData: {},
      rules: {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        url: [
          { type: 'url', required: true, message: '请输入产品链接地址', trigger: 'blur' }
        ],
        platform: [
          { required: true, message: '请输入平台', trigger: 'blur' }
        ],
        agent_price: [
          { required: true, message: '请输入代理价格', trigger: 'blur' },
          { type: 'number', message: '请输入正确的金额', trigger: 'blur' }
        ],
        general_price: [
          { required: true, message: '请输入普通用户价格', trigger: 'blur' },
          { type: 'number', message: '请输入正确的金额', trigger: 'blur' }
        ],
        baidu: [
          { required: true, message: '请输入百度权重', trigger: 'blur' },
          { type: 'number', min: 1, max: 10, message: '请输入正确的百度权重', trigger: 'blur' }
        ],
        start_num: [
          { required: true, message: '请输入起始下单量', trigger: 'blur' },
          { type: 'number', message: '请输入正确的金额', trigger: 'blur' }
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
        for (const item in data) {
          this.$set(this.caseForm, data[item][0].type, '')
          this.$set(this.rules, data[item][0].type, [
            { required: true, message: '请选择标签', trigger: 'change' }
          ])
        }
        if (this.$route.params.dialogStatus === 'update') {
          const row = this.$route.params.row
          Object.assign(this.caseForm, row)
          getArticleType({ cases_id: this.$route.params.id }).then(res => {
            const data = res.data
            for (const item of data) {
              this.caseForm[item.types_id] = item.type_field_id
            }
          })
          const json = JSON.parse(row.type_json)
          for (const item of json) {
            this.tagsValue[item.type_name] = item
          }
        }
      })
    },
    submitForm() {
      this.$refs['caseForm'].validate((valid) => {
        if (valid) {
          const params = {
            dept: 'platform',
            name: this.caseForm.name,
            url: this.caseForm.url,
            platform: this.caseForm.platform,
            agent_price: this.caseForm.agent_price,
            general_price: this.caseForm.general_price,
            baidu: this.caseForm.baidu,
            start_num: this.caseForm.start_num,
            mark: this.caseForm.mark,
            tags: []
          }
          for (const item in this.tagsValue) {
            params.tags.push(this.tagsValue[item])
          }
          if (this.$route.params.dialogStatus === 'update') {
            params.id = this.$route.params.id
            updateCase(params).then(res => {
              if (res.status === 200) {
                this.$message({
                  message: '产品修改成功',
                  type: 'success'
                })
                this.$router.push({ name: 'platform-cases' })
              }
            })
          } else {
            createCase(params).then(res => {
              if (res.status === 200) {
                this.$message({
                  message: '创建产品成功',
                  type: 'success'
                })
                this.$router.push({ name: 'platform-cases' })
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeData(value, obj) {
      const v = obj.find(d => d.id === value)
      this.tagsValue[v.type_name] = v
    }
  }
}
</script>
