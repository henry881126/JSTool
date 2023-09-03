<template>
  <div class="container">
    <div class="is-date-dark">
      <el-date-picker
        v-model='time'
        type='daterange'
        range-separator='-'
        format="yyyy/MM/dd"
        :picker-options='pickerOptions'
        start-placeholder='开始日期'
        end-placeholder='结束日期'
        @change='handleDateRangeChange'
        :class="{
          'date-picker': true,
          'is-dark': true,
        }"
      >
      </el-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const oneDay = 24 * 60 * 60 * 1000
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    const oneMonth = 30 * 24 * 60 * 60 * 1000
    return {
      time:[new Date()-sevenDays,new Date()],     // 日期选择器默认值(当前日期前七天至当前日期)
      startTime:null,   // 选中的开始时间
      endTime:null,    // 选中的结束时间

      pickerOptions: {
        onPick: (obj) => {
          this.startTime = new Date(obj.minDate).getTime()
          this.endTime = new Date(obj.maxDate).getTime()
        },
        disabledDate: (time) => {
          if (this.startTime) {   // 从日期选择器中单击选择起始时间后，日期选择有效范围规则
            let maxTime = this.startTime + oneMonth;
            let minTime = this.startTime - oneMonth;
            return (
              // time.getTime() > maxTime || time.getTime() < minTime || time.getTime() > Date.now()
              // 选择范围为：当前起始时间开始的连续三十天，但连续三十天不能超过当天的日期
              time.getTime() > maxTime || time.getTime() < minTime || time.getTime() > Date.now()
            );
          } else {
            // 未单击日期选择器的某日期时，默认的日期选择有效范围：当天之前
            return time.getTime() > Date.now();
          }
        },
      },      
    }
  },
  methods: {
    handleDateRangeChange(dates) {
      // console.log('date change',dates)
    }
  },
  watch: {
    time: {
      handler(val) {
        this.$emit('handleDateChange',val)
      }
    }
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import "@/assets/styles/mixins";
.container {
  .is-dark {
    color: #ffffff;
    background: #567db9;
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
</style>