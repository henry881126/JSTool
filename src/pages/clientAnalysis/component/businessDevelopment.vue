<template>
  <section>
    <div class="title">
      风险识别
    </div>
    <div class="table-box">
      <el-table :data="tableData"
                header-row-class-name="headerRow"
                row-class-name="rowClassName">
        <el-table-column prop="riskIndicator"
                         min-width="50%"
                         label='风险指标内容'>
          <template slot-scope="scope">
            <el-tooltip placement="top">
              <template slot="content">
                <span v-html="scope.row.riskIndicator"></span>
              </template>
              <p class="con el-multi-ellipsis--l2" v-html="scope.row.riskIndicator">
              
              </p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="high"
                         min-width="10%"
                         label="高"
                         align="center">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.high"
                        placement="top">
              <span class="con el-multi-ellipsis--l2">{{scope.row.high}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="middle"
                         min-width="10%"
                         label="中"
                         align="center">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.middle"
                        placement="top"><span class="con el-multi-ellipsis--l2">{{scope.row.middle}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="low"
                         min-width="10%"
                         label="低"
                         align="center">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.low"
                        placement="top"><span class="con el-multi-ellipsis--l2">{{scope.row.low}}</span></el-tooltip>

          </template>
        </el-table-column>
        <el-table-column prop="none"
                         min-width="10%"
                         label="无"
                         align="center">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.none"
                        placement="top"><span class=" el-multi-ellipsis--l2">{{scope.row.none}}</span></el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="line-right"></div> -->
    </div>
    <!-- <div class="line-bottom"> -->
    <!-- </div> -->
    <div class="title"
         style="margin-top:23px">
      机会分析
    </div>
    <div class="content-box">
      {{riskAnalysis||'-'}}
    </div>
  </section>
</template>
<script>
import api from '@/api/clientAnalyse'
export default {
  name: 'businessDevelopment',
  data() {
    return {
      tableData: [],
      riskAnalysis: '',
    }
  },
  created() {
    this.getStraightRiskList()
  },
  methods: {
    async getStraightRiskList() {
      const { compCode, partner, distinct } = this.$route.query
      const params = {
        compCode,
        distinct,
        partner,
        // compCode: '0231',
        // distinct: 1,
        // partner: '0002015016',
      }
      this.loading = true
      try {
        const res = await api.getStraightRiskList(params)
        this.loading = false
        if (res && res.resultCode === 0) {
          const {
            data: { straightRiskList, riskAnalysis },
          } = res
          this.riskAnalysis = riskAnalysis
          // 风险等级
          const map = new Map([
            [1, 'high'],
            [2, 'middle'],
            [3, 'low'],
            [4, 'none'],
          ])
          //?item.riskIndicator.replace(/<[^>]+>/g, ""):''替换标签
          this.tableData = straightRiskList.map((item) => ({
            riskIndicator: item.riskIndicator,
            [map.get(Number(item.riskLevel))]: item.riskContent,
          }))
        }
      } catch (err) {
        this.loading = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
section {
  padding: 0 12px;
  .title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #3f5896;
    line-height: 28px;
    margin-bottom: 16px;
    margin-top: 10px;
    padding-left: 18px;
  }
  /deep/ .el-table {
    background: transparent;
    &::before {
      display: none;
    }
    tr,
    td,
    th,
    .cell {
      border: none;
      padding: 0;
    }
    tr:hover > td {
      background: transparent;
    }
    .headerRow {
      background: #f2f4f8;

      height: 64px;
      th {
        background: #f2f4f8;
        &:first-child {
          border-radius: 32px 0 0 32px;
          padding-left: 23px;
        }
        &:nth-last-child(2) {
          border-radius: 0 32px 32px 0;
        }
      }
      .cell {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
      }
    }
    .rowClassName {
      height: 64px;
      border-radius: 32px;
      &:nth-child(2n) {
        background: #f2f4f8;
      }
      &:nth-child(2n + 1) {
        background: transparent;
      }
      td .cell {
        //   text-align: center;
        display: inline-block;
      }
      td:first-child {
        padding-left: 23px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #505356;

        border-radius: 32px 0 0 32px;
      }
      td:not(:first-child) {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #45a20f;
        line-height: 22px;
      }
      td:last-child {
        padding-right: 23px;
        border-radius: 0 32px 32px 0;
      }
    }
  }
  .content-box {
    height: 155px;
    background: #f0f3f9;
    border-radius: 3px;
    border: 1px solid #ebedf6;
    padding: 18px 20px;
    white-space: pre-line;
  }
  .line-bottom {
    margin-top: 14px;
    width: 253px;
    height: 6px;
    background: #d8d8d8;
    border-radius: 4px;
    opacity: 0.38;
  }
  .line-right {
    margin-top: 64px;
    margin-left: 12px;
    width: 6px;
    height: 135px;
    background: #d8d8d8;
    border-radius: 4px;
    opacity: 0.38;
  }
  .table-box {
    display: flex;
  }
}
@media only screen and (max-width: 1460px) {
  section {
    padding:0px 8px;
    .title {
      margin-top: 16px;
      padding-left: 0px;
      font-size: 16px;
      margin-bottom: 16px;
    }
    /deep/ .el-table {
      .headerRow {
        height: 45px;
        th {
          &:first-child {
            border-radius: 23px 0 0 23px;
            padding-left: 17px;
          }
          &:nth-last-child(2) {
            border-radius: 0 23px 23px 0;
          }
        }
        .cell {
          font-size: 14px;
        }
      }
      .rowClassName {
        height: 45px;
        border-radius: 17px;

        td:first-child {
          padding-left: 17px;
          font-size: 14px;
          border-radius: 23px 0 0 23px;
        }
        td:not(:first-child) {
          font-size: 14px;
        }
        td:last-child {
          padding-right: 17px;
          border-radius: 0 23px 23px 0;
        }
      }
    }
    .content-box {
      box-sizing: border-box;
      height: 116px;
      border-radius: 2px;
      padding: 16px 20px 10px;
    }
  }
}
</style>