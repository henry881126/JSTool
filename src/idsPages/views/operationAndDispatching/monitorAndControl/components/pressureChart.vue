<template>
  <div class="line-box" v-resize="resize">
    <div class="chart-box" ref="chartBox"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Chart",
  props: {
    pressureChartData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      chartDom: null,
      yAxisData1: [],
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
    pressureChartData: {
      handler(newval) {
        this.$nextTick(() => {
          this.setOption(newval);

        });
      },
      deep: true,
    },
  },
  methods: {
    _getMaxValue(arr) {
      const max = Math.max(...arr);
      // 这样处理是为了不让最大值刚好到坐标轴最顶部
      return Math.ceil(max / 9.5) * 10;
    },
    _getMinValue(arr) {
      const min = Math.min(...arr);
      // 这样处理是为了不让最大值刚好到坐标轴最底部
      return Math.floor(min / 12) * 10;
    },
    resize() {
      // 当宽高变化时就会执行
      //执行某些操作
      this.chartDom.resize();
    },
    initChart() {
      this.chartDom = echarts.init(this.$refs.chartBox);
      // this.setOption(this.pressureChartData);
    },

    setOption({ seriesData, xdata }) {
      if (
        (seriesData &&
        seriesData.length > 0)
      ) {
        
        let option = {
          color: ["#0074FF", "#47A87D", "#F5222D", "#2F3F95"],
          legend: {
            icon: "rect",
            y: "bottom",
            itemHeight: 12,
            itemWidth: 12,
          },
          tooltip: {
            trigger: "axis",
          },
          grid: {
            top: "15%",
            bottom: "10%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: true,
              axisLabel: {
                textStyle: {
                  color: "#333",
                },
              },
              axisLine: {
                lineStyle: {
                  color: "#000",
                },
              },
              axisTick: {
                show: true,
                alignWithLabel: true,
              },
              data: xdata,
            },
          ],
          yAxis: [
            {
              type: "value",
              position: "left",
              // min: min1,
              // max: max1,
              axisLabel: {
                textStyle: {
                  color: "#666",
                },
                 formatter: function (value, index) {  
                  let val = String(value).replace(/^(.*\..{2}).*$/, "$2")         
                  return val;      
                 }
              },
              nameTextStyle: {
                color: "#666",
                fontSize: 12,
                lineHeight: 40,
              },
              // 分割线
              splitLine: {
                lineStyle: {
                  color: "#E9E9E9",
                },
              },
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
            },
          ],
          series: [
            {
              name: "出口压力",
              type: "line",
              smooth: true,
              symbol: "none", //数据交叉点样式
              data: seriesData[0],
              // yAxisIndex: 0, // 通过这个判断左右
            },
            {
              name: "进口压力",
              type: "line",
              smooth: true,
              symbol: "none", //数据交叉点样式 (实心点)
              data: seriesData[1],
              // yAxisIndex: 1, // 通过这个判断左右
            },
            // {
            //   name: "上限",
            //   type: "line",
            //   smooth: true,
            //   // data: this.yAxisData2,
            //   symbol: "none", //数据交叉点样式 (实心点)
            //   itemStyle: {
            //     normal: {
            //       lineStyle: {
            //         width: 2,
            //         type: "dashed",
            //       },
            //     },
            //   },
            //   markLine: {
            //     symbol: "none", //去掉箭头
            //     itemStyle: {
            //       normal: {
            //         lineStyle: { color: "#F5222D", type: "dashed", width: 1 },
            //         label: { show: false, position: "left" },
            //       },
            //     },
            //     data: [
            //       // {  yAxis: 1122 ,name: "max"}, // 最大值水平线或垂直线
            //       markLineData[0],
            //     ],
            //   },
            // },
            // {
            //   name: "下限",
            //   type: "line",
            //   smooth: true,
            //   // data: this.yAxisData2,
            //   symbol: "none", //数据交叉点样式 (实心点)
            //   itemStyle: {
            //     normal: {
            //       lineStyle: {
            //         width: 2,
            //         type: "dashed",
            //       },
            //     },
            //   },
            //   markLine: {
            //     symbol: "none", //去掉箭头
            //     itemStyle: {
            //       normal: {
            //         lineStyle: { color: "#2F3F95", type: "dashed", width: 1 },
            //         label: { show: false, position: "left" },
            //       },
            //     },
            //     data: [
            //       // {  yAxis: 422,name: "min" }, // 最小值水平线或垂直线
            //       markLineData[1],
            //     ],
            //   },
            // },
          ],
        };
        this.chartDom.setOption(option);
      }
    },
  },
};
</script>

<style scoped>
.line-box {
  width: 100%;
  height: calc(100% - 30px);
}
.chart-box {
  width: 100%;
  height: 100%;
}
</style>
