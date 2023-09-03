<template>
  <div class="user-info-wrapper">
      <!-- 一 基础信息 -->
    <div class="consum-energy-info-wrapper">
        <div class="title">用能信息</div>
        <div class="year-gas-volume">年用气量（万方）：<span style="font-weight:normal">{{ data.total_energy }}</span></div>
        <div class="user-name">{{ data.name }}</div>
        <div class="last-month-info">
            <div class="day-gas-volumn">上月日均用气量：<span style="font-weight:normal">{{data.average_capacity}}</span></div>
            <div class="gas-averate-price">上月用气均价（元方）：<span style="font-weight:normal">{{data.tariftyp_text}}</span></div>
            <div class="start-date">开始使用日期：<span style="font-weight:normal">{{data.bezugsdat}}</span></div>
        </div>
    </div>
    <el-divider></el-divider>
    <!-- 二 图表 -->
    <div class="chart-wrapper">
        <div class='chart' id="lineChart"></div>
    </div>
    <el-divider></el-divider>
    <!-- 三 表格 -->
    <div class="consum-energy-table-wrapper">
        <div class="btn-wrapper">
            <el-button round :type="tableToggle ? 'primary' : ''" @click='tableToggle = true'>用能设备表</el-button>
            <el-button round :type="!tableToggle ? 'primary' : ''" @click='tableToggle = false'>计量设备列表</el-button>
        </div>
        <!-- 用能设备表 -->
        <div class='energy-equipment-table-wrapper' v-if='tableToggle'>
            <el-table :data="data.equipInfoVOList" border="" align='center' :fit='true'>
                <el-table-column label='NO.' align='center'>
                    <template slot-scope='{$index}'>{{$index+1}}</template>
                </el-table-column>
                <el-table-column label='设备名称' prop='eq_name' align='center'></el-table-column>
                <el-table-column label='型号' prop='model' align='center'></el-table-column>
                <el-table-column label='数量（台）' prop='eq_num' align='center'></el-table-column>
            </el-table>
        </div>
        <!-- 计量设备列表 -->
        <div class="metering-equipment-table-wrapper" v-if='!tableToggle'>
            <el-table :data="data.flowMeterList" border="">
                <el-table-column label='NO.' align='center'>
                    <template slot-scope='{$index}'>{{$index+1}}</template>
                </el-table-column>
                <el-table-column label='IC卡控制器名称' prop='bauklas' align='center'></el-table-column>
                <el-table-column label='位置' prop='model' align='center'></el-table-column>
                <el-table-column label='表钢号' prop='pltxt' align='center'></el-table-column>
                <el-table-column label='型号' prop='typbz' align='center'></el-table-column>
                <el-table-column label='表计来源' prop='types' align='center'></el-table-column>
                <el-table-column label='计量品牌' prop='ybrand' align='center'></el-table-column>
                <el-table-column label='上次校验时间' prop='ylfdat' align='center'></el-table-column>
            </el-table>
        </div>        
    </div>
  </div>
</template>

<script>
export default {
    name:'businessUserInfo',
    data() {
        return {
            tableToggle:true
        }
    },
    props: {
        data:Object
    },
    methods: {
        drawLine(chartData,yearArr) {
            let chart = this.$echarts.init(document.getElementById('lineChart'))
            // 生成dataset dimensions数据
            let newYearArr = yearArr.map(item => {
                return item += '年用量'
            })
            let dimensionsArr = ['month'].concat(newYearArr)           // 格式：['month',2020,2021]
            // console.log('dimensionArr',dimensionsArr)
            
            // 生成配合dataSet使用的series
            let barSeries = []
            for(let i=0;i<chartData.length-1;i++) {
                barSeries.push({type:'line',seriesLayoutBy:'row',smooth:true})
            }
            // console.log('series data',barSeries)

            let option = {
                title: {
                    text:'用气量趋势图',
                    textStyle: {
                        fontSize:16,
                        fontWeight:'bold'
                    }
                },
                legend: {},
                tooltip: {
                },

                dataset: {
                    // dimensions:['month',2020,2021],
                    dimensions:dimensionsArr,
                    source:chartData,
                    sourceHeader:false          // 第一行开始直接是数据，取消第一行默认是维度名
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        margin:20
                    },
                    axisPointer: {
                        show:true,
                        type:'line',
                        lineStyle: {
                            type:'solid'
                        }
                    },
                    axisTick: {
                        show:true,
                    },
                    minorTick: {
                        show:true,
                        splitNumber:5
                    },
                    boundaryGap:false,      // 坐标轴两边不留白，标签和数据点靠两边
                },
                yAxis: {
                    type:'value',
                    show:true,
                    name:'立方米',
                    nameTextStyle: {
                        padding:[0,45,0,0],
                        color:'#999'
                    }
                },
                grid: {
                    left:50,
                    right:50,
                    top:80,
                    bottom:40
                },
                series:barSeries
            }
            chart.setOption(option)
            window.onresize = chart.resize
        }
    },
    mounted() {
        // 模拟数据
        // let data = [
        //     {
        //         consumption:1,
        //         month:'01',
        //         year:'2020'
        //     },
        //     {
        //         consumption:2,
        //         month:'02',
        //         year:'2020'
        //     },
        //     {
        //         consumption:3,
        //         month:'03',
        //         year:'2020'
        //     },
        //     {
        //         consumption:14,
        //         month:'04',
        //         year:'2020'
        //     },   
        //     {
        //         consumption:5,
        //         month:'05',
        //         year:'2020'
        //     },
        //     {
        //         consumption:16,
        //         month:'06',
        //         year:'2020'
        //     },
        //     {
        //         consumption:7,
        //         month:'07',
        //         year:'2020'
        //     },
        //     {
        //         consumption:8,
        //         month:'08',
        //         year:'2020'
        //     },   
        //     {
        //         consumption:39,
        //         month:'09',
        //         year:'2020'
        //     },
        //     {
        //         consumption:10,
        //         month:'10',
        //         year:'2020'
        //     },
        //     {
        //         consumption:11,
        //         month:'11',
        //         year:'2020'
        //     },
        //     {
        //         consumption:42,
        //         month:'12',
        //         year:'2020'
        //     },   
        //     {
        //         consumption:10,
        //         month:'01',
        //         year:'2021'
        //     },
        //     {
        //         consumption:20,
        //         month:'02',
        //         year:'2021'
        //     },
        //     {
        //         consumption:30,
        //         month:'03',
        //         year:'2021'
        //     },
        //     {
        //         consumption:40,
        //         month:'04',
        //         year:'2021'
        //     },   
        //     {
        //         consumption:21,
        //         month:'05',
        //         year:'2021'
        //     },
        //     {
        //         consumption:60,
        //         month:'06',
        //         year:'2021'
        //     },
        //     {
        //         consumption:7,
        //         month:'07',
        //         year:'2021'
        //     },
        //     {
        //         consumption:80,
        //         month:'08',
        //         year:'2021'
        //     },   
        //     {
        //         consumption:90,
        //         month:'09',
        //         year:'2021'
        //     },
        //     {
        //         consumption:10,
        //         month:'10',
        //         year:'2021'
        //     },
        //     {
        //         consumption:110,
        //         month:'11',
        //         year:'2021'
        //     },
        //     {
        //         consumption:12,
        //         month:'12',
        //         year:'2021'
        //     }                                                                                             
        // ]
        let data = this.data['gasConsumptionTrendList']       // 服务器返回数据
        let yearArr=[];     // 存储年份
        data = Object.values(data.reduce((res, item) => {
            res[item.year] ? res[item.year].push(item['consumption']) : res[item.year] = [item['consumption']];
            yearArr.push(item.year)
            return res;
        }, {}));
        // 年份去重
        let yearArrUnique = Array.from(new Set(yearArr))
        // console.log('year unique',yearArrUnique)
        // dataset source数据源
        let result = []
        result.push(...data)
        result.unshift(['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'])
        // console.log('result  11111111111111',result)
        // 绘图
        this.drawLine(result,yearArrUnique)
    }
}
</script>

<style lang='scss' rel='stylesheet/scss' scope>
.user-info-wrapper {
    padding:32px;
    font-weight: bold;
    .consum-energy-info-wrapper {
        line-height: 2.5;
        .title {
            font-size: 16px;
            font-weight: bold;
        }
        .year-gas-volume {}
        .last-month-info {
            display: flex;
            .day-gas-volumn {
                margin-right: 40px;

            }
            .gas-averate-price {
                margin-right: 40px;

            }
            .start-date {
                margin-right: 40px;

            }
        }
    }
    .chart-wrapper {
        margin:30px 0;
        z-index: 9999;
        .chart {
            width:100%;
            height:500px;
            z-index: 9999;
        }   
    }
    .consum-energy-table-wrapper {
        .btn-wrapper {
            margin-bottom: 30px;
        }
        .energy-equipment-table-wrapper {}
        .metering-equipment-table-wrapper {}
    }
}
</style>