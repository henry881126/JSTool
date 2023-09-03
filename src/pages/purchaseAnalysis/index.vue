<template>
    <el-row :gutter="0" class="container-wrap">
        <el-row :gutter="0" class="container-one container1">
            <!-- title -->
            <el-row :gutter="0" type="flex" justify="space-between">
                <el-col :lg="4" :xl="3" class="title">采购分析</el-col>
                <el-col :lg="8" :xl="5" style="text-align: end">
                    <select-com
                        :selectVal="selectVal"
                        :optionsArr="options"
                        @changeSelect="changeSelect"
                    ></select-com>
                </el-col>
            </el-row>
            <!-- widget -->
            <el-row :gutter="10" type="flex" align="middle" class="widget-wrap">
                <el-col :md="3" :lg="1" :xl="1" class="btn-wrap btn-wrap-month"
                    ><el-button
                        :type="dateType === '3' ? 'primary' : ''"
                        size="default"
                        @click="changeDateType('3')"
                        >月</el-button
                    >
                </el-col>
                <el-col :md="3" :lg="1" :xl="1" class="btn-wrap btn-wrap-year"
                    ><el-button
                        :type="dateType === '4' ? 'primary' : ''"
                        size="default"
                        @click="changeDateType('4')"
                        >年</el-button
                    >
                </el-col>

                <template v-if="dateType === '3'">
                    <el-col :md="9" :lg="5" :xl="4" class="month-wrap">
                        <el-date-picker
                            v-model="dateMonth"
                            type="monthrange"
                            range-separator="~"
                            start-placeholder="开始月份"
                            end-placeholder="结束月份"
                            :picker-options="pickerOptionsMonth"
                            @blur="handlePickerBlur"
                            @change="changedate"
                            format="yyyy/MM"
                            value-format="yyyy/MM"
                        >
                        </el-date-picker>
                    </el-col>
                </template>
                <template v-if="dateType === '4'">
                    <el-col :md="12" :lg="4" :xl="4">
                        <div class="year-wrap">
                            <el-date-picker
                                v-model="startYear"
                                @blur="openEndDate"
                                type="year"
                                placeholder="开始年份"
                                value-format="yyyy"
                                class="start-year-picker"
                                :clearable="clearFlag"
                                :picker-options="pickerOptionsStart"
                                @change="changedate"
                            >
                            </el-date-picker>
                            <span style="color: #ffffff; font-size: 14px"
                                >~</span
                            >
                            <el-date-picker
                                class="end-year-picker"
                                placeholder="结束年份"
                                :clearable="false"
                                v-model="endYear"
                                type="year"
                                value-format="yyyy"
                                :picker-options="pickerOptions"
                                ref="endDate"
                                @change="changedate"
                            ></el-date-picker>
                        </div>
                    </el-col>
                </template>
                <el-col :md="3" :lg="1" :xl="1"
                    ><el-radio
                        v-model="radio"
                        :label="true"
                        @click.native.prevent="clickRadio(true)"
                        >气源采购均价同比</el-radio
                    >
                </el-col>
            </el-row>
            <!-- echart图表 -->
            <el-row :gutter="0">
                <el-col :lg="24" :xl="24" class="chart-wrap">
                    <div ref="echart_line_bar" class="echart"></div>
                </el-col>
            </el-row>
        </el-row>

        <el-row :gutter="0" class="container-two" type="flex" justify="center">
            <el-row :gutter="0" class="title-table-wrap">
                <!-- 表格导航 -->
                <el-row
                    :gutter="0"
                    :lg="24"
                    :xl="24"
                    type="flex"
                    justify="space-between"
                    class="title-wrap"
                >
                    <el-col :lg="22" :xl="22" class="tag-wrap">
                        <el-row :lg="22" :xl="22">
                            <el-tag
                                v-for="tag in tagsConfig"
                                :key="tag.key"
                                class="tag"
                                :class="{ actived: activedIndex === tag.key }"
                                @click="changeTag(tag)"
                            >
                                {{ tag.value }}
                            </el-tag>
                        </el-row>
                        <el-row :lg="22" :xl="22" class="unit">
                            单位：万方
                        </el-row>
                    </el-col>
                    <el-col :lg="2" :xl="2" class="btn-wrap"
                        ><el-button
                            type="primary"
                            size="default"
                            @click="exportData"
                            >导出</el-button
                        >
                    </el-col>
                </el-row>
                <!-- 表格容器 -->
                <el-row :gutter="0" :lg="24" :xl="24" class="table-wrap-row">
                    <el-col :lg="24" :xl="24" class="table-wrap">
                        <table-com
                            :activedTagIndex="activedIndex"
                            :selectCompCode="selectVal"
                            :startTime="startTime"
                            :endTime="endTime"
                            :dateType="dateType"
                            ref="table"
                        ></table-com>
                    </el-col>
                </el-row>
            </el-row>
        </el-row>
    </el-row>
</template>

<script>
import * as echarts from 'echarts';
import selectCom from './components/select';
import tableCom from './components/table';

let selectMinMonth = 0; //选中的最小月
let millisecondOfMonth = 30 * 1 * 24 * 60 * 60 * 1000; //一个月的毫秒数
export default {
    name: 'PurchaseAnalysiss',
    components: {
        tableCom,
        selectCom
    },
    props: {},
    data() {
        return {
            clearFlag: false,
            selectVal: '',
            options: [],
            dateVal: '',
            startTime: '',
            endTime: '',
            dateType: '3', // day 1 week 2 month 3 year 4
            dateMonth: this.currentMonth(),
            startYear: this.getDate('year', -5),
            endYear: new Date().getFullYear().toString(),
            radio: false,
            echart: null,
            activedIndex: '1',
            tagsConfig: [],
            pickerOptionsMonth: {
                disabledDate(time) {
                    if (selectMinMonth > 0) {
                        return (
                            time.getTime() >
                                Math.min(
                                    Date.now(),
                                    selectMinMonth + 18 * millisecondOfMonth
                                ) ||
                            time.getTime() <
                                selectMinMonth - 18 * millisecondOfMonth
                        );
                    } else {
                        return time.getTime() > Date.now();
                    }
                },
                onPick({ maxDate, minDate }) {
                    selectMinMonth = minDate && new Date(minDate).getTime();
                }
            },
            flag: true,
            colorConfig: {
                PNG进气量: '#00B7FF',
                PNG采购均价: '#FDB27B',
                LNG进气量: '#1CFFB1',
                LNG采购均价: '#E1FF39',
                CNG进气量: '#9885FF',
                CNG采购均价: '#69FC12',
                PNG采购均价同比: '#FDB27B',
                LNG采购均价同比: '#E1FF39',
                CNG采购均价同比: '#69FC12'
            }
        };
    },
    computed: {
        pickerOptionsStart() {
            let disabledDate = time => {
                let nowYear = new Date().getTime();
                return time.getTime() > nowYear;
            };
            return { disabledDate };
        },
        pickerOptions() {
            let disabledDate = time => {
                let tenYear = 10 * 365 * 24 * 3600 * 1000;
                let year1 = new Date(this.startYear).getTime();
                let year2 = year1 + tenYear;
                let nowYear = new Date().getTime();
                if (year2 >= nowYear) {
                    year2 = nowYear;
                }
                return time.getTime() < year1 || time.getTime() > year2;
            };
            return { disabledDate };
        }
    },
    watch: {},
    created() {
        this.getTagData();
    },
    async mounted() {
        await this.$store.dispatch('dic/getDicResources').then(() => {
            this.options = this.$store.getters['companyList'];
            let compCode = this.$route.query.compCode;
            if (compCode) {
                this.selectVal = compCode;
            } else {
                this.selectVal =
                    this.options.length !== 0 ? this.options[0].code : '';
            }
        });
        this.initEchart();
        window.addEventListener('resize', this.handleResizeEchart);
    },
    beforeDestroy() {
        // window.removeEventListener('resize');
    },
    methods: {
        changeSelect(val) {
            this.selectVal = val;
            this.updateStartAndEndTime();
            this.updateLinkData();
        },
        changeDateType(val) {
            this.dateType = val;
            this.updateStartAndEndTime();
            // 点击按钮时要刷新折线图数据和表格数据
            this.updateLinkData();
        },
        // 联动更新折线图和表格中的数据
        updateLinkData() {
            this.getLineAndBarData();
            // this.$refs.table.getTableData();
        },
        openEndDate() {
            this.$refs.endDate.focus();
        },
        currentMonth() {
            //时间跨度默认前12月
            let sDate = this.getDate('year', 0) + '/02'; //默认显示当年一月起
            let eDate = this.getDate('month', -11);
            this.startTime = sDate;
            this.endTime = eDate;
            return [eDate, sDate];
            // return [sDate, eDate];
        },
        clickRadio(e) {
            e === this.radio ? (this.radio = false) : (this.radio = e);
            this.getLineAndBarData();
        },
        initEchart() {
            this.echart = echarts.init(this.$refs.echart_line_bar);
            this.getLineAndBarData();
        },
        //获取默认折线和柱状图数据
        getLineAndBarData() {
            this.updateStartAndEndTime();
            let params = {
                compCode: this.selectVal,
                endTime: this.endTime,
                startTime: this.startTime,
                timeUnit: this.dateType, // day 1 week 2 month 3 year 4
                isYearonyear: this.radio //气源采购均价同比
            };
            let that = this;
            this.$api.getPurchaseGraphData(params).then(res => {
                let legendArr = [];
                let colorArr = [];
                let xAxisArr = [];
                let seriesData = [];
                if (res.resultCode === 0) {
                    let resData = res.data;
                    if (resData.length !== 0) {
                        resData.forEach((element, index) => {
                            // 挑出图例
                            if (index === 0) {
                                let keysArr = Object.keys(element);
                                legendArr = keysArr.filter(
                                    val => val !== 'time'
                                );
                            }
                            // 制作x轴
                            xAxisArr.push(element.time);
                        });
                        let obj = {};
                        legendArr.forEach(element => {
                            obj[element] = [];
                            colorArr.push(this.colorConfig[element]);
                        });
                        resData.forEach(element => {
                            for (const key in obj) {
                                if (Object.hasOwnProperty.call(obj, key)) {
                                    obj[key].push(element[key]);
                                }
                            }
                        });
                        for (const key in obj) {
                            if (Object.hasOwnProperty.call(obj, key)) {
                                seriesData.push({
                                    yAxisIndex:
                                        key.indexOf('均价') > 0
                                            ? this.radio === false
                                                ? 1
                                                : 0
                                            : this.radio === false
                                            ? 0
                                            : 1,
                                    name: key,
                                    type:
                                        key.indexOf('均价') > 0
                                            ? 'line'
                                            : 'bar',
                                    data: obj[key],
                                    barWidth:
                                        key.indexOf('均价') > 0 ? '' : '16px',
                                    itemStyle: {
                                        normal: {
                                            barBorderRadius: 20,
                                            label: {
                                                show: false,
                                                position: 'top',
                                                color: '#ffffff' //  颜色
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                } else {
                    this.$message({
                        message: res.resultMessage,
                        type: 'error'
                    });
                }

                let option = {};
                if (
                    legendArr.length === 0 ||
                    xAxisArr.length === 0 ||
                    seriesData.length === 0
                ) {
                    option = {
                        title: {
                            text: '暂无数据',
                            x: 'center',
                            y: 'center',
                            textStyle: {
                                color: '#ffffff',
                                fontWeight: 'normal',
                                fontSize: 16
                            }
                        }
                    };
                } else {
                    option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            right: '1%',
                            textStyle: {
                                color: '#ffffff'
                            },
                            itemHeight: 6,
                            data: legendArr
                        },
                        grid: {
                            left: '5%',
                            right: '4%',
                            bottom: '9%'
                        },
                        xAxis: [
                            {
                                type: 'category',
                                axisLabel: {
                                    color: '#ffffff'
                                },
                                axisLine: {
                                    lineStyle: { color: '#ffffff' }
                                },
                                data: xAxisArr,
                                axisPointer: {
                                    type: 'shadow'
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name:
                                    this.radio === false
                                        ? '单位：万方'
                                        : '单位：%',
                                axisLabel: {
                                    formatter: '{value}'
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#ffffff'
                                    }
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: '#ffffff1f',
                                        type: 'dotted'
                                    }
                                }
                            },
                            {
                                type: 'value',
                                name: this.radio === false ? '单位：%' : '',
                                show: true,
                                axisLabel: {
                                    formatter: '{value}',
                                    color: '#ffffff'
                                },
                                axisLine: {
                                    lineStyle: { color: '#ffffff' }
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: '#ffffff1f',
                                        type: 'dotted'
                                    }
                                }
                            }
                        ],
                        color: colorArr,
                        series: seriesData
                    };
                }
                that.echart.setOption(option, true);
            });
        },
        // 日期选择器失去焦点时
        handlePickerBlur() {
            selectMinMonth = 0;
        },
        // 更新startTime和endTime赋值
        updateStartAndEndTime() {
            switch (this.dateType) {
                case '3':
                    this.startTime = this.dateMonth[0];
                    this.endTime = this.dateMonth[1];
                    break;
                case '4':
                    this.startTime = this.startYear;
                    this.endTime = this.endYear;
                    break;
                default:
                    this.startTime = this.dateMonth[0];
                    this.endTime = this.dateMonth[1];
                    break;
            }
        },
        // 改变面板日期
        changedate() {
            this.updateStartAndEndTime();
            this.updateLinkData();
        },
        //导出表格数据
        exportData() {
            let params = {
                compCode: this.selectVal,
                endTime: this.endTime,
                endType: this.activedIndex,
                startTime: this.startTime,
                timeUnit: this.dateType // day 1 week 2 month 3 year 4
            };
            this.$api.exportTableData(params).then(res => {
                if (res.resultCode === 0) {
                    let objectUrl = res.data;
                    let link = document.createElement('a');
                    link.href = objectUrl;
                    link.setAttribute('download', '测试');
                    document.body.appendChild(link);
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                } else {
                    this.$message.error(res.resultMessage);
                }
            });
        },
        // 获取tag数据
        getTagData() {
            this.$api.endType().then(res => {
                if (res.resultCode === 0) {
                    this.tagsConfig = res.data;
                } else {
                    this.$message({
                        message: res.resultMessage,
                        type: 'error'
                    });
                }
            });
        },
        // 改变tag
        changeTag(tag) {
            this.activedIndex = tag.key;
        },
        /**
         * 获取当前时间点前后的某个时间点儿
         * @param {String} type 返回的日期精确到的单位
         * @param {Number} timeNum  前移（-2）或后退（2）的数量
         */
        getDate(type, timeNum) {
            // Date()返回当日的日期和时间。
            const date = new Date();
            // getTime()返回 1970 年 1 月 1 日至今的毫秒数。
            let gettimes;
            switch (type) {
                case 'year':
                    gettimes =
                        date.getTime() + 1000 * 60 * 60 * 24 * timeNum * 365;
                    break;
                case 'month':
                    gettimes =
                        date.getTime() + 1000 * 60 * 60 * 24 * timeNum * 30;
                    break;
                case 'day':
                    gettimes = date.getTime() + 1000 * 60 * 60 * 24 * timeNum;
                    break;
                case 'hours':
                    gettimes = date.getTime() + 1000 * 60 * 60 * timeNum;
                    break;
                case 'minutes':
                    gettimes = date.getTime() + 1000 * 60 * timeNum;
                    break;
                case 'seconds':
                    gettimes = date.getTime() + 1000 * timeNum;
                    break;
                default:
                    gettimes = date.getTime() + 1000 * 60 * 60 * 24 * timeNum;
                    break;
            }

            // setTime()以毫秒设置 Date 对象。
            date.setTime(gettimes);
            const year = date.getFullYear();
            const month =
                date.getMonth() + 1 < 10
                    ? `0${date.getMonth() + 1}`
                    : date.getMonth() + 1;
            const day =
                date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
            const hours =
                date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
            const minutes =
                date.getMinutes() < 10
                    ? `0${date.getMinutes()}`
                    : date.getMinutes();
            const seconds =
                date.getSeconds() < 10
                    ? `0${date.getSeconds()}`
                    : date.getSeconds();
            let dateFormat = '';
            switch (type) {
                case 'year':
                    dateFormat = `${year}`;
                    break;
                case 'month':
                    dateFormat = `${year}/${month}`;
                    break;
                case 'day':
                    dateFormat = `${year}/${month}/${day}`;
                    break;
                case 'hours':
                    dateFormat = `${year}/${month}/${day} ${hours}`;
                    break;
                case 'minutes':
                    dateFormat = `${year}/${month}/${day} ${hours}:${minutes}`;
                    break;
                case 'seconds':
                    dateFormat = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
                    break;

                default:
                    dateFormat = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
                    break;
            }
            return dateFormat;
        }
    }
};
</script>

<style lang='scss' scoped>
@import '~@/pages/purchaseAnalysis/style/index';
</style>
