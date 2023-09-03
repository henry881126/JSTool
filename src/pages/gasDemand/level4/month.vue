<template>
  <div>
    <div class="top-card-container">
      <div :class="{'top-card-wrapper': true, 'top-card-wrapper-active': this.toggleDay === 'next'}" @click="toggleDayChangeHandle('next')">
        <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36 2L36 38C36 38.5304 35.7893 39.0391 35.4142 39.4142C35.0391 39.7893 34.5304 40 34 40L2 40C1.46956 40 0.960856 39.7893 0.585783 39.4142C0.210707 39.0391 -1.68422e-06 38.5304 -1.66103e-06 38L-8.74228e-08 2C-6.42368e-08 1.46957 0.210709 0.960857 0.585785 0.585785C0.960857 0.210712 1.46957 -1.50937e-06 2 -1.48619e-06L34 -8.74228e-08C34.5304 -6.42368e-08 35.0391 0.210714 35.4142 0.585786C35.7893 0.960859 36 1.46957 36 2ZM16 10L8 10L8 14L16 14L16 10ZM28 18L8 18L8 22L28 22L28 18ZM22 26L8 26L8 30L22 30L22 26Z" fill="#47A87D"/>
        </svg>
        <div class="is-change-wrapper" v-if="overview.next.isChange">
          <i class="el-icon-document"></i> 已修正
        </div>
        <div class="date">{{ getFormatMonthNext(date, '/') }}（下月）</div>
        <div class="data">{{ overview.next.value }} <span>万方</span></div>
        <div class="label">预测用气量</div>
        <svg width="65" height="66" viewBox="0 0 65 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M25 0H40V66H25V0ZM0 28H15V66H0V28ZM65 18H50V66H65V18Z" fill="#d9ede4"/>
        </svg>
      </div>
      <div :class="{'top-card-wrapper': true, 'top-card-wrapper-active': this.toggleDay === 'now'}" @click="toggleDayChangeHandle('now')">
        <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36 2L36 38C36 38.5304 35.7893 39.0391 35.4142 39.4142C35.0391 39.7893 34.5304 40 34 40L2 40C1.46956 40 0.960856 39.7893 0.585783 39.4142C0.210707 39.0391 -1.68422e-06 38.5304 -1.66103e-06 38L-8.74228e-08 2C-6.42368e-08 1.46957 0.210709 0.960857 0.585785 0.585785C0.960857 0.210712 1.46957 -1.50937e-06 2 -1.48619e-06L34 -8.74228e-08C34.5304 -6.42368e-08 35.0391 0.210714 35.4142 0.585786C35.7893 0.960859 36 1.46957 36 2ZM16 10L8 10L8 14L16 14L16 10ZM28 18L8 18L8 22L28 22L28 18ZM22 26L8 26L8 30L22 30L22 26Z" fill="#47A87D"/>
        </svg>
        <div class="is-change-wrapper" v-if="overview.same.isChange">
          <i class="el-icon-document"></i> 已修正
        </div>
        <div class="date">更新至{{ overview.same.cutOffTime }}（本月）</div>
        <div class="data">{{ overview.same.value }} <span>万方</span></div>
        <div class="label">预测用气量</div>
        <svg width="65" height="66" viewBox="0 0 65 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M25 0H40V66H25V0ZM0 28H15V66H0V28ZM65 18H50V66H65V18Z" fill="#d9ede4"/>
        </svg>
      </div>
    </div>
    <div :class="{'calculator-container': true, 'calculator-1': this.toggleDay === 'next', 'calculator-2': this.toggleDay === 'now'}">
      <div class="m-wrapper" style="padding: 0;margin-top: 0;">
        {{ getFormatMonthPre(date, '/') }}(上月)实际用气量 <span>(单位:万方)</span>
      </div>
      <el-form label-width="130px" class="form-wrapper" :model="formData">
        <el-form-item>
          <template slot="label">
            上月实际用气量
          </template>
          <el-col :span="20">
            <el-input v-model="formData.lastValue" disabled></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="m-wrapper" style="padding: 0;margin-top: 40px;">
        {{ this.toggleDay === 'next' ? getFormatMonthNext(date, '/') + '(下' : getFormatMonth(date, '/') + '(本' }}月)预测气量分解 <span>(单位:万方)</span>
      </div>
      <el-form ref="formData" :model="formData" label-width="130px" class="form-wrapper">
        <el-form-item v-if="toggleDay === 'now'">
          <template slot="label">
            本月实际用气量
          </template>
          <el-col :span="20">
            <el-input v-model="formData.currentValue" disabled></el-input>
          </el-col>
          <el-col :span="4">
            <span style="color: #606266;text-indent: 10px;padding-left: 10px;white-space: nowrap;">更新至{{ formData.cutTime }}</span>
          </el-col>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            计划用气客户
          </template>
          <el-col :span="20">
            <el-input v-model="formData.plan" disabled></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="text" size="middle" style="margin-left: 10px;" @click="dialog1 = true">客户明细</el-button>
          </el-col>
        </el-form-item>
        <el-form-item :style="{'margin-bottom': formData.notPlanTable.length > 0 ? '10px' : '20px'}">
          <template slot="label">
            非计划用气客户
            <el-tooltip class="item" effect="dark" placement="right">
              <template slot="content">
                因素包含：气温，气象，节假日，<br>周末，产业结构，行业发展指数 <br>等，由算法自动测算，不可修改
              </template>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <el-col :span="20">
            <el-input v-model="formData.notPlan" disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="" v-if="formData.notPlanTable.length > 0">
          <el-col :span="20">
            <el-table
                class="custom-table-n"
                border
                header-row-class-name="custom-table-header"
                header-cell-class-name="custom-table-header-cell"
                cell-class-name="custom-table-cell"
                :data="formData.notPlanTable">
              <el-table-column
                  property="bpName"
                  align="left"
                  label="客户分类">
              </el-table-column>
              <el-table-column
                  property="bpValue"
                  align="right"
                  label="明日预测用气量">
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>
        <el-form-item label="新增客户">
          <el-col :span="5">
            <el-input v-model="formData.newCustom" disabled></el-input>
          </el-col>
          <el-col :span="3" style="text-align: center;">
            = 系数
            <el-tooltip class="item" effect="dark" placement="right">
              <template slot="content">
                根据新奥平均新增客户，用气上升<br>期气量涨幅趋势设定，可根据企业<br>情况修改。
              </template>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-input v-model="formData.xishu" @input="calcNewCustomerValue" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
          </el-col>
          <el-col :span="4" style="text-align: center;">
            × 开口总量
          </el-col>
          <el-col :span="5">
            <el-input v-model="formData.kaikouzongliang" disabled></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="text" size="middle" style="margin-left: 10px;" @click="dialog2 = true">客户明细</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="其它影响因素">
          <el-col v-for="(v, i) in formData.other" :span="24" :key="i">
            <el-col :span="20">
              <div class="select-input-wrapper">
                <el-select v-model="v.name" placeholder="请选择">
                  <el-option
                      v-for="item in yinsuOption"
                      :key="item"
                      :label="item"
                      :disabled="optionDisabled('next', item)"
                      :value="item">
                  </el-option>
                </el-select>
                <el-input v-model="v.factorValue" oninput="value = value.match(/(-?\d*(?:\.\d{0,4})?)/g) ? value.match(/(-?\d*(?:\.\d{0,4})?)/g)[0] : ''"></el-input>
              </div>
              <div class="textarea-wrapper" v-if="v.name === '其它'">
                <el-input
                    type="textarea"
                    :rows="2"
                    :maxlength="200"
                    placeholder="请输入内容"
                    v-model="v.desc">
                </el-input>
              </div>
            </el-col>
            <el-col :span="4">
              <i class="el-icon-delete" style="margin-left: 10px;" @click="deleteYinsu(formData.other, i)"></i>
            </el-col>
          </el-col>
          <el-col :span="20" v-if="formData.other.length < yinsuOption.length">
            <div class="add-item" @click="addYinsu(formData.other)">
              <i class="el-icon-plus"></i>
              添加因素
            </div>
          </el-col>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" round class="cal-btn" @click="calc()">计算</el-button>
    </div>
    <el-dialog
      :visible.sync="dialog1" width="850px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="custom-dialog-n"
      :before-close="dialog1Close">
      <template slot="title">
        <div class="e-title-dialog">
          计划用气客户 <span>(单位:万方)</span>
        </div>
      </template>
        <el-table
            class="custom-table-n"
            border
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            max-height="543px"
            :show-summary="true"
            :summary-method="dialog1Summary"
            :data="formData.planTable">
          <el-table-column
              property="name"
              align="left"
              width="280"
              label="客户名称">
          </el-table-column>
          <el-table-column
              property="lastMonthValue"
              align="right"
              label="上月用气量">
          </el-table-column>
          <el-table-column
              property="nextMonthPlanValue"
              align="center"
              :label="toggleDay === 'next' ? '下月计划量' : '本月计划量'">
            <template slot-scope="scope">
              <el-input v-model="scope.row.nextMonthPlanValue" class="custom-input-r" @input="calcPlanValue"></el-input>
            </template>
          </el-table-column>
          <el-table-column
              align="right"
              label="环比增长量">
            <template slot-scope="scope">
              {{ parseFloat(parseFloat(scope.row.nextMonthPlanValue - scope.row.lastMonthValue).toFixed(4)) }}
            </template>
          </el-table-column>
          <el-table-column
              align="right"
              label="环比增长率">
            <template slot-scope="scope">
              <div v-if="scope.row.lastMonthValue == 0">
                -
              </div>
              <div v-else>
                {{ parseFloat((scope.row.nextMonthPlanValue - scope.row.lastMonthValue)/scope.row.lastMonthValue*100).toFixed(2) }}%
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button size="small" type="primary" round class="save-btn" @click="dialog1 = false" :disabled="formData.planTable.length === 0">保存</el-button>
    </el-dialog>
    <el-dialog
      :visible.sync="dialog2" width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="custom-dialog-n"
      :before-close="dialog2Close">
      <template slot="title">
        <div class="e-title-dialog">
          市场开发客户 <span>(单位:方)</span>
        </div>
      </template>
        <el-table
            class="custom-table-n"
            border
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            max-height="543px"
            :show-summary="true"
            :summary-method="dialog1Summary"
            :data="formData.newCustomTable">
          <el-table-column
              property="name"
              align="left"
              label="客户名称">
          </el-table-column>
          <el-table-column
              property="value"
              align="right"
              label="本月置换开口气量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" class="custom-input-r" @input="calcNewCustomerValue"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-button size="small" type="primary" round class="save-btn" @click="dialog2 = false" :disabled="formData.newCustomTable.length === 0">保存</el-button>
    </el-dialog>
  </div>
</template>

<script>
import dateFormater from "../../../components/dateFormater/dateFormater";
import api from '@/http/api'
export default {
  name: "day",
  mixins: [dateFormater],
  props: {
    date: {
      type: Date
    }
  },
  data: function () {
    return {
      toggleDay: 'next',   //next: 明天; now: 今日; pre: 昨天;
      dialog1: false,
      dialog2: false,
      gridWeather: [],
      dialogTable1: [],
      dialogTable2: [],
      overview: {
        next: {
          value: 0,
          isChange: false
        },
        same: {
          value: 0,
          isChange: false,
          cutOffTime: ''
        }
      },
      formData: {
        lastValue: 0,
        currentValue: 0,
        cutTime: '',
        isChange: false,
        plan: 0,
        planTable: [],
        notPlan: 0,
        notPlanTable: [],
        xishu: 0,
        newCustom: 0,
        kaikouzongliang: 0,
        newCustomTable: [],
        other: []
      },
      yinsuOption: ['政府政策', '大型活动', '其它'],
      recentDataOfDay: []
    }
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
    date: {
      handler: function (n, o) {
        if(n && o) {
          this.getData()
        }
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData: function () {
      this.getTotalData()
      this.getDemandOfMonth();
    },
    getTotalData: function () {
      let params = {
        code: this.curComCode,
        date: this.getFormatMonth(this.date),
        orgLevel: this.$store.getters.curComInfo.orgLevel
      }
      api.gasDemand.getOverviewData(params).then(res => {
        if(res) {
          this.overview.next.value = res[0].nextMonth.value
          this.overview.next.isChange = res[0].nextMonth.isChange
          this.overview.same.value = res[0].currentMonth.value
          this.overview.same.isChange = res[0].currentMonth.isChange
          this.overview.same.cutOffTime = res[0].currentMonth.cutOffTime
        }
      })
    },
    getDemandOfMonth: function () {
      let params = {
        code: this.curComCode,
        orgLevel: this.$store.getters.curComInfo.orgLevel,
        reportPeriod: '2',
        selectDate: this.getFormatMonth(this.date)
      }
      if(this.toggleDay === 'next') {
        params.date = this.getFormatMonthNext(this.date)
      } else if(this.toggleDay === 'now') {
        params.date = this.getFormatMonth(this.date)
      }
      api.gasDemand.getDemandOfMonth(params).then(res => {
        if(res) {
          this.formData.lastValue = res[0].lastMonthValue
          this.formData.currentValue = res[0].currentMonthValue
          this.formData.cutTime = res[0].cutOffTime
          this.formData.other = res[0].monthNextMonthDetailVO.monthOtherVOList
          this.formData.plan = res[0].monthNextMonthDetailVO.planCustomerValue
          this.formData.planTable = res[0].monthNextMonthDetailVO.monthPlanCustomerDetailVOList
          this.formData.notPlan = res[0].monthNextMonthDetailVO.notPlanCustomerValue
          this.formData.notPlanTable = res[0].monthNextMonthDetailVO.monthNotPlanCustomerDetailVOList
          this.formData.newCustom = res[0].monthNextMonthDetailVO.monthNewCustomerVO.factorValue
          this.formData.xishu = res[0].monthNextMonthDetailVO.monthNewCustomerVO.coefficient
          this.formData.kaikouzongliang = res[0].monthNextMonthDetailVO.monthNewCustomerVO.totalOpening
          this.formData.newCustomTable = res[0].monthNextMonthDetailVO.monthNewCustomerVO.monthNewCustomerDetailVOList
        }
      })
    },
    toggleDayChangeHandle: function (type) {
      this.$cancelAxios()
      this.toggleDay = type
      this.getData()
    },
    dChange: function () {

    },
    addYinsu: function (obj) {
      obj.push({
        name: '',
        factorValue: 0,
        desc: ''
      })
    },
    deleteYinsu: function (obj, yinsuIndex) {
      obj.splice(yinsuIndex, 1)
    },
    calc: function () {
      let data = {
        "code": this.curComCode,
        "lastMonthValue": this.formData.lastValue,
        "monthNextMonthDetailVO": {
          "monthNewCustomerVO": {
            "coefficient": this.formData.xishu,
            "factorValue": this.formData.newCustom,
            "monthNewCustomerDetailVOList": this.formData.newCustomTable,
            "totalOpening": this.formData.kaikouzongliang
          },
          "monthNotPlanCustomerDetailVOList": this.formData.notPlanTable,
          "monthOtherVOList": this.formData.other,
          "monthPlanCustomerDetailVOList": this.formData.planTable,
          "notPlanCustomerValue": this.formData.notPlan,
          "planCustomerValue": this.formData.plan
        }
      }
      if(this.toggleDay === 'next') {
        data.date = this.getFormatMonthNext(this.date)
      } else if(this.toggleDay === 'now') {
        data.date = this.getFormatMonth(this.date)
      }
      api.gasDemand.saveDemandOfMonth(data).then(res => {
        if(res[0]) {
          this.$message.success('修改成功')
          this.getData()
        }
      })
    },
    calcYestoday: function () {
      let data = {
        "forecastId": this.yestodayForm.id,
        "forecastOtherVOList": this.yestodayForm.other
      }
      api.gasDemand.saveDataOfYestoday(data).then(res => {
        if(res[0]) {
          this.$message.success('修改成功')
          this.getData()
        }
      })
    },
    calcPlanValue: function () {
      let ret = 0
      for (let v of this.formData.planTable) {
        if(v.nextMonthPlanValue === '' || isNaN(parseFloat(v.nextMonthPlanValue))) {
          v.nextMonthPlanValue = 0
        } else {
          v.nextMonthPlanValue = v.nextMonthPlanValue.toString()
          if(v.nextMonthPlanValue.charAt(v.nextMonthPlanValue.length-1) === '.') {
            v.nextMonthPlanValue = parseFloat(v.nextMonthPlanValue) + '.'
          } else {
            v.nextMonthPlanValue = parseFloat(v.nextMonthPlanValue)
          }
          ret += parseFloat(v.nextMonthPlanValue)
        }
      }
      this.formData.plan = parseFloat(parseFloat(ret).toFixed(4))
    },
    calcNewCustomerValue: function () {
      let ret = 0
      for (let v of this.formData.newCustomTable) {
        if(v.value === '' || isNaN(parseInt(v.value))) {
          v.value = 0
        } else {
          v.value = parseInt(v.value)
          ret += parseInt(v.value)
        }
      }
      if(this.formData.xishu === '') {
        this.formData.xishu = 0
      }
      this.formData.kaikouzongliang = parseFloat(ret/10000).toFixed(4)
      this.formData.newCustom = parseFloat(this.formData.kaikouzongliang*this.formData.xishu).toFixed(4)
    },
    dialog1Summary: function (param) {
      let indexBegin = 1;
      let sums = ['合计']
      const { columns, data } = param;
      columns.forEach((column, index) => {
        if (index < indexBegin || index > 2) {
          return;
        }
        const values = data.map(item => {
          return isNaN(parseFloat(item[column.property])) ? 0 : parseFloat(item[column.property])
        });
        sums[index] = values.reduce((prev, curr) => {
          return parseFloat((parseFloat(prev) + parseFloat(curr)).toFixed(4))
        }, 0);
      });
      return sums;
    },
    dialog1Close: function (done) {
      let params = {
        code: this.curComCode,
        orgLevel: this.$store.getters.curComInfo.orgLevel,
        reportPeriod: '2',
        selectDate: this.getFormatMonth(this.date)
      }
      if(this.toggleDay === 'next') {
        params.date = this.getFormatMonthNext(this.date)
      } else if(this.toggleDay === 'now') {
        params.date = this.getFormatMonth(this.date)
      }
      api.gasDemand.getDemandOfMonth(params).then(res => {
        if(res) {
          this.formData.plan = res[0].monthNextMonthDetailVO.planCustomerValue
          this.formData.planTable = res[0].monthNextMonthDetailVO.monthPlanCustomerDetailVOList
        }
      })
      done()
    },
    dialog2Close: function (done) {
      let params = {
        code: this.curComCode,
        orgLevel: this.$store.getters.curComInfo.orgLevel,
        reportPeriod: '2',
        selectDate: this.getFormatMonth(this.date)
      }
      if(this.toggleDay === 'next') {
        params.date = this.getFormatMonthNext(this.date)
      } else if(this.toggleDay === 'now') {
        params.date = this.getFormatMonth(this.date)
      }
      api.gasDemand.getDemandOfMonth(params).then(res => {
        if(res) {
          this.formData.newCustom = res[0].monthNextMonthDetailVO.monthNewCustomerVO.factorValue
          this.formData.xishu = res[0].monthNextMonthDetailVO.monthNewCustomerVO.coefficient
          this.formData.kaikouzongliang = res[0].monthNextMonthDetailVO.monthNewCustomerVO.totalOpening
          this.formData.newCustomTable = res[0].monthNextMonthDetailVO.monthNewCustomerVO.monthNewCustomerDetailVOList
        }
      })
      done()
    },
    optionDisabled: function (type, name) {
      if(type === 'pre') {
        for (let v of this.yestodayForm.other) {
          if(v.name === name) {
            return true
          }
        }
        return false
      } else {
        for (let v of this.formData.other) {
          if(v.name === name) {
            return true
          }
        }
        return false
      }
    },
    tableRowClassName({row}) {
      if(row.yinsu === '合计') {
        return 'total-row'
      }
      return '';
    }
  }
}
</script>

<style scoped lang="scss">
.top-card-container {
  width: 100%;
  height: 119px;
  margin-top: 20px;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.top-card-wrapper-active {
  border: 1px solid #47A87D;
  border-left-width: 8px;
  background: #EDF6F2 !important;
  box-shadow: 0 6px 18px rgba(86, 125, 185, 0.14);
  svg {
    visibility: visible !important;
  }
}
.top-card-wrapper {
  width: calc(50% - 10px);
  height: 119px;
  background: $bgColor2;
  border-radius: 8px;
  text-align: center;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
  svg:first-child {
    position: absolute;
    top: 40px;
    left: 28px;
    visibility: hidden;
  }
  svg:last-child {
    position: absolute;
    bottom: 0;
    right: 20px;
    visibility: hidden;
  }
  .is-change-wrapper {
    position: absolute;
    right: 15px;
    top: 15px;
    color: #47A87D;
  }
  .date {
    height: 20px;
    font-size: 14px;
    margin-top: 15px;
  }
  .data {
    height: 37px;
    font-size: 32px;
    font-family: DI;
    margin-top: 5px;
    line-height: 37px;
    span {
      display: inline-block;
      font-size: 14px;
      vertical-align: bottom;
      height: 21px;
      line-height: 15px;
    }
  }
  .label {
    height: 21px;
    font-size: 14px;
    margin-top: 5px;
  }
}
.m-wrapper {
  width: 650px;
  margin-left: calc(50% - 325px);
  padding: 0 20px;
  box-sizing: border-box;
  margin-top: 40px;
  font-size: 18px;
  font-weight: 600;
  height: 25px;
  line-height: 25px;
  text-indent: 5px;
  vertical-align: top;
  span {
    display: inline-block;
    font-size: 14px;
    font-weight: normal;
    color: #606266;
  }
}
.m-wrapper:before {
  display: inline-block;
  content: '';
  width: 4px;
  height: 16px;
  background: #47A87D;
  margin-top: 5px;
  vertical-align: top;
}
.table-wrapper {
  padding: 0 20px;
  margin-top: 10px;
  margin-bottom: 20px;
}
.calculator-container {
  width: calc(100% - 40px);
  margin-left: 20px;
  margin-top: 22px;
  margin-bottom: 20px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #A3D3BE;
  padding: 20px 0;
  position: relative;
  box-shadow: 0px 6px 18px rgba(86, 125, 185, 0.14);
}
.calculator-3 {
  padding: 20px 13%;
}
.calculator-1:before {
  display: block;
  content: '';
  height: 18px;
  width: 18px;
  box-sizing: border-box;
  border: 9px solid transparent;
  border-left-color: #A3D3BE;
  position: absolute;
  transform: rotateZ(-90deg);
  top: -18px;
  left: 24%;
}
.calculator-2:before {
  display: block;
  content: '';
  height: 18px;
  width: 18px;
  box-sizing: border-box;
  border: 9px solid transparent;
  border-left-color: #A3D3BE;
  position: absolute;
  transform: rotateZ(-90deg);
  top: -18px;
  left: 76%;
}
.calculator-3:before {
  display: block;
  content: '';
  height: 18px;
  width: 18px;
  box-sizing: border-box;
  border: 9px solid transparent;
  border-left-color: #A3D3BE;
  position: absolute;
  transform: rotateZ(-90deg);
  top: -18px;
  left: 84%;
}
.form-wrapper {
  margin-top: 20px;
  width: 650px;
  margin-left: calc(50% - 325px);
  /deep/ .el-form-item {
    margin-bottom: 20px;
  }
  /deep/ .is-disabled .el-input__inner {
    color: #303133;
  }
}
.add-item {
  border: 1px dashed #DCDFE6;
  box-sizing: border-box;
  border-radius: 4px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}
.line {
  display: block;
  height: 1px;
  width: 140%;
  margin: 24px 0;
  background-color: #dcdfe6;
  position: relative;
  margin-left: -20%;
}
.cal-btn {
  width: 98px;
  margin-left: 48%;
  margin-top: 20px;
}
.c3-item-wrapper {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 40px;
  height: 90px;
  display: flex;
  justify-content: space-between;
}
.c3-item {
  width: calc(25% - 15px);
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  svg {
    margin-top: 27px;
    margin-left: 20px;
  }
  .c3-text-wrapper {
    position: absolute;
    top: 16px;
    right: 20px;
    width: calc(100% - 100px);
    min-width: 100px;
    .label {
      font-size: 14px;
      text-align: right;
    }
    .data {
      font-size: 24px;
      text-align: right;
      height: 28px;
      line-height: 28px;
      margin-top: 10px;
      font-family: DI;
    }
  }
}
.select-input-wrapper {
  width: 100%;
  height: 40px;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  border-radius: 4px;
  white-space: nowrap;
  margin-bottom: 10px;
  overflow: hidden;
  /deep/ .el-select {
    width: 105px;
    .el-input__inner {
      border: none;
      border-radius: 0;
      border-right: 1px solid #DCDFE6;
      width: 100%;
    }
  }
  /deep/ .el-input__inner {
    border: none;
    border-radius: 0;
    width: 285px;
  }
}
.textarea-wrapper {
  margin-top: -5px;
  margin-bottom: 10px;
}
.custom-input-r {
  /deep/ .el-input__inner {
    height: 32px;
  }
}
.save-btn {
  width: 96px;
  margin-top: 20px;
  margin-left: calc(50% - 48px);
}
.custom-table-n {
  /deep/ .cell {
    overflow: visible;
  }
}
.custom-table-n {
  /deep/ .total-row {
    font-weight: 600;
  }
}
</style>