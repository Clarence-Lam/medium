<template>
  <div v-if="$store.state.user.roles[0]!=='customer'">
    <router-link to="/">
      <el-button style="padding: 8px 10px;" size="small" type="text">
        <el-badge :is-dot="showDot" style="line-height: 25px;">
          <!-- <svg-icon icon-class="bug" /> -->
          <i class="el-icon-message-solid" style="font-size: 18px;" />
        </el-badge>
      </el-button>
    </router-link>
  </div>
</template>
<script>
import { getDot } from '@/api/setting'

export default {
  data() {
    return {
      showDot: false
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        if (this.$store.state.user.roles[0] !== 'customer') {
          this.getDot()
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    this.getDot()
  },
  methods: {
    getDot() {
      getDot().then(res => {
        this.showDot = res.data.showDot
      })
    }
  }
}
</script>
