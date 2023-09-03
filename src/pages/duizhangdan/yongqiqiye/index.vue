<template>
  <div class="gas-page-bg">
    <div v-if="!descShow">
      <top-menu :date-picker-show="false"
                title="气量对账单"></top-menu>
      <div class="form-search-wrapper">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" @submit.native.prevent>
          <el-form-item>
            <div class="search-com-wrapper">
              <el-select v-model="searchForm.type" placeholder="请选择" class="search-com-type" @change="searchTypeChange">
                <el-option label="供应商" :value="'0'"></el-option>
                <el-option label="用气企业" :value="'1'"></el-option>
              </el-select>
              <el-select v-model="searchForm.code" placeholder="请选择" class="search-com-name" @change="searchCodeChange">
                <el-option :label="v.name" :value="v.code" :key="v.code" v-for="v in selectOption"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="状态">
            <div class="search-status-wrapper">
              <el-select v-model="searchForm.status" placeholder="请选择" class="gas-el-select" @change="searchStatusChange">
                <el-option label="全部" :value="''" :key="''"></el-option>
                <el-option label="已生成" :value="'3'" :key="'3'" v-if="searchForm.type === '0'"></el-option>
                <el-option label="已生成未推送" :value="'0'" :key="'0'" v-if="searchForm.type === '1'"></el-option>
                <el-option label="已推送未确认" :value="'1'" :key="'1'" v-if="searchForm.type === '1'"></el-option>
                <el-option label="已确认" :value="'2'" :key="'2'" v-if="searchForm.type === '1'"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="生成时间" v-if="searchForm.status === '' || searchForm.status === '3' || searchForm.status === '2'">
            <div class="search-date-wrapper">
              <el-date-picker
                  v-model="searchForm.date"
                  :picker-options="pickerOptions"
                  @change="searchDateChange"
                  :clearable="false"
                  type="daterange"
                  format="yyyy/MM/dd"
                  class="custom-datepicker">
              </el-date-picker>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="dzd-list-wrapper banner-card-wrapper">
        <div class="dzd-list-table">
          <el-table
              v-loading="loading"
              :data="tableList.list"
              stripe
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
              class="custom-table-r"
              style="width: calc(100% - 60px); margin-top: 20px;margin-left: 30px;">
            <el-table-column
                prop="name"
                label="用气企业"
                align="center">
            </el-table-column>
            <el-table-column
                prop="gasNum"
                label="气量（方）"
                align="center">
            </el-table-column>
            <el-table-column
                prop="gasPrice"
                align="center"
                label="单价（元/方）">
            </el-table-column>
            <el-table-column
                prop="gasAmount"
                label="金额（元）"
                align="center">
            </el-table-column>
            <el-table-column
                prop="heating_comprehensive_price"
                label="生成时间"
                align="center">
              <template slot-scope="scope">
                {{ getFormatDate(scope.row.createTime) + ' ' + getFormatHours(scope.row.createTime, ':') }}
              </template>
            </el-table-column>
            <el-table-column
                prop="heating_not_residents_price"
                label="状态"
                align="center">
              <template slot-scope="scope">
                <div class="status-wrapper">
                  <span :style="{backgroundColor: getStatusDesc(scope.row.status).color}"></span>
                  <span>
                  {{ getStatusDesc(scope.row.status).text }}
                </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center">
              <template slot-scope="scope">
<!--                <el-button type="text" @click="sendPop(scope.row)" v-if="scope.row.status === '0' && searchForm.type === '1'">推送</el-button>-->
<!--                <el-button type="text" @click="confirmPop(scope.row)" v-if="scope.row.status === '1' && searchForm.type === '1'">确认</el-button>-->
                <el-button style="font-size: 16px; color: #46A0FC" type="text" @click="goDesc(scope.row)">查看</el-button>
                <el-button style="font-size: 16px; color: #46A0FC" type="text" @click="exportDesc(scope.row)">导出详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="plan-page-wrapper custom-page">
            <el-pagination
                layout="prev, pager, next"
                @current-change="tablePageChange"
                :current-page="tableList.current"
                :page-size="tableList.pageSize"
                :total="tableList.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <descEl v-if="descShow" :descProp="descProp" ref="desc"></descEl>
    <el-dialog
        title=""
        :visible.sync="dialogSendVisible"
        class="custom-dialog"
        width="30%">
      <span style="font-size: 24px;font-weight: bold;">确定将对账单推送给客户吗？</span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogSendVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateStatus('1')">确 定</el-button>
          </span>
    </el-dialog>
    <el-dialog
        title="气量对账单确认"
        :visible.sync="dialogConfirmVisible"
        width="70%" class="custom-dialog">
      <el-table
          :data="[opRow]"
          stripe
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          class="custom-table-r">
        <el-table-column
            prop="name"
            label="用气企业"
            align="center">
        </el-table-column>
        <el-table-column
            prop="gasNum"
            label="气量（方）"
            align="center">
        </el-table-column>
        <el-table-column
            prop="gasPrice"
            align="center"
            label="单价（元/方）">
        </el-table-column>
        <el-table-column
            prop="gasAmount"
            label="金额（元）"
            align="center">
        </el-table-column>
        <el-table-column
            prop="heating_comprehensive_price"
            label="生成时间"
            align="center">
          <template slot-scope="scope">
            {{ getFormatDate(scope.row.createTime) + ' ' + getFormatHours(scope.row.createTime, ':') }}
          </template>
        </el-table-column>
        <el-table-column
            prop="heating_not_residents_price"
            label="状态"
            align="center">
          <template slot-scope="scope">
            <div class="status-wrapper">
              <span :style="{backgroundColor: getStatusDesc(scope.row.status).color}"></span>
              <span>
                  {{ getStatusDesc(scope.row.status).text }}
                </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConfirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateStatus('2')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import topMenu from "../../../components/topMenu/topMenu";
import api from '/src/http/api';
import dateFormater from "/src/components/dateFormater/dateFormater";
import exportApi from "../../../components/export/export";
import descEl from "./desc.vue"
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'

export default {
  name: "dzdQy",
  mixins: [exportApi, dateFormater, buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
  data: function () {
    return {
      searchForm: {
        type: '1',
        code: '',
        status: '',
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
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.searchForm.date[0] = minDate
          this.searchForm.date[1] = maxDate
        },
        disabledDate: (time) => {
          if(time.getTime() > Date.now()) {
            return true
          }
          if(this.searchForm.date.length > 0) {
            if(time.getTime() > this.searchForm.date[0].getTime() - 30*24*3600000 && time.getTime() < this.searchForm.date[0].getTime() + 30*24*3600000) {
              return false
            }
          } else {
            return false
          }

          if(this.searchForm.date[0] && this.searchForm.date[1]) {
            return false
          }
          return true
        },
      },
      selectionData: null,
      selectOption: null,
      dialogSendVisible: false,
      dialogConfirmVisible: false,
      opRow: null,
      descShow: false,
      descProp: {
        code: '',
        startTime: '',
        endTime: '',
        type: ''
      }
    }
  },
  created() {
    this.getSelectionOption()
    this.getData()
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
          this.getSelectionOption()
          this.getData()
        }
      }
    }
  },
  methods: {
    getData: function () {
      let params = {
        xaReig: this.curComCode,
        type: this.searchForm.type,
        status: this.searchForm.status,
        pageSize: this.tableList.pageSize,
        current: this.tableList.current,
        code: this.searchForm.code
      }
      if((this.searchForm.status === '' || this.searchForm.status === '3' || this.searchForm.status === '2') && this.searchForm.date.length > 0) {
        params.startTime = this.getFormatDate(this.searchForm.date[0])
        params.endTime = this.getFormatDate(this.searchForm.date[1])
      }
      api.bills.getList(params).then((res) => {
        if(res) {
          this.tableList.list = res[0].list
          this.tableList.total = res[0].total
        }
      })
      if(this.descShow) {
        this.$refs.desc.getData()
      }
    },
    getSelectionOption: function () {
      let params = {
        xaReigCode: this.curComCode
      }
      api.dayGasD.getEntys(params).then(res => {
        if(res) {
          for (let i in res[0]) {
            if(res[0][i] === null) {
              res[0][i] = []
            }
            res[0][i].unshift({
              code: '',
              name: '全部',
            })
          }
          this.selectionData = res[0]
          this.setCodeSelectionOption()
        }
      })
    },
    searchTypeChange: function () {
      this.setCodeSelectionOption()
      this.setStatusSelectionOption()
      this.getData()
    },
    searchCodeChange: function () {
      this.getData()
    },
    searchStatusChange: function () {
      this.getData()
    },
    setCodeSelectionOption: function () {
      switch (this.searchForm.type) {
        case '0':
          this.selectOption = this.selectionData.suppliers
          break
        case '1':
          this.selectOption = this.selectionData.companys
          break
        default:
          this.selectOption = []
      }
      this.searchForm.code = ''
    },
    setStatusSelectionOption: function () {
      this.searchForm.status = ''
    },
    tablePageChange: function (page) {
      this.tableList.current = page
      this.getData()
    },
    searchDateChange: function (date) {
      this.$set(this.searchForm.date, 0, date[0])
      this.$set(this.searchForm.date, 1, date[1])
      this.getData()
    },
    getStatusDesc: function (status) {
      let ret = {
        text: '',
        color: ''
      }
      switch (status) {
        case '0':
          ret.text = '已生成未推送';
          ret.color = '#409EFF';
          break
        case '1':
          ret.text = '已推送未确认';
          ret.color = '#FF523C';
          break
        case '2':
          ret.text = '已确认';
          ret.color = '#0FB2AB'
          break
        case '3':
          ret.text = '已生成';
          ret.color = '#0FB2AB'
          break
        default:
          ret.text = '全部'
      }
      return ret
    },
    goDesc: function (row) {
      this.opRow = row
      this.descProp = {
        code: row.code,
        startTime: row.startTime,
        endTime: row.endTime,
        type: this.searchForm.type
      }
      this.descShow = true
    },
    sendPop: function (row) {
      this.opRow = row
      this.dialogSendVisible = true
    },
    confirmPop: function (row) {
      this.opRow = row
      this.dialogConfirmVisible = true
    },
    updateStatus: function (status) {
      let params = {
        id: this.opRow.id,
        code: this.opRow.code,
        status: status
      }
      api.bills.updateStatusOfBills(params).then(res => {
        if(res) {
          if(status === '1') {
            this.$message({
              message: '推送成功。',
              type: 'success'
            });
            this.dialogSendVisible = false
          } else if(status === '2') {
            this.$message({
              message: '确认成功。',
              type: 'success'
            });
            this.dialogConfirmVisible = false
          }
          this.getData()
        }
      })
    },
    exportDesc: function (row) {
      let params = {
        code: row.code,
        startTime: row.startTime,
        endTime: row.endTime,
        type: this.searchForm.type
      }
      api.bills.exportDetail(params).then(res => {
        if(res) {
          this.download(res, 'xls', 'export')
        }
      })
    }
  },
  components: {
    topMenu,
    descEl
  },
}
</script>

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
  margin-top: 20px;
}
.dzd-list-table {
  margin-top: 10px;
  overflow: hidden;
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
  height: 34px;
  margin-bottom: 30px;
}
.status-wrapper {
  line-height: 16px;
}
.status-wrapper span:first-child {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}
.status-wrapper span {
  display: inline-block;
  vertical-align: middle;
}
</style>