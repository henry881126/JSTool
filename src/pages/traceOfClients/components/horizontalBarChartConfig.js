export default {
    methods:{
        horizontalBarChartConfig(params) {
            // console.log('params chart innner',params)
            let option = {
                // 自定义文本，此文本移到父组件中，需要添加事件，展示另一个图表
                // graphic: {
                //     type:'text',
                //     style: {
                //         // text:['近','5','年趋势'].join('\n')
                //         text:'近5年趋势',
                //         fill:'#333',
                //         fontSize:16,
                //         fontWeight:'bold'
                //     },
                //     top:6,
                //     right:120
                // },
                title: {
                    text:params.title,
                    // subtext:'{s1|近5年趋势}',
                    textStyle: {
                        fontSize:16,
                        fontWeight:'normal',
                        color:'#333'
                    },
                    // subtextStyle: {
                    //     align:'right',
                    //     rich:{
                    //         s1:{
                    //             color:'#333',
                    //             fontSize:'16',
                    //             fontWeight:'bold'
                    //             // padding:[-30,0,10,1000],
                    //         }
                    //     }
                    // }
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
                legend: {
                    // data: ['2020年', '2021年', '同比增长','环比增长'],
                    bottom:'bottom',
                    right:'115',
                    icon:'circle'
                },
                xAxis: [
                    {
                        type: 'value',
                        // name: 'xx',
                        min: 0,
                        // max: 10000,
                        interval: 1000,
                    }
                ],                
                yAxis: [
                    {
                        type: 'category',
                        data: params.axisTag,
                        axisPointer: {
                            type: 'shadow'
                        },
                    }
                ],
                grid: {
                    top:120,
                    bottom:30,
                    // 根据图表是否有数据，确定图表距离左侧的距离
                    left:params.data.length > 0 ? 250 : 50
                },
                series: [
                    {
                        // name: 'xxxx',
                        type: 'bar',
                        data: params.data,
                        barCategoryGap:'70%',
                        label: {
                            show:true,
                            position:'right',
                            // parmas.percentIsShow参数是逻辑值，true时，标签后加%，false时，标签后不加%
                            formatter:`{c} ${params.percentIsShow ? '%' : ''}`
                        },
                        itemStyle: {
                            color:'#6699FF',            // 柱子颜色
                            borderRadius:3
                        }
                    }                   
                ]
            };
            return option
        }
    }
}