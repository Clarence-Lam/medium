<template>
  <div class="components-container">

    <el-table
      :key="0"
      v-loading="loading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >

      <el-table-column v-if="false" label="地址编号" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" prop="order_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="url" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="补单地址" prop="add_url" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.add_url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="created_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="补单理由" prop="reason" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" :disabled="row.is_add === '1' || row.added === '1' || $route.params.disable" @click="apply(row)">
            申请补单
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getUrl, applyUrl } from '@/api/orders'

export default {
  data() {
    return {
      loading: false,
      tableData: []
    }
  },
  created() {
    this.getData()
  },

  methods: {
    getData() {
      if (this.$route.params.id) {
        this.loading = true
        getUrl({ order_id: this.$route.params.id }).then(res => {
          if (res.status === 200) {
            this.tableData = res.data
          }
          this.loading = false
        })
      } else {
        this.$router.push(
          {
            name: 'my'
          }
        )
      }
    },
    apply(row) {
      this.$prompt('请输入补单理由', '', {
        inputType: 'textarea',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '补单理由必填'
      }).then(({ value }) => {
        const params = {
          id: row.id,
          order_id: row.order_id,
          reason: value
        }
        applyUrl(params).then(res => {
          if (res.status === 200) {
            this.$message({
              message: '申请补单成功',
              type: 'success'
            })
          }
          this.getData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消补单'
        })
      })
    }
  }
}
</script>
