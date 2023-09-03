<template>
  <div class="project-analysis">
    <div class="project-title">计划准确率分析</div>
    <div class="project-time">
      <el-button
        @click="changeDateValue('日')"
        :class="this.activeType === '日' ? 'btn1' : 'btnday'"
        >日</el-button
      >
      <el-button
        @click="changeDateValue('月')"
        :class="this.activeType === '月' ? 'btn1' : 'btnday'"
        >月</el-button
      >
      <el-button
        @click="changeDateValue('年')"
        :class="this.activeType === '年' ? 'btn1' : 'btnday'"
        >年</el-button
      >
      <div style="display: inline-block">
        <el-date-picker
          v-if="activeType === '日'"
          v-model="timeData.activeDayRangeValue"
          type="daterange"
          :class="{
            'date-picker': true,
            'is-dark': true,
          }"
          value-format="yyyy/MM/dd"
          format="yyyy/MM/dd"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerDayOptions"
          @blur="selectTime"
        >
        </el-date-picker>
        <el-date-picker
          v-model="timeData.activeMonthRangeValue"
          v-if="activeType === '月'"
          type="monthrange"
          :class="{
            'date-picker': true,
            'is-dark': true,
            'is-week-range': true,
          }"
          range-separator="~"
          value-format="yyyy/MM"
          format="yyyy/MM"
          start-placeholder="开始月"
          end-placeholder="结束月"
          @blur="selectTime"
          :picker-options="pickerMonthOptions"
        >
        </el-date-picker>
        <div class="year-picker" v-if="activeType === '年'">
          <div style="margin-top: -1px">
            <el-date-picker
              :clearable="false"
              v-model="timeData.startYear"
              @focus="actived"
              @blur="openEndDate"
              type="year"
              placeholder="开始年"
              class="start-year-picker"
              value-format="yyyy"
              :picker-options="pickerStartOptions"
            >
            </el-date-picker>
            <span
              style="
                font-size: 19px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #505356;
                padding-right: 15px;
              "
              >~</span
            >
            <el-date-picker
              class="end-year-picker"
              placeholder="结束年"
              :clearable="false"
              @focus="actived"
              v-model="timeData.endYear"
              type="year"
              value-format="yyyy"
              :picker-options="pickerOptions"
              @blur="selectTime"
              ref="endDate"
            ></el-date-picker>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "@/utils/bus";
export default {
  name: "timeComponent",
  props: {},
  data() {
    return {
      screenWidth: "",
      activeType: "日",
      timeData: {
        activeDayRangeValue: [],
        activeMonthRangeValue: [],
        startYear: "",
        endYear: "",
      },
      active: false,
      timeObject:{
        startTime:'',
        endTime:'',
        type:''
      },
      pickerDayOptions:{
      onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        // 限制不能超出31天
        disabledDate: (time) => {
          if (this.pickerMinDate !== '') {
            let one = 30 * 24 * 3600 * 1000
            let minTime = this.pickerMinDate - one
            let maxTime = this.pickerMinDate + one
            if (maxTime > new Date()) {
              maxTime = new Date()
            }
            return time.getTime() < minTime || time.getTime() > maxTime
          }
          return time.getTime() > Date.now()
        },
      },
      pickerMonthOptions:{
        onPick: ({ maxDate, minDate }) => {
            this.pickerMinDate = minDate.getTime()
            if (maxDate) {
              this.pickerMinDate = ''
            }
          },
          // 限制不能选择今天之后的日期
        disabledDate: (time) => {
          if (this.pickerMinDate !== '') {
            let one = 18 * 30 * 24 * 3600 * 1000
            let minTime = this.pickerMinDate - one
            let maxTime = this.pickerMinDate + one
            if (maxTime > new Date()) {
              maxTime = new Date()
            }
            return time.getTime() < minTime || time.getTime() > maxTime
          }
          return time.getTime() > Date.now()
        },
    },
    };
  },
  watch: {},
  computed: {
    pickerStartOptions() {
      let disabledDate = (time) => {
        return time.getTime() > Date.now();
      };
      return { disabledDate };
    },
    pickerOptions() {
      let disabledDate = (time) => {
        let tenYear = 10 * 365 * 24 * 3600 * 1000;
        let year1 = new Date(this.timeData.startYear).getTime();
        let yaer2 = year1 + tenYear;
        return time.getTime() < year1 || time.getTime() > yaer2 || time.getTime() > Date.now();
      };
      return { disabledDate };
    },
  },
  created() {
    this.timeData.startYear = (new Date().getFullYear() -4).toString();
    this.timeData.endYear = (new Date().getFullYear()).toString();
    this.currentDay();
    this.currentMonth();
  },
  mounted() {
    this.screenWidth = window.screen.width;
    this.selectTime();
  },
  methods: {
    currentDay(){
      let date1 = new Date();
      date1.setDate(date1.getDate() - 7);
      let year1 = date1.getFullYear();
      let month1 = date1.getMonth() + 1;
      let day1 = date1.getDate();
      month1 = (month1 < 10 ? "0" + month1 : month1);
      day1 = day1 < 10 ? "0" + day1 : day1;
      let sDate = (year1.toString() + "/" + month1.toString() + "/" + day1.toString());

      let date2 = new Date();
      date2.setDate(date2.getDate()-1)
      let year2 = date2.getFullYear();
      let month2 = date2.getMonth() + 1;
      
      let day2 = date2.getDate();
      month2 = (month2 < 10 ? "0" + month2 : month2);
      day2 = day2 < 10 ? "0" + day2 : day2;
      let eDate = (year2.toString() + "/" + month2.toString() + "/" + day2.toString());
      this.timeData.activeDayRangeValue[0] = sDate;
      this.timeData.activeDayRangeValue[1]=  eDate;
    },
    currentMonth(){
      let date1 = new Date();
      date1.setMonth(date1.getMonth()-11)
      let year1 = date1.getFullYear();
      let month1 = date1.getMonth() + 1;
      month1 = (month1 < 10 ? "0" + month1 : month1);
      let sDate = (year1.toString() + "/" + month1.toString());
      this.timeData.activeMonthRangeValue[0] = sDate
      let date2 = new Date();
      date2.setMonth(date2.getMonth())
      let year2 = date2.getFullYear();
      let month2 = date2.getMonth() + 1;
      month2 = (month2 < 10 ? "0" + month2 : month2);
      let eDate = (year2.toString() + "/" + month2.toString());
      this.timeData.activeMonthRangeValue[1] = eDate;
    },
    changeDateValue(val) {
      this.activeType = val;
      this.selectTime();
    },
    actived() {
      this.active = !this.active;
      if(Number(this.timeData.endYear) - Number(this.timeData.startYear) > 9){
        this.timeData.endYear = (new Date(this.timeData.startYear).getFullYear()+9).toString();
      }
    },
    openEndDate() {
      this.active = !this.active;
      this.$refs.endDate.focus();
    },
    selectTime(){
      if(this.activeType == '日'){
        this.timeObject.startTime = this.timeData.activeDayRangeValue[0];
        this.timeObject.endTime = this.timeData.activeDayRangeValue[1];
        this.timeObject.type = 'day';
      }else if(this.activeType == '月'){
        this.timeObject.startTime = this.timeData.activeMonthRangeValue[0];
        this.timeObject.endTime = this.timeData.activeMonthRangeValue[1];
        this.timeObject.type = 'month';
      }else{
        this.timeObject.startTime = this.timeData.startYear;
        this.timeObject.endTime = this.timeData.endYear;
        this.timeObject.type = 'year';
      }
      bus.$emit('timeObject',this.timeObject);
    }
  },
};
</script>

<style lang='scss' scoped>
@media screen and (min-width: 1910px) and (max-width: 1930px) {
  .project-analysis {
    /deep/ .el-date-editor .el-range-input {
      width: 100%;
    }
    .project-title {
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #3f5896;
      margin: 10px 10px 21px 18px;
    }
    .project-time {
      // margin-top: 21px;
      display: inline-block;
      position: relative;
      margin-left: 10px;
      // line-height: 50px;
      height: 50px;
      overflow: hidden;
      /deep/ .year-picker {
        background-color: #fff;
        border-radius: 25px;
        border: 1px solid #dee2eb;
        display: inline-block;
        // width: 270px;
        height: 48px;
        // padding: 2px 0 0 0;
        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 80px;
          text-align: center;
          font-size: inherit;
          margin-top: 9px;
          padding: 0 15px;
        }
        /deep/ .el-input--prefix .el-input__inner {
          background: transparent;
          border: transparent;
          text-align: center;
          height: 33px;
          font-size: 19px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #505356;
          padding: 0 !important;
        }
        /deep/ .el-date-editor .el-range-input {
          background: transparent;
          font-size: inherit;
          color: inherit;
        }
        .end-year-picker,
        .start-year-picker {
          i {
            margin: -4px 0 0 -5px;
            font-size: 14px;
          }
        }
      }
      .el-button {
        border-radius: 25px;
        width: 50px;
        height: 50px;
        border: 1px solid #dee2eb;
        color: #3d5695;
        padding: 0;
        margin: 0 16px 0 0;
        font-size: 19px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
      }
    }
    .btn1 {
      background-color: rgba(0, 206, 209, 1) !important;
      color: #fff !important;
    }
    /deep/ .el-range-editor.el-input__inner {
      height: 50px;
      border-radius: 25px;
      border: 1px solid #dee2eb;
      bottom: 4px;
    }
    /deep/ .el-date-editor .el-range-separator {
      margin-top: 8px;
      font-size: 19px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #505356;
    }
    /deep/ .el-date-editor .el-range-input {
      font-size: 19px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #505356;
      height: 26px;
    }
  }
}
@media screen and (min-width: 1430px) and (max-width: 1450px) {
  .project-analysis {
    /deep/ .el-date-editor .el-range-input {
      width: 100%;
    }
    .project-title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #3f5896;
      margin: 16px 0 16px 8px;
    }
    .project-time {
      // margin-top: 21px;
      position: relative;
      margin-left: 10px;
      /deep/ .year-picker {
        background-color: #fff;
        border-radius: 18.75px;
        border: 1px solid #dee2eb;
        display: inline-block;
        // width: 270px;
        height: 35.5px;

        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 60px;
          text-align: center;
          font-size: inherit;
          margin-top: 10px;
          padding: 0 15px;
        }
        /deep/ .el-input--prefix .el-input__inner {
          background: transparent;
          border: transparent;
          text-align: center;
          height: 20px;
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #505356;
          padding: 0 !important;
        }
        /deep/ .el-date-editor .el-range-input {
          background: transparent;
          font-size: inherit;
          color: inherit;
        }
        .end-year-picker,
        .start-year-picker {
          i {
            margin: -10px 0 2px -6px;
            font-size: 14px;
          }
        }
      }
      .el-button {
        border-radius: 18.75px;
        width: 37.5px;
        height: 37.5px;
        border: 1px solid #dee2eb;
        color: #3d5695;
        padding: 0;
        margin: 0 12px 0 0;
        font-size: 14px;

        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
      }
    }
    .btn1 {
      background-color: rgba(0, 206, 209, 1) !important;
      color: #fff !important;
    }
    /deep/ .el-range-editor.el-input__inner {
      height: 37.5px;
      border-radius: 18.75px;
      border: 1px solid #dee2eb;
      width: 240px;
    }
    /deep/ .el-date-editor .el-range-separator {
      margin-top: 0;
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #505356;
    }
    /deep/ .el-date-editor .el-range-input {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #505356;
      width: 90px;
    }
  }
}
</style>