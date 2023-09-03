<template>
  <div class="tab-inside-content">
    <div class="topleft-content">
      <timeAreaforTop
        effect="dark"
        type="one-year"
        @timeValueChange="timeValueChangeforContract"
      />
      <el-radio-group v-model="contractLabelCheck">
        <el-radio @click.native.prevent="clickitem('1')" label="1">
          进气量同比</el-radio
        >
      </el-radio-group>
    </div>
    <div
      class="chart-content"
      id="contract-chart"
      v-if="contractLabelCheck === ''"
    ></div>
    <div class="chart-content" id="inputgas-ratio-chart" v-else></div>
  </div>
</template>

<script>
import timeAreaforTop from "./../common/components/timeAreaforTop";
import {
  contractChartOption,
  inputGasRatioChartOption,
} from "./../common/chartOptions/sectabChartOption";
export default {
  name: "",
  components: { timeAreaforTop },
  props: {
    selectArea: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      barWidth: '',
      contractChart: null,
      inputGasRatioChart: null,
      gasLabelCheck: "",
      contractLabelCheck: "",
      timeType: "",
      resContractChart: [],
      activeYearValue: "",
    };
  },
  computed: {},
  watch: {
    selectArea: {
      handler(val) {
        if(val.code) {
          this.refreshChart();

        }
        
        // this.initSecondTabChart();
      },
    },
    contractLabelCheck: {
      handler(val) {
        this.refreshChart();
        // this.initSecondTabChart();
      },
    },
  },
  mounted() {},
  created() {
    this.barWidth= window.screen.width >= 1920? 16: 12;
  },
  methods: {
    clickitem(e) {
      e === this.contractLabelCheck
          ? (this.contractLabelCheck = "")
          : (this.contractLabelCheck = e);
    },
    timeValueChangeforContract(val) {
      this.timeType = val.type;
      if (this.timeType === "year") {
        this.activeYearValue = val.data;
      }
      this.$emit("timeValueChangeforContract", val);
      this.refreshChart();
    },
    refreshChart() {
      this.getContractDevitionBarChart();
    },
    initSecondTabChart() {
      if (this.contractLabelCheck !== "") {
        // 对比
        this.disposeChart();
        this.$nextTick(() => {
          this.initInputGasRatioChart();
        });
      } else {
        // 默认
        this.disposeChart();
        this.$nextTick(() => {
          this.initContractChart();
        });
      }
    },
    async getContractDevitionBarChart() {
      // 获取实时 合同偏差 图表数据
      if ((this.activeYearValue.length === 0)||(!this.selectArea.code)) {
        return;
      }
      // const companyCode = this.selectArea === "50311934" ? "50311934" : "0232"; //暂时测试用
      const res = await this.$api.getContractDevitionBarChart(
        this.selectArea.code,
        this.activeYearValue
      );
      if (res.resultCode === 0) {
        if (res.data && res.data.length > 0) {
          this.resContractChart = res.data;
          this.initSecondTabChart();
        }
      } else {
        this.$message.error(res.resultMessage);
      }
    },
    initContractChart() {
      this.contractChart = this.$echarts.init(
        document.getElementById("contract-chart")
      );
      const dataX = this.resContractChart.map((one) => one.time);
      const dataY1 = this.resContractChart.map((one) => one.contractNumber); //合同量
      const dataY2 = this.resContractChart.map((one) => one.gasInNumber); //进气量
      const dataY3 = this.resContractChart.map((one) => one.contractDeviationRate); //合同偏差率
      this.contractChart.setOption(
        contractChartOption(dataX, dataY1, dataY2, dataY3, this.barWidth)
      );
    },
    initInputGasRatioChart() {
      this.inputGasRatioChart = this.$echarts.init(
        document.getElementById("inputgas-ratio-chart")
      );
      const dataX = this.resContractChart.map((one) => one.time);
      const dataY1 = this.resContractChart.map(
        (one) => one.lastIssueGasInNumber
      ); //上期进气量
      const dataY2 = this.resContractChart.map((one) => one.gasInNumber); //（本期）进气量
      const dataY3 = this.resContractChart.map((one) => parseFloat(one.growthRate)); //同比增长率
      this.inputGasRatioChart.setOption(
        inputGasRatioChartOption(dataX, dataY1, dataY2, dataY3, this.barWidth)
      );
    },
    disposeChart() {
      if (this.contractChart) {
        this.contractChart.dispose();
      }
      if (this.inputGasRatioChart) {
        this.inputGasRatioChart.dispose();
      }
    },
  },
};
</script>

<style lang='scss' scoped>
@media screen and (min-width: 1920px) {
  .tab-inside-content {
    height: 420px;
    .topleft-content {
      display: inline-flex;
      justify-content: flex-start;
      align-items: center;
      height: 60px;
    }
    #gas-chart,
    #contract-chart,
    #gas-ratio-chart,
    #inputgas-ratio-chart {
      width: 100%;
      position: absolute;
      height: 390px;
      top: 15px;
    }
  }
}
@media screen and (max-width: 1919px) {
  .tab-inside-content {
    height: 300px;
    .topleft-content {
      display: inline-flex;
      justify-content: flex-start;
      align-items: center;
      height: 55px;
    }
    #gas-chart,
    #contract-chart,
    #gas-ratio-chart,
    #inputgas-ratio-chart {
      width: 100%;
      position: absolute;
      height: 250px;
      top: 30px;
    }
  }
}
</style>