<!-- 输配测算门站下气进度-曲线图弹窗-->
<template>
  <div class="line-box">
    <el-dialog
      class="custom-dialog-n"
      :title="chartData.title"
      :visible.sync="showStationDialog"
      :before-close="close"
    >
      <div style="height: 400px">
        <!-- <echartPart :chartData="chartData"></echartPart>-->
        <div class="echart-box" v-resize="resize">
          <div class="box" ref="echartBox"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { generateStationCurve } from "@/idsPages/api/calculate.js";
export default {
  name: "stationGasDialog",
  props: {
    showStationDialog: {
      type: Boolean,
      default: false,
    },
    typeId: {
      type: String,
      default: "",
    },
  },
  directives: {
    // 使用局部注册指令的方式
    resize: {
      // 指令的名称
      bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        let width = "",
          height = "";
        function isReize() {
          const style = document.defaultView.getComputedStyle(el);
          if (width !== style.width || height !== style.height) {
            binding.value(); // 关键
          }
          width = style.width;
          height = style.height;
        }
        el.__vueSetInterval__ = setInterval(isReize, 300);
      },
      unbind(el) {
        clearInterval(el.__vueSetInterval__);
      },
    },
  },
  components: {},
  data() {
    return {
      chartData: {},
      chart: null,
    };
  },
  watch: {
    chartData: {
      handler(newval) {
        console.log(newval)
        this.$nextTick(() => {
          this.setOptions(newval);
        });
      },
      deep: true,
    },
  },
  computed: {
    ...mapState({
      planId: (state) => state.calculation.planId,
      version: (state) => state.calculation.version,
    }),
  },
  created() {},
  mounted() {
    this.getData();
    this.$nextTick(() => {
      this.initChart();
    })
  },
  methods: {
    close() {
      this.$emit("update:showStationDialog", false);
    },
    resize() {
      // 当宽高变化时就会执行
      //执行某些操作
      this.chart.resize();
    },
    getData() {
      let params = {
        planId: this.planId,
        version: this.version,
        typeId: this.typeId,
        // planId: "1466195414620471296",
        // version: 2,
        // typeId: "0611_000004",
      };
      generateStationCurve(params).then((res) => {
        // console.log(res, "下进气数据");
        let dataList = {};
        let actualData = [],
          dataX = [];
        res.data.curvePointList.map((item, index) => {
          actualData.push(item.value);
          let str = item.time;
          dataX.push(str.substring(11, 13));
        });
        dataList.title = res.data.name;
        dataList.actualData = actualData;
        dataList.xdata = dataX;
        dataList.dailyValue = res.data.dailyValue;
        dataList.base = res.data.base;
        this.chartData = dataList;
      });
      
    },
    initChart() {
      this.chart = this.$echarts.init(this.$refs.echartBox);
      // console.log(this.chartData, "折线图数据");
      // this.setOptions(this.chartData);
    },
    setOptions({ xdata, actualData, dailyValue, base }) {
      var maxArr = [];
      if (actualData.length > 0) {
        for (var i = 0; i < actualData.length; i++) {
          maxArr.push(actualData[i]);
        }
        maxArr.push(dailyValue, base);
      }
      let Max = Math.ceil(Math.max(...maxArr)) + 2;
      this.chart.setOption({
        title: {
          text: "万m³",
          textStyle: {
            fontSize: 14,
            fontStyle: "normal",
            fontWeight: "normal",
          },
          padding: [5, 0, 10, 0],
        },
        color: ["#47A87D", "#F27F05", "#0074FF"],
        legend: {
          icon: "rect",
          y: "bottom",
          itemHeight: 12,
          itemWidth: 12,
        },
         tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                precision: 2,
              },
            },
            padding: [5, 10],
            formatter: function (datas) {
              let res = datas[0].name + "<br/>";
              let val;
              for (let i = 0; i < datas.length; i++) {
                if (datas[i].value) {
                  val = datas[i].value;
                  res +=
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' +
                    datas[i].color +
                    ';"></span>' +
                    datas[i].seriesName +
                    "：" +
                    val +
                    "万m³" +
                    "<br/>";
                } else {
                  val = "-";
                  res +=
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' +
                    datas[i].color +
                    ';"></span>' +
                    datas[i].seriesName +
                    "：" +
                    val +
                    "万m³" +
                    "<br/>";
                }
              }
              return res;
            },
          },
        grid: {
          top: "7%",
          bottom: "18%",
          left: "10%",
          right: "8%",
        },
        xAxis: [
          {
            type: "category",
            data: xdata,
            boundaryGap: false,
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              textStyle: {
                fontSize: 12,
              },
            },
            axisLine: {
              lineStyle: {},
            },
          },
        ],
        yAxis: {
          type: "value",
          splitNumber: 5,
          max: Max,
          splitLine: {
            show: true,
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 12,
            },
          },
        },
        series: [
          {
            name: "气量提取线",
            type: "line",
            data: actualData,
            lineStyle: {
              normal: {
                width: 2,
                color: "#47A87D",
              },
            },
            symbol: "none",
            itemStyle: {
              normal: {},
            },
            smooth: true,

            markLine: {
              symbol: "none",

              // data: yMarkline,
              data: [
                { xAxis: xdata[xdata.length - 1], name: "气量提取完成" },
              ],
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: "dashed",
                    // color: 'red',
                    // type: 'solid'  //'dotted'虚线 'solid'实线
                  },
                  label: {
                    show: true,
                    //  position: 'center',
                    formatter: "气量提取完成",
                  },
                },
              },
            },
          },
          {
            name: "预测下气量",
            type: "line",
            smooth: false,
            // data: this.yAxisData2,
            symbol: "none", //数据交叉点样式 (实心点)
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 2,
                  type: "dashed",
                },
              },
            },
            markLine: {
              symbol: "none", //去掉箭头
              itemStyle: {
                normal: {
                  lineStyle: { color: "#F27F05", type: "dashed", width: 1 },
                  label: { show: false, position: "left" },
                },
              },
              data: [
                { type: "max", name: "预测下气量", yAxis: dailyValue }, // 最小值水平线或垂直线
              ],
            },
          },

          {
            name: "计划下气量",
            type: "line",
            smooth: false,
            // data: this.yAxisData2,
            symbol: "none", //数据交叉点样式 (实心点)
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 2,
                  type: "dashed",
                },
              },
            },
            markLine: {
              symbol: "none", //去掉箭头
              itemStyle: {
                normal: {
                  lineStyle: { color: "#0074FF", type: "dashed", width: 1 },
                  label: { show: false, position: "left" },
                },
              },
              data: [
                { type: "max", name: "计划下气量", yAxis: base }, // 最小值水平线或垂直线
              ],
            },
          },
        ],
      });
    
    },
  },
  beforeDestroy() {
    // this.chartData = {};
  },
};
</script>
<style lang="scss" scoped>
.line-box {
  width: 100%;
  height: 572px;
}
.echart-box {
  width: 100%;
  height: 100%;
}
.box {
  width: 100%;
  height: 100%;
}
</style>
