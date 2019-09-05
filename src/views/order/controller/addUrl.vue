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
      <el-table-column label="补档地址" prop="add_url" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.add_url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="created_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" @click="showDialog(row)">
            补档链接
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="补档" :visible.sync="show">
      <el-form ref="urlForm" :rules="rules" :model="urlForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="地址:" prop="url">
          <el-input v-model="urlForm.url" />
        </el-form-item>
        <input v-model="id" type="text" hidden>
        <input v-model="order_id" type="text" hidden>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">
          取消
        </el-button>
        <el-button type="primary" @click="submit()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUrl, addUrl } from '@/api/orders'

export default {
  data() {
    return {
      loading: false,
      tableData: [],
      show: false,
      urlForm: {
        url: ''
      },
      rules: {
        url: [
          { type: 'url', required: true, message: '请输入补档链接地址', trigger: 'blur' }
        ]
      },
      id: '',
      order_id: ''
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
            name: 'controller'
          }
        )
      }
    },
    showDialog(row) {
      this.show = true
      this.id = row.id
      this.order_id = row.order_id
    },
    submit() {
      this.$refs['urlForm'].validate((valid) => {
        if (valid) {
          const params = {
            id: this.id,
            order_id: this.order_id,
            add_url: this.urlForm.url
          }
          addUrl(params).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '补档成功',
                type: 'success'
              })
              this.id = ''
              this.order_id = ''
              this.urlForm.url = ''
              this.show = false
            }
            this.getData()
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
