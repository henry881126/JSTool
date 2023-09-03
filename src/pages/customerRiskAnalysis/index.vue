<template>
    <div class="gas-page-bg">
        <top-menu :date-picker-show="false" :input-show="true"
                title="重要用户风险列表" @curComChanged='curComCodeChanged' @handleKeywordInput="handleKeywordInput">
        </top-menu>    
        <!-- <div class="left-con">
            <div class="left-mar">
                <el-input placeholder="选择" prefix-icon="el-icon-search" class="search" size="small"></el-input> 
            </div>
        </div> -->
        <div class="right-part">  
            <div class="customet-list">
                <div class="risk-title-wapper">
                    <div class="risk-title">风险列表</div>
                    <!-- <el-button round plain type="success" @click="exportExcel()" class="custom-button" icon="el-icon-upload2">导出</el-button> -->
                </div>
                <el-table 
                    :data="list" 
                    @cell-click='handleCellClick'
                    stripe
                    header-row-class-name="custom-table-header"
                    header-cell-class-name="custom-table-header-cell"
                    cell-class-name="custom-table-cell"
                    class="custom-table-r"   
                    >
                    <el-table-column prop="name" label="客户名称" align="left"  header-align="center" min-width="140"></el-table-column>
                    <el-table-column prop="bp" label="BP号" align="center" header-align="center" width="150"></el-table-column>
                    <el-table-column prop="address" label="客户地址" align="left" header-align="center" min-width="150"></el-table-column>
                    <el-table-column prop="typeValue" label="客户类型" width="120" align="center" header-align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="industryValue" label="所属行业" align="center" header-align="center" width="125" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="startDate" width="147" align="center" header-align="center" label="供能起始日期" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dangerLevel" label="风险等级" align="center" header-align="center"
                        :filters="[{ text: '未评估', value: '未评估' }, { text: '不评估', value: '不评估' },
                        { text: '高风险', value: '高风险' },{ text: '中风险', value: '中风险' },{ text: '低风险', value: '低风险' },]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end"
                    > 
                        <template slot-scope="scope">
                        <el-button :type="scope.row.level==='不评估'?'primary' 
                        :scope.row.level==='高风险'?'danger' 
                        :scope.row.level==='中风险'?'warning'
                        :scope.row.level==='低风险'?'success'
                        :scope.row.level==='不评估'?'info':''
                        ">{{scope.row.level}}</el-button>
                        <!-- scope.row.tag==='未评估'?'info':'danger' -->
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-wrapper custom-page">
                    <el-pagination
                        v-if = 'countList'
                        class='pagination-style111'
                        @current-change='handleCurrentPageChange'
                        @size-change='handleSizeChange'
                        background
                        layout="prev, pager, next"
                        :total="total"
                        :page-size="pageSize"
                        :page-sizes="[10,20,30,40,50,100,200]">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.container {
    width:100%;
}
.right-part{
    z-index: 999;
    position: relative;
    width:100%;
    margin-top:20px;
}

.left-con{
    display:inline-block;
    position: relative;
    top:-35px;
    left:350px;
}
.text{
    font-size: 24px;
    color: #fff;
    margin: 0 10px 0 15px;
}
.search{
    display: inline-block;
    border-radius: 10px;
    width: 150px;
    margin-left: 20px;
    border: 5px;
}
.el-input__inner{
    border-radius: 40px;
}
.customet-list{
    padding:22px;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #ddd;
    z-index: 1;
    width: 95%;
    margin: auto;
    overflow:hidden;
}
/*  表格上面标题区域相关样式 */
.risk-title-wapper {
  height: 46px;
  width: calc(100% - 60px);
  margin-top: 16px;
  line-height: 46px;
  margin-left: 30px;
  margin-bottom: 30px;
}
.risk-title {
  display: inline-block;
  width: 100px;
  float: left;
  font-size: 24px;
  font-weight: 500;
  color: #2C3E50;
  opacity: 1;
}
.custom-button {
    float: right;
    margin-top: 2px;
}
/*  分页样式 */
.page-wrapper {
    margin-top: 20px;
  }
</style>
<style>
    .el-input__inner{
        border-radius: 80px;  
    }
    .el-button{
        border-radius: 20px;
    }
    </style>
<script>
import api from '../../http/api'
import topMenu from '../../components/topMenu/topMenu'
import exportApi from '/src/components/export/export'
import mergeTableRow from '/src/components/mergeTableRow/reply'


export default {
    mixins: [exportApi, mergeTableRow],
    components: {
        topMenu
    },
    data() {
        return {
            browerTime:0,
            timer:null,            
            input1:'',
            list:[],
            //    list1: {'danger':list.tag==='高风险','info':list.tag==='低风险'},
            total:0,
            currentPage:0,
            pageSize:20
        };
    },
    computed: {
        curComCode: function () {
            return this.$store.getters.curCom
        },
        countList: function() {
            return this.list.length > 0
        }
    },
    created() {
        window.zhuge.track('气量分析-进入客户风险值分析页面',{'页面名称':'客户风险值分析页面'})
    },
    mounted() {
        this.getBrowerTime()
        this.getCustomerRiskAnalysis()
    },
    beforeDestroy() {
        clearInterval(this.timer)
        window.zhuge.track('气量分析-客户风险值分析页面停留时长',{'客户风险值分析页面停留时长':this.browerTime})
    },     
    methods: {
        getBrowerTime() {
        this.timer = setInterval(() => {
            this.browerTime++
        }, 1000);
        }, 
        handleKeywordInput() {
            this.getCustomerRiskAnalysis()
        },
        exportExcel: function () {
            let params = {
                cpmoCop: this.curComCode,
                // startTime: this.startTime.toString(),
                // endTime: this.endTime.toString()
            }
            api.reply.export(params).then((res) => {
                this.download(res, 'xls', 'export')
            })
        },
        // 子组件事件
        curComCodeChanged(){
            this.getCustomerRiskAnalysis()
        },
        handleSizeChange(size) {
            this.pageSize = size
            this.getCustomerRiskAnalysis()
        },
        // 客户名称单元格单击事件
        handleCellClick(row, column, cell, event) {
            console.log('table click',row)
            this.$router.push({
                name:'customerRiskAnalysisDetail',
                params:{
                    codeType:'bp',
                    companyCode:row.branchCompanyCode,
                    customerCode:row.bp,
                    customerType:row.customerTypeId,
                    // companyCode:'0611',
                    // customerCode:'0002710528',
                    // customerType:'10440',
                    level:row.level,                    // 风险等级
                    address:row.address,                // 客户地址
                    name:row.name,                      // 客户名称
                    startDate:row.startDate,            // 起始日期
                    typeValue:row.typeValue,            // 客户类型
                    industryValue:row.industryValue     // 所属行业
                }
            })
        },
        // 当前页改变事件
        handleCurrentPageChange(val){
            this.currentPage = val
            console.log(this.currentPage)
            this.getCustomerRiskAnalysis(val)
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        // 获取客户风险列表
        getCustomerRiskAnalysis(pageNum = 1) {
            console.log('statewwwwwww',this.$store.getters.keyword)
            
            console.log('curcomcode',this.curComCode)
            let params = {
                orgCode:this.curComCode,
                // orgCode:'5031932',
                pageNum,
                pageSize:this.pageSize,
                keyValue:this.$store.getters.keyword,
                customerType:'',
                openGasNumMin:'',
                openGasNumMax:'',
                yearGasNumMin:'',
                yearGasNumMax:'',
                airSupplyDateMin:'',
                airSupplyDateMax:'',
                orderByCaseKey:'',
                orderByCaseValue:'',
                customerLevel:'',
                riskLevel:"[2,3,4]",
                energyRisk:''
            }
            api.gasReservesAnalysis.getCustomerRiskAnalysis(params).then(res => {
                    console.log('return res',res)
                    this.list = res.data.result.list
                    this.total = res.data.result.total
            })
        }      
    }
};
</script>
