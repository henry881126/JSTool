<template>
  <div class="purchases-deploy-new gas-page-bg">
      <div class="top-bag">
        <div class="top-header">
          <top-menu
            @t-date-change="tDateChange"
            :date-picker-show="false"
            title="智慧分销"
          ></top-menu>
          <div class="breadcrumb-con">
            <el-breadcrumb>
              <el-breadcrumb-item>首页</el-breadcrumb-item>
              <el-breadcrumb-item>资源统筹</el-breadcrumb-item>
              <el-breadcrumb-item>年度采购方案</el-breadcrumb-item>
              <el-breadcrumb-item>合同政策</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
    <div class="search-deploy">
      <div>
         <label>合同政策配置</label> 
        <el-date-picker
            v-model="searchYear"
            type="year"
            placeholder="选择年"
            @change="searchYearChange"
            >
        </el-date-picker>
      </div>
      <div v-if="lastYear">
           <el-button @click="supplierCopyUpYear" round type="primary">+ 延用上一年度合同政策</el-button>
      </div>
    </div>
    <div class="purchases-deploy-content">
        <div class="deploy-content-item deploy-content-item-first" @click="addDeploy">
          <div class="first-item-content" >
            <div class="add-deploy">+</div>
            <div >新增合同政策配置</div>
          </div>
        </div>
      <div
        class="deploy-content-item"
        v-for="(item, index) in supplierList"
        :key="'a' + index"
      > 
        <div class="deploy-content-item-title" @click="consoleSetD(index)">
          <div class="title">
            <el-switch
              v-model="item.status"
              active-color="#47A87D"
              inactive-color="#DFE7F2"
              @change="swetchChange(item)"
            >
            </el-switch>
              <span></span>
              {{ item.codeTxt }}</div>
          <div class="deploy-content-item-set" @click.stop="setData(item,index)">
              <i class="el-icon-more"></i>
              <div class="set-down" v-show="item.isShowSet">
                  <div @click="setBtn(item,index)">
                      <i class="el-icon-setting"> </i>
                      编辑</div>
                  <div @click="delSetBtn(item,index)">
                      <i class="el-icon-delete"></i>
                      删除</div>
                      
                      <div @click="detailBtn(item,index)">
                      <i class="el-icon-delete"></i>
                      查看</div>
              </div>
              </div>
        </div>
        <div class="deploy-content">
          <div class="content-list">
            <label for="">供应商编号：</label>
            <div class="item-content">{{ item.code }}</div>
          </div>
          <div class="content-list">
            <label for="">供应商名称：</label>
            <div class="item-content">{{ item.codeTxt }}</div>
          </div>
          <div class="content-list">
            <label for="">接气门站：</label>
            <div class="item-content">{{ item.downGasPlaceChange }}</div>
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
           <editPage3
            :setComponyArray="setComponyArray"
            v-if="!isSubmit"
            @editSubmitSuccess="editSubmitSuccess"
            @editSubmitFail="editSubmitFail"
            :activeName="activeName"
          ></editPage3>
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
    <el-dialog title="" :key="editAddTimer" :visible.sync="dialogFormVisibleNew">
      <div class="dialog-title">
        <div class="title-left">
          <span v-if="!isEdit" class="com-name">新增合同政策</span>
          <span v-else class="com-name">{{setComponyArray.codeTxt}}</span>
        </div>
      </div>
      <add-page
      :isEdit='isEdit'
      :searchYear='searchYear'
      :setComponyArray='setComponyArray'
      v-if="dialogFormVisibleNew"
      @addSubmitSuccess="addSubmitSuccess"
      @addSubmitFail='addSubmitFail'
      >
      </add-page>
      <div class="set-detail" v-if="!isSubmit">
        <div class="detail-title">
          <div class="title-left"></div>
        </div>
        <div class="detail-content loser-detail">
          <el-form ref="form1" :rules="rules" :model="form">
          </el-form>
        </div>
      </div>
   
    </el-dialog>
    <!-- 查看 -->
    <el-dialog title="" :visible.sync="dialogFormVisibleDetail" :key="detailKey">
      <div class="dialog-title detail-dialog-title">
        <div class="title-left detail-dialog">
            <el-switch
              v-model="detailList.status"
              active-color="#47A87D"
              inactive-color="#DFE7F2"
              disabled
            >
            </el-switch>
          <span class="com-name">{{detailList.codeTxt}}</span>
        </div>
      </div>
      <detail-page
      :detailList='detailList'
      >
      </detail-page>
      <div class="set-detail" v-if="!isSubmit">
        <div class="detail-title">
          <div class="title-left"></div>
        </div>
        <div class="detail-content loser-detail">
          <el-form ref="form1" :rules="rules" :model="form">
          </el-form>
        </div>
      </div>
    </el-dialog>
    <el-dialog
        title=""
        :visible.sync="successVisible"
        width="30%"
        class="submit-page"
        center>
        <div class="submitSuccess">
            <i v-if="!failSubmit" class="el-icon-success"></i>
            <i v-if="failSubmit" class="el-icon-error"></i>
          <div class="sub-tip">
              <span v-if="failSubmit">提交失败</span>
              <span v-if="!failSubmit">提交成功</span>
            </div>
          <div v-if="!failSubmit" class="submit-desc">
            您可以通过采购配置查看/配置您提交的供应商
          </div>
        <span v-if="failSubmit">
             <el-button class="consoleBtn" @click="finished">取消</el-button>
            <el-button  type="primary" @click="rewriteBtn">重新填写</el-button> 
        </span>
        <span v-if="!failSubmit" slot="footer" class="dialog-footer">
            <el-button :class="{ 'finishBtn':editStatus}" @click="finished">完成</el-button>
            <el-button v-if="!editStatus" type="primary" @click="finishUser">完成并启用</el-button>
        </span>
        </div> 
    </el-dialog>
    <!-- 删除弹框确认 -->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        class="del-dialog"
        >
        <div class="del-content">
            <i class="el-icon-warning"></i>
            <span class="dialog-con">确认要删除
                {{delData.codeTxt?delData.codeTxt:''}}的合同政策配置吗?</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogConsole">取消</el-button>
            <el-button type="primary" @click="dialogVisibleConfirm">确定</el-button>
        </span>
        </el-dialog>
  </div>
</template>
<script>
import topMenu from "../../components/topMenu/topMenu2";
import api from "/src/http/api";
import qiyuanApi from "/src/http/qiyuanApi";
import exportApi from "/src/components/export/export";
import mergeTableRow from "/src/components/mergeTableRow/reply";
import editPage from "./component/editNew";
import editPage3 from "./component/editNew3";
import addSetPage from "./component/stepcontent.vue"
import addPage from "./component/addPage.vue"
import detailPage from "./component/detailPage.vue"
export default {
  name: "reply",
  mixins: [exportApi, mergeTableRow],
  data: function () {
    return {
      checkIsShow:true,
      searchYear:'',
      browerTime:0,
      timer:null,
      dialogVisible:false,
      delIndex:'',
      editTimer: 5, //编辑弹框key
      editAddTimer:1,//编辑添加弹框key新
      detailKey:10,//详情
      isSubmitSuccess: "1", //提交成功
      isSubmit: false,
      switchBtn: "",
      activeName: "01",
      stepActive: 1,
      dialogFormVisible: false,
      dialogFormVisibleNew: false,
      dialogFormVisibleDetail:false,//查看弹框
      successVisible:false,//成功弹框
      startTime: 0,
      endTime: 0,
      pageSize: 15,
      total: 0,
      current: 1,
      dialogTableVisible: false,
      gasNoHeatingSeasonDate: [], //日报表日期
      gasHeatingSeasonDate: [], //获取采暖季时间
      iSShowStock: "", //存量用户展示
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
      detailList:'',//获取当前查看的供应商信息
      setComponyArray: "", //获取当前选择要编辑的供应商
      supplierList: [
      ],
      comOptions: "",
      editData: "",
      SubmitSuccessData: "", //提交成功返回数据
      downGasPlace:'',
      isShowSet:false,
      delData:'',//要删除的数据
      isEdit:false,//判断是否为编辑
      lastYear:false,
      editStatus:false,
      failSubmit:false,//提交失败
      optionsList:[],// 天然气下气点
      
      
    };
  },
  components: {
    topMenu,
    editPage,
    addSetPage,
    editPage3,
    addPage,
    detailPage
  },

  created() {
    window.zhuge.track('气源采购-进入采购配置页面',{'页面名称':'采购配置页面'})
    this.gasNoHeatingSeasonDate[0] = "2021-04-01";
    this.gasNoHeatingSeasonDate[1] = "2021-10-30";
    this.gasHeatingSeasonDate[0] = "2021-11-01";
    this.gasHeatingSeasonDate[1] = "2022-03-31";
    this.searchYear = new Date().getFullYear().toString();
    // this.searchYear = this.searchYear.toString();
    this.startTime = this.getFormatTime(Date.now());
    this.endTime = this.getFormatTime(Date.now() + 24 * 3600000);

    this.apiqiyuan()
    this.getList();
    // this.supplierGetCountSupplier()
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
    curComCodeName: function () {
      return this.$store.getters.curComName;
    },
    loginName: function () {
      return this.$store.getters.loginName;
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
    handleChange(){},
     supplierCopyUpYear(){
         this.supplierList = []
         let year = this.searchYear
          ? typeof this.searchYear == "string"
            ? this.searchYear
            : this.searchYear.getFullYear()
          : ""
      let data = {
            xaReig:this.curComCode,     
            year:year
        }
        api.purchasesDeploy.supplierCopyUpYear(data).then((res)=>{
            if(res){
              this.getList()
            }
        }) 
    },
    searchYearChange(val){
        this.getList()
    //    this.supplierGetCountSupplier()
        
    },
    supplierGetCountSupplier(){
        let year = this.searchYear
          ? typeof this.searchYear == "string"
            ? this.searchYear
            : this.searchYear.getFullYear()
          : ""
        let data = {
            xaReig:this.curComCode,
            year:year-1
        }
      api.purchasesDeploy.supplierGetCountSupplier(data).then((res) => {
        if (res) {
            if(this.supplierList.length<1){
               if(res[0]>0){
                  this.lastYear = true
                }else{
                  this.lastYear = false
                }
            }else{
                this.lastYear = false
            }
        }else{
        }
      });
    },
    successFinish() {
      this.dialogFormVisible = false;
      this.dialogFormVisibleNew = false;
    },
    editSubmitSuccess(val,data) {
      this.isSubmit = true;
      this.isSubmitSuccess = "1";
      this.successVisible = true
      this.editData = val;
    },
    addSubmitFail(val,status){
       this.failSubmit = true
    },
     addSubmitSuccess(val,status) {
       this.failSubmit = false
      this.successVisible = true
      if(status){
          this.editStatus = true
      }
      this.SubmitSuccessData = val
      // 跳转列表页
    //   setTimeout(() => {
    //           this.finished()
    //   }, 3000);
    },
    editSubmitFail(val) {
      this.isSubmit = true;
      this.isSubmitSuccess = "0";
      this.editData = val;
    },
    secondBtn() {
      this.stepActive = 2;
    },
    firstBtn() {
      this.stepActive = 1;
    },
    swetchChange(val){
         let data = {
            id: val.id,
            version: val.version,
            status:val.status?1:0,
      };
      api.purchasesDeploy.supplierUupdate(data).then((res) => {
        if (res) {
            this.getList()
        }else{
        }
      });
    },
      //  下气点
    apiqiyuan(){
        let data={
            managerCode:this.curComCode,
            codeLevel:this.curComInfo.orgLevel,
            stationName:''
        }
       qiyuanApi.demandDisplay.stationSelect(data).then((res)=>{
           if(res){
               this.optionsList = res.stationList
               this.getList()
           }
       })
    },
    getList() {
         let year = this.searchYear
          ? typeof this.searchYear == "string"
            ? this.searchYear
            : this.searchYear.getFullYear()
          : ""
      let data = {
        xaReig: this.curComCode,
        year: year
      };
      api.purchasesDeploy.supplierList(data).then((res) => {
        this.supplierList = res;
        if( this.supplierList.length<1){
             this.supplierGetCountSupplier()
        }else{
            this.lastYear = false
        }
        this.supplierList.forEach((item,index)=>{
            this.$set(item,'isShowSet',false)
          item.isShowSet = false
          item.status = item.status==1?true:false
          item.downGasPlace = item.downGasPlace?item.downGasPlace.split(','):''
          item.downGasPlaceChange = []
          if(item.downGasPlace){
             this.optionsList.forEach((item1) =>{
              item.downGasPlace.forEach(item2=>{
                if(item1.stationCode == item2){
                   item.downGasPlaceChange.push(item1.stationName)
                }  
              })
            }) 
            this.supplierList[index].downGasPlaceChange = item.downGasPlaceChange.length>0?item.downGasPlaceChange.join(','):''
         }  
        })
      }); 
    },
    finishUser() {
      let data = {
        id: this.SubmitSuccessData.id,
        version: this.SubmitSuccessData.version,
        status: 1,
      };
      api.purchasesDeploy.supplierUupdate(data).then((res) => {
        if (res) {
          this.successVisible = false
          this.getList();
          this.stepActive = 1;
          this.isSubmit = false;
          this.activeName = "01";
          this.dialogFormVisibleNew = false;
          this.dialogFormVisible = false;
        }
      });
    },
    rewriteBtn(){
     this.successVisible = false
    },
    finished() {
      this.stepActive = 1;
      this.isSubmit = false;
      this.successVisible = false
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
    addDeploy(){
     this.dialogFormVisibleNew = true
     this.editAddTimer++;
     this.isEdit = false
    },
    setBtn(val,index){
      this.setComponyArray = val;
      this.setComponyArray.status == 1 ? true : false;
      this.dialogFormVisibleNew = true;
      this.isEdit = true
      this.editAddTimer++;
      this.supplierList[index].isShowSet = false
    },
    // 删除列表
    delSetBtn(val,index){
        this.dialogVisible = true
        this.delData = val
        this.delIndex = index
        this.supplierList[index].isShowSet = false
      
    },
    detailBtn(val,index){
        this.detailList = val
        this.dialogFormVisibleDetail = true
        this.detailKey++
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
          this.getList() 
        }
      });
    },
    dialogVisibleConfirm(){
        this.supplierDelete(this.delData.id)
        this.dialogVisible = false
        this.supplierList[this.delIndex].isShowSet = false
        this.getData()
    },
    dialogConsole(){
        this.dialogVisible = false
        this.supplierList[this.delIndex].isShowSet = false
    }
  },
};
</script>
<style scoped lang="scss">
.purchases-deploy-new{
  
    min-width: auto;
     .el-input__suffix {
            border: none !important;
          }
          .el-select .el-input__inner{
            height: 40px;
            background: #F5F7FA;
          }
         
          .el-date-editor--daterange.el-input__inner{
            width: 100%;
        }
    }
</style>
<style scoped lang="scss">
.purchases-deploy-new{
    .el-dialog__wrapper{
        background-color: #162f60;
    }
  /deep/.el-dialog__body{
      padding-bottom: 0;
      padding: 0;
  }
  .top-bag {
    background-size: 100% 100%;
    background-repeat: no-repeat;
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
  .del-dialog{
      .del-content{
          padding:10px 20px;
      }
      /deep/.el-dialog__body{
      }
      .el-icon-warning{
          color: #f5a40ee3;
          font-size: 20px;
          vertical-align: middle;
          margin-right: 10px;
      }
      /deep/.el-dialog__footer{
        .el-button{
            border-radius: 30px; 
        }
        .el-button--primary{
            background-color: #47A87D;
        }
      }
      .dialog-con{
          text-align: center;
      }

  }
  .purchases-deploy-step2 {
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
      padding-bottom: 0;
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
      border-radius: 5px;
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
        width: 30%;
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
      padding-bottom: 0;
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
      border-radius: 5px;
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
    margin: 20px 0;
    margin-top: -22px;
    padding-bottom: 12px;
    border-bottom: 1px solid #99999959;
    .detail-dialog{
      margin-left: 20px;
    }
    .title-left {
      .com-name {
        margin-right: 20px;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 600;
        line-height: 33px;
        color: #303133;
        opacity: 1;
        vertical-align: middle;
        margin-left: 20px;
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
  .detail-dialog-title{
     margin-bottom: 0px;
  }
  .set-detail {
    margin: 0 auto;
    /deep/.el-steps{
      width:70%;
      margin: 0 auto;
    }
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
        text-align: center;
        padding-bottom: 40px;
        .finishBtn{
          background: #47A87D;
          border: none;
          color: #fff;
        }
        .el-icon-success{
            color: #32c30d;
            width: 100px;
            font-size: 44px;
            margin-bottom: 22px;
        }
        .el-icon-error{
            color: red;
            width: 100px;
            font-size: 44px;
            margin-bottom: 22px;
        }
      img {
        width: 300px;
        height: 172px;
      }
      .sub-tip{
         color: #303133;
         margin-bottom: 10px;
      }
      .submit-desc{
          margin-top: 20px;
          color: #606266;
      }
      .el-button{
          border-radius: 20px;
          margin-top: 20px;
      }
    }
    .submitFail {
      img {
        width: 300px;
        height: 172px;
      }
    }
  }
  .search-deploy{
        padding: 20px 22px;
        padding-top: 10px;
        display: flex;
        justify-content: space-between;
    label{
      color: #f5f7fa;
      margin-right: 20px;
    }
    /deep/.el-input__icon{
          line-height: 32px;
              height: 32px;
    }
    /deep/.el-input__inner{
            border-radius: 5px;
            line-height: 32px;
            height: 32px;
    }
  }
  
  .purchases-deploy-content {
    display: flex;
    padding: 1px 20px;
    flex-wrap: wrap;
    
    .deploy-content-item {
      width: 30%;
      min-height: 200px;
      border-radius: 16px;
      margin-right: 20px;
      margin-bottom: 20px;
      padding-top: 0;
      background-image: url('./assets/list-bg1.png');
      background-repeat:no-repeat;
      background-size: cover;
      padding-bottom: 0;
      box-shadow: 0px 1px 5px rgba(86, 125, 185, 0.1);
      border: 1px solid rgba(220, 223, 230, 1);
      background-color: rgba(255, 255, 255, 1);
      .deploy-content-item-title {
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
        padding: 0 30px;
        .deploy-content-item-set {
          border-radius: 10px;
          padding: 4px 2px;
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
          font-size: 16px;
          color: #303133;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .deploy-content {
        margin-top: 17px;
        padding: 0 30px;
        .content-list {
          display: flex;
          margin-bottom: 10px;
          font-size: 14px;
        //   height: 20px;
         line-height: 20px;
         
          label {
            font-weight: 500;
            color: #606266;
            font-family: PingFang SC;
            // width: 27%;
           
          }
          .item-content{
              color: #303133;
              font-weight: 600;
              width: 78%;
          }
          .start-using {
            color: #0fb2ab;
          }
        }
      }
    }
    .deploy-content-item-first {
      background: #ffffff;
      text-align: center;
      color: #47A87D;
      .first-item-content {
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        cursor: pointer;
        .add-deploy {
          font-size: 48px;
        }
      }
    }
  }
    @media screen and (min-width: 1640px) {
    .deploy-content-item {
        .deploy-content{
            label {
            width: 27%;
           
          }
        }
    } 
}
 @media screen and (max-width: 1640px) {
    .deploy-content-item {
        .deploy-content{
            label {
            width: 32%;
           
          }
        }
    }
  }
}
</style>