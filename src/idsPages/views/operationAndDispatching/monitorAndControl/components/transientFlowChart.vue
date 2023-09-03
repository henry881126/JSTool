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
    instantFlowChartData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      chartDom: null,
      pullInData: [],
      exitData: [],
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
    instantFlowChartData: {
      handler(newval) {
        this.$nextTick(() => {
          this.setOption(newval);
        });
      },
      deep: true,
    },
  },
  methods: {
    //获取图表数据
    getChartData() {},
    _getMaxValue(arr) {
      const max = Math.max(...arr);
      // 这样处理是为了不让最大值刚好到坐标轴最顶部
      return max;
    },
    _getMinValue(arr) {
      const min = Math.min(...arr);
      // 这样处理是为了不让最大值刚好到坐标轴最底部
      return min;
    },
    resize() {
      // 当宽高变化时就会执行
      //执行某些操作
      this.chartDom.resize();
    },
    initChart() {
      this.chartDom = echarts.init(this.$refs.chartBox);
    },
    setOption({ seriesData, xdata }) {
      if (seriesData && seriesData.length > 0) {
        this.pullInData = seriesData[0];
        this.exitData = seriesData[1];
        let dataArr = [];
        for (var i in this.pullInData) {
          dataArr.push(this.pullInData[i]);
        }
        for (var i in this.exitData) {
          dataArr.push(this.exitData[i]);
        }
        const min1 = this._getMinValue(dataArr),
          min2 = this._getMinValue(seriesData[2]),
          max1 = this._getMaxValue(dataArr),
          max2 = this._getMaxValue(seriesData[2]);
        var intervalMethod = 0;
        if (min1 == max1) {
          intervalMethod = Math.abs(max1) / 5;
        } else {
          intervalMethod = (max1 - min1) / 5;
        }
        let option = {
          color: ["#1890FF", "#00CA69", "#F27F04", "#2F3F95"],
          legend: {
            icon: "rect",
            y: "bottom",
            itemHeight: 12,
            itemWidth: 12,
          },
          tooltip: {
            trigger: "axis",
            formatter: function (datas) {
              let res = datas[0].name + "<br/>";
              let val;
              for (let i = 0; i < datas.length; i++) {
                if (datas[i].seriesName == "占用率") {
                  val = datas[i].value;
                  // .replace(/^(.*\..{2}).*$/, "$1");
                  res +=
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' +
                    datas[i].color +
                    ';"></span>' +
                    datas[i].seriesName +
                    "：" +
                    val +
                    "%" +
                    "<br/>";
                } else {
                  val = datas[i].value;
                  // .replace(/^(.*\..{2}).*$/, "$1");
                  res +=
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' +
                    datas[i].color +
                    ';"></span>' +
                    datas[i].seriesName +
                    "：" +
                    val +
                    "<br/>";
                }
              }
              return res;
            },
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
              min: min1 - 10,
              max: max1 + 10,
              // splitNumber: 5,
              interval: intervalMethod,
              // interval: 5,
              // name: '压力Mpa',
              axisLabel: {
                textStyle: {
                  color: "#666",
                },
                formatter: function (value, index) {  
                  let val = `${value.toFixed(0)}`         
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
            {
              type: "value",
              position: "right",
              // name: '总瞬流',
              // splitNumber: 5,
              interval: (max2 + 1 - min2) / 5,
              // interval: 5,
              min: min2,
              max: max2 + 1,
              axisLabel: {
                textStyle: {
                  color: "#666",
                },
                formatter: function (value, index) {  
                  let val = `${value.toFixed(2)}%`         
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
              name: "进站",
              type: "line",
              smooth: true,
              symbol: "none", //数据交叉点样式
              data: this.pullInData,
              yAxisIndex: 0, // 通过这个判断左右
            },
            {
              name: "出站",
              type: "line",
              smooth: true,
              symbol: "none", //数据交叉点样式 (实心点)
              data: this.exitData,
              yAxisIndex: 0, // 通过这个判断左右
            },
            {
              name: "占用率",
              type: "line",
              smooth: true,
              symbol: "none", //数据交叉点样式 (实心点)
              data: seriesData[2],
              yAxisIndex: 1, // 通过这个判断左右
            },
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
