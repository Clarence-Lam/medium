<template>
  <div class="app-container">
    <h3 style="padding-left: 20px;">问答推广配置</h3>
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
          <el-input v-model.number="moneyValue" placeholder="金额" style="width:130px" size="mini" @keyup.enter.native="addNum">
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
      console.log(this.num)
      this.numVisible = true
    },

    addNum() {
      const numValue = this.numValue
      const moneyValue = this.moneyValue
      console.log(typeof (moneyValue))
      if (numValue && moneyValue !== 0 && typeof (moneyValue) === 'number' && moneyValue > 0) {
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
