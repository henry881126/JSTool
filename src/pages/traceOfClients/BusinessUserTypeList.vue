<template>
  <div class="gas-page-bg">
    <!-- 一 头部 -->
    <top-menu title="工商客户类型维护" :logoutShow='false' :companyShow='false'></top-menu>
    <!-- 二 搜索表单 -->
    <div class="customer-type-form-wrapper">
      <el-form :inline='true' :model='formData'>
        <el-form-item label='用气性质' style='margin-right:40px;'>
          <!-- 要求取消查询按钮，从下拉列表中选择某项时，则请求数据，故下面代码中加给@change='this.onSubmit' -->
          <el-select v-model='formData.gasNature' @change='this.onSubmit'>
            <el-option v-for='(item,index) in formData.gasNatureArr' :key='index' :label='item.name' :value='item.id'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='客户名称'>
          <el-input placeholder="请输入公司名称" v-model='formData.customerName' @change='this.onSubmit'></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type='success' round @click='onSubmit'>查询</el-button>
        </el-form-item> -->
      </el-form>
      <div class='customer-type-return-business-user' @click='backToBusinessUser'>
        <el-button round type='success' size='mini'>返回 <i class='el-icon-arrow-right'></i></el-button>
      </div>
    </div>
    <!-- 三 表格 -->
    <div class="customer-type-table-wrapper">
      <!-- 表格主体 -->
      <el-table 
          :data="list" 
          stripe
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          class="custom-table-r"   
          >
          <el-table-column label='编号' prop='partner'></el-table-column>
          <el-table-column label='公司名称' prop='mcName1'></el-table-column>
          <el-table-column label='用气性质' prop='gasNature'>
            <template slot-scope='scope'>
              <el-select v-model='scope.row.gasNature' @change='handleCellSelectChange(scope)' size='mini'>
                <!-- label 显示的文本 -->
                  <el-option v-for='(item,index) in getGasNatureArrWithoutAll' :key='index' :label='item.name' :value='item.id'></el-option>
              </el-select>
            </template>
          </el-table-column>
      </el-table>
      <!-- 分页 -->
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
  </div>
</template>

<script>
import topMenu from "../../components/topMenu/topMenu";
import api from "../../http/api"

export default {
  data() {
    return {
      formData:{
        gasNature:'全选',                 // 用气性质
        customerName:'',            // 客户名称
        gasNatureArr: [            // 用户分类（下拉列表中使用）
          {
            id: '0',
            name: '全选'
          },
          {
            id: '1',
            name: '餐饮'
          },
          {
            id: '2',
            name: '采暖'
          },
          {
            id: '3',
            name: '洗浴'
          },
          {
            id: '4',
            name: '工业'
          },
          {
            id: '5',
            name: '福利'
          },
          {
            id: '6',
            name: '能源'
          },
         {
            id: '7',
            name: '停用'
          },          
        ],         
      }, 
      currentSelectVal:'',     // select下拉框中当前选中option的label值
      list:[],
      pageSize:10,
      currentPage:1,
      total:null
    }
  },
  computed: {
    // 从用气分类下拉列表中去除全选项，做为表格记录中用气性质列下拉列表的值
    getGasNatureArrWithoutAll() {
      let arr = JSON.parse(JSON.stringify(this.formData.gasNatureArr))
      return arr.splice(1,7)
    }
  },
  components: {
    topMenu
  },
  methods: {
    // 表格中下拉列表事件，修改当前记录的客户用气类型
    handleCellSelectChange({row}) {
      let params = {
        compCode:row.compCode,
        gasNature:row.gasNature,
        partner:row.partner
      }
      api.gasReservesAnalysis.editBusinessUserGasType(params).then(res => {
        if(res) {
          this.$message({
            message:'客户用气类型更新成功！',
            type:'success'
          })
        }
      })
    },
    // 查询按钮事件
    onSubmit() {
      this.getBusinessUserTypeList()
    },
    // 列表数据
    getBusinessUserTypeList() {
      let params = {
        compCode:'0571',
        gasNature:this.formData.gasNature === '全选' ? 0 : this.formData.gasNature,
        pageIndex:this.currentPage,
        pageSize:10,
        mcName1:this.formData.customerName
      }
      api.gasReservesAnalysis.getBusinessUserTypeList(params).then(res => {
        this.list =res[0].list
        this.total = res[0].total
      })
    },
    // 当前页改变事件
    handleCurrentPageChange(currentPageNum) {
      this.currentPage = currentPageNum
      this.getBusinessUserTypeList()
    },
    // 回退到工商户链接
    backToBusinessUser() {
      this.$router.push({path: '/traceOfClients', query: {toggleType: "gong"}});
    }
  },
  mounted() {
    this.getBusinessUserTypeList()
  }
}
</script>

<style scoped> 
.customer-type-form-wrapper {
  color:#fff;
  position: relative;
}
.customer-type-return-business-user {
  position: absolute;
  right:33px;
  bottom:25px;
  cursor: pointer;
  /* border:1px solid #999; */
}
.customer-type-form-wrapper >>> .el-form-item__label {
  color:#fff;
  font-size: 18px;
}
.customer-type-form-wrapper >>> .el-input__inner {
  color:#fff;
}
.customer-type-form-wrapper >>> .el-select__caret,
.customer-type-form-wrapper >>> .el-input__icon,
.customer-type-form-wrapper >>> .el-icon-arrow-up {
  border:none;
}
/* 去除下拉框右侧竖线（小箭头左侧的竖线） */
/deep/ .el-input__suffix {
  border:none;
}
.el-button {
  width:104px;
  height:40px;
  background:#0FB2AB;
  font-size: 18px;
  border:none;
}
.customer-type-form-wrapper {
  margin:20px 0 0 32px;
}
.customer-type-table-wrapper {
  margin: 0 32px;
  width: calc(100% - 64px);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(38, 51, 88, 0.07);
  font-size: 16px;
  padding:30px;
  overflow: hidden;
  /* 不加box-sizing，则margin-right不生效，如果不设置padding，则不需要使用box-sizing，margin-right也会生效 */
  box-sizing: border-box;
}
.page-wrapper {
  margin-top:20px;
}

/* 顶部表单中用气性质下拉列表 */
.customer-type-form-wrapper >>> .el-input__inner {
  width:220px;
  height:40px;
  background:#567DB9;
  border-radius: 20px;
  border:none;
  font-size: 18px;
}
/* 表格中下拉列表 */
.customer-type-table-wrapper >>>  .el-input__inner {
  width:125px;
  height:30px;
  background: #fff;
  color:#000;
  font-size: 16px;
}
/* 表格标题和数据居中对齐 */
/deep/.el-table th > .cell {
  text-align: center;
}
/deep/.el-table .cell {
  text-align: center;
}
</style>