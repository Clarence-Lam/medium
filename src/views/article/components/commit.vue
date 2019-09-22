<template>
  <div>
    <div class="components-container commit-container">
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
            goback: true
          }
        }
      )
    },
    submit() {
      let num = 0
      let money = 0
      this.multipleSelection.forEach(i => {
        num += Number(i.num)
        if (this.$store.state.user && this.$store.state.user.level === 1) {
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
      addOrder({ ...form }).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '成功创建订单',
            type: 'success'
          })
          this.$store.state.title = ''
          this.$store.state.time = ''
          this.$store.state.mark = ''
          this.$store.state.url = ''
          this.$router.push('/myOrder/my')
        }
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
