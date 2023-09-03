<template>
  <div class="rank-dialog" v-if="this.datas == '50311934'">
    <el-tabs v-model="activeName" @tab-click="handleClick" >
      <el-tab-pane label="城燃企业实际提气量排名" name="first" > </el-tab-pane>
      <el-tab-pane label="城燃企业日偏差考核排名" name="second"> </el-tab-pane>
    </el-tabs>
    <div class="barChart" id="rankDialog"></div>
  </div>
  <div class="rank-dialog" v-else>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="过去7天实际提气量" name="first"> </el-tab-pane>
      <el-tab-pane label="过去七天偏差考核" name="second"> </el-tab-pane>
    </el-tabs>
    <div class="barChart" id="rankDialog"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "rankDialog",
  data() {
    return {
      activeName: this.selectName,
      color: "",
      screenWidth: "",
      barWidth: "",
      barBorderRadius: [5, 5, 5, 5],
      dataName: [],
      dataList: [],
    };
  },
  props: {
    dialogTabData: Object,
    dialogTableData: Object,
    datas: String,
    selectName: String
  },
  mounted() {
    this.init();
    this.screenWidth = window.screen.width;
  },
  watch:{
    selectName(val){
      if(val){
        this.activeName = val;
        this.init();
      }
    }
  },
  methods: {
    handleClick() {
      this.init();
    },
    init() {
      let barChartDialog = echarts.init(document.getElementById("rankDialog"));
      if (this.activeName == "first") {
        this.dataName = this.dialogTabData.dialogTabNameData;
        this.dataList = this.dialogTabData.dialogTabListData;
      } else {
        this.dataName = this.dialogTableData.dialogTabNameData;
        this.dataList = this.dialogTableData.dialogTabListData;
      }
      if (this.screenWidth == 1920) {
        if (this.activeName == "first") {
          this.color = "#008AFF";
          this.barWidth = "11px";
        } else {
          this.color = "#18CE00";
          this.barWidth = "11px";
        }
        this.barBorderRadius = [5, 5, 5, 5];
      } else {
        if (this.activeName == "first") {
          this.color = "#008AFF";
          this.barWidth = "8px";
        } else {
          this.color = "#18CE00";
          this.barWidth = "8px";
        }
        this.barBorderRadius = [4, 4, 4, 4];
      }
      let options = {
        color: this.color,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "2%",
        //   right: "4%",
          bottom: "3%",
          top: "5%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.dataName,
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
            data: this.dataList,
            itemStyle: {
              barBorderRadius: [5, 5, 5, 5],
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
      barChartDialog.setOption(options);
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen and (max-width: 1930px) and (min-width:1910px) {
  .rank-dialog {
    padding: 46px 30px;
    width: 100%;
    .barChart {
      height: 430px;
    }
    /deep/.el-tabs__item {
      padding: 0 11px !important;
    }
  }
}

@media screen and (max-width: 1440px) {
  .rank-dialog {
    padding: 20px 30px;
    width: 100%;
    .barChart {
      height: 323px;
    }
    /deep/.el-tabs__item {
      padding: 0 11px !important;
    }
  
  }
}
</style>
