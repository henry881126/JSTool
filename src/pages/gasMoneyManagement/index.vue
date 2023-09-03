<template>
  <div class='delivery-wrapper gas-page-bg'>
    <!-- <top-menu title='日交割管理' :datePickerShow='true'></top-menu> -->
    <top-menu title='余额查询'></top-menu>
    <DateRangePicker @handleDateChange='handleDateChange' class='dateRangePicker'></DateRangePicker>
        <div class="content-wrapper">
            <!-- 标题 -->
            <div class="title">
                <span class='t1'>{{ companyName }}</span>
                <div class='export' @click='gasMoneyBalanceExport' ><img :src="exportImg" class='export-img' /> 导出</div>
            </div>
            <div class="line"></div>
            <!-- 余额提醒 -->
            <div class="unit-tips-wrapper">
              <div class="unit">（单位：万元）</div>
              <div class="tips-wrapper" v-if='isShowTips'>
                  <img :src="warningImg" class="warning-img">
                  <span class="tips"> 煤层气业务余额 {{ tipsArr.balancePrice || '-' }} 万元，预计可用 {{ tipsArr.scheduledTime || '-' }} 天，请及时充值。</span>
                  <img :src="closeImg" class='close-img' @click='isShowTips = false' />
              </div>
            </div>
            <!-- 表格 -->
            <div class="table-wrapper">
                <el-table 
                  :data="list" 
                  ref='dayDeliveryTable'
                  stripe
                  class='table custom-table-r' 
                  header-row-class-name="custom-table-header"
                  header-cell-class-name="custom-table-header-cell"
                  cell-class-name="custom-table-cell"  
                >
                    <el-table-column  label='日期'>
                      <template slot-scope="scope">
                        {{ getFormatDate(scope.row.time,'/') }}
                      </template>
                    </el-table-column>
                    <el-table-column  label='供应商' prop='codeTxt'></el-table-column>
                    <el-table-column  label='预付气款' prop='prepaidPrice'>
                      <template slot-scope="scope">{{ reserveSixDecimal(scope.row.prepaidPrice) }}</template>

                    </el-table-column>
                    <el-table-column  label='采购单价（元/方）' prop='gasPrice'>
                      <template slot-scope="scope">{{ processPurchaseUnitPrice(scope.row.priceType,scope.row.gasPrice) }}</template>
                    </el-table-column>
                    <el-table-column  label='采购成本' prop='cost'>
                      <template slot-scope="scope">{{ reserveSixDecimal(scope.row.cost) }}</template>

                    </el-table-column>
                    <el-table-column  label='气款余额' prop='balancePrice'>
                      <template slot-scope="scope">{{ reserveSixDecimal(scope.row.balancePrice) }}</template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
  </div>
</template>

<script>
import TopMenu from '@components/topMenu/topMenu'
import api from 'src/http/api'
import dateFormater from '@components/dateFormater/dateFormater'
import DateRangePicker from './components/DateRangePicker.vue'
import exportApi from '/src/components/export/export'
import { decimalMixin} from '@utils/mixin'

export default {
  name:'dayDeliveryManagement',
  mixins:[dateFormater,exportApi,decimalMixin],
  components: {
      TopMenu,
      DateRangePicker
  },
  data() {
    return {
      list:[],
      checkStatus:null,       // 审批状态
      currentPage:1,
      pageSize:10,
      startTime:this.getFormatDate(new Date()-7*86400*1000),
      endTime:this.getFormatDate(new Date()-86400*1000),
      isShowTips:false,       // 是否显示余额提醒框
      tipsArr:[],             // 存储接口返回的余额数据
      exportImg:require('@assets/img/export.png'),          // 导出图标
      warningImg:require('@assets/img/warning.png'),       // 警示图标
      closeImg:require('@assets/img/close.png'),          // 关闭图标
    }
  },
  computed:{
    // 获取公司名称（右上角下拉列表中公司名称）
    companyName() {
      return this.$store.getters.curComName
    },
    // 公司编码
    companyCode() {
        return this.$store.getters.curCom
    }
  },
  methods: {
    // 请求接口，获取日计划上报列表
    getGasMoneyBalanceList() {
      let params = {
        compCode:this.$store.getters.curCom,
        startTime:this.startTime,
        endTime:this.endTime,
      }
      api.gasMoneyManagement.getGasMoneyBalanceList(params).then(res => {
        if(res && res.length > 0) {
          this.list = res
        }else {
          this.list = []
        }
      }).catch(err => {
      })
    },
    // 导出
    gasMoneyBalanceExport() {
      let params = {
        compCode:this.companyCode,
        startTime:this.startTime,
        endTime:this.endTime
      }
      api.gasMoneyManagement.gasMoneyBalanceExport(params).then(res => {
        // if(res) {
        // this.$message('导出成功')
        this.download(res, 'xlsx', '气款管理-余额查询')
        // }
      })
    },
    // 查询余额提醒
    gasMoneyBalanceRemind() {
      this.isShowTips = false
      let params = {
        compCode:this.$store.getters.curCom,
      }      
      api.gasMoneyManagement.gasMoneyBalanceRemind(params).then(res => {
        this.tipsArr = res[0]
        if(res[0].balancePrice && res[0].scheduledTime) {
          this.isShowTips = true
        }
      }).catch(err => {
        
      })
    },    
    // 子组件日期选择器事件
    handleDateChange(val) {
      if(val && val.length > 0) {
        this.startTime = this.getFormatDate(val[0])
        this.endTime = this.getFormatDate(val[1])
        this.getGasMoneyBalanceList()
      }
    }
  },
  watch: {
    companyCode() {
      this.getGasMoneyBalanceList()
      this.gasMoneyBalanceRemind()
    }
  },
  mounted() {
    this.getGasMoneyBalanceList()     // 表格列表     
    this.gasMoneyBalanceRemind()      // 余额提醒
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.delivery-wrapper { 
    width:100%;
    position: relative;
    .dateRangePicker {
      position:absolute;
      top:54px;
      left:255px;
    }
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
            .t1{
                margin-right: 10px;
            }
            .t2{
                color:#0FB2AB;
                margin-right: 15px;
            }
            .export {
                float:right;
                font-size: 16px;
                width:114px;
                height:46px;
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
        .unit-tips-wrapper {
          display: flex;
          justify-content: space-between;
          align-items:center;
          margin-top: 40px;
          margin-bottom: 10px;
          .tips-wrapper {
              float:right;
              background:#FFF1EA;
              padding:10px 20px;
              border-radius: 100px;
            .warning-img {
              width:20px;
              height:18px;
              position: relative;
              top:3px;
              margin-right:10px;
            }              
            .tips {
                color:#FF523C;
                font-size:16px;
                font-weight:bold;
            }
            .close-img {
                float:right;
                color:#FF523C;
                box-sizing: border-box;
                margin-top:3px;
              }
          }        
          .unit {
              float:left;
              color:#505356;
              font-size: 14px;          
          }
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
            .buttons-confirm,.buttons-confirmed {
                text-align: center;
            }
            .button-confirm{
                .confirm {
                    width:70px;
                }
                /deep/ .el-button--primary {
                    background: #0FB2AB;
                    color:#fff;
                }
            }  
            .button-confirmed{
                .confirmed {
                    width:70px;
                    cursor:default;
                }
                /deep/ .el-button--primary {
                    background: #E5F6F6;
                    color:#0FB2AB;
                    border:none;
                }                
            }                        
        }
    }
    /deep/.el-range-input {
      color:#eee!important;
    } 
}
</style>