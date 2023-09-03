<template>
    <div>
        <div class="container-header-wrapper gas-page-bg">
            <top-menu title="气款跟踪" @curComChanged='curComCodeChanged'></top-menu>
            <header class="head-b">
                <div :class='{"h-left":true,"h-changedl":type=="0","unitl":type=="2"}' @click="type = 0">
                    <div :class="type=='0'?'head-b-cd':'head-b-c'"></div>
                    <div :class="type=='0'?'head-b-t':'head-b-td'">
                        <div>当月自然月气款跟踪</div>
                        <div>
                            <span>{{naturalMonthStartTime}}</span>-
                            <span>{{naturalMonthEndTime}}</span>
                        </div>
                    </div>
                </div>
                <div :class='{"h-right":true,"h-changedr":type=="1"}' @click="()=>type = 1">
                    <div :class="type=='0'?'head-b-c':'head-b-cd'"></div>
                    <div :class="type=='0'?'head-b-td':'head-b-t'">
                        <div>当月结算月气款跟踪</div>
                        <div>
                            <span>{{settlementMonthStartTime}}</span>-
                            <span>{{settlementMonthEndTime}}</span>
                        </div>
                    </div>
                </div>
            </header>
            <main class="main-b">
                <el-row>
                    <el-col :span="8" style="padding-right:1%">
                        <div class="bcgbh">
                            <section class="main-h">
                                <p class="main-h-p">预计应付总气款</p>
                                <div class="main-h-d">
                                    <span>{{payTotlePrice}}</span>
                                    <span>（万元）</span>
                                </div>
                                <div class="main-h-r-l"></div>
                            </section>
                        </div>
                        <div class="main-f bcgb">
                            <section>
                                <div class="main-f-d">
                                    <div>
                                        <!-- <div>{{seestart}}-{{seeend}}</div> -->
                                        <!-- <div class="main-f-d-d">{{seestart}}-{{seeend}}</div> -->
                                        <div>{{ type === 0 ? startTimeNatureMonth : startTimeSettlementMonth }}</div>
                                        <div class="main-f-d-d">{{ type === 0 ? endTimeNatureMonth : endTimeSettlementMonth}}</div>
                                    </div>
                                    <div>
                                        <div>实际气量金额</div>
                                        <div class="main-f-d-d">剩余应付</div>
                                    </div>

                                    <div>
                                        <div>{{payActualPrice}}</div>
                                        <div class="main-f-d-d">{{payRemainingPrice}}</div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div class="main-f-f">
                                    <!-- {{payCompletionRate}} -->
                                    <!-- <el-progress :percentage="Number(100*payCompletionRate)" :stroke-width="13" color="skyblue"></el-progress> -->
                                    <el-progress :percentage="Number(payCompletionRate)" :stroke-width="13" class="blue"></el-progress>
                                </div>
                            </section>
                        </div>
                    </el-col>
                    <el-col :span="8" style="padding:0 0.5%">
                        <div class="main-h bcgph">
                            <p class="main-h-p">预计应收总气款</p>
                            <div class="main-h-d">
                                <span>{{incomeTotlePrice}}</span>
                                <span>（万元）</span>
                            </div>
                            <div class="main-h-r-m"></div>
                        </div>
                        <div class="main-f bcgp">
                            <section>
                                <div class="main-f-d">
                                    <div>
                                        <div>{{ type === 0 ? startTimeNatureMonth : startTimeSettlementMonth }}</div>
                                        <div class="main-f-d-d">{{ type === 0 ? endTimeNatureMonth : endTimeSettlementMonth}}</div>
                                    </div>
                                    <div>
                                        <div>实际气量金额</div>
                                        <div class="main-f-d-d">剩余应收</div>
                                    </div>

                                    <div>
                                        <div>{{incomeActualPrice}}</div>
                                        <div class="main-f-d-d">{{incomeRemainingPrice}}</div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div class="main-f-f">
                                    <!-- <el-progress :percentage="Number(100*incomeCompletionRate)" :stroke-width="13" color="pink"></el-progress> -->
                                    <el-progress :percentage="Number(incomeCompletionRate)" :stroke-width="13" color="purple" class="purple"></el-progress>
                                </div>
                            </section>
                        </div>
                    </el-col>
                    <el-col :span="8" style="padding-left:1%">
                        <div class="main-h bcggh">
                            <p class="main-h-p">预计总利润</p>
                            <div class="main-h-d">
                                <span>{{profitTotlePrice}}</span>
                                <span>（万元）</span>
                            </div>
                            <div class="main-h-r-r"></div>
                        </div>
                        <div class="main-f bcgg">
                            <section>
                                <div class="main-f-d">
                                    <div>
                                        <div>{{ type === 0 ? startTimeNatureMonth : startTimeSettlementMonth }}</div>
                                        <div class="main-f-d-d">{{ type === 0 ? endTimeNatureMonth : endTimeSettlementMonth}}</div>
                                    </div>
                                    <div>
                                        <div>实际气量利润</div>
                                        <div class="main-f-d-d">剩余气量利润</div>
                                    </div>

                                    <div>
                                        <div>{{profitActualPrice}}</div>
                                        <div class="main-f-d-d">{{profitRemainingPrice}}</div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div class="main-f-f">
                                    <!-- <el-progress :percentage="Number(profitCompletionRate)" :stroke-width="13" color="green"></el-progress> -->
                                    <el-progress :percentage="Number(profitCompletionRate)" :stroke-width="13" color="green" class="green"></el-progress>
                                </div>
                            </section>
                        </div>
                    </el-col>
                </el-row>
            </main>
        </div>
        <article class="article-main">
            <GasEcharts 
            :tableData="tableData"
            :chartData="chartData"
            :chartDataing="chartDataing"
            :tableDatat="tableDatat"
            :sumPercentage="sumPercentage"
            @gastypechange="gastypeFn"></GasEcharts>
            <GasTable 
            :startTime="startTime" 
            :endTime="endTime" 
            :curComCode="curComCode"
            :gastype="gastype"
            ></GasTable>
        </article>
    </div>
</template>
<script>
const oneDay = 24 * 60 * 60 * 1000
const currentDayTimestamp = new Date().getTime()
const currentDate = new Date()
const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()
const currentDay = new Date().getDate()

import topMenu from "../../components/topMenu/topMenu";
import GasEcharts from "./gasecharts.vue"
import GasTable from "./gastable.vue"
import {getGasTrackingPriceTime,gasTrackingPriceStatistics,getLifnrs,getComps,gasTrackingPriceStatisticss} from "./servers"
import moment from 'moment'
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'

export default {
    name: "gasvolumeTrack",
    mixins: [buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
    data(){
        return {
            chartData: "",  //环
            chartDataing: "",
            tableData: "",  //表1
            tableDatat: "", //表2
            sumPercentage: "", //总完成率
            startTime: "",
            endTime: "",
            seestart: "",
            seeend: "",
            curComCode: "",
            gastype: "",
            type:0, //初始单独状态
            // 时间
            naturalMonthStartTime:"",
            naturalMonthEndTime:"",
            settlementMonthStartTime:"",
            settlementMonthEndTime:"",
            // headbox1
            payTotlePrice:"", // 预计应付总气款
            payActualPrice:"", // 实际气量金额
            payRemainingPrice:"", // 剩余应付
            payCompletionRate:"",
            // headbox2
            incomeTotlePrice:"", // 预计应收总气款
            incomeActualPrice:"", // 实际气量金额
            incomeRemainingPrice:"", // 剩余应收
            incomeCompletionRate:"",
            // headbox3
            profitTotlePrice:"", // 预计总利润
            profitActualPrice:"", // 实际气量利润
            profitRemainingPrice:"", // 剩余气量利润
            profitCompletionRate:""
        }
    },
    components: {
        topMenu,
        GasEcharts,
        GasTable
    },
    watch:{
        "type"(val){
            // console.log(val);
            if(val===0){
                this.startTime = this.naturalMonthStartTime
                this.endTime = this.naturalMonthEndTime
                this.seestart = this.startTime.slice(5)
                this.seeend = this.endTime.slice(5)
                const obj = {
                    startTime:this.startTime,
                    endTime:this.endTime,
                    xaReig:this.curComCode
                }
                gasTrackingPriceStatistics(obj).then(res=>{
                    this.editbox(res.data.data[0])
                })
                this.chartsFn()
            }else{
                this.startTime = this.settlementMonthStartTime
                this.endTime = this.settlementMonthEndTime
                this.seestart = this.startTime.slice(5)
                this.seeend = this.endTime.slice(5)
                const obj = {
                    startTime:this.startTime,
                    endTime:this.endTime,
                    xaReig:this.curComCode
                }
                gasTrackingPriceStatistics(obj).then(res=>{
                    this.editbox(res.data.data[0])
                })
                this.chartsFn()
            }   
        },
        "curComCode"(val){
            this.curComCode = val
        }
    },
    created(){
        this.unitdata()
    },
    mounted(){
        this.curComCode = this.$store.getters.curCom
    },
    methods:{
        // 类型传递
        gastypeFn(val){
            this.gastype = val
        },
        curComCodeChanged(){
            this.curComCode = this.$store.getters.curCom.toString()
            this.chartsFn()
            this.unitdataChange()
        },
        // 进度条
        format(percentage) {
            return percentage === 100 ? '满' : `${percentage}%`;
        },
        unitdataChange(){
            if(this.type===0){
                gasTrackingPriceStatistics(
                    {
                        startTime:this.naturalMonthStartTime,
                        endTime:this.naturalMonthEndTime,
                        xaReig:this.curComCode
                    }
                ).then(res=>{
                    this.editbox(res.data.data[0])
                })
            }else if(this.type===1){
                gasTrackingPriceStatistics(
                    {
                        startTime:this.naturalMonthStartTime,
                        endTime:this.naturalMonthEndTime,
                        xaReig:this.curComCode
                    }
                ).then(res=>{
                    this.editbox(res.data.data[0])
                })
            }
        },
        unitdata(){
            getGasTrackingPriceTime().then(res=>{
                this.naturalMonthStartTime = res.data.data[0].naturalMonthStartTime
                this.naturalMonthEndTime = res.data.data[0].naturalMonthEndTime
                this.settlementMonthStartTime = res.data.data[0].settlementMonthStartTime
                this.settlementMonthEndTime = res.data.data[0].settlementMonthEndTime
                this.startTime = this.naturalMonthStartTime
                this.endTime = this.naturalMonthEndTime
                this.seestart = this.startTime.slice(5)
                this.seeend = this.endTime.slice(5)
                gasTrackingPriceStatistics(
                    {
                        startTime:this.naturalMonthStartTime,
                        endTime:this.naturalMonthEndTime,
                        xaReig:this.curComCode
                    }
                ).then(res=>{
                    this.editbox(res.data.data[0])
                })
                // 子环
                
                const obj = {
                    startTime: this.startTime,
                    endTime: this.endTime,
                    xaReig: this.curComCode,
                }
                getLifnrs(obj).then(res=>{
                        this.tableData = res.data.data[0].lifnrs.sort(this.sortBy('payCompletionRate'))
                        this.chartData = res.data.data[0].percentage
                        this.sumPercentage = res.data.data[0].sumPercentage
                    })
                getComps(obj).then(res=>{
                        this.tableDatat = res.data.data[0].comps.sort(this.sortBy('incomeCompletionRate'))
                    })
            })
        },
        chartsFn(){
            const obj = {
                startTime: this.startTime,
                endTime: this.endTime,
                xaReig: this.curComCode,
            }
            getComps(obj).then(res=>{
                        this.tableDatat = res.data.data[0].comps.sort(this.sortBy('incomeCompletionRate'))
                    })
            getLifnrs(obj).then(res=>{
                    
                    this.tableData = res.data.data[0].lifnrs.sort(this.sortBy('payCompletionRate'))
                    // this.chartData = res.data.data[0].percentage
                    this.chartData = res.data.data[0].percentage
                    this.sumPercentage = res.data.data[0].sumPercentage
                    console.log(this.chartDataing,6666666666);
                })
        },
        editbox(res){
            this.payTotlePrice = res.payTotlePrice // 预计应付总气款
            this.payActualPrice = res.payActualPrice // 实际气量金额
            this.payRemainingPrice = res.payRemainingPrice // 剩余应付
            this.incomeTotlePrice = res.incomeTotlePrice // 预计应收总气款
            this.incomeActualPrice = res.incomeActualPrice // 实际气量金额
            this.incomeRemainingPrice = res.incomeRemainingPrice // 剩余应收
            this.profitTotlePrice = res.profitTotlePrice // 预计总利润
            this.profitActualPrice = res.profitActualPrice // 实际气量利润
            this.profitRemainingPrice = res.profitRemainingPrice // 剩余气量利润
            this.payCompletionRate = res.payCompletionRate 
            this.incomeCompletionRate = res.incomeCompletionRate
            this.profitCompletionRate = res.profitCompletionRate
        },
        sortBy(prop) {
            return (a,b) => {
                return b[prop]-a[prop]
            }
        },        
    },
    computed:{
        // 当月自然月
        startTimeNatureMonth() {           
            let firstDateOfCurrentMonth = new Date(currentYear,currentMonth,1)          // 当月第1天
            let currentDateOfCurrentMonth = new Date(currentYear,currentMonth,currentDay)
            let yestodayDateOfCurrentMonth = new Date(currentYear,currentMonth,currentDay-1)        // 当前日期前1天
            let lastDateOfCurrentMonth = new Date(currentYear,currentMonth + 1,0)               // 当月最后一天
            console.log();
            if(currentDay === 1) {
                return moment(firstDateOfCurrentMonth).format('MM/DD') + '-' + moment(firstDateOfCurrentMonth).format('MM/DD')
            }else {
                return moment(firstDateOfCurrentMonth).format('MM/DD') + '-' + moment(currentDateOfCurrentMonth).format('MM/DD')
            }
        },
        endTimeNatureMonth() {          
            let firstDateOfCurrentMonth = new Date(currentYear,currentMonth,1)
            let currentDateOfCurrentMonth = new Date(currentYear,currentMonth,currentDay+1)
            let yestodayDateOfCurrentMonth = new Date(currentYear,currentMonth,currentDay-1)
            let lastDateOfCurrentMonth = new Date(currentYear,currentMonth + 1,0)
     
            return moment(currentDateOfCurrentMonth).format('MM/DD') + '-' + moment(lastDateOfCurrentMonth).format('MM/DD')
        },
        // 当月结算月
        startTimeSettlementMonth() {           
            let previousMonth26 = new Date(currentYear,currentMonth-1,26)      // 上月26日
            let yestodayDateOfCurrentMonth = new Date(currentYear,currentMonth,currentDay)            // 当月前一天
            let currentMonth26 = new Date(currentYear,currentMonth,25)          // 当月25日
            let currentDateOfCurrentMonth = new Date(currentYear,currentMonth,currentDay)
            if(currentDay >= 26) {
                return moment(previousMonth26).format('MM/DD') + '-' + moment(currentMonth26).format('MM/DD')
            }else {
                return moment(previousMonth26).format('MM/DD') + '-' + moment(yestodayDateOfCurrentMonth).format('MM/DD')
            }
        },
        endTimeSettlementMonth() {
            let previousMonth26 = new Date(currentYear,currentMonth-1,26)      // 上月26日
            let yestodayDateOfCurrentMonth = new Date(currentYear,currentMonth,currentDay-1)            // 当月前一天
            let tomorrowDateOfCurrentMonth = new Date(currentYear,currentMonth,currentDay+1)            // 当月后一天
            let currentMonth26 = new Date(currentYear,currentMonth,25)          // 当月25日

            if(currentDay >= 26) {
                return moment(currentMonth26).format('MM/DD') + '-' + moment(currentMonth26).format('MM/DD')
            }else {
                return moment(tomorrowDateOfCurrentMonth).format('MM/DD') + '-' + moment(currentMonth26).format('MM/DD')
            }
        },        
    }

}
</script>
<style scoped lang="scss">
.container-header-wrapper {
    width:100%;
    .head-b{
        display: flex;
        margin:32px 0 0 29px;
        .h-left{
            width: 259px;
            height: 64px;
            border: 2px solid #567DB9;
            opacity: 1;
            border-radius: 12px 0px 0px 12px;
            display: flex;
            align-items: center;
        }
        .h-changedl{
            width: 259px;
            height: 64px;
            background:#567DB9;
            opacity: 1;
            border-radius: 12px 0px 0px 12px;
            display: flex;
            align-items: center;
        }
        .h-right{
            width: 259px;
            height: 64px;
            border: 2px solid #567DB9;
            opacity: 1;
            border-radius: 0px 12px 12px 0px;
            display: flex;
            align-items: center;
            .head-b-c{
                margin: 0px 19px 0px;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                // border: 4px solid lightpink ;
                // background-color: green;
                background-image: url("~@/assets/img/gasvolumeTrack/circle.png");
                background-size: 100% ;
            }
        }
        .h-changedr{
            width: 259px;
            height: 64px;
            background:#567DB9;
            opacity: 1;
            border-radius: 0px 12px 12px 0px;
            display: flex;
            align-items: center;
        }
    }
    .main-b{
        margin:0px 30px 0px 30px;
        // background-color: red;
        .main-h{
            height: 150px;
            // background-color: green;
            border-radius: 12px;
            // position: relative;
            .main-h-p{
                // width: 126px;
                height: 25px;
                font-size: 18px;
                font-family: PingFangSC-Medium;
                line-height: 25px;
                color: #FFFFFF;
                opacity: 1;
                margin:31px 0 0 30px;
                padding-top: 31px;
            }
            .main-h-d{
                display: flex;
                float: left;
            }
            .main-h-d> span:first-child{
                display: block;
                // width: 147px;
                // height: 52px;
                font-size: 45px;
                font-family: DINAlternate-Bold;
                line-height: 52px;
                color: #FFFFFF;
                // letter-spacing: 25px;
                opacity: 1;
                margin:11px 0 0 30px;
                // padding-top: 41px;
            }
            .main-h-d> span:last-child{
                display: block;
                // width: 72px;
                // height: 25px;
                font-size: 18px;
                font-family: PingFang SC;
                font-weight: 500;
                line-height: 25px;
                color: #FFFFFF;
                opacity: 0.9;
                margin:34px 0 0 5px
            }
        }
        .bcgb{
            background-image: url("~@/assets/img/gasvolumeTrack/blue.png");
            background-size: 100% 100%;
        }
        .bcgbh{
             background-image: url("~@/assets/img/gasvolumeTrack/blueh.png");
             background-size: 100% 100%;
        }
        .bcgp{
            background-image: url("~@/assets/img/gasvolumeTrack/purple.png");
            background-size: 100% 100%;
        }
        .bcgph{
            background-image: url("~@/assets/img/gasvolumeTrack/purpleh.png");
            background-size: 100% 100%;
        }
        .bcgg{
            background-image: url("~@/assets/img/gasvolumeTrack/green.png");
            background-size: 100% 100%;
        }
        .bcggh{
            background-image: url("~@/assets/img/gasvolumeTrack/greenh.png");
            background-size: 100% 100%;
        }
        .main-f{
            // width: 515px;
            height: 127px;
            // background-color:indigo;
            border-radius: 12px;
            font-size: 16px;
            font-family: PingFangSC-Regular;
            line-height: 24px;
            color: #FFFFFF;
            opacity: 1;
            .main-f-d{
                display: flex;
                // flex: 1;
                justify-content: space-evenly;
                .main-f-d-d{
                    margin-top: 11px;
                }
            }
            .main-f-f{
                margin-top:20px;
                width: 80%;
                margin-left: 10%;
            }
        }
        .main-f> section:first-child{
            padding-top: 22px;
        }
        .main-f> section:last-child{
            display: block;
            margin-top: 11px;
            // margin-left: 5px;
        }
    }
    .footer{
        height: 50px;
    }
    .head-b-c{
        margin: 0px 19px 0px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        // border: 4px solid lightpink ;
        // background-color: green;
        background-image: url("~@/assets/img/gasvolumeTrack/circle.png");
        background-size: 100% ;
    }
    .head-b-t{
        color: #FFFFFF;
        font-size: 16px;
        line-height: 24px;
    }
    .head-b-td{
        color: #D2D2DC;;
        font-size: 16px;
        line-height: 24px;
    }
    .head-b-cd{
        margin: 0px 19px 0px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        // border: 4px solid lightpink ;
        // background-color: green;
        background-image: url("~@/assets/img/gasvolumeTrack/circle2.png");
        background-size: 100% ;
    }
    .main-h-r-l{
        width: 70px;
        height: 70px;
        float: right;
        margin-right: 30px;
        margin-bottom: 30px;
        background-image: url("~@/assets/img/gasvolumeTrack/bluep.png");
        background-size: 100% ;
    }
    .main-h-r-m{
        width: 70px;
        height: 70px;
        float: right;
        margin-right: 30px;
        margin-bottom: 30px;
        background-image: url("~@/assets/img/gasvolumeTrack/purplep.png");
        background-size: 100% ;
    }
    .main-h-r-r{
        width: 70px;
        height: 70px;
        float: right;
        margin-right: 30px;
        margin-bottom: 30px;
        background-image: url("~@/assets/img/gasvolumeTrack/greenp.png");
        background-size: 100% ;
    }
}
.article-main{
    position: relative;
    top: -8px;
}
::v-deep .el-progress {
    display: flex;
    align-items: center;
}
::v-deep .el-progress-bar{
        width: 94%;
    }
::v-deep .main-f-f .el-progress__text{
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 24px;
    color: #FFFFFF;
}
::v-deep .blue .el-progress-bar__inner{
//   background-color: goldenrod;
  background-image: linear-gradient(208deg, #64FFFF 0%, #4770B2 100%);
}
::v-deep .purple .el-progress-bar__inner{
//   background-color: goldenrod;
  background-image: linear-gradient(207deg, #E364F4 0%, rgba(91, 50, 168, 0.7) 100%);
}
::v-deep .green .el-progress-bar__inner{
//   background-color: goldenrod;
  background-image: linear-gradient(207deg, #4FE3AA 0%, rgba(102, 124, 183, 0.65) 100%);
}
</style>