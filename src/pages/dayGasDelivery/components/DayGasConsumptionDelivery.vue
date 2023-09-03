<template>
<div class="day-gas-mask">
  <div class="day-gas-container">
    <div class="top-bag">
      <div class="top-title">
        <div class="top-con">
          <el-form
            class="tab-content"
            :model="planForm"
            ref="planForm"
            status-icon
            :rules="rules"
            label-width="180px"
          >
            <el-row :gutter="0">
              <el-col :lg="8" :xl="5">
                <div class="block">
                  <span class="plan-search-label">日期</span>
                  <el-date-picker
                    v-model="planForm.date"
                    format="yyyy/MM/dd"
                    type="date"
                    :picker-options="pickerOptions0"
                    @change="changePlanForm"
                    placeholder="选择日期时间"
                  >
                  </el-date-picker>
                </div>
              </el-col>
              <el-col :lg="8" :xl="5">
                <div class="block">
                  <span class="plan-search-label">供应商</span>
                  <el-cascader
                    :options="listSupplierList"
                    :props="{
                      checkStrictly: true,
                      value: 'linfnr',
                      label: 'linfnrTxt',
                      children: '',
                    }"
                    v-model="planForm.changeOptions"
                    @change="handleChange"
                    collapse-tags
                    ref="cascaderAddr"
                    clearable
                  ></el-cascader>
                </div>
              </el-col>
            </el-row>
            <div class="gas-content">
              <div class="plan-list">
                <div class="plan-list-title">供应商：</div>
                <div class="list-com supplier-list">
                  <div
                    class="list-item"
                    v-for="(item, index) in getChangedSupplier"
                    :key="index+'l'"
                  >
                    <el-form-item :label="item.linfnrTxt">
                      <el-input
                        type="number"
                        maxlength=5
                        oninput="if(isNaN(value)) { value = parseFloat(value) }if(value>10000){value=value.slice(0,value.length-1)} if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                        v-model="item.gasNum"
                        placeholder="请输入日交割量"
                      ></el-input>
                      <span class="custom-unit">万方</span>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="plan-list">
                <div class="plan-list-title" v-if='planDataChange.length > 0'>用气客户：</div>
                <div class="list-com supplier-list user-list">
                  <div
                    class="list-item"
                    v-for="(item, index) in planDataChange"
                    :key="index+'m2'"
                  >
                  <div class="user-title">
                      <div style="oveflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{item.compCodeTxt}}</div>
                  </div>
                  <div class="user-con">
                    <div v-for="(item1,index1) in item.dataInfo" :key="index1+'m3'">
                     <el-form-item :label="item1.downGasPlace" label-width="170px">
                       <span class="insert-split">|</span>
                         <i class="el-icon-location"></i>
                      <el-input
                        type="number"
                        oninput="if(isNaN(value)) { value = parseFloat(value) }if(value>10000){value=value.slice(0,value.length-1)} if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                        v-model="item1.gasNum"
                        placeholder="请输入日交割量"
                        :disabled="item1.status == 1"
                      ></el-input>
                      <div class="custom-tooltip" v-show="item1.status == 1">
                        <div class="tooltip">
                          已确认
                          <div class="popper__arrow"></div>
                        </div>
                      </div>
                      <span class="custom-unit">万方</span>
                    </el-form-item>
                  </div> 
                  </div>
                  </div>
                </div>
              </div>
              <!-- 价格设置 -->
              <div class="price-tag">
                <el-button class="setPrice" @click="setPrice" v-trace="{title:'用气交割-点击价格设置'}">
                  <i class="el-icon-setting"></i> 价格设置</el-button
                >
                <div class="tip-balance">
                  <div class="tip-balance-con" @mouseenter="tipContentShowB" @mouseleave="tipContentHideB">
                      <img src="../assets/tip.png" alt="">
                  </div>
                  <div class="tip-number">{{ tipPriceData.length }}</div>
                  <div class="tip-content" @mouseenter="tipContentShowB" @mouseleave="tipContentHideB"  :class="{'tip-content-show':tipContentShow}" v-if="tipPriceData.length > 0">
                    <div class="solid-core"></div>
                    <div class="hollow"></div>
                    <div class="tip-list">
                      <div class="tip-icon"><i class="el-icon-warning-outline"></i></div>
                      <div
                        class="tip-list-item"
                        v-for="(item, index) in tipPriceData"
                        :key="index+'k1'"
                      >
                        <div class="supplier-title">
                          <span v-if="item.type=='0'">供应商：</span>
                          <span v-if="item.type=='1'">用气客户：</span>
                          {{ item.codeTxt }}
                        </div>
                        <div class="balance">
                          余额
                          <span class="balance-number">{{
                            item.balancePrice
                          }}</span>
                          万元，预计可用{{ item.scheduledTime }}天，请及时充值。
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="planSubmit">
                <el-button class="submitBtn" type="primary" @click="planCommit"
                  >提交</el-button
                >
                <el-button class="resetBtn" @click="resetBtn">重置</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <set-price :key="temper" v-show="dialogFormVisible" :dialogFormVisibles="dialogFormVisible" @initSupperList='closeSupper'></set-price>
  </div>
</div>
</template>
<script>
import api from "/src/http/api";
import {
  getCusYear,
  getCusYear1,
} from "../utils/common.js";
import setPrice from "./setPrice.vue"
import exportApi from "/src/components/export/export";
export default {
  name: "PurchaseAnalysiss",
  mixins: [exportApi],
  components: {
    setPrice
  },
  props: {},
  data() {
    return {
      temper:21,
      downloadplaces:{},
      dialogVisible:false,
      pipTipContentShow:'',//虚拟管输方提示
      reportChangeOptions:'',
      editTimer: 3, //编辑弹框key
      planUserdata: [], //日期量计划获取用户客户
      getCompVosList: [], //A获取供应商数据
      getSuppliersList: [], //获取用气客户数据
      getPipelinesList: [], //获取管输方数据
      tipcontent: "地址定位",
      input: "",
      dialogFormVisible: false, //设置价格弹框显示
      dialogFormVisible1: false, //供应商弹框显示
      dialogFormVisible2: false, //用气客户弹框显示
      dialogFormVisible3: false, //管输方弹框显示
      activeName: "first", //供应商tab
      activeNameUser: "first", //用气客户tab
      listSupplierList: [],
      getChangedSupplier: [], //已选择的供应商
      getArr: [], //已获取供应商编码
      getEntysList: [], //获取供应商客户等信息
      isChecked: true,
      planForm: {
        date: "",
        changeOptions: "",
      },
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "1",
        desc: "",
      },
      rules: {
        date1: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        name: [{ required: true, message: "请输入年龄", trigger: "blur" }],
      },
      changeOptions: [],
      tipContentShow:false,
      options: [],
      startTime: "",
      radio: false,
      comOptions: "",
     pickerOptions0: { 
         disabledDate(time) {
            return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的 
         }
    },
      tipPriceData: [], //余额提醒数据
      planDataChange:[],
    };
  },
  computed: {
    curComCode: function () {
        return this.$store.getters.curCom
      },
      curComCodeName: function () {
      return this.$store.getters.curComName
    }
  },
  watch: {
    curComCode: {
        immediate: true,
        handler: function (n, o) {
          if(n && o) {
            this.getData();
          }
        }
      }
  },
  created() {
    this.getPlanList();
    this.planForm.date = Date.now();
    this.comOptions = this.$store.getters["companyList"];
    if (this.planForm.changeOptions) {
      this.geulistComps();
    }
  },
  mounted() {
    this.listSupplier();
    this.tipPriceE()
  },
  methods: {
    closeSupper(){
      this.listSupplier();
    },
      pipTipContentShowB(val,index){
        this.getPipelinesList[index].pipTipContentShow=true
      },
      pipTipContentHideB(val,index){
          this.pipTipContentShow = false
          this.getPipelinesList[index].pipTipContentShow=false
      },
    getData(){
      this.listSupplier();
      this.getPlanList();
      this.tipPriceE()
      // this.dialogFormVisible = false
    },
    tipContentShowB(){
       this.tipContentShow = true
    },
    tipContentHideB(){
    this.tipContentShow = false
    },
    changePlanForm() {
      if (this.planForm.changeOptions) {
        this.listSupplier();
      }
    },
    getPlanList() {
      let params = {
        xaReigCode: this.$store.getters.curCom,
      }
      api.dayGasD.getEntys(params).then((res) => {
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
                : []) //获取管输方数据
                this.getPipelinesList.forEach(item=>{
                  this.$set(item,'pipTipContentShow',false)
                })
        }  
      });
    },
    tDateChange: function (date) {
      this.startTime = new Date(date).getTime() / 1000;
      this.endTime = this.startTime + 24 * 60 * 60;
    },
    // 获取日气量计划 选择的供应商
    handleChange(e) {
      // this.dialogFormVisible = false
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
    tipPriceE() {
      let data = {
        time: getCusYear1(this.planForm.date),
      };
      api.dayGasD.tipPriceE(data).then((res) => {
        console.log(res)
        this.tipPriceData = res?res:[];
      });
    },
    setPrice() {
      this.temper++
      this.dialogFormVisible = true;
      this.getPlanList();
    },
    // 获取日气量计划供应商
    listSupplier() {
      this.listSupplierList = []
      let data = {
        xaReig: this.$store.getters["curCom"],
        endTime: getCusYear1(this.planForm.date),
        startTime: getCusYear1(this.planForm.date),
      };
      api.dayGasD.listSupplier(data).then((res) => {
        this.listSupplierList = res;     
        let changeS = []
        changeS.push(this.listSupplierList[0]?this.listSupplierList[0].linfnr:'')      
        this.planForm.changeOptions = changeS
        this.reportChangeOptions = changeS  
        this.getChangedSupplier = this.planForm.changeOptions
         this.handleChange(changeS)
        // 供应商默认选择第一个，报表类型默认设置气量报表
        this.geulistComps('01',changeS)
      });
    },
    // 获取燃气客户、供应商用气量
    geulistComps(val,item) {
      let filterCom
      if(val=='01'){
        filterCom = item
      }else{
         filterCom = this.getChangedSupplier.map((val) => {
        return val.linfnr;
      });
      }
      let data = {
        codes: filterCom,
        endTime: getCusYear(this.planForm.date),
        startTime: getCusYear(this.planForm.date),
      };
        api.dayGasD.listComps(data).then((res) => {
          let getplanUserdata = [];
          let getData = res ? res[0].linfnr : [];
          let getChangedSupplierData = res[0].linfnr;
          getData.forEach((item) => {
            getplanUserdata = [...getplanUserdata, ...item.comp];
          });
          this.getChangedSupplier = getChangedSupplierData;
          this.planUserdata = getplanUserdata;
        let tempArr = [];
        let Data = [];
          for (let i = 0; i < this.planUserdata.length; i++) {
              if (tempArr.indexOf(this.planUserdata[i].code) === -1) {
              Data.push({
              compCodeTxt: this.planUserdata[i].codeTxt,
              code:this.planUserdata[i].code,
              dataInfo: [this.planUserdata[i]]
              });
              tempArr.push(this.planUserdata[i].code);
              } else {
                  for (let j = 0; j < Data.length; j++) {
                      if (Data[j].code == this.planUserdata[i].code) {
                      Data[j].dataInfo.push(this.planUserdata[i]);
                      break;
                      }
                  }
              }
          }
          this.planDataChange = Data
        }).catch(() => {
          this.planDataChange = []
        });
    },
    // 提交用气量
    planCommit() {
      // 埋点事件
      const maidianEventName = `气量调配-用气交割-${this.getChangedSupplier[0].linfnrTxt}-点击提交`
      window.zhuge.track(maidianEventName)
      let Supplier = this.deepClone(this.getChangedSupplier);
      let SupplierLastArray = [];
      Supplier.forEach((item) => {
        let obj = {};
        obj.id = item.planId;
        obj.gasNum = item.gasNum;
        obj.code = item.linfnr;
        obj.codeTxt = item.linfnrTxt;
        obj.time = getCusYear1(this.planForm.date);
        obj.type = "0";
        SupplierLastArray.push(obj);
      });
      let userDatachange = [];
      this.planDataChange.forEach((item) => {
          item.dataInfo.forEach(item1=>{
              let obj = {};
                obj.id = item1.id;
                obj.gasNum = item1.gasNum;
                obj.code = item1.code;
                obj.codeTxt = item1.codeTxt;
                obj.status =  item1.status;
                obj.downGasPlace = item1.downGasPlace;
                obj.lifnr = item1.lifnr
                obj.time = getCusYear1(this.planForm.date);
                obj.type = "1";
                userDatachange.push(obj); 
          }) 
      });
      console.log('000009')
      let contentArr = [...userDatachange, ...SupplierLastArray];
      if (this.planUserdata.length < 1 && this.getChangedSupplier.length < 1) {
        console.log(2222333)
        return;
      } else if (this.getChangedSupplier.length < 1) {
        this.$message({
          message: "无供应商数据，提交失败",
          type: "error",
          duration: 1000,
        });
      }
      console.log('000011')
      // if (this.getChangedSupplier.length > 0 && this.planUserdata.length > 0) {
      if (this.getChangedSupplier.length > 0) {
      console.log('000012')
        api.dayGasD.savegasJournalPlan(contentArr).then((res) => {
          if (res) {
            this.$message({
              message: "提交成功",
              type: "success",
              duration: 1000,
            });
            this.geulistComps();
          }
        });
      }
    },
    // 重置日气量
    resetBtn() {
      this.getChangedSupplier.forEach((item) => {
        item.gasNum = "";
      });
      this.planUserdata.forEach((item) => {
        item.gasNum = "";
      });
    },
    deepClone(obj) {
      let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
      return objClone;
    },
  },
};
</script>
<style lang='scss'>
.day-gas-container {
    background-size: 100% 450px;
  .supplier-list{
    input[type=number]::-webkit-inner-spin-button,  
    input[type=number]::-webkit-outer-spin-button {  
        -webkit-appearance: none;  
        margin: 0;  
    }
    .el-form-item{
      position: relative;
      .el-input__inner{
        border: none;
        border-radius: 5px 18px 18px 5px;
        padding: 0 20px;
      }
    }
    .el-form-item__label{
    width: 181px;
    position: absolute;
    left: 15px;
    z-index: 12;
    }
  }
  .el-date-editor .el-range-separator{
    width: 0%;
  }
  .date-picker-change{
     .el-input__inner{
        width: 90%!important;
     }
  }
  .price-custom{
     .el-input__inner{
        width: 90%!important;
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
  .date-picker .el-range-input{
    width: 100px;
  }
}
</style>
<style lang='scss' scoped>
.day-gas-mask{
    height: 100%;
}
.day-gas-container {
  /deep/.el-input__inner {
    border-radius: 18px;
    background: #f6f7fa;
    width: 100%;
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

  .top-bag {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding-bottom: 3px;
    .top-header {
      padding: 1px;
    }
    .top-title {
      padding-top: 20px;
      .top-con {
        background: linear-gradient(
        180deg
        ,#3497D4 10%, #33c8ff9e 30%);
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
          img{
            vertical-align: middle;
          }
        }
        .plan-search-label{
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
          .plan-list-title{
            margin-left: 30px;
            font-size: 16px;
            font-weight: 700;
          }
          .list-com {
            display: flex;
            padding: 10px;
            flex-wrap: wrap;
            .list-item {
              width: 30%;
              margin-right: 20px;

              /deep/ label {
                background: #edeef4;
                background: #edeef4;
                border-radius: 100px;
                text-align: center;
              }
              .custom-unit {
                position: absolute;
                top: 0;
                right: 18px;
                color: #74788d;
              }
            }
            &.user-list {
                padding:12px 28px;
                .list-item{
                   /deep/label{
                     background: #f6f7fa;
                     margin-top: 2px;
                      height: 40px;
                      border-radius: 100px 0 0 100px;
                   }
                } 
                .user-title{
                    line-height: 25px;
                    height: 25px;
                    border-radius: 30px;
                    padding: 8px 20px;
                    background: #EDEEF4;
                }
                .user-con{
                    width: 80%;
                    /deep/.el-form-item__content{
                      line-height: 42px;
                    }
                }
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
              .list-item{
                  display: flex;
                  width: 42%;
                  .insert-split{
                      position: absolute;
                      top: 0;
                      left: -7px;
                      color: #D2D2DC;
                      width: 5px;
                      height: 20px;
                      display: inline-block;
                      z-index: 29;
                  }
                  .el-icon-location{
                        position: absolute;
                        top: 14px;
                        left: -144px;
                        color: #0FB2AB; 
                        width: 10px;
                        height: 10px;
                        z-index: 25;
                        font-size: 18px;
                  }
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
              border-radius: 100%;
              line-height: 50px;
              text-align: center;
              color: #fff;
              margin-left: 15px;
              z-index: 999;
              img{
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
              .tip-content-show{
                 opacity: 1;
                 display: block;
                .tip-icon {
                  opacity: 1;

                }
              }
              .tip-balance-con{
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
}
// @import '~@/pages/purchaseAnalysis/style/index';
</style>
