<template>
  <div class="gas-page-bg">
    <el-container>
      <el-main>
        <el-row style="height: 720px">
          <el-col :span="24" style="position: relative">
            <el-card class="box-card" style="height: 540px; border-radius: 0">
              <el-col :span="24" style="padding-bottom: 0">
                <div class="panel_header" style="margin-bottom: 0">
                  <div class="pcfcTitle" style="font-size: 28px; color: #fff">
                    预测偏差分析
                  </div>
                  <div style="width: 500px;" class="custom-select">
                    <top-menu :date-picker-show="false"></top-menu>
                  </div>
                </div>
              </el-col>
              <div class="panel_title">
                <div>
                  <div style="display: flex; margin-right: 10px" id="timeDiv">
                    <el-button
                        style="margin-right: 15px"
                        :class="bttActive == 1 ? 'active' : ''"
                        circle
                        @click="btnSwitchCss(1)"
                    >日</el-button
                    >
                    <!-- <el-button
                      style="margin-right: 15px"
                      :class="bttActive == 2 ? 'active' : ''"
                      circle
                      @click="btnSwitchCss(2)"
                      >周</el-button
                    > -->
                    <el-date-picker
                        style="margin-right: 15px; width: 278px; height: 40px"
                        v-model="date"
                        unlink-panels
                        :type="typeDate"
                        :format="formatDate"
                        :clearable="false"
                        prefix-icon="fa fa-bars"
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    ></el-date-picker>
                  </div>
                </div>
                <!-- 全部预测方案 -->
                <div style="justify-content: flex-end;">
                  <el-select v-model="topSel" class="topSel">
                    <el-option
                        v-for="item in ModelTopList.data"
                        :value="item.plan_model_id"
                        :key="item.plan_model_id"
                        :label="item.plan_name"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="panel_content" style="height: 300px">
                <!-- 顶部柱形图 -->
                <div style="height: 100%" ref="hisMain"></div>
              </div>
            </el-card>
            <div class="boxBorder">
              <!-- <div style="width: 100%; display: flex; justify-content: center">
                <div
                  class="boxBorderDiv"
                  style="background: transparent; border: 0px"
                ></div>
                <div class="boxBorderDiv" v-for="item in tableHead">
                  {{ item }}
                </div>
              </div> -->

              <!-- <div class="boxBorderDiv">一般工商业</div>
              <div class="boxBorderDiv">居民</div>
              <div class="boxBorderDiv">车用</div>
              <div class="boxBorderDiv">总气量</div> -->
              <!-- {{ tableHtmls }} -->
              <div style="width: 20%">
                <div
                    v-if='hisData.length > 0'
                    class="boxBorderDiv"
                    style="
                  width: 100%;
                  border-radius: 12px 0px 0px 0px;
                  background: #f2f4f8;
                  height: 60px;
                "
                >
                  <div class="BorderDivLeft"></div>
                  <div class="BorderDivRight"></div>
                </div>
                <div
                    class="boxBorderDiv"
                    v-for="(item, index) in fangan"
                    style="width: 100%"
                    :class="index == 2 ? 'borderbtmleft' : ''"
                >
                  <div
                      class="BorderDivLeft"
                      :style="index == 1 ? 'background: #f2f4f8' : ''"
                  >
                    {{ item }}
                  </div>
                  <div
                      class="BorderDivRight"
                      :style="index == 1 ? 'background: #f2f4f8' : ''"
                  >
                    累计平均偏差率(%)
                  </div>
                </div>
              </div>
              <!-- 数据 -->
              <div style="width: 13%" v-for="(item, index) in tableHead">
                <div
                    class="boxBorderDiv"
                    :class="index == tableHead.length-1 ? 'rigthTableRadius' : ''"
                    style="background: #f2f4f8; height: 60px"
                >
                  {{ item.mc }}
                </div>
                <div class="boxBorderDiv">
                  {{
                    item.plans["总气量预测"] == undefined
                        ? "-"
                        : item.plans["总气量预测"]
                  }}
                </div>
                <div class="boxBorderDiv" style="background: #f2f4f8">
                  {{
                    item.plans["分类预测1"] == undefined
                        ? "-"
                        : item.plans["分类预测1"]
                  }}
                </div>
                <div
                    class="boxBorderDiv"
                    :style="index == tableHead.length-1 ? 'border-radius: 0px 0px 12px 0px' : ''"
                >
                  {{
                    item.plans["分类预测2"] == undefined
                        ? "-"
                        : item.plans["分类预测2"]
                  }}
                </div>
              </div>

              <!-- <div
                v-for="item in plans"
                style="width: 100%; display: flex; margin-top: 3px"
              >
                <div class="boxBorderDiv">
                  <div class="BorderDivLeft">{{ item.name }}</div>
                  <div class="BorderDivRight">累计平均偏差率</div>
                </div>
                <div class="boxBorderDiv" v-for="items in item.children">
                  {{ items }}
                </div>
              </div> -->
              <!-- <div class="boxBorderDiv borderDivBG">2.0%</div>
              <div class="boxBorderDiv borderDivBG">2.0%</div> -->

              <!-- <div class="boxBorderDiv">
                <div class="BorderDivLeft">分类预测1</div>
                <div class="BorderDivRight">累计平均偏差率</div>
              </div>
              <div class="boxBorderDiv">2.0%</div>
              <div class="boxBorderDiv">2.0%</div>
              <div class="boxBorderDiv">2.0%</div>
              <div class="boxBorderDiv">2.0%</div>
              <div class="boxBorderDiv">2.0%</div>

              <div class="boxBorderDiv borderDivBG">
                <div class="BorderDivLeft">分类预测2</div>
                <div class="BorderDivRight">累计平均偏差率</div>
              </div>
              <div class="boxBorderDiv borderDivBG">2.0%</div>
              <div class="boxBorderDiv borderDivBG">2.0%</div>
              <div class="boxBorderDiv borderDivBG">2.0%</div>
              <div class="boxBorderDiv borderDivBG">2.0%</div>
              <div class="boxBorderDiv borderDivBG">2.0%</div> -->
            </div>
          </el-col>
        </el-row>
        <el-row style="height: 416px">
          <el-col
              :span="12"
              style="height: 100%; padding-right: 0; position: relative"
          >
            <el-card
                class="box-card btmCard"
                style="border-radius: 12px 0px 0px 12px !important"
            >
              <div class="panel_header">
                <div class="panel_headerColor">偏差结构分析</div>
                <div></div>
              </div>
              <div style="position: absolute; top: 78px">单位：万方</div>
              <div style="height: 350px" ref="PieChart" id="PieChart"></div>
              <div
                  style="
                height: 350px;
                display: flex;
                justify-content: center;
                align-items: center;
              "
                  ref="noPieData"
                  id="noPieData"
              >
                暂无数据
              </div>
            </el-card>
            <div
                style="
              height: 286px;
              width: 1px;
              position: absolute;
              top: 70px;
              right: 0;
              border: 1px solid #b6b8bd;
            "
            ></div>
          </el-col>
          <el-col :span="12" style="height: 100%; padding-left: 0">
            <el-card
                class="btmCard"
                style="border-radius: 0px 12px 12px 0px !important"
            >
              <div class="panel_header">
                <div style="width: 0%"></div>
                <div style="width: 100%">
                  <el-date-picker
                      ref="dayDiv"
                      v-model="chartDate"
                      format="yyyy/MM/dd"
                      align="right"
                      type="date"
                      placeholder="选择日期"
                      :clearable="false"
                      prefix-icon="fa fa-bars"
                      style="margin-right: 15px; width: 228px"
                  >
                  </el-date-picker>
                  <el-date-picker
                      style="margin-right: 15px; display: none; width: 280px"
                      ref="weekDiv"
                      unlink-panels
                      v-model="weekDay"
                      type="daterange"
                      format="yyyy/MM/dd"
                      range-separator="~"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                  ></el-date-picker>
                  <el-select v-model="sel_modelType">
                    <el-option
                        v-for="item in ModelBottomList"
                        :value="item.plan_model_id"
                        :key="item.plan_model_id"
                        :label="item.plan_name"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="divTable">
                <el-table
                    :data="FirstData"
                    :header-row-style="{
                  height: '61px',
                }"
                    :header-cell-style="{ 'background-color': '#F5F7FA' }"
                    :cell-style="{ padding: '0px' }"
                    :row-style="{ height: '51px' }"
                    :row-class-name="tableRowClassName"
                    style="overflow-y:auto"
                >
                  <el-table-column
                      prop="customerType"
                      label="客户"
                      align="center"
                  ></el-table-column>
                  <el-table-column
                      prop="forecastUsage"
                      label="预测用气量"
                      align="center"
                  ></el-table-column>
                  <el-table-column
                      prop="actualUsage"
                      label="实际用气量"
                      align="center"
                  ></el-table-column>
                  <el-table-column
                      prop="deviation"
                      label="偏差量（万方）"
                      align="center"
                  ></el-table-column>
                  <el-table-column
                      prop="deviationRate"
                      label="偏差率（%）"
                      align="center"
                  ><template slot-scope="scope">
                    {{
                      scope.row.deviationRate == 0
                          ? "-"
                          : scope.row.deviationRate == null ||
                          scope.row.deviationRate == "Infinity"
                          ? "-"
                          : scope.row.deviationRate + "%"
                    }}
                    <i
                        :class="
                        scope.row.deviationRate == null ||
                        scope.row.deviationRate == 'Infinity'
                          ? ''
                          : scope.row.deviationRate > 0
                          ? 'el-icon-top'
                          : scope.row.deviationRate < 0
                          ? 'el-icon-bottom'
                          : ''
                      "
                    ></i></template
                  ></el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import axios from 'axios'
import topMenu from "../../components/topMenu/topMenu";

export default {
  name: "WeeklyDemandForecast",
  data() {
    return {
      browerTime:0,
      timer:null,
      hisData:[],
      LegendfontSizes: 18, //图表图例字体大小
      otherfontSizes: 16, //图表其他字体大小
      entData: [],
      topSel: 0, //上面的下拉框
      ModelTopList: [],
      ModelBottomList: [],
      weekDay: [this.setTime(4), this.setTime(5)],
      bttActive:
        localStorage.getItem("queryType") != null
          ? localStorage.getItem("queryType")
          : "1",
      sel_modelType: 2,
      DayDate: new Date(),
      chartDate: new Date(), //new Date(new Date().getTime() + 0 * 24 * 60 * 60 * 1000),偏差结构分析时间
      selectDate: null,
      typeDate: this.setTypeDate(),
      formatDate: this.setformatDate(),
      tableHead: [],
      fangan: [],
      plans: [],
      FirstData: [],
      types: 0,
      date: this.setDate(), //开始时间结束时间属性
      //设置时间控制不能跨越
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.selectDate == null) {
            return false;
          } else {
            return this.selectDate.getMonth() != time.getMonth();
          }
        },
      },
      onPick: (date) => {
        //如果只选择一个则保存至selectDate 否则为空
        if (date.minDate && !date.maxDate) {
          this.selectDate = date.minDate;
        } else {
          this.selecDate = null;
        }
      },
    };
  },
  created() {
    window.zhuge.track('需求预测-气量预测-进入偏差分析页面',{'页面名称':'气量偏差分析页面'})
  },
  components: {
    topMenu
  },
  mounted() {
    this.getBrowerTime()
    // this.GetEntData();
    this.GetModelList();
    // this.GetModelBottomList();
    this.GetFontSize();
    this.GetHisData();
    this.GetTableData();
    this.GetPieData();
    //根据查询类型判断最下面的日期控件是显示周还是日
    if (localStorage.getItem("queryType") != null) {
      if (localStorage.getItem("queryType") == "1") {
        this.$refs.dayDiv.$el.style.display = "block";
        this.$refs.weekDiv.$el.style.display = "none";
      } else {
        this.$refs.dayDiv.$el.style.display = "none";
        this.$refs.weekDiv.$el.style.display = "flex";
      }
    } else {
      this.$refs.dayDiv.$el.style.display = "block";
      this.$refs.weekDiv.$el.style.display = "none";
    }
  },
  computed: {
    curComCode: {
      get() {
        return this.$store.getters.curCom
      },
      set(val) {
        this.$store.commit('SET_CUR_COM', val)
      }
    },
    entCode: function () {
      return this.$store.getters.curCom
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.zhuge.track('需求预测-气量预测-偏差分析页面停留时长',{'气量偏差分析页面停留时长':this.browerTime})
  },
  watch: {
    entCode() {
      this.GetHisData();
      this.GetTableData();
      this.GetPieData();
    },
    date() {
      this.GetTableData();
      this.GetHisData();
    },
    topSel() {
      // this.GetTableData();
      this.GetHisData();
    },
    bttActive() {
      this.GetPieData();
    },
    chartDate() {
      this.GetPieData();
    },
    weekDay() {
      this.GetPieData();
    },
    sel_modelType() {
      this.GetPieData();
    },
  },
  methods: {
    getBrowerTime() {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    },    
    curComChangeHandler: function (curCom) {
      console.log('curcom',curCom)
      // this.curCom = curCom
      this.entCode = curCom
      this.$store.commit('SET_CUR_COM', curCom)
      for (let v of this.comOptions) {
        if(v.code === curCom) {
          this.$store.commit('SET_CUR_COM_NAME', v.resources_name)
        }
      }
    },    
    //获取企业列表
    GetEntData() {
      axios({
        url: "/htapi/api/v1/enterprise-info-service/enterprise/list",
      }).then((res) => {
        this.entData = res.data;
        this.entCode = this.entData[0].comp_code;
      });
    },
    //预测方案
    GetModelList() {
      axios({
        url: "/htapi/api/v1/model-info-service/plan/model/list/1/0/" + this.entCode,
      }).then((res) => {
        this.ModelTopList = res.data;
        
        this.ModelBottomList = this.ModelTopList.data.filter(
          (item) => item.plan_model_id != 0
        );
      });
    },
    //没有全部预测方案与预测结果的下拉框
    GetModelBottomList() {
      axios({
        url: "/htapi/api/v1/model-info-service/plan/model/list/1/1",
      }).then((res) => {
        this.ModelBottomList = res.data;
      });
    },
    //改变字体大小
    GetFontSize() {
      if (window.screen.width <= 1440) {
        this.LegendfontSizes = 14;
        this.otherfontSizes = 12;
      }
    },
    //根据查询类型设置日期显示日还是周
    setTypeDate() {
      if (localStorage.getItem("queryType") != null) {
        if (localStorage.getItem("queryType") == "1") {
          return "daterange";
        } else return "monthrange";
      }
      return "daterange";
    },
    //根据查询类型设置日期是日格式化还是周格式化
    setformatDate() {
      if (localStorage.getItem("queryType") != null) {
        if (localStorage.getItem("queryType") == "1") {
          return "yyyy/MM/dd";
        } else return "yyyy/MM";
      }
      return "yyyy/MM/dd";
    },
    //根据查询类型设置日期控件是显示周还是日
    setDate() {
      if (localStorage.getItem("queryType") != null) {
        if (localStorage.getItem("queryType") == "1") {
          return [new Date().getTime() - 6 * 24 * 60 * 60 * 1000, new Date()];
        } else {
          return [
            this.$moment(new Date(this.setTime(4)).setMonth(-2)).format(
              "YYYY-MM"
            ),
            this.$moment(new Date(this.setTime(5))).format("YYYY-MM"),
          ];
        }
      }
      return [new Date().getTime() - 6 * 24 * 60 * 60 * 1000, new Date()];
    },
    //表格间隔颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 != 0) return "tableRowClassName";
      return "";
    },
    returnStr(data) {
      return data == 1
        ? data + "%<i class='el-icon-caret-top'></i>"
        : data + "%<i class='el-icon-caret-bottom'></i>";
    },
    //获取周一的日期
    getMonDate() {
      var d = new Date(),
        day = d.getDay(),
        date = d.getDate();
      if (day == 1) return d;
      if (day == 0) d.setDate(date - 6);
      else d.setDate(date - day + 1);
      return d;
    },
    //获得周期名字
    getDayName(day) {
      var day = parseInt(day);
      if (isNaN(day) || day < 0 || day > 6) return false;
      var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      return weekday[day];
    },
    setTime(val) {
      var d = this.getMonDate();
      var ds = new Date();
      var startDate = "",
        endDate = "";
      if (val == 4 || val == 5)
        for (var i = 0; i < 7; i++) {
          let weekDay = this.getDayName(d.getDay());
          let date = d.getDate() + "日";
          if (weekDay == "周一") {
            startDate =
              ds.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
          }

          if (weekDay == "周日") {
          }
        }
      endDate = new Date(
        new Date(
          ds.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
        ).getTime() +
          6 * 24 * 60 * 60 * 1000
      );
      var time = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
      var year = time.getFullYear();
      var month = checkTime(time.getMonth() + 1);
      // var month2 = checkTime(time.getMonth() + 1);
      var day = checkTime(time.getDate());
      // var day2 = checkTime(time.getDate());
      var hours = time.getHours();
      var Minutes = time.getMinutes();

      var day3 = new Date();
      day3.setMonth(-3);
      var s3 =
        day3.getFullYear() +
        "-" +
        checkTime(day3.getMonth() + 1) +
        "-" +
        day3.getDate();

      function checkTime(i) {
        if (i < 10) return "0" + i;
        return i;
      }
      if (val == 1) return year + "-" + month + "-" + day;
      if (val == 2) return s3;
      if (val == 3) return year + "-" + month + "-" + day;
      if (val == 4) {
        return startDate;
      }
      if (val == 5) return endDate;
    },
    GetHisData() {
      var self = this;
      var url = "";
      if (self.bttActive == 1) {
        var dt = [
          this.$moment(self.date[0]).format("YYYY-MM-DD"),
          this.$moment(self.date[1]).format("YYYY-MM-DD"),
        ];
        url =
          "/htapi/api/v1/data-forecast-service/predict/deviation/analysis/trend/" +
          self.entCode +
          "/" +
          self.bttActive +
          "/" +
          dt[0] +
          "/" +
          dt[1] +
          "/" +
          self.topSel +
          "";
      } else {
        var dt = [
          this.$moment(self.date[0]).format("YYYY-MM"),
          this.$moment(self.date[1]).format("YYYY-MM"),
        ];
        url =
          "/htapi/api/v1/data-forecast-service/predict/deviation/analysis/trend/" +
          self.entCode +
          "/" +
          self.bttActive +
          "/" +
          dt[0] +
          "/" +
          dt[1] +
          "/" +
          self.topSel +
          "";
      }
      axios({
        url: url,
      }).then((res) => {
        self.GetHisCharts(res.data);
        var data = res.data;
        res.data;
        this.hisData = res.data
      });
    },
    GetHisCharts(data) {
      var self = this;
      var option = [];
      if (data.length > 0) {
        var legends = [];
        if (self.topSel == 0) {
          legends = [
            "实际用气量",
            "最终预测结果",
            "总气量预测",
            "分类预测1",
            "分类预测2",
          ];
        }
        if (self.topSel == -1001) {
          legends = ["实际用气量", "最终预测结果"];
        }
        if (self.topSel == 1) {
          legends = ["实际用气量", "总气量预测"];
        }
        if (self.topSel == 2) {
          legends = ["实际用气量", "分类预测1"];
        }
        if (self.topSel == 3) {
          legends = ["实际用气量", "分类预测2"];
        }
        var seriesData = [];
        for (let i = 0; i < legends.length; i++) {
          var colors =
            legends[i] == "实际用气量"
              ? "#2C94EF"
              : legends[i] == "最终预测结果"
              ? "#50C9E4"
              : legends[i] == "总气量预测"
              ? "#7C79CF"
              : legends[i] == "分类预测1"
              ? "#7EABDC"
              : "#9AEAD0";
          seriesData.push({
            name: legends[i],
            type: "bar",
            barWidth: "8%",
            itemStyle: {
              color: colors,
              barBorderRadius: [10, 10, 0, 0],
            },
            data: (function () {
              for (let a = 0; a < legends.length; a++) {
                return data.map(function (item) {
                  if (legends[i] == "实际用气量") {
                    return {
                      value: item.actualUsage,
                    };
                  }
                  if (legends[i] == "最终预测结果") {
                    return {
                      value:
                        item.forecastResults == null ? 0 : item.forecastResults,
                    };
                  }
                  if (legends[i] == "总气量预测") {
                    for (let j in item) {
                      if (j == "plans") {
                        return {
                          value:
                            item[j]["总气量预测"] == undefined ||
                            item[j]["总气量预测"] == null
                              ? 0
                              : item[j]["总气量预测"].toFixed(2),
                        };
                      }
                    }
                  }
                  if (legends[i] == "分类预测1") {
                    for (let j in item) {
                      if (j == "plans") {
                        return {
                          value:
                            item[j]["分类预测1"] == undefined ||
                            item[j]["分类预测1"] == null
                              ? 0
                              : item[j]["分类预测1"].toFixed(2),
                        };
                      }
                    }
                  }
                  if (legends[i] == "分类预测2") {
                    for (let j in item) {
                      if (j == "plans") {
                        return {
                          value:
                            item[j]["分类预测2"] == undefined ||
                            item[j]["分类预测2"] == null
                              ? 0
                              : item[j]["分类预测2"].toFixed(2),
                        };
                      }
                    }
                  }
                });
              }
            })(),
          });
        }
        option = {
          tooltip: {
            trigger: "axis",
            textStyle: {
              fontSize: this.LegendfontSizes,
            },
            formatter: (params) => {
              var backString = ""; //定义一个空字符串返回值
              // var allValue = 0; //总气量
              for (var i = 0; i < params.length; i++) {
                if (params[i].seriesType == "bar") {
                  var pcl = 0;
                  var rowString = "";
                  if (legends.indexOf(params[i].seriesName) >= -1)
                    rowString = params[i].marker + params[i].seriesName + ":"; //定义当前序列行的序列名
                  var rowValue = 0; //定义该行的求和初值
                  //第二层循环到当前序列行即可
                  for (var j = 0; j < i + 1; j++) {
                    if (params[j].seriesName != "实际用气量") {
                      if (params[0].value != 0) {
                        pcl = (
                          ((params[j].value - params[0].value) /
                            params[0].value) *
                          100
                        ).toFixed(2);
                      }
                    }

                    rowValue = params[j].value; //序列行值求和
                  }
                  //将文本行尾的‘+’号去除,再叠加求和值及换行符到返回值上
                  if (params[i].seriesName != "实际用气量") {
                    backString +=
                      rowString + rowValue + "，偏差率：" + pcl + "%<br />";
                  } else backString += rowString + rowValue + "<br />";
                }
              }
              return params[0].name + "<br />" + backString;
            },
          },
          legend: {
            data: legends,
            icon: "circle",
            textStyle: {
              color: "#9FAFD5",
              fontSize: this.LegendfontSizes,
            },
            x: "center",
          },
          grid: {
            top: 55,
            left: 50,
            right: 30,
            bottom: 65,
          },
          dataZoom: [
            {
              type: "slider",
              xAxisIndex: 0,
              filterMode: "empty",
              bottom: 9,
              textStyle: {
                color: "#9FAFD5",
                fontSize: this.otherfontSizes,
              },
            },
          ],
          xAxis: [
            {
              type: "category",
              boundaryGap: true,
              data: data.map((item) => item.date),
              axisLine: { show: true, lineStyle: { color: "#4A5578 " } },

              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: {
                color: " rgba(255,255,255,0.56)",
                fontSize: this.otherfontSizes,
              },
            },
          ],
          yAxis: {
            name: "单位：万方",
            nameTextStyle: {
              color: "#C2CAE7",
              fontSize: this.LegendfontSizes,
            },
            type: "value",
            scale: true,
            axisLabel: {
              color: " rgba(255,255,255,0.56)",
              fontSize: this.otherfontSizes,
            },
            axisTick: { show: false },
            axisLine: { show: false, lineStyle: { color: "#ccc" } },
            splitLine: { show: true, lineStyle: { color: "#4A5578 " } },
          },
          series: seriesData,
        };
      }
      var myChart = this.$echarts.init(this.$refs.hisMain);
      if (data.length > 0) {
        myChart.clear();
        myChart.setOption(option);
      } else {
        myChart.clear();
      }

      window.addEventListener("resize", function () {
        myChart.resize();
      });

      myChart.on("click", function (params) {
        if (self.bttActive == 1) {
          self.chartDate = params.name;
          if (params.seriesName != "实际用气量") {
            self.sel_modelType =
              params.seriesName == "最终预测结果"
                ? -1001
                : params.seriesName == "总气量预测"
                ? 1
                : params.seriesName == "分类预测1"
                ? 2
                : params.seriesName == "分类预测2"
                ? 3
                : "";
          }
        } else {
          var timeData = params.name.split("to");
          self.weekDay = [];
          for (let i = 0; i < timeData.length; i++) {
            if (
              self.weekDay.length == 0 ||
              self.weekDay.indexOf(params.name.split("to")[i]) == -1
            ) {
              self.weekDay.push(params.name.split("to")[i]);
            }
          }
        }
      });
    },
    //中间表格
    GetTableData() {
      var self = this;
      var url = "";
      var dt = [];
      if (self.bttActive == 1) {
        dt = [
          this.$moment(self.date[0]).format("YYYY-MM-DD"),
          this.$moment(self.date[1]).format("YYYY-MM-DD"),
        ];
      } else {
        dt = [
          this.$moment(self.date[0]).format("YYYY-MM"),
          this.$moment(self.date[1]).format("YYYY-MM"),
        ];
      }
      url =
        "/htapi/api/v1/data-forecast-service/predict/deviation/analysis/table/" +
        self.entCode +
        "/" +
        self.bttActive +
        "/" +
        dt[0] +
        "/" +
        dt[1] +
        "/0";
      axios({
        url: url,
      }).then((res) => {
        var data = res.data;
        self.tableHead = [];
        self.fangan = [];
        data.forEach((item) => {
          self.tableHead.push(item);
          // for (var i in item.plans) {
          //   if (self.fangan.length == 0 || self.fangan.indexOf(i) == -1);
          // }
        });
        if (data.length > 0)
          self.fangan.push("总气量预测", "分类预测1", "分类预测2");
      });
    },
    GetPieData() {
      var self = this;
      var dt = [];
      if (self.bttActive == 1) {
        dt = [
          this.$moment(self.chartDate).format("YYYY-MM-DD"),
          this.$moment(self.chartDate).format("YYYY-MM-DD"),
        ];
      } else {
        dt = [
          this.$moment(self.weekDay[0]).format("YYYY-MM-DD"),
          this.$moment(self.weekDay[1]).format("YYYY-MM-DD"),
        ];
      }
      axios({
        url:
          "/htapi/api/v1/data-forecast-service/predict/deviation/analysis/structure/" +
          self.entCode +
          "/" +
          self.bttActive +
          "/" +
          dt[0] +
          "/" +
          dt[1] +
          "/" +
          self.sel_modelType +
          "",
      })
        .then((res) => {
          this.FirstData = [];
          for (let i = 0; i < res.data.length; i++) {
            this.FirstData.push({
              customerType: res.data[i].customerType,
              actualUsage:
                res.data[i].actualUsage != null
                  ? res.data[i].actualUsage.toFixed(2)
                  : "-",
              deviation:
                res.data[i].deviation != null
                  ? res.data[i].deviation.toFixed(2)
                  : "-",
              deviationRate:
                res.data[i].deviationRate != null
                  ? res.data[i].deviationRate.toFixed(2)
                  : "",
              forecastUsage:
                res.data[i].forecastUsage != null
                  ? res.data[i].forecastUsage.toFixed(2)
                  : "-",
            });
          }
          //hekai(2021/01/14)：   获取id
          console.log('ressssss3',res)
        self.GetPirCharts(res.data, self.sel_modelType);
        })
        .catch(function (error) {
          console.log('occus a error',error)
          // if (error.response.status == 500) {
          if (error.status == 500) {
            $("#PieChart").hide();
            $("#noPieData").show();
          }
        });
    },
    //hekai(2021/01/14)：id为下拉框选中值
    GetPirCharts(data, id) {
          console.log('chart data',data)

      var self = this;
      var option = {
        tooltip: {
          trigger: "item",
          textStyle: {
            fontSize: this.LegendfontSizes,
          },
          formatter: function (data) {
            var ycyql =
              data.data.value == null ||
              data.data.value == undefined ||
              data.data.value == Infinity
                ? 0
                : data.data.value.toFixed(2); //预测用气量：
            var pcll =
              data.data.pcll == null ||
              data.data.pcll == undefined ||
              data.data.pcll == Infinity
                ? 0
                : data.data.pcll.toFixed(2); //偏差量：
            var pcl =
              data.data.pcl == null ||
              data.data.pcl == undefined ||
              data.data.pcl == Infinity
                ? 0
                : data.data.pcl; //偏差率：
            return (
              data.data.name +
              "<br/>预测用气量：" +
              ycyql +
              " 万方" +
              "<br/>偏差量：" +
              pcll +
              " 万方" +
              "<br/>偏差率：" +
              pcl +
              "" +
              " %"
            );
          },
        },
        legend: {
          left: "center",
          data: data.map((item) => item.customerType),
          icon: "circle",
          textStyle: {
            fontSize: this.LegendfontSizes,
          },
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            center: ["50%", "50%"],
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter: "{b}: {d}%",
              fontSize: this.LegendfontSizes,
            },
            emphasis: {
              label: {
                show: true,
                // fontSize: "30",
              },
            },
            labelLine: {
              show: true,
            },
            data: data.map(function (item) {
              var colors = "";
              if (item.customerType == "重点大客户") colors = "#3C91FF";
              if (item.customerType == "总气量") colors = "#E5E778";
              if (item.customerType == "一般工商业") colors = "#48E3FF";
              if (item.customerType == "其他") colors = "#0BFFDB";
              var values = item.forecastUsage == null ? 0 : item.forecastUsage;
              var pcl = item.deviationRate == null ? 0 : item.deviationRate;
              var pcll = item.deviation == null ? 0 : item.deviation;

              //hekai(2021/01/14):  判断id为-1001(最终预测结果)不显示总气量
              if (id != -1001) {
                return {
                  value: values,
                  name: item.customerType,
                  pcl: pcl,
                  pcll: pcll,
                  itemStyle: { color: colors },
                };
              } else {
                if (item.customerType != "总气量") {
                  return {
                    value: values,
                    name: item.customerType,
                    pcl: pcl,
                    pcll: pcll,
                    itemStyle: { color: colors },
                  };
                }
              }
            }),
          },
        ],
      };
      if (data.length > 0) {
        // $("#PieChart").show();
        // $("#noPieData").hide();
        // this.$refs.PieChart.show()
        // this.$refs.noPieData.hide()
        var myChart = this.$echarts.init(this.$refs.PieChart);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
        myChart.clear();
        myChart.setOption(option);
      } else {
        // $("#PieChart").hide();
        // $("#noPieData").show();
        // this.$refs.PieChart.hide()
        // this.$refs.noPieData.show()        
      }
    },
    btnSwitchCss(index) {
      if (index == 1) {
        this.typeDate = "daterange";
        this.formatDate = "yyyy/MM/dd";
        this.$refs.dayDiv.$el.style.display = "block";
        this.$refs.weekDiv.$el.style.display = "none";
        this.date = [
          new Date().getTime() - 6 * 24 * 60 * 60 * 1000,
          new Date(),
        ];
      } else {
        this.formatDate = "yyyy/MM";
        this.typeDate = "monthrange";
        this.date = [
          this.$moment(new Date(this.setTime(4)).setMonth(-2)).format(
            "YYYY-MM"
          ),
          this.$moment(new Date(this.setTime(5))).format("YYYY-MM"),
        ];
        this.$refs.dayDiv.$el.style.display = "none";
        this.$refs.weekDiv.$el.style.display = "flex";
        // this.$refs.dayDiv.style.display = "none";
      }

      this.bttActive = index;
    },
  },
};
</script>
<style scoped lang="scss">
.custom-select {
  width: 500px !important;
  /deep/ .gas-page-header-container {
    margin-top: 20px;
  }
  /deep/ .gas-page-user-wrapper {
    background: #5d8ad0;
    margin-right: 20px;
  }
  /deep/ .gas-page-com-wrapper {
    background: #5d8ad0;
  }
}
.gas-page-bg {
  /deep/ {

    .el-container {
      height: 100%;
    }

    .el-main {
      padding: 0;
      overflow: inherit;
    }



    .el-input__inner {
      font-size: 16px !important;
    }

    /*时间区间开始*/
    .el-range-editor.el-input__inner {
      font-size: 18px !important;
      border-radius: 25px;
      width: 220px;
    }

    .el-date-editor .el-range-separator {
      padding: 0;
      line-height: 40px;
    }

    .el-date-editor .el-range__icon {
      position: absolute;
      width: 54.2px;
      right: 0px;
      border-left: 1px solid #DEE2EB;
    }

    .el-date-editor .el-range__close-icon {
      display: none;
    }

    .el-date-editor>.el-input__inner {
      border-radius: 25px;
    }

    /*时间区间结束*/


    /*不是时间区间开始*/
    .fa {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .el-date-editor .el-input__prefix {
      width: 54.2px;
      left: 145px !important;
      border-left: 1px solid #DEE2EB;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /*不是时间区间结束*/
    .el-main>.el-row:first-child {
      background-color: #DCE1EC;
    }

    .el-main>.el-row:last-child {
      height: 51%;
      background-color: white;
    }

    .el-main>.el-row>.el-col {
      /* height: 100%; */
      background-color: #DCE1EC;
      padding: 15px;
      padding-left: 20px;
      padding-right: 20px;
    }

    .el-button.is-circle {
      background: rgb(255, 255, 255);
      border: 0px;
      width: 50px;
      height: 50px;
      padding: 0px;
      border-radius: 25px;
      margin-right: 0.8%;
    }

    .el-button+.el-button {
      margin-left: 0;
    }

    .el-button {
      color: #3D5695;
    }

    .el-button.active:hover {
      background-color: #0fb2ab;
      outline: 0;
    }

    .el-button:active {
      background-color: #0fb2ab;
      border-color: 0px;
      outline: 0;
    }

    .el-button.active {
      color: #fff !important;
      background-color: #0fb2ab !important;
    }

    .el-card {
      height: 80%;
      border-radius: 12px;
    }

    .el-card__body {
      height: 100%;
      padding: 0;
    }

    .panel {
      width: 100%;
    }

    .panel_header {
      width: 100%;
      height: 50px;
      display: flex;
      font-size: 20px;
      justify-content: flex-start;
      align-items: center;
      font-weight: 700;

      color: #3D3D3D;
    }

    .panel_headerColor {
      color: #3F5896
    }

    .panel_header>div:first-child {
      display: flex;
      width: 80%;
      font-size: 21.33px;
      justify-content: flex-start;
      align-items: center;
    }

    .panel_header>div:first-child>.el-input {
      width: 223px;
      margin-left: 10px;
      border-radius: 25px
    }

    .panel_header>div:first-child>.el-input>input {
      height: 40px;
      margin-left: 10px;
      border-radius: 25px
    }

    .panel_header>div:first-child>.el-input>.el-input__prefix {
      left: 12px;
      top: 4px
    }

    .panel_header>div:last-child {
      display: flex;
      width: 20%;
      justify-content: flex-end;
      font-size: 18.66px;
      color: #666666;
    }

    .panel_header1 {
      width: 100%;
      height: 20px;
      display: flex;
      font-size: 20px;
      justify-content: flex-start;
      align-items: center;
      font-weight: 700;
      margin-top: 5px;
      margin-bottom: 10px;
      margin-left: 20px;
    }

    .panel_title {
      width: 100%;
      display: flex;
      font-size: 12px;
      height: 15%;
    }

    .panel_title>div:first-child {
      width: 50%;
      display: flex;
      /* font-size: 33px; */
      justify-content: flex-start;
      align-items: center;
      font-weight: 700;
    }

    .el-table .tableRowClassName {
      background-color: #F0F2F7;
    }

    .panel_title>div:last-child {
      width: 50%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .el-table {
      height: 100%;
      overflow-y: hidden;
      border-collapse: separate;
      border-spacing: 0px 10px;
      background-color: transparent;
    }



    .el-table.r-table .cell {
      display: inline-block;
      white-space: nowrap;
      width: auto;
      overflow: auto;
    }

    .el-table__body {
      border-spacing: 0px 10px;
    }

    .el-table.r-table .el-table__body-wrapper {
      overflow-x: auto;
    }

    .el-table th .cell {
      font-size: 18.66px;
      color: #505356;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .el-table::before {
      height: 0px;
      top: 0px;
      width: 0;
    }

    .el-table td .cell {
      font-size: 18.66px;
      color: #505356;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .el-table td,
    .el-table th.is-leaf {
      border: 0;
    }

    .ChartsRow {
      margin-top: 1%;
      width: 100%;
      height: 45%;
      background-color: white;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .el-card.is-always-shadow {
      webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0);
    }

    .el-card {
      border: 0px;
    }

    .boxBorder {
      width: 100%;
      height: 87%;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      overflow-y: auto;
    }

    .boxBorderDiv {
      width: 14.28%;
      height: 25%;
      border: 1px solid #d8d8e0;
    }

    .borderDivTime {
      width: 100%;
      height: 30%;
      padding-left: 5px;
      display: flex;
      align-items: center;
    }

    .boxBGBluecolor {
      background-color: #F0F2F7;
      height: 100%;
      padding-bottom: 5px;
    }

    .boxBGYellowcolor {
      background-color: #FCF7F8;
      height: 100%;
      padding-bottom: 5px;
    }

    .tableSelect {
      width: 100%;
      border-radius: 7px;
      border: 1px solid #D2D2DC;
      height: 30px;
      text-align: left;
      text-align-last: left;
      padding-left: 10px;
      font-size: 12px;
    }

    .divTable {
      padding: 20px;
      padding-bottom: 0px;
      height: 80%
    }


    .totalDiv {
      margin-top: 11px;
      height: 51px;
      width: 100%;
      background: rgb(255, 255, 255);
      display: flex;
      padding-left: 20px;
      padding-right: 20px;
    }

    .totalDiv>div {
      display: flex;
      border-radius: 30px;
    }

    .totalDiv>div>div {
      font-size: 18.66px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

    }

    .entBox {
      width: 188px;
      height: 40px;
      background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #000 45%, rgba(255, 255, 255, 0) 100%);
      border-radius: 7px;
      opacity: 0.19;
      font-size: 20px;
      cursor: pointer;
    }

    .entBoxDiv {
      position: absolute;
      right: 182px;
      font-size: 20px;
      color: #000;
      font-weight: 100;
      cursor: pointer;
    }

    .entradius {
      width: 118px;
      height: 39px;
      border: 1px solid #bbc8dc;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: #000;
      font-weight: 100;
      cursor: pointer;
    }

    .timeNote {
      font-size: 12px;
      color: #000;
    }

    .iInput {
      position: absolute;
      width: 43%;
      height: 16px;
      left: 18px;
      top: 13px;
      border-bottom: 0px;
      border-right: 0px;
      border-left: 0px;
      border-top: 0px;
      text-align: center;
    }

    .el-icon-info {
      font-size: 21px;
      margin-left: 10px;
    }

    .calendar-day {
      text-align: center;
      color: #202535;
      line-height: 20px;
      font-size: 18px;
    }

    .is-selected {
      font-size: 18px;
      margin-top: 5px;
      padding-left: 10px;
    }

    .el-calendar-table thead th {
      text-align: center;
    }

    .el-calendar__body {
      padding: 0
    }

    .el-calendar__header {
      padding: 0;
    }

    .el-calendar-table .el-calendar-day {
      padding: 0px;
      height: 100%;
    }


    .el-backtop,
    .el-calendar-table td.is-today {
      color: black
    }

    .el-calendar__header {
      display: none;
    }

    .el-dialog__body {
      padding-top: 0;
      padding-bottom: 0;
    }

    .el-input__icon {
      line-height: 0;
    }

    .el-input__inner {
      padding: 0 30px;
      height: 50px;
    }


    .selectBor {
      height: 37px;
      width: 1px;
      position: absolute;
      border: 1px solid #DEE2EB;
      right: 76px;
    }

    .typeSelect {
      font-size: 18px;
      width: 181px;
      height: 39px;
      background: #F0F2F7;
      border-radius: 19px;
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      color: #d2d7fb;
      text-align: center;
      text-align-last: center;
      /* background: url("../../images/public/Path.png") 95% 50% no-repeat scroll transparent; */
      padding-right: 10px;
    }

    .entSel>.el-select {
      width: 260px;
    }

    .el-select {
      width: 200px;
      margin-left: 10px;
      text-align: center;
    }

    .el-select>.el-input>.el-input__inner {
      background: #ffffff;
      border-radius: 33.33px;
      text-align: center;
      border:1px solid #ddd;
      color:#000;
      position: relative;
      right:20px;
      height:50px;
    }

    .el-select-dropdown__item.selected {
      color: #0FB2AB
    }

    .el-select>.el-input>.el-input__suffix {
      border-left: 1px solid #DEE2EB;
      width: 54.2px;
    }


    .cell>.el-select {
      width: 85px;
      margin: 0 !important;
    }

    .cell>.el-select>.el-input>.el-input__suffix {
      width: 25px;
    }

    .cell>.el-select>.el-input>.el-input__inner {
      background: #F0F2F7;
      border: 1px solid #DEE2EB;
      border-radius: 3px;
      text-align: center;
      height: 27px;
      font-size: 18.66px !important;
    }

    .cell>.el-select>.el-input>.el-input__suffix {
      border-left: 0px
    }

    /* 方案偏差分析跳转按钮 */
    .fapcBtn {
      width: 174px;
      height: 43px;
      background: #0FB2AB;
      border-radius: 21.6px;
      font-size: 21.33px;
      color: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      padding-left: 28px;
    }

    .fapcBtn>.fa {
      position: absolute;
      right: 25px;
    }

    .fapcBtn:active {
      background: #0FB2AB;
      color: #fff;
    }

    .fapcBtn:hover {
      background: #0FB2AB;
      color: #fff;
    }

    .el-calendar-table td {
      border: 0px;
      padding: 15px;
      height: 128px;
    }

    .calendarTBTitle {
      background-color: #F0F2F7;
    }

    .calendarHBTitle {
      background-color: #FCF7F8;
    }

    .notHB {
      padding-left: 15px;
      margin-left: 10px;
    }

    .calendarTB {
      background-color: rgba(93, 188, 100, 0.1);
      border-radius: 15px;
      border-radius: 15px;
      color: #4FB756;
      width: 80%;
      display: flex;
      padding-left: 12px;
      margin-left: 10px;
    }

    .calendarHB {
      background-color: rgba(229, 97, 87, 0.1);
      border-radius: 15px;
      border-radius: 15px;
      color: #E56157;
      width: 80%;
      display: flex;
      padding-left: 12px;
      margin-left: 10px;
    }

    .el-calendar-table td.is-selected {
      background-color: transparent;
    }

    .el-calendarDay {
      padding-left: 25px;
      font-size: 18px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 40px;
    }

    .el-date-table-calendar th {
      text-align: left;
      padding-left: 33px !important;
    }

    .el-date-picker-calendar__header {
      display: none;
    }

    .el-date-table-calendar td.available {
      color: #606266 !important;
      font-weight: 500 !important;
    }

    .el-date-table-calendar td.available:hover {
      color: #606266 !important;
    }

    .el-dialog__header {
      border-bottom: 1px solid #DEE2EB;
    }

    .el-dialog__body>div {
      font-size: 16px;
      color: #405169;
    }

    .el-dialog__body>div>span {
      font-size: 14px;
      color: #A1ACB3;
    }

    .el-table tr th:first-child {
      border-radius: 30px 0 0 30px !important;
    }

    .el-table tr th:nth-last-child(2) {
      border-radius: 0 30px 30px 0 !important;
    }

    .tableRowClassName td:first-child {
      border-radius: 25px 0 0 25px !important;
    }

    .tableRowClassName td:last-child {
      border-radius: 0 25px 25px 0 !important;
    }

    .BigTitle {
      font-size: 32px !important;
    }

    .hisTitle {
      font-size: 26.66px !important;
    }

    .HB {
      width: 80%;
      text-align: left;
      font-size: 18px;
      overflow: hidden;
      white-space: nowrap;
    }

    .el-dialog {
      border-radius: 9px;
    }

    .el-dialog__title {
      font-size: 20px;
      color: #3F5896
    }

    .el-dialog__body>div>.el-col:first-child {
      font-size: 14px;
      color: #A1ACB3;
      height: 30px;
    }

    .el-dialog__body>div>.el-col:last-child {
      font-size: 16px;
      color: #405169;
      height: 30px;
    }

    @media (max-width: 1440px) {
      * {
        font-size: 14px;
      }

      .el-dialog__title {
        font-size: 16px;
      }

      .el-dialog__body>div>.el-col:first-child {
        font-size: 12px;
        color: #A1ACB3
      }

      .el-dialog__body>div>.el-col:last-child {
        font-size: 12px;
        color: #405169
      }

      .el-input__inner {
        font-size: 14px !important;
      }

      .fapcBtn>span {
        font-size: 16px !important;
      }

      .panel_header>div:first-child {
        font-size: 16px;
      }

      .panel_header>div:last-child {
        font-size: 14px;
      }

      .el-table th .cell {
        font-size: 14px;
      }

      .el-table td .cell {
        font-size: 14px;
      }

      .cell>.el-select>.el-input>.el-input__inner {
        font-size: 14px !important;
      }

      .totalDiv>div>div {
        font-size: 14px;
      }

      .BigTitle {
        font-size: 24px !important;
      }

      .hisTitle {
        font-size: 20px !important;
      }

      .el-calendarDay {
        font-size: 14px;
      }

      .HB {
        font-size: 14px;
      }

      .DayUnitTitle {
        font-size: 14px !important;
      }

      .pcfcTitle {
        font-size: 24px !important;
      }
    }

    @media (min-width: 1441px) {}
  }

  .topSel {
    /deep/ {
      .el-input .el-select__caret {
        color: #fff !important;
      }
      .el-input > .el-input__inner {
        border: 0px;
        height: 40px;
        background: rgba(255, 255, 255, 0.15);
        font-size: 16px;
        color: #ffffff;
        position: relative;
        right:20px;
      }
    }
  }

  .btmCard {
    background: #fff !important;
    height: 100%;
  }
  .el-button.is-circle {
    background-color: rgba(255, 255, 255, 0.15);
    color: #fff;
    height: 40px;
    border-radius: 20px;
  }
  .rigthTableRadius {
    border-radius: 0px 12px 0px 0px;
  }
  .leftTableRadius {
    border-radius: 0px 0px 12px 0px;
  }
  #timeDiv {
    /deep/ {
      .el-date-editor .el-range-separator {
        color: white;
      }
      .el-date-editor {
        background: rgba(0, 0, 0, 0.13);
        color: #d2d7fb;
        border: 0px;
        border-radius: 19px;
      }
      .el-range-input {
        background-color: transparent !important;
        color: white;
      }
    }
  }
  .el-card {
    background: -o-linear-gradient(to top, #2146a1, #4980d2);
    background: -moz-linear-gradient(to top, #2146a1, #4980d2);
    background: -ms-linear-gradient(to top, #2146a1, #4980d2);
    background: linear-gradient(to top, #2146a1, #4980d2);
    /* filter: progid:DXImageTransform.Microsoft.gradient(GradientType=1, startColorstr=#109afd, endColorstr=#3ed3fe); */
    background: -webkit-linear-gradient(to top, #2146a1, #4980d2);
    /* padding-left: 88px;
    padding-top: 71px;
    padding-bottom: 101px;
    padding-right: 68px; */
    padding: 15px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .el-main > .el-row:first-child > .el-col {
    padding: 0;
  }
  .panel_title > div {
    font-size: 33px;
    color: white;
    font-weight: 700;
  }
  .boxBorder {
    height: 330px;
    position: absolute;
    /* padding-left: 68px;
    padding-right: 68px; */
    padding: 15px;
    top: 457px;
    display: flex;
    justify-content: center;
    margin-right: 3px;
    padding-left: 2px;
    padding-right: 2px;
  }
  .boxBorderDiv {
    width: 100%;
    background: #ffffff;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0px;
  }
  .borderDivBG {
    background: #edf0f5;
  }
  .BorderDivLeft {
    width: 35%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .BorderDivRight {
    width: 70%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-icon-top {
    color: #20c439;
  }
  .el-icon-bottom {
    color: #ef4e32;
  }
  .borderbtmleft {
    border-radius: 0px 0px 0px 12px;
  }
}
</style>