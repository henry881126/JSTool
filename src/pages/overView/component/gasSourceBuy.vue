<template>
  <div class="gus-trace-buy">
    <el-row>
      <div class="gas-title">
        <el-col :span="8" v-if="this.screenWidth == 1920"
          >气源采购(万方)</el-col
        >
        <el-col :span="9" v-else>气源采购(万方)</el-col>
        <el-col :span="14" v-if="this.screenWidth == 1920">
          <div class="tableStyle">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="昨日" name="first"></el-tab-pane>
              <el-tab-pane label="上月" name="second"></el-tab-pane>
              <el-tab-pane label="本年" name="third"></el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
        <el-col :span="12" v-else>
          <div class="tableStyle">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="昨日" name="first"></el-tab-pane>
              <el-tab-pane label="上月" name="second"></el-tab-pane>
              <el-tab-pane label="本年" name="third"></el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
        <!-- <span class="symbolStyle" @click="jumpRoute">></span> -->
      </div>
    </el-row>
    <gas-source-buy-table
      :selectDate="selectDate"
      :routeParam="routeParam"
    ></gas-source-buy-table>
  </div>
</template>
<script>
import gasSourceBuyTable from "./gasSourceBuyTable";
import {
  getYesterdayTime,
  getLastMonthTime,
  getCurrentYearTime,
} from "@/utils/dateTime";
export default {
  name: "GasSourceBuy",
  data() {
    return {
      activeName: "first",
      screenWidth: "",
      selectDate: {},
      routeParam: this.curCompany,
      flag:""
    };
  },
  props: {
    curCompany: String,
  },
  components: {
    gasSourceBuyTable,
  },
  methods: {
    handleClick() {
      if (this.activeName == "first") {
        this.selectDate = {
          time: getYesterdayTime(),
          timeUnit: 1,
        };
        window.zhuge.track('总览-气源采购-昨日')
      } else if (this.activeName == "second") {
        this.selectDate = {
          time: getLastMonthTime(),
          timeUnit: 3,
        };
        window.zhuge.track('总览-气源采购-上月')
      } else {
        this.selectDate = {
          time: getCurrentYearTime(),
          timeUnit: 4,
        };
        window.zhuge.track('总览-气源采购-本年')
      }
    },
    jumpRoute() {
       if (this.routeParam == "50311934") {
        this.flag = 'true'
      }else{
        this.flag = false
      }
      window.open(`/purchaseAnalysis?compCode=${this.routeParam}&flag=${this.flag}`, "_self");
    },
  },
  mounted() {
    this.screenWidth = window.screen.width;
    this.handleClick()
  },
  watch: {
    curCompany(val) {
      this.routeParam = val;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./common";
@media screen and (min-width: 1580px) {
  /deep/ .el-table .cell {
    line-height: 26px;
  }
  .gus-trace-buy {
    margin-top: 20px;
    padding: 14px 30px 11px 30px;
    height: 235px;
    border-radius: 12px;
    /deep/ .el-table td {
      padding: 0;
      background-color: #f0f2f7;
    }
    /deep/ .el-table th {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3f5896;
      padding: 0;
      &.is-leaf {
        border-bottom: none;
      }
      .cell {
        line-height: 20px;
      }
      /deep/ .el-tabs__nav {
        margin-top: -8px;
      }
      /deep/ .el-table::before {
        width: 0;
      }
      /deep/ .el-table tr {
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
        .cell {
          line-height: 26px !important;
        }
      }
      /deep/ .el-table .el-table__row {
        background-color: #f0f2f7;
        color: #333333;
      }
      /deep/ .el-table th .cell {
        color: #3f5896;
        background-color: #ffffff !important;
        line-height: 16px !important;
      }
      /deep/ .el-tabs__item {
        height: 30px;
        padding: 0 8px !important;
      }

      /deep/.tableStyle {
        height: 20px;
        line-height: 20px;
        margin-bottom: 5px;
      }
    }
    /deep/ .el-tabs__active-bar {
      background-color: #0fb2ab;
      position: absolute;
      height: 2px;
      top: 27px;
      line-height: 14px;
    }
    /deep/ .el-table::before {
      width: 0;
    }
    /deep/ .el-tabs__header {
      margin: 0;
    }
  }
  /deep/ .el-tabs__nav-scroll {
    margin: -6px 0 10px 0;
  }
  /deep/ .el-tabs__nav {
    font-family: PingFangSC-Regular, PingFang SC !important;
  }
  /deep/ .el-tabs__item {
    height: 28px;
    padding: 0 10px;

    font-family: PingFangSC-Regular, PingFang SC;
  }
}
@media screen and (max-width: 1580px)  {
  .gus-trace-buy {
    height: 176px;
    margin-top: 15px;
    .gas-table {
      flex: 1;
      margin-top: 2px;
      overflow: auto;
    }
    .gas-title {
      height: 28px;
      overflow: hidden;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #3f5896;
      padding: 0 7px 0 0;
      .symbolStyle {
        float: right;
        width: 10px;
        font-weight: 600;
      }
      /deep/ .el-tabs__nav {
        margin-top: -6px;
      }
    }
    /deep/ .el-table .el-table__row {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      background-color: #f0f2f7;
      .cell {
        line-height: 20px;
      }
    }
    /deep/ .el-table td {
      padding: 0;
    }
    /deep/ .el-table th .cell {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3f5896;
      height: 17px;
      line-height: 20px;
    }
    /deep/ .el-table__header {
      margin-top: -6px;
    }
    /deep/.tableStyle {
      height: 20px;
      line-height: 20px;
    }
    /deep/ .el-tabs__item {
      height: 28px;
      padding: 0 4px !important;
    }
  }
  /deep/ .el-tabs__nav-scroll {
    margin-top: 0 !important;
  }
}
</style>
