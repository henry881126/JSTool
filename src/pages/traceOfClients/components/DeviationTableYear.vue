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
        <el-table-column label='去年同月用气量' prop='lastyAbrmenge'></el-table-column>
        <el-table-column sortable="custom" label='同比气量偏差' prop='yearDeviation'></el-table-column>
        <el-table-column sortable="custom" label='同比偏差率' prop='yGrowth'></el-table-column>
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
    name:'deviationTableYear',
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
      currentDate: {
        type:String
      },
      total:{             // 记录总数，分页用
        type:Number,
        default:null
      },
    },
    methods: {
      // res值行数据对象
      handleInputChange(row) {
        let params = {
          budat:this.currentDate,
          compCode:row.compCode,
          cuslabel:row.cuslabel,
          partner:row.partner,
          remark:row.remark
        }
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
      handleSortChange({prop,order}) {
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