<template>
    <div class="gas-e">
        <header class="gas-e-h">
            <aside class="gas-e-h-l">
                <p class="gas-e-h-l-p">气款跟踪进度</p>
            </aside>
            <aside class="gas-e-h-r">
                <div class="gas-e-h-r-l" @click="gastype=0" ref="gasl">
                    <div :class="gastype===0?'gas-e-h-r-l-l':'gas-e-h-r-r-l'"></div>
                    <div ref="gaslr">供应商</div>
                </div>
                <div class="gas-e-h-r-r" @click="gastype=1" ref="gasr">
                    <div :class="gastype===1?'gas-e-h-r-l-l':'gas-e-h-r-r-l'"></div>
                    <div ref="gasrr">用气企业</div>
                </div>
            </aside>
        </header>
        <main class="gas-e-main" v-if="gastype===0">
            <aside class="gas-e-a" id="add">
                <div><p class="gas-e-a-p">总用气款占比</p></div>
                <div id="container">
                </div>
            </aside>
            <aside class="gas-e-at">
                <el-table
                    :data="tableDatas"
                    style="width: 90%;padding-bottom:50px"
                    >
                    <el-table-column
                        prop="lifnrName"
                        label="供应商"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="payCompletionRate"
                        label="完成率（月）"
                        >
                        <template slot-scope="scope">
                            <el-progress type="circle" :color="scope.row.colour" :percentage='scope.row.payCompletionRate' :width="60"></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="payActualPrice"
                        label="实际采购气款（万元）">
                    </el-table-column>
                    <el-table-column
                        prop="payTotlePrice"
                        label="预估采购气款（万元）">
                    </el-table-column>
                </el-table>
            </aside>
        </main>
        <main v-if="gastype===1" style="padding-bottom:30px">
            <el-table 
                    :data="tableDatass"
                    height="500px"
                    style="width: 100%;padding:15px 30px 50px 30px">
                    <el-table-column
                        prop="compName"
                        label="供应商"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="完成率（月）"
                        width="450%"
                        >
                        <template slot-scope="scope">
                            <el-progress class="bbb" color="#0FB2B2" :percentage="scope.row.percentage" :stroke-width="13"></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="incomeActualPrice"
                        label="实际收入气款（万元）">
                    </el-table-column>
                    <el-table-column
                        prop="incomeTotlePrice"
                        label="预估应收气款（万元）">
                    </el-table-column>
                </el-table>
        </main>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import {getComps,getLifnrs
    } from "./servers"
import { Chart } from '@antv/g2';
export default {
    name:"gasecharts",
    data(){
        return {
            gastype: 0,
            piepic:true,
            tablepic:false,
            tableDatas: [],
            chartDatas:[],
            tableDatass:[],
            chartDataings:[],
        }
    },
    mounted(){
    },
    props:["chartData","tableData","tableDatat","sumPercentage","chartDataing"],
    watch:{
        "gastype"(val){
            this.$emit("gastypechange",val)
            if(val===0){
                this.$refs.gasl.style.color="#0FB2AB"
                this.$refs.gasr.style.color="#74788D"
                this.$refs.gasl.style.borderColor="#0FB2AB"
                this.$refs.gasr.style.borderColor="#D2D2DC"
                console.log(456);
                // setTimeout(() => {
                    this.piechangeFn()
                // }, 500);
                // this.piechangeFn()
            }else{
                this.$refs.gasl.style.color="#74788D"
                this.$refs.gasr.style.color="#0FB2AB"
                this.$refs.gasl.style.borderColor="#D2D2DC"
                this.$refs.gasr.style.borderColor="#0FB2AB"
                // this.piechangeFn()
            }
        },
        "chartData"(val){
            this.chartDatas = val
            console.log(val, 222222222);
            // if(this.chartDataings.length>0){
                // this.getPieChart()
                // this.piechangeFn()
            // }
            if(this.gastype == "0"){
                this.piechangeFn()
            }
        },
        "tableData"(val){
            this.tableDatas = val
        },
        "tableDatat"(val){
            this.tableDatass = val
        },
        "chartDataing"(val){
            console.log(val, 11111111111);
            this.chartDataings = val
            if(this.gastype == "0"){
                this.piechangeFn()
            }
            // let deleteNode=document.getElementById('container');
            // deleteNode.remove()
            // let addNode=document.getElementById('add');
            // let Node = document.createElement("div")
            // Node.id = "container"
            // addNode.appendChild(Node)
            // this.getPieChart()
            // chart.changeData(val)
        }
    },
    methods:{
        piechangeFn(){
            setTimeout(() => {
                let deleteNode=document.getElementById('container');
                deleteNode.remove()
                let addNode=document.getElementById('add');
                let Node = document.createElement("div")
                Node.id = "container"
                addNode.appendChild(Node)
                this.getPieChart()
            }, 200);
        },
        getPieChart(){
            const data = this.chartDatas
            const chart = new Chart({
            container: 'container',
            autoFit: true,
            // width: 247,
            height: 260,
            });
            chart.legend(false);
            chart.data(data);
            chart.scale('percent', {
            formatter: (val) => {
                val = (val * 100).toFixed(2) + '%';
                return val;
            },
            });
            
            chart.coordinate('theta', {
            radius: 0.75,
            innerRadius: 0.6,
            });
            chart.tooltip({
            showTitle: false,
            showMarkers: false,
            itemTpl: '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
            });
            // 辅助文本
            // chart
            // .annotation()
            // .text({
            //     position: ['50%', '50%'],
            //     content: '总完成率',
            //     style: {
            //     fontSize: 14,
            //     fill: '#8c8c8c',
            //     textAlign: 'center',
            //     },
            //     offsetY: -15,
            // })
            // .text({
            //     position: ['50%', '50%'],
            //     content: this.sumPercentage+"%",
            //     style: {
            //     fontSize: 20,
            //     fill: '#8c8c8c',
            //     textAlign: 'center',
            //     },
            //     // offsetX: -10,
            //     offsetY: 20,
            // })
            // .text({
            //     position: ['50%', '50%'],
            //     content: "%",
            //     style: {
            //     fontSize: 14,
            //     fill: '#8c8c8c',
            //     textAlign: 'center',
            //     },
            //     offsetY: 20,
            //     offsetX: 20,
            // });
            chart
            .interval()
            .adjust('stack')
            .position('percent')
            .color('item',["#00AAA1","#FDB27C","#B67EE0","#677BEB","#EB678B"])
            .label('percent', (percent) => {
                return {
                content: (data) => {
                    return `${data.item}: ${(percent * 100).toFixed(2)}%`;
                },
                };
            })
            .tooltip('item*percent', (item, percent) => {
                percent = (percent * 100).toFixed(2) + '%';
                return {
                name: item,
                value: percent,
                };
            });
            chart.interaction('element-active');
            console.log(this.chartDataings,555555555555);
            // if(this.chartDataings.length>0){
            //     console.log(9999999);
            //     chart.changeData(this.chartDataings)
            // }
            
            chart.render();
        },
    }
}
</script>
<style scoped lang="scss">
    .gas-e{
        margin:0 auto;
        // z-index: 100;
        width: 96%;
        min-width: 1400px;
        min-height: 509px;
        background: #FFFFFF;
        box-shadow: 0px 10px 20px rgba(38, 51, 88, 0.07);
        opacity: 1;
        border-radius: 12px;
        margin-bottom: 30px;
        .gas-e-h{
            height: 50px;
            // background-color: khaki;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            .gas-e-h-l-p{
                // width: 144px;
                height: 33px;
                font-size: 24px;
                font-family: PingFang SC;
                font-weight: 500;
                line-height: 33px;
                color: #2C3E50;
                opacity: 1;
                margin:0 0 0 30px
            }
            .gas-e-h-r{
                margin-right: 30px;
                display: flex;
                .gas-e-h-r-l{
                    display: flex;
                    align-items: center;
                    width: 130px;
                    height: 46px;
                    background: #FFFFFF;
                    border: 1px solid #0FB2AB;
                    color:#0FB2AB;
                    font-size: 16px;
                    line-height: 22px;
                    font-weight: 500;
                    opacity: 1;
                    border-radius: 100px;
                    margin-right: 20px;
                }
                .gas-e-h-r-r{
                    display: flex;
                    align-items: center;
                    width: 146px;
                    height: 46px;
                    background: #FFFFFF;
                    border: 1px solid #D2D2DC;
                    opacity: 1;
                    border-radius: 100px;
                    font-weight: 500;
                    line-height: 22px;
                    color: #74788D;
                }
            }
        }
        .gas-e-main{
            display: flex;
            margin-left: 30px;
            .gas-e-a{
                // width:500px;
                width:33%;
                // background-color: green;
                .gas-e-a-p{
                    // margin-left: 30px;
                    width: 114px;
                    height: 26px;
                    font-size: 19px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    line-height: 24px;
                    color: #2C3E50;
                    opacity: 1;
                    margin-bottom: 60px;
                }
            }
            .gas-e-at{
                // width:100%;
                margin-top: 84px;
                flex: 1;
                // background-color: black;
                // float: left;
            }
        }
    }
    .gas-e-h-r-l-l{
        width: 24px;
        height: 24px;
        margin:0 12px 0 22px;
        background-image: url("~@/assets/img/gasvolumeTrack/choose.png");
        background-size: 100% ;
    }
    .gas-e-h-r-r-l{
        width: 24px;
        height: 24px;
        background-image: url("~@/assets/img/gasvolumeTrack/unchoose.png");
        background-size: 100% ;
        margin:0 12px 0 22px
    }
    ::v-deep.el-table th > .cell {
    text-align: center;
    }
    ::v-deep.el-table .cell {
    text-align: center;
    }
    ::v-deep .el-progress-bar{
        width: 60%;
    }
</style>