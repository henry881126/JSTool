<template>
  <div class="risk-customer-page">
    <div class="top-area">
      <h1 class="page-title">
        重要客户风险列表<span style="margin-left:22px;color:#0FB2AB">{{this.$route.query.riskCustomerNumber}}家</span>
      </h1>
      <div class="search-area">
        <el-input class="search-input" placeholder="搜索" @keydown.enter.native="search" v-model="searchKey">
            <i @click="search" slot="suffix" class="iconfont iconsousuo"></i>
        </el-input>
        <!-- <span class="search-icon"><i class="iconfont iconsousuo"/></span> -->
        <el-button @click="backButton" circle class="iconfont iconzuoqie"></el-button>
      </div>
    </div>
    <div class="table-area">
      <el-table
        border
        stripe
        :cell-style="{'cursor' : 'pointer' }"
        :header-cell-style="{ 'text-align': 'center','background-color':'#F2F4F8'}"
        :data="tableData"
        :max-height="tableHeight"
        :style="tableStyle"
        @row-click="openDetailView"
        :default-sort="{prop: 'riskGrade', order: 'descending'}"
      >
        <el-table-column width="60" label="序号" align="center"> 
            <template slot-scope="scope">
            <span>{{ (scope.$index+1) }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="公司">
          <template slot-scope="scope">
            <tooltip-show
                :content="scope.row.compCodeTxt"
                class="wid190"
                refName="tooltipOver1"
            >
            </tooltip-show>
            <!-- <el-tooltip placement="top" :content="scope.row.compCodeTxt"><span class="resAndSug">{{scope.row.compCodeTxt}}</span></el-tooltip> -->
          </template>
        </el-table-column>
        <el-table-column label="客户">
          <template slot-scope="scope">
            <tooltip-show
                :content="scope.row.mcName1"
                class="wid190"
                refName="tooltipOver2"
            >
            </tooltip-show>
            <!-- <el-tooltip placement="top" :content="scope.row.mcName1"><span class="resAndSug">{{scope.row.mcName1}}</span></el-tooltip> -->
          </template>
        </el-table-column>
        <el-table-column width="80" label="行业">
          <template slot-scope="scope">
            <tooltip-show
                :content="scope.row.industryName2"
                class="wid190"
                refName="tooltipOver3"
            >
            </tooltip-show>
            <!-- <el-tooltip placement="top" :content="scope.row.industryName2"><span class="resAndSug">{{scope.row.industryName2}}</span></el-tooltip> -->
          </template>
        </el-table-column>
        <el-table-column width="80" align="center" prop="yeargas" label="年用气量(万方)"> </el-table-column>
        <el-table-column width="80" align="center" prop="energyRate" label="能源成本占比"> </el-table-column>

        <el-table-column label="直供风险">
          <el-table-column width="80" align="center" prop="directgas" label="是否达到直供政策门槛">
          </el-table-column>
          <el-table-column
            width="100"
            label="是否有LNG接收设施或有建设场地条件"
          >
            <template slot-scope="scope">
              <tooltip-show
                :content="scope.row.gasLngbuilding"
                class="wid190"
                refName="tooltipOver4"
              >
              </tooltip-show>
              <!-- <el-tooltip placement="top" :content="scope.row.gasLngbuilding"><span class="resAndSug">{{scope.row.gasLngbuilding}}</span></el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column width="90" align="center" prop="gasDistance" label="到气源下载点的距离（公里）">
          </el-table-column>
          <el-table-column width="70" align="center" prop="gasRailway" label="是否穿越铁路、城区或河流">
          </el-table-column>
          <el-table-column width="90" align="center" prop="gasOthergas" label="是否与上游或其他城燃企业接触">
          </el-table-column>
        </el-table-column>

        <el-table-column label="LNG点供或其他能源替代风险备份">
          <el-table-column width="70" align="center" prop="gasLngsupply" label="是否符合LNG点供政策要求">
          </el-table-column>
          <el-table-column width="90" align="center" prop="gasSource" label="是否能拿到气源或具备下气的条件">
          </el-table-column>
          <el-table-column width="90" align="center" prop="gasOtherbuilding" label="是否有其他替代能源设备设施">
          </el-table-column>
        </el-table-column>

        <el-table-column label="客户关系">
          <el-table-column width="70" align="center" prop="longTerm" label="是否签长期协议"> </el-table-column>
          <el-table-column width="70" align="center" prop="business" label="是否有延伸业务等合作">
          </el-table-column>
          <el-table-column width="70" align="center" prop="complaints" label="是否有客户投诉"> </el-table-column>
        </el-table-column>

        <el-table-column prop="riskGrade" align="center" :sort-method="sortRiskGrade" sortable width="60" label="风险等级"> </el-table-column>
        <el-table-column width="220" label="风险分析">
          <template slot-scope="scope">
            <tooltip-show
                :content="scope.row.analysis"
                class="wid190"
                refName="tooltipOver5"
            >
            </tooltip-show>
            <!-- <el-tooltip placement="top"><div class="tooltip-item" v-html="scope.row.analysis" slot="content"></div><span class="resAndSug">{{scope.row.analysis}}</span></el-tooltip> -->
          </template>
        </el-table-column>
        <el-table-column width="220" label="应对策略">
          <template slot-scope="scope">
            <tooltip-show
                :content="scope.row.strategy"
                class="wid190"
                refName="tooltipOver6"
            >
            </tooltip-show>
            <!-- <el-tooltip placement="top"><div class="tooltip-item" v-html="scope.row.strategy" slot="content"></div><span class="resAndSug">{{scope.row.strategy}}</span></el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    
  </div>
</template>

<script>
import tooltipShow from './tooltipShow'
export default {
  data() {
    return {
      tableHeight: window.screen.width >= 1900 ? "870" : "730",
      tableStyle:  window.screen.width >= 1900 ? "font-size:12px" : "font-size:10px",
      searchKey: "",
      companyCode: this.$route.query.companyCode,
      tableData: []
    };
  },
  components: {tooltipShow},
  computed: {},
  created() {
    this.getTableData()
  },
  methods: {
    getTableData(){ //获取列表数据
      this.$api
        .getImportantCustomerRiskList(
          this.companyCode,
          this.searchKey,
        )
        .then(res => {
          if (res.resultCode === 0) {
            this.tableData = res.data
          }
        });
    },
    backButton() { //返回总览页面
      this.$router.push({
          path: "/overView",
      });
    },
    openDetailView(data) { //打开详情页
      console.log("打开详情页事件",data)
      this.$router.push({
          path: "/clientAnalyse",
          query: {
            compCode:this.companyCode, 
            ...data,
          }
      });
    },
    search() { //搜索
      console.log("搜索事件")
      this.getTableData()
    },
    sortRiskGrade(str1,str2) {
      //自定义排序
      let num1 = (str1.riskGrade === '高') ? 2 : (str1.riskGrade === '中') ? 1 : 0
      let num2 = (str2.riskGrade === '高') ? 2 : (str2.riskGrade === '中') ? 1 : 0
      return num1-num2
    }
  },
};
</script>

<style scoped lang="scss">
@import "customerLististStyle";
@import "tableStyle";
// .resAndSug{//表格文本最多显示两行
//   text-align: center;
//   text-overflow: ellipsis;
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// }
// .tooltip-item{
//   width: 190px;
//   text-align: center;
// }
</style>
