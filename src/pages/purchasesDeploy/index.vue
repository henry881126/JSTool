<template>
  <div class="purchases-deploy gas-page-bg">
    <top-menu
      @t-date-change="tDateChange"
      :date-picker-show="false"
      :start-time="startTime"
      :end-time="endTime"
      title="采购配置"
    ></top-menu>
    <div class="addSet" @click="dialogFormVisibleNew = true" v-trace="{title:'气源采购-采购配置-点击新增'}">+ 新增</div>
    <div class="purchases-deploy-content">
      <div
        class="deploy-content-item"
        v-for="(item, index) in supplierList"
        :key="'a' + index"
      >
        <div class="deploy-content-item-title" @click="consoleSetD(index)">
          <div class="title">{{ item.codeTxt }}</div>
          <div class="deploy-content-item-set" @click.stop="setData(item,index)">
              <i class="el-icon-more"></i>
              <div class="set-down" v-show="item.isShowSet">
                  <div @click="setBtn(item,index)">
                      <i class="el-icon-setting"> </i>
                      设置</div>
                  <div @click="delSetBtn(item,index)">
                      <i class="el-icon-delete"></i>
                      删除</div>
              </div>
              </div>
        </div>
        <div class="deploy-content">
          <div class="content-list">
            <label for="">供应商编号：</label>
            <div>{{ item.code }}</div>
          </div>
          <div class="content-list">
            <label for="">天然气下气站点：</label>
            <div>{{ item.downGasPlaceChange }}</div>
          </div>
          <div class="content-list">
            <label for="">偏差结算系数：</label>
            <div>{{ item.deviationNum }}</div>
          </div>
          <div class="content-list">
            <label for="">可调配量：</label>
            <div>{{ item.baseGasNum }}</div>
          </div>
          <div class="content-list">
            <label for="">是否用气：</label>
            <div :class="{ 'start-using': item.status == 1 }">
              {{ item.status | statusF }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="" :visible.sync="dialogFormVisible" :key="editTimer">
      <div class="dialog-title">
        <div class="title-left">
          <span class="com-name">{{ setComponyArray.codeTxt }}</span>
          <span
            class="com-code"
            :class="{ 'com-code-checked': setComponyArray.status }"
            >编号：{{ setComponyArray.code }}</span
          >
          <div class="switch" v-show="!isSubmit">
            <el-switch
              v-model="setComponyArray.status"
              active-color="#0fb2ab"
              inactive-color="#DFE7F2"
            >
            </el-switch>
            <span class="switch-label">启用</span>
          </div>
        </div>
      </div>
      <div class="set-detail">
        <div class="detail-title">
          <div class="title-left"></div>
        </div>
        <div class="detail-content loser-detail">
          <editPage
            :setComponyArray="setComponyArray"
            v-if="!isSubmit"
            @editSubmitSuccess="editSubmitSuccess"
            @editSubmitFail="editSubmitFail"
            :activeName="activeName"
          ></editPage>
          <!-- 编辑提交结果页面 -->

          <div class="submit-page" v-show="isSubmit">
            <div v-if="isSubmitSuccess == '1'" class="submitSuccess">
              <img src="./assets/success.png" alt="" />
              <div class="sub-tip">提交成功</div>
              <div class="submit-desc">
                您可以通过采购配置查看/配置您提交的供应商
              </div>
              <div class="submit-btn">
                <el-button type="primary" @click="finished">完成</el-button>
              </div>
            </div>
            <div v-if="isSubmitSuccess != '1'" class="submitFail">
              <img src="./assets/fail.png" alt="" />
              <div class="sub-tip">提交失败</div>
              <div class="submit-btn">
                <el-button type="primary" @click="backReset"
                  >返回重新填写</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogFormVisibleNew">
      <div class="dialog-title">
        <div class="title-left">
          <span class="com-name">新增采购供应商</span>
        </div>
      </div>
      <add-set-page v-if="!isSubmit"
      @addSubmitSuccess="addSubmitSuccess"
      @addSubmitFail="editSubmitFail"
      
      > </add-set-page>
      <div class="set-detail" v-if="!isSubmit">
        <div class="detail-title">
          <div class="title-left"></div>
        </div>
        <div class="detail-content loser-detail">
          <el-form ref="form1" :rules="rules" :model="form">
          </el-form>
        </div>
      </div>
        
      <!-- 提交结果页面 -->
      <div class="submit-page" v-show="isSubmit">
        <div v-if="isSubmitSuccess == '1'" class="submitSuccess">
          <!-- <success @successFinish='successFinish' :editData1="editData"></success> -->
          <img src="./assets/success.png" alt="" />
          <div class="sub-tip">提交成功</div>
          <div class="submit-desc">
            您可以通过采购配置查看/配置您提交的供应商
          </div>
          <div class="submit-btn">
            <el-button type="primary" class="finishUser" @click="finishUser"
              >完成并启用</el-button
            >
            <el-button type="primary" @click="finished">完成</el-button>
          </div>
        </div>
        <div v-if="isSubmitSuccess != '1'" class="submitFail">
          <img src="./assets/fail.png" alt="" />
          <div class="sub-tip">提交失败</div>
          <div class="submit-btn">
            <el-button type="primary" @click="backReset"
              >返回重新填写</el-button
            >
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 删除弹框确认 -->
    <el-dialog
        title=""
        :visible.sync="dialogVisible"
        width="30%"
        class="del-dialog"
        >
        <span class="dialog-con">确认要删除供应商
            {{delData.codeTxt?delData.codeTxt:''}}
            吗?</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogConsole">取消</el-button>
            <el-button type="primary" @click="dialogVisibleConfirm">确认</el-button>
        </span>
        </el-dialog>
  </div>
</template>

<script>
import topMenu from "../../components/topMenu/topMenu";
import api from "/src/http/api";
import exportApi from "/src/components/export/export";
import mergeTableRow from "/src/components/mergeTableRow/reply";
import editPage from "./component/editNew";
import addSetPage from "./component/stepcontent.vue"
export default {
  name: "reply",
  mixins: [exportApi, mergeTableRow],
  data: function () {
    return {
      browerTime:0,
      timer:null,
    dialogVisible:false,
    delIndex:'',
      editTimer: 1, //编辑弹框key
      isSubmitSuccess: "1", //提交成功
      isSubmit: false,
      // submitFail:'',//提交失败
      switchBtn: "",
      activeName: "01",
      stepActive: 1,
      dialogFormVisible: false,
      dialogFormVisibleNew: false,
      startTime: 0,
      endTime: 0,
      pageSize: 15,
      total: 0,
      current: 1,
      dialogTableVisible: false,
      calculateStylev: "",
      NcalculateStylev: "",
      gasNoHeatingSeasonDate: [], //日报表日期
      gasHeatingSeasonDate: [], //获取采暖季时间
      iSShowStock: "", //存量用户展示
      iSShowincrement: "", //增量用户展示
      iSShowresident: "", //居民气量
      iSShowbalanced: "", // 均衡气量
      iSShowpeakRegulation: "", // 调峰气量
      pitchPeakV2: "",//非居民调峰2
      pitchPeakV1: "",//非居民调峰
      rules: {
        code: [{ required: true, message: "请输入公司code", trigger: "blur" }],
        codeTxt: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        noHeatingStockOfIncrementalNum: [
          { required: true, message: "请输入公司11", trigger: "blur" },
        ],
      },
      pitchPeak1: [
        {
          value: "1",
          label: "1月",
        },
        {
          value: "2",
          label: "2月",
        },
        {
          value: "3",
          label: "3月",
        },
        {
          value: "4",
          label: "4月",
        },
        {
          value: "5",
          label: "5月",
        },
        {
          value: "6",
          label: "6月",
        },
        {
          value: "7",
          label: "7月",
        },
        {
          value: "8",
          label: "8月",
        },
        {
          value: "9",
          label: "9月",
        },
        {
          value: "10",
          label: "10月",
        },
        {
          value: "11",
          label: "11月",
        },
        {
          value: "12",
          label: "12月",
        },
      ],
      balance1: [
        {
          value: "1",
          label: "1月",
        },
        {
          value: "2",
          label: "2月",
        },
        {
          value: "3",
          label: "3月",
        },
        {
          value: "4",
          label: "4月",
        },
        {
          value: "5",
          label: "5月",
        },
        {
          value: "6",
          label: "6月",
        },
        {
          value: "7",
          label: "7月",
        },
        {
          value: "8",
          label: "8月",
        },
        {
          value: "9",
          label: "9月",
        },
        {
          value: "10",
          label: "10月",
        },
        {
          value: "11",
          label: "11月",
        },
        {
          value: "12",
          label: "12月",
        },
      ],
      balance2: [
        {
          value: "1",
          label: "1月",
        },
        {
          value: "2",
          label: "2月",
        },
        {
          value: "3",
          label: "3月",
        },
        {
          value: "4",
          label: "4月",
        },
        {
          value: "5",
          label: "5月",
        },
        {
          value: "6",
          label: "6月",
        },
        {
          value: "7",
          label: "7月",
        },
        {
          value: "8",
          label: "8月",
        },
        {
          value: "9",
          label: "9月",
        },
        {
          value: "10",
          label: "10月",
        },
        {
          value: "11",
          label: "11月",
        },
        {
          value: "12",
          label: "12月",
        },
      ],
      pitchPeak2: [
        {
          value: "1",
          label: "1月",
        },
        {
          value: "2",
          label: "2月",
        },
        {
          value: "3",
          label: "3月",
        },
        {
          value: "4",
          label: "4月",
        },
        {
          value: "5",
          label: "5月",
        },
        {
          value: "6",
          label: "6月",
        },
        {
          value: "7",
          label: "7月",
        },
        {
          value: "8",
          label: "8月",
        },
        {
          value: "9",
          label: "9月",
        },
        {
          value: "10",
          label: "10月",
        },
        {
          value: "11",
          label: "11月",
        },
        {
          value: "12",
          label: "12月",
        },
      ],
      setMouth: [
       
        {
          label: "4月",
          residents_gas: "",
          index:4
        },
        {
          label: "5月",
          residents_gas: "",
          index:5
        },
        {
          label: "6月",
          residents_gas: "",
          index:6
        },
        {
          label: "7月",
          residents_gas: "",
          index:7
        },
        {
          label: "8月",
          residents_gas: "",
          index:8
        },
        {
          label: "9月",
          residents_gas: "",
          index:9
        },
        {
          label: "10月",
          residents_gas: "",
          index:10
        },
        {
          label: "11月",
          residents_gas: "",
          index:11
        },
        {
          label: "12月",
          residents_gas: "",
          index:12
        },
         {
          label: "1月",
          residents_gas: "",
          index:1
        },
        {
          label: "2月",
          residents_gas: "",
          index:2
        },
        {
          label: "3月",
          residents_gas: "",
          index:3
        },
      ],
      calculateStyle: [
        {
          value: "01",
          label: "增量气量",
        },
        // {
        //   value: "02",
        //   label: "居民气量",
        // },
        // {
        //   value: "03",
        //   label: "均衡气量",
        // },
        {
          value: "04",
          label: "存量气量",
        },
        // {
        //   value: "05",
        //   label: "调峰气量",
        // },
      ],
      NcalculateStyle: [
        // {
        //   value: "01",
        //   label: "增量气量",
        // },
        {
          value: "02",
          label: "居民气量",
        },
        {
          value: "03",
          label: "均衡气量",
        },
        // {
        //   value: "04",
        //   label: "存量气量",
        // },
        {
          value: "05",
          label: "调峰气量",
        },
      ],
      deployedS: [
        {
          value: "01",
          label: "是",
        },
        {
          value: "02",
          label: "否",
        },
      ],
      deployed: "01",
      value: "",
      balance1V2:'',
      balance1V1:'',
      form: {

        baseGasNum: '', //可调配（是：有需要数值【小数点】。 否：没有具体数值）
        baseGasPrice: '', //基准门站价
        code: "", //供应商编码
        codeOrder: 0, //供应商顺序
        codeTxt: "", //供应商
        creator: "", //创建人
        deviationNum: '', //偏差系数，小数点
        downGasPlace: "", //下气站点，多个用逗哥隔开
        equilibriumGasOneMethod: "", //均衡气量，非居民均衡一方式
        equilibriumGasOneNum: '', //均衡气量，非居民均衡一价格
        equilibriumGasTwoOneMethod: "", //均衡气量，非居民均衡二方式
        equilibriumGasTwoOneNum: '', //均衡气量，非居民均衡二百分比【存小数点】
        equilibriumGasTwoOneTime: "", //均衡气量，非居民均衡二时间
        equilibriumGasTwoTwoMethod: "", //均衡气量，非居民均衡二，第二个，方式
        equilibriumGasTwoTwoNum: '', //均衡气量，非居民均衡二，第二个，百分比【存小数点】
        equilibriumGasTwoTwoTime: "", //均衡气量，非居民均衡二，第二个，时间
        funText: {}, //计算公式json格式
        gasSupply: "", //冬夏供气比
        heatingEndTime: "", //采暖季结束时间
        heatingMethod: "", //采暖计量方式
        heatingResidentsGasIncrementalMethod: "", //居民用气， 增量销售价格方式
        heatingResidentsGasIncrementalNum: '', //居民用气【增量销售价格】
        heatingStartTime: "", //采暖季开始时间
        id: 0, //主键
        modifier: "", //修改人
        noHeatingEndTime: "", //非采暖季结束时间
        noHeatingIncrementalMethod: "", //增量用户【增量销售价格方式】
        noHeatingIncrementalNum: '', //增量用户【增量销售价格】
        noHeatingMethod: "", //非采暖季计量方式
        noHeatingStartTime: "", //非采暖季开始时间
        noHeatingStockIncrementalMethod: "", //增量用户【存量销售价格方式】
        noHeatingStockIncrementalNum: '', //增量用户【存量销售价格】
        noHeatingStockMethod: "", //存量用户【存量销售价格方式】
        noHeatingStockNum: '', //存量用户【存量销售价格】
        noHeatingStockOfIncrementalMethod: "", //存量用户【增量销售价格方式】
        noHeatingStockOfIncrementalNum: '', //存量用户【增量销售价格】
        peakOneMethod: "", //非居民调峰一方式
        peakOneNum: '', //非居民调峰一数值
        peakOneTime: "", //非居民调峰一时间
        peakShavingNum: '', //调峰系数
        peakTwoMethod: "", //非居民调峰二方式
        peakTwoNum: '', //非居民调峰二数值
        peakTwoTime: "", //非居民调峰二时间
        pipelinePrice: '', //管输费
        equilibriumGasTwoPeakShaving: "", //均衡气量，非居民均衡二调峰系数
        peakPeakShaving: "", //非居民调峰系数
        equilibriumGasPeakShaving: "", //均衡气量，非居民均衡一调峰系数
        averageDayNum: "", //初始日均值
        smartAdoptCalculateResidentGas: {
          //采销每月居民用气量
          code: "",
          codeTxt: "",
          creator: "",
          id: 0,
          modifier: "",
          txt: {},
          year: "",
        },
        version: 0,
        xaReig: "",
        xaReigTxt: "",
      },
      replyTable: {
        list: [],
      },
      setComponyArray: "", //获取当前选择要编辑的供应商
      supplierList: [],
      comOptions: "",
      editData: "",
      SubmitSuccessData: "", //提交成功返回数据
      downGasPlace:'',
      
      // 天然气下气点
      optionsList: [
        {
          value: "01",
          label: "东站",
        },
        {
          value: "02",
          label: "1号站",
        },
        {
          value: "03",
          label: "北斗路门站",
        },
        {
          value: "04",
          label: "正定新区门站",
        },
        {
          value: "05",
          label: "中科门站",
        },
        {
          value: "06",
          label: "中石化门站",
        }
      ],
      options123: [
        {
          value: "01",
          label: "定远分输站",
        },
        {
          value: "02",
          label: "滁州分输站",
        },
        {
          value: "03",
          label: "淮安分输站",
        },
        {
          value: "04",
          label: "迁安分输站",
        },
        {
          value: "05",
          label: "唐山压气站",
        },
        {
          value: "06",
          label: "廊坊输气站",
        },{
          value: "07",
          label: "永清分输站",
        },{
          value: "08",
          label: "滁州分输站",
        },{
          value: "09",
          label: "定远分输站",
        }
      ],
      isShowSet:false,
      delData:'',//要删除的数据
      
    };
  },

  components: {
    topMenu,
    editPage,
    addSetPage
  },

  created() {
    window.zhuge.track('气源采购-进入采购配置页面',{'页面名称':'采购配置页面'})
    this.gasNoHeatingSeasonDate[0] = "2021-04-01";
    this.gasNoHeatingSeasonDate[1] = "2021-10-30";
    this.gasHeatingSeasonDate[0] = "2021-11-01";
    this.gasHeatingSeasonDate[1] = "2022-03-31";
    this.startTime = this.getFormatTime(Date.now());
    this.endTime = this.getFormatTime(Date.now() + 24 * 3600000);
    this.getList();
    this.comOptions = this.$store.getters["companyList"];
  },
  filters: {
    statusF(val) {
      if (val == 1) {
        return "启用";
      } else {
        return "未启用";
      }
    },
  },
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom;
    },
  },

  watch: {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if (n && o) {
          this.getData()
        }
      },
    },
  },
  mounted() {
    this.getBrowerTime()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.zhuge.track('气源采购-采购配置页面停留时长',{'采购配置页面停留时长':this.browerTime})
  },  
  methods: {
    getBrowerTime() {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    },     
    getData(){
      this.getList();

    },
    HeatingSeasonChange(){

    },
    NoHeatingSeasonChange(){

    },

    handleChange(){

    },
    successFinish() {
      this.dialogFormVisible = false;
      this.dialogFormVisibleNew = false;
    },
    editSubmitSuccess(val) {
      this.isSubmit = true;
      this.isSubmitSuccess = "1";
      this.editData = val;
      
      // 跳转列表页
      setTimeout(() => {
              this.finished()
      }, 1000);
    },
     addSubmitSuccess(val) {
      this.isSubmit = true;
      this.isSubmitSuccess = "1";
      this.editData = val;
      this.SubmitSuccessData = val[0]
      console.log(val)
      // 跳转列表页
      setTimeout(() => {
              this.finished()
      }, 5000);
    },
    editSubmitFail(val) {
      this.isSubmit = true;
      this.isSubmitSuccess = "0";
      this.editData = val;
    },
    calculateStyleChange(val) {
      let iSShowStock = val.some((value) => {
        return value[0] == "04";
      });
      let iSShowincrement = val.some((value) => {
        return value[0] == "01";
      });
      this.iSShowStock = iSShowStock; //存量用户展示
      this.iSShowincrement = iSShowincrement; //增量用户展示
    },
    NocalculateStyleChange(val) {
      
      let iSShowresident = val.some((value) => {
        return value[0] == "02";
      });
      let iSShowbalanced = val.some((value) => {
        return value[0] == "03";
      });
      let iSShowpeakRegulation = val.some((value) => {
        return value[0] == "05";
      });
      (this.iSShowresident = iSShowresident), //居民气量
        (this.iSShowbalanced = iSShowbalanced), // 均衡气量
        (this.iSShowpeakRegulation = iSShowpeakRegulation); // 调峰气量
    },
    step1Next1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.stepActive = 2;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    secondBtn() {
      this.stepActive = 2;
    },
    firstBtn() {
      this.stepActive = 1;
    },
    submitBtn() {
      let getMonthData = {};
      this.setMouth.forEach((element) => {
        let obj = {};
        obj.residents_gas = element.residents_gas;
        getMonthData[element.index] = obj;
      });
      let datalList = {
        
        baseGasNum: this.form.baseGasNum, //可调配（是：有需要数值【小数点】。 否：没有具体数值）
        baseGasPrice: this.form.baseGasPrice, //基准门站价
        code: this.form.code, //供应商编码
        codeOrder: this.form.codeOrder, //供应商顺序
        codeTxt: this.form.codeTxt, //供应商
        creator: this.form.creator, //创建人
        deviationNum: this.form.deviationNum, //偏差系数，小数点
        downGasPlace: this.downGasPlace?this.downGasPlace.join(','):'', //下气站点，多个用逗哥隔开
        equilibriumGasOneMethod: this.form.equilibriumGasOneMethod, //均衡气量，非居民均衡一方式
        equilibriumGasOneNum: this.form.equilibriumGasOneNum, //均衡气量，非居民均衡一价格
        equilibriumGasTwoOneMethod: this.balance1V1?this.balance1V1.join(",")
          : "", //均衡气量，非居民均衡二方式
        equilibriumGasTwoOneNum: this.form.equilibriumGasTwoOneNum, //均衡气量，非居民均衡二百分比【存小数点】
        equilibriumGasTwoOneTime: this.form.equilibriumGasTwoOneTime, //均衡气量，非居民均衡二时间
        equilibriumGasTwoTwoMethod: this.balance1V2
          ? this.balance1V2.join(",")
          : "", //均衡气量，非居民均衡二，第二个，方式
        equilibriumGasTwoTwoNum: this.form.equilibriumGasTwoTwoNum, //均衡气量，非居民均衡二，第二个，百分比【存小数点】
        equilibriumGasTwoTwoTime: this.form.equilibriumGasTwoTwoTime, //均衡气量，非居民均衡二，第二个，时间
        gasSupply: this.form.gasSupply, //冬夏供气比
        heatingEndTime: this.gasHeatingSeasonDate[1], //采暖季结束时间
        heatingMethod: this.calculateStylev
          ? this.calculateStylev.join(",")
          : "", //采暖计量方式
        heatingResidentsGasIncrementalMethod: this.form
          .heatingResidentsGasIncrementalMethod, //居民用气， 增量销售价格方式
        heatingResidentsGasIncrementalNum: this.form
          .heatingResidentsGasIncrementalNum, //居民用气【增量销售价格】
        heatingStartTime: this.gasHeatingSeasonDate[0], //采暖季开始时间
        id: this.form.id, //主键
        modifier: this.form.modifier, //修改人
        noHeatingEndTime: this.gasNoHeatingSeasonDate[1], //非采暖季结束时间
        noHeatingIncrementalMethod: this.form.noHeatingIncrementalMethod, //增量用户【增量销售价格方式】
        noHeatingIncrementalNum: this.form.noHeatingIncrementalNum, //增量用户【增量销售价格】
        noHeatingMethod: this.NcalculateStylev
          ? this.NcalculateStylev.join(",")
          : "", //非采暖季计量方式
        noHeatingStartTime: this.gasNoHeatingSeasonDate[0], //非采暖季开始时间
        noHeatingStockIncrementalMethod: this.form
          .noHeatingStockIncrementalMethod, //增量用户【存量销售价格方式】
        noHeatingStockIncrementalNum: this.form.noHeatingStockIncrementalNum, //增量用户【存量销售价格】
        noHeatingStockMethod: this.form.noHeatingStockMethod, //存量用户【存量销售价格方式】
        noHeatingStockNum: this.form.noHeatingStockNum, //存量用户【存量销售价格】
        noHeatingStockOfIncrementalMethod: this.form
          .noHeatingStockOfIncrementalMethod, //存量用户【增量销售价格方式】
        noHeatingStockOfIncrementalNum: this.form
          .noHeatingStockOfIncrementalNum, //存量用户【增量销售价格】
        peakOneMethod: this.pitchPeakV1 ? this.pitchPeakV1.join(",") : "", //非居民调峰一方式
        peakOneNum: this.form.peakOneNum, //非居民调峰一数值
        peakOneTime: this.form.peakOneTime, //非居民调峰一时间
        peakShavingNum: this.form.peakShavingNum, //调峰系数
        averageDayNum: this.form.averageDayNum, //日均量
        peakTwoMethod: this.pitchPeakV1 ? this.pitchPeakV1.join(",") : "", //非居民调峰二方式
        peakTwoNum: this.form.peakTwoNum, //非居民调峰二数值
        peakTwoTime: this.form.peakTwoTime, //非居民调峰二时间
        pipelinePrice: this.form.pipelinePrice, //管输费
        equilibriumGasTwoPeakShaving: this.form.equilibriumGasTwoPeakShaving, //均衡气量，非居民均衡二调峰系数
        peakPeakShaving: this.form.peakPeakShaving, //非居民调峰系数
        equilibriumGasPeakShaving: this.form.equilibriumGasPeakShaving, //均衡气量，非居民均衡一调峰系数

        smartAdoptCalculateResidentGas: {
          //采销每月居民用气量
          code: this.form.code,
          codeTxt: this.form.codeTxt,
          creator: "",
          id: 0,
          modifier: "",
          txt: getMonthData,
          year: "",
        },
        version: 0,
        xaReig: this.curComCode,
        xaReigTxt: "",
      };
      api.purchasesDeploy.supplierAdd(datalList).then((res) => {
        if (res) {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: 1000,
          });
          console.log(res)
          this.isSubmit = true;
          this.isSubmitSuccess = "1";
          console.log(res)
          if (res.length > 0) {
            this.SubmitSuccessData = res[0];
          }
          setTimeout(() => {
              this.finished()
          }, 1000);
 
          
        } else {
          this.isSubmit = true;
          this.isSubmitSuccess = "0";
          this.stepActive = "1";
        }
      });
      // this.isSubmit = true;
      // if (val == "1") {
      //   this.isSubmitSuccess == "1";
      // } else {
      //   this.isSubmitSuccess == "0";
      // }
    },
    getList() {
      let data = {
        xaReig: this.curComCode,
      };
      api.purchasesDeploy.supplierList(data).then((res) => {
        this.supplierList = res;
        
        this.supplierList.forEach(item=>{
            this.$set(item,'isShowSet',false)
          item.isShowSet = false
          item.downGasPlace = item.downGasPlace.split(',')
          item.downGasPlaceChange = []
           this.optionsList.forEach(item1 =>{
              item.downGasPlace.forEach(item2=>{
                if(item1.value == item2){
                   item.downGasPlaceChange.push(item1.label)
                }  
              })
            }) 
            item.downGasPlaceChange = item.downGasPlaceChange.join(' ，')
        })
      });
      
    },
    
    finishUser() {
      let data = {
        id: this.SubmitSuccessData.id,
        version: this.SubmitSuccessData.version,
        status: 1,
      };
      console.log(this.SubmitSuccessData)
      api.purchasesDeploy.supplierUupdate(data).then((res) => {
        if (res) {
          this.stepActive = 1;
          this.isSubmit = false;
          this.activeName = "01";
          this.dialogFormVisibleNew = false;
          this.dialogFormVisible = false;
        }
      });
    },
    finished() {
      this.stepActive = 1;
      this.isSubmit = false;
      this.activeName = "01";
      this.dialogFormVisibleNew = false;
      this.dialogFormVisible = false;
      this.getList();
    },
    backReset() {
      this.isSubmit = false;
      this.activeName = "01";
      this.stepActive= 1
    },
    step1Next() {
      this.stepActive = 2;
    },
    // 第二步提交
    step2Submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.stepActive = 3;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    step3Submit(val) {
      this.isSubmit = true;
      if (val == "1") {
        this.isSubmitSuccess == "1";
      } else {
        this.isSubmitSuccess == "0";
      }
    },
    tDateChange: function (date) {
      this.startTime = new Date(date).getTime() / 1000;
      this.endTime = this.startTime + 24 * 60 * 60;
    },

    getFormatTime: function (timestamp) {
      let date = new Date(timestamp);
      let yyyy = date.getFullYear();
      let mm =
        date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return yyyy + "-" + mm + "-" + dd;
    },
    setData(val,index) {
        // this.isShowSet = !this.isShowSet
        this.supplierList[index].isShowSet = !this.supplierList[index].isShowSet
    },
    setBtn(val,index){
      this.setComponyArray = val;
      this.setComponyArray.status =
      this.setComponyArray.status == 1 ? true : false;
      this.dialogFormVisible = true;
      this.editTimer++;
      this.supplierList[index].isShowSet = false
    },
    // 删除列表
    delSetBtn(val,index){
        this.dialogVisible = true
        this.delData = val
        this.delIndex = index
        this.supplierList[index].isShowSet = false
      
    },
    consoleSetD(index){
        this.supplierList[index].isShowSet = false
    },
    supplierDelete(id){
        let data = {
            id:id
        }
      api.purchasesDeploy.supplierDelete(data).then((res) => {
        if (res) {
            this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000,
          });
          
        }
      });
    },
    dialogVisibleConfirm(){
        this.supplierDelete(this.delData.id)
        this.dialogVisible = false
        this.supplierList[this.delIndex].isShowSet = false
        this.getData()
        console.log(this.delData)
    },
    dialogConsole(){
        this.dialogVisible = false
        this.supplierList[this.delIndex].isShowSet = false
    }
  },
};
</script>
<style lang="scss">
.purchases-deploy{
     .el-input__suffix {
            border: none !important;
          }
          .el-select .el-input__inner{
            height: 40px;
            background: #EDEEF4;
          }
          .el-date-editor--daterange.el-input__inner{
            width: 100%;
        }
}
.purchases-deploy-step1 {
    padding: 20px;
    color: red;
    .lower-gas-point {
      .el-select {
        width: 100%;
      }
    }
    .step1-btn {
      text-align: right;
      padding: 20px;
      .el-button {
        border-radius: 43px;
        background-color: #0fb2ab;
        border-color: #0fb2ab;
        &.el-button--default {
          background-color: #fff;
        }
      }
    }
    .el-input__inner {
      border-radius: 29px;
      background: #EDEEF4;
    }
    .step-item-block {
      display: flex;
      .item-list {
        width: 50%;
        margin-right: 10px;
        .custom-unit {
          position: absolute;
          top: 38px;
          right: 18px;
          color: #74788d;
        }
        .deployed {
          width: 79px;
          position: absolute;
          z-index: 2;
          .el-input__inner {
            padding-left: 10px;
            background: #EDEEF4;
            color: #495464;
          }
          .el-input__suffix {
            border: none !important;
          }
        }
        .deployedS-input {
          .el-input__inner {
            padding-left: 89px;
          }
        }
      }
    }
  }
    
</style>

<style scoped lang="scss">
.purchases-deploy {
  padding: 10px;
  // height: 100%;
  .del-dialog{
      /deep/.el-dialog__body{
       text-align: center;
      }
      /deep/.el-dialog__footer{
          text-align: center;
      }
      .dialog-con{
          text-align: center;
      }

  }
  .purchases-deploy-step2 {
    padding: 20px;
    .calculate {
      .el-form-item__content {
        .el-cascader {
          width: 100% !important;
        }
      }
    }
    .non-heating-season {
      color: #2c3e50;
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 500;
      line-height: 19px;
      color: #2c3e50;
      opacity: 1;
      margin: 20px 0px;
      img {
        width: 28px;
        height: 28px;
        vertical-align: middle;
      }
    }
    .heating-season {
      color: #2c3e50;
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 500;
      line-height: 19px;
      color: #2c3e50;
      opacity: 1;
      margin: 20px 0px;
      img {
        width: 28px;
        height: 28px;
        vertical-align: middle;
      }
    }
    .lower-gas-point {
      .el-select {
        width: 100%;
      }
    }
    .step1-btn {
      text-align: right;
      padding: 20px;
      .el-button {
        border-radius: 43px;
        background-color: #0fb2ab;
        border-color: #0fb2ab;
        &.el-button--default {
          background-color: #fff;
        }
      }
    }
    .el-input__inner {
      border-radius: 29px;
      background: #f6f7fa;
    }
    .step-select-list {
      .list-title {
        color: #a6a9b4;
        line-height: 40px;
      }
      .list-item-label {
        line-height: 42px;
      }
    }
    .step-item-block {
      display: flex;
      .el-cascader {
        width: 100% !important;
      }
      .calculate {
        /deep/.el-form-item__content {
          /deep/.el-cascader {
            width: 100% !important;
          }
        }
      }
      .item-list {
        width: 50%;
        margin-right: 10px;
        & .deployed {
          width: 79px;
          position: absolute;
          z-index: 2;
          .el-input__inner {
            padding-left: 10px;
            background: #EDEEF4;
            color: #495464;
          }
          .el-input__suffix {
            border: none !important;
          }
        }
        .deployedS-input {
          .el-input__inner {
            padding-left: 89px;
          }
        }
      }
    }
  }
  .purchases-deploy-step3 {
    padding: 20px;
    .non-heating-season {
      color: #2c3e50;
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 500;
      line-height: 19px;
      color: #2c3e50;
      opacity: 1;
    }
    .lower-gas-point {
      .el-select {
        width: 100%;
      }
    }
    .step1-btn {
      text-align: right;
      padding: 20px;
      .el-button {
        border-radius: 43px;
        background-color: #0fb2ab;
        border-color: #0fb2ab;
        &.el-button--default {
          background-color: #fff;
        }
      }
    }
    .el-input__inner {
      border-radius: 29px;
      background: #f6f7fa;
    }
    .step-select-list {
      .list-title {
        color: #a6a9b4;
      }
    }
    .step3-item-block {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .item-list {
        width: 30%;
        margin-right: 10px;
        .deployed {
          width: 79px;
          position: absolute;
          z-index: 2;
          .el-input__inner {
            padding-left: 10px;
            background: #EDEEF4;
            color: #495464;
          }
        }
        .deployedS-input {
          .el-input__inner {
            padding-left: 89px;
          }
        }
      }
    }
  }
  .addSet {
    position: absolute;
    top: 68px;
    left: 15%;
    padding: 6px 20px;
    background: #f7eded4f;
    border-radius: 20px;
    color: #ffffffa6;
  }
  .dialog-title {
    display: flex;
    justify-content: space-between;
    margin: 20px 20px;
    // margin-top: -30px;
    padding-bottom: 22px;
    border-bottom: 1px solid #99999959;
    .title-left {
      .com-name {
        margin-right: 20px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 600;
        line-height: 33px;
        color: #2c3e50;
        opacity: 1;
        vertical-align: middle;
      }
      .com-code {
        padding: 1px 10px;
        border-radius: 20px;
        background: #f6f7fa;
        color: #74788d;
        display: inline-block;
        vertical-align: baseline;
        line-height: 25px;
      }
      .com-code-checked {
        padding: 1px 10px;
        border-radius: 20px;
        background: #ade4bb6b;
        color: #0fb2ab;
        display: inline-block;
        vertical-align: baseline;
      }
    }
    .switch {
      display: inline-block;
      margin-left: 55px;
      .switch-label {
        margin-left: 10px;
      }
    }
  }
  .set-detail {
    width: 80%;
    margin: 0 auto;
    .detail-title {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      .title-left {
        .com-name {
          margin-right: 20px;
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 600;
          line-height: 33px;
          color: #2c3e50;
          opacity: 1;
        }
        .com-code {
          padding: 1px 10px;
          border-radius: 20px;
          background: #f6f7fa;
          color: #74788d;
          display: inline-block;
          vertical-align: top;
        }
      }
      .submitBtn {
        color: #0fb2ab;
        background: #fff;
        border: 1px solid #0fb2ab;
        border-radius: 100px;
      }
    }
    .detail-content {
      .custom-tab {
        .custom-label {
          position: absolute;
          top: 0;
          left: 18px;
          color: #74788d;
        }
        .custom-unit {
          position: absolute;
          top: 38px;
          right: 18px;
          color: #74788d;
        }
        .step-input {
          /deep/.el-input {
            .el-input__inner {
              padding: 0 52px;
            }
          }
        }

        /deep/.date-picker {
          .el-range-input {
            background: none;
          }
        }
        /deep/.el-tabs__nav {
          .el-tabs__item {
            margin-bottom: 20px;
            height: 20px;
            line-height: 20px;
          }
          .el-tabs__item.is-active {
            color: #0fb2ab;
          }
          .el-tabs__active-bar {
            background: #0fb2ab;
            // width: 88px !important;
            // left: -13px;
          }
          #tab-first {
            border-right: 1px solid #e4e4e4;
            padding-left: 16px;
          }
        }
      }
      .del-step {
        padding: 3px 7px;
        vertical-align: top;
        display: inline-block;
        /* line-height: 36px; */
        border-radius: 20px;
        border: 1px solid;
        margin-top: 8px;
        margin-left: 10px;
      }
      .tab-content {
        padding: 20px 50px;
        .content-item {
          padding: 40px 20px;
        }
        .add-step {
          background: #fff;
          border-radius: 20px;
          color: #0fb2ab;
          margin: 15px 50px 50px;
        }
        .com-btn {
          display: flex;
          justify-content: space-between;
          padding: 50px 10px;
          .el-button {
            width: 114px;
            height: 46px;
            background: #ffffff;
            border: 1px solid #d2d2dc;
            opacity: 1;
            border-radius: 100px;
            font-family: PingFang SC;
            font-weight: 500;
            i {
              margin-right: 5px;
            }
          }
          .save-btn {
            background: #0fb2ab;
            opacity: 1;
            border-radius: 100px;
            border: none;
          }
        }
        .el-input {
          width: 100%;
        }
      }
    }
    .loser-detail {
      .loser-top {
        padding: 20px 10px;
        display: inline-block;
      }
      .el-steps {
        /deep/.el-step__head.is-finish {
          color: #0fb2ab;
          border-color: #0fb2ab;
        }
        /deep/.el-step__title.is-finish {
          color: #0fb2ab;
        }
      }
      .loser-list {
        .list-top {
          display: flex;
          padding: 20px;
          .list-top-com {
            flex: 1;
            .custom-tooltip {
              position: relative;
              display: inline-block;
              color: #0fb2ab;
              .tooltip {
                opacity: 0;
                position: absolute;
                top: -10px;
                left: 21px;
                width: 53px;
                padding: 10px;
                background: #e5f6f6;
                border-radius: 9px;
                color: #0fb2ab;
                .popper__arrow {
                  position: absolute;
                  left: -11px;
                  top: 12px;
                  display: block;
                  width: 0;
                  height: 0;
                  border-color: transparent;
                  border-style: solid;
                  border-width: 6px;
                  border-right-color: #e5f6f6;
                }
              }
            }
          }
          .list-top-com:hover .tooltip {
            opacity: 1;
          }
        }
      }
    }
  }
  .submit-page {
    text-align: center;
    padding: 36px;
    .sub-tip {
      font-size: 24px;
      color: #2c3e50;
      margin-bottom: 20px;
    }
    .submit-btn {
      padding: 50px;
      .el-button {
        border-radius: 43px;
        background-color: #0fb2ab;
        border-color: #0fb2ab;
        &.el-button--default {
          background-color: #fff;
        }
      }
      .finishUser {
        &.el-button {
          border-radius: 43px;
          background-color: #ffffff;
          border-color: #0fb2ab;
          color: #0fb2ab;
          &.el-button--default {
            background-color: #fff;
          }
        }
      }
    }
    .submit-desc {
    }
    .submitSuccess {
      img {
        width: 300px;
        height: 172px;
      }
    }
    .submitFail {
      img {
        width: 300px;
        height: 172px;
      }
    }
  }
  .purchases-deploy-content {
    display: flex;
    padding: 54px 20px;
    flex-wrap: wrap;
    // justify-content: space-between;
    .deploy-content-item {
      width: 28%;
      background: #fff;
      padding: 30px;
      border-radius: 16px;
      margin-right: 10px;
      margin-bottom: 20px;
      padding-top: 0;
      background-image: url('./assets/list-bg.png');
      background-repeat:no-repeat;
      background-size: 100%;
      
      // display: flex;
      // justify-content: space-between;
      .deploy-content-item-title {
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        justify-content: space-between;
        padding: 20px 0;

        .deploy-content-item-set {
        //   background: #e6f7f7;
          border-radius: 10px;
          padding: 4px 2px;
        //   color: #0fb2ab;
          line-height: 30px;
          position: relative;
          .set-down{
                padding: 12px;
                box-shadow: 0px 10px 20px rgba(38, 51, 88, 0.07);
                border-radius: 20px;
                position: absolute;
                right: -20px;
                z-index: 10;
                background: #ffffff;
                width: 54px;
          }
        }
        .title {
          font-weight: 700;
          margin-top: 5px;
          font-size: 24px;
        }
      }
      .deploy-content {
        .content-list {
          display: flex;
          line-height: 50px;
          label {
            font-weight: 500;
            color: #2c3e50;
            font-family: PingFang SC;
            width: 195px;
          }
          .start-using {
            color: #0fb2ab;
          }
        }
      }
    }
  }
}
</style>