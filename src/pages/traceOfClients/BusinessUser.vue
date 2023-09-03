<template>
  <div class='container'>
    <!-- 一 用户分类 -->
    <div class="container-header-wrapper">
      <div class='container-header-type-maintain' @click='getBusinessUserTypeList'>工商客户类型维护 <i class="el-icon-arrow-right"></i></div> 
      <div class="radio-wrapper" >
        <el-radio-group v-model="currentCategoryId" @change='handleRadioButtonClick' class="custom-radio">
          <el-radio :label="0">全选</el-radio>
          <el-radio :label="1">餐饮</el-radio>
          <el-radio :label="2">采暖</el-radio>
          <el-radio :label="3">洗浴</el-radio>
          <el-radio :label="4">工业</el-radio>
          <el-radio :label="5">福利</el-radio>
          <el-radio :label="6">能源</el-radio>
        </el-radio-group>
      </div>     
    </div>
    <!-- 二 图表 -->
    <div class='container-sale-ratio-wrapper'>
      <div class='btn-wrapper-chart' v-if='currentCategoryId != 0'>
        <el-button class='quarter-btn' round 
          :type="quarterYearBtnTypeChart === 'quarter' ? 'primary' : '' " 
          @click="handleQuarterBtnClickChart('quarter')"
        >环比</el-button>
        <el-button class='year-btn' round 
          :type="quarterYearBtnTypeChart === 'year' ? 'primary' : '' " 
          @click="handleQuarterBtnClickChart('year')"
        >同比</el-button>      
      </div>
      <!-- <div class="container-sale-ratio-graph-wrapper" v-if='pieChartA.data.length > 0'> -->
      <div class="container-sale-ratio-graph-wrapper">
        <div class="container-sale-ratio-graph-header-wrapper">
          <div class="container-sale-ratio-graph-header-trend" v-if='currentCategoryId!= 0' @click='showTrendChart'>近2年趋势</div>
          <div class="container-sale-ratio-chart1" v-html='pieChartAHtml'></div>
        </div>
        <div class="container-sale-ratio-desc-wrapper">
          <div class="container-sale-ratio-desc-data-analysis-wrapper">
            <div class="container-sale-ratio-desc-data-analysis-title">数据解读</div>
            <div class="container-sale-ratio-desc-data-analysis-content" v-html="dataExplain"></div>
          </div>
          <div class="container-sale-ratio-desc-supplement-explain-wrapper">
            <div class="container-sale-ratio-desc-supplement-explain-title-wrapper">
              <div class="container-sale-ratio-desc-supplement-explain-title">补充说明</div>
              <div class="container-sale-ratio-desc-supplement-explain-save" @click='saveSupplementExplain'>保存</div>
            </div>
            <div class="container-sale-ratio-desc-supplement-explain-content-wrapper">
              <textarea class="container-sale-ratio-desc-supplement-explain-content-input" 
                v-model='supplementExplain'
                placeholder="请您填写内容进行补充说明" rows='5'></textarea>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="container-sale-ratio-graph-placeholder" v-if='pieChartA.data.length === 0 && pieChartB.data.length === 0'>暂无数据</div> -->
    </div>
    <!-- 三 表格 工商户 全选 -->
    <div class="container-gas-sale-detail-wrapper" v-if='currentCategoryId === 0'>
      <div class="container-gas-sale-detail-header-wrapper">
        <div class="container-gas-sale-detail-title-wraper">
          <div class="container-gas-sale-detail-title">{{getBusinessUserGasDetailTitle}}</div>
        </div>
        <div class="container-gas-sale-detail-title-export" @click='exportCustomerSalesDetails' ><i class="el-icon-upload2"></i> 导出</div>
      </div>
      <div class="container-gas-sale-detail-unit">单位：万方</div>
      <div class="container-gas-sale-detail-table-wrapper">
        <CommonBasicTable :headerTitleArr='tableData.title' :list='tableData.list'></CommonBasicTable>
      </div>
    </div>
    <!-- 四 表格 工商户 其他分类 1：餐饮:2：采暖、3：洗浴:4：工业:5：福利:6：能源 -->
    <div class="container-gas-sale-detail-wrapper" 
      v-if='currentCategoryId === 1 || 
      currentCategoryId === 2 || 
      currentCategoryId === 3 || 
      currentCategoryId === 4 || 
      currentCategoryId === 5 || 
      currentCategoryId === 6'>
      <div class="container-gas-sale-detail-header-wrapper">
        <div class="container-gas-sale-detail-title-wraper">
          <div class="container-gas-sale-detail-title">{{getOtherBusinessUserGasDetailTitle}}</div>
          <div class="btn-wrapper">
            <el-button class='quarter-btn' :type="quarterYearBtnType === 'quarter' ? 'primary' : '' " round @click="handleQuarterBtnClick('quarter')">环比偏差</el-button>
            <el-button class='year-btn' :type="quarterYearBtnType === 'year' ? 'primary' : '' " round @click="handleQuarterBtnClick('year')">同比偏差</el-button>
          </div>
        </div>
        <div class="container-gas-sale-detail-title-export-wrapper">
          <div class="container-gas-sale-detail-title-search">
            <el-input placeholder="输入客户名称进行搜索" prefix-icon="el-icon-search" 
            size='medium' class="search-content"
            v-model="keyword" @change.native='handSearchChange'></el-input>
          </div>
          <div class="container-gas-sale-detail-title-export" @click='exportCustomerSalesDetails'><i class="el-icon-upload2"></i> 导出</div>
        </div>
      </div>
      <div class="container-gas-sale-detail-unit">单位：万方</div>
      <div class="container-gas-sale-detail-table-wrapper">
        <!-- 单击表格中“环比偏差”或“同比偏差”按钮时，加载对应表格 -->
        <DeviationTableQuarter v-if="quarterYearBtnType === 'quarter'" 
          :headerTitleArr='tableData.title' 
          :list='tableData.list' 
          :currentDate='currentDate'
          :total='total'
          @handleSortChange='handleSortChange'
          @handleCurrentPageChange='handleCurrentPageChange'          >
        </DeviationTableQuarter>
        <DeviationTableYear v-if="quarterYearBtnType === 'year'" 
          :headerTitleArr='tableData.title' 
          :list='tableData.list' 
          :currentDate='currentDate'
          :total='total'
          @handleSortChange='handleSortChange'
          @handleCurrentPageChange='handleCurrentPageChange'>
        </DeviationTableYear>        
      </div>
    </div>    
    <!-- 五 图表 近两年趋势 -->
    <div class="dialog-wrapper" style='z-index:9999;'>
      <el-dialog title="" :visible.sync='isDialogShow'>
        <div id="trendChart" style='width:100%;height:450px;'></div>
      </el-dialog>
    </div>
    <!-- 六 同比、环比图表中单击柱后弹出相关信息 -->
    <div class="dialog-business-user-info-wrapper" style='z-index:9999;'>
      <el-dialog title='工商户-客户信息' :visible.sync='isDialogShowOfBusinessUserInfo' width='80%'>
        <BusinessUserInfo :data='businessUserInfoData'></BusinessUserInfo>
      </el-dialog>
    </div>    
  </div>
</template>

<script>
var that = new Object()     // 保存vue中的this
import api from '/src/http/api'
import CommonBasicTable from './components/CommonBasicTable.vue'
import DeviationTableQuarter from './components/DeviationTableQuarter.vue'
import DeviationTableYear from './components/DeviationTableYear.vue'
import horizontalBarChartConfig from './components/horizontalBarChartConfig'
import commonBasicBarChartConfig from './components/CommonBasicBarChartConfig'
import barChartConfig from './components/barChartConfig'
import moment from 'moment'
import exportApi from '/src/components/export/export'
import { allCategoryTableHeader,otherCategoryTableHeaderYear,otherCategoryTableHeaderQuarter } from './tableArr'
import BusinessUserInfo from './BusinessUserInfo.vue'
export default {
  name: "traceOfClients",
  mixins:[barChartConfig,horizontalBarChartConfig,exportApi,commonBasicBarChartConfig],
  props: {
    time: {
      type:[Number,Date]
    },
    // 日期选择器值
    currentDate:{
      type:[Date,String],
    },
    // 公司编号
    curComCode: {
      type:[Number,String]
    }
  },
  data: function () {
    return {
      toggleType: 'zong',
      keyIndicatorsArr: [],         // 关键指标数据
      chart: '',                    // 图表对象
      // 图表DOM
      pieChartAHtml: '',
      // 图表相关参数
      pieChartA: {
        title: '',                   // 标题
        subTitle: '',                // 副标题
        data: [],                    // 数据
        axisTag:[],                  // 坐标轴标签
        legendIsShow: false,         // 是否显示图例
        percentIsShow:false,         // 柱子标签是否显示百分比（同比图表中显示百分比）
      },
      dataExplain: '',             // 数据解读
      supplementExplain: '',       // 补充说明
      // 表格相关数据
      tableData: {
        title:[],          // 表格标题
        list:[],                    // 表格数据
      },
      currentCategoryId:0,         // 当前分类ID
      quarterYearBtnTypeChart:'quarter',        // 图表中 环比偏差、同比偏差按钮
      quarterYearBtnType:'quarter',        // 表格中 环比偏差、同比偏差按钮
      keyword:'',         // 搜索框文本
      sort:'',            // 排序字段
      type:'',            // 排序方式
      currentPage:1,
      total:null,
      isDialogShow:false,     // 是否显示“近2年趋势”dialog,
      isDialogShowOfBusinessUserInfo:false,       // 是否显示 工商户-客户信息查询dialog
      businessUserInfoData:[],                    // 工商户-客户信息查询子页面用数据      
    }
  },
  computed: {
    // 当前选择的工商户分类的文本
    currentCategoryText() {
      let currentCategoryArr = ['全选','餐饮','采暖','洗浴','工业','福利','能源']
      return currentCategoryArr[this.currentCategoryId]
    },
    // 计算环比、同比值， 同比值为1，环比值为2
    currentQuarterYearValue() {
      // 同比1，环比2
      return this.quarterYearBtnTypeChart == 'quarter' ? 2 :1
    },
    // 计算补充说明 保存时 调用接口（/gasTracking/saveDataExplain）中需要的type参数, 类型 1:总体 2：工商户：3工商户分类 4：民用户 5：民用普表 6：民用卡表 7：民用物联网表'
    supplementExplainType() {
      let type = ''
      if(this.currentCategoryId === 0) {
        type = 2
      } else {
        type = 3
      }
      return type
    },
    // 工商户全选表格标题
    getBusinessUserGasDetailTitle() {
      return moment(this.currentDate).format('yyyy年M月')+'工商户用气明细'
    },    
    // 工商户其他分类表格标题
    getOtherBusinessUserGasDetailTitle() {
      return moment(this.currentDate).format('yyyy年M月') + this.currentCategoryText + '用户用气明细'
    }
  },
  components: {
    CommonBasicTable,
    DeviationTableQuarter,
    DeviationTableYear,
    BusinessUserInfo
  },
  methods: {
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage
      this.getData()
    },
    // 头部工商客户类型维护文本事件
    getBusinessUserTypeList() {
      this.$router.push('businessUserTypeList')
    },
    // 工商户 其他分类 表格中 环比偏差和同比偏差按钮
    handleQuarterBtnClick(type) {
      this.quarterYearBtnType = type
      if(type === 'quarter') {
        this.getOtherCategoryQuarterTableData()        // 环比
      }else if(type === 'year') {     
        this.getOtherCategoryYearTableData()        // 同比
      }
    },
    // 工商户 其他分类 图表中 环比和同比按钮事件
    handleQuarterBtnClickChart(type) {
      this.quarterYearBtnTypeChart = type
      if(type === 'quarter') {
        this.getOtherCategoryChartDataQuarter()        // 环比 图表
      }else if(type === 'year') {     
        this.getOtherCategoryChartDataYear()        // 同比 图表
      }      
    },
    // 用户分类切换按钮
    handleRadioButtonClick() {
      this.getData()
    },
    // 请求接口数据，根据不同的工商户分类，调用相应接口
    getData() {
      if(this.currentCategoryId === 0) {
        // 工商户 全选
        this.getAllCategoryTableData()                // 全部分类 表格数据（异常客户日用气量分析）
        this.getAllCategoryChartData()                // 全部分类图表数据
      } else {
        // 工商户 其他分类
        this.getOtherCategoryQuarterTableData()       // 工商户-环比列表查询
        // this.getOtherCategoryYearTableData()          // 工商户-同比列表查询
        this.getOtherCategoryChartDataQuarter()              // 工商户 图表数据 异常用户用气跟踪（环比）
      }        
    },
    // -------------------------------------------------------------------- 列表数据
    // 工商户 全选 接口获取 异常客户日用气量分析 列表数据 
    getAllCategoryTableData() {
      let params = {
        budat: this.currentDate,
        compCode: this.curComCode
      }
      api.gasReservesAnalysis.getAbnormalCustomerDayGasVolume(params).then(res => {
        let list = res.data.data
        let lastItemOfList = list.splice(-1, 1)
        list.unshift(lastItemOfList[0])
        // 特定列加%
        list.map(item => {
          item.m_growth += '%'
          item.y_growth += '%'
        })
        // 表格标题和数据
        this.tableData.title = allCategoryTableHeader
        this.tableData.list = list
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 获取 其他分类 环比列表（工商户-环比列表查询）
    getOtherCategoryQuarterTableData() {
        let params = {
          compCode:this.curComCode,
          date:this.currentDate,
          pageIndex:this.currentPage,
          pageSize:10,
          partner:this.keyword,
          sort:this.sort,            // 排序字段 monthDeviation 或 mGrowth
          type:this.type,            // 排序方式，asc或desc
          cusType:this.currentCategoryId
        }
        if(this.quarterYearBtnType === 'year') {
          api.gasReservesAnalysis.getBusinessUserCategoryListYearData(params).then(res => {
            let list  = res[0].list
            this.total = res[0].total
            list.map(item=> {
              item.yGrowth += '%'
            })
            this.tableData.title = otherCategoryTableHeaderQuarter
            this.tableData.list = list        
          }).catch(err => {
            console.log('err',err)
          })   
        } else if(this.quarterYearBtnType === 'quarter')   {
          api.gasReservesAnalysis.getBusinessUserCategoryListQuarterData(params).then(res => {
            let list  = res[0].list
            this.total = res[0].total
            list.map(item => {
              item.mGrowth += '%'
            })
            this.tableData.title = otherCategoryTableHeaderQuarter
            this.tableData.list = list
          }).catch(err => {
            console.log('err',err)
          })          
        }
    },
    // 获取 其他分类 同比列表（工商户-同比列表查询）
    getOtherCategoryYearTableData() {
        let params = {
          compCode:this.curComCode,
          date:this.currentDate,
          pageIndex:this.currentPage,
          pageSize:10,
          partner:'',
          sort:this.sort,
          type:this.type,
          cusType:this.currentCategoryId
        }   
        api.gasReservesAnalysis.getBusinessUserCategoryListYearData(params).then(res => {
          let list  = res[0].list
          this.total = res[0].total
          list.map(item => {
            item.yGrowth += '%'
          })
          this.tableData.title = otherCategoryTableHeaderYear
          this.tableData.list = list        
        }).catch(err => {
          console.log('err',err)
        })        
    },   
    // ---------------------------------------------------------------------- 图表数据
    // 工商户 全选 图表数据（全部分类图表数据）
    getAllCategoryChartData() {
      let params = {
        budat:this.currentDate,
        compCode:this.curComCode
      }
      api.gasReservesAnalysis.getYearQuarterVariationData(params).then(res => {
        let data = res.data.data[0]
        let chartData = []
        // 图表数据（因服务器返回数据多数都是0，这里临时设置模拟数据）：餐饮 采暖 洗浴 工业 福利 能源
        chartData['series1'] = [
          data.rant_lasty_abrmenge,    // 餐饮去年同月用气量
          data.heating_lasty_abrmenge,        // 取暖去年同月用气量
          data.take_bath_lasty_abrmenge,   // 洗浴去年同月用气量
          data.industry_lasty_abrmenge,      // 工业去年同月用气量
          data.welfare_lasty_abrmenge,        // 福利去年同月用气量
          data.energy_lasty_abrmenge       // 能源去年同月用气量
        ]
        chartData['series2'] = [
          data.rant_v_abrmenge,         // 餐饮本月用气量
          data.heating_v_abrmenge,      // 取暖本月用气量
          data.take_bath_v_abrmenge,      // 洗浴本月用气量
          data.industry_v_abrmenge,     // 工业本月用气量 
          data.welfare_v_abrmenge,      // 福利本月用气量
          data.energy_v_abrmenge       // 能源本月用气量
        ]
        chartData['series3'] = [
          data.rant_y_growth,    // 餐饮同比偏差率
          data.heating_y_growth,   // 取暖同比偏差率
          data.take_bath_y_growth,    // 洗浴同比偏差率
          data.industry_y_growth,   // 工业同比偏差率
          data.welfare_y_growth,   // 福利同比偏差率
          data.energy_y_growth,     // 能源同比偏差率
        ],
        chartData['series4'] = [
          data.rant_m_growth,       // 餐饮环比偏差率
          data.heating_m_growth,       // 取暖环比偏差率
          data.take_bath_m_growth,      // 洗浴环比偏差率
          data.industry_m_growth,     // 工业环比偏差率
          data.welfare_m_growth,      // 福利环比偏差率
          data.energy_m_growth,       // 能源环比偏差率
        ]
        this.supplementExplain = data.replenish         // 补充说明
        // A雷达图（左侧）数据
        this.pieChartA.title = `${moment(this.currentDate).format('yyyy年M月')}工商用户气量同比环比变化图示`
        this.pieChartA.subTitle = '单位：万方'
        this.pieChartA.data = [
          chartData['series1'],
          chartData['series2'],
          chartData['series3'],
          chartData['series4'],
        ],
        // 数据解读
        this.dataExplain = data.explain
        // 补充说明
      }).catch(err => {
        console.log('err',err)
        this.resetData()
      })
    },    
    // 工商户 其他分类 异常用户用气跟踪（其他分类 图表数据 环比）
    getOtherCategoryChartDataQuarter() {
      let params = {
        compCode:this.curComCode,
        date:this.currentDate,
        rateType:'2',       // 偏差类型，1同比，2环比-----------------------图表组件中切换按钮
        cusType:this.currentCategoryId,       // 用气类型，用气性质1：餐饮:2：采暖、3：洗浴:4：工业:5：福利:6：能源

      }
      api.gasReservesAnalysis.getBusinessUserCategoryChartQuarterData(params).then(res => {
        let data = res[0].ccsInduGasVOList
        // 图表数据按mGrouth降序排序
        data.sort(this.sortBy('mGrowth'))
        let chartData = []
        let chartTitle = []
        // 图表数据：餐饮 采暖 洗浴 工业 福利 能源
        data.map(item => {
          // 需要传递item.partner（客户编号）到图表，图表单击事件中需要使用，单击柱子，展示关于此用户的相关信息
          chartData.push({"customerCode":item.partner,"value":item.mGrowth})          
          chartTitle.push(item.partnerTxt)
        })
        this.pieChartA.title = `${moment(this.currentDate).format('yyyy年M月')}${this.currentCategoryText}异常用户用气跟踪`
        this.pieChartA.subTitle = ''
        this.pieChartA.data = chartData
        this.pieChartA.axisTag = chartTitle
        this.pieChartA.percentIsShow = true
        // 数据解读
        this.dataExplain = res[0].explain
        // 补充说明
        this.supplementExplain = res[0].replenish
      }).catch(err => {
        console.log('err',err)
        this.resetData()
      })
    },    
    // 工商户 其他分类 异常用户用气跟踪（其他分类 图表数据 同比）
    getOtherCategoryChartDataYear() {
      let params = {
        compCode:this.curComCode,
        date:this.currentDate,
        rateType:'1',       // 偏差类型，1同比，2环比-----------------------图表组件中切换按钮
        cusType:this.currentCategoryId,       // 用气类型，用气性质1：餐饮:2：采暖、3：洗浴:4：工业:5：福利:6：能源
      }
      api.gasReservesAnalysis.getBusinessUserCategoryChartQuarterData(params).then(res => {
        let data = res[0].ccsInduGasVOList
        // 图表数据按yGrouth降序排序
        data.sort(this.sortBy('yGrowth'))
        let chartTitle = []
        let chartData = []
        // 图表数据（因服务器返回数据多数都是0，这里临时设置模拟数据）：餐饮 采暖 洗浴 工业 福利 能源
        data.map(item => {
          chartTitle.push(item.partnerTxt)
          chartData.push({"customerCode":item.partner,"value":item.yGrowth})          
        })
        this.pieChartA.title = `${moment(this.currentDate).format('yyyy年M月')}${this.currentCategoryText}异常用户用气跟踪`
        this.pieChartA.subTitle = ''
        this.pieChartA.data = chartData
        this.pieChartA.axisTag = chartTitle
        this.pieChartA.percentIsShow = true
        // 数据解读
        this.dataExplain = res[0].explain
        // 补充说明
          this.supplementExplain = res[0].replenish
      }).catch(err => {
        console.log('err',err)
        this.resetData()
      })
    }, 
    // 初始化图表、设置图表参数
    initPieChartA() {
      this.pieChartAHtml = "";
      this.$nextTick(() => {
        // if (this.showPieChart) {
          this.pieChartAHtml =
            '<div style=" height: 100%;width: 100%;" id="barChart"></div>';
          this.$nextTick(() => {
            this.chart = this.$echarts.init(document.getElementById("barChart"));
            // this.chart.resize({ width: "auto" });
            // this.chart.setOption(this.barChartConfig(this.pieChartA));
            if(this.currentCategoryId === 0) {
              this.chart.setOption(this.barChartConfig(this.pieChartA));
              window.onresize = this.chart.resize
            } else {
              this.chart.setOption(this.horizontalBarChartConfig(this.pieChartA));
              window.onresize = this.chart.resize
            }
            // 图表柱子绑定click事件
            this.chart.on('click',function(params) {
              let customerCode = params.data.customerCode
              that.getBusinessUserInfo(customerCode)
            })            
          });
        // }
      });
    },
    // 图表数据恢复默认
    resetData() {
      this.keyIndicatorsArr = []
      this.pieChartA.title = ''
      this.pieChartA.data = []
    },
    // 导出表格数据
    exportCustomerSalesDetails() {
      if(this.currentCategoryId === 0) {                        // 工商户 全选 导出
        let params = {
          budat: this.currentDate,
          compCode: this.curComCode
        }
        api.gasReservesAnalysis.abnormalCustomerDayGasVolumnAnalysisExport(params).then(res => {
            this.download(res, 'xlsx', '异常客户日用气量分析')
        })        
      }else if(this.currentCategoryId !== 0 && this.quarterYearBtnType === 'quarter'){   // 工商户其他分类 环比 列表导出
        let params = {
          compCode:this.curComCode,
          date:this.currentDate,
          cusType:this.currentCategoryId,
          partner:this.keyword
        }
        api.gasReservesAnalysis.getBusinessUserCategoryExportQuarterData(params).then(res => {
          this.download(res, 'xlsx', `用户销售明细 工商户 ${this.currentCategoryText} 环比列表 ${this.currentDate}`)
        })        
      }else if(this.currentCategoryId !== 0 && this.quarterYearBtnType === 'year'){   // 工商户其他分类 同比 列表导出
        let params = {
          compCode:this.curComCode,
          date:this.currentDate,
          cusType:this.currentCategoryId,
          partner:this.keyword
        }
        api.gasReservesAnalysis.getBusinessUserCategoryExportYearData(params).then(res => {
            this.download(res, 'xlsx', `用户销售明细 工商户 ${this.currentCategoryText} 同比列表 ${this.currentDate}`)
        })          
      }
    },
    // 保存补充说明
    saveSupplementExplain() {
      let params = {
        compCode:this.curComCode,
        text:this.supplementExplain,
        type:this.supplementExplainType      // 类型  1:总体 2：工商户：3工商户分类 4：民用户 5：民用普表 6：民用卡表 7：民用物联网表'
      }
      api.gasReservesAnalysis.saveSupplementExplain(params).then(res => {
        if (res) {
          this.$message('保存成功')
        }
      })
    },
    // 表格右上角搜索框事件
    handSearchChange() {
      this.getOtherCategoryQuarterTableData()
    },
    // 表格字段排序事件
    handleSortChange({prop,order}) {
        this.sort = prop || ''
        this.type = order === 'ascending' ? 'asc' : (order === 'descending' ? 'desc' :'')
        // 升降序时，根据同比或环比调用相应方法
        if(this.quarterYearBtnType === 'quarter') {
          this.getOtherCategoryQuarterTableData()
        }else if(this.quarterYearBtnType === 'year') {
          this.getOtherCategoryYearTableData()
        }
    },    
    // 清除排序字段、排序方式（此方法暂不使用）
    restSortRule() {
      this.sort = ''
      this.type = ''
    },
    // 近2年趋势 环比、同比图表中 近2年趋势链接事件 显示dialog对话框------------------------------------近2年趋势图表
    showTrendChart() {
      this.isDialogShow = true
      this.initTrendChart()
    },
    // 近2年趋势 图片初始化、参数设置
    async initTrendChart() {
      let data = await this.getBusinessUserAbnormalGasTrace()
      this.$nextTick(() => {
        this.chart = this.$echarts.init(document.getElementById('trendChart'))
        this.chart.setOption(this.commonBasicBarChartConfig(data))

      })
    },
    // 近2年趋势 获取 工商户-异常用户用气跟踪趋势
    async getBusinessUserAbnormalGasTrace() {
      let params = {
        compCode:this.curComCode,
        date:this.currentDate,
        rateType:this.currentQuarterYearValue,       // 偏差类型，1同比，2环比
        cusType:this.currentCategoryId,       // 用气类型
      }
      let chartTitle = `${this.currentCategoryText} 近2年趋势`
      let chartData = []
      let chartAxisTag = []
      await api.gasReservesAnalysis.getBusinessUserAbnormalGasTrace(params).then(res => {
        let data = res[0]
        chartAxisTag = [data[1].year,data[0].year]
        chartData = [data[1].value,data[0].value]
      })
      return [chartTitle,chartAxisTag,chartData]
    },
    // sort函数用回调，排序用
    sortBy(prop) {
      return (a,b) => {
        return a[prop]-b[prop]
      }
    },
    // 工商户，客户信息查询（单击同比、环比图表中柱子时触发事件、请求接口）
    getBusinessUserInfo(customerCode) {
      let params = {
        partner:customerCode
      }
      api.gasReservesAnalysis.getBusinessUserInfo(params).then(res => {
        console.log('ressssssssssssss',res)
        this.businessUserInfoData = res[0]
        this.isDialogShowOfBusinessUserInfo = true
      })
    }    
  },
  watch: {
    pieChartA: {
      handler() {
        this.initPieChartA()
      },
      deep: true
    },
    time: {
      handler() {
        this.getData()
      }
    },
    currentCategoryId:{
      handler() {
        this.getData()
      }
    }
  },
  mounted() {
    that = this           // 保存指向vue实例的this
    this.getData()
    this.initPieChartA()
  }
}
</script>

<style scoped lang='scss'>
.radio-wrapper {
  width: 90%;
  margin-left: 30px;
  margin-top: 30px;
  color:#fff;
}
.container {
  width:100%;
  align-items: center;
}
.container-header-wrapper {
  position: relative;
}
.container-header-type-maintain {
  position:absolute;
  top:-62px;
  right:30px;
  color:#fff;
  font-size: 18px;
  cursor:pointer;
}
.container-header-second {
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin:32px 32px 0 32px;
}
.container-header-second-right-link {
  font-size: 18px;
  color:#fff;
  font-weight: 400;
}

/* 同比 环比变化 */
.container-sale-ratio-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 30px 0 30px;
  box-sizing: border-box;
  margin-top: 15px;
  margin-bottom: 30px;
  position: relative;
}

.container-sale-ratio-graph-wrapper {
  border-radius: 12px;
  background: #fff;
  display: flex;
  padding: 24px 30px;
}

.container-sale-ratio-graph-header-wrapper {
  flex:1;
  position: relative;
}
.container-sale-ratio-graph-header-trend {
  position:absolute;
  right:120px;
  top:0px;
  font-size: 16px;
  color:#333;
  font-weight: bold;
  z-index:1000;
  cursor:pointer;
}

.container-sale-ratio-chart1{
  flex:1;
  height:100%;
}

/* 销售占比 数据解读 */
.container-sale-ratio-desc-wrapper {
  flex:0 1 328px;
}

.container-sale-ratio-desc-data-analysis-wrapper {
  display: flex;
  flex-direction: column;
}

.container-sale-ratio-desc-data-analysis-title {
  font-size: 16px;
  font-weight: 400;
  color: #333;
  margin-bottom: 22px;
}

.container-sale-ratio-desc-data-analysis-content {
  width: 100%;
  height: 182px;
  background: #F2F3F6;
  border-radius: 10px;
  padding: 18px;
  box-sizing: border-box;
  line-height: 150%;
  overflow: auto;
}

/* 销售占比 补充说明 */
.container-sale-ratio-desc-supplement-explain-wrapper {
  display: flex;
  flex-direction: column;
}

.container-sale-ratio-desc-supplement-explain-title-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 28px 10px 20px 0;
  box-sizing: border-box;
}

.container-sale-ratio-desc-supplement-explain-title {
  font-size: 16px;
  font-weight: 400;
  color: #333;
}

.container-sale-ratio-desc-supplement-explain-save {
  font-size: 18px;
  font-weight: 400;
  color:#0FB2AB;
  cursor:pointer;
}

.container-sale-ratio-desc-supplement-explain-content-wrapper {

}

.container-sale-ratio-desc-supplement-explain-content-input {
  width: 100%;
  height: 113px;
  background: #F2F3F6;
  border-radius: 10px;
  color: #909090;
  border: none;
  outline: none;
  resize: none;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
  font-size:16px;
}

.container-sale-ratio-graph-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 454px;
  border-radius: 12px;
  background: rgba(0, 0, 0, .2);
  color: #777;
}

/* 用气销售明细 */
.container-gas-sale-detail-wrapper {
  width:calc(100% - 62px); 
  background: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  box-sizing: border-box;
  margin-bottom: 48px;
  margin-left:32px;
}

.container-gas-sale-detail-header-wrapper {
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.container-gas-sale-detail-title-wraper {
  display: flex;
  flex-direction: row;
}

.btn-wrapper {
  display:flex;
  align-items: center;
  justify-content: center;
  margin-top: -7px;
}

.btn-wrapper-chart {
  display:flex;
  align-items: center;
  justify-content: center;
  position:absolute;
  top:63px;
  left:26px;
  z-index:1000;
}

.quarter-btn,.year-btn{
  width:124px;
  height:46px;
  border-radius: 23px;
  border:1px solid #0FB2AB;
  color:#0FB2AB;
}
/deep/ .el-button--primary {
  background: #0FB2AB;
  color:#fff;
}
.quarter-btn {
  margin-left:36px;
  margin-right: 20.5px;
}
.year-btn {
  margin:0;
}

.container-gas-sale-detail-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 17px;
}

.container-gas-sale-detail-unit {
  font-size: 18px;
  font-weight: 400;
  color: #333;
  margin-bottom: 23px;
}

.container-gas-sale-detail-title-export-wrapper {
  display: flex;
}
.container-gas-sale-detail-title-search {
  margin-top:4px;
}
.search-content {
    display: inline-block;
    width: 210px;
    height:42px;
    margin-right: 31px;
    box-sizing: border-box;
}
.container-gas-sale-detail-title-export {
  font-size: 16px;
  font-weight: 400;
  /* margin-bottom: 17px; */
  margin-top: 0px;
  width: 98px;
  height: 46px;
  border-radius: 23px;
  background: #E5F6F6;
  color: #0FB2AB;
  text-align: center;
  line-height: 46px;
  cursor:pointer;
}
/* 修改el-input搜索框默认样式 */
.search-content >>> .el-input__inner {
  border-radius: 20px;
  background: #F6F7FA;
  border:none;
}
/* 近2年趋势 图表容器 */
.dialog-wrapper {
}
</style>