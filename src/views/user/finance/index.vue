<template>
  <div class="app-container">
    <h3 class="app-container-title">财务报表</h3>
    <hr class="app-container-hr">
    <div class="finance_search">
      <el-select v-model="type" placeholder="请选择">
        <el-option label="全部" value="" />
        <el-option label="充值" value="add" />
        <el-option label="消费" value="sub" />
        <el-option label="提现" value="cash" />
      </el-select>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      />
      <el-button size="medium" type="primary" @click="getData()">查询</el-button>
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

      <el-table-column label="订单号" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ cutID(scope.row.id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易时间" prop="created_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易说明" prop="type" align="center">
        <template slot-scope="scope">
          <span>{{ getType(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易金额" prop="money" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易平台" prop="type" align="center">
        <template slot-scope="scope">
          <span>{{ getPlatform(scope.row.type,scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易状态" prop="status" align="center">
        成功
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getData" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getFinanceList } from '@/api/finance'

export default {
  name: 'Finance',
  components: { Pagination },
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      type: '', // 查询的状态
      time: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    cutID(value) {
    //   return value.split('-')[0]
      return value.replace(/-/g, '')
    },
    getData() {
      this.loading = true
      let time = ''
      if (typeof (this.time) === 'object' && this.time !== null) {
        time = this.time[0] + '|' + this.time[1]
      }
      const customer_id = this.$route.params.customer_id || null
      getFinanceList({ page: this.listQuery.page, type: this.type, time: time, customer_id }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
          this.total = res.num
        }
        this.loading = false
      })
    },
    getType(value) {
      const type = {
        add: '充值',
        sub: '消费',
        cash: '提现',
        gift: '赠送'
      }
      return type[value]
    },
    getPlatform(value, row) {
      if (!row.order_id) {
        return row.created_by
      } else if (value === 'add') {
        return '第三方支付平台'
      } else {
        return 'TM媒介'
      }
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
<style lang="scss">
    .el-range-separator{
        padding: 0 !important;
    }
</style>
