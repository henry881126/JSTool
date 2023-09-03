<template>
  <div>
    <!-- 周 -->
    <div class="card-wrapper">
      <div class="banner-title-wrapper">
        <div class="banner-title-item-l">
          <!-- <span>{{weekTime}}</span> -->
          <span class="weekTime">{{weekformat | handleWeekFormat}}</span>
          <el-button round
                     @click="exportData()"
                     class="custom-btn"
                     icon="el-icon-upload2">导出</el-button>
        </div>

      </div>
      <div class="banner-table-wrapper">
        <el-table v-loading="loading"
                  :data="weekTableData"
                  :key="2"
                  :border="true"
                  class="custom-table-n my-custom-table"
                  header-row-class-name="custom-table-header"
                  header-cell-class-name="custom-table-header-cell"
                  cell-class-name="custom-table-cell">
          <el-table-column label="客户名称"
                           prop="customerName"
                           align="left"
                           fixed="left"
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
                <span v-else-if="scope.row.contractType&&(scope.row.contractType.split(',').length>1)"
                      class="sale-proxy contractType">多种</span>
                <span v-else
                      class="contractType"></span>
                <span class="customerName">{{scope.row.customerName}}</span>
                <!-- <span class="customerName"
                      v-if="scope.row.customerName&&scope.row.customerName.length<20">{{scope.row.customerName}}</span>
                <el-tooltip v-else
                            effect="dark"
                            :content="scope.row.customerName"
                            placement="top-end">
                  <span class="longCustomerName">{{scope.row.customerName}}</span>
                </el-tooltip> -->
              </div>

            </template>
          </el-table-column>
          <el-table-column align="left"
                           header-align="left"
                           label="计划期"
                           width="250"
                           :show-overflow-tooltip="true"
                           prop="planPeriod">
          </el-table-column>
          <el-table-column align="right"
                           header-align="right"
                           label="周计划量(方)"
                           min-width="200"
                           :show-overflow-tooltip="true"
                           prop="predicteGas">
          </el-table-column>
          <el-table-column align="center"
                           header-align="center"
                           label="反馈量(方)"
                           min-width="235"
                           fixed="right"
                           prop="reviewTotalGasUse">
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.reviewStatus===0"
                     class="handleBox">
                  <el-input size="mini"
                            width="132"
                            class="reviewTotalGasUse"
                            placeholder="周反馈量"
                            :disabled="scope.row.reviewStatus==1"
                            @input="scope.row.reviewTotalGasUse=scope.row.reviewTotalGasUse.replace(/[^\d]+/g,'')"
                            v-model="scope.row.reviewTotalGasUse">
                  </el-input>
                  <div class="checkDetail"
                       style="width:5em;marginLeft:10px;"
                       @click="confirmApproval(scope.row)">确认反馈</div>
                </div>
                <div class="hadFeedBack"
                     v-else-if="scope.row.reviewStatus===1">
                  <span class="predicteGas">{{scope.row.reviewTotalGasUse}}</span>
                  <span class="feedbackDone">已反馈</span>
                </div>
                <div v-else-if="scope.row.reviewStatus===null"
                     class="handle">
                  <span>-</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           header-align="center"
                           label="操作"
                           min-width="90"
                           fixed="right"
                           class="handler">
            <template slot-scope="scope">
              <div>
                <div class="sure-plan">

                  <!-- reviewStatus 审核状态 0未反馈 1已反馈 为空不显示周计划量与操作 -->

                  <div class="checkDetail"
                       @click="checkDetail(scope.row)"><span v-if="scope.row.predicteGas=='-'">-</span><span v-else>查看</span></div>
                </div>
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
                       @size-change="handleSizeChange"><span style="color:#606266;">当前{{this.weekTableData.length}}条</span></el-pagination>
      </div>

    </div>
    <!-- 周查看详情 -->
    <el-dialog :title="weekRowData.title"
               :close-on-click-modal="false"
               class="gas-dialog"
               width="1120px"
               :visible.sync="weekRowData.show">
      <div class="tableContent">
        <el-table :data="weekRowData.data"
                  class="singleTableHeader"
                  :border="true"
                  style="width: 100%">
          <el-table-column prop="count"
                           label="次数"
                           align="center"
                           header-align="center"
                           width="70">
          </el-table-column>
          <el-table-column prop="upTime"
                           label="上报时间"
                           align="center"
                           header-align="center"
                           width="170">
          </el-table-column>
          <el-table-column prop="predicteGas"
                           label="周计划量"
                           align="center"
                           header-align="center"
                           width="150">
          </el-table-column>
          <el-table-column v-for="(item,index) in weekDetailList"
                           :key="index"
                           :prop="item"
                           :label="(index+1)|filterIndex"
                           align="center"
                           header-align="center">
          </el-table-column>
          <el-table-column prop="changeGasReason"
                           align="center"
                           header-align="center"
                           label="变更原因"
                           width="220">
          </el-table-column>
        </el-table>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import topMenu from "../../../components/topMenu/topMenu2";
import api from "../../../http/api";
import exportApi from "../../../components/export/export";
export default {
  name: "weekGasPlanAndFeedback",
  mixins: [exportApi],
  data () {
    return {
      weekTip: {
        show: false
      },
      pager: {
        pageSize: [10],
        currentPage: 1,
        totalPage: 0
      },
      weekDetailList: ["wgas1", "wgas2", "wgas3", "wgas4", "wgas5", "wgas6", "wgas7"],
      weekRowData: {
        title: '',
        show: false,
        data: []
      },//每行查看详情数据

      weekTableData: [],
      weekDetailData: [],
      loading: false,
      timer: null
    }
  },
  props: ['selectForm', 'time', 'weekformat'],
  watch: {
    'weekformat': {
      handler (now) {
        this.weekformat = now
        this.pager.currentPage = 1
        this.getWeekContractList()
      },
      deep: true,
      immediate: true
    },
    'selectForm.contractType': {
      handler () {
        this.pager.currentPage = 1
        this.getWeekContractList()
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
          this.getWeekContractList()
        }, 1000)
      },
      deep: true,
      immediate: false
    },
    curCom () {
      this.getWeekContractList()
    }
  },
  computed: {
    weekTime () {
      let now = new Date(this.time.week.value).getTime()
      let time = this.$moment(now).format('YYYY-MM-DD');
      let y = time.split('-')[0]
      let m = time.split('-')[1]
      let d = time.split('-')[2]
      let getDate = this.getMonthWeek(y, m, d)
      return getDate.getYear + '年' + getDate.getMonth + '月第' + getDate.getWeek + " 周"
    },
    curCom () {
      return this.$store.getters.curCom
    }
  },

  components: {
    topMenu,
  },
  filters: {
    filterIndex (msg) {
      let s = ''
      switch (msg) {
        case 1:
          s = '一'
          break;
        case 2:
          s = '二'
          break;
        case 3:
          s = '三'
          break;
        case 4:
          s = '四'
          break;
        case 5:
          s = '五'
          break;
        case 6:
          s = '六'
          break;
        case 7:
          s = '日'
          break;

        default:
          break;
      }
      return s;
    },
    handleWeekFormat (val) {
      let res = val.split('~')
      let startYear = res[0].split('/')[0] + '年' + res[0].split('/')[1] + '月' + res[0].split('/')[2] + '日'
      let endYear = res[1].split('/')[0] + '年' + res[1].split('/')[1] + '月' + res[1].split('/')[2] + '日'
      let time = startYear + ' - ' + endYear
      return time
    },
  },
  created () {
  },
  methods: {
    getMonthWeek (a, b, c) {
      var date = new Date(a, parseInt(b) - 1, c),
        w = date.getDay(),
        d = date.getDate();
      if (w == 0) {
        w = 7;
      }
      var config = {
        getMonth: date.getMonth() + 1,
        getYear: date.getFullYear(),
        getWeek: Math.ceil((d + 6 - w) / 7),
      }
      return config;
    },
    // 分页
    handlePagerChange (val) {
      this.pager.currentPage = val
      this.getWeekContractList()
    },
    handleSizeChange (val) {
      this.pager.pageSize = [val]
      this.getWeekContractList()
    },
    // 客户名称输入变化
    customerNameChange () { },

    // 确定批复
    confirmApproval (value) {
      if (!value.reviewTotalGasUse) {
        this.$message({
          message: '反馈气量不能为空',
          type: 'warning'
        });
        return
      }
      let params = {
        // id: 1102,
        id: value.predictionGasId,
        reviewTotalGasUse: value.reviewTotalGasUse / 1,
        userID: this.$store.getters.userInfo.userId,
        userName: this.$store.getters.userInfo.name,
        type: '1'
      }
      const h = this.$createElement;
      // 输入量和计划量判断是否显示警告行？
      setTimeout(() => {
        // 详情弹框盒子
        let outsideBox = document.querySelector('.el-message-box')
        outsideBox.style.padding = '20px'
        outsideBox.style.width = '510px'

        let headrBox = document.querySelector('.el-message-box__header')
        headrBox.style.display = 'flex'
        headrBox.style.height = '25px'
        headrBox.style.lineHeight = '25px'
        headrBox.style.alignItem = 'center'
        headrBox.style.justifyContent = 'space-between'
        let headrTitle = document.querySelector('.el-message-box__header .el-message-box__title')
        headrTitle.style.lineHeight = '25px'
        headrTitle.style.fontWeight = '500'
        let closeBtn = document.querySelector('.el-message-box__headerbtn')
        closeBtn.style.position = 'static'
        //内容box
        let contentBox = document.querySelector('.el-message-box__content')
        contentBox.style.padding = '0'
        // 标题

        let title = document.querySelector('.el-message-box__header')
        title.style.padding = '0'
        let btns = document.querySelector('.el-message-box__btns')
        btns.style.padding = '0'
        btns.style.marginTop = '28px'
        let btn = document.querySelectorAll('.el-message-box__btns button')
        btn[0].style.width = '58px'
        btn[0].style.height = '32px'
        btn[0].style.borderRadius = '16px'
        btn[0].style.backgroundColor = '#F5F7FA'
        btn[1].style.width = '58px'
        btn[1].style.height = '32px'
        btn[1].style.borderRadius = '16px'
        btn[1].style.backgroundColor = '#47A87D'
        btn[1].style.border = 'none'
      }, 50);
      let times = 1
      this.$msgbox({
        title: '周计划反馈确认',
        message: h('div', null, [
          h('p', { style: 'fontSize:14px;color:#303133;fontWeight:500;lineHeight:20px;marginTop:30px;marginBottom:10px' }, `${value.customerName}`),
          h('p', { style: 'fontWeight: 400;fontSize: 14px;color: #303133;lineHeight: 21px;paddingRight: 20px;marginBottom: 10px;' }, `${value.planPeriod}`),
          h('p', { style: 'marginTop:10px;marginBottom: 30px;' }, [
            h('span', { attrs: { class: 'subValueTxt' } }, '批复量为 '),
            h('span', { attrs: { class: 'subValue' } }, `${value.reviewTotalGasUse}(方)`),
          ])
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            times++
            if (times === 2) {
              api.gasPlanAndFeedback.weekContractExamine(params).then(res => {
                this.getWeekContractList()
                done()
              })
            }
          } else {
            done()
          }
        }
      }).then(action => {
        // 确定成功提示
        // this.$message({
        //   type: 'info',
        //   message: 'action: ' + action
        // });
      });

    },
    // 查看详情
    checkDetail (value) {
      if (value.predicteGas == '-') {
        return
      }

      //周详情
      this.weekRowData.title = value.customerName + value.planPeriod + '上报详情(方)'
      // this.weekRowData.title = value.customerName + value.contractPeriod + '年度合同'
      this.weekRowData.show = false
      let params = {
        id: value.predictionGasId
      }
      // let params = {
      //   id: '282'
      // }
      this.weekRowData.data = []
      api.gasPlanAndFeedback.weekContractGetDetail(params).then(res => {
        if (res && res[0] && res[0].details && res[0].details.length > 0) {

          res[0].details.forEach((item, index) => {
            if (item.changeGasReason == null || item.changeGasReason == '') {
              item.changeGasReason = '-'
            }
            this.weekRowData.data.push(item)
          })
          this.weekRowData.show = true
        }

      })
    },
    // 导出
    exportData () {
      let curComInfo = this.$store.getters.curComInfo
      let gasDateBegin = this.weekformat.split('~')[0]
      let gasDateEnd = this.weekformat.split('~')[1]
      // 合同类型:1代输 2三方 3直销 4补充协议
      // let params = {
      //   compCode: curComInfo.orgCode + '',
      //   orgLevel: curComInfo.orgLevel + '',
      let params = {
        // compCode: 1 + '',//公司编码
        code: curComInfo.orgCode + '',//分公司code
        orgLevel: curComInfo.orgLevel + '',//管理实体编码
        contractType: this.selectForm.contractType + '',//合同类型
        customerName: this.selectForm.customerName + '',//客户名称
        current: this.pager.currentPage,
        gasDateBegin,//开始日期
        gasDateEnd,//结束日期
        pageSize: 10,
      }
      api.gasPlanAndFeedback.weekContractExport(params).then(res => {
        this.download(res, 'xlsx', `${this.weekformat}用气计划`)
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
    },
    // 周列表
    getWeekContractList () {
      let curComInfo = this.$store.getters.curComInfo
      if (!curComInfo) {
        return
      }
      // 合同类型:1代输 2三方 3直销 4补充协议
      // value为周二 gasDateBegin gasDateEnd
      if (!curComInfo) {
        return
      }
      if (!this.weekformat) {
        return
      }
      let gasDateBegin = this.weekformat.split('~')[0].split('/').join('-')
      let gasDateEnd = this.weekformat.split('~')[1].split('/').join('-')
      let params = {
        code: curComInfo.orgCode,//公司code
        orgLevel: curComInfo.orgLevel,//管理实体编码
        contractType: this.selectForm.contractType + '',//合同类型
        current: this.pager.currentPage,//页数
        customerName: this.selectForm.customerName,//客户名称
        gasDateBegin,//开始日期
        gasDateEnd,//结束日期
        pageSize: this.pager.pageSize[0],
      }
      this.loading = true
      this.weekTableData = []
      let weekTableData = []
      api.gasPlanAndFeedback.weekContractList(params).then(res => {
        this.loading = false
        if (res && res[0]) {
          this.pager.totalPage = res[0].total
          if (this.weekTableData.length > 0) {
            return
          }
          res[0].list && res[0].list.forEach((item) => {
            let planPeriod = ''
            if (item.gasDateBegin) {
              planPeriod = item.gasDateBegin.split(' ')[0].replace(/-/g, '/') + '~' + item.gasDateEnd.split(' ')[0].replace(/-/g, '/')
            } else {
              planPeriod = '-'
            }
            item.planPeriod = planPeriod

            if (item.predicteGas === null) {
              item.predicteGas = '-'
            } else {
              item.predicteGas = item.predicteGas / 1
            }
            //根据 reviewStatus 处理 reviewTotalGasUse
            //审核状态（0未反馈，1已反馈）如果为空，则不显示周计划量，与操作
            if (item.reviewStatus === 0) {
              item.reviewTotalGasUse = ''
            } else if (item.reviewStatus === 1) {
              item.reviewTotalGasUse = item.reviewTotalGasUse / 1
            } else if (item.reviewStatus === null) {
              item.reviewTotalGasUse = '-'
            }
            weekTableData.push(item)
          })
          this.weekTableData = weekTableData
        }
      })
    },
    parseTime (time, cFormat) {
      if (arguments.length === 0) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string')) {
          if ((/^[0-9]+$/.test(time))) {
            time = parseInt(time)
          } else {
            time = time.replace(new RegExp(/-/gm), '/')
          }
        }

        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        return value.toString().padStart(2, '0')
      })
      return time_str
    },
  }
}
</script>
<style scoped lang="scss">
.weekTime {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}
.my-custom-table /deep/ thead tr th div {
  font-size: 14px;
  font-weight: bold;
  color: #606266;
  box-sizing: border-box;
}
.my-custom-table /deep/ thead tr th {
  height: 60px;
  box-sizing: border-box;
}
.card-wrapper {
  border-radius: 0 0 4px 4px;
}
.subInfo {
  margin-bottom: 15px;
  display: flex;
  height: 21px;
  align-items: center;
  margin-bottom: 15px;
}
.subTitle {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 20px;
  color: #303133;
}

.subValueTxt {
  font-weight: 400;
  font-size: 14px;
  color: #303133;
  line-height: 21px;
}
.subValue {
  color: rgb(64, 158, 255);
  margin-left: 6px;
}
.my-custom-table {
  border-radius: 8px 8px 0px 0px;
  font-size: 14px;
  color: #303133;
}
.my-custom-table /deep/ thead tr th:nth-of-type(1) {
  padding-left: 16px !important;
}
.my-custom-table /deep/ thead tr th:nth-of-type(1) .cell {
  padding-left: 74px !important;
}
.my-custom-table /deep/ table tr td:nth-of-type(4) {
  display: flex;
  justify-content: center;
  align-items: center;
}
.hadFeedBack {
  display: flex;
  align-items: center;
}
.hadFeedBack .feedbackDone {
  display: inline-block;
  width: 4em;
}
.predicteGas {
  display: inline-block;
  width: 132px;
}
.my-custom-table /deep/ .el-table td.el-table__cell div {
  display: flex;
}
.reviewTotalGasUse /deep/ input {
  width: 132px;
}
.reviewTotalGasUse {
  width: 132px;
}
.feedbackDone {
  width: 4em;
  margin-left: 10px;
  color: #939599;
}
.handleBox {
  display: flex;
  justify-content: center;
  align-items: center;
}
.tableContent {
  padding: 15px 22px;
}
.singleTableHeader /deep/ th {
  background-color: #f5f7fa !important;
}
.singleTableHeader {
  border-radius: 8px !important;
}
.singleTableHeader /deep/ .el-table__body {
  margin-bottom: 8px;
}
.singleTableHeader /deep/ .el-table__cell.el-table__expanded-cell {
  padding: 0 !important;
}
.gas-dialog /deep/ .el-dialog {
  // height: 222px;
}
.gas-dialog /deep/ .el-dialog__header .el-dialog__title {
  font-weight: 500;
  font-size: 18px;
  color: #303133 !important;
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
  padding: 15px;
  box-sizing: border-box;
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
  justify-content: center;
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
  min-width: 4em;
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
.bold {
  font-weight: 600;
}
</style>