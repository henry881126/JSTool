<template>
  <div class="deploy-detail deploy-add">
     <el-form ref="form"  :model="form" >
    <div class="add-block">
       <div class="block-title">
         供应商信息
       </div>  
        <div>
            <el-form-item
                label="供应商名称: "
                label-width="100px">
                <span>{{form.codeTxt}}</span>
        </el-form-item> 
        </div>
        <div class="block-item">  
             <el-form-item
                    label="供应商编码："
                    class="item-list"
                    label-width="100px"
                    >
                    <span>{{form.code}}</span>
            </el-form-item> 
            <el-form-item
                    label="供应商简称："
                    class="item-list"
                    label-width="100px">
                    <span>{{form.codeShorterTxt}}</span>
            </el-form-item> 
            <el-form-item
                    label="接气门站："
                    class="item-list"
                    label-width="100px">
                    <span>{{form.downGasPlace}}</span>
            </el-form-item> 
             <el-form-item
                    label="基准门站价："
                    class="item-list"
                    label-width="100px">
                    <span>{{form.baseGasPrice}}</span>
                    <span v-show="form.baseGasPrice!=''">元/方</span>
            </el-form-item> 
             <el-form-item
                    label="管输费："
                    class="item-list"
                    label-width="100px">
                    <span>{{form.pipelinePrice}}   
                    </span>
                    <span v-show="form.pipelinePrice!=''">元/方</span>
            </el-form-item> 
             <el-form-item
                    label="夏冬供气比："
                    class="item-list"
                    label-width="100px">
                    <span>{{form.gasSupply}}</span>
            </el-form-item>  
        </div>
    </div>
    <div class="add-block">
       <div class="block-title">
         非供暖季04/01～10/31
       </div>  
        <div>
            <el-form-item
                    label="气量类型: "
                    label-width="80px">
                    <span>{{form.noHeatingGasType}}</span>
            </el-form-item> 
        </div>
         <div class="balance-ratio">
            <div class="step-item-block">
            <el-form-item
            label="均衡量计算系数: "
            class="lower-gas-point item-list"
            prop="NbalanceCoefficient"
            v-if="changeEquilibriumN.equilibrium1 || changeEquilibriumN.equilibrium2 ||changeEquilibriumN.equilibrium3"
          >
          <span>{{form1.NbalanceCoefficient}}</span>
          </el-form-item>
            <el-form-item
              label="均衡1/均衡量比例: "
              class="item-list"
              prop="Nbalance1Scale"
              v-if="changeEquilibriumN.equilibrium1"
            >
            <span>{{form1.Nbalance1Scale}}</span>
            <span v-if="form1.Nbalance1Scale!=''" class="unit">%</span>
            </el-form-item>
            <el-form-item
              label="均衡2/均衡量比例: "
              class="item-list"
              prop="Nbalance2Scale"
              v-if="changeEquilibriumN.equilibrium2"
            >
            <span>{{form1.Nbalance2Scale}}</span>
              <span v-if="form1.Nbalance2Scale!=''" class="unit">%</span>
            </el-form-item>
          </div>
          <div class="step-item-block">
              <el-form-item
              label="均衡3/均衡量比例: "
              class="item-list"
              prop="Nbalance3Scale"
              v-if="changeEquilibriumN.equilibrium3"
            >
            <span>{{form1.Nbalance3Scale}}</span>
              <span v-if="form1.Nbalance3Scale!=''" class="unit">%</span>
            </el-form-item>
          </div>
          </div>
        <el-table
            :data="form1.getPriceReportDataNo"
            class="custom-table-n custom-table"
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            row-key="rowKey"
            border
            default-expand-all
            :tree-props="{
              children: 'childs',
              hasChildren: 'hasChildren',
            }"
           >
             <el-table-column
              prop="index1"
              label="名称"
              align="left"
              min-width="80px"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                  <span v-if='scope.row.childs'>
                      {{NcalculateStylechange[scope.row.index1]}}
                  </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="价格上浮动比例"
              align="left"
              min-width="150px"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                  <span>{{scope.row.price}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="contractNo"
              label="生效月份"
              align="center"
              width="300px"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                  <span>{{scope.row.changeM}}</span>
             
              </template>
            </el-table-column>
          </el-table>
      <div>
      </div>
    </div>
    <div class="add-block">
       <div class="block-title">
         供暖季11/01～13/30
       </div>  
        <div>
            <el-form-item
                    label="气量类型: "
                    label-width="80px">
                    <span>{{form.heatingGasType}}</span>
            </el-form-item> 
        </div>
          <div class="balance-ratio">
            <div class="step-item-block">
            <el-form-item
            label="均衡量计算系数: "
            class="lower-gas-point item-list"
            prop="NbalanceCoefficient"
            v-if="changeEquilibrium.equilibrium1 ||changeEquilibrium.equilibrium2 ||changeEquilibrium.equilibrium3"
          >
          <span>{{form1.balanceCoefficient}}</span>
          </el-form-item>
            <el-form-item
              label="均衡1/均衡量比例: "
              class="item-list"
              prop="Nbalance1Scale"
              v-if="changeEquilibrium.equilibrium1"
            >
            <span>{{form1.balance1Scale}}</span>
              <span v-if="form1.balance1Scale!=''" class="unit">%</span>
            </el-form-item>
            <el-form-item
              label="均衡2/均衡量比例: "
              class="item-list"
              prop="Nbalance2Scale"
              v-if="changeEquilibrium.equilibrium2"
            >
            <span>{{form1.balance2Scale}}</span>
              <span v-if="form1.balance2Scale!=''" class="unit">%</span>
            </el-form-item>
          </div>
          <div class="step-item-block">
              <el-form-item
              label="均衡3/均衡量比例: "
              class="item-list"
              prop="Nbalance3Scale"
              v-if="changeEquilibrium.equilibrium3"
            >
            <span>{{form1.balance3Scale}}</span>
              <span v-if="form1.balance3Scale!=''" class="unit">%</span>
            </el-form-item>
          </div>
          </div>
        <el-table
            :data="form1.getPriceReportData1"
            class="custom-table-n custom-table"
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            row-key="rowKey"
            border
            default-expand-all
            :tree-props="{
              children: 'childs',
              hasChildren: 'hasChildren',
            }"
           >
             <el-table-column
              prop="customerName"
              label="名称"
              align="left"
              min-width="80px"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                  <span v-if='scope.row.childs'>
                      {{NcalculateStylechange[scope.row.index1]}}
                  </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="价格上浮动比例"
              align="left" 
              min-width="150px"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                  <span>{{scope.row.price}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="contractNo"
              label="生效月份"
              align="center"
              width="300px"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                  <span>{{scope.row.changeM}}</span>
              </template>
            </el-table-column>
          </el-table>
      <div>
      </div>
    </div>
    <div class="add-block">
        <div class="block-title">
         附加条件
       </div> 
       <div class="step-item-block">
              <el-form-item
              label="总用气量最小值: "
              class="item-list"
              prop="sumGasMin"         
            >
              <span >{{form.sumGasMin}} </span>
              <span v-if="form.sumGasMin!=''" class="unit">万方</span>
            </el-form-item>
            <el-form-item
              label="总用气量最大值: "
              class="item-list"
              prop="sumGasMax"
            >
            <span>{{form.sumGasMax}}</span>
              <span v-if="form.sumGasMax!=''" class="unit">万方</span>
            </el-form-item>
          </div>
    </div>
    <div class="purchases-deploy-step3" v-if="stepActive === 3">
          <div class="step3-item-block">
              <template v-if="NoheatingEndjumin">
                 <div
                      v-for="(item, index) in formT.setMouth1"
                      :key="index"
                      class="item-list"
                    >
                      <el-form-item :label="item.label+'气量'"
                         :prop="'setMouth1.' + index + '.residents_gas'"
                            :rules="[
                            {
                                required: true,
                                message: '请输入气量',
                            },
                            ]">
                        <el-input type="number" v-model="item.residents_gas"></el-input>
                      </el-form-item>
                    </div>
               </template>
                    <template v-if="heatingEndjumin">
                    <div
                      v-for="(item, index) in formT.setMouth2"
                      :key="index"
                      class="item-list"
                    >
                      <el-form-item :label="item.label +'气量'"
                      :prop="'setMouth2.' + index + '.residents_gas'"
                    :rules="[
                      {
                        required: true,
                        message: '请输入气量',
                      },
                    ]">
                        <el-input type="number" v-model="item.residents_gas"></el-input>
                      </el-form-item>
                    </div>
                </template>
          </div>
          <div class="step1-btn">
            <el-button @click="secondBtn">上一步</el-button>
            <el-button type="primary" @click="submitBtn('formT')"
              >提交</el-button
            >
          </div>
        </div>
  </el-form>
  </div>
</template>
<script>
import api from "/src/http/api";
import qiyuanApi from "/src/http/qiyuanApi";
export default {
  name: "reply",
  data: function () {
    return {
      stepActive:'',
      form:{},
      form1:{
        getPriceReportDataNo:[],
        getPriceReportData1:[],
        calculateStylev: "",
        NcalculateStylev: "", //采暖季
          // 非采暖季均衡系数
        NbalanceCoefficient:'',//非采暖季均衡系数
        Nbalance1Scale:'',//非采暖季均衡1比例
        Nbalance2Scale:'',//非采暖季均衡2比例
        Nbalance3Scale:'',//非采暖季均衡3比例
        // 采暖季均衡系数
        balanceCoefficient:'',//非采暖季均衡系数
        balance1Scale:'',//非采暖季均衡1比例
        balance2Scale:'',//非采暖季均衡2比例
        balance3Scale:'',//非采暖季均衡3比例
      },
      NcalculateStylechange: {},
       formT: {
        setMouth1: [
          {
            label: "4月",
            residents_gas: "",
            index: 4,
          },
          {
            label: "5月",
            residents_gas: "",
            index: 5,
          },
          {
            label: "6月",
            residents_gas: "",
            index: 6,
          },
          {
            label: "7月",
            residents_gas: "",
            index: 7,
          },
          {
            label: "8月",
            residents_gas: "",
            index: 8,
          },
          {
            label: "9月",
            residents_gas: "",
            index: 9,
          },
          {
            label: "10月",
            residents_gas: "",
            index: 10,
          },
        ],
        setMouth2: [
          {
            label: "11月",
            residents_gas: "",
            index: 11,
          },
          {
            label: "12月",
            residents_gas: "",
            index: 12,
          },
          {
            label: "1月",
            residents_gas: "",
            index: 1,
          },
          {
            label: "2月",
            residents_gas: "",
            index: 2,
          },
          {
            label: "3月",
            residents_gas: "",
            index: 3,
          },
        ],
      },
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
          value: "11",
          label: "11月",
        },
        {
          value: "12",
          label: "12月",
        },
      ],
       balance3: [
          {
            value: '4',
            label: "4月",
          },
          {
            value: '5',
            label: "5月",
          },
          {
            value: '6',
            label: "6月",
          },
          {
             value: '7',
            label: "7月",
          },
          {
             value: '8',
            label: "8月",
          },
          {
            value: '9',
            label: "9月",
          },
          {
            value: '10',
            label: "10月",
          },
        ],
      supplierData:[],
      calculateStyle :'',
      NcalculateStyle:'',
      optionsList:[],
      changeEquilibrium:{},
      changeEquilibriumN:{},
    };
  },
  props:['detailList'],
  components: {},
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom;
    },
    curComInfo: function () {
      return this.$store.getters.curComInfo;
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
    this.supplierGetGasType();
    this.getSupperq();
},
  mounted() {
  },
  methods: {
    formatData1(element) {
        let noHeatingMethod = element.split(",");
        let monunthC = ''
         noHeatingMethod.forEach((item,index) => {
          if(this.NcalculateStylechange[item]){
              monunthC += index==noHeatingMethod.length-1?this.NcalculateStylechange[item] :this.NcalculateStylechange[item] +','
          }
          })
      return monunthC;
    },
    formatData(element) {
      let noHeatingMethod = element.split(",");
      let noHeatingMethodD = [];
      let monunthC = ''
      if(noHeatingMethod.length>0){
         noHeatingMethod.forEach((item,index) => {
            let itemA = [];
            itemA.push(item);
            monunthC += index==noHeatingMethod.length-1?item+'月':item+'月,'
            noHeatingMethodD.push(itemA);
        });  
      } 
      return monunthC;
    },
     supplierGetGasType() {
      api.purchasesDeploy.supplierGetGasType().then((res) => {
        if (res) {
          this.calculateStyle = res;
          this.NcalculateStyle = res;
          this.calculateStyle.forEach((item) => {
            this.NcalculateStylechange[item.value] = item.name;
          });
        }
      });
    },
      //  下气点
    apiqiyuan(){
        let data = {
            managerCode:this.curComCode,
            codeLevel:this.curComInfo.orgLevel,
            stationName:''
        }
       qiyuanApi.demandDisplay.stationSelect(data).then((res)=>{
           if(res){
               this.optionsList = res.stationList
               if(this.optionsList.length > 0){
                 this.downGasPlaceDict(this.form.downGasPlace,this.optionsList)
              }
           }
       })
    },
    downGasPlaceDict(val,list){
       this.form.downGasPlace=''
       let asd = val?val.split(","):"";
            let downGasPlaceS = ''
            if(asd.length>0){
                list.forEach(item=>{   
                    asd.forEach((item1,index)=>{
                        if(item.stationCode == item1){
                            downGasPlaceS += asd.length-1==index?item.stationName:item.stationName +','
                        }
                    })
                })
                this.form.downGasPlace = downGasPlaceS
            } 
    },
    getSupperq() {
      this.supplierData = []
      let datalList = {
        id: this.detailList.id,
      };
      api.purchasesDeploy.getSupperq(datalList).then((res) => {
        this.supplierData = res;
        if (this.supplierData) {
          this.supplierData[0].gasTypeConfigs.forEach((item) => {
            if (item.type == 1) {
              let obj = {};
                obj.gasType = item.gasTypeValue
                obj.price = item.priceNum
                obj.gas = item.gasNum
                obj.index1 = item.gasTypeValue
                obj.id = item.id;
                obj.smartSupplierConfigId =item.smartSupplierConfigId;
                obj.mounth = this.balance2
                obj.changeM = item.month?this.formatData(item.month):''
                obj.type = item.type //采暖季
                obj.rowKey = Math.random().toString();
                obj.equilibriumRatio = item.equilibriumRatio
                obj.childs = []
              if (item.childs && item.childs.length>0) {
                   item.childs.forEach((item1,index11) => {
                  let obj1 = {};
                   obj1.gasType = item1.gasTypeValue
                    obj1.price = item1.priceNum
                    obj1.gas = item1.gasNum
                    obj1.id = item1.id;
                    obj1.index1 = item1.gasTypeValue
                    obj1.childIndex = index11
                    obj1.childTypeName = item1.childTypeName
                    obj1.mounth = this.balance2
                    obj1.changeM = item1.month?this.formatData(item1.month):''
                    obj1.type = item1.type //采暖季
                    obj1.equilibriumRatio = item1.equilibriumRatio
                    obj1.rowKey = Math.random().toString();
                    obj.childs.push(obj1);
                });
              }
              this.form1.getPriceReportData1.push(obj);
                 let objjunh = {
                    equilibrium1:'',
                    equilibrium2:'',
                    equilibrium3:''
                }
                let changeObj = {}
                this.form1.getPriceReportData1.forEach(item=>{
                    for(let i in objjunh){
                        if(item.gasType == i){
                            changeObj[i] = true
                            if(item.gasType =='equilibrium1'){
                            this.form1.balance1Scale = item.equilibriumRatio 
                            }else if(item.gasType =='equilibrium2'){
                                    this.form1.balance2Scale = item.equilibriumRatio 
                            }else if(item.gasType =='equilibrium3'){
                                    this.form1.balance3Scale = item.equilibriumRatio 
                            }
                       }
                    }
                })
                 this.changeEquilibrium = changeObj
            } else if (item.type == 0) {
              let obj = {};
                obj.gasType = item.gasTypeValue
                obj.price = item.priceNum
                obj.gas = item.gasNum
                obj.id = item.id;
                obj.smartSupplierConfigId =item.smartSupplierConfigId;
                obj.index1 = item.gasTypeValue
                obj.mounth = this.balance3
                obj.equilibriumRatio = item.equilibriumRatio
                obj.changeM = this.formatData(item.month)
                obj.type = item.type //采暖季
                obj.childs = []
                obj.rowKey = Math.random().toString();
                if (item.childs && item.childs.length>0) {
                item.childs.forEach((item1,index) => {
                  let obj1 = {};
                    obj1.gasType = item1.gasTypeValue
                    obj1.price = item1.priceNum
                    obj1.gas = item1.gasNum
                    obj1.id = item1.id;
                    obj1.equilibriumRatio = item1.equilibriumRatio
                    //   obj1.childIndex = index
                    obj1.index1 = item1.gasTypeValue
                    obj1.childTypeName = item1.childTypeName
                    obj1.mounth = this.balance3
                    obj1.changeM = this.formatData(item1.month)
                    obj1.type = item1.type //采暖季
                    obj1.rowKey = Math.random().toString();
                    obj.childs.push(obj1);
                });
              }
              obj.rowKey = Math.random().toString();
              this.form1.getPriceReportDataNo.push(obj);
               let objjunh = {
                    equilibrium1:'',
                    equilibrium2:'',
                    equilibrium3:''
                }
                let changeObj = {}
                this.form1.getPriceReportDataNo.forEach(item=>{
                    for(let i in objjunh){
                        if(item.gasType == i){
                        changeObj[i] = true
                        if(item.gasType =='equilibrium1'){
                          this.form1.Nbalance1Scale = item.equilibriumRatio 
                        }else if(item.gasType =='equilibrium2'){
                                this.form1.Nbalance2Scale = item.equilibriumRatio 
                        }else if(item.gasType =='equilibrium3'){
                                this.form1.Nbalance3Scale = item.equilibriumRatio 
                        }
                    }
                    }
                })
                 this.changeEquilibriumN = changeObj
            }
          });
          this.formT.setMouth1.forEach((item) => {
              if(this.supplierData[0].smartAdoptCalculateResidentGas){
                  for (let i in this.supplierData[0].smartAdoptCalculateResidentGas
                    .txt) {
                    if (item.index == i) {
                        item.residents_gas =
                        this.supplierData[0].smartAdoptCalculateResidentGas.txt[
                            i
                        ].residents_gas;
                    }
                    }
              }
          });
          this.formT.setMouth2.forEach((item) => {
              if(this.supplierData[0].smartAdoptCalculateResidentGas){
                 for (let i in this.supplierData[0].smartAdoptCalculateResidentGas.txt) {
                    if (item.index == i) {
                        item.residents_gas =
                        this.supplierData[0].smartAdoptCalculateResidentGas.txt[
                            i
                        ].residents_gas;
                    }
                    }
              }
          });
          let getnoHeatingMethod = this.formatData(
            this.supplierData[0].noHeatingGasType?this.supplierData[0].noHeatingGasType:''
          );
          let getHeatingMethod = this.formatData(
            this.supplierData[0].heatingGasType?this.supplierData[0].heatingGasType:''
          );    
          this.form = this.supplierData[0];
          this.form1.balanceCoefficient = this.form.equilibriumCoefficient
          this.form1.NbalanceCoefficient = this.form.noHeatingEquilibriumCoefficient
          this.form.heatingGasType = this.formatData1(this.supplierData[0].heatingGasType)
          this.form.noHeatingGasType = this.formatData1(this.supplierData[0].noHeatingGasType)
          this.apiqiyuan()
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.deploy-detail{
    height: 500px;
    overflow: auto;
    padding: 0 30px;
     /deep/.el-table [class*="el-table__row--level"] .el-table__expand-icon {
    display: none;
  }
  /deep/.el-table__header{
    height: 48px;
    .custom-table-header{
      height: 48px;
    }
    th{
       background: #F5F7FA!important;
       height: 48px;
    }
  }
   .add-block{
     /deep/.el-form-item{
         margin-bottom: 0px;
     }
       /deep/.el-form-item__label{
           text-align: left;
       }
       /deep/.el-form-item__content{
           color: #303133;
               font-weight: 600;
       }
       .custom-table{
           margin-bottom: 20px;
       }
        .block-title {
            padding: 0 10px;
            line-height: 16px;
            color: #303133;
            font-weight: 600;
            height: 16px;
            border-left: 6px solid #47a87d;
            margin-bottom: 10px;
             margin-top: 20px;
            }
        .block-item{
             display: flex;
             flex-wrap: wrap;
             .item-list{
               width: 50%;
            //    height: 35px;
             }
        }
        .step-item-block{
            display: flex;
            .item-list{
               width: 50%;
             }
        }
   }
}
</style>