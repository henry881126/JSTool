<template>
  <div class="add-agreement">
    <div class="add-agreement-top">
      <span class="goback" @click="backGo">
        <i class="el-icon-back"></i>
        返回
      </span>
      <span class="add-agreement-top-title">创建补充协议合同</span>
    </div>
    <div class="form-content">
      <el-form ref="form" :rules="rules" :model="form">
        <div class="add-block">
          <div class="block-title">客户基本信息</div>
          <div class="block-content">
            <div class="block-item">
              <el-form-item
                label="客户名称 "
                class="item-list"
                label-width="140px"
                prop="userName"
              >
                <el-input
                  placeholder="请输入客户名称"
                  disabled
                  v-model="form.userName"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="客户BP号 "
                class="item-list"
                label-width="140px"
                prop="userBPCode"
              >
                <el-input
                  placeholder="请输入客户BP号"
                  disabled
                  v-model="form.userBPCode"
                ></el-input>
              </el-form-item>
            </div>
            <div></div>
          </div>
        </div>
        <div class="add-block">
          <div class="block-title">关联合同</div>
          <div class="block-content">
            <div class="block-item">
              <el-form-item
                label="关联主合同 "
                class="item-list"
                label-width="140px"
                prop="cancatMainContractName"
              >
                <el-input
                  disabled
                  placeholder="请输入关联主合同"
                  v-model="form.cancatMainContractName"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="补充协议名称 "
                class="item-list"
                label-width="140px"
                prop="sideAgreementName"
              >
                <el-input
                  placeholder="请输入补充协议名称"
                  v-model="form.sideAgreementName"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="补充协议编码 "
                class="item-list"
                label-width="140px"
                prop="sideAgreementCode"
              >
                <el-input
                  placeholder="请输入补充协议编码"
                  v-model="form.sideAgreementCode"
                ></el-input>
                <!-- <span class="unit">万方</span> -->
              </el-form-item>

              <el-form-item
                label="协议签订日期 "
                class="item-list"
                label-width="140px"
                prop="agreementSignDate"
              >
                <el-date-picker
                  v-model="form.agreementSignDate"
                  type="date"
                  placeholder="请选择协议签订日期"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div></div>
          </div>
        </div>
        <div class="add-block">
          <div class="block-title">量价信息</div>
          <div class="block-content">
            <div class="block-item month-block">
              <el-form-item
                label="协议补充月份"
                class="item-list"
                label-width="140px"
                prop="sideAgreementMonth"
              >
                <el-select
                  v-model="form.sideAgreementMonth"
                  multiple
                  placeholder="请选择协议补充月份"
                  @change="selectMonth"
                >
                  <el-option
                    v-for="item in sideAgreementMonthList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <!-- <changeMonth @inputValue='inputValue' @resetBtn='inputValue'></changeMonth> -->
              </el-form-item>
              <el-button
                type="success"
                round
                class="customBtn"
                @click="checkedMonth"
              >
                确定</el-button
              >
            </div>
            <div></div>
          </div>
          <div class="table">
            <div class="constract-title">原合同内容</div>
            <el-table
              class="custom-table-n custom-table"
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
              :data="tableData4.dataList"
              style="width: 100%"
            >
              <el-table-column prop="date" label="合同量构成" width="150">
              </el-table-column>
              <el-table-column
                v-for="(item, index) in tableData4.theadList.slice(1)"
                :key="index"
                prop=""
                :label="item.label"
                align="center"
              >
                <el-table-column
                  v-for="oneConf in item.children"
                  :key="oneConf.prop"
                  :prop="oneConf.prop"
                  :label="oneConf.label"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row[oneConf.prop] }}</span>
                    <!-- <el-input v-model="scope.row[oneConf.prop]"></el-input> -->
                  </template>
                </el-table-column>
              </el-table-column>
              <!-- <el-table-column prop="all" label="总气量" width="150" sortable>
                </el-table-column> -->
            </el-table>
          </div>
          <div class="table">
            <div class="constract-title">补充协议内容</div>
            <el-table
              class="custom-table-n custom-table"
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
              :data="tableData3.dataList"
              style="width: 100%"
            >
              <el-table-column prop="date" label="合同量构成" width="150">
              </el-table-column>
              <el-table-column
                v-for="(item, index) in tableData3.theadList.slice(1)"
                :key="index"
                prop=""
                :label="item.label"
                align="center"
              >
                <el-table-column
                  v-for="oneConf in item.children"
                  :key="oneConf.prop"
                  :prop="oneConf.prop"
                  :label="oneConf.label"
                >
                  <template slot-scope="scope">
                    <el-input-number
                      v-model="scope.row[oneConf.prop]"
                      controls-position="right"
                      :min="0"
                    ></el-input-number>
                    <!-- <el-input
                    type="number"
                        maxlength=5
                        oninput="if(isNaN(value)) { value = parseFloat(value) }if(value>10000){value=value.slice(0,value.length-1)} if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                    v-model="scope.row[oneConf.prop]"></el-input> -->
                  </template>
                </el-table-column>
              </el-table-column>
              <!-- <el-table-column prop="all" label="总气量" width="150" sortable>
                </el-table-column> -->
            </el-table>
            <template v-if="form.contractType === '2'">
              <!-- 接收点价格 -->
              <div class="block-title-subtitle">
                <span class="cirl"> </span>
                接收点价格
              </div>
              <div class="block-content">
                <div class="block-item">
                  <el-form-item
                    label="冬季价格"
                    class="item-list"
                    label-width="120px"
                    v-if="form.contractType === '2'"
                    prop="receivePriceWinter"
                  >
                    <span class="unit">元/方</span>
                    <el-input
                      clearable
                      placeholder="请输入接收点冬季价格"
                      type="number"
                      v-model="form.receivePriceWinter"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="夏季价格"
                    class="item-list"
                    label-width="120px"
                    v-if="form.contractType === '2'"
                    prop="receivePriceSummer"
                  >
                    <span class="unit">元/方</span>
                    <el-input
                      clearable
                      placeholder="请输入接收点夏季价格"
                      type="number"
                      v-model="form.receivePriceSummer"
                    ></el-input>
                  </el-form-item>
                </div>
                <div></div>
              </div>
              <div class="block-lline"></div>
              <!-- 交付点价格 -->
              <div class="block-title-subtitle">
                <span class="cirl"> </span>
                交付点价格
              </div>
              <div class="block-content">
                <div class="block-item">
                  <el-form-item
                    label="冬季价格"
                    class="item-list"
                    label-width="120px"
                    v-if="form.contractType === '2'"
                    prop="deliverPriceWinter"
                  >
                    <span class="unit">元/方</span>
                    <el-input
                      clearable
                      placeholder="请输入交付点冬季价格"
                      type="number"
                      v-model="form.deliverPriceWinter"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="夏季价格"
                    class="item-list"
                    label-width="120px"
                    v-if="form.contractType === '2'"
                    prop="deliverPriceSummer">
                    <span class="unit">元/方</span>
                    <el-input
                      clearable
                      placeholder="请输入交付点夏季价格"
                      type="number"
                      v-model="form.deliverPriceSummer"
                    ></el-input>
                  </el-form-item>
                </div>
                <div></div>
              </div>
            </template>
            <div class="table-price" v-if="form.contractType == '1'">
              <div class="block-content">
                <div class="block-item">
                  <el-form-item
                    label="输配价格："
                    class="item-list"
                    label-width="120px"
                    v-if="form.contractType === '1'"
                    prop="transmissionPrice"
                  >
                    <span class="unit">元/方</span>
                    <el-input
                      clearable
                      placeholder="请输入输配价格"
                      type="number"
                      v-model="form.transmissionPrice"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="add-block">
          <div class="block-title">上传附件(可上传{{ fileListLengt }}/5)</div>
          <div class="upload-list">
            <el-upload
              class="upload-demo"
              :action="uploadProxyConfig"
              :on-change="handleChange"
              :on-success="handleAvatarSuccess"
              :file-list="fileList"
              :limit="5"
              :headers="headers"
            >
              <el-button
                v-if="fileListLengt < 5"
                size="small"
                type="primary"
                class="uploadBtn"
                ><i class="el-icon-upload2"></i>点击上传</el-button
              >
            </el-upload>
          </div>
          <div class="block-title-subtitle">
            <span class="cirl"> </span>
            备注
          </div>
          <el-form-item label="" class="remarkC">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              maxlength="500"
              show-word-limit
              clearable
              :rows="3"
              v-model="form.remark"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="submitBtn">
      <el-button
        type=""
        round
        class="save"
        @click="saveBtn('', '2')"
        v-if="!this.isEdit"
        >暂存</el-button
      >
      <el-button
        type="primary"
        round
        class="submit"
        @click="submitBtn('form', 1)"
        >提交</el-button
      >
    </div>
    <el-dialog
      title="提示"
      width="30%"
      :visible.sync="isEditConstrct"
      :key="editTimer + 'h'"
    >
      <div class="set-detail confirmbtn deleteL">
        <div class="confirmbtn-content">
          <span
            >您于{{ saveCreatData }} 暂存了【{{
              saveContractName
            }}】的补充协议信息，点选创建补充协议，会将暂存的补充协议信息清除，是否继续编辑该补充协议？</span
          >
        </div>
        <div>
          <div class="set-detail-btn right">
            <el-button round @click="consoleSave" class="consoleBtn">
              创建新协议
            </el-button>
            <el-button
              type="primary"
              round
              @click="delBtnConfirm"
              class="createBtn"
            >
              继续编辑
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from "/src/http/api";
import topMenu from "../../components/topMenu/topMenu";
import exportApi from "/src/components/export/export";
import changeMonth from "./component/changeMonth";
import dongguanApi from "/src/http/dongguan";
import config from "../../config/config";
import { getCusYear, getCusYear1, publicLableValueC } from "./utils/commen";
import { json } from "mathjs";

export default {
  name: "PurchaseAnalysiss",
  mixins: [exportApi],
  components: {
    topMenu,
    changeMonth,
  },
  props: ["MainId", "isEdit", "agreenmentContractId", "agreenmentId",'McontractId'],
  data() {
    return {
      editTimer: 23,
      uploadProxyConfig: config.uploadProxy + "fdfs/upload",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("DONGGUAN_Token"),
      },
      agreenmentid: this.agreenmentId,
      cancatMaincontravtList: [
        {
          label: "",
          value: "",
        },
      ],
      sideAgreementMonthList: [
        {
          label: "1月",
          value: "20211",
        },
        {
          label: "2月",
          value: "20212",
        },
      ],

      outstandingClearL: [
        {
          value: "01",
          label: "日",
        },
        {
          value: "02",
          label: "月",
        },
      ],
      receivePointList: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
      ],
      form: {
        userName: "",
        userBPCode: "",
        cancatMainContractCode: "", //关联主合同
        cancatMainContractName: "", //主合同名称
        sideAgreementName: "", //补充协议名称
        sideAgreementCode: "", //补充协议编码
        agreementSignDate: "", //协议签订日期
        sideAgreementMonth: "", //协议补充月份
        remark: "", //备注

        userCode: "",
        contractType: "1",
        supplierName: "", //供应商名称
        supplierAbbreviation: "", //供应商简称
        gasName: "", //气源类型
        isRevealAllDetail: "", //是否兜底气源
        //    合同基本信息
        ContractCode: "", //合同编号
        ContractName: "", //合同名称
        yearAllNum: "", //年合同总量
        ContractTerm: "", //合同期
        ContractSignDate: "", //签订日期
        //    物理接收交付信息
        receivePoint: "", //接收点 --代销合同
        receivePressurePoint: "", //接收压力点  --代销合同
        deliveryPoint: "", //交付点
        cqDividingPoint: "", //产权分界点
        deliveryPointPressure: "", //交付点压力
        meteringMode: "", //计量方式
        // 计量结算信息
        settlementStyle: "", //结算方式
        settlementPeriod: "", //结算周期
        settlementDay: "", //结算日
        expirationCycle: "", //交割周期
        deviationSettlementRate: "", //偏差结算率  ---代销合同
        overdraftRatio: "", //超提范围比率
        outstandingRatio: "", //欠提范围比率
        outstandingClear: "", //欠提清零天数/月
        outstandingClearC: "01",
        transmissionPrice: "", //输配价格  ==代输合同
        DepartmenRate: "", //供销差率
        // 计划管理周期
        monthSubmitTime: "", //月指定提交时间
        monthReplayTime: "", //月指定批复时间
        daySubmitTime: "", //日指定提交时间
        dayReplayTime: "", //日指定批复时间
        dayChangeTime: "", //日指定变更时间
        monthMaxRate: "", //月最大提取率
        monthMinRate: "", //月最小提取率
        dayMaxRate: "", //日最大提取率
        dayMinRate: "", //日最小提取率
        receivePriceSummer: "", //接收点夏季价格
        receivePriceWinter: "", //接收点冬季价格
        deliverPriceSummer: "", //交付点夏季价格
        deliverPriceWinter: "", //交付点冬季价格
      },
      rules: {
        sideAgreementMonth: [
          { required: true, message: "请输入协议补充月份", trigger: "blur" },
        ],
        agreementSignDate: [
          {
            required: true,
            message: "请选择合同签订日期",
            trigger: "blur",
          },
        ],
        sideAgreementCode: [
          {
            required: true,
            message: "请输入补充协议编码",
            trigger: "blur",
          },
        ],
        sideAgreementName: [
          {
            required: true,
            message: "请输入补充协议名称",
            trigger: "blur",
          },
        ], //补充协议名称
        // 关联主合同
        cancatMainContractCode: [
          {
            required: true,
            message: "请选择关联主合同",
            trigger: "blur",
          },
        ],
        transmissionPrice: [
          { required: true, message: "请输入输配价格", trigger: "blur" },
        ],
        userBPCode: [
          {
            required: true,
            message: "请输入客户bp",
            trigger: "blur",
          },
        ],
        userName: [
          {
            required: true,
            message: "请输入客户名称",
            trigger: "blur",
          },
        ],
        sideAgreementName: [
          { required: true, message: "请输入补充协议名称", trigger: "blur" },
        ],
        receivePriceSummer: [
          { required: true, message: "请输入接收点夏季价格", trigger: "blur" },
        ], //接收点夏季价格
        receivePriceWinter: [
          { required: true, message: "请输入接收点冬季价格", trigger: "blur" },
        ], //接收点冬季价格
        deliverPriceSummer: [
          { required: true, message: "请输入交付点夏季价格", trigger: "blur" },
        ], //交付点夏季价格
        deliverPriceWinter: [
          { required: true, message: "请输入交付点冬季价格", trigger: "blur" },
        ], //交付点冬季价格
      },
      fileList: [],

      tableData22: {
        dataList: [],
        theadList: [
          {
            label: "",
            prop: "date",
          },
        ],
      },
      tableData3: {
        dataList: [],
        theadList: [
          {
            label: "",
            prop: "date",
          },
        ],
      },
      contractDetail: [],
      buchongData: [],
      // 上传的文件
      contractFiles: [],
      tableDataChange: {
        dataList: [],
        theadList: [
          {
            label: "",
            prop: "date",
          },
        ],
      },
      tableData4: {
        dataList: [],
        theadList: [
          {
            label: "",
            prop: "date",
          },
        ],
      },
      fileListLengt: 0,
      isEditConstrct: false,
      saveContractName: "", //保存的协议
      saveCreatData: "", //上次保存的创建时间
      saveAgreementId: "", //上次保存的id
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
          //   this.getData();
        }
      },
    },
  },
  created() {
    //   判断是否为编辑，如果是直接调用获取协议接口，
    //  如不是则判断之前是否暂存了协议contractFindUnSubmitContract，如果有则判断是否继续编辑，继续回显原来的内容,创建新合同需要调用原合同接口回显需要的公共内容
    if (this.isEdit) {
      this.agreementGet();
    } else {
      this.contractFindUnSubmitContract();
      // this.contractGet()
    }
  },
  mounted() {},
  methods: {
    checkedMonth() {
      this.buchongData = [];
      let asd = this.form.sideAgreementMonth;
      asd.forEach((item) => {
        let obj = {};
        obj.year = item.substring(0, 4);
        obj.month = item.substring(4, 6);
        this.$set(
          obj,
          "MYzd",
          obj.year + "" + ((obj.month + "").length > 1 ? obj.month : obj.month)
        );
        this.buchongData.push(obj);
      });
      let yearTableData1 = this.groupingData(this.buchongData, "year");
      this.tableData3.theadList = [{ label: "", prop: "date" }];
      yearTableData1.forEach((item, index) => {
        let objTable1 = {};
        this.$set(objTable1, "label", item.year + "");
        this.$set(objTable1, "prop", "");
        this.$set(objTable1, "children", []);
        this.tableData3.theadList.push(objTable1);
        item.list.forEach((item1) => {
          let objTable2 = {};
          this.$set(objTable2, "label", item1.month + "月");
          this.$set(objTable2, "prop", item1.MYzd);
          this.tableData3.theadList[index + 1].children.push(objTable2);
        });
      });
      this.$set(this.tableData3.dataList, 0, {});
      if (this.form.contractType == "3") {
        this.$set(this.tableData3.dataList, 1, {});
      }
      this.tableData3.dataList.forEach((item, index) => {
        this.buchongData.forEach((item1) => {
          this.$set(this.tableData3.dataList[0], "date", "气量(万方)");
          this.$set(this.tableData3.dataList[0], "all", "");
          if (this.form.contractType == "3") {
            this.$set(this.tableData3.dataList[1], "date", "单价(元/方)");
            this.$set(this.tableData3.dataList[1], "all", "");
          }
          this.$set(this.tableData3.dataList[0], item1.MYzd + "", "");
          if (this.form.contractType == "3") {
            this.$set(this.tableData3.dataList[1], item1.MYzd + "", "");
          }
        });
      });
      // 主合同也根据选择的协议月份显示
      this.tableData4 = JSON.parse(JSON.stringify(this.tableData3));
      this.tableData4.dataList.forEach((item, index) => {
        Object.keys(this.tableData4.dataList[index]).forEach((key) => {
          this.tableData4.dataList[index][key] =
            this.tableData22.dataList[index][key];
        });
      });
    },
    // 上传成功后
    handleAvatarSuccess(data) {
      if (data.data) {
        let obj = {
          contractId: "",
          createDate: "",
          createUser: this.userInfo.userId,
          fileName: data.data.fileName,
          filePath: data.data.fileUrl,
          id: "",
          isDeleted: 0,
          modifiedDate: "",
          modifiedUser: 0,
        };
        this.contractFiles.push(obj);
        this.fileListLengt = this.fileList.length;
        //    this.fileList.push(data.data)
      }
    },
    inputValue(val) {
      this.form.sideAgreementMonth = val;
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-5);
    },
    backGo() {
      this.$emit("backGo");
    },
    selectMonth(val) {},
    // 获取原合同信息
    contractGet() {
      let data = {
        id: this.MainId,
      };
      dongguanApi.contract.contractGet(data).then((res) => {
        if (res) {
          this.contractDetail = res[0];
          this.form.userBPCode = this.contractDetail.bp; //bp
          this.form.cancatMainContractCode = this.contractDetail.id;
          let contractType =
            this.contractDetail.contractType == "3"
              ? "直销"
              : this.contractDetail.contractType == "2"
              ? "代销"
              : this.contractDetail.contractType == "1"
              ? "代输"
              : "";
          this.form.cancatMainContractName =
            this.contractDetail.contractName +
            "-" +
            contractType +
            "-" +
            this.contractDetail.contractBeginDate.replace(/-/g, "") +
            "-" +
            this.contractDetail.contractEndDate.replace(/-/g, "");
          this.form.userName = this.contractDetail.customerName; //客户名称
          this.cancatMaincontravtList[0].label = this.form.userName;
          this.cancatMaincontravtList[0].value = this.contractDetail.id;
          this.form.contractType = this.contractDetail.contractType;
          let copyData = JSON.parse(JSON.stringify(this.contractDetail));
          // 获取合同月份生成选项
          this.sideAgreementMonthList = [];
          //   原合同生成表格s数据
          this.yuanhetongT = [];
          copyData.contractDetail.forEach((item) => {
            let obj = {};
            obj.label = item.contractDate.substring(0, 7);
            obj.value = item.contractDate1;
            this.sideAgreementMonthList.push(obj);
          });
          this.tableData22.theadList = [];
          this.tableData22.dataList = [];
          this.contractDetail.contractDetail.forEach((item, index) => {
            this.contractDetail.contractDetail[index].year =
              item.contractDate1.substring(0, 4);
            this.contractDetail.contractDetail[index].month =
              item.contractDate1.substring(4, 6);
            this.$set(
              item,
              "MYzd",
              item.year +
                "" +
                ((item.month + "").length > 1 ? item.month : "0" + item.month)
            );
          });
          let yearTableData = [];
          yearTableData = this.groupingData(
            this.contractDetail.contractDetail,
            "year"
          );
          this.tableData22.theadList = [
            {
              label: "",
              prop: "date",
            },
          ];
          yearTableData.forEach((item, index) => {
            let objTable1 = {};
            this.$set(objTable1, "label", item.year + "");
            this.$set(objTable1, "prop", "");
            this.$set(objTable1, "children", []);
            this.tableData22.theadList.push(objTable1);
            item.list.forEach((item1) => {
              let objTable2 = {};
              this.$set(objTable2, "label", item1.month + "月");
              this.$set(objTable2, "prop", item1.MYzd);
              this.tableData22.theadList[index + 1].children.push(objTable2);
            });
          });
          this.$set(this.tableData22.dataList, 0, {});
          if (this.form.contractType == "3") {
            this.$set(this.tableData22.dataList, 1, {});
          }
          this.tableData22.dataList.forEach((item, index) => {
            this.contractDetail.contractDetail.forEach((item1) => {
              this.$set(this.tableData22.dataList[0], "date", "气量(万方)");
              this.$set(this.tableData22.dataList[0], "all", "");
              if (this.form.contractType == "3") {
                this.$set(this.tableData22.dataList[1], "date", "单价(元/方)");
                this.$set(this.tableData22.dataList[1], "all", "");
              }
              this.$set(this.tableData22.dataList[0], item1.MYzd, item1.volume);
              if (this.form.contractType == "3") {
                this.$set(
                  this.tableData22.dataList[1],
                  item1.MYzd,
                  item1.price
                );
              }
            });
          });
          // 原合同也根据选择的协议月份显示相应的月份
          this.tableData4 = JSON.parse(JSON.stringify(this.tableData22));
          this.tableData4.dataList.forEach((item, index) => {
            Object.keys(this.tableData4.dataList[index]).forEach((key) => {
              this.tableData4.dataList[index][key] =
                this.tableData22.dataList[index][key];
            });
          });
        }
      });
    },
    //  获取补充协议
    agreementGet() {
      let data = {
        id: this.agreenmentid,
      };
      dongguanApi.contract.agreementGet(data).then((res) => {
        if (res.length) {
          this.contractDetail = res[0]
          this.form.userBPCode = this.contractDetail.bp, //bp
          this.form.sideAgreementMonth = this.contractDetail.changeMonth
              ? this.contractDetail.changeMonth.split(",")
              : "",
          this.form.cancatMainContractCode = this.contractDetail.contractId;
          this.form.cancatMainContractName = this.contractDetail.bindContractName;
          this.form.sideAgreementName = this.contractDetail.contractName;
          this.form.sideAgreementCode = this.contractDetail.contractNo;
          this.form.userName = this.contractDetail.customerName, //客户名称
          this.form.transmissionPrice = this.contractDetail.distributionPrice; //输配价格元/方
          this.form.remark = this.contractDetail.remark;
          this.form.receivePriceSummer = this.contractDetail.receivePriceSummer, //接收点夏季价格
          this.form.receivePriceWinter = this.contractDetail.receivePriceWinter, //接收点冬季价格
          this.form.deliverPriceSummer = this.contractDetail.deliverPriceSummer, //交付点夏季价格
          this.form.deliverPriceWinter = this.contractDetail.deliverPriceWinter, //交付点冬季价格
          this.form.contractType = this.contractDetail.bindContractType;
          this.form.agreementSignDate = this.contractDetail.signingDate;
          let copyData = JSON.parse(JSON.stringify(this.contractDetail));
          // 获取合同月份生成选项
          this.sideAgreementMonthList = [];
          //   原合同生成表格
          this.yuanhetongT = [];
          copyData.bindContractDetail.forEach((item) => {
            let obj = {};
            obj.label = item.contractDate.substring(0, 7);
            obj.value = item.contractDate1;
            this.sideAgreementMonthList.push(obj);
          });
          this.tableData3 = this.tableChange(
            this.contractDetail.contractDetail
          );
          this.tableData22.theadList = [];
          this.tableData22.dataList = [];
          this.contractDetail.bindContractDetail.forEach((item, index) => {
            this.contractDetail.bindContractDetail[index].year =
              item.contractDate1.substring(0, 4);
            this.contractDetail.bindContractDetail[index].month =
              item.contractDate1.substring(4, 6);
            this.$set(
              item,
              "MYzd",
              item.year +
                "" +
                ((item.month + "").length > 1 ? item.month : "0" + item.month)
            );
          });
          let yearTableData = [];
          yearTableData = this.groupingData(
            this.contractDetail.bindContractDetail,
            "year"
          );
          this.tableData22.theadList = [
            {
              label: "",
              prop: "date",
            },
          ];
          yearTableData.forEach((item, index) => {
            let objTable1 = {};
            this.$set(objTable1, "label", item.year + "");
            this.$set(objTable1, "prop", "");
            this.$set(objTable1, "children", []);
            this.tableData22.theadList.push(objTable1);
            item.list.forEach((item1) => {
              let objTable2 = {};
              this.$set(objTable2, "label", item1.month + "月");
              this.$set(objTable2, "prop", item1.MYzd);
              this.tableData22.theadList[index + 1].children.push(objTable2);
            });
          });
          this.$set(this.tableData22.dataList, 0, {});
          if (this.form.contractType == "3") {
            this.$set(this.tableData22.dataList, 1, {});
          }
          this.tableData22.dataList.forEach((item, index) => {
            this.contractDetail.bindContractDetail.forEach((item1) => {
              this.$set(this.tableData22.dataList[0], "date", "气量(万方)");
              this.$set(this.tableData22.dataList[0], "all", "");
              if (this.form.contractType == "3") {
                this.$set(this.tableData22.dataList[1], "date", "单价(元/方)");
                this.$set(this.tableData22.dataList[1], "all", "");
              }
              this.$set(this.tableData22.dataList[0], item1.MYzd, item1.volume);
              if (this.form.contractType == "3") {
                this.$set(
                  this.tableData22.dataList[1],
                  item1.MYzd,
                  item1.price
                );
              }
            });
          });
          // 主合同也根据选择的协议月份显示
          this.tableData4 = JSON.parse(JSON.stringify(this.tableData3));
          this.tableData4.dataList.forEach((item, index) => {
            Object.keys(this.tableData4.dataList[index]).forEach((key) => {
              this.tableData4.dataList[index][key] =
                this.tableData22.dataList[index][key];
            });
          });
          let fileLista = [];
          if (this.contractDetail.contractFiles.length > 0) {
            this.contractDetail.contractFiles.forEach((item) => {
              let obj = {};
              obj.contractId = item.contractId;
              obj.contractId = item.contractId;
              obj.createDate = item.createDate;
              obj.createUser = item.createUser;
              obj.fileName = item.fileName;
              obj.filePath = item.filePath;
              obj.id = item.id;
              obj.isDeleted = item.isDeleted;
              obj.modifiedDate = item.modifiedDate;
              obj.modifiedUser = item.modifiedUser;
              fileLista.push(obj);
            });
          }
          fileLista.forEach((item) => {
            item.name = item.fileName;
            item.url = item.filePath;
          });
          this.fileList = fileLista;
          this.fileListLengt = this.fileList.length;
        }
      });
    },
    tableChange(dataC) {
      this.tableDataChange.theadList = [];
      this.tableDataChange.dataList = [];
      dataC.forEach((item, index) => {
        dataC[index].year = item.contractDate1.substring(0, 4);
        dataC[index].month = item.contractDate1.substring(4, 6);
        this.$set(
          item,
          "MYzd",
          item.year +
            "" +
            ((item.month + "").length > 1 ? item.month : "0" + item.month)
        );
      });
      let yearTableData = [];
      yearTableData = this.groupingData(dataC, "year");
      this.tableDataChange.theadList = [
        {
          label: "",
          prop: "date",
        },
      ];
      yearTableData.forEach((item, index) => {
        let objTable1 = {};
        this.$set(objTable1, "label", item.year + "");
        this.$set(objTable1, "prop", "");
        this.$set(objTable1, "children", []);
        this.tableDataChange.theadList.push(objTable1);
        item.list.forEach((item1) => {
          let objTable2 = {};
          this.$set(objTable2, "label", item1.month + "月");
          this.$set(objTable2, "prop", item1.MYzd);
          this.tableDataChange.theadList[index + 1].children.push(objTable2);
        });
      });
      this.$set(this.tableDataChange.dataList, 0, {});
      if (this.form.contractType == "3") {
        this.$set(this.tableDataChange.dataList, 1, {});
      }
      this.tableDataChange.dataList.forEach((item, index) => {
        dataC.forEach((item1) => {
          this.$set(this.tableDataChange.dataList[0], "date", "气量(万方)");
          this.$set(this.tableDataChange.dataList[0], "all", "");
          if (this.form.contractType == "3") {
            this.$set(this.tableDataChange.dataList[1], "date", "单价(元/方)");
            this.$set(this.tableDataChange.dataList[1], "all", "");
          }
          this.$set(this.tableDataChange.dataList[0], item1.MYzd, item1.volume);
          if (this.form.contractType == "3") {
            this.$set(
              this.tableDataChange.dataList[1],
              item1.MYzd,
              item1.price
            );
          }
        });
      });
      return this.tableDataChange;
    },
    // / 传入两个参数 一个是待分组的数据 一个是按照哪个字段进行分组
    groupingData(data, filed) {
      // map用来保存存过的字段 为下边添加新对象或者将相同字段的数据保存到同一个list中
      let map = {};
      // dest主要保存分组后的数据
      let dest = [];
      // 循环遍历传入的data
      data.forEach((item) => {
        // 判断map对象中是否有遍历时data的key 如果没有则向dest数组中推入一个新的对象(包含两个属性，一个要分组的字段名，一个保存相同字段名数据的数组)
        if (!map[item[filed]]) {
          dest.push({
            [filed]: item[filed],
            list: [item],
          });
          // 进行一次新添对象的记录
          map[item[filed]] = item;
          // 如果在map中有data遍历的key(字段相同) 则向dest数组里面的相同字段的list下推入数据
        } else {
          dest.forEach((dItem) => {
            if (dItem[filed] == item[filed]) {
              dItem.list.push(item);
            }
          });
        }
      });
      return dest;
    },
    // 查询是否有保存的协议
    contractFindUnSubmitContract() {
      let data = {
        userId: this.userInfo.userId,
        agreement: true,
        contractId:this.McontractId
      };
      dongguanApi.contract.contractFindUnSubmitContract(data).then((res) => {
        if (res && res.length > 0) {
          this.isEditConstrct = true;
          this.contractDetail = res[0];
          this.saveCreatData = this.contractDetail.createDate;
          this.saveContractName = this.contractDetail.customerName;
          this.saveAgreementId = this.contractDetail.id;
        } else {
          this.contractGet();
        }
      });
    },
    // 取消继续编辑，删除协议
    consoleSave() {
      this.isEditConstrct = false;
      this.contractDeleteUnSubmitContract();
    },
    contractDeleteUnSubmitContract() {
      let data = {
        id: this.saveAgreementId,
      };
      dongguanApi.contract.contractDeleteUnSubmitContract(data).then((res) => {
        this.contractGet();
      });
    },
    // 继续编辑
    delBtnConfirm() {
      this.isEditConstrct = false;
      this.agreenmentid = this.saveAgreementId;
      (this.form.userBPCode = this.contractDetail.bp), //bp
        (this.form.sideAgreementMonth = this.contractDetail.changeMonth
          ? this.contractDetail.changeMonth.split(",")
          : ""),
        (this.form.cancatMainContractCode = this.contractDetail.contractId);
      this.form.cancatMainContractName = this.contractDetail.bindContractName;
      this.form.sideAgreementName = this.contractDetail.contractName;
      this.form.sideAgreementCode = this.contractDetail.contractNo;
      (this.form.userName = this.contractDetail.customerName), //客户名称
        (this.form.remark = this.contractDetail.remark);
      this.form.transmissionPrice = this.contractDetail.distributionPrice; //输配价格元/方
      (this.form.receivePriceSummer = this.contractDetail.receivePriceSummer), //接收点夏季价格
        (this.form.receivePriceWinter = this.contractDetail.receivePriceWinter), //接收点冬季价格
        (this.form.deliverPriceSummer = this.contractDetail.deliverPriceSummer), //交付点夏季价格
        (this.form.deliverPriceWinter = this.contractDetail.deliverPriceWinter), //交付点冬季价格
        (this.form.contractType = this.contractDetail.bindContractType);
      this.form.agreementSignDate = this.contractDetail.signingDate;
      let copyData = JSON.parse(JSON.stringify(this.contractDetail));
      // 获取合同月份生成选项
      this.sideAgreementMonthList = [];
      //   原合同生成表格
      this.yuanhetongT = [];
      copyData.bindContractDetail.forEach((item) => {
        let obj = {};
        obj.label = item.contractDate.substring(0, 7);
        obj.value = item.contractDate1;
        this.sideAgreementMonthList.push(obj);
      });
      if (
        this.contractDetail.contractDetail &&
        this.contractDetail.contractDetail.length > 0
      ) {
        this.tableData3 = this.tableChange(this.contractDetail.contractDetail);
      }
      this.tableData22.theadList = [];
      this.tableData22.dataList = [];
      this.contractDetail.bindContractDetail.forEach((item, index) => {
        this.contractDetail.bindContractDetail[index].year =
          item.contractDate1.substring(0, 4);
        this.contractDetail.bindContractDetail[index].month =
          item.contractDate1.substring(4, 6);
        this.$set(
          item,
          "MYzd",
          item.year +
            "" +
            ((item.month + "").length > 1 ? item.month : "0" + item.month)
        );
      });
      let yearTableData = [];
      yearTableData = this.groupingData(
        this.contractDetail.bindContractDetail,
        "year"
      );
      this.tableData22.theadList = [
        {
          label: "",
          prop: "date",
        },
      ];
      yearTableData.forEach((item, index) => {
        let objTable1 = {};
        this.$set(objTable1, "label", item.year + "");
        this.$set(objTable1, "prop", "");
        this.$set(objTable1, "children", []);
        this.tableData22.theadList.push(objTable1);
        item.list.forEach((item1) => {
          let objTable2 = {};
          this.$set(objTable2, "label", item1.month + "月");
          this.$set(objTable2, "prop", item1.MYzd);
          this.tableData22.theadList[index + 1].children.push(objTable2);
        });
      });
      this.$set(this.tableData22.dataList, 0, {});
      this.$set(this.tableData22.dataList, 1, {});
      this.tableData22.dataList.forEach((item, index) => {
        this.contractDetail.bindContractDetail.forEach((item1) => {
          this.$set(this.tableData22.dataList[0], "date", "气量(万方)");
          this.$set(this.tableData22.dataList[0], "all", "");
          this.$set(this.tableData22.dataList[1], "date", "单价(元/方)");
          this.$set(this.tableData22.dataList[1], "all", "");
          this.$set(this.tableData22.dataList[0], item1.MYzd, item1.volume);
          this.$set(this.tableData22.dataList[1], item1.MYzd, item1.price);
        });
      });
      // 主合同也根据选择的协议月份显示
      this.tableData4 = JSON.parse(JSON.stringify(this.tableData3));
      this.tableData4.dataList.forEach((item, index) => {
        Object.keys(this.tableData4.dataList[index]).forEach((key) => {
          this.tableData4.dataList[index][key] =
            this.tableData22.dataList[index][key];
        });
      });
      let fileLista = [];
      if (
        this.contractDetail.contractFiles &&
        this.contractDetail.contractFiles.length > 0
      ) {
        this.contractDetail.contractFiles.forEach((item) => {
          let obj = {};
          obj.contractId = item.contractId;
          obj.contractId = item.contractId;
          obj.createDate = item.createDate;
          (obj.createUser = item.createUser), (obj.fileName = item.fileName);
          obj.filePath = item.filePath;
          obj.id = item.id;
          obj.isDeleted = item.isDeleted;
          obj.modifiedDate = item.modifiedDate;
          obj.modifiedUser = item.modifiedUser;
          fileLista.push(obj);
        });
      }
      fileLista.forEach((item) => {
        item.name = item.fileName;
        item.url = item.filePath;
      });
      this.fileList = fileLista;
      this.fileListLengt = this.fileList.length;
    },
    submitBtn(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.agreementUpdate("", type);
            // this.contractUpdate(type);
          } else {
            this.agreementSave("", type);
          }
        } else {
          this.$message({
            message: "请填写正确的必填信息",
            type: "error",
            duration: 1000,
          });
        }
      });
    },
    saveBtn(rule, type) {
      if (this.isEdit) {
        this.agreementUpdate("", type);
      } else {
        this.agreementSave("", type);
      }
    },
    addEditData(type) {
      let data = {
        bp: this.form.userBPCode,
        changeMonth: this.form.sideAgreementMonth
          ? this.form.sideAgreementMonth.join(",")
          : "",
        compCode: this.curComInfo.orgCode,
        contractDetail: [],
        contractFiles: [],
        contractId: this.form.cancatMainContractCode,
        contractName: this.form.sideAgreementName,
        contractNo: this.form.sideAgreementCode,
        receivePriceSummer: this.form.receivePriceSummer, //接收点夏季价格
        receivePriceWinter: this.form.receivePriceWinter, //接收点冬季价格
        deliverPriceSummer: this.form.deliverPriceSummer, //交付点夏季价格
        deliverPriceWinter: this.form.deliverPriceWinter, //交付点冬季价格
        distributionPrice: this.form.transmissionPrice, //输配价格元/方
        contractType: "4", //合同类型1代输2代销3直销4补充协议
        cpmoCop: this.curComInfo.orgCode,
        orgLevel: this.curComInfo.orgLevel,
        createUser: this.userInfo.userId,
        customerName: this.form.userName, //客户名称
        id: this.agreenmentid,
        isSubmit: type,
        remark: this.form.remark,
        signingDate: this.form.agreementSignDate
          ? getCusYear1(this.form.agreementSignDate)
          : "",
      };
      data.contractFiles = this.contractFiles;
      for (let key in this.tableData3.dataList[0]) {
        let obj1 = {
          contractId: "",
          id: "",
          isSupplement: 1,
        };
        if (key != "date" && key != "all") {
          obj1.contractDate = key;
          obj1.volume = this.tableData3.dataList[0][key];
          data.contractDetail.push(obj1);
        }
      }
      for (let key in this.tableData3.dataList[1]) {
        data.contractDetail.forEach((item) => {
          if (key == item.contractDate) {
            item.price = this.tableData3.dataList[1][key];
          }
        });
      }
      this.fileList.forEach((item) => {
        let obj = {};
        if (item.response && item.response.code == "200") {
          obj.contractId = "";
          obj.createDate = "";
          obj.createUser = "";
          obj.fileName = item.response.data.fileName;
          obj.filePath = item.response.data.fileUrl;
          obj.id = "";
          obj.isDeleted = "";
          obj.modifiedDate = "";
          obj.modifiedUser = "";
        } else {
          obj.contractId = item.contractId ? item.contractId : "";
          obj.createDate = item.createDate ? item.createDate : "";
          obj.createUser = item.createUser ? item.createUser : "";
          obj.fileName = item.fileName ? item.fileName : "";
          obj.filePath = item.filePath ? item.filePath : "";
          obj.id = item.id ? item.id : "";
          obj.isDeleted = item.isDeleted ? item.isDeleted : "";
          obj.modifiedDate = item.modifiedDate ? item.modifiedDate : "";
          obj.modifiedUser = item.modifiedUser ? item.modifiedUser : "";
        }
        data.contractFiles.push(obj);
      });
      return data;
    },
    // 补充协议添加
    agreementSave(rule, type) {
      let data = this.addEditData(type);
      dongguanApi.contract.agreementSave(data).then((res) => {
        if (res) {
          this.$message({
            message: "添加协议成功",
            type: "success",
            duration: 1000,
          });
          setTimeout(() => {
            this.backGo();
          }, 2000);
        }
      });
    },
    // 补充协议编辑
    agreementUpdate(rule, type) {
      let data = this.addEditData(type);
      dongguanApi.contract.agreementUpdate(data).then((res) => {
        if (res) {
          this.$message({
            message: "编辑协议成功",
            type: "success",
            duration: 1000,
          });
          setTimeout(() => {
            this.backGo();
          }, 2000);
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.add-agreement {
  background: #ffffff;
  margin: 20px;
  border-radius: 4px;
  margin-top: 0;
  /deep/.el-table thead.is-group th {
    text-align: center;
    background: #ebeef5;
  }
  /deep/ .el-table__body {
    .el-input__inner {
      text-align: center;
    }
    tr td {
      text-align: center;
    }
  }
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
      }
      .el-icon-search {
        position: absolute;
        top: 35%;
        right: 17px;
      }
    }
    .set-detail-btn {
      text-align: right;
      padding: 25px;
      font-size: 16px;
      .consoleBtn {
        border: 1px solid #dcdfe6;
        color: #303133;
        background: #f5f7fa;
      }
      .disabledconsoleBtn {
        border: 1px solid #0fb2ab33;
        color: #0fb2ab52;
        margin-right: 22px;
      }
      .createBtn {
        background: #47a87d;
        color: #fff;
      }
      .disabledBtn {
        background: #0fb2ab42;
        border: none;
        color: #fff;
      }
    }
  }
  .custom-table-n {
    /deep/ th:nth-last-child(2) {
      border-right: 1px solid #dcdfe6;
    }
  }
  .constract-title {
    margin: 20px 10px;
  }
  .submitBtn {
    position: fixed;
    bottom: 0;
    left: 220px;
    right: 0;
    text-align: right;
    background: #fff;
    height: 54px;
    line-height: 55px;
    box-shadow: 5px -3px 7px #bacce1;
    padding-right: 28px;
    box-sizing: border-box;
    z-index: 10;
    .submit {
      background: #47a87d;
      border: none;
    }
  }
  .customBtn {
    background: #47a87d;
    border-radius: 20px;
    margin: 2px 10px;
    height: 32px;
    padding: 0 15px;
  }
  .add-agreement-top {
    height: 66px;
    line-height: 66px;
    padding: 0 20px;
    border-bottom: 1px solid #e4e7ed;
    .goback {
      margin-right: 10px;
      font-size: 18px;
      color: #409eff;
      cursor: pointer;
      font-weight: 700;
      vertical-align: top;
      .el-icon-back {
        font-weight: 700;
      }
    }
    .add-agreement-top-title {
      font-weight: 600;
      padding-left: 10px;
      border-left: 1px solid #dcdfe6;
      font-size: 18px;
      color: #303133;
    }
  }
  .form-content {
    padding: 0 20px;
    padding-bottom: 20px;
  }
  /deep/.el-radio.is-bordered.is-checked {
    border-color: #47a87d;
    background: rgba(71, 168, 125, 0.1);
  }
  /deep/.el-radio__input.is-checked + .el-radio__label {
    color: #47a87d;
  }
  /deep/.el-radio__input.is-checked .el-radio__inner {
    border-color: #47a87d;
    background: #47a87d;
  }
  /deep/.el-radio.is-bordered {
    background: #fff;
    border: none;
  }
  /deep/ .el-table th.is-leaf {
    background: #ebeef5;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
  .el-range-editor.el-input__inner {
    width: 100%;
  }
  .add-block {
    background: #f5f7fa;
    padding: 20px;
    margin-top: 24px;
    padding-bottom: 10px;
    /deep/.el-input-number {
      width: 100%;
      text-align: left;
      .el-input-number__increase {
        display: none;
      }
      .el-input-number__decrease {
        display: none;
      }
      .el-input__inner {
        text-align: left;
      }
    }
    .block-lline {
      border-bottom: 1px solid #dcdfe6;
    }
    .block-title {
      padding: 0 10px;
      line-height: 16px;
      color: #303133;
      font-weight: 500;
      height: 16px;
      border-left: 6px solid #47a87d;
    }
    .remarkC {
      margin-top: 20px;
    }
    .block-title-subtitle {
      margin-top: 20px;
      padding: 0 10px;
      color: #303133;
      .cirl {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #47a87d;
        vertical-align: middle;
      }
      padding: 0 10px;
    }
    .block-content {
      padding-top: 20px;
      padding-bottom: 0;

      .block-item {
        display: flex;
        flex-wrap: wrap;
        /deep/.el-form-item__content {
          .is-disabled {
            .el-input__inner {
              background: #e4e7ed;
            }
          }
        }
        .item-list {
          width: 33%;
          .unit {
            position: absolute;
            right: 10px;
            color: #909399;
            z-index: 10;
          }
        }
      }
      .month-block{
        width: 100%;
        .item-list{
          width: 90%;
        }
      }
      
      .outstandingClearS {
        /deep/.el-input {
          width: 80%;
        }
        /deep/.el-select {
          width: 20%;
          .el-input__inner {
            padding: 0 10px;
            border: 1px solid #dcdfe6;
            border-left: none;
          }
        }
      }
      .agreement-type {
        margin-left: 32px;
      }
    }
    .upload-list {
      width: 40%;
      margin: 20px;
      .uploadBtn {
        background: #47a87d;
        border-radius: 20px;
        margin: 10px;
        border: none;
      }
    }
  }
  .table {
    /deep/.el-table__header {
      width: 100% !important;

      th {
        text-align: center;
      }
    }
    /deep/ .el-table__empty-block {
      width: 100% !important;
    }
    /deep/.el-input-number {
      width: 100%;
      text-align: left;
      vertical-align: bottom;
      .el-input__inner {
        border-radius: 20px;
      }
      .el-input-number__increase {
        display: block;
        border-radius: 0 20px 0 0;
        width: 31px;
      }
      .el-input-number__decrease {
        display: block;
        border-radius: 0 0 20px 0;
        width: 31px;
      }
      .el-input__inner {
        text-align: center;
      }
    }
  }
}
</style>
