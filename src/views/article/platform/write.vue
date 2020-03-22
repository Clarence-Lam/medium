<template>
  <div>
    <div class="components-container">
      <h3 class="app-container-title">平台推广代写</h3>
      <hr class="app-container-hr">
      <div>
        <el-form ref="orderForm" :model="form" :rules="rules">
          <el-form-item label="上传：">
            <el-upload
              class="upload-demo"
              action="/api/upload"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :on-progress="toUpload"
              :disabled="disabled"
              accept=".docx,.doc"
            >
              <el-button size="small" type="primary" :loading="uploading">上传文档，支持DOCX格式，office2007,2010,2013,2016</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="希望多久完成：" prop="time">
            <el-radio-group v-model="form.time">
              <!-- <el-radio label="1">1天</el-radio>
              <el-radio label="3">3天</el-radio>
              <el-radio label="7">7天</el-radio> -->
              <el-radio v-for="item of expectedTime" :key="item.label" :label="item.label">{{ item.name }}</el-radio>
            </el-radio-group>
            <span style="margin-left:10px;color:red">(注：以实际完成时间为准)</span>
          </el-form-item>
          <el-form-item label="标题：" prop="name">
            <el-input v-model="form.name" style="width:300px" />
          </el-form-item>
          <tinymce ref="setContent" v-model="content" :height="300" />

          <el-form-item label="数量：" style="margin-top:20px">
            <!-- <el-input v-model.number="form.num" style="width:300px" /> -->
            <el-input-number v-model="form.num" :min="1" label="代写数量" :step="1" step-strictly />
          </el-form-item>
          <el-form-item label="字数：" style="margin-top:20px" prop="money">
            <el-select v-model="form.money" placeholder="请选择">
              <el-option
                v-for="item in numList"
                :key="item.id"
                :label="formatNum(item)"
                :value="formatNum(item)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="体裁：" style="margin-top:20px" prop="type_article">
            <el-select v-model="form.type_article" placeholder="请选择">
              <el-option
                v-for="item in articleList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" style="margin-top:20px">
            <el-input v-model="form.mark" style="width:300px" />
          </el-form-item>
          <el-form-item style="margin-top: 4%;" class="write-footer">
            <el-checkbox v-model="checked" border>是否跟发布一并下单（选择平台）</el-checkbox>
            <el-button type="success" style="float:right" @click="onSubmit">{{ checked?'下一步':'提交' }}</el-button>
            <el-button type="success" style="float:right;margin-right:20px" @click="showDetail">预览</el-button>
          </el-form-item>
        </el-form>

      </div>
    </div>
    <div class="footer">
      <div style="margin: 23px;text-align:center">
        <p style="color:#ddd">金额：<span style="color:#F37B1D">{{ form.money?formatMoney(form.money)[1]*form.num:0 }}</span></p>
        <p style="font-size:13px;">计算规则：数量 × 字数，可用余额:{{ usableMoney }}</p>
      </div>
    </div>
  </div>

</template>
<script>
import Tinymce from '@/components/Tinymce'
import { getNothing, getExpectedTime } from '@/api/setting.js'
import { addOrder } from '@/api/orders'
import { getUsableMoney } from '@/api/finance'
import { getCustInfo } from '@/api/user'

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      dept: 'platform',
      checked: false,
      usableMoney: 0,
      uploading: false,
      disabled: false,
      expectedTime: [],
      form: {
        time: '',
        name: '',
        mark: '',
        num: 1,
        money: null,
        type_article: null

      },
      numList: [],
      articleList: [],
      rules: {
        time: [{ message: '请选择制作时间', trigger: 'change' }],
        name: [{ required: true, message: '请输入文案名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
        money: [
          { required: true, message: '请选择文章字数', trigger: 'change' }
        ],
        type_article: [
          { required: true, message: '请选择体裁', trigger: 'change' }
        ]
      },
      content:
      `<h1 style="text-align: center;">稿件发布方法</h1>
        <ul>
            <li>上传文档</li>
            <li>直接这里输入格式为，只要格式人工看得懂均可直接复制进去
                <p>文章标题1：</p>
                <p>文章内容1：</p>
                <p>文章标题2：</p>
                <p>文章内容2：</p>
            </li>
            <li>一定要预览一下准确无误再进行下一步</li>
        </ul>
        <p style='color: red;'>注意：问答如果原文发布不上去，技术会在不改变原意，自由修改问答内容</p>
        `
    }
  },
  created() {
    this.getExpectedTime()
    if (this.$route.params.goback) {
      this.form.name = this.$store.state.order.togetherForm.title
      this.form.time = this.$store.state.order.togetherForm.finish_time
      this.form.mark = this.$store.state.order.togetherForm.mark
      this.content = this.$store.state.order.togetherForm.url
      this.form.num = this.$store.state.order.togetherForm.num
      this.form.type_article = this.$store.state.order.togetherForm.type_article
      this.checked = true
    } else if (this.$route.params.repeat) {
      this.form.name = this.$route.params.row.title
      this.form.time = this.$route.params.row.time
      this.form.mark = this.$route.params.row.mark
      this.content = this.$route.params.row.url
      this.form.num = this.$route.params.row.num
      this.form.type_article = this.$route.params.row.type_article
    } else if (this.$store.state.order.pay === this.dept) {
      this.form.name = this.$store.state.order.writeForm.title
      this.form.time = this.$store.state.order.writeForm.finish_time
      this.form.mark = this.$store.state.order.writeForm.mark
      this.content = this.$store.state.order.writeForm.url
      this.form.num = this.$store.state.order.writeForm.num
      this.form.type_article = this.$store.state.order.writeForm.type_article
    }
    this.getUsableMoney()
    this.getType()
  },
  methods: {
    formatNum(item) {
      return `${item.num}字/${item.money}元`
    },
    formatMoney(str) {
      const arr = str.split('字/')
      if (arr.length === 2) {
        const array = arr[1].split('元')[0]
        return [parseFloat(arr[0]), parseFloat(array)]
      }
      return [0, 0]
    },
    async onSubmit() {
      if (this.$store.state.user.roles[0] === 'customer') {
        await getCustInfo().then(res => {
          const data = res.data
          if (!data.name || !data.qq || !data.channel) {
            this.$confirm('为了保障您能正常使用系统，请先前往完善资料。', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$router.push(`/user/user`)
            }).catch(() => {
              return
            })
          } else {
            this.$refs['orderForm'].validate((valid) => {
              if (valid) {
                const form = {
                  title: this.form.name,
                  finish_time: this.form.time,
                  mark: this.form.mark,
                  url: this.content,
                  dept: 'platform',
                  num: this.form.num,
                  money: this.formatMoney(this.form.money)[1] * this.form.num,
                  type_article: this.form.type_article,
                  sign: 'write',
                  work_nunber: this.formatMoney(this.form.money)[0]
                }

                if (this.checked) {
                  const router = {
                    platform: 'copy-write-platform',
                    medium: 'copy-write-medium',
                    question: 'copy-write-question'
                  }
                  this.$store.state.order.togetherForm = form
                  //   console.log(this.$store.state.order.togetherForm)
                  this.$router.push(
                    {
                      name: router[this.dept],
                      params: {
                        orderTogether: true
                      }
                    }
                  )
                } else {
                  this.$confirm('此操作将扣除金额并下单，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '返回修改',
                    type: 'warning'
                  }).then(() => {
                    addOrder({ form }).then(res => {
                      if (res.status === 200) {
                        this.$store.state.order.pay = null
                        this.$message({
                          message: '成功创建订单',
                          type: 'success'
                        })
                        this.$router.push('/myOrder/my')
                      } else if (res.status === 400) {
                        this.goToPay(form)
                      } else {
                        this.$message.error(res.msg)
                      }
                    })
                  }).catch(() => {
                    console.log('取消')
                  })
                }
              } else {
                console.log('error submit!!')
                return false
              }
            })
          }
        })
      } else {
        this.$message({
          message: '仅限客户账号下单',
          type: 'warning'
        })
      }
    },
    uploadSuccess(response, file, fileList) {
      this.uploading = false
      this.disabled = false
      if (response.code === 200) {
        this.$refs.setContent.setContent(response.html)
      } else if (response.code === 403) {
        this.$message.error('连接超时，请重新登录')
        this.$store.dispatch('user/logout').then(
          this.$router.push(`/login`)
        )
      } else {
        this.$message.error(response.msg)
      }
    },
    uploadError() {
      console.log('失败')
      this.uploading = false
      this.disabled = false
      this.$message.error('上传失败，请重新上传')
    },
    toUpload() {
      this.uploading = true
      this.disabled = true
    },
    showDetail() {
    //   this.$router.push(`/preview`)
      const { href } = this.$router.resolve({
        name: 'preview',
        params: {
          content: this.content
        },
        query: {
          content: this.content
        }
      })
      window.open(href, '_blank')
    },
    getType() {
      getNothing({ dept: 'platform' }).then(res => {
        this.numList = res.num
        this.articleList = res.genre
        if (this.$route.params.repeat) {
          const money = this.$route.params.row.money / this.$route.params.row.num
          for (const item of this.numList) {
            if (item.money === money) {
              this.form.money = this.formatNum(item)
            }
          }
        } else if (this.$route.params.goback) {
          const money = this.$store.state.order.togetherForm.money / this.$store.state.order.togetherForm.num

          for (const item of this.numList) {
            if (item.money === money) {
              this.form.money = this.formatNum(item)
            }
          }
        } else if (this.$store.state.order.pay === this.dept) {
          const money = this.$store.state.order.writeForm.money / this.$store.state.order.writeForm.num

          for (const item of this.numList) {
            if (item.money === money) {
              this.form.money = this.formatNum(item)
            }
          }
        }
      })
    },
    getExpectedTime() {
      getExpectedTime({ dept: 'platform' }).then(res => {
        for (const item of res.data) {
          const param = {
            label: item.name.split('天')[0],
            name: item.name
          }
          this.expectedTime.push(param)
          if (item.is_default === '1' && !this.$route.params.goback) {
            this.form.time = item.name.split('天')[0]
          }
        }
      })
    },
    getUsableMoney() {
      getUsableMoney().then(res => {
        this.usableMoney = res.account
      })
    },
    goToPay(form) {
      this.$confirm('您的金额不足，无法完成下单，点击确定将为您保存订单信息并前往充值?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.state.order.pay = this.dept
        this.$store.state.order.writeForm = form
        this.$router.push({ name: 'pay' })
      }).catch(() => {
        console.log('取消')
      })
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
.footer{
    width: 100%;
    height: 95px;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #4795C5;
    z-index: -999;
}
</style>
<style lang="scss">
    .write-footer{
        .el-checkbox.is-bordered.is-checked{
            border-color: #13ce66;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner{
            background-color: #13ce66;
            border-color: #13ce66;
        }
        .el-checkbox__label{
            color: #ffffff;
        }
        .el-checkbox__input.is-checked + .el-checkbox__label{
            color: #13ce66;
        }

    }
</style>
