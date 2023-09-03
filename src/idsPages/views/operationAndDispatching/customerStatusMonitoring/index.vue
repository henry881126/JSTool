/**
 * @Description:客户状态监控
 * @author XiaoLong Zhang
 * @date 2021/11/4
*/
<template>
  <div class="customerStatusMonitoring-wrapper gas-page-bg">
    <top-menu title="天然气输配（调度）智慧管理平台"></top-menu>
    <div class="content-wrapper">
      <!-- 标题 -->
      <div class="title">
        <div class="nav">
          <span class="t1">客户状态监控</span>
          <div class="select-block">
            <MultipleSelect
              @change="getCustomerMonitorList"
              v-model="form.contractType"
              :options="optionDirectSalesCustomer"
              :firstOption="{ label: '全部客户', code: 'direct' }"
            ></MultipleSelect>
            <MultipleSelect
              @change="getCustomerMonitorList"
              v-model="form.keyCustomer"
              :options="optionKeyCustomer"
              :firstOption="{ label: '全部客户类型', code: 'key' }"
            ></MultipleSelect>
            <MultipleSelect
              @change="getCustomerMonitorList"
              v-model="form.customerState"
              :options="optionCustomerState"
              :firstOption="{ label: '全部状态', code: 'state' }"
            ></MultipleSelect>
            <MultipleSelect
              @change="getCustomerMonitorList"
              v-model="form.industryCode"
              :options="optionCustomLabel"
              :firstOption="{ label: '自定义标签', code: 'label' }"
            ></MultipleSelect>
            <el-input
              class="custom-search"
              clearable
              v-model="form.customerName"
              placeholder="请输入客户名称/关键字"
              :maxlength="50"
              @keyup.enter.native="getCustomerMonitorList"
            ></el-input>
            <el-button
              type="primary"
              class="custom-btn"
              round
              @click="getCustomerMonitorList(true)"
            >
              <i class="el-icon-search"></i>
              查询
            </el-button>
          </div>
        </div>
      </div>
      <!-- 内容部分 -->
      <div class="customerStatusMonitoring-content-box">
        <!--列表-->
        <div class="customerStatusMonitoring-list">
          <el-table
            ref="table"
            :data="monthList"
            height="840"
            :header-cell-style="{ color: '#303133' }"
            :row-class-name="rowClassName"
            @row-click="clickRow"
          >
            <el-table-column width="25">
              <template slot-scope="scope">
                <div
                  class="circle"
                  :class="{ checked: scope.$index === radio }"
                >
                  <div class="mini-circle"></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="customerName"
              label="客户名称"
              width="300"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span class="customer-name" :title="scope.row.customerName">
                  {{ scope.row.customerName || "--" }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="pressure"
              :label="'压力\n(MPa)'"
              :render-header="renderheader"
              width="70"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.pressure ? scope.row.pressure : "--" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="temperature"
              :label="'温度\n(℃)'"
              :render-header="renderheader"
              width="70"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.temperature ? scope.row.temperature : "--" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="instantFlow"
              :label="'总瞬流\n(Nm³/h)'"
              :render-header="renderheader"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.instantFlow ? scope.row.instantFlow : "--" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="reviewGasNum"
              :label="'批复量\n（Nm³）'"
              :render-header="renderheader"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.reviewGasNum ? scope.row.reviewGasNum : "--" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="usedVolume"
              :label="'已提取\n（Nm³）'"
              :render-header="renderheader"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.usedVolume ? scope.row.usedVolume : "--" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="overUnder"
              :label="'超欠提\n（Nm³）'"
              :render-header="renderheader"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.overUnder ? scope.row.overUnder : "--" }}
              </template>
            </el-table-column>
          </el-table>
          <div class="page-box">
            <el-pagination
              popper-class="select_bottom"
              layout="total, sizes, prev, pager, next, jumper"
              background
              class="page-content custom-page-n"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="form.pageNum"
              :page-sizes="[20, 30, 40, 50]"
              :page-size="form.pageSize"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
        <!--折线图-->
        <div class="customerStatusMonitoring-chart">
          <PressureChart :customerCode="customerCode" />
          <AirVolumeChart :customerCode="customerCode" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopMenu from "@/components/topMenu/topMenu2";
import MultipleSelect from "./components/MultipleSelect";
import PressureChart from "./components/PressureChart";
import AirVolumeChart from "./components/AirVolumeChart";
import {
  getKeyCustomer,
  getCustomerMonitorList,
  getKeyCustomerLabels,
} from "@/idsPages/api/customerStatusMonitoring";
export default {
  name: "monitorAndControl",
  components: {
    TopMenu,
    MultipleSelect,
    PressureChart,
    AirVolumeChart,
  },
  data() {
    return {
      radio: 0,
      customerCode: "",
      monthList: null,
      optionDirectSalesCustomer: [],
      optionKeyCustomer: [
        {
          label: "非重点客户",
          value: "0",
        },
        {
          label: "重点客户",
          value: "1",
        },
      ],
      optionCustomerState: [],
      optionCustomLabel: [],
      dateTime: "",
      timer: null,
      total: 0,
      form: {
        pageNum: 1,
        pageSize: 20,
        contractType: [], // 直销客户
        keyCustomer: [], // 全部客户
        customerState: [], // 全部状态
        industryCode: [], //自定义标签
        customerName: "", // 客户名称/关键字
      },
    };
  },
  created() {},
  mounted() {
    this.getOption();
    this.$route.params.type
      ? this.form.contractType.push(this.$route.params.type)
      : "";
    this.getCustomerMonitorList();
    this.refreshInterface();
  },
  methods: {
    //获取直销客户 option
    getCustomerMonitorList(isEarch) {
      getCustomerMonitorList(this.form).then((res) => {
        this.total = res.data.total;
        this.monthList = res.data.list;
        // if (!isRefresh) {
        //
        if (isEarch) {
          this.radio = 0;
        }
        if (res.data.list.length) {
          this.customerCode = res.data.list[0].customerCode;
        } else {
          this.customerCode = "";
        }
      });
    },
    getOption() {
      //获取全部客户 option
      getKeyCustomer({
        dictType: "smartCustomerType",
        cpmoCop: "10010600",
      }).then((res) => {
        this.optionDirectSalesCustomer = res.data;
      });
      getKeyCustomerLabels({
        labelType: "customerState",
        cpmoCop: "10010600",
      }).then((res) => {
        this.optionCustomerState = res.data;
      });
      getKeyCustomerLabels({ labelType: "industry", cpmoCop: "10010600" }).then(
        (res) => {
          this.optionCustomLabel = res.data;
        }
      );
    },
    renderheader(h, { column }) {
      return h("span", {}, [
        h("span", {}, column.label.split("-")[0]),
        h("br"),
        h("span", {}, column.label.split("-")[1]),
      ]);
    },
    rowClassName({ row, rowIndex }) {
      row._index = rowIndex;
    },
    // 点击月客户分析列表行
    clickRow(row) {
      const { _index, customerCode } = row;
      this.radio = _index;
      this.customerCode = customerCode;
    },
    handleSizeChange(val) {
      if (val !== 20) {
        this.form.pageNum = 1;
      }
      this.form.pageSize = val;
      this.getCustomerMonitorList();
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.getCustomerMonitorList();
    },
    // 页面定时刷新
    refreshInterface() {
      this.timer = setInterval(() => {
        this.getCustomerMonitorList();
      }, 180000);
    },
  },
  destroyed() {
    //清除定时器
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss">
.customerStatusMonitoring-wrapper {
  .customerStatusMonitoring-list .el-table::before {
    height: 0px;
  }
  @media screen and (max-width: 1470px) {
    .page-content .el-select .el-input__inner {
      background: #47a87d;
    }
    .page-content .el-select .el-input__suffix {
      border-left: none;
    }
  }
  @media screen and (max-width: 1920px) {
    .page-content .el-select .el-input__suffix {
      border-left: none;
    }
  }
  .page-content .el-select .el-input__inner {
    height: 28px;
    line-height: 28px;
    background: #47a87d;
    color: #fff;
    border: none;
  }
  .select_bottom {
    .el-select-dropdown__item.selected {
      color: #47a87d;
    }
    .el-select-dropdown__item.hover,
    .el-select-dropdown__item:hover {
      background: #47a87d;
      color: #fff;
    }
  }
  .custom-search {
    width: 280px;
    .el-input__inner {
      width: 100%;
      height: 32px;
      line-height: 32px;
      border-radius: 100px;
    }
    .el-input__suffix {
      top: -5px;
    }
  }
  .custom-btn {
    margin-left: 10px;
    border-radius: 16px !important;
    padding: 8px 23px !important;
  }
}
</style>
<style lang='scss' rel='stylesheet/scss' scoped>
.customerStatusMonitoring-wrapper {
  width: 100%;
  position: relative;
  .content-wrapper {
    position: relative;
    background: #fff;
    border-radius: 10px;
    margin: 17px 24px;
    padding: 20px 20px 0 20px;
    box-sizing: border-box;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      margin-bottom: 28px;
      .nav {
        display: flex;
        align-items: center;
      }
      .t1 {
        height: 25px;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        line-height: 25px;
        display: inline-block;
        margin-right: 10px;
      }
      .select-block {
        margin-left: 10px;
        .search-box {
          display: flex;
          float: right;
          justify-content: space-between;
          align-items: center;
          width: 280px;
          height: 30px;
          border-radius: 100px;
          border: solid 1px #dcdfe6;
          border-right: none;
          padding-left: 15px;
          input {
            border: none;
            background: none;
            height: 30px;
            width: 100%;
            margin-right: 3px;
            outline: none;
          }
          input::placeholder {
            color: #c0c4cc;
          }
          .search-btn {
            width: 40px;
            height: 30px;
            background: #47a87d;
            border-radius: 0 100px 100px 0;
            border: solid 1px #47a87d;
            text-align: center;
            line-height: 30px;
            cursor: pointer;
            img {
              display: inline-block;
              width: 12px;
            }
          }
        }
      }
      .t2 {
        width: 184px;
        height: 22px;
        font-size: 16px;
        font-weight: 400;
        color: #909399;
        line-height: 20px;
      }
    }
    .customerStatusMonitoring-content-box {
      display: flex;
      justify-content: space-between;
      .customerStatusMonitoring-list {
        width: 50%;
        height: 900px;
        .circle {
          position: relative;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 1px solid #ccc;
          background: white;

          &.checked {
            background: #1ab394;
          }

          .mini-circle {
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            top: 0;
            margin: auto;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: white;
          }
        }
        .indent {
          color: #ff0000;
        }
        .customer-name {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .page-box {
          position: absolute;
          bottom: 12px;
          left: 25%;
          transform: translateX(-50%);
          text-align: center;
          .page-content {
            display: inline-block;
          }
        }
      }
      .customerStatusMonitoring-chart {
        width: 50%;
        height: 100%;
      }
    }
  }
}
</style>
