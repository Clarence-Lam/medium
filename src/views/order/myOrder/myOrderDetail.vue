<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card order-content">
          <div slot="header" class="clearfix">
            <span>订单内容</span>
          </div>
          <div class="blog-content" v-html="order.url" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>
              订单信息
              <span style="float: right;">
                <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="previousPage">上一页</el-button>
              </span>
            </span>
          </div>
          <div class="order-detail">
            <div>
              <p class="detail-title">订单编号：</p>
              <span v-if="order.id">{{ order.id.replace(/-/g, '') }}</span>
            </div>
            <div>
              <p class="detail-title">状态：</p>
              <span>{{ returnState(order.state) }}</span>
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
            <!-- <div>
              <p class="detail-title">客户等级：</p>
              <span>{{ order.customer_level }}</span>
            </div> -->
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
        v-if="order.state==='start'||order.state==='plan'||order.state==='working'||order.state==='uphold'"
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
      >
        <el-card v-if="order.state==='uphold'" class="box-card">
          <div slot="header" class="clearfix">
            <span>操作</span>
          </div>
          <div>
            <div style="margin:20px">
              <el-button type="primary" @click="toAddUrl()">申请补单</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getOrderDetail } from '@/api/orders'

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
      urlData: {},
      fullscreenLoading: false,
      numLabel: ''
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
    getDept(value) {
      const dept = {
        platform: '平台',
        medium: '媒体',
        question: '问答'
      }
      return dept[value]
    },
    getSign(value) {
      const sign = {
        write: '文案/问答代写',
        copy_write: '文案/问答发布'
      }
      return sign[value]
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
          let str = ''
          for (const item of this.tableData) {
            str += `${item.name}数量：${item.num},`
          }
          this.numLabel = (str.substring(str.length - 1) === ',') ? str.substring(0, str.length - 1) : str
        })
      } else {
        this.$router.push(
          {
            name: 'my'
          }
        )
      }
    },
    toAddUrl() {
      this.$router.push(
        {
          name: 'addMyUrl',
          params: {
            id: this.$route.params.id,
            disable: this.order.state === 'finish'
          }
        }
      )
    },
    getImgUrl(i) {
      return require('@/assets/images/baidu' + i + '.png')
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
</style>
<style>
.blog-content img{
    max-width: 100%
}
.order-content .el-card__body{
    max-height: 80vh;
    overflow: auto;
}
</style>
