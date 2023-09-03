<template>
  <div class='delivery-wrapper'>
    <div class="content-wrapper">
        <!-- 标题 -->
        <div class="title">
            <span class='company-name'>{{ companyName }}</span>
            <div 
              v-if="!isDisable"
              class='confirmAll' 
              style="background:#fff;color:#606266;border:1px solid #DCDFE6;cursor:not-allowed;" 
              >
              <img :src="confirmAllImg" class='export-img' :style="isDisable ? '' : 'filter:grayscale(100%)'" /> 一键确认
            </div>
            <div 
              v-else
              class='confirmAll' 
              @click='confirmDialogVisible = true'>
              <img :src="confirmAllImg" class='export-img' /> 一键确认
            </div>            
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
              stripe
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
              class="custom-table"
              style='width:100%'
              >
                <el-table-column type='index' align='center' width='80'></el-table-column>
                <el-table-column label='日期' prop='time' align='center'></el-table-column>
                <el-table-column label='资源方' prop='resourcesName' align='center'></el-table-column>
                <el-table-column label='输气站场' prop='downGasPlace' align='center'></el-table-column>
                <el-table-column label='日指定量' prop='dayNum' align='center'>
                  <template slot-scope="scope">
                    <!-- {{ reserveFourDecimal(scope.row.dayNum) }} -->
                    {{ scope.row.dayNum === '0.0000' ? "0.0000" : scope.row.dayNum}}
                    </template>
                </el-table-column>
                <el-table-column label='日交割量' prop='gasNum' align='center'>
                  <template slot-scope="scope">
                    <!-- {{ reserveFourDecimal(scope.row.gasNum) }} -->
                    {{ scope.row.gasNum === '0.0000' ? "0.0000" : scope.row.gasNum}}
                    </template>
                </el-table-column>
                <el-table-column label='变更日交割量' prop='changeGasNum' align='center'>
                  <template slot-scope="scope">
                    <!-- {{ reserveFourDecimal(scope.row.changeGasNum) }} -->
                    {{ scope.row.changeGasNum === '0.0000' ? "0.0000" : scope.row.changeGasNum}}
                    </template>
                   
                </el-table-column>   
                <el-table-column label='变更原因' prop='msg' align='center'></el-table-column>
                <el-table-column label='操作' prop='status'>
                  <template slot-scope='scope'>
                      <div class='button-confirm' v-if="scope.row.status === '0'">
                          <span class='nonConfirmed'></span><span type='primary'>未确认</span>
                      </div>
                      <div class="button-confirmed" v-else>
                          <span class='confirmed'></span><span type='primary'>已确认</span>
                      </div>
                  </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 单击一键确认按钮时弹出此对话框 -->
        <el-dialog
            title=""
            :visible.sync="confirmDialogVisible"
            class="custom-dialog"
            width="30%">
          <span style="font-size: 24px;font-weight: bold;">确定将变更历史气量进行一键确认吗？</span>
          <span slot="footer" class="dialog-footer">
                <el-button @click="confirmDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAll">确 定</el-button>
              </span>
        </el-dialog>        
    </div>
  </div>
</template>

<script>
import api from 'src/http/api'
import dateFormater from '@components/dateFormater/dateFormater'
import exportApi from '/src/components/export/export'
import InnerTableChangeHistory from '../components/InnerTableChangeHistory.vue'
import { decimalMixin } from '@utils/mixin'

export default {
  name:'dayDeliveryManagement',
  mixins:[dateFormater,exportApi,decimalMixin],
  components: {
      InnerTableChangeHistory      
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
      // pager: {
      //     total:5,
      //     currentPage:1,
      //     pageSize:2,
      // },
      exportImg:require('@assets/img/export_new@2x.png'),          // 导出按钮用图标
      confirmAllImg:require('@assets/img/check_mark.png'),      // 下载图标
      uniqueDate:[],      // 列表中所有time去重后数据
      confirmDialogVisible:false,   // 单击一键确认后，是否弹出dialog
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
    },
    // 判断一键确认按钮状态（有未确认记录则一键确认按钮可用，无未确认记录则一键确认按钮不可用）
    isDisable() {
      return this.list.some(item => item.status === "0")  // 1 未确认
    }
  },
  methods: {
    // 请求接口，获取日交割列表
    getDayDeliveryList() {
        console.log('5553')
      let params = {
        code:this.$store.getters.curCom,
        // current:this.pager.currentPage,
        // pageSize:this.pager.pageSize,
        startTime:this.startTime,
        endTime:this.endTime,
      }
      api.planManagement.getDayDeliveryListChangeHistory(params).then(res => {
        this.list = res[0]

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
      api.planManagement.changeHistoryDeliveryGasConsumptionExport(params).then(res => {
        // if(res) {
        // this.$message('导出成功')
        this.download(res, 'xlsx', '变更历史交割气量列表')
        // }
      })
    },
    // 一键确认
    confirmAll() {
        const params = {
            compCode:this.$store.getters.curCom,
        }
        api.planManagement.changeHistoryDeliveryGasConsumptionConfirm(params).then(res => {
            if(res) {
                this.$message({
                    message: '一键确认成功',
                    type: 'success',
                    duration:3000
                });
                this.confirmDialogVisible = false
                this.getDayDeliveryList()
            }
        })
    },
    // 表格列合并
    arraySpanMethod: function ({ columnIndex }) {
      // 从第1列开始，将其后的7列合并为1列，这在1列中（由7列合并）放置InnerTable和合计行
      if(columnIndex === 1) {
        return {
          rowspan: 1,
          colspan: 8
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
            .confirmAll {
                cursor:pointer;
                margin-left:20px;
                float:right;
                width:152px;
                height:46px;
                line-height: 46px;
                text-align:center;
                color:#0FB2AB;
                font-size:16px;
                background: rgba(15, 178, 171, 0.1);
                border-radius: 23px;
                .export-img {
                  width:24px;
                  height:24px;
                  position:relative;
                  top:5px;
                  right:3px;
                }
                &:hover {
                  background: #22B2AA;
                  color: #fff;
                  .export-img {
                    filter: grayscale(100%) brightness(200%);
                  }
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
            overflow: hidden;
            /* 表格标题和数据居中对齐 */
            /deep/.el-table th > .cell {
              text-align: center;
            }
            /deep/.el-table .cell {
              text-align: center;
            }
            // 鼠标移动到行上时，整个分类为同一个背景色  
            .custom-table {
              background-color: transparent !important;
              /deep/ tr {
                background-color: transparent !important;
              }
            }    
            .page-wrapper {
                margin-top:20px;
            }   
            .custom-table {
                background-color: transparent !important;
                /deep/ tr {
                  background-color: transparent !important;
                }
                .button-confirm{
                    .nonConfirmed {
                        display: inline-block;
                        width:8px;
                        height:8px;
                        border-radius: 50%;
                        background:#FF523C;
                        margin-right:6px;
                        margin-bottom: 1px;            
                    }
                    /deep/ .el-button--primary {
                        background: #0FB2AB;
                        color:#fff;
                        width:80px;
                        height:36px;                
                    }
                }  
                .button-confirmed{
                    .confirmed {
                        display: inline-block;
                        width:8px;
                        height:8px;
                        border-radius: 50%;        
                        background:#0FB2AB;
                        margin-right:6px;
                        margin-bottom: 1px;
                    }        
                    /deep/ .el-button--primary {
                        background: rgba(15,178,171,.1);
                        color:#0FB2AB;
                        border:none;
                        width:80px;
                        height:36px;
                    }                
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