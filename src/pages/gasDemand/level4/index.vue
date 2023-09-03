<template>
  <div class="page-bg">
    <top-menu :date-picker-show="false"
              title="智慧分销"></top-menu>
    <div class="separator-wrapper">
      <el-breadcrumb separator="/" class="custom-separator">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>需求预测</el-breadcrumb-item>
        <el-breadcrumb-item>气量预测</el-breadcrumb-item>
      </el-breadcrumb>
      <weather-tip></weather-tip>
    </div>
    <div class="card-wrapper" v-if="toggleDate">
      <div class="title-wrapper">
        <span>气量预测</span>
        <span :class="{'custom-tab-btn': true, 'custom-tab-btn-active': this.toggleDate === 'd'}" @click="toggleDateHandle('d')" v-if="dayShow">日</span>
         <span :class="{'custom-tab-btn': true, 'custom-tab-btn-active': this.toggleDate === 'm'}" @click="toggleDateHandle('m')" v-if="monthShow">月</span>
         <span :class="{'custom-tab-btn': true, 'custom-tab-btn-active': this.toggleDate === 'y'}" @click="toggleDateHandle('y')" v-if="yearShow">年</span>
        <el-date-picker
            v-show="toggleDate === 'd'"
            v-model="d"
            format="yyyy/MM/dd"
            :clearable="false"
            :picker-options="pickerOptions"
            class="custom-datepicker-n">
        </el-date-picker>
        <el-date-picker
            v-show="toggleDate === 'm'"
            v-model="m"
            type="month"
            format="yyyy/MM"
            :clearable="false"
            :picker-options="monthPickerOptions"
            class="custom-datepicker-n">
        </el-date-picker>
        <el-date-picker
            v-show="toggleDate === 'y'"
            v-model="y"
            type="year"
            format="yyyy"
            :clearable="false"
            :picker-options="yearPickerOptions"
            class="custom-datepicker-n">
        </el-date-picker>
        <el-select v-model="yearType" v-show="toggleDate === 'y'" class="custom-select-n">
          <el-option label="合同年" :value="'1'"></el-option>
          <el-option label="自然年" :value="'2'"></el-option>
        </el-select>
      </div>
      <day v-if="toggleDate === 'd' && dayShow" :date="d"></day>
      <month v-if="toggleDate === 'm' && monthShow" :date="m"></month>
      <year v-if="toggleDate === 'y' && yearShow" :date="y" :type="yearType"></year>
    </div>
  </div>
</template>

<script>
import topMenu from "../../../components/topMenu/topMenu2";
import dateFormater from "../../../components/dateFormater/dateFormater";
import day from "./day"
import month from "./month";
import year from "./year"
import weatherTip from "../../../components/weatherTip/weatherTip1";
import api from "../../../http/api";
export default {
  name: "level4-demand",
  mixins: [dateFormater],
  data: function () {
    return {
      toggleDate: 'd',
      d: new Date(),
      m: new Date(),
      y: new Date(),
      dayShow: false,
      monthShow: false,
      yearShow: false,
      yearType: '1',
      pickerOptions: {
        disabledDate(time) {
          if(time.getTime() > Date.now() + 14*86400000) {
            return true
          }
        }
      },
      monthPickerOptions: {
        disabledDate(time) {
          let now = new Date()
          if(time.getFullYear() <= now.getFullYear()) {
            if(time.getMonth() > now.getMonth() + 1) {
              return true
            }
          } else {
            if(time.getMonth() > 0) {
              return true
            } else if(now.getMonth() !== 11) {
              return true
            }
          }
        }
      },
      yearPickerOptions: {
        disabledDate(time) {
          if(time.getFullYear() > new Date().getFullYear() + 1 || time.getFullYear() < new Date().getFullYear() - 1) {
            return true
          }
        }
      },
    }
  },
  components: {
    topMenu,
    day,
    month,
    year,
    weatherTip
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
          this.btnShow()
        }
      }
    }
  },
  created() {
    this.btnShow()
  },
  methods: {
    btnShow: function () {
      api.gasDemand.showBtn({
        resourceValue: this.$store.getters.currentMenu.resourceValue,
        userName: this.$store.getters.userInfo.name,
        ecode: this.$store.getters.curComInfo.orgCode
      }).then(res => {
        this.dayShow = res.day
        this.monthShow = res.month
        this.yearShow = res.year
        if(res.day) {
          this.toggleDate = 'd'
        } else if(res.month) {
          this.toggleDate = 'm'
        } else if(res.year) {
          this.toggleDate = 'y'
        }
      })
    },
    toggleDateHandle: function (dateType) {
      if(this.toggleDate === dateType) {
        return false
      }
      this.toggleDate = dateType
    },
  }
}
</script>

<style scoped lang="scss">
.page-bg {
  min-width: 1060px;
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
.custom-select-n {
  vertical-align: top;
  margin-left: 20px;
}
</style>