/**
 * @Description:
 * @author XiaoLong Zhang
 * @date 2021/11/5
*/
<template>
  <div style="width: 100%;height: 100%" v-resize="resize">
  <div class="chart-box" ref="chartBox" v-show="flag"></div>
    <div class="noData" v-show="!flag">
      <img src="../../../../images/none.png" alt="" />
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getCustomercustomerGasChart } from '@/idsPages/api/customerStatusMonitoring'
export default {
  name: "Chart",
  props:{
    customerCode: {
      type: String,
    }
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
  watch:{
    customerCode(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.chartDom.clear()
        this.flag = true
        if(newValue!=="") {
          this.getChartData();
        }
      }
    }
  },
  data(){
    return {
      chartDom:null,
      chartData:{},
      flag:true,
      timer: null
    }
  },
  mounted() {
    this.chartDom = echarts.init(this.$refs.chartBox)
    this.refreshInterface()
  },
  methods:{
    resize() {
      // 当宽高变化时就会执行
      //执行某些操作
      this.chartDom.resize();
    },
    //获取图表数据
    getChartData(){
      this.chartDom.clear()
      getCustomercustomerGasChart({customerCode:this.customerCode}).then(res=>{
        if(res.resultCode === 0) {
          this.chartData = res.data
          for(let i =0 ; i< this.chartData.seriesData.length ; i++ ){
            let item = this.chartData.seriesData[i]
            if(item.length !== 0){
              this.flag = true
              break;
            }else{
              this.flag = false
            }
          }
          this.setOption()
        }
      })
    },
    setOption(){
      let option = {
        color: ['#1890FF', '#00CA69'],
        legend: {
          icon: "rect",
          y: "bottom",
          itemHeight: 12,
          itemWidth: 12,
          padding:[0,0,30,0]
        },
        tooltip: {
          trigger: 'axis',
          formatter:function(params) {
            let relVal = params[0].name+'时';
            for (let i = 0, l = params.length; i < l; i++) {
              relVal += `<br/> ${params[i].marker+ params[i].seriesName} <span style="margin-left:10px;color:#000;font-weight: bold">${params[i].value!==undefined?params[i].value+"":'-'}</span>`
            }
            return relVal;
          }
        },
        grid: {
          top: 100,
          containLabel: true,
        },
        xAxis: [{
          type: "category",
          boundaryGap: false,
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: "#333"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#000"
            }
          },
          data: this.chartData.xdata
        }],
        yAxis: [{
          type: "value",
          name: '气量Nm³',
          axisLabel: {
            textStyle: {
              color: "#666"
            }
          },
          nameTextStyle: {
            color: "#666",
            fontSize: 12,
            lineHeight: 40
          },
          splitLine: {
            lineStyle: {
              color: "#E9E9E9"
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }],
        series: []
      }
      this.chartData.seriesData.map((i,index)=>{
        option.series.push({
          name: this.chartData.legend[index],
          type: "line",
          smooth: true,
          symbol: 'circle', //数据交叉点样式 (实心点)
          data: i
        })
      })
      this.chartDom.setOption(option);
    },
    // 页面定时刷新
    refreshInterface() {
      this.timer = setInterval(() => {
        this.getChartData();
      }, 180000);
    }
  },
  destroyed() {
    //清除定时器
    clearInterval(this.timer);
  },
}
</script>

<style scoped lang="scss">
.chart-box {
  display: flex;
  justify-content: center;
  width: 100%;
  height: calc(42vh);
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
