<template>
  <div class="day-gas-mask">
    <div class="extracting-ontents-container gas-page-bg">
      <div class="top-bag">
        <div class="top-header">
          <top-menu
            @t-date-change="tDateChange"
            :date-picker-show="false"
            title="提取量跟踪"
          ></top-menu>
        </div>
      </div>
      <div class="gas-search">
          <div class="table-search">
          <el-row :gutter="0">
            <el-col :lg="4" :xl="4" class="day-table-date">
              <div class="block">
                <el-date-picker
                    v-model="gasReportDate"
                    format="yyyy/MM/dd"
                    type="date"
                    :picker-options="pickerOptions"
                    @change="ReportListdateChange"
                    placeholder="选择日期时间"
                  >
                  </el-date-picker>
              </div>
            </el-col>
            <el-col :lg="7" :xl="7">
              <div class="block report-change-select">
                <el-select
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
                  :options="listSupplierList"
                  :props="{
                    value: 'code',
                    label: 'name',
                    children: '',
                  }"
                  v-model="reportChangeOptions"
                  @change="handleChange1"
                  clearable
                ></el-cascader>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="tabel-container">
        <div class="select-option-name">
            <div class="unit">
                <span >单位：万方</span>
            </div>
            <div class="block derive-btn">
                <el-button
                  round 
                  plain
                  type="success"
                  class="submitBtn-day custom-button"
                  @click="gasProgressListByTimeExport"
                  icon="el-icon-upload2 icon-btn"
                  >
                  <!-- <i class="el-icon-upload2 icon-btn"></i> -->
                  导出</el-button
                >
              </div>  
        </div>
        <!-- 供应商报表 -->
        <div class="table-gad">
          <el-table
          stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          :data="extractionQuantityList"
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          class="custom-table-r gas-report-table"
          height="80%"
          @sort-change="changeSort"
        >
        <el-table-column prop="cycleTime" label="提取周期" align="center">
          </el-table-column>
          <template v-if="visibleGasTable === '01'">
            <el-table-column  prop="name" label="供应商名称" width="180" align="center">
            </el-table-column>
          </template>
          <template v-if="visibleGasTable != '01'">
             <el-table-column  prop="name" label="用气企业" width="180" align="center">
             </el-table-column>
           </template>       
          <el-table-column prop="totalSpecifiedNum" label="日指定量" align="center">
          </el-table-column>
          <el-table-column prop="totalPlanNum" label="交割量" align="center">
          </el-table-column>
          <el-table-column prop="totalContractNum" label="合同量" align="center">  
          </el-table-column>
          <el-table-column prop="remainingContractDayAverage" label="剩余日均" align="center">
          </el-table-column>
          <el-table-column class="minNumc" sortable="custom" prop="minNum" label="最小日提" >
          <template slot-scope="scope">
             <span class="minnum">{{scope.row.minNum}}</span>
          </template>
          </el-table-column> 
          <el-table-column  prop="timeProgress" label="时间进度" min-width="140" align="center">
            <template slot-scope="scope">
                <el-progress  :percentage="parseFloat(scope.row.timeProgress)" :stroke-width="12"></el-progress>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="numProgress" label="提取进度" min-width="140" align="center">
           <template slot-scope="scope">
             <el-progress  :percentage="parseFloat(scope.row.numProgress)>100?100:parseFloat(scope.row.numProgress)" :format="_format(parseFloat(scope.row.numProgress))" :stroke-width="12"></el-progress> 
            </template>
          </el-table-column>    
          <el-table-column prop="rC" label="操作" align="center" width="170px">
            <template slot-scope="scope">
                <div class="operate-btn">
                   <span class="gas-report-edit-btn" @click="gasSupperEditA(scope.row)"  >当前明细</span>
                   <span >|</span>
                   <span @click="historicRecords(scope.row)">历史记录</span>
                </div>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </div>
      <!-- 供应商历史记录 -->
       <el-dialog
        :title="this.getHistorycomName+'提取量历史记录'"
        :visible.sync="historicRecordsDialog"
        :key="GasUserDetailKey+'l112'"
        class="dialog-gas-supper-detail history-delog"
      >
      <div class="detail-gas-table">
          <div class="derive">
              <span>单位：万方</span>
              <div class="derive-btn">
                  <el-button 
                  type="success"
                  class="submitBtn-day custom-button"
                  plain
                  @click="gasProgressListCycleHistoryExport"
                  icon="el-icon-upload2 icon-btn"
                  >
                  <!-- <i class="el-icon-upload2 icon-btn"></i> -->
                  导出</el-button
                >
              </div>
          </div>
         <el-table
          stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          :data="historyDetailTableData"
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          class="custom-table-r "
        >
          <el-table-column prop="time" label="提取量跟踪周期" width="130px"  align="center">
            <template slot-scope="scope">
              <div>
                  <span style="width:100px">{{scope.row.time1}}~</span>
              </div>
              <div>
                 <span style="width:100px">{{scope.row.time2}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalSpecifiedNum" label="日指定量" align="center">
          </el-table-column>
          <el-table-column prop="totalPlanNum" label="交割量" align="center">
          </el-table-column>
          <el-table-column prop="totalContractNum" label="合同量" align="center">
          </el-table-column>
          <el-table-column prop="remainingContractDayAverage" label="剩余日均" align="center">
          </el-table-column>
          <el-table-column prop="minNum" label="最小日提" align="center">
          </el-table-column>
          <el-table-column prop="timeProgress" label="时间进度" min-width="140" align="center">
             <template slot-scope="scope">
                <el-progress :percentage="parseFloat(scope.row.timeProgress)" :stroke-width="12"></el-progress>
            </template>
          </el-table-column>
          <el-table-column prop="numProgress" label="提取进度" min-width="140" align="center">
            <template slot-scope="scope">
              
                <el-progress :percentage="parseFloat(scope.row.numProgress)>100?100:parseFloat(scope.row.numProgress)" :format="_format(parseFloat(scope.row.numProgress))" :stroke-width="12"></el-progress>
            </template>
          </el-table-column>
          <el-table-column  label="操作" align="center">
              <template slot-scope="scope">
                <span class="option-btn" @click="historyDetail(scope.row)">明细</span>
              </template>
          </el-table-column>  
        </el-table>
      </div>
      </el-dialog>
      <!-- 当前明细弹框 -->
      <el-dialog
        :title="this.geProgressListDetail.name+'提取量明细'"
        :visible.sync="gasProgressListDetailDialog"
        :key="GasUserDetailKey+'l5'"
        class="dialog-gas-supper-detail history-delog"
      >
      <div class="detail-gas-table">
        <div class="derive">
              <span>单位：万方</span>
              <div class="derive-btn">
                  <el-button
                  type="success"
                  class="submitBtn-day custom-button"
                  plain
                  @click="gasProgressListDetailExport"
                  ><i class="el-icon-upload2 icon-btn"></i>导出</el-button
                >
              </div>
          </div>
         <el-table
          stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          :data="gasProgressListDetailList"
          
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          class="custom-table-r"
        >
          <el-table-column prop="time" label="日期" width="180" align="center">
          </el-table-column>
          <el-table-column prop="specifiedNum" label="日指定量" align="center">
          </el-table-column>
          <el-table-column prop="planNum" label="交割量" align="center">
          </el-table-column>
           <el-table-column prop="contractNum" label="合同量" align="center">   
          </el-table-column>
          <el-table-column prop="remainingContractDayAverage" label="剩余日均" align="center">
          </el-table-column>
          <el-table-column prop="minNum" label="最小日提" align="center">
          </el-table-column>  
          <el-table-column prop="timeProgress" label="时间进度" min-width="120" align="center">
             <template slot-scope="scope">
                <el-progress :percentage="parseFloat(scope.row.timeProgress)" :stroke-width="12"></el-progress>
            </template>
          </el-table-column>
          <el-table-column prop="numProgress" label="提取进度" min-width="120" align="center">
             <template slot-scope="scope">
                <el-progress :percentage="parseFloat(scope.row.numProgress)>100?100:parseFloat(scope.row.numProgress)" :format="_format(parseFloat(scope.row.numProgress))" :stroke-width="12"></el-progress>
            </template>
          </el-table-column>
        </el-table>
      </div>
      </el-dialog>
      <!-- 历史记录明细弹框 -->
      <el-dialog
        :title="this.getHistorycomName+'提取量明细'"
        :visible.sync="historicRecordsDetailDialog"
        :key="GasUserDetailKey+'l89'"
        class="dialog-gas-supper-detail history-delog"
      >
      <div class="detail-gas-table">
        <div class="derive">
              <span>单位：万方</span>
              <div class="derive-btn">
                  <el-button
                  type="success"
                  class="submitBtn-day custom-button"
                  plain
                  @click="gasProgressListCycleHistoryDetailExportF"
                  icon="el-icon-upload2 icon-btn"
                  >
                  <!-- <i class="el-icon-upload2 icon-btn"></i> -->
                  导出</el-button
                >
              </div>
          </div>
         <el-table
          stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          :data="gasProgressListCycleHistoryDetail" 
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          class="custom-table-r"
        >
          <el-table-column prop="time" label="日期" width="180" align="center">
          </el-table-column>
          <el-table-column prop="specifiedNum" label="日指定量" align="center">
          </el-table-column>
          <el-table-column prop="planNum" label="交割量" align="center">
          </el-table-column>
          <el-table-column prop="contractNum" label="合同量" align="center">  
          </el-table-column>
          <el-table-column prop="remainingContractDayAverage" label="剩余日均" align="center">
          </el-table-column>
          <el-table-column  prop="minNum" label="最小日提" align="center">
          </el-table-column>
          <el-table-column prop="timeProgress" label="时间进度" min-width="140" align="center">
            <template slot-scope="scope">
                <el-progress :percentage="parseFloat(scope.row.timeProgress)" :stroke-width="12"></el-progress>
            </template>
          </el-table-column>
          <el-table-column prop="numProgress" label="提取进度" min-width="140" align="center">
            <template slot-scope="scope">
                <el-progress :percentage="parseFloat(scope.row.numProgress)>100?100:parseFloat(scope.row.numProgress)" :format="_format(parseFloat(scope.row.numProgress))" :stroke-width="12"></el-progress>
            </template>
          </el-table-column>        
        </el-table>
      </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import api from "/src/http/api";
import topMenu from "../../components/topMenu/topMenu";
import exportApi from "/src/components/export/export";
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'

export default {
  name: "PurchaseAnalysiss",
  mixins: [exportApi, buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
  components: {
    topMenu,
  },
  props: {},
  data() {
    return {
      reportChangeSelect: "", //下拉选择
      repoortSelectGas: [
        {
          label: "供应商",
          value: "01",
        },
        {
          label: "用气企业",
          value: "02",
        },
      ],
      reportChangeOptions: [],
      input: "",
      listSupplierList: [],
      gasReportDate: [], //日报表日期
      planForm: {
        date: "",
        changeOptions: "",
      },
      changeOptions: [],
      options: [],
      startTime: "",
      radio: false,
      comOptions: "",
      PminDate: null,
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
      visibleGasTable: "02",
      GasUserDetailKey:6,//用气客户详情tablekey
      historicRecordsDialog:false,//历史记录弹框
      historicRecordsDetailDialog:false,//历史记录明细
      historyDetailTableData:[],
      getCompName:'',
      position: 0,
      extractionQuantityList:[],//提取量列表数据
      getHistorycomCode:'',//获取当前点击的供应商或者用气客户编码
      getHistorycomName:'',//获取当前点击的供应商或者用气客户名称
      gasProgressListCycleHistoryDetail:[],//历史记录详情数据
      getHistoryDetailTime:'',
      gasProgressListDetailList:'',//当前明细数据
      gasProgressListDetailDialog:false,//当前明细弹框
      geProgressListDetail:'',//获取当前点击明细数据
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
        }
      },
    },
  },
  created() {
    this.gasProgressListComps(1),//获取供应商，用气公司列表0：供应商 1：用气公司
    this.planForm.date = Date.now();
    this.gasReportDate = Date.now();
    this.comOptions = this.$store.getters["companyList"]; 
  },
  mounted(){
     this.gasProgressListComps(1),
      this.reportChangeSelect = "02";
      this.codeChangeLabel(this.reportChangeOptions[0],this.reportChangeSelect)
  },
  methods: {
    _format(value) {
    return () => {
      return value + '%'
    }
},
     getData() {
      this.gasProgressListComps(1)
    },
    // 获取供应商，用气公司type=0（供应商）type=1（用气公司）
    gasProgressListComps(type,val){
      this.listSupplierList = []
         let data = {
            xaReig: this.$store.getters["curCom"],
            type:type
        }
        api.extractingContents.gasProgressListComps(data).then((res) => {
          this.listSupplierList = res
          let obj = {code:'',name:'全部'}
          this.listSupplierList.unshift(obj)
          // 初始化默认数据
        // this.innitTable()
        let changeS = [];
        changeS.push(this.listSupplierList[0].code);
        this.planForm.changeOptions = changeS;
        if(!val){
          this.reportChangeOptions = changeS;
        }
        this.gasProgressListByTime(type)   
        });
    },
    tableAbnormalSortChange: function ({ prop, order }) {
      switch (order) {
        case 'ascending':
          this.getAbnormalOfDay(prop, 'asc');
          break;
        case 'descending':
          this.getAbnormalOfDay(prop, 'desc');
          break;
        default:
          break;
      }
    },
    changeSort({ prop, order }){
      switch (order) {
        case 'ascending':
           if (this.reportChangeSelect == "01") {
             this.gasProgressListByTime( 0,prop, 'asc');
           }else{
              this.gasProgressListByTime(1,prop, 'asc');
           }
          break;
        case 'descending':
          if (this.reportChangeSelect == "01") {
             this.gasProgressListByTime(0,prop, 'desc');
           }else{
              this.gasProgressListByTime(1,prop, 'desc');
           }
          break;
        default:
          break;
      }
    },
    // 获取提取量列表
    gasProgressListByTime(type,prop,isdesc){
      let data = {
        code:this.reportChangeOptions[0] || '',
        sortingName:prop?prop:'',
        time: this.getCusYear1(this.gasReportDate),
        type:type,
        sort:isdesc
      }
      api.extractingContents.gasProgressListByTime(data).then((res) => {
         this.extractionQuantityList = res
        //  this.extractionQuantityList.forEach(item=>{
          //  item.numProgress = item.numProgress!=0?item.numProgress.slice(0,item.numProgress.length-1):item.numProgress
          //  item.timeProgress = item.timeProgress.slice(0,item.timeProgress.length-1)
          //  item.numProgress = item.numProgress.slice(0,item.numProgress.length-1)
        //  })            
        });
    },
    // 提取量列表导出
    gasProgressListByTimeExport(){
        let type = ''
        if(this.reportChangeSelect == "01"){
          type = 0
        }else if(this.reportChangeSelect == "02"){
          type = 1
        }
         let data = {
            code:this.reportChangeOptions[0],
            sortingName:this.getCusYear1(this.gasReportDate),
            time: this.getCusYear1(this.gasReportDate),
            type:type
      };
       api.extractingContents.gasProgressListByTimeExport(data).then((res) => {
        this.download(res, "xls", "提取量列表");
      });
    },
    // 根据不同条件自动调用接口
    selectOptionData(val){
      // val代表是否需要重置选择第一项
      if (this.reportChangeSelect == "01") {
          this.visibleGasTable = "01";
          this.gasProgressListComps(0,val)
          if(val){
            this.gasProgressListByTime(0)     
          }
        } else if (this.reportChangeSelect == "02") {
          this.visibleGasTable = "02";   
          if(val){
            this.gasProgressListByTime(1)     
          }
          // 获取用气企业列表
          this.gasProgressListComps(1,val)
          // this.getGasTableUser()
          this.codeChangeLabel(this.reportChangeOptions[0],this.reportChangeSelect)
        }
    },
       // 获取日气量报表 选择的供应商
    handleChange1() {
       // 01 供应商 02 用气客户
        if (this.reportChangeSelect == "01") {
          this.visibleGasTable = "01";
          this.gasProgressListByTime(0)
        } else if (this.reportChangeSelect == "02") {
          this.visibleGasTable = "02";
          this.gasProgressListByTime(1)
        }
    },
    // 提取量周期列表
    gasProgressListCycleHistory(val){
      let data = {
        code :val.code
      }
      api.extractingContents.gasProgressListCycleHistory(data).then((res) => {
         this.historyDetailTableData = res
         this.historyDetailTableData.forEach(item=>{
           item.time1 =  this.getCusYear(item.time?item.time.slice(0,10):'')
           item.time2 =  this.getCusYear(item.time?item.time.slice(11):'')
         })
        });
    },
    // 提取量周期列表导出
    gasProgressListCycleHistoryExport(){
        let data = {
            code:this.getHistorycomCode,
      };
       api.extractingContents.gasProgressListCycleHistoryExport(data).then((res) => {
        this.download(res, "xls", this.getHistorycomName+"提取量历史记录");
      });
    },
    // 提取量周期列表详细
    gasProgressListCycleHistoryDetailL(val){
       let data = {
            code:this.getHistorycomCode,
            startTime:this.getCusYear1(val.time1),   
            endTime:this.getCusYear1(val.time2)
      };
        api.extractingContents.gasProgressListCycleHistoryDetail(data).then((res) => {
          this.gasProgressListCycleHistoryDetail = res  
        });
    },
    gasProgressListCycleHistoryDetailExportF(){
       let data = {
            code:this.getHistorycomCode,
            startTime:this.getCusYear1(this.getHistoryDetailTime.time1),   
            endTime:this.getCusYear1(this.getHistoryDetailTime.time2)
      };
       api.extractingContents.gasProgressListCycleHistoryDetailExport(data).then((res) => {
        this.download(res, "xls", this.getHistorycomName+"提取量明细");
      });
    },
    // 提取量列表详细(当前明细)
    gasProgressListDetail(val){
       let data = {
            code:val.code,
            time: this.getCusYear1(this.gasReportDate),
      };
        api.extractingContents.gasProgressListDetail(data).then((res) => {
          this.gasProgressListDetailList = res 
        });
    },
    // 提取量列表详细(当前明细)导出
    gasProgressListDetailExport(){
      let data = {
            code:this.geProgressListDetail.code,
            time: this.getCusYear1(this.gasReportDate),
      };
       api.extractingContents.gasProgressListDetailExport(data).then((res) => {
        this.download(res, "xls", this.geProgressListDetail.name+"提取量明细");
      });
    },
     // 当前明细
    gasSupperEditA(val){
      // this.GasUserDetailTableTitle ++
      this.gasProgressListDetailDialog = true
      this.codeChangeLabel(val.code,this.reportChangeSelect)
      this.gasProgressListDetail(val)
      this.getdetailName = val.name
      this.geProgressListDetail = val
    },
    // 供应商历史记录弹框
    historicRecords(val){
        this.GasUserDetailKey++
        this.historicRecordsDialog = true
        this.gasProgressListCycleHistory(val)
        this.getHistorycomCode = val.code
        this.getHistorycomName = val.name
    },
    // 供应商历史记录明细
    historyDetail(val){
      this.historicRecordsDetailDialog = true
      this.gasProgressListCycleHistoryDetailL(val)
      this.getHistoryDetailTime =val
    },
    //   code转换
    codeChangeLabel(code){
        let data = this.listSupplierList
        let getCode = 'code'
        let getLable = 'name'
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
    // 初始化进入页面
    innitTable(){
         this.visibleGasTable = "01";
          this.reportChangeOptions[0] = this.listSupplierList[0].linfnr
          this.codeChangeLabel(this.reportChangeOptions[0],this.reportChangeSelect)
    },  
    // 选择时间
     ReportListdateChange() {
       this.selectOptionData('2')
    },
    tDateChange: function (date) {
      this.startTime = new Date(date).getTime() / 1000;
      this.endTime = this.startTime + 24 * 60 * 60;
        this.getData()
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
<style lang='scss'>
.extracting-ontents-container {
  background-size: 100% 450px;
  .el-progress{
    display: flex;
  }
  .el-progress-bar{
        padding-right: 78px;
    padding-left: 10px;
  }
  .el-progress__text{
    margin-left: -14px;
  }
  .el-dialog{
    width: 80%;
  }
  .el-progress-bar__inner{
        background-color: #0FB2AB;
  }
  .el-date-editor .el-range-separator {
    width: 0%;
  }
  .date-picker-change {
    .el-input__inner {
      width: 90% !important;
    }
  }
  .date-picker .el-range-separator {
    color: #443939;
  }
  .date-picker .el-range-input {
    width: 100px;
  }
  .submitBtn-day {
    // background: #e5f6f6;
    border-radius: 23px;
    border: none;
    color: #0fb2ab;
    width: 120px;
    height: 46px;
    font-size: 16px;
    .icon-btn{
      margin-right: 8px;
      font-size: 24px;
    }
    span{
      display: inline-block;
      height: 24px;
      margin-left: 5px;
      vertical-align: top;
      line-height: 24px;
    }
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
       color: rgba(44, 62, 80, 1);
       margin-left: 10px;
    }
    .dialog-gas-supper-detail .el-dialog__headerbtn .el-dialog__close{
       font-size: 24px;
       margin-right: 10px;
       line-height: 32px;
    }
    .dialog-gas-supper-detail .el-dialog{
       border-radius: 30px;
       padding-bottom: 30px;
    }
    .dialog-gas-supper-detail .el-dialog__body{
       padding: 30px;
       padding-top: 10px;
    }
}
</style>
<style lang='scss' scoped>
.history-delog{
    .derive{
        display: flex;
        justify-content: space-between;
        margin: 10px 20px;
        align-items: flex-end;
    }
    .option-btn{
        color: #46A0FC;
        cursor:pointer;
    }
}
.gas-report-table{
    .el-icon-view{
        color: #0FB2AB;
        margin-right: 5px;
    }
    .operate-btn{
        color: #46A0FC;
        cursor:pointer;
        span{
            margin: 6px;
        }
    }
    .minnum{
      margin-left: -27px;
    }
}
.day-gas-mask {
  height: 100%;
}
.extracting-ontents-container {
   height: 98%;
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
    }
    .el-radio {
      color: #606266;
      cursor: pointer;
      background: #f6f7fa;
      padding: 13px 30px;
      border-radius: 30px;
      width: 28%;
    }
    .is-checked.el-radio {
      color: #606266;
      cursor: pointer;
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
  .top-bag{
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding-bottom: 3px;
    .top-header {
      padding: 1px;
    }
  }
  .tabel-container {
      padding: 27px;
      background: #fff;
      margin:20px 30px;
      border-radius: 10px;
      height: 100%;  
      .table-gad{
        height: 80%;
        .gas-report-table{
          overflow: auto;
          height: calc(100% - 100px);
        }
      }
    .select-option-name{
          font-size: 18px;
          color: #263358;
          display: flex;
         justify-content: space-between;
         margin-bottom:16px;
         align-items: flex-end;
         .unit{
            font-size: 14px;
         }
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
  }
  .gas-search {
      background: none;
      padding: 20px 26px 10px;
      font-size: 16px;
      /deep/.el-select .el-input__inner{
        height: 40px;
        line-height: 40px;
        padding-left: 45px;
      }
      /deep/.el-input{
        font-size: 16px;
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
        /deep/.el-input__inner{
            padding-left: 45px;
            line-height: 45px;
          }
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
