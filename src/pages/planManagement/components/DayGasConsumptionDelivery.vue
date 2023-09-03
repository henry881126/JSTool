<template>
  <div class='delivery-wrapper'>
    <div class="content-wrapper">
        <!-- 标题 -->
        <div class="title">
            <span class='company-name'>{{ companyName }}</span>
            <div class='export' @click='dayDeliveryExport'><img :src="exportImg" class='export-img' /> 导出</div>
        </div>
        <!-- 分隔线 -->
        <div class='line'></div>
        <div class="unit">（单位：万方）</div>
        <!-- 表格 -->
        <div class="table-wrapper">
            <el-table 
              ref='dayDeliveryTable'
              :data="list" 
              :span-method="arraySpanMethod"
              stripe
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
                class="custom-table"
              style='width:100%'
              >
                <el-table-column type='index' align='center' width='80'></el-table-column>
                <el-table-column  label='日期'>
                  <template slot-scope="scope">
                    <!-- 具体数据 -->
                    <inner-table :data="scope.row" @handleConfirmClick='handleConfirmClick'></inner-table>
                    <!-- 合计行 -->
                    <el-table v-if="scope.row.deliveryManagementTotal.recordLines > 1" :data="[scope.row.deliveryManagementTotal]" :show-header="false" cell-class-name="custom-table-cell custom-table-cell-font-weight-600"
                          class="custom-table">
                      <el-table-column prop='time'></el-table-column>
                      <el-table-column align='center'></el-table-column>
                      <el-table-column prop='contractNum' align='center'>
                        <!-- <template slot-scope="scope">{{ reserveFourDecimal(scope.row.contractNum) }}</template> -->
                        <template slot-scope="scope">{{ reserveFourDecimal(scope.row.contractNum) }}</template>
                      </el-table-column>
                      <el-table-column prop='downGasPlace' align='center'></el-table-column>
                      <el-table-column prop='dayDesignation' align='center'>
                          <!-- {{ scope.row.dayNum === '0.0000' ? '0' : scope.row.dayNum }} -->
                        <!-- <template slot-scope="scope">{{ reserveFourDecimal(scope.row.dayDesignation) }}</template> -->
                        <template slot-scope="scope">{{ scope.row.dayDesignation }}</template>
                      </el-table-column>
                      <el-table-column prop='dayNumChange' align='center'>
                          <!-- {{ scope.row.dayNum === '0.0000' ? '0' : scope.row.dayNum }} -->
                        <!-- <template slot-scope="scope">{{ reserveFourDecimal(scope.row.dayNumChange) }}</template> -->
                        <template slot-scope="scope">{{ scope.row.dayNumChange }}</template>
                      </el-table-column>
                      <el-table-column prop='dayNum' align='center'>
                          <!-- {{ scope.row.dayNum === '0.0000' ? '0' : scope.row.dayNum }} -->
                        <!-- <template slot-scope="scope">{{ reserveFourDecimal(scope.row.dayNum) }} </template> -->
                        <template slot-scope="scope">{{ scope.row.dayNum }} </template>
                      </el-table-column>
                      <el-table-column prop='gasNum' align='center'>
                          <!-- {{ scope.row.gasNum === '0.0' ? 0 : scope.row.gasNum }} -->
                        <!-- <template slot-scope="scope">{{ reserveFourDecimal(scope.row.gasNum) }}</template> -->
                        <template slot-scope="scope">{{ scope.row.gasNum }}</template>
                      </el-table-column>
                      <el-table-column prop='dayExacutiveRate' align='center'>
                          <!-- {{ scope.row.gasNum === '0.0' ? 0 : scope.row.gasNum }} -->
                        <template slot-scope="scope">{{ reserveFourDecimal(scope.row.dayExacutiveRate) }}</template>
                      </el-table-column>
                      <el-table-column align='center'></el-table-column>
                      <!-- <el-table-column align='center'></el-table-column> -->
                      <!-- <el-table-column align='center'></el-table-column>
                      <el-table-column align='center'></el-table-column> -->
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column  label='资源方' align='center'></el-table-column>
                <el-table-column  label='日合同量' align='center'></el-table-column>
                <el-table-column  label='输气站场' align='center'></el-table-column>
                <el-table-column  label='日指定量' align='center'></el-table-column>
                <el-table-column  label='变更量' align='center'></el-table-column>
                <el-table-column  label='批复量' align='center'></el-table-column>
                <el-table-column  label='日交割量' align='center'></el-table-column>
                <el-table-column  label='执行率' align='center'></el-table-column>
                <el-table-column  label='操作'></el-table-column>
            </el-table>
        </div>
    </div>
  </div>
</template>

<script>
var flag=2;
import api from 'src/http/api'
import dateFormater from '@components/dateFormater/dateFormater'
import exportApi from '/src/components/export/export'
import InnerTable from '../components/InnerTable.vue'
import { decimalMixin } from '@utils/mixin'

export default {
  name:'dayDeliveryManagement',
  mixins:[dateFormater,exportApi,decimalMixin],
  components: {
      InnerTable      
  },
  props:{
      // 父组件日期选择器起止日期
      startTime:{
          type:String
      },
      endTime: {
          type:String
      }
  },
  data() {
    return {
      list:[],
      checkStatus:null,       // 审批状态
      currentPage:1,
      pageSize:10,
    //   startTime:this.getFormatDate(new Date()-7*86400*1000),
    //   endTime:this.getFormatDate(new Date()),
      exportImg:require('@assets/img/export.png'),          // 导出按钮用图标
      calssificationSummary:[],         // 存储列表按日期分类汇总后的数据
      uniqueDate:[],      // 列表中所有time去重后数据
    }
  },
  computed:{
    // 获取公司名称（右上角下拉列表中公司名称）
    companyName() {
      return this.$store.getters.curComName
    },
    companyCode() {
        return this.$store.getters.curCom
    },
    // 父组件日期选择器起止日期
    startEndTime() {
        const {startTime,endTime} = this
        return {
            startTime,
            endTime
        }
    }
  },
  methods: {
    // 请求接口，获取日计划上报列表
    getDayDeliveryList() {
      this.calssificationSummary = []
      let params = {
        code:this.$store.getters.curCom,
        current:this.currentPage,
        pageSize:this.pageSize,
        startTime:this.startTime,
        endTime:this.endTime,
      }
      api.planManagement.getDayDeliveryList(params).then(res => {
        this.list = res[0]
        // 从第2条记录开始，将每条记录的deliveryManagementTotal中增加recordLines属性，其值是['dayDeliveryComp']['deliveryManagementVOList']中记录数量，当recordLines值大于1时，才显示合并行
        for(let i=1; i<this.list.length; i++) {
          this.list[i]['deliveryManagementTotal']['recordLines'] = this.list[i]['dayDeliveryComp']['deliveryManagementVOList'].length
        }
        // 在第一条记录中增加deliveryManagementTotal属性，并将其recordLines属性值设置为2（设置为大于1的任何值均可，根据模块中合计行显示条件，设置为大于1的值，则会显示出顶部的总合计行）
        this.list[0]['deliveryManagementTotal']['recordLines'] = 2  
        // this.list.shift()
        console.log('1 res list:',this.list)
      }).catch(err => {

      })
    },  
    // 导出
    dayDeliveryExport() {
      let params = {
        code:this.companyCode,
        startTime:this.startTime,
        endTime:this.endTime
      }
      api.planManagement.dayDeliveryExport(params).then(res => {
        // if(res) {
        // this.$message('导出成功')
        this.download(res, 'xlsx', '日交割列表')
        // }
      })
    },
    // 子组件日期选择器事件
    handleDateChange(val) {
      if(val && val.length > 0) {
        this.startTime = this.getFormatDate(val[0])
        this.endTime = this.getFormatDate(val[1])
        this.getDayDeliveryList()
      }
    },
    // 表格列合并
    arraySpanMethod: function ({ columnIndex }) {
      // 从第1列开始，将其后的7列合并为1列，这在1列中（由7列合并）放置InnerTable和合计行
      if(columnIndex === 1) {
        return {
          rowspan: 1,
          colspan: 10
        };
      }
      if(columnIndex > 1) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },  
    // 监听子组件“确定”按钮事件，单击“确定”按钮后，刷新列表
    handleConfirmClick() {
      this.getDayDeliveryList()
    }  
  },
  watch: {
    companyCode() {
      this.getDayDeliveryList()
    },
    // 监听日期选择器，时间变化则重新请求数据
    startEndTime(newVal,oldVal) {
        if(newVal !== oldVal) {
            this.getDayDeliveryList()
        }
    }
  },
  mounted() {
    console.log(this.$store.getters.curCom)
    this.getDayDeliveryList()     
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.delivery-wrapper { 
    width:100%;
    position: relative;
    .content-wrapper {
        position: relative;
        width:calc(100% - 62px); 
        background:#fff;
        border-radius: 10px;
        margin-left:32px;
        margin-top: 35px;
        padding:20px 30px;
        box-sizing: border-box;
        .title {
            font-size: 24px;
            font-weight: 500;
            margin-bottom: 28px;
            .company-name{
                margin-right: 10px;
            }
            .export {
                width:120px;
                height: 46px;
                float:right;
                font-size: 16px;
                border-radius: 23px;
                background:#E5F6F6;
                color:#0FB2AB;
                text-align: center;
                line-height: 46px;
                cursor:pointer;   
                box-sizing: border-box;             
                .export-img {
                  width:24px;
                  height:24px;
                  position:relative;
                  top:5px;
                  right:3px;
                }
            }
        }
        .line {
          border-bottom:1px solid #E5E5E5;
          width:100%;
          position: absolute;
          top:80px;
          left:0;
        }        
        .unit {
            color:#505356;
            font-size: 14px;
            margin-top: 53px;
            margin-right: 30px;
            margin-bottom: 22px;
        }
        .table-wrapper {
            .table {
    
            }
            /* 表格标题和数据居中对齐 */
            /deep/.el-table th > .cell {
              text-align: center;
            }
            /deep/.el-table .cell {
              text-align: center;
            }
            .button-confirm{
                .confirm {
                }
                /deep/ .el-button--primary {
                    background: #0FB2AB;
                    color:#fff;
                    width:80px;
                    height:36px;                }
            }  
            .button-confirmed{
                .confirmed {
                    cursor:default;
                }
                /deep/ .el-button--primary {
                    background: rgba(15,178,171,.1);
                    color:#0FB2AB;
                    border:none;
                    width:80px;
                    height:36px;
                }                
            }  
            // 鼠标移动到行上时，整个分类为同一个背景色  
            .custom-table {
              background-color: transparent !important;
              /deep/ tr {
                background-color: transparent !important;
              }
            }                                
        }
    }
    /deep/.el-range-input {
      color:#eee!important;
    } 
    /deep/ .el-table tbody tr:hover>td {
        background-color:#f5f5f5 !important
    }    
}
</style>