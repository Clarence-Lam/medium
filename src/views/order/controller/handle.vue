<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单内容</span>
          </div>
          <div class="blog-content" v-html="order.url" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单信息
              <span style="float: right;">
                <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="previousPage">上一页</el-button>
              </span>
            </span>
          </div>
          <div class="order-detail">
            <div>
              <p class="detail-title">订单编号：</p>
              <span v-if="order.id">{{ (order.id).replace(/-/g, '') }}</span>
            </div>
            <div>
              <p class="detail-title">状态：</p>
              <span :style="order.state==='complaining'?'color:red':''">{{ returnState(order.state) }}</span>
            </div>
            <div>
              <p v-if="order.refuse_reason" class="detail-title">拒绝理由：</p>
              <span>{{ order.refuse_reason }}</span>
            </div>
            <div>
              <p class="detail-title">文章标题：</p>
              <span>{{ order.title }}</span>
            </div>
            <div>
              <p class="detail-title">客户名称：</p>
              <span>{{ order.customer_name }}</span>
            </div>
            <div>
              <p class="detail-title">客户等级：</p>
              <span>{{ getLevel(order.customer_level) }}</span>
            </div>
            <div>
              <p class="detail-title">希望多久完成：</p>
              <span>{{ order.finish_time }}天</span>
            </div>
            <div>
              <p class="detail-title">媒体类型：</p>
              <span>{{ getDept(order.dept) }}</span>
            </div>
            <div v-if="order.sign">
              <p class="detail-title">类型：</p>
              <span>{{ getSign(order.sign) }}</span>
            </div>
            <div v-if="order.type_article">
              <p class="detail-title">文体类型：</p>
              <span>{{ order.type_article }}</span>
            </div>
            <div v-if="order.work_nunber">
              <p class="detail-title">文章字数：</p>
              <span>{{ order.work_nunber }}</span>
            </div>
            <div>
              <p class="detail-title">数量：</p>
              <span>{{ order.num }}</span>
              <span v-if="order.sign === 'copy_write'">（其中{{ numLabel }}）</span>
            </div>
            <div>
              <p class="detail-title">费用：</p>
              <span>{{ order.money }}</span>
            </div>
            <div>
              <p class="detail-title">备注：</p>
              <span>{{ order.mark }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="order.sign === 'copy_write'" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>所属产品</span>
          </div>
          <div class="case-content">
            <el-table
              :key="0"
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
              <el-table-column label="名称" prop="name" align="center">
                <template slot-scope="scope">
                  <span>
                    <a :href="scope.row.url" target="_blank">{{ scope.row.name }}</a>
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-for="item in tableLable" :key="item.key" :label="item.title" :prop="item.key" align="center">
                <template slot-scope="scope">
                  <span v-if="item.key==='agent_price'">{{ $store.state.user.level === '1' ? '代理可看': scope.row[item.key] }}</span>
                  <div v-else-if="item.key==='baidu'">
                    <img :src="getImgUrl(scope.row[item.key])" alt="权重" class="baidu">
                  </div>
                  <span v-else>{{ scope.row[item.key] }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col
        v-if="order.state==='start'||order.state==='plan'||order.state==='working'||order.state==='uphold'||order.state==='complaining'||(verifyRole('admin')&&order.state!=='discard')"
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
      >
        <el-card v-if="verifyRole('technology')||verifyRole('service')" class="box-card">
          <div slot="header" class="clearfix">
            <span>操作</span>
          </div>
          <div class="blog-content">
            <div v-if="order.state!=='discard'">
              <el-form label-width="80px">
                <el-form-item label="备注：">
                  <el-input
                    v-model="mark"
                    type="textarea"
                    placeholder="备注内容"
                    :autosize="{ minRows: 2}"
                  />
                </el-form-item>
              </el-form>
            </div>
            <div
              v-if="order.sign === 'copy_write' && (order.state==='working' ) && verifyRole('technology')"
            >
              <!-- <template v-for="count in order.num">
                <div :key="count" style="margin:5px">
                  链接{{ count }}：<el-input v-model="urlData['url'+count]" style="width: 80%;" />
                </div>
              </template> -->
              <el-form label-width="80px">
                <el-form-item label="链接：">
                  <el-input
                    v-model="urlData"
                    type="textarea"
                    placeholder="请输入链接。一行表示一条链接，链接名称与链接地址用“----”隔开，例如“百度----http://www.baidu.com”"
                    :autosize="{ minRows: 2}"
                  />
                </el-form-item>
              </el-form>

            </div>
            <!-- <div
              v-if="order.state==='uphold' && verifyRole('technology')"
              style="margin:20px"
            >补单链接：<el-input v-model="supplyUrl" style="width: 80%;" />
            </div> -->
            <div style="margin:20px">
              <el-upload
                v-if="order.sign === 'write' && (order.state==='working') && verifyRole('technology')"
                class="upload-demo"
                action="/api/uploadRar"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-progress="toUpload"
                :disabled="uploading"
                accept=".rar,.zip"
              >
                <el-button size="small" type="primary" :loading="uploading">上传文档</el-button>
                <div slot="tip" class="el-upload__tip">{{ uploadTip }}</div>
              </el-upload>
              <el-button v-if="order.state==='start' && verifyRole('service')" class="handle-btn" type="success" @click="handle('plan')">通过</el-button>
              <el-button v-if="order.state!=='discard'&&order.state!=='finish'&&order.state!=='reject'" class="handle-btn" type="danger" @click="handle('reject')">拒绝</el-button>
              <el-button v-if="order.state==='plan' && verifyRole('technology')" class="handle-btn" type="primary" @click="handle('working')">操作</el-button>
              <el-button v-if="(order.state==='working'||order.state==='uphold') && verifyRole('technology')" class="handle-btn" type="warning" @click="handle('stop')">合作停</el-button>
              <el-button v-if="(order.state==='working') && verifyRole('technology')" class="handle-btn" type="success" @click="handle('complete')">完成</el-button>
              <el-button v-if="((order.state==='uphold') || (order.state==='complaining')) && verifyRole('technology')" class="handle-btn" type="primary" @click="toAddUrl()">补单</el-button>
              <el-button v-if="((order.state==='uphold') || (order.state==='complaining')) && verifyRole('service')" class="handle-btn" type="primary" @click="toAddUrl()">查看订单报表</el-button>
              <el-button v-if="(order.state==='uphold') && verifyRole('technology')" class="handle-btn" type="success" @click="handle('finish')">完成</el-button>
              <el-button v-if="$store.state.user.roles[0] === 'admin'&&order.state!=='discard'" class="handle-btn" type="danger" @click="handle('discard')">废弃</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="拒绝理由" :visible.sync="rejectVisible" width="30%">
      <el-form>
        <el-form-item>
          <el-input
            v-model="refuse_reason"
            type="textarea"
            :rows="2"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitReject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderDetail, saveState, submitOrder, failState, finishState, submitOrderRar } from '@/api/orders'

const tableLable = {
  platform: [
    {
      title: '平台',
      key: 'platform'
    }, {
      title: '数量',
      key: 'num'
    }, {
      title: '代理价格',
      key: 'agent_price'
    }, {
      title: '普通用户价格',
      key: 'general_price'
    }, {
      title: '百度权重',
      key: 'baidu'
    }, {
      title: '起始下单量',
      key: 'start_num'
    }, {
      title: '备注',
      key: 'mark'
    }
  ],
  medium: [
    {
      title: '平台',
      key: 'platform'
    }, {
      title: '数量',
      key: 'num'
    }, {
      title: '代理价格',
      key: 'agent_price'
    }, {
      title: '普通用户价格',
      key: 'general_price'
    }, {
      title: '百度权重',
      key: 'baidu'
    }, {
      title: '参考粉丝数',
      key: 'fens_num'
    }, {
      title: '备注',
      key: 'mark'
    }
  ],
  question: [
    {
      title: '平台',
      key: 'platform'
    }, {
      title: '数量',
      key: 'num'
    }, {
      title: '一问几答',
      key: 'yiwenjida'
    }, {
      title: '代理价格',
      key: 'agent_price'
    }, {
      title: '普通用户价格',
      key: 'general_price'
    }, {
      title: '百度权重',
      key: 'baidu'
    }, {
      title: '起始下单量',
      key: 'start_num'
    }, {
      title: '备注',
      key: 'mark'
    }
  ]
}

export default {
  data() {
    return {
      order: {},
      tableLable: [],
      tableData: [],
      url: '',
      supplyUrl: '',
      urlData: '',
      fullscreenLoading: false,
      rejectVisible: false,
      refuse_reason: '',
      mark: '',
      numLabel: '',
      uploading: false,
      uploadTip: '只能上传rar/zip文件，且不超过5MB',
      fileID: '',
      fileName: ''
    }
  },
  created() {
    this.getOrderDetail()
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
    getLevel(value) {
      const level = {
        1: '普通会员',
        2: '黄金会员',
        3: '钻石会员'
      }
      return level[value]
    },
    getSign(value) {
      const sign = {
        write: '文案/问答代写',
        copy_write: '文案/问答发布'
      }
      return sign[value]
    },
    verifyRole(val) {
      if (this.$store.state.user.roles.indexOf('admin') !== -1) {
        return true
      } else if (this.$store.state.user.roles.indexOf(val) !== -1) {
        return true
      } else {
        return false
      }
    },
    getDept(value) {
      const dept = {
        platform: '平台',
        medium: '媒体',
        question: '问答'
      }
      return dept[value]
    },
    getOrderDetail() {
      if (this.$route.params.id) {
        this.fullscreenLoading = true
        getOrderDetail({ id: this.$route.params.id }).then(res => {
          this.fullscreenLoading = false
          this.order = res.data
          this.tableLable = tableLable[res.data.dept]
          this.tableData = JSON.parse(res.data.case_id_json)
          this.mark = res.data.mark
          if (this.order.sign === 'copy_write') {
            let str = ''
            for (const item of this.tableData) {
              str += `${item.name}数量：${item.num},`
            }
            this.numLabel = (str.substring(str.length - 1) === ',') ? str.substring(0, str.length - 1) : str
          }
        })
      } else {
        this.$router.push(
          {
            name: 'controller'
          }
        )
      }
    },
    handle(val) {
      if (val === 'plan' || val === 'working') {
        // 改变状态
        const params = {
          id: this.order.id,
          state: val,
          mark: this.mark
        }
        this.fullscreenLoading = true
        saveState(params).then(res => {
          if (res.status === 200) {
            this.success()
          }
        })
      } else if (val === 'reject') {
        this.rejectVisible = true
      } else if (val === 'complete') {
        this.order.sign === 'write' ? this.verifyRar() : this.verifyUrl()
      } else if (val === 'finish') {
        // 改变状态，扣除金额
        const params = {
          id: this.order.id,
          state: val,
          mark: this.mark
        }
        this.fullscreenLoading = true
        finishState(params).then(res => {
          if (res.status === 200) {
            this.success()
          }
        })
      } else if (val === 'discard') {
        this.$confirm('此操作将永久废弃该订单并且不可逆, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: this.order.id,
            state: 'discard',
            mark: this.mark
          }
          saveState(params).then(res => {
            if (res.status === 200) {
              this.success()
            }
          })
        }).catch(() => {
          console.log('取消')
        })
      }
    },
    verifyUrl() {
      const urlData = this.urlData.replace(new RegExp('\n', 'g'), '||')
      const urlArr = urlData.split('||')
      const arr = []
      //   var regu = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
      var regu = /(http|https):\/\/([\w.]+\/?)\S*/
      var re = new RegExp(regu)
      if (urlData !== '') {
        for (let i = 0; i < urlArr.length; i++) {
          const nameAndUrl = urlArr[i].split('----')
          if (nameAndUrl.length === 2) {
            const name = nameAndUrl[0]
            const url = nameAndUrl[1]
            if (re.test(url)) {
              arr.push({
                name,
                url
              })
            } else {
              this.$message({
                message: `请检查第${i + 1}行，“${url}”的格式是否正确`,
                type: 'warning'
              })
              return
            }
          } else {
            this.$message({
              message: `请检查第${i + 1}行，“${urlArr[i]}”的格式是否正确`,
              type: 'warning'
            })
            return
          }
        }
      } else {
        this.$message({
          message: `请填写链接地址`,
          type: 'warning'
        })
        return
      }
      this.submitOrder(arr)
    },
    verifyRar() {
      if (this.fileID && this.fileName) { this.submitOrder() } else {
        this.$message({
          message: `请选择上传文件`,
          type: 'warning'
        })
        return
      }
    },
    submitOrder(arr) {
      const params = {
        id: this.order.id,
        urlArr: arr,
        mark: this.mark,
        fileID: this.fileID,
        fileName: this.fileName
      }
      this.fullscreenLoading = true
      const submitFunc = this.order.sign === 'copy_write' ? submitOrder : submitOrderRar
      submitFunc(params).then(res => {
        if (res.status === 200) {
          this.success()
        }
      })
    },
    success() {
      this.fullscreenLoading = false
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.$router.push(
        {
          name: 'controller'
        }
      )
    },
    toAddUrl() {
      this.$router.push(
        {
          name: 'addUrl',
          params: {
            id: this.$route.params.id
          }
        }
      )
    },
    submitReject() {
      const reason = this.refuse_reason
      if (reason !== '') {
        // // 改变状态、回退金额
        const params = {
          id: this.order.id,
          state: 'reject',
          refuse_reason: reason,
          mark: this.mark
        }
        this.fullscreenLoading = true
        failState(params).then(res => {
          if (res.status === 200) {
            this.success()
          }
        })
      } else {
        this.$message({
          message: '请输入拒绝理由',
          type: 'warning'
        })
      }
    },
    getImgUrl(i) {
      return require('@/assets/images/baidu' + i + '.png')
    },
    uploadSuccess(response, file, fileList) {
      this.uploading = false
      if (response.code === 200) {
        this.fileID = response.data.fileID
        this.fileName = response.data.fileName
        this.uploadTip = `已选择${response.data.fileName}`
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
    previousPage() {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
.box-card{
    margin:20px
}
.detail-title{
    display: inline-block;
    margin: 10px;
}
.baidu{
    width:75%;
}
.handle-btn{
    margin-top: 5px
}
</style>
<style>
.blog-content img{
    max-width: 100%
}
</style>
