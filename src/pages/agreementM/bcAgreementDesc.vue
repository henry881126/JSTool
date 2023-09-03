<template>
  <div class="add-agreement">
    <div class="add-agreement-top">
      <span class="goback" @click="backGo">
        <i class="el-icon-back"></i>
        返回
      </span>
      <span class="add-agreement-top-title">{{form.userName}}补充协议</span>
    </div>
    <changeMonth></changeMonth>
    <div class="form-content">
    <el-form ref="form" :rules="rules" :model="form">
      <div class="add-block">
        <div class="block-title">客户基本信息 </div>
        <div class="block-content">
          <div class="block-item">
            <el-form-item
              label="客户名称 : "
              class="item-list"
              label-width="140px"
            >
            <span>{{form.userName}}</span>
              <!-- <el-input type="number" v-model="form.userName"></el-input> -->
            </el-form-item>
            <el-form-item
              label="客户BP号 : "
              class="item-list"
              label-width="140px"
            >
            <span>{{form.userBPCode}}</span>
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
              label="关联主合同 : "
              class="item-list"
              label-width="140px"
            >
            <span>{{form.cancatMainContractName}}</span>
            </el-form-item>

            <el-form-item
              label="补充协议名称 : "
              class="item-list"
              label-width="140px"
            >
            <span>{{form.sideAgreementName}}</span>
            </el-form-item>
            <el-form-item
              label="补充协议编码 : "
              class="item-list"
              label-width="140px"
            >
             <span>{{form.sideAgreementCode}}</span>
            </el-form-item>

            <el-form-item
              label="协议签订日期 : "
              class="item-list"
              label-width="140px"
            >
             <span>{{form.agreementSignDate}}</span>
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
              label="协议补充月份 :"
              class="item-list"
              label-width="140px"
            >
            <span>{{form.sideAgreementMonth}}</span>
            </el-form-item>
          </div>
          <div></div>
        </div>
        <div>
          <div class="table-title">原合同内容</div>
          <el-table 
            class="custom-table-n"
            border
                header-row-class-name="custom-table-header"
                header-cell-class-name="custom-table-header-cell"
                cell-class-name="custom-table-cell"
          :data="tableData4.dataList" style="width: 100%">
            <el-table-column
              prop="date"
              label="合同量构成 "
              width="150"
              
            >
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
                min-width="100px"
              >
                <template slot-scope="scope">
                  <span>{{scope.row[oneConf.prop]}}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <div class="table-title">补充协议内容</div>
          <el-table
                class="custom-table-n"
                border
                header-row-class-name="custom-table-header"
                header-cell-class-name="custom-table-header-cell"
                cell-class-name="custom-table-cell"
           :data="tableData3.dataList" style="width: 100%">
            <el-table-column
              prop="date"
              label="合同量构成 "
              width="150"
              
            >
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
                min-width="100px"
              >
                <template slot-scope="scope">
                  <span>{{scope.row[oneConf.prop]}}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <template  v-if="form.contractType === '2'">
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
                    <span>{{form.receivePriceWinter}}</span>
                    <span >元/方</span>
                  </el-form-item>
                  <el-form-item
                    label="夏季价格"
                    class="item-list"
                    label-width="120px"
                    v-if="form.contractType === '2'"
                    prop="receivePriceSummer"
                  >
                    <span>{{form.receivePriceSummer}}</span>
                    <span >元/方</span>
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
                  <span>{{form.deliverPriceWinter}}</span>
                    <span >元/方</span>
                  </el-form-item>
                  <el-form-item
                    label="夏季价格"
                    class="item-list"
                    label-width="120px"
                    v-if="form.contractType === '2'"
                    prop="deliverPriceSummer"
                  >
                  <span>{{form.deliverPriceSummer}}</span>
                    <span >元/方</span>
                  </el-form-item>
                </div>
                <div></div>
              </div>
          </template>
          <div  v-if="form.contractType =='1'">
            <div class="block-content">
                <div class="block-item">
                  
            <el-form-item
                label="输配价格"
                class="item-list"
                label-width="120px"
                v-if="form.contractType === '1'"
                prop="transmissionPrice"
              >
               <span>{{form.transmissionPrice}}</span>
              </el-form-item>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div class="add-block">
        <div class="block-title">上传附件</div>
        <div class="upload-list">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange"
            :file-list="fileList"
          >
          </el-upload>
        </div>
        <div class="block-title-subtitle">
          <span class="cirl"> </span>
          备注
        </div>
        <div class="remark-block">
            <span>{{form.remark}}</span>
        </div>
      </div>
    </el-form>
    </div>
  </div>
</template>
<script>
import api from "/src/http/api";
import topMenu from "../../components/topMenu/topMenu";
import exportApi from "/src/components/export/export";
import dongguanApi from "/src/http/dongguan";
import {
  getCusYear,
  getCusYear1,
} from "./utils/commen"
export default {
  name: "PurchaseAnalysiss",
  mixins: [exportApi],
  components: {
    topMenu,
  },
  props: ["agreenmentId"],
  data() {
    return {
       expirationCycleListType:[
                {
                    label:'本日',
                    value:'1'
                },{
                    label:'次日',
                    value:'2'
                }
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
        cancatMainContractName:'',//
        sideAgreementName: "", //补充协议名称
        sideAgreementCode: "", //补充协议编码
        agreementSignDate: "", //协议签订日期
        sideAgreementMonth: "", //协议补充月份
        remark:'',//备注

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
        receivePriceSummer:'', //接收点夏季价格
        receivePriceWinter:'',//接收点冬季价格
        deliverPriceSummer:'',//交付点夏季价格
        deliverPriceWinter:'',//交付点冬季价格
      },
      rules: {
      },
      fileList: [
      ],
       contractDetail: [],
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
      tableData22: {
        dataList: [
        ],
        theadList: [
          {
            label: "",
            prop: "date",
          },
        ],
      },
       tableData3: {
        dataList: [
        ],
        theadList: [
          {
            label: "",
            prop: "date",
          },
        ],
      },
       tableData4:{
         dataList: [
        ],
        theadList: [
          {
            label: "",
            prop: "date",
          },
        ],
      },
      tableDataChange:{
        dataList: [
        ],
        theadList: [
          {
            label: "",
            prop: "date",
          },
        ],
      }
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
        }
      },
    },
  },
  created() {
    this.agreementGet()
  },
  mounted() {},
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    backGo(){
        this.$emit('backGo')
    },
    tableChange(dataC){
          this.tableDataChange.theadList = [];
          this.tableDataChange.dataList = [];
          dataC.forEach((item, index) => {
            dataC[index].year =
              item.contractDate1.substring(0, 4);
            dataC[index].month =
              item.contractDate1.substring(4, 6);
            this.$set(
              item,
              "MYzd",
              item.year +
                "" +
                ((item.month + "").length > 1 ? item.month : "0" + item.month)
            );
          });
          let yearTableData = []
          yearTableData = this.groupingData(
            dataC,
            "year"
          );
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
              this.$set(objTable2, "label", item1.month+ "月");
              this.$set(objTable2, "prop", item1.MYzd);
              this.tableDataChange.theadList[index + 1].children.push(objTable2);
            });
          });

          this.$set(this.tableDataChange.dataList, 0, {});
           if(this.form.contractType=='3'){
             this.$set(this.tableDataChange.dataList, 1, {});
           }
          this.tableDataChange.dataList.forEach((item, index) => {
            dataC.forEach((item1) => {    
              this.$set(this.tableDataChange.dataList[0], "date", "气量");
              this.$set(this.tableDataChange.dataList[0], "all", "");
               if(this.form.contractType=='3'){
                this.$set(this.tableDataChange.dataList[1], "date", "单价");
                this.$set(this.tableDataChange.dataList[1], "all", "");
               }
              this.$set(this.tableDataChange.dataList[0], item1.MYzd,item1.volume);
              if(this.form.contractType=='3'){
                this.$set(
                        this.tableDataChange.dataList[1],
                        item1.MYzd,
                        item1.price
                      );
              }
            });
          });
          return this.tableDataChange
    },
    //插入 
//为字符串插入字符 其中soure为原字符串,start为将要插入字符的位置，newStr为要插入的字符
insertStr(soure, start, newStr){   
   return soure.slice(0, start) + newStr + soure.slice(start);
},
     //  获取补充协议
    agreementGet() {
   
      let data = {
        id: this.agreenmentId,
      };
      dongguanApi.contract.agreementGet(data).then((res) => {
        if (res.length) {
          this.contractDetail = res[0];
          this.form.userBPCode=this.contractDetail.bp//bp
          let asd =  this.contractDetail.changeMonth.split(',')
          asd.forEach((item,index)=>{
              asd[index] = this.insertStr(item,4,"-")
              // asd[index] = this.insertStr(item,6,"月")
            })
          this.form.sideAgreementMonth = asd.join(',')
          this.form.cancatMainContractCode = this.contractDetail.contractId
          this.form.cancatMainContractName = this.contractDetail.bindContractName
          this.form.sideAgreementName=this.contractDetail.contractName
          this.form.sideAgreementCode=this.contractDetail.contractNo 
          this.form.userName = this.contractDetail.customerName,//客户名称
          this.form.remark = this.contractDetail.remark
          this.form.transmissionPrice = this.contractDetail.distributionPrice//输配价格元/方
          this.form.receivePriceSummer = this.contractDetail.receivePriceSummer, //接收点夏季价格
          this.form.receivePriceWinter = this.contractDetail.receivePriceWinter,//接收点冬季价格
          this.form.deliverPriceSummer = this.contractDetail.deliverPriceSummer,//交付点夏季价格
          this.form.deliverPriceWinter = this.contractDetail.deliverPriceWinter,//交付点冬季价格
          this.form.contractType = this.contractDetail.bindContractType
          this.form.agreementSignDate = this.contractDetail.signingDate 
          let copyData = JSON.parse(JSON.stringify(this.contractDetail))
          // 获取合同月份生成选项
          this.sideAgreementMonthList = []
        //   原合同生成表格
          this.yuanhetongT = []
          copyData.contractDetail.forEach(item => {
              let obj = {
              }
              obj.label = item.contractDate.substring(0,7)
              obj.value = item.contractDate1
              this.sideAgreementMonthList.push(obj)
          });
         this.tableData3 = this.tableChange(this.contractDetail.contractDetail)
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
          let yearTableData = []
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
              this.$set(objTable2, "label", item1.month+ "月");
              this.$set(objTable2, "prop", item1.MYzd);
              this.tableData22.theadList[index + 1].children.push(objTable2);
            });
          });
          this.$set(this.tableData22.dataList, 0, {});
           if(this.form.contractType=='3'){
          this.$set(this.tableData22.dataList, 1, {});
           }
         this.tableData22.dataList.forEach((item, index) => {
            this.contractDetail.bindContractDetail.forEach((item1) => {
              this.$set(this.tableData22.dataList[0], "date", "气量");
               if(this.form.contractType=='3'){
                this.$set(this.tableData22.dataList[1], "date", "单价");
               }
              this.$set(this.tableData22.dataList[0], item1.MYzd,item1.volume);
               if(this.form.contractType=='3'){
                this.$set(
                  this.tableData22.dataList[1],
                  item1.MYzd,
                  item1.price
                );
               }
            });
          });
          // 主合同也根据选择的协议月份显示
             this.tableData4 = JSON.parse(JSON.stringify(this.tableData3))
             this.tableData4.dataList.forEach((item,index)=>{
                  Object.keys(this.tableData4.dataList[index]).forEach(key=>{this.tableData4.dataList[index][key]=this.tableData22.dataList[index][key]})
             })
           let fileLista = []
          if( this.contractDetail.contractFiles.length>0){
             this.contractDetail.contractFiles.forEach(item=>{
              let obj={}
                obj.contractId = item.contractId
                obj.contractId= item.contractId
                obj.createDate =  item.createDate
                obj.createUser= item.createUser,
                obj.fileName = item.fileName
                obj.filePath = item.filePath
                obj.id = item.id
                obj.isDeleted = item.isDeleted
                obj.modifiedDate = item.modifiedDate
                obj.modifiedUser = item.modifiedUser
                fileLista.push(obj)
          })
          }
          fileLista.forEach(item=>{
            item.name = item.fileName
            item.url = item.filePath
          })
          this.fileList = fileLista
        }
      });
    },
         // / 传入两个参数 一个是待分组的数据 一个是按照哪个字段进行分组
    groupingData (data, filed)  {
        // map用来保存存过的字段 为下边添加新对象或者将相同字段的数据保存到同一个list中
        let map = {};
        // dest主要保存分组后的数据
        let dest = [];
        // 循环遍历传入的data
        data.forEach(item => {
    // 判断map对象中是否有遍历时data的key 如果没有则向dest数组中推入一个新的对象(包含两个属性，一个要分组的字段名，一个保存相同字段名数据的数组)
            if(!map[item[filed]]) {
                dest.push({
                    [filed]: item[filed],
                    list: [item]
                });
                // 进行一次新添对象的记录
                map[item[filed]] = item;
                // 如果在map中有data遍历的key(字段相同) 则向dest数组里面的相同字段的list下推入数据
            } else {
                dest.forEach(dItem => {
                if (dItem[filed] == item[filed]) {
                    dItem.list.push(item);
                }
                });
            }
        })
        return dest;
    },
  },
};
</script>
<style lang='scss' scoped>
.add-agreement {
  background: #ffffff;
  margin: 20px;
  border-radius: 4px;
  .form-content{
    padding: 0 20px;
  }
  .customBtn {
    background: #47a87d;
    border-radius: 20px;
    margin: 2px 10px;
    height: 32px;
    padding: 0 15px;
  }
  .remark-block{
         background: #EBEEF5;
        padding: 20px;
        margin: 30px 10px;
  }
  .add-agreement-top {
      height: 66px;
      line-height: 66px;
      padding: 0 20px;
       border-bottom: 1px solid #E4E7ED;
    .goback {
      margin-right: 10px;
      font-size: 14px;
      color: #409EFF;
        cursor: pointer;
        font-weight: 700;
        vertical-align: top;
        .el-icon-back{
           font-weight: 700;
        }
    }
    .add-agreement-top-title {
      font-weight: 700;
      padding-left: 10px;
      border-left: 1px solid #dcdfe6;
      font-size: 18px;
      color: #303133;
    }
  }
    /deep/ .el-table th.is-leaf{
    background:  #EBEEF5;
  }
  /deep/.el-table thead.is-group th{
      text-align: center;
      background: #EBEEF5;
  }
  /deep/ .el-table__body{
      .el-input__inner{
          text-align: center;
      }
      tr td{
      text-align: center;
     }
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
  .el-date-editor.el-input {
    width: 100%;
  }
  .el-range-editor.el-input__inner {
    width: 100%;
  }
   /deep/.el-form-item{
    margin-bottom: 1px;
  }
  .add-block {
    background: #f5f7fa;
    padding: 20px;
    margin-top: 24px;
    padding-bottom: 10px;
    /deep/.el-form-item__content{
        color: #303133;
        margin-left: 140px;
    }
    .table-title{
      margin: 30px 10px;
      color: #303133;
    }
    .block-lline {
      border-bottom: 1px solid #dcdfe6;
      margin-top: 10px;
    }
    .block-title {
      padding: 0 10px;
      line-height: 16px;
      color: #303133;
      font-weight: 500;
      height: 16px;
      border-left: 6px solid #47a87d;
    }
    .block-title-subtitle {
      margin-top: 20px;
      padding: 0 10px;
      color: #303133;
      .cirl {
        display: inline-block;
        width: 8px;
        height: 8px;
        /* margin-top: 8px; */
        background: #47a87d;
        vertical-align: middle;
      }
      padding: 0 10px;
      // border-left: 6px solid #47A87D;
    }
    .block-content {
      padding: 20px;
       padding-bottom: 0;
      .block-item {
        display: flex;
        flex-wrap: wrap;
        .item-list {
          width: 33%;
          .unit {
            position: absolute;
            right: 10px;
            color: #909399;
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
      /deep/.el-upload-list{
         .el-icon-close{
        display: none;
      }
        .el-upload-list__item-status-label{
            display: none;
        }
      }
      .uploadBtn {
        background: #47a87d;
        border-radius: 20px;
        margin: 10px;
      }
    }
  }
}
</style>
