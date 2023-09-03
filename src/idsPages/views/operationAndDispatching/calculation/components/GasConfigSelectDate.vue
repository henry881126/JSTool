<template>
  <el-date-picker
    v-model="date"
    type="date"
    format="yyyy-MM-dd"
    value-format="yyyy-MM-dd"
    :placeholder="placeHolder"
    :picker-options="pickerOptions"
    @change="changeDate"
    clearable
  >
  </el-date-picker>
</template>

<script>
import moment from "moment";
export default {
  props: {
    isPrePlanPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      date: "",
    };
  },
  computed: {
    placeHolder() {
      return this.isPrePlanPage ? "请选择历史工况" : "请选择日期";
    },
    pickerOptions() {
      if (this.isPrePlanPage) {
        return {
          disabledDate(time) {
            // 返回值为true表示不可选，false表示可选
            return (
              time.getTime() > moment(Date.now()).subtract(1, "day").valueOf()
            );
          },
        };
      } else {
        return {
          disabledDate(time) {
            // 返回值为true表示不可选，false表示可选
            return time.getTime() > moment(Date.now()).add(1, "day").valueOf();
          },
        };
      }
    },
  },
  created() {
    if (!this.isPrePlanPage) {
      this.date = moment(new Date()).format("YYYY-MM-DD");
    }
  },
  methods: {
    changeDate(value) {
      let tempVariableOfDate = value;
      // 预案库模式下清空选择日期
      if (this.isPrePlanPage) {
        this.date = "";
      }
      // 调用父级方法将当前参数传出
      this.$emit("planDateChange", tempVariableOfDate);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>