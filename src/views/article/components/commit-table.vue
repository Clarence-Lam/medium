<template>
  <div>
    <el-table
      :key="tableKey"
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="false" label="ID" prop="id" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" align="center">
        <template slot-scope="scope">
          <span>
            <a :href="scope.row.url" target="_blank">{{ scope.row.name }}</a>
          </span>
        </template>
      </el-table-column>
      <el-table-column v-for="item in tableLable" :key="item.key" :label="item.title" :prop="item.key" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row[item.key] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="80" prop="num" align="center">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.num" type="number" placeholder="数量" @blur="blurNum(scope.row)" />
        </template>
      </el-table-column>
      <!--
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" :disabled="row.role==='admin'" type="danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList()" />

  </div>
</template>
<script>
import { getCommitTable } from '@/api/orders'
import Pagination from '@/components/Pagination'

const tableLable = {
  platform: [
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
export default {
  components: { Pagination },
  props: {
    dept: {
      type: String,
      default() {
        return ''
      }
    },
    caseForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      tableKey: 0,
      loading: false,
      tableData: [],
      tableLable: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      multipleSelection: [],
      currentRow: null
    }
  },
  //   computed: {
  //     multipleSelection: function(val) {
  //       console.log(val)
  //       //  this.$parent.handleGetMultiple();
  //       return null
  //     }
  //   },
  watch: {
    caseForm: { // 深度监听，可监听到对象、数组的变化
      handler(newV, oldV) {
        // do something, 可使用this
        // console.log(newV, oldV)
        this.getList()
      },
      deep: true
    },
    multipleSelection: function(val) {
    //   console.log(val)
    //   this.$parent.handleGetMultiple(this.multipleSelection)
    //   return null
      this.sendToParent()
    }
  },
  created() {
    this.tableLable = tableLable[this.dept]
    this.getList()
  },
  methods: {
    getList() {
      getCommitTable({ dept: this.dept, search: this.caseForm }).then(res => {
        const data = []
        for (const item of res.data) {
          item['num'] = item.start_num
          data.push(item)
        }
        this.tableData = data
        this.total = res.num
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    sendToParent() {
      this.$parent.handleGetMultiple(this.multipleSelection)
    },
    delSelection(item) {
      if (item) {
        // item.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(item)
        // })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    blurNum(row) {
      if (row.num < row.start_num) {
        this.$message({
          message: '填写的数量必须大于起始下单量',
          type: 'warning'
        })
        row.num = row.start_num
      }
    }
  }

}
</script>
<style >
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]{
  -moz-appearance: textfield;
}
</style>
