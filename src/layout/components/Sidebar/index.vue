<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <div class="contact-wrapper">
      <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=414449044&site=qq&menu=yes">
        <img src="../../../assets/home/qq_qian.png" alt="售前QQ" class="qq_img">
      </a>
      <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=345200771&site=qq&menu=yes">
        <img src="../../../assets/home/qq_hou.png" alt="售后QQ" class="qq_img">
      </a>
      <p class="contact-text">手机号码</p>
      <p class="contact-text">15915967345</p>
      <p class="contact-text">微信二维码</p>
      <img src="../../../assets/home/wechat.jpg" alt="微信二维码" class="wechat_img">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss" scoped>
    .contact-wrapper{
        text-align: center;
        position: relative;
        .qq_img{
            width: 50%;
            display: block;
            margin: 0 auto 5px;
        }
        .contact-text{
            color: #fff;
            font-size: 14px;
            margin:5px 0 10px;
        }
        .wechat_img{
            width: 50%;
        }
    }
</style>
