<template>
    <div class="chart-purchase-unit-price" ref="chartPurchaseUnitPrice"></div>
</template>

<script>
import * as echart from 'echarts'

export default {
    props: {
        purchaseCostList: {
            type: Array,
            default: () => []
        },  
    },
    data() {
        return {
            echart: null,
            sourceData: {}
        }
    },
    watch: {
        purchaseCostList() {
            this.$nextTick(() => {
                this.initialEchart()
            })
        }
    },
    created() {
        this.$nextTick(() => {
            this.initialEchart()
        })
    },
    methods: {
        initialEchart() {
            this.getInitialData()
            this.echart = echart.init(this.$refs.chartPurchaseUnitPrice)
            this.createChart()
        },
        createChart() {
            const options = this.getOptions()
            this.echart.setOption(options)
            window.addEventListener('resize', () => {
                this.echart.resize()
            })
        },
        getOptions() {
            let options = {
                title: {
                    text:  [
                        '{a|供应商综合价格} ',
                        '{x|(单位:元/方)}'
                    ].join(''),
                    textStyle : {
                        rich: {
                            a: {
                                color: '#303133',
                                fontSize: 16,
                                fontWeight: 500,
                                lineHeight: 10,
                            },
                            x: {
                                fontSize: 14,
                                borderColor: '#606266',
                            },
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter:() => {
                        const colorArr = this.getChartOptionColor()   // 获取echart默认颜色列表
                        let str = ""
                        this.sourceData.titleArr.map((item, index) => {
                            const data = this.sourceData.dataArr[index]
                            str += `<div>
                                <span style='float: left; width: 10px; height: 10px; background: ${colorArr[index]}; border-radius: 10px; margin-right: 6px; position: relative; top: 6px;'></span>
                                <span style='float: left; margin-right: 20px; font-size: 12px;'>${item}</span>
                                <span style='float: right; font-weight: bold; color: #555;'>${data['data'][index]}</span>
                            </div>`
                        })
                        return str
                    }
                },
                legend: {
                    top: '33px',
                    padding: 0,
                    itemGap: 20
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        interval: 0,
                        fontSize: 10
                    },                    
                    data: this.sourceData.titleArr
                },                
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                // 堆叠柱状图
                series: this.sourceData.dataArr    
            };
            return options
        },
        // 2 构造表格数据（折线图改为堆叠柱状图，与折线图区别：各柱子颜色各异，有多图例）
        getInitialData() {
            let purchaseCostList = this.purchaseCostList
            let titleArr = []
            let dataArr = []
            for(let i=0; i<purchaseCostList.length-1; i++) {
                // 图例用名称
                const name = purchaseCostList[i]['supplier_shorter_name'] ? purchaseCostList[i]['supplier_shorter_name'] : purchaseCostList[i]['supplier_name']
                titleArr.push(name)
                // 构造series数据(数据结构series1:[4,0,0],series2:[0,5,0],series3:[0,0,6])
                let arr = []
                arr[i] = purchaseCostList[i]['comprehensive_price']
                dataArr.push({
                    name: name,
                    type: 'bar',
                    stack: 'total',
                    // barGap: '-100%', // stack或barGap:'-100%'效果相同
                    data: arr,
                    barWidth: 20
                })
            }
            this.sourceData = {
                titleArr,
                dataArr
            }  
        },
        // 获取图表option配置项中的默认颜色数组
        getChartOptionColor() {
            const options = this.echart.getOption()
            const colorArr = options.color
            return colorArr
        },
    }
}
</script>

<style lang="scss" scoped>
</style>``