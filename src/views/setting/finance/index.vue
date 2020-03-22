<template>
  <div class="app-container">
    <h3 class="app-container-title">财务管理</h3>
    <hr class="app-container-hr">
    <div class="filter-container">
      <el-input v-model="searchForm.customerName" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="searchForm.recommender" placeholder="推荐人" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker
        v-model="daterange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        class="filter-item"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column v-if="false" label="ID" prop="id" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="custName" align="center">
        <template slot-scope="scope">
          <a href="#" @click.prevent="jumpToPersonal(scope.row.id)">
            {{ scope.row.custName }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" prop="allIn" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.allIn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="赠送金额" prop="giftAll" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.giftAll }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账面总金额" prop="allAmount" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.allAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已消耗金额" prop="actualConsumption" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.actualConsumption }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已提现" prop="withdrawalAmount" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.withdrawalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值余额" prop="balanceAmount" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.balanceAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="赠送余额" prop="giftAmount" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.giftAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐人" prop="recommender" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.recommender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="jumpToCol(row)">
            订单详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList()" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getFinances } from '@/api/finance'

export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      loading: false,
      listLoading: false,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      searchForm: {
        customerName: '',
        recommender: '',
        daterange: null
      },
      daterange: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      let time = ''
      if (typeof (this.daterange) === 'object' && this.daterange !== null) {
        time = this.daterange[0] + '|' + this.daterange[1]
        this.searchForm.daterange = time
      } else {
        this.searchForm.daterange = null
      }
      getFinances({ ...this.searchForm, page: this.listQuery.page }).then(res => {
        this.listLoading = false
        if (res.status === 200) {
          this.tableData = res.data
          this.total = res.num
        }
      })
    },
    jumpToPersonal(id) {
      this.$router.push(
        {
          name: 'finance-cust',
          params: {
            customer_id: id
          }
        }
      )
    },
    jumpToCol(row) {
      this.$router.push(
        {
          name: 'controller',
          params: {
            customer_id: row.id
          }
        }
      )
    }
  }
}
</script>
<style lang="scss">
    .el-range-separator{
        padding: 0 !important;
    }
</style>
