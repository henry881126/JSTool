export default {
    methods:{
        commonBasicBarChartConfig([chartTitle,chartAxisTag,chartData]) {
            let option = {
                title: {
                    text:chartTitle,
                    textStyle: {
                        fontSize:16,
                        fontWeight:'normal',
                        color:'#333'
                    },
                    left:35
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
                    bottom:'bottom',
                    right:'115',
                    icon:'circle'
                },
                yAxis: [
                    {
                        type: 'value',
                        min: 0,
                        // max: 1000,
                        // interval: 100,
                    }
                ],                
                xAxis: [
                    {
                        type: 'category',
                        data: chartAxisTag,
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                grid: {
                    top:60,
                    // 根据图表是否有数据，确定图表距离左侧的距离
                    // left:params.data.length > 0 ? 250 : 50
                    left:80,
                    bottom:40
                },
                series: [
                    {
                        // name: 'xxxx',
                        type: 'bar',
                        data: chartData,
                        barCategoryGap:'70%',
                        label: {
                            show:true,
                            position:'top',
                            formatter:`{c}`
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