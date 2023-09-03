<template>
  <div>
    <!--  年 -->
    <div class="card-wrapper">
      <div class="banner-title-wrapper">
        <div class="banner-title-item-l">
          <span class="yearTime">{{new Date(time.year).getFullYear()}}年</span>
          <el-button round
                     @click="exportData"
                     class="custom-btn"
                     icon="el-icon-upload2">导出</el-button>
        </div>
      </div>
      <div class="banner-table-wrapper">
        <el-table v-loading="loading"
                  :data="yearTableData"
                  class="custom-table-n my-custom-table"
                  header-row-class-name="custom-table-header"
                  header-cell-class-name="custom-table-header-cell"
                  cell-class-name="custom-table-cell"
                  :key="4"
                  ref="table"
                  :border="true">
          <el-table-column label="客户名称"
                           fixed
                           prop="customerName"
                           align="left"
                           :key="Math.random()"
                           :show-overflow-tooltip="true"
                           min-width="380"
                           header-align="left">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.contractType==1"
                      class="sale-proxy contractType">代输</span>
                <span v-else-if="scope.row.contractType==2"
                      class="sale-third contractType">代销</span>
                <span v-else-if="scope.row.contractType==3"
                      class="sale-direct contractType">直销</span>
                <span v-else
                      class="contractType"></span>
                <span class="customerName">{{scope.row.customerName}}</span>
                <!-- <span class="customerName"
                      v-if="scope.row.customerName&&scope.row.customerName.length<20">{{scope.row.customerName}}</span>
                <el-tooltip v-else
                            effect="dark"
                            :content="scope.row.customerName+''"
                            placement="top-end">
                  <span class="longCustomerName">{{scope.row.customerName}}</span>
                </el-tooltip> -->
                <!-- <span class="customerName">{{scope.row.customerName}}</span> -->
              </div>

            </template>
          </el-table-column>
          <el-table-column align="left"
                           header-align="left"
                           label="合同名称"
                           :key="Math.random()"
                           min-width="320"
                           :show-overflow-tooltip="true"
                           prop="contractName">
          </el-table-column>
          <el-table-column align="left"
                           header-align="left"
                           label="合同期"
                           :key="Math.random()"
                           :show-overflow-tooltip="true"
                           width="250"
                           prop="contractPeriod">
          </el-table-column>
          <el-table-column prop="contractTotalAmount"
                           align="right"
                           :key="Math.random()"
                           header-align="right"
                           min-width="220"
                           label="年合同量/计划量(万方)">
            <template slot-scope="scope">
              <div>
                <span>{{scope.row.contractTotalAmount}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="reviewGasNum"
                           align="right"
                           :key="Math.random()"
                           v-if="showFeedBack"
                           header-align="right"
                           min-width="240"
                           label="反馈量(万方)">
            <template slot-scope="scope">
              <div class="sure-plan"
                   v-if="scope.row.reviewStatus==='0'">
                <el-input size="mini"
                          class="input"
                          placeholder="年计划量"
                          @input="scope.row.reviewGasNum=scope.row.reviewGasNum.replace(/^\D*(\d*(?:\.\d{0,4})?).*$/g, '$1')"
                          v-model="scope.row.reviewGasNum">
                </el-input>
                <div class="checkDetail"
                     style="width:7em;marginLeft:10px;"
                     @click="confirmApproval(scope.row)">确认批复</div>
              </div>
              <div class="sure-plan"
                   v-else-if="scope.row.reviewStatus==='1'">
                <span>{{scope.row.reviewGasNum}}</span>
                <div class="feedbackDone"
                     style="width:6em;marginLeft:10px;color: #939599;">已反馈</div>
              </div>
              <div class="sure-plan"
                   v-else>
                <span>-</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right"
                           align="center"
                           header-align="center"
                           label="操作"
                           min-width="90"
                           class="handler">
            <template slot-scope="scope">
              <div>
                <div class="checkDetail"
                     style="textAlign:center;marginLeft:0;"
                     @click="checkDetail(scope.row)"><span v-if="scope.row.contractTotalAmount=='-'">-</span><span v-else>查看</span></div>
              </div>
            </template>
          </el-table-column>
          <template slot="empty">
            <div class="empty-wrapper">
              <img src="/static/img/table-data-empty.png"
                   alt="暂无数据"
                   style="margin-top: 10px;">
              <p>暂无数据</p>
            </div>
          </template>
        </el-table>
        <!-- <el-pagination class="custom-page-n pager"
                       background
                       :page-sizes="pager.pageSize"
                       :current-page="pager.currentPage"
                       layout="prev, pager, next"
                       :total="pager.totalPage"
                       @current-change="handlePagerChange">
        </el-pagination> -->
        <el-pagination background
                       class="custom-page-n"
                       style="marginTop:13px;"
                       layout="total, slot, prev, pager, next, sizes"
                       :current-page="pager.currentPage"
                       :page-size="pager.pageSize[0]"
                       :page-sizes="[10,20,30]"
                       :total="pager.totalPage"
                       @current-change="handlePagerChange"
                       @size-change="handleSizeChange"><span style="color:#606266;">当前{{this.yearTableData.length}}条</span></el-pagination>
      </div>
    </div>
    <!-- 年每行查看详情 -->
    <el-dialog :title="yearRowData.title"
               :close-on-click-modal="false"
               class="gas-dialog"
               width="550px"
               :visible.sync="yearRowData.show">
      <div class="tableContent">
        <div class="tableContentTitle">
          <span>合同名称：</span>{{yearRowData.contractName}}
        </div>
        <div class="tableContentTitle">
          <span>年合同量：</span>{{yearRowData.contractTotalAmount}}万方
        </div>
        <el-table :data="yearRowData.data"
                  class="custom-table-n singleTableHeader"
                  border
                  max-height="500"
                  style="width: 100%">
          <!-- 遍历年 -->
          <el-table-column align="left"
                           header-align="left"
                           prop="date"
                           label="月份">
          </el-table-column>
          <el-table-column align="right"
                           header-align="right"
                           prop="volume"
                           label="月合同量(万方)">
          </el-table-column>
        </el-table>
      </div>

    </el-dialog>
    <!-- <el-dialog :title="yearRowData.title"
               :close-on-click-modal="false"
               class="gas-dialog"
               width="1120px"
               :visible.sync="yearRowData.show">
      <div class="tableContent">
        <el-table :data="yearRowData.data"
                  class="singleTableHeader"
                  style="width: 100%">
          <el-table-column prop="contractName"
                           label="合同名称"
                           align="left"
                           header-align="left"
                           min-width="150">
          </el-table-column>
          <el-table-column prop="contractTotalAmount"
                           align="right"
                           header-align="right"
                           :label="infoTableHeaderName"
                           width="150">
          </el-table-column>
          <el-table-column v-for="(val,key) in Object.keys(yearDetailData)"
                           :key="key"
                           align="center"
                           header-align="center"
                           prop="year"
                           :label="val">
            <el-table-column v-for="(item,index) in yearDetailData[val]"
                             :key="index"
                             align="center"
                             header-align="center"
                             :prop="val+'-'+item"
                             :label="item"
                             width="90">
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import topMenu from "../../../components/topMenu/topMenu2";
import api from "../../../http/api";
import exportApi from "../../../components/export/export";
export default {
  name: "yearGasPlanAndFeedback",
  mixins: [exportApi],
  data () {
    return {
      infoTableHeaderName: '合同用量',
      showFeedBack: false,
      showInput: false,
      pager: {
        pageSize: [10],
        currentPage: 1,
        totalPage: 0
      },
      yearRowData: {
        title: '',
        show: false,
        contractName: '',
        contractTotalAmount: '',
        data: [
        ]
      },//每行查看详情数据
      yearDetailData: {
        year: [],
        month: [],
      },//年详情数据
      yearTableData: [],

      loading: false,
      timer: null
    }
  },

  props: ['selectForm', 'time', 'yearHandlerVal'],
  watch: {
    'selectForm.contractType': {
      handler () {
        this.pager.currentPage = 1
        this.getYearList()
      },
      deep: true,
      immediate: false
    },
    'selectForm.customerName': {
      handler () {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        this.timer = setTimeout(() => {
          this.pager.currentPage = 1
          this.getYearList()
        }, 1000)
      },
      deep: true,
      immediate: false
    },
    yearHandlerVal (now) {
      this.yearTime(now)
    },
    time: {
      handler () {
        this.pager.currentPage = 1
        this.getYearList()
      },
      deep: true,
      immediate: true
    },
    curCom () {
      this.getYearList()
    }
  },
  computed: {
    curCom () {
      return this.$store.getters.curCom
    }
  },
  components: {
    topMenu,
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.$refs.table.doLayout();
    })
  },
  methods: {
    yearTime (now) {
      this.pager.currentPage = 1
      // { name: '合同', value: '0' },
      //   { name: '已反馈', value: '1' },
      //   { name: '未反馈', value: '3' }
      if (now === '3') {
        // 不显示反馈列
        this.showFeedBack = false
      } else if (now === '1') {
        // 不显示input
        this.showFeedBack = true
        this.showInput = false
      } else if (now === '0') {
        // 显示input
        this.showFeedBack = true
        this.showInput = true
      }
      this.selectForm.contractType = ''
      this.getYearList()
    },
    // 分页
    handlePagerChange (val) {
      this.pager.currentPage = val
      this.getYearList()
    },
    handleSizeChange (val) {
      this.pager.pageSize = [val]
      this.getYearList()
    },
    // 确定批复
    confirmApproval (value) {
      if (!value.reviewGasNum) {
        this.$message({
          message: '反馈气量不能为空',
          type: 'warning'
        });
        return
      }
      let params = {
        id: value.id,
        reviewTotalGasUse: value.reviewGasNum / 1,
        userID: this.$store.getters.userInfo.userId,
        userName: this.$store.getters.userInfo.name,
        type: '3'
      }
      const h = this.$createElement;
      let times = 1
      this.$msgbox({
        title: '年度计划用量批复确认',
        message: h('div', null, [
          h('p', { style: 'fontSize:16px;color:#303133;fontWeight:500' }, `${value.customerName}`),
          h('p', null, `${value.contractPeriod}`),
          h('p', null, [
            h('span', null, '年度计划用量为'),
            h('span', { style: 'color: #409EFF' }, `${value.reviewGasNum}(万方)`),
          ]),
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            times++
            if (times === 2) {
              api.gasPlanAndFeedback.weekContractExamine(params).then(res => {
                this.getYearList()
                done()
              })
            }
          } else {
            done();
          }
        }
      }).then(() => {
      });
    },
    handleDate (value) {
      if (value === null) {
        return '-'
      } else if (value === 0) {
        return '0'
      } else {
        return value
      }
    },
    // 年列表
    getYearList () {
      let curComInfo = this.$store.getters.curComInfo
      if (!curComInfo) {
        return
      }
      // 合同类型:1代输 2三方 3直销 4补充协议
      let customerName = this.selectForm.customerName === null ? '' : this.selectForm.customerName
      let params = {
        // compCode: '',
        code: curComInfo.orgCode,
        // orgLevel: '',
        orgLevel: curComInfo.orgLevel,
        contractType: this.selectForm.contractType + '',
        customerName,
        pageSize: this.pager.pageSize[0],
        reviewStatus: this.yearHandlerVal,
        currentPage: this.pager.currentPage,
        time: new Date(this.time.year).getFullYear() + '',
      }
      this.loading = true
      this.yearTableData = []
      api.gasPlanAndFeedback.yearContractlist(params).then(res => {
        this.loading = false
        this.pager.totalPage = (res && res[0].total) || 0
        if (this.yearTableData.length > 0) {
          return
        }
        res && res[0] && res[0].list && res[0].list.forEach((item) => {
          let contractTotalAmount = ''
          if (item.contractType === null) {
            if (item.contractTotalAmount === null) {
              contractTotalAmount = '-'
            } else if (item.contractTotalAmount === 0) {
              contractTotalAmount = '0'
            } else {
              contractTotalAmount = item.contractTotalAmount / 1
            }
          } else {
            if (item.contractTotalAmount === null) {
              contractTotalAmount = '-'
            } else if (item.contractTotalAmount === 0) {
              contractTotalAmount = '0'
            } else {
              contractTotalAmount = item.contractTotalAmount / 1
            }
          }
          let contractPeriod = ''
          if (item.contractBeginDate !== null) {
            contractPeriod = item.contractBeginDate.replace(/-/g, '/') + '~' + item.contractEndDate.replace(/-/g, '/')
          } else {
            contractPeriod = '-'
          }
          let reviewGasNum = ''
          if (item.reviewStatus === '0') {
            reviewGasNum = ''
          } else if (item.reviewStatus === '1') {
            reviewGasNum = item.reviewGasNum / 10000
          }

          let obj = {
            // order: (this.pager.currentPage - 1) * 10 + (index + 1),//主键
            id: item.id,//主键
            customerName: this.handleDate(item.customerName),//客户名称
            contractName: this.handleDate(item.contractName),//合同名称
            contractPeriod,//合同期
            contractTotalAmount: contractTotalAmount,//年合同量/计划量(万方)
            contractType: this.handleDate(item.contractType),//合同类型1代输2三方3直销4补充协议
            orgLevel: item.orgLevel,//3管理实体，4法人公司
            reviewGasNum: reviewGasNum,//反馈值
            reviewStatus: item.reviewStatus//0未审核，1已审核，3合同
          }
          this.yearTableData.push(obj)
        })
      })
    },
    // 查看详情
    checkDetail (value) {
      console.log(value);
      if (value.contractName === '-') {
        //没合同 ，标题显示计划量 
        this.yearRowData.title = value.customerName + ' ' + value.contractPeriod.split('/')[0] + '年度计划量'
        this.infoTableHeaderName = '计划量'
      } else {
        this.yearRowData.title = value.customerName + ' ' + value.contractPeriod.split('/')[0] + '年度合同量'
        this.infoTableHeaderName = '合同用量'
      }
      if (value.contractTotalAmount == '-') {
        return
      }

      this.yearRowData.show = false
      let params = {
        contractId: value.id,
        reviewStatus: this.yearHandlerVal
      }
      let result = []
      this.yearRowData.data = []
      api.gasPlanAndFeedback.yearContractGetDetail(params).then(res => {
        this.yearRowData.show = true
        this.yearRowData.contractName = value.contractName
        this.yearRowData.contractTotalAmount = value.contractTotalAmount
        res && res[0].forEach(item => {
          let date = ''
          if (item.realEndDate) {
            date = item.realEndDate.split('-')[0] + '/' + item.realEndDate.split('-')[1]
          }
          let obj = {
            date: date,
            volume: item.volume,
          }
          result.push(obj)
        })
        this.yearRowData.data = result
      })
    },
    // 导出
    exportData () {
      let curComInfo = this.$store.getters.curComInfo
      // 合同类型:1代输 2三方 3直销 4补充协议
      // let params = {
      //   compCode: curComInfo.orgCode + '',
      //   orgLevel: curComInfo.orgLevel + '',
      let year = new Date(this.time.year).getFullYear();
      let params = {
        compCode: curComInfo.orgCode,//公司编码
        contractType: this.selectForm.contractType + '',//合同类型
        customerName: this.selectForm.customerName + '',//客户名称
        orgLevel: curComInfo.orgLevel,//3管理实体，4法人公司
        // orgLevel: '4' + '',//3管理实体，4法人公司
        time: year,//时间
        reviewStatus: this.yearHandlerVal
      }
      api.gasPlanAndFeedback.yearContractExport(params).then(res => {
        this.download(res, 'xlsx', `${year}年用气计划`)
        // let blob = new Blob([res])
        // let downloadElement = document.createElement('a');
        // let href = window.URL.createObjectURL(blob);
        // downloadElement.href = href;
        // downloadElement.download = '用气历史.xlsx'; //下载后文件名
        // document.body.appendChild(downloadElement);
        // downloadElement.click(); //点击下载
        // document.body.removeChild(downloadElement); //下载完成移除元素
        // window.URL.revokeObjectURL(href); //释放掉blob对象
      })
    }
  }

}
</script>


<style scoped lang="scss">
.yearTime {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}
.my-custom-table /deep/ thead tr th div {
  font-size: 14px;
  font-weight: bold;
  color: #606266;
}
.my-custom-table /deep/ thead tr th {
  height: 60px;
  padding: 0;
  box-sizing: border-box;
}
.my-custom-table /deep/ thead tr th:nth-of-type(1) {
  padding-left: 66px;
}
.card-wrapper {
  border-radius: 0 0 4px 4px;
}
.sure-plan {
  display: flex;
  justify-content: end;
  align-items: center;
}
.feedbackDone {
}
.my-custom-table {
  border-radius: 8px 8px 0px 0px;
  font-size: 14px;
  color: #303133;
}
.checkDetail {
  margin-left: 10px;
  display: inline-block;
}
// .my-custom-table /deep/ table thead th .is-left {
//   z-index: 9999;
// }
// .my-custom-table /deep/ table thead th .is-right {
//   z-index: 9999;
// }
.singleTableHeader /deep/ .el-table__body {
  margin-bottom: 8px;
}
.tableContentTitle {
  font-size: 14px;
  color: #303133;
  line-height: 21px;
  margin-bottom: 10px;
}
.singleTableHeader /deep/ th {
  background-color: #f5f7fa !important;
}
.singleTableHeader {
  border-radius: 8px !important;
}
.singleTableHeader /deep/ .el-table__cell.el-table__expanded-cell {
  padding: 0 !important;
}
.singleTableHeader /deep/ tbody tr td {
  padding: 14px 48px !important;
}
.singleTableHeader /deep/ thead th {
  padding: 14px 48px !important;
}
.gas-dialog /deep/ .el-dialog__header .el-dialog__title {
  font-weight: 500;
  font-size: 18px;
  color: #303133 !important;
}
.gas-dialog /deep/ .el-dialog {
  margin-top: 12vh !important;
}
.gas-dialog /deep/ .el-dialog__header {
  border-bottom: 1px solid #dcdfe6;
}
.gas-dialog /deep/ .el-dialog__header {
  height: 64px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  box-sizing: border-box;
  font-size: 18px;
  color: #303133;
}
.gas-dialog /deep/ .el-dialog__body {
  padding-top: 20px !important;
}
.top-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}
.banner-card-wrapper {
  border-radius: 0px 0px 4px 4px !important;
  margin-top: 0 !important;
  margin-left: 20px;
}
.top-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}
.checkDetail.child {
  right: 16px;
}
.sureHandle {
  right: 10px !important;
}
#warningMsg {
  font-size: 14px;
  height: 35px;
  line-height: 35px;
  color: #f56c6c;
  background: #fef0f0;
  margin-left: -15px;
  width: 435px;
  padding-left: 15px;
}
.twolineEmpty {
  text-align: center;
}
.twoLine {
  padding-left: -75px;
}
.oneLine {
  padding-left: 22px;
}
.oneLine > div {
  display: flex;
}
.checkWaiting {
  right: 47px !important;
  color: #409eff;
}
.twoDoneFeedback {
  position: absolute;
  right: 44px;
  top: 40px;
  z-index: 99;
}
.singPlan {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 5px;
}
.tableContent {
  box-sizing: border-box;
}
.tableContent /deep/ table thead tr th:nth-last-child(2) {
  border-right: none !important;
}
.pager {
  margin-top: 20px;
}
#msgbox {
  color: #303133;
  line-height: 20px;
  margin-right: 20px;
  font-weight: 500;
}
#info {
  padding-left: 102px;
  margin-bottom: 15px;
}
.title {
  margin-right: 20px;
}
.multipleTable /deep/ td .el-table__header-wrapper,
.multipleTable /deep/ .expanded .cell i {
  display: none;
}
.multipleTable /deep/ td table td {
  background-color: #f5f7fa;
}
.multipleTable
  /deep/
  .el-table__body-wrapper
  > table
  > tbody
  > tr:nth-of-type(2n)
  > td {
  background-color: #f5f7fa !important;
}
.innerTable /deep/ .el-table__body-wrapper {
  background-color: #f5f7fa !important;
}
.doneFeedback {
  font-size: 14px;
  color: #acacae;
  position: absolute;
  right: 35px;
}
.doneFeedbackNum {
  font-size: 14px;
  color: #303133;
  display: inline-block;
  width: 118px;
  text-align: center;
}
.my-custom-table /deep/ input {
  text-align: center;
  width: 132px;
  border-radius: 16px;
}
.child {
  position: absolute;
  top: 0;
  right: 35px;
  height: 104px;
  line-height: 104px;
  z-index: 99;
}
.two {
  padding-left: 75px;
}
.totalTips {
  color: #f56c6c;
}
.fillGasNumTotal {
  text-align: right;
}

.custom-tab-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 20px;
  margin-left: 0;
  color: #fff;
  background-color: #567db9;
  border-color: #567db9;
  padding: 0;
}
.custom-tab-button-active {
  color: #fff;
  background-color: #0fb2ab;
  border-color: #0fb2ab;
}
.custom-datepicker {
  background: #567db9;
  border-radius: 20px;
  border: none;
  color: #ffffff !important;
  margin-right: 20px;
}
.demo-form-inline {
  /deep/ .el-form-item__label {
    color: #ffffff;
    font-size: 14px;
  }

  /deep/ .gas-el-select .el-input__suffix {
    border-left: none;
    right: 12px;
  }
}
.gas-page-com-wrapper {
  width: 220px;
  height: 40px;
  background: #567db9;
  opacity: 1;
  border-radius: 24px;
  float: right;
  margin-right: 20px;
  overflow: hidden;
}
.banner-title-wrapper {
  width: 100%;
  margin-bottom: 18px;
}
.banner-title-item-l {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-top: 18px;
  margin-left: 17px;
}
.banner-table-wrapper {
  padding: 0 23px 20px 17px;
  box-sizing: border-box;
}
.empty-wrapper {
  height: 436px;
  padding-top: 43px;
  box-sizing: border-box;
  p {
    height: 24px;
    line-height: 23px;
    padding: 0;
    margin: 0;
  }
}
.contractType {
  display: inline-block;
  width: 48px;
  min-width: 48px;
  height: 24px;
  line-height: 23px;
  border-radius: 14px;
  text-align: center;
  font-size: 14px;
  margin-right: 20px;
}
.sure-plan {
  display: flex;
  align-items: center;
}
.longCustomerName {
  display: inline-block;
  width: 17em;
  line-height: 23px;
  height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.contractName {
  min-width: 263px;
}
.longcontractName {
  display: inline-block;
  width: 15em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.input /deep/ input {
  width: 120px !important;
  height: 32px !important;
  // padding: 0 !important;
  text-align: center;
  // padding-left: 10px!important;
}
.sale-proxy {
  border: 1px solid #f56c6c;
  background: #fef0f0;
  color: #f56c6c;
}
.sale-direct {
  border: 1px solid #409eff;
  color: #409eff;
  background-color: #ecf5ff;
}
.sale-third {
  border: 1px solid #e6a23c;
  background-color: #fcf6ec;
  color: #e6a23c;
}
.customerName {
  color: #303133;
}
.checkDetail {
  text-align: center;
  color: #409eff;
  cursor: pointer;
}
.checkDetailing {
  color: #409eff;
}
.banner-title-item-l {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
}
.banner-title-item-l span {
  display: inline-block;
  vertical-align: middle;
}

.custom-btn {
  width: 79px;
  height: 32px;
  margin-right: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa !important;
  border: 1px solid #dcdfe6;
  color: #303133;
}
.custom-btn:hover {
  background: #47a87d !important;
  border-color: #47a87d !important;
  color: #fff !important;
}
.custom-button /deep/ span,
.custom-button /deep/.el-icon-upload2 {
  color: #fff;
}
</style>