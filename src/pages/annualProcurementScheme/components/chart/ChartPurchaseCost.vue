<template>
    <div class="chart-purchase-cost" ref="chartPurchaseCost"></div>
</template>

<script>
import * as echart from 'echarts'

export default {
    props: {
        purchaseCostList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            echart: null,
            sourceData: []
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
            this.echart = echart.init(this.$refs.chartPurchaseCost)
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
                        '{a|供应商采购成本} ',
                        '{x|(单位:万元)}'
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
                    trigger: 'item'
                },
                legend: {
                    top: '33px',
                    padding: 0,
                    itemGap: 20
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        label: {
                            position: 'inside',
                            // formatter: "{b} \n {c}"
                            formatter: (params) => {
                                if(params.name !== '合计') {
                                    return `${params.name} \n ${params.value}`
                                }
                            },
                            lineHeight: 18
                        },
                        itemStyle: {
                            borderRadius: 5,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontWeight: 'bold'
                            }
                        },
                        radius: ['50%', '97%'],
                        top: '22%',
                        data: this.sourceData
                    }
                ]
            };
            return options
        },
        // 构造表格数据
        getInitialData() {
            let purchaseCostList = this.purchaseCostList
            let dataArr = []
            for(let i=0; i<purchaseCostList.length-1; i++) {
                const name = purchaseCostList[i].supplier_shorter_name ? purchaseCostList[i].supplier_shorter_name : purchaseCostList[i].supplier_name
                dataArr.push({
                    value: purchaseCostList[i]['cost_price'],
                    name: name
                })
            }
            this.sourceData = dataArr
        }        
    }
}
</script>

<style lang="scss" scoped>
</style>