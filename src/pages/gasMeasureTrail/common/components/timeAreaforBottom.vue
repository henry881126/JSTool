<template>
  <div class="time-area-content">
    <ul>
      <li
        v-for="(item, index) in typeList"
        :key="item.id"
        :class="{
          'normal-label': true,
          'is-active': item.active,
          'is-light': true,
        }"
        @click="liChanged(index)"
      >
        {{ item.name }}
      </li>
    </ul>
    <div class="is-date-light">
      <el-date-picker
        v-if="activeType === '日' && type === 'default'"
        v-model="timeData.activeDayValue"
        type="date"
        :class="{
          'date-picker': true,
          'is-light': true,
        }"
        key="day"
        :picker-options="dateOption"
        value-format="yyyy/MM/dd"
        format="yyyy/MM/dd"
        placeholder="选择日期"
      >
      </el-date-picker>
      <el-date-picker
        v-if="activeType === '周' && type === 'default'"
        v-model="timeData.activeWeekValue"
        type="week"
        :class="{
          'date-picker': true,
          'is-light': true,
        }"
        key="week"
        :picker-options="weekOption"
        format="yyyy/WW"
        placeholder="选择周"
      >
      </el-date-picker>
    </div>
  </div>
</template>

<script>
import {
  getDefaultDay,
  getDefaultWeek,
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
      dateOption: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
      weekOption: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
      activeType: "日",
      timeData: {
        activeDayValue: "",
        activeWeekValue: "",
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
    "timeData.activeDayValue": {
      handler(val) {
        if (val) {
          this.$emit("timeValueChange", {
            type: "day",
            data: val,
          });
          console.log("kkkkkday", val);
        }
      },
    },
    "timeData.activeWeekValue": {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.$emit("timeValueChange", {
              type: "week",
              data: document
                .querySelector(".is-date-light")
                .querySelector(".el-input__inner").value,
            });
          });
        }
      },
    },
  },
  created() {
    if (this.effect === "dark") {
      if (this.type === "default") {
        this.initDefaultDayRange();
      } else {
        this.initDefalutYear();
      }
    } else {
      if (this.type === "default") {
        this.initDefalutDay();
      } else {
        this.initDefalutWeek();
      }
    }
  },
  methods: {
    initDefalutDay() {
      this.timeData.activeDayValue = getDefaultDay();
    },
    initDefalutWeek() {
      this.timeData.activeWeekValue = getDefaultWeek();
    },
    setDefault() {
      if (this.activeType === "日") {
        this.initDefalutDay();
        this.$emit("timeValueChange", {
          type: "day",
          data: this.timeData.activeDayValue,
        });
      } else {
        this.initDefalutWeek();
        this.$nextTick(() => {
          this.$emit("timeValueChange", {
            type: "week",
            data: document
              .querySelector(".is-date-light")
              .querySelector(".el-input__inner").value,
          });
        });
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
      li {
        display: inline-block;
        padding: 10px 14px;
        font-size: 16px;
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
    .is-date-light {
      display: inline-block;
      /deep/ {
        @include elDate1920(#ffffff, 1px solid rgba(33, 33, 35, 0.17), #333333);
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
    .is-date-light {
      display: inline-block;
      /deep/ {
        @include elDate1440(#ffffff, 1px solid rgba(33, 33, 35, 0.17), #333333);
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