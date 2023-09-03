export const gasChartOption = (dataX = [], dataY1 = [], dataY2 = [], dataY3 = [], dataY4 = [], baseSize) => ({
    title: {
    },
    tooltip: {
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        trigger: "axis",
        backgroundColor: "rgba(0, 0, 0, 0.5)", //设置背景图片 rgba格式
        borderWidth: "0", //边框宽度设置1
        formatter: function (params, ticket, callback) {
            var res = '<span style="color:white;">' + params[0].name  + '</span>';
            for (var i = 0, l = params.length; i < l; i++) {
                if (i < 3) {
                    res += '<br/><span style="color:white;">' +params[i].marker+ params[i].seriesName + ' : ' + params[i].value + '</span>';
                } else {
                    res += '<br/><span style="color:white;">'  +params[i].marker+ params[i].seriesName + ' : ' + params[i].value + '%'+'</span>';

                }

            }
            callback(ticket, res);
            // setTimeout(function () {
            //     // 仅为了模拟异步回调
            //     callback(ticket, res);
            // })
        }

    },
    legend: [{
        right: '2%',
        // icon: "diamond",
        itemHeight: 6,
        data: ['批复量', '实际提气量', '偏差量', '偏差考核'],
        textStyle: {
            fontSize: baseSize,//字体大小
            color: '#ffffff'//字体颜色
        },
    },
        // {
        //     right: '0%',
        //     icon:  "roundRect" ,
        //     data: [ '偏差考核'],
        //     itemWidth: 20,  // 设置宽度
        //     itemHeight: 9, // 设置高度
        //     textStyle:{
        //         fontSize: 18,//字体大小
        //         color: '#ffffff'//字体颜色
        //    },
        // }
    ],
    grid: {
        left: 0,
        top: '22%',
        right: 0,
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: dataX,
            // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月'],
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#C2CAE7',
                    fontSize: baseSize
                }
            },
            // boundaryGap: false,
            splitLine: { show: false },//去除网格线
        },

    ],
    yAxis: [
        {
            name: '单位：万方',
            type: 'value',
            nameTextStyle: {
                color: '#C2CAE7', //x轴名称的 颜色
                fontSize:16,
                padding: [0, 0, 0, 20]    // 四个数字分别为上右下左与原位置距离
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#C2CAE7',
                    fontSize: 14
                }
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ['#3D61A2'],
                    width: 1,
                    type: 'solid'
                }
            },
        },
        {
            name: '单位：%',
            type: 'value',
            nameTextStyle: {
                color: '#C2CAE7', //x轴名称的 颜色
                fontSize:16,
                padding: [0, 20, 0, 0]    // 四个数字分别为上右下左与原位置距离
            },
            // scale:true,
            axisLabel: {
                show: true,
                interval: 'auto',
                // formatter: '{value} %',
                textStyle: {
                    color: '#C2CAE7',
                    fontSize: 14
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#3D61A2',
                    width: 1,
                    type: 'solid'
                }
            },
        }
    ],
    series: [
        {
            name: '批复量',
            type: 'bar',
            barWidth: baseSize,//柱图宽度
            data: dataY1,
            // data: [1258.00, 1258.00, 1573.00, 1258.00,1258.00, 1258.00, 12.00, 125.00,125.00,125.00,125.00,125.00,],
            itemStyle: {
                normal: {
                    color: '#52E4FE',
                    barBorderRadius: 20,
                    label: {
                        show: false,
                        rotate: 30,
                        position: 'top',
                        color: "#ffffff", //  颜色 
                    }
                },
            },
        },
        {
            name: '实际提气量',
            type: 'bar',
            barWidth: baseSize,//柱图宽度
            data: dataY2,
            // data: [8470.00, 570.00, 6511.20, 8450.00,8640.00, 570.00, 570.00,630.00,200.00,6670.00,8900.00,1242.00],
            itemStyle: {
                normal: {
                    color: '#26FFB4',
                    barBorderRadius: 20,
                    label: {
                        show: false,
                        rotate: 30,
                        position: 'top',
                        color: "#ffffff", //  颜色 
                    }
                },
            },
        },
        {
            name: '偏差量',
            type: 'bar',
            barWidth: baseSize,//柱图宽度
            data: dataY3,
            // data: [3000.00, -2900.00, 800.05, -0.30,200.34, 80.37, 200.34,500.30,2400.39,710.34,6000.31,2000.32],
            itemStyle: {
                normal: {
                    color: '#008BFF',
                    barBorderRadius: 20,
                    label: {
                        show: false,
                        rotate: 30,
                        position: 'top',
                        color: "#ffffff", //  颜色 
                    }
                },
            },
        },
        {
            name: '偏差考核',
            data: dataY4,
            // data: [33, 3, 3, 12,13, 3, 3,3,83,3,3,3],
            type: 'line',
            // symbol: "none",
            yAxisIndex: 1,
            // markLine : {   //添加警戒线
            //     symbol:"none",               //去掉警戒线最后面的箭头
            //     name:"警戒线",
            //     silent:true,
            //     label:{
            //         position:"end",         //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
            //         formatter: "",
            //         color:"red",
            //         fontSize:14
            //     },
            //     data : [{
            //         silent:true,             //鼠标悬停事件  true没有，false有
            //         lineStyle:{               //警戒线的样式  ，虚实  颜色
            //             type:"dotted",
            //             color:"red",
            //             width:2.5
            //         },
            //         name: '90%',
            //         yAxis: 90
            //     },
            //     {
            //         silent:true,             //鼠标悬停事件  true没有，false有
            //         lineStyle:{               //警戒线的样式  ，虚实  颜色
            //             type:"dotted",
            //             color:"red",
            //             width:2.5
            //         },
            //         name: '8%',
            //         yAxis: 8
            //     }
            // ]
            // },
            itemStyle: {
                normal: {
                    color: '#FFAE75',
                    lineStyle: {
                        width: 4.5
                    },
                    label: {
                        show: false,
                        rotate: 30,
                        position: 'top',
                        color: "#ffffff", //  颜色 
                        formatter: '{c}%'
                    }
                }
            },
        }
    ]
});
export const gasRatioChartOption = (dataX = [], dataY1 = [], dataY2 = [], dataY3 = [], baseSize) => ({
    title: {
    },
    tooltip: {
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        trigger: "axis",
        backgroundColor: "rgba(0, 0, 0, 0.5)", //设置背景图片 rgba格式
        borderWidth: "0", //边框宽度设置1
        formatter: function (params, ticket, callback) {
            var res = '<span style="color:white;">' + params[0].name  + '</span>';
            for (var i = 0, l = params.length; i < l; i++) {
                if (i < 2) {
                    res += '<br/><span style="color:white;">' +params[i].marker+ params[i].seriesName + ' : ' + params[i].value + '</span>';
                } else {
                    res += '<br/><span style="color:white;">'  +params[i].marker+ params[i].seriesName + ' : ' + params[i].value + '%'+'</span>';

                }

            }
            callback(ticket, res);
            // setTimeout(function () {
            //     // 仅为了模拟异步回调
            //     callback(ticket, res);
            // })
        }
    },
    legend: {
        right: '3%',
        itemHeight: 6,
        // icon: "circle",
        data: ['上期提气量', '本期提气量', '同比增长率'],
        textStyle: {
            fontSize: baseSize,//字体大小
            color: '#ffffff'//字体颜色
        },
    },
    grid: {
        left: 0,
        top: '22%',
        right: 0,
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: dataX,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#C2CAE7',
                    fontSize: baseSize
                }
            },
            splitLine: { show: false },//去除网格线
        },

    ],
    yAxis: [
        {
            name: '单位：万方',
            type: 'value',
            nameTextStyle: {
                color: '#C2CAE7', //x轴名称的 颜色
                padding: [0, 0, 0, 16]    // 四个数字分别为上右下左与原位置距离
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#C2CAE7',
                    fontSize: baseSize
                }
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ['#3D61A2'],
                    width: 1,
                    type: 'solid'
                }
            },
        },
        {
            name: '单位：%',
            type: 'value',
            nameTextStyle: {
                color: '#C2CAE7', //x轴名称的 颜色
                padding: [0, 16, 0, 0]    // 四个数字分别为上右下左与原位置距离
            },
            axisLabel: {
                show: true,
                interval: 'auto',
                // formatter: '{value} %',
                textStyle: {
                    color: '#C2CAE7',
                    fontSize: baseSize
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#3D61A2',
                    width: 1,
                    type: 'solid'
                }
            },
        }
    ],
    series: [
        {
            name: '上期提气量',
            type: 'bar',
            barWidth: baseSize,//柱图宽度
            data: dataY1,
            itemStyle: {
                normal: {
                    color: '#52E4FE',
                    barBorderRadius: 20,
                    label: {
                        show: false,
                        rotate: 30,
                        position: 'top',
                        color: "#ffffff", //  颜色 
                    }
                },
            },
        },
        {
            name: '本期提气量',
            type: 'bar',
            barWidth: baseSize,//柱图宽度
            data: dataY2,
            itemStyle: {
                normal: {
                    color: '#008BFF',
                    barBorderRadius: 20,
                    label: {
                        show: false,
                        rotate: 30,
                        position: 'top',
                        color: "#ffffff", //  颜色 
                    }
                },
            },
        },
        {
            name: '同比增长率',
            data: dataY3,
            type: 'line',
            // symbol: "none",
            yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#FFAE75',
                    lineStyle: {
                        width: 4.5
                    },
                    label: {
                        show: false,
                        rotate: 30,
                        position: 'top',
                        color: "#ffffff", //  颜色 
                        formatter: '{c}%'
                    }
                }
            },
        }
    ]
});