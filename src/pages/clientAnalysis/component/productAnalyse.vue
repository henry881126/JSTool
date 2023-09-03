<template>
    <el-row :gutter="0" class="container-wrap">
        <el-row :gutter="0">
            <el-col :span="24" :lg="24" :xl="24" :offset="0">
                <div ref="echart" class="echart"></div>
            </el-col>
        </el-row>
        <el-row :gutter="0" class="conclusion-wrap">
            <el-col
                :span="24"
                :lg="24"
                :xl="24"
                :offset="0"
                class="conclusion-title"
                >负荷曲线分析结论</el-col
            >
            <el-col
                :span="24"
                :lg="24"
                :xl="24"
                :offset="0"
                class="conclusion"
                v-html="conclusion"
            ></el-col>
        </el-row>
    </el-row>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'productAnalyse',
    components: {},
    props: {},
    data() {
        return {
            screenWidth: 1920,
            isLand: '1', //默认域内为1
            echart: null,
            conclusion: '',
            gapVal: '1.6', //冬夏峰谷差
            routeQueryObj: {} //获取路由参数
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.screenWidth = window.screen.width;
        this.routeQueryObj = this.$route.query;
        this.isLand = this.routeQueryObj.distinct || '1';
        this.initEchart();
        window.addEventListener('resize', this.handleResizeEchart);
    },
    methods: {
        initEchart() {
            this.echart = echarts.init(this.$refs.echart);
            this.getEchartData();
        },
        async getEchartData() {
            //调接口获取数据
            let params = {
                compCode: this.routeQueryObj.compCode,
                distinct: this.routeQueryObj.distinct || '1',
                partner: this.routeQueryObj.partner
            };
            let res = await this.$api.getProductionRuleList(params);
            if (res.resultCode === 0) {
                let { xData, seriesData1, seriesData2 } = this.handleResData(
                    res.data
                );
                this.createEchart({ xData, seriesData1, seriesData2 });
            } else {
                let xData = ['后台错误'];
                let seriesData1 = [];
                let seriesData2 = [];
                this.createEchart({ xData, seriesData1, seriesData2 });
                this.$message.error(res.resultMessage);
            }
        },
        //解析接口中的数据，返回形成图表所需要的数据
        handleResData(res) {
            console.log('res', res);
            this.conclusion = res.conclusion;
            let xData = [],
                seriesData1 = [],
                seriesData2 = [];
            if (res.diagramVoList && res.diagramVoList.length !== 0) {
                res.diagramVoList.forEach(el => {
                    xData.push(el.dates);
                    seriesData1.push(el.befDGasCons);
                    seriesData2.push(el.avgBefBrsch2);
                });
            }

            this.gapVal = res.valleyToPeak;
            return { xData, seriesData1, seriesData2 };
        },
        createEchart({ xData, seriesData1, seriesData2 }) {
            let option = {};
            if (
                xData.length === 0 ||
                seriesData1.length === 0 ||
                seriesData2.length === 0
            ) {
                option = {
                    title: {
                        text: '暂无数据',
                        x: 'center',
                        y: 'center',
                        textStyle: {
                            color: 'black',
                            fontWeight: 'normal',
                            fontSize: this.screenWidth >= 1920 ? 16 : 12
                        }
                    }
                };
            } else {
                if (this.isLand === '1') {
                    option = {
                        title: {
                            text: '负荷曲线',
                            textStyle: {
                                color: '#3F5896',
                                fontSize: this.screenWidth >= 1920 ? 20 : 16,
                                fontWeight: 500
                            },
                            subtext:
                                this.gapVal === null || ''
                                    ? '冬夏峰谷差 -'
                                    : '冬夏峰谷差 ' + this.gapVal, //冬夏峰谷差
                            subtextStyle: {
                                color: '#333333',
                                fontSize: this.screenWidth >= 1920 ? 14 : 12,
                                fontWeight: 600
                            }
                        },
                        grid: {
                            top: '120px',
                            left: '5%',
                            right: '4%',
                            bottom: '9%'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                animation: false,
                                label: {
                                    backgroundColor: '#505765'
                                }
                            }
                        },
                        legend: {
                            data: ['联鑫板材', '行业均值'],
                            top: '50px',
                            right: '4%'
                        },
                        dataZoom: [
                            {
                                show: true,
                                realtime: true,
                                start: 40,
                                end: 70
                            }
                        ],
                        xAxis: [
                            {
                                data: xData.map(function(str) {
                                    return str.split(' ', 1);
                                })
                            }
                        ],
                        yAxis: [
                            {
                                name: '单位：方',
                                type: 'value',
                                nameTextStyle: {
                                    fontSize:
                                        this.screenWidth >= 1920 ? 16 : 12,
                                    fontWeight: 400,
                                    color: '#8A8A8A'
                                }
                            }
                        ],
                        color: ['#008AFF', '#5EDD4D'],
                        series: [
                            {
                                name: '联鑫板材',
                                type: 'line',
                                lineStyle: {
                                    width: 1
                                },
                                data: seriesData1
                            },
                            {
                                name: '行业均值',
                                type: 'line',
                                lineStyle: {
                                    width: 1
                                },
                                data: seriesData2
                            }
                        ]
                    };
                } else if (this.isLand === '0') {
                    //域外
                    option = {
                        title: {
                            text: '负荷曲线',
                            textStyle: {
                                color: '#3F5896',
                                fontSize: this.screenWidth >= 1920 ? 20 : 16,
                                fontWeight: 500
                            },
                            subtext:
                                this.gapVal === null || ''
                                    ? '冬夏峰谷差 -'
                                    : '冬夏峰谷差 ' + this.gapVal, //冬夏峰谷差（域外的保留此功能，但暂时隐藏）
                            subtextStyle: {
                                color: '#333333',
                                fontSize: this.screenWidth >= 1920 ? 16 : 12,
                                fontWeight: 600
                            }
                        },
                        grid: {
                            top: '120px',
                            left: '5%',
                            right: '4%',
                            bottom: '9%'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                animation: false,
                                label: {
                                    backgroundColor: '#505765'
                                }
                            }
                        },
                        legend: {
                            data: ['联鑫板材', '行业均值'],
                            top: '50px',
                            right: '4%'
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: xData
                        },
                        yAxis: [
                            {
                                name: '单位：方',
                                type: 'value',
                                nameTextStyle: {
                                    fontSize:
                                        this.screenWidth >= 1920 ? 16 : 12,
                                    fontWeight: 400,
                                    color: '#8A8A8A'
                                }
                            }
                        ],
                        color: ['#008AFF', '#5EDD4D'],
                        series: [
                            {
                                name: '联鑫板材',
                                type: 'line',
                                stack: '总量',
                                data: seriesData1
                            },
                            {
                                name: '行业均值',
                                type: 'line',
                                stack: '总量',
                                data: seriesData2
                            }
                        ]
                    };
                }
            }

            this.echart.setOption(option, true);
        }
    }
};
</script>

<style lang='scss' scoped>
@import '~@/pages/clientAnalysis/style/productAnalyse';
</style>