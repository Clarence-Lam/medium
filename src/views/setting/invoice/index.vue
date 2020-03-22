<template>
  <div class="app-container">
    <h3 class="app-container-title">发票申请记录</h3>
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
      <el-table-column label="客户姓名" prop="customer_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.customer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票类型" prop="type" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票抬头" prop="title" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="税务登记证号" prop="tax_registry_number" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tax_registry_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请金额" prop="invoice_money" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.invoice_money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop="created_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票时间" prop="updated_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="showDetail(row)">
            查看详情
          </el-button>
          <el-button size="small" type="success" @click="buildBill(row)">
            操作
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getData" />

    <el-dialog
      title="发票详情"
      :visible.sync="detailVisible"
      width="30%"
    >
      <p>客户名称：{{ invoiceRow.customer_name }}</p>
      <p>发票类型：{{ invoiceRow.type }}</p>
      <p>发票抬头：{{ invoiceRow.title }}</p>
      <p>税务登记证号：{{ invoiceRow.tax_registry_number }}</p>
      <p>发票明细：{{ invoiceRow.detailed_invoice }}</p>
      <p>申请金额：{{ invoiceRow.invoice_money }}</p>
      <p>收件姓名：{{ invoiceRow.name }}</p>
      <p>联系电话：{{ invoiceRow.phone }}</p>
      <p>收件地址：{{ invoiceRow.address }}</p>
      <p>备注：{{ invoiceRow.mark }}</p>
      <p>实际开票金额：{{ invoiceRow.real_money||0 }}</p>
      <p>状态：{{ invoiceRow.state }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="发票" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="状态" label-width="120px">
          <el-select v-model="form.state" placeholder="请选择状态">
            <el-option label="未处理" value="未处理" />
            <el-option label="已开票" value="已开票" />
            <el-option label="忽略" value="忽略" />
          </el-select>
        </el-form-item>
        <el-form-item label="实际开票金额" label-width="120px">
          <el-input v-model.number="form.real_money" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item label="备注" label-width="120px">
          <el-input v-model="form.mark" autocomplete="off" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateBill()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getInvoiceList, updateBill } from '@/api/finance'

export default {
  name: 'Invoice',
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
      detailVisible: false,
      dialogFormVisible: false,
      invoiceRow: {},
      form: {
        state: '未处理',
        real_money: null,
        mark: ''
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
    getData() {
      this.loading = true
      getInvoiceList({ page: this.listQuery.page }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
          this.total = res.num
        }
        this.loading = false
      })
    },
    showDetail(row) {
      this.detailVisible = true
      this.invoiceRow = row
    },
    buildBill(row) {
      this.dialogFormVisible = true
      this.form.state = row.state || '未处理'
      this.form.real_money = row.real_money || null
      this.form.mark = row.mark
      this.invoiceRow = row
    },
    updateBill() {
      this.dialogFormVisible = false
      const params = {
        id: this.invoiceRow.id,
        real_money: this.form.real_money,
        state: this.form.state,
        mark: this.form.mark
      }
      updateBill(params).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
        this.getData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
