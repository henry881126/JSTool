<template>
  <div class='container gas-page-bg'>
    <!-- 项部 筛选 -->
    <top-menu title='调度日报'></top-menu>
    <div class="header-wrapper">
      <div class="date-wrapper">
          <div class="title">日期</div>
            <!-- <DateRangePicker @handleDateChange='handleDateChange' class='dateRangePicker'></DateRangePicker> -->
            <div class="date-picker">
              <el-date-picker
                  @change="handleDateChange"
                  :picker-options="pickerOptions"
                  v-model="date"
                  type="date"
                  :clearable="false"
                  format="yyyy/MM/dd"
                  placeholder="选择日期" class="custom-datepicker">
              </el-date-picker>
            </div>
      </div>
      <div class="enterprise-wrapper" v-if="comp === 'SupplyGasDaily'">
          <div class="title">企业</div>
          <div class="gas-page-com-wrapper">
              <el-select v-model="currentEnterpriceName" placeholder="请选择" class="gas-el-select" @change="handleEnterpriseChange">
              <el-option
                  v-for="item in enterpriseOptions"
                  :key="item.orgName"
                  :label="item.orgName"
                  :value="item.orgName">
              </el-option>
              </el-select>
          </div>        
      </div>
    </div>
    <!-- tabs 选项卡 -->
    <div class="content-wrapper">
      <div class="tabs-wrapper">
        <el-tabs v-model="tabName" @tab-click="handleTabClick" class="tabs">
            <el-tab-pane name="supplyGasDaily" class="tab">
              <span slot="label">供气日报
                <el-tooltip content="可查看前7日的企业供气情况" placement="bottom" popper-class="customer-tooltip">
                  <img :src="questionIcon" class="img">
                </el-tooltip>
              </span>
              <SupplyGasDaily ref="supplyGasDaily" :currentEnterpriceName="currentEnterpriceName" :date="date" :currentEnterpriceCode="currentEnterpriceCode" />
            </el-tab-pane>
            <el-tab-pane name="unconventional" class="tab" v-if="isShowUnconventionalTab">
              <span slot="label">非常规管道气日报
                <el-tooltip content="展示当日的资源数据" placement="bottom" popper-class="customer-tooltip">
                  <img :src="questionIcon" class="img" >
                </el-tooltip>
              </span>              
              <Unconventional :date="date" :curComcode="curComCode" />
            </el-tab-pane>
            <!-- LNG进销存 930不上线 注释 -->
            <!-- <el-tab-pane label="LNG进销存" name="lng" class="tab">
                <Lng :date="date" />
            </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import TopMenu from '@components/topMenu/topMenu'
import dateFormater from '@components/dateFormater/dateFormater'
import SupplyGasDaily from './components/SupplyGasDaily.vue'
import Unconventional from './components/Unconventional.vue'
import Lng from './components/Lng.vue'
import api from '/src/http/api'
import axios from "axios";
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'

export default {
  name:'dispatchDaily',
  mixins:[dateFormater, buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
  components: {
      TopMenu,
      SupplyGasDaily,
      Unconventional,
      Lng
  },
  data() {
    return {
      comp:'SupplyGasDaily',      // 存储动态组件名称
      tabName: 'supplyGasDaily',  // 当前选项卡名称
      currentEnterpriceCode: '',  // 复选下拉列表中企业codes
      currentEnterpriceName: '',  // 企业下拉列表当前选择企业 name
      questionIcon: require('@assets/img/question.png'),  // 选项卡item右侧问号图标
      date: this.getFormatDate(Date.now() - 3600 * 24 * 1000), // 日期选择器当前日期
      enterpriseOptions: [],  // 企业下拉列表（筛选区域）数据
      // 日期选择器时间选择范围（只能选择当前日期之前的日期、包含当前日期）
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
    }
  },
  computed:{
    curComCode() {
      return this.$store.getters.curCom
    },
    // 判断显隐“非常规管理气”选项卡
    isShowUnconventionalTab() {
      return this.$store.getters.curCom === '50311932'
    }
  },
  watch: {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if (n && o) {
          this.getEnterprise()
        }
      },
    },
  },
  created() {

  },
  mounted() {
    this.getEnterprise()
  },
  methods: {
    // 合并所有企业的ecode（得到逗号分隔的ecode值）
    getAllEcodes() {
      let str = ''
      this.enterpriseOptions.map(item => {
        str += item.ecode + ','
      })
      return str
    },
    // 获取企业下拉列表数据 --------------------http://distribution-web-dev.opaas.enncloud.cn/htapi/api/v1/gsm-manage-api/ex/authorg
    getEnterprise(){
      const params = {
        orgCode: this.$store.getters['curCom'],
        orgName: "", 
        orgType: this.$store.getters.curComInfo.orgLevel, 
        pageNum: 1, 
        pageSize: 1000
      }
      axios.post("/htapi/api/v1/gsm-manage-api/ex/authorg", params).then(res => {
        this.enterpriseOptions = res.data.result.list
        this.enterpriseOptions.unshift({
          ecode: this.getAllEcodes(),
          orgName: this.$store.getters['curComName'] + '合计'
        })
        this.currentEnterpriceCode = this.enterpriseOptions[0].ecode
        this.currentEnterpriceName = this.enterpriseOptions[0].orgName
        // this.$refs.supplyGasDaily.getData()
      })
    },
    // 选项卡切换
    handleTabClick(obj) {
        if(obj.index === '0') {
            this.comp = 'SupplyGasDaily'
        } else if (obj.index === '1') {
            this.comp = 'Unconventional'
        } else {
            this.comp = 'Lng'
        }
    },
    // 日期选择器修改
    handleDateChange(val) {
        this.date = this.getFormatDate(val)
    },
    // 企业下拉列表change事件
    handleEnterpriseChange(name) {
      this.currentEnterpriceName = this.enterpriseOptions.find(item => item.orgName === name)['orgName']
      this.currentEnterpriceCode = this.enterpriseOptions.find(item => item.orgName === name)['ecode']
    }
  },
  // 在组件路由守卫中判断来源页面，如果来自非常规详情页面（路由name为unconventionalDailyDetail），则说明用户在非常规详情页面单击了“返回”链接，此时通过 vm.tabName = 'unconventional' 激活“非常规管道气”日报选项卡，从而实现单击“返回”链接后，返回到非常规列表页
  beforeRouteEnter(to, from, next) {
    // beforeRouteEnter中不能访问this，需要给next传递一个回调函数来访问组件实例
    next(vm => {
      if(from.name === 'unconventionalDailyDetail') {
        vm.tabName = 'unconventional'
        vm.comp = 'Unconventional'
      }
    })
  }
}
</script>
<style>
/* tab标签上tooltip的样式 */
.customer-tooltip {
  background:rgb(0,0,0,.8) !important;
  color: #fff !important;
}
</style>
<style lang='scss' rel='stylesheet/scss' scoped>
.container { 
    width:100%;
    position: relative;
    .header-wrapper {
      display: flex;
      margin: 30px;
      .date-wrapper {
        display: flex;
        align-items: center;
        margin-right: 24px;
        .title {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          margin-right: 8px;
        }
        .date-picker {
          /* position: absolute;
          top: 57px;
          left: 264px; */
        }
        .custom-datepicker {
          background: #567db9;
          border-radius: 20px;
          border: none;
          color: #ffffff !important;
        }
        /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
          width: 180px;
        }

        /deep/.el-range-input {
          color:#eee!important;
        } 
        /deep/ .el-table tbody tr:hover>td {
            background-color:#f5f5f5 !important
        }           
      }
      .enterprise-wrapper {
        display: flex;
        align-items: center;
        .title {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          margin-right: 8px;
        }
        .gas-page-com-wrapper {
            width: 260px;
            height: 40px;
            background: #567DB9;
            opacity: 1;
            border-radius: 24px;
            float: right;
            margin-right: 20px;
            overflow: hidden;
            /deep/.el-input__inner {
              width:260px;
            }
        }
      }
    }    
    .content-wrapper {
      margin: 30px;
      /* padding: 24px; */
      padding-top: 8px;
      background: #fff;
      border-radius: 16px;
      .tabs-wrapper {
        .tabs {
          /deep/ .el-tabs__header.is-top {
            margin-bottom: 24px;
            position: relative;
          }
          /deep/ .el-tabs__item {
            color: #999;
            font-size: 16px;
            padding-left: 24px;
            padding-right: -24px;
            padding-top: 3px;
            height:50px;
            box-sizing: border-box;
          }
          /deep/ .el-tabs__item img {
              width: 12px;
              height: 12px;
          }
          /deep/ .el-tabs__item.is-active {
            color: #0FB3AD;
            font-size: 16px;
          }
          /deep/.el-tabs__active-bar {
            background: #0FB3AD;
          }
        }
      }
    } 
    /deep/.el-select .el-input__inner {
      height: 38px !important;
    }  
}
</style>