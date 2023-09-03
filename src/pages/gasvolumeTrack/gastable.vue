<template>
    <div class="gas-t">
        <header>
            <el-row class="gas-t-e">
                <el-col :span="2">
                    <p class="gas-t-e-p">
                        气款明细
                    </p>
                </el-col>
                <el-col :span="6" class="gas-t-e-s">
                    <!-- @blur="searchFn" -->
                    <el-input
                        @blur="(e)=>{search=e.target.value;dataSearch()}"
                        placeholder="请输入企业名称"
                        prefix-icon="el-icon-search"
                        v-model="search">
                    </el-input>
                </el-col>
            </el-row>
            <!-- <div>
                
            </div> -->
        </header>
        <main class="gas-t-t" v-if="this.gastype===1">
            <el-table
                :data="tableData"
                stripe
                height="590px"
                 header-row-class-name="custom-table-header"
                header-cell-class-name="custom-table-header-cell"
                cell-class-name="custom-table-cell"
                class="custom-table-r"
                style="width: 100%">
                <el-table-column
                    prop="time"
                    label="日期"
                >
                </el-table-column>
                <el-table-column
                    prop="codeTxt"
                    label="用气企业"
                >
                </el-table-column>
                <el-table-column
                    prop="cost"
                    label="应收气款（万元）">
                </el-table-column>
                <el-table-column
                    prop="balancePrice"
                    label="预付余额（万元）">
                </el-table-column>
                <el-table-column
                    prop="profit"
                    label="利润（万元）">
                </el-table-column>
            </el-table>
            <div class="footer" v-if="tableData.length>0">
                <div class="footer-one">合计</div>
                <div></div>
                <div>{{lastdata.cost}}</div>
                <div>{{lastdata.balancePrice}}</div>
                <div>{{lastdata.profit}}</div>
            </div>
        </main>
        <main class="gas-t-t" v-else>
            <el-table
                :data="tableData"
                stripe
                height="590px"
                 header-row-class-name="custom-table-header"
                header-cell-class-name="custom-table-header-cell"
                cell-class-name="custom-table-cell"
                class="custom-table-r"
                style="width: 100%">
                <el-table-column
                    prop="time"
                    label="日期"
                >
                </el-table-column>
                <el-table-column
                    prop="codeTxt"
                    label="供应商名称"
                >
                </el-table-column>
                <el-table-column
                    prop="cost"
                    label="采购成本（万元）">
                </el-table-column>
                <el-table-column
                    prop="balancePrice"
                    label="预付余额（万元）">
                </el-table-column>
                <el-table-column
                    prop="profit"
                    label="利润（万元）">
                </el-table-column>
            </el-table>
            <div class="footer" v-if="tableData.length>0">
                <div class="footer-one">合计</div>
                <div></div>
                <div>{{lastdata.cost}}</div>
                <div>{{lastdata.balancePrice}}</div>
                <div>{{lastdata.profit}}</div>
            </div>
        </main>
    </div>
</template>
<script>
import {getLifnrsDetail,getCompsDetail
    } from "./servers"
export default {
    name:"gastable",
    props:["startTime","endTime","curComCode","gastype"],
    mounted(){
        
    },
    watch:{
        "startTime"(val){
        },
        "endTime"(val){
            this.dataSearch()
        },
        "curComCode"(val){
            if(this.startTime&&this.endTime){
                this.dataSearch()
            }
        },
        "gastype"(val){
            this.dataSearch()
        }
    },
    data(){
        return {
            search: "",
            tableData: [],
            lastdata: {},
            }   
    },
    methods:{
        dataSearch(){
            const obj = {
                startTime: this.startTime,
                endTime: this.endTime,
                xaReig: this.curComCode,
            }
            if(this.gastype === 1){
                // compName
                Object.assign(obj,{compName: this.search})
                getCompsDetail(obj).then(res=>{
                    this.lastdata = res.data.data.shift()
                    this.tableData = res.data.data
                })
            }else{
                Object.assign(obj,{lifnrName: this.search})
                getLifnrsDetail(obj).then(res=>{
                    this.lastdata = res.data.data.shift()
                    this.tableData = res.data.data
                })
            }
        }
    }
}
</script>
<style scoped lang="scss">
    .gas-t{
        position: relative;
        margin:0 auto;
        width: 96%;
        min-width: 1400px;
        min-height: 601px;
        background: #FFFFFF;
        box-shadow: 0px 10px 20px rgba(38, 51, 88, 0.07);
        opacity: 1;
        border-radius: 12px;
        margin-bottom: 30px;
        .gas-t-e{
            margin-left: 30px;
            padding-top:18px;
            .gas-t-e-p{
                width: 96px;
                height: 33px;
                font-size: 24px;
                font-family: PingFang SC;
                font-weight: 500;
                line-height: 38px;
                color: #2C3E50;
                opacity: 1;
                margin:0;
            }
            .gas-t-s{
                display: block;
                padding-left: 25px;
            }
        }
        .gas-t-t{
            margin:13px 30px 0 30px;
            padding-bottom: 100px;
            // position: relative;
        }
        
    }
    ::v-deep .el-input__inner{
        // 框
        // margin-left: 25px;
        width: 230px;
        height: 46px;
        background: #F6F7FA;
        opacity: 1;
        border-radius: 200px;
        // 字
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 32px;
        color: #A6A9B4;
    }
    // table居中
    ::v-deep.el-table th > .cell {
    text-align: center;
    }
    ::v-deep.el-table .cell {
    text-align: center;
    }
    ::v-deep .gas-t-e-s{
        padding-left: 25px;
    }
    // ::v-deep .el-table__row:last-child{
    //     background: #FFFFFF;
    //     border: 1px solid black;
    //     box-shadow: 0px 2px 10px rgba(38, 51, 88, 0.12);
    //     font-weight: 600;
    //     line-height: 22px;
    //     color: #0FB2AB;
    //     border-radius: 100px;
    //     opacity: 1;
    // }
    .footer{
        position: absolute;
        bottom: 30px;
        width: 96%;
        height: 52px;
        background: #FFFFFF;
        box-shadow: 0px 2px 10px rgba(38, 51, 88, 0.12);
        opacity: 1;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        div{
            text-align:center;
            width: 20%;
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 600;
            line-height: 22px;
            color: #0FB2AB;
            opacity: 1;
        }
        .footer-one{
            color: #2C3E50;
        }
    }
</style>