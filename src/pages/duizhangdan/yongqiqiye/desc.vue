<template>
  <div>
    <top-menu :date-picker-show="false"
              title="气量对账单明细"></top-menu>
    <div class="dzd-list-wrapper banner-card-wrapper">
      <div class="gas-tab-title">
        <div style="height: 100%;padding-top: 21px;box-sizing: border-box;">
          <span class="back-btn-wrapper" @click="goBack()">
                <span class="back-btn">返回</span>
                <i class="el-icon-arrow-right"></i>
              </span>
          <el-button round plain type="success" @click="sendPop()" v-if="detail.status === '0' && descProp.type === '1'" class="custom-button" icon="el-icon-s-promotion btn-icon" >推送客户</el-button>
<!--          <el-button round plain type="success" @click="confirmPop()"  v-if="detail.status === '1'" class="custom-button" icon="el-icon-check btn-icon" >确认</el-button>-->
          <el-button round plain type="success" @click="exportDetail()" class="custom-button" icon="el-icon-upload2 btn-icon" >导出</el-button>
          <el-button round plain type="success" @click="printTable()" v-if="detail.status === '2' || descProp.type === '0'" class="custom-button" icon="el-icon-printer btn-icon" >打印</el-button>
        </div>
        <div style="width: calc(100% + 60px);margin-left: -30px;height: 1px;background: #E5E5E5;"></div>
      </div>
      <div class="dzd-list-table" ref="printHtml">
        <div class="table-title">
          <div>{{ gqName }}</div>
          <span>{{ yqName}}月度对账单</span>
          <el-tag type="success" effect="dark" class="no-print" v-if="detail.status === '2'">已确认</el-tag>
          <el-tag type="success" effect="dark" class="no-print" v-if="detail.status === '3'">已生成</el-tag>
          <el-tag type="danger" effect="dark" class="no-print" v-if="detail.status === '1'">已推送未确认</el-tag>
          <el-tag effect="dark" class="no-print" v-if="detail.status === '0'">已生成未推送</el-tag>
        </div>
        <div class="date-circle">
          结算周期：{{ getFormatDate(detail.startTime, '/') }} - {{ getFormatDate(detail.endTime, '/') }}
        </div>
        <el-table
            v-loading="loading"
            :data="tableList.list"
            stripe
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            class="custom-table-r"
            ref="table"
            :show-summary="true"
            :summary-method="getSummaries"
            :span-method="objectSpanMethod"
            style="width: calc(100% - 60px); margin-top: 20px;margin-left: 30px;">
          <el-table-column
              label="日期"
              prop="time"
              align="center">
          </el-table-column>
          <el-table-column
              prop="downGasPlace"
              label="下载点"
              v-if="detail.name === '新奥能源贸易'"
              align="center">
          </el-table-column>
          <el-table-column
              prop="gasNum"
              label="气量（方）"
              align="center">
          </el-table-column>
          <el-table-column
              prop="price"
              align="center"
              label="单价（元/方）">
          </el-table-column>
          <el-table-column
              prop="amount"
              label="金额（元）"
              align="center">
          </el-table-column>
        </el-table>
        <div v-if="descProp.type === '1'">
          <div class="confirm-place-wrapper">
            <div>供气单位：{{gqName}}</div>
            <div>（签字盖章确认）</div>
          </div>
          <div class="confirm-place-wrapper">
            <div>用气单位：{{yqName}}</div>
            <div>（签字盖章确认）</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topMenu from "../../../components/topMenu/topMenu";
import api from '/src/http/api';
import dateFormater from "/src/components/dateFormater/dateFormater";
import exportApi from "../../../components/export/export";

export default {
  name: "dzdQy",
  mixins: [exportApi, dateFormater],
  props: {
    descProp: Object
  },
  data: function () {
    return {
      searchForm: {
        status: 0,
        date: [],
        name: '',
      },
      loading: false,
      tableList: {
        list: [],
        current: 1,
        pageSize: 10,
        total: 0
      },
      detail: {},
      totalRow: null,
      gqName: '',
      yqName: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData: function () {
      let params = {
        code: this.descProp.code,
        startTime: this.descProp.startTime,
        endTime: this.descProp.endTime,
        type: this.descProp.type
      }
      api.bills.getDetailList(params).then(res => {
        if(res) {
          this.detail = res[0].gasPlanSettlementCycle
          for (let i in res[0].settlementDetails) {
            if(res[0].settlementDetails[i].time === '合计') {
              this.totalRow = res[0].settlementDetails[i]
            }
          }
          this.tableList.list = res[0].settlementDetails
          this.tableList.list.pop()
        }
      })
      api.bills.detailName({
        code: this.descProp.code,
        type: this.descProp.type
      }).then(res => {
        if(res) {
          this.gqName = res[0].resourcesName;
          this.yqName = res[0].compCodeTxtName;
        }
      })
    },
    tablePlanChange: function () {

    },
    printTable: function () {
      let appNode = document.getElementById('app')
      let newNode = this.$refs.printHtml
      document.body.replaceChild(newNode, appNode)
      this.$refs.printHtml.style.width = '1070px'
      this.$refs.table.doLayout()
      let that = this
      setTimeout(function () {
        window.print()
        document.body.replaceChild(appNode, newNode)
        document.getElementsByClassName('dzd-list-wrapper')[0].appendChild(newNode)
        that.$refs.printHtml.style.width = 'calc(100% - 60px)'
        that.$refs.table.doLayout()
      })
    },
    goBack: function () {
      this.$parent.descShow = false
    },
    sendPop: function () {
      this.$parent.dialogSendVisible = true
    },
    confirmPop: function () {
      this.$parent.dialogConfirmVisible = true
    },
    getSummaries: function () {
      let ret = []
      if(this.totalRow) {
        ret = [
          '合计',
          this.totalRow.gasNum,
          this.totalRow.price,
          this.totalRow.amount,
        ]
      } else {
        ret = [
          '合计',
          null, null, null
        ]
      }
      if(this.detail.name === '新奥能源贸易') {
        ret.splice(1, 0, null)
      }
      return ret
    },
    exportDetail: function () {
      let params = {
        code: this.descProp.code,
        startTime: this.descProp.startTime,
        endTime: this.descProp.endTime,
        type: this.descProp.type
      }
      api.bills.exportDetail(params).then(res => {
        if(res) {
          this.download(res, 'xls', 'export')
        }
      })
    },
    objectSpanMethod({rowIndex, columnIndex }) {
      if(this.detail.name === '新奥能源贸易' && columnIndex === 0) {
        if(rowIndex === 0) {
          return {
            rowspan: this.tableList.list.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      return {
        rowspan: 1,
        colspan: 1
      };
    }
  },
  components: {
    topMenu
  },
}
</script>
<style>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
<style scoped lang="scss">
.gas-page-bg {
  min-width: 1220px;
}
.demo-form-inline {
  /deep/ .el-form-item {
    margin-bottom: 0;
    margin-right: 30px;
  }
  /deep/ .el-form-item__label {
    color: #FFFFFF;
    font-size: 16px;
  }

  /deep/ .gas-el-select .el-input__suffix {
    border-left: none;
    right: 12px;
  }
}
.form-search-wrapper {
  margin-top: 30px;
  padding: 0 30px;
  box-sizing: border-box;
}
.dzd-list-wrapper {
  margin-top: 30px;
}
.dzd-list-table {
  overflow: hidden;
  padding: 0 0 60px 0;
  box-sizing: border-box;
}
.search-status-wrapper {
  background: #567DB9;
  border-radius: 50px;
  width: 180px;
}
.search-date-wrapper {
  background: #567DB9;
  border-radius: 50px;
  width: 275px;
  /deep/ .el-input__inner {
    background: transparent;
    border: none;
  }
  /deep/ .el-range-input {
    width: 29%;
    font-size: 16px;
  }
}
.search-com-wrapper {
  height: 40px;
  width: 400px;
  background: #567DB9;
  border-radius: 50px;
  /deep/ .el-input__inner {
    background: transparent;
    border: none;
    color: #FFFFFF;
    padding-left: 15px;
    font-size: 16px;
  }
}
.search-com-type {
  width: 35%;
  /deep/ .el-input__suffix {
    border: none;
  }
}
.search-com-name {
  width: 60%;
  /deep/ .el-input__suffix {
    border: none;
  }
}
.plan-page-wrapper {
  padding: 0 30px;
  box-sizing: border-box;
  margin-top: 20px;
}
.gas-tab-title {
  height: 88px;
  font-size: 19px;
  font-weight: 500;
  line-height: 88px;
  color: #2C3E50;
  opacity: 1;
  margin-left: 30px;
  width: calc(100% - 60px);
}
.back-btn-wrapper {
  color: #74788D;
  float: right;
  font-size: 16px;
  margin-left: 20px;
  cursor: pointer;
  height: 46px;
  line-height: 46px
}
.back-btn {
  display: inline-block;
  margin-right: 5px;
  height: 16px;
  line-height: 16px;
}
.custom-button {
  float: right;
  margin-right: 0px;
  margin-left: 20px;
  height: 46px;
  border-radius: 50px;
  font-size: 16px;
  /deep/ .btn-icon {
    margin-right: 8px;
    font-size: 24px;
  }
  /deep/ span {
    display: inline-block;
    height: 24px;
    margin-left: 5px;
    vertical-align: top;
    line-height: 24px;
  }
}
.table-title {
  height: 28px;
  text-align: center;
  line-height: 28px;
  font-size: 24px;
  margin-top: 29px;
    span {
      display: inline-block;
      vertical-align: middle;
    }
  /deep/ .el-tag {
    height: 24px;
    line-height: 22px;
    margin-left: 10px;
    vertical-align: middle;
  }
  /deep/ .el-tag--success {
    background-color: rgba(15, 178, 171, 1);
    border-color: rgba(15, 178, 171, 1);
  }
}
.date-circle {
  padding: 0 30px;
  box-sizing: border-box;
  margin-top: 30px;
  color: rgba(80, 83, 86, 1);
  font-size: 16px;
}
.confirm-place-wrapper {
  display: inline-block;
  width: 43%;
  margin-top: 60px;
  padding: 0 30px;
  box-sizing: border-box;
  font-size: 20px;
  font-weight: bold;
  line-height: 36px;
  margin-left: 60px;
}
</style>