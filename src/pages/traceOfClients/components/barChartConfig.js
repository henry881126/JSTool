export default {
    methods:{
        barChartConfig(params) {
            let option = {
                title: {
                    text:params.title,
                    subtext:`{s1|${params.subTitle}}`,
                    textStyle: {
                        fontSize:16,
                        fontWeight:'normal',
                        color:'#333'
                    },
                    subtextStyle: {
                        rich: {
                            s1: {
                                color:'#333',
                                fontSize:16
                            }
                        }
                    }
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
                // toolbox: {
                //     // 辅助功能：导出图片、数据视图、动态类型切换、重置
                //     feature: {
                //         dataView: {show: true, readOnly: false},
                //         magicType: {show: true, type: ['line', 'bar']},
                //         restore: {show: true},
                //         saveAsImage: {show: true}
                //     },
                //     right:'115'
                // },
                legend: {
                    data: ['2020年', '2021年', '同比增长','环比增长'],
                    bottom:'bottom',
                    right:'115',
                    icon:'circle',
                    textStyle: {
                        color:'#909090',
                        fontSize:16
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['餐饮', '采暖', '洗浴', '工业', '福利', '能源'],
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            color:'#999',
                            fontSize:16,
                            margin:15
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        // min: 0,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        // min: 0,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },                    
                ],
                series: [
                    {
                        name: '2020年',
                        type: 'bar',
                        data: params.data[0],
                        // yAxisIndex:0,
                        label:'aaaa'
                    },
                    {
                        name: '2021年',
                        type: 'bar',
                        data: params.data[1],
                        // yAxisIndex:0,
                        barCategoryGap:'70%'            // 在最后一个柱子中设置barGap、barCategoryGap
                    },
                    {
                        name: '同比增长',
                        type: 'line',
                        yAxisIndex:1,
                        smooth:true,
                        data: params.data[2]
                    },
                    {
                        name: '环比增长',
                        type: 'line',
                        yAxisIndex:1,
                        smooth:true,
                        data: params.data[3]
                    }                    
                ]
            };
            return option
        }
    }
}