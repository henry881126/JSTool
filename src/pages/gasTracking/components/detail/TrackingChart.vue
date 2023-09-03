<template>
  <div class="container">
    <div ref="trackingChart" style="width:100%;height:520px;"></div>
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
      sourceCategory: []
    }
  },
  props: {
      currentRecord:Object
  },  
  created() {
    this.getList()
    // this.initialChart()
  },
  methods: {
    getList() {
      // console.log('childrne:', this.currentRecord)
      const params= {
        bp: this.currentRecord.customerCode,
        time: this.currentRecord.time,
        type: 2
      }
      api.gasTracking.month.getMonthGasTrackingChart(params).then(res => {
        console.log('detail chart:', res)
        // this.sourceCategory = res[0][0]
        this.sourceData = res[0]
        const arr = []
        res[0].map(item => {
          arr.push([
            // item.time,
            this.convertDateToDay(item.time),
            item.replyVolume,
            item.extractVolume,
            item.offsetRate,
          ])
        })
        
        arr.unshift(['','应交付量', '实际提取量', '偏差率'])
        this.sourceData = arr
        console.log('source data:',this.sourceData)
        console.log('arr converted:',arr)
        // 初始化图表        
        this.initialChart()
      })    
    },
    initialChart() {
      this.$nextTick(() => {
        this.echart = echart.init(this.$refs.trackingChart)
        this.createChart()
        window.addEventListener('resize',() => {
          this.echart.resize()
        })
      })
    },
    createChart() {
      const options = this.getOptions()
      this.echart.setOption(options, true)
    },
    getOptions() {
      return {
        dataset: {
          source: this.sourceData,
        },        
        grid: {
          x: 60,
          // y: 10,
          x2: 60,
          y2: 40
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          // feature: {
          //   dataView: { show: true, readOnly: false },
          //   magicType: { show: true, type: ['line', 'bar'] },
          //   restore: { show: true },
          //   saveAsImage: { show: true }
          // }
        },
        legend: {
          itemGap: 10,
          itemWidth: 10,
          itemHeight: 10,
          icon: 'rect',
          textStyle: {
            color: '#777',
          },
          formatter(name) {
            return name
          }
        },
        xAxis: [
          {
            type: 'category',
            // 坐标轴刻度标签样式
            axisLabel: {
              // 自定义标签颜色
              // color(value, index) {
              //   return index > 5 ? 'green' : 'red'
              // }
            },
            axisTick: {
              show: false
              // alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '用量',
            // min: 0,
            // max: 1000,
            // interval: 100,
            splitLine: {show: false},
            axisLabel: {
              formatter: '{value}'
            },
            nameTextStyle: {
              padding: [0, 38, 0, 0]
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
            name: '偏差率',
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
        color: ['#6E87CC','#A3D38D','#E8684A'],  // 设置系列颜色，同时图例颜色会与之相同
        series: [
          { 
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,            
          }, 
          { 
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,              
          }, 
          { 
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 2,     
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#E8684A'
                }
              }
            }                     
          }
        ]
      };
    },
    // 日期转换，将2021-10-09转换成9日
    convertDateToDay(date) {
      const arr = date.split('-')
      return (arr[2].substr(0,1) === '0' ? arr[2].substr(1) : arr[2]) + '日'
    }
  }
}
</script>

<style>
</style>