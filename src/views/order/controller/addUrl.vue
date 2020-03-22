<template>
  <div class="components-container">
    <h3 class="app-container-title" style="width:100%">
      订单报表
      <span style="float: right;">
        <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="previousPage">上一页</el-button>
      </span>
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

      <el-table-column v-if="false" label="id编号" prop="id" align="center">
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
        <el-table-column v-if="$store.state.user.roles[0]==='admin' || $store.state.user.roles[0]==='technology'" label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" @click="showDialog('change',row)">
              修改链接
            </el-button>
            <el-button type="primary" @click="showDialog('add',row)">
              补单链接
            </el-button>
          </template>
        </el-table-column>
      </template>
      <template v-if="sign==='write'">
        <el-table-column label="完成文件" prop="name" align="center">
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
        <el-table-column label="编辑时间" prop="updated_time" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updated_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="补单理由" prop="reason" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.reason }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="$store.state.user.roles[0]==='admin' || $store.state.user.roles[0]==='technology'" label="操作" align="center" width="250" class-name="small-padding fixed-width">
          <template>
            <el-upload
              class="upload"
              action="/api/order/addUrl"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :on-progress="toUpload"
              :disabled="uploading"
              :data="uploadData"
              accept=".rar,.zip"
              :before-upload="beforeUploadChange"
            >
              <el-button size="small" type="primary" :loading="uploading">修改文件</el-button>
            </el-upload>
            <el-upload
              class="upload"
              action="/api/order/addUrl"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :on-progress="toUpload"
              :disabled="uploading"
              :data="uploadData"
              accept=".rar,.zip"
              :before-upload="beforeUploadAdd"
            >
              <el-button size="small" type="success" :loading="uploading">修改补单文件</el-button>
            </el-upload>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <el-dialog :title="title" :visible.sync="show">
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
          { type: 'url', required: true, message: '请输入补单链接地址', trigger: 'blur' }
        ]
      },
      id: '',
      order_id: '',
      title: '',
      sign: '',
      uploading: false,
      uploadData: {
        order_id: '',
        type: '',
        sign: ''
      }

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
            this.uploadData.sign = res.sign
            this.uploadData.order_id = this.$route.params.id
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
    showDialog(type, row) {
      this.show = true
      this.id = row.id
      this.order_id = row.order_id
      if (type === 'change') {
        this.title = '修改链接'
        this.urlForm.url = row.url
      } else {
        this.title = '补单'
        this.urlForm.url = row.add_url
      }
    },
    submit() {
      this.$refs['urlForm'].validate((valid) => {
        if (valid) {
          const params = {
            id: this.id,
            order_id: this.order_id,
            url: this.urlForm.url,
            type: this.title === '修改链接' ? 'change' : 'add',
            sign: this.sign
          }
          addUrl(params).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '补单成功',
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
    },
    uploadSuccess(response, file, fileList) {
      this.uploading = false
      if (response.code === 200) {
        this.fileID = response.data.fileID
        this.fileName = response.data.fileName
        this.$message({
          message: '文件上传成功',
          type: 'success'
        })
        this.getData()
      } else if (response.code === 403) {
        this.$message.error('连接超时，请重新登录')
        this.$store.dispatch('user/logout').then(
          this.$router.push(`/`)
        )
      } else {
        this.$message.error(response.msg)
      }
    },
    uploadError() {
      console.log('失败')
      this.uploading = false
      this.$message.error('上传失败，请重新上传')
    },
    toUpload() {
      this.uploading = true
    },
    beforeUploadChange(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传压缩包大小不能超过 5MB!')
      }
      this.uploadData.type = 'change'
      return isLt5M
    },
    beforeUploadAdd(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传压缩包大小不能超过 5MB!')
      }
      this.uploadData.type = 'add'
      return isLt5M
    },
    previousPage() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
    /deep/.upload{
        display: inline-block;
    }
</style>
