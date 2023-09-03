<template>
  <div class="day-gas-mask">
    <div class="day-gas-report-container gas-page-bg">
      <div class="top-bag">
        <div class="top-header">
          <top-menu
            @t-date-change="tDateChange"
            :date-picker-show="false"
            title="日气量报表"
          ></top-menu>
        </div>
      </div>
     
      <div class="gas-search">
          <div class="table-search">
          <el-row :gutter="0">
            <el-col :lg="5" :xl="5" class="day-table-date">
              <div class="block">
                <el-date-picker
                  v-model="gasReportDate"
                  :picker-options="pickerOptions"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy/MM/dd"
                  placeholder="选择日期时间"
                  @change="ReportListdateChange"
                  class="table-date"
                >
                </el-date-picker>
              </div>
            </el-col>
            
            <el-col :lg="5" :xl="5">
              <div class="block">
                <span class="demonstration">类型：</span>
                <el-cascader
                  :options="repotTypeOptions"
                  v-model="reportTypeChannge"
                  @change="changeRepotTypeOptions"
                ></el-cascader>
              </div>
            </el-col>

            <el-col :lg="7" :xl="7">
              <div class="block report-change-select">
                <el-select
                  v-model="reportChangeSelect"
                  placeholder="请选择"
                  @change="changeSelect"
                  v-if="this.reportTypeM == '01'"
                  class="select-left"
                >
                  <el-option
                    v-for="item in repoortSelectCost"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-select
                 v-if="this.reportTypeM == '03'"
                  v-model="reportChangeSelect"
                  placeholder="请选择"
                  @change="changeSelect" 
                  class="select-left"
                >
                  <el-option
                    v-for="item in repoortSelectGas"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-cascader
                class="select-right"
                v-if="this.reportChangeSelect=='01'"
                  :options="listSupplierList"
                  :props="{
                    value: 'linfnr',
                    label: 'linfnrTxt',
                    children: '',
                  }"
                  v-model="reportChangeOptions"
                  @change="handleChange1"
                ></el-cascader>
                <el-cascader
                class="select-right"
                v-if="this.reportChangeSelect==='02'"
                  :options="listUserList"
                  :props="{
                    value: 'compCode',
                    label: 'compCodeTxt',
                    children: '',
                  }"
                  v-model="reportChangeOptions"
                  @change="handleChange1"
                ></el-cascader>
                <el-cascader
                class="select-right"
                v-if="this.reportChangeSelect==='03'"
                  :options="listSupplierPip"
                  :props="{
                    value: 'pipelineCode',
                    label: 'pipelineCodeTxt',
                    children: '',
                  }"
                  v-model="reportChangeOptions"
                  @change="handleChange1"
                ></el-cascader>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="tabel-container">
        <div class="select-option-name">
            <div>
            <span class="option-name">{{getCompName}}
                <label for="1" >({{reportChangeSelect | selectNameType}})</label>
            </span>
            <span v-show="this.reportChangeSelect == '01' && this.reportTypeChannge[0] == '03' && getGasReportLifnrPipelineName" class="icon-unit">
                <i class="el-icon-connection"></i>
            </span>
            <span v-show="this.reportChangeSelect == '01' &&  this.reportTypeChannge[0] == '03'">{{getGasReportLifnrPipelineName}}</span>
            </div>
            <div class="block derive-btn">
                <el-button
                  type="info"
                  class="submitBtn-day"
                  plain
                  @click="exportExcel1"
                  ><i class="el-icon-upload2" v-trace="{title:'气量调配-日气量报表-点击导出'}"></i>导出</el-button
                >
              </div>  
        </div>
        <div class="table-unit">
          单位：
          <!-- 价格 -->
          <span v-if="reportTypeM == '02'">元/方</span>
          <!-- 气量 -->
          <span v-if="reportTypeM == '03'">万方</span>
          <!-- 费用 -->
          <span v-if="reportTypeM == '01'">万元</span>
        </div>
        <!-- 气量供应商报表 -->
        <div class="table-gad">
              <el-table
          stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          :data="getPriceReportData1"
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          v-show="visibleGasTable === '01'"
          class="custom-table-r gas-report-table"
          height="80%"
        >
          <el-table-column prop="currDate" label="日期" width="180" align="center">
          </el-table-column>
          <el-table-column prop="uploadNum" label="上载量" align="center">
          </el-table-column>
          <el-table-column prop="pipeLineNum" label="管容" align="center">
          </el-table-column>
          <el-table-column prop="downloadNUm" label="下载量" align="center">
          </el-table-column>
          <el-table-column prop="rC" label="明细详情" align="center">
            <template slot-scope="scope">
                <div @click="gasSupperEditA(scope.row)">
                   <i class="el-icon-view"></i>
                   <span class="gas-report-edit-btn" >查看</span>
                </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 气量用气客户报表 -->
        <el-table
          stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          :data="getPriceReportData2"
          :span-method="objectSpanMethod1"
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          v-show="visibleGasTable == '02'"
          class="custom-table-r gas-report-table"
          height="80%"
        >
          <el-table-column prop="time" label="日期" width="180" align="center">
          </el-table-column>
          <el-table-column prop="downGasPlace" label="下载点" align="center">
          </el-table-column>
          <el-table-column prop="gasNum" label="日交割量" align="center">
          </el-table-column>
          <el-table-column prop="time" label="明细详情" align="center">
            <template slot-scope="scope">
              <!-- <span @click="gasUserEdit(scope.row)">编辑</span> -->
              <div @click="gasUserEditAll(scope.row)">
                   <i class="el-icon-view"></i>
                   <span class="gas-report-edit-btn" >查看</span>
                </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 费用供应商报表 -->
        <el-table
          stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          :data="getCostSupperData"
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          v-show="visibleGasTable == '03'"
          class="custom-table-r gas-report-table"
          height="80%"
        >
          <el-table-column prop="time1" label="日期" width="180" align="center">
          </el-table-column>
          <el-table-column prop="gasPrice" label="采购单价" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="采购成本" align="center">
          </el-table-column>
          <el-table-column prop="prepaidPrice" label="预付费用" align="center">
          </el-table-column>
          <el-table-column prop="balancePrice" label="预付余额" align="center">
          </el-table-column>
        </el-table>
        <!-- 费用用气客户报表 -->
        <el-table
          stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          :data="getCostUserData"
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          v-show="visibleGasTable == '04'"
          class="custom-table-r gas-report-table"
          height="80%"
        >
          <el-table-column prop="time1" label="日期" width="180" align="center">
          </el-table-column>
          <el-table-column prop="gasPrice" label="销售单价" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="应收气款" align="center">
          </el-table-column>
          <el-table-column prop="prepaidPrice" label="预付费用" align="center">
          </el-table-column>
          <el-table-column prop="balancePrice" label="预付余额" align="center">
          </el-table-column>
         
        </el-table>
        <!-- 费用管输方报表 -->
        <el-table
          stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          :data="getPriceReportDataCost.dataList"
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          v-show="visibleGasTable == '05'"
          class="custom-table-r gas-report-table"
          height="80%"
        >
          <!-- 动态生成列 -->
          <el-table-column
            v-for="(item, index) in getPriceReportDataCost.theadList"
            :key="'a' + index"
            :label="item.label"
            :prop="item.prop"
            
            :fixed="item.prop === 'dimension' || item.prop === 'date'"
          >
          </el-table-column>
        </el-table>
        </div>
      </div>
       <el-dialog
        :title="GasSupperDetailTableTitle"
        :visible.sync="dialogFormGasSupperDetail"
        :key="GasSupperDetailKey"
        class="dialog-gas-supper-detail"
      >
      <el-table
          stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          :data="GasSupperDetailTableData"
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          class="custom-table-r"
        >
          <el-table-column prop="companyName" label="用气企业" align="center">
          </el-table-column>
          <el-table-column prop="downGasPlace" label="输气场站" align="center">
          </el-table-column>          
          <el-table-column prop="dayDeliveryNum" label="日交割量" align="center">
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 用气客户详情 -->
       <el-dialog
        :title="GasUserDetailTableTitle"
        :visible.sync="dialogFormGasUserDetail"
        :key="GasUserDetailKey+'l'"
        class="dialog-gas-supper-detail"
      >
      <div class="detail-gas-table">
         <el-table
          stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          :data="GasUserDetailTableData"
          :span-method="objectSpanMethod"
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          class="custom-table-r"
        >
          <el-table-column prop="linfnrTxt" label="供应商" width="180" align="center">
          </el-table-column>
          <el-table-column prop="downGasPlace" label="下载点" align="center">
          </el-table-column>
          <el-table-column prop="gasNum" label="交割量" align="center">
          </el-table-column>
          <el-table-column prop="gasNumTotal" label="合计" align="center">
          </el-table-column>
         
        </el-table>
      </div>
      </el-dialog>
    </div>
    <el-dialog
        title="导出数据"
        :visible.sync="exportDialogVisible"
        custom-class="custom-dialog"
        width="30%">
      <el-radio v-model="exportDate" :label="10000">当前时间段 {{ getFormatDate(gasReportDate[0], '/') + '-' + getFormatDate(gasReportDate[1], '/') }}</el-radio>
      <br><br>
      <div v-for="(v, k) in exportDateRange" :key="v.dateName">
        <el-radio v-model="exportDate" :label="k">{{ v.dateName }}</el-radio>
        <br><br>
      </div>
      <el-radio v-model="exportDate" :label="10001">含以上全量数据</el-radio>
      <br><br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="exportExcel()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "/src/http/api";
import topMenu from "../../components/topMenu/topMenu";
import exportApi from "/src/components/export/export";
import dateFormater from "../../components/dateFormater/dateFormater";

export default {
  name: "PurchaseAnalysiss",
  mixins: [exportApi, dateFormater],
  components: {
    topMenu,
  },
  props: {},
  data() {
    return {
      exportDialogVisible: false,
      browerTime:0,
      timer:null,
      reportChangeSelect: "", //下拉选择
      repoortSelectGas: [
        {
          label: "供应商",
          value: "01",
          disabled: false,
        },
        {
          label: "用气企业",
          value: "02",
        },
      ],
      repoortSelectCost: [
        {
          label: "供应商",
          value: "01",
        },
        {
          label: "用气企业",
          value: "02",
        },
        {
          label: "管输方",
          value: "03",
        },
      ],
      reportChangeOptions: [],
      downloadPoint: [],
      editTimer: 3, //编辑弹框key
      editTimerUser: 2,
      getuserchangeData: "", //获取用气客户当前选项
      arr: [
        { code: "XA037", name: "蚌埠新奥", status: "01" },
        { code: "XA037", name: "蚌埠新奥2", status: "02" },
      ],
      planUserdata: [], //日期量计划获取用户客户
      getCompVosList: [], //A获取供应商数据
      getSuppliersList: [], //获取用气客户数据
      getPipelinesList: [], //获取管输方数据
      tipcontent: "地址定位",
      value1: "",
      input: "",
      dialogFormVisible: false, //设置价格弹框显示
      dialogFormVisible1: false, //供应商弹框显示
      dialogFormVisible2: false, //用气客户弹框显示
      dialogFormVisible3: false, //管输方弹框显示
      activeName: "first", //供应商tab
      listSupplierList: [],
      getChangedSupplier: [], //已选择的供应商
      getArr: [], //已获取供应商编码
      getEntysList: [], //获取供应商客户等信息
      isChecked: true,
      gasReportDate: [], //日报表日期
      planForm: {
        date: "",
        changeOptions: "",
      },
      reportTypeM: "",
      changeOptions: [],
      repotTypeOptions: [
        {
          value: "01",
          label: "费用",
        },
        {
          value: "03",
          label: "气量",
        },
      ],
      options: [],
      startTime: "",
      gasReportStart: "",
      gasReportEnd: "",
      radio: false,
      activedIndex: "1",
      tagsConfig: [],
      flag: true,
      comOptions: "",
      gasPriceRportchange: "", //获取日报表查询选择的供应商
      PminDate: null,
      PmaxDate: null,
      day31: 31 * 24 * 3600 * 1000,
      // 日期使用
      pickerOptions: {
        onPick: ({ minDate }) => {
          if (minDate && this.PminDate) {
            this.PminDate = null;
          } else if (minDate) {
            this.PminDate = minDate.getTime();
          }
        },
        disabledDate: (time) => {
          if (this.PminDate) {
            return (
              time.getTime() > this.PminDate + this.day31 ||
              time.getTime() < this.PminDate - this.day31
            );
          }
          return false;
        },
      },
      tipPriceData: [], //余额提醒数据
      getPriceReportData: "", //价格日报表数据
      getPriceReportDataCost: {
        dataList: [
        ],
        theadList: [
        ],
      },
      getPriceReportData1: [], //气量供应商报表
      getPriceReportData2: [], //气量用气客户报表
      getCostUserData:[],//
      getCostSupperData:[],
      visibleGasTable: "01",
      getRepotTypeOptions: "", //获取当前选择的报表类型
      reportTypeChannge: "",
      GasSupperDetailTableData:[],//供应商详情数据
      GasSupperDetailTableTitle:'',//供应商详情弹框title
      GasUserDetailTableData:[],//用气客户详情数据
      GasUserDetailTableTitle:'',//用气客户详情title
      GasSupperDetailKey:5,//供应商详情tablekey
      GasUserDetailKey:6,//用气客户详情tablekey
      listUserList:[],//用气客户数据
      listSupplierPip:[],//获取管输下拉数据
      dialogFormGasSupperDetail:false,//费用供应商弹框
      dialogFormGasUserDetail:false,
      getGasReportLifnrPipelineName:'',//根据供应商获取管输方的名字
      getCompName:'',
      spanArr: [],
      spanArr1: [],
      position: 0,
      exportDateRange: [],
      exportDate: 10000,
    };
  },
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom;
    },
    curComCodeName: function () {
      return this.$store.getters.curComName;
    },
  },
  watch: {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if (n && o) {
          this.getData();
          this.getPipData()
        }
      },
    },
  },
  created() {
    // 页面加载时，调用 getPipData 方法，判断管输方是否有下级数据，如无下级数据，则隐藏管输方项
    // this.getPipData()
    window.zhuge.track('气量调配-进入日气量报表页面',{'页面名称':'日气量报表页面'})
    this.getPlanList();
    this.listSupplier();
    this.planForm.date = Date.now();
    this.gasReportDate[0] = new Date().setMonth(new Date().getMonth() - 1)-24*60*60*1000;
    this.gasReportDate[1] = (new Date).getTime();
    this.comOptions = this.$store.getters["companyList"];
    // this.curComCode = this.$store.getters["curCom"];
    if (this.planForm.changeOptions) {
      this.geulistComps();
    }  
  },
  filters:{
        selectNameType(value){
            if(value=='01'){
              return '供应商'  
            }else if(value=='02'){
              return '用气企业' 
            }else if(value=='03'){
                return '管输方'
            }
        },
  },
  mounted() {
    this.getBrowerTime()
  },
  beforeDestroy() {
    // window.removeEventListener('resize');
    clearInterval(this.timer)
    window.zhuge.track('气量调配-日气量报表页面停留时长',{'日气量报表页面停留时长':this.browerTime})    
  },
  methods: {
    // 页面加载时，调用 getPipData 方法，判断管输方是否有下级数据，如无下级数据，则隐藏管输方项
    getPipData(){
      this.resetRepoortSelectCost()
      let data = {
            xaReig: this.$store.getters["curCom"],
        }
      api.dayGasD.gasPrepaidReportListSupplier(data).then((res) => {
        console.log('pip data:', res)
            if(!res || res.length === 0) {
              this.repoortSelectCost.pop()  // 从数组中移除最下方的管输方项
            }
      })
    },
    resetRepoortSelectCost() {
      this.repoortSelectCost = [
        {
          label: "供应商",
          value: "01",
        },
        {
          label: "用气企业",
          value: "02",
        },
        {
          label: "管输方",
          value: "03",
        },
      ]
    },
    getBrowerTime() {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    },    
    //   code转换
    codeChangeLabel(code,type){
        let data = []
        let getCode = ''
        let getLable = ''
       if(type=='01'){
           data =  this.listSupplierList 
           getCode = 'linfnr'
           getLable = 'linfnrTxt'
       }else if(type=='02'){
           data =  this.listUserList
           getCode = 'compCode'
           getLable = 'compCodeTxt'
       }else if(type=='03'){
           data =  this.listSupplierPip
           getCode = 'pipelineCode'
           getLable = 'pipelineCodeTxt'
       }
       if(data){
         data.forEach(item=>{
           if(item[getCode] == code){
               this.getCompName = item[getLable]
               return item[getLable]
           }
           
       })
       }
       
       
    },
    //   选择供应商 用气客户或者管输方
    changeSelect(val) {
      this.reportChangeSelect = val;
      this.codeChangeLabel(this.reportChangeOptions[0],this.reportChangeSelect)
      //   判断是气量（03）还是费用（01）
      this.selectOptionData()
    },
      // 获取日气量报表 选择的供应商
    handleChange1(val) {
      //   获取日报表查询选择的供应商
      this.codeChangeLabel(this.reportChangeOptions[0],this.reportChangeSelect)
      //   判断是气量（03）还是费用（01）
      if (this.reportTypeChannge[0] == "03") {
        // 01 供应商
        // 02 用气客户
        // 03 管输方
        if (this.reportChangeSelect == "01") {
          this.visibleGasTable = "01";
          this.getGasReportLifnrPipeline()
          this.getGasTableSuper()
        } else if (this.reportChangeSelect == "02") {
          this.visibleGasTable = "02";
          this.getReplayListComps()
          this.getGasTableUser()
        }
      } else {
        if (this.reportChangeSelect == "01") {
          this.visibleGasTable = "03";
          this.getCostSupper()
        } else if (this.reportChangeSelect == "02") {
          this.visibleGasTable = "04";
          this.getReplayListComps()
          this.getCostUser()
        } else if (this.reportChangeSelect == "03") {
          this.visibleGasTable = "05";
          this.getCostPipe()
          this.getGasPrepaidReportListSupplier()
        }
      }

    },
    // 初始化进入页面
    innitTable(){
         this.visibleGasTable = "01";
          this.reportChangeOptions[0] = this.listSupplierList[0].linfnr
          this.getGasTableSuper()
          this.codeChangeLabel(this.reportChangeOptions[0],this.reportChangeSelect)
    },  
    // 根据不同条件自动调用接口
    selectOptionData(val){
      // val代表是否需要重置选择第一项
       if (this.reportTypeChannge[0] == "03") {
        if (this.reportChangeSelect == "01") {
          this.visibleGasTable = "01";
          if(!val){
            this.reportChangeOptions = [this.listSupplierList[0].linfnr]
          }
          this.getGasReportLifnrPipeline()
          this.getGasTableSuper()
          this.codeChangeLabel(this.reportChangeOptions[0],this.reportChangeSelect)
        } else if (this.reportChangeSelect == "02") {
          this.visibleGasTable = "02";   
          this.getReplayListComps(true,val)
          // this.getGasTableUser()
          this.codeChangeLabel(this.reportChangeOptions[0],this.reportChangeSelect)
        }
      } else {
        if (this.reportChangeSelect == "01") {
          this.visibleGasTable = "03";
          if(!val){
            this.reportChangeOptions = [this.listSupplierList[0].linfnr]
          }
          this.getCostSupper()
          this.codeChangeLabel(this.reportChangeOptions[0],this.reportChangeSelect)
        } else if (this.reportChangeSelect == "02") {
          this.visibleGasTable = "04";
          this.getReplayListComps(true,val)
          // this.getCostUser()
          console.log("用气客户");
          this.codeChangeLabel(this.reportChangeOptions[0],this.reportChangeSelect)
        } else if (this.reportChangeSelect == "03") {
          this.visibleGasTable = "05";
          this.getGasPrepaidReportListSupplier(true,val)
          console.log("管输方");
        }
      }
    },
    // 选择时间
     ReportListdateChange(val) {
       this.selectOptionData('2')
    },
    // 选择报表类型
     changeRepotTypeOptions(getType) {
       // 切换类型时调用getPipData，确定是否显示管输方选项
       this.getPipData()
      // 01费用日报表
      // 03气量日报表
      this.reportTypeM = getType[0];
      this.getRepotTypeOptions = getType[0];
      this.selectOptionData('2')
      this.getExportDateRange({
        exportType: getType[0]
      })
    },
    getExportDateRange: function (params) {
      api.dayGasD.getExportDateRange(params).then(res => {
        if(res) {
          this.exportDateRange = res
          this.exportDate = 10000
        }
      })
    },
    // 根据选择 的供应商获取管输名字
    getGasReportLifnrPipeline(){
      this.getGasReportLifnrPipelineName = ''
        let data = {
            lifnr: this.reportChangeOptions[0] || '',
        }
       api.dayGasD.gasReportLifnrPipeline(data).then((res) => {
            this.getGasReportLifnrPipelineName = res?res[0].pipelineCodeTxt=='pipeline000'?'':res[0].pipelineCodeTxt:''
      });
    },
    // 获取用气客户列表数据
    getReplayListComps(status,Isdate){
      // Isdate  判断是否是日期切换触发的事件
      // this.reportChangeOptions=[]
        let data = {
            xaReig: this.$store.getters["curCom"],
        }
      api.dayGasD.replayListComps(data).then((res) => {
            this.listUserList = res?res[0]:[]
            // 判断是否需要默认设置选项，默认选择第一个
            if(this.listUserList.length){
               if(status &&!Isdate){
                  this.reportChangeOptions = [this.listUserList[0].compCode]
                }  
            }
            if(this.reportTypeChannge[0] == "03"){
              this.getGasTableUser()
            }else if(this.reportTypeChannge[0] == "01"){
               this.getCostUser()
            }
            this.codeChangeLabel(this.reportChangeOptions[0],this.reportChangeSelect)
      });
    },
    // 获取管输列表
    getGasPrepaidReportListSupplier(status,Isdate){
      // Isdate  判断是否是日期切换触发的事件
      let data = {
            xaReig: this.$store.getters["curCom"],
        }
      api.dayGasD.gasPrepaidReportListSupplier(data).then((res) => {
            this.listSupplierPip = res
            // 判断是否需要默认设置选项，默认选择第一个
            if(status && !Isdate){
               this.reportChangeOptions = [this.listSupplierPip[0].pipelineCode] 
            }
            this.getCostPipe()
            if(this.listSupplierPip){
               this.codeChangeLabel(this.reportChangeOptions[0],this.reportChangeSelect)  
            }
      });
    },
    
    // 获取气量供应商数据
    getGasTableSuper() {
          let data = {
            endTime: this.getCusYear1(this.gasReportDate[1]),
            startTime: this.getCusYear1(this.gasReportDate[0]),
            code:this.reportChangeOptions[0] || '',
        }
        api.dayGasD.gasReportLifnrList(data).then((res) => {
            this.getPriceReportData1 = res?res[0]:[]
            this.getPriceReportData1.forEach(item=>{
              if(item.currDate!='合计'){
                 item.currDate = this.getCusYear(item.currDate)   
              }
            })
      });
    },
    // 获取气量用气客户数据
    getGasTableUser() { 
      console.log(this.reportChangeOptions[0])
         let data = {
            endTime: this.getCusYear1(this.gasReportDate[1]),
            startTime: this.getCusYear1(this.gasReportDate[0]),
            code:this.reportChangeOptions[0] || '',
        }
        api.dayGasD.gasReportCompsList(data).then((res) => {
            this.getPriceReportData2 = res.length?res[0]:[]
            this.getPriceReportData2.forEach(item=>{
              if(item.time!='合计'){
                 item.time = this.getCusYear(item.time)   
              }
            })
            console.log(this.getPriceReportData2)
            this.rowspan1()
      });
    },
     rowspan1() {
      this.spanArr1 = []
      this.getPriceReportData2.forEach((item,index) => {
        if( index === 0){
          this.spanArr1.push(1);
          this.position = 0;
        }else{
          if(this.getPriceReportData2[index].time === this.getPriceReportData2[index-1].time ){
            this.spanArr1[this.position] += 1;
            this.spanArr1.push(0);
          }else{
            this.spanArr1.push(1);
            this.position = index;
          }
        }
      })
    },
    objectSpanMethod1({ row, column, rowIndex, columnIndex }) {  //表格合并行
      if (columnIndex === 0) {
        const _row = this.spanArr1[rowIndex];
        const _col = _row>0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if(columnIndex === 3){
        const _row = this.spanArr1[rowIndex];
        const _col = _row>0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 获取费用供应商报表数据
    getCostSupper(){
        let data = {
            endDate: this.getCusYear1(this.gasReportDate[1]),
            startDate: this.getCusYear1(this.gasReportDate[0]),
            supplierCode:this.reportChangeOptions[0]
        }
        api.dayGasD.gasPrepaidReportLinrsList(data).then((res) => {
            this.getCostSupperData = res
      });
    },
    // 获取费用用气客户报表数据
    getCostUser(){
        let data = {
            code:this.reportChangeOptions[0],
            endDate: this.getCusYear1(this.gasReportDate[1]),
            startDate: this.getCusYear1(this.gasReportDate[0]),
            supplierCode:''
        }
        api.dayGasD.gasPrepaidReportCompsList(data).then((res) => {
            this.getCostUserData = res
            console.log(res)
      });
    },
    // 获取费用管输方报表数据
    getCostPipe(){  
         let data = {
            pipelineCode:this.reportChangeOptions[0],
            endDate: this.getCusYear1(this.gasReportDate[1]),
            startDate: this.getCusYear1(this.gasReportDate[0]),
            supplierCode:''
        }
        api.dayGasD.gasPrepaidReportPipelineList(data).then((res) => {
            this.getPriceReportDataCost.dataList = res[0].dataList
            this.getPriceReportDataCost.dataList.forEach(item=>{
              if(item.time!='合计'){
                 item.time = this.getCusYear(item.time)   
              }
            })
            this.getPriceReportDataCost.theadList = res[0].theadList
      });

    },
    gasSupperEditA(val){
      if(val.currDate == '合计'){
         this.gasReportLifnrDetailTotal(val)
      }else{
         this.gasSupperEdit(val)
      }
    },
    // 气量供应商列表编辑
    gasSupperEdit(val) {
        this.GasSupperDetailKey++
        this.dialogFormGasSupperDetail = true
        this.GasSupperDetailTableTitle = ''
        let data = {
            code:this.reportChangeOptions[0],
            time:this.getCusYear1(val.currDate)
        }
         api.dayGasD.gasReportLifnrListDetail(data).then((res) => {
            this.GasSupperDetailTableData = res.length?res[0]:[]
            let aasd = res[0]
            this.GasSupperDetailTableTitle = this.getCusYear(aasd[0].currDate) +'--'+this.getCompName
            console.log(this.GasSupperDetailTableTitle)
      });
    },
    // 供应商气量报表合计
    gasReportLifnrDetailTotal(){
      this.GasSupperDetailKey++
        this.dialogFormGasSupperDetail = true
        this.GasSupperDetailTableTitle = ''
        let data = {
            code:this.reportChangeOptions[0],
            endTime: this.getCusYear1(this.gasReportDate[1]),
            startTime: this.getCusYear1(this.gasReportDate[0]),
        }
         api.dayGasD.gasReportLifnrDetailTotal(data).then((res) => {
            this.GasSupperDetailTableData = res.length?res[0]:[]
            let aasd = res[0]
            this.GasSupperDetailTableTitle = '合计' +'--'+this.getCompName
            console.log(this.GasSupperDetailTableTitle)
      });
    },
    gasUserEditAll(val){
      if(val.time == '合计'){
        console.log('用气合计')
         this.gasReportCompsDetailTotal(val)
      }else{
        console.log('编辑用气')
         this.gasUserEdit(val)  
      }
    },
    // 用气公司气量报表合计
    gasReportCompsDetailTotal(val){
        this.GasUserDetailKey++
        this.GasUserDetailTableTitle =''
        this.dialogFormGasUserDetail = true
        let data = {
            code:this.reportChangeOptions[0],
            endTime: this.getCusYear1(this.gasReportDate[1]),
            startTime: this.getCusYear1(this.gasReportDate[0]),
        }
        console.log(val)
         api.dayGasD.gasReportCompsDetailTotal(data).then((res) => {
           console.log(res)
            this.GasUserDetailTableData = res.length?res[0]:[]
            this.rowspan()
            console.log(this.GasUserDetailTableData)
            this.GasUserDetailTableTitle = val.time
      });  
    },
    // 气量用气客户列表编辑
    gasUserEdit(val) {
        this.GasUserDetailKey++
        this.GasUserDetailTableTitle =''
        this.dialogFormGasUserDetail = true
        let data = {
            code:this.reportChangeOptions[0],
            time:this.getCusYear1(val.time)
        }
        console.log(val)
         api.dayGasD.gasReportCompsDetail(data).then((res) => {
           console.log(res)
            this.GasUserDetailTableData = res.length?res[0]:[]
            this.rowspan()
            console.log(this.GasUserDetailTableData)
            this.GasUserDetailTableTitle = val.time
      });
    },
    rowspan() {
      this.spanArr = []
      this.GasUserDetailTableData.forEach((item,index) => {
        if(index === 0){
          this.spanArr.push(1);
          this.position = 0;
        }else{
          if(this.GasUserDetailTableData[index].linfnrTxt === this.GasUserDetailTableData[index-1].linfnrTxt ){
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          }else{
            this.spanArr.push(1);
            this.position = index;
          }
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {  //表格合并行
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row>0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if(columnIndex === 3){
        const _row = this.spanArr[rowIndex];
        const _col = _row>0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    //  报表导出
    exportExcel1() {
      this.exportDialogVisible = true
      return false
    },
    exportExcel() {
      let params = {
        code: this.reportChangeOptions[0]
      }
      switch (this.exportDate) {
        case 10000:
          params.startDate = this.getFormatDate(this.gasReportDate[0])
          params.endDate = this.getFormatDate(this.gasReportDate[1])
          break
        case 10001:
          break
        default:
          params.startDate = this.exportDateRange[this.exportDate].startTime
          params.endDate = this.exportDateRange[this.exportDate].endTime
          break;
      }
      if(this.reportTypeChannge[0] === '01' && this.reportChangeSelect === '01') {
        params.exportDataType = '2'
      }
      if(this.reportTypeChannge[0] === '01' && this.reportChangeSelect === '02') {
        params.exportDataType = '1'
      }
      if(this.reportTypeChannge[0] === '01' && this.reportChangeSelect === '03') {
        params.exportDataType = '0'
      }
      if(this.reportTypeChannge[0] === '03' && this.reportChangeSelect === '01') {
        params.exportDataType = '5'
      }
      if(this.reportTypeChannge[0] === '03' && this.reportChangeSelect === '02') {
        params.exportDataType = '6'
      }
      api.dayGasD.exportBaobiao(params).then(res => {
        if(res) {
          this.download(res, "xls", 'export')
        }
      })
    },
    // 供应商气量报表导出(改)
    gasDayReport() {
      let data = {
        endTime: this.getCusYear1(this.gasReportDate[1]),
        startTime: this.getCusYear1(this.gasReportDate[0]),
        code: this.reportChangeOptions[0],
      };
      api.dayGasD.gasDayReport(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },

    // 新
    getData() {
      this.listSupplier();
      this.getPlanList();
      // this.tipPriceE();
    },
    getPlanList() {
      api.dayGasD.getEntys().then((res) => {
        if (res) {
          this.getEntysList = res;

          (this.getCompVosList =
            this.getEntysList.length > 0 ? this.getEntysList[0].companys : []), //A获取供应商数据
            (this.getSuppliersList =
              this.getEntysList.length > 0
                ? this.getEntysList[0].suppliers
                : []), //获取用气客户数据
            (this.getPipelinesList =
              this.getEntysList.length > 0
                ? this.getEntysList[0].pipelines
                : []); //获取管输方数据
        }
      });
    },
    tDateChange: function (date) {
      this.startTime = new Date(date).getTime() / 1000;
      this.endTime = this.startTime + 24 * 60 * 60;
      //   this.getData()
    },
    // 获取日气量计划 选择的供应商
    handleChange(e) {
      // 已选择供应商数据
      if (e.length != 0) {
        this.getChangedSupplier = this.getArrEqual(this.listSupplierList, e);
      }
      this.geulistComps();
    },
  
    // 获取已选供应商
    getArrEqual(arr1, arr2) {
      let newArr = [];
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].linfnr === arr2[0]) {
          newArr.push(arr1[i]);
        }
      }
      return newArr;
    },


    // 获取日气量计划供应商
    listSupplier() {
      let data = {
        xaReig: this.$store.getters["curCom"],
      };
      api.dayGasD.listSupplierReport(data).then((res) => {
        this.listSupplierList = res;
        // 初始化默认数据
        this.innitTable()
        let changeS = [];
        changeS.push(this.listSupplierList[0].linfnr);
        this.planForm.changeOptions = changeS;
        this.reportChangeOptions = changeS;
        this.reportChangeSelect = "01";
        this.gasPriceRportchange = changeS;
        this.getChangedSupplier = this.planForm.changeOptions;
        // 供应商默认选择第一个，报表类型默认设置气量报表
        this.geulistComps("01", changeS);
        this.gasReportList();
        this.reportTypeChannge = ["03"];
        this.getRepotTypeOptions = ["03"];
        this.getExportDateRange({
          exportType: this.getRepotTypeOptions[0]
        })
        this.reportTypeM = "03";
         this.codeChangeLabel(this.reportChangeOptions[0],this.reportChangeSelect)
         this.getGasReportLifnrPipeline()
      });
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
    // 获取燃气客户、供应商用气量
    geulistComps(val, item) {
      let filterCom;
      if (val == "01") {
        filterCom = item;
      } else {
        filterCom = this.getChangedSupplier.map((val) => {
          return val.linfnr;
        });
      }

      let data = {
        codes: filterCom,
        endTime: this.getCusYear(this.planForm.date),
        startTime: this.getCusYear(this.planForm.date),
      };
      if (filterCom.length > 0) {
        api.dayGasD.listComps(data).then((res) => {
          let getplanUserdata = [];
          let getData = res ? res[0].linfnr : [];
          let getChangedSupplierData = res[0].linfnr;
          getData.forEach((item) => {
            getplanUserdata = [...getplanUserdata, ...item.comp];
          });

          this.getChangedSupplier = getChangedSupplierData;
          this.planUserdata = getplanUserdata;
        });
      }
    },
    // 日气量报表
    gasReportList() {
      let data = {
        endTime: this.getCusYear1(this.gasReportDate[1]),
        startTime: this.getCusYear1(this.gasReportDate[0]),
        code: this.gasPriceRportchange[0], //供应商编码
      };
      api.dayGasD.gasReportList(data).then((res) => {
        this.getPriceReportData = res ? res[0] : [];
        this.getPriceReportData.dataList.forEach((item) => {
          if (item.date == "合计") {
            return;
          } else {
            item.date = item.date ? this.getCusYear(item.date) : "";
          }
        });
      });
    },
    tipPriceE() {
      let data = {
        time: this.getCusYear1(this.planForm.date),
      };
      api.dayGasD.tipPriceE(data).then((res) => {
        this.tipPriceData = res ? res : [];
      });
    },
  },
};
</script>
<style lang='scss'>
.day-gas-report-container {
  background-size: 100% 450px;
  .supplier-list {
    .el-form-item {
      position: relative;
      .el-input__inner {
        border: none;
        border-radius: 5px 18px 18px 5px;
        padding: 0 20px;
      }
    }
    .el-form-item__label {
      width: 180px;
      position: absolute;
      left: 15px;
      z-index: 12;
    }
  }
  .el-date-editor .el-range-separator {
    width: 0%;
  }
  .date-picker-change {
    .el-input__inner {
      width: 90% !important;
    }
  }
  .price-custom {
    .el-input__inner {
      width: 90% !important;
    }
    .custom-unit {
      position: absolute;
      top: 0;
      right: 105px;
      color: #74788d;
    }
  }
  .date-picker .el-range-separator {
    color: #443939;
  }
  .date-picker .el-range-input {
    width: 100px;
  }
  .submitBtn-day {
    background: #e5f6f6;
    border-radius: 20px;
    border: none;
    color: #0fb2ab;
  }
  .el-table--border,
  .el-table--group {
    border: none;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background: none;
  }
    .report-change-select .el-input__inner{
        color: #606266;
    }
    .report-change-select .el-input__suffix{
        border-left: 0;
    }
    .report-change-select .el-select{
      width: 150px;
    }
    .report-change-select .select-right .el-input__inner{
      border-radius: 0 20px 20px 0;
    }
    .report-change-select .select-left .el-input__inner{
      border-radius: 20px 0 0 20px;

    }
    .dialog-gas-supper-detail .el-dialog__title{
       font-weight: 700;
       font-size: 24px;
    }
    .dialog-gas-supper-detail .el-dialog__headerbtn .el-dialog__close{
    font-weight: 700;
    font-size: 30px;
    }
    .dialog-gas-supper-detail .el-dialog{
       border-radius: 30px;
       padding-bottom: 30px;
    }
    .dialog-gas-supper-detail .el-dialog__body{
       padding: 30px;
    }
}
</style>
<style lang='scss' scoped>
.gas-report-table{
    .el-icon-view{
        color: #0FB2AB;
        margin-right: 5px;

    }
}
.day-gas-mask {
  height: 100%;
}
.day-gas-report-container {
   height: 90%;
  //  overflow: auto;
  /deep/.el-input__inner {
    border-radius: 18px;
    background: #567DB9;
    width: 100%;
    color: #FFFFFF;
    border:none;
    .el-range-separator{
    color: #ffffff;
     }
  }
  
  /deep/.el-date-editor .el-range-input{
      color:#ffffff ;
  }

  /deep/.el-dialog__header {
    padding: 20px 20px 10px;
    border-bottom: 1px solid #e5e5e5;
    line-height: 40px;
    font-size: 24px;
    .el-dialog__headerbtn {
      font-size: 23px;
    }
  }
  /deep/.el-tabs__content {
    .el-radio-group {
      width: 100%;
      display: flex !important;
      // margin-left: 10px;
    }
    .el-radio {
      color: #606266;
      cursor: pointer;
      // margin: 0 15px;
      // border: 1px solid #0FB2AB;
      background: #f6f7fa;
      padding: 13px 30px;
      border-radius: 30px;
      width: 28%;
    }
    .is-checked.el-radio {
      color: #606266;
      cursor: pointer;
      // margin: 0 15px;
      border: 1px solid #0fb2ab;
      padding: 13px 30px;
      border-radius: 30px;
      background: #ffffff;
      .el-radio__input.is-checked .el-radio__inner {
        border-color: #0fb2ab;
        background: #0fb2ab;
      }
      .el-radio__input.is-checked + .el-radio__label {
        color: #0fb2ab;
      }
    }
  }

  .set-price {
    padding: 30px;
    .title {
      margin: 20px;
    }
    .list-com {
      display: flex;
      padding: 10px;
      flex-wrap: wrap;

      .supplier-input {
        width: 50%;
        .el-input__inner {
          padding: 0 25px;
          color: red;
          background: red !important;
        }
      }
    }
    .price-list {
      .list-itemC {
        border: 1px solid #0fb2ab;
      }
      .list-item {
        min-width: 32%;
        color: pink;
        border-radius: 100px;
        background: #f6f7fa;
        // border: 1px solid #0fb2ab;
        line-height: 44px;
        display: flex;
        justify-content: space-between;
        height: 44px;
        margin-right: 10px;
        margin-bottom: 20px;
        .el-icon-error {
          color: #4f4c4c;
        }
        .uncheced {
          margin: -2px 22px;
        }
        /* border: 1px solid; */
        // box-shadow: 0px 10px 20px rgb(38 51 88 /W 7%);
        &:hover {
          opacity: 1;
          background: #ffffff;
          .set-btn {
            opacity: 1;
          }
        }

        i {
          padding: 0 20px;
          color: #0fb2ab;
        }
        label {
          color: #ccc;
          // background: #EDEEF4;
          // padding: 10px 15px;
          // border-radius: 19px;
        }
        .set-btn {
          opacity: 0;
          padding: 0 13px;
          line-height: 24px;
          height: 24px;
          vertical-align: middle;
          display: inline-block;
          /* margin-top: 4px; */
          color: #0fb2ab;
          margin-right: 10px;
          background: #ffffff;
          border: 1px solid #0fb2ab40;
          // opacity: 0.3;
          border-radius: 16px;
          align-self: center;
        }
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
          vertical-align: middle;
          margin-bottom: 10px;
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
      .addprice-btn {
        width: 119px;
        background: #0fb2ab;
        color: #ffffff;
        padding: 11px 20px;
        border-radius: 30px;
        margin-top: 20px;
        text-align: center;
      }
      .custom-tab {
        .custom-label {
          position: absolute;
          top: 0;
          left: 12px;
          color: #74788d;
        }
        .custom-unit {
          position: absolute;
          top: 0;
          right: 18px;
          color: #74788d;
        }
        .price-custom {
          .custom-unit {
            position: absolute;
            top: 0;
            right: 105px;
            color: #74788d;
          }
        }

        .step-input {
          /deep/.el-input {
            .el-input__inner {
              padding: 0 43px;
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
            width: 88px !important;
            left: -13px;
          }
          #tab-first {
            border-right: 1px solid #e4e4e4;
            padding-left: 16px;
          }
        }
      }
      .del-step {
        padding: 3px 8px;
        vertical-align: top;
        display: inline-block;
        /* line-height: 36px; */
        border-radius: 20px;
        border: 1px solid;
        margin-top: 8px;
        margin-left: 10px;
      }
      .tab-content {
        padding: 20px 0px;
        .addprice-btn {
          width: 119px;
          background: #0fb2ab;
          color: #ffffff;
          padding: 11px 20px;
          border-radius: 30px;
          margin-left: 32px;
        }
        .content-item {
          padding: 40px 2px;
        }
        .del-price-btn {
          background: #0fb2ab;
          text-align: center;
          width: 12%;
          border-radius: 20px;
          padding: 10px;
          color: #ffffff;
          margin: 29px 35px;
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
                opacity: 1;
                position: absolute;
                top: 7px;
                left: 21px;
                width: 64px;
                height: 28px;
                line-height: 28px;
                /* padding: 0 10px; */
                background: #e5f6f6;
                border-radius: 9px;
                color: #0fb2ab;
                text-align: center;
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
  .top-bag {
    // background: linear-gradient(180deg, #2146a1 0%, #d7dbe10a 100%);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding-bottom: 3px;
    .top-header {
      padding: 1px;
    }
    .top-title {
      padding-top: 20px;
      .top-con {
        // width: 80%;
        background: linear-gradient(180deg, #3497d4 10%, #33c8ff9e 30%);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding-bottom: 3px;
        border-radius: 10px;
        padding: 23px;
        margin: 30px;
        margin-bottom: 0;
        .title {
          line-height: 35px;
          font-weight: 500;
          color: #ffffff;
          font-size: 24px;
          letter-spacing: 2px;
        }
        .plan-search-label {
          color: #ffffff;
          margin-right: 12px;
        }
        .gas-content {
          border-radius: 6px;
          background: #ffffff;
          padding: 30px 10px;
          margin: 0 auto;
          margin-top: 16px;
          position: relative;
          .plan-list-title {
            margin-left: 30px;
            font-size: 16px;
            font-weight: 700;
          }
          .list-com {
            display: flex;
            padding: 10px;
            flex-wrap: wrap;
            &.user-list {
              .custom-tooltip {
                position: relative;
                display: inline-block;
                color: #0fb2ab;
                position: absolute;
                right: 134px;
                .tooltip {
                  opacity: 1;
                  position: absolute;
                  top: 7px;
                  left: 21px;
                  width: 64px;
                  height: 28px;
                  line-height: 28px;
                  background: #e5f6f6;
                  border-radius: 9px;
                  color: #0fb2ab;
                  text-align: center;
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
            .list-item {
              // flex: 1;
              width: 30%;
              margin-right: 20px;

              /deep/ label {
                background: #edeef4;
                background: #edeef4;
                border-radius: 100px;
                text-align: center;
              }
              .supplier-input {
                width: 50%;
                position: relative;
                .el-input__inner {
                  padding: 0 25px;
                  color: red;
                  background: red !important;
                }
              }
              .custom-unit {
                position: absolute;
                top: 0;
                right: 18px;
                color: #74788d;
              }
            }
          }
          .price-tag {
            position: absolute;
            top: -25px;
            right: 10px;
            .setPrice {
              background: #0fb2ab;
              border-radius: 100px;
              color: #ffffff;
              padding: 13px 37px;
            }

            .tip-balance {
              display: inline-block;
              position: relative;
              // width: 50px;
              // height: 50px;
              border-radius: 100%;
              // background: red;
              line-height: 50px;
              text-align: center;
              color: #fff;
              margin-left: 15px;
              z-index: 999;
              img {
                vertical-align: middle;
                width: 60px;
                height: 60px;
              }
              .tip-number {
                position: absolute;
                top: 0px;
                right: 0px;
                width: 17px;
                height: 17px;
                background: #d51313;
                border-radius: 50px;
                line-height: 19px;
                font-size: 14px;
                border: 3px solid blue;
              }

              .tip-content {
                width: 0;
                // opacity: 0;
                display: none;

                .solid-core {
                  width: 0;
                  height: 0;
                  border: 10px solid transparent;
                  border-bottom-color: red;
                  position: relative;
                  top: -22px;
                  left: 34%;
                }
                .hollow {
                  width: 0;
                  height: 0;
                  border: 10px solid transparent;
                  border-bottom-color: #fff1ea;
                  position: relative;
                  top: -40px;
                  left: 34%;
                  z-index: 2;
                }
                .tip-list {
                  padding: 18px 28px;
                  width: 380px;
                  position: absolute;
                  overflow: auto;
                  max-height: 520px;
                  border: 2px solid red;
                  border-radius: 8px;
                  background: #fff1ea;
                  top: 58%;
                  right: -9px;
                  color: #ff523c;
                  text-align: left;
                  line-height: 35px;
                  padding-left: 50px;
                  z-index: 1;
                  .tip-icon {
                    position: absolute;
                    left: 20px;
                    top: 25px;
                    // opacity: 0;
                  }
                  .tip-list-item {
                    line-height: 30px;
                    border-bottom: 1px solid #ff523c;
                    padding: 10px 0;
                    .supplier-title {
                      font-weight: 700;
                    }
                    .balance {
                      .balance-number {
                        font-weight: 700;
                      }
                    }
                  }
                  .tip-list-item:last-child {
                    border: none;
                  }
                }
              }
              .tip-content-show {
                opacity: 1;
                display: block;
                .tip-icon {
                  opacity: 1;
                }
              }
              .tip-balance-con {
                &:hover .tip-content {
                  opacity: 1;
                  .tip-icon {
                    opacity: 1;
                  }
                }
              }
            }
          }
          .planSubmit {
            margin: 0px 30px;
            margin-bottom: 10px;
            .el-button {
              border-radius: 20px;
            }
            .submitBtn {
              background: #0fb2ab;
              padding: 15px 60px;
            }
            .resetBtn {
              background: #ffffff;
              color: #999;
              padding: 15px 30px;
            }
          }
        }
      }
    }
  }
  .tabel-container {
      padding: 27px;
      background: #fff;
      margin:20px 30px;
      border-radius: 10px;
      height: 100%;  
      .table-gad{
        height: 75%;
        .gas-report-table{
          overflow: auto;
          height: calc(100% - 100px);
        }

      }
    .select-option-name{
        font-size: 18px;
        font-weight: 700;
        color: #263358;
        display: flex;
         justify-content: space-between;
         .icon-unit{
                display: inline-block;
                width: 20px;
                height: 20px;
                background: #0FB2AB;
                border-radius: 20px;
                line-height: 18px;
                .el-icon-connection{
                    color: #FFFFFF;
                    font-size: 12px;
                    margin-left:3px;
                    vertical-align: middle;
                }
         }
        .option-name{
            margin-right: 10px;
        }
    }
    .table-unit {
      margin: 10px;
      color: #74788d;
      font-size: 18px;
    }
  }
  .gas-search {
      background: none;
      padding: 20px 26px 10px;
      /deep/.el-select .el-input__inner{
        height: 40px;
        line-height: 40px;
      }
      .table-search {
      padding: 10px;
      .demonstration{
          color:#ffffff;
      }
      .derive-btn {
        text-align: right;
      }
      .day-table-date {
        /deep/ .el-range-editor {
          width: 81%;

          .el-range-input {
            background: none;
          }
        }
      }
      .title {
        line-height: 45px;
        font-weight: 700;
        font-size: 24px;
      }
    }
  }
}
// @import '~@/pages/purchaseAnalysis/style/index';
</style>
