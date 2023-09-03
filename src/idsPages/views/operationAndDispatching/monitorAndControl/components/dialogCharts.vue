<template>
  <div class="line-box" v-resize="resize">
    <div class="box" ref="echartBox"></div>
  </div>
</template>
<script>
export default {
  name: "dialog-echarts",
  props: {
    dialogData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {},
  data() {
    return {
      chart: null,
    };
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
  computed: {},
  watch: {
    dialogData: {
      handler(newval) {
        this.$nextTick(() => {
          this.setOptions(newval);
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.initChart();
  },
  methods: {
    resize() {
      // 当宽高变化时就会执行
      //执行某些操作
      this.chart.resize();
    },
    initChart() {
      this.chart = this.$echarts.init(this.$refs.echartBox);
    },
    setOptions({ xdata, xhdata, ydata, transportUp, fullList }) {
      var maxArr = [];
      if (ydata.length > 0) {
        for (var i = 0; i < ydata[0].length; i++) {
          maxArr.push(ydata[0][i]);
        }
        maxArr.push(transportUp);
      }
      let Max = Math.ceil(Math.max(...maxArr)) + 2;
      var yMarkline = [];
      if (fullList && fullList.length != 0) {
        for (let i = 0; i < fullList.length; i++) {
          yMarkline.push([
            {
              coord: [fullList[i], 0],
              lineStyle: {
                normal: {
                  color: "#0074FF",
                  width: 1,
                  type: "dashed",
                },
              },
            },
            {
              coord: [fullList[i], transportUp],
              lineStyle: {
                normal: {
                  color: "#0074FF",
                  width: 1,
                  type: "dashed",
                },
              },
            },
          ]);
          // yMarkline.push({
          //   name: "",
          //   xAxis: fullList[i],
          //   label: {
          //     show: false,
          //   },
          //   lineStyle: {
          //     normal: {
          //       color: "#0074FF",
          //       width: 1,
          //       type: "dashed",
          //     },
          // },
          // });
        }
      }
      this.chart.setOption({
        title: {
          text: "万m³/h",
          textStyle: {
            fontSize: 14,
            fontStyle: "normal",
            fontWeight: "normal",
          },
          padding: [0, 0, 10, 0],
        },
        color: ["#F27F05", "#47A87D"],
        legend: {
          // data:legend,
          icon: "rect",
          y: "bottom",
          itemHeight: 12,
          itemWidth: 12,
        },
        tooltip: {
          trigger: "axis",
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
            data: xhdata,
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
        dataZoom: [
          {
            type: "slider", //图表下方的伸缩条
            show: true, //是否显示
            realtime: true, //拖动时，是否实时更新系列的视图
            bottom: 35,
            height: 15,
            fillerColor: "rgba(210, 213, 216, 0.4)",
            // start: 80, //伸缩条开始位置（1-100），可以随时更改
            // end: 100, //伸缩条结束位置（1-100），可以随时更改
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
          //   axisLine: {
          //     lineStyle: {
          //       color: "#2E75B6",
          //       shadowColor: "#2E75B6",
          //       shadowOffsetY: "-24",
          //       width: 5,
          //     },
          //     symbol: ["none", "arrow"],
          //     symbolSize: [13, 20],
          //     symbolOffset: [0, 40],
          //   },
          //   nameTextStyle: {
          //     color: "#999",
          //   },
          //   splitArea: {
          //     show: false,
          //   },
        },
        //分段背景色
        // visualMap: {
        //   type: "piecewise",
        //   text: ["High", "Low"],
        //   show: false,
        //   dimension: 0,
        //   seriesIndex: 0,
        //   pieces: [
        // {
        //   gt: 0,
        //   lte: 2,
        //   color: "#9DD3E8",
        // },
        // {
        //     gt: 1,
        //     lte: 2,
        //     color: '#F39494',
        // },
        // ],
        // outOfRange: {
        //     color: ['#121122'],
        //     symbolSize: [0]
        // }
        // },
        series: [
          {
            name: "最大输配能力",
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
                  lineStyle: { color: "#F5222D", type: "dashed", width: 1 },
                  label: { show: false, position: "left" },
                },
              },
              data: [
                { type: "max", name: "最大输配能力", yAxis: transportUp }, // 最小值水平线或垂直线
                // [
                //   {
                //     // name: '两个坐标之间的标线',
                //     coord: ["15", 40],
                //   },
                //   {
                //     coord: ["07", 40],
                //   },
                // ],
                // [
                //   {
                //     // name: '两个坐标之间的标线',
                //     coord: ["09", 90],
                //   },
                //   {
                //     coord: ["15", 90],
                //   },
                // ],
              ],
            },
          },
          {
            name: "瞬时流量",
            type: "line",
            data: ydata[0],
            // symbol: "emptyCircle",
            showAllSymbol: false,
            symbolSize: 12,
            hoverAnimation: false,
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

              data: yMarkline,
            },
          },
        ],
      });
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
.line-box {
  width: 100%;
  height: 100%;
}
.box {
  width: 100%;
  height: 100%;
}
</style>

