<template>
  <div>
    <div class="box-container" :style="{width:'100%',height:height+'px'}">
      <div class="tag-box" :style="{height:height/1.5+'px'}">
        <template v-for="item of multipleSelection">
          <CommitTag :key="item.id" :item="item" />
        </template>
      </div>
      <i v-if="!showMore" class="el-icon-arrow-up commit-icon" @click="showMore=!showMore" />
      <i v-if="showMore" class="el-icon-arrow-down commit-icon" @click="showMore=!showMore" />
      <div class="commit-btn">
        已选媒体： {{ multipleSelection.length }} 个，金额：{{ Selection }} 元（可用余额：{{ usableMoney }} 元 ）
        <el-button size="small" @click="cleanAll()">清空</el-button>
        <el-button type="warning" size="small" @click="goBack()">上一步</el-button>
        <el-button type="success" size="small" @click="submit()">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import CommitTag from '../components/commit-tag'
import { getUsableMoney } from '@/api/finance'
export default {
  components: { CommitTag },
  props: {
    multipleSelection: {
      type: Array,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      showMore: false,
      height: 150,
      width: undefined,
      usableMoney: 0
    }
  },
  computed: {
    // 计算属性的 getter
    Selection: function() {
      let num = 0
      for (const item of this.multipleSelection) {
        // TODO
        if (this.$store.state.user && this.$store.state.user.level === '1') {
          num += item.general_price * item.num
        } else {
          num += item.agent_price * item.num
        }
      }
      return num
    }
  },
  watch: {
    showMore: function(val) {
      if (val) {
        this.height = 250
      } else {
        this.height = 150
      }
    }
  },
  created() {
    this.getUsableMoney()
  },
  mounted() {
    // this.height = this.$el.getBoundingClientRect().height
    this.width = this.$el.getBoundingClientRect().width
  },
  methods: {
    delSelection(item) {
      this.$parent.delSelection(item)
    },
    goBack() {
      this.$parent.goBack()
    },
    cleanAll() {
      this.$parent.delSelection()
    },
    submit() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请至少选择一个媒体！')
        return
      }
      this.$parent.submit()
    },
    getUsableMoney() {
      getUsableMoney().then(res => {
        this.usableMoney = res.account
      })
    }
  }
}
</script>
<style scoped>
.box-container{
    bottom:0;
    z-Index:99;
    position:fixed;
    /* width:100%; */
    height:100px;
    background:#4795C5
}
.tag-box{
    /* height: 50px; */
    margin: 5px;
    overflow: auto;
    width: 90%;

}
.commit-icon{
    position: absolute;
    right: 3%;
    top: 15%;
}
.commit-btn{
    text-align: center;
}
</style>
