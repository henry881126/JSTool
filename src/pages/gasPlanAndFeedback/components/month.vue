<template>
  <div>
    <!-- 月 -->
    <div class="card-wrapper">
      <div class="banner-title-wrapper">
        <div class="banner-title-item-l">
          <span class="monthTime">{{hanleTime().fullYear}}年{{hanleTime().month}}月</span>
          <el-button round
                     @click="exportData()"
                     class="custom-btn"
                     icon="el-icon-upload2">导出</el-button>
        </div>

      </div>
      <div class="banner-table-wrapper">
        <el-table v-loading="loading"
                  :data="monthTableData"
                  class="custom-table-n my-custom-table"
                  header-row-class-name="custom-table-header"
                  header-cell-class-name="custom-table-header-cell"
                  cell-class-name="custom-table-cell"
                  :border="true"
                  :key="3">
          <el-table-column label="客户名称"
                           prop="customerName"
                           align="left"
                           :show-overflow-tooltip="true"
                           fixed="left"
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
                <span v-else-if="scope.row.contractType==9"
                      class="contractType sale-proxy">多种</span>
                <span v-else
                      class="contractType "></span>
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
                           width="260"
                           :show-overflow-tooltip="true"
                           prop="dateperiod">
          </el-table-column>
          <el-table-column align="right"
                           header-align="right"
                           label="月合同量(万方)"
                           prop="volume"
                           :show-overflow-tooltip="true"
                           min-width="160">
          </el-table-column>
          <el-table-column align="right"
                           header-align="right"
                           label="月计划量(万方)"
                           prop="predicteGas"
                           :show-overflow-tooltip="true"
                           min-width="160">
          </el-table-column>
          <el-table-column align="center"
                           header-align="center"
                           label="反馈量(万方)"
                           min-width="242"
                           fixed="right"
                           class="handler">
            <template slot-scope="scope">
              <div>
                <div class="sure-plan">
                  <!-- reviewStatus 审核状态 0未反馈 1已反馈 为空不显示周计划量与操作 -->
                  <div class="handle"
                       v-if="scope.row.smartReviewStatus===null">
                    <span>-</span>
                  </div>
                  <div v-else-if="scope.row.smartReviewStatus===1"
                       class="handle feedback">
                    <span class="predicteGas">{{scope.row.predicteChangeGas}}</span>
                    <span class="feedbackDone">已反馈</span>
                  </div>
                  <div class="handle handleBox"
                       v-else-if="scope.row.smartReviewStatus===0">
                    <el-input size="mini"
                              width="132"
                              class="reviewTotalGasUse"
                              placeholder="月反馈量"
                              @input="scope.row.predicteChangeGas=scope.row.predicteChangeGas.replace(/^\D*(\d*(?:\.\d{0,4})?).*$/g, '$1')"
                              v-model="scope.row.predicteChangeGas">
                    </el-input>
                    <div class="checkDetail"
                         style="width:6em;"
                         @click="confirmApproval(scope.row)">确认批复</div>
                  </div>
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
                <div class="checkDetail"
                     v-if="(scope.row.volume=='-')&&scope.row.predicteGas=='-'">
                  -
                </div>
                <span v-else
                      class="checkDetail"
                      :class="{'child':scope.row.isChild}"
                      @click="checkDetail(scope.row)">查看</span>
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
                       @size-change="handleSizeChange"><span style="color:#606266;">当前{{this.monthTableData.length}}条</span></el-pagination>
      </div>
    </div>

    <!-- 月每行查看详情 -->
    <el-dialog :title="monthRowData.title"
               class="gas-dialog"
               :close-on-click-modal="false"
               :visible.sync="monthRowData.show">
      <div class="tableContent">
        <el-table v-if="monthRowData.showGas&&!monthRowData.hasChange"
                  :data="monthRowData.data"
                  class="custom-table-n singleTableHeader"
                  header-row-class-name="custom-table-header"
                  header-cell-class-name="custom-table-header-cell"
                  cell-class-name="custom-table-cell"
                  :border="true"
                  max-height="576"
                  :key="Math.random()"
                  style="width: 100%">
          <el-table-column prop="date"
                           align="center"
                           header-align="center"
                           label="日期"
                           width="200">
          </el-table-column>
          <el-table-column prop="sorce1"
                           align="right"
                           header-align="right"
                           header-row-class-name
                           min-width="200">
            <template slot="header">
              <div>计划量(方)</div>
              <div class="tableHeaderTime">上报时间:{{monthRowData.changeTime1}}</div>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-if="monthRowData.showGas&&monthRowData.hasChange"
                  :data="monthRowData.changeData"
                  :key="Math.random()+1"
                  class="custom-table-n singleTableHeader handleTable"
                  header-row-class-name="custom-table-header"
                  header-cell-class-name="custom-table-header-cell"
                  cell-class-name="custom-table-cell"
                  :border="true"
                  max-height="576"
                  style="width: 100%">
          <el-table-column prop="date"
                           align="center"
                           header-align="center"
                           label="日期"
                           width="100">
          </el-table-column>
          <el-table-column label="第3次"
                           v-if="monthRowData.changeTime3!=''"
                           align="right"
                           header-align="right">
            <el-table-column prop="sorce3"
                             align="right"
                             header-align="right"
                             header-row-class-name
                             min-width="200">
              <template slot="header">
                <div>计划量(方)</div>
                <div class="tableHeaderTime">上报时间:{{monthRowData.changeTime3}}</div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="第2次"
                           align="right"
                           header-align="right">
            <el-table-column prop="sorce2"
                             align="right"
                             header-align="right"
                             header-row-class-name
                             min-width="200">
              <template slot="header">
                <div>计划量(方)</div>
                <div class="tableHeaderTime">上报时间:{{monthRowData.changeTime2}}</div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="第1次"
                           align="right"
                           header-align="right">
            <el-table-column align="right"
                             prop="sorce1"
                             header-align="right"
                             header-row-class-name
                             min-width="200">
              <template slot="header">
                <div>计划量(方)</div>
                <div class="tableHeaderTime">上报时间:{{monthRowData.changeTime1}}</div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <el-table v-if="monthRowData.showContract"
                  :data="monthRowData.contractList"
                  class="custom-table-n singleTableHeader"
                  header-row-class-name="custom-table-header"
                  header-cell-class-name="custom-table-header-cell"
                  cell-class-name="custom-table-cell"
                  :border="true"
                  :key="Math.random()"
                  max-height="576"
                  style="width: 100%">
          <el-table-column prop="date"
                           align="center"
                           header-align="center"
                           label="日期"
                           width="200">
          </el-table-column>
          <el-table-column prop="sorce1"
                           align="right"
                           header-align="right"
                           :label="monthRowData.contractSore1Name"
                           min-width="200">
            <template slot="header">
              <div>{{monthRowData.contractSore1Name}}</div>
              <div class="tableHeaderTime">{{monthRowData.contractSore1Time}}</div>
            </template>
          </el-table-column>
          <el-table-column v-if="monthRowData.hasTwoContract"
                           prop="sorce2"
                           align="right"
                           header-align="right"
                           :label="monthRowData.contractSore2Name"
                           min-width="200">
            <template slot="header">
              <div>{{monthRowData.contractSore2Name}}</div>
              <div class="tableHeaderTime">{{monthRowData.contractSore2Time}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-dialog>
    <!-- <el-dialog :title="monthRowData.title"
               width="1120px"
               class="gas-dialog"
               :close-on-click-modal="false"
               :visible.sync="monthRowData.show">
      <div class="tableContent">
        <el-table :data="monthRowData.data"
                  class="singleTableHeader"
                  :border="true"
                  style="width: 100%">
          <el-table-column prop="contractGasName"
                           label=""
                           min-width="180"
                           align="center"
                           header-align="center">
          </el-table-column>
          <el-table-column prop="time"
                           align="center"
                           header-align="center"
                           label="时间"
                           width="200">
          </el-table-column>
          <el-table-column v-for="(value,index) in monthData"
                           :key="index"
                           :prop="value"
                           align="center"
                           header-align="center"
                           :label="value"
                           width="120">
          </el-table-column>
        </el-table>
      </div>

    </el-dialog> -->
  </div>
</template>

<script>
import api from "../../../http/api";
import exportApi from "../../../components/export/export";
export default {
  name: "monthGasPlanAndFeedback",
  mixins: [exportApi],
  data () {
    return {
      pager: {
        pageSize: [10],
        currentPage: 1,
        totalPage: 0
      },
      monthRowData: {
        show: false,
        showContract: false,
        showGas: false,
        hasChange: false,
        contractList: [],
        hasTwoContract: false,
        contractSore1Name: '',
        contractSore1Time: '',
        contractSore2Name: '',
        contractSore2Time: '',
        data: [],
        changeData: [],
        changeTime1: '',
        changeTime2: '',
        changeTime3: '',
      },//每行查看详情数据
      toggleDate: 'y',
      monthDetailData: [],//年详情数据
      monthData: [],
      monthTableData: [],
      contractList: [
        { name: '代输', value: '1' },
        { name: '代销', value: '2' },
        { name: '直销', value: '3' },
        { name: '补充协议', value: '4' },
      ],
      loading: false,
      timer: null
    }
  },
  props: ['selectForm', 'time'],
  watch: {
    'selectForm.contractType': {
      handler () {
        this.pager.currentPage = 1
        this.getMonthContractList()
      },
      deep: true,
      immediate: true
    },
    'selectForm.customerName': {
      handler () {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        this.timer = setTimeout(() => {
          this.pager.currentPage = 1
          this.getMonthContractList()
        }, 1000)
      },
      deep: true,
      immediate: false
    },

    time: {
      handler () {
        this.pager.currentPage = 1
        this.getMonthContractList()
      },
      deep: true,
      immediate: true
    },
    curCom () {
      this.getMonthContractList()
    }
  },
  computed: {
    curCom () {
      return this.$store.getters.curCom
    }
  },
  methods: {
    // 分页
    handlePagerChange (val) {
      this.pager.currentPage = val
      this.getMonthContractList()
    },
    handleSizeChange (val) {
      this.pager.pageSize = [val]
      this.getMonthContractList()
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
    // 月列表
    getMonthContractList () {
      let curComInfo = this.$store.getters.curComInfo
      if (!curComInfo) {
        return
      }
      // 合同类型:1代输 2三方 3直销 4补充协议
      let time = this.hanleTime().fullYear + '-' + this.hanleTime().month
      let params = {
        // code: '0571',
        code: curComInfo.orgCode,
        // orgLevel: '4',
        orgLevel: curComInfo.orgLevel,
        cortractType: this.selectForm.contractType,
        customerName: this.selectForm.customerName,
        pageSize: this.pager.pageSize[0],
        currentPage: this.pager.currentPage,
        time,
      }
      this.monthTableData = []
      this.loading = true
      api.gasPlanAndFeedback.monthContractList(params).then(res => {
        this.loading = false
        if (res && res[0]) {
          this.pager.totalPage = res[0].total
          if (this.monthTableData.length > 0) {
            return
          }
          res[0] && res[0].list && res[0].list.forEach((item, index) => {
            let volume = this.handleDate(item.volume)
            let predicteGas = this.handleDate(item.predicteGas)
            let predicteChangeGas = item.predicteChangeGas === null ? '' : item.predicteChangeGas / 1
            let obj = {
              bp: this.handleDate(item.bp),//主键
              customerName: this.handleDate(item.customerName),//客户名称
              contractType: this.handleDate(item.contractType),//客户类型
              dateperiod: this.handleDate(item.dateperiod),//计划期
              predicteGas: predicteGas == '-' ? predicteGas : predicteGas / 1,//月计划量
              icPredictionGasID: this.handleDate(item.icPredictionGasID),
              predicteChangeGas: predicteChangeGas,
              smartReviewStatus: item.smartReviewStatus,
              volume: volume == '-' ? volume : volume / 1,//月合同量
            }
            if (obj.dateperiod != '-') {
              obj.dateperiod = obj.dateperiod.replace(/-/g, '~')
            }

            if (obj.contractType.split(',').length > 1) {
              obj.contractType = 9
            } else {

            }
            this.monthTableData.push(obj)
          })
        }

      })
    },

    // 确定批复
    confirmApproval (value) {
      if (!value.predicteChangeGas) {
        this.$message({
          message: '反馈气量不能为空',
          type: 'warning'
        });
        return
      }
      let params = {
        // id: 1102,
        id: value.icPredictionGasID,
        reviewTotalGasUse: value.predicteChangeGas / 1,
        userID: this.$store.getters.userInfo.userId,
        userName: this.$store.getters.userInfo.name,
        type: '2'
      }
      const h = this.$createElement;
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
        title: '月度计划用量批复确认',
        message: h('div', null, [
          h('p', { style: 'fontSize:14px;color:#303133;fontWeight:500;lineHeight:20px;marginTop:30px;marginBottom:10px' }, `${value.customerName}`),
          h('p', { style: 'marginBottom:10px;fontWeight: 400;fontSize: 14px;color: #303133;lineHeight: 21px;paddingRight: 20px;' }, `${value.dateperiod}`),
          h('p', { attrs: { id: 'subMsg' } }, [
            h('span', { attrs: { class: 'subValueTxt' } }, '批复量为 '),
            h('span', { attrs: { class: 'subValue' } }, `${value.predicteChangeGas}(万方)`),
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
                this.getMonthContractList()
                done()
              })
            }
          } else {
            done();
          }
        }
      }).then(action => {
      });
    },
    // 查看详情
    checkDetail (value) {
      let time = this.hanleTime().fullYear + '-' + this.hanleTime().month
      let params = {
        bp: value.bp,
        // bp: '0002017714',
        time: time
      }
      this.monthRowData.data = []
      this.monthRowData.show = false
      api.gasPlanAndFeedback.monthContractGetDetail(params).then(res => {
        let str = '合同'
        if (res[0].length > 0 && res[0][0].contractGasName === '-') {
          str = '计划'
        }
        this.monthRowData.title = value.customerName + ' ' + this.hanleTime().fullYear + '/' + this.hanleTime().month + str + '量(方)'
        this.monthRowData.show = true
        // 判断气量还是合同
        if (res[0][0].type === '气量') {
          this.monthRowData.showContract = false
          this.monthRowData.showGas = true
          let resArr = res[0][0]
          let type = res[0].length
          let arr = []
          this.monthRowData.changeTime1 = ''
          this.monthRowData.changeTime2 = ''
          this.monthRowData.changeTime3 = ''
          this.monthRowData.changeData = []
          switch (type) {
            case 1:
              // 第一次,初始
              this.monthRowData.hasChange = false
              this.monthRowData.changeTime1 = resArr.predictTime
              resArr.volumes.forEach((item, index) => {
                let obj = {
                  date: (index + 1) + '日',
                  sorce1: item
                }
                arr.push(obj)
              })
              this.monthRowData.data = arr
              break;
            case 2:
              // 变更一次
              this.monthRowData.hasChange = true
              this.monthRowData.changeTime1 = resArr.predictTime
              this.monthRowData.changeTime2 = res[0][1].predictTime
              this.monthRowData.changeData = []
              resArr.volumes.forEach((item, index) => {
                let obj = {
                  date: (index + 1) + '日',
                  sorce1: item,
                  sorce2: res[0][1].volumes[index],
                }
                arr.push(obj)
              })
              this.monthRowData.changeData = arr
              break;
            case 3:
              // 变更二次
              this.monthRowData.hasChange = true
              this.monthRowData.changeTime1 = resArr.predictTime
              this.monthRowData.changeTime2 = res[0][1].predictTime
              this.monthRowData.changeTime3 = res[0][2].predictTime
              this.monthRowData.changeData = []
              resArr.volumes.forEach((item, index) => {
                let obj = {
                  date: (index + 1) + '日',
                  sorce1: item,
                  sorce2: res[0][1].volumes[index],
                  sorce3: res[0][2].volumes[index],
                }
                arr.push(obj)
              })
              this.monthRowData.changeData = arr
              break;

            default:
              break;
          }
        } else {
          this.monthRowData.showContract = true
          this.monthRowData.showGas = false
          let resultArr = []
          this.monthRowData.contractList = []
          this.monthRowData.contractSore1Name = ''
          this.monthRowData.contractSore1Time = ''
          this.monthRowData.contractSore2Name = ''
          this.monthRowData.contractSore2Time = ''
          if (res[0].length === 1) {
            this.monthRowData.hasTwoContract = false
            this.monthRowData.contractSore1Name = res[0][0].contractGasName
            this.monthRowData.contractSore1Time = res[0][0].time
            res[0][0].volumes.forEach((item, index) => {
              let obj = {
                date: (index + 1) + '日',
                sorce1: item,
              }
              resultArr.push(obj)
            })
          } else if (res[0].length === 2) {
            this.monthRowData.hasTwoContract = true
            this.monthRowData.contractSore1Name = res[0][0].contractGasName
            this.monthRowData.contractSore1Time = res[0][0].time
            this.monthRowData.contractSore2Name = res[0][1].contractGasName
            this.monthRowData.contractSore2Time = res[0][1].time
            res[0][0].volumes.forEach((item, index) => {
              let obj = {
                date: (index + 1) + '日',
                sorce1: item,
                sorce2: res[0][1].volumes[index]
              }
              resultArr.push(obj)
            })
          }
          this.monthRowData.contractList = resultArr
        }
      })
    },
    hanleTime () {
      let fullYear = new Date(this.time.month).getFullYear() + ''
      let month = (new Date(this.time.month).getMonth() + 1) > 9 ? ((new Date(this.time.month).getMonth() + 1) + '') : ('0' + (new Date(this.time.month).getMonth() + 1))
      return { fullYear, month }
    },
    // 导出
    exportData () {
      let curComInfo = this.$store.getters.curComInfo
      // 合同类型:1代输 2三方 3直销 4补充协议
      // let params = {
      //   compCode: curComInfo.orgCode + '',
      //   orgLevel: curComInfo.orgLevel + '',
      let time = this.hanleTime().fullYear + '-' + this.hanleTime().month
      let params = {
        code: curComInfo.orgCode + '',
        // code: '0571',//公司编码
        cortractType: this.selectForm.contractType + '',//合同类型
        customerName: this.selectForm.customerName + '',//公司名称
        orgLevel: curComInfo.orgLevel + '',//3管理实体，4法人公司
        time: time,//时间
      }
      api.gasPlanAndFeedback.monthContractExport(params).then(res => {
        this.download(res, 'xlsx', `${time}月用气计划`)
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
  }
}
</script>
<style scoped lang="scss">
.handleTable /deep/ .cell {
  padding: 0 16px !important;
}
.tableHeaderTime {
  font-weight: 400;
  color: #909399;
}
.monthTime {
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
.my-custom-table {
  border-radius: 8px 8px 0px 0px;
  font-size: 14px;
  color: #303133;
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
#subTime {
  font-weight: 400;
  font-size: 14px;
  color: #303133;
  line-height: 21px;
  padding-right: 20px;
  margin-bottom: 10px;
}
#subMsg {
  margin-bottom: 30px;
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
.my-custom-table /deep/ table tr td:nth-of-type(5) .reviewTotalGasUse {
  width: 132px !important;
}
.handle.feedback {
  padding-right: 14px;
}
.handleBox {
  display: flex;
}
.singleTableHeader /deep/ .el-table__body {
  margin-bottom: 8px;
}
.singleTableHeader /deep/ .cell {
}
.predicteGas {
  display: inline-block;
  width: 130px;
  margin-left: -26px;
}
.handleBox {
  display: flex;
  justify-content: center;
  align-items: center;
}
.feedbackDone {
  color: #acacae;
  margin-left: 18px;
}
.tableContent {
  padding: 15px 22px;
  position: relative;
}
.tableContent /deep/ table thead tr th:nth-last-child(2) {
  border-right: none !important;
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
.gas-dialog /deep/ .el-dialog__body {
  padding: 0 !important;
}
.gas-dialog /deep/ .el-dialog {
  width: 888px !important;
}
.gas-dialog /deep/ .el-dialog {
  margin-top: 12vh !important;
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
.my-custom-table /deep/ .el-table__row--level-1 .el-table_1_column_6 > .cell {
  display: flex;
  padding-left: 50px !important;
}
.my-custom-table /deep/ .el-table__row--level-1 > td:nth-of-type(1) {
  padding-left: 48px !important;
  box-sizing: border-box;
}
.my-custom-table /deep/ tr td:nth-of-type(1) .cell > div {
  display: flex;
  align-items: center;
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
.my-custom-table {
  border: 1px solid #dcdfe6;
  border-radius: 8px 8px 0px 0px;
  color: #303133;
  /deep/ .el-table__empty-block {
    width: auto !important;
  }
  /deep/ .my-custom-table-header th {
    background: #f5f7fa !important;
    color: #606266;
    font-weight: 500;
  }
  /deep/ .my-custom-table-header th:first-child {
    padding: 0 10px;
  }
  /deep/ .el-table__fixed {
    height: auto !important;
    bottom: 10px;
  }
  /deep/ ::-webkit-scrollbar {
    height: 10px;
  }
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
.bold {
  font-weight: 600;
}
</style>