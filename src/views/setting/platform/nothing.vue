<template>
  <div class="app-container">
    <h3 class="app-container-title">平台代写配置</h3>
    <hr class="app-container-hr">
    <div class="nothing-box">
      <p class="nothing-inline">字数/金额：</p>
      <div class="nothing-inline">
        <el-tag
          v-for="tag in num"
          :key="tag.id"
          closable
          :disable-transitions="false"
          @close="delNothing(tag.id)"
        >
          {{ tag.num }}字/{{ tag.money }}元
        </el-tag>
        <div v-if="numVisible" class="nothing-add-box">
          <el-input v-model.number="numValue" placeholder="字数" style="width:130px" size="mini">
            <template slot="append">字数</template>
          </el-input>
          -
          <el-input v-model="moneyValue" placeholder="金额" style="width:130px" size="mini" oninput="value=value.replace(/[^\d.]/g,'')" @keyup.enter.native="addNum">
            <template slot="append">元</template>
          </el-input>
          <el-button size="mini" type="success" icon="el-icon-check" circle @click="addNum" />
        </div>
        <el-button v-else class="button-new-tag" size="small" @click="showNum">+ 金额</el-button>
      </div>
    </div>
    <div class="nothing-box">
      <p class="nothing-inline">体裁：</p>
      <div class="nothing-inline">
        <el-tag
          v-for="tag in genre"
          :key="tag.id"
          closable
          :disable-transitions="false"
          @close="delNothing(tag.id)"
        >
          {{ tag.name }}
        </el-tag>
        <el-input
          v-if="genreVisible"
          ref="saveTagInput"
          v-model="genreValue"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="addGenre"
          @blur="addGenre"
        />
        <el-button v-else class="button-new-tag" size="small" @click="showGenre">+ 体裁</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getNothing, addNothing, delNothing } from '@/api/setting'
export default {
  name: 'PlatformNothing',
  data() {
    return {
      num: [],
      numVisible: false,
      numValue: '',
      moneyValue: '',
      genre: [],
      genreVisible: false,
      genreValue: ''
    }
  },
  created() {
    this.getNothing()
  },
  methods: {
    getNothing() {
      getNothing({ dept: 'platform' }).then(res => {
        this.num = res.num
        this.genre = res.genre
      })
    },

    showGenre() {
      this.genreVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    addGenre() {
      const genreValue = this.genreValue
      if (genreValue) {
        const params = {
          name: genreValue,
          dept: 'platform',
          sign: 'genre'
        }
        addNothing(params).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.getNothing()
        })
      }
      this.genreVisible = false
      this.genreValue = ''
    },

    delNothing(id) {
      delNothing(id).then(result => {
        this.$message({
          message: result.msg,
          type: 'success'
        })
        this.getNothing()
      })
    },

    showNum() {
      this.numVisible = true
    },

    addNum() {
      const numValue = this.numValue
      const moneyValue = this.moneyValue
      const pattern = /^\d+(\.\d{0,2})?$/
      const re = new RegExp(pattern)
      if (numValue && moneyValue !== 0 && moneyValue > 0 && re.test(moneyValue)) {
        //   if (numValue && moneyValue !== 0 && typeof (moneyValue) === 'number' && moneyValue > 0) {
        // this.num.push({ num: numValue, money: moneyValue })
        const params = {
          num: numValue,
          money: moneyValue,
          dept: 'platform',
          sign: 'num'
        }
        addNothing(params).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.getNothing()
        })
      } else {
        this.$message({
          message: '请确认字数和金额是否正确，金额保留2位小数',
          type: 'warning'
        })
      }
      this.numVisible = false
      this.numValue = ''
      this.moneyValue = ''
    }
  }

}
</script>
<style scope>
    .nothing-box{
        padding: 20px;
        margin: 20px;
        border: 1px solid #ebebeb;
        border-radius: 4px
    }
    .nothing-inline{
        display: inline;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }

    .nothing-add-box{
        padding: 15px;
        border: 1px solid rgb(235, 235, 235);
        border-radius: 4px;
        display: inline;
    }
</style>
