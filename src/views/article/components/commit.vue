<template>
  <div>
    <div class="components-container commit-container">
      <h3 class="app-container-title">{{ getTitle() }}</h3>
      <hr class="app-container-hr">
      <div class="box-black">
        <el-form ref="caseForm" :model="caseForm" label-width="150px">
          <div v-for="item in typesName" :key="item.id" class="box-content">
            <el-form-item :label="item.name+':'">
              <el-radio-group v-model="caseForm[item.id]" size="small">
                <el-radio :label="null" :border="true">不限</el-radio>
                <el-radio v-for="radio in types[item.id]" :key="radio.id" class="commit-radio" :label="radio.id" :border="true">{{ radio.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <CommitTable
        ref="table"
        :dept="this.$route.params.dept"
        :case-form="caseForm"
        :is-selection="this.$route.params.isSelection"
      />
    </div>
    <CommitNum :multiple-selection="multipleSelection" />
  </div>
</template>
<script>
import { getTypesName, getTypesContent } from '@/api/setting'
import { addOrder } from '@/api/orders'

import CommitTable from '../components/commit-table'
import CommitNum from '../components/commit-num'
export default {
  components: { CommitTable, CommitNum },
  data() {
    return {
      drawer: true,
      direction: 'rtl',
      anc: '',
      typesName: [],
      types: {},
      caseForm: {},
      multipleSelection: []
    }
  },
  created() {
    // this.getTypesName()
    if (this.$route.params.dept && this.$store.state.title) {
      this.getTypesName()
    } else {
      this.$router.push(
        {
          name: 'publish'
        }
      )
    }
  },
  updated() {
    getTypesContent
  },
  methods: {
    getTitle() {
      const item = {
        medium: '媒体推广/选择产品',
        platform: '平台推广/选择产品',
        question: '问答推广/选择产品'
      }
      return item[this.$route.params.dept]
    },
    getTypesName() {
      const dept = this.$route.params.dept
      getTypesName({ dept: dept }).then(res => {
        this.typesName = res.data
        for (const item of res.data) {
          this.$set(this.caseForm, item.id, null)
          this.getTypesContent(item.id)
        }
      })
    },
    getTypesContent(id) {
      getTypesContent({ id: id }).then(result => {
        // this.types[id] = result.data
        this.$set(this.types, id, result.data)
      })
    },
    handleGetMultiple(val) {
      this.multipleSelection = val
    },
    delSelection(item) {
      this.$refs.table.delSelection(item)
    },
    goBack() {
      const router = {
        platform: 'copy-write-platform',
        medium: 'copy-write-medium',
        question: 'copy-write-question'
      }
      this.$router.push(
        {
          name: router[this.$route.params.dept],
          params: {
            goback: true,
            isSelection: this.$route.params.isSelection ? this.$route.params.isSelection : false,
            orderTogether: this.$route.params.orderTogether ? this.$route.params.orderTogether : false
          }
        }
      )
    },
    submit() {
      let num = 0
      let money = 0
      this.multipleSelection.forEach(i => {
        num += Number(i.num)
        if (this.$store.state.user && this.$store.state.user.level === '1') {
          money += i.general_price * i.num
        } else {
          money += i.agent_price * i.num
        }
      })
      const form = {
        title: this.$store.state.title,
        finish_time: this.$store.state.time,
        mark: this.$store.state.mark,
        url: this.$store.state.url,
        cases: this.multipleSelection,
        dept: this.$route.params.dept,
        num,
        money,
        sign: 'copy_write'
      }
      const tips = this.$route.params.orderTogether ? '此操作将创建代写和发布两张订单，是否继续?' : '此操作将扣除金额并下单，是否继续?'

      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '返回修改',
        type: 'warning'
      }).then(() => {
        addOrder({ form, togetherForm: this.$route.params.orderTogether ? this.$store.state.order.togetherForm : null }).then(res => {
          if (res.status === 200) {
            this.$message({
              message: '成功创建订单',
              type: 'success'
            })
            this.$store.state.title = ''
            this.$store.state.time = ''
            this.$store.state.mark = ''
            this.$store.state.url = ''
            this.$store.state.order.pay = null
            this.$router.push('/myOrder/my')
          } else if (res.status === 400) {
            this.goToPay(form)
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    goToPay(form) {
      this.$confirm('您的金额不足，无法完成下单，点击确定将为您保存订单信息并前往充值?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.state.order.pay = this.$route.params.dept
        this.$store.state.order.cpWriteForm = form
        this.$store.state.order.multipleSelection = this.multipleSelection
        this.$router.push({ name: 'pay' })
      }).catch(() => {
        console.log('取消')
      })
    }
  }
}
</script>
<style scoped>
.commit-container{
    margin-bottom: 250px;
}
.box-black {
    margin-bottom: 24px;
}

.box-black {
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
    border-collapse:collapse;
}
.box-black .source {
    padding: 24px;
}
.box-content{
   border-bottom: 1px solid #ebebeb;
   transition: .2s;
   border-collapse:collapse;
   padding: 6px 24px;
}
.el-form-item{
    margin-bottom: 0;
}

</style>
<style lang="scss" scoped>
/deep/.el-radio__input {
    display: none
}
/deep/.commit-radio{
    margin-top: 10px
}
</style>
