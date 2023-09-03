<template>
  <div class="gus-trace-buy">
    <div class="gas-title">
      日气量跟踪(万方)
      <span class="symbolStyle" @click="jumpRoute" v-trace="{title:'总览-日气量跟踪-箭头'}">></span>
    </div>
    <div class="first-floor">
      <el-row>
        <el-col :span="3">
          <div class="picture"><img src="@/assets/img/air-trail.png" class="iconwenjian"/></div>
        </el-col>
        <el-col :span="7"
          ><div class="lineStyle newLineStyle">
            <p class="baseStyle numberShow">
              {{ typeof(this.tableData.todayDemandAmount) == 'number' ?  this.tableData.todayDemandAmount :  "-/-" }}
            </p>
            <p class="wordShow">今日需求量</p>
          </div></el-col
        >
        <el-col :span="8" v-if="this.screenWidth == 1440"
          ><p class="baseStyle numberShow">
            {{ typeof(this.tableData.todayReplyAmount) == 'number' ?  this.tableData.todayReplyAmount : "-/-" }}
          </p>
          <p class="wordShow">今日批复量</p></el-col
        >
        <el-col :span="9" v-else
          ><p class="baseStyle numberShow">
            {{ typeof(this.tableData.todayReplyAmount) == 'number' ? this.tableData.todayReplyAmount : "-/-" }}
          </p>
          <p class="wordShow">今日批复量</p></el-col
        >
        <el-col :span="6" v-if="this.screenWidth == 1440"
          ><p
            class="baseStyle secNumberShow"
            style="float: right; margin-right: 4px"
          >
            {{ typeof(this.tableData.expectedDeviationAmount) == 'number' ? this.tableData.expectedDeviationAmount : "-/-" }}
          </p>
          <p class="wordShow" style="float: right; margin-right: 4px">
            预计偏差量
          </p></el-col
        >
        <el-col :span="5" v-else
          ><p
            class="baseStyle secNumberShow"
            style="float: right; margin-right: 4px"
          >
            {{ typeof(this.tableData.expectedDeviationAmount) == 'number' ?  this.tableData.expectedDeviationAmount : "-/-" }}
          </p>
          <p class="wordShow" style="float: right; margin-right: 4px">
            预计偏差量
          </p></el-col
        >
      </el-row>
    </div>
    <div class="second-part">
      <el-row>
        <el-col :span="6"
          ><div class="lineStyle">
            <p class="word-one">
              {{ typeof(this.tableData.yesterdayDemandAmount) == 'number' ? this.tableData.yesterdayDemandAmount : "-/-" }}
            </p>
            <p class="wordShow smallScreen">昨日需求量</p>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="lineStyle">
            <p class="word-one">
              {{ typeof(this.tableData.yesterdayReplyAmount) == 'number' ? this.tableData.yesterdayReplyAmount : "-/-" }}
            </p>
            <p class="wordShow smallScreen">昨日批复量</p>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="lineStyle">
            <p class="word-one">
              {{ typeof(this.tableData.yesterdayActualLiftGas) == 'number' ? this.tableData.yesterdayActualLiftGas : "-/-" }}
            </p>
            <p class="wordShow smallScreen">昨日提气量</p>
          </div></el-col
        >
        <el-col :span="6"
          ><div>
            <p class="baseStyle numberPercent">
              {{ typeof(this.tableData.yesterdayDeviationAssessment) == 'number' ? this.tableData.yesterdayDeviationAssessment+'%' : "-/-" }}
            </p>
            <p class="wordShow word-two smallScreen">昨日偏差考核</p>
          </div></el-col
        >
      </el-row>
    </div>
    <!-- 8.7加32 -->
    <!-- <div class="third-part" v-if="this.datas != 50311934 && this.datas != 50311932" key="2"> -->
    <div class="third-part" v-if="isFarengongsi" key="2">
      <el-row>
        <el-col :span="24">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="过去7天实际提气量" name="first"> </el-tab-pane>
            <el-tab-pane label="过去七天偏差考核" name="second"> </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <div class="barChart" id="echartArea"></div>
    </div>
    <!-- <div class="third-part" v-if="this.datas == '50311934' || this.datas == '50311932'" key="1"> -->
    <div class="third-part" v-else key="1">
      <el-row>
        <el-col :span="16" v-if="this.screenWidth == 1440">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane name="first" v-trace="{title:'总览-日气量跟踪-城燃企业实际提气量排名'}">
              <el-tooltip
                class="item-tabs"
                effect="dark"
                placement="top"
                slot="label"
                content="城燃企业实际提气量排名"
              >
                <span>城燃企业实际提气...</span>
              </el-tooltip>
            </el-tab-pane>
            <el-tab-pane label="城燃企业日偏差考核排名" name="second" v-trace="{title:'总览-日气量跟踪-城燃企业日偏差考核排名'}">
              <el-tooltip
                class="item-tabs"
                effect="dark"
                placement="top"
                slot="label"
                content="城燃企业日偏差考核排名"
              >
                <span>城燃企业日偏差考...</span>
              </el-tooltip>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="20" v-else>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="城燃企业实际提气量排名" name="first" v-trace="{title:'总览-日气量跟踪-城燃企业实际提气量排名'}">
            </el-tab-pane>
            <el-tab-pane label="城燃企业日偏差考核排名" name="second" v-trace="{title:'总览-日气量跟踪-城燃企业日偏差考核排名'}">
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="2" v-if="this.screenWidth == 1440"></el-col>
        <el-col :span="8" v-if="this.screenWidth == 1440">
          <el-button class="gas-btn" @click="openDialog()">
            <span class="btn-word"
              >查看全部排名<span class="smallPicture">→</span></span
            ></el-button
          ></el-col
        >
        <el-col :span="4" v-else>
          <el-button class="gas-btn" @click="openDialog()"
            ><span class="btn-word"
              >查看全部排名<span class="smallPicture">→</span></span
            ></el-button
          >
        </el-col>
        <el-dialog
          :visible.sync="this.dialogVisible"
          :before-close="handleClose"
        >
          <rank-dialog
            :dialogTabData="dialogTabData"
            :dialogTableData="dialogTableData"
            :datas="datas"
            :selectName="selectName"
          ></rank-dialog>
        </el-dialog>
      </el-row>
      <div class="barChart" id="echartArea"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import rankDialog from "./rankDialog.vue";
import { getNowTime, getYesterdayTime } from "@/utils/dateTime";

export default {
  components: { rankDialog },
  name: "GasTrailCard",
  // mixins:[companyMixin],
  data() {
    return {
      datas: this.curCompany,
      activeName: "first",
      dialogVisible: false,
      screenWidth: "",
      tableData: {},
      tabName: [],
      tabList: [],
      dialogTabData: {},
      dialogTableData: {},
      barWidth: "",
      barBorderRadius: "",
      color: "",
      flag:'',
      selectName:''
    };
  },
  props: {
    curCompany: String,
  },
  computed: {
    isFarengongsi: function () {
      let level = this.$store.getters.curComInfo
      return level.orgLevel === 4
    }
  },
  mounted() {
    this.getData();
    // if (this.datas == "50311934") {
    if(this.isProvinceCompany(this.datas)) {
      this.loadData();
      this.loadActData();
    } else {
      this.loadSevenDayActData();
      this.loadSevenDevData();
    }
  },
  created() {
    this.screenWidth = window.screen.width;
  },
  methods: {
    jumpRoute() {
      // if (this.datas == "50311934") {
      if(this.isProvinceCompany(this.datas)) {
        this.flag = 'true'
      }else{
        this.flag = false
      }
      window.open(`/gasMeasureTrail?compCode=${this.curCompany}&flag=${this.flag}`, "_self");
    },
    async loadSevenDevData() {
      let param = this.datas;
      let result = await this.$api.getPast7DaysDeviationAssessment(param);
      if (result.resultCode === 0) {
        this.tabList = [];
        this.tabName = [];
        let tabData = result.data;
        tabData.forEach((element) => {
          this.tabList.push(element.data);
          this.tabName.push(element.time);
        });

        this.dialogTableData.dialogTabListData = this.tabList;
        this.dialogTableData.dialogTabNameData = this.tabName;
      } else {
        this.$messge.error("请求失败");
      }
    },
    async loadSevenDayActData() {
      let param = this.datas;
      if (this.activeName == "first") {
        let res = await this.$api.getPast7DaysActualLiftGas(param);
        if (res.resultCode === 0) {
          this.tabList = [];
          this.tabName = [];
          let tabData = res.data;
          tabData.forEach((element) => {
            this.tabList.push(element.data);
            this.tabName.push(element.time);
          });
          this.dialogTabData.dialogTabListData = this.tabList;
          this.dialogTabData.dialogTabNameData = this.tabName;
        } else {
          this.$messge.error("请求失败");
        }
      } else {
        let result = await this.$api.getPast7DaysDeviationAssessment(param);
        if (result.resultCode === 0) {
          this.tabList = [];
          this.tabName = [];
          let tabData = result.data;
          tabData.forEach((element) => {
            this.tabList.push(element.data);
            this.tabName.push(element.time);
          });

          this.dialogTableData.dialogTabListData = this.tabList;
          this.dialogTableData.dialogTabNameData = this.tabName;
        } else {
          this.$messge.error("请求失败");
        }
      }
      this.init();
    },
    async loadData() {
      let param = getYesterdayTime();
      let result = await this.$api.getDeviationAssessmentRank(param);
      if (result.resultCode === 0) {
        this.tabList = [];
        this.tabName = [];
        let tabData = result.data;
        tabData.forEach((element) => {
          this.tabList.push(element.deviation_assessment);
          this.tabName.push(element.company_txt);
        });

        this.dialogTableData.dialogTabListData = this.tabList;
        this.dialogTableData.dialogTabNameData = this.tabName;
      } else {
        this.$messge.error("请求失败");
      }
    },
    async loadActData() {
      // let param = getYesterdayTime();
      //  8.7请求参数增加省公司
      let param = {
        data : getYesterdayTime(),
        companyCode : this.datas
      }
      if (this.activeName == "first") {
        let res = await this.$api.getActualLiftGasRank(param);
        if (res.resultCode === 0) {
          this.tabList = [];
          this.tabName = [];
          let tabData = res.data;
          tabData.forEach((element) => {
            this.tabList.push(element.actual_lift_gas);
            this.tabName.push(element.company_txt);
          });
          this.dialogTabData.dialogTabListData = this.tabList;
          this.dialogTabData.dialogTabNameData = this.tabName;
        } else {
          this.$messge.error("请求失败");
        }
      } else {
        let result = await this.$api.getDeviationAssessmentRank(param);
        if (result.resultCode === 0) {
          this.tabList = [];
          this.tabName = [];
          let tabData = result.data;
          tabData.forEach((element) => {
            this.tabList.push(element.deviation_assessment);
            this.tabName.push(element.company_txt);
          });

          this.dialogTableData.dialogTabListData = this.tabList;
          this.dialogTableData.dialogTabNameData = this.tabName;
        } else {
          this.$messge.error("请求失败");
        }
      }
      this.init();
    },

    async getData() {
      let params = {
        "companyCode": this.datas,
        "today": getNowTime(),
        "yesterday": getYesterdayTime(),
      };
      let res = await this.$api.getDayGasTrack(params);
      if (res.resultCode == 0) {
        this.tableData = res.data;
      } else {
        this.$messge.error("请求失败");
      }
    },
    handleClick() {
      if(this.activeName === 'first') {
         window.zhuge.track('总览-日气量跟踪-过去7天实际提气量')
      } else if (this.activeName === 'second') {
        window.zhuge.track('总览-日气量跟踪-过去7天偏差考核')
      }
      // if (this.datas == "50311934" || this.datas == "50311932") {
      if(this.isProvinceCompany(this.datas)) {        
        this.loadActData();
      } else {
        this.loadSevenDayActData();
      }
    },
    init() {
      if (this.tabName.length > 10) {
        this.tabList = this.tabList.slice(0, 10);
        this.tabName = this.tabName.slice(0, 10);
      }
      if (this.screenWidth == 1920) {
        if (this.activeName == "first") {
          this.barWidth = "8px";
          this.barBorderRadius = [4, 4, 4, 4];
          this.color = "#008AFF";
        } else {
          this.barWidth = "8px";
          this.barBorderRadius = [4, 4, 4, 4];
          this.color = "#18CE00";
        }
      } else {
        if (this.activeName == "first") {
          this.barWidth = "6px";
          this.barBorderRadius = [4, 4, 4, 4];
          this.color = "#008AFF";
        } else {
          this.barWidth = "6px";
          this.barBorderRadius = [4, 4, 4, 4];
          this.color = "#18CE00";
        }
      }
      let barChart = echarts.init(document.getElementById("echartArea"));
      let option = {
        color: this.color,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "0%",
          right: "4%",
          bottom: "3%",
          top: "12%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.tabName,
            axisTick: {
              alignWithLabel: true,
              show: false,
            },
            axisLabel: {
              textStyle: {
                show: true,
                fontFamily: "PingFangSC-Regular, PingFang SC",
                fontWeight: "400",
                color: "#999",
                fontSize: "12",
              },
            },
            axisLine: {
              lineStyle: {
                color: "#e5e5e5",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              textStyle: {
                show: true,
                fontFamily: "PingFangSC-Regular, PingFang SC",
                fontWeight: "400",
                color: "#999",
              },
            },
          },
        ],
        series: [
          {
            type: "bar",
            barWidth: this.barWidth,
            data: this.tabList,
            itemStyle: {
              barBorderRadius: this.barBorderRadius,
            },
            label: {
              show: true, // 开启显示
              rotate: 0, // 旋转70度
              position: "top", // 在上方显示
              distance: 10, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。
              verticalAlign: "middle",
              textStyle: {
                // 数值样式
                color: "#505356",
                fontSize: 12,
                fontFamily: "DINAlternate-Bold, DINAlternate",
              },
            },
          },
        ],
      };
      barChart.setOption(option);
    },
    openDialog() {
      this.selectName = this.activeName;
      this.dialogVisible = true;
      
    },
    handleClose() {
      this.dialogVisible = false;
      this.selectName = ''
    },
    isProvinceCompany: function () {
      return this.$store.getters.curComInfo.orgLevel === 2
    }
  },
  watch: {
    curCompany(val) {
      if(val) {
        this.datas = val;
        this.getData();
        // if (this.datas == "50311934" || this.datas == 50311932) {
        if(this.isProvinceCompany(this.datas)) {
          this.loadData();
          this.loadActData();
        } else {
          this.loadSevenDayActData();
          this.loadSevenDevData();
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./common";
@media screen and (min-width: 1580px) {
  .gus-trace-buy {
    height: 450px;
    border-radius: 12px;
    .gus-title {
      padding: 0 !important;
    }
    .barChart {
      height: 176px;
    }
    .baseStyle {
      font-size: 28px;
      font-family: DI;
      font-weight: bold;
      color: #122544;
    }
    .numberShow {
      margin: 19px 0 0 0;
    }
    .word-one {
      font-size: 24px;
      font-family: DI;
      font-weight: bold;
      color: #122544;
      margin: 0;
    }
    .secNumberShow {
      color: #35b27e;
      margin: 19px 0 0 0;
    }
    .numberPercent {
      font-size: 24px;
      color: #ff5f67;
      margin: 0;
      text-align: center;
    }
    .wordShow {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5d7096;
      margin: 2px 0 0 0;
    }
    .smallScreen {
      margin: 8px 0 0 0;
    }
    .word-two {
      margin: 8px 0 0 0;
    }
    .second-part {
      background: #f0f3f9;
      padding: 23px 12px 23px 20px;
      border-radius: 4px;
    }
    .third-part {
      margin-top: 5px;
      .el-row {
        height: 28px;
      }
    }
    .el-button {
      padding: 6px 9px;
      margin-top: 6px;
    }
    .gas-btn {
      float: right;
      background: #0fb2ab;
      border-radius: 23px;
      cursor: pointer;
      line-height: 12px;
    }
    .btn-word {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
    .smallPicture {
      display: inline-block;
      background: #ffffff;
      color: #0fb2ab;
      border-radius: 100%;
    }
    .lineStyle {
      border-right: 1px solid #dee2eb;
      margin-right: 15px;
    }
    .newLineStyle {
      border-right: 1px dotted #dee2eb;
      margin-right: 25px;
    }
    .picture {
      margin-top: 23px;
      /deep/ .iconwenjian {
        width:42px;
        height: 52px;
      }
    }
    /deep/ .el-tabs__item {
      height: 30px;
      padding: 0 6px;
    }
    /deep/ .el-dialog {
      border-radius: 12px;
    }
    /deep/ .el-dialog__header {
      padding: 0;
    }
    /deep/.el-dialog__headerbtn {
      // position: absolute;
      top: 18px;
      right: 18px;
      width: 18px;
      height: 18px;
      border-radius: 100%;
      z-index: 99;
    }
  }
}
@media screen and (max-width: 1580px) {
  .gus-trace-buy {
    height: 337px;
    .gas-title {
      font-size: 16px;
      font-weight: 500;
      color: #3f5896;
      line-height: 22px;
    }
    .first-floor {
      line-height: 22px;
      margin-top: -5px;
    }
    .barChart {
      height: 129px;
      margin-top: 5px;
    }
    .baseStyle {
      font-size: 22px;
      font-family: DI;
      font-weight: bold;
      color: #122544;
    }
    .numberShow {
      margin: 13px 0 0 0;
    }
    .word-one {
      font-size: 20px;
      font-family: DI;
      font-weight: bold;
      color: #122544;
      margin: 0;
      line-height: 24px;
    }
    .secNumberShow {
      color: #35b27e;
      margin: 7px 0 0 0;
    }
    .numberPercent {
      font-size: 20px;
      color: #ff5f67;
      margin: 0;
      text-align: center;
    }
    .wordShow {
      font-size: 14px;
      font-weight: 400;
      color: #5d7096;
      margin: 1px 0;
      line-height: 20px;
    }
    .word-two {
      margin: 2px 0 0 0;
    }
    .smallScreen {
      font-size: 12px;
      margin: 6px 0 0 0;
    }
    .second-part {
      background: #f0f3f9;
      padding: 15px 11px 13px 11px;
      border-radius: 3px;
    }
    .third-part {
      margin-top: 0;
      .el-row {
        height: 32px;
      }
    }
    .el-button {
      padding: 12px 11px;
      margin-top: 7px !important;
    }
    .gas-btn {
      float: right;
      background: #0fb2ab;
      border-radius: 13px;
      cursor: pointer;
      padding: 5px 3px;
      margin-top: 8px;
    }
    .btn-word {
      font-size: 12px;
      font-weight: 500;
      color: #ffffff;
    }
    .smallPicture {
      display: inline-block;
      background: #ffffff;
      color: #0fb2ab;
      border-radius: 100%;
    }
    .lineStyle {
      border-right: 1px solid #dee2eb;
      margin-right: 7px;
    }
    .newLineStyle {
      border-right: 1px dotted #dee2eb;
      margin-right: 12px;
    }
    .picture {
      margin-top: 13px;
      /deep/ .iconwenjian {
        width:32px;
        height: 39px;
      }
    }
    /deep/ .el-tabs__item {
      height: 30px;
      padding: 0 6px;
      font-size: 12px;
    }
    /deep/ .el-dialog {
      border-radius: 12px;
    }
    /deep/ .el-dialog__header {
      padding: 0;
    }
    /deep/.el-dialog__headerbtn {
      // position: absolute;
      top: 18px;
      right: 18px;
      width: 18px;
      height: 18px;
      // background: #35355c;
      border-radius: 100%;
      z-index: 99;
    }
  }
}
</style>
