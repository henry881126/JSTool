<template>
  <div>
    <div class="header-wrapper gas-page-bg">
      <top-menu title="日计划" @curComChanged='curComCodeChanged'></top-menu>
      <div class="header-menu">
        <el-button 
          round
          :type="toggleDayPlanType === 'report' ? 'primary' : ''"
          @click="toggleDayPlanHandler('report')"
          class='btn'
          v-trace="{title:'计划管理-日计划-点击日计划上报'}"
          >日计划上报
        </el-button>
        <el-button 
          round
          :type="toggleDayPlanType === 'change' ? 'primary' : ''"
          @click="toggleDayPlanHandler('change')"
          class="btn"
          v-trace="{title:'计划管理-日计划-点击日计划变更'}"
          >
          日计划变更
        </el-button>
        <div class='unit'>（单位：万方）</div>
      </div>

      <div v-if="toggleDayPlanType === 'report'">
        <DayPlanReport :currentType='toggleDayPlanType'></DayPlanReport>
      </div>
      <div v-if="toggleDayPlanType === 'change'">
        <DayPlanChange :currentType='toggleDayPlanType'></DayPlanChange>
      </div>
    </div>
  </div>
</template>

<script>
import topMenu from "../../components/topMenu/topMenu";
import DayPlanReport from './components/DayPlanReport.vue'
import DayPlanChange from './components/DayPlanChange'
import dateFormater from "../../components/dateFormater/dateFormater";

export default {
  name: "traceOfClients",
  mixins: [dateFormater],
  data: function () {
    return {
      toggleDayPlanType: 'report',
    }
  },
  components: {
    topMenu,
    DayPlanReport,
    DayPlanChange,
  },
  methods: {  
    // 顶部 总体概况、工商用户、民用户切换
    toggleDayPlanHandler: function (type) {
      this.toggleDayPlanType = type
    },

    // 右上角公司切换事件
    curComCodeChanged() {
      this.curComCode = this.$store.getters.curCom.toString()
    }
  },
  mounted() {

  }
}
</script>

<style lang="scss" rel='stylesheet/scss' scoped>
.header-wrapper {
  position: relative;
  .header-menu {
    z-index: 999;
    display: flex;
    align-items: center;
    position: absolute;
    top:225px;
    left:60px;
    .btn {
      width:140px;
      height:46px;
      border-radius: 23px;
      border:1px solid #0FB2AB;
      color:#0FB2AB;
    }
    .unit {
      font-size: 14px;
      color:#505356;
      margin-left: 30px;
    }
    // .plain-text {
    //   color: #FFF;
    //   font-size:16px;
    // }

    // .active-text {
    //   color: #FFF;
    //   font-size:30px;
    // }
      /deep/ .el-button--primary {
          background: #0FB2AB;
          color:#fff;
      }
      /deep/ .el-button--primary.is-disabled {
        background:#a0cfff;
      }    
  }
}
// .container-header-second {
//   width: calc(100% - 60px);
//   margin: 32px 0 0 32px;
// }




</style>