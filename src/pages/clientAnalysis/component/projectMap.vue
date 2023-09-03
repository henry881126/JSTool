<template>
  <div class="project-map">
    <time-component></time-component>
    <div id="echarts-line" class="echart-area"></div>
    <project-map-table :tableData="tableData"></project-map-table>
    <div class="project-result">
      <div class="project-word">计划准确率分析结论</div>
      <div class="result-content">
        <div class="result-value">
          {{this.conclusion}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import TimeComponent from "./timeComponent.vue";
import ProjectMapTable from "./projectMapTable";
import bus from "@/utils/bus";
export default {
  name: "projectMap",
  components: { TimeComponent, ProjectMapTable },
  props: {},
  data() {
    return {
      barWidth: "",
      screenWidth: "",
      fontSize: "",
      rectHeight: "",
      rectWidth: "",
      circleHeight: "",
      circleWidth:"",
      right: "",
      axisFontSize: "",
      borderRadius: "",
      timeData:{},
      conclusion:'',
      tableData:[],
      XTimeData:[],
      YgasCons:[],
      YdeviationValue:[],
      YdeviationValueDate:[],
      YreportGas:[],
      lineWidth:'',
      minData:-100,
      maxData:100,
      intervalData:20,
      devMin:-100,
      devMax:100,
      devInterval:20,
      gridLeft:'0%',
      gridRight:'0%',
    };
  },
  watch: {
    timeData(val){
      this.timeData = val;
    }
  },
  computed: {},
  created() {
    bus.$on('timeObject',(val) => {
      this.timeData = val;
      this.loadData();
    })
  },
  mounted() {
    this.screenWidth = window.screen.width;
    if (this.screenWidth < 1900) {
      this.barWidth = 12;
      this.fontSize = "12px";
      this.rectHeight = 5;
      this.rectWidth = 14;
      this.circleHeight = 6;
      this.circleWidth = 16;
      this.right = 73;
      this.axisFontSize = "11px";
      this.borderRadius = 6;
      this.lineWidth = 3;
    } else {
      this.barWidth = 16;
      this.fontSize = "16px";
      this.rectHeight = 6;
      this.rectWidth = 19;
      this.circleHeight = 8;
      this.circleWidth = 22;
      this.right =93;
      this.axisFontSize = "14px";
      this.borderRadius = 8;
      this.lineWidth = 4;
    }
  },
  destroyed(){
    bus.$off('timeObject');
  },
  methods: {
    async loadData(){
      let param = {
        "compCode": this.$route.query.compCode,
        "endDate": this.timeData.endTime,
        "partner": this.$route.query.partner,
        "startDate": this.timeData.startTime,
        "type": this.timeData.type
      }
      let res = await this.$api.accuracyAnalysis(param);
        this.XTimeData = [];
        this.YgasCons = [];
        this.YdeviationValue = [];
        this.YdeviationValueDate = [];
        this.YreportGas = [];
        if (res.resultCode == 0) {
            this.conclusion = res.data.conclusion;
            this.tableData = res.data.list;
              res.data.list.forEach(e => {
              this.XTimeData.push(e.time);
              this.YgasCons.push(e.gasCons);
              this.YdeviationValue.push(e.deviationValue);
              this.YdeviationValueDate.push(e.deviationValueDate || 0);
              this.YreportGas.push(e.reportGas);
            });
            if( res.data.list.length == 0){
              this.gridLeft = '3.5%';
              this.gridRight = '2.5%';
            }else{
              this.gridLeft = '0%';
              this.gridRight = '0%'
            }
        } else {
            this.$message.error(res.resultMessage);
        }
        // let num1 = Math.max(this.YreportGas);
        // let num2 = Math.max(this.YgasCons);
        // this.maxData = Math.ceil(Math.max(num1, num2));
        // this.minData = 0 - this.maxData;
        // this.intervalData = this.maxData/5;
        // this.devMin = 0 - Math.ceil(Math.max(this.YdeviationValueDate));
        // this.devMax = Math.ceil(Math.max(this.YdeviationValueDate));
        // this.devInterval = this.devMax/5;
        this.init();
    },
    init() {
      let lineChart = echarts.init(document.getElementById("echarts-line"));
      lineChart.setOption({
        color: ["#18CE00", "#3F82E1", "#A0B8DD", "#FFAE75"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
          formatter:function(params){
            let res = params[0].axisValueLabel;
            for (let i = 0; i < params.length; i++) {
              if(i<3){
                res += '<br/>' + params[i].marker + '</span><span style="color:#666;">' + params[i].seriesName+ ':' + '<span style="color:black;font-weight:600">' + params[i].value + '</span>' + '</span>';
              }else{
                res += '<br/>'+ params[i].marker +'<span style="color:666;">' + params[i].seriesName+ ':' + '<span style="color:black;font-weight:600">' + params[i].value + '%' +  '</span>'   + '</span>';
              }
              
            }
            return res
          }
        },
        grid: {
          left: this.gridLeft,
          right: this.gridRight,
          bottom: "2%",
          containLabel: true,
        },
        legend: [
          {
            data: [
              {
                name: "实际日气量",
                icon: "rect",
                textStyle: {
                  fontSize: this.fontSize,
                  fontFamily: "PingFangSC-Regular, PingFang SC",
                  fontWeight: 400,
                  color: "#000000",
                },
              },
              {
                name: "慧用能计划上报量",
                icon: "rect",
                textStyle: {
                  fontSize: this.fontSize,
                  fontFamily: "PingFangSC-Regular, PingFang SC",
                  fontWeight: 400,
                  color: "#000000",
                },
              },
              {
                name: "偏差量",
                icon: "rect",
                textStyle: {
                  fontSize: this.fontSize,
                  fontFamily: "PingFangSC-Regular, PingFang SC",
                  fontWeight: 400,
                  color: "#000000",
                },
              },
            ],
            right: this.right,
            itemWidth: this.rectWidth, //矩形宽度
            itemHeight: this.rectHeight, //矩形高度
          },
          {
            data: [
              {
                name: "偏差率",
                // icon: "circle",
                textStyle: {
                  fontSize: this.fontSize,
                  fontFamily: "PingFangSC-Regular, PingFang SC",
                  fontWeight: 400,
                  color: "#000000",
                },
              },
            ],
            right: 10,
            itemHeight: this.circleHeight,
            itemWidth: this.circleWidth
          },
        ],
        xAxis: [
          {
            type: "category",
            data: this.XTimeData,
            axisPointer: {
              type: "shadow",
            },
            axisLabel: {
              textStyle: {
                fontSize: this.axisFontSize,
                fontFamily: "PingFangSC-Regular, PingFang SC",
                fontWeight: 400,
                color: "#000000",
              },
            },
            axisLine: {
              lineStyle: {
                color: "#C8C8C8",
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "单位: 万方",
            nameTextStyle: {
              fontSize: this.fontSize,
              fontFamily: "PingFangSC-Regular, PingFang SC",
              fontWeight: 400,
              color: "#8A8A8A",
            },
            // min: this.minData,
            // max: this.maxData,
            // interval: this.intervalData,
            axisLabel: {
              formatter: "{value}",
              textStyle: {
                fontSize: this.axisFontSize,
                fontFamily: "PingFangSC-Regular, PingFang SC",
                fontWeight: 400,
                color: "rgba(0, 0, 0, 0.59)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#C8C8C8",
              },
            },
          },
          {
            type: "value",
            name: "单位: %",
            nameTextStyle: {
              color: "rgba(0, 0, 0, 0.56)",
              fontSize: this.fontSize,
              fontFamily: "PingFangSC-Regular, PingFang SC",
              fontWeight: 400,
            },
            // min: this.devMin,
            // max: this.devMax,
            // interval: this.devInterval,
            axisLabel: {
              formatter: "{value}",
              textStyle: {
                fontSize: this.axisFontSize,
                fontFamily: "PingFangSC-Regular, PingFang SC",
                fontWeight: 400,
                color: "rgba(0, 0, 0, 0.59)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#C8C8C8",
              },
            },
          },
        ],
        series: [
          {
            name: "实际日气量",
            type: "bar",
            data: this.YgasCons,
            barWidth: this.barWidth,
            itemStyle: {
              borderRadius: this.borderRadius,
            },
          },
          {
            name: "慧用能计划上报量",
            type: "bar",
            data: this.YreportGas,
            barWidth: this.barWidth,
            itemStyle: {
              borderRadius: this.borderRadius,
            },
          },
          {
            name: "偏差量",
            type: "bar",
            data: this.YdeviationValue,
            barWidth: this.barWidth,
            itemStyle: {
              borderRadius: this.borderRadius,
            },
          },
          {
            name: "偏差率",
            type: "line",
            yAxisIndex: 1,
            data: this.YdeviationValueDate,
            itemStyle: {
                normal: {
                    color: '#FFAE75',
                    lineStyle: {
                        width: this.lineWidth
                    },
                    label: {
                        show: false,
                        rotate: 30,
                        position: 'top',
                        color: "#ffffff", //  颜色 
                        formatter: '{c}%'
                    }
                }
            },
          },
        ],
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@media screen and (min-width: 1900px) and (max-width: 1940px) {
  .project-map {
    .project-result {
      margin: 0 0 0 18px;
      .project-word {
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #3f5896;
        padding: 33px 0 16px 0;
      }
      .result-content {
        background: #f0f3f9;
        border-radius: 3px;
        border: 1px solid #ebedf6;
        .result-value {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #505356;
          padding: 22px 0 26px 36px;
        }
      }
    }
    .echart-area {
      height: 230px;
      z-index: 999;
    }
  }
}
@media screen and (min-width: 1420px) and (max-width: 1460px) {
  .project-map {
    .project-word {
      // margin: 24px 0 12px 11px;
      font-size: 15px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #3f5896;
      padding: 25px 0 12px 11px;
    }
    .result-content {
      background: #f0f3f9;
      border-radius: 2px;
      border: 1px solid #ebedf6;
      margin: 0 0 0 11px;
      .result-value {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #505356;
        padding: 13px 12px 11px 15px;
      }
    }
    .echart-area {
      height: 230px;
    }
  }
}
</style>