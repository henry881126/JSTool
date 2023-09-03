<template>
  <div class="gas-page-bg">
    <weather-tip></weather-tip>
    <top-menu title="气量预测"></top-menu>
    <div class="day-month-tog-wrapper">
      <el-button
          :type="toggleDay ? 'primary' : ''"
          round
          @click="toggleDayHandler(true)"
          v-trace="{title:'需求预测-气量预测-点击日'}"
      >日
      </el-button
      >
      <el-button :type="toggleDay ? '' : 'primary'"
                 round
                 @click="toggleDayHandler(false)"
                 style="margin-left: 20px"
                 v-trace="{title:'需求预测-气量预测-点击月'}">
        月
      </el-button>
      <div class="day-month-datepicker-wrapper">
        <div class="date-picker">
          <el-date-picker
              v-show="toggleDay && toggleDemand"
              v-model="dateDD"
              type="date"
              @change="dateDDChange"
              :clearable="false"
              format="yyyy/MM/dd"
              placeholder="选择日期" class="gas-el-date">
          </el-date-picker>
          <el-date-picker
              v-show="toggleDay && !toggleDemand"
              v-model="dateDC"
              type="date"
              @change="dateDCChange"
              :clearable="false"
              format="yyyy/MM/dd"
              placeholder="选择日期" class="gas-el-date">
          </el-date-picker>
          <el-date-picker
              v-show="!toggleDay"
              v-model="dateDM"
              type="month"
              @change="dateDMChange"
              :clearable="false"
              format="yyyy/MM"
              placeholder="选择日期" class="gas-el-date">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="gas-needs-demand-wrapper gas-demand-wrapper">
      <div class="gas-wrapper-title">
        气量需求预测
        <div class="gas-reply-btn-wrapper">
          <el-button icon="el-icon-share" round @click="$router.push('/PredictionDeviation')" v-trace="{title:'需求预测-气量预测-点击偏差分析'}">
            气量偏差分析
          </el-button>
        </div>
      </div>
      <div v-show="toggleDay">
        <div class="gas-tab-card-header">
          <div :class="{'tab-card-header': true, 'tab-card-header-active': toggleDemand,}" @click="toggleDemandHandler(true)">
            预测{{ this.getCaption(this.getFormatDate(this.dateDD, '/')) }}
          </div>
          <div :class="{'tab-card-header': true, 'tab-card-header-active': !toggleDemand,}" @click="toggleDemandHandler(false)">
            跟踪{{this.getCaption(this.getFormatDate(this.dateDD - 24*3600000, '/')) }}
          </div>
        </div>
        <div class="gas-tab-card-wrapper">
          <div class="gas-tab-card" v-show="toggleDemand">
            <div class="gas-tab-card-content">
              <div class="card-content-top">
                <span>{{getFormatDate(this.dateDD-48*3600000, '/')}}用气量</span>
                <div class="actual-gas">
                  <span class="gas-num">{{ getDayActualGasData }}</span>
                  <span class="gas-unit">万m³</span>
                </div>
              </div>
              <div class="card-content-bottom">
                <span>预测{{ this.getFormatDate(this.dateDD, '/') }}用气量</span>
                <div class="insert-gas">
                  <el-input class="actual-gas"
                            :readonly="getFormatDate(Date.now() + 24*3600000) !== getFormatDate(dateDD)"
                            v-model="predictData"></el-input>
                  <span class="insert-gas-unit">万m³</span>
                </div>
                <el-button class="confirm-btn" type="primary" @click="centerDialogVisible = true"
                           :disabled="getFormatDate(Date.now() + 24*3600000) !== getFormatDate(dateDD)" v-trace="{title:'需求预测-气量预测-日-点击确认'}">确认</el-button>
              </div>
            </div>
          </div>
          <div class="gas-tab-card" v-show="!toggleDemand">
            <div class="gas-tab-card-content">
              <div class="card-content-top">
                <span>原预测{{this.getFormatDate(this.dateDD-24*3600000, '/') }}用气量</span>
                <div class="actual-gas trail">
                  <span class="gas-num">{{ predictData }}</span>
                  <span class="gas-unit">万m³</span>
                </div>
              </div>
              <div class="card-content-bottom">
                <span>预测变更{{this.getFormatDate(this.dateDD - 24*3600000, '/') }}用气量</span>
                <div class="insert-gas">
                  <el-input class="actual-gas"
                            :readonly="getFormatDate(Date.now()) !== getFormatDate(dateDC)"
                            v-model="changepredictData"></el-input>
                  <span class="insert-gas-unit">万m³</span>
                </div>
                <el-button type="primary" class="confirm-btn"
                           :disabled="getFormatDate(Date.now()) !== getFormatDate(dateDC)"
                           @click="changeConfirm" v-trace="{title:'需求预测-气量预测-日-跟踪-点击确认'}">确认</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gas-tab-card-month" v-show="!toggleDay">
        <div class="month-card-content">
          <div class="month-card-content-item">
            <div class="item-data">
              <div>{{ getFormatMonthPre(getFormatMonthPre(this.dateDM, '/'), '/') }}</div>
              <div>实际用气</div>
            </div>
            <div class="item-gas">
              <span class="gas-num" :title="monthlyActualGasvolume">{{ monthlyActualGasvolume || 0 }}</span>
              <span class="gas-unit">万m³</span>
            </div>
          </div>
          <div class="month-card-content-item">
            <div class="item-data">
              <div>{{ getFormatMonth(this.dateDM, '/') }}</div>
              <div>合同气量</div>
            </div>
            <div class="item-gas">
              <span class="gas-num" :title="getCurrentMonthContract">{{ getCurrentMonthContract || 0 }}</span>
              <span class="gas-unit">万m³</span>
            </div>
          </div>

          <div class="card-content-bottom">
            <span>预测 {{ getFormatMonth(this.dateDM, '/') }}用气量</span>
            <el-input class="actual-gas"
                      :readonly="getFormatMonth(Date.now()) !== getFormatMonthPre(dateDM)"
                      v-model="predictMouthData"></el-input>
            <el-button
                class="confirm-btn"
                type="primary"
                :disabled="getFormatMonth(Date.now()) !== getFormatMonthPre(dateDM)"
                @click="centerDialogVisibleMonth=true"
                v-trace="{title:'需求预测-气量预测-月-点击确认'}"
            >确认
            </el-button>
          </div>
        </div>
      </div>
      <div class="gas-needs-table-wrapper">
        <el-table
            :data="gasDemandTable"
            stripe
            :summary-method="getSummaries"
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            :show-summary="true"
            class="custom-table-r"
            height="280px"
        >
          <el-table-column prop="type" label="分类" width="180" align="center">
          </el-table-column>
          <el-table-column
              prop="rA"
              label="航天预测"
              align="center">
          </el-table-column>
          <el-table-column prop="rB" label="数研院预测" align="center">
            <template slot-scope="scope">
              <span style="color: transparent;">{{scope.row.rB}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="report" label="大客户上报" align="center">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- <div
        class="gas-demand-recommend-wrapper gas-demand-wrapper"
        v-show="toggleDay && toggleDemand"
    >
      <div class="gas-wrapper-title">推荐近期用气量</div>
      <div class="gas-recommend-tip-wrapper gas-tip-left"
           @click="recommendMove(-227)">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="gas-recommend-tip-wrapper gas-tip-right"
           @click="recommendMove(227)">
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="gas-recommend-item-wrapper">
        <div ref="recomendWrapper">
          <div class="gas-recommend-item" v-for="v in recommend" :key="v.date">
            <div class="gas-recommend-item-date">{{ getFormatDate(v.date, '/') }} <span> 周{{getFormatWeek(v.date)}}</span></div>
            <div class="gas-recommend-item-use gas-recommend-item-text">
              用气量：<span style="font-size: 20px; color: #0fb2ab">{{v.todayTotal }}</span>
              万m³
            </div>
            <img :src="'/static/img/' + v.phenomena + '.png'" class="gas-recommend-img" />
            <div class="gas-recommend-item-tem gas-recommend-item-text">
              <span>{{ v.phenomena }}</span>
            </div>
            <div class="gas-recommend-item-tem gas-recommend-item-text">
              日均温：<span style="color: #0fb2ab">{{ v.avgtemp }}℃</span>
            </div>
            <div class="gas-recommend-item-tem-high gas-recommend-item-text">
              最高温：{{ v.maxtemp }}℃
            </div>
            <div class="gas-recommend-item-tem=low gas-recommend-item-text">
              最低温：{{ v.mintemp }}℃
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="gas-demand-counter" v-show="toggleDay && toggleDemand">
      <img class="counster-img" src="./assets/jisuanqi.png" alt="">
         <el-table
            :data="gasDemandCounterTable"
            stripe
            :summary-method="getSummariesCounter"
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            :show-summary="true"
            class="custom-table-r"
            style="width: 100%; margin-top: 20px;"
        >
          <el-table-column prop="type" label="影响因素" width="180" align="center">
          </el-table-column>
          <el-table-column prop="before" :label="getCaption(getFormatDate(this.dateDD-48*3600000, '/'))+'数据'" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.before}}</span>
                      <img class="before-weather" v-if="scope.row.typeShow =='04'" :src="'/static/img/tempicon/' + scope.row.before + '.png'" onerror="javascript:this.src='/static/img/tempicon/默认天气.png';" alt="">
                <span v-if="scope.row.typeShow =='08'">{{scope.row.before_market_value}}
                  <span v-show="scope.row.before_market_value">万方</span>
                </span>
                <span v-show="scope.row.typeShow =='01'">℃</span>
              </template>
          </el-table-column>
          <el-table-column  width="400"  prop="current" :label="'预测'+this.getCaption(this.getFormatDate(this.dateDD, '/'))+'(调整变量值）'" align="center">
             <template slot-scope="scope">
                <div class="counter-yuce">
                  <div class="counter-unit" v-if="scope.row.typeShow ==='01'">
                      <el-input type="number" class="degrees"  v-model="scope.row.current">
                      </el-input>
                      <span v-show="scope.row.current" v-if="scope.row.current && scope.row.current.length<=2" class="degrees-mark-x">℃</span>
                      <span v-show="scope.row.current" v-if="scope.row.current && scope.row.current.length>2" class="degrees-mark">℃</span>
                  </div>
                  <div v-if="scope.row.typeShow =='04'" class="counter-unit counter-weather" >         
                        <el-select
                        style="width: 100%"
                        v-model="scope.row.current"
                        placeholder="请选择"
                        clearable
                        filterable
                        @change="tableCounter"
                      >
                        <el-option
                          v-for="item in getGasArr"
                          :key="item"
                          :label="item"
                          :value="item"
                        ></el-option>
                      </el-select>
                      <img class="" :src="'/static/img/tempicon/' +scope.row.current+ '.png'" onerror="javascript:this.src='/static/img/tempicon/默认天气.png';" alt="">
                  </div>
                  <div v-if="scope.row.typeShow =='05'" class="counter-unit">
                      <el-cascader
                        v-model="scope.row.current"
                        :options="counterYN"
                        @change="tableCounter(scope.row)"></el-cascader>
                        <div class="week-holity">
                          <div :class="{'week':!scope.row.holiday_type}">{{scope.row.weekend}}</div>
                          <div class="holity">{{scope.row.holiday_type}}</div>
                        </div>       
                  </div>
                  <div v-if="scope.row.typeShow =='06'" class="counter-unit">
                        <el-cascader
                          v-model="scope.row.current"
                          :options="counterYN"
                          @change="tableCounter(scope.row)"></el-cascader>
                  </div>
                  <div v-if="scope.row.typeShow =='07'" class="counter-unit" >
                        <el-cascader
                          v-model="scope.row.current"
                          :options="counterAccidentFactors"
                          @change="tableCounter(scope.row)"></el-cascader>
                        <el-input class="second-insert" v-if=" scope.row.current=='03'||scope.row.current=='04'|| scope.row.current=='05'" v-model="scope.row.event_value">
                        </el-input>
                        <div class="unit-c" v-show="scope.row.current=='03'|| scope.row.current=='04'|| scope.row.current=='05'">万方</div>
                  </div>
                  <div v-if="scope.row.typeShow =='08'" class="counter-unit">
                        <el-cascader
                          v-model="scope.row.current"
                          :options="counterGasOptions"
                          @change="tableCounter(scope.row)"></el-cascader>
                        <el-input class="second-insert" v-if="scope.row.current=='01'|| scope.row.current=='02'" v-model="scope.row.market_value">
                        </el-input>
                        <div class="unit-c" v-show="scope.row.current=='01'|| scope.row.current=='02'">万方</div>
                  </div>
                </div>
              </template>
          </el-table-column>
          <el-table-column prop="result" label="计算结果" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.result">
                   <i  v-show="scope.row.result_flag =='0'" class="el-icon-bottom"></i>
                   <i  v-show="scope.row.result_flag =='1'" class="el-icon-top"></i>
              </span>
              
              <span>{{scope.row.result}}</span>
              <span v-if="scope.row.result">万方</span>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="预测结果分析" align="center" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div class="counster-bottom">
          <el-button class="calculate-start" @click="startCalculate" v-trace="{title:'需求预测-气量预测-气量预测计算器-点击开始测算'}">开始测算</el-button>
          <div class="check-gas">
             <span class="check-more" @click="recommendGas" v-trace="{title:'需求预测-气量预测-气量预测计算器-点击推荐用气量'}">推荐用气量  >></span>
             <span @click="checkHistory" v-trace="{title:'需求预测-气量预测-气量预测计算器-点击查看历史用气量'}">查看历史用气量  >></span>
          </div>  
        </div>
      </div>
    <!-- <div
        class="gas-demand-abnormal-wrapper gas-demand-wrapper"
        v-show="toggleDay && toggleDemand"
    >
      <div class="gas-wrapper-title">
        异常客户日用气量分析<span>单位：万方</span>
      </div>
      <div class="gas-abnormal-tool-wrapper">
        <el-button round
                   @click="toggleAbnormalHandle(true)"
                   :class="{'btn-toggle-abnormal-active': toggleAbnormal}">用气异常
        </el-button>
        <el-button round style="margin-left: 20px;"
                   @click="toggleAbnormalHandle(false)"
                   :class="{'btn-toggle-abnormal-active': !toggleAbnormal}">上报异常
        </el-button>
        <div class="gas-tool-search-wrapper">
          <el-input
              v-model="searchComp"
              placeholder="请输入内容"
              @change="searchCompChange"
              prefix-icon="el-icon-search">
          </el-input>
        </div>
      </div>
      <div class="gas-abnormal-table-wrapper" style="margin-top: 100px">
        <div v-show="toggleAbnormal">
          <el-table
              :data="tableAbnormal.list"
              stripe
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
              @sort-change="tableAbnormalSortChange"
              class="custom-table-r">
            <el-table-column
                prop="id"
                label="序号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="mcName1"
                label="客户名称">
            </el-table-column>
            <el-table-column
                prop="abrmenge"
                label="实际用气量">
            </el-table-column>
            <el-table-column
                prop="dateAbnormal"
                sortable="custom">
              <template slot="header">
                <div style="position: relative;display: inline-block">
                  数据异常
                  <el-tooltip popper-class="custom-tooltip" class="dd-tooltip" effect="dark" content="异常说明：实际用气量与前日用气量的倍数小于0.667，大于1.5" placement="right">
                    <div>
                      <i class="el-icon-info" style="color: #0FB2AB;"></i>
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="gasAbnormal"
                sortable="custom">
              <template slot="header">
                <div style="position: relative;display: inline-block">
                  用气波动异常
                  <el-tooltip popper-class="custom-tooltip" class="dd-tooltip" effect="dark" content="波动异常说明：与前一日对比的波动值" placement="right">
                    <div>
                      <i class="el-icon-info" style="color: #0FB2AB;"></i>
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                label="备注">
              <template slot-scope="scope">
                <div>
                  <el-input class="reply-input"
                            v-model="scope.row.reasonAbnormal"
                            @change="tableAbnormalPut(scope.row)"
                            type="textarea" :rows="1" placeholder="请输入内容"></el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="!toggleAbnormal">
          <el-table
              stripe
              :data="tableAbnormalReport.list"
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
              class="custom-table-r">
            <el-table-column
                prop="id"
                label="序号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="mcName1"
                label="客户名称">
            </el-table-column>
            <el-table-column
                prop="abrmenge"
                label="实际用气量">
            </el-table-column>
            <el-table-column
                prop="report"
                label="上报数据">
            </el-table-column>
            <el-table-column
                prop="rateReport"
                label="上报偏差率">
            </el-table-column>
            <el-table-column prop="amount3" label="备注">
              <template slot-scope="scope">
                <div>
                  <el-input class="reply-input"
                            v-model="scope.row.reasonAbnormal"
                            @change="tableAbnormalReportPut(scope.row)"
                            type="textarea" :rows="1" placeholder="请输入内容"></el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="gas-abnormal-page-wrapper custom-page">
        <el-pagination
            v-show="toggleAbnormal"
            layout="prev, pager, next"
            @current-change="tableAbnormalPageChange"
            :current-page="tableAbnormal.current"
            :page-size="tableAbnormal.pageSize"
            :total="tableAbnormal.total">
        </el-pagination>
        <el-pagination
            v-show="!toggleAbnormal"
            layout="prev, pager, next"
            @current-change="tableAbnormalPageReportChange"
            :current-page="tableAbnormalReport.current"
            :page-size="tableAbnormalReport.pageSize"
            :total="tableAbnormalReport.total">
        </el-pagination>
      </div>
      <div style="margin-top: 30px" v-show="toggleAbnormal">
        <div class="gas-abnormal-bom-l gas-abnormal-bom">
          <div
              style="
              display: inline-block;
              width: calc(100% - 30px);
              margin-left: 20px;
              vertical-align: top;
            "
          >
            <div class="gas-abnormal-bom-title">
              出现异常情况的有{{ tableAbnormal.bottomLeft.length || 0 }}家
            </div>
            <div class="gas-abnormal-bom-text">
              <span v-for="(v, i) in tableAbnormal.bottomLeft" :key="i">{{ i === 0 ? v : '，' + v }}</span>
            </div>
          </div>
        </div>
        <div class="gas-abnormal-bom-r gas-abnormal-bom">
          <div
              style="
              display: inline-block;
              width: calc(100% - 30px);
              margin-left: 20px;
              vertical-align: top;
            "
          >
            <div class="gas-abnormal-bom-title">
              用气波动较大的客户有{{ tableAbnormal.bottonRight.length || 0 }}家
            </div>
            <div class="gas-abnormal-bom-text">
              <span v-for="(v, i) in tableAbnormal.bottonRight" :key="i">{{ i === 0 ? v : '，' + v }}</span>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 30px" v-show="!toggleAbnormal">
        <div class="gas-abnormal-bom-l gas-abnormal-bom">
          <div
              style="
              display: inline-block;
              width: calc(100% - 30px);
              margin-left: 20px;
              vertical-align: top;
            "
          >
            <div class="gas-abnormal-bom-text">
              上报用气计划的有{{ tableAbnormalReport.bottom.count || 0 }}家，平均上报偏差率为{{ tableAbnormalReport.bottom.avg || 0 }}。
              其中偏差率大于±5%的有{{ tableAbnormalReport.bottom.randCount || 0 }}家。
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div
        class="gas-demand-trace-wrapper gas-demand-wrapper"
        v-show="toggleDay && !toggleDemand"
    >
      <div class="gas-wrapper-title">
        今日用气跟踪<span style="">{{ this.getFormatDate(dateDC, "/") }}</span>
      </div>
      <div class="gas-demand-trace-echarts" id="trace"></div>
    </div>
    <div class="gas-demand-month-trace-wrapper gas-demand-wrapper" v-show="!toggleDay">
      <div class="gas-wrapper-title">本月预测执行跟踪</div>
      <div class="gas-demand-month-plan">
        月计划量
        <el-button round class="gas-demand-month-plan-btn">{{ this.getFormatMonth(Date.now(), '/') }}</el-button>
      </div>
      <div class="gas-demand-month-ht gas-demand-month-item">
        <div>
          合同量（万方）
          <div>{{ lineMonthData.hetongliang }}</div>
        </div>
      </div>
      <div class="gas-demand-month-yycl gas-demand-month-item">
        <div>
          月预测量（万方）
          <div>{{ lineMonthData.yueyuceliang }}</div>
        </div>
      </div>
      <div class="gas-demand-month-yjwcl gas-demand-month-item">
        <div>
          预计完成率
          <div>{{ lineMonthData.yueyuceliang === 0 ? 0 : parseFloat(lineMonthData.yueyuceliang / lineMonthData.hetongliang * 100).toFixed(2) }}%</div>
        </div>
      </div>
      <div class="month-float-wrapper">
        <div class="month-float-date">截止{{ getFormatDate(Date.now() - 24 * 3600000, '/') }}</div>
        <div class="month-float-item-wrapper">
          <div class="title">本月实际用气量（万方）</div>
          <div class="text">{{ lineMonthData.shijiyongqiliang }}</div>
        </div>
        <div class="month-float-item-wrapper">
          <div class="title">预测本月用气量（万方）</div>
          <div class="text">{{ lineMonthData.yueyucelianggundong }}</div>
        </div>
        <div class="month-float-item-wrapper">
          <div class="title">预计完成率</div>
          <div class="text">
            {{  lineMonthData.yueyuceliang === 0 ? 0 : parseFloat(lineMonthData.yueyucelianggundong / lineMonthData.hetongliang * 100).toFixed(2) }}%
          </div>
        </div>
      </div>
      <div class="gas-demand-month-echarts" id="monthtrace"></div>
    </div>
    <div
        class="gas-demand-abnormal-wrapper gas-demand-wrapper"
        v-show="!toggleDay"
    >
      <div class="gas-wrapper-title">
        异常客户月用气量分析<span>单位：万方</span>
        <div class="gas-tool-search-wrapper">
          <el-input
              v-model="searchComp"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
          >
          </el-input>
        </div>
      </div>
      <div class="gas-abnormal-table-wrapper">
        <el-table
            stripe
            :data="tableAbnormalMonth.list"
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            @sort-change="tableAbnormalMonthSortChange"
            class="custom-table-r">
          <el-table-column
              prop="id"
              label="序号"
              width="180">
          </el-table-column>
          <el-table-column
              prop="mc_name1"
              label="客户名称">
          </el-table-column>
          <el-table-column
              prop="abrmenge"
              sortable="custom"
              label="实际用气量">
          </el-table-column>
          <el-table-column
              prop="date_abnormal"
              sortable="custom"
              label="数据异常（次/月）">
          </el-table-column>
          <el-table-column
              prop="gas_abnormal"
              sortable="custom"
              label="用气波动异常次数（次/月）">
          </el-table-column>
          <el-table-column
              label="备注">
            <template slot-scope="scope">
              <div>
                <el-input class="reply-input"
                          v-model="scope.row.reason_abnormal"
                          @change="tableAbnormalMonthPut(scope.row)"
                          type="textarea" :rows="1" placeholder="请输入内容"></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="gas-abnormal-page-wrapper custom-page">
        <el-pagination
            layout="prev, pager, next"
            @current-change="tableAbnormalPageMonthChange"
            :current-page="tableAbnormalMonth.current"
            :page-size="tableAbnormalMonth.pageSize"
            :total="tableAbnormalMonth.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
        title="确认提交吗？"
        :visible.sync="centerDialogVisible"
        width="30%"
        center
        class="predict-gas-dialog"
    >
      <div class="dialog-content">
        <div class="">
          <span>预测</span>
          <span class="gas-date">{{ this.getFormatDate(this.dateDD, '/') }}</span>用气量
        </div>
        <div class="dialog-gas-number">
          <span class="gas-number">{{ predictData }}</span
          ><span class="gas-unit">万m³</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">再想想</el-button>
        <el-button type="primary" @click="submitPredictGas">确认提交</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="确认提交吗？"
        :visible.sync="centerDialogVisibleMonth"
        width="30%"
        center
        class="predict-gas-dialog"
    >
      <div class="dialog-content">
        <div class="">
          <span>预测</span>
          <span class="gas-date">{{ this.dateFormat(this.dateDM) }}</span
          >用气量
        </div>
        <div class="dialog-gas-number">
          <span class="gas-number">{{ predictMouthData }}</span
          ><span class="gas-unit">万m³</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisibleMonth = false">再想想</el-button>
        <el-button type="primary" @click="predictMouthconfirm">确认提交</el-button>
      </span>
    </el-dialog>
     <el-dialog
        title="历史用气量"
        :visible.sync="recommendGasVisible"
        width="60%"
        center
        class="predict-gas-dialog recommend-gas-number"
        :key="recommendGasKey"
    >
      <div class="dialog-content ">
        <el-table
        stripe
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="getPriceReportData.dataList"
        header-row-class-name="custom-table-header"
        header-cell-class-name="custom-table-header-cell"
        cell-class-name="custom-table-cell"
        :span-method="objectSpanMethod"
        class="custom-table-r"
      >
        <!-- 动态生成列 -->
        <el-table-column
          v-for="(item, index) in getPriceReportData.theadList"
          :key="'a' + index"
          :label="item.label"
          :prop="item.prop"
          width="110px"
          :fixed="item.prop === 'dimension'|| item.prop === 'date'"
        >
        </el-table-column>
      </el-table>
      </div>
    </el-dialog>
     <el-dialog
        title="推荐用气量"
        :visible.sync="checkHistoryVisible"
        width="60%"
        center
        class="history-gas-dialog"
    >
      <div class="dialog-content">
         <div
        class="gas-demand-recommend-wrapper gas-demand-wrapper"
        v-show="toggleDay && toggleDemand"
    >
      <!-- <div class="gas-wrapper-title">推荐近期用气量</div> -->
      <div class="gas-recommend-tip-wrapper gas-tip-left"
          @click="recommendMove(-227)">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="gas-recommend-tip-wrapper gas-tip-right"
          @click="recommendMove(227)">
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="gas-recommend-item-wrapper">
        <div ref="recomendWrapper">
          <div class="gas-recommend-item" v-for="v in recommend" :key="v.date">
            <div class="gas-recommend-item-date">{{ getFormatDate(v.date, '/') }} <span> 周{{getFormatWeek(v.date)}}</span></div>
            <div class="gas-recommend-item-use gas-recommend-item-text">
              用气量：<span style="font-size: 20px; color: #0fb2ab">{{v.todayTotal }}</span>
              万m³
            </div>
            <img :src="'/static/img/tempicon/' + v.phenomena + '.png'"  onerror="javascript:this.src='/static/img/tempicon/默认天气.png';this.onerror = null" class="gas-recommend-img" />
            <div class="gas-recommend-item-tem gas-recommend-item-text">
              <span>{{ v.phenomena }}</span>
            </div>
            <div class="gas-recommend-item-tem gas-recommend-item-text">
              日均温：<span style="color: #0fb2ab">{{ v.avgtemp }}℃</span>
            </div>
            <div class="gas-recommend-item-tem-high gas-recommend-item-text">
              最高温：{{ v.maxtemp }}℃
            </div>
            <div class="gas-recommend-item-tem=low gas-recommend-item-text">
              最低温：{{ v.mintemp }}℃
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import topMenu from "../../components/topMenu/topMenu";
import weatherTip from "../../components/weatherTip/weatherTip";
import axios from "axios";
import api from "/src/http/api";
import dateFormater from "../../components/dateFormater/dateFormater";

export default {
  name: "v1",
  mixins: [dateFormater],
  data: function () {
    return {
      browerTime:0,
      timer:null,
      recommendGasKey:8,
      spanArr:[],
      getPriceReportData :{},
      
        
      replyTable:[{
        reportTime:'2021-03-12',
        compCodeTxt:'新奥',
        date1:'23',
        date2:'456'
      },{
        reportTime:'2021-03-12',
        compCodeTxt:'新奥',
        date1:'23',
        date2:'456'


      },
      ],
      counterGasOptions:[{
        value: '01',
          label: '增加用气量',
      },{
        value: '02',
          label: '减少用气量',
      },{
        value: '03',
          label: '无',
      }],
 
counterAccidentFactors:[{
  
        value: '01',
          label: '提前供暖',
      },{

        value: '02',
          label: '延长供暖',
      },{
        value: '03',
          label: '疫情',
      },{
        value: '04',
          label: '政策调控',
      },{
        value: '05',
          label: '设备检修',
      },{
        value: '06',
          label: '无',
      }],
      counterYN:[{
        value: '01',
          label: '是',
      },{
        value: '02',
          label: '否',
      }],
     counterWeatherOptions:[
      {
        value: '01',
        label: '晴',
      },{
        value: '02',
          label: '阴',
      },{
        value: '03',
        label: '大雨',
      },{
        value: '04',
        label: '小雪',
      },{
        value: '05',
        label: '阴转晴',
      },{
        value: '06',
        label: '多云',
      }],

      gasDemandCounterTable:[
      //  {
      //     type:'00',
      //     yinsu:'用气合计',//因素
      //     sjGas:'12',//前2日数据
      //     yuce:'',//预测数据
      //     jieguo:'1243',//预测结果
      //     fenxi:''//分析

      // },{
      //     type:'01',
      //     yinsu:'平均温度',
      //     sjGas:'12',
      //     yuce:'1c',
      //     jieguo:'232',
      //     fenxi:'预测结果分析'

      // },{
      //     type:'02',
      //     yinsu:'最高温度',
      //     sjGas:'12',
      //     yuce:'1',
      //     jieguo:'232',
      //     fenxi:'预测结果分析'

      // },{
      //     type:'03',
      //     yinsu:'最低温度',
      //     sjGas:'12',
      //     yuce:'1',
      //     jieguo:'232',
      //     fenxi:'预测结果分析'

      // }, {
      //     type:'04',
      //     yinsu:'气象',
      //     sjGas:'12',
      //     yuce:'03',
      //     jieguo:'232',
      //     fenxi:'预测结果分析'

      // },{
      //    type:'05',
      //     yinsu:'是否节假日',
      //     sjGas:'12',
      //     yuce:'1',
      //     jieguo:'232',
      //     fenxi:'预测结果分析'

      // },{
      //    type:'06',
      //     yinsu:'是否供暖季',
      //     sjGas:'12',
      //     yuce:'1',
      //     jieguo:'232',
      //     fenxi:'预测结果分析',
      //     Number:'121',

      // },{
      //    type:'07',
      //     yinsu:'事 件 因 素',
      //     sjGas:'12',
      //     yuce:'1',
      //     jieguo:'232',
      //     fenxi:'预测结果分析',
      //     Number:'122',

      // },{
      //    type:'08',
      //     yinsu:'市场情况',
      //     sjGas:'12',
      //     yuce:'1',
      //     Number:'123',
      //     jieguo:'232',
      //     fenxi:'预测结果分析'

      // }
      ],
      toggleDay: true,
      toggleDemand: true,
      toggleAbnormal: true,
      traceEcharts: null,
      traceEchartsMonth: null,
      dateDD: null,
      dateDC: null,
      dateDM: null,
      selectDate: false,
      curCom: null,
      recommend: [],
      searchComp: "",
      gasDemandTable: [],
      tableAbnormal: {
        list: [],
        total: 0,
        pageSize: 10,
        current: 1,
        bottomLeft: [],
        bottonRight: []
      },
      tableAbnormalReport: {
        list: [],
        total: 0,
        pageSize: 10,
        current: 1,
        bottom: {}
      },
      tableAbnormalMonth: {
        list: [],
        total: 0,
        pageSize: 10,
        current: 1
      },
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          right: 30,
          bottom: 30,
          data: ["昨日用量", "今日用量", "昨日温度", "今日温度"],
        },
        grid: {
          top: 40,
          left: 100,
          right: 60,
          bottom: 90,
        },
        xAxis: {
          type: "category",
          data: [],
          axisPointer: {
            type: "shadow",
          },
        },
        yAxis: [
          {
            type: "value",
            name: "用气量",
            axisLabel: {
              formatter: "{value} ml",
            },
          },
          {
            type: "value",
            name: "温度",
            axisLabel: {
              formatter: "{value} °C",
            },
          },
        ],
        series: [
          {
            name: "昨日用量",
            type: "bar",
            data: [],
          },
          {
            name: "今日用量",
            type: "bar",
            data: [],
          },
          {
            name: "昨日温度",
            type: "line",
            yAxisIndex: 1,
            data: [],
          },
          {
            name: "今日温度",
            type: "line",
            yAxisIndex: 1,
            data: [],
          },
        ],
      },
      optionA: {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: 40,
          right: 30
        },
        legend: {
          bottom: 0,
          right: 30,
          data: ["预测用气量", "实际用气量", "剩余日均"],
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "预测用气量",
            type: "line",
            data: []
          },
          {
            name: "实际用气量",
            type: "line",
            data: []
          },
          {
            name: "剩余日均",
            type: "line",
            data: []
          },
        ],
      },
      // 获取指定日期真实气量
      getDayActualGasData: "",
      // 日预测确认弹框
      centerDialogVisible: false,
      // 月预测确认弹框
      centerDialogVisibleMonth: false,
      // 确认用气量弹框
      recommendGasVisible:false,
      // 查看历史用气量弹框
      checkHistoryVisible:false,
      // 月实际用气量
      monthlyActualGasvolume: "",
      // 获取本月合同量
      getCurrentMonthContract: "",
      // 预测月量
      predictMouthData: "0",
      predictData: "",
      originPredictData: "",
      changepredictData: 0,
      lineMonthData: {
        hetongliang: 0,
        yueyuceliang: 0,
        wanchenglv1: 0,
        shijiyongqiliang: 0,
        yueyucelianggundong: 0,
        wanchenglv2: 0
      },
      sums: [
          '合计'
      ],
      counsterSums:[
        '用气合计'
      ],
      summationGas:''
    };
  },

  components: {
    topMenu,
    weatherTip,
  },

  created() {
    window.zhuge.track('需求预测-进入气量预测页面',{'页面名称':'气量预测页面'})
    this.dateDD = Date.now() + 24 * 3600000
    this.dateDC = Date.now()
    this.dateDM = this.getFormatMonthNext(Date.now())
    this.getData()
    this.getCounterArr()
    this.selectWeather()
  },

  mounted() {
    this.getBrowerTime()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.zhuge.track('需求预测-进入气量预测页面停留时长',{'气量预测页面停留时长':this.browerTime})
  },
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom;
    },
  },

  watch: {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if (n && o) {
          this.getData();
        }
      },
    },
    gasDemandCounterTable:{
      immediate:true,
      deep:true,
      handler: function (n, o) {
      },
    }
  },
  methods: {
    getBrowerTime() {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    },
    changeArr(){
       for(let i in this.gasDemandCounterTable){ 
            this.$set(this.gasDemandCounterTable[0],'typeShow','01')
             let dateC = this.gasDemandCounterTable[i].before.substring(this.gasDemandCounterTable[i].before.length - 2)  
            if (this.gasDemandCounterTable[i].type === "前一日用气") {
                  this.summationGas = JSON.parse(JSON.stringify(this.gasDemandCounterTable[0])) 
                  this.gasDemandCounterTable.splice(i,1);
                  continue;
                }    
                switch(this.gasDemandCounterTable[i].type){
                // 平均温
                case "平均温度":
                this.gasDemandCounterTable[i].typeShow ='01'
                break;
                 case "最高气温":
                this.gasDemandCounterTable[i].typeShow ='01'
                break;   
                case "最低气温":
                this.gasDemandCounterTable[i].typeShow ='01'
                break; 
                case "气象":
                this.gasDemandCounterTable[i].typeShow ='04'
                this.gasDemandCounterTable[i].current
                break;
                case "是否节假日":
                this.gasDemandCounterTable[i].typeShow ='05'
                this.gasDemandCounterTable[i].current = this.getCode(this.counterYN,this.gasDemandCounterTable[i].current)
                break;

                case "是否供暖季":
                this.gasDemandCounterTable[i].typeShow ='06'
                this.gasDemandCounterTable[i].current = this.getCode(this.counterYN,this.gasDemandCounterTable[i].current)
                break;
                case "事件因素":
                this.gasDemandCounterTable[i].typeShow ='07'
                
                this.gasDemandCounterTable[i].current = this.getCode(this.counterAccidentFactors,this.gasDemandCounterTable[i].current)
                break;
                case "市场情况":
                this.gasDemandCounterTable[i].typeShow ='08'
                this.gasDemandCounterTable[i].current = this.getCode(this.counterGasOptions,this.gasDemandCounterTable[i].current)
                break;
                }
              }
              this.counsterSums[1] = this.summationGas.before
    },
    getCounterArr(){
       api.gasDemand.forecastSelect({
            date:this.getFormatDate(this.dateDD),
            compCode: this.curComCode,
            loginUser:this.$store.getters.loginName
          }).then(res => {
            if (res) {
              this.gasDemandCounterTable = res[0].forecastCalcResultVO1List
              res[0].forecastCalcResultVO1List.forEach(item=>{
                let datebefore = item.before.substring(item.before.length - 2)
                  if(datebefore == '.0'){
                    item.before = item.before.substring(0,item.before.length-2);  
                  }
                  let datecurrent = item.current.substring(item.current.length - 2)
                  if(datecurrent == '.0'){
                    item.current = item.current.substring(0,item.current.length-2);
                  }
              })
              this.changeArr()
            }
          })
      
    },
    // 开始测算
    startCalculate(){
      let arr = {
        "avgtemp": 0,//日均温
        "before_avgtemp": 0,//前2日日均温
        "before_eventFactors": "无",//前2日事件因素
        "before_eventFactorsv": "0",//前2日事件因素值
        "before_heatingSeasonOrNot": "是",//前2日是否供暖季
        "before_holidayOrNot": "是",//前2日是否节假日
        "before_marketConditions": "",//前2日市场情况
        "before_marketConditionsv": "",//前2日市场情况值
        "before_maxtemp": 0,//前2日最高温
        "before_mintemp": 0,//前2日最低温
        "before_phenomena": "",//前2日气象
        "date": this.getFormatDate(this.dateDD),//预测日期
        "eventFactors": "无",//事件因素
        "eventFactorsv": "0",//事件因素值
        "gasConsumption": this.summationGas.before,//前2日的实体用气量
        "heatingSeasonOrNot": "是",//是否供暖季
        "holidayOrNot": "是",//是否节假日
        "loginUser":this.$store.getters.loginName,//登录用户名
        "marketConditions": "",//市场情况
        "marketConditionsv": "",//市场情况值
        "maxtemp": 0,//最高温
        "mintemp": 0,//最低温
        "phenomena": ""//气象
      }
    for(let i in this.gasDemandCounterTable){
        switch (this.gasDemandCounterTable[i].type) {
          // 平均温
          case "平均温度":
           arr.before_avgtemp= this.gasDemandCounterTable[i].before
           arr.avgtemp = this.gasDemandCounterTable[i].current
            break;
          // 最高温
          case "最高气温":
            arr.before_maxtemp =this.gasDemandCounterTable[i].before
            arr.maxtemp = this.gasDemandCounterTable[i].current
            break;
          //最低温
          case "最低气温":
            arr.before_mintemp = this.gasDemandCounterTable[i].before 
            arr.mintemp = this.gasDemandCounterTable[i].current 
            break;
          // 气象
          case "气象":
            arr.before_phenomena = this.gasDemandCounterTable[i].before 
            arr.phenomena = this.gasDemandCounterTable[i].current
            break;
            // 是否节假日
          case "是否节假日":
            arr.before_holidayOrNot = this.gasDemandCounterTable[i].before
            arr.holidayOrNot = this.getLabel(this.counterYN,this.gasDemandCounterTable[i].current)
            break;
            // 是否供暖季
          case "是否供暖季":
            arr.before_heatingSeasonOrNot = this.gasDemandCounterTable[i].before
            arr.heatingSeasonOrNot = this.getLabel(this.counterYN,this.gasDemandCounterTable[i].current) 
            break;
            // 事 件 因 素
          case "事件因素":
            arr.before_eventFactorsv = this.gasDemandCounterTable[i].before 
            arr.eventFactors = this.getLabel(this.counterAccidentFactors,this.gasDemandCounterTable[i].current)
             arr.eventFactorsv = this.gasDemandCounterTable[i].event_value
            break;
            // 市场情况
          case "市场情况":
            arr.before_marketConditions = this.gasDemandCounterTable[i].before
            arr.marketConditions = this.getLabel(this.counterGasOptions,this.gasDemandCounterTable[i].current)
            arr.marketConditionsv = this.gasDemandCounterTable[i].market_value
            break;
        }
      }
       api.gasDemand.forecastCalc(arr).then(res => {
            if (res) {
              this.gasDemandCounterTable = res[0].forecastCalcResultVO1List
              this.changeArr()
            }
          })
    },
    // 打开推荐用气量弹框
    recommendGas(){
       this.checkHistoryVisible = true
    },
    // 打开历史用气量
    checkHistory(){   
      this.recommendGasKey++
      this.recommendGasVisible = true
      this.getArrCounter()
    },
    getArrCounter(){
      let arr ={
        time: this.getFormatDate(Date.now()),
        compCode: this.curComCode
      }
       api.gasDemand.getDayBounced(arr).then(res => {
            if (res) {
             this.getPriceReportData = res[0]
             this.getSpanArr(this.getPriceReportData.dataList);
            }
          })
    },
    getSpanArr(data) {　
      this.spanArr =[]
          for (var i = 0; i < data.length; i++) {
            if (i === 0) {
              this.spanArr.push(1);
              this.pos = 0
            } else {
              // 判断当前元素与上一个元素是否相同
            if (data[i].date === data[i - 1].date) {
                this.spanArr[this.pos] += 1;
                this.spanArr.push(0);
              } else {
                this.spanArr.push(1);
                this.pos = i;
              }
            }
        }
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
          if (columnIndex === 0) {
            const _row = this.spanArr[rowIndex];
            const _col = _row > 0 ? 1 : 0;
            console.log(`rowspan:${_row} colspan:${_col}`)
            return { // [0,0] 表示这一行不显示， [2,1]表示行的合并数
                  rowspan: _row,
                  colspan: _col
            }
          }
        },
    getCaption(obj) {
      let index = obj.indexOf("/");
      obj = obj.substring(index + 1, obj.length);
      return obj;
    },

    getData: function () {
      if (this.toggleDay && this.toggleDemand) {
        console.log('1 day true toggleDemand true 日预测')
        this.getDemandTable(this.dateDD);
        this.getRecommend();
        this.getAbnormal();
        this.getpredictData(this.dateDD);
        this.getDayActualGas();
          this.getCounterArr()
      } else if (this.toggleDay && !this.toggleDemand) {
        console.log('2 day true toggleDemand false 日跟踪')
        this.getDemandTable(this.dateDC);
        this.getpredictData(this.dateDC);
        this.getOriginPredictData(this.dateDC);
        this.getdateDCGenzong()
      } else {
        console.log('3 day false toggleDemend false 单击月')
        this.getMounthGas();
        this.getMounthGasTable();
        this.currentMonthContract();
        this.getLineMonthData()
        this.getAbnormalOfMonth()
      }
    },
    getLineMonthData: function () {
      axios.get('/htapi/api/v1/monthly-data-service/monthly/data/selectMonthForecast/' + this.curComCode + '/' + this.getFormatDate(Date.now())).then(res => {
        if (res.status === 200 && res.data.code === '00000') {
          this.lineMonthData.yueyuceliang = res.data.data.tomonth_forecast
          this.lineMonthData.yueyucelianggundong = res.data.data.tomonth_change_forecast
        }
      });
      axios.get('/htapi/api/v1/data-daily-service/gas/predict/wave/daily/' + this.curComCode + '/' + this.getFormatDate(Date.now())).then(res => {
        if (res.status === 200) {
          this.optionA.xAxis.data = [];
          this.optionA.series[0].data = [];
          this.optionA.series[1].data = [];
          this.optionA.series[2].data = [];
          for (let v of res.data) {
            this.optionA.xAxis.data.push(this.getFormatDate(v.day, '/'))
            this.optionA.series[0].data.push(v.predictedValue)
          }
          api.gasDemand.getLineData({
            date: this.getFormatDate(Date.now()),
            compCode: this.curComCode
          }).then(res => {
            if (res) {
              this.lineMonthData.hetongliang = res[0].currentMonthContractGas
              this.lineMonthData.shijiyongqiliang = res[0].currentMonthGas
              for (let v of res[0].daySurplusVOList) {
                if (v.currentGas > 0) {
                  this.optionA.series[1].data.push(v.currentGas)
                  this.optionA.series[2].data.push(null)
                } else {
                  this.optionA.series[1].data.push(null)
                  this.optionA.series[2].data.push(v.surplus)
                }
              }
              this.traceEchartsMonth.setOption(this.optionA, true)
            }
          })
        }
      })
    },
    recommendMove: function (left) {
      let last = this.$refs["recomendWrapper"].scrollLeft;
      if (last === 0 && left < 0) {
        return;
      }
      this.$refs["recomendWrapper"].scrollTo({
        left: this.$refs["recomendWrapper"].scrollLeft + left,
        behavior: "smooth",
      });
    },
    getLabel(dist,code){
      let value = code
      if(code instanceof Array){
        value = code[0]
      }else{
        value = code

      }
      for(let i in dist){
        if(value == dist[i].value){
          return dist[i].label
        }
      }

    },
    // 转code
    getCode(dist,code){
      let value = code
      if(code instanceof Array){
        value = code[0]
      }else{
        value = code

      }
      for(let i in dist){
        if(value == dist[i].label){
          return dist[i].value
        }
        console.log(i)
      }

    },
    tableCounter(val){
      console.log(val)

    },
    // 获取天气
    selectWeather(){
       api.gasDemand.selectWeather().then((res) => {
         this.getGasArr = res[0]
        // if (res.length > 0) {
            
        // }
      });
    },
    getdateDCGenzong: function () {
      let params = {
        compCode: this.curComCode,
        date: this.getFormatDate(this.dateDC),
      };
      api.gasDemand.getEchartsTodayChange(params).then((res) => {
        if (res.length > 0) {
          this.option.xAxis.data = [];
          this.option.series[0].data = [];
          this.option.series[1].data = [];
          this.option.series[2].data = [];
          this.option.series[3].data = [];
          for (let v of res[0]) {
            this.option.xAxis.data.push(v.hour + ":00");
            this.option.series[0].data.push(v.yesterdayHourGas || 0);
            this.option.series[1].data.push(v.todayHourGas || 0);
            this.option.series[2].data.push(v.yesterdayTemp || 0);
            this.option.series[3].data.push(v.todayTemp || 0);
          }
          this.traceEcharts.setOption(this.option, true);
        }
      });
    },
    toggleDayHandler: function (isDay) {
      this.toggleDay = isDay;
      if (!isDay) {
        this.$nextTick(() => {
          this.traceEchartsMonth = this.$echarts.init(document.getElementById('monthtrace'));
        })
      }
      this.getData();
    },
    toggleDemandHandler: function (isDemand) {
      this.toggleDemand = isDemand;
      if (!isDemand) {
        this.$nextTick(() => {
          this.traceEcharts = this.$echarts.init(
              document.getElementById("trace")
          );
        });
      }
      this.getData();
    },
    toggleAbnormalHandle: function (isAbnormal) {
      this.toggleAbnormal = isAbnormal
      this.getAbnormal()
    },

    dateFormat(dateData) {
      var date = new Date(dateData);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      return y + "-" + m;
    },
    getNextDate(date, day) {
      var dd = new Date(date);
      dd.setDate(dd.getDate() + day);
      var y = dd.getFullYear();
      var m =
          dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
      var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
      return y + "-" + m + "-" + d;
    },
    // 提交预测量
    submitPredictGas() {
      let data = {
        compCode: this.curComCode,
        calDay: this.getFormatDate(this.dateDD),
        todayForecast: this.predictData,
      };
      axios.post(
          "/htapi/api/v1/data-daily-service/gas/predict/input/daily",
          data
      )
          .then((res) => {
            if (res.status === 200) {
              this.$message({
                type: "success",
                message: "提交成功",
              });
              this.centerDialogVisible = false;
            }
          });
    },
    // 查询公司某天的真实用气量
    getDayActualGas() {
      let params = {
        compCode: this.curComCode,
        date: this.getNextDate(this.getFormatDate(this.dateDD), -2),
      };
      api.gasDemand.getDayActualGas(params).then((res) => {
        this.getDayActualGasData = res[0];
      });
    },
    // 查询某天预测用气量
    getpredictData(date) {
      axios.get("/htapi/api/v1/data-daily-service/gas/plan/input/imp/daily/" + this.curComCode + "/" + this.getFormatDate(date))
          .then((res) => {
            if (res.status === 200) {
              this.predictData = res.data;
            }
          });
    },
    // 跟踪 原预测用气量
    getOriginPredictData(date) {
      console.log(date)
      axios.get(`/htapi/api/v1/data-daily-service/gas/plan/input/imp/daily/backwards/${this.curComCode}/${this.getFormatDate(date)}`)
          .then((res) => {
            if (res.status === 200) {
              this.changepredictData = res.data;
            }
          });
    },
    // 获取日列表
    getDemandTable: function (date = this.dateDD) {
      axios.get("/htapi/api/v1/data-daily-service/gas/predict/total/daily/" + this.curComCode + "/" + this.getFormatDate(date)
      )
          .then((res) => {
            if (res.status === 200) {
              this.gasDemandTable = [];
              for (let k in res.data) {
                if (res.data[k].customerType === "总气量") {
                  this.sums[1] = res.data[k].plans['总气量预测']
                  continue;
                }
                this.gasDemandTable.push({
                  type: res.data[k].customerType,
                  rA: res.data[k].forecastResult,
                  rB: res.data[k].plans["分类预测1"],
                  rC: res.data[k].plans["分类预测2"],
                  report: res.data[k].reportedValue,
                });
              }
            }
          });
    },
    // 预测变更气量
    changeConfirm() {
      let data = {
        compCode: this.curComCode,
        calDay: this.getFormatDate(this.dateDC),
        todayForecast: this.changepredictData,
      };
      axios.post("/htapi/api/v1/data-daily-service/gas/predict/update/daily", data).then((res) => {
        if (res.status === 200) {
          this.$message({
            type: "success",
            message: "提交成功",
          });
          this.getOriginPredictData(this.dateDC)
        }
      });
    },

    // 获取月实际用气量
    getMounthGas() {
      axios
          .get(
              "/htapi/api/v1/monthly-data-service/monthly/data/selectMonthGas/" +
              this.curComCode +
              "/" +
              this.getFormatMonthPre(this.getFormatMonthPre(this.dateDM)) + '-01'
          )
          .then((res) => {
            if (res.status === 200) {
              // 月实际用气量
              this.monthlyActualGasvolume =
                  res.data.data.monthly_actual_gas_volume;
            }
          });
    },
    // 获取月列表
    getMounthGasTable() {
      axios
          .get(
              "/htapi/api/v1/monthly-data-service/monthly/data/selectClassificationModel/" +
              this.curComCode +
              "/" +
              this.getFormatDate(this.dateDM)
          )
          .then((res) => {
            if (res.status === 200) {
              // 月实际用气量
              this.gasDemandTable = [];
              for (let k in res.data.data) {
                if (res.data.data[k].type_name === "总气量") {
                  this.sums[1] = res.data.data[k].A
                  continue;
                }
                this.gasDemandTable.push({
                  type: res.data.data[k].type_name,
                  rA: res.data.data[k].A,
                  rB: res.data.data[k].B,
                  rC: res.data.data[k].C,
                  report: res.data.data[k].monthly_reported_gas_volume,
                });
              }
            }
          });
    },
    // 查询本月合同量
    currentMonthContract() {
      let params = {
        compCode: this.curComCode,
        date: this.getFormatMonthPre(this.dateDM)
      };
      api.gasDemand.currentMonthContract(params).then((res) => {
        this.getCurrentMonthContract = res[0];
      });
    },
    // 确认月预测
    predictMouthconfirm() {
      axios.get(
          "/htapi/api/v1/monthly-data-service/monthly/data/updateMonthForecast/" +
          this.curComCode +
          "/" +
          this.getFormatDate(this.dateDM) +
          "/" +
          this.predictMouthData
      )
          .then((res) => {
            if (res.status === 200) {
              if (res.data.code == "00000") {
                this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000,
                });
              } else {
                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1000,
                });
              }
            }
          });
    },

    dateDDChange: function (date) {
      this.dateDD = new Date(date).getTime();
      this.dateDC = new Date(date).getTime() - 24* 3600000
      this.getData();
    },
    dateDCChange: function (date) {
      this.dateDC = new Date(date).getTime();
      this.dateDD = new Date(date).getTime() + 24 * 3600000
      this.getData();
    },
    dateDMChange: function (date) {
      this.dateDM = date;
      this.getData();
    },
    getRecommend: function () {
      let params = {
        compCode: this.curComCode,
        date: this.getFormatDate(this.dateDD),
      };
      api.gasDemand.getRecommend(params).then((res) => {
        if (res[0].length > 0) {
          this.recommend = res[0];
        }
      });
    },
    getAbnormal: function () {
      if (this.toggleAbnormal) {
        this.getAbnormalOfDay()
      } else {
        this.getAbnormalOfReport()
      }
    },
    getAbnormalOfDay: function (sort = '', type = '') {
      let params = {
        compCode: this.curComCode,
        endDate: this.getFormatDate(this.dateDD - 48 * 3600000),
        startDate: this.getFormatDate(this.dateDD - 48 * 3600000),
        mcName: this.searchComp,
        pageSize: this.tableAbnormal.pageSize,
        currentPage: this.tableAbnormal.current,
        sort: sort,
        type: type
      };
      api.gasDemand.getAbnormalOfDay(params).then(res => {
        if (res) {
          this.tableAbnormal.list = res[0].list
          this.tableAbnormal.total = res[0].total
          this.tableAbnormal.current = res[0].pageNum
        }
      })
      api.gasDemand.getAbnormalOfDayState({
        compCode: this.curComCode,
        endDate: this.getFormatDate(this.dateDD - 48 * 3600000),
        startDate: this.getFormatDate(this.dateDD - 48 * 3600000),
        mcName: this.searchComp
      }).then(res => {
        if (res) {
          this.tableAbnormal.bottomLeft = res[0].allExceptionList
          this.tableAbnormal.bottonRight = res[0].undulateList
        }
      })
    },
    getAbnormalOfReport: function () {
      let params = {
        compCode: this.curComCode,
        endDate: this.getFormatDate(this.dateDD - 48 * 3600000),
        startDate: this.getFormatDate(this.dateDD - 48 * 3600000),
        mcName: this.searchComp,
        pageSize: this.tableAbnormalReport.pageSize,
        currentPage: this.tableAbnormalReport.current,
      };
      api.gasDemand.getAbnormalOfReport(params).then(res => {
        if (res) {
          this.tableAbnormalReport.list = res[0].list
          this.tableAbnormalReport.total = res[0].total
          this.tableAbnormalReport.current = res[0].pageNum
        }
      })
      api.gasDemand.getAbnormalOfDayReportState({
        compCode: this.curComCode,
        endDate: this.getFormatDate(this.dateDD - 48 * 3600000),
        startDate: this.getFormatDate(this.dateDD - 48 * 3600000),
        mcName: this.searchComp
      }).then(res => {
        if (res) {
          this.tableAbnormalReport.bottom = res[0]
        }
      })
    },
    getAbnormalOfMonth: function (sort = '', type = '') {
      let params = {
        comp_code: this.curComCode,
        endTime: this.getFormatMonthPre(this.getFormatMonthPre(this.dateDM)),
        startTime: this.getFormatMonthPre(this.getFormatMonthPre(this.dateDM)),
        comp_name: this.searchComp,
        pageSize: this.tableAbnormalMonth.pageSize,
        currentPage: this.tableAbnormalMonth.current,
        sort: sort,
        type: type
      };
      api.gasDemand.getAbnormalOfMonth(params).then(res => {
        if (res) {
          this.tableAbnormalMonth.list = res[0].list
          this.tableAbnormalMonth.total = res[0].total
          this.tableAbnormalMonth.current = res[0].pageNum
        }
      })
    },
    tableAbnormalPageChange: function (page) {
      this.tableAbnormal.current = page
      this.getAbnormal()
    },
    tableAbnormalPageReportChange: function (page) {
      this.tableAbnormalReport.current = page
      this.getAbnormal()
    },
    tableAbnormalPageMonthChange: function (page) {
      this.tableAbnormalMonth.current = page
      this.getAbnormalOfMonth()
    },
    searchCompChange: function () {
      this.getAbnormal()
    },
    tableAbnormalPut: function (row) {
      let data = {
        id: row.id,
        reason: row.reasonAbnormal
      }
      api.gasDemand.putAbnormalOfDay(data).then(res => {
        if (res) {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 1000
          });
          this.getAbnormal()
        }
      })
    },
    tableAbnormalReportPut: function (row) {
      let data = {
        id: row.id,
        reason: row.reasonAbnormal
      }
      api.gasDemand.putAbnormalOfDayReport(data).then(res => {
        if (res) {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 1000
          });
          this.getAbnormal()
        }
      })
    },
    tableAbnormalMonthPut: function (row) {
      api.gasDemand.putAbnormalOfMonth(row).then(res => {
        if (res) {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 1000
          });
          this.getAbnormalOfMonth()
        }
      })
    },
    getSummaries: function (param) {
      let indexBegin = 2;
      const { columns, data } = param;
      columns.forEach((column, index) => {
        if (index < indexBegin) {
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        this.sums[index] = values.reduce((prev, curr) => {
          return (parseFloat(prev) + parseFloat(curr)).toFixed(2);
        }, 0);
      });
      return this.sums;
    },
    getSummariesCounter(param){
      this.counsterSums[1]=this.summationGas.before
      this.counsterSums[3]=this.summationGas.result
      return this.counsterSums;

    },
    tableAbnormalSortChange: function ({ prop, order }) {
      switch (order) {
        case 'ascending':
          this.getAbnormalOfDay(prop, 'asc');
          break;
        case 'descending':
          this.getAbnormalOfDay(prop, 'desc');
          break;
        default:
          break;
      }
    },
    tableAbnormalMonthSortChange: function ({ prop, order }) {
      switch (order) {
        case 'ascending':
          this.getAbnormalOfMonth(prop, 'asc');
          break;
        case 'descending':
          this.getAbnormalOfMonth(prop, 'desc');
          break;
        default:
          break;
      }
    }
  }
}
</script>
<style>
.predict-gas-dialog .custom-table-header{
  background: #eff2f6;
  border-radius: 20px!important;
}
.predict-gas-dialog .custom-table-header th{
  border-radius: 20px!important;
}
.gas-el-date-abnormal > input {
  color: #495464 !important;
}

.card-content-bottom .el-input__inner {
  border: none;
  text-align: center;
  width: 77%;
  color: #0fb2ab;
  border-bottom: 1px solid #999999;
  padding: 30px;
}

.predict-gas-dialog .el-dialog__header .el-dialog__title {
  color: #3a3952;
  font-weight: 700;
  font-size: 24px;
  text-align: left;
}
.el-icon-bottom{
  color: red;
}
.el-icon-top{
  color: #0FB2AB;
}

.predict-gas-dialog .el-button {
  margin-right: 148px;
}

.predict-gas-dialog .el-button--primary {
  background: #0FB2AB;
  border-color: #0FB2AB;
  margin-right: 0;
}

.predict-gas-dialog .el-dialog__header {
  text-align: left;
}
.history-gas-dialog .el-dialog__header{
  text-align: left;
   font-size: 24px;
   color: #3a3952;
  font-weight: 700;
}
.history-gas-dialog .el-dialog__header .el-dialog__title {
  color: #3a3952;
  font-weight: 700;
  font-size: 24px;
  text-align: left;
}
.gas-demand-counter .counter-unit{
  display: flex;

}
.gas-demand-counter .counter-yuce .degrees .el-input__inner{
  text-align: center;
}
.counter-unit .week-holity{
  text-align: left;
  margin-left: 8px;
  

}
.week-holity .holity{
  color: #E25409;
}
.week-holity .week{
  line-height: 40px;
}
.gas-demand-counter{
  /* height: 500px; */
}
.gas-demand-counter .counter-unit .el-input{
  /* height: 70%; */
  width: 142px;
  line-height: 40px;
}
.gas-demand-counter .counter-unit .second-insert{
   height: 70%;
   /* width: 330px; */
}
.counter-unit .unit-c{
  width: 61px;
    line-height: 40px;
}
.el-cascader{
 line-height: 20px;
}

.gas-demand-counter .counster-bottom{
   text-align: right;
   margin-top: 50px;
   color: #0FB2AB;
   display: flex;
    justify-content: space-between;
   
}

.gas-demand-counter .degrees{
    position: relative; 
}
.gas-demand-counter .degrees-mark{
     position: absolute;
     top: 15px;
     left: 85px;
}
.gas-demand-counter .degrees-mark-x{
     position: absolute;
     top: 15px;
     left: 76px;
}
.counster-bottom .check-more{
   margin-top: 100px;
    color: #0FB2AB;
    margin-right: 66px;
    /* display: flex;
    justify-content: space-between; */
}
.counster-bottom .calculate-start{
    background: #0fb2ab;
    border-radius: 23px;
    padding: 13px 35px;
    color: #ffffff;
    margin-left: 10px;

}
.counster-bottom .check-gas{
  margin-top: 10px;
}
.predict-gas-dialog .custom-table-header th{
     /* padding-right: 12px; */
} 
.counter-weather  .el-select {
  -webkit-appearance: none;
}
.counter-weather  .el-select .el-input{
  -webkit-appearance: none;
}
.counter-weather  .el-select .el-input__inner{
  padding-left: 27px;
  background: #ffffff;
  color:#606266;
  height:40px
  
}
.counter-weather .el-select .el-input__suffix{
  border-left:none

}

</style>
<style scoped>
.el-dialog__headerbtn .el-icon-close:before{
font-size: 24px;
}
.gas-demand-counter{
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin: 30px;
  margin-top: 68px;
  position: relative;
}
.gas-demand-counter .counster-img{
    position: absolute;
    top: -7%;
    left: 50%;
    margin: 0 auto;
    text-align: center;
    transform: translate(-50%,0);
}
.counter-weather{
  position:relative;
}

.before-weather{
    width: 20px;
    height: 20px;
    vertical-align: middle;
}
.counter-weather img{
    position: absolute;
    top: 12px;
    left: 6px;
    width: 20px;
    height: 21px;
}
.dialog-content {
  text-align: center;
  padding: 20px;
  margin-top: 20px;
  
}

.dialog-content .gas-date {
  color: #0fb2ab;
  margin-right: 10px;
  margin-left: 5px;
}

.dialog-content .gas-number {
  color: #0fb2ab;
  font-size: 41px;
}

.dialog-content .gas-unit {
}
.recommend-gas-number .dialog-content {
      margin-top: 0;
      padding: 0;
      margin: 50px;
      padding-bottom: 50px;
}
.dialog-content .dialog-gas-number {
  margin-top: 20px;
}
.history-gas-dialog .dialog-content{
   padding: 0;
   margin-top: 0;
}
.history-gas-dialog .el-dialog__header{
  text-align: left;
}

.day-month-tog-wrapper {
  height: 40px;
  margin-top: 38px;
  padding-left: 32px;
}

.day-month-datepicker-wrapper {
  display: inline-block;
  width: 173px;
  height: 40px;
  background: #567db9;
  opacity: 0.7;
  border-radius: 20px;
  margin-left: 30px;
  overflow: hidden;
  vertical-align: middle;
}

.date-picker {
  width: 190px;
}

.gas-demand-wrapper {
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
.gas-needs-demand-wrapper {
  height: 478px;
}

.gas-demand-recommend-wrapper {
  height: 410px;
  margin-top:-5px;
}

.gas-demand-abnormal-wrapper {
  padding-bottom: 30px;
}

.gas-demand-trace-wrapper {
  height: 545px;
}

.gas-wrapper-title {
  height: 33px;
  font-size: 24px;
  font-weight: 500;
  line-height: 33px;
  color: #2c3e50;
  opacity: 1;
  margin-top: 24px;
  margin-left: 30px;
}

.gas-wrapper-title span {
  font-size: 14px;
  color: #74788d;
  margin-left: 14px;
}

.gas-tab-card-header {
  width: 235px;
  height: 39px;
  line-height: 39px;
  position: absolute;
  top: 73px;
  left: 30px;
  font-size: 15px;
  background: #eff2f6;
  border-radius: 12px 11px 0 0;
  z-index: 3;
}

.tab-card-header {
  width: 116px;
  height: 100%;
  float: left;
  color: #74788d;
  text-align: center;
  cursor: pointer;
}

.tab-card-header-active {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-bottom: none;
  opacity: 1;
  border-radius: 12px 12px 0px 0px;
}

.gas-tab-card-wrapper {
  width: 310px;
  height: 335px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  box-shadow: 0px 2px 8px rgba(38, 51, 88, 0.12);
  opacity: 1;
  border-radius: 0px 12px 12px 12px;
  position: absolute;
  top: 111px;
  left: 30px;
}

.gas-tab-card-wrapper .gas-tab-card-content {
  text-align: center;
  padding: 20px;
}

.gas-tab-card-wrapper .actual-gas {
  color: #2c3e50;
  font-size: 28px;
}

.gas-unit {
  font-size: 16px;
  margin-left: 10px;
}

.gas-tab-card-content .card-content-top {
  margin-top: 30px;
  margin-bottom: 60px;
}

.card-content-top .trail .gas-num {
  color: #0fb2ab;
  font-size: 41px;
}

.card-content-bottom .confirm-btn {
  margin-top: 10px;
  color: #0fb2ab;
  background: #0fb2ab;
  color: #eff2f6;
  border-radius: 20px;
}

.card-content-bottom .actual-gas {
  color: #0fb2ab;
  font-size: 41px;
}

.actual-gas .gas-unit {
  font-size: 18px;
  color: #74788D;
  opacity: 0.9;
}

.insert-gas {
  position: relative;
  width: 94%;

}

.insert-gas .insert-gas-unit {
  position: absolute;
  right: 3px;
  top: 24px;
  font-size: 18px;
  color: #74788D;
  opacity: 0.9;
}

.gas-needs-table-wrapper {
  height: 361px;
  width: calc(100% - 466px);
  position: absolute;
  right: 30px;
  top: 85px;
}

.gas-recommend-tip-wrapper {
  width: 42px;
  height: 160px;
  padding: 5px;
  border-radius: 8px;
  box-shadow: 0 0 10px 3px rgba(200, 200, 200, 0.3);
  position: absolute;
  top: 135px;
  cursor: pointer;
  z-index: 22;
  background: #ffffff;
}

.gas-tip-left {
  left: 9px;
  display: flex;
}

.gas-recommend-tip-wrapper i {
  margin: auto;
  transform: scale(2);
  color: #0fb2ab;
}

.gas-tip-right {
  right: 9px;
  display: flex;
}

.gas-recommend-item-wrapper {
  width: calc(100% - 120px);
  height: 300px;
  position: absolute;
  top: 30px;
  left: 52px;
  overflow: hidden;
  /*transition: ;*/
}

.gas-recommend-item-wrapper > div {
  height: 320px;
  width: 100%;
  position: absolute;
  top: 0;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: auto;
}

.gas-recommend-item {
  width: 227px;
  height: 300px;
  display: inline-block;
  position: relative;
}

.gas-recommend-item:first-child::before {
  width: 0;
}

.gas-recommend-item::before {
  content: "";
  display: block;
  height: 200px;
  position: absolute;
  width: 1px;
  background: #e2e2e2;
  top: 49px;
}

.gas-recommend-item-date {
  height: 28px;
  font-size: 20px;
  line-height: 28px;
  color: #2c3e50;
  text-align: center;
  margin-top: 23px;
  font-weight: 600;
}

.gas-recommend-item-text {
  height: 28px;
  font-size: 16px;
  line-height: 28px;
  color: #2c3e50;
  text-align: center;
  margin-top: 5px;
}

.gas-recommend-img {
  width: 60px;
  height: 60px;
  margin-top: 12px;
  margin-left: 85px;
}

.gas-abnormal-tool-wrapper {
  position: absolute;
  top: 87px;
  left: 30px;
  width: calc(100% - 30px);
  height: 46px;
}

.gas-abnormal-tool-wrapper button {
  border: 1px solid #0fb2ab;
  color: #0fb2ab;
  height: 100%;
  border-radius: 30px;
}

.gas-abnormal-tool-wrapper button:hover {
  border: 1px solid #0fb2ab;
  background: #0fb2ab;
  color: #ffffff;
}

.gas-tool-search-wrapper {
  width: 210px;
  height: 42px;
  background: #f6f7fa;
  opacity: 1;
  border-radius: 100px;
  margin-right: 20px;
  float: right;
}

.gas-tool-date-picker-wrapper {
  width: 190px;
  height: 42px;
  float: right;
  background: #f6f7fa;
  border-radius: 100px;
  margin-right: 30px;
}

.gas-abnormal-table-wrapper {
  width: calc(100% - 60px);
  margin-left: 30px;
  margin-top: 30px;
}

.gas-abnormal-page-wrapper {
  height: 32px;
  margin-left: 30px;
  margin-top: 30px;
}

.gas-abnormal-bom {
  width: 45%;
  margin-top: 1px;
  margin-left: 30px;
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  color: #2c3e50;
  display: inline-block;
}

.gas-abnormal-bom::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-top: 10px;
  border-radius: 50%;
  opacity: 1;
  vertical-align: top;
}

.gas-abnormal-bom-l::before {
  background: #ff523c;
}

.gas-abnormal-bom-r::before {
  background: #ff8948;
}

.gas-demand-trace-echarts {
  width: calc(100% - 60px);
  height: calc(100% - 100px);
  position: absolute;
  left: 30px;
  bottom: 20px;
}

.gas-tab-card-month {
  width: 310px;
  height: 376px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  box-shadow: 0px 2px 8px rgba(38, 51, 88, 0.12);
  border-radius: 12px;
  position: absolute;
  top: 73px;
  left: 30px;
}

.month-card-content {
  margin: 20px 2px;
  text-align: center;
}

.month-card-content .card-content-bottom {
  margin-top: 20px;
}

.month-card-content .month-card-content-item {
  display: flex;
  padding: 20px;
  justify-content: space-between;
}

.month-card-content-item .item-gas {
  margin-left: 10px;
  line-height: 38px;
  width: 190px;
}

.month-card-content-item .item-data {
  color: #74788d;
}

.month-card-content-item .item-gas .gas-num {
  font-size: 28px;
  margin: 1px 10px;
  display: inline-block;
  width: 114px;
  vertical-align: top;
}

.month-card-content-item .item-gas .gas-unit {
  color: #74788d;
  display: inline-block;
  vertical-align: top;
}

.gas-demand-month-trace-wrapper {
  height: 510px;
}

.gas-demand-month-plan {
  position: absolute;
  top: 79px;
  left: 60px;
  height: 25px;
  font-size: 18px;
  font-weight: 500;
  line-height: 25px;
  color: #2c3e50;
  opacity: 1;
}

.gas-demand-month-plan-btn {
  width: 81px;
  height: 24px;
  background: #ffffff;
  border: 1px solid #0fb2ab;
  opacity: 1;
  border-radius: 100px;
  margin-left: 12px;
  color: #0fb2ab;
  line-height: 24px;
  vertical-align: top;
  padding: 0px;
}

.gas-demand-month-item {
  height: 58px;
  width: 266px;
  position: absolute;
  left: 60px;
  background-repeat: no-repeat;
  background-size: 58px 58px;
  background-position: top left;
}

.gas-demand-month-item > div {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #74788d;
  opacity: 1;
  margin-left: 78px;
}

.gas-demand-month-item > div > div {
  height: 40px;
  font-size: 28px;
  font-weight: 600;
  line-height: 40px;
  color: #2c3e50;
  opacity: 1;
}

.gas-demand-month-ht {
  top: 149px;
  background-image: url("assets/hetonggliang.png");
}

.gas-demand-month-yycl {
  top: 256px;
  background-image: url("assets/yueyuceliang.png");
}

.gas-demand-month-yjwcl {
  top: 362px;
  background-image: url("assets/yujiwanchenglv.png");
}

.gas-demand-month-echarts {
  width: calc(100% - 380px);
  height: calc(100% - 181px);
  position: absolute;
  bottom: 30px;
  left: 360px;
  right: 30px;
}

.btn-toggle-abnormal-active {
  border: 1px solid #0fb2ab;
  background: #0fb2ab;
  color: #ffffff !important;
}

.month-float-wrapper {
  width: 550px;
  height: 108px;
  background: #FFFFFF;
  box-shadow: 0px 4px 12px rgba(38, 51, 88, 0.16);
  opacity: 0.85;
  border-radius: 12px;
  position: absolute;
  top: 40px;
  left: 360px;
}

.month-float-date {
  width: 164px;
  height: 28px;
  background: #FFFFFF;
  border: 1px solid #0FB2AB;
  opacity: 1;
  border-radius: 100px;
  position: absolute;
  left: 20px;
  top: -14px;
  color: #0FB2AB;
  line-height: 28px;
  text-align: center;
}

.month-float-item-wrapper {
  display: inline-block;
  float: left;
  margin-top: 30px;
  margin-left: 25px;
}

.month-float-item-wrapper .title {
  width: 154px;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  line-height: 30px;
  color: #74788D;
  opacity: 1;
}

.month-float-item-wrapper .text {
  width: 62px;
  height: 28px;
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  color: #0FB2AB;
  opacity: 1;
  margin-top: 6px;
}
.gas-reply-btn-wrapper {
  display: inline-block;
  float: right;
  white-space: nowrap;
  margin-right: 30px;
}
.dd-tooltip {
  position: absolute;
  top: 1px;
  left: calc(100% + 22px);
}
</style>