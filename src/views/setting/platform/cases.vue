<template>
  <div class="app-container">
    <CaseTable
      :table="'platform'"
      :table-lable="tableLable"
    />
  </div>
</template>
<script>
import CaseTable from '../components/CaseTable'
export default {
  components: { CaseTable },
  data() {
    return {
      tableLable: [// 除名称（带链接）
        {
          title: '平台',
          key: 'platform'
        }, {
          title: '代理价格',
          key: 'agent_price'
        }, {
          title: '普通用户价格',
          key: 'general_price'
        }, {
          title: '百度权重',
          key: 'baidu'
        }, {
          title: '起始下单量',
          key: 'start_num'
        }, {
          title: '备注',
          key: 'mark'
        }
      ]
    }
  },
  methods: {
    handleData(value) {
      alert(value)
    },
    handleCreate(formName) {
    //   this.$refs[formName].resetFields()
    //   if (this.$refs[formName] !== undefined) {
    //     this.$refs[formName].resetFields()
    //   }
    //   this.dialogFormVisible = true
    //   this.dialogStatus = 'create'
      this.$router.push(
        {
          name: 'platform-caseForm',
          params: {
            dialogStatus: 'create'
          }
        }
      )
    }
  }
}
</script>
