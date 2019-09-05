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
            <span>订单信息</span>
          </div>
          <div class="order-detail">
            <div>
              <p class="detail-title">订单编号：</p>
              <span>{{ order.id }}</span>
            </div>
            <div>
              <p class="detail-title">状态：</p>
              <span>{{ returnState(order.state) }}</span>
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
              <span>{{ order.customer_level }}</span>
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
            </div>
            <div>
              <p class="detail-title">费用：</p>
              <span>{{ order.money }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="order.sign === 'copy_write'" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>所属案例</span>
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
                  <span>{{ scope.row[item.key] }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col
        v-if="order.state==='start'||order.state==='plan'||order.state==='working'||order.state==='uphold'"
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>操作</span>
          </div>
          <div class="blog-content">
            <div
              v-if="order.state==='working' && verifyRole('technology')"
              style="margin:20px"
            >
              <template v-for="count in order.num">
                <div :key="count" style="margin:5px">
                  链接{{ count }}：<el-input v-model="urlData['url'+count]" style="width: 80%;" />
                </div>
              </template>

            </div>
            <!-- <div
              v-if="order.state==='uphold' && verifyRole('technology')"
              style="margin:20px"
            >补档链接：<el-input v-model="supplyUrl" style="width: 80%;" />
            </div> -->
            <div style="margin:20px">
              <el-button v-if="order.state==='start' && verifyRole('service')" type="success" @click="handle('plan')">通过</el-button>
              <el-button type="danger" @click="handle('reject')">拒绝</el-button>
              <el-button v-if="order.state==='plan' && verifyRole('technology')" type="primary" @click="handle('working')">操作</el-button>
              <el-button v-if="(order.state==='working'||order.state==='uphold') && verifyRole('technology')" type="warning" @click="handle('stop')">合作停</el-button>
              <el-button v-if="(order.state==='working') && verifyRole('technology')" type="success" @click="handle('complete')">完成</el-button>
              <el-button v-if="(order.state==='uphold') && verifyRole('technology')" type="primary" @click="toAddUrl()">补档</el-button>
              <el-button v-if="(order.state==='uphold') && verifyRole('technology')" type="success" @click="handle('finish')">完成</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getOrderDetail, saveState, submitOrder, failState, finishState } from '@/api/orders'

const tableLable = {
  platform: [
    {
      title: '平台',
      key: 'platform'
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
      urlData: {},
      fullscreenLoading: false
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
        reject: '已拒绝'
      }
      return state[value]
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
          const num = res.data.num
          for (let i = 0; i < num; i++) {
            this.$set(this.urlData, 'url' + i, '')
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
          state: val
        }
        this.fullscreenLoading = true
        saveState(params).then(res => {
          if (res.status === 200) {
            this.success()
          }
        })
      } else if (val === 'reject') {
        // 改变状态、回退金额
        const params = {
          id: this.order.id,
          state: val
        }
        this.fullscreenLoading = true
        failState(params).then(res => {
          if (res.status === 200) {
            this.success()
          }
        })
      } else if (val === 'complete') {
        this.verifyUrl()
      } else if (val === 'finish') {
        // 改变状态，扣除金额
        const params = {
          id: this.order.id,
          state: val
        }
        this.fullscreenLoading = true
        finishState(params).then(res => {
          if (res.status === 200) {
            this.success()
          }
        })
      }
    },
    verifyUrl() {
      const arr = []
      let verify = true
      var regu = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
      var re = new RegExp(regu)
      for (const item in this.urlData) {
        if (this.urlData[item] !== '') {
          if (re.test(this.urlData[item])) {
            arr.push(this.urlData[item])
          } else {
            verify = false
            const i = item.split('url')
            this.$message({
              message: `请检查链接${i[1]}的地址是否正确`,
              type: 'warning'
            })
          }
        }
      }
      if (arr.length > 0) {
        const params = {
          id: this.order.id,
          urlArr: arr
        }
        this.fullscreenLoading = true
        submitOrder(params).then(res => {
          if (res.status === 200) {
            this.success()
          }
        })
      } else if (verify) {
        this.$message({
          message: `请填写链接地址`,
          type: 'warning'
        })
      }
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
</style>
<style>
.blog-content img{
    max-width: 100%
}
</style>
