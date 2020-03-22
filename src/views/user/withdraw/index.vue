<template>
  <div class="app-container">
    <h3 class="app-container-title">提现记录</h3>
    <el-button type="warning" plain style="margin-left:20px" @click="withdraw">申请提现</el-button>
    <hr class="app-container-hr">
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
      <el-table-column label="提现金额" prop="money" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" prop="real_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付宝账号" prop="alipay" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alipay }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="mark" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="现状态" prop="status" align="center">
        成功
      </el-table-column>
      <el-table-column label="创建时间" prop="created_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_time }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getData" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getWithdrawList } from '@/api/finance'

export default {
  name: 'Withdraw',
  components: { Pagination },
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      }
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
    withdraw() {
      window.open(this.$store.state.user.qqUrl, '_blank')
    },
    getData() {
      this.loading = true
      getWithdrawList({ page: this.listQuery.page }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
          this.total = res.num
        }
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
