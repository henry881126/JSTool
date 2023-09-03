<template>
  <div class="box">
    <div class="header">
      <div @click="selectTag('1')"
           :class="{'normal':true,'active':active==='1'}">审批过程</div>
      <div @click="selectTag('2')"
           :class="{'normal':true,'active':active==='2'}">审批历史</div>
      <div v-if="active==='1'">
        <div v-if="!twoFlag||!threeFlag||!oneFlag"><img src="../assets/state.png"
               alt=""><span style="marginLeft:5px">审批中</span></div>
        <div v-else>
          <img src="../assets/done.png"
               alt=""
               srcset=""><span class="haveDone tip">已审核</span>
        </div>
      </div>
    </div>
    <div v-show="active==='1'"
         class="body">
      <!-- img1, img2为流程指向图-->
      <img src="../assets/Group1.png"
           class="img1"
           alt=""
           srcset="">
      <img src="../assets/Group2.png"
           class="img2"
           alt=""
           srcset="">
      <img src="../assets/Group3.png"
           class="img3"
           alt=""
           srcset="">
      <div class="item info left1"
           :class="{'have':approveData[3]&&approveData[3].reportDate,'oneSorce':approveData[3]&&approveData[3].dayGasPlanAuditDetailVOList&&approveData[3].dayGasPlanAuditDetailVOList.length===1}">
        <div>
          <div class="photo">
            <img src="../assets/photo.png"
                 alt=""
                 srcset="">
          </div>
          <div>
            <div class="name">{{approveData[3]&&approveData[3].reportCustomerName}}</div>
            <div class="time">{{approveData[3]&&approveData[3].reportDate}}</div>
            <div class="val"
                 v-for="(item,key) in approveData[3]&&approveData[3].dayGasPlanAuditDetailVOList"
                 :key="key">
              <!-- 有指定量，有不提量 -->
              <div v-if="item.gasNum!==null&&item.fillGasNum!==null">
                <div>{{item.supplierName}}</div>
                <div>指定量+补提量:&nbsp;&nbsp;&nbsp;&nbsp;{{item.gasNum}}+{{item.fillGasNum}}(方)</div>
              </div>
              <!-- 有指定量，无不提量 -->
              <div v-if="item.gasNum!==null&&item.fillGasNum==null">
                <div>{{item.supplierName}}</div>
                <div>指定量:{{item.gasNum}}(方)</div>
              </div>

            </div>
          </div>
        </div>
        <div class="stepState">
          <div>
            <img src="../assets/done.png"
                 alt=""
                 srcset="">
            <span class="haveDone tip">已提交</span>
          </div>
        </div>
      </div>
      <div class="item middle">
        <div class="midTop info"
             :class="{'have':approveData[0]&&approveData[0].auditTime,'oneSorce':approveData[0]&&approveData[0].dayGasPlanAuditDetailVOList&&approveData[0].dayGasPlanAuditDetailVOList.length===1}">
          <div>
            <div class="photo">
              <img src="../assets/photo.png"
                   alt=""
                   srcset="">
            </div>
            <div>
              <div class="name">气源贸易群 {{approveData[0]&&approveData[0].auditName}}</div>
              <div class="time">{{approveData[0]&&approveData[0].auditTime}}</div>
              <div class="val"
                   v-for="(item,key) in approveData[0]&&approveData[0].dayGasPlanAuditDetailVOList"
                   :key="key">
                <div>{{item.supplierName}}</div>
                <div>批复量:&nbsp;&nbsp;&nbsp;&nbsp;{{item.reviewGasNum}}(方)</div>
              </div>
            </div>
          </div>
          <div class="stepState">
            <div v-if="approveData[0]&&approveData[0].auditStatus==0">
              <img src="../assets/state.png"
                   alt=""
                   srcset="">
              <span class="waiting tip">等待中</span>
            </div>
            <div v-else>
              <img src="../assets/done.png"
                   alt=""
                   srcset="">
              <span class="haveDone tip">已审核</span>
            </div>
          </div>
        </div>
        <div class="midBtn info"
             :class="{'have':approveData[1]&&approveData[1].auditTime,'oneSorce':approveData[1]&&approveData[1].dayGasPlanAuditDetailVOList&&approveData[1].dayGasPlanAuditDetailVOList.length===1}">
          <div>
            <div class="photo">
              <img src="../assets/photo.png"
                   alt=""
                   srcset="">
            </div>
            <div>
              <div class="name">调度中心 {{approveData[1]&&approveData[1].auditName}}</div>
              <div class="time">{{approveData[1]&&approveData[1].auditTime}}</div>
              <div class="val"
                   v-for="(item,key) in approveData[1]&&approveData[1].dayGasPlanAuditDetailVOList"
                   :key="key">
                <div>{{item.supplierName}}</div>
                <div>批复量:&nbsp;&nbsp;&nbsp;&nbsp;{{item.reviewGasNum}}(方)</div>
              </div>
            </div>
          </div>
          <div class="stepState">
            <div v-if="approveData[1]&&approveData[1].auditStatus==0">
              <img src="../assets/state.png"
                   alt=""
                   srcset="">
              <span class="waiting tip">等待中</span>
            </div>
            <div v-else>
              <img src="../assets/done.png"
                   alt=""
                   srcset="">
              <span class="haveDone tip">已审核</span>
            </div>
          </div>
        </div>
      </div>
      <div class="item info left"
           :class="{'have':approveData[2]&&approveData[2].auditTime,'oneSorce':approveData[2]&&approveData[2].dayGasPlanAuditDetailVOList&&approveData[2].dayGasPlanAuditDetailVOList.length===1}">
        <div>
          <div class="photo">
            <img src="../assets/photo.png"
                 alt=""
                 srcset="">
          </div>
          <div>
            <div class="name">大客户部审批 {{approveData[2]&&approveData[2].auditName}}</div>
            <div class="time">{{approveData[2]&&approveData[2].auditTime}}</div>
            <div class="val"
                 v-for="(item,key) in approveData[2]&&approveData[2].dayGasPlanAuditDetailVOList"
                 :key="key">
              <div>{{item.supplierName}}</div>
              <div>批复量:&nbsp;&nbsp;&nbsp;&nbsp;{{item.reviewGasNum}}(方)</div>
            </div>
          </div>
        </div>
        <div class="stepState">
          <div v-if="approveData[2]&&approveData[2].auditStatus==0">
            <img src="../assets/state.png"
                 alt=""
                 srcset="">
            <span class="waiting tip">等待中</span>
          </div>
          <div v-else>
            <img src="../assets/done.png"
                 alt=""
                 srcset="">
            <span class="haveDone tip">已审核</span>
          </div>
        </div>
      </div>
      <div class="item info right">
        <div>
          <div class="photo">
            <img src="../assets/photo.png"
                 alt=""
                 srcset="">
          </div>
          <div>
            <div class="name">通知客户</div>
            <div class="time sendTime"
                 v-if="approveData[2]&&approveData[2].auditTime">{{approveData[2]&&approveData[2].auditTime}}</div>
          </div>
        </div>
        <div class="stepState">
          <div v-if="approveData[2]&&approveData[2].auditStatus==0">
            <img src="../assets/wait.png"
                 alt=""
                 srcset="">
            <span style="marginLeft:10px;fontSize:14px;color:#C0C4CC">等待中</span>
          </div>
          <div v-else>
            <img src="../assets/done.png"
                 alt=""
                 srcset="">
            <span class="haveDone tip">已通知</span>
          </div>
        </div>

      </div>
    </div>
    <div v-show="active==='2'"
         class="body1">
      <el-table :data="tableData"
                border
                class="custom-table-n my-custom-table"
                style="width: 100%">
        <el-table-column prop="order"
                         align="left"
                         header-align="left"
                         label="序号"
                         width="90">
        </el-table-column>
        <el-table-column prop="nodeName"
                         align="right"
                         header-align="right"
                         label="节点名称">
        </el-table-column>
        <el-table-column prop="nodeTime"
                         align="right"
                         header-align="right"
                         label="操作时间">
        </el-table-column>
        <el-table-column prop="operator"
                         align="right"
                         header-align="right"
                         label="操作人">
        </el-table-column>
        <el-table-column prop="dayGasPlanAuditDetailVOList"
                         align="right"
                         header-align="right"
                         label="指定量/批复量(方)">
          <template slot-scope="scope">
            <div v-if="scope.row.dayGasPlanAuditDetailVOList&&(scope.row.dayGasPlanAuditDetailVOList.length===1)">
              {{scope.row.dayGasPlanAuditDetailVOList[0].reviewGasNum}}
            </div>
            <div v-if="scope.row.dayGasPlanAuditDetailVOList&&(scope.row.dayGasPlanAuditDetailVOList.length>1)">
              <div v-for="(item,index) in scope.row.dayGasPlanAuditDetailVOList"
                   :key="index">
                <span>{{item.supplierName}}</span>：<span>{{item.reviewGasNum}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     class="custom-page-n"
                     style="marginTop:13px;"
                     layout="total, slot, prev, pager, next, sizes"
                     :current-page="pager.currentPage"
                     :page-size="pager.pageSize[0]"
                     :page-sizes="[10,20,30]"
                     :total="pager.totalPage"
                     @current-change="handlePagerChange"
                     @size-change="handleSizeChange"><span style="color:#606266;">当前{{this.tableData.length}}条</span></el-pagination>
    </div>
  </div>
</template>

<script>
import api from "../../../http/api";
export default {
  data () {
    return {
      pager: {
        currentPage: 1,
        pageSize: [10],
        totalPage: 0
      },
      oneFlag: false,
      twoFlag: false,
      threeFlag: false,
      active: '1',
      tableData: []
    }
  },
  props: {
    //审批流程数据
    approveData: {
      type: Array,
      default: () => {
        return []
      },
    },
    // predictionGasId
    predictionGasId: {
      type: Number,
      default: () => {
        return null
      },
    },
  },
  watch: {
    approveData: {
      handler () {
        if (this.approveData.length === 0) {
          return
        }
        this.getApproveHistoryList()
        this.active = '1'
        this.oneFlag = false
        this.twoFlag = false
        this.threeFlag = false
        if (this.approveData.length > 0) {
          this.approveData.forEach((item, index) => {
            if (item.auditRole == '4') {
              item.nodeName = '气源贸易群'
              if (item.auditStatus == 0) {
                this.oneFlag = false
              } else if (item.auditStatus == 1) {
                this.oneFlag = true
              }
            }
            if (item.auditRole == '3') {
              item.nodeName = '调度中心'
              if (item.auditStatus == 0) {
                this.twoFlag = false
              } else if (item.auditStatus == 1) {
                this.twoFlag = true
              }
            }
            if (item.auditRole == '2') {
              item.nodeName = '大客户部'
              if (item.auditStatus == 0) {
                this.threeFlag = false
              } else if (item.auditStatus == 1) {
                this.threeFlag = true
              }
            }
            if (item.auditRole == '4' || item.auditRole == '3' || item.auditRole == '2') {
            } else if (item.auditRole == '0') {
            }
          })
        }
      },
      deep: true,
      immediate: true
    },
  },
  computed: {
    isSend () {
      let isSendFlag = false
      // 0等待中1已审核
      this.approveData.forEach(item => {
        if (item.auditRole === '2') {
          item.auditStatus === '0' ? (isSendFlag = false) : (isSendFlag = true)
        }
      })
      if (isSendFlag) {
        return true
      } else {
        return false
      }

    }
  },
  filters: {
    formatTime (val) {
      let time = ''
      if (val) {
        time = val.split('.')[0].split('T')[0] + ' ' + val.split('.')[0].split('T')[1]
      } else { }
      return time
    },
    state (val) {
      let state = ''
      if (val == '0') {
        state = '等待中'
      } else {
        state = '已审核'
      }
      return state
    }
  },
  methods: {
    getApproveHistoryList () {
      let params = {
        predictionGasId: this.predictionGasId,
        current: this.pager.currentPage,
        pageSize: this.pager.pageSize[0],
      }
      this.tableData = []
      api.gasPlanAndFeedback.dayApproveHistoryList(params).then(res => {
        res[0].total >= 1 ? (this.pager.totalPage = res[0].total - 1) : (this.pager.totalPage = res[0].total)
        let list = res[0].list
        list.forEach((item, index) => {
          if (item.auditRole === '0') {
          } else {
            let nodeName = ''
            item.auditRole === '3' ? (nodeName = '调度中心') : (item.auditRole === '2' ? (nodeName = '大客户部') : (nodeName = '气源贸易群'))
            let obj = {
              order: index,
              nodeName: nodeName,
              nodeTime: item.auditTime,
              operator: item.auditName,
              dayGasPlanAuditDetailVOList: item.dayGasPlanAuditDetailVOList,
            }
            if (this.pager.currentPage === 1) {
            } else {
              obj.order = index + 1
            }
            this.tableData.push(obj)
          }
        })

      })
      // approveData () {
      //   return [...this.approveData]
      // },
    },
    selectTag (val) {
      this.active = val
    },
    handlePagerChange (val) {
      this.pager.currentPage = val
      this.getApproveHistoryList()
    },
    handleSizeChange (val) {
      this.pager.pageSize[0] = val
      this.getApproveHistoryList()
    }
  }
}
</script>

<style scoped>
.stepState {
  height: 24px!important;
}
.left {
  position: relative;
}
.sendTime {
  position: absolute;
  top: 52px;
}
.my-custom-table {
  border-right: none;
  border-bottom: none;
}
.have > div {
  align-self: start !important;
}
.have > .photo {
  align-self: start !important;
}
.header {
  display: flex;
  align-items: center;
  height: 56px;
  margin-bottom: 20px;
}
.header > div:nth-of-type(3) {
  display: flex;
  align-items: center;
  color: #409eff;
  margin-top: 10px;
}
.header > div:nth-of-type(3) img {
  vertical-align: middle;
}
.normal {
  font-size: 14px;
  color: #303133;
  font-weight: 400;
  border-bottom: 2px solid #dcdfe6;
  height: 38px;
  line-height: 38px;
  margin-right: 34px;
  margin-top: 10px;
  cursor: pointer;
}
.normal.active {
  color: #47a87d !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  border-bottom: 2px solid #47a87d !important;
}
.body {
  position: relative;
}
.body > .item {
  position: relative;
  z-index: 999;
}
.img1 {
  position: absolute;
  top: 38px;
  right: 214px;
}
.img3 {
  position: absolute;
  top: 38px;
  right: 558px;
}
.img2 {
  position: absolute;
  top: 48px;
  left: 300px;
}
.tip {
  display: inline-block;
  width: 4em;
}
.waiting {
  display: inline-block;
  min-width: 3em;
  margin-left: 10px;
  color: #409eff;
}
.haveDone {
  display: inline-block;
  min-width: 3em;
  margin-left: 5px;
  color: #47a87d;
}
img {
  vertical-align: middle;
}
.box {
  margin-top: 14px;
}

.body {
  display: flex;
  justify-content: space-between;
}

.info {
  width: 298px;
  /* box-sizing: border-box; */
  padding: 5px 0 5px 0;
  min-height: 94px;
  max-height: 120px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
}
.oneSorce {
  max-height: 100px !important;
}
.left {
  max-height: 94px;
}
.have.left {
  max-height: 130px;
}
.info > div:nth-of-type(1) {
  width: 76%;
  display: flex;
}
.info > div:nth-of-type(1) > div:nth-of-type(1) {
  margin-left: 15px;
  margin-right: 10px;
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 12px;
  background-color: #dcdfe6;
  text-align: center;
}
.info > div:nth-of-type(1) > div:nth-of-type(2) .name {
  color: #000000;
  font-size: 14px;
  font-weight: 500;
}
.info .val {
  color: #606266;
  font-size: 12px;
  font-weight: 400;
}
.info .val:nth-of-type(1) {
  margin-bottom: 4px;
}
.info > div:nth-of-type(1) > div:nth-of-type(2) .time {
  font-size: 12px;
  color: #909399;
}
.info > div:nth-of-type(2) {
  width: 28%;
}
.middle {
  display: flex;
  flex-direction: column;
}
.midTop {
  margin-bottom: 20px;
}

.right {
  width: 210px;
  height: 67px;
  min-height: 67px !important;
  max-height: 67px !important;
}
.right > div:nth-of-type(1) {
  width: 60%;
}
.right > div:nth-of-type(2) {
  width: 40%;
}
</style>