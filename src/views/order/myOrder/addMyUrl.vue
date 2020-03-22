<template>
  <div class="components-container">
    <h3 class="app-container-title" style="width:100%">
      订单报表
      <span style="float: right;margin:0 10px">
        <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="previousPage">上一页</el-button>
      </span>
      <el-button :loading="downloadLoading" class="downloadBtn" size="mini" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </h3>
    <hr class="app-container-hr">
    <el-table
      :key="0"
      v-loading="loading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >

      <el-table-column v-if="false" label="id" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <template v-if="sign==='copy_write'">
        <el-table-column label="标题" prop="name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" prop="url" align="center">
          <template slot-scope="scope">
            <span>
              <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="补单地址" prop="add_url" align="center">
          <template slot-scope="scope">
            <span>
              <a :href="scope.row.add_url" target="_blank">{{ scope.row.add_url }}</a>
            </span>
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
      </template>
      <template v-if="sign==='write'">
        <el-table-column label="完成压缩包" prop="name" align="center">
          <template slot-scope="scope">
            <span>
              <a :href="scope.row.file_url" target="_blank">{{ scope.row.name }}</a>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="补单文件" prop="add_name" align="center">
          <template slot-scope="scope">
            <span>
              <a :href="scope.row.add_file_url" target="_blank">{{ scope.row.add_name }}</a>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="published_time" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.published_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="补单理由" prop="reason" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.reason }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tooltip :content="(row.is_add === '1' || row.added === '1' || $route.params.disable)?'已申请补单或超过可补单时间':'点击进行补单'" placement="top">
            <div>
              <el-button type="primary" :disabled="row.is_add === '1' || row.added === '1' || $route.params.disable" @click="apply(row)">
                申请补单
              </el-button>
            </div>
          </el-tooltip>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getUrl, applyUrl } from '@/api/orders'
// import { parseTime } from '@/utils'

export default {
  data() {
    return {
      loading: false,
      downloadLoading: false,
      tableData: [],
      sign: '',
      orderName: ''
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
            this.sign = res.sign
            this.orderName = res.order_name
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
          reason: value,
          sign: this.sign
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
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        let tHeader = ['标题', '地址', '补单地址', '发布时间', '补单理由']
        let filterVal = ['name', 'url', 'add_url', 'created_time', 'reason']
        if (this.sign === 'write') {
          tHeader = ['完成压缩包', '压缩包地址', '补单文件', '补单文件地址', '发布时间', '补单理由']
          filterVal = ['name', `file_url`, 'add_name', 'add_file_url', 'created_time', 'reason']
        }
        const data = this.formatJson(filterVal, this.tableData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.orderName
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      const host = window.location.host
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'file_url' || j === 'add_file_url') {
          return `${host}/${v[j]}`
        } else {
          return v[j]
        }
      }))
    },
    previousPage() {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
    .downloadBtn{
        /* position: absolute;
        right: 0;
        top: -5%; */
        float: right;
    }
</style>
