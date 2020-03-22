<template>
  <div class="dashboard-container">
    <h3 class="app-container-title">我的订单</h3>
    <hr class="app-container-hr">
    <div class="order_search">
      <el-select v-model="state" placeholder="请选择">
        <el-option label="全部订单" value="" />
        <el-option label="未分配订单" value="start" />
        <el-option label="已安排" value="plan" />
        <el-option label="操作中" value="working" />
        <el-option label="完成订单" value="finish" />
        <el-option label="投诉订单" value="complaining" />
        <el-option label="合作停" value="stop" />
        <el-option label="维护中" value="uphold" />
        <el-option label="已拒绝" value="reject" />
        <el-option label="已废弃" value="discard" />
      </el-select>
      <el-button size="medium" type="primary" icon="el-icon-search" @click="handleFilter()">查询</el-button>
    </div>
    <el-table
      :key="0"
      v-loading="loading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:20px"
    >

      <el-table-column label="订单编号" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ cutID(scope.row.id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="sign" align="center">
        <template slot-scope="scope">
          <span>{{ getSign(scope.row.sign) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="num" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用" prop="money" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" prop="created_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="published_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.published_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state" align="center">
        <template slot-scope="scope">
          <span :style="scope.row.state==='complaining||discard'?'color:red':''">{{ returnState(scope.row.state) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="mark" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="showDetail(row)">
            订单详情
          </el-button>
          <el-button size="small" :disabled="row.role==='admin'" type="success" @click="showUrl(row)">
            订单报表
          </el-button>
          <el-button size="small" :disabled="row.role==='admin'" type="warning" @click="repeat(row)">
            再发布
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-if="sonRefresh" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getData" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getMyOrder } from '@/api/orders'

export default {
  name: 'MyOrder',
  components: { Pagination },
  data() {
    return {
      loading: false,
      sonRefresh: false, // 强制刷新翻页
      tableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      state: ''// 查询状态
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'handle' || from.name === 'myOrderDetail' ||
      from.name === 'addMyUrl' || from.name === 'addUrl') {
        vm.setPreviousPage()
      }
      vm.getData()
    })
  },
  created() {
    // this.getData()
  },
  methods: {
    returnState: function(value) {
      const state = {
        start: '未审核',
        plan: '已安排',
        working: '操作中',
        stop: '合作停',
        finish: '已完成',
        uphold: '维护中',
        reject: '已拒绝',
        complaining: '投诉中',
        discard: '已废弃'
      }
      return state[value]
    },
    cutID(value) {
    //   return value.split('-')[0]
      return value.replace(/-/g, '')
    },
    getSign(value) {
      const sign = {
        write: '文章代写',
        copy_write: '文章发布'
      }
      return sign[value]
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getData()
    },
    getData() {
      this.loading = true
      getMyOrder({ page: this.listQuery.page, search: { state: this.state }}).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
          this.total = res.num
        }
        this.loading = false
        this.sonRefresh = true
      })
    },
    showDetail(row) {
      this.$store.state.order.previousPage = {
        page: this.listQuery.page,
        state: this.state
      }
      this.$router.push(
        {
          name: 'myOrderDetail',
          params: {
            id: row.id
          }
        }
      )
    },
    showUrl(row) {
      this.$store.state.order.previousPage = {
        page: this.listQuery.page,
        state: this.state
      }
      this.$router.push(
        {
          name: 'addMyUrl',
          params: {
            id: row.id,
            disable: row.state === 'finish'
          }
        }
      )
    },
    repeat(row) {
      if (row.sign === 'write') {
        this.$router.push(
          {
            name: `write-${row.dept}`,
            params: {
              id: row.id,
              row: row,
              repeat: true
            }
          }
        )
      } else if (row.sign === 'copy_write') {
        this.$router.push(
          {
            name: `copy-write-${row.dept}`,
            params: {
              id: row.id,
              row: row,
              repeat: true
            }
          }
        )
      }
    },
    setPreviousPage() {
      console.log(this.$store.state.order.previousPage)
      const previousPage = this.$store.state.order.previousPage
      this.listQuery.page = previousPage.page
      this.state = previousPage.state
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
