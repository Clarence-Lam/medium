<template>
  <div class="nav-menu">
    <!-- <el-menu router :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-submenu index="2" class="breadcrumb-menu">
        <template slot="title">问答推广</template>
        <el-menu-item index="/">全部问答平台</el-menu-item>
        <el-menu-item index="/">百度知道</el-menu-item>
        <el-menu-item index="/">悟空问答</el-menu-item>
        <el-menu-item index="/">知乎问答</el-menu-item>
        <el-menu-item index="/">房天下问答</el-menu-item>
        <el-menu-item index="/">太平洋问答</el-menu-item>
        <el-menu-item index="/">新浪问答</el-menu-item>
        <el-menu-item index="/">360问答</el-menu-item>
        <el-menu-item index="/">搜狗问问</el-menu-item>
      </el-submenu>
      <el-menu-item index="/user/pay">平台推广</el-menu-item>
      <el-menu-item index="/article/publish">媒体推广</el-menu-item>
      <el-menu-item index="/home">返回用户主页</el-menu-item>
    </el-menu> -->
    <el-menu
      router
      :default-active="activeMenu"
      class="el-menu-demo"
      mode="horizontal"
      background-color="rgb(27,28,35)"
      text-color="#fff"
      active-text-color="#409EFF"
      @select="handleSelect"
    >
      <!-- <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" /> -->
      <template v-for="(item,index) in permission_routes">
        <template v-if="item.showTop">
          <template v-if="item.children.length === 1">
            <el-menu-item :key="index" :index="item.path+'/'+item.children[0].path">{{ item.name }}</el-menu-item>
          </template>
          <el-submenu v-else :key="index" class="breadcrumb-menu" index="2">
            <template slot="title">
              {{ item.meta?item.meta.title:itme.name }}
            </template>
            <template v-for="child in item.children">
              <el-menu-item :key="child.name" :index="item.path+'/'+child.path">{{ child.name }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
      </template>
    </el-menu>
    <div class="line" />
  </div>
  <!-- <el-breadcrumb class="app-breadcrumb" separator="/"> -->
  <!-- <transition-group name="breadcrumb"> -->
  <!-- <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item> -->

  <!-- <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <el-menu-item index="1">处理中心</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
          <el-menu-item index="2-4-2">选项2</el-menu-item>
          <el-menu-item index="2-4-3">选项3</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3" disabled>消息中心</el-menu-item>
      <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
    </el-menu> -->
  <!-- </transition-group> -->
  <!-- </el-breadcrumb> -->
</template>

<script>
import path from 'path'
import { mapGetters } from 'vuex'
import pathToRegexp from 'path-to-regexp'
import variables from '@/styles/variables.scss'
import { isExternal } from '@/utils/validate'

export default {
  data() {
    return {
      levelList: null,
      //   activeIndex: '1',
      activeIndex2: '1',
      onlyOneChild: null
    }
  },
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
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    handleSelect(key, keyPath) {
    //   console.log(key, keyPath)
    },
    getBreadcrumb() {
      // only show routes with meta.title
      const matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      //   const first = matched[0]

      // if (!this.isDashboard(first)) {
      //   matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      // }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    },
    hasOneShowingChild(children = [], parent) {
    //   const showingChildren = children.filter(item => {
    //     if (item.hidden) {
    //       return false
    //     } else {
    //       // Temp set(will be used if only has one showing child)
    //       this.onlyOneChild = item
    //       return true
    //     }
    //   })

      // When there is only one child router, the child router is displayed by default
      //   if (showingChildren.length === 1) {
      //     return true
      //   }

      //   // Show parent if there are no child router to display
      //   if (showingChildren.length === 0) {
      //     this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
      //     return true
      //   }
      if (children.length > 0) {
        return true
      }
      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss" scoped>
    .el-menu--horizontal{
        .el-menu-item{
            height: 50px;
            line-height: 50px;
        }
    }
</style>
<style>
    .el-menu--horizontal > .breadcrumb-menu .el-submenu__title{
        height: 50px;
        line-height: 50px;
    }
.nav-menu .el-menu-item:hover{
    background: rgb(44,46,57) !important
}
</style>

