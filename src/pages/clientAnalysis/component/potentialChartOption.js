export const chartOption = (data1=[], data2=[], baseSize) => ({
    title: {
        text: ''
    },
    tooltip: {},
    legend: {
        right: '2%',
        icon: "circle",
        data: ['本企业', '行业TOP5'],
        textStyle: {
            fontSize: baseSize,
        },
    },
    radar: {
        name: {
            textStyle: {
                fontSize: baseSize,
            }
        },
        indicator: [
            { name: '年收入', max: 5},
            { name: '可持续性', max: 5},
            { name: '用气稳定性', max: 5},
            { name: '现金流', max: 5},
            { name: '年利润', max: 5},
        ]
    },
    series: [{
        name: '',
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [
            {
                // value: [4300, 10000, 28000, 35000, 50000, 19000],
                value:data1,
                name: '本企业',
                areaStyle: {
                    opacity: 0.95,
                    color: 'rgba(24, 206, 0, 1)',
                },
                // label: {
                //     show: true // 显示数值
                // },
                itemStyle: {
                    normal: {
                        color: 'rgba(24, 206, 0, 1)',
                    },
                },
            },
            {
                // value: [5000, 14000, 28000, 31000, 42000, 21000],
                value: data2,
                name: '行业TOP5',
                areaStyle: {
                    opacity: 0.9,
                    color: 'RGBA(127, 196, 255, 1)',
                },
                // label: {
                //     show: true // 显示数值
                // },
                itemStyle: {
                    normal: {
                        color: 'RGBA(127, 196, 255, 1)',
                    },
                },
            }
        ]
    }]
});