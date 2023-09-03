<template>
  <div class="echart-wrap" v-resize="resize">
    <div class="echart-box" ref="echartBox"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Chart",
  props: {
    chartData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
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
  watch: {
    chartData: {
      handler(val) {
        // console.log(val);
        if (val) {
          //     this.initChart()
          this.$nextTick(() => {
            this.setOption(val);
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    resize() {
      // 当宽高变化时就会执行
      //执行某些操作
      this.chart.resize();
    },
    initChart() {
      this.chart = echarts.init(this.$refs.echartBox);
      // this.setOption(this.chartData);
    },
    setOption({
      actualData,
      dataX,
      warnArea,
      type,
      markLineData,
      datahX,
    } = {}) {
      //   console.log(actualData, dataX, warnArea,type);
      if (actualData && dataX && warnArea && type && markLineData) {
        if (type == "displayCurveGraphPipe") {
          //管网
          var markColor = "#F5222D",
            lineName = "瞬时流量",
            unit ="万m³/h",
            markLineName = "最大输配能力";
        }
        if (type == "displayCurveGraphPipeEnd") {
          var markColor = "#2F3F95",
            lineName = "压力曲线",
            unit ="MPa",
            markLineName = "压力下限";
        }
        var max = Math.max.apply(Math, actualData); //数据的最大值
        var min = Math.min.apply(Math, actualData); //数据的最大值

        var yMarkline = [];
        if (markLineData && markLineData.length != 0) {
          for (var i = 0; i < markLineData.length; i++) {
            yMarkline.push({
              name: "",
              xAxis: markLineData[i],
              label: {
                show: false,
              },
              lineStyle: {
                normal: {
                  color: "#0074FF",
                  width: 1,
                  type: "dashed",
                },
              },
            });
          }
        }
        //标记线
        var markLineData2 = [];
        for (var m = 0; m < warnArea.length; m++) {
          markLineData2.push({
            yAxis: warnArea[m],
            lineStyle: {
              type: "dashed",
              color: markColor,
              width: 1,
            },
            label: {
              show: false,
              //   //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
              //   position: "end",
              //   fontSize: 10,
              //   formatter: "超下下限",
            },
          });
        }
        if (type == "displayCurveGraphPipe") {
          var pieces = [
            { gte: min-5, lte: warnArea[0], color: "#47a87d" },
            { gte: warnArea[0], lte: max+5, color: "#F5222D" },
          ];
        }
        if (type == "displayCurveGraphPipeEnd") {
          var pieces = [
            { gte: min-5, lte: warnArea[0], color: "#2F3F95" },
            { gte: warnArea[0], lte: max+5, color: "#47a87d" },
          ];
        }
        var option = {
          xAxis: [
            {
              type: "category",
              data: dataX,
              boundaryGap: false,
              show: false,
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
            {
              type: "category",
              data: datahX,
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
              position: "bottom",
              axisPointer: {
                show: false,
              },
            },
          ],
          grid: {
            left: 10,
            right: 20,
            bottom: 50,
            top: 20,
            containLabel: true,
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
                    unit+
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
                    unit +
                    "<br/>";
                }
              }
              return res;
            },
          },
          yAxis: {
            //name: unit,
            max: Math.ceil(max + warnArea[0]),
            // min: Math.ceil(min - warnArea[0]),
            axisTick: {
              show: false,
            },
            offset: 2,
          },
          legend: {
            icon: "rect",
            y: "bottom",
            itemHeight: 12,
            itemWidth: 12,
          },
          visualMap: {
            borderWidth: "13px",
            type: "piecewise",
            show: false,
            dimension: 1,
            pieces: pieces, //pieces的值由动态数据决定
            hoverLink: true,
          },
          series: [
            {
              name: lineName,
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 2,
                  },
                },
              },
              color: "#47a87d",
              smooth: true,
              type: "line",
              data: actualData,
              symbol: "none", //数据交叉点样式 (实心点)
              markLine: {
                symbol: "none",

                data: yMarkline,
              },
            },
            {
              name: markLineName,
              type: "line",
              smooth: false,
              // data: this.yAxisData2,
              symbol: "none", //数据交叉点样式 (实心点)
              color: markColor,
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
                data: markLineData2,
              },
            },
          ],
        };
        this.chart.setOption(option, true);
      }
    },
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
};
</script>

<style scoped>
.echart-wrap {
  width: 100%;
  height: 100%;
}
.echart-box {
  width: 100%;
  height: 100%;
}
</style>
