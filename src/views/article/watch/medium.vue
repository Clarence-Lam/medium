<template>
  <div>
    <div class="components-container commit-container">
      <h3 class="app-container-title">媒体推广展示</h3>
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
        :dept="'medium'"
        :case-form="caseForm"
      />
    </div>
    <div class="footer">
      <div style="margin: 5px;text-align:center">
        <!-- <router-link to="/article/copy-write-medium"> -->
        <el-button type="success" class="diglog-btn" style="margin-left:-17%" @click="gotoCopyWrite">前往发布产品</el-button>
        <!-- </router-link> -->
      </div>
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
      multipleSelection: [],
      dept: 'medium'
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
      const dept = 'medium'
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
    gotoCopyWrite() {
      this.$store.state.multipleSelection = this.multipleSelection
      this.$store.state.dept = this.dept
      this.$router.push(
        {
          name: `copy-write-${this.dept}`,
          params: {
            isSelection: true
          }
        }
      )
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
.footer{
    width: 100%;
    height: 45px;
    position: fixed;
    bottom: 0;
    background: #4795C5;
    z-index: 9999;
}
</style>
