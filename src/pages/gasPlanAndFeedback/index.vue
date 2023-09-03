<template>
  <div class="agreement-ontents-container gas-page-bg">
    <top-menu :date-picker-show="false"
              title="天然气输配(调度)智慧管理平台"></top-menu>
    <div class="breadcrumb-wrapper">
      <el-breadcrumb>
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <!-- <el-breadcrumb-item :to="{path:'/overView'}">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用气计划反馈</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tog-wrapper">
      <div class="top-title">用气计划反馈</div>
      <el-form :inline="true"
               :model="selectForm"
               class="demo-form-inline">
        <el-button round
                   @click="toggleDayHandler('d')"
                   :class="{'custom-tab-button': true, 'custom-tab-button-active': toggleDate === 'd'}">日</el-button>
        <el-button round
                   @click="toggleDayHandler('w')"
                   :class="{'custom-tab-button': true, 'custom-tab-button-active': toggleDate === 'w'}">周</el-button>
        <el-button round
                   @click="toggleDayHandler('m')"
                   :class="{'custom-tab-button': true, 'custom-tab-button-active': toggleDate === 'm'}">月</el-button>
        <el-button round
                   @click="toggleDayHandler('y')"
                   style="marginRight:30px"
                   :class="{'custom-tab-button': true, 'custom-tab-button-active': toggleDate === 'y'}">年</el-button>
        <el-date-picker v-show="toggleDate == 'd'"
                        v-model="time.day"
                        :clearable="false"
                        type="date"
                        :editable="false"
                        format="yyyy/MM/dd"
                        class="custom-datepicker">
        </el-date-picker>
        <!-- :format="'yyyy/MM 第'+time.week.number+'周'" -->
        <el-date-picker v-show="toggleDate == 'w'"
                        :clearable="false"
                        v-model="time.week.value"
                        :format="'yyyy/MM/dd ~ yyyy/MM/dd'"
                        @change="wChange"
                        size="medium"
                        type="week"
                        ref="week"
                        name="week"
                        placeholder="请选择"
                        class="custom-datepicker week"
                        :picker-options="{'firstDayOfWeek': 1}"></el-date-picker>
        <el-date-picker v-show="toggleDate == 'm'"
                        v-model="time.month"
                        :clearable="false"
                        type="month"
                        :editable="false"
                        format="yyyy/MM"
                        class="custom-datepicker">
        </el-date-picker>
        <el-date-picker v-show="toggleDate == 'y'"
                        v-model="time.year"
                        :clearable="false"
                        type="year"
                        format="yyyy"
                        :editable="false"
                        class="custom-datepicker">
        </el-date-picker>
        <div class="searBox">
          <el-input placeholder="请输入客户名称"
                    class="custom-datepicker"
                    :class="{'yearContractTypeSelect':toggleDate == 'y'}"
                    prefix-icon="el-icon-search"
                    v-model="selectForm.customerName"
                    clearable>
          </el-input>
          <!-- <el-select v-model="selectForm.contractType"
                     class="custom-datepicker contractTypeSelect"
                     clearable
                     v-if="showContractList"
                     placeholder="合同类型"
                     @change="companyChange">
            <el-option :label="v.name"
                       :value="v.value"
                       v-for="(v, i) in contractList"
                       :key="i"></el-option>
          </el-select> -->
          <el-select v-model="yearHandlerVal"
                     class="custom-datepicker contractTypeSelect"
                     :class="{'yearContractTypeSelect':toggleDate == 'y'}"
                     placeholder=""
                     v-show="showYearContractList"
                     @change="yearHandlerValChange">
            <el-option :label="v.name"
                       :value="v.value"
                       v-for="(v, i) in yearHandlerValList"
                       :key="i"></el-option>
          </el-select>
          <el-select v-model="selectForm.contractType"
                     class="custom-datepicker contractTypeSelect"
                     :class="{'yearContractTypeSelect':toggleDate == 'y'}"
                     clearable
                     v-if="showContractList"
                     placeholder="合同类型"
                     @change="companyChange">
            <el-option :label="v.name"
                       :value="v.value"
                       v-for="(v, i) in contractList"
                       :key="i"></el-option>
          </el-select>
        </div>
      </el-form>
    </div>
    <div v-if="toggleDate=='y'">
      <year-view :selectForm="selectForm"
                 :time="time"
                 ref="yearView"
                 :yearHandlerVal="yearHandlerVal" />
    </div>
    <div v-else-if="toggleDate=='m'">
      <month-view :selectForm="selectForm"
                  :time="time" />
    </div>
    <div v-else-if="toggleDate=='w'">
      <week-view :selectForm="selectForm"
                 :weekformat="weekformat"
                 :time="time" />
    </div>
    <div v-else-if="toggleDate=='d'">
      <day-view :selectForm="selectForm"
                :time="time" />
    </div>
  </div>
</template>

<script>
import topMenu from "../../components/topMenu/topMenu2";
import exportApi from "../../components/export/export";
import yearView from './components/year'
import monthView from './components/month'
import weekView from './components/week'
import dayView from './components/day'
import { buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin } from '@/utils/mixin'

export default {
  name: "demandPlanTrack",
  mixins: [exportApi, buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
  data () {
    return {
      showYearContractList: false,
      showContractList: true,
      yearHandlerVal: '3',
      yearHandlerValList: [
        { name: '已签约', value: '3' },
        { name: '已反馈', value: '1' },
        { name: '待反馈', value: '0' }
      ],
      weekformat: null,
      pageSize: [10],
      time: {
        day: Date.now() + 86400000,
        week: {
          value: Date.now(),
          number: 1
        },
        month: Date.now(),
        year: Date.now(),
      },
      toggleDate: 'd',
      customerName: '',
      contractType: '',

      selectForm: {
        customerName: '',
        contractType: ''
      },
      contractList: [
        { name: '直销', value: '3' },
        { name: '代输', value: '1' },
        { name: '代销', value: '2' },
      ],
      timer: null
    }
  },
  watch: {
    toggleDate: {
      handler () {
        // 重置年的合同类型
        // this.yearHandlerVal = '3'
      },
      deep: true,
      immediate: true
    },
    'time.week.value': {
      handler (now) {
        this.$nextTick(() => {
          let today = this.parseTime(now, '{yyyy}-{mm}-{dd}')
          let weekDay = this.getWeekDate(now)
          let one = null
          let last = null
          switch (weekDay) {
            case '星期日':
              one = this.parseTime((new Date(now).getTime() - 6 * 86400000), '{yyyy}/{mm}/{dd}')
              last = this.parseTime((new Date(today).getTime()), '{yyyy}/{mm}/{dd}')
              break;
            case '星期一':
              one = this.parseTime((new Date(now).getTime()), '{yyyy}/{mm}/{dd}')
              last = this.parseTime((new Date(today).getTime() + 6 * 86400000), '{yyyy}/{mm}/{dd}')
              break;
            case '星期二':
              one = this.parseTime((new Date(now).getTime() - 1 * 86400000), '{yyyy}/{mm}/{dd}')
              last = this.parseTime((new Date(today).getTime() + 5 * 86400000), '{yyyy}/{mm}/{dd}')
              break;
            case '星期三':
              one = this.parseTime((new Date(now).getTime() - 2 * 86400000), '{yyyy}/{mm}/{dd}')
              last = this.parseTime((new Date(today).getTime() + 4 * 86400000), '{yyyy}/{mm}/{dd}')
              break;
            case '星期四':
              one = this.parseTime((new Date(now).getTime() - 3 * 86400000), '{yyyy}/{mm}/{dd}')
              last = this.parseTime((new Date(today).getTime() + 3 * 86400000), '{yyyy}/{mm}/{dd}')
              break;
            case '星期五':
              one = this.parseTime((new Date(now).getTime() - 4 * 86400000), '{yyyy}/{mm}/{dd}')
              last = this.parseTime((new Date(today).getTime() + 2 * 86400000), '{yyyy}/{mm}/{dd}')
              break;
            case '星期六':
              one = this.parseTime((new Date(now).getTime() - 5 * 86400000), '{yyyy}/{mm}/{dd}')
              last = this.parseTime((new Date(today).getTime() + 1 * 86400000), '{yyyy}/{mm}/{dd}')
              break;

            default:
              break;
          }
          let s = one + '~' + last
          this.weekformat = s
          let dom = document.querySelector('.custom-datepicker.week input')
          dom.value = s
        })
      },
      deep: true,
      immediate: true
    },
  },
  mounted () {
    let type = this.$route.query.planType
    if (type === 'w') { } else {
      this.time.week.value += 86400000 * 7
    }
  },

  components: {
    topMenu,
    yearView,
    monthView,
    weekView,
    dayView,
  },
  created () {
    this.wChange(this.time.week.value)
    this.handleUrl()
  },
  methods: {
    handleUrl () {
      // ?planType=d&customerName=&time=2021-12-24
      let type = this.$route.query.planType
      switch (type) {
        case 'y':
          this.toggleDate = 'y'
          this.showYearContractList = true
          setTimeout(() => {
            this.yearHandlerVal = '0'
            this.showContractList = false
          }, 100);
          this.time.year = new Date(this.$route.query.time).getTime()
          this.selectForm.customerName = this.$route.query.customerName
          break;
        case 'm':
          this.toggleDate = 'm'
          this.time.month = new Date(this.$route.query.time).getTime()
          this.selectForm.customerName = this.$route.query.customerName
          break;
        case 'w':
          this.toggleDate = 'w'
          this.time.week.value = new Date(this.$route.query.time).getTime()
          this.selectForm.customerName = this.$route.query.customerName
          break;
        case 'd':
          this.toggleDate = 'd'
          this.time.day = new Date(this.$route.query.time).getTime()
          this.selectForm.customerName = this.$route.query.customerName
          break;

        default:
          break;
      }
    },
    yearHandlerValChange (val) {
      switch (val) {
        case '3':
          this.showContractList = true
          this.yearHandlerVal = '3'
          break;
        case '1':
          this.showContractList = false
          this.yearHandlerVal = '1'
          break;
        case '0':
          this.showContractList = false
          this.yearHandlerVal = '0'
          break;
      }
    },
    getWeekDate (time) {
      var now = new Date(time);
      var day = now.getDay();
      var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
      var week = weeks[day];
      return week;
    },
    parseTime (time, cFormat) {
      if (arguments.length === 0) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string')) {
          if ((/^[0-9]+$/.test(time))) {
            time = parseInt(time)
          } else {
            time = time.replace(new RegExp(/-/gm), '/')
          }
        }

        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        return value.toString().padStart(2, '0')
      })
      return time_str
    },
    // 分页
    handlePagerChange () {
    },
    handleWeek () {

    },
    // 切换日期类型
    toggleDayHandler (toggleTyle) {
      this.toggleDate = toggleTyle
      switch (toggleTyle) {
        case 'y':
          this.toggleDate = 'y'
          this.showYearContractList = true
          this.showContractList = true
          let type = this.$route.query.planType
          if (type) {
            setTimeout(() => {
              this.yearHandlerVal = '0'
              this.showContractList = false
              this.$refs.yearView.yearTime('0')
            }, 100);
          }
          break;
        case 'm':
          this.toggleDate = 'm'
          this.showYearContractList = false
          this.showContractList = true
          break;
        case 'w':
          this.toggleDate = 'w'
          this.showYearContractList = false
          this.showContractList = true
          this.wChange(this.time.week.value)
          break;
        case 'd':
          this.showYearContractList = false
          this.showContractList = true
          this.toggleDate = 'd'
          break;
        default:
          break;
      }

    },
    // 日历选择，日期改变请求
    wChange (val) {
      let now = new Date(val).getTime()
      let time = this.$moment(now).format('YYYY-MM-DD');
      let y = time.split('-')[0]
      let m = time.split('-')[1]
      let d = time.split('-')[2]
      let getDate = this.getMonthWeek(y, m, d)
      this.time.week.number = getDate.getWeek
    },
    getMonthWeek (a, b, c) {
      var date = new Date(a, parseInt(b) - 1, c),
        w = date.getDay(),
        d = date.getDate();
      if (w == 0) {
        w = 7;
      }
      var config = {
        getMonth: date.getMonth() + 1,
        getYear: date.getFullYear(),
        getWeek: Math.ceil((d + 6 - w) / 7),
      }
      return config;
    },
    // var getDate=getMonthWeek("2018", "12", "31");
    // 合同类型变化
    companyChange (val) {
      // 合同类型:1代输 2三方 3直销 4补充协议
      switch (val) {
        case '1':
          this.selectForm.contractType = '1'
          break;
        case '2':
          this.selectForm.contractType = '2'
          break;
        case '3':
          this.selectForm.contractType = '3'
          break;
        case '4':
          this.selectForm.contractType = '4'
          break;
        default:
          break;
      }
    },
  }
}
</script>

<style>
@media screen and (max-width: 1440px) {
  .searBox .yearContractTypeSelect {
    width: 150px !important;
  }
  .searBox .yearContractTypeSelect input {
    width: 150px !important;
  }
}
@media screen and (min-width: 1450px) and (max-width: 1920px) {
  .searBox .yearContractTypeSelect {
    width: 180px !important;
  }
  .searBox .yearContractTypeSelect input {
    width: 180px !important;
  }
}
</style>
<style scoped lang="scss">
.gas-page-bg {
  min-width: auto !important;
  padding-bottom: 0 !important;
}
.breadcrumb-wrapper {
  height: 41px;
  padding: 10px 0 10px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  /deep/ .el-breadcrumb__item:last-child > .el-breadcrumb__inner {
    color: #fff;
  }
  /deep/ .el-breadcrumb__inner {
    color: rgba(255, 255, 255, 0.5);
  }
}
.top-title {
  margin-right: 26px;
  font-size: 18px;
  color: #303133;
  font-weight: 700;
}
.custom-datepicker.week /deep/ input {
  position: relative;
}
.tog-wrapper {
  margin-left: 20px;
  padding: 24px 17px 0 17px;
  background-color: #fff;
  box-sizing: border-box;
  width: calc(100% - 40px);
  display: flex;
  align-items: center;
  border-radius: 4px 4px 0 0;
}
.demo-form-inline {
  width: 86%;
  display: flex;
  align-items: center;
}
.custom-tab-button {
  color: #606266;
  background-color: #f0f2f5;
  border-color: #f0f2f5;
  padding: 0;
}
.custom-tab-button /deep/ span {
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  line-height: 32px;
  text-align: center;
}

.custom-tab-button-active {
  color: #fff;
  background-color: #47a87d;
  border-color: #47a87d;
}
//
.contractTypeSelect /deep/ .el-input.el-input--suffix input {
  padding-left: 16px !important;
}
.searBox /deep/ input {
  width: 200px;
}
.searBox /deep/ .contractTypeSelect {
  width: 200px;
}
.searBox /deep/ .el-input__suffix {
  display: flex;
  align-items: center;
}
.custom-datepicker {
  width: 200px;
  background: #f5f7fa;
  border-radius: 16px;
  border: 1px solid #dcdfe6;
  margin-right: 20px;
  padding: 6px, 0px, 6px, 0px;
}
.custom-datepicker /deep/ input {
  color: #303133 !important;
  height: 32px;
  line-height: 32px;
  font-size: 14px !important;
  background-color: #f5f7fa;
  text-align: left;
  padding-left: 33px;
}
.custom-datepicker /deep/ .el-input__suffix {
  border-left: none !important;
}
.custom-datepicker /deep/ input::-webkit-input-placeholder {
  color: #909399;
}
.custom-datepicker /deep/ input::-moz-input-placeholder {
  color: #909399;
}
.custom-datepicker /deep/ input::-ms-input-placeholder {
  color: #909399;
}
.custom-datepicker /deep/ .el-input__prefix .el-input__icon {
  line-height: 32px !important;
}
.demo-form-inline {
  /deep/ .el-form-item__label {
    color: #ffffff;
    font-size: 16px;
  }

  /deep/ .gas-el-select .el-input__suffix {
    border-left: none;
    right: 12px;
  }
}
.gas-page-com-wrapper {
  width: 220px;
  height: 40px;
  background: #567db9;
  opacity: 1;
  border-radius: 24px;
  float: right;
  margin-right: 20px;
  overflow: hidden;
}
.banner-title-wrapper {
  height: 72px;
  width: 100%;
}
.banner-title-item-l {
  float: left;
  height: 100%;
  line-height: 71px;
  margin-left: 42px;
  text-align: left;
}
.banner-table-wrapper {
  padding: 0 30px 60px 30px;
  box-sizing: border-box;
}
.empty-wrapper {
  height: 436px;
  padding-top: 43px;
  box-sizing: border-box;
  p {
    height: 24px;
    line-height: 24px;
    padding: 0;
    margin: 0;
  }
}
.contractType {
  display: inline-block;
  width: 48px;
  height: 24px;
  border-radius: 12px;
  text-align: center;
  font-size: 14px;
  box-sizing: border-box;
  margin-right: 20px;
}
.sure-plan {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.longCustomerName {
  display: inline-block;
  width: 18em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.contractName {
  min-width: 263px;
}
.longcontractName {
  display: inline-block;
  width: 15em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.input {
  width: 120px;
  height: 32px;
}
.sale-proxy {
  border: 1px solid #f56c6c;
  background: #fef0f0;
  color: #f56c6c;
}
.sale-direct {
  border: 1px solid #409eff;
  color: #409eff;
  background-color: #ecf5ff;
}
.sale-third {
  border: 1px solid #e6a23c;
  background-color: #fcf6ec;
  color: #e6a23c;
}
.customerName {
  font-size: 16px;
  color: #303133;
}
.custom-table {
  border: 1px solid #dcdfe6;
  border-radius: 8px 8px 0px 0px;
  font-size: 16px;
  color: #303133;
  /deep/ .el-table__empty-block {
    width: auto !important;
  }
  /deep/ .custom-table-header th {
    background: #f5f7fa !important;
    padding: 0 10px 0 28.5px;
    color: #606266;
    font-weight: 500;
  }
  /deep/ .custom-table-header th:first-child {
    padding: 0 10px;
  }
  /deep/ tbody tr td {
    padding: 0 10px 0 28.5px;
  }
  /deep/ tbody tr td:first-child {
    padding: 0 10px;
  }
  /deep/ .el-table__fixed {
    border-top-left-radius: 25px;
    height: auto !important;
    bottom: 10px;
  }
  /deep/ ::-webkit-scrollbar {
    height: 10px;
  }
}
.checkDetail {
  color: #409eff;
  cursor: pointer;
}
.banner-title-item-l span {
  display: inline-block;
  vertical-align: middle;
}

.custom-button {
  float: right;
  height: 40px;
  margin-right: 30px;
  margin-top: 17px;
  color: #fff;
  background-color: #47a87d !important;
}
.custom-button /deep/ span,
.custom-button /deep/.el-icon-upload2 {
  color: #fff;
}
.bold {
  font-weight: 600;
}
</style>