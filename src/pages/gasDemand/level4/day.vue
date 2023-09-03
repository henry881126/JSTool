<template>
  <div>
    <div class="top-card-container">
      <div :class="{'top-card-wrapper': true, 'top-card-wrapper-active': this.toggleDay === 'next'}" @click="toggleDayChangeHandle('next')">
        <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36 2L36 38C36 38.5304 35.7893 39.0391 35.4142 39.4142C35.0391 39.7893 34.5304 40 34 40L2 40C1.46956 40 0.960856 39.7893 0.585783 39.4142C0.210707 39.0391 -1.68422e-06 38.5304 -1.66103e-06 38L-8.74228e-08 2C-6.42368e-08 1.46957 0.210709 0.960857 0.585785 0.585785C0.960857 0.210712 1.46957 -1.50937e-06 2 -1.48619e-06L34 -8.74228e-08C34.5304 -6.42368e-08 35.0391 0.210714 35.4142 0.585786C35.7893 0.960859 36 1.46957 36 2ZM16 10L8 10L8 14L16 14L16 10ZM28 18L8 18L8 22L28 22L28 18ZM22 26L8 26L8 30L22 30L22 26Z" fill="#47A87D"/>
        </svg>
        <div class="is-change-wrapper" v-if="threeData.tomorrowIsChange">
          <i class="el-icon-document"></i> 已修正
        </div>
        <div class="date">{{ getFormatDate(new Date(date).getTime() + 86400000, '/') }}（明日）</div>
        <div class="data">{{ threeData.tomorrow }} <span>万方</span></div>
        <div class="label">预测用气量</div>
        <svg width="65" height="66" viewBox="0 0 65 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M25 0H40V66H25V0ZM0 28H15V66H0V28ZM65 18H50V66H65V18Z" fill="#d9ede4"/>
        </svg>
      </div>
      <div :class="{'top-card-wrapper': true, 'top-card-wrapper-active': this.toggleDay === 'now'}" @click="toggleDayChangeHandle('now')">
        <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36 2L36 38C36 38.5304 35.7893 39.0391 35.4142 39.4142C35.0391 39.7893 34.5304 40 34 40L2 40C1.46956 40 0.960856 39.7893 0.585783 39.4142C0.210707 39.0391 -1.68422e-06 38.5304 -1.66103e-06 38L-8.74228e-08 2C-6.42368e-08 1.46957 0.210709 0.960857 0.585785 0.585785C0.960857 0.210712 1.46957 -1.50937e-06 2 -1.48619e-06L34 -8.74228e-08C34.5304 -6.42368e-08 35.0391 0.210714 35.4142 0.585786C35.7893 0.960859 36 1.46957 36 2ZM16 10L8 10L8 14L16 14L16 10ZM28 18L8 18L8 22L28 22L28 18ZM22 26L8 26L8 30L22 30L22 26Z" fill="#47A87D"/>
        </svg>
        <div class="is-change-wrapper" v-if="threeData.todayIsChange">
          <i class="el-icon-document"></i> 已修正
        </div>
        <div class="date">{{ getFormatDate(date, '/') }}（今日）</div>
        <div class="data">{{ threeData.today }} <span>万方</span></div>
        <div class="label">预测用气量</div>
        <svg width="65" height="66" viewBox="0 0 65 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M25 0H40V66H25V0ZM0 28H15V66H0V28ZM65 18H50V66H65V18Z" fill="#d9ede4"/>
        </svg>
      </div>
      <div :class="{'top-card-wrapper': true, 'top-card-wrapper-active': this.toggleDay === 'pre'}" @click="toggleDayChangeHandle('pre')">
        <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36 2L36 38C36 38.5304 35.7893 39.0391 35.4142 39.4142C35.0391 39.7893 34.5304 40 34 40L2 40C1.46956 40 0.960856 39.7893 0.585783 39.4142C0.210707 39.0391 -1.68422e-06 38.5304 -1.66103e-06 38L-8.74228e-08 2C-6.42368e-08 1.46957 0.210709 0.960857 0.585785 0.585785C0.960857 0.210712 1.46957 -1.50937e-06 2 -1.48619e-06L34 -8.74228e-08C34.5304 -6.42368e-08 35.0391 0.210714 35.4142 0.585786C35.7893 0.960859 36 1.46957 36 2ZM16 10L8 10L8 14L16 14L16 10ZM28 18L8 18L8 22L28 22L28 18ZM22 26L8 26L8 30L22 30L22 26Z" fill="#47A87D"/>
        </svg>
        <div class="date">{{ getFormatDate(new Date(date).getTime() - 86400000, '/') }}（昨日）</div>
        <div class="data">{{ threeData.yestoday }} <span>万方</span></div>
        <div class="label">实际用气量</div>
        <svg width="65" height="66" viewBox="0 0 65 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M25 0H40V66H25V0ZM0 28H15V66H0V28ZM65 18H50V66H65V18Z" fill="#d9ede4"/>
        </svg>
      </div>
    </div>
    <div :class="{'calculator-container': true, 'calculator-1': true, 'calculator-active': this.toggleDay === 'next'}">
      <div class="m-wrapper" style="padding: 0;margin-top: 0;width: 650px;margin-left: calc(50% - 325px);">
        明日预测气量分解 <span>(单位:万方)</span>
      </div>
      <el-form ref="nextForm" :model="nextForm" label-width="130px" class="form-wrapper">
        <el-form-item>
          <template slot="label">
            计划用气客户
          </template>
          <el-col :span="20">
            <el-input v-model="nextForm.plan" disabled></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="text" size="middle" style="margin-left: 10px;" @click="dialog1 = true">客户明细</el-button>
          </el-col>
        </el-form-item>
        <el-form-item :style="{'margin-bottom': nextForm.notPlanTable.length > 0 ? '10px' : '20px'}">
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
            <el-input v-model="nextForm.notPlan" disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="" v-if="nextForm.notPlanTable.length > 0">
          <el-col :span="20">
            <el-table
                class="custom-table-n"
                border
                header-row-class-name="custom-table-header"
                header-cell-class-name="custom-table-header-cell"
                cell-class-name="custom-table-cell"
                :data="nextForm.notPlanTable">
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
            <el-input v-model="nextForm.newCustom" disabled></el-input>
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
            <el-input v-model="nextForm.xishu" @input="calcNewCustomerValue" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
          </el-col>
          <el-col :span="4" style="text-align: center;">
            × 开口总量
          </el-col>
          <el-col :span="5">
            <el-input v-model="nextForm.kaikouzongliang" disabled></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="text" size="middle" style="margin-left: 10px;" @click="dialog2 = true">客户明细</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="其它影响因素">
          <el-col v-for="(v, i) in nextForm.other" :span="24" :key="i">
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
              <i class="el-icon-delete" style="margin-left: 10px;" @click="deleteYinsu(nextForm.other, i)"></i>
            </el-col>
          </el-col>
          <el-col :span="20" v-if="nextForm.other.length < yinsuOption.length">
            <div class="add-item" @click="addYinsu(nextForm.other)">
              <i class="el-icon-plus"></i>
              添加因素
            </div>
          </el-col>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" round class="cal-btn" @click="calc()">计算</el-button>
    </div>
    <div :class="{'calculator-container': true, 'calculator-2': true, 'calculator-active': this.toggleDay === 'now'}">
      <div class="m-wrapper" style="padding: 0;margin-top: 0;width: 650px;margin-left: calc(50% - 325px);">
        今日预测气量分解 <span>(单位:万方)</span>
      </div>
      <el-form ref="nextForm" :model="nextForm" label-width="130px" class="form-wrapper">
        <el-form-item>
          <template slot="label">
            计划用气客户
          </template>
          <el-col :span="20">
            <el-input v-model="nextForm.plan" disabled></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="text" size="middle" style="margin-left: 10px;" @click="dialog1 = true">客户明细</el-button>
          </el-col>
        </el-form-item>
        <el-form-item :style="{'margin-bottom': nextForm.notPlanTable.length > 0 ? '10px' : '20px'}">
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
            <el-input v-model="nextForm.notPlan" disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="" v-if="nextForm.notPlanTable.length > 0">
          <el-col :span="20">
            <el-table
                class="custom-table-n"
                border
                header-row-class-name="custom-table-header"
                header-cell-class-name="custom-table-header-cell"
                cell-class-name="custom-table-cell"
                :data="nextForm.notPlanTable">
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
            <el-input v-model="nextForm.newCustom" disabled></el-input>
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
            <el-input v-model="nextForm.xishu" @input="calcNewCustomerValue" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
          </el-col>
          <el-col :span="4" style="text-align: center;">
            × 开口总量
          </el-col>
          <el-col :span="5">
            <el-input v-model="nextForm.kaikouzongliang" disabled></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="text" size="middle" style="margin-left: 10px;" @click="dialog2 = true">客户明细</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="其它影响因素">
          <el-col v-for="(v, i) in nextForm.other" :span="24" :key="i">
            <el-col :span="20">
              <div class="select-input-wrapper">
                <el-select v-model="v.name" placeholder="请选择">
                  <el-option
                      v-for="item in yinsuOption"
                      :key="item"
                      :label="item"
                      :disabled="optionDisabled('now', item)"
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
              <i class="el-icon-delete" style="margin-left: 10px;" @click="deleteYinsu(nextForm.other, i)"></i>
            </el-col>
          </el-col>
          <el-col :span="20" v-if="nextForm.other.length < yinsuOption.length">
            <div class="add-item" @click="addYinsu(nextForm.other)">
              <i class="el-icon-plus"></i>
              添加因素
            </div>
          </el-col>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" round class="cal-btn" @click="calc()">计算</el-button>
    </div>
    <div :class="{'calculator-container': true, 'calculator-3': true, 'calculator-active': this.toggleDay === 'pre'}">
      <div class="m-wrapper" style="padding: 0;margin-top: 0;">
        昨日实际用气分析 <span>(单位:万方)</span>
      </div>
      <div class="c3-item-wrapper">
        <div class="c3-item">
          <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 3.1V25H39.9C38.898 35.106 30.37 43 20 43C8.954 43 0 34.046 0 23C0 12.63 7.894 4.102 18 3.1ZM22 0.0859985C33.106 1.04 41.958 9.894 42.914 21H22V0.0859985Z" fill="#409EFF"/>
          </svg>
          <div class="c3-text-wrapper">
            <div class="label">当日实际用气量</div>
            <div class="data">{{ yestodayForm.todayActualGas }}</div>
          </div>
        </div>
        <div class="c3-item">
          <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 0H38C38.5304 0 39.0391 0.210714 39.4142 0.585786C39.7893 0.960859 40 1.46957 40 2V34C40 34.5304 39.7893 35.0391 39.4142 35.4142C39.0391 35.7893 38.5304 36 38 36H2C1.46957 36 0.960859 35.7893 0.585786 35.4142C0.210714 35.0391 0 34.5304 0 34V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0ZM10 20V28H14V20H10ZM18 8V28H22V8H18ZM26 14V28H30V14H26Z" fill="#67C23A"/>
          </svg>
          <div class="c3-text-wrapper">
            <div class="label">当日预测用气量</div>
            <div class="data">{{ yestodayForm.todaylPredictGas }}</div>
          </div>
        </div>
        <div class="c3-item">
          <svg width="38" height="36" viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0V8H0V0H18ZM26 28V36H0V28H26ZM38 14V22H0V14H38Z" fill="#E6A23C"/>
          </svg>
          <div class="c3-text-wrapper">
            <div class="label">偏差量</div>
            <div class="data">{{ yestodayForm.deviationGas }}</div>
          </div>
        </div>
        <div class="c3-item">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29 36C27.1435 36 25.363 35.2625 24.0503 33.9497C22.7375 32.637 22 30.8565 22 29C22 27.1435 22.7375 25.363 24.0503 24.0503C25.363 22.7375 27.1435 22 29 22C30.8565 22 32.637 22.7375 33.9497 24.0503C35.2625 25.363 36 27.1435 36 29C36 30.8565 35.2625 32.637 33.9497 33.9497C32.637 35.2625 30.8565 36 29 36ZM7 14C6.08075 14 5.1705 13.8189 4.32122 13.4672C3.47194 13.1154 2.70026 12.5998 2.05025 11.9497C1.40024 11.2997 0.884626 10.5281 0.532843 9.67878C0.18106 8.8295 0 7.91925 0 7C0 6.08075 0.18106 5.17049 0.532843 4.32122C0.884626 3.47194 1.40024 2.70026 2.05025 2.05025C2.70026 1.40024 3.47194 0.884626 4.32122 0.532843C5.1705 0.18106 6.08075 -1.93718e-08 7 0C8.85652 3.91231e-08 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14ZM32.142 1.03L34.97 3.858L3.86 34.97L1.032 32.142L32.14 1.03H32.142Z" fill="#47A87D"/>
          </svg>
          <div class="c3-text-wrapper">
            <div class="label">偏差率</div>
            <div class="data">{{ yestodayForm.deviationRate }}%</div>
          </div>
        </div>
      </div>
      <div class="m-wrapper" style="padding: 0;margin-top: 0;">
        昨日影响气量波动因素及用气量 <span>(单位:万方)</span>
      </div>
      <el-form ref="form" :model="yestodayForm" label-width="0px" class="form-wrapper" style="margin-left: 0;width: 480px;">
        <el-form-item label="">
          <el-col v-for="(v, i) in yestodayForm.other" :span="24" :key="i">
            <el-col :span="19">
              <div class="select-input-wrapper">
                <el-select v-model="v.name" placeholder="请选择">
                  <el-option
                      v-for="item in yinsuOption"
                      :key="item"
                      :label="item"
                      :disabled="optionDisabled('pre', item)"
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
              <i class="el-icon-delete" style="margin-left: 10px;" @click="deleteYinsu(yestodayForm.other, i)"></i>
            </el-col>
          </el-col>
          <el-col :span="19" v-if="yestodayForm.other.length < yinsuOption.length">
            <div class="add-item"  @click="addYinsu(yestodayForm.other)">
              <i class="el-icon-plus"></i>
              添加因素
            </div>
          </el-col>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" round class="cal-btn" @click="calc()">保存</el-button>
    </div>
    <div class="m-wrapper">
      近7日实际用气量 <span>(单位:万方)</span>
    </div>
    <div class="table-wrapper">
      <el-table
          class="custom-table-n"
          border
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          :row-class-name="tableRowClassName"
          :data="recentDataOfDay">
        <el-table-column
            align="left"
            min-width="180"
            property="yinsu"
            fixed="left"
            label="影响因素">
        </el-table-column>
        <el-table-column
            align="right"
            min-width="180"
            :label="getFormatDate(date.getTime() - 24*3600000, '/') + ' 星期' + getFormatWeek(date.getTime() - 24*3600000)">
          <template slot-scope="scope">
            <recent-table-item :columnName="getFormatDate(date.getTime() - 24*3600000, '-')" :rowData="scope.row"></recent-table-item>
          </template>
        </el-table-column>
        <el-table-column
            align="right"
            min-width="180"
            :label="getFormatDate(date.getTime() - 2*24*3600000, '/') + ' 星期' + getFormatWeek(date.getTime() - 2*24*3600000)">
          <template slot-scope="scope">
            <recent-table-item :columnName="getFormatDate(date.getTime() - 2*24*3600000, '-')" :rowData="scope.row"></recent-table-item>
          </template>
        </el-table-column>
        <el-table-column
            align="right"
            min-width="180"
            :label="getFormatDate(date.getTime() - 3*24*3600000, '/') + ' 星期' + getFormatWeek(date.getTime() - 3*24*3600000)">
          <template slot-scope="scope">
            <recent-table-item :columnName="getFormatDate(date.getTime() - 3*24*3600000, '-')" :rowData="scope.row"></recent-table-item>
          </template>
        </el-table-column>
        <el-table-column
            align="right"
            min-width="180"
            :label="getFormatDate(date.getTime() - 4*24*3600000, '/') + ' 星期' + getFormatWeek(date.getTime() - 4*24*3600000)">
          <template slot-scope="scope">
            <recent-table-item :columnName="getFormatDate(date.getTime() - 4*24*3600000, '-')" :rowData="scope.row"></recent-table-item>
          </template>
        </el-table-column>
        <el-table-column
            align="right"
            min-width="180"
            :label="getFormatDate(date.getTime() - 5*24*3600000, '/') + ' 星期' + getFormatWeek(date.getTime() - 5*24*3600000)">
          <template slot-scope="scope">
            <recent-table-item :columnName="getFormatDate(date.getTime() - 5*24*3600000, '-')" :rowData="scope.row"></recent-table-item>
          </template>
        </el-table-column>
        <el-table-column
            align="right"
            min-width="180"
            :label="getFormatDate(date.getTime() - 6*24*3600000, '/') + ' 星期' + getFormatWeek(date.getTime() - 6*24*3600000)">
          <template slot-scope="scope">
            <recent-table-item :columnName="getFormatDate(date.getTime() - 6*24*3600000, '-')" :rowData="scope.row"></recent-table-item>
          </template>
        </el-table-column>
        <el-table-column
            align="right"
            min-width="180"
            :label="getFormatDate(date.getTime() - 7*24*3600000, '/') + ' 星期' + getFormatWeek(date.getTime() - 7*24*3600000)">
          <template slot-scope="scope">
            <recent-table-item :columnName="getFormatDate(date.getTime() - 7*24*3600000, '-')" :rowData="scope.row"></recent-table-item>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="dialog1" width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="custom-dialog-n"
      :before-close="dialog1Close">
      <template slot="title">
        <div class="e-title-dialog">
          计划用气客户 <span>(单位:方)</span>
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
            :data="nextForm.planTable">
          <el-table-column
              property="bpName"
              align="left"
              width="340"
              label="客户名称">
          </el-table-column>
          <el-table-column
              property="bpValue"
              align="right"
              :label="toggleDay === 'next' ? '明日计划量' : '今日计划量'">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bpValue" class="custom-input-r" @input="calcPlanValue"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-button size="small" type="primary" round class="save-btn" @click="dialog1 = false" :disabled="nextForm.planTable.length === 0">保存</el-button>
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
            :data="nextForm.newCustomTable">
          <el-table-column
              property="bpName"
              align="left"
              label="客户名称">
          </el-table-column>
          <el-table-column
              property="bpValue"
              align="right"
              label="明日转换开口气量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bpValue" class="custom-input-r" @input="calcNewCustomerValue"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-button size="small" type="primary" round class="save-btn" @click="dialog2 = false" :disabled="nextForm.newCustomTable.length === 0">保存</el-button>
    </el-dialog>
  </div>
</template>

<script>
import dateFormater from "../../../components/dateFormater/dateFormater";
import recentTableItem from "./recentTableItem";
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
      threeData: {
        yestoday: 0,
        today: 0,
        tomorrow: 0,
        tomorrowIsChange: false,
        todayIsChange: false
      },
      nextForm: {
        value: 0,
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
      yestodayForm: {
        deviationGas: 439.59,
        deviationRate: 0,
        other: [],
        id: 0,
        todayActualGas: 0,
        todaylPredictGas: 439.59,
      },
      yinsuOption: ['设备检修', '环保政策', '双限政策', '疫情', '其它'],
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
      this.getDataOfThreeDays()
      this.getDemandOfDay();
      this.getRecentData();
    },
    getDataOfThreeDays: function () {
      let params = {
        code: this.curComCode,
        date: this.getFormatDate(this.date),
        orgLevel: this.$store.getters.curComInfo.orgLevel
      }
      api.gasDemand.getDemandDataOfThreeDay(params).then(res => {
        if(res) {
          this.threeData.yestoday = res[0].yesterday
          this.threeData.today = res[0].today
          this.threeData.todayIsChange = res[0].today
          this.threeData.tomorrow = res[0].tomorrow
          this.threeData.tomorrowIsChange = res[0].tomorrowIsChange
        }
      })
    },
    getDemandOfDay: function () {
      let params = {
        code: this.curComCode,
        orgLevel: this.$store.getters.curComInfo.orgLevel,
        reportPeriod: '0'
      }
      if(this.toggleDay === 'next') {
        params.date = this.getFormatDate(new Date(this.date).getTime() + 86400000)
      } else if(this.toggleDay === 'now') {
        params.date = this.getFormatDate(this.date)
      } else {
        return this.getYestodayData()
      }
      api.gasDemand.getDemandOfDay(params).then(res => {
        if(res) {
          this.nextForm.value = res[0].totalPredictedValue
          this.nextForm.isChange = res[0].isChange
          this.nextForm.other = res[0].forecastOtherVOList
          this.nextForm.plan = res[0].planGasCustomersSaveVO.factorValue
          this.nextForm.planTable = res[0].planGasCustomersSaveVO.smartForecastBPDetailVOList
          this.nextForm.notPlan = res[0].nonPlannedGasCustomersForecastSaveVO.factorValue
          this.nextForm.notPlanTable = res[0].nonPlannedGasCustomersForecastSaveVO.smartForecastBPDetailVOList
          this.nextForm.newCustom = res[0].newCustomerForecastSaveVO.factorValue
          this.nextForm.xishu = res[0].newCustomerForecastSaveVO.coefficient
          this.nextForm.kaikouzongliang = res[0].newCustomerForecastSaveVO.totalOpening
          this.nextForm.newCustomTable = res[0].newCustomerForecastSaveVO.smartForecastBPDetailVOList
        }
      })
    },
    getYestodayData: function () {
      let params = {
        code: this.curComCode,
        date: this.getFormatDate(new Date(this.date).getTime() - 86400000),
        orgLevel: this.$store.getters.curComInfo.orgLevel,
      }
      api.gasDemand.getDemandOfYestoday(params).then(res => {
        if(res) {
          this.yestodayForm.id = res[0].id
          this.yestodayForm.deviationGas = res[0].deviationGas
          this.yestodayForm.deviationRate = res[0].deviationRate
          this.yestodayForm.todayActualGas = res[0].todayActualGas
          this.yestodayForm.todaylPredictGas = res[0].todaylPredictGas
          this.yestodayForm.other = res[0].forecastOtherVOList
        }
      })
    },
    getRecentData: function () {
      let params = {
        code: this.curComCode,
        date: this.getFormatDate(this.date)
      }
      api.gasDemand.getRecentData(params).then(res => {
        if(res) {
          this.recentDataOfDay = res[0]
        }
      })
    },
    toggleDayChangeHandle: function (type) {
      this.$cancelAxios();
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
        "forecastOtherVOList": this.nextForm.other,
        "newCustomerForecastSaveVO": {
          "coefficient": this.nextForm.xishu,
          "factorValue": this.nextForm.newCustom,
          "smartForecastBPDetailVOList": this.nextForm.newCustomTable,
          "totalOpening": this.nextForm.kaikouzongliang
        },
        "nonPlannedGasCustomersForecastSaveVO": {
          "factorValue": this.nextForm.notPlan,
          "smartForecastBPDetailVOList": this.nextForm.notPlanTable
        },
        "orgLevel": this.$store.getters.curComInfo.orgLevel,
        "planGasCustomersSaveVO": {
          "factorValue": this.nextForm.plan,
          "smartForecastBPDetailVOList": this.nextForm.planTable
        }
      }
      if(this.toggleDay === 'next') {
        data.date = this.getFormatDate(new Date(this.date).getTime() + 86400000)
      } else if(this.toggleDay === 'now') {
        data.date = this.getFormatDate(this.date)
      } else {
        return this.calcYestoday()
      }
      api.gasDemand.saveDemandOfDay(data).then(res => {
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
      for (let v of this.nextForm.planTable) {
        if(v.bpValue === '' || isNaN(parseFloat(v.bpValue))) {
          v.bpValue = 0
        } else {
          v.bpValue = parseFloat(v.bpValue)
          ret += parseInt(v.bpValue)
        }
      }
      this.nextForm.plan = parseFloat(ret/10000).toFixed(4)
    },
    calcNewCustomerValue: function () {
      let ret = 0
      for (let v of this.nextForm.newCustomTable) {
        if(v.bpValue === '' || isNaN(parseInt(v.bpValue))) {
          v.bpValue = 0
        } else {
          v.bpValue = parseInt(v.bpValue)
          ret += parseInt(v.bpValue)
        }
      }
      if(this.nextForm.xishu === '') {
        this.nextForm.xishu = 0
      }
      this.nextForm.kaikouzongliang = parseFloat(ret/10000).toFixed(4)
      this.nextForm.newCustom = parseFloat(this.nextForm.kaikouzongliang*this.nextForm.xishu).toFixed(4)
    },
    dialog1Summary: function (param) {
      let indexBegin = 1;
      let sums = ['合计']
      const { columns, data } = param;
      columns.forEach((column, index) => {
        if (index < indexBegin) {
          return;
        }
        const values = data.map(item => {
          return isNaN(parseInt(item[column.property])) ? 0 : parseInt(item[column.property])
        });
        sums[index] = values.reduce((prev, curr) => {
          return (parseInt(prev) + parseInt(curr))
        }, 0);
      });
      return sums;
    },
    dialog1Close: function (done) {
      let params = {
        code: this.curComCode,
        orgLevel: this.$store.getters.curComInfo.orgLevel,
        reportPeriod: '0'
      }
      if(this.toggleDay === 'next') {
        params.date = this.getFormatDate(new Date(this.date).getTime() + 86400000)
      } else if(this.toggleDay === 'now') {
        params.date = this.getFormatDate(this.date)
      } else {
        return this.getYestodayData()
      }
      api.gasDemand.getDemandOfDay(params).then(res => {
        if(res) {
          this.nextForm.plan = res[0].planGasCustomersSaveVO.factorValue
          this.nextForm.planTable = res[0].planGasCustomersSaveVO.smartForecastBPDetailVOList
        }
      })
      done()
    },
    dialog2Close: function (done) {
      let params = {
        code: this.curComCode,
        orgLevel: this.$store.getters.curComInfo.orgLevel,
        reportPeriod: '0'
      }
      if(this.toggleDay === 'next') {
        params.date = this.getFormatDate(new Date(this.date).getTime() + 86400000)
      } else if(this.toggleDay === 'now') {
        params.date = this.getFormatDate(this.date)
      } else {
        return this.getYestodayData()
      }
      api.gasDemand.getDemandOfDay(params).then(res => {
        if(res) {
          this.nextForm.newCustom = res[0].newCustomerForecastSaveVO.factorValue
          this.nextForm.xishu = res[0].newCustomerForecastSaveVO.coefficient
          this.nextForm.kaikouzongliang = res[0].newCustomerForecastSaveVO.totalOpening
          this.nextForm.newCustomTable = res[0].newCustomerForecastSaveVO.smartForecastBPDetailVOList
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
        for (let v of this.nextForm.other) {
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
    },
    regNumber: function (e) {
      console.log(e)
      // let reg = /(-?\d+(?:\.\d{0,4})?)/g
      // let matchRet = value.match(reg)
      // console.log(matchRet)
      // if(matchRet.length === 0) {
      //   value = 0
      // } else {
      //   value = matchRet[0]
      // }
    }
  },
  components: {
    recentTableItem
  },
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
  box-shadow: 0px 6px 18px rgba(86, 125, 185, 0.14);
  svg {
    visibility: visible !important;
  }
}
.top-card-wrapper {
  width: calc(33.3% - 13px);
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
  width: 100%;
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
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #A3D3BE;
  padding: 20px 0;
  display: none;
  position: relative;
  box-shadow: 0px 6px 18px rgba(86, 125, 185, 0.14);
}
.calculator-3 {
  padding: 20px 13%;
}
.calculator-active {
  display: block;
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
  left: 16%;
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
  left: 49%;
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