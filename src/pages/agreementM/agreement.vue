<template>
  <div class="agreement-management">
    <div class="agreement-ontents-container gas-page-bg">
      <div class="top-bag">
        <div class="top-header">
          <top-menu
            @t-date-change="tDateChange"
            :date-picker-show="false"
            title="天然气输配(调度)智慧管理平台"
          ></top-menu>
          <div class="breadcrumb-con">
            <el-breadcrumb>
              <el-breadcrumb-item>首页</el-breadcrumb-item>
              <el-breadcrumb-item>客户管理</el-breadcrumb-item>
              <el-breadcrumb-item>合同管理</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
      <div
        v-if="!editPage && !addBCAgreement && !addPage && !descPage && !bcdescPage
        "
        class="agreement-content">
        <div class="table-search">
          <div class="search-left">
            <div class="search-title">
              <div class="block">合同管理</div>
            </div>
            <div class="search-content">
              <div class="search-content-left">
                <div class="day-table-date">
                  <div class="block search-icon">
                    <el-input
                      v-model="searchList.searchName"
                      placeholder="请输入要搜索的内容"
                    >
                    </el-input>
                    <i class="el-icon-search"></i>
                  </div>
                </div>
                <div>
                  <div class="block report-change-select">
                    <el-select
                      v-model="searchList.agreementType"
                      placeholder="合同类型"
                      clearable>
                      <el-option
                        v-for="item in contractType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="block report-change-select">
                  <el-select
                    v-model="searchList.agreementStatus"
                    placeholder="合同状态"
                    clearable>
                    <el-option
                      v-for="item in contractStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div class="day-table-date">
                  <div class="block">
                    <el-date-picker
                      v-model="searchList.agreementY"
                      type="year"
                      placeholder="合同年"
                      clearable>
                    </el-date-picker>
                  </div>
                </div>
                <div >
                  <el-button
                    type="success"
                    round
                    class="searchBtn"
                    @click="searchBtn('1')">
                    <i class="el-icon-search"></i>
                    查询</el-button>
                </div>
              </div>
             <div class=" creatBtn">
               <el-button
                  round
                  @click="exportAgreement">
                  <i class="el-icon-upload2"></i>
                  导出</el-button>
                <el-button
                  type="success"
                  round
                  class="searchBtn"
                  @click="creatAgreement">
                  <i class="el-icon-plus"></i>
                  创建合同</el-button>
              </div>
            </div>
          </div>
           
        </div>
        <div class="agreement-list">
          <el-table
            :data="tableList"
            class="custom-table-n custom-table"
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            row-key="rowKey"
            border
            default-expand-all
            :tree-props="{
              children: 'agreementList',
              hasChildren: 'hasChildren',
            }"
            ref="agreementTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column
              prop="customerName"
              label="客户名称"
              align="left"
              fixed="left"
              min-width="220px"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="contractNo"
              label="合同编号"
              align="center"
              width="150px"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="contractType"
              align="center"
              min-width="100px"
              label="合同类型"
              width="150px"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span
                  class="agreement-type"
                  :class="{
                    red: scope.row.contractType == '1',
                    yellow: scope.row.contractType == '2',
                    blue: scope.row.contractType == '3',
                    green: scope.row.contractType == '4',
                  }">
                  {{ scope.row.contractType | agreementTypeF }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="contractName"
              label="合同名称"
              align="left"
              width="200px"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="contractDetailAmount"
              label="合同总量(万方)"
              align="right"
              min-width="160px"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.contractDetailAmount === null
                    ? "-"
                    : scope.row.contractDetailAmount
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="contractTerm"
              label="合同期"
              align="left"
              min-width="200px"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span v-if="scope.row.contractType == '4'">{{
                  scope.row.changeMonthC
                }}</span>
                <template v-else>
                  <span>{{
                    scope.row.contractBeginDate
                      ? getCusYear(scope.row.contractBeginDate) + "~"
                      : "-"
                  }}</span>
                  <span>{{
                    scope.row.contractEndDate
                      ? getCusYear(scope.row.contractEndDate)
                      : ""
                  }}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              prop="signingDate"
              label="签订时间"
              align="left"
              min-width="140px"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{
                  scope.row.signingDate
                    ? getCusYear(scope.row.signingDate)
                    : "-"
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="contractStatus"
              label="合同状态"
              min-width="120px"
              align="left">
              <template slot-scope="scope">
                <div class="status-wrapper">
                  <span
                    class="agreement-status"
                    :class="{
                      shengxiao: scope.row.contractStatus == '2',
                      shixiao: scope.row.contractStatus == '3',
                      wait: scope.row.contractStatus == '1',
                    }"
                  ></span>
                  <span v-if="scope.row.contractStatus == '-'">{{
                    scope.row.contractStatus
                  }}</span>
                  <span v-else>
                    {{ scope.row.contractStatus | contractStatusF }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" width="200">
              <template slot-scope="scope">
                {{scope.row.modifiedDate ? scope.row.modifiedDate : '-'}}  
              </template>              
            </el-table-column>            
            <el-table-column
              label="操作"
              align="left"
              width="290px"
              fixed="right">
              <template slot-scope="scope">
                <el-button
                  style="font-size: 16px; color: #46a0fc"
                  type="text"
                  @click="goDesc(scope.row)"
                  >查看</el-button>
                <span class="operate-split">|</span>
                <el-button
                  style="font-size: 16px; color: #46a0fc"
                  type="text"
                  @click="goEdit(scope.row)"
                  >编辑</el-button>
                <span class="operate-split">|</span>
                <el-button
                  style="font-size: 16px; color: #46a0fc"
                  type="text"
                  @click="contractDelete(scope.row)"
                  >删除</el-button>
                <el-button
                  class="supplementaryA"
                  v-if="scope.row.contractType != 4"
                  type="success"
                  round
                  @click="supplementaryAgreement(scope.row)">
                  <i class="el-icon-plus"></i>
                  补充协议</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-box">
            <el-pagination
              layout="total, slot, prev, pager, next, sizes"
              background
              class="custom-page-n"
              @current-change="tablePageChange"
              @size-change="handleSizeChange"
              :current-page="tableListPage.current"
              :page-size="tableListPage.pageSize"
              :page-sizes="[10,20,30]"
              :total="tableListPage.total"
            >
            <span style="color:#606266;">当前{{this.tableList.length || 0}}条</span>
            </el-pagination>
          </div>
        </div>
      </div>
      <agreement-add
        :isEdit="isEdit"
        @backGo="backGo"
        :getContractID="getContractID"
        v-if="editPage || addPage"
      ></agreement-add>
      <bucAgreementAdd
        :isEdit="isEdit"
        :agreenmentId="agreenmentId"
        :agreenmentContractId="agreenmentContractId"
        :MaincontractType="MaincontractType"
        :MainId="MainId"
        @backGo="backGo"
        :McontractId="McontractId"
        v-if="addBCAgreement"
      ></bucAgreementAdd>
      <bcAgreementDesc
        @backGo="backGo"
        :agreenmentId="agreenmentId"
        v-if="bcdescPage"
      ></bcAgreementDesc>
      <agreementDesc
        :getContractID="getContractID"
        @backGo="backGo"
        v-if="descPage"
      ></agreementDesc>
    </div>
    <el-dialog
      title="提示"
      width="30%"
      :visible.sync="dialogFromVisibleDel"
      :key="editTimer + 'h'">
      <div class="set-detail confirmbtn deleteL">
        <div class="confirmbtn-content">
          <span>确定要删除"{{ delData.customerName }}"吗？</span>
        </div>
        <div>
          <div class="set-detail-btn right">
            <el-button
              round
              @click="dialogFromVisibleDel = false"
              class="consoleBtn"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              round
              @click="delBtnConfirm"
              class="createBtn"
            >
              确定
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from "/src/http/api";
import topMenu from "../../components/topMenu/topMenu2";
import exportApi from "/src/components/export/export";
import agreementAdd from "./agreementAdd";
import bucAgreementAdd from "./bucAgreementAdd";
import bcAgreementDesc from "./bcAgreementDesc";
import agreementDesc from "./agreementDesc";
import dongguanApi from "/src/http/dongguan";
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'

import {
  getCusYear,
  getCusYear1,
  groupingData,
} from "./utils/commen";
export default {
  name: "PurchaseAnalysiss",
  mixins: [exportApi, buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
  components: {
    topMenu,
    agreementAdd,
    bucAgreementAdd,
    bcAgreementDesc,
    agreementDesc,
  },
  props: {},
  data() {
    return {
      MaincontractType: "",
      editTimer: 9,
      dialogFromVisibleDel: false,
      show: false,
      editPage: false,
      addPage: false,
      addBCAgreement: false, //补充协议
      descPage: false, //详情
      bcdescPage: false, //补充协议详情
      MainId: "",
      searchList: {
        searchName: "",
        agreementType: "",
        agreementStatus: "",
        agreementY: new Date().getFullYear().toString(),
      },
      tableList: [],
      tableListPage: {
        list: [],
        current: 1,
        pageSize: 10,
        total: 0,
      },
      delData: "",
      contractStatus: [
        {
          value: "1",
          label: "待生效",
        },
        {
          value: "2",
          label: "生效",
        },
        {
          value: "3",
          label: "失效",
        },
      ],
      contractType: [
        {
          value: "1",
          label: "代输",
        },
        {
          value: "2",
          label: "代销",
        },
        {
          value: "3",
          label: "直销",
        },
        {
          value: "4",
          label: "补充协议",
        },
      ],
      input: "",
      options: [],
      startTime: "",
      radio: false,
      comOptions: "",
      position: 0,
      getContractID: "", //获取id
      agreenmentContractId: "", //获取补充协议关联的合同id
      isEdit: false, //是否编辑
      ListD: "",
      agreenmentId: "", //协议id
      McontractId:'',//主合同id
    };
  },
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom;
    },
    curComCodeName: function () {
      return this.$store.getters.curComName;
    },
    curComInfo: function () {
      return this.$store.getters.curComInfo;
    },
    userInfo: function () {
      return this.$store.getters.userInfo;
    },
  },
  watch: {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if (n && o) {
          this.getData();
        }
      },
    },
  },
  filters: {
    agreementTypeF(val) {
      if (val == 1) {
        return "代输合同";
      } else if (val == 2) {
        return "代销合同";
      } else if (val == 3) {
        return "直销合同";
      } else if (val == 4) {
        return "补充协议";
      }
    },
    contractStatusF(val) {
      if (val == 1) {
        return "待生效";
      } else if (val == 2) {
        return "生效";
      } else if (val == 3) {
        return "失效";
      }
    },
  },

  created() {
    this.getTokenGetTokenNew();
    this.contractList();
    this.comOptions = this.$store.getters["companyList"];
  },
  mounted() {
  },
  methods: {
    backGo() {
      this.editPage = false;
      this.addBCAgreement = false;
      this.addPage = false;
      this.descPage = false;
      this.bcdescPage = false;
      this.contractList();
    },
    goEdit(val) {
      this.getContractID = val.id;
      this.agreenmentContractId = val.contractId;
      if (val.isAgreement) {
        this.agreenmentId = val.id;
        this.agreenmentContractId = val.contractId;
        this.addBCAgreement = true;
      } else {
        this.agreenmentContractId = val.contractId;
        // 编辑页面
        this.editPage = true;
      }
      this.isEdit = true;
    },
    goDesc(val) {
      this.getContractID = val.id;
      if (val.isAgreement) {
        this.agreenmentId = val.id;
        this.bcdescPage = true;
      } else {
        this.descPage = true;
      }
    },
    //   补充协议
    supplementaryAgreement(val) {
      this.agreenmentId = "";
      this.isEdit = false;
      this.MainId = val.id;
      this.McontractId = val.id  
      this.addBCAgreement = true;
    },
    // 导出
    exportAgreement() {
      const checkedRecord = this.$refs.agreementTable.selection
      if(!checkedRecord || checkedRecord.length < 1) {
        this.$message({
          type: 'warning',
          message: '请选择数据后再执行导出操作！',
          duration: 3000
        })
        return false
      }

      let ids = ''
      checkedRecord.map(item => {
        ids += item.id + ','
      })
      ids = ids.substr(0, ids.length - 1)
      let params = {
        ids
      }
      dongguanApi.contract.exportData(params).then(res => {
        this.download(res, 'xlsx', '合同管理列表')
      })
    },
    creatAgreement() {
      this.isEdit = false;
      this.addPage = true;
    },
    // 调整每页显示条数 
    handleSizeChange(val) {
      console.log('val:',val)
      this.tableListPage.current = 1
      this.tableListPage.pageSize = val
      this.contractList()
    },
    tablePageChange: function (page) {
      this.tableListPage.current = page;
      this.contractList();
      //   this.getData()
    },
    _format(value) {
      return () => {
        return value + "%";
      };
    },
    getData() {
      this.contractList();
    },
    searchBtn(val) {
      if (val == "1") {
        this.tableListPage.current = 1;
      }
      this.contractList(val);
    },
    // 合同列表
    contractList() {
      let data = {
        compCode: this.curComCode,
        contractDate: this.searchList.agreementY
          ? typeof this.searchList.agreementY == "string"
            ? this.searchList.agreementY
            : this.searchList.agreementY.getFullYear()
          : "",
        contractStatus: this.searchList.agreementStatus,
        contractType: this.searchList.agreementType,
        current: this.tableListPage.current,
        orgLevel: this.curComInfo.orgLevel,
        pageSize: this.tableListPage.pageSize,
        queryName: this.searchList.searchName,
        sysDate: "",
      };
      dongguanApi.contract.contractList(data).then((res) => {
        this.tableList = res.data;
        this.tableListPage.total = res.total;
        this.tableList.forEach((item) => {
          item.rowKey = Math.random().toString();
          item.agreementList.forEach((item) => {
            item.rowKey = Math.random().toString();
            item.isAgreement = true;
            let changeMonthS = item.changeMonth.split(",");
            let b = [];
            changeMonthS.forEach((item1) => {
              let obj = {};
              obj.year = item1.substring(0, 4);
              obj.month = item1.substring(4, 6);
              b.push(obj);
            });
            let group = groupingData(b, "year");
            let month1 = "";
            group.forEach((item2) => {
              let cancat = "";
              item2.list.forEach((item3) => {
                cancat = cancat + item3.month + "/";
              });
              let spitMonth = cancat.slice(0, cancat.length - 1);
              item2.year = item2.year + "/" + spitMonth;
              month1 += item2.year + ",";
            });
            item.changeMonthC = month1.slice(0, month1.length - 1);
          });
        });
      });
    },
    getTokenGetTokenNew() {
      let data = {
        password: "admin123",
        projectName: "能源分销",
        username: "energydistribution",
      };
      dongguanApi.contract.getTokenGetTokenNew(data).then((res) => {
        //
        if (res.code == "200") {
          sessionStorage.setItem("DONGGUAN_Token", res.token);
        }
      });
    },
    // 删除合同列表
    contractDelete(val) {
      this.dialogFromVisibleDel = true;
      this.ListD = val;
      this.delData = val;
    },
    // s删除列表确认
    delBtnConfirm() {
      this.dialogFromVisibleDel = false;
      let data = {
        id: this.delData.id,
        userId: this.curComCode,
      };
      // 判断是否为协议
      if (this.ListD.isAgreement) {
        dongguanApi.contract.agreementDelete(data).then((res) => {
          if (res) {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 1000,
            });
            this.contractList();
          }
        });
      } else {
        dongguanApi.contract.contractDelete(data).then((res) => {
          if (res) {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 1000,
            });
            this.contractList();
          }
        });
      }
    },
    tableAbnormalSortChange: function ({ prop, order }) {
      switch (order) {
        case "ascending":
          this.getAbnormalOfDay(prop, "asc");
          break;
        case "descending":
          this.getAbnormalOfDay(prop, "desc");
          break;
        default:
          break;
      }
    },
    tDateChange: function (date) {
      this.startTime = new Date(date).getTime() / 1000;
      this.endTime = this.startTime + 24 * 60 * 60;
      this.getData();
    },
    // 日期格式转换
    getCusYear(strDate) {
      if (strDate && strDate.length === 0) return "";
      let date = new Date(strDate);
      let y = date.getFullYear();
      let m = date.getMonth() + 1 + "";
      let d = date.getDate() + "";
      return (
        y +
        "/" +
        (m.length === 1 ? "0" + m : m) +
        "/" +
        (d.length === 1 ? "0" + d : d)
      );
    },
    getCusYear1(strDate) {
      if (strDate && strDate.length === 0) return "";
      let date = new Date(strDate);
      let y = date.getFullYear();
      let m = date.getMonth() + 1 + "";
      let d = date.getDate() + "";
      return (
        y +
        "-" +
        (m.length === 1 ? "0" + m : m) +
        "-" +
        (d.length === 1 ? "0" + d : d)
      );
    },
  },
};
</script>
<style lang='scss' scoped>
.agreement-management {
  /deep/.el-dialog{
    display: flex;
    flex-direction: column;
    margin:0 !important;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    .el-dialog__title{
      color: #303133;
    }
  }
  /deep/ .custom-table-header th {
    color: #606266;
    font-weight: 700;
  }
  /deep/.el-table__header{
    th{
       background: #F5F7FA!important;
    }
  }
  /deep/.el-table [class*="el-table__row--level"] .el-table__expand-icon {
    display: none;
  }
  /deep/.el-table__indent {
    padding-left: 0px !important;
  }
  /deep/.el-table__placeholder {
    width: 1px;
  }
  /deep/input::-webkit-input-placeholder {
    color: #909399;
  }
  /deep/input::-moz-input-placeholder {
    color: #909399;
  }
  /deep/input::-ms-input-placeholder {
    color: #909399;
  }

  height: 100%;
  .set-detail {
    padding: 0 20px;
    margin-top: 10px;
    padding-top: 10px;
    /deep/.el-form-item__content {
      .is-disabled {
        .el-input__inner {
          background: #e4e7ed;
        }
      }
    }
    /deep/.el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #0fb3ad;
      border-color: #0fb3ad;
    }
    .custom-table-r {
      /deep/.el-table__body-wrapper {
        overflow-y: auto;
        height: 260px;
      }
    }
    .tip {
      background: #fdf2e9;
      border-radius: 8px;
      color: #ed7b1a;
      padding: 8px 24px;
    }
    .all-name {
      line-height: 50px;
      font-size: 16px;
      margin-left: 2px;
      font-weight: 600;
    }
    .search {
      display: flex;
      font-size: 16px;
      .clear-input {
        line-height: 37px;
        margin-left: 10px;
        color: #3480ff;
      }

      /deep/.el-input__inner {
        background-color: rgba(244, 247, 250, 1);
        border-radius: 24.3px;
        padding-right: 33px;
        color: #303133;
      }
      .el-icon-search {
        position: absolute;
        top: 35%;
        right: 17px;
        color: #909399;
      }
    }
    .set-detail-btn{
        text-align: right;
        padding: 20px;
        font-size: 16px;
        padding-right: 0;
         .consoleBtn{
            border: 1px solid #DCDFE6;
            color: #303133;
            // margin-right: 22px;
            background: #F5F7FA;
          }
          .disabledconsoleBtn{
            border: 1px solid #0fb2ab33;
            color: #0fb2ab52;
            margin-right: 22px;
          }
          .createBtn{
            background: #47A87D;
            color: #fff;
            border: none;
          }
          .disabledBtn{
            background: #0fb2ab42;
            border: none;
            color: #fff;
          }
    }  
  }
  .gas-page-bg {
    overflow: auto;
    min-width: 100%;
  }

  /deep/.el-select {
    width: 100%;
    .el-input__inner {
      background: transparent;
      border-radius: 0;
      padding-left: 15px;
      color: #303133;
      border: unset;
      height: 40px;
      line-height: 40px;
      background: #ffffff;
    }
    .el-input__suffix {
      border-left: 0;
      .el-input__icon {
        line-height: 32px;
      }
    }
  }
  /deep/.el-table .cell {
    line-height: 36px;
  }
  .agreement-content {
    background: #ffffff;
    padding: 20px;
    margin: 20px;
    border-radius: 4px;
    margin-top: 0;
    .table-search {
      // display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
      /deep/.el-input__prefix {
        .el-icon-date {
          line-height: 32px;
        }
        .el-input__icon {
          line-height: 32px;
        }
      }
      /deep/.el-input {
        max-width: 180px;
        height: 32px;
        line-height: 32px;
        .el-input__inner {
          height: 32px;
          line-height: 32px;
        }
      }
      .search-left {
        // display: flex;
        // display: flex;
        .search-content{
              display: flex;
              overflow: hidden;
              height: 50px;
              width: 100%;
           .search-content-left{
                  // float: left;
                  display: flex;
                  width: 80%;
           }
        }
        .search-icon {
          position: relative;
          /deep/.el-input__inner {
            padding-left: 30px;
          }
          .el-icon-search {
            position: absolute;
            left: 9px;
            top: 9px;
            color: #303133;
          }
        }
      }
      .searchBtn {
        text-align: left;
        border: none;
        height: 32px;
        background: #47a87d;
          padding: 0px 20px;
        // float: right;
        /deep/.el-button {
          background: #47a87d;
          padding: 0px 20px;
        }
        
      }
      .creatBtn {
          text-align: right;
          width: 20%;
          height: 32px;
            /deep/.el-button {
              // background: #47a87d;
              padding: 0px 20px;
              height: 32px;
            }
        }
      .block {
        margin-right: 15px;
      }
    }
  @media screen and (max-width: 1480px) {
    .search-left{
      display: block;
      .search-title{
        margin-bottom: 8px;
      }
    }
  }
  @media screen and (min-width: 1480px) {
    .search-left{
      display: flex;
      
    } 
  }
    .search-title {
      font-weight: 700;
      line-height: 32px;
      text-align: left;
      margin-right: 15px;
      color: #303133;
      min-width: 80px;
    }
    .agreement-list {
      // margin-top: 20px;
      .operate-split {
        margin: 0 5px;
        color: rgb(70, 160, 252);
      }
      .page-box {
        margin-top: 20px;
      }
      /deep/.el-table__body {
        .el-table__row--striped td {
        }
      }
      .supplementaryA {
        background: rgba(71, 168, 125, 0.1);
        color: #47a87d;
        padding: 6px 8px;
        font-size: 14px;
      }
      .agreement-type {
        border-radius: 16px;
        width: 76px;
        height: 24px;
        font-size: 14px;
        line-height: 24px;
        display: inline-block;
      }
      .blue {
        background: #ecf5ff;
        border: 1px solid #409eff;
        color: #409eff;
      }
      .yellow {
        background: #fcf6ec;
        border: 1px solid #e6a23c;
        color: #e6a23c;
      }
      .red {
        background: #fef0f0;
        border: 1px solid #f56c6c;
        color: #f56c6c;
      }
      .green {
        color: #67c23a;
        background: #f0f9eb;
        border: 1px solid #67c23a;
      }
      .status-wrapper {
        .agreement-status {
          width: 10px;
          height: 10px;
          display: inline-block;
          border-radius: 100px;
        }
        .shengxiao {
          background: #67c23a;
        }
        .shixiao {
          background: #f56c6c;
        }
        .wait {
          background: #c0c4cc;
        }
      }
    }
    .plan-page-wrapper {
      padding: 0 30px;
      box-sizing: border-box;
      margin-top: 20px;
      height: 34px;
      margin-bottom: 30px;
    }
  }
}
.agreement-ontents-container {
  height: 98%;
  background-size: 100% 450px;
  .custom-table-n .cell {
    padding: 0 24px !important;
    color: #303133;
  }
  /deep/.el-table__row--level-1 {
    td {
      background: #f5f7fa !important;
    }
  }
  .agreement-content {
    /deep/.el-input__inner {
      border-radius: 18px;
      background: #f5f7fa;
      width: 100%;
      color: #303133;
      // border:none;
      border: 1px solid #dcdfe6;
      .el-range-separator {
        color: #ffffff;
      }
    }
  }
  .top-bag {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    // padding-bottom: 3px;
    .top-header {
      padding: 1px;
      .breadcrumb-con {
        margin: 10px 20px;
        /deep/ .el-breadcrumb__item:last-child > .el-breadcrumb__inner {
          color: #fff;
        }
        /deep/ .el-breadcrumb__inner {
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
  /deep/.el-pagination__sizes .el-input .el-input__inner {
    width: 100px;
    height: 30px;
    border-radius: 0;
  }
}
</style>
