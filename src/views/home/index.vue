<template>
  <div class="app-container">
    <div class="home-container">
      <el-row :gutter="20" style="margin-top:-10px">
        <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12"><user /></el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12"><manager /></el-col> -->
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-card class="box-card home-top">
            <h2 class="home-title">越光科技</h2>
            <p class="level">{{ getUserLevel() }}</p>
            <div>
              <p class="last-time">您好 {{ $store.state.user.name }} 您的上一次登录时间 {{ $store.state.user.lastTime }}</p>
              <div class="progree-box">
                <p class="wanshang">完善信息</p>
                <p class="progree-body">
                  <el-progress :percentage="50" color="rgb(123,177,79)" />
                </p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-card class="content-card line1">
            <div class="content-title">
              <img src="../../assets/home/money.png" alt="账户资金">
              <p>账户资金</p>
            </div>
            <div class="money-box">
              <div class="balance-money">
                <p class="money">31264.76</p>
                <span>账户余额</span>
              </div>
              <!-- <el-divider direction="vertical" /> -->
              <div class="divider" />
              <div class="balance-money">
                <p>31264.76</p>
                <span>冻结余额</span>
              </div>
            </div>
            <div class="money-btn-box">
              <el-button type="warning" @click="invest">充值</el-button>
              <el-button type="info" @click="withdraw">提现</el-button>
              <a target="_blank" @click.prevent="showMoneyDetail">
                <span class="money-detail">查看资金明细></span>
              </a>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="5" :lg="5" :xl="5">
          <el-card class="content-card line1">
            <div class="content-title">
              <img src="../../assets/home/myOrder.png" alt="我的订单">
              <p>我的订单</p>
            </div>
            <div class="my-order">
              <router-link to="/myOrder/my">
                <!-- <a href="#"> -->
                <img src="../../assets/home/order.png" alt="消费订单">
                <!-- </a> -->
                <p>消费订单</p>
              </router-link>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
          <el-card class="content-card helper line1">
            <p class="helper-title">帮助中心</p>
            <el-divider />
            <el-tabs v-model="activeFlow">
              <el-tab-pane label="发稿流程" name="first" class="helper-tags">
                <img src="../../assets/home/process_fagao.png" alt="发稿流程">
              </el-tab-pane>
              <el-tab-pane label="收稿流程" name="second" class="helper-tags">
                <img src="../../assets/home/process_shougao.png" alt="收稿流程">
              </el-tab-pane>
              <el-tab-pane label="注意事项" name="third" class="helper-tags">注意事项</el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <el-card class="content-card line2">
            <div class="content-title">
              <img src="../../assets/home/mg.png" alt="客户经理">
              <p>客户经理</p>
            </div>
            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <p><span>联系人:</span><span>越光科技</span></p>
                <p><span>QQ:</span><span>475603284</span></p>
                <p><span>微信:</span><span>xxxx</span></p>
                <p><span>手机号码:</span><span>13510520707</span></p>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <p style="margin: 5px;">微信二维码</p>
                <div style="text-align: center;">
                  <img src="../../assets/home/wechat.jpg" alt="微信二维码" style="width: 80%;">
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
          <el-card class="content-card helper line2">
            <p class="helper-title">产品介绍</p>
            <el-divider />
            <el-row>
              <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="product-box">
                <div class="product">
                  <img src="../../assets/home/question.png" alt="问答推广">
                  <p class="product-title">问答推广</p>
                  <p class="product-intro">让问题更简单</p>
                  <router-link to="/article/copy-write-question">
                    <el-button class="product-btn" type="warning">查看</el-button>
                  </router-link>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="product-box">
                <div class="product">
                  <img src="../../assets/home/platform.png" alt="平台推广">
                  <p class="product-title">平台推广</p>
                  <p class="product-intro">轻松发布，不费事儿</p>
                  <router-link to="/article/copy-write-platform">
                    <el-button class="product-btn" type="warning">查看</el-button>
                  </router-link>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="product-box">
                <div class="product">
                  <img src="../../assets/home/medium.png" alt="媒体推广">
                  <p class="product-title">媒体推广</p>
                  <p class="product-intro">因为优势，所以简单</p>
                  <router-link to="/article/copy-write-medium">
                    <el-button class="product-btn" type="warning">查看</el-button>
                  </router-link>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="product-box">
                <div class="product">
                  <img src="../../assets/home/write.png" alt="文章代写">
                  <p class="product-title">文章代写</p>
                  <p class="product-intro">专业，一站式代写服务流程</p>
                  <router-link to="/article/publish">
                    <el-button class="product-btn" type="warning">查看</el-button>
                  </router-link>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="function">
      <el-card>
        <div class="func-box">
          <a href="">
            <img src="../../assets/home/kefu.png" alt="客服中心">
            <span>客服中心</span>
          </a>
        </div>
        <el-divider direction="vertical" />
        <div class="func-box">
          <a href="">
            <i class="el-icon-question" />
            <span>帮助中心</span>
          </a>
        </div>
        <el-divider direction="vertical" />
        <div class="func-box">
          <a href="">
            <i class="el-icon-message-solid" />
            <span>消息</span>
          </a>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import User from './user'
// import Manager from './manager'
import { getLastPublic } from '@/api/setting'
import notice_icon from '@/assets/images/notice_icon.png'

export default {
  name: 'Home',
  //   components: { User, Manager },
  data() {
    return {
      activeFlow: 'first'
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    // console.log(this.$store)
  },
  created() {
    getLastPublic().then(res => {
      if (res.data.length > 0) {
        this.$alert(`
                <div class="img-btn">
                    <img src=${notice_icon} alt="提示">
                    <h2 class="title">通知</h2>
                </div>
                <div class="welcome text">
                    亲爱的<span class="user">${this.$store.state.user.name}</span>,您好！
                </div>
                <div class="content text">
                    ${res.data[0].content}
                </div>
            `, {
          dangerouslyUseHTMLString: true,
          showCancelButton: false,
          showConfirmButton: false
        })
      }
    })
  },
  methods: {
    getUserLevel() {
      let role = this.$store.state.user.roles[0]
      role = role === 'customer' ? this.$store.state.user.level : this.$store.state.user.roles[0]
      const roles = {
        'admin': '管理员',
        'service': '客服',
        'technology': '技术',
        '1': '普通会员',
        '2': '黄金会员',
        '3': '钻石会员'
      }
      return roles[role]
    },
    invest() {
      this.$notify.error({
        title: '信息',
        message: '确定充值接口后完善'
      })
    },
    withdraw() {
      window.open('tencent://message/?uin=475603284&Site=Sambow&Menu=yes', '_blank')
    },
    showMoneyDetail() {
      this.$notify.error({
        title: '信息',
        message: '确定充值接口后完善'
      })
    }
  }
}
</script>

<style lang="scss" scope>
    .home-form{
        margin-top: 2em;
    }
    .home-top{
        .home-title{
            display: inline;
            margin-left: 20px;
        }
        .level{
            display: inline;
            margin-left: 20px;
            background-color: rgb(197,171,131);
            padding: 5px 15px;
            border-radius: 25px;
            color: #fff;
        }
        .last-time{
            display: inline-block;
            color: #a1a1a1;
            font-size: 0.9em;
            margin-bottom: 0;
        }
        .progree-box{
            display: inline;
            margin-left: 40px;
            .wanshang{
                display: inline-block;
                color: #a1a1a1;
                font-size: 0.9em;
                margin-bottom: 0;
            }
            .progree-body{
                display: inline-block;
                width: 20%;
                margin-left: 20px;
                margin-bottom: 0;
            }
        }
    }
    .content-card{
        margin-top:20px;
        overflow: auto;
        .content-title{
            position: relative;
            img{
                width: 3em;
            }
            p{
                line-height: 3em;
                position: absolute;
                top: 0;
                left: 4em;
                font-size: 1em;
                margin: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .money-box{
            width: 70%;
            margin: 20px 0 20px 30%;
            .balance-money{
                display: inline-block;
                p{
                    font-size:1.2em;
                    margin: 10px 0;
                    font-weight: bold;
                }
                span{
                    font-size: 0.5em;
                    color: #a1a1a1;
                }
                .money{
                    color: rgb(252,80,10)
                }
            }
            .divider{
                display: inline-block;
                width: 1px;
                height: 3em;
                margin: 0 8px;
                background-color: #DCDFE6;
            }
        }
        .money-btn-box{
            width: 90%;
            margin: 35px 0 0 10%;
            position: relative;
            .money-detail{
                font-size: 0.1em;
                position: absolute;
                right: 0;
                bottom: 5px;
                color: rgb(252,80,10)
            }
        }
        .my-order{
            margin: 35px 0 0;
            text-align: center;
            p{
                font-size: 1em;
                color: #a1a1a1;
                margin: 1.5em 0 0;
            }
        }
        &.helper{
            .helper-title{
                margin: 0;
            }
            .el-divider--horizontal{
                margin: 15px 0 0;
            }
            .helper-tags{
                text-align: center;
                img{
                    margin: 20px;
                    width: 70%;
                }
            }
        }
        .product-box{
            // margin-top: 5px;
            padding: 5px;
            .product{
                background-color: rgb(232,232,232);
                text-align: center;
                img{
                    width: 35%;
                    margin: 20px 0 0;
                }
                p{
                    margin:10px 0 10px;
                }

                .product-intro{
                    font-size: 0.6em
                }
                .product-btn{
                    margin: 5px 0 10px;
                }

            }
        }
        &.line1{
            height:33vh;
        }
        &.line2{
            height:37vh;
        }
    }
    @media (max-width:767px) {
        .progree-box{
            display: block;
            margin-left: 0 !important;
            .progree-body{
                width: 70% !important;
            }
        }
    };
    @media screen and(max-width:1024) {
        .money-box{
            width: 100% !important;
            margin-left: 0 !important;
        }
    }
    @media screen and (max-device-width:1024px){
        .money-detail{
            // display: none !important;
            bottom: -2em !important;
        }
        .money-box{
            width: 100% !important;
            margin-left: 0 !important;
        }
    }
    .function{
        position: fixed;
        right: 1em;
        bottom: 0;
        background-color: rgb(232,232,232);
        .el-card__body {
            padding: 5px;
        }
        .func-box{
            display: inline-block;
        }
        img{
            width: 0.8em;
        }
        i{
            font-size:0.8em
        }
        span{
            font-size: 0.5em
        }
    }
</style>
<style scope>
    .public-btn{
        margin: 20px 0 20px;
        float: right;
    }
    .sec-btn{
        margin-right: 20px
    }
    .img-btn{
        margin: 0 auto;
        text-align: center
    }
    .title{
        margin-top: 0;
    }
    .user{
        color: red
    }
    .content{
        text-indent: 2em;
        margin-top: 20px;
    }
    .text{
        font-size: 1.3em;
    }
</style>
