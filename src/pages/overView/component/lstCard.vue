<template>
  <div class="list-card color-white">
    <div class="head-title flex align-center">
      <h3 class="card-title">年累计发展/安装</h3>
      <div class="btn-group">
        <span
          class="choice-btn cursor"
          :class="curActive === 1 ? 'green-btn' : 'white-btn color-pool-blue'"
          @click="changeTab(1, curCompany)"
          v-trace="{title:'总览-年累计发展安装-民用户'}"
          >民用户(户）</span
        >
        <span
          class="choice-btn cursor"
          :class="curActive === 2 ? 'green-btn' : 'white-btn color-pool-blue'"
          @click="changeTab(2, curCompany)"
          v-trace="{title:'总览-年累计发展安装-工商户'}"
          >工商户(方/日）</span
        >
      </div>
    </div>
    <div>
      <el-row class="flex align-center">
        <el-col :span="7">
          <span class="block-title"
            >发展 :
            <span>{{
              (installAndDevData.development || {}).accomplishment
            }}</span></span
          >
        </el-col>
        <el-col :span="17">
          <div class="flex justify-space-between div-bar">
            <span class="color-green"
              >比去年: {{ (installAndDevData.development || {}).compare }}%
              <i
                v-if="
                  installAndDevData.development &&
                    installAndDevData.development.compare >= 0
                "
                class="el-icon-top color-green"
              ></i
              ><i v-else class="el-icon-bottom color-green"></i
            ></span>
            <span
              >{{ (installAndDevData.development || {}).allTarget }}/{{
                (installAndDevData.development || {}).percentComplete
              }}%</span
            >
          </div>
          <el-progress
            color="#45E3FF"
            :stroke-width="10"
            :percentage="
              ((installAndDevData.development || {}).percentComplete > 100 ? 100 : (installAndDevData.development || {}).percentComplete) || 0
            "
            status="success"
            :show-text="false"
          ></el-progress>
        </el-col>
      </el-row>
      <el-row class="flex align-center margin-top-20">
        <el-col :span="7">
          <div class="block-title">
            安装 :
            <span>{{ (installAndDevData.install || {}).accomplishment }}</span>
          </div>
        </el-col>
        <el-col :span="17">
          <div class="flex justify-space-between div-bar">
            <div class="color-green">
              比去年: {{ (installAndDevData.install || {}).compare }}%
              <i
                v-if="
                  installAndDevData.install &&
                    installAndDevData.install.compare >= 0
                "
                class="el-icon-top color-green"
              ></i
              ><i v-else class="el-icon-bottom color-green"></i>
            </div>
            <span
              >{{ (installAndDevData.install || {}).allTarget }}/{{
                (installAndDevData.install || {}).percentComplete
              }}%</span
            >
          </div>
          <el-progress
            color="#28FFB6"
            :stroke-width="10"
            :percentage="((installAndDevData.install || {}).percentComplete > 100 ? 100 : (installAndDevData.install || {}).percentComplete) || 0"
            status="success"
            :show-text="false"
          ></el-progress>
        </el-col>
      </el-row>
      <el-row class="flex align-center margin-top-20">
        <el-col :span="24">
          <div style="display: inline-block" class="block-title title-third">
            已发展未安装 :
            {{ (installAndDevData.developmentNotInstall || {}).accomplishment }}
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-if="isShow" style="height: 30px;margin-top: 11px;">
      <el-collapse v-model="collapse" @click.native="handleChangeData()">
        <div class="collapse-drop">
          <el-collapse-item title="城燃企业年累民用户发展/安装完成比" name="1">
            <div class="chart">
              <div
                class="color-white"
                id="myBarChart"
                :style="barChartStyle"
              ></div>
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import lstCardBar from "../echartConfig/lstCardBar";
import { formatCurrentTime } from "@/utils/dateTime";
export default {
  name: "LstCard",
  props: {
    showCollapse: {
      type: Object
    },
    data: Object,
    curCompany: String,
  },
  mixins: [lstCardBar],
  data() {
    return {
      barChartStyle: "height: 400px",
      installDatas: [],
      devDatas: [],
      companyName: [],
      // installAndDevPersents: [],
      chart: "",
      collapse: "",
      curChartName: "chart-" + Math.random(),
      installAndDevData: {},
      curActive: 1
    };
  },
  computed: {
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
    curCompany: {
      immediate: true,
      handler(val) {
        if(val) {
          this.changeTab(1, val);
        }
      },
      deep: true
    }
  },
  methods: {
    formatCurrentTime,
    changeTab(type, companyCode) {
      this.curActive = type;
      this.initInstallAndDev(type, companyCode); //安装发展数据
      if (this.isShow) {
        this.installAndDevPercent(type, companyCode); //安装发展完成比
      }
    },
    initInstallAndDev(type, companyCode) {
      this.$api
        .getInstallAndDevelopmentList({
          //年累计民用户发展/安装||年累计工商户发展/安装
          companyCode: companyCode,
          distinction: type,
          time: this.formatCurrentTime()
        })
        .then(res => {
          if (res.resultCode === 0) {
            this.installAndDevData = res.data;
          }
        });
    },

    installAndDevPercent(type, companyCode) {
      //城燃企业年累(民用户安装/发展完成比)/城燃企业年累(工商户安装/发展完成比)
      // this.installAndDevPersents = [];
      this.devDatas = [];
      this.installDatas = [];
      this.companyName = [];
      this.$api
        .getInstallAndDevelopmentRank({
          companyCode: companyCode,
          distinction: type,
          time: this.formatCurrentTime()
        })
        .then(res => {
          if (res.resultCode === 0) {
            res.data.forEach(element => {
              // this.installAndDevPersents.push(element.percentInstallAndDevelop);
              this.devDatas.push(element.percentInstall);
              this.installDatas.push(element.percentDevelopment);
              this.companyName.push(element.companyName);
            });
            let heightStr =
              this.companyName.length >= 11
                ? this.companyName.length * 40
                : 400;
            this.barChartStyle = "height: " + heightStr + "px";
            this.handleChangeData();
          }
        });
    },
    handleChangeData() {
      this.$nextTick(() => {
        this.chart = this.$echarts.init(document.getElementById("myBarChart"));
        this.chart.resize({ width: "auto" });
        this.chart.setOption(this.echartConfig());
      });
      this.showCollapse.curShow = this.data.title;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./common";
.el-icon-bottom {
  color: #ff545d !important;
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
.list-card {
  .choice-btn {
    padding: 2px 10px;
    border-radius: 50px;
    margin-right: 10px;
    font-size: 14px;
  }
  .btn-group {
    margin-left: 20px;
  }
  .grey-btn {
    background: #ffffff;
    border-radius: 3px;
  }

  .chart {
    max-height: 400px;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    // padding: 0 5px;
  }
  .collapse-drop {
    position: relative;
  }
  /deep/ .el-collapse .el-collapse-item .el-collapse-item__content {
    padding: 0 0 0 5px !important;
  }

  /*修改滚动条样式*/
  .chart::-webkit-scrollbar {
    width: 6px;
    background: transparent;
    height: 64px;
  }
  .chart::-webkit-scrollbar-track {
    //轨道
    border-radius: 3px;
    margin-bottom: 12px;
  }
  .chart::-webkit-scrollbar-thumb {
    //滚动条块
    background: #6f88b4;
    border-radius: 3px;
    border-radius: 10px;
  }

  /deep/ .el-progress-bar__outer {
    background-color: rgba(0, 0, 0, 0.11);
  }
}

@media screen and (min-width: 1580px) {
  .list-card {
    .choice-btn {
      padding: 2px 4px 2px 14px;
      border-radius: 10px;
      margin-right: 10px;
      font-size: 14px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
      margin-top: 20px !important;
    }
    .div-bar {
      width: 100%;
    }
    .block-title {
      width: 151px;
      padding: 0px 13px;
      background: rgba(255, 255, 255, 0.15);
      display: inline-block;
      line-height: 38px;
      font-size: 16px;
      border-radius: 3px;
      box-sizing: border-box;
    }
    .title-third {
      width: 100%;
      text-align: center;
      height: 46px;
      line-height: 44px;
      box-sizing: border-box;
    }
    .margin-top-20 {
      margin-top: 16px;
    }
    .color-green {
      color: #28ffb6;
      margin-bottom: 5px;
    }
  }
  /deep/ .el-progress-bar__outer {
    background-color: #183579;
    opacity: 0.49;
    height: 10px !important;
  }
}
@media screen and (max-width: 1580px) {
  .list-card {
    .choice-btn {
      padding: 1px 4px 1px 14px;
      border-radius: 10px;
      margin-right: 10px;
      font-size: 12px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      margin-top: 18px !important;
    }
    .div-bar {
      width: 100%;
    }
    .block-title {
      width: 124px;
      height: 26px;
      font-size: 14px;
      padding: 0 8px;
      background: rgba(255, 255, 255, 0.15);
      display: inline-block;
      line-height: 26px;
      border-radius: 3px;
      box-sizing: border-box;
    }
    .title-third {
      width: 100%;
      text-align: center;
      height: 29px;
      line-height: 29px;
      box-sizing: border-box;
    }
    .margin-top-20 {
      margin-top: 15px;
    }
    .color-green {
      color: #28ffb6;
      margin-bottom: 3px;
    }
  }
  /deep/ .el-progress-bar__outer {
    background-color: #183579;
    opacity: 0.49;
    height: 8px;
  }
}
</style>
