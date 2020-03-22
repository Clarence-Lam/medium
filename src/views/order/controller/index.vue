<template>
  <div class="components-container">
    <h3 class="app-container-title">
      订单管理{{ this.$route.params.customer_id?'详情':'' }}
      <span v-if="this.$route.params.customer_id" class="app-container-tips">
        充值总金额:{{ money.allIn }},
        赠送金额:{{ money.giftAll }},
        账面总金额:{{ money.allAmount }},
        已消耗金额:{{ money.actualConsumption }},
        已提现:{{ money.withdrawalAmount }},
        充值余额:{{ money.balanceAmount }},
        赠送余额:{{ money.giftAmount }}
      </span>
    </h3>
    <hr class="app-container-hr">
    <div class="order_search filter-col">
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
      <el-input v-model="custName" placeholder="用户名" style="width: 200px;" class="filter-item filter-col" @keyup.enter.native="handleFilter" />
      <el-input v-model="orderId" placeholder="订单编号" style="width: 200px;" class="filter-item filter-col" @keyup.enter.native="handleFilter" />
      <el-date-picker
        v-model="search.created_time"
        type="daterange"
        range-separator="至"
        start-placeholder="订单提交开始日期"
        end-placeholder="订单提交结束日期"
        value-format="yyyy-MM-dd"
        class="filter-col"
      />
      <el-date-picker
        v-model="search.published_time"
        type="daterange"
        range-separator="至"
        start-placeholder="发布开始日期"
        end-placeholder="发布结束日期"
        value-format="yyyy-MM-dd"
        class="filter-col"
      />
      <el-button size="medium" type="primary" icon="el-icon-search" @click="handleFilter()">查询</el-button>
    </div>
    <el-table
      :key="0"
      v-loading="loading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >

      <el-table-column label="用户名" prop="customer_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.customer_name }}</span>
        </template>
      </el-table-column>
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
          <span :style="scope.row.state==='complaining'||scope.row.state==='discard'?'color:red':''">{{ returnState(scope.row.state) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="updated_by" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_by }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="mark" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="showDetail(row)">
            跟进
          </el-button>
          <!-- <el-button size="mini" :disabled="row.role==='admin'" type="danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button> -->
          <el-button type="success" size="small" @click="toAddUrl(row)">
            订单报表
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-if="sonRefresh" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getData" />

  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getOrderTable } from '@/api/orders'
import { getPersonalFinance } from '@/api/finance'
// import { constants } from 'crypto'

export default {
  name: 'Controller',
  components: { Pagination },
  data() {
    return {
      sonRefresh: false, // 强制刷新翻页
      loading: false,
      tableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      state: '', // 查询的状态
      custName: null,
      orderId: null,
      search: {
        created_time: null,
        published_time: null
      },
      submitForm: {
        created_time: null,
        published_time: null
      },
      money: {
        allIn: 0,
        giftAll: 0,
        allAmount: 0,
        actualConsumption: 0,
        withdrawalAmount: 0,
        balanceAmount: 0,
        giftAmount: 0
      }
    }
  },
  //   computed: {
  // 计算属性的 getter

  //   },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'handle' || from.name === 'myOrderDetail' ||
      from.name === 'addMyUrl' || from.name === 'addUrl') {
        vm.setPreviousPage()
      }
      vm.getData()
      vm.getPersonalFinance()
    })
  },
  created() {
    // console.log(this.$router)
    // this.listQuery.page = 3
    // this.$nextTick(() => {
    //   this.listQuery.page = this.listQuery.page
    // })
    // this.search.created_time = ['2019-12-01', '2019-12-31']
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
      const customer_id = this.$route.params.customer_id || null
      let time = null
      if (typeof (this.search.created_time) === 'object' && this.search.created_time !== null) {
        time = this.search.created_time[0] + '|' + this.search.created_time[1]
        this.submitForm.created_time = time
      } else {
        this.submitForm.created_time = null
      }
      if (typeof (this.search.published_time) === 'object' && this.search.published_time !== null) {
        time = this.search.published_time[0] + '|' + this.search.published_time[1]
        this.submitForm.published_time = time
      } else {
        this.submitForm.published_time = null
      }
      const custName = this.custName || null
      const orderId = this.orderId || null
      getOrderTable({
        page: this.listQuery.page,
        request_state: this.state,
        customer_id,
        ...this.submitForm,
        custName, orderId
      }).then(res => {
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
        state: this.state,
        customer_id: this.$route.params.customer_id || null,
        created_time: this.search.created_time,
        published_time: this.search.published_time
      }
      this.$router.push(
        {
          name: 'handle',
          params: {
            id: row.id
          }
        }
      )
    },
    toAddUrl(row) {
      this.$store.state.order.previousPage = {
        page: this.listQuery.page,
        state: this.state,
        customer_id: this.$route.params.customer_id || null,
        created_time: this.search.created_time,
        published_time: this.search.published_time
      }
      this.$router.push(
        {
          name: 'addUrl',
          params: {
            id: row.id
          }
        }
      )
    },
    getPersonalFinance() {
      if (this.$route.params.customer_id) {
        getPersonalFinance({ customer_id: this.$route.params.customer_id }).then(res => {
          if (res.status === 200) {
            this.money.allIn = res.allIn
            this.money.giftAll = res.giftAll
            this.money.allAmount = res.allAmount
            this.money.actualConsumption = res.actualConsumption
            this.money.withdrawalAmount = res.withdrawalAmount
            this.money.balanceAmount = res.balanceAmount
            this.money.giftAmount = res.giftAmount
          }
        })
      }
    },
    setPreviousPage() {
      const previousPage = this.$store.state.order.previousPage
      this.listQuery.page = previousPage.page
      this.state = previousPage.state
      this.search.created_time = previousPage.created_time
      this.search.published_time = previousPage.published_time
    }
  }
}
</script>
<style scoped>
.order_search{
    margin: 20px 0;
}
.app-container-tips{
    color: black;
    font-size: 14px;
}
.filter-col{
    margin: 5px 0;
}
</style>
<style lang="scss">
    .el-range-separator{
        padding: 0 !important;
    }
</style>
