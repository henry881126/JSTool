<template>
  <div class="stations-distribution-box">
    <div class="left-box">
      <ul class="stations-list">
        <li v-for="(item, index) in dataList" :key="index">
          <div class="stations-list-radio-box">
            <el-radio
              v-model="stationRadio"
              :label="item.stationId"
              @change="changeStation(stationRadio)"
              >{{ item.name }}</el-radio
            >
          </div>
          <div class="stations-list-progress-box">
            <el-progress
              :text-inside="true"
              :stroke-width="32"
              :percentage="item.proportion"
              :format="format(item.capacity)"
              :color="item.proportion >= 100 ? '#F5222D' : '#47A87D'"
            ></el-progress>
            <p style="font-size: 14px">
              瞬流：{{ item.currentFlow }}万Nm³/h，当日累流：{{
                item.totalFlow
              }}万Nm³
            </p>
          </div>
          <div class="data-wrap">
            <div class="data-box">
              <span style="font-size: 14px">{{ item.transportUp }}</span>
              <span style="font-size: 14px">万m³</span>
            </div>
            <p style="font-size: 14px">最大输配能力</p>
          </div>
          <div class="icon-box" @click="showDialog(item)">
            <img src="../../../../images/chartsImage.png" alt="" />
          </div>
        </li>
      </ul>
    </div>

    <div class="right-box">
      <div class="echart-wrap">
        <div class="etitle">
          <div class="point"></div>
          <span class="etitle-content">压力MPa</span>
          <!-- 出口 -->
          <el-select
            class="screen-select-list"
            v-model="exitVal"
            collapse-tags
            @change="exitEvent(exitVal)"
          >
            <el-option
              v-for="item in exitList"
              :key="item.deviceId"
              :label="item.deviceName"
              :value="item.deviceId"
            >
            </el-option>
          </el-select>
          <!-- 进口 -->
          <el-select
            class="screen-select-list"
            v-model="entranceVal"
            collapse-tags
            @change="entranceEvent(entranceVal)"
          >
            <el-option
              v-for="item in entranceList"
              :key="item.deviceId"
              :label="item.deviceName"
              :value="item.deviceId"
            >
            </el-option>
          </el-select>
        </div>

        <pressureChart
          v-if="pressureChartNoData == false"
          :pressureChartData="pressureChartData"
        ></pressureChart>
        <div class="noData" v-if="pressureChartNoData == true">
          <img src="../../../../images/none.png" alt="" />
          <p>暂无数据</p>
        </div>
      </div>
      <div class="echart-wrap">
        <div class="etitle">
          <div class="point"></div>
          <span class="etitle-content">瞬流Nm³/h</span>
        </div>
        <transientFlowChart
          v-if="transientFlowChartNoData == false"
          :instantFlowChartData="instantFlowChartData"
        ></transientFlowChart>
        <div class="noData" v-if="transientFlowChartNoData == true">
          <img src="../../../../images/none.png" alt="" />
          <p>暂无数据</p>
        </div>
      </div>
    </div>
    <el-dialog
      class="custom-dialog-n"
      v-if="showEchartDialog"
      :title="title"
      :visible.sync="showEchartDialog"
      :before-close="closeDialog"
    >
      <div class="line-wrap">
        <dialogEcharts :dialogData="dialogData"></dialogEcharts>
      </div>
      <div style="font-size: 14px; margin-top: 23px">
        最大输配能力为{{ this.dialogData.transportUp }}万m³/h
      </div>
      <div style="font-size: 14px; margin-top: 5px">
        其中，满负荷运行小时数为{{ this.dialogData.fullLoad }}h，占比{{
          this.dialogData.proportion
        }}%
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dialogEcharts from "@/idsPages/views/operationAndDispatching/monitorAndControl/components/dialogCharts";
import pressureChart from "@/idsPages/views/operationAndDispatching/monitorAndControl/components/pressureChart";
import transientFlowChart from "@/idsPages/views/operationAndDispatching/monitorAndControl/components/transientFlowChart";
import {
  getStationChart,
  getStationDevice, //压力折线图设备查询接口
  getStationPressureChart,
  getStationInstantFlowChart,
} from "@/idsPages/api/monitorAndControl.js";
export default {
  name: "stations-distribution",
  props: {
    stationData: {
      type: Array,
      default: [],
    },
  },
  components: {
    dialogEcharts,
    pressureChart,
    transientFlowChart,
  },
  data() {
    return {
      stationRadio: "",

      dataList: [],
      showEchartDialog: false,
      //出口
      exitVal: "",
      exitList: [],
      //进口
      entranceVal: "",
      entranceList: [],
      pressureChartData: {},
      instantFlowChartData: {},
      //弹框数据
      dialogData: {},
      title: "", //标题
      pressureChartNoData: false,
      transientFlowChartNoData: false,
      //三分钟刷新
      timer: null,
    };
  },
  computed: {},
  watch: {
    stationData: {
      handler(newval) {
        // console.log(newval, "从父组件传来的选择的场站");
        if (newval.length > 0) {
          // console.log(newval);
          this.dataList = newval;
          var getIndexNum = sessionStorage.getItem("statNum");
          // console.log(getIndexNum,'//')
          for (var i = 0; i < this.dataList.length; i++) {
            if (this.dataList[i].proportion > 100) {
              return (this.dataList[i].proportion = 100);
            }
            if (this.dataList[i].proportion < 0) {
              return (this.dataList[i].proportion = 0);
            }
          }
          if (getIndexNum) {
            this.stationRadio = getIndexNum;
          } else {
            this.stationRadio = this.dataList[0].stationId;
          }
          this.pressureChartNoData = false;
          this.transientFlowChartNoData = false;
          this.getPressureSelect();
          this.getStationInstantFlowChart();
        } else {
          this.dataList = [];
          this.entranceList = [];
          this.entranceVal = "";
          this.exitList = [];
          this.exitVal = "";
          this.pressureChartNoData = true;
          this.transientFlowChartNoData = true;
          // this.getStationInstantFlowChart();
        }
      },
      deep: true,
      // immediate:true
    },
  },
  methods: {
    // 获取列表数据
    //   进度条展示
    format(n) {
      //   console.log(n, "每条数据");
      return () => {
        return `${n}万m³`;
      };
    },

    // 获取压力折线图下拉选择数据
    getPressureSelect() {
      // console.log('获取出口设备')
      let params = {
        // stationId: this.stationRadio,
        stationId: this.stationRadio,
      };
      getStationDevice(params).then((res) => {
        // console.log(res, "获取到的数据");

        if (res.resultCode == 0) {
          // this.exitVal = '53808';
          // this.entranceVal = '48784';
          if (JSON.stringify(res.data.exportDevice) != "[]") {
            this.exitList = res.data.exportDevice; //  console.log('获取出口设备')
            this.exitVal = this.exitList[0].deviceId;
            this.entranceList = [];
            this.entranceVal = "";
            this.pressureChartNoData = false;
            if (JSON.stringify(res.data.importDevice) != "[]") {
              this.entranceList = res.data.importDevice; //  console.log('获取进口设备')
              this.entranceVal = this.entranceList[0].deviceId;
            }
          } else {
            this.entranceList = [];
            this.entranceVal = "";
            this.exitList = [];
            this.exitVal = "";
            if (JSON.stringify(res.data.importDevice) != "[]") {
              this.entranceList = res.data.importDevice; //  console.log('获取进口设备')
              this.entranceVal = this.entranceList[0].deviceId;
              this.pressureChartNoData = false;
            } else {
              this.entranceList = [];
              this.entranceVal = "";
              this.exitList = [];
              this.exitVal = "";
              this.pressureChartNoData = true;
            }
          }

          this.getStationPressureChart();
        }
      });
    },

    showDialog(f) {
      // console.log(f, "展示弹窗");
      let params = {
        name: f.stationId,
      };
      getStationChart(params).then((res) => {
        this.dialogData = res.data;
      });
      this.title = f.name;
      this.showEchartDialog = true;
    },
    closeDialog() {
      this.showEchartDialog = false;
    },

    //点击单选框
    changeStation(val) {
      // console.log(val, "选择的门站");
      // this.stationRadio = '48784';
      this.stationRadio = val;
      sessionStorage.setItem("statNum", val);
      this.getPressureSelect();
      this.getStationInstantFlowChart();
    },

    //获取压力折线图数据
    getStationPressureChart() {
      let params = {
        exportDeviceId: this.exitVal,
        importDeviceId: this.entranceVal,
      };
      getStationPressureChart(params).then((res) => {
        // console.log(res, "压力折线图数据");
        this.pressureChartData = res.data;
      });
    },
    exitEvent(exitVal) {
      // console.log(exitVal, "选择出口压变");
      this.exitVal = exitVal;
      this.getStationPressureChart();
    },
    entranceEvent(entranceVal) {
      // console.log(entranceVal, "选择进口压变");
      this.entranceVal = entranceVal;
      this.getStationPressureChart();
    },

    //获取场站瞬流折线图数据
    getStationInstantFlowChart() {
      let params = {
        stationId: this.stationRadio,
        // stationId: "0571_000085",
      };
      getStationInstantFlowChart(params).then((res) => {
        // console.log(res, "场站瞬流数据");
        if (res.data) {
          if (
            !(
              res.data.seriesData[0].length ||
              res.data.seriesData[1].length ||
              res.data.seriesData[2].length
            )
          ) {
            this.transientFlowChartNoData = true;
          } else {
            this.transientFlowChartNoData = false;
            this.$nextTick(() => {
              this.instantFlowChartData = res.data;
            });
          }
        } else {
          this.transientFlowChartNoData = true;
        }
      });
    },
  },
  created() {},
  mounted() {
    sessionStorage.removeItem("statNum");
  },
  destroyed() {
    sessionStorage.removeItem("statNum");
  },
};
</script>
<style lang="scss">
.etitle .el-select .el-input__inner {
  // background: none;
  width: 140px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
}
.etitle .el-input__icon {
  line-height: 32px;
}
.etitle .el-select .el-input__inner {
  padding-left: 10px;
  background: #fff;
  color: #606266;
}
.etitle .el-select .el-input__suffix {
  text-align: right;
  // width: 140px;
  border: none;
  color: #fff;
}
.etitle .el-select .el-input__suffix {
  text-align: right;
  // width: 140px;
  border: none;
  color: #fff;
}
.etitle  .el-select .el-input.is-focus .el-input__inner {
  border: 1px solid #dcdfe6;
}
.stations-list-progress-box .el-progress-bar__outer {
  border-radius: 0;
  background: none;
  border: 1px solid #47a87d;
}
.stations-list-progress-box .el-progress-bar__innerText {
  color: #333333;
}
.stations-list-progress-box .el-progress-bar__inner {
  border-radius: 0;
  text-align: center;
}
.stations-list-radio-box .el-radio__input.is-checked + .el-radio__label {
  color: #303133;
}
.stations-list-radio-box .el-radio__input.is-checked .el-radio__inner {
  background: #fff;
  border-color: #47a87d;
}
.stations-list-radio-box .el-radio__inner::after {
  width: 8px;
  height: 8px;
  background: #47a87d;
}
.stations-list-radio-box .el-radio__inner:hover {
  border-color: #47a87d;
}
.screen-select-list .el-select .el-input__inner {
  // background: none;
  padding-left: 10px;
  width: 140px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
}
.screen-select-list .el-select .el-input__suffix {
  text-align: right;
  // width: 140px;
  border: none;
  color: #fff;
}
.screen-select-list .el-input__icon {
  line-height: 32px;
}
</style>
<style lang="scss" scoped>
.stations-distribution-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .left-box {
    width: 50%;
    height: 100%;
    // background: khaki;
    padding-right: 20px;
    overflow-y: auto;
    ul {
      min-height: 100%;
      li {
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        margin-bottom: 10px;
        .stations-list-radio-box {
          width: 22%;
          height: 32px;
          line-height: 32px;
          margin-right: 10px;
        }
        .stations-list-progress-box {
          width: 60%;
          p {
            margin-top: 5px;
            margin-bottom: 0;
          }
        }
        .data-wrap {
          width: 18%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          margin-left: 10px;
          .data-box {
            width: 120px;
            height: 32px;
            display: flex;
            justify-content: space-around;
            align-items: center;
          }
          p {
            margin-top: 5px;
            margin-bottom: 0;
          }
        }
        .icon-box {
          height: 32px;
          line-height: 32px;
          margin-left: 10px;
        }
      }
    }
  }
  .right-box {
    width: 50%;
    height: 100%;
    // background: lightcyan;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    border-left: 1px solid #e4e7ed;
    .echart-wrap {
      width: 100%;
      height: 50%;
      .etitle {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .point {
          width: 12px;
          height: 12px;
          background: #47a87d;
          margin: 0 5px 0 20px;
        }
        .etitle-content {
          font-size: 18px;
          margin-right: 10px;
        }
        .screen-select-list {
          // min-width: 182px;
          height: 32px;
          margin-right: 10px;
        }
      }
      // .chartBox{
      //   width: 100%;
      //   height: 100%;
      // }
    }
  }
}
.line-wrap {
  width: 100%;
  height: 400px;
  // background: chocolate;
}
.noData {
  width: 100%;
  // height: 100%;
  height: calc(100% - 30px);
  // background: #ababcc;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 74px;
    height: 83px;
  }
  p {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #c0c4cc;
  }
}
</style>