<template>
  <div class="top-menu-wrapper">
    <div class="title-wrapper">
      {{ title }}
    </div>
    <div class="gas-page-user-wrapper">
      <img class="gas-page-user-img" src="@/assets/img/tx_null.jpg" />
      <span class="gas-page-user-name" style="margin-right: 14px">
        {{ $store.getters.loginName }}
      </span>
      <span class="gas-page-user-tips" v-if="tipShow"></span>
      <span class="gas-page-user-logout" @click="logout"></span>
    </div>
    <el-popover
      v-model="popoverVisiable"
      placement="bottom-start"
      popper-class="custom-popover"
      trigger="click"
      @show="arrowDeg = 180"
      @hide="arrowDeg = 0"
    >
      <el-tree
        :data="treeData"
        :props="defaultProps"
        :expand-on-click-node="false"
        node-key="orgCode"
        @node-click="curComChangeHandler"
        class="custom-tree"
        :default-expand-all="true"
        :render-content="renderContent"
        :highlight-current="true"
        :current-node-key="$store.getters.curCom"
      ></el-tree>
      <div class="company-wrapper" slot="reference">
        <span
          class="gas-page-user-name"
          style="width: 135px; text-indent: 16px"
        >
          {{ $store.getters.curComName }}
        </span>
        <span class="company-wrapper-icon" style="text-indent: 0">
          <i
            class="el-icon-arrow-down"
            :style="{
              transform: 'rotate(' + arrowDeg + 'deg)',
              transition: 'transform .5s ease',
              marginLeft: '12px',
            }"
          >
          </i>
        </span>
      </div>
    </el-popover>
    <div class="gas-page-date">
      {{ date }}
    </div>
  </div>
</template>

<script>
import menuAndOrg from "@/components/auth/menuAndOrg";
import moment from "moment";
export default {
  name: "TopMenu",
  mixins: [menuAndOrg],
  props: {
    title: String,
    tipShow: {
      default: false,
      type: Boolean,
    },
  },
  data: function () {
    return {
      arrowDeg: 0,
      defaultProps: {
        children: "orgChildren",
        label: "orgName",
        disabled: "selectable",
      },
      popoverVisiable: false,
      timer: null,
      date: "",
    };
  },
  created() {
    this.comOptions = this.$store.getters["companyList"];
    this.curComCode = this.$store.getters["curCom"];
    if (!this.$store.getters["curCom"]) {
      this.getData(this.$store.getters.loginName);
    }
    this.timer = setInterval(this.getDate, 1000);
  },
  computed: {
    treeData: {
      get() {
        return this.$store.getters.companyList === ""
          ? []
          : this.$store.getters.companyList;
      },
    },
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    getDate() {
      this.date = moment().format("YYYY年MM月DD日 HH:mm:ss");
    },
    getData: function (userName, curCode) {
      this.getMenuAndOrg(userName, curCode);
    },
    // 文本框@input事件，关键字存入state中
    getSearchContent() {
      this.$store.commit("SET_KEYWORD", this.keyword);
      this.$emit("handleKeywordInput");
    },
    logout: function () {
      this.$store.dispatch("LogOut").then(() => {
        this.$router.push("/login");
      });
    },
    datePickerChange: function (date) {
      this.$emit("t-date-change", date);
    },
    curComChangeHandler: function (data) {
      if (data.selectable === 0) {
        return false;
      }
      this.popoverVisiable = false;
      this.$store.commit("SET_CUR_COM", data.orgCode);
      this.$store.commit("SET_CUR_COM_NAME", data.orgName);
      this.$store.commit("SET_CUR_COM_INFO", data);
      this.getData(this.$store.getters.loginName, data.orgCode);
      this.$emit("curComChanged");
    },
    renderContent: function (h, { node }) {
      return h(
        "span",
        {
          class:
            node.disabled === 1
              ? "custom-tree-node"
              : "custom-tree-node disable-select",
          on: {
            click: function (e) {
              if (node.disabled !== 1) {
                e.stopPropagation();
              }
            },
          },
        },
        [h("span", node.label)]
      );
    },
  },
};
</script>

<style scoped lang="scss">
.top-menu-wrapper {
  height: 60px;
  background: #005195 url("../../images/logo-new.png") no-repeat left top;
}
.title-wrapper {
  margin-left: 20px;
  height: 60px;
  line-height: 60px;
  color: #ffffff;
  font-size: 18px;
  float: left;
}

.custom-tree {
  height: 500px;
  overflow: scroll;
  /deep/ .el-tree-node.is-current > .el-tree-node__content {
    background-color: #c3dcfa;
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
  text-overflow: ellipsis;
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
  background-image: url("../../images/message.png");
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
  background: #f5f7fa;
  margin-top: 8px;
  vertical-align: top;
}
.gas-page-user-logout {
  display: inline-block;
  width: 48px;
  height: 32px;
  background-image: url("../../images/logout.png");
  background-size: 18px 18px;
  background-repeat: no-repeat;
  background-position: center center;
  vertical-align: top;
  cursor: pointer;
}
.gas-page-date {
  float: right;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  margin-right: 10px;
}
</style>