<template>
<div class="day-gas-mask">
  <div class="day-gas-container gas-page-bg">
    <div class="top-bag">
      <div class="top-header">
        <top-menu
          :date-picker-show="false"
          title="用气交割"
        ></top-menu>
      </div>
      <div class="button-wrapper">
        <el-button round class='day-gas-consumption' :class="{activeBg:comp === 'DayGasConsumptionDelivery'}" @click="() => comp = 'DayGasConsumptionDelivery'">日气量交割</el-button>
        <el-button round class='change-history' :class="{activeBg:comp === 'ChangeHistoryGasConsumptionDelivery'}" @click="() => comp = 'ChangeHistoryGasConsumptionDelivery'">变更历史交割气量</el-button>
      </div>
    </div>
    <component :is='comp' />
  </div>
</div>
  
</template>

<script>
import topMenu from "../../components/topMenu/topMenu";
import DayGasConsumptionDelivery from './components/DayGasConsumptionDelivery'
import ChangeHistoryGasConsumptionDelivery from './components/ChangeHistoryGasConsumptionDelivery'
export default {
  name: "PurchaseAnalysiss",
  components: {
    topMenu,
    DayGasConsumptionDelivery,
    ChangeHistoryGasConsumptionDelivery
  },
  computed:{
    isActive() {
      return this.comp === 2
    }
  },
  data() {
    return {
      browerTime:0,
      timer:null,
      comp:'DayGasConsumptionDelivery'
    }
  },
  methods:{
    getBrowerTime() {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    },
  },
  created() {
    window.zhuge.track('导航页-气量调配-进入用气交割页面',{'页面名称':'用气交割页面'})
  },
  mounted() {
    this.getBrowerTime()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.zhuge.track('气量调配-用气交割页面停留时长',{'用气交割页面停留时长':this.browerTime})
  }
};
</script>
<style lang='scss' scoped>
.button-wrapper {
  margin-left: 32px;
  margin-top: 40px;
  .day-gas-consumption,.change-history {
    width:184px;
    height:40px;
    color:#fff;
    font-size: 18px;
    text-align: center;
    background: #567DB9;
    border:none;
  }
  .activeBg {
    background: #0FB2AB;
  }
  .day-gas-consumption {

  }
  .change-history {
    box-sizing: border-box;
  }
}
</style>
