<template>
  <div class="gas-table">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        prop="gasSourceSuperior"
        label="资源方"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="gas_source_type"
        label="气源类型"
        v-if="this.screenWidth == 1920"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="gas_source_type"
        label="气源类型"
        v-else
        width="88"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="inAmount" label="进气量" show-overflow-tooltip>
        <template slot-scope="scope">
          {{Number(scope.row.inAmount).toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column prop="gasRatio" label="占比" show-overflow-tooltip>
        <template slot-scope="scope">
          {{(Number(scope.row.gasRatio)*100).toFixed(2)}}%
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  getYesterdayTime,
  getLastMonthTime,
  getCurrentYearTime,
} from "@/utils/dateTime";
export default {
  name: "GasSourceBuyTable",
  data() {
    return {
      screenWidth: "",
      tableData: [],
      companyCode: this.routeParam,
    };
  },
  props: {
    selectDate: Object,
    routeParam: String,
  },
  mounted() {
    this.screenWidth = window.screen.width;
    this.init();
  },
  methods: {
    async init() {
      let params = {
        companyCode: this.companyCode,
        time: this.selectDate.time || getYesterdayTime(),
        timeUnit: this.selectDate.timeUnit || 1,
      };
      let res = await this.$api.getGasPurchase(params);
      if (res.resultCode == 0) {
        this.tableData = res.data;
      } else {
        this.$message.error("请求失败");
      }
    },
  },
  watch: {
    selectDate(val) {
      if (val) {
        this.selectDate = val;
        this.init();
      }
    },
    routeParam(val) {
      if(val) {
        this.companyCode = val;
        this.init();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.gas-table {
  height: 160px;
  overflow: auto;
  /deep/ .el-table td,
  .el-table th.is-leaf {
    border-bottom: none;
  }
  /deep/ .el-table tbody tr:last-child{
    color: #3f5896;
    font-weight: 500;
    font-family: PingFangSC-Medium, PingFang SC;
    td{
       background-color: rgba(63, 88, 150, 0.14);
    }
  }
  /deep/ .el-table--scrollable-x .el-table__body-wrapper {
    overflow: hidden;
  }
  /deep/ .el-table__body {
    border-collapse: separate;
    border-spacing: 0px 8px;
  }
}
@media screen and (max-width: 1460px) and (min-width: 1420px) {
  /deep/ .el-table__body {
    border-collapse: separate;
    border-spacing: 0px 3px !important;
  }
  /deep/ .el-table th{
    padding: 2px 0 6px 0;
  }
  /deep/ .el-table::before{
    width: 0;
  }
  /deep/ .el-table th.is-leaf {
    border-bottom: none;
  }
}
</style>

