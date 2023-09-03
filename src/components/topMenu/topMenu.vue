<template>
  <div>
    <div class="gas-page-header-container">
      <div class="gas-page-header-title">{{title}}</div>
      <div class="gas-reply-date-picker-wrapper" v-if="datePickerShow">
        <div class="date-picker">
          <el-date-picker
              v-model="datePicker"
              @change="datePickerChange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled="disabled"
              format="yyyy/MM/dd"
              align="right" placeholder="选择日期"
              class="gas-el-date">
          </el-date-picker>
        </div>
      </div>
      <div class="gas-reply-date-picker-wrapper" v-if="datePickerOneShow" style='width:200px;'>
        <div class="date-picker">
          <el-date-picker
              v-model="dateOne"
              @change="datePickerChange"
              type="date"
              range-separator="-"
              start-placeholder="开始日期"
              :disabled="disabled"
              format="yyyy年 / MM"
              align="right" placeholder="选择日期"
              class="gas-el-date">
          </el-date-picker>
        </div>
      </div>
      <div class="serach" style='position:absolute;left:370px;' v-if="inputShow">
        <el-input placeholder="请输入搜索内容" prefix-icon="el-icon-search" class="search-content" size="medium" v-model='keyword' @change.native='getSearchContent'>
        </el-input>   
      </div>
      <div class="gas-page-user-wrapper" v-if='logoutShow'>
        <img class="gas-page-user-img" src="@/assets/img/tx_null.jpg">
        <span class="gas-page-user-name">{{$store.getters.loginName}}</span>
        <span class="gas-page-user-logout" @click="logout">退出</span>
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
        <div class="gas-page-com-wrapper" slot="reference" v-if='companyShow'>
          <span class="gas-page-user-name" style="width: 154px;text-align: center;">{{$store.getters.curComName}}</span>
          <span class="gas-page-user-logout" style="text-indent: 0;"><i class="el-icon-arrow-down" :style="{transform: 'rotate('+arrowDeg+'deg)', transition: 'transform .5s ease', marginLeft: '12px'}"></i></span>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import menuAndOrg from '/src/components/auth/menuAndOrg'

export default {
name: "topMenu",
  mixins: [menuAndOrg],
  props: {
    title: String,
    startTime: String,
    endTime: String,
    datePickerShow: Boolean,
    datePickerOneShow: Boolean,
    disabled: Boolean,
    inputShow:Boolean,
    logoutShow:{
      type:Boolean,
      default:true
    },
    companyShow:{
      type:Boolean,
      default:true
    }
  },
  data: function () {
    return {
      dateOne:moment.now(),       // 第二个日期选择控件用
      keyword:'',
      datePicker: [],
      selectDate: false,
      curComCode: null,
      comOptions: [],
      pickerOptions: {
        disabledDate(time) {
          let curDate = (new Date()).getTime();
          let three = 90 * 24 * 3600 * 1000;
          let threeMonths = curDate - three;
          return time.getTime() > Date.now() || time.getTime() < threeMonths;
        }
      },
      arrowDeg: 0,
      defaultProps: {
        children: 'orgChildren',
        label: 'orgName',
        disabled: 'selectable'
      },
      popoverVisiable: false
    }
  },

  created() {
    this.datePicker[0] = this.startTime || Date.now();
    this.datePicker[1] = this.endTime || Date.now();
    this.comOptions = this.$store.getters["companyList"];
    this.curComCode = this.$store.getters['curCom'];
    if(!this.$store.getters['curCom']) {
      this.getData(this.$store.getters.loginName)
    }
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
    }
  }
}
</script>

<style>
.gas-el-date>input,
.gas-el-select .el-input__inner{
  background: transparent !important;
  border: none;
  text-align: center;
  color: #ffffff;
  font-size: 16px;
  padding-left: 0;
}

.date-picker .gas-el-date {
  width: 100%;
  background: transparent;
  border: none;
  vertical-align: top;
}
.date-picker .el-range-separator {
  color: #ffffff;
}
.date-picker .el-range-editor .el-range-input {
  font-size: 16px;
  color: #ffffff;
  height: 40px;
  line-height: 40px;
}
.date-picker .el-input__prefix {
  left: 20px;
}
.gas-el-checkbox .el-checkbox__label {
  font-size: 15px;
  color: #fff !important;
}
.gas-el-select .el-input__suffix {
  height: 24px;
  margin-top: 8px;
  border-left: 1px solid #EAEFF6;
  display: inline-flex;
  align-items: center;
}
</style>

<style scoped lang="scss">
.gas-page-header-container {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-top: 54px;
  overflow: hidden;
  color: #ffffff;
  position:relative;
}

.gas-page-header-title {
  font-size: 34px;
  color: #FFFFFF;
  float: left;
  margin-left: 32px;
}

.gas-reply-date-picker-wrapper {
  width: 303px;
  height: 40px;
  background: #567DB9;
  opacity: .7;
  border-radius: 20px;
  float: left;
  margin-left: 52px;
  overflow: hidden;
}

.gas-reply-date-picker-wrapper .date-picker {
  width: 100%;
  float: left;
  height: 100%;
  overflow: hidden;
}

.gas-reply-date-picker-wrapper .select {
  width: 87px;
  float: left;
  height: 100%;
}

.gas-page-user-wrapper {
  width: 183px;
  height: 40px;
  background: #567DB9;
  opacity: 1;
  border-radius: 24px;
  float: right;
  margin-right: 32px;
  line-height: 40px;
  font-size: 15px;
}

.gas-page-com-wrapper {
  width: 200px;
  height: 40px;
  background: #567DB9;
  opacity: 1;
  border-radius: 24px;
  float: right;
  margin-right: 20px;
  overflow: hidden;
  cursor: pointer;
}
.gas-el-checkbox {
  margin-left: 13px;
}
.gas-page-user-img {
  height: 33px;
  width: 33px;
  border-radius: 50%;
  margin-left: 2px;
  margin-top: 3px;
  vertical-align: top;
}
.gas-page-user-name {
  display: inline-block;
  width: 85px;
  height: 24px;
  border-right: 1px solid #EAEFF6;
  text-indent: 14px;
  margin-top: 8px;
  vertical-align: top;
  line-height: 24px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.gas-page-user-logout {
  display: inline-block;
  text-indent: 14px;
  height: 24px;
  margin-top: 8px;
  line-height: 24px;
  vertical-align: top;
  cursor: pointer;
}
.search-content{
    display: inline-block;
    border-radius: 10px;
    width: 250px;
    margin-left: 20px;
    border: 5px;
    box-sizing: border-box;
}
.custom-tree {
  height: 500px;
  overflow: scroll;
  /deep/ .el-tree-node.is-current>.el-tree-node__content {
    background-color: #c3dcfa
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
</style>