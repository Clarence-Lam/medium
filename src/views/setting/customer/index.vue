<template>
  <div class="app-container">
    <h3 class="app-container-title">客户管理</h3>
    <hr class="app-container-hr">
    <!-- <div class="search-box">
      <el-input v-model="customerName" placeholder="请输入内容" class="input-with-select">
        <template slot="prepend">用户名</template>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
    </div> -->
    <div class="filter-container">
      <el-input v-model="customerName" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="phone" placeholder="手机号码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="QQ" placeholder="QQ" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
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
      <el-table-column v-if="false" label="ID" prop="id" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="phone" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="QQ号" prop="qq" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.qq }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信" prop="wechat" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wechat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名" prop="company" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="created_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近登录时间" prop="last_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" prop="money" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <span>{{ getStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" prop="level" align="center">
        <template slot-scope="scope">
          <span>{{ getLevel(scope.row.level) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="mark" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="$store.state.user.roles[0]==='admin'" type="primary" size="small" class="customer-btn" @click="showInfo(row)">
            修改客户资料
          </el-button>
          <el-button size="small" type="success" class="customer-btn" @click="changeMoney(row)">
            资金调整
          </el-button>
          <el-button size="small" :type="row.status==='1'?'danger':'success'" class="customer-btn" @click="toggleStatus(row)">
            {{ row.status==='1'?'禁用':'启用' }}
          </el-button>
          <el-button size="small" type="info" class="customer-btn" @click="showLevel(row)">
            会员等级
          </el-button>
          <el-button size="small" type="warning" class="customer-btn" @click="showMark(row)">
            备注
          </el-button>
          <el-button size="small" type="danger" class="customer-btn" @click="showStatement(row)">
            财务表报
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList()" />

    <!-- 用户信息弹窗 -->
    <el-dialog title="收货地址" :visible.sync="custInfo">
      <el-form :model="infoForm" :inline="true">
        <el-form-item label="用户名：" :label-width="formLabelWidth">
          <el-input v-model="infoForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号码：" :label-width="formLabelWidth">
          <el-input v-model="infoForm.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="推荐人：" :label-width="formLabelWidth">
          <el-input v-model="infoForm.recommender" autocomplete="off" />
        </el-form-item>
        <el-form-item label="QQ：" :label-width="formLabelWidth">
          <el-input v-model="infoForm.qq" autocomplete="off" />
        </el-form-item>
        <el-form-item label="微信：" :label-width="formLabelWidth">
          <el-input v-model="infoForm.wechat" autocomplete="off" />
        </el-form-item>
        <el-form-item label="公司名称：" :label-width="formLabelWidth">
          <el-input v-model="infoForm.company" autocomplete="off" />
        </el-form-item>
        <!-- <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="custInfo = false">取 消</el-button>
        <el-button type="primary" @click="updateCust">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 会员等级弹窗 -->
    <el-dialog title="更改等级" :visible.sync="levelVisible" width="30%">
      <el-form :model="levelForm">
        <el-form-item label="用户等级" :label-width="formLabelWidth">
          <el-select v-model="levelForm.level">
            <el-option label="普通会员" value="1" />
            <el-option label="黄金会员" value="2" />
            <el-option label="钻石会员" value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="levelVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeLevel">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 备注弹窗 -->
    <el-dialog title="备注" :visible.sync="markVisible" width="30%">
      <el-form :model="markForm">
        <el-form-item>
          <el-input
            v-model="markForm.mark"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="markVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeMark">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 资金调整弹窗 -->
    <el-dialog title="收货地址" :visible.sync="moneyFormVisible">
      <el-form ref="moneyForm" :model="moneyForm" :inline="true" class="moneyForm" :rules="moneyRules">
        <el-form-item label="操作" label-width="80px" prop="way">
          <el-select v-model="moneyForm.way" placeholder="请选择活动区域">
            <el-option label="充值" value="add" />
            <el-option label="消费" value="sub" />
            <el-option label="提现" value="cash" />
            <el-option label="赠送" value="gift" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作金额" label-width="80px" prop="money">
          <el-input v-model.number="moneyForm.money" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item v-if="moneyForm.way === 'cash'" label="真实姓名" label-width="80px" prop="name">
          <el-input v-model="moneyForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="moneyForm.way === 'cash'" label="支付宝" label-width="80px">
          <el-input v-model="moneyForm.alipay" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="moneyForm.way === 'cash'" label="备注" label-width="80px">
          <el-input v-model="moneyForm.mark" autocomplete="off" style="width:500px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moneyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetMoneyForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getCustomer, updateCust } from '@/api/setting'
import { changeMoney } from '@/api/finance'

export default {
  components: { Pagination },
  data() {
    return {
      loading: false,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      customerName: '',
      phone: '',
      QQ: '',
      custInfo: false,
      infoForm: {
        name: '',
        phone: '',
        recommender: '',
        qq: '',
        wechat: '',
        company: ''
      },
      rowID: '',
      formLabelWidth: '120px',
      levelVisible: false,
      levelForm: {
        level: ''
      },
      markVisible: false,
      markForm: {
        mark: ''
      },
      moneyFormVisible: false,
      moneyForm: {
        way: 'add',
        money: null,
        name: '',
        alipay: '',
        mark: ''
      },
      moneyRules: {
        money: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { type: 'number', message: '金额必须为数字值' }
        ],
        way: [
          { required: true, message: '请选择操作', trigger: 'change' }
        ],
        name: [
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      changeRow: {
        customer_id: '',
        customer_name: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getLevel(val) {
      const item = {
        '1': '普通会员',
        '2': '黄金会员',
        '3': '钻石会员'
      }
      return item[val]
    },
    getStatus(val) {
      const item = {
        '1': '正常',
        '0': '已禁用'
      }
      return item[val]
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getCustomer({ name: this.customerName, phone: this.phone, QQ: this.QQ, page: this.listQuery.page }).then(res => {
        this.tableData = res.data
        this.total = res.num
        this.loading = false
      })
    },
    showInfo(row) {
      this.custInfo = true
      Object.keys(this.infoForm).forEach(key => { this.infoForm[key] = row[key] || '' })
      this.rowID = row.id
    },
    updateCust() {
      updateCust({ id: this.rowID, infoForm: this.infoForm }).then(res => {
        this.custInfo = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getList()
      })
    },
    changeMoney(row) {
      // 资金调整可分为增加、减少、提现
      this.moneyFormVisible = true
      this.changeRow.customer_id = row.id
      this.changeRow.customer_name = row.name
    },
    showStatement(row) {
    //   this.$notify.error({
    //     // title: '错误',
    //     message: '充值功能完成后完善'
    //   })
      this.$router.push(
        {
          name: 'finance-cust',
          params: {
            customer_id: row.id
          }
        }
      )
    },
    toggleStatus(row) {
      const infoForm = {}
      row.status === '1' ? infoForm.status = '0' : infoForm.status = '1'
      updateCust({ id: row.id, infoForm }).then(res => {
        this.custInfo = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getList()
      })
    },
    showLevel(row) {
      this.levelVisible = true
      this.levelForm.level = row.level
      this.rowID = row.id
    },
    showMark(row) {
      this.markVisible = true
      this.markForm.mark = row.mark
      this.rowID = row.id
    },
    changeLevel() {
      updateCust({ id: this.rowID, infoForm: this.levelForm }).then(res => {
        this.levelVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getList()
      })
    },
    changeMark() {
      updateCust({ id: this.rowID, infoForm: this.markForm }).then(res => {
        this.markVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getList()
      })
    },
    resetMoneyForm() {
      this.$refs['moneyForm'].validate((valid) => {
        if (valid) {
          if (this.moneyForm.money < 0) {
            this.$message({
              message: '金额必须为正数',
              type: 'warning'
            })
            return
          }
          const params = {
            customer_id: this.changeRow.customer_id,
            customer_name: this.changeRow.customer_name,
            type: this.moneyForm.way,
            money: this.moneyForm.money,
            real_name: this.moneyForm.name,
            alipay: this.moneyForm.alipay,
            mark: this.moneyForm.mark
          }
          this.loading = true
          this.moneyFormVisible = false
          changeMoney(params).then(res => {
            this.loading = false
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.$refs['moneyForm'].resetFields()
            this.getList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style  scoped>
.customer-btn{
    margin: 5px;
}
.search-box{
    margin: 20px 0;
    /* width: 300px; */
}
/* .moneyForm .el-form-item{
    width: 45%;
} */
.moneyForm /deep/.el-form-item__content{
    width: 200px;
}
</style>
