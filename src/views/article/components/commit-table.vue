<template>
  <div>
    <div>
      <el-input v-model="fuzzySearch.name" placeholder="产品名称" style="width:20%" />
      <el-button type="primary" @click="getList()">查询</el-button>
    </div>
    <el-table
      :key="tableKey"
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:20px"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true" width="50" prop="id" />
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
          <div v-if="item.key==='baidu'">
            <img :src="getImgUrl(scope.row[item.key])" alt="权重" class="baidu">
          </div>
          <span v-else-if="item.key==='agent_price'">
            {{ $store.state.user.level === '1' ? '代理可看': scope.row[item.key] }}
          </span>
          <span v-else>{{ scope.row[item.key] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="80" prop="num" align="center">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.num" type="number" placeholder="数量" @blur="blurNum(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="收藏" width="80" prop="collection" align="center">
        <template slot-scope="scope">
          <img :src="getCollectionImg(scope.row.is_collection)" alt="收藏" style="width:45%" @click="toggleCollection(scope.row)">
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
import { getCommitTable, toggleCollection } from '@/api/orders'
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
  ],
  medium: [
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
      title: '参考粉丝数',
      key: 'fens_num'
    }, {
      title: '备注',
      key: 'mark'
    }
  ],
  question: [
    {
      title: '平台',
      key: 'platform'
    },
    {
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
    },
    isSelection: {
      type: Boolean,
      default() {
        return false
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
      currentRow: null,
      fuzzySearch: {
        name: ''
      },
      getRowKeys(row) {
        return row.id
      }
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
        this.listQuery.page = 1
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
      getCommitTable({ dept: this.dept, search: this.caseForm, page: this.listQuery.page, fuzzySearch: this.fuzzySearch }).then(res => {
        const data = []
        for (const item of res.data) {
          item['num'] = item.start_num
          data.push(item)
        }
        this.tableData = data
        this.total = res.num
        if (this.isSelection && this.dept === this.$store.state.dept) {
          this.addSelection(this.$store.state.multipleSelection)
        } else if (this.$store.state.order.pay === this.dept) {
          this.addSelection(this.$store.state.order.multipleSelection)
        }
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
      row.num = Math.floor(row.num)
    },
    getImgUrl(i) {
      return require('@/assets/images/baidu' + i + '.png')
    },
    getCollectionImg(scope) {
      return scope ? require('@/assets/images/collection_true.png') : require('@/assets/images/collection_false.png')
    },
    toggleCollection(row) {
      toggleCollection({ case_id: row.id, collection: !row.is_collection }).then(res => {
        this.getList()
      })
    },
    addSelection(rows) {
      if (rows) {
        this.$refs.multipleTable.clearSelection()
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
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
.baidu{
    width:60%;
    max-width: 80px;
    height: 22px;
}
</style>
