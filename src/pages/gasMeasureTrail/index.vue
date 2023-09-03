<template>
  <div class="measure-trail">
    <div class="top-content">
      <div class="topmain-content">
        <top-menu :date-picker-show="false"></top-menu>
        <el-tabs v-model="activeName" class="tab-content">
          <el-tab-pane label="用气偏差" name="frist">
            <topGas
              v-if="activeName === 'frist'"
              :selectArea="selectArea"
              @timeValueChangeforGas="timeValueChangeforGas"
              @gasChartTable="gasChartTable"
            />
          </el-tab-pane>
          <el-tab-pane label="合同偏差" name="second">
            <topContract
              v-if="activeName === 'second'"
              :selectArea="selectArea"
              @timeValueChangeforContract="timeValueChangeforContract"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <mainGas
      v-if="activeName === 'frist'"
      ref="main-gas"
      :class="{
        'main-gas-content': true,
        'is-province': selectArea && selectArea.cpmo_cop && selectArea.cpmo_cop.toString() === 'true',
        'is-city':selectArea && selectArea.cpmo_cop && selectArea.cpmo_cop.toString() === 'false',
      }"
      :selectArea="selectArea"
    />
    <mainContract
      v-if="activeName === 'second'"
      ref="main-contract"
      class="main-contract-content"
      :selectArea="selectArea"
      :timeValue="timeValueforContract"
    />
  </div>
</template>

<script>
import mainGas from "./components/mainGas";
import mainContract from "./components/mainContract";
import topGas from "./components/topGas";
import topContract from "./components/topContract";
import topMenu from "../../components/topMenu/topMenu";

export default {
  name: "",
  components: { mainContract, mainGas, topGas, topContract, topMenu },
  props: {},
  data() {
    return {
      browerTime:0,
      timer:null,      
      activeName: "frist",
      options: [],
      setFontSize: () => {},
      timeValueforGas: "",
      timeValueforContract: "",
    };
  },
  created() {
    window.zhuge.track('气量分析-进入企业用气跟踪页面',{'页面名称':'企业用气跟踪页面'})
  },
  mounted() {
    this.getBrowerTime()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.zhuge.track('气量分析-企业用气跟踪页面停留时长',{'企业用气跟踪页面停留时长':this.browerTime})
  },   
  computed: {
    selectArea:  {
      get () {
        let level = this.$store.getters.curComInfo
        return {
          code: this.$store.getters.curCom,
          cpmo_cop: level.orgLevel === 4 ? 'false' : 'true'
        }
      }
    }
  },
  methods: {
    getBrowerTime() {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    },     
    timeValueChangeforGas(val) {
      this.timeValueforGas = val.data;
    },
    timeValueChangeforContract(val) {
      this.timeValueforContract = val.data;
    },
    gasChartTable(val) {
      this.$refs["main-gas"].chartTable = val.tableData.map((one) => {
        one.forecastDeviationRatio =
          one.forecastDeviationRatio.toString() + "%";
        one.deviationAssessment = one.deviationAssessment.toString() + "%";
        return one;
      });
      this.$refs["main-gas"].params = val.params;
    },
  },
};
</script>

<style lang='scss' scoped>
@import "./scss/index.scss";
.topmain-content {
  /deep/ .gas-page-header-container {
    margin-top: 20px;
    position: relative;
    z-index: 200;
  }
}
.tab-content {
  /deep/ .el-tabs__header {
    z-index: 300;
  }
}
@media screen and (min-width: 1610px) {
  .select-area {
    width: 160px;
  }
  /deep/ {
    .el-tabs__nav-wrap::after {
      height: 0;
    }
    .el-tabs__header {
      width: 70%;
      margin: 0 8px;
    }
    .el-tabs__item.is-active {
      color: #ffffff;
      font-weight: 500;
      font-size: 28px;
      height: 40px;
    }
    .el-tabs__item {
      color: #ffffff;
      height: 44px;
      padding: 0 10px;
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC, sans-serif;
      font-weight: 500;
      line-height: 40px;
    }
    .el-tabs__active-bar {
      height: 0;
      background-color: #ffffff;
    }
    .el-radio-group {
      z-index: 999;
      margin-left: 18px;
      height: 14px;
      @include elRadio1920;
    }
  }
}
@media screen and (max-width: 1609px) {
  .select-area {
    width: 146px;
  }
  /deep/ {
    .el-tabs__nav-wrap::after {
      height: 0;
    }
    .el-tabs__header {
      width: 70%;
      margin: 0 8px;
    }
    .el-tabs__item.is-active {
      color: #ffffff;
      font-weight: 500;
      font-size: 24px;
      height: 40px;
    }
    .el-tabs__item {
      color: #ffffff;
      height: 44px;
      padding: 0 8px;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC, sans-serif;
      font-weight: 500;
      line-height: 40px;
    }
    .el-tabs__active-bar {
      height: 0;
      background-color: #ffffff;
    }
    .el-radio-group {
      z-index: 999;
      margin-left: 18px;
      height: 14px;
      @include elRadio1440;
    }
  }
}
</style>