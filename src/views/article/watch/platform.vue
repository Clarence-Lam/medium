<template>
  <div>
    <div class="components-container commit-container">
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
        :dept="'platform'"
        :case-form="caseForm"
      />
    </div>
  </div>
</template>
<script>
import { getTypesName, getTypesContent } from '@/api/setting'
// import { addOrder } from '@/api/orders'

import CommitTable from '../components/commit-table'
// import CommitNum from '../components/commit-num'
export default {
  components: { CommitTable },
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
  },
  updated() {
    getTypesContent
  },
  methods: {
    getTypesName() {
      const dept = 'platform'
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
