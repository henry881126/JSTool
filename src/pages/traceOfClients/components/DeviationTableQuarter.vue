<template>
  <div class="container">
      <el-table 
        :data="list" 
        stripe
        header-row-class-name="custom-table-header"
        header-cell-class-name="custom-table-header-cell"
        cell-class-name="custom-table-cell"
        class="custom-table-r"   
        @sort-change="handleSortChange"
        >
        <el-table-column label='客户名称' prop='partnerTxt'></el-table-column>
        <el-table-column label='本月用气量' prop='vAbrmenge'></el-table-column>
        <el-table-column label='上月用气量' prop='lastmAbrmenge'></el-table-column>
        <el-table-column sortable="custom" label='环比气量偏差' prop='monthDeviation'></el-table-column>
        <el-table-column sortable="custom" label='环比偏差率' prop='mGrowth'></el-table-column>
        <el-table-column label='偏差原因分析' column-key="index">
          <template slot-scope='scope'>
            <el-input placeholder="请输入" size='small' v-model="scope.row.remark" @change='handleInputChange(scope.row)'></el-input>
          </template>
        </el-table-column>
    </el-table>
    <div class="page-wrapper custom-page">
      <el-pagination
              layout="prev, pager, next"
              :page-size="pageSize"
              :current-page="currentPage"
              :total="total"
              @current-change='handleCurrentPageChange'
              >
      </el-pagination>
    </div>    
  </div>
</template>

<script>
import api from '/src/http/api'

export default {
    name:'deviationTableQuarter',
    data() {
         return {
           deviationReasonTxt:'',     // 偏差原因分析文本框
           currentPage:1,
           pageSize:10,           
        }
    },
    props:{
      headerTitleArr: {
        type:Array
      },
      list: {
        type:Array
      },
      // 从父组件传递过来的当前选择日期，下面请求接口中需要传递此日期值
      currentDate: {
        type:String
      },
      total:{             // 记录总数，分页用
        type:Number,
        default:null
      },      
    },
    methods: {
      // res Object 行对象（包含当前行的数据）
      handleInputChange(row) {
        let params = {
          budat:this.currentDate,
          compCode:row.compCode,
          cuslabel:row.cuslabel,
          partner:row.partner,
          remark:row.remark
        }
        // 发送请求，保存文本框中数据
        api.gasReservesAnalysis.editCustomerDeviationExplain(params).then(res => {
          if(res) {
            this.$message({
              message:'偏差原因分析修改成功！',
              type:'success'
            })
          }
        })
      },
      // 表格列 排序事件
      handleSortChange({prop, order}) {
        // prop参数：排序字段名，order参数：排序方式
        this.$emit('handleSortChange',{prop,order})
      },
      // 分页切换事件
      handleCurrentPageChange(currentPgaeNum) {
        this.currentPage = currentPgaeNum
        this.$emit('handleCurrentPageChange',currentPgaeNum)
      }      
    }
}
</script>

<style scoped>
.page-wrapper {
  margin-top:20px;
}
</style>