<template>
  <div class="app-container">
    <h3 class="app-container-title">广告管理</h3>
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

      <el-table-column label="广告id" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ cutID(scope.row.id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="填写人" prop="user_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="content" align="center">
        <template slot-scope="scope">
          <span v-html="scope.row.content" />
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state" align="center">
        <template slot-scope="scope">
          <span>{{ getState(scope.row.state) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下线时间" prop="end_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="small" type="success" @click="handle(row)">
            操作
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getData" />

    <el-dialog title="审核" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form">
        <el-form-item label="状态:" label-width="80px">
          <el-select v-model="form.state" placeholder="请选择状态" @change="change">
            <el-option label="未审核" value="unaudited" />
            <el-option label="通过" value="audited" />
            <el-option label="不通过" value="fail" />
            <el-option label="已下线" value="offline" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.state === 'audited'" label="下线时间:" label-width="80px">
          <el-date-picker
            v-model="form.end_time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="checkOutState">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getAllAd, changeAd } from '@/api/setting'

export default {
  name: 'Ad',
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
      dialogFormVisible: false,
      form: {
        id: null,
        state: null,
        end_time: null
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
    getState(value) {
      const state = {
        unaudited: '未审核',
        audited: '已审核',
        fail: '不通过',
        offline: '已下线'
      }
      return state[value]
    },
    getData() {
      this.loading = true
      getAllAd({ page: this.listQuery.page }).then(res => {
        this.loading = false
        this.tableData = res.data
        this.total = res.num
      })
    },
    handle(row) {
      this.dialogFormVisible = true
      this.form.state = row.state
      this.form.id = row.id
      this.form.end_time = row.end_time
    },
    change(val) {
      if (val !== 'audited') {
        this.form.end_time = null
      }
    },
    checkOutState() {
      if (this.form.state === 'audited' && this.form.end_time === null) {
        this.$message.error('下线时间必须选择')
        return
      }
      this.loading = true
      changeAd({
        ...this.form
      }).then(res => {
        this.loading = false
        if (res.status === 200) {
          this.dialogFormVisible = false
          this.$message({
            message: '更新成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.msg)
        }
        this.getData()
      })
    }
  }
}
</script>
<style lang="scss" scope>
    @import "~@/styles/emoji/emoji.css";
    span.emoji{
            background-size: inherit !important;
            width:20px !important;
            height: 20px!important;
            vertical-align: sub!important;
        }
</style>
