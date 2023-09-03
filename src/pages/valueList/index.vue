<template>
  <div class="gas-page-bg">
    <top-menu :date-picker-show="false"
              :input-show="false"
              title="价值列表"
              @curComChanged='curComCodeChanged'
              @handleKeywordInput="handleKeywordInput">
    </top-menu>
    <!-- <div class="left-con">
            <div class="left-mar">
                <el-input placeholder="选择" prefix-icon="el-icon-search" class="search" size="small"></el-input> 
            </div>
        </div> -->
    <div class="right-part">
      <div class="customet-list">
        <div class="risk-title-wapper">
          <div class="risk-title">价值列表</div>
          <!-- <el-button round plain type="success" @click="exportExcel()" class="custom-button" icon="el-icon-upload2">导出</el-button> -->
        </div>
        <el-table :data="list"
                  stripe
                  v-loading="tableLoading"
                  header-row-class-name="custom-table-header"
                  header-cell-class-name="custom-table-header-cell"
                  cell-class-name="custom-table-cell"
                  class="custom-table-r">
          <el-table-column prop="name"
                           label="客户名称"
                           align="left"
                           header-align="center"
                           min-width="140"></el-table-column>
          <el-table-column prop="bp"
                           label="BP号"
                           align="center"
                           header-align="center"
                           width="150"></el-table-column>
          <el-table-column prop="address"
                           label="客户地址"
                           align="left"
                           header-align="center"
                           min-width="150"></el-table-column>
          <el-table-column prop="typeValue"
                           label="客户类型"
                           width="120"
                           align="center"
                           header-align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="industryValue"
                           label="所属行业"
                           align="center"
                           header-align="center"
                           width="125"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="startDate"
                           width="147"
                           align="center"
                           header-align="center"
                           label="供能起始日期"
                           sortable="custom"
                           show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right"
                           label="操作"
                           align="center"
                           header-align="center"
                           width="120">
            <template slot-scope="scope">
              <el-button @click="handleCellClick(scope.row)"
                         type="text"
                         :disabled="scope.row.scoreQy===0"
                         style="fontSize:16px"
                         size="small">
                查看
              </el-button>
            </template>
          </el-table-column>

        </el-table>
        <div class="page-wrapper custom-page">
          <el-pagination v-if='countList'
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
  width: 100%;
}
.right-part {
  z-index: 999;
  position: relative;
  width: 100%;
  margin-top: 20px;
}

.left-con {
  display: inline-block;
  position: relative;
  top: -35px;
  left: 350px;
}
.text {
  font-size: 24px;
  color: #fff;
  margin: 0 10px 0 15px;
}
.search {
  display: inline-block;
  border-radius: 10px;
  width: 150px;
  margin-left: 20px;
  border: 5px;
}
.el-input__inner {
  border-radius: 40px;
}
.customet-list {
  padding: 22px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
  z-index: 1;
  width: 95%;
  margin: auto;
  overflow: hidden;
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
  color: #2c3e50;
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
.el-input__inner {
  border-radius: 80px;
}
.el-button {
  border-radius: 20px;
}
</style>
<script>
import api from '../../http/api'
import topMenu from '../../components/topMenu/topMenu'
import exportApi from '/src/components/export/export'
import mergeTableRow from '/src/components/mergeTableRow/reply'
import echarts from "echarts";
export default {
  mixins: [exportApi, mergeTableRow],
  components: {
    topMenu
  },
  data () {
    return {
      tableLoading: false,
      countList: false,//是否显示分页组件
      browerTime: 0,
      timer: null,
      input1: '',
      list: [],
      //    list1: {'danger':list.tag==='高风险','info':list.tag==='低风险'},
      total: 0,
      currentPage: 0,
      pageSize: 10
    };
  },
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom
    },
  },
  created () {
  },
  mounted () {
    this.getValueList()
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    handleKeywordInput () {
      this.getValueList()
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
    curComCodeChanged () {
      this.getValueList()
    },
    handleSizeChange (size) {
      this.pageSize = size
      this.getValueList()
    },
    // 客户名称单元格单击事件
    handleCellClick (row) {
      this.$router.push({
        path: '/valueDetail', query: {
          customerBp: row.bp,
          orgCode: row.cpmoCop,
          codeType: 'bp',
          companyCode: row.branchCompanyCode,
          customerCode: row.bp,
          customerType: row.customerTypeId,
          level: row.level,                    // 风险等级
          address: row.address,                // 客户地址
          name: row.name,                      // 客户名称
          startDate: row.startDate,            // 起始日期
          typeValue: row.typeValue,            // 客户类型
          industryValue: row.industryValue     // 所属行业
        }
      })
      // this.$router.push({
      //   name: 'customerRiskAnalysisDetail',
      //   params: {
      //     codeType: 'bp',
      //     companyCode: row.branchCompanyCode,
      //     customerCode: row.bp,
      //     customerType: row.customerTypeId,
      //     // companyCode:'0611',
      //     // customerCode:'0002710528',
      //     // customerType:'10440',
      //     level: row.level,                    // 风险等级
      //     address: row.address,                // 客户地址
      //     name: row.name,                      // 客户名称
      //     startDate: row.startDate,            // 起始日期
      //     typeValue: row.typeValue,            // 客户类型
      //     industryValue: row.industryValue     // 所属行业
      //   }
      // })
    },
    // 当前页改变事件
    handleCurrentPageChange (val) {
      this.currentPage = val
      this.getValueList(val)
    },
    filterTag (value, row) {
      return row.tag === value;
    },
    // 获取价值列表
    getValueList (pageNum = 1) {

      let params = {
        orgCode: this.curComCode,
        // orgCode:'5031932',
        pageNum,
        pageSize: this.pageSize,
        queryType: 'recognize_value'
      }
      this.tableLoading = true
      api.getValueList.getList(params).then(res => {
        this.tableLoading = false
        if (res) {
          this.list = res.list
          if (this.list.length > 0) {
            this.countList = true
            this.total = res.total
          }
        }
      })
    }
  }
};
</script>
