<template>
  <div class="top-menu-wrapper">
    <div class="title-wrapper">
      <span class="cebianlan" @click="toggleNavIsCollapse()"></span>
      <span class="title">{{title}}</span>
    </div>
    <div class="gas-page-user-wrapper">
      <img class="gas-page-user-img" src="@/assets/img/tx_null.jpg">
      <span class="gas-page-user-name" style="margin-right: 14px;">{{$store.getters.loginName}}</span>
      <span class="gas-page-user-tips" v-if="tipShow"></span>
      <span class="gas-page-user-logout" @click="logout"></span>
    </div>
    <el-popover
        v-model="popoverVisiable"
        placement="bottom-start"
        popper-class="custom-popover"
        trigger="click"
        @show="arrowDeg = 180"
        @hide="arrowDeg = 0">
      <el-tree :data="treeData" :props="defaultProps"
               :expand-on-click-node="false"
               node-key="orgCode" @node-click="curComChangeHandler"
               class="custom-tree" :default-expand-all="true"
               :render-content="renderContent"
               :highlight-current="true" :current-node-key="$store.getters.curCom"></el-tree>
      <div class="company-wrapper" slot="reference">
        <span class="gas-page-user-name" style="width: 135px;text-indent: 16px;">{{$store.getters.curComName}}</span>
        <span class="company-wrapper-icon" style="text-indent: 0;"><i class="el-icon-arrow-down" :style="{transform: 'rotate('+arrowDeg+'deg)', transition: 'transform .5s ease', marginLeft: '12px'}"></i></span>
      </div>
    </el-popover>
    <div class="date-wrapper">
      {{ time }}
    </div>
  </div>
</template>

<script>
import menuAndOrg from '/src/components/auth/menuAndOrg'
import dateFormater from "../dateFormater/dateFormater";
export default {
  name: "topMenu2",
  mixins: [menuAndOrg, dateFormater],
  props:{
    title: String,
    tipShow: {
      default: false,
      type: Boolean
    }
  },
  data: function () {
    return {
      arrowDeg: 0,
      defaultProps: {
        children: 'orgChildren',
        label: 'orgName',
        disabled: 'selectable'
      },
      popoverVisiable: false,
      theme: 'lighter',
      time: ''
    }
  },
  created() {
    this.comOptions = this.$store.getters["companyList"];
    this.curComCode = this.$store.getters['curCom'];
    if(!this.$store.getters['curCom']) {
      this.getData(this.$store.getters.loginName)
    }
    setInterval(() => {
      this.time = this.getFormatDateDetail(new Date()) + this.getFormatHours(new Date(), ':')
    }, 1000)
  },

  computed: {
    treeData: {
      get () {
        return this.$store.getters.companyList === '' ? [] : this.$store.getters.companyList
      }
    }
  },

  methods: {
    getData: function (userName, curCode) {
      this.getMenuAndOrg(userName, curCode)
    },
    // 文本框@input事件，关键字存入state中
    getSearchContent() {
      this.$store.commit('SET_KEYWORD',this.keyword)
      this.$emit('handleKeywordInput')
    },
    logout: function () {
      this.$store.dispatch("LogOut").then(() => {
        this.$router.push("/login");
      })
    },
    datePickerChange: function (date) {
      this.$emit('t-date-change', date)
    },
    curComChangeHandler: function (data) {
      if(data.selectable === 0) {
        return false
      }
      this.popoverVisiable = false
      this.$store.commit('SET_CUR_COM', data.orgCode);
      this.$store.commit('SET_CUR_COM_NAME', data.orgName);
      this.$store.commit('SET_CUR_COM_INFO', data);
      this.getData(this.$store.getters.loginName, data.orgCode)
      this.$emit('curComChanged')
    },
    renderContent: function(h, { node }) {
      return h('span', {
        class: node.disabled === 1 ? 'custom-tree-node' : 'custom-tree-node disable-select',
        on: {
          click: function (e) {
            if(node.disabled !== 1) {
              e.stopPropagation()
            }
          }
        }
      }, [
        h('span', node.label)
      ])
    },
    toggleNavIsCollapse: function () {
      let isCollapse = this.$store.getters.navIsCollapse
      this.$store.commit('SET_NAV_IS_COLLAPSE', !isCollapse)
    }
  }
}
</script>

<style scoped lang="scss">
.top-menu-wrapper {
  height: 60px;
}
.title-wrapper {
  margin-left: 20px;
  height: 60px;
  color: #FFFFFF;
  font-size: 18px;
  float: left;
}
.title-wrapper span {
  height: 30px;
  line-height: 30px;
  display: inline-block;
  vertical-align: top;
  margin-top: 15px;
}
.title {
  margin-left: 10px;
}
.cebianlan {
  height: 60px;
  width: 16px;
  display: inline-block;
  background-image: url("./assets/侧边栏收起.png");
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center center;
  vertical-align: top;
  cursor: pointer;
}
.custom-tree {
  height: 500px;
  overflow: auto;
  /deep/ .el-tree-node.is-current>.el-tree-node__content {
    background-color: #FFFFFF
  }
  /deep/ .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  /deep/ .disable-select {
    color: rgb(170, 170, 170);
    cursor: not-allowed;
  }
}
.company-wrapper {
  width: 180px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  float: right;
  margin-right: 20px;
  overflow: hidden;
  cursor: pointer;
  margin-top: 16px;
}
.gas-page-user-wrapper {
  width: auto;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  float: right;
  margin-right: 32px;
  line-height: 40px;
  font-size: 15px;
  margin-top: 16px;
}
.gas-page-user-img {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin-left: 1px;
  margin-top: 1px;
  vertical-align: top;
}
.gas-page-user-name {
  display: inline-block;
  width: auto;
  height: 32px;
  text-indent: 5px;
  line-height: 32px;
  vertical-align: top;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: #ffffff;
}
.company-wrapper-icon {
  display: inline-block;
  text-indent: 14px;
  height: 24px;
  line-height: 32px;
  vertical-align: top;
  cursor: pointer;
  color: #ffffff;
}
.gas-page-user-tips {
  display: inline-block;
  width: 48px;
  height: 32px;
  background-image: url("./assets/消息.png");
  background-size: 18px 18px;
  background-repeat: no-repeat;
  background-position: center center;
  vertical-align: top;
}
.gas-page-user-logout::before,
.gas-page-user-tips::before {
  display: inline-block;
  content: "";
  height: 15px;
  width: 1px;
  background: #F5F7FA;
  margin-top: 8px;
  vertical-align: top;
}
.gas-page-user-logout {
  display: inline-block;
  width: 48px;
  height: 32px;
  background-image: url("./assets/登出.png");
  background-size: 18px 18px;
  background-repeat: no-repeat;
  background-position: center center;
  vertical-align: top;
  cursor: pointer;
}
.date-wrapper {
  margin-right: 10px;
  height: 60px;
  line-height: 60px;
  float: right;
  color: #FFFFFF;
}
</style>