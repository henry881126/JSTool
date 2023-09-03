<template>
  <div class="page-bg">
    <top-menu :date-picker-show="false"
              title="需供统计跟踪"></top-menu>
    <div class="day-month-tog-wrapper">
      <el-form :inline="true" :model="selectForm" class="demo-form-inline">
        <el-button round @click="toggleDayHandler('d')" :class="{'custom-tab-button': true, 'custom-tab-button-active': toggleDate === 'd'}">日</el-button>
        <el-button round @click="toggleDayHandler('m')" :class="{'custom-tab-button': true, 'custom-tab-button-active': toggleDate === 'm'}">月</el-button>
        <el-date-picker
            v-show="toggleDate === 'd'"
            v-model="d"
            type="date"
            @change="dChange"
            format="yyyy/MM/dd"
            class="custom-datepicker">
        </el-date-picker>
        <el-date-picker
            v-show="toggleDate === 'm'"
            v-model="m"
            type="year"
            @change="mChange"
            format="yyyy"
            class="custom-datepicker">
        </el-date-picker>
        <el-form-item label="企业">
          <div class="gas-page-com-wrapper">
            <el-select v-model="selectForm.zuheValue" class="gas-el-select" @change="companyChange">
              <el-option :label="v.name" :value="i" v-for="(v, i) in zuheList" :key="i"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="气源" v-if="toggleDate === 'm'">
          <div class="gas-page-com-wrapper">
            <el-select v-model="selectForm.pointValue" class="gas-el-select" @change="gasPointChange">
              <el-option :label="v.dictName" :value="i" v-for="(v, i) in pointList" :key="v.dictId"></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="card-wrapper" v-if="toggleDate === 'd'">
      <div class="banner-title-wrapper" v-if="zuheList.length > 0">
        <div class="banner-title-item-l banner-title-item-l-name">
          <span><b>{{dataDTitle.managerName }}</b></span>
        </div>
        <div class="banner-title-item-l banner-title-item-l-xuqiu">
          <span><b>需求：{{ dataDTitle.demandVolume }} 万方</b></span>
        </div>
        <div class="banner-title-item-l banner-title-item-l-quekou">
          <span><b>缺口：{{ dataDTitle.gapVolume }} 万方</b></span>
        </div>
        <el-button size="small" round plain @click="exportDayData()" class="custom-button" icon="el-icon-upload2">导出</el-button>
      </div>
      <div class="banner-table-wrapper">
        <div class="tip-wrapper">
          单位：万方
        </div>
        <el-table
            v-loading="loading"
            :data="dataD"
            border
            :span-method="tableDayMerge"
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            max-height="725"
            empty-text=" "
            class="custom-table-n">
          <el-table-column
              label="企业"
              align="center">
            <template slot-scope="scope">
              <span class="bold">
                {{ scope.row.managerName === null ? '-' : scope.row.managerName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="气源来源">
            <template slot-scope="scope">
              <span :class="{'bold': scope.row.gasSource === '合计' || scope.row.isTotal }">
                {{ scope.row.gasSource === null ? '-' : scope.row.gasSource }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="日均合同">
            <template slot-scope="scope">
              <span :class="{'bold': scope.row.gasSource === '合计' || scope.row.isTotal }">
                {{ scope.row.dayAvgVolume === null ? '-' : scope.row.dayAvgVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="剩余日均">
            <template slot-scope="scope">
              <span :class="{'bold': scope.row.gasSource === '合计' || scope.row.isTotal }">
                {{ scope.row.dayAvgSurplusVolume === null ? '-' : scope.row.dayAvgSurplusVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="上报">
            <template slot-scope="scope">
              <span :class="{'bold': scope.row.gasSource === '合计' || scope.row.isTotal }">
                {{ scope.row.reportVolume === null ? '-' : scope.row.reportVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="批复">
            <template slot-scope="scope">
              <span :class="{'bold': scope.row.gasSource === '合计' || scope.row.isTotal }">
                {{ scope.row.replyVolume === null ? '-' : scope.row.replyVolume }}
              </span>
            </template>
          </el-table-column>
          <template slot="empty">
            <div class="empty-wrapper" v-if="noDataShow">
              <img src="/static/img/table-data-empty.png" alt="暂无数据" style="margin-top: 10px;">
              <p>暂无数据</p>
              <p>请先进行企业配置</p>
              <el-button round  class="custom-tab-button custom-tab-button-active" @click="$router.push({path: '/DemandDeploy'})" style="margin-right: 0;margin-top: 16px;">去配置</el-button>
            </div>
          </template>
        </el-table>
      </div>
    </div>
    <div class="card-wrapper banner-card-m-wrapper" v-if="toggleDate === 'm'">
      <div class="banner-table-wrapper">
        <div class="tip-wrapper" style="margin-top: 7px;margin-bottom: 7px;">
          单位：万方
          <el-button size="small" round plain @click="exportMonthData()" class="custom-button" icon="el-icon-upload2" style="margin-right: 0;margin-top: 10px;">导出</el-button>
        </div>
        <el-table
            v-loading="loading"
            :data="dataMonth"
            border
            :span-method="tableMonthMerge"
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            max-height="725"
            empty-text=" "
            style="width: 100%;"
            ref="monthTable"
            class="custom-table-n">
          <el-table-column
              fixed="left"
              label="企业"
              width="110px"
              align="center">
            <template slot-scope="scope">
              <span class="bold">
                {{ scope.row.managerName === null ? '-' : scope.row.managerName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              fixed="left"
              prop="compCode"
              align="center"
              width="223px"
              label="供应商名称">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum}">
                {{ scope.row.supplyName === null ? '-' : scope.row.supplyName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              fixed="left"
              align="center"
              width="120px"
              label="签约状态">
            <template slot-scope="scope">
              {{ scope.row.signType === null ? '-' : scope.row.signType }}
            </template>
          </el-table-column>
          <el-table-column
              fixed="left"
              prop="compCode"
              align="center"
              width="120px"
              label="气源来源">
            <template slot-scope="scope">
              {{ scope.row.gasSource === null ? '-' : scope.row.gasSource }}
            </template>
          </el-table-column>
          <el-table-column
              fixed="left"
              align="center"
              width="110px"
              label="类型">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.type === null ? '-' : scope.row.type }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              width="120px"
              label="合同年">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.yearVolume === null ? '-' : scope.row.yearVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              width="120px"
              label="4月-10月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.unWarmVolume === null ? '-' : scope.row.unWarmVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              width="150px"
              label="11月-次年3月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.warmVolume === null ? '-' : scope.row.warmVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              width="120px"
              label="4月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.aprVolume === null ? '-' : scope.row.aprVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              width="120px"
              label="5月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.mayVolume === null ? '-' : scope.row.mayVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              width="120px"
              align="center"
              label="6月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.junVolume === null ? '-' : scope.row.junVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              width="120px"
              align="center"
              label="7月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.julVolume === null ? '-' : scope.row.julVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              width="120px"
              align="center"
              label="8月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.augVolume === null ? '-' : scope.row.augVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              width="120px"
              align="center"
              label="9月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.sepVolume === null ? '-' : scope.row.sepVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              width="120px"
              align="center"
              label="10月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.octVolume === null ? '-' : scope.row.octVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              width="120px"
              align="center"
              label="11月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.novVolume === null ? '-' : scope.row.novVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              width="120px"
              align="center"
              label="12月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.decVolume === null ? '-' : scope.row.decVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              width="120px"
              align="center"
              label="1月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.janVolume === null ? '-' : scope.row.janVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              width="120px"
              align="center"
              label="2月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.febVolume === null ? '-' : scope.row.febVolume }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              width="120px"
              align="center"
              label="3月">
            <template slot-scope="scope">
              <span :class="{bold: scope.row.isSum || scope.row.isTotal}">
                {{ scope.row.marVolume === null ? '-' : scope.row.marVolume }}
              </span>
            </template>
          </el-table-column>
          <template slot="empty">
            <div class="empty-wrapper" v-if="noDataShow">
              <img src="/static/img/table-data-empty.png" alt="暂无数据" style="margin-top: 10px;">
              <p>暂无数据</p>
              <p>请先进行企业配置</p>
              <el-button round  class="custom-tab-button custom-tab-button-active" @click="$router.push({path: '/DemandDeploy'})" style="margin-right: 0;margin-top: 16px;">去配置</el-button>
            </div>
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import topMenu from "../../components/topMenu/topMenu2";
import api from "../../http/api";
import qiyuanApi from "../../http/qiyuanApi";
import dateFormater from "../../components/dateFormater/dateFormater";
import exportApi from "../../components/export/export";
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'
export default {
  name: "demandPlanTrack",
  mixins: [dateFormater, exportApi, buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
  data: function () {
    return {
      toggleDate: 'd',
      m: Date.now(),
      d: Date.now(),
      zuheList: [],
      pointList: [],
      selectForm: {
        zuheValue: 0,
        pointValue: 0
      },
      dataD: [],
      dataDTitle:{
        managerName: '',
        demandVolume: 0,
        gapVolume: 0
      },
      dataM: {
        demandSupplyDataMonthDTOList: []
      },
      dataMonth: [],
      loading: true,
      noDataShow: false
    }
  },

  computed: {
    curComCode: function () {
      return this.$store.getters.curCom
    },
  },
  watch: {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if (n && o) {
          this.getCompanyList()
        }
      }
    }
  },

  created() {
    this.getPointList().then(() => {
      this.getCompanyList()
    })
  },

  components: {
    topMenu
  },

  methods: {
    getData: function () {
      this.dataD = []
      this.dataMonth = []
      this.loading = true
      this.noDataShow = false
      if(this.zuheList.length === 0) {
        this.loading = false
        this.noDataShow = true
        return false
      } else {
        this.loading = true
        this.noDataShow = false
      }
      if(this.toggleDate === 'd') {
        this.getDateDay()
      } else if(this.toggleDate === 'm') {
        this.getDataMonth()
      }
    },
    toggleDayHandler: function (toggleTyle) {
      this.toggleDate = toggleTyle
      this.getData()
    },
    getDateDay: function () {
      let data = {
        companyCodeList: this.zuheList[this.selectForm.zuheValue].codes,
        managerName: this.zuheList[this.selectForm.zuheValue].name,
        statisticDate: this.getFormatDate(this.d),
        statisticType: this.zuheList[this.selectForm.zuheValue].type
      }
      qiyuanApi.demandPlanTrack.getDayPlanTrack(data).then(res => {
        this.dataDTitle.managerName = res.managerName
        this.dataDTitle.demandVolume = res.demandVolume
        this.dataDTitle.gapVolume = res.gapVolume
        for (let v of res.demandSupplyDataDayDTOList) {
          let i = 0
          for (let vv of v.demandSupplyDataSubDayDTOList) {
            this.dataD.push({
              column1: i === 0 ? v.demandSupplyDataSubDayDTOList.length : 0,
              managerName: v.managerName,
              gasSource: vv.gasSource,
              changeVolume: vv.demandSupplyDataDetailDayDTO.changeVolume,
              dayAvgSurplusVolume: vv.demandSupplyDataDetailDayDTO.dayAvgSurplusVolume,
              dayAvgVolume: vv.demandSupplyDataDetailDayDTO.dayAvgVolume,
              replyVolume: vv.demandSupplyDataDetailDayDTO.replyVolume,
              reportVolume: vv.demandSupplyDataDetailDayDTO.reportVolume,
            })
            i = 1
          }
        }
        if(res.demandSupplyDataTotalDayDTO) {
          this.dataD.push({
            column1: 1,
            isTotal: true,
            managerName: res.demandSupplyDataTotalDayDTO.managerName,
            gasSource: '',
            changeVolume: res.demandSupplyDataTotalDayDTO.demandSupplyDataDetailDayDTO.changeVolume,
            dayAvgSurplusVolume: res.demandSupplyDataTotalDayDTO.demandSupplyDataDetailDayDTO.dayAvgSurplusVolume,
            dayAvgVolume: res.demandSupplyDataTotalDayDTO.demandSupplyDataDetailDayDTO.dayAvgVolume,
            replyVolume: res.demandSupplyDataTotalDayDTO.demandSupplyDataDetailDayDTO.replyVolume,
            reportVolume: res.demandSupplyDataTotalDayDTO.demandSupplyDataDetailDayDTO.reportVolume,
          })
        }
        this.loading = false
        this.noDataShow = true
      })
    },
    getDataMonth: function () {
      let data = {
        companyCodeList: this.zuheList[this.selectForm.zuheValue].codes,
        managerName: this.zuheList[this.selectForm.zuheValue].name,
        statisticDate: new Date(this.m).getFullYear(),
        statisticType: this.zuheList[this.selectForm.zuheValue].type
      }
      if(this.pointList[this.selectForm.pointValue].dictCode !== 'ALL') {
        data.gasSource = this.pointList[this.selectForm.pointValue].dictCode
      }
      qiyuanApi.demandPlanTrack.getMonthPlanTrack(data).then(res => {
        let list = res.demandSupplyDataMonthDTOList
        let total = res.demandSupplyDataTotalMonthDTO
        if(list.length > 0 || total !== null) {
          this.$nextTick(() => {
            document.getElementsByClassName('el-table__fixed')[0].style.height = 'auto'
          })
        }
        for (let v of list) {
          let startIndex = this.dataMonth.length
          let columnNum = 0
          for (let vv of v.demandSupplyDataSubMonthDTOList) {
            let i = 0
            for (let vvv of vv.demandSupplyDataDetailMonthDTOList) {
              this.dataMonth.push({
                column1: 0,
                column2: i === 0 ? (vv.demandSupplyDataDetailMonthDTOList.length) : 0,
                row2: 1,
                managerName: v.managerName,
                supplyName: vv.supplyName,
                signType: vv.signType,
                gasSource: vv.gasSource,
                aprVolume: vvv.aprVolume,
                augVolume: vvv.augVolume,
                decVolume: vvv.decVolume,
                febVolume: vvv.febVolume,
                janVolume: vvv.janVolume,
                julVolume: vvv.julVolume,
                junVolume: vvv.junVolume,
                marVolume: vvv.marVolume,
                mayVolume: vvv.mayVolume,
                novVolume: vvv.novVolume,
                octVolume: vvv.octVolume,
                sepVolume: vvv.sepVolume,
                type: vvv.type,
                unWarmVolume: vvv.unWarmVolume,
                warmVolume: vvv.warmVolume,
                yearVolume: vvv.yearVolume,
              })
              columnNum++
              i = 1
            }
          }
          if(v.demandSupplyDataSumMonthDTO) {
            let i = 0
            for (let vv of v.demandSupplyDataSumMonthDTO.demandSupplyDataDetailMonthDTOList) {
              this.dataMonth.push({
                column1: 0,
                column2: i === 0 ? (v.demandSupplyDataSumMonthDTO.demandSupplyDataDetailMonthDTOList.length) : 0,
                row2: i === 0 ? 3 : 0,
                isSum: true,
                managerName: v.managerName,
                supplyName: v.demandSupplyDataSumMonthDTO.supplyName,
                signType: '',
                gasSource: '',
                aprVolume: vv.aprVolume,
                augVolume: vv.augVolume,
                decVolume: vv.decVolume,
                febVolume: vv.febVolume,
                janVolume: vv.janVolume,
                julVolume: vv.julVolume,
                junVolume: vv.junVolume,
                marVolume: vv.marVolume,
                mayVolume: vv.mayVolume,
                novVolume: vv.novVolume,
                octVolume: vv.octVolume,
                sepVolume: vv.sepVolume,
                type: vv.type,
                unWarmVolume: vv.unWarmVolume,
                warmVolume: vv.warmVolume,
                yearVolume: vv.yearVolume,
              })
              columnNum++
              i = 1
            }
          }
          console.log(this.dataMonth[startIndex])
          this.dataMonth[startIndex].column1 = columnNum
        }
        if(total) {
          let i = 0
          for (let v of total.demandSupplyDataDetailMonthDTOList) {
            this.dataMonth.push({
              isTotal: true,
              column1: i === 0 ? total.demandSupplyDataDetailMonthDTOList.length : 0,
              managerName: total.managerName,
              supplyName: '',
              signType: '',
              gasSource: '',
              aprVolume: v.aprVolume,
              augVolume: v.augVolume,
              decVolume: v.decVolume,
              febVolume: v.febVolume,
              janVolume: v.janVolume,
              julVolume: v.julVolume,
              junVolume: v.junVolume,
              marVolume: v.marVolume,
              mayVolume: v.mayVolume,
              novVolume: v.novVolume,
              octVolume: v.octVolume,
              sepVolume: v.sepVolume,
              type: v.type,
              unWarmVolume: v.unWarmVolume,
              warmVolume: v.warmVolume,
              yearVolume: v.yearVolume,
            })
            i = 1
          }
        }
        this.loading = false
        this.noDataShow = true
      })
    },
    dChange: function () {
      this.getData()
    },
    mChange: function () {
      this.getData()
    },
    companyChange: function () {
      this.getData()
    },
    gasPointChange: function () {
      this.getData()
    },
    getCompanyList: function () {
      let params = {
        belongCode: this.$store.getters.curCom
      }
      api.demandPlanTrack.getCompanyList(params).then(res => {
        if(res && res.length > 0) {
          this.zuheList = res[0]
          if(this.zuheList.length === 0) {
            this.selectForm.zuheValue = ''
            this.$nextTick(() => {
              document.getElementsByClassName('el-table__fixed')[0].style.height = '60px'
            })
          } else {
            this.selectForm.zuheValue = 0
          }
          this.getData()
        }
      })
    },
    getPointList: function () {
      return qiyuanApi.demandPlanTrack.getGasSourceList({
        parentCode: "GasSource",
        pageSize: 30,
        pageNum: 0
      }).then(res => {
        res.list.unshift({
          dictId: '0001',
          dictName: "全部",
          dictCode: "ALL"
        })
        this.pointList = res.list
      })
    },
    tableDayMerge: function ({ columnIndex, row }) {
      if(columnIndex === 0) {
        return {
          rowspan: row.column1,
          colspan: 1
        };
      }
    },
    tableMonthMerge: function ({ columnIndex, row }) {
      if(columnIndex === 0) {
        if(row.isTotal) {
          return {
            rowspan: row.column1,
            colspan: 4
          };
        } else {
          return {
            rowspan: row.column1,
            colspan: 1
          };
        }
      }
      if(columnIndex >= 1 && columnIndex <= 3) {
        if(row.isSum) {
          if(columnIndex === 1) {
            return {
              rowspan: row.column2,
              colspan: row.row2
            };
          } else {
            return {
              rowspan: row.column2,
              colspan: 0
            };
          }
        } else if(row.isTotal) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } {
          return {
            rowspan: row.column2,
            colspan: 1
          };
        }
      }
    },
    getTData: function (data) {
      let ret = []
      for (let v of data.demandSupplyDataSubMonthDTOList) {
        for (let vv of v.demandSupplyDataDetailMonthDTOList) {
          ret.push(vv)
        }
      }
      if(data.demandSupplyDataSumMonthDTO) {
        for (let v of data.demandSupplyDataSumMonthDTO.demandSupplyDataDetailMonthDTOList) {
          v.isSum = true
          ret.push(v)
        }
      }
      return ret
    },
    keyG: function () {
      return Math.random()
    },
    exportDayData: function () {
      let data = {
        statisticDate: this.getFormatMonth(this.d),
        statisticList: []
      }
      for (let v of this.zuheList) {
        data.statisticList.push({
          companyCodeList: v.codes,
          managerName: v.name,
          statisticType: v.type
        })
      }
      api.demandPlanTrack.exportDayData(data).then(res => {
        this.download(res, 'xls', 'export')
      })
    },
    exportMonthData: function () {
      let data = {
        statisticDate: new Date(this.m).getFullYear(),
        statisticList: []
      }
      for (let v of this.zuheList) {
        data.statisticList.push({
          companyCodeList: v.codes,
          managerName: v.name,
          statisticType: v.type
        })
      }
      api.demandPlanTrack.exportMonthData(data).then(res => {
        this.download(res, 'xls', 'export')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.day-month-tog-wrapper {
  height: 40px;
  margin-top: 20px;
  padding-left: 20px;
}
.custom-tab-button {
  margin-right: 20px;
  margin-left: 0;
  color: #FFF;
}
.custom-tab-button-active {
  color: #FFF;
  background-color: #0FB2AB;
  border-color: #0FB2AB;
}
.custom-datepicker {
  background: #567db9;
  border-radius: 20px;
  border: none;
  color: #ffffff !important;
  margin-right: 20px;
}
.demo-form-inline {
  /deep/ .el-form-item__label {
    color: #ffffff;
    font-size: 16px;
  }

  /deep/ .gas-el-select .el-input__suffix {
    border-left: none;
    right: 12px;
  }
}
.gas-page-com-wrapper {
  width: 220px;
  height: 40px;
  opacity: 1;
  border-radius: 24px;
  float: right;
  margin-right: 20px;
  overflow: hidden;
  /deep/ .gas-el-select .el-input__inner{
    background: #567db9 !important;
    border: none;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
    padding-left: 0;
  }

}
.gas-page-com-wrapper {
  /deep/ .el-input__inner {
    background: #567db9 !important;
    border: none;
    height: 40px;
  }
}
.banner-title-wrapper {
  height: 65px;
  width: 100%;
  border-bottom: 1px solid $borderColor;
  color: $fontColor;
}
.banner-title-item-l {
  float: left;
  height: 100%;
  line-height: 65px;
  margin-left: 42px;
}
.banner-table-wrapper {
  padding: 0 30px 60px 30px;
  box-sizing: border-box;
}
.tip-wrapper {
  height: 53px;
  line-height: 53px;
  color: rgba(153, 153, 153, 1);
  font-size: 14px;
}
.empty-wrapper {
  height: 436px;
  padding-top: 43px;
  box-sizing: border-box;
  p {
    height: 24px;
    line-height: 24px;
    padding: 0;
    margin: 0;
  }
}
.custom-table-n {
  /deep/ .el-table__empty-block {
    width: auto !important;
  }
}
.banner-title-item-l span {
  display: inline-block;
  vertical-align: middle;
}
.banner-title-item-l::before {
  display: inline-block;
  width: 16px;
  height: 16px;
  content: "";
  vertical-align: middle;
  margin-right: 8px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.banner-title-item-l-name::before {
  background-image: url("./assets/name.png");
}
.banner-title-item-l-xuqiu::before {
  background-image: url("./assets/xuqiu.png");
}
.banner-title-item-l-quekou::before {
  background-image: url("./assets/quekou.png");
}
.custom-button {
  float: right;
  margin-right: 30px;
  margin-top: 17px;
}
.bold {
  font-weight: 600;
}
.card-wrapper {
  margin-top: 20px;
}
</style>