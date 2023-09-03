<template>
  <div class="time-area-content">
    <ul v-if="type === 'default'">
      <li
        v-for="(item, index) in typeList"
        :key="item.id"
        :class="{
          'normal-label': true,
          'is-active': item.active,
          'is-dark': true,
        }"
        @click="liChanged(index)"
      >
        {{ item.name }}
      </li>
    </ul>
    <div v-if="effect === 'dark'" class="is-date-dark">
      <el-date-picker
        v-if="activeType === '日' && type === 'default'"
        v-model="timeData.activeDayRangeValue"
        type="daterange"
        :class="{
          'date-picker': true,
          'is-dark': true,
        }"
        value-format="yyyy/MM/dd"
        format="yyyy/MM/dd"
        range-separator="至"
        @change="dateRangeChange"
        :picker-options="pickerDayOptions"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <date-week-range
        v-model="timeData.activeWeekRangeValue"
        v-if="activeType === '周' && type === 'default'"
        type="daterange"
        :class="{
          'date-picker': true,
          'is-dark': true,
          'is-week-range': true,
        }"
        id="weekRange"
        @change="weekRangeChange"
        :picker-options="pickerWeekOptions"
        range-separator="至"
        start-placeholder="开始周"
        end-placeholder="结束周"
      >
      </date-week-range>
      <el-date-picker
        :class="{
          'date-picker': true,
          'is-dark': true,
        }"
        v-if="type === 'one-year'"
        v-model="timeData.activeYearValue"
        type="year"
        :picker-options="yearOption"
        value-format="yyyy"
        placeholder="选择年"
      >
      </el-date-picker>
    </div>
  </div>
</template>

<script>
import {
  getDefaultWeekRange,
  getDefaultDayRange,
  getDefaultYear,
} from "./../utils/timeUtils";
import dateWeekRange from "date-week-range";
// import "date-week-range/dist/date-picker.css";
export default {
  name: "",
  components: {
    dateWeekRange,
  },
  props: {
    effect: {
      type: String,
      require: false,
      default() {
        return "dark";
      },
    },
    type: {
      type: String,
      require: false,
      default() {
        return "default";
      },
    },
  },
  data() {
    return {
      pickerMinDate: null, //第一次选中的时间
      pickerDayOptions: {
        onPick: (obj) => {
          this.pickerMinDate = new Date(obj.minDate).getTime();
        },
        disabledDate: (time) => {
          if (this.pickerMinDate) {
            const day1 = 30 * 24 * 3600 * 1000;
            let maxTime = this.pickerMinDate + day1;
            let minTime = this.pickerMinDate - day1;

            return (
              time.getTime() > maxTime ||
              time.getTime() < minTime ||
              time.getTime() > Date.now()
            );
          } else {
            return time.getTime() > Date.now();
          }
        },
      },
      pickerMinWeek: null, //第一次选中的时间
      pickerWeekOptions: {
        onPick: (obj) => {
          this.pickerMinWeek = new Date(obj.minDate).getTime();
        },
        disabledDate: (time) => {
          if (this.pickerMinWeek) {
            const day1 = 7 * 12 * 24 * 3600 * 1000;
            let maxTime = this.pickerMinWeek + day1;
            let minTime = this.pickerMinWeek - day1;

            return (
              time.getTime() > maxTime ||
              time.getTime() < minTime ||
              time.getTime() > Date.now()
            );
          } else {
            return time.getTime() > Date.now();
          }
        },
      },
      yearOption: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
      activeType: "日",
      timeData: {
        activeDayRangeValue: "",
        activeWeekRangeValue: "",
        activeYearValue: "",
      },

      typeList: [
        {
          id: 2,
          name: "日",
          active: true,
        },
        {
          id: 3,
          name: "周",
          active: false,
        },
      ],
    };
  },
  computed: {},
  watch: {
    "timeData.activeDayRangeValue": {
      handler(val) {
        if (this.activeType === "日" && this.type === "default" && val) {
          this.$emit("timeValueChange", {
            type: "day-range",
            data: val,
          });
          console.log("mmmmday", val);
        }
      },
    },
    "timeData.activeWeekRangeValue": {
      handler(val) {
        if (this.activeType === "周" && this.type === "default" && val) {
          this.$nextTick(() => {
            this.$emit("timeValueChange", {
              type: "week-range",
              data: this.transWeekData(val),
            });
          });
        }
      },
    },
    "timeData.activeYearValue": {
      handler(val) {
        if (this.type === "one-year" && val && val.length > 0) {
          this.$emit("timeValueChange", {
            type: "year",
            data: val,
          });
          console.log("mmmmyear", val);
        }
      },
    },
  },
  created() {
    if (this.type === "default") {
      this.initDefaultDayRange();
    } else {
      this.initDefalutYear();
    }
  },
  methods: {
    dateRangeChange(val) {
      if (!val) {
        this.pickerMinDate = null;
      }
    },
    weekRangeChange(val) {
      if (!val) {
        this.pickerMinWeek = null;
      }
    },
    initDefaultDayRange() {
      this.timeData.activeDayRangeValue = getDefaultDayRange();
    },
    initDefaultWeekRange() {
      this.timeData.activeWeekRangeValue = getDefaultWeekRange();
    },
    initDefalutYear() {
      this.timeData.activeYearValue = getDefaultYear();
    },

    transWeekData() {
      const startWeek = document
        .querySelectorAll(".el-range-input")[0]
        .value.replace("-", "/");
      const endWeek = document
        .querySelectorAll(".el-range-input")[1]
        .value.replace("-", "/");
      return [startWeek, endWeek];
    },

    setDefault() {
      if (this.activeType === "日") {
        this.initDefaultDayRange();
      } else {
        this.initDefaultWeekRange();
      }
    },

    liChanged(index) {
      this.activeType = this.typeList[index].name;
      this.setDefault();

      this.typeList = this.typeList.map((item, indexi) => {
        item.active = indexi === index;
        return item;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/mixins";

@media screen and (min-width: 1610px) {
  .time-area-content {
    z-index: 1999;
    ul {
      display: inline-block;
      width: fit-content;
      list-style-type: none;
      font-size: 16px;
      li {
        display: inline-block;
        padding: 10px 14px;
        margin-right: 10px;
      }
      .normal-label {
        border-radius: 50%;
      }
      .is-dark {
        color: #ffffff;
        background: #567db9;
      }
      .is-light {
        color: #333333;
        background: #ffffff;
        border: 1px solid rgba(33, 33, 35, 0.17);
      }
      .is-active {
        background: #31c8b5;
        color: #ffffff;
      }
    }

    .is-date-dark {
      display: inline-block;
      width: auto;
      /deep/ {
        @include elDate1920(#567db9, unset, #ffffff);
      }
    }
    /deep/ {
      .el-date-editor--weekrange,
      .el-date-editor--daterange {
        width: 270px;
      }
    }
  }
}
@media screen and (max-width: 1609px) {
  .time-area-content {
    z-index: 1999;
    ul {
      display: inline-block;
      width: fit-content;
      list-style-type: none;

      li {
        display: inline-block;
        padding: 8px 11px;
        font-size: 14px;
        margin-right: 10px;
      }
      .normal-label {
        border-radius: 50px;
      }
      .is-dark {
        color: #ffffff;
        background: #567db9;
      }
      .is-light {
        color: #333333;
        background: #ffffff;
        border: 1px solid rgba(33, 33, 35, 0.17);
      }
      .is-active {
        background: #31c8b5;
        color: #ffffff;
      }
    }

    .is-date-dark {
      display: inline-block;
      width: auto;
      /deep/ {
        @include elDate1440(#567db9, unset, #ffffff);
      }
    }
    /deep/ {
      .el-date-editor--weekrange,
      .el-date-editor--daterange {
        width: 270px;
      }
    }
  }
}
</style>