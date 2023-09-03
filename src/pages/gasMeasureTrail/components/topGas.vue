<template>
  <div class="tab-inside-content">
    <div class="topleft-content">
      <timeAreaforTop effect="dark" @timeValueChange="timeValueChangeforGas" />
      <el-radio-group v-model="gasLabelCheck">
        <el-radio @click.native.prevent="clickitem('1')" label="1">
          实际提气量同比</el-radio
        >
      </el-radio-group>
    </div>
    <div class="chart-content" id="gas-chart" v-if="gasLabelCheck === ''"></div>
    <div class="chart-content" id="gas-ratio-chart" v-else></div>
  </div>
</template>

<script>
import timeAreaforTop from "./../common/components/timeAreaforTop";
import {
  gasChartOption,
  gasRatioChartOption,
} from "./../common/chartOptions/fritabchartOption";
export default {
  name: "",
  components: { timeAreaforTop },
  props: {
    selectArea: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      gasChart: null,
      gasRatioChart: null,
      gasLabelCheck: "",
      timeType: "",
      resGasChartRatio: [], //同比
      resGasChartandTable: [],
      activeDayRangeValue: [],
      activeWeekRangeValue: [],
      barWidth: "",
    };
  },
  computed: {},
  watch: {
    selectArea: {
      handler(val) {
        if (val.code) {
          this.refreshChart();
        }
      },
    },
    gasLabelCheck: {
      handler() {
        this.refreshChart();
      },
    },
  },
  mounted() {},
  created() {
    this.barWidth = window.screen.width >= 1920 ? 16 : 12;
  },
  methods: {
    clickitem(e) {
      e === this.gasLabelCheck
        ? (this.gasLabelCheck = "")
        : (this.gasLabelCheck = e);
    },
    timeValueChangeforGas(val) {
      this.timeType = val.type;
      if (this.timeType === "day-range") {
        this.activeDayRangeValue = val.data;
      }
      if (this.timeType === "week-range") {
        this.activeWeekRangeValue = val.data;
      }
      this.$emit("timeValueChangeforGas", val);
      this.refreshChart();
    },
    refreshChart() {
      if (this.timeType === "day-range" || this.timeType === "week-range") {
        if(!this.selectArea.code) {
          return

        }
        this.getYearonyearData();
        this.getGasDeviationTableData();
      }
    },
    initFristTabChart() {
      if (this.gasLabelCheck !== "") {
        this.disposeChart();
        this.$nextTick(() => {
          this.initGasRatioChart();
        });
      } else {
        this.disposeChart();
        this.$nextTick(() => {
          this.initGasChart();
        });
      }
    },
    async getGasDeviationTableData() {
      // 获取实时 用气偏差 图表数据1
      if (
        this.activeDayRangeValue.length === 0 &&
        this.activeWeekRangeValue.length === 0
      ) {
        return;
      }
      const params = this.getGasApiParams();
      const res = await this.$api.getGasDeviationTableData(params);
      if (res.resultCode === 0) {
        if (res.data && res.data.length > 0) {
          this.resGasChartandTable = res.data;
          this.initFristTabChart();
          this.$emit("gasChartTable", {
            tableData: this.resGasChartandTable,
            params: params,
          });
        } else {
          this.resGasChartandTable = [];
          this.$emit("gasChartTable", {
            tableData: [],
            params: {},
          });
        }
      } else {
        this.$message.error(res.resultMessage);
      }
    },
    async getYearonyearData() {
      if (
        this.activeDayRangeValue.length === 0 &&
        this.activeWeekRangeValue.length === 0
      ) {
        return;
      }
      // 获取实时 用气偏差 图表数据2
      const res = await this.$api.getYearonyearData(this.getGasApiParams());
      if (res.resultCode === 0) {
        if (res.data && res.data.length > 0) {
          this.resGasChartRatio = res.data;
          this.initFristTabChart();
        } else {
          this.resGasChartRatio = [];
        }
        // this.$emit("gasChartTable", this.resGasChartandTable);
      } else {
        this.$message.error(res.resultMessage);
      }
    },
    getGasApiParams() {
      // const companyCode = this.selectArea === "50311934" ? "50311934" : "0232"; //暂时测试用
      const params =
        this.timeType === "day-range"
          ? {
              compCode: this.selectArea.code,
              startTime:
                this.activeDayRangeValue.length > 0
                  ? this.activeDayRangeValue[0]
                  : "",
              endTime:
                this.activeDayRangeValue.length > 0
                  ? this.activeDayRangeValue[1]
                  : "",
              timeUnit: "1",
            }
          : {
              compCode: this.selectArea.code,
              startTime:
                this.activeWeekRangeValue.length > 0
                  ? this.activeWeekRangeValue[0]
                  : "",
              endTime:
                this.activeWeekRangeValue.length > 0
                  ? this.activeWeekRangeValue[1]
                  : "",
              timeUnit: "2",
            };
      return params;
    },
    initGasChart() {
      this.gasChart = this.$echarts.init(document.getElementById("gas-chart"));
      const dataX = this.resGasChartandTable.map((one) => one.time);
      const dataY1 = this.resGasChartandTable.map((one) => one.replyAmount); //批复量
      const dataY2 = this.resGasChartandTable.map((one) => one.actualLiftGas); //实际提气量
      const dataY3 = this.resGasChartandTable.map((one) => one.deviationAmount); //偏差量
      const dataY4 = this.resGasChartandTable.map(
        (one) => one.deviationAssessment.split('%')[0]
      ); //偏差考核
      this.gasChart.setOption(
        gasChartOption(dataX, dataY1, dataY2, dataY3, dataY4, this.barWidth)
      );
    },
    initGasRatioChart() {
      this.gasRatioChart = this.$echarts.init(
        document.getElementById("gas-ratio-chart")
      );
      const dataX = this.resGasChartRatio.map((one) => one.time);
      const dataY1 = this.resGasChartRatio.map((one) => one.actualLiftGasPre); //上期提气量
      const dataY2 = this.resGasChartRatio.map((one) => one.actualLiftGasCur); //（本期）提气量
      const dataY3 = this.resGasChartRatio.map((one) => one.yearonyearRatio); //同比增长率
      this.gasRatioChart.setOption(
        gasRatioChartOption(dataX, dataY1, dataY2, dataY3, this.barWidth)
      );
    },
    disposeChart() {
      if (this.gasChart) {
        this.gasChart.dispose();
      }
      if (this.gasRatioChart) {
        this.gasRatioChart.dispose();
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