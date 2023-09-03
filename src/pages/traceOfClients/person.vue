<template>
  <div>
    <div class="radio-wrapper">
      <el-radio-group v-model="radio" @change="typeChange" class="custom-radio">
        <el-radio :label="1">全选</el-radio>
        <el-radio :label="2">普表</el-radio>
        <el-radio :label="3">卡表</el-radio>
        <el-radio :label="4">物联网表</el-radio>
      </el-radio-group>
    </div>
    <div class="banner-card-wrapper charts-card-wrapper" v-show="radio === 1 || radio === 3 || radio === 4">
      <div class="data-show-container">
        <div class="title">数据解读</div>
        <div class="data-show-wrapper" v-html="allSelectText">
        </div>
        <div class="title add-title">补充说明</div>
        <div class="save-btn" @click="saveText(allSelectInput)">保存</div>
        <div class="data-add-wrapper">
          <el-input v-model="allSelectInput" type="textarea" resize="none" class="trace-textarea"></el-input>
        </div>
      </div>
      <div class="echarts-container">
        <div class="title">
          {{getFormatMonth(time, '年')}}月民用户气量同比环比变化图示
          <br>
          单位：万方
        </div>
        <div class="echarts-wrapper" id="all-select-charts">

        </div>
      </div>
    </div>
<!--    <div class="banner-card-wrapper pubiao-huizong-wrapper" v-show="radio === 2">-->
<!--      <div class="banner-wrapper-title">-->
<!--        {{getFormatMonth(time, '年')}}月普表用气汇总-->
<!--      </div>-->
<!--    </div>-->
    <div class="banner-card-wrapper wangge-yongqi-wrapper" v-show="radio === 2">
      <div class="banner-wrapper-title" style="width: calc(100% - 452px);">
        {{getFormatMonth(time, '年')}}月网格用气汇总
        <div style="font-size: 18px;">单位：万方</div>
        <el-button round plain type="success" @click="exportWGExcel()" class="custom-button" icon="el-icon-upload2" >导出</el-button>
      </div>
      <div class="data-show-container">
        <div class="title">数据解读</div>
        <div class="data-show-wrapper" v-html="pkwgText">
        </div>
        <div class="title add-title">补充说明</div>
        <div class="save-btn" @click="saveText(pkwgInput)">保存</div>
        <div class="data-add-wrapper" style="height: 195px;">
          <el-input v-model="pkwgInput" type="textarea" resize="none" class="trace-textarea"></el-input>
        </div>
      </div>
      <div class="pkwg-table-wrapper">
        <el-table
            :data="pkwgTable"
            stripe
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            class="custom-table-r"
            height="426px"
            :show-summary="true"
            :summary-method="getSummariesOfPKWG"
            ref="pkwgTable"
            style="width: 100%; margin-top: 20px;">
          <el-table-column
              prop="area"
              align="center"
              label="网格">
          </el-table-column>
          <el-table-column
              prop="yc"
              align="center"
              label="应抄户数">
          </el-table-column>
          <el-table-column
              prop="sc"
              align="center"
              label="实抄户数">
          </el-table-column>
          <el-table-column
              prop="no_abrmenge"
              align="center"
              label="0气量户数">
          </el-table-column>
          <el-table-column
              prop="cs_pro"
              align="center"
              label="抄收率">
          </el-table-column>
          <el-table-column
              prop="wc"
              align="center"
              label="未抄到户数">
          </el-table-column>
          <el-table-column
              prop="es"
              align="center"
              label="预估未回气量">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="banner-card-wrapper kabiao-yongqi-wrapper" v-show="radio === 3">
      <div class="banner-wrapper-title">
        {{getFormatMonth(time, '年')}}月卡表用气明细
        <div style="font-size: 18px;">单位：万方</div>
        <el-button round plain type="success" @click="exportKBExcel()" class="custom-button" icon="el-icon-upload2">导出</el-button>
      </div>
      <div class="kb-table-wrapper">
        <el-table
            :data="kbTable"
            stripe
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            class="custom-table-r"
            :show-summary="true"
            :summary-method="getSummariesOfKB"
            ref="kbTable"
            style="width: 100%; margin-top: 20px;">
          <el-table-column
              prop="cuslabel"
              align="center"
              label="用气性质">
          </el-table-column>
          <el-table-column
              prop="v_abrmenge"
              align="center"
              label="本月用气量">
          </el-table-column>
          <el-table-column
              prop="lastm_abrmenge"
              align="center"
              label="上月用气量">
          </el-table-column>
          <el-table-column
              prop="v_lastm"
              align="center"
              label="环比气量差">
          </el-table-column>
          <el-table-column
              prop="m_growth"
              align="center"
              label="环比偏差率">
          </el-table-column>
          <el-table-column
              prop="lasty_abrmenge"
              align="center"
              label="去年同月用气量">
          </el-table-column>
          <el-table-column
              prop="v_lasty"
              align="center"
              label="同比气量偏差">
          </el-table-column>
          <el-table-column
              prop="y_growth"
              align="center"
              label="同比偏差率">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="banner-card-wrapper wulian-yongqi-wrapper" v-show="radio === 4">
      <div class="banner-wrapper-title">
        {{getFormatMonth(time, '年')}}月物联网表用气明细
        <div style="font-size: 18px;">单位：万方</div>
        <el-button round plain type="success" @click="exportWLExcel()" class="custom-button" icon="el-icon-upload2">导出</el-button>
      </div>
      <div class="kb-table-wrapper">
        <el-table
            :data="wlTable"
            stripe
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            class="custom-table-r"
            :show-summary="true"
            :summary-method="getSummariesOfWL"
            ref="wlTable"
            style="width: 100%; margin-top: 20px;">
          <el-table-column
              prop="cuslabel"
              align="center"
              label="用气性质">
          </el-table-column>
          <el-table-column
              prop="v_abrmenge"
              align="center"
              label="本月用气量">
          </el-table-column>
          <el-table-column
              prop="lastm_abrmenge"
              align="center"
              label="上月用气量">
          </el-table-column>
          <el-table-column
              prop="v_lastm"
              align="center"
              label="环比气量差">
          </el-table-column>
          <el-table-column
              prop="m_growth"
              align="center"
              label="环比偏差率">
          </el-table-column>
          <el-table-column
              prop="lasty_abrmenge"
              align="center"
              label="去年同月用气量">
          </el-table-column>
          <el-table-column
              prop="v_lasty"
              align="center"
              label="同比气量偏差">
          </el-table-column>
          <el-table-column
              prop="y_growth"
              align="center"
              label="同比偏差率">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '/src/http/api'
import exportApi from '/src/components/export/export'
import dateFormater from "../../components/dateFormater/dateFormater";
export default {
  name: "person",
  mixins: [dateFormater, exportApi],
  props: {
    time: String
  },
  data: function () {
    return {
      radio: 1,
      allSelectCharts: null,
      allSelectChartsOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          top: 50,
        },
        legend: {
          bottom: 20,
          right: 50,
          data: []
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            boundaryGap: false,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            offset: 30
          },
          {
            type: 'value',
            offset: 30
          }
        ],
        series: []
      },
      allSelectText: '',
      allSelectInput: '',
      pkwgText: '',
      pkwgInput: '',
      pkwgTable: [],
      summariesOfPKWG: {},
      kbTable: [],
      summariesOfKB: {},
      wlTable: [],
      summariesOfWL: {}
    }
  },
  created() {
    this.getData()
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
    },
    time: {
      immediate: true,
      handler: function (n, o) {
        if(n && o) {
          this.getData()
        }
      }
    }
  },
  mounted() {
    this.allSelectCharts = this.$echarts.init(document.getElementById('all-select-charts'))
  },
  methods: {
    getData: function () {
      switch (this.radio) {
        case 1:
          this.getAllSelectChartsOfPerson();
          break;
        case 2:
          this.getPKWGData();
          break;
        case 3:
          this.getKBCharts();
          this.getKBTableData();
          break;
        case 4:
          this.getWLWCharts();
          this.getWLWTableData();
          break;
        default:
          break;
      }
    },
    getAllSelectChartsOfPerson: function () {
      let params = {
        budat: this.getFormatMonth(this.time, ''),
        compCode: this.curComCode
      }
      api.gasReservesAnalysis.getAllSelectChartsOfPerson(params).then(res => {
        if(res) {
          this.allSelectText = res[0].explain
          this.allSelectInput = res[0].replenish
          this.allSelectChartsOption.xAxis[0].data = ['普表', '卡表', '物联网表']
          this.allSelectChartsOption.legend.data = [this.getFormatYearPre(this.time).toString(), this.getFormatYear(this.time).toString(), '同比增长', '环比增长']
          this.allSelectChartsOption.series[0] = {
            name: this.getFormatYearPre(this.time).toString(),
            type: 'bar',
            barWidth: 14,
            data: [res[0].lastYearCuspAbrmenge, res[0].lastYearCuskAbrmenge, res[0].lastYearCusycAbrmenge]
          }
          this.allSelectChartsOption.series[1] = {
            name: this.getFormatYear(this.time).toString(),
            type: 'bar',
            barWidth: 14,
            data: [res[0].thisMonthCuspAbrmenge, res[0].thisMonthCuskAbrmenge, res[0].thisMonthCusycAbrmenge]
          }
          this.allSelectChartsOption.series[2] = {
            name: '同比增长',
            type: 'line',
            yAxisIndex: 1,
            smooth:true,
            data: [res[0].yearGrowthCuspAbrmenge, res[0].yearGrowthCuskAbrmenge, res[0].yearGrowthCusycAbrmenge]
          }
          this.allSelectChartsOption.series[3] = {
            name: '环比增长',
            type: 'line',
            yAxisIndex: 1,
            smooth:true,
            data: [res[0].ringCuspAbrmenge, res[0].ringCuskAbrmenge, res[0].ringCusycAbrmenge]
          }
          this.allSelectCharts.setOption(this.allSelectChartsOption, true)
        }
      });
    },
    getPKWGData: function () {
      let params = {
        budat: this.getFormatMonth(this.time, ''),
        compCode: this.curComCode
      }
      api.gasReservesAnalysis.getPBWGtableOfPerson(params).then(res => {
        if(res) {
          this.pkwgTable = []
          for (let v of res[0].civilOrdinaryVOList) {
            if(v.area !== '合计') {
              this.pkwgTable.push(v)
            } else if (v.area === '合计') {
              this.summariesOfPKWG = v
            }
          }
          this.pkwgText = res[0].explain
          this.pkwgInput = res[0].replenish
        }
      })
    },
    getKBCharts: function () {
      let params = {
        budat: this.getFormatMonth(this.time, ''),
        compCode: this.curComCode
      }
      api.gasReservesAnalysis.getKBChartsOfPerson(params).then(res => {
        if(res) {
          this.allSelectText = res[0].explain
          this.allSelectInput = res[0].replenish
          this.allSelectChartsOption.xAxis[0].data = ['采暖炉', '热水器', '灶具']
          this.allSelectChartsOption.legend.data = [this.getFormatYearPre(this.time).toString(), this.getFormatYear(this.time).toString(), '同比增长', '环比增长']
          this.allSelectChartsOption.series[0] = {
            name: this.getFormatYearPre(this.time).toString(),
            type: 'bar',
            barWidth: 14,
            data: [res[0].lastYearHeatingVAbrmenge, res[0].lastYearHotWaterVAbrmenge, res[0].lastYearCookerVAbrmenge]
          }
          this.allSelectChartsOption.series[1] = {
            name: this.getFormatYear(this.time).toString(),
            type: 'bar',
            barWidth: 14,
            data: [res[0].heatingVAbrmenge, res[0].hotWaterVAbrmenge, res[0].cookerVAbrmenge]
          }
          this.allSelectChartsOption.series[2] = {
            name: '同比增长',
            type: 'line',
            yAxisIndex: 1,
            smooth:true,
            data: [res[0].heatingYGrowth, res[0].hotWaterYGrowth, res[0].cookerYGrowth]
          }
          this.allSelectChartsOption.series[3] = {
            name: '环比增长',
            type: 'line',
            yAxisIndex: 1,
            smooth:true,
            data: [res[0].heatingMGrowth, res[0].hotWaterMGrowth, res[0].cookerMGrowth]
          }
          this.allSelectCharts.setOption(this.allSelectChartsOption, true)
        }
      })
    },
    getKBTableData: function () {
      let params = {
        budat: this.getFormatMonth(this.time, ''),
        compCode: this.curComCode
      }
      api.gasReservesAnalysis.getKBTableOfPerson(params).then(res => {
        if(res) {
          this.kbTable = []
          for (let v of res[0]) {
            if(v.cuslabel !== '合计') {
              this.kbTable.push(v)
            } else if(v.cuslabel === '合计') {
              this.summariesOfKB = v
            }
          }
        }
      });
    },
    getWLWCharts: function () {
      let params = {
        budat: this.getFormatMonth(this.time, ''),
        compCode: this.curComCode
      }
      api.gasReservesAnalysis.getWLBChartsOfPerson(params).then(res => {
        if(res) {
          this.allSelectText = res[0].explain
          this.allSelectInput = res[0].replenish
          this.allSelectChartsOption.xAxis[0].data = ['煤改气', '市区采暖', '灶具热水器']
          this.allSelectChartsOption.legend.data = [this.getFormatYearPre(this.time).toString(), this.getFormatYear(this.time).toString(), '同比增长', '环比增长']
          this.allSelectChartsOption.series[0] = {
            name: this.getFormatYearPre(this.time).toString(),
            type: 'bar',
            barWidth: 14,
            data: [res[0].coal_to_gas_lasty_abrmenge, res[0].urban_heating_lasty_abrmenge, res[0].s_water_heater_lasty_abrmenge]
          }
          this.allSelectChartsOption.series[1] = {
            name: this.getFormatYear(this.time).toString(),
            type: 'bar',
            barWidth: 14,
            data: [res[0].coal_to_gas_v_abrmenge, res[0].urban_heating_v_abrmenge, res[0].s_water_heater_v_abrmenge]
          }
          this.allSelectChartsOption.series[2] = {
            name: '同比增长',
            type: 'line',
            yAxisIndex: 1,
            smooth:true,
            data: [res[0].coal_to_gas_y_growth, res[0].urban_heating_y_growth, res[0].s_water_heater_y_growth]
          }
          this.allSelectChartsOption.series[3] = {
            name: '环比增长',
            type: 'line',
            yAxisIndex: 1,
            smooth:true,
            data: [res[0].coal_to_gas_m_growth, res[0].urban_heating_m_growth, res[0].s_water_heater_m_growth]
          }
          this.allSelectCharts.setOption(this.allSelectChartsOption, true)
        }
      })
    },
    getWLWTableData: function () {
      let params = {
        budat: this.getFormatMonth(this.time, ''),
        compCode: this.curComCode
      }
      api.gasReservesAnalysis.getWLBTableOfPerson(params).then(res => {
        if(res) {
          this.wlTable = []
          for (let v of res) {
            if(v.cuslabel !== '合计') {
              this.wlTable.push(v)
            }else if(v.cuslabel === '合计') {
              this.summariesOfWL = v
            }
          }
        }
      })
    },
    saveText: function (text) {
      let type = 0;
      switch (this.radio) {
        case 1:
          type = '4';
          break;
        case 2:
          type = '5';
          break;
        case 3:
          type = '6';
          break;
        case 4:
          type = '7';
          break;
      }
      let data = {
        compCode: this.curComCode,
        text: text,
        type: type
      }
      api.gasReservesAnalysis.saveSupplementExplain(data).then(res => {
        if(res) {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 1000
          })
        }
      })
    },
    typeChange: function () {
      this.getData()
    },
    exportWGExcel: function () {
      let params = {
        budat: this.getFormatMonth(this.time, ''),
        compCode: this.curComCode
      }
      api.gasReservesAnalysis.getPBWGtableOfPersonexport(params).then(res => {
        this.download(res, 'xls', 'export')
      })
    },
    exportKBExcel: function () {
      let params = {
        budat: this.getFormatMonth(this.time, ''),
        compCode: this.curComCode
      }
      api.gasReservesAnalysis.getKBTableOfPersonExport(params).then(res => {
        this.download(res, 'xls', 'export')
      })
    },
    exportWLExcel: function () {
      let params = {
        budat: this.getFormatMonth(this.time, ''),
        compCode: this.curComCode
      }
      api.gasReservesAnalysis.getWLBTableOfPersonExport(params).then(res => {
        this.download(res, 'xls', 'export')
      })
    },
    getSummariesOfPKWG: function () {
      return ['合计',
        this.summariesOfPKWG.yc,
        this.summariesOfPKWG.sc,
        this.summariesOfPKWG.no_abrmenge,
        this.summariesOfPKWG.cs_pro,
        this.summariesOfPKWG.wc,
        this.summariesOfPKWG.es,
      ];
    },
    getSummariesOfKB: function () {
      return ['合计',
        this.summariesOfKB.v_abrmenge,
        this.summariesOfKB.lastm_abrmenge,
        this.summariesOfKB.v_lastm,
        this.summariesOfKB.m_growth,
        this.summariesOfKB.lasty_abrmenge,
        this.summariesOfKB.v_lasty,
        this.summariesOfKB.y_growth,
      ]
    },
    getSummariesOfWL: function () {
      return ['合计',
        this.summariesOfWL.v_abrmenge,
        this.summariesOfWL.lastm_abrmenge,
        this.summariesOfWL.v_lastm,
        this.summariesOfWL.m_growth,
        this.summariesOfWL.lasty_abrmenge,
        this.summariesOfWL.v_lasty,
        this.summariesOfWL.y_growth,
      ]
    }
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.pkwgTable.doLayout()
      this.$refs.kbTable.doLayout()
      this.$refs.wlTable.doLayout()
    })
  }
}
</script>

<style scoped lang="scss">
  .radio-wrapper {
    width: 90%;
    margin-left: 30px;
    margin-top: 30px;
  }
  .banner-card-wrapper {
    width: calc(100% - 64px);
    background: #ffffff;
    box-shadow: 0px 10px 20px rgba(38, 51, 88, 0.07);
    opacity: 1;
    border-radius: 12px;
    margin-left: 30px;
    margin-top: 30px;
    position: relative;
    overflow: hidden;
  }
  .charts-card-wrapper {
    height: 543px;
    margin-top: 15px;
  }
  .data-show-container {
    width: 328px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
  }
  .data-show-container .title {
    height: 58px;
    line-height: 58px;
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    text-indent: 9px;
  }
  .add-title {
    position: absolute;
    top: 333px;
  }
  .save-btn {
    font-size: 18px;
    font-weight: 400;
    color: #0FB2AB;
    position: absolute;
    right: 30px;
    top: 351px;
    cursor: pointer;
  }
  .data-show-wrapper {
    width: 328px;
    height: 275px;
    background: #F2F3F6;
    border-radius: 10px;
    position: absolute;
    top: 58px;
    right: 18px;
    padding: 18px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .data-add-wrapper {
    width: 328px;
    height: 133px;
    background: #F2F3F6;
    border-radius: 10px;
    position: absolute;
    bottom: 18px;
    right: 18px;
  }
  .echarts-container {
    width: calc(100% - 400px);
    height: 100%;
    position: relative;
  }
  .echarts-container .title {
    height: 72px;
    margin-left: 30px;
    line-height: 30px;
    margin-top: 12px;
  }
  .echarts-wrapper {
    width: 100%;
    height: 450px;
    margin-left: 30px;
  }
  .pubiao-huizong-wrapper {
    height: 524px;
  }
  .wangge-yongqi-wrapper {
    height: 600px;
    margin-top: 15px;
  }
  .kabiao-yongqi-wrapper {
    height: 435px;
  }
  .wulian-yongqi-wrapper {
    height: 435px;
  }
  .banner-wrapper-title {
    height: 53px;
    font-size: 24px;
    font-weight: 500;
    line-height: 33px;
    color: #2c3e50;
    opacity: 1;
    margin-top: 24px;
    margin-left: 30px;
    width: calc(100% - 60px);
    position: relative;
  }
  .trace-textarea {
    height: 100%;
    /deep/ .el-textarea__inner {
      border: none;
      background: #F2F3F6;
      height: 100%;
    }
  }
  .pkwg-table-wrapper {
    width: calc(100% - 452px);
    margin-left: 30px;
    margin-top: 30px;
  }
  .kb-table-wrapper {
    padding: 10px 30px;
  }
  .custom-button {
    position: absolute;
    top: 10px;
    right: 20px;
  }
</style>