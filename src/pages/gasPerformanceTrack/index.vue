<template>
  <div class="page-bg">
    <top-menu :date-picker-show="false"
              title="天然气输配（调度）智慧管理平台"></top-menu>
    <div class="separator-wrapper">
      <el-breadcrumb separator="/" class="custom-separator">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>气源管理</el-breadcrumb-item>
        <el-breadcrumb-item>气源执行跟踪</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="card-wrapper" v-show="toggleCard === '1'">
      <div class="title-wrapper">
        <span>气源执行跟踪</span>
        <span :class="{'custom-tab-btn': true, 'custom-tab-btn-active': this.toggleDate === 'd'}" @click="toggleDateHandle('d')">日</span>
        <span :class="{'custom-tab-btn': true, 'custom-tab-btn-active': this.toggleDate === 'w'}" @click="toggleDateHandle('w')">周</span>
        <span :class="{'custom-tab-btn': true, 'custom-tab-btn-active': this.toggleDate === 'm'}" @click="toggleDateHandle('m')">月</span>
        <el-date-picker
            v-show="toggleDate === 'd'"
            v-model="d"
            @change="dChange"
            format="yyyy/MM/dd"
            :clearable="false"
            class="custom-datepicker-n">
        </el-date-picker>
        <el-date-picker
            v-show="toggleDate === 'w'"
            v-model="w"
            type="week"
            @change="wChange"
            format="yyyy 年第 WW 周"
            :clearable="false"
            :picker-options="weekOption"
            class="custom-datepicker-n">
        </el-date-picker>
        <el-date-picker
            v-show="toggleDate === 'm'"
            v-model="m"
            type="month"
            @change="mChange"
            format="yyyy/MM"
            :clearable="false"
            class="custom-datepicker-n">
        </el-date-picker>
      </div>
      <div class="title-wrapper" style="margin-top: 15px;">
        <span v-if="this.toggleDate === 'd'">{{ this.getFormatDateDetail(this.d) }}</span>
        <span v-else>{{ this.getFormatDateDetail(this.startTime) }} - {{ this.getFormatDateDetail(this.endTime) }}</span>
        <el-button type="primary" round size="small" class="analyse-btn" icon="el-icon-s-marketing" @click="toggleCardHandle('2')">偏差分析</el-button>
        <el-button round size="small" class="export-btn" icon="el-icon-upload2" @click="exportExcel()">导出</el-button>
      </div>
      <div class="table-wrapper">
        <el-table
            :data="dataList"
            v-loading="loading"
            border
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            max-height="725"
            style="width: 100%;"
            :key="tableKey"
            class="custom-table-n">
          <el-table-column
              label="供应商"
              fixed="left"
              width="330px"
              align="left">
            <template slot-scope="scope">
              <div class="word-cell" :title="scope.row.supplierName">
                {{ scope.row.supplierName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="气源来源"
              min-width="180px"
              align="left">
            <template slot-scope="scope">
              <div class="word-cell" :title="scope.row.gasSource">
                {{ scope.row.gasSource }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
              min-width="150px"
              align="right">
            <template slot="header">
              <div v-if="toggleDate === 'd'">
                日指定量(万方)
              </div>
              <div v-if="toggleDate === 'w'">
                周计划量(万方)
              </div>
              <div v-if="toggleDate === 'm'">
                月合同量(万方)
              </div>
            </template>
            <template slot-scope="scope">
              <div class="word-cell" :title="scope.row.replyVolume">
                {{ scope.row.replyVolume }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="提取量(万方)"
              min-width="150px"
              align="right">
            <template slot-scope="scope">
              <div class="word-cell" :title="scope.row.extractVolume">
                {{ scope.row.extractVolume }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="剩余日均气量(万方)"
              v-if="toggleDate !== 'd'"
              min-width="195px"
              align="right">
            <template slot-scope="scope">
              <div class="word-cell" :title="scope.row.remainingAvailableGas">
                {{ scope.row.remainingAvailableGas }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="时间进度"
              min-width="180px"
              align="right">
            <template slot-scope="scope">
              <div v-if="scope.row.supplierName !== '合计'">
                <el-progress :percentage="getRateNum(scope.row.dateRate, true) > 100 ? 100 : getRateNum(scope.row.dateRate, true)" :format="progressFormat(scope.row.dateRate, true)" :stroke-width="10" color="#909399"></el-progress>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="提取进度"
              min-width="200px"
              align="right">
            <template slot-scope="scope">
              <div class="word-cell">
                <div v-if="scope.row.supplierName !== '合计'">
                  <el-progress :percentage="getRateNum(scope.row.extractRate, true) > 100 ? 100 : getRateNum(scope.row.extractRate, true)" :format="progressFormat(scope.row.extractRate, true)" :stroke-width="10" :color="getProgressColor(scope.row.extractRate * 100)"></el-progress>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="偏差率"
              min-width="120px"
              align="right">
            <template slot-scope="scope">
              <div class="word-cell" :title="scope.row.offsetRate">
                {{ getRateNum(scope.row.offsetRate) }}%
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="偏差量(万方)"
              min-width="150px"
              align="right">
            <template slot-scope="scope">
              <div class="word-cell" :title="scope.row.offsetVolume">
                {{ scope.row.offsetVolume }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="card-wrapper card-wrapper-2" v-show="toggleCard === '2'">
      <div class="title-wrapper-2">
        <span @click="toggleCardHandle('1')" style="cursor: pointer;color: #409EFF;">
          <i class="el-icon-back"></i>返回
        </span>
        <span class="title-2">
          气源偏差分析
        </span>
      </div>
      <div class="title-wrapper">
        <span v-if="this.toggleDate === 'd'">{{ this.getFormatDateDetail(this.d) }}</span>
        <span v-else>{{ this.getFormatDateDetail(this.startTime) }} - {{ this.getFormatDateDetail(this.endTime) }}</span>
      </div>
      <div class="top-left-wrapper">
        <div class="little-title">
          气源提取偏差
        </div>
        <div :class="{'little-tip': true, 'little-tip-error': tlData.offsetVolume > 0, 'little-tip-normal': tlData.offsetVolume <= 0}">
          {{ tlData.offsetVolume > 0 ? '超' : '欠' }}提{{ Math.abs(tlData.offsetVolume) }}万方
        </div>
        <el-progress type="circle" :percentage="getRateNum(tlData.extractRate, true) > 100 ? 100 : getRateNum(tlData.extractRate, true)" status="exception" :show-text="false" class="custom-progress" :color="getProgressColor(tlData.extractRate * 100)" :stroke-width="10"></el-progress>
        <div class="top-left-item-c">
          <div class="t" :style="{color: getProgressColor(tlData.extractRate * 100)}">{{parseFloat(tlData.extractRate * 100).toFixed(2)}}%</div>
          <div class="b">提取完成率</div>
        </div>
        <div class="top-left-item top-left-item-l">
          <div class="t">{{tlData.replyVolume}}</div>
          <div class="b">指定量(万方) </div>
        </div>
        <div class="top-left-item top-left-item-r">
          <div class="t">{{tlData.extractVolume}}</div>
          <div class="b">提取量(万方) </div>
        </div>
      </div>
      <div class="top-right-top-container">
        <div :class="'top-right-top-wrapper top-right-top-' + (i+1)" v-for="(v, i) in trtData" :key="i">
          <div class="little-title">
            {{v.contractTypeName}}提取偏差
          </div>
          <div :class="{'little-tip': true, 'little-tip-error': v.offset > 0, 'little-tip-normal': v.offset <= 0}">
            {{ v.offset > 0 ? '超' : '欠' }}提{{ Math.abs(v.offset) }}万方
          </div>
          <div class="top-right-top-item">
            <div class="t">{{v.replyVolume}}</div>
            <div class="b">指定量(万方) </div>
          </div>
          <div class="top-right-top-item">
            <div class="t">{{v.extractVolume}}</div>
            <div class="b">提取量(万方) </div>
          </div>
          <div class="top-right-top-item">
            <div class="t">{{parseFloat(v.completionRate * 100).toFixed(2)}}%</div>
            <div class="b">提取完成率</div>
          </div>
        </div>
      </div>
      <div class="top-right-bottom-wrapper">
        <div class="little-title">
          燃机电厂
        </div>
        <div class="top-right-bottom-item-wrapper" v-for="(v,i) in dianchangData" :key="i">
          <div class="little-inner-title">
            {{ v.customerName }}
          </div>
          <div class="top-right-bottom-item">
            <div class="t">{{ v.replyVolume }}</div>
            <div class="b">日指定量(万方)</div>
          </div>
          <div class="top-right-bottom-item">
            <div class="t">{{ v.completionRate }}%</div>
            <div class="b">提取进度</div>
          </div>
          <div class="top-right-bottom-item">
            <div class="t">{{ v.offset }}</div>
            <div class="b">超欠量(万方)</div>
          </div>
        </div>
        <el-empty v-if="dianchangData.length === 0" description="暂无数据" :image-size="86" style="display: flex;justify-content: center;align-items: center;flex-direction: column;text-align: center;"></el-empty>
        <div style="clear: both;"></div>
      </div>
      <div class="bottom-left-wrapper">
        <div class="title-3-wrapper">
          气源提取偏差
        </div>
        <div class="bottom-left-item-wrapper" v-for="(v, i) in blData" :key="i">
          <div class="little-inner-title">
            {{ v.supplierName }}
          </div>
          <div class="tottom-left-item">
            <div class="t">指定量：{{ v.replyVolume }}万方</div>
            <div class="b">偏差率：<span v-if="v.offsetRate !== '-'">{{parseFloat(v.offsetRate * 100).toFixed(2)}}%</span><span v-else>-%</span></div>
          </div>
          <div class="tottom-left-item">
            <div class="t">提取量：{{ v.extractVolume }}万方</div>
            <div class="b">偏差量：<span>{{v.offsetVolume}}万方</span></div>
          </div>
        </div>
      </div>
      <div class="lianjie-r-1" v-if="brData.length === 1 && dataList.length > 1"></div>
      <div class="lianjie-l-1"  v-if="dataList.length === 1 && brData.length > 1"></div>
      <div class="lianjie-l-r-1" v-if="dataList.length === 1 && brData.length === 1"></div>
      <div class="lianjie" v-if="dataList.length > 1 && brData.length > 1"></div>
      <div class="bottom-right-wrapper">
        <div class="title-3-wrapper">
          用气偏差
        </div>
        <div class="bottom-right-item-wrapper" v-for="(v, i) in brData" :key="i">
          <div class="little-outer-title">
            {{ v.contractTypeName }}
          </div>
          <div class="little-outer-title-2">
            <div>
              偏差率：<span>{{ parseFloat(v.offsetRate * 100).toFixed(2) }}%</span>
            </div>
            <div>
              偏差量：<span>{{ v.offset }}万方</span>
            </div>
          </div>
          <div class="bottom-right-item" v-for="(vv, ii) in v.detailList" :key="ii">
            <div class="title">{{ vv.customerName }}</div>
            <i class="el-icon-arrow-right"></i>
            <div class="content">偏差率 <span>{{ parseFloat(vv.offsetRate * 100).toFixed(2) }}%</span></div>
          </div>
          <div style="clear: both;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topMenu from "../../components/topMenu/topMenu2";
import dongguanApi from "../../http/dongguan";
import dateFormater from "../../components/dateFormater/dateFormater";
import exportApi from '/src/components/export/export'
import * as mathjs from 'mathjs'
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'

export default {
  name: "gasPerformanceTrack",
  mixins: [dateFormater, exportApi, buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
  components: {
    topMenu
  },
  data: function () {
    return {
      toggleDate: 'd',
      d: new Date(Date.now()-24*3600000),
      w: new Date(),
      m: new Date().setDate(1),
      toggleCard: '1',
      dataList: [],
      currentPage: 1,
      pageSize: 10,
      startTime: this.getFormatDate(new Date(Date.now()-24*3600000)),
      endTime: this.getFormatDate(new Date(Date.now()-24*3600000)),
      weekOption: {
        firstDayOfWeek: 1
      },
      tlData: {
        offsetVolume: 0,
        replyVolume: 0,
        extractVolume: 0,
        extractRate: 0
      },
      trtData: [],
      brData: [],
      blData: [],
      dianchangData: [],
      loading: false,
      tableKey: 0
    }
  },
  created() {
    this.getData()
  },
  mounted() {

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
    getData: function () {
      let params = {
        beginTime: this.startTime,
        endTime: this.endTime,
        code: this.curComCode,
        orgLevel: this.$store.getters.curComInfo.orgLevel
      }
      this.loading = true
      dongguanApi.gasPerformanceTrack.getList(params).then(res => {
        this.dataList = res[0]
        this.loading = false
      })
    },
    getDesc: function () {
      let params = {
        beginTime: this.startTime,
        endTime: this.endTime,
        code: this.curComCode,
        orgLevel: this.$store.getters.curComInfo.orgLevel
      }
      dongguanApi.gasPerformanceTrack.getDesc1(params).then(res => {
        this.blData = res[0].list
        this.tlData = res[0].total
      })
      dongguanApi.gasPerformanceTrack.getDesc(params).then(res => {
        this.brData = res[0].countByCustomer
        this.trtData = res[0].countTypeByTime
      })
      let dianchangParams = {
        beginTime: this.startTime,
        endTime: this.endTime,
      }
      dongguanApi.gasPerformanceTrack.getDianchangData(dianchangParams).then(res => {
        this.dianchangData = res
      })
    },
    toggleDateHandle: function (type) {
      this.tableKey++
      this.toggleDate = type
      switch (type) {
        case 'd':
          this.startTime = this.getFormatDate(this.d)
          this.endTime = this.getFormatDate(this.d)
          break
        case 'w':
          var ww = new Date(this.w).getTime();
          var w1 = new Date(ww - (this.w.getDay() - 1)*24*3600000);
          var w2;
          if(this.w.getDay() === 0) {
            w2 = this.w;
          } else {
            w2 = new Date(ww + (7 - this.w.getDay())*24*3600000);
          }
          this.startTime = this.getFormatDate(w1);
          this.endTime = this.getFormatDate(w2);
          break
        case 'm':
          var mm = new Date(this.m);
          mm.setMonth(mm.getMonth() + 1);
          mm.setDate(0)
          this.startTime = this.getFormatDate(this.m)
          this.endTime = this.getFormatDate(mm)
          break
      }
      this.getData()
    },
    toggleCardHandle: function (card) {
      if(card === '2') {
        this.getDesc()
      }
      this.toggleCard = card
    },
    dChange: function (date) {
      this.startTime = this.getFormatDate(date)
      this.endTime = this.getFormatDate(date)
      this.getData()
    },
    wChange: function (date) {
      var ww = new Date(date).getTime();
      var w1 = new Date(ww - (date.getDay() - 1)*24*3600000);
      var w2;
      if(date.getDay() === 0) {
        w2 = date;
      } else {
        w2 = new Date(ww + (7 - date.getDay())*24*3600000);
      }
      this.startTime = this.getFormatDate(w1);
      this.endTime = this.getFormatDate(w2);
      this.getData();
    },
    mChange: function (date) {
      var mm = new Date(date);
      mm.setMonth(mm.getMonth() + 1);
      mm.setDate(0)
      this.startTime = this.getFormatDate(this.m)
      this.endTime = this.getFormatDate(mm)
      this.getData()
    },
    pageChange: function () {

    },
    getProgressColor: function (percentage) {
      if (percentage < 100) {
        return '#67C23A';
      } else if (percentage === 100) {
        return '#909399';
      } else {
        return '#F56C6C';
      }
    },
    getRateNum: function (num, isInt = false) {
      if(isInt) {
        return parseInt(mathjs.bignumber(num * 100))
      } else {
        return parseFloat(mathjs.bignumber(num * 100).toFixed(2))
      }
    },
    progressFormat: function (num, isInt = false) {
      let per = this.getRateNum(num, isInt)
      return () => {
        return per + '%'
      }
    },
    exportExcel: function() {
      let params = {
        beginTime: this.startTime,
        endTime: this.endTime,
        code: this.curComCode,
        orgLevel: this.$store.getters.curComInfo.orgLevel
      }
      dongguanApi.gasPerformanceTrack.getListExport(params).then(res => {
        this.download(res, 'xls', 'export')
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .card-wrapper-2 {
    height: auto;
  }
  .title-wrapper {
    height: 32px;
    line-height: 32px;
    width: calc(100% - 40px);
    margin-left: 20px;
    margin-top: 20px;
    font-size: 18px;
  }
  .title-wrapper span {
    display: inline-block;
    margin-right: 20px;
    overflow: hidden;
  }
  .tab-btn {
    margin-left: 20px;
  }
  .table-wrapper {
    width: calc(100% - 40px);
    margin-left: 20px;
    margin-top: 15px;
    margin-bottom: 20px;
  }
  .analyse-btn,
  .export-btn
  {
    float: right;
    margin-left: 20px;
  }
  .title-wrapper-2 {
    height: 66px;
    width: 100%;
    border-bottom: 1px solid $borderColor;
    line-height: 66px;
  }
  .title-wrapper-2 span {
    display: inline-block;
    vertical-align: top;
    margin-left: 20px;
    height: 20px;
    margin-top: 23px;
    line-height: 20px;
  }
  .title-2 {
    border-left: 1px solid $borderColor;
    font-size: 18px;
    text-indent: 20px;
  }
  .top-left-wrapper {
    margin-left: 20px;
    margin-top: 20px;
    border: 1px solid #409EFF;
    border-left: 6px solid #409EFF;
    box-sizing: border-box;
    border-radius: 8px;
    position: relative;
  }
  .top-right-top-1 {
    border: 1px solid #F2D09D;
    border-left: 6px solid #F2D09D;
  }
  .top-right-top-2 {
    border: 1px solid #FFBB96;
    border-left: 6px solid #FFBB96;
  }
  .top-right-top-3 {
    border: 1px solid #B3E09C;
    border-left: 6px solid #B3E09C;
  }
  .top-right-bottom-wrapper {
    background: $bgColor2;
    border: 1px solid $borderColor;
    box-sizing: border-box;
    border-radius: 4px;
    overflow: hidden;
    padding-bottom: 20px;
  }
  .top-right-top-wrapper {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }
  .little-inner-title {
    font-size: 16px;
    position: absolute;
    height: 28px;
    top: 20px;
    left: 20px;
    color: $fontColor;
  }
  .tottom-left-item {
    width: 45%;
  }
  .tottom-left-item .t {
    color: $fontColor;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tottom-left-item .b {
    color: #909399;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tottom-left-item .b span {
    color: #67C23A;
  }
  .top-right-top-item {
    width: 30%;
    text-align: center;
  }
  .top-right-top-item .t {
    color: $fontColor;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .top-right-top-item .b {
    color: #909399;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .top-right-bottom-item {
    width: 30%;
    text-align: center;
  }
  .top-right-bottom-item .t {
    color: $fontColor;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .top-right-bottom-item .b {
    color: #909399;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .little-outer-title {
    color: #47A87D;
    position: absolute;
    top: 20px;
    left: 20px;
  }
  .little-outer-title-2 {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .little-outer-title-2 div {
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
    margin-left: 40px;
  }
  .little-outer-title-2 span {
    color: #67C23A;
  }
  .bottom-right-item {
    width: 170px;
    height: 95px;
    float: left;
    background: $bgColor;
    box-shadow: 0 4px 8px rgba(124, 131, 159, 0.08);
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .bottom-right-item .title {
    font-size: 16px;
    height: 24px;
    line-height: 24px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 120px;
  }
  .bottom-right-item .el-icon-arrow-right {
    position: absolute;
    right: 20px;
    top: 25px;
  }
  .bottom-right-item .content {
    font-size: 14px;
    height: 21px;
    line-height: 21px;
    margin-top: 10px;
  }
  @media screen and (min-width: 1441px) {
    .top-left-wrapper {
      width: 391px;
      height: 379px;
    }
    .top-right-top-container {
      position: absolute;
      top: 140px;
      left: 431px;
      width: calc(100% - 450px);
      height: 150px;
      display: flex;
      justify-content: space-between;
    }
    .top-right-top-wrapper {
      width: calc(33.3% - 13px);
      height: 100%;
      box-sizing: border-box;
      border-radius: 4px;
      position: relative;
    }
    .top-right-bottom-wrapper {
      position: absolute;
      width: calc(100% - 450px);
      height: 209px;
      min-height: 209px;
      left: 431px;
      top: 309px;
      padding-top: 36px;
      z-index: 20;
    }
    .top-right-bottom-wrapper:hover {
      height: auto;
    }
    .custom-progress {
      width: 160px;
      height: 160px;
      top: 82px;
      left: 114px;
    }
    .little-title {
      font-size: 18px;
    }
    .top-right-bottom-item-wrapper {
      height: 133px;
      margin-top: 20px;
      float: left;
      margin-left: 20px;
    }
    .tottom-left-item {
      margin-top: 65px;
      font-size: 14px;
    }
    .tottom-left-item .t {
      height: 20px;
      line-height: 20px;
    }
    .tottom-left-item .b {
      height: 20px;
      line-height: 20px;
      margin-top: 10px;
    }
    .top-right-top-item {
      height: 54px;
      margin-top: 72px;
    }
    .top-right-top-item .t {
      height: 25px;
      font-size: 18px;
    }
    .top-right-top-item .b {
      height: 21px;
      margin-top: 8px;
      font-size: 12px;
    }
    .top-right-bottom-item {
      height: 54px;
      margin-top: 59px;
    }
    .top-right-bottom-item .t {
      height: 25px;
      font-size: 18px;
    }
    .top-right-bottom-item .b {
      height: 21px;
      margin-top: 8px;
      font-size: 14px;
    }
    .little-outer-title {
      font-size: 18px;
    }
    .little-outer-title-2 {
      height: 24px;
      line-height: 24px;
      font-size: 16px;
    }
    .top-left-item-c {
      text-align: center;
      margin-top: 135px;
    }
    .top-left-item-c .t {
      font-size: 24px;
      color: #F56C6C;
    }
    .top-left-item-c .b {
      font-size: 14px;
      color: #909399;
    }
    .top-left-item {
      text-align: center;
      position: absolute;
    }
    .top-left-item .t {
      font-size: 18px;
      color: $fontColor;
    }
    .top-left-item .b {
      font-size: 14px;
      margin-top: 8px;
      color: #909399;
    }
    .top-left-item-l {
      left: 88px;
      bottom: 49px;
    }
    .top-left-item-r {
      right: 88px;
      bottom: 49px;
    }
  }
  @media screen and (max-width: 1440px){
    .top-left-wrapper {
      width: 367px;
      height: 286px;
    }
    .top-right-top-container {
      position: absolute;
      top: 139px;
      right: 0px;
      width: calc(100% - 404px);
      height: 286px;
    }
    .top-right-top-wrapper {
      height: 133px;
      width: 367px;
      box-sizing: border-box;
      border-radius: 4px;
      float: left;
      margin-right: 20px;
      margin-bottom: 20px;
    }
    .top-right-bottom-wrapper {
      position: relative;
      width: calc(100% - 40px);
      height: auto;
      margin-left: 20px;
      margin-top: 20px;
      padding-top: 31px;
    }
    .custom-progress {
      width: 133px;
      height: 133px;
      top: 68px;
      left: 114px;
    }
    .little-title {
      font-size: 18px;
    }
    .top-right-bottom-item-wrapper {
      height: 117px;
      margin-top: 20px;
      float: left;
      margin-left: 20px;
    }
    .tottom-left-item {
      margin-top: 63px;
      font-size: 14px;
    }
    .tottom-left-item .t {
      height: 24px;
      line-height: 24px;
    }
    .tottom-left-item .b {
      height: 24px;
      line-height: 24px;
      margin-top: 6px;
    }
    .top-right-top-item {
      height: 55px;
      margin-top: 70px;
    }
    .top-right-top-item .t {
      height: 28px;
      font-size: 16px;
    }
    .top-right-top-item .b {
      height: 22px;
      font-size: 14px;
    }
    .top-right-bottom-item {
      height: 49px;
      margin-top: 54px;
    }
    .top-right-bottom-item .t {
      height: 22px;
      font-size: 16px;
    }
    .top-right-bottom-item .b {
      height: 18px;
      margin-top: 2px;
      font-size: 14px;
    }
    .little-tip {
      font-size: 14px;
    }
    .little-outer-title {
      font-size: 18px;
    }
    .little-outer-title-2 {
      height: 24px;
      line-height: 24px;
      font-size: 16px;
    }
    .top-left-item-c {
      text-align: center;
      margin-top: 109px;
    }
    .top-left-item-c .t {
      font-size: 18px;
      color: #F56C6C;
    }
    .top-left-item-c .b {
      font-size: 14px;
      color: #909399;
    }
    .top-left-item {
      text-align: center;
      position: absolute;
    }
    .top-left-item .t {
      font-size: 16px;
      color: $fontColor;
    }
    .top-left-item .b {
      font-size: 14px;
      margin-top: 1px;
      color: #909399;
    }
    .top-left-item-l {
      left: 78px;
      bottom: 20px;
    }
    .top-left-item-r {
      right: 78px;
      bottom: 20px;
    }
  }


  .bottom-left-wrapper {
    margin-left: 20px;
    width: 391px;
    display: inline-block;
    vertical-align: top;
  }
  .title-3-wrapper {
    height: 77px;
    font-size: 22px;
    font-weight: 600;
    line-height: 77px;
  }
  .bottom-left-item-wrapper {
    height: 136px;
    background: $bgColor2;
    border-radius: 4px;
    margin-bottom: 20px;
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }
  .bottom-left-item-wrapper:before {
    display: block;
    content: "";
    width: 43px;
    height: calc(100% + 20px);
    position: absolute;
    top: 68px;
    right: -43px;
    border-top: 2px dashed #DCDFE6;
    border-right: 2px dashed #DCDFE6;
  }
  .bottom-left-wrapper .bottom-left-item-wrapper:last-child:before {
    border-right: none;
  }
  .bottom-right-wrapper {
    margin-left: 52px;
    width: calc(100% - 580px);
    display: inline-block;
    vertical-align: top;
  }
  .bottom-right-item-wrapper {
    background: $bgColor2;
    border-radius: 4px;
    margin-bottom: 20px;
    position: relative;
    height: auto;
    padding: 65px 0 0 20px;
  }
  .bottom-right-item-wrapper:before {
    display: block;
    content: "";
    width: 51px;
    height: calc(100% + 20px);
    position: absolute;
    top: 32px;
    left: -51px;
    border-top: 2px dashed #DCDFE6;
    border-left: 2px dashed #DCDFE6;
  }
  .bottom-right-wrapper .bottom-right-item-wrapper:last-child:before {
    border-left: none;
  }
  .little-title {
    position: absolute;
    height: 28px;
    width: 280px;
    top: 20px;
    left: 20px;
    color: $fontColor;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .little-tip {
    position: absolute;
    height: 28px;
    line-height: 28px;
    top: 20px;
    right: 20px;
    color: #ffffff;
    border-radius: 16px;
    padding: 0 10px;
  }
  .little-tip-error {
    background: #F56C6C;
  }
  .little-tip-normal {
    background: #67C23A;
  }
  .top-right-bottom-item-wrapper {
    position: relative;
    width: calc(33% - 63px);
    background: $bgColor;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    border-radius: 4px;
  }
  .custom-progress {
    position: absolute;
    /deep/ .el-progress-circle {
      width: 100% !important;
      height: 100% !important;
    }
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
  .word-cell {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    /deep/ .el-progress__text {
      width: 43px;
    }
  }
  .lianjie {
    display: inline-block;
    margin-left: 45px;
    margin-top: 77px;
    height: 121px;
    width: 52px;
    border-bottom: 2px dashed #DCDFE6;
  }
  .lianjie-r-1 {
    display: inline-block;
    margin-left: 45px;
    margin-top: 111px;
    height: 121px;
    width: 52px;
    border-right: 2px dashed #DCDFE6;
    border-bottom: 2px dashed #DCDFE6;
  }
  .lianjie-l-1 {
    display: inline-block;
    margin-left: 45px;
    margin-top: 147px;
    height: 121px;
    width: 52px;
    border-bottom: 2px dashed #DCDFE6;
    border-left: 2px dashed #DCDFE6;
  }
  .lianjie-l-r-1 {
    display: inline-block;
    margin-left: 45px;
    margin-top: 109px;
    height: 36px;
    width: 52px;
    border-right: 2px dashed #DCDFE6;
    border-bottom: 2px dashed #DCDFE6;
  }
</style>