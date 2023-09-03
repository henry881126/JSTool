<template>
  <div class="gas-page-bg">
    <top-menu :date-picker-show="false" title="采销分析"></top-menu>
    <div class="day-month-tog-wrapper ps-an-date-wrapper">
      <el-button round @click="toggleDayHandler('m')" :class="{'custom-tab-button': true, 'custom-tab-button-active': toggleDate === 'm'}">月</el-button>
      <el-button round @click="toggleDayHandler('q')" :class="{'custom-tab-button': true, 'custom-tab-button-active': toggleDate === 'q'}">季</el-button>
      <el-button round @click="toggleDayHandler('y')" :class="{'custom-tab-button': true, 'custom-tab-button-active': toggleDate === 'y'}">年</el-button>
      <el-date-picker
          v-show="toggleDate === 'm'"
          v-model="m"
          type="monthrange"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          @change="mChange"
          format="yyyy/MM"
          class="custom-datepicker">
      </el-date-picker>
      <date-picker-q
          v-show="toggleDate === 'q'"
          :default-value="defaultQ"
          :get-value="getDateQ"
          class="custom-datepicker">
      </date-picker-q>
      <el-date-picker
          v-show="toggleDate === 'y'"
          v-model="y"
          type="year"
          @change="yChange"
          placeholder="选择年"
          class="custom-datepicker">
      </el-date-picker>
    </div>
    <div class="ps-an-title-wrapper">
      <p v-show="toggleDate === 'm'">
        {{m[0] === m[1] ? getFormatMonthDetail(m[0]) : getFormatMonthDetail(m[0]) + ' - ' + getFormatMonthDetail(m[1])}}销售业务情况
        <span>{{getFormatMonthPre(m[0], '/')}}/26 - {{getFormatMonth(m[1], '/')}}/25</span>
      </p>
      <p v-show="toggleDate === 'q'">
        {{ q[0] + '年第' + q[1] + '季度'  }}销售业务情况
        <span>{{ q[1] === 1 ? q[0] - 1 : q[0] }}/{{ q[1] === 1 ? 12 : q[1] * 3 - 3 }}/26 - {{ q[0] }}/{{ q[1] * 3 }}/25</span>
      </p>
      <p v-show="toggleDate === 'y'">
        {{ y }}销售业务情况
        <span>{{ y-1 }}/12/26 - {{ y }}/12/25</span>
      </p>
    </div>
    <div class="ps-an-card-wrapper">
      <div class="ps-an-card ps-an-card-ljxsl">
        <div>累计销售量</div>
        <p>
          {{ljxsl}}
          <span>（万方）</span>
        </p>
      </div>
      <div class="ps-an-card ps-an-card-ljxssr">
        <div>累计销售收入</div>
        <p>
          {{ljxssr}}
          <span>（万元）</span>
        </p>
      </div>
      <div class="ps-an-card ps-an-card-ljcb">
        <div>累计成本</div>
        <p>
          {{ljcb}}
          <span>（万元）</span>
        </p>
      </div>
      <div class="ps-an-card ps-an-card-ljlr">
        <div>累计利润</div>
        <p>
          {{ljlr}}
          <span>（万元）</span>
        </p>
      </div>
    </div>
    <div class="ps-an-m-container" v-show="toggleDate === 'm'">
      <div class="ps-an-m-title-wapper">
        <div class="ps-an-m-title">
          {{ m[0] === m[1] ? getFormatMonthDetail(m[0]) : getFormatMonthDetail(m[0]) + ' - ' + getFormatMonthDetail(m[1]) }}采销分析
          <el-tooltip popper-class="custom-tooltip" class="item" effect="dark" content="结算周期：开始月上月26日-结束月25日" placement="right">
            <div>
              <i class="el-icon-info" style="color: #0FB2AB;"></i>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="ps-an-m-table-wrapper">
        <el-table
            :data="mTable.list"
            stripe
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            class="custom-table"
            :show-summary="true"
            :summary-method="getSummaries"
            :span-method="mTableMerge"
            style="width: 100%; margin-top: 20px;">
          <el-table-column
              prop="time"
              align="center"
              label="日期">
            <template slot-scope="scope">
              {{getFormatMonth(scope.row.time, '/')}}
            </template>
          </el-table-column>
          <el-table-column
              prop="lifnrTxt"
              align="center"
              label="供应商">
          </el-table-column>
          <el-table-column
              prop="lifnrPrice"
              align="center">
            <template slot="header">
              <div>采购价格 <br/>（元/方）</div>
            </template>
            <template slot-scope="scope">
              <el-tooltip placement="top">
                <div slot="content">{{scope.row.lifnrPrice}}</div>
                <div class="two_lines_ellipsis">{{scope.row.lifnrPrice}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
              prop="pipelinePrice"
              align="center">
            <template slot="header">
              <div>管输价格 <br/>（元/方）</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="compCodeTxt"
              align="center"
              label="用气企业">
          </el-table-column>
          <el-table-column
              prop="compPrice"
              align="center">
            <template slot="header">
              <div>销售价格 <br/>（元/方）</div>
            </template>
            <template slot-scope="scope">
              <el-tooltip placement="top">
                <div slot="content">{{scope.row.compPrice}}</div>
                <div class="two_lines_ellipsis">{{scope.row.compPrice}}</div>
              </el-tooltip>
            </template>            
          </el-table-column>
          <el-table-column
              prop="compNum"
              align="center">
            <template slot="header">
              <div>销售气量 <br/>（万方）</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="compIncome"
              align="center">
            <template slot="header">
              <div>销售收入 <br/>（万元）</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="procurementCost"
              align="center">
            <template slot="header">
              <div>采购成本 <br/>（万元）</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="compProfits"
              align="center">
            <template slot="header">
              <div>利润 <br/>（万元）</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ps-an-table-tip-wrapper">
        <div style='float:right;' @click='handleEditClick' v-if='conclusion.text'><el-button round size='medium' class='el-icon-edit-outline' >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编辑</el-button></div>
        <div v-html='conclusion.text'></div>
      </div>
    </div>
    <div class="ps-an-m-container" v-show="toggleDate === 'q'">
      <div class="ps-an-m-title-wapper">
        <div class="ps-an-m-title">
          {{ q[0] + '年第' + q[1] + '季度'  }}采销分析
        </div>
      </div>
      <div class="ps-an-m-table-wrapper">
        <el-table
            :data="qTable.list"
            stripe
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            class="custom-table"
            :show-summary="true"
            :span-method="qTableMerge"
            :summary-method="getSummaries"
            style="width: 100%; margin-top: 20px;">
          <el-table-column
              prop="lifnrTxt"
              align="center"
              label="供应商">
          </el-table-column>
          <el-table-column
              prop="compCodeTxt"
              align="center"
              label="用气企业">
          </el-table-column>
          <el-table-column
              prop="compNum"
              align="center">
            <template slot="header">
              <div>销售气量 <br/>（万方）</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="compIncome"
              align="center">
            <template slot="header">
              <div>销售收入 <br/>（万方）</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="procurementCost"
              align="center">
            <template slot="header">
              <div>采购成本 <br/>（万元）</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="compProfits"
              align="center">
            <template slot="header">
              <div>利润 <br/>（万元）</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="ps-an-q-chart-container ps-an-m-container" v-show="toggleDate === 'y'">
      <div class="ps-an-m-title-wapper">
        <div class="ps-an-m-title">
          {{ this.y }}年销售数据趋势
        </div>
      </div>
      <div id="chart2" style="height: 370px;">

      </div>
    </div>
    <div class="ps-an-m-container" v-show="toggleDate === 'y'">
      <div class="ps-an-m-title-wapper">
        <div class="ps-an-m-title">
          {{ this.y }}年采销分析
        </div>
      </div>
      <div class="ps-an-m-table-wrapper">
        <el-table
            :data="yTable.list"
            stripe
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            class="custom-table"
            :show-summary="true"
            :span-method="yTableMerge"
            :summary-method="getSummaries"
            style="width: 100%; margin-top: 20px;">
          <el-table-column
              prop="lifnrTxt"
              align="center"
              label="供应商">
          </el-table-column>
          <el-table-column
              prop="compCodeTxt"
              align="center"
              label="用气企业">
          </el-table-column>
          <el-table-column
              prop="compNum"
              align="center">
            <template slot="header">
              <div>销售气量 <br/>（万方）</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="compIncome"
              align="center">
            <template slot="header">
              <div>销售收入 <br/>（万元）</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="procurementCost"
              align="center">
            <template slot="header">
              <div>采购成本 <br/>（万元）</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="compProfits"
              align="center">
            <template slot="header">
              <div>利润 <br/>（万元）</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 编辑表单 -->
    <el-dialog title="业务总结" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="conclusion" label-position="left"  style="margin:0 30px;">
        <el-form-item>
          <quill-editor v-model='conclusion.text' style='width:100%;'></quill-editor>
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateConclusionData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import topMenu from "../../components/topMenu/topMenu";
import api from '/src/http/api';
import datePickerQ from "../../components/customUI/datePickerQ";
import dateFormater from "../../components/dateFormater/dateFormater";
import mTableMerge from './mergeTable'
import { quillEditor } from 'vue-quill-editor'
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'
export default {
  name: "psAnalyse",
  mixins: [dateFormater, mTableMerge, buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
  data: function () {
    return {
      toggleDate: 'm',
      m: [],
      q: [],
      defaultQ: '',
      y: '',
      ljxsl: 0,
      ljxssr: 0,
      ljcb: 0,
      ljlr: 0,
      conclusion:{
        id:'',
        text:''
      },
      dialogFormVisible:false,
      mTable: {
        list: []
      },
      mMergeTableList: {},
      qTable: {
        list: []
      },
      yTable: {
        list: []
      },
      qCharts: null,
      optionY: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          bottom: '26px',
          right: '46px',
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '76px',
          containLabel: true
        },
        yAxis: [
          {
            name: '销量（万方）',
            type: 'value'
          },{
            name: '利润（万元）',
            type: 'value',
            splitLine: {
              show: false
            }
          }
        ],
        xAxis: {
          type: 'category',
          data: []
        },
        series: []
      }
    }
  },
  created: function () {
    this.setDefaultMQY();
    this.getData();
    this.getConclusion();
  },
  components: {
    topMenu,
    datePickerQ,
    quillEditor
  },

  computed: {
    curComCode: function () {
      return this.$store.getters.curCom
    }
  },

  watch:  {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if(n && o) {
          this.getData()
        }
      }
    }
  },

  methods: {
    handleEditClick: function() {
      this.dialogFormVisible = true
    },
    updateConclusionData: function() {
      let params = {
        id:this.conclusion.id,
        conclusion:this.conclusion.text
      }
      api.psAnalyse.psAnalyseSaveConclusion(params).then(res => {
        if(res) {
           this.dialogFormVisible = false
           this.$notify({
              title: '更新操作',
              message: '更新数据成功',
              type: 'success',
              duration: 2000
          })
        }
      })
    },
    /**
     * 气量调配/采销分析
     * 获取“业务总结、毛利情况”
     */
    getConclusion: function(time='') {
      let params = {
        code: this.curComCode,
        time:time || this.getFormatMonth(this.m[0]),      
      }
      api.psAnalyse.psAnalyseGetConclusion(params).then(res => {
        if (res) {
          this.conclusion.id = res[0].id
          // this.conclusion.text = res[0].text.split('\n')
          this.conclusion.text = res[0].text
        }
      })
    },
    setDefaultMQY: function () {
      let now = new Date();
      let lastMonth = new Date().setMonth(now.getMonth() - 1);
      let lastQ = Math.ceil((now.getMonth() + 1)/3) - 1;
      let lastYear = now.getFullYear() - 1;
      let currentYear = now.getFullYear();    // 当年的年份值
      this.m = [this.getFormatMonth(lastMonth), this.getFormatMonth(lastMonth)];
      this.q[0] = lastQ === 0 ? lastYear : now.getFullYear();
      this.q[1] = lastQ === 0 ? 4 : lastQ;
      this.defaultQ = this.q[0] + '-' + this.q[1]
      // this.y = lastYear.toString()
      this.y = currentYear.toString()   // 用户单击“年”选项，日期选择器中默认年份是当年
    },
    getData: function () {
      switch (this.toggleDate) {
        case 'm':
          this.getDataOfM();
          this.getTotalM();
          break;
        case 'q':
          this.getDataOfQ();
          this.getTotalQ();
          break;
        case 'y':
          this.getDataOfY();
          this.getTotalY();
          break;
        default:
          break;
      }
    },
    getDataOfM: function (){
      let params = {
        code: this.curComCode,
        startTime: this.getFormatMonth(this.m[0]),
        endTime: this.getFormatMonth(this.m[1])
      }
      api.psAnalyse.psAnalyseM(params).then(res => {
        if(res) {
          this.mTable.list = res[0].smartReportMonthAdoptPins
        }
      })
      // 日期改变时，修改业务总结、毛利情况编辑框内容
      let time = params.startTime
      this.getConclusion(time)
    },
    getDataOfQ: function () {
      let params = {
        code: this.curComCode,
        year: this.q[0].toString(),
        quarter: this.q[1].toString()
      }
      api.psAnalyse.psAnalyseQ(params).then(res => {
        if(res) {
          this.qTable.list = res[0].quarterAdoptPinList
        }
      })
    },
    getDataOfY: function () {
      let params = {
        code: this.curComCode,
        year: this.y
      }
      api.psAnalyse.psAnalyseY(params).then(res => {
        if(res) {
          this.yTable.list = res[0].smartReportYearAdoptPin
        }
      })
      let paramsCharts = {
        code: this.curComCode,
        startTime: this.y + '-01',
        endTime: this.y + '-12'
      }
      api.psAnalyse.psAnalyseM(paramsCharts).then(res => {
        if(res) {
          this.echartsOptionHandler(res[0].smartReportMonthAdoptPins)
        }
      })
    },
    echartsOptionHandler: function (data) {
      this.optionY.xAxis.data = [];
      this.optionY.series = [];
      let y = {};
      for (let i = 1; i <= 12; i++) {
        let mm = i < 10 ? '0' + i : i;
        this.optionY.xAxis.data.push(this.y + '-' + mm)
        y[this.y + '-' + mm] = {}
      }
      let comp = [];
      for (let v of data) {
        if(comp.indexOf(v.compCodeTxt) === -1) {
          comp.push(v.compCodeTxt)
        }
        if(y[v.time][v.compCodeTxt]) {
          y[v.time][v.compCodeTxt] += v.compNum
        } else {
          y[v.time][v.compCodeTxt] = v.compNum || 0
        }
        if(y[v.time]['lr']) {
          y[v.time]['lr'] += v.compProfits
        } else {
          y[v.time]['lr'] = v.compProfits || 0
        }
      }
      this.optionY.legend.data = comp.concat([]);
      this.optionY.legend.data.push('利润')
      for (let v of comp) {
        let s = {
          name: v,
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          barWidth: '50',
          emphasis: {
            focus: 'series'
          },
          data: []
        }
        for (let i = 0; i < this.optionY.xAxis.data.length; i++) {
          s.data[i] = y[this.optionY.xAxis.data[i]][v] || 0
        }
        this.optionY.series.push(s)
      }
      let slr = {
        name: '利润',
        type: 'line',
        yAxisIndex: 1,
        data: []
      }
      for (let i = 0; i < this.optionY.xAxis.data.length; i++) {
        slr.data[i] = y[this.optionY.xAxis.data[i]]['lr'] || 0
      }
      this.optionY.series.push(slr)
      this.qCharts.setOption(this.optionY, true)
    },

    mChange: function () {
      this.getData()
    },
    yChange: function (year) {
      this.y = year.getFullYear().toString()
      this.getData()
    },
    toggleDayHandler: function (type) {
      this.toggleDate = type;
      this.getData();
      switch (type) {
        case 'y':
          this.$nextTick(() => {
            this.qCharts = this.$echarts.init(document.getElementById('chart2'));
          })
          break;
      }
    },
    getTotal: function (params) {
      api.psAnalyse.psAnalyseTotal(params).then(res => {
        if(res) {
          this.ljxsl = res[0].saleNum || 0
          this.ljxssr = res[0].saleIncome || 0
          this.ljcb = res[0].saleCost || 0
          this.ljlr = res[0].saleProfits || 0
        }
      })
    },
    getTotalM: function () {
      let params = {
        code: this.curComCode,
        type: '1',
        startTime: this.getFormatMonth(this.m[0]),
        endTime: this.getFormatMonth(this.m[1]),
        time: 0,
        year: 0
      }
      this.getTotal(params)
    },
    getTotalQ: function () {
      let params = {
        code: this.curComCode,
        type: '2',
        startTime: 0,
        endTime: 0,
        time: this.q[1],
        year: this.q[0]
      }
      this.getTotal(params)
    },
    getTotalY: function () {
      let params = {
        code: this.curComCode,
        type: '3',
        startTime: 0,
        endTime: 0,
        time: 0,
        year: this.y
      }
      this.getTotal(params)
    },
    getDateQ: function (y, q) {
      this.q = [y, q];
      this.getData()
    },
    getSummaries: function (param) {
      let indexBegin;
      if(this.toggleDate === 'm') {
        indexBegin = 5
      } else {
        indexBegin = 1
      }
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index <= indexBegin) {
          sums[0] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        sums[index] = values.reduce((prev, curr) => {
          return (parseFloat(prev) + parseFloat(curr)).toFixed(2);
        }, 0);
      });
      return sums;
    }
  }
}
</script>
<style scoped>
.ps-an-date-wrapper {
  position: absolute;
  top: 56px;
  left: 224px;
}
.custom-datepicker {
  background: #567db9;
  border-radius: 20px;
  border: none;
  color: #ffffff !important;
}
.ps-an-title-wrapper {
  height: 33px;
  margin-top: 40px;
  margin-left: 30px;
  width: calc(100% - 60px);
  font-size: 24px;
  line-height: 33px;
  color: #FFFFFF;
  vertical-align: bottom;
}
.ps-an-title-wrapper span {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 22px;
  color: #FFFFFF;
  vertical-align: bottom;
}
.ps-an-card-wrapper {
  width: calc(100% - 60px);
  height: 150px;
  display: flex;
  margin-top: 24px;
  margin-left: 30px;
  justify-content: space-between;
}
.ps-an-card {
  height: 150px;
  width: 382px;
  background-size: 100% auto;
  background-repeat: no-repeat;
  position: relative;
}
.ps-an-card-ljxsl {
  background-image: url("./assets/ljxsl.png");
}
.ps-an-card-ljxssr {
  background-image: url("./assets/ljxssr.png");
}
.ps-an-card-ljcb {
  background-image: url("./assets/ljcb.png");
}
.ps-an-card-ljlr {
  background-image: url("./assets/ljlr.png");
}
.ps-an-card div {
  height: 25px;
  font-size: 18px;
  line-height: 25px;
  color: #FFFFFF;
  position: absolute;
  top: 25px;
  left: 28px;
}
.ps-an-card p {
  height: 52px;
  font-size: 45px;
  line-height: 52px;
  color: #FFFFFF;
  position: absolute;
  top: 60px;
  left: 28px;
  vertical-align: bottom;
  margin: 0;
}
.ps-an-card p span {
  display: inline-block;
  font-size: 18px;
  color: #FFFFFF;
  opacity: 0.9;
}
.ps-an-m-container {
  margin: 26px 32px;
  width: calc(100% - 64px);
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(38, 51, 88, 0.07);
  overflow: hidden;
  font-size: 16px;
}
.ps-an-m-title-wapper {
  height: 46px;
  width: calc(100% - 60px);
  margin-top: 16px;
  line-height: 46px;
  margin-left: 30px;
}
.ps-an-m-title {
  display: inline-block;
  float: left;
  font-size: 24px;
  font-weight: 500;
  color: #2C3E50;
  opacity: 1;
}
.ps-an-m-table-wrapper {
  padding: 0 30px;
  padding-bottom: 20px;
  overflow: hidden;
}
.ps-an-m-title .item {
  display: inline-block;

}
.ps-an-table-tip-wrapper {
  width: calc(100% - 60px);
  background: #F6F6F6;
  opacity: 1;
  border-radius: 26px;
  padding: 20px 30px;
  margin-left: 30px;
  box-sizing: border-box;
  margin-bottom: 30px;
}
.ps-an-q-chart-container {
  width: calc(100% - 60px);
  height: 433px;
  background: #FFFFFF;
  box-shadow: 0px 10px 20px rgba(38, 51, 88, 0.07);
  opacity: 1;
  border-radius: 12px;
  margin-top: 26px;
  margin-left: 30px;
}
.custom-tab-button {
  margin-right: 20px;
  margin-left: 0;
  color: #FFF;
  background-color: #567DB9;
  border-color: #567DB9;
}
.custom-tab-button-active {
  color: #FFF;
  background-color: #0FB2AB;
  border-color: #0FB2AB;
}
.two_lines_ellipsis {
  display:-webkit-box;
  text-overflow:ellipsis;
  overflow:hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient:vertical;
}
</style>