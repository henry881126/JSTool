<template>
  <div class="potential-analyse">
    <div class="potential-top">
      <div class="potential-left">
        <div class="title">用气价值与潜力分析</div>
        <ul>
          <li v-for="item in tableData" :key="item.label">
            <el-row style="overflow:hidden">
              <el-col :span="6"><span class="col-span">{{ item.label}}</span></el-col>
              <el-col :span="6"><span class="col-span">{{ item.pre1 }}</span></el-col>
              <el-col :span="6"><span class="col-span">{{ item.pre2 }}</span></el-col>
              <el-col :span="6"><span class="col-span color-blue">{{ item.now }}</span></el-col>
            </el-row>
          </li>
        </ul>
      </div>
      <div class="potential-right">
        <div id="potential-chart"></div>
      </div>
    </div>
    <div class="potential-bottom">
      <div class="title">分析结论</div>
      <div class="bottom-content">
        {{ resData.analysisConclusion ? resData.analysisConclusion : "" }}
      </div>
    </div>
  </div>
</template>

<script>
//潜力分析
import comonTable from "@/components/comonTable";
import { chartOption } from "./potentialChartOption";
export default {
  name: "",
  components: { comonTable },
  props: {
    propData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      lastColoumBlue: true,
      resData: {},
      tableData: [
        { label: "", pre1: "2018", pre2: "2019", now: "2020" },
        { label: "年收入", pre1: "", pre2: "", now: "" },
        { label: "年利润", pre1: "", pre2: "", now: "" },
        { label: "现金流", pre1: "", pre2: "", now: "" },
        { label: "用气稳定性", pre1: "", pre2: "", now: "" },
        { label: "可持续性", pre1: "", pre2: "", now: "" },
      ],
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {
    this.getPotentialAnalysis();
  },
  methods: {
    async getPotentialAnalysis() {
      const params = {
        compCode: this.propData.compCode,
        distinct: Number(this.propData.distinct),
        partner: this.propData.partner,
      };
      const res = await this.$api.getPotentialAnalysis(params);
      if (res.resultCode === 0) {
        this.resData = res.data;
        if (
          res.data.potentialAnalysisForm &&
          res.data.potentialAnalysisForm.length > 0
        ) {
          res.data.potentialAnalysisForm.map((one) => {
            if (one.year === "2018") {
              this.tableData[1]["pre1"] = one.amountYear? one.amountYear+'万元': '-'; //年收入
              this.tableData[2]["pre1"] = one.profitYear? one.profitYear+'万元': '-'; //年利润
              this.tableData[3]["pre1"] = one.payment? one.payment: '-'; //现金流
              this.tableData[4]["pre1"] = one.gasScore? one.gasScore: '-'; //用气稳定性
              this.tableData[5]["pre1"] = one.continuedScore? one.continuedScore: '-'; //可持续性
            }
            if (one.year === "2019") {
              this.tableData[1]["pre2"] = one.amountYear? one.amountYear+'万元': '-'; //年收入
              this.tableData[2]["pre2"] = one.profitYear? one.profitYear+'万元': '-'; //年利润
              this.tableData[3]["pre2"] = one.payment? one.payment: '-'; //现金流
              this.tableData[4]["pre2"] = one.gasScore? one.gasScore: '-'; //用气稳定性
              this.tableData[5]["pre2"] = one.continuedScore? one.continuedScore: '-'; //可持续性
            }
            if (one.year === "2020") {
              this.tableData[1]["now"] = one.amountYear? one.amountYear+'万元': '-'; //年收入
              this.tableData[2]["now"] = one.profitYear? one.profitYear+'万元': '-'; //年利润
              this.tableData[3]["now"] = one.payment? one.payment: '-'; //现金流
              this.tableData[4]["now"] = one.gasScore? one.gasScore: '-'; //用气稳定性
              this.tableData[5]["now"] = one.continuedScore? one.continuedScore: '-'; //可持续性
            }
            return one;
          });
        }
        if (
          this.resData.potentialAnalysisPentagon &&
          Object.keys(this.resData.potentialAnalysisPentagon).length > 0
        ) {
          this.initChart();
        }
      } else {
        this.$message.error(res.resultMessage);
      }
    },
    initChart() {
      const potentialChart = this.$echarts.init(
        document.getElementById("potential-chart")
      );
      const data1 = this.resData.potentialAnalysisPentagon.Potential;
      const data2 = this.resData.potentialAnalysisPentagon.top5;
      const dataArea1 = [
        data1.radarScore,
        data1.continuedScore,
        data1.gasScore,
        data1.cashScore,
        data1.profitScore,
      ];
      const dataArea2 = [
        data2.radarScore,
        data2.continuedScore,
        data2.gasScore,
        data2.cashScore,
        data2.profitScore,
      ];
      const baseSize =window.screen.width >= 1920? 16: 14;
      potentialChart.setOption(chartOption(dataArea1, dataArea2,baseSize));
    },
  },
};
</script>

<style lang='scss' scoped>
@import "./../style/potentialAnalyse1440.scss";
@import "./../style/potentialAnalyse1920.scss";
</style>