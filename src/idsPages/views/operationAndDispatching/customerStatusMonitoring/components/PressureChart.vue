/**
* @Description:
* @author XiaoLong Zhang
* @date 2021/11/5
*/
<template>
  <div style="width: 100%; height: 100%" v-resize="resize">
    <div class="chart-box" ref="chartBox" v-show="flag"></div>
    <div class="noData" v-show="!flag">
      <img src="../../../../images/none.png" alt="" />
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getCustomerPressureChart } from "@/idsPages/api/customerStatusMonitoring";
export default {
  name: "Chart",
  props: {
    customerCode: {
      type: String,
    },
  },
  data() {
    return {
      chartDom: null,
      chartData: {},
      flag: true,
      timer: null,
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
  mounted() {
    this.chartDom = echarts.init(this.$refs.chartBox);
    this.refreshInterface();
  },
  watch: {
    customerCode(newValue, oldValue) {
      console.log(newValue, oldValue, "=====");
      if (newValue !== oldValue) {
        this.flag = true;
        this.chartDom.clear();
        if (newValue !== "") {
          this.getChartData();
        }
      }
    },
  },
  methods: {
    //计算最大值
    calMax(arr) {
      let max = Math.max(...arr);
      let maxint = Math.ceil(max); // 不让最高的值超过最上面的刻度
      let maxval = maxint; // 让显示的刻度是整数
      // 为了防止数据为0时，Y轴不显示，给个最大值
      if (maxval == 0) {
        maxval = 1;
      }
      return maxval;
    },

    //计算最小值
    calMin(arr) {
      let min = Math.min(...arr);
      let minint = Math.floor(min / 10);
      let minval = minint * 10; //让显示的刻度是整数
      return minval;
    },
    resize() {
      // 当宽高变化时就会执行
      //执行某些操作
      this.chartDom.resize();
    },
    //获取图表数据
    getChartData() {
      this.chartDom.clear();
      getCustomerPressureChart({ customerCode: this.customerCode }).then(
        (res) => {
          if (res.resultCode === 0) {
            this.chartData = res.data;
            for (let i = 0; i < this.chartData.seriesData.length; i++) {
              let item = this.chartData.seriesData[i];
              if (item.length !== 0) {
                this.flag = true;
                break;
              } else {
                this.flag = false;
              }
            }
            this.setOption();
          }
        }
      );
    },
    setOption() {
      let color = [
        "#1890FF",
        "#4ECB73",
        "#F27F04",
        "#ffb980",
        "#d87a80",
        "#8d98b3",
        "#e5cf0d",
        "#97b552",
        "#95706d",
        "#dc69aa",
        "#07a2a4",
        "#9a7fd1",
        "#588dd5",
        "#f5994e",
        "#c05050",
        "#59678c",
        "#c9ab00",
        "#7eb00a",
        "#6f5553",
        "#c14089",
      ];
      let option = {
        // color: ['#1890FF', '#00CA69','#F5222D','#2F3F95'],
        legend: {
          icon: "rect",
          y: "bottom",
          itemHeight: 12,
          itemWidth: 12,
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let relVal = params[0].name + "时";
            for (let i = 0, l = params.length; i < l; i++) {
              relVal += `<br/> ${
                params[i].marker + params[i].seriesName
              } <span style="margin-left:10px;color:#000;font-weight: bold">${
                params[i].value !== undefined ? params[i].value + "" : "-"
              }</span>`;
            }
            return relVal;
          },
        },
        grid: {
          top: 100,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
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
            data: this.chartData.xdata,
          },
        ],
        yAxis: [
          {
            type: "value",
            position: "left",
            splitNumber: 5,
            name: "压力Mpa",
            axisLabel: {
              textStyle: {
                color: "#666",
              },
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
          },
          {
            type: "value",
            position: "right",
            name: "总瞬流Nm³/h",
            splitNumber: 5,
            axisLabel: {
              textStyle: {
                color: "#666",
              },
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
          },
        ],
        series: [],
      };
      let max1 = null;
      let max2 = null;
      let length = this.chartData.seriesData.length;
      this.chartData.seriesData.map((i, index) => {
        if (index == length - 1) {
          option.yAxis[1].max = this.calMax([...i]);
          option.yAxis[1].min = this.calMin([...i]);
          option.yAxis[1].interval =
            (this.calMax([...i]) - this.calMin([...i])) / 5;
          option.series.push({
            name: this.chartData.legend[index],
            type: "line",
            smooth: true,
            symbol: "circle", //数据交叉点样式
            data: i,
            yAxisIndex: 1, // 通过这个判断左右
            color: color[i],
          });
        } else {
          if (index == 0) {
            max1 = this.calMax([...i]);
          }
          max2 = this.calMax([...i]);
          max1 = max1 < max2 ? max2 : max1;
          option.yAxis[0].max = max1;
          option.yAxis[0].min = this.calMin([...i]);
          option.yAxis[0].interval = (max1 - 0) / 5;
          option.series.push({
            name: this.chartData.legend[index],
            type: "line",
            smooth: true,
            symbol: "circle", //数据交叉点样式
            data: i,
            yAxisIndex: 0, // 通过这个判断左右
            color: color[i],
          });
        }
      });
      this.chartDom.setOption(option);
    },
    // 页面定时刷新
    refreshInterface() {
      this.timer = setInterval(() => {
        this.getChartData();
      }, 180000);
    },
  },
  destroyed() {
    //清除定时器
    clearInterval(this.timer);
  },
};
</script>

<style scoped lang="scss">
.chart-box {
  display: flex;
  justify-content: center;
  width: 100%;
  height: calc(42vh);
  position: relative;
}
.noData {
  width: 100%;
  height: calc(40vh);
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
