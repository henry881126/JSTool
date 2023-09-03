export const shfitListOption = (dataNum=[], dataX=[], barWidth) => ({
    grid: {
        x: 60,
        x2: 40,
        y: 20,
        y2: 40,
        bottom:'25%'
    },
    tooltip: {//提示框组件
        trigger: 'axis',	//tooltip触发条件 坐标轴
        axisPointer: { //去掉移动的指示线
            type: 'shadow'
        },
        // backgroundColor: '#E99A50',	//tooltip背景色
        // padding: [2, 10], //提示框大小
        // borderColor: '#E99A50',
        // borderWidth: '1',
        // textStyle: {
        //     color: '#FFFFFFFF',
        // },
        // formatter: function (value) { //提示框内容
        //     let val = value[0].axisValueLabel + ':' + value[0].value;
        //     return val;
        // }

    },
    xAxis: [{
        type: 'category',
        axisLabel: {
            interval:0, //坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
            rotate:40 ,
            textStyle: {
                color: '#757575',
            },
            // formatter:function(value)  
            // {
            //     return `${value}` ;  
            // },
            formatter : function(params){
                var newParamsName = "";// 最终拼接成的字符串
                var paramsNameNumber = params.length;// 实际标签的个数
                var rowNumber = Math.ceil(paramsNameNumber / 6);// 换行的话，需要显示几行，向上取整
                /**
                 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                 */
                // 条件等同于rowNumber>1
                if (paramsNameNumber > 6) {
                    /** 循环每一行,p表示行 */
                    for (var p = 0; p < rowNumber; p++) {
                        var tempStr = "";// 表示每一次截取的字符串
                        var start = p * 6;// 开始截取的位置
                        var end = start + 6;// 结束截取的位置
                        // 此处特殊处理最后一行的索引值
                        if (p == rowNumber - 1) {
                            // 最后一次不换行
                            tempStr = params.substring(start, paramsNameNumber);
                        } else {
                            // 每一次拼接字符串并换行
                            tempStr = params.substring(start, end) + "\n";
                        }
                        newParamsName += tempStr;// 最终拼成的字符串
                    }

                } else {
                    // 将旧标签的值赋给新标签
                    newParamsName = params;
                }
                //将最终的字符串返回
                return newParamsName
             }
        },
        splitLine: {
            show: false
        },

        axisLine: {
            show: false,
        },
        axisTick: {
            alignWithLabel: true,
            show: false,
        },
        data: dataX,

    }],
    yAxis: {
            type: 'value',
        splitLine: {
            show: true,
            lineStyle: {
                color: ['#EAEBF0']
            }
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: true,
        }
    },
    dataZoom: {
        show: true,
        realtime: true,
        start: 0,
        end: 50,
        filterMode: 'empty',//增加这句属性设值
      },
    series: [
        {
            type: 'bar',
            name: '统计数据',
            barWidth: barWidth,//柱图宽度
            barGap: '100%',/*多个并排柱子设置柱子之间的间距*/
            itemStyle: {
                normal: {
                    barBorderRadius: 20,
                    color: '#3F82E1',
                },
            },
            emphasis: {
                itemStyle: {
                    // color: '#EA9F54'
                }
            },
            label: {
                show: true, 
                position: 'top',
            },
            data: dataNum
        }
    ]
});