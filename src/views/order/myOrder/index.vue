<template>
  <div class="dashboard-container">
    <el-table
      :key="0"
      v-loading="loading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >

      <el-table-column label="订单编号" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ cutID(scope.row.id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" prop="title" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
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
          <span>{{ returnState(scope.row.state) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="showDetail(row)">
            查看
          </el-button>
          <!-- <el-button size="mini" :disabled="row.role==='admin'" type="danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getData" />

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
    returnState: function(value) {
      const state = {
        start: '未审核',
        plan: '已安排',
        working: '操作中',
        stop: '合作停',
        finish: '已完成',
        uphold: '维护中',
        reject: '已拒绝'
      }
      return state[value]
    },
    cutID(value) {
      return value.split('-')[0]
    },
    getData() {
      this.loading = true
      getMyOrder({ page: this.listQuery.page }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
          this.total = res.num
        }
        this.loading = false
      })
    },
    showDetail(row) {
      this.$router.push(
        {
          name: 'myOrderDetail',
          params: {
            id: row.id
          }
        }
      )
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
