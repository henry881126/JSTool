<template>
  <div class="main-gas">
    <div :class="{
        'frist-part': true,
        'is-province': selectArea && selectArea.cpmo_cop && selectArea.cpmo_cop.toString() === 'true',
        'is-city':selectArea && selectArea.cpmo_cop && selectArea.cpmo_cop.toString() === 'false',
      }">
      <div class="head-row">
        <span style="font-weight: 550">单位：万方</span>
        <el-button
          class="export-button"
          round
          @click="exportGas"
          style="z-index: 2999"
          >导出</el-button
        >
      </div>
      <custTable
        :tableData="chartTable"
        :conf="chartTableConf"
        :defaultProp="defaultPropforCommon"
        :class="{
        'frist-table': true,
      }"
      >
      </custTable>
    </div>
    <div class="second-part" v-if="selectArea.cpmo_cop.toString() === 'true'">
      <div class="head-part">
        <span class="chart-title">用气量偏差排名</span>
        <timeAreaforBottom effect="light" @timeValueChange="timeValueChange" />
      </div>
      <div class="content-part">
        <div class="left-part" id="shift-list-chart"></div>
        <div class="right-part">
          <custTable
            :tableData="resBankData"
            :conf="bankConf"
            class="second-table"
          >
          </custTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import custTable from "./../common/components/custTable";
import timeAreaforBottom from "./../common/components/timeAreaforBottom";
import { shfitListOption } from "./../common/chartOptions/shfitListChartOption";
export default {
  name: "",
  components: { custTable, timeAreaforBottom },
  props: {
    selectArea: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      chartTable: [],
      defaultPropforCommon:{prop: 'time', order: 'descending'},
      defaultPropforRank:{prop: 'deviationAssessment', order: 'descending'},
      params: null,
      chartTableConf: [
        { prop: "time", label: "日期", isSort: true },
        { prop: "demandForecast", label: "需求预测量", isSort: true },
        { prop: "replyAmount", label: "批复量", isSort: true },
        { prop: "actualLiftGas", label: "实际提气量", isSort: true },
        {
          prop: "forecastDeviationRatio",
          label: "预测偏差率",
          isSort: true,
          showWarn: true,
        },
        { prop: "deviationAmount", label: "偏差量", isSort: true },
        {
          prop: "deviationAssessment",
          label: "偏差考核",
          isSort: true,
          showWarn: true,
        },
      ],
      timeValue: "",
      timeType: "",
      resBankData: [],
      bankConf: [
        { prop: "serialNumber", label: "排名", width: 80 },
        { prop: "companyName", label: "名称", },
        { prop: "replyAmount", label: "批复量", isSort: true , width: 110},
        { prop: "actualLiftGas", label: "实际提气量", isSort: true },
        { prop: "deviationAmount", label: "偏差量", isSort: true, width: 100 },
        {
          prop: "deviationAssessment",
          label: "偏差考核",
          errorFlag: true,
          isSort: true,
          width: 110,
        },
      ],
    };
  },
  computed: {},
  watch: {
    selectArea: {
      handler(val) {
        if (val.code) {
          this.$nextTick(() => {
            this.getRankWithGasDeviation();
          });
        }
      },
    },
  },
  methods: {
    async exportGas() {
      if (!this.params || this.params.toString() === "{}") {
        return;
      }
      const res = await this.$api.exportGas(this.params);
      if (res.resultCode === 0) {
        let objectUrl = res.data;
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", "测试");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
      } else {
        this.$message.error(res.resultMessage);
      }
    },
    timeValueChange(val) {
      this.timeType = val.type;
      this.timeValue = val.data;
      this.getRankWithGasDeviation();
    },
    async getRankWithGasDeviation() {
      // const companyCode = this.selectArea === "50311934" ? "50311934" : "0232"; //暂时测试用
      if (!this.selectArea.code) {
        return;
      }
      const params = {
        compCode: this.selectArea.code,
        time: this.timeValue,
        timeUnit: this.timeType === "day" ? "1" : "2",
      };
      const res = await this.$api.getRankWithGasDeviation(params);
      if (res.resultCode === 0) {
        if (res.data && res.data.length > 0) {
          this.resBankData = res.data.map((one) => {
            one.deviationAssessment = one.deviationAssessment.toString() + "%";
            return one;
          });
          this.initShiftListChart();
        } else {
          this.resBankData = [];
        }
      } else {
        this.$message.error(res.resultMessage);
      }
    },
    initShiftListChart() {
      const dataNum = this.resBankData.map((one) => one.deviationRatioAbs); //用气偏差量
      // const dataX = [1919, 2020, 2020, "淡定", 3333, 444, 333];
      const dataX = this.resBankData.map((one) => one.companyName);
      const shiftListChart = this.$echarts.init(
        document.getElementById("shift-list-chart")
      );
      const barWidth=window.screen.width >= 1920? 16: 12;
      shiftListChart.setOption(shfitListOption(dataNum, dataX,barWidth));
    },
  },
  mounted() {
    this.resizeFunc = () => {
      //   this.rem = document.documentElement.clientWidth / window.conf.desginWidth
    };
    window.addEventListener("resize", this.resizeFunc);
  },
};
</script>

<style lang='scss' scoped>
@import "./../scss/main-gas.scss";
</style>