import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import store from './store'
import router from './router'
import api from './api/index'

import './assets/iconfont/iconfont.css'
import './assets/styles/index.scss'
import './assets/styles/customElementCss.scss'
import './assets/styles/commonV1.scss'
import * as echarts from 'echarts'

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 大屏数据可视化开源组件
import dataV from '@jiaminghi/data-view'

Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.use(dataV)

// require styles
// 富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 事件处理插件
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

import directive from './directive/index'
// 通过点击指令 诸葛埋点
import './directive/trace'      // 引入自定义directive

for (const [key, value] of Object.entries(directive)) {
  Vue.directive(key, value)
}

Vue.prototype.$echarts = echarts
Vue.prototype.$api = api

Vue.prototype.$moment = moment


router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem('LOGIN_NAME') === null && to.path !== '/login' && to.path !== '/sso') {
    next('/login')
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 全局公共属性，每个埋点均会记录这些属性
  window.zhuge.setSuperProperty({
    'PC-H5': 'PC',
    '产品名称': '智慧分销',
    '当前页面名称': to.meta.title || to.name,
    '来源页面名称': from.meta.title || from.name,
    'LOGIN_NAME': store.getters.loginName
  })
  next()
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
