<template>
  <div class="container">
    <div ref="cumulativeChart" style="width:100%;height:520px;"></div>
  </div>
</template>

<script>
import api from '/src/http/api'
import * as echart from 'echarts'

export default {
  data() {
    return {
      data: null,
      echart: null,
      sourceData: [],

    }
  },
  created() {
    this.getList()
    // this.initialChart()
  },
  props: {
      currentRecord:Object
  },  
  methods: {
    getList() {
      console.log('childrne:', this.currentRecord)
      const params= {
        bp: this.currentRecord.customerCode,
        time: this.currentRecord.time,
        type: 3
      }
      api.gasTracking.month.getMonthGasTrackingCumulativeDetail(params).then(res => {
        console.log('detail cumulative chart:', res)
        this.sourceData = res[0]
        const arr = []
        res[0].map(item => {
          arr.push([
            this.convertDateToDay(item.time),
            item.balancePlanGas,
            item.balanceExtractVolume,
            item.offsetVolume
          ])
        })
        arr.unshift(['', '剩余计划量','剩余提取量','偏差量'])
        // arr.unshift(['','应交付量', '实际提取量', '偏差率'])

        this.sourceData = arr
        console.log('cumulative source data:',this.sourceData)
        console.log('cumulative arr converted:',arr)
        // 初始化图表        
        this.initialChart()
      })    
    },    
    initialChart() {
      this.$nextTick(() => {
        this.echart = echart.init(this.$refs.cumulativeChart)
        this.createChart()
        window.onresize = this.echart.resize  //       this.echart.resize({ width: "auto" })
      })
    },
    createChart() {
      const options = this.getOptions()
      this.echart.setOption(options, true)
    },
    getOptions() {
      return {
        dataset: {
          source: this.sourceData
        },          
        grid: {
          x: 60,
          // y: 10,
          x2: 60,
          y2: 40
        },
        tooltip: {
          // trigger: 'axis',
          // axisPointer: {
          //   type: 'cross',
          //   crossStyle: {
          //     color: '#999'
          //   }
          // }
        },
        toolbox: {
          // feature: {
          //   dataView: { show: true, readOnly: false },
          //   magicType: { show: true, type: ['line', 'bar'] },
          //   restore: { show: true },
          //   saveAsImage: { show: true }
          // }
        },
        color: ['#A3D38D','#6E87CC','#E8684A'],
        legend: {
          itemGap: 10,
          icon: 'reac',
          itemWidth: 16,
          itemHeight: 4,
          textStyle: {
            color: '#777',
          }
        },
        xAxis: [
          {
            type: 'category',
            axisPointer: {
              type: 'shadow'
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '用量',
            // min: 0,
            // max: 1000,
            // interval: 250,
            splitLine: {show:false},
            axisLabel: {
              formatter: '{value}'
            },
            nameTextStyle: {
              padding:[0, 38, 0, 0]
            }
          },
          {
            type: 'value',
            // name: '用量',
            // min: 0,
            // max: 1000,
            interval: 250,
            axisLabel: {
              formatter: '{value}'
            }
          },          
          {
            type: 'value',
            name: '偏差量',
            // min: 0.1,
            // max: 1,
            // interval: 0.1,
            axisLabel: {
              formatter(val) {
                return val.toFixed(1)
              }
            },
            nameTextStyle: {
              padding: [0, 0, 0, 18]
            }
          }
        ],
        series: [
          { 
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,            
          }, 
          { 
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,              
          }, 
          { 
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 2,              
          }
        ]
      };
    },
    // 日期转换，将2021-10-09转换成9日
    convertDateToDay(date) {
      const arr = date.split('-')
      return (arr[2].substr(0, 1) === '0' ? arr[2].substring(1) : arr[2]) + '日'
    }    
  }
}
</script>

<style>
</style>