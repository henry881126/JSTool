<template>
  <div>
      <el-table
            :data="[data.dayDeliveryComp]"
            :show-header="false" 
            cell-class-name="custom-table-cell"
            :span-method="arraySpanMethod"
            class="custom-table"
            :cell-style='cellStyle'
            >
        <!-- 合并行 -->
          <el-table-column prop='time' align='center'></el-table-column>
          <el-table-column prop='resourcesName' align='center'></el-table-column>
          <el-table-column prop='contractNum' align='center'>
              <template slot-scope="scope">
                  {{ reserveFourDecimal(scope.row.contractNum) }}
                   <!-- {{ scope.row.contractNum === '0.0000' ? "0.0000" : scope.row.contractNum}} -->
                  </template>
          </el-table-column>
          <!-- 非合并行 -->
          <el-table-column>
            <template slot-scope='scope'>
                <el-table :data="scope.row.deliveryManagementVOList" :show-header="false"  cell-class-name="custom-table-cell" class="custom-table">
                    <el-table-column prop='downGasPlace' align='center'></el-table-column>
                    <el-table-column prop='dayDesignation' align='center'>
                        <template slot-scope='scope'>
                            {{ scope.row.dayDesignation === '0.0000' ? "0.0000" : scope.row.dayDesignation}}
                            <!-- {{ reserveFourDecimal(scope.row.dayDesignation) }} -->
                        </template>
                    </el-table-column>
                       <el-table-column label='批复量' prop='dayNumChange' align='center'>
                    <template slot-scope="scope">
                        <!-- {{ reserveFourDecimal(scope.row.dayNumChange) }} -->
                          {{ scope.row.dayNumChange === '0.0000' ? '0.0000' : scope.row.dayNumChange }}
                        </template>
                    </el-table-column>
                      <el-table-column label='变更批复量' prop='dayNum' align='center'>
                    <template slot-scope="scope">
                        <!-- {{ reserveFourDecimal(scope.row.dayNum) }} -->
                          {{ scope.row.dayNum === '0.0000' ? '0.0000' : scope.row.dayNum }}
                        </template>
                    </el-table-column>
                    <el-table-column prop='gasNum' align='center'>
                        <template slot-scope='scope'>
                            {{ scope.row.gasNum === '0.0000' ? '0.0000' : scope.row.gasNum }}
                            <!-- {{ reserveFourDecimal(scope.row.gasNum) }} -->
                        </template>
                    </el-table-column> 
                 
                  
                    <el-table-column label='执行率' prop='dayExacutiveRate' align='center'>
                    <template slot-scope="scope">{{ reserveFourDecimal(scope.row.dayExacutiveRate) }}</template>
                    </el-table-column>

                </el-table>
            </template>
        
          </el-table-column>
            <el-table-column align='center'></el-table-column>
          <el-table-column align='center'></el-table-column>
          <el-table-column align='center'></el-table-column>
          <el-table-column align='center'></el-table-column>
          <el-table-column align='center'></el-table-column>
          <el-table-column  label='操作' prop='status'>
                <template slot-scope='scope'>
                    <div>
                        <div class='button-confirm' v-if="scope.row.status === '0'">
                            <el-button round size='mini' type='primary' class='confirm' @click='confirmBalance(scope.row.id)'>确认</el-button>
                        </div>
                        <div class="button-confirmed" v-else>
                            <el-button round size='mini' type='primary' class='confirmed'>已确认</el-button>
                        </div>
                    </div>
                </template>
          </el-table-column>    
      </el-table>
  </div>
</template>

<script>
import api from 'src/http/api'
import { decimalMixin } from '@utils/mixin'

export default {
    name:'innerTable',
    mixins:[decimalMixin],
    props:{
        data:Object
    },
    methods:{
        // 列合并规则
        arraySpanMethod: function ({ columnIndex }) {
            // 从索引值为3的列开始（列索引值从0开始），合并3列，即把第4、5、6列（输气场站、日指定量、日交割量）合并为1列，在此列中显示另一个table（此table中为多行数据）
            if(columnIndex === 3) {
                return {
                    rowspan: 1,
                    colspan: 6
                };
            }
            // 将索引值从3到6（不包含6）的列，其rowspan和colspan设置为0，设置为0后，这些列就隐藏了，最后一列（索引值为6的列、操作列）正常显示
            if(columnIndex > 3 && columnIndex < 9) {
                return {
                    rowspan: 0,
                    colspan: 0
                };
            }
        },
        // 单元格样式
        cellStyle(row) {
            // console.log('rowwwwwwww',row)
            if(row.row.time === '合计') {
                return "background:#f4f7fa;color:#0FB2AB;fontSize:16px;fontWeight:600"
            }
        },
        // 确定按钮事件
        confirmBalance(id) {
            // console.log('iddddddddddddddd',id)
            let params = {
                id
            }
            api.planManagement.confirmBallance(params).then(res => {
            if(res) {
                this.$message({
                message:'确认成功！',
                type:'success'
                })
                this.$store.dispatch('setTips',id)    // 在菜单中监听确定按钮
                this.$emit('handleConfirmClick')      // 单击“确定”按钮后，在父组件中监听此事件，更新列表
            }
            })
        },        
    }
}
</script>

<style scoped lang="scss">
  .custom-table {
    background-color: transparent !important;
    /deep/ tr {
      background-color: transparent !important;
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
  }
</style>