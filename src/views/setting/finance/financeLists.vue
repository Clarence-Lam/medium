<template>
  <div class="components-container">
    <h3 class="app-container-title">订单管理详情</h3>
    <span>总费用xxxx</span>
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
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="订单提交开始日期"
        end-placeholder="订单提交结束日期"
        value-format="yyyy-MM-dd"
      />
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="发布开始日期"
        end-placeholder="发布结束日期"
        value-format="yyyy-MM-dd"
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getData" />

  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getOrderTable } from '@/api/orders'

export default {
  name: 'OrderController',
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
      state: ''// 查询的状态
    }
  },
  computed: {
    // 计算属性的 getter

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
    handleFilter() {
      this.listQuery.page = 1
      this.getData()
    },
    getData() {
      this.loading = true
      getOrderTable({ page: this.listQuery.page, request_state: this.state }).then(res => {
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
          name: 'handle',
          params: {
            id: row.id
          }
        }
      )
    },
    toAddUrl(row) {
      this.$router.push(
        {
          name: 'addUrl',
          params: {
            id: row.id
          }
        }
      )
    }
  }
}
</script>
<style scoped>
.order_search{
    margin: 20px 0;
}
</style>
