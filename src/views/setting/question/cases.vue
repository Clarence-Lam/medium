<template>
  <div class="app-container">
    <h3 class="app-container-title">问答推广/产品管理</h3>
    <hr class="app-container-hr">
    <CaseTable
      :table="'question'"
      :table-lable="tableLable"
      :table-data="tableData"
      :loading="loading"
      :total="total"
    />
  </div>
</template>
<script>
import { getCasesList } from '@/api/setting'
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
          title: '一问几答',
          key: 'yiwenjida'
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
      ],
      tableData: [],
      loading: false,
      total: 0,
      page: 1
    }
  },
  created() {
    this.getCasesList()
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
          name: 'question-caseForm',
          params: {
            dialogStatus: 'create'
          }
        }
      )
    },
    getCasesList() {
      this.loading = true
      getCasesList({ dept: 'question', page: this.page }).then(res => {
        this.loading = false
        this.tableData = res.data
        this.total = res.num
      })
    },
    handleUpdate(row) {
      this.$router.push(
        {
          name: 'question-caseForm',
          params: {
            dialogStatus: 'update',
            id: row.id,
            row
          }
        }
      )
    }

  }
}
</script>
