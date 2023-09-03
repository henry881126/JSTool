export default {
    methods:{
        pieChartConfig(params) {
            let option = {
                title: {
                    text: params.title,
                    subtext:params.subTitle,
                    left: 'left',
                    textStyle: {
                        fontSize:16,
                        fontWeight:'normal',
                        color:'#333',
                        fontFamily:'PingFang SC'
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    show:params.legendIsShow,
                    orient: 'horizontal',
                    top: 'bottom',
                    left:'left',
                    icon:'circle',
                    itemHeight:7,
                    textStyle: {
                        color:'#909090',
                        fontSize:16
                    }
                },
                grid: {
                    left:'10%'
                },
                color:params.color,
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center:['45%','50%'],
                        data:params.data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            formatter(params) {
                                return `${params.name}\n${params.value}%`
                            },
                            color:'#8C8C8C',
                            fontSize:16,
                            // 解决标签显示不全问题
                            // interval:0,
                            // rotate:1
                        }
                    }
                ]
            };
            return option
        }
    }
}