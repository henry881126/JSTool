<template>
  <div style="height: 100%;">
    <el-table
        :data="tableData"
        stripe
        :span-method="arraySpanMethod"
        header-row-class-name="custom-table-header"
        header-cell-class-name="custom-table-header-cell"
        cell-class-name="custom-table-cell"
        class="custom-table"
        height="100%"
        ref="replyTable"
        style="width: 100%;">
      <el-table-column
          :type="status === '1' ? 'selection' : 'index'"
          align="center"
          width="80">
      </el-table-column>
      <el-table-column
          label="客户名称"
          align="center">
        <template slot-scope="scope">
          <inner-table :data="scope.row" :key="keyG()"></inner-table>
          <el-table :show-header="false"
                    :data="[scope.row.toBeApprovedTotalVO]"
                    cell-class-name="custom-table-cell custom-table-cell-font-weight-600"
                    class="custom-table">
            <el-table-column
                prop="compCodeTxt"
                align="center">
            </el-table-column>
            <el-table-column
                prop="contractDayAverage"
                align="center">
            </el-table-column>
            <el-table-column
                prop="remainingContractDayAverage"
                align="center">
            </el-table-column>
            <el-table-column
                prop="downGasPlace"
                align="center">
            </el-table-column>
            <el-table-column
                prop="yesterdayGasPlan"
                align="center">
            </el-table-column>
            <el-table-column
                align="center">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.dayNum === null ? '-' : scope.row.dayNum }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.dayNumReply }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="desc"
                align="center">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
          prop="compCode"
          align="center"
          label="月度合同日均量">
      </el-table-column>
      <el-table-column
          align="center"
          label="剩余合同日均量">
      </el-table-column>
      <el-table-column
          prop="compCode"
          align="center"
          label="输气站场">
      </el-table-column>
      <el-table-column
          prop="compCode"
          align="center"
          label="昨日交割量">
      </el-table-column>
      <el-table-column
          prop="compCode"
          align="center"
          label="日指定量">
      </el-table-column>
      <el-table-column
          prop="compCode"
          align="center"
          label="批复量">
      </el-table-column>
      <el-table-column
          prop="compCode"
          align="center"
          label="备注">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import innerTable from "./innerTable";
export default {
  name: "replyTable",
  props: {
    tableData: Array,
    status: String
  },
  components: {
    innerTable
  },
  created() {
    console.log(this.$parent.selectForm.status)
  },
  methods: {
    arraySpanMethod: function ({ columnIndex }) {
      if(columnIndex === 1) {
        return {
          rowspan: 1,
          colspan: 8
        };
      }
      if(columnIndex > 1) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },
    keyG: function () {
      return Math.random()
    }
  }
}
</script>

<style scoped>

</style>