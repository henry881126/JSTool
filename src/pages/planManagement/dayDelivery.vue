<template>
  <div class='delivery-wrapper gas-page-bg'>
    <top-menu title='日交割管理'></top-menu>
    <DateRangePicker @handleDateChange='handleDateChange' class='dateRangePicker'></DateRangePicker>
    <div class="button-wrapper">
      <el-button class='btn-day' :style="{background:comp === 'DayGasConsumptionDelivery' ? '#0FB2AB' : '#567DB9'}" @click="handleBtnClick('DayGasConsumptionDelivery')">日气量交割</el-button>
      <el-button class='btn-change' :style="{background:comp === 'ChangeHistoryDeliveryGasConsumption' ? '#0FB2AB' : '#567DB9'}" @click="handleBtnClick('ChangeHistoryDeliveryGasConsumption')">变更历史交割气量</el-button>
    </div>
    <component :is='comp' :startTime='startTime' :endTime='endTime' />
  </div>
</template>

<script>
import TopMenu from '@components/topMenu/topMenu'
import DateRangePicker from './components/DateRangePicker.vue'
import dateFormater from '@components/dateFormater/dateFormater'
import DayGasConsumptionDelivery from './components/DayGasConsumptionDelivery'
import ChangeHistoryDeliveryGasConsumption from './components/ChangeHistoryDeliveryGasConsumption.vue'

export default {
  name:'dayDeliveryManagement',
  mixins:[dateFormater],
  components: {
      TopMenu,
      DateRangePicker,
      DayGasConsumptionDelivery,
      ChangeHistoryDeliveryGasConsumption
  },
  data() {
    return {
      browerTime:0,
      timer:null,
      comp:'DayGasConsumptionDelivery',      // 动态组件
      startTime:this.getFormatDate(new Date()-7*86400*1000),
      endTime:this.getFormatDate(new Date()),      
    }
  },
  computed:{

  },
  methods: {
    getBrowerTime() {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    },
    handleBtnClick(comp) {
      this.comp = comp
    },
    handleDateChange(val) {
      if(val && val.length > 0) {
        this.startTime = this.getFormatDate(val[0])
        this.endTime = this.getFormatDate(val[1])
        this.getDayDeliveryList()
      }
    },    
  },
  created() {
    window.zhuge.track('导航页-计划管理-进入日交割管理页面',{'页面名称':'日交割确认页面'})
  },
  mounted() {
    this.getBrowerTime()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    console.log('end browtime')
    window.zhuge.track('计划管理-日交割管理页面停留时长',{'日交割管理页停留时长':this.browerTime})
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.delivery-wrapper { 
    width:100%;
    position: relative;
    .dateRangePicker {
      position:absolute;
      top:54px;
      left:255px;
    }
    .button-wrapper {
      margin-top: 40px;
      margin-left: 32px;
      .btn-day, .btn-change {
        margin-left: 0;
        margin-right:20px;
        width:176px;
        height:40px;
        border-radius: 20px;
        border:none;
        font-size: 18px;
        /* font-weight: 600; */
        color:#fff;
      }
    }


    /deep/.el-range-input {
      color:#eee!important;
    } 
    /deep/ .el-table tbody tr:hover>td {
        background-color:#f5f5f5 !important
    }    
}
</style>