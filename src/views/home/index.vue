<template>
  <div class="app-container">
    <!-- <div class="dashboard-text">这里将显示用户主页，包括【左（个人信息）右（客户经理）】</div> -->
    <div class="home-container">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12"><user /></el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12"><manager /></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import User from './user'
import Manager from './manager'
export default {
  name: 'Home',
  components: { User, Manager },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    console.log(this.$store)
  }
}
</script>

<style lang="scss">
    .home-form{
        margin-top: 2em;
    }
    // .home-container{
    //     input{
    //         width: 130px;
    //     }
    // }
</style>
