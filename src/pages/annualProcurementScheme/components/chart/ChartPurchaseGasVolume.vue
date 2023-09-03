<template>
    <div class="chart-purchase-gas-volume" ref="chartPurchaseGasVolume"></div>
</template>

<script>
import * as echart from 'echarts'

export default {
    props: {      
        purchaseGasVolumnList: {
            type: Array,
            default: () => []
        },
        year: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            echart: null,
            dataSource: [],
            series: []
        }
    },
    watch: {
        // 监听父组件传递过来的year
        year() {
            this.initialData()
        },
        // 监听父组件传递过来的数据（图表数据源）
        purchaseGasVolumnList() {
            this.initialData()
        }
    },
    created() {
        this.initialData()
    },
    methods: {
        initialEchart() {
            this.echart = echart.init(this.$refs.chartPurchaseGasVolume)
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
                dataset: {
                    source: this.dataSource
                },
                title: {
                    // text: '逐月供应商采购气量(单位:万方)',
                    text:  [
                        '{a|逐月供应商采购气量} ',
                        '{x|(单位:万方)}'
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
                    axisPointer: {
                    type: 'shadow'
                    }
                },
                legend: {
                    top: '33px',
                    padding: [0, 0, 0, 0],
                    itemGap: 20
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
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
                            rotate: -45,
                            fontSize: 10
                        }
                    }
                ],
                yAxis: [
                    {
                    type: 'value',
                    // max: 1000
                    }
                ],
                series: this.series
            };
            return options
        },
        // 构造图表用数据（dataset）
        initialData() {
            const purchaseGasVolumnListArr = this.purchaseGasVolumnList
            const series = []
            const arr = []  // 图表主体数据
            const titleArr = ['date']   // 图例数组
            let year = this.year   // 日期选择器年份
            // 初始化各堆叠柱子，初始值为X轴category
            let itemArr1 = [year + '/01'], 
                itemArr2 = [year + '/02'], 
                itemArr3 = [year + '/03'], 
                itemArr4 = [year + '/04'], 
                itemArr5 = [year + '/05'],
                itemArr6 = [year + '/06'], 
                itemArr7 = [year + '/07'], 
                itemArr8 = [year + '/08'], 
                itemArr9 = [year + '/09'], 
                itemArr10 = [year + '/10'], 
                itemArr11 = [year + '/11'], 
                itemArr12 = [year + '/12']
            // 构造数据（相同月份数据放在一起，构成一根堆叠柱子）
            for(let i=0; i<purchaseGasVolumnListArr.length; i++) {
                series.push({ type: 'bar', stack: 'supplier' })    // 构造series
                titleArr.push(purchaseGasVolumnListArr[i]['supplier_name']) // 构造图例
                itemArr4.push(purchaseGasVolumnListArr[i]['4'])
                itemArr5.push(purchaseGasVolumnListArr[i]['5'])
                itemArr6.push(purchaseGasVolumnListArr[i]['6'])
                itemArr7.push(purchaseGasVolumnListArr[i]['7'])
                itemArr8.push(purchaseGasVolumnListArr[i]['8'])
                itemArr9.push(purchaseGasVolumnListArr[i]['9'])
                itemArr10.push(purchaseGasVolumnListArr[i]['10'])
                itemArr11.push(purchaseGasVolumnListArr[i]['11'])
                itemArr12.push(purchaseGasVolumnListArr[i]['12'])
                itemArr1.push(purchaseGasVolumnListArr[i]['1'])
                itemArr2.push(purchaseGasVolumnListArr[i]['2'])
                itemArr3.push(purchaseGasVolumnListArr[i]['3'])
            }
            //  构造dateset参数用数据结构
            arr.push(itemArr4, itemArr5, itemArr6, itemArr7, itemArr8, itemArr9, itemArr10, itemArr11, itemArr12, itemArr1, itemArr2, itemArr3)
            arr.unshift(titleArr)
            this.dataSource = arr
            this.series = series
            this.$nextTick(() => {
                this.initialEchart()
            })            
        }
    }
}
</script>

<style lang="scss" scoped>
</style>