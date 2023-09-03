<template>
  <div class="custom-table">
    <el-table
      ref="refTable"
      v-loading="loading"
      :data="tableData"
      height="100%"
      @row-click="openDetail"
      @select-all="selectAllHandle"
      @select="handleSelect"
      @selection-change="handleSelectionChange"
      :default-sort="defaultProp"
      :header-cell-style="cellStyle"
      :cell-style="cellStyle"
    >
      <slot name="checkbox" />
      <el-table-column
        v-for="(item, index) in conf"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :sortable="item.isSort ? item.isSort : false"
        align="left"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            v-if="item.showWarn && showWarn(scope.row, item.prop)"
            style="color: red"
          >
            {{ scope.row[item.prop] }}
          </span>
          <span v-else>
            {{ scope.row[item.prop] }}
          </span>
        </template>
      </el-table-column>
      <slot name="status" />
      <slot name="operate" />
    </el-table>
  </div>
</template>
<script>
export default {
  name: "commonTable",
  data() {
    return {
      activeIndex: null,
    };
  },
  mounted() {
    this.$emit("tableMounted");
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    lastColoumBlue: {
      type: Boolean,
      default: false,
    },
    defaultProp: {
      type: Object,
      default: () => {},
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    conf: {
      type: Array,
      default: () => [],
    },
    stripe: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    showWarn(row, prop) {
      if (
        prop === "deviationAssessment" &&
        row["deviationAssessmentSymbol"].toString() === "1"
      ) {
        return true;
      }
      if (
        prop === "forecastDeviationRatio" &&
        row["forecastDeviationRatioSymbol"].toString() === "1"
      ) {
        return true;
      }
      return false;
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (this.lastColoumBlue) {
        if (columnIndex === 3) {
          return "color:rgba(39, 119, 212, 1)";
        }
      }
    },

    openDetail(row, event, column) {
      this.activeIndex = this.tableData.findIndex((item) => item.id === row.id);
      console.log("rowClick", row, event, column, this.activeIndex);
      this.$emit("rowClick", { row, event, column });
    },
    handleSelect(select, row) {
      this.$emit("handleSelect", { select, row });
    },
    selectAllHandle(select) {
      this.$emit("selectAllHandle", select);
    },
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    sortChange(column) {
      this.$emit("sortChange", column);
    },
    tableOriginMethod() {
      return this.$refs.refTable;
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1910px) {
  //大分辨率，兼容1920
  .custom-table {
    overflow-y: auto;
    height: 100%;
    /deep/.el-table {
      .el-table__body-wrapper {
        height: calc(100% - 50px) !important;
      }
      &::before {
        height: 0;
      }
      th {
        background: #f2f4f8;
        font-weight: 600;
        font-size: 15px;
        color: $tableHColor;
        padding: 18px 0;
        &:first-child {
          border-radius: 10px 0px 0px 10px;
          padding-left: 12px;
        }
        &:last-child {
          border-radius: 0px 10px 10px 0px;
          padding-right: 12px;
        }
      }
      tr {
        background: #ffffff;
        // height: 50px;
        // line-height: 50px;
        border: 1px solid #ccc;
        border-radius: 20px;
        &:nth-child(odd) {
          background: #ffffff;
        }
        &:nth-child(even) {
          background: #f2f4f8;
        }
        td {
          border: none;
          font-size: 16px;
          padding: 13.5px 0px;
          &:first-child {
            border-radius: 40px 0px 0px 40px;
            padding-left: 12px;
          }
          &:last-child {
            border-radius: 0px 40px 40px 0px;
            padding-right: 12px;
          }
        }
      }
    }
    /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
      background: unset !important;
    }
  }
}
@media screen and (max-width: 1909px) {
  //小分辨率 ，兼容1440
  .custom-table {
    overflow-y: auto;
    height: 100%;
    /deep/.el-table {
      .el-table__body-wrapper {
        height: calc(100% - 50px) !important;
      }
      &::before {
        height: 0;
      }
      th {
        background: #f2f4f8;
        font-weight: 600;
        font-size: 14px;
        color: $tableHColor;
        padding: 10.5px 0px;
        &:first-child {
          border-radius: 10px 0px 0px 10px;
          padding-left: 12px;
        }
        &:last-child {
          border-radius: 0px 10px 10px 0px;
          padding-right: 12px;
        }
      }
      tr {
        background: #ffffff;
        border: 1px solid #ccc;
        border-radius: 20px;
        &:nth-child(odd) {
          background: #ffffff;
        }
        &:nth-child(even) {
          background: #f2f4f8;
        }
        td {
          border: none;
          font-size: 14px;
          padding: 8.5px 0px;
          &:first-child {
            border-radius: 30px 0px 0px 30px;
            padding-left: 12px;
          }
          &:last-child {
            border-radius: 0px 30px 30px 0px;
            padding-right: 12px;
          }
        }
      }
    }
    /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
      background: unset !important;
    }
  }
}
.last-col-blue {
  color: rgba(39, 119, 212, 1);
}
</style>