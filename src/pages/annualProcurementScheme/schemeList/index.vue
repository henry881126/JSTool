<template>
<div>
  <div class="container gas-page-bg">
    <TopMenu title="智慧分销" />
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>资源统筹</el-breadcrumb-item>
      <el-breadcrumb-item>年度采购方案</el-breadcrumb-item>
      <el-breadcrumb-item>方案列表</el-breadcrumb-item>
      </el-breadcrumb>          
    </div>
    <!-- 方案列表 -->
    <div class="content-wrapper">
      <div class="header-wrapper">
        <div class="header-input-wrapper">
            <span class="header-title">方案列表</span>
            <span><el-input placeholder="请输入搜索的内容" prefix-icon="el-icon-search" v-model="keyword" @change="handleSearchEvent" :clearable="true" /></span>
        </div>
        <el-button round size="small" type="primary" @click="exportPruchaseScheme()" class="custom-button" icon="el-icon-download">导出</el-button>      
      </div>
      <el-table
          :data="planTable.list"
          @select="planSelect"
          @cell-click="handleCellClick"
          ref="planTable"
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          class="custom-table-n"   
          border
          v-loading="loading">
          <!-- 原来使用复选框实现添加对比方案，现改为使用“+对比”实现，故注释下面代码，打开注释后，原复选框功能仍能够正常运行 -->
          <!-- <el-table-column
            type="selection"
            :selectable="planSelectable"
            align="center"
            width="100px">
            <template slot="header">
              <div>对1比</div>
            </template>
          </el-table-column> -->
          <el-table-column
              prop="compare"
              align="center"
              label="对比"
              width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.compare === '+对比' && selectedSchemeCount < 5" style="color: #409EFF; font-size: 14px;">{{ scope.row.compare }}</div>
                <div v-if="scope.row.compare === '+对比' && selectedSchemeCount >= 5" style="color: #909399; font-size: 14px;">{{ scope.row.compare }}</div>
                <div v-if="scope.row.compare === '已对比'" style="color: #303133; font-size: 14px;">{{ scope.row.compare }}</div>
              </template>
          </el-table-column>

          <el-table-column
              prop="name"
              align="left"
              label="方案名称">
          </el-table-column>
          <el-table-column
              prop="comprehensive_price_num"
              align="right">
              <template slot="header">
              <div>购气量(万方)</div>
              </template>
          </el-table-column>
          <el-table-column
              prop="comprehensive_price"
              align="right">
              <template slot="header">
                <div style="display: inline-block;vertical-align: middle;">综合价格(元/方)</div>
              </template>
          </el-table-column>
          <el-table-column
              prop="comprehensive_price_sum"
              align="right">
              <template slot="header">
                <div style="display: inline-block;vertical-align: middle;">采购成本(万元)</div>
              </template>
          </el-table-column>
          <el-table-column
              align="left"
              label="生成时间"
              width="130">
              <template slot-scope="scope">
              {{ getFormatDate(scope.row.createTime, '/') }}
              </template>
          </el-table-column>
          <el-table-column
              prop="compNum"
              align="left"
              label="操作"
              width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="planDesc(scope.row)">查看</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" @click="planModify(scope.row)">编辑</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" @click="planDelete(scope.row)">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination background 
          class="custom-page-n" 
          layout="total, sizes, slot, prev, pager, next, jumper" 
          :current-page="planTable.current" 
          :page-size="planTable.pageSize" 
          :page-sizes="[10,20,30]" 
          :total="planTable.total" 
          @current-change="handleCurrentChangeEvent" 
          @size-change="handleSizeChange">
            <span style="color: #606266;">当前{{this.planTable.list.length}}条</span>
          </el-pagination>      
      </div>
    </div> 
  </div>
  <!-- 方案对比列表 -->
  <div class="plan-compare-wrapper" v-if="compareFixVisiable">
    <div class="plan-compare-header-wrapper">
      <div class="plan-compare-header-title">方案列表<span class="plan-compare-header-tips">最多只能对比5套方案</span></div>
      <div class="plan-compare-header-right-wrapper">
        <el-button round size="small" @click="planCompareReset">清空</el-button>
        <el-button round size="small" type="primary" @click="planCompareSubmit">对比</el-button>
        <div><i class="el-icon-close" @click="compareBannerClose()"></i></div>
      </div>
    </div>
    <div class="plan-compare-list-wrapper">
      <div class="plan-compare-list-item-wrapper" v-for="v in planCompareList" :key="v.id">
        <div class="plan-compare-item-name">
          {{ v.name }}
          <i class="el-icon-close" @click="planCompareDelete(v.id)"></i>
        </div>
        <div class="plan-compare-list-item-price-wrapper">
          <div class="plan-compare-jiage">
            <span class="plan-compare-jiage-span">综合价格：</span>
            <span class="plan-compare-jiage-price">{{ v.comprehensive_price }}元/方</span>
          </div>
          <div class="plan-compare-chengben">
            <span class="plan-compare-chengben-span">总采购成本：</span>
            <span class="plan-compare-chengben-rpice">{{ v.comprehensive_price_sum }}万元</span>
          </div>
        </div>
      </div>
      <div class="plan-compare-list-null-wrapper" v-for="v in [1, 2, 3, 4, 5]" :key="v" :style="{left: (v - 1) * 230 + 'px'}">
        您还可以继续添加
      </div>      
    </div>
  </div>    
</div>
</template>

<script>
import api from '@/http/api'
import TopMenu from '@components/topMenu/topMenu2'
import dateFormater from "@components/dateFormater/dateFormater";
import exportApi from '/src/components/export/export'

export default {
  mixins: [exportApi, dateFormater],
  components: {
    TopMenu
  },
  data() {
      return {
          planTable: {
              list: [],
              current: 1,
              pageSize: 10,
              total: 0
          },
          sortBy: 'id',
          sortType: 'desc',
          planCompareList: [],
          compareFixVisiable: false,  // 方案对比列表显隐状态
          comparePop: false,  // 方案对比列表显隐
          list: [], // 方案对比列表
          keyword: '',  // 搜索关键字
          selectedSchemeCount: 0, // 已选择方案数量（累加单击“+对比”的数量）
          loading: false
      }
  },
  computed: {
      curComCode() {
          return this.$store.getters.curCom
      },
  },
  created() {
      this.getList()
  },
  methods: {
    getList() {
      let params = {
        // beginTime: this.getFormatDate(this.searchForm.date[0]),
        // endTime: this.getFormatDate(this.searchForm.date[1]),
        xaReig: this.curComCode,
        name: this.keyword,
        pageNum: this.planTable.current,
        pageSize: this.planTable.pageSize,
        orderByColumn: this.sortBy,
        isAsc: this.sortType
      }
      this.loading = true
      api.purchasingEstimation.getPlans(params).then(res => {
        this.loading = false
        if (res) {
          // 在表格行对象中加compare属性（做为对比列）
          res[0].list.map(item => {
            item.compare = '+对比'
          })
          this.planTable.list = res[0].list
          this.planTable.current = res[0].pageNum
          this.planTable.total = res[0].total
          this.setSelection()
        }
      })            
    },
    // 通过勾选复选框选择对比方案——————已替换为使用“+对比”实现，代码暂留
    setSelection: function () {
      let that = this
      for (let i in this.planTable.list) {
        let fI = function (element) {
          return element.id === that.planTable.list[i].id
        }
        if(this.planCompareList.findIndex(fI) !== -1) {
          this.$nextTick(() => {
            this.$refs.planTable.toggleRowSelection(this.planTable.list[i], true)
          })
        }
      }
    },
    // 勾选checkbox时触发的事件---已替换为使用“+对比”实现，代码暂留
    planSelect: function (selection, row) {
      this.compareFixVisiable = true
      let findCallback = function (element) {
        return element.id === row.id
      }
      let fI = this.planCompareList.findIndex(findCallback)
      if(fI === -1) {
        this.planCompareList.push(row)
      } else {
        this.planCompareList.splice(fI, 1)
      }
    },
    // 已替换为使用“+对比”实现，代码暂留  
    planSelectable: function (row) {
      if(this.planCompareList.length < 5) {
        return true
      }
      for (let v of this.planCompareList) {
        if(row.id === v.id) {
          return true
        }
      }
      return false
    }, 
    // 方案对比列表中单个方案删除事件（单击单个方案右上角X图标时触发）
    planCompareDelete: function (id) {
      for (let index in this.planCompareList) {
        if(this.planCompareList[index].id === id) {
          this.planCompareList.splice(index, 1)
          this.selectedSchemeCount--  // 数量减1（最多选择5套方案的数量），减1后，数量小于5，此时可以继续添加对比方案
          const currentDeletedScheme = this.planTable.list.filter(item => item.id === id) // 获取在方案列表页面底部对比区域删除的某项
          currentDeletedScheme[0].compare = '+对比' // 将方案列表数据源中的compare字段值由“已对比”改为“+对比”
        }
      }
    },
    // 关闭方案列表对话区域，同时清除已选择方案列表，清除表格复选框复选状态
    compareBannerClose: function () {
      this.planCompareReset()
      this.compareFixVisiable = false
    },
    // 清除已选择方案列表，清除表格复选框复选状态（不关闭方案列表区域）
    planCompareReset: function () {
      this.planCompareList.splice(0, this.planCompareList.length);
      this.$refs.planTable.clearSelection();
      this.selectedSchemeCount = 0
      this.planTable.list.map(item => item.compare = '+对比')
    },
    // 对比按钮事件
    planCompareSubmit: function () {
      if(this.planCompareList.length <= 1) {
        this.$message({
          message: '至少需要选择两条方案！',
          type: 'warning'
        });
        return false
      }
      let ids = '';
      for (let v of this.planCompareList) {
        ids += ',' + v.id
      }
      this.$router.push({
        name: 'schemeComparison',
        params: {
          ids
        }
      })
    }, 
    // 查看方案详情
    planDesc(row) {
      this.$router.push({
        name: 'procurementScheme',
        params: {
          schemeItemId: row.id
        }
      })
    },
    // 编辑方案
    planModify(row) {
      this.$router.push({
        name: 'procurementScheme',
        params: {
          schemeItemId: row.id,
          edit: true
        }
      })
    },
    // 删除方案
    planDelete(row) {
      this.$confirm(`确认要删除“${row.name}”吗？`,'提示',{
        type: 'warning'
      }).then(() => {
          api.purchasingEstimation.deletePlan({
            id: row.id
          }).then(res => {
            if(res) {
              this.$message({
                title: '提示',
                message: '删除方案成功！',
                type: 'success'
              });
              this.getList()
            }
          })
        }).catch(err => {

        })
    },
    // 搜索事件
    handleSearchEvent() {
      this.getList()
    },
    // 切换页面事件
    handleCurrentChangeEvent(page) {
      this.planTable.current = page
      this.getList()
    },
    // 调整分页器每页记录数量事件
    handleSizeChange(size) {
      this.planTable.pageSize = size
      this.getList()
    },
    // 单元格click事件，实现添加方案功能
    handleCellClick(row, column) {
      if(column.label !== '对比') return false
      this.compareFixVisiable = true
      // 获取当前单击单元格对应行所在数据源中索引
      let findCallback = function (element) {
        return element.id === row.id
      }
      let fI = this.planCompareList.findIndex(findCallback)
      // 数量小于等于5时，添加或删除当前元素到数据源
      if(column.label === '对比' && this.selectedSchemeCount <= 5) {
        if(fI === -1) {
          this.planCompareList.push(row)
          this.selectedSchemeCount++
          row.compare = '已对比'
        } else {
          this.planCompareList.splice(fI, 1)
          this.selectedSchemeCount--  // 数量减1（最多选择5套方案的数量），减1后，数量小于5，此时可以继续添加对比方案
          row.compare = '+对比' // 将方案列表数据源中的compare字段值由“已对比”改为“+对比”          
        }        
      }
      // 数量大于5时，单击单元格时删除元素
      if(column.label === '对比' && this.selectedSchemeCount > 5) {
        this.planCompareList.splice(fI, 1)
        this.selectedSchemeCount--
        row.compare = '+对比'  
      }
    },
    // “+对比”的单击事件
    handleAddCompare(row) {
      this.compareFixVisiable = true
      let findCallback = function (element) {
        return element.id === row.id
      }
      let fI = this.planCompareList.findIndex(findCallback)
      if(fI === -1) {
        this.planCompareList.push(row)
        this.selectedSchemeCount++
      } else {
        this.planCompareList.splice(fI, 1)
      }
    },
    // 导出采购方案列表
    exportPruchaseScheme() {
      let params = {
        xaReig: this.curComCode,
        name: this.keyword,
        pageNum: this.planTable.current,
        pageSize: this.planTable.pageSize,
        orderByColumn: this.sortBy,
        isAsc: this.sortType
      }
      api.purchasingEstimation.exportPruchaseScheme(params).then(res => {
        this.download(res, 'xls', '采购方案列表')      
      })       
    }
  }
}
</script>

<style lang='scss' scoped>
.container {
  min-width: auto!important;
  .breadcrumb-wrapper {
    margin: 10px 20px 0 20px;
    /deep/ .el-breadcrumb__inner {
        color: rgba(255, 255, 255, 0.5);
    }            
    /deep/ .el-breadcrumb__item:last-child > .el-breadcrumb__inner {
        color: #fff;
    }
  }
  .content-wrapper{
    background: #fff;
    border-radius: 8px;
    margin: 10px 20px 0 20px;
    padding: 20px;
    margin-bottom: 210px;
    .header-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .header-input-wrapper {
        display: flex;
        .header-title {
            font-size: 18px;
            font-weight: 500;
            margin-right: 30px;
            line-height: 32px;
        }
        /deep/ .el-input__inner {
          border-radius: 16px;
          width: 180px;
          height: 32px;
          background: #F5F7FA;
          border: 1px solid #DCDFE6;
          &::placeholder {
            color: #606266;
          }
        }
        /deep/ .el-input__prefix .el-input__icon {
          line-height: 32px;
        }
        /deep/ .el-input__suffix .el-input__icon {
          line-height: 32px;
        }        
      }
      .custom-button {
          width: 79px;
      }
    }
    /deep/ .el-table thead tr .el-checkbox {
        pointer-events: none;
        opacity: .5;
        cursor: not-allowed;
    }
    /deep/ .el-table__header tr th {
      color: #303133;
    }    
    .pagination-wrapper {
      margin-top:20px;
      margin-bottom: 20px;
    }
  }
}
.plan-compare-wrapper {
  /* position: relative; */
  /* top: -30px; */
  position: absolute;
  bottom: 0;
  width: calc(100% - 290px);
  box-shadow: 0px -6px 18px rgba(86, 125, 185, 0.14);
  border-radius: 8px 8px  0 0;
  background: #fff;
  padding: 20px 40px 0px 30px;
  height: 228px;
  .plan-compare-header-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .plan-compare-header-title {
      font-size: 18px;
      font-weight: 500;
      color: #303133;
      .plan-compare-header-tips {
        font-size: 14px;
        font-weight: 500;
        color: #E6A23C;
        background: #FCF6EC;;
        border-radius: 10px;
        margin-left: 10px;
        padding: 0 10px;
      }
    }
    .plan-compare-header-right-wrapper {
      display: flex;
      align-items: center;
      /deep/ .el-button {
        width: 86px;
      }
      .el-icon-close {
        font-size: 20px;
        margin-left: 24px;
      }
    }
  }
  /* 每个对比方案 */
  .plan-compare-list-wrapper {
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    height: 176px;
    /* 1 每个方案 */
    .plan-compare-list-item-wrapper {
      z-index: 2;
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      width: 220px;
      height: 148px;
      margin-right: 10px;
      background: #F5F7FA;
      border-radius: 4px;
      .plan-compare-item-name {
        width: 220px;
        height: 68px;
        background: #DFE7F2;
        position: relative;
        padding: 10px;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: 500;
        .el-icon-close {
          float: right;
        }
      }
      .plan-compare-list-item-price-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height:78px;
        box-sizing: border-box;
        text-align: left;
        padding-left: 10px;
        .plan-compare-jiage {
          .plan-compare-jiage-span {
            font-weight: 400;
            color: #606266;
            font-size: 14px;
          }
          .plan-compare-jiage-price {
            font-weight: 500;
            color: #303133;
            font-size: 14px;
          }          
        }
        .plan-compare-chengben {
          .plan-compare-chengben-span {
            font-weight: 400;
            color: #606266;
            font-size: 14px;
          }
          .plan-compare-chengben-price {
            font-weight: 500;
            color: #303133;
            font-size: 14px;
          }            
        }
      }
    }
    /*2  空方案（您还可以继续添加） */
    .plan-compare-list-null-wrapper {
      z-index: 1;
      position: absolute;
      display: inline-block;
      width: 220px;
      height: 148px;
      margin-right: 10px;
      border: 1px dashed #DCDFE6;
      color: #606266;
      text-align: center;
      line-height: 148px;
      border-radius: 4px;
      box-sizing: border-box;
    }
  }

}
</style>