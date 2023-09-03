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
          <!-- <el-table-column prop='contractNum' align='center'>
              <template slot-scope="scope">{{ reserveFourDecimal(scope.row.contractNum) }}</template>
          </el-table-column> -->
          <!-- 非合并行 -->
          <el-table-column>
            <template slot-scope='scope'>
                <el-table :data="scope.row.deliveryManagementVOList" :show-header="false"  cell-class-name="custom-table-cell" class="custom-table">
                    <el-table-column prop='downGasPlace' align='center'></el-table-column>
                    <el-table-column prop='dayNum' align='center'>
                        <template slot-scope='scope'>
                            <!-- {{ scope.row.dayNum === '0.0000' ? 0 : scope.row.dayNum}} -->
                            {{ reserveFourDecimal(scope.row.dayNum) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop='gasNum' align='center'>
                        <template slot-scope='scope'>
                            <!-- {{ scope.row.gasNum === '0.0' ? '0' : scope.row.gasNum }} -->
                            {{ reserveFourDecimal(scope.row.gasNum) }}
                        </template>
                    </el-table-column>
                      <!-- 变更日交割量*************************************************** -->
                    <el-table-column prop='changeGasNum' align='center'>
                        <template slot-scope='scope'>
                            <!-- {{ scope.row.gasNum === '0.0' ? '0' : scope.row.gasNum }} -->
                            {{ reserveFourDecimal(scope.row.changeGasNum) }}
                        </template>
                    </el-table-column>     
                    <el-table-column prop='msg' align='center'></el-table-column>
                </el-table>
            </template>
          </el-table-column>
          <el-table-column align='center'></el-table-column>
          <el-table-column align='center'></el-table-column>
          <el-table-column align='center'></el-table-column>
          <el-table-column align='center'></el-table-column>
          <el-table-column  label='操作' prop='status'>
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
            if(columnIndex === 2) {
                return {
                    rowspan: 1,
                    colspan: 5
                };
            }
            // 将索引值从3到6（不包含6）的列，其rowspan和colspan设置为0，设置为0后，这些列就隐藏了，最后一列（索引值为6的列、操作列）正常显示
            if(columnIndex > 2 && columnIndex < 7) {
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
        }      
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
</style>