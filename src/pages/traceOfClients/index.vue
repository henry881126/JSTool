<template>
  <div>
    <div class="container-header-wrapper gas-page-bg">
      <top-menu title="客户用气跟踪" @curComChanged='curComCodeChanged'></top-menu>
      <div class="date-picker">
        <el-date-picker
            v-model="time"
            type="month"
            @change="timeChange"
            :clearable="false"
            format="yyyy/MM"
            :picker-options="pickerOptions"
            placeholder="选择日期" class="custom-datepicker">
        </el-date-picker>
      </div>
      <div class="container-header-second">
        <el-button round @click="toggleDayHandler('zong')"
                   :class="{'custom-tab-button': true, 'custom-tab-button-active': toggleType === 'zong'}" >
          总体概况
        </el-button>
        <el-button round @click="toggleDayHandler('gong')"
                   :class="{'custom-tab-button': true, 'custom-tab-button-active': toggleType === 'gong'}" >
          工商用户
        </el-button>
        <el-button round @click="toggleDayHandler('min')"
                   :class="{'custom-tab-button': true, 'custom-tab-button-active': toggleType === 'min'}" >
          民用户
        </el-button>
      </div>
      <div v-if="toggleType === 'zong'">
        <Overview :time="time" :currentDate="currentDate" :curComCode='curComCode'></Overview>
      </div>
      <div v-if="toggleType === 'min'">
        <Person :time="getFormatMonth(time)"></Person>
      </div>
      <div v-if="toggleType === 'gong'">
        <BusinessUser :time="time" :currentDate="currentDate" :curComCode='curComCode'></BusinessUser>
      </div>
    </div>
  </div>
</template>

<script>
const oneMonth = 30 * 24 * 60 * 60 * 1000     // 1个月的时间戳
import topMenu from "../../components/topMenu/topMenu";
import Overview from './overview'
import BusinessUser from './BusinessUser'
import moment from 'moment'
import Person from './person'
import dateFormater from "../../components/dateFormater/dateFormater";

export default {
  name: "traceOfClients",
  mixins: [dateFormater],
  data: function () {
    let that = this
    return {
      browerTime:0,
      timer:null,
      toggleType: 'zong',
      time: Date.now() - oneMonth,      // 子组件监听time变化、更新数据，time值为上个月
      currentDate: moment(Date.now()- oneMonth).format('yyyyMM'),
      curComCode: this.$store.getters.curCom,
      pickerOptions: {
        disabledDate(time) {
          let oneDay = 1 * 24 * 60 * 60 * 1000
          // let oneMonth = 30 * 24 * 60 * 60 * 1000
          let firstDayTimestamp
          // 假设当月为7月，如果到达本月27号，则返回7月1日，否则返回6月1日
          let d = new Date()
          let currentYear = d.getFullYear()
          let currentMonth = d.getMonth()
          let currentDay = d.getDate()
          if(currentDay >= 27) {
            firstDayTimestamp = new Date(currentYear,currentMonth+1,1).getTime()        // 下月1号
          } else {
            firstDayTimestamp = new Date(currentYear,currentMonth,1).getTime()        // 当月1号
          }
          return time.getTime() > firstDayTimestamp - oneDay
        }
      }
    }
  },
  components: {
    topMenu,
    Overview,
    BusinessUser,
    Person
  },
  methods: {  
    getBrowerTime() {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    },     
    // 顶部 总体概况、工商用户、民用户切换
    toggleDayHandler: function (type) {
      this.toggleType = type
    },
    // 日期选择器事件
    timeChange() {
      this.currentDate = moment(this.time).format('yyyyMM')
    },
    // 右上角公司切换事件
    curComCodeChanged() {
      this.curComCode = this.$store.getters.curCom.toString()
      this.time = Date.now()-oneMonth     // 右上角公司切换时，日期选择器保持选中上月
    }
  },
  created() {
    window.zhuge.track('气量分析-进入客户用气跟踪页面',{'页面名称':'客户用气跟踪页面'})
  },
  mounted() {
    this.getBrowerTime()
    // 在工商客户类型页面点击“回退到工商户”链接时，url中会携带toggleType参数，其值为gong，此时走此代码，返回后页面定位到工商户
    if(this.$route.query.toggleType === 'gong') {
      this.toggleType = 'gong'
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.zhuge.track('气量分析-客户用气跟踪页面停留时长',{'客户用气跟踪页面停留时长':this.browerTime})
  }, 
}
</script>

<style scoped lang="scss">
.container-header-second {
  width: calc(100% - 60px);
  margin: 32px 0 0 32px;
}

.date-picker {
  position: absolute;
  top: 57px;
  left: 264px;
}

.custom-datepicker {
  background: #567db9;
  border-radius: 20px;
  border: none;
  color: #ffffff !important;
}
.custom-tab-button {
  margin-right: 20px;
  margin-left: 0;
  color: #FFF;
  background-color: #567DB9;
  border-color: #567DB9;
  font-size:18px;
}
.custom-tab-button-active {
  color: #FFF;
  background-color: #0FB2AB;
  border-color: #0FB2AB;
}
.date-picker {
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 180px;
  }
}
</style>