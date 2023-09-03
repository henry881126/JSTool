<template>
  <div class="gas-page-bg">
    <div>
      <div class="gas-header">
        <top-menu :date-picker-show="false"
                  title="天然气输配(调度)智慧管理平台"></top-menu>
        <div class="breadcrumb-wrapper">
          <el-breadcrumb>
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>客户管理</el-breadcrumb-item>
            <el-breadcrumb-item>气量对账单</el-breadcrumb-item>
            <el-breadcrumb-item>日气量对账</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="top-content">
        <div class="header">
          <div class="top-content-header-detail">
            <span @click="backDetail"
                  class="el-icon-back">返回</span>
          </div>
          <div class="top-content-top">
            <!-- <button class="el-icon-upload2"
                    @click="Listexport()">导出</button> -->
            <div v-if="showSendBtn">
              <el-button class="el-icon-s-promotion"
                         @click="showSend"
                         disabled
                         v-if="(listData.status == 2) || (listData.status === 3) "
                         style="background:#ccc;cursor:default;">发送</el-button>
              <div v-if="listData.status == 1">
                <span v-if="sendFlag==='true'">
                  <el-button class="el-icon-s-promotion"
                             @click="showSend">发送</el-button>
                </span>
                <span v-else>
                  <el-button class="el-icon-s-promotion"
                             style="background:#ccc;cursor:default;"
                             disabled>发送</el-button>
                </span>
              </div>

            </div>
          </div>
        </div>
        <div class="line"></div>
        <div class="detail-content">
          <div class="customerName">{{ listData.customerName }}</div>
          <div class="doneTime">
            生成时间：<span>{{ listData.sysDate }}</span>
          </div>
          <div class="detail-content-top">
            <div class="subTitle">
              <div></div>
              <span>基本情况</span>
            </div>
            <div class="detail-content-list">
              <div><span class="label">批复量:</span><span class="value">{{ listData.replayGasNum }}(方)</span></div>
              <div><span class="label">提取量:</span><span class="value">{{ listData.gasNumDay }}(方)</span></div>
              <div><span class="label">气源类型:</span>
                <span v-if="listData.contractTypeName==='多种'"
                      class="multiple"
                      style="fontSize:14px;!important">{{listData.contractTypeName}}</span>
                <span v-if="listData.contractTypeName==='直销'"
                      class="directSelling"
                      style="fontSize:14px;!important">{{listData.contractTypeName}}</span>
                <span v-if="listData.contractTypeName==='代销'"
                      class="proxySelling"
                      style="fontSize:14px;!important">{{listData.contractTypeName}}</span>
                <span v-if="listData.contractTypeName==='代输'"
                      class="multiple"
                      style="fontSize:14px;!important">{{listData.contractTypeName}}</span>
                <span v-else
                      class="other"></span>
              </div>
            </div>
            <div class="detail-content-list">
              <!-- <div><i>是否超欠提:</i><span><button :style="{color:listData.gasUsedStatus==='正常'?'#303133':(listData.gasUsedStatus==='超提'?'#F56C6C':'#67C23A')}">{{listData.gasUsedStatus}}</button></span> </div> -->
              <div><span class="label">是否超欠提:</span><span v-if="listData.gasUsedStatus==='正常'"
                      class="normal value"
                      style="fontSize:14px;!important">{{listData.gasUsedStatus}}</span>
                <span class="over value"
                      v-if="listData.gasUsedStatus==='超提'"
                      style="fontSize:14px;!important">{{listData.gasUsedStatus}}</span>
                <span class="less value"
                      v-if="listData.gasUsedStatus==='欠提'"
                      style="fontSize:14px;!important">{{listData.gasUsedStatus}}</span>
              </div>
              <div><span class="label">偏差量:</span><span class="value"
                      :style="{color:listData.gasUsedStatus==='正常'?'#303133':(listData.gasUsedStatus==='超提'?'#F56C6C':'#67C23A')}"> {{ listData.deviationDay }}</span>(方)</div>
              <div> <span class="label">偏差率:</span><span class="value"
                      :style="{color:listData.gasUsedStatus==='正常'?'#303133':(listData.gasUsedStatus==='超提'?'#F56C6C':'#67C23A')}">{{ listData.deviationRateDay }}%</span></div>
            </div>
          </div>
        </div>
        <div class="detail-content-nav">
          <div class="subTitle">
            <div></div>
            <span>气源详情</span>
          </div>
          <el-table :data="tableData"
                    border
                    header-row-class-name="custom-table-header"
                    header-cell-class-name="custom-table-header-cell"
                    cell-class-name="custom-table-cell"
                    class="custom-table-n">

            <!-- <button class="table-btn"> -->
            <el-table-column prop="gasName"
                             label="气源"
                             :show-overflow-tooltip="true"
                             min-width="170">
            </el-table-column>
            <!-- </button> -->
            <el-table-column prop="gasType"
                             label="类型"
                             min-width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.gasType === '1'"
                      class="multiple">代输</span>
                <span v-if="scope.row.gasType === '2'"
                      class="proxySelling">代销</span>
                <span v-if="scope.row.gasType === '3'"
                      class="directSelling">直销</span>
              </template>
            </el-table-column>
            <el-table-column prop="detailTime"
                             min-width="330"
                             label="交割周期">
            </el-table-column>
            <el-table-column prop="replyGasNum"
                             min-width="120"
                             align="right"
                             header-align="right"
                             label="批复量(方)">
            </el-table-column>
            <el-table-column prop="gasNum"
                             min-width="120"
                             align="right"
                             header-align="right"
                             label="提取量(方)">
            </el-table-column>
            <el-table-column prop="gasUsedStatus"
                             min-width="100"
                             label="状态">
              <template slot-scope="scope">
                <div class="stateBox"
                     v-if="scope.row.gasUsedStatus === 1">
                  <i id="icon"
                     style="background:#C0C4CC"></i> <span style="color:#303133;fontSize:14px;">正常</span>
                </div>
                <div class="stateBox"
                     v-if="scope.row.gasUsedStatus === 2"><i id="icon"
                     style="background:#F56C6C"></i> <span style="color:#303133;fontSize:14px;">超提</span></div>
                <div class="stateBox"
                     v-if="scope.row.gasUsedStatus === 3"><i id="icon"
                     style="background:#67C23A"></i><span style="color:#303133;fontSize:14px;">欠提</span></div>
              </template>
            </el-table-column>
            <el-table-column prop="deviationDay"
                             min-width="120"
                             align="right"
                             header-align="right"
                             label="偏差量(方)">
            </el-table-column>
            <el-table-column prop=""
                             min-width="120"
                             align="right"
                             header-align="right"
                             label="偏差率">
              <template slot-scope="scope">{{scope.row.deviationRateDay}}%</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog :visible.sync="dialogVisible"
                 min-width="515"
                 title="日对账单消息发送"
                 class="dialog">
        <div class="dialog-top">
          发送至 <span>{{ listData.customerName }}</span>
        </div>

        <div class="dialog-body">
          <div>
            <span class="label">批复量：</span><span>{{ listData.replayGasNum }}(方)</span>
          </div>
          <div>
            <span class="label">提取量：</span><span>{{ listData.gasNumDay }}(方)</span>
          </div>
          <div></div>
        </div>
        <div class="dialog-body">
          <div>
            <span class="label">是否超欠提：</span>
            <span :class="{
                    'normalTip':listData.gasUsedStatus === '正常',
                    'overTip': listData.gasUsedStatus === '超提',
                    'lessTip': listData.gasUsedStatus === '欠提'
                  }"
                  style="fontSize:14px;!important">{{ listData.gasUsedStatus }}</span>
          </div>
          <div>
            <span class="label">偏差量：</span>
            <span v-if="listData.gasUsedStatus === '超提'"
                  class="overTi">+{{ listData.deviationDay }}
              <span style="color:#303133">(方)</span>
            </span>
            <span v-if="listData.gasUsedStatus === '欠提'"
                  class="lessTi">
              {{ listData.deviationDay }}
              <span style="color:#303133">(方)</span>
            </span>
            <span v-if="listData.gasUsedStatus === '正常'"
                  class="normalTi">
              {{ listData.deviationDay }}
              <span style="color:#303133">(方)</span>
            </span>
          </div>
          <div style="">
            <span class="label">偏差率：</span>
            <span v-if="listData.gasUsedStatus === '正常'"
                  class="normalTi">{{ listData.deviationRateDay }}%</span>
            <span v-if="listData.gasUsedStatus === '超提'"
                  class="overTi">{{ listData.deviationRateDay }}%</span>
            <span v-if="listData.gasUsedStatus === '欠提'"
                  class="lessTi">{{ listData.deviationRateDay }}%</span>
          </div>
        </div>
        <el-row> </el-row>
        <div class="tips">
          <el-checkbox class="checkbox"
                       v-model="checked">发送对账单通知给客户</el-checkbox>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>

          <el-button type="primary"
                     v-show="detailShow"
                     @click="detailSendList()">发 送</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import topMenu from "../../components/topMenu/topMenu2";
import api from "../../http/api";
import exportApi from "../../components/export/export.vue";
export default {
  mixins: [exportApi],
  data () {
    return {
      sendFlag: 'true',
      showSendBtn: true,
      checked: true,
      detailShow: true,
      dialogVisible: false,
      listData: {
        id: '',
        status: '',
        customerName: '',
        replayGasNum: '',
        gasNumDay: '',
        contractTypeName: '',
        gasUsedStatus: '',
        deviationDay: '',
        deviationRateDay: '',
        gasUsedStatus: '',
        gasUsedStatus: '',
        sysDate: '',
      },
      tableData: [],
      gettime: "",
    };
  },
  created () {
    let listData = this.$route.query
    this.sendFlag = this.$route.query.sendFlag
    console.log(this.sendFlag);
    Object.keys(this.listData).forEach(key => {
      this.listData[key] = listData[key]
    })
    this.serchmationList();
    if (this.listData.deviationDay > 0 && this.listData.deviationRateDay > 0) {
      this.style && (this.style.color = "#67c23a")
    } else {
      this.style && (this.style.color = "red")
    }
  },
  mounted () {
    window.localStorage.setItem('searchData', JSON.stringify(this.$route.query))
  },
  watch: {
    checked (val) {
      this.detailShow = val
    }
  },
  methods: {
    Listexport () {
      let data = {
        code: this.$store.getters.curCom,
        //登陆返回level
        orgLevel: this.$store.getters.curComInfo.orgLevel,
        time: this.listtimeOne(this.listtime),
        current: this.currentPage,
        pageSize: this.pageSize,
        minDeviationDay: this.min,
        maxDeviationDay: this.max,
      };
      api.volumeList.mationListexport(data).then((res) => {
        this.download(res, "xlsx", "日气量对账单");
      });
    },
    showSend () {
      this.dialogVisible = true
    },
    //日度气量对账单发送按钮
    detailSendList () {

      this.messageSend()
      this.style && (this.style.background = "#ccc")
    },

    messageSend () {
      let data = {
        id: this.listData.id,
        type: true,
      }
      this.dialogVisible = false
      api.volumeList.messageSend(data).then((res) => {
        if (res) {
          this.showSendBtn = false
          this.$message({
            type: "success",
            message: "发送成功",

          });
        }
      })
    },
    //查询日度气量对账单明细
    serchmationList () {
      let data = {
        id: this.listData.id,
      };
      api.volumeList.serchmationList(data).then((res) => {
        this.tableData = res;
        for (let i in this.tableData) {
          let detailTime = this.tableData[i].startTime.slice(0, -3) + "~" + this.tableData[i].endTime.slice(0, -3);
          this.tableData[i].detailTime = detailTime
        }
      });
    },
    //返回上一页
    backDetail () {
      // this.$router.push({
      //   name: "gasvolumelist",
      //   params: {
      //     gaslistData: row,
      //   },
      // })
      this.$router.go(-1)
    },
    //截取时间字符串
    detailTime () {
      for (let i in this.tableData) {

        let time = this.tableData[i].startTime.substring(0, 4) + "/" + this.tableData[i].startTime.substring(5, 7) + "/" + this.tableData[i].startTime.substring(8, 10) + " " + this.tableData[i].startTime.substring(12, 16);
        // let time1 = this.tableData[i].endTime.substring(0, 4) + "/" + this.tableData[i].endTime.substring(5, 7) + "/" + this.tableData[i].endTime.substring(9, 10) + " " + this.tableData[i].endTime.substring(12, 16);
        let time1 = this.tableData[i].endTime.substring(0, 4) + "/" + this.tableData[i].endTime.substring(5, 7) + "/" + this.tableData[i].endTime.substring(8, 10) + " " + this.tableData[i].endTime.substring(12, 16);

        let detailTime = time + "-" + time1;
        this.tableData[i].detailTime = detailTime
      }
    },
  },

  components: {
    topMenu,
  },
};
</script>

<style scoped lang="scss" >
.breadcrumb-wrapper {
  height: 41px;
  padding: 10px 0 10px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  /deep/ .el-breadcrumb__item:last-child > .el-breadcrumb__inner {
    color: #fff;
  }
  /deep/ .el-breadcrumb__inner {
    color: rgba(255, 255, 255, 0.5);
  }
}
.line {
  height: 1px;
  background-color: #e4e7ed;
  margin-left: -20px;
  margin-right: -20px;
}
.top-content {
  padding-top: 0 !important;
}
.subTitle > div {
  width: 4px;
  height: 16px;
  background-color: #47a87d;
  margin-right: 4px;
}
.subTitle {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  text-align: left;
  display: flex;
  height: 22px;
  align-items: center;
  margin-bottom: 20px;
}
.customerName {
  font-size: 24px;
  font-weight: 500;
  color: #303133;
  text-align: center;
}
.doneTime {
  font-size: 14px;
  color: #303133;
  text-align: left;
  margin-top: 20px;
  margin-bottom: 20px;
}
.detail-content {
  line-height: 24px;
}
.gas-page-bg {
  font-size: 14px !important;
}
.el-icon-back {
  font-size: 18px;
  color: #409eff;
  cursor: pointer;
  font-weight: 700;
}
.stateBox {
  display: flex;
  align-items: center;
}
.checkbox /deep/ .el-checkbox__label {
  font-size: 14px;
  color: #303133;
}
.overTi {
  color: #f56c6c;
}
.lessTi {
  color: #67c23a;
}
.normalTi {
  color: #303133;
}
.normal {
  font-size: 14px;
  color: #303133;
}
.over {
  display: inline-block !important;
  width: 48px !important;
  height: 24px !important;
  text-align: center !important;
  line-height: 24px !important;
  border-radius: 12px !important;
  color: #f56c6c !important;
  background-color: #fef0f0 !important;
  border: 1px solid #f56c6c !important;
}
.less {
  display: inline-block !important;
  width: 48px !important;
  height: 24px !important;
  text-align: center !important;
  line-height: 24px !important;
  border-radius: 12px !important;
  background-color: #f0f9eb !important;
  color: #67c23a !important;
  border: 1px solid #67c23a !important;
}
.multiple {
  display: inline-block !important;
  width: 48px !important;
  height: 24px !important;
  text-align: center !important;
  line-height: 24px !important;
  border-radius: 12px !important;
  background-color: #fef0f0 !important;
  color: #f56c6c !important;
  border: 1px solid #f56c6c !important;
}
.directSelling {
  display: inline-block !important;
  width: 48px !important;
  height: 24px !important;
  text-align: center !important;
  line-height: 24px !important;
  border-radius: 12px !important;
  background-color: #ecf5ff !important;
  color: #409eff !important;
  border: 1px solid #409eff !important;
}
.proxySelling {
  display: inline-block !important;
  width: 48px !important;
  height: 24px !important;
  text-align: center !important;
  line-height: 24px !important;
  border-radius: 12px !important;
  background-color: #fcf6ec !important;
  color: #e6a23c !important;
  border: 1px solid #e6a23c !important;
}
.ThirdParty {
  display: inline-block !important;
  width: 48px !important;
  height: 24px !important;
  text-align: center !important;
  line-height: 24px !important;
  border-radius: 12px !important;
  background-color: #fcf6ec !important;
  color: #e6a23c !important;
  border: 1px solid #e6a23c !important;
}
.other {
  display: inline-block !important;
  width: 48px !important;
  height: 24px !important;
  text-align: center !important;
  line-height: 24px !important;
  border-radius: 12px !important;
  opacity: 0;
}
.detail-content-list {
  display: flex;
  height: 20px;
  align-items: center;
  margin-bottom: 23px;
}
.detail-content-list > div {
  flex: 1;
  // text-align: center;
  display: flex;
  padding-left: 60px;
}
.detail-content-list .label {
  display: inline-block;
  width: 6em;
  text-align: right;
  font-style: normal;
  color: #606266 !important;
  font-size: 14px !important;
  height: 24px;
  line-height: 24px;
}
.detail-content-list span {
  display: inline-block;
  margin-left: 5px;
  color: #303133;
}
.el-table__empty-text {
  height: 340px;
}
#icon {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  float: left;

  margin-right: 5px;
  margin-top: 2px;
}
.userList {
  height: 30px;
  line-height: 30px;
  padding-left: 20px;
  margin: 2px 0 8px 0;
  .el-breadcrumb__inner.is-link {
    color: #ccc;
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: #fff;
    font-weight: 100;
  }
  a {
    text-decoration: none;
    color: #ccc;
    font-weight: 400;
  }
  /deep/ .el-breadcrumb__inner {
    color: #fff;
  }
}
.top-content {
  // border-radius: 4px;
  // box-sizing: border-box;
  // padding: 20px;
  // width: 97.5%;
  // background-color: #fff;
  // margin-top: -6px;
  // margin-left: 20px;
  // text-align: center;
  // overflow: scroll;
  // padding-bottom: 50px;
  // padding-top: 0px !important;

  .header {
    width: 100%;
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .top-content-header-detail {
    width: 600px;
    display: flex;
    font-size: 18px;
  }
  .top-content-top {
    button {
      cursor: pointer;
      width: 79px;
      // height: 32px;
      border-radius: 25px;
      border: 0;
      outline: none;
      margin: 0 5px;
      color: #000;
      &:nth-child(1) {
        background-color: #47a87d;
        color: #fff;
      }
    }
  }
  .detail-content {
    width: 100%;

    margin-top: 30px;
    p {
      float: left;
      margin-top: -14px;
      color: #303133;
    }
    .detail-content-top {
      width: 100%;
      height: 144px;
      padding: 20px;
      box-sizing: border-box;
      border-radius: 4px;
      background-color: #f5f7fa;
    }
  }
}
.detail-content-nav {
  background-color: #f5f7fa;
  margin-top: 20px;
  border-radius: 4px;
  padding: 20px;
  h3 {
    display: flex;
    padding: 23px 0 0 20px;
    div {
      width: 4px;
      height: 16px;
      background-color: #47a87d;
      margin: 5px 5px 0 0;
    }
  }
  .el-table th > .cell {
    text-align: center;
  }
  .el-table th.is-leaf {
    background-color: #ebeef5;
  }
}

.showTag {
  display: flex;
  justify-content: center;
}
.showTag span {
  display: inline-block;
  height: 24px;
  line-height: 24px;
  padding: 0 10px;
  border-radius: 12px;
  border: 1px solid #47a87d;
  background: #edf6f2;
  color: #47a87d;
}
.showTag span:nth-of-type(2) {
  margin-left: 5px;
}
.tagBox {
  display: inline-block;
  height: 24px;
  line-height: 24px;
  padding: 0 10px;
  border-radius: 12px;
  border: 1px solid #47a87d;
  background: #edf6f2;
  color: #47a87d;
  white-space: nowrap;
  margin: 0 5px;
  margin-bottom: 5px;
}
.dialog /deep/ .el-dialog__header {
  display: flex;
  justify-content: space-between;
}
.dialog /deep/ .el-dialog__body {
  padding-top: 20px;
}
.dialog-top {
  font-weight: 500 !important;
  color: #303133;
  font-size: 14px;
  margin-bottom: 20px;
  text-align-last: left;
}
.dialog-body {
  display: flex;
}
.dialog-body > div {
  flex: 1;
}
.normalTip,
.normal {
  font-size: 14px;
  line-height: 24px;
  color: #303133;
}
.overTip {
  display: inline-block;
  width: 48px;
  height: 24px;
  line-height: 23px;
  border-radius: 12px;
  text-align: center;
  background-color: #fef0f0;
  box-sizing: border-box;
  border: 1px solid #f56c6c;
  color: #f56c6c;
}
.over {
  color: #f56c6c;
}
.lessTip {
  display: inline-block;
  width: 48px;
  height: 24px;
  line-height: 23px;
  border-radius: 12px;
  text-align: center;
  background-color: #f0f9eb;
  box-sizing: border-box;
  border: 1px solid #67c23a;
  color: #67c23a;
}
.less {
  color: #67c23a;
}
.tips {
  height: 21px;
  display: flex;
  align-items: center;
  margin-top: 30px;
}
.tips input {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
.tips span {
  font-size: 14px;
  color: #303133;
}
.tips input[type="checkbox"] {
  margin-right: 5px;
  cursor: pointer;
  font-size: 14px;
  width: 16px;
  height: 16px;
  position: relative;
  background-color: #409eff;
}

.tips input[type="checkbox"]:after {
  position: absolute;
  width: 16px;
  height: 16px;
  top: 0;
  content: " ";

  color: #fff;
  display: inline-block;
  visibility: visible;
  // padding: 0px 3px;
  // border-radius: 3px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  button {
    width: 58px;
    height: 32px;
    border-radius: 16px;
    text-align: center;
    line-height: 31px;
    padding: 0;
    font-size: 14px;
    &:nth-child(1) {
      background-color: #f5f7fa;
    }
    &:nth-child(2) {
      background-color: #47a87d;
      border: 0;
    }
  }
}
.dialog-body .label {
  margin-bottom: 21px;
  font-size: 14px;
  color: #606266;
  display: inline-block;
  width: 7em;
  text-align: right;
}
.tag-daishu {
  width: 48px;
  height: 24px;
  line-height: 24px;
  background: #fef0f0;
  color: #f56c6c;
  font-size: 14px;
  border: 1px solid #f56c6c;
  border-radius: 16px;
  margin-right: 16px;
}
.tag-zhixiao {
  width: 48px;
  height: 24px;
  line-height: 24px;
  background: #fcf6ec;
  color: #e6a23c;
  border: 1px solid #e6a23c;
  font-size: 14px;
  border-radius: 16px;
  margin-right: 16px;
}
.tag-sanfang {
  width: 48px;
  height: 24px;
  line-height: 24px;
  background: #ecf5ff;
  color: #409eff;
  font-size: 14px;
  border: 1px solid #409eff;
  border-radius: 16px;
  margin-right: 16px;
}
/deep/.scopeType {
  text-align: center;
  display: inline-block;
  width: 48px;
  height: 24px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 12px;
}
/deep/.slider-dialog {
  width: 240px;
}
/deep/.slider-dialog .el-slider {
  display: flex;
  justify-content: center;
}
/deep/.slider-dialog .el-slider__runway {
  width: 220px;
}
/deep/.top-content
  .top-content-header
  .el-date-editor.el-input[data-v-1f30c1bc],
.top-content
  .top-content-header
  .el-date-editor.el-input__inner[data-v-1f30c1bc] {
  height: 0 !important;
}
/deep/.top-content .top-content-header .el-input[data-v-1f30c1bc] {
  height: 0 !important;
}
/deep/.el-input__inner {
  height: 32px;
  min-width: 100px;
  border: 1px solid #ccc;
}
.gas-page-bg {
  min-width: auto;
}
/deep/[data-v-1f30c1bc] .el-input .el-input__inner {
  color: #303133;
}
/deep/.el-input--suffix .el-input__inner {
  color: 303133 !important;
}

/deep/.el-input > .el-input {
  border-radius: 25px;
}
.top-content .top-content-header .el-input[data-v-1f30c1bc] {
  border-radius: 20px;
}
/deep/.el-input .el-input__inner {
  background-color: #f5f7fa;
  border-radius: 20px;
}
/deep/.el-breadcrumb__inner {
  color: #ccc;
  font-weight: 400;
}
/deep/.el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #fff;
}
.el-input .el-input__inner {
  background-color: #dcdfe6;
}
.top-content .top-content-header .el-input .el-input__inner {
  border: 1px solid #dcdfe6;
}
.el-input .el-input__suffix {
  border: 0;
}
/deep/ .el-input .el-input__suffix {
  border-left: none; // 去除原全局样式中的左侧竖线
}
.slider-footer {
  float: right;
  height: 44px;
  line-height: 44px;
  a {
    text-decoration: none;
    color: #47a87d;
    font-size: 12px;
    cursor: pointer;
  }
  button {
    width: 44px;
    height: 24px;
    outline: none;
    border-radius: 12px;
    color: #000;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    margin: 0 10px;
    font-size: 12px;
    cursor: pointer;
  }
}
.slider-dialog {
  width: 240px;
  height: 46px;
  border-bottom: 1px solid #dcdfe6;
}
.el-slider__marks-text {
  font-size: 10px;
}
.el-slider__runway {
  width: 220px;
  margin-left: 10px;
}
.el-slider__bar {
  background-color: #47a87d;
}
.one {
  position: absolute;
  width: 240px;
  height: 91px;
  background-color: #ffffff;
  left: 358px;
  top: 158px;
  z-index: 10;
  border-radius: 4px;
  box-shadow: 5px 5px 10px gray;
}
.custom-page-n {
  float: left;
}
.top-content .top-content-header .el-input--prefix .el-input__inner {
  background-color: #f5f7fa;
}
.el-dialog {
  margin-top: 35vh !important;
  .dialog-top {
    font-weight: 500;
    color: #303133;
    font-size: 14px;
    margin-bottom: 20px;
    text-align-last: left;
  }
  .dialog-content {
    width: 100%;
    display: flex;
    div {
      width: 35%;
      text-align: left;
      display: flex;

      i {
        display: inline-block;
        width: 80px;
        text-align: right;
        font-style: normal;
        &:nth-child(2) {
          text-align: left;
        }
      }
      span {
        display: inline-block;
        width: px;
        text-align: left;
      }
    }
  }
  .dialog-content-list {
    height: 40px;
    line-height: 40px;
    width: 100%;
    box-sizing: border-box;
    div {
      width: 33%;
      text-align: left;
      float: left;
    }
    i {
      display: inline-block;
      width: 80px;
      text-align: right;
      font-style: normal;
    }
    span {
      display: inline-block;
      text-align: left;
    }
  }
}
.userSpan {
  padding: 0 5px;
  color: #409eff;
}
.el-dialog .el-dialog__header .el-dialog__title {
  padding: 0;
  float: left;
  margin-left: -5px;
  margin-top: -3px;
  color: #5e73a7;
}
.el-dialog__wrapper {
  background-color: rgba(22, 47, 96, 0.5);
}
.userList {
  height: 30px;
  line-height: 30px;
  padding-left: 20px;
  margin: 2px 0 8px 0;
  &:nth-child(3) {
    color: #fff;
  }
  .el-breadcrumb__inner.is-link {
    color: #ccc;
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: #fff;
    font-weight: 400;
  }
  a {
    text-decoration: none;
    color: #ccc;
    font-weight: 400;
  }
  .el-breadcrumb__inner {
    color: #ccc;
  }
}
.top-content {
  border-radius: 4px;
  box-sizing: border-box;
  padding: 20px;
  width: 97.5%;
  padding-bottom: 110px;
  background-color: #fff;
  margin-left: 20px;
  text-align: center;

  .top-content-header {
    display: flex;
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    font-size: 18px;

    h3 {
      margin-top: -2px;
      font-size: 18px;
      color: #303133;
    }
    .el-input--prefix .el-input__inner {
      box-sizing: border-box;
      border-radius: 25px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 180px;
      height: 32px;
      margin: 0 7.5px 0 30px;
    }

    .el-input .el-input__inner {
      background-color: #f5f7fa !important;
      color: #303133;
    }
    .el-input {
      width: 180px;
      height: 32px;
      margin: 0 7.5px;
      background-color: #f5f7fa;
    }
    .el-input .el-input__inner {
      background-color: #dcdfe6;
    }
    .el-input > .el-input {
      background-color: #fff;
    }
    ::-webkit-input-placeholder {
      color: #303133;
    }
  }
}
</style>>
