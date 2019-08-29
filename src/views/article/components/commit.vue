<template>
  <div>
    <div class="components-container commit-container">
      <el-button @click.prevent="handleClose">默认按钮</el-button>
      <div class="box-black">
        <el-form ref="caseForm" :model="caseForm" label-width="150px">
          <div v-for="item in typesName" :key="item.id" class="box-content">
            <el-form-item :label="item.name+':'">
              <el-radio-group v-model="caseForm[item.id]" size="small">
                <el-radio :label="null" :border="true">不限</el-radio>
                <el-radio v-for="radio in types[item.id]" :key="radio.id" :label="radio.id" :border="true">{{ radio.name }}</el-radio>
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
    this.getTypesName()
    // if (this.$route.params.dept && this.$store.state.title) {
    //   this.getTypesName()
    // } else {
    //   this.$router.push(
    //     {
    //       name: 'publish'
    //     }
    //   )
    // }
  },
  updated() {
    getTypesContent
  },
  methods: {
    handleClose() {
      console.log(1)
      console.log(this.caseForm)
      console.log(this.types)
      console.log(this.$refs.table.multipleSelection)
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
      this.$router.push(
        {
          name: 'copy-write-platform',
          params: {
            goback: true
          }
        }
      )
    },
    submit() {
      const form = {
        title: this.$store.state.title,
        finish_time: this.$store.state.time,
        mark: this.$store.state.mark,
        url: this.$store.state.url
      }
      addOrder({ ...form, content: this.content }).then(res => {

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
</style>
