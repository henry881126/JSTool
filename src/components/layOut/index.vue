<template>
  <el-container>
    <el-aside :width="isCollapse ? '48px' : '220px'">
      <div class="aside-bar">
        <div class="logo"
             v-show="!isCollapse"
             @click="toggleTheme()" />
        <div class="logo-no-word"
             v-show="isCollapse"
             @click="toggleTheme()" />
        <el-menu :default-active="curActive"
                 :collapse-transition="true"
                 :unique-opened="true"
                 class="custom-nav"
                 mode="vertical"
                 @open="menuOpen"
                 :collapse="isCollapse">
          <div v-for="m in menu"
               :key="m.resourceId">
            <el-submenu :index="m.resourceChildren.length > 0 ? m.resourceId.toString() : m.resourceUrl"
                        v-if="m.resourceChildren.length > 0">
              <template slot="title">
                <img :src="'/static/img/menuicon/menu-icon-' + m.icon + '.png'"
                     onerror="this.src = '/static/img/menuicon/menu-icon-moren.png'"
                     alt=""
                     class="menuicon">
                <span>{{m.resourceName}}</span>
              </template>
              <div v-for="c in m.resourceChildren"
                   :key="c.resourceId">
                <el-submenu :index="c.resourceChildren.length > 0 ? c.resourceId.toString() : c.resourceUrl"
                            v-if="c.resourceChildren.length > 0">
                  <template slot="title">
                    <span>{{c.resourceName}}</span>
                  </template>
                  <div v-for="cc in c.resourceChildren"
                       :key="cc.resourceId">
                    <el-menu-item :index="cc.resourceUrl"
                                  @click="changeMenu(cc)">
                      <template slot="title">
                        <span>{{cc.resourceName}}</span>
                      </template>
                    </el-menu-item>
                  </div>
                </el-submenu>
                <el-menu-item :index="c.resourceUrl" v-else @click="changeMenu(c)">
                  <template slot="title">
                    <span>{{c.resourceName}}</span>
                    <!-- 当菜单项为“日交割管理”且接口返回的待确认提示值（tips）大于0时，在“日交割管理”菜单右侧显示“待确认”图标 -->
                    <span v-if="c.resourceName === '日交割管理' && tips > 0"
                          class='tips'><img :src="confirmImg"
                           class='confirm-img'></span>
                  </template>
                </el-menu-item>
              </div>
            </el-submenu>
            <el-menu-item :index="m.resourceChildren.length > 0 ? m.resourceId.toString() : m.resourceUrl"
                          :key="m.resourceId"
                          v-else
                          @click="changeMenu(m)">
              <img :src="'/static/img/menuicon/menu-icon-' + m.icon + '.png'"
                   onerror="this.src = '/static/img/menuicon/menu-icon-moren.png'"
                   alt=""
                   class="menuicon">
              <span>{{m.resourceName}}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </div>
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import dateFormater from '@components/dateFormater/dateFormater'
import api from 'src/http/api'
import { switchTheme } from "../theme/themes";
import config from "../../config/config";

export default {
  name: "LayOut",
  mixins: [dateFormater],
  data () {
    return {
      tips: 0,         // 存储接口返回的日交割管理 待确认提示值
      confirmImg: require('@assets/img/confirm.png'),        // 待确认图标
      opneMenuIndex: 0,
      dataDictionary: {
        '9': '分销中心-点击计划管理',
        '5': '导航页-气量调配',
        '总览': '分销中心-点击总览',
        '日计划': '导航页-计划管理-点击日计划',
        '日交割管理': '导航页-计划管理-点击日交割管理',
        '用气批复': '导航页-气量调配-点击用气批复',
        '用气交割': '导航页-气量调配-点击用气交割',
        '日气量报表': '气量调配-点击日气量报表',
        '资源通路客户地图': '资源中心-点击资源通路客户地图',
        '气源市场动态': '资源中心-点击气源市场动态',
        '气量预测': '需求预测-点击气量预测',
        '采购测算': '气源采购-点击采购测算',
        '采购配置': '气源采购-点击采购配置',
        '企业用气跟踪': '气量分析-点击企业用气跟踪',
        '客户用气跟踪': '气量分析-点击客户用气跟踪',
        '客户风险价值分析': '气量分析-点击客户风险值分析',
        '采销分析': '气量调配-点击采销分析',
        '气款跟踪': '气量调配-点击气款跟踪',
        '气量对账单': '气量调配-点击气量对账单',
        '提取量跟踪': '气量调配-点击提取量跟踪',
        '需供计划跟踪': '需供计划管理-点击需供计划跟踪',
        '需供企业配置': '需供计划管理-点击需供企业配置',
        '调度日报': '需供计划管理-点击调度日报',
        '调度首页': '分销中心-点击调度首页',
        '运行监控': '分销中心-点击运行监控',
        '气量执行与跟踪': '分销中心-点击气量执行与跟踪',
        '输配能力监控': '分销中心-点击输配能力监控',
        '输配能力测算': '分销中心-点击输配能力测算',
        '气源执行跟踪': '气源管理-点击气源执行与跟踪',
        '客户列表': '客户管理-点击客户列表',
        '合同管理': '客户管理-点击合同管理',
        '用气计划反馈': '客户管理-点击用气计划反馈',
        '用气执行跟踪': '客户管理-点击用气执行跟踪',
        '对账单': '客户管理-点击对账单',
        '消息列表': '客户管理-消息管理-点击消息列表',
        '消息模板': '客户管理-消息管理-点击消息模板',
        '规则设置': '客户管理-消息管理-点击规则设置',
      }
    };
  },
  computed: {
    curActive: function () {
      return this.$route.path
    },
    curComCode: function () {
      return this.$store.getters.curCom
    },
    menu: function () {
      return this.$store.getters.menu
    },
    // this.$store.getters.tips 的值是日交割列表中确定按钮后存储的值
    menuTips () {
      return this.$store.getters.tips
    },
    isCollapse: function () {
      return this.$store.getters.navIsCollapse === '' ? false : this.$store.getters.navIsCollapse
    }
  },
  watch: {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if (n && o && this.opneMenuIndex === "9") {
          this.getTip()
        }
      }
    },
    // 监听日交割列表中确定按钮
    menuTips () {
      this.getTip()
    }
  },
  methods: {
    logout () {
      this.$store.dispatch("LogOut").then(() => {
        this.$router.push("/login");
      });
    },
    /** 方法中增加m1、m2参数，将用户操作的当前菜单存储到store中，在诸葛埋点中会用到此数据
     * m1 string 一级菜单
     * m2 string 二级菜单
     * externalPath 此参数值存储的是气源管理系统各页面的url地址（此地址用于在iframe中加载气源管理系统页面）
     */
    changeMenu: function (menu) {
      if (menu.resourceUrl && this.curActive.toString() !== menu.resourceUrl) {
        this.$store.commit('SET_CURRENT_MENU', menu);
        this.$store.commit('SET_CURRENT_URL', menu.iframUrl);
        // 诸葛埋点：单击最内层菜单时，上报埋点事件
        let menuName = menu.resourceName
        this.buriedPoint(menuName)
        this.$router.push(menu.resourceUrl)
      }
    },
    getTip: function () {
      let params = {
        code: this.curComCode,
        startTime: this.getFormatDate(new Date() - 7 * 86400 * 1000),
        endTime: this.getFormatDate(new Date()),
      }
      api.planManagement.dayDeliveryConfirmTips(params).then(res => {
        this.tips = res[0]
      })
    },
    menuOpen: function (index) {
      console.log('submenu open:', index)
      this.opneMenuIndex = index
      if (this.opneMenuIndex === "9") {
        this.getTip()
      }
      // 诸葛埋点：单击左侧导航栏某一级菜单时（如单击气量调配菜单（一级菜单）），上报埋点事件
      this.buriedPoint(index)
    },
    toggleTheme: function () {
      if (config.env === 'pro') {
        return
      }
      if (this.theme === 'lighter') {
        this.theme = 'dark'
        switchTheme('dark')
      } else {
        this.theme = 'lighter'
        switchTheme('lighter')
      }
    },
    // 诸葛埋点：单击某菜单时，上报埋点事件
    buriedPoint (menuIndex) {
      if (this.dataDictionary[menuIndex]) {
        window.zhuge.track(this.dataDictionary[menuIndex])
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100vh;
}
.el-aside {
  position: relative;
  transition: width 0.5s;
  overflow-x: hidden;
}
.el-main {
  padding: 0;
}
.aside-bar {
  position: relative;
  overflow: hidden;
}
.icon-menu {
  margin-right: 20px;
}
.logo {
  width: 180px;
  height: 46px;
  margin-left: 20px;
  margin-top: 30px;
}
.logo-no-word {
  width: 35px;
  height: 34px;
  margin-left: 6px;
  margin-top: 30px;
  background-image: url("/static/img/logo_no_word.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

// 待确认提示图标样式
.confirm-img {
  margin-left: 8px;
  margin-top: -2px;
}

.menuicon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}
.custom-nav {
  margin-top: 16px;
}
</style>
