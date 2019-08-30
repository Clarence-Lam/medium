import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'Dashboard',
  //       meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
  //     }
  //   ]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '用户主页', icon: 'dashboard' }
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/pay',
    name: 'user',
    meta: { title: '个人中心', icon: 'example' },
    children: [
      {
        path: 'pay',
        name: 'pay',
        component: () => import('@/views/user/pay/index'),
        meta: { title: '我要充值', icon: 'table', breadcrumb: false }
      },
      {
        path: 'finance',
        name: 'finance',
        component: () => import('@/views/user/finance/index'),
        meta: { title: '财务报表', icon: 'tree' }
      },
      {
        path: 'news',
        name: 'news',
        component: () => import('@/views/user/news/index'),
        meta: { title: '系统消息', icon: 'tree' }
      },
      {
        path: 'withdraw',
        name: 'withdraw',
        component: () => import('@/views/user/withdraw/index'),
        meta: { title: '提现', icon: 'tree' }
      },
      {
        path: 'bill',
        name: 'bill',
        component: () => import('@/views/user/bill/index'),
        meta: { title: '发票申请', icon: 'tree' }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/user/index'),
        meta: { title: '资料修改', icon: 'tree' }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/publish',
    name: 'article',
    meta: { title: '文章管理', icon: 'example' },
    children: [
      {
        path: 'publish',
        name: 'publish',
        component: () => import('@/views/article/publish/index'),
        meta: { title: '文章发布', icon: 'table' }
      },
      {
        path: 'write',
        name: 'write',
        component: () => import('@/views/article/write/index'),
        meta: { title: '文案代写', icon: 'tree' }
      },
      {
        path: 'copy-write-platform',
        name: 'copy-write-platform',
        hidden: true,
        component: () => import('@/views/article/platform/copy-write'),
        meta: { title: '已有文案直接发布', icon: 'tree' }
      }, {
        path: 'commit',
        name: 'commit',
        hidden: true,
        component: () => import('@/views/article/components/commit'),
        meta: { title: '订单确认', icon: 'tree' }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    redirect: '/article/publish1',
    name: '问答推广',
    hidden: true,
    showTop: true,
    meta: { title: '问答推广', icon: 'example' },
    children: [
      {
        path: 'publish1',
        name: '全部问答平台',
        component: () => import('@/views/home/index'),
        meta: { title: '全部问答平台', icon: 'table' }
      }
    ]
  },
  {
    path: '/test1',
    component: Layout,
    name: '平台推广',
    meta: { title: '平台推广', icon: 'example' },
    hidden: true,
    showTop: true,
    children: [
      {
        path: 'index',
        name: '平台推广',
        component: () => import('@/views/home/index'),
        meta: { title: '平台推广', icon: 'form' }
      }
    ]
  },
  {
    path: '/test2',
    component: Layout,
    name: '媒体推广',
    meta: { title: '媒体推广', icon: 'example' },
    hidden: true,
    showTop: true,
    children: [
      {
        path: 'index',
        name: '媒体推广',
        component: () => import('@/views/home/index'),
        meta: { title: '媒体推广', icon: 'form' }
      }
    ]
  },
  {
    path: '/test3',
    component: Layout,
    name: '返回用户主页',
    meta: { title: '返回用户主页', icon: 'example' },
    hidden: true,
    showTop: true,
    children: [
      {
        path: 'index',
        name: '返回用户主页',
        component: () => import('@/views/home/index'),
        meta: { title: '返回用户主页', icon: 'form' }
      }
    ]
  }

  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'Profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/order',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        name: '我的订单',
        component: () => import('@/views/order/index'),
        meta: { title: '我的订单', icon: 'form' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/home',
    // name: '设置',
    meta: {
      title: '设置',
      icon: 'nested',
      roles: ['admin', 'service', 'technology']
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/setting/user/index'),
        meta: {
          title: '用户管理',
          meta: { roles: ['admin'] }
        }
      },
      {
        // path: 'types',
        // // component: () => import('@/views/setting/platform/types'), // Parent router-view
        // name: '系统配置',
        // meta: { title: '系统配置', meta: { roles: ['admin'] }},
        // children: [
        //   {
        path: 'platform',
        component: () => import('@/views/setting/platform/index'),
        name: '平台配置管理',
        meta: { title: '平台配置管理', roles: ['admin'] },
        redirect: '/setting/platform/types',
        children: [
          {
            path: 'platform-types',
            component: () => import('@/views/setting/platform/types'),
            name: 'platform-types',
            meta: { title: '类目管理', meta: { roles: ['admin'] }}
          },
          {
            path: 'platform-cases',
            component: () => import('@/views/setting/platform/cases'),
            name: 'platform-cases',
            meta: { title: '案例管理', roles: ['admin'] }
          },
          {
            path: 'platform-caseForm',
            component: () => import('@/views/setting/platform/caseForm'),
            name: 'platform-caseForm',
            meta: { title: '案例管理', roles: ['admin'] },
            hidden: true
          },
          {
            path: 'platform-nothing',
            component: () => import('@/views/setting/platform/nothing'),
            name: 'platform-nothing',
            meta: { title: '无文章价格管理', roles: ['admin'] }
          }
        ]
      },
      {
        path: 'medium',
        component: () => import('@/views/setting/medium/index'),
        name: '媒体配置管理',
        meta: { title: '媒体配置管理', roles: ['admin'] },
        redirect: '/setting/medium/types',
        children: [
          {
            path: 'medium-types',
            component: () => import('@/views/setting/medium/types'),
            name: 'medium-types',
            meta: { title: '类目管理', roles: ['admin'] }
          },
          {
            path: 'medium-cases',
            component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
            name: 'medium-cases',
            meta: { title: '案例管理', roles: ['admin'] }
          },
          {
            path: 'medium-nothing',
            component: () => import('@/views/setting/medium/nothing'),
            name: 'medium-nothing',
            meta: { title: '无文章价格管理', roles: ['admin'] }
          }
        ]
      },
      {
        path: 'question',
        component: () => import('@/views/setting/question/index'),
        name: '问答配置管理',
        meta: { title: '问答配置管理', roles: ['admin'] },
        redirect: '/setting/question/types',
        children: [
          {
            path: 'question-types',
            component: () => import('@/views/setting/question/types'),
            name: 'question-types',
            meta: { title: '类目管理', roles: ['admin'] }
          },
          {
            path: 'question-cases',
            component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
            name: 'question-cases',
            meta: { title: '案例管理', roles: ['admin'] }
          },
          {
            path: 'question-nothing',
            component: () => import('@/views/setting/question/nothing'),
            name: 'question-nothing',
            meta: { title: '无文章价格管理', roles: ['admin'] }
          }
          // ]
        //   }
        ]
      }

    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  /** when your routing map is too long, you can split it into small modules **/
  //   componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug' }
      }
    ]
  },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
