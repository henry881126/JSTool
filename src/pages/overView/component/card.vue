<template>
  <div class="card color-white">
    <el-row>
      <el-col :span="10">
        <h3 class="card-title">
          {{ data.title }}
          <i
            v-if="
              detailData.alarm === 1
            "
            class="iconfont iconyujing color-red"
            style="font-size: 18px"
          ></i>
        </h3>
        <h1 class="font-large">{{ detailData.salesVolume || placeholder }}</h1>
        <div class="numbers-data">
          <span class="contrast-history"
            >比去年：<b>{{ detailData.compare || placeholder }}%</b
            ><i
              v-if="detailData.compare < 0"
              class="iconfont iconxiajiangxiaobiao jiantou"
            ></i
            ><i v-else class="iconfont iconshangshengxiaobiao2 jiantou"></i
          ></span>
        </div>
        <div class="target-num">
          目标：{{ detailData.allTargets || placeholder }}
        </div>
      </el-col>
      <el-col :span="14">
        <el-button
          class="select"
          v-if="data.title === '年累计销售气量(万方）' && false"
          @click.native="viewPieChart"
          >气源类型查看 <i class="el-icon-arrow-down el-icon--down"></i
        ></el-button>
        <div class="chart" :id="data.chartName"></div>
        <div class="pie-chart-area"
          id="pieCharDialog"
          v-if="showPieChart"
          v-html="pieChartHtml"
        ></div>
      </el-col>
      <div style="position: absolute;bottom: 0;height: 30px;width: 95%;" v-if="isShow">
        <el-collapse v-model="collapse" @click.native="handleChangeData()">
          <div class="collapse-drop">
            <el-collapse-item :title="data.collapseName" name="1" ref="collapse">
              <div class="innerbox">
                <div
                    class="company-sort margin-lr-20"
                    v-for="item in data.collapseData"
                    :key="item.companyName"
                >
                  <el-row class="flex align-center">
                    <el-col :span="20" class="progress-list">
                      <div>{{ item.companyName }}</div>
                      <div>
                        <div :style="{ width: sizeFlag ? '80px' : '50px' }">
                          <div class="process" :style="{ width: item.percentComplete + '%' }">
                            <div class="display-inline">
                              {{ item.percentComplete }}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <i
                          v-if="item.alarm === 1"
                          class="iconfont iconyujing color-red"
                          style="font-size: 30px"
                      ></i>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </el-row>
  </div>
</template>

<script>
import echartMix from "../echartConfig/cardPie";
import pieChartConfig from "../echartConfig/pieChartConfig";
export default {
  name: "ScreenCard",
  props: {
    data: {
      type: Object
    },
    showCollapse: {
      type: Object
    },
    pieChartData: {
      type: Array
    },
    curCompany: {
      type: String
    }
  },
  mixins: [echartMix, pieChartConfig],
  data() {
    return {
      showPieChart: false,
      sizeFlag: window.screen.width >= 1900 ? true : false,
      chart: "",
      collapse: "",
      pieChartHtml: "",
      placeholder: "-- --"
    };
  },
  computed: {
    detailData: function() {
      return this.data.data || {};
    },
    isShow: function () {
      let level = this.$store.getters.curComInfo
      return level.orgLevel === 2 || level.orgLevel === 3
    }
  },
  watch: {
    "showCollapse.curShow": function() {
      if (this.showCollapse.curShow !== this.data.title) {
        this.collapse = "";
      }
    },
    data: {
      handler() {
        this.initCart();
      },
      deep: true
    },
    pieChartData: {
      handler() {
        // this.initPieChart()
      },
      deep: true
    },
    curCompany: {
      immediate: true,
      handler() {
        return this.curCompany;
      },
      deep: true
    }
  },
  methods: {
    initCart() {
      this.chart = this.$echarts.init(
        document.getElementById(this.data.chartName)
      );
      this.chart.resize({ width: "auto" });
      let params = {
        percent: this.detailData.percentComplete
          ? this.detailData.percentComplete + "%"
          : 0 + "%"
      };
      this.chart.setOption(this.echartConfig(params));
    },
    handleChangeData() {
      this.showCollapse.curShow = this.data.title;
    },
    initPieChart() {
      //查看气源类型饼图
      this.pieChartHtml = "";
      this.$nextTick(() => {
        if (this.showPieChart) {
          this.pieChartHtml =
            '<div style=" height: 100%;width: 100%;" id="pieChar"></div>';
          this.$nextTick(() => {
            this.chart = this.$echarts.init(document.getElementById("pieChar"));
            this.chart.resize({ width: "auto" });
            this.chart.setOption(this.pieChartConfig());
          });
        }
      });
    },
    viewPieChart() {
      //查看气源类型按钮
      this.showPieChart = !this.showPieChart;
      this.initPieChart();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./common";
.innerbox {
  overflow-x: auto;
  overflow-y: auto;
}
/*滚动条样式*/
/deep/.innerbox::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/deep/.innerbox::-webkit-scrollbar-thumb {
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.17);
}
/deep/.innerbox::-webkit-scrollbar-track {
  border-radius: 0;
  border: none;
  background: rgba(35, 72, 136, 1);
}

//下拉面板箭头朝向
/deep/ .el-collapse-item__arrow.is-active {
  // 点击后方向
  transform: rotate(-90deg);
}
/deep/ .el-collapse-item__arrow,
.el-tabs__nav {
  //  默认方向
  transform: rotate(90deg);
}


.collapse-drop {
  position: relative;
  z-index: 999;
  /deep/ .el-collapse-item__wrap {
    max-height: 400px;
    overflow: auto;
  }
}
.el-icon-top {
  margin: 0 5px;
}
.select {
  position: absolute;
  right: 0;
  z-index: 999;
  background: #0fb2ab;
  border-radius: 10px;
  height: 21px;
  color: #ffffff;
  font-size: 12px;
  padding: 0 5px;
  border: none;
}
.el-icon-warning {
  position: relative;
  top: 2px;
}
.jiantou {
  display: inline-block;
  margin-left: 13px;
  top: -1px;
  position: relative;
}

/*修改滚动条样式*/
/deep/ .el-collapse-item__wrap::-webkit-scrollbar {
  width: 6px;
  background: transparent;
  height: 64px;
}
/deep/ .el-collapse-item__wrap::-webkit-scrollbar-track {
  //轨道
  border-radius: 3px;
  margin-bottom: 12px;
}
/deep/ .el-collapse-item__wrap::-webkit-scrollbar-thumb {
  //滚动条块
  background: #6f88b4;
  border-radius: 3px;
  border-radius: 10px;
}

.card {
  border-right: 1px dashed rgba(255, 255, 255, 0.15);
  position: relative;
  .progress-list {
    margin-bottom: 10px;
    color: #49ceff;
  }
  .process {
    background: #49ceff;
    height: 10px;
    border-radius: 20px;
    position: relative;
    .display-inline {
      display: inline;
      position: absolute;
      top: -5px;
      right: -50px;
    }
  }
}

@media screen and (min-width: 1580px) {
  .card-title {
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    margin-top: 20px !important;
  }
  .select {
    width: 105px;
    height: 26px;
    line-height: 26px;
  }
  .pie-chart-area {
    width: 245px;
    height: 212px;
    top: 40px;
    right: 0;
    position: absolute;
    background: #ffffff;
    border-radius: 12px;
    z-index: 9999;
  }
  .font-large {
    font-size: 45px;
    margin: 0;
  }
  .target-num {
    margin-top: 19px;
    border-bottom: 0.75px #c1cde1 dashed;
    padding-bottom: 6px;
  }
  .chart {
    height: 250px;
  }
  .iconxiajiangxiaobiao {
    color: #e56157;
    font-size: 14px;
  }
  .iconshangshengxiaobiao2 {
    font-size: 14px;
  }
  .numbers-data {
    height: 32px;
    margin-top: 11.9px;
    background: rgba(24,206,0,0.25);
    border: 1px solid #18CE00;
    border-radius: 15.38px;
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    color: #28FFB6;
    white-space: nowrap;
  }
}
@media screen and (max-width: 1580px) {
  .card-title {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    margin: 0;
    margin-top: 13.4px !important;
  }
  .select {
    width: 95px;
    height: 21px;
    line-height: 21px;
  }
  .pie-chart-area {
    width: 219px;
    height: 190px;
    top: 30px;
    right: 0;
    position: absolute;
    background: #ffffff;
    border-radius: 12px;
    z-index: 9999;
  }
  .font-large {
    width: 161px;
    height: 45px;
    line-height: 45px;
    margin: 0;
    margin-top: 6px;
    font-size: 34px;
  }
  .target-num {
    margin-top: 19px;
    border-bottom: 0.75px #c1cde1 dashed;
    padding-bottom: 3px;
  }
  .chart {
    height: 220px;
  }
  .iconxiajiangxiaobiao {
    color: #e56157;
    font-size: 12px;
  }
  .iconshangshengxiaobiao2 {
    font-size: 12px;
  }
  .numbers-data {
    height: 24px;
    margin-top: 11.9px;
    background: rgba(24,206,0,0.25);
    border: 1px solid #18CE00;
    border-radius: 15.38px;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: #28FFB6;
    white-space: nowrap;
  }
}
</style>
