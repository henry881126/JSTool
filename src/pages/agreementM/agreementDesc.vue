<template>
  <div class="add-agreement">
    <div class="add-agreement-top">
      <span class="goback" @click="backGo">
        <i class="el-icon-back"></i>
        返回
      </span>
      <span class="add-agreement-top-title">{{form.userName}}{{form.ContractName}}</span>
    </div>
    <div class="form-content">
        <el-form ref="form" :rules="rules" :model="form">
        <div class="add-block">
            <div class="block-title">客户基本信息</div>
            <div class="block-content">
            <div class="block-item">
                <el-form-item
                label="客户名称 : "
                class="item-list"
                label-width="140px">
                <span>{{form.userName}}</span>
                </el-form-item>
                <el-form-item
                label="客户BP号 : "
                class="item-list"
                label-width="140px">
                <span>{{form.userCode}}</span>
                </el-form-item>
                <el-form-item label-width="140px" label="合同类型: ">
                    <span>{{form.contractTypeName}}</span>
                </el-form-item>
            </div>
            <div class="agreement-type">   
            </div>
            <div v-show="form.contractType !== '3'">
                <div class="block-item">
                <el-form-item
                    label="供应商名称 : "
                    class="item-list"
                    label-width="140px">
                <span>{{form.supplierName}}</span>
                </el-form-item>
                <el-form-item
                    label="供应商简称 : "
                    class="item-list"
                    label-width="140px">
                <span>{{form.supplierAbbreviation}}</span>
                </el-form-item>
                </div>
                <div class="block-item">
                <el-form-item
                    label="气源名称 : "
                    class="item-list"
                    label-width="140px">
                <span>{{form.gasName}}</span>
                </el-form-item>
                <el-form-item
                    label="是否兜底气源 : "
                    class="item-list"
                    label-width="140px">
                <span>{{form.isRevealAllDetail =='1'?'是':'否'}}</span>
                </el-form-item>
                </div>
            </div>
            </div>
        </div>
        <div class="add-block">
            <div class="block-title">合同信息</div>
            <div class="block-title-subtitle">
            <span class="cirl"> </span>
            合同基本信息
            </div>
            <div class="block-content">
            <div class="block-item">
                <el-form-item
                label="合同编号 : "
                class="item-list"
                label-width="140px">
                <span>{{form.ContractCode}}</span>
                </el-form-item>
                <el-form-item
                label="合同名称 : "
                class="item-list"
                label-width="140px">
                <span>{{form.ContractName}}</span>
                </el-form-item>
                <el-form-item label="合同期 : " class="item-list" label-width="140px">
                <span>{{form.ContractTerm}}</span>
                </el-form-item>
                <el-form-item
                label="签订日期 : "
                class="item-list"
                label-width="140px">
                <span>{{form.ContractSignDate}}</span>
                </el-form-item>
            </div>
            </div>
            <div class="block-lline"></div>
            <div class="block-title-subtitle">
            <span class="cirl"> </span>
            物理接收交付信息
            </div>
            <div class="block-content">
            <div class="block-item">
                <!-- 代销合同新 -->
                <el-form-item
                label="接收点 : "
                class="item-list"
                label-width="140px"
                v-if="form.contractType !== '3'">
                <span>{{form.receivePoint}}</span>
                </el-form-item>
                <el-form-item
                label="接收压力点 : "
                class="item-list"
                label-width="140px"
                v-if="form.contractType !== '3'">
                <span v-if="form.receivePressurePoint">
                  <span>{{form.receivePressurePoint}}</span>
                  <span>Mpa</span>
                  <span>-</span>
                  <span>{{form.receivePressureMax}}Mpa</span>
                </span>
                </el-form-item>
                <!-- 代销合同新end -->
                <el-form-item
                label="交付点 : "
                class="item-list"
                label-width="140px"
                v-if="form.contractType !== '1'">
                <span>{{form.deliveryPoint}}</span>
                </el-form-item>
                <el-form-item
                label="产权分界点 : "
                class="item-list"
                label-width="140px">
                <span>{{form.cqDividingPoint}}</span>
                </el-form-item>
                <el-form-item
                label="交付点压力 : "
                class="item-list"
                label-width="140px"
                v-if="form.contractType !== '1'">
                <span v-if="form.deliveryPointPressure">
                   <span>{{form.deliveryPointPressure}}</span>
                <span>Mpa</span>
                <span>-</span>
                <span>{{form.deliverPressureMax}}</span>
                <span>Mpa</span>
                </span>
                
                </el-form-item>
                <el-form-item
                label="计量方式 : "
                class="item-list"
                label-width="140px">
                <span>{{form.meteringMode}}</span>
                </el-form-item>
            </div>
            </div>
            <div class="block-lline"></div>
            <!-- 计量结算信息 -->
            <div class="block-title-subtitle">
            <span class="cirl"> </span>
            计量结算信息
            </div>
            <div class="block-content">
              <div class="block-item">
                  <el-form-item
                  label="结算方式 : "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.settlementStyle}}</span>
                  </el-form-item>
                  <el-form-item
                  label="结算周期 : "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.settlementPeriod}}</span>
                  </el-form-item>
                  <el-form-item label="结算日 : " class="item-list" label-width="140px">
                  <span>{{form.settlementDay}}</span>
                  </el-form-item>
                  <el-form-item
                  label="交割周期 : "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.expirationCycle}}</span>
                  </el-form-item>
                  <!-- 代销增 -->
                  <el-form-item
                  label="偏差结算率 : "
                  class="item-list"
                  label-width="140px"
                  v-if="form.contractType !== '3'"
                  >
                  <span>{{form.deviationSettlementRate}}</span>
                  <span>%</span>
                  </el-form-item>
                  <!-- 代销增end -->
                  <el-form-item
                  label="超提范围比率 : "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.overdraftRatio}}</span>
                  <span>%</span>
                  </el-form-item>
                  <el-form-item
                  label="欠提范围比率 : "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.outstandingRatio}}</span>
                  <span>%</span>
                  </el-form-item>
                  <el-form-item
                  label="欠提清零天数/月 : "
                  class="item-list outstandingClearS"
                  label-width="140px"
                  >
                  <span>{{form.outstandingClear}}</span>
                  <span> {{form.outstandingClearC}}</span>
                  </el-form-item>
                  <el-form-item
                  label="供销差率 :"
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.DepartmenRate}}</span>
                  <span>%</span>
                  </el-form-item>
              </div>
            </div>
            <div class="block-lline"></div>
            <div class="block-title-subtitle">
            <span class="cirl"> </span>
            计划管理周期
            </div>
            <div class="block-content">
              <div class="block-item">
                  <el-form-item
                  label="月指定提交时间: "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.monthSubmitTime}}</span>
                  </el-form-item>
                  <el-form-item
                  label="月指定批复时间 : "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.monthReplayTime}}</span>
                  </el-form-item>
                  <el-form-item
                  label="日指定提交时间 : "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.daySubmitTime}}</span>
                  </el-form-item>
                  <el-form-item
                  label="日指定批复时间 : "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.dayReplayTime}}</span>
                  </el-form-item>
                  <el-form-item
                  label="日指定变更时间 : "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.dayChangeTime}}</span>

                  </el-form-item>
                  <el-form-item
                  label="月最大提取率 : "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.monthMaxRate}}</span>
                <span>%</span>
                  </el-form-item>

                  <el-form-item
                  label="月最小提取率 : "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.monthMinRate}}</span>
                  <span>%</span>
                  </el-form-item>
                  <el-form-item
                  label="日最大提取率 : "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.dayMaxRate}}</span>
                  <span>%</span>
                  </el-form-item>
                  <el-form-item
                  label="日最小提取率 : "
                  class="item-list"
                  label-width="140px"
                  >
                  <span>{{form.dayMinRate}}</span>
                  <span>%</span>
                  </el-form-item>
              </div>
            </div>
            <div class="block-lline"></div>
            <div class="block-title-subtitle">
            <span class="cirl"> </span>
            备注
            </div>
            <div class="remark-block">
                <span>{{form.remark}}</span>
            </div>
            <div class="block-title">合同量价信息</div>
            <div class="table">
            <el-table
              class="custom-table-n custom-table"
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
              :data="tableData22.dataList" style="width: 100%">
                <el-table-column
                prop="date"
                label="合同量构成  "
                width="150">
                </el-table-column>
                <el-table-column
                v-for="(item, index) in tableData22.theadList.slice(1)"
                :key="index"
                prop=""
                :label="item.label"
                align="center">
                <el-table-column
                    v-for="oneConf in item.children"
                    :key="oneConf.prop"
                    :prop="oneConf.prop"
                    :label="oneConf.label"
                    min-width="100px">
                    <template slot-scope="scope">
                    <span>{{scope.row[oneConf.prop]}}</span>
                    </template>
                </el-table-column>
                </el-table-column>
                <el-table-column prop="all" label="总气量  " width="150" >
                </el-table-column>
            </el-table>
            </div>
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
                    label-width="140px"
                    v-if="form.contractType === '2'"
                    prop="receivePriceWinter">
                    <span>{{form.receivePriceWinter}}</span>
                    <span>元/方</span>
                    </el-form-item>
                    <el-form-item
                    label="夏季价格"
                    class="item-list"
                    label-width="140px"
                    v-if="form.contractType === '2'"
                    prop="receivePriceSummer">
                      <span>{{form.receivePriceSummer}}</span>
                      <span>元/方</span>
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
                    label-width="140px"
                    v-if="form.contractType === '2'"
                    prop="deliverPriceWinter"
                    >
                    <span>{{form.deliverPriceWinter}}</span>
                    <span>元/方</span>
                    </el-form-item>
                    <el-form-item
                    label="夏季价格"
                    class="item-list"
                    label-width="140px"
                    v-if="form.contractType === '2'"
                    prop="deliverPriceSummer"
                    >
                    <span>{{form.deliverPriceSummer}}</span>
                    <span>元/方</span>
                    </el-form-item>
                </div>
                <div></div>
                </div>
            </template>
            <div class="table-price" v-if="form.contractType=='1'">
            <el-form-item
                label="输配价格："
                class="item-list"
                label-width="140px"
                v-if="form.contractType === '1'"
                prop="transmissionPrice"
                >
                <span>{{form.transmissionPrice}}</span>
                <span>元/方</span>
                </el-form-item>
            </div>
        </div>
        <div class="add-block" v-if="fileList.length>0">
            <div class="block-title">附件</div>
            <div class="upload-list">
            <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-change="handleChange"
                :file-list="fileList">
            </el-upload>
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
  publicLableValueC
} from "./utils/commen"
export default {
  name: "PurchaseAnalysiss",
  mixins: [exportApi],
  components: {
    topMenu,
  },
   props: ["getContractID"],
  data() {
    return {
      outstandingClearL: [
        {
          value: "1",
          label: "日",
        },
        {
          value: "2",
          label: "月",
        },
      ],
      expirationCycleListType:[
                {
                    label:'本日',
                    value:'1'
                },{
                    label:'次日',
                    value:'2'
                }
            ],
      receivePointList: [
        {
          value: "1",
          label: "标方结算",
        },
        {
          value: "2",
          label: "能量结算",
        },
      ],
      //   计量方式
      meteringModeList: [
        {
          value: "1",
          label: "体积",
        },
        {
          value: "2",
          label: "能量",
        },
      ],
      outstandingClearL: [
        {
          value: "1",
          label: "日",
        },
        {
          value: "2",
          label: "月",
        },
      ],
       monthSubmitTimeList1:[
        {
          value: "1",
          label: "1日",
        },
        {
          value: "2",
          label: "2日",
        },
        {
          value: "3",
          label: "3日",
        },{
          value: "4",
          label: "4日",
        },{
          value: "5",
          label: "5日",
        },{
          value: "6",
          label: "6日",
        },{
          value: "7",
          label: "7日",
        },{
          value: "8",
          label: "8日",
        },{
          value: "9",
          label: "9日",
        },{
          value: "10",
          label: "10日",
        },{
          value: "11",
          label: "11日",
        },{
          value: "12",
          label: "12日",
        },{
          value: "13",
          label: "13日",
        },{
          value: "14",
          label: "14日",
        },{
          value: "15",
          label: "15日",
        },{
          value: "16",
          label: "16日",
        },{
          value: "17",
          label: "17日",
        },{
          value: "18",
          label: "18日",
        },{
          value: "19",
          label: "19日",
        },{
          value: "20",
          label: "16日",
        },{
          value: "21",
          label: "21日",
        },{
          value: "22",
          label: "22日",
        },{
          value: "23",
          label: "23日",
        },{
          value: "24",
          label: "24日",
        },{
          value: "25",
          label: "25日",
        },{
          value: "26",
          label: "26日",
        },{
          value: "27",
          label: "27日",
        },{
          value: "28",
          label: "28日",
        },{
          value: "29",
          label: "29日",
        },{
          value: "30",
          label: "30日",
        },{
          value: "31",
          label: "31日",
        },
        
      ],
      monthSubmitTimeList:[
        {
          value: "1",
          label: "每月1日",
        },
        {
          value: "2",
          label: "每月2日",
        },
        {
          value: "3",
          label: "每月3日",
        },{
          value: "4",
          label: "每月4日",
        },{
          value: "5",
          label: "每月5日",
        },{
          value: "6",
          label: "每月6日",
        },{
          value: "7",
          label: "每月7日",
        },{
          value: "8",
          label: "每月8日",
        },{
          value: "9",
          label: "每月9日",
        },{
          value: "10",
          label: "每月10日",
        },{
          value: "11",
          label: "每月11日",
        },{
          value: "12",
          label: "每月12日",
        },{
          value: "13",
          label: "每月13日",
        },{
          value: "14",
          label: "每月14日",
        },{
          value: "15",
          label: "每月15日",
        },{
          value: "16",
          label: "每月16日",
        },{
          value: "17",
          label: "每月17日",
        },{
          value: "18",
          label: "每月18日",
        },{
          value: "19",
          label: "每月19日",
        },{
          value: "20",
          label: "每月20日",
        },{
          value: "21",
          label: "每月21日",
        },{
          value: "22",
          label: "每月22日",
        },{
          value: "23",
          label: "每月23日",
        },{
          value: "24",
          label: "每月24日",
        },{
          value: "25",
          label: "每月25日",
        },{
          value: "26",
          label: "每月26日",
        },{
          value: "27",
          label: "每月27日",
        },{
          value: "28",
          label: "每月28日",
        },{
          value: "29",
          label: "每月29日",
        },{
          value: "30",
          label: "每月30日",
        },{
          value: "31",
          label: "每月31日",
        },
        
      ],
      monthSubmitTimeListDay:[
         {
          label: "每日0:00",
          value: "1",
        },
        {
          label: "每日1:00",
          value: "2",
        },
        {
          label: "每日2:00",
          value: "3",
        },
        {
          label: "每日3:00",
          value: "4",
        },
        {
          label: "每日4:00",
          value: "5",
        },
        {
          label: "每日5:00",
          value: "6",
        },
        {
          label: "每日6:00",
          value: "7",
        },
        {
          label: "每日7:00",
          value: "8",
        },
        {
          label: "每日8:00",
          value: "9",
        },
        {
          label: "每日9:00",
          value: "10",
        },
        {
          label: "每日10:00",
          value: "11",
        },
        {
          label: "每日11:00",
          value: "12",
        },
        {
          label: "每日12:00",
          value: "13",
        },{
          label: "每日13:00",
          value: "14",
        },
        {
          label: "每日14:00",
          value: "15",
        },
        {
          label: "每日15:00",
          value: "16",
        },
        {
          label: "每日16:00",
          value: "17",
        },
        {
          label: "每日17:00",
          value: "18",
        },
        {
          label: "每日18:00",
          value: "19",
        },
        {
          label: "每日19:00",
          value: "20",
        },
        {
          label: "每日20:00",
          value: "21",
        },
        {
          label: "每日21:00",
          value: "22",
        },
        {
          label: "每日22:00",
          value: "23",
        },
        {
          label: "每日23:00",
          value: "24",
        },
      ],
      form: {
        userName: "",
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
        receivePressureMax:'',//接收点压力最大值
        deliveryPoint: "", //交付点
        cqDividingPoint: "", //产权分界点
        deliveryPointPressure: "", //交付点压力
        deliverPressureMax:'',//交付点压力最大值
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
        outstandingClearC: "",
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
        contractTypeName:'',
         settlementPeriodType:'',
        receivePriceSummer:'', //接收点夏季价格
        receivePriceWinter:'',//接收点冬季价格
        deliverPriceSummer:'',//交付点夏季价格
        deliverPriceWinter:'',//交付点冬季价格
      },
      rules: {
      },
      fileList: [
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
      contractDetail:[],
      yearTableData:[]
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
    this.contractGet()
  },
  mounted() {},
  methods: {
      getFloat (num, n) {
        n = n ? parseInt(n) : 0;
        if(n <= 0) {
          return Math.round(num);
        }
        num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
        num = Number(num).toFixed(n); //补足位数
        return num;
      },
       // 修改表格计算总量
    jisuanAll() {
      this.tableData22.dataList.forEach(item => {
        let asd = 0;
       if(item.date =='单价(元/方)'){
             return
          }else{
           for (let i in item) {
                if (i != "all" && i != "date") {
                asd += Number(item[i]);
                 this.getFloat(asd,'4')
                // item.all = asd.toFixed(4).replace(/[.]?0+$/,"")?asd.toFixed(4).replace(/[.]?0+$/,""):0;
              }
             }
        }
        this.form.yearAllNum = this.tableData22.dataList[0].all?this.tableData22.dataList[0].all:0
      });
    },
     // 获取合同详情
    contractGet() {
      let data = {
        id: this.getContractID,
      };
      dongguanApi.contract.contractGet(data).then((res) => {
        if (res.length) {
          this.contractDetail = res[0];
          this.form.userCode = this.contractDetail.bp;
          this.form.ContractTerm = this.contractDetail.contractBeginDate+'到'+this.contractDetail.contractEndDate
          this.form.ContractName = this.contractDetail.contractName;
          this.form.ContractCode = this.contractDetail.contractNo;
          this.form.yearAllNum = this.contractDetail.contractTotalAmount;
          let contractType = this.contractDetail.contractType =='3'?'直销合同':this.contractDetail.contractType=='2'?'代销合同':this.contractDetail.contractType=='1'?'代输合同':''
          this.form.contractTypeName = contractType;
          this.form.contractType = this.contractDetail.contractType
          this.form.userName = this.contractDetail.customerName;
          this.form.dayChangeTime = publicLableValueC(this.monthSubmitTimeListDay,this.contractDetail.dayChangeTime);
          this.form.dayMaxRate = this.contractDetail.dayExtractionRatioMax;
          this.form.dayMinRate = this.contractDetail.dayExtractionRatioMin;
          this.form.dayReplayTime = publicLableValueC(this.monthSubmitTimeListDay,this.contractDetail.dayReplyTime);
          this.form.daySubmitTime = publicLableValueC(this.monthSubmitTimeListDay,this.contractDetail.daySubmitTime);
          this.form.supplierAbbreviation = this.contractDetail.gasSource //供应商简称
          this.form.supplierName = this.contractDetail.contractGas//供应商名称
          this.form.gasName = this.contractDetail.contractGasName //气源来源
          this.form.deviationSettlementRate = this.contractDetail.deviationRatio//偏差结算率
          this.form.transmissionPrice = this.contractDetail.distributionPrice//输配价格元/方
          this.form.receivePoint = this.contractDetail.receive//接收点
          this.form.receivePressurePoint= this.contractDetail.receivePressure//接收点压力
          this.form.receivePressureMax = this.contractDetail.receivePressureMax;//接收点压力最大值
          this.form.deliveryPoint = this.contractDetail.deliver;
          this.form.receivePriceSummer = this.contractDetail.receivePriceSummer, //接收点夏季价格
          this.form.receivePriceWinter = this.contractDetail.receivePriceWinter,//接收点冬季价格
          this.form.deliverPriceSummer = this.contractDetail.deliverPriceSummer,//交付点夏季价格
          this.form.deliverPriceWinter = this.contractDetail.deliverPriceWinter,//交付点冬季价格
          this.form.deliveryPointPressure = this.contractDetail.deliverPressure;
           this.form.deliverPressureMax = this.contractDetail.deliverPressureMax;//交付点压力最大值
          let left =  '本日'
          let right =   publicLableValueC(this.expirationCycleListType,this.contractDetail.deliveryCycleEndDay)
          this.form.expirationCycle = left+''+ this.contractDetail.deliveryCycleBegin +'点-' + right+this.contractDetail.deliveryCycleEnd+'点' 
          this.form.expirationCycleStartTime = this.contractDetail.deliveryCycleBegin;
          this.form.expirationCycleEndTime = this.contractDetail.deliveryCycleEnd;
          this.form.DepartmenRate = this.contractDetail.diversityRatio; //供销差率
          this.form.cqDividingPoint = this.contractDetail.dividingPoint; //产权分界点
          this.form.isRevealAllDetail = this.contractDetail.isBottom + ""; //: "", //是否兜底气源
          this.form.meteringMode = publicLableValueC(this.meteringModeList,this.contractDetail.measurementMode); //计量方式
          this.form.monthMaxRate = this.contractDetail.monthExtractionRatioMax; //月最大提取率
          this.form.monthMinRate = this.contractDetail.monthExtractionRatioMin; //月最小提取率
          this.form.monthReplayTime = publicLableValueC(this.monthSubmitTimeList,this.contractDetail.monthReplyTime); //月指定批复时间
          this.form.monthSubmitTime = publicLableValueC(this.monthSubmitTimeList,this.contractDetail.monthSubmitTime); //月指定提交时间
          this.form.overdraftRatio = this.contractDetail.overLiftRangeRatio; //超提范围比率
          this.form.remark = this.contractDetail.remark; //备注
          let aaa = this.contractDetail.settlementDate.split(',')
          let obj12 = ''
          aaa.forEach(item=>{
              if(item){
                   obj12 += publicLableValueC(this.monthSubmitTimeList1,item) +','
              }             
          })
          this.form.settlementDay = obj12.slice(0,obj12.length-1); //settlementDay结算日
          this.form.settlementStyle = publicLableValueC(this.receivePointList,this.contractDetail.settlementMode); //结算方式
          let replaceC = this.contractDetail.settlementPeriod?this.contractDetail.settlementPeriod.replace(/-/g, ''):this.contractDetail.settlementPeriod;
          this.form.settlementPeriod = replaceC?replaceC.replace(',', '-'):''
          this.form.ContractSignDate = this.contractDetail.signingDate; //签订日期
          this.form.outstandingClear = this.contractDetail.uncdrLiftClear; //欠提清零天数/月
          this.form.outstandingClearC = publicLableValueC(this.outstandingClearL,this.contractDetail.uncdrLiftClearType) //欠提清零天数/月类型,
          this.form.outstandingRatio = this.contractDetail.uncdrLiftRangeRatio; //欠提范围比率
          this.tableData22.theadList = [];
          this.tableData22.dataList = [];
          this.contractDetail.contractDetail.forEach((item, index) => {
            this.contractDetail.contractDetail[index].year = item.contractDate1.substring(0, 4);
            this.contractDetail.contractDetail[index].month = item.contractDate1.substring(4, 6);
            this.$set(
              item,
              "MYzd",
              item.year +
                "" +
                ((item.month + "").length > 1 ? item.month : "0" + item.month)
            );
          });
          this.yearTableData = this.groupingData(
            this.contractDetail.contractDetail,
            "year"
          );
          this.tableData22.theadList = [
            {
              label: "",
              prop: "date",
            },
          ];
          this.yearTableData.forEach((item, index) => {
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
            this.contractDetail.contractDetail.forEach((item1) => {
              this.$set(this.tableData22.dataList[0], "date", "气量(万方)");
              this.$set(this.tableData22.dataList[0], "all", "");
              if(this.form.contractType=='3'){
                this.$set(this.tableData22.dataList[1], "date", "单价(元/方)");
                this.$set(this.tableData22.dataList[1], "all", "");
              }
              this.$set(
                this.tableData22.dataList[0],
                item1.MYzd + "",
                item1.volume
              );
              if(this.form.contractType=='3'){
                this.$set(
                    this.tableData22.dataList[1],
                    item1.MYzd + "",
                    item1.price
                );
              }
            });
          });
          this.tableData22.dataList[0].all = this.contractDetail.contractDetailAmount?this.contractDetail.contractDetailAmount:0;
           this.jisuanAll()
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
    groupingData(data, filed) {
      // map用来保存存过的字段 为下边添加新对象或者将相同字段的数据保存到同一个list中
      let map = {};
      let dest = [];
      data.forEach((item) => {
        // 判断map对象中是否有遍历时data的key 如果没有则向dest数组中推入一个新的对象
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
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    backGo(){
        this.$emit('backGo')
    }
  },
};
</script>
<style lang='scss' scoped>
.add-agreement {
  background: #ffffff;
  margin: 20px;
  border-radius: 4px;
      padding-bottom: 20px;
  .add-agreement-top {
     height: 66px;
       line-height: 66px;
       padding: 0 20px;
       border-bottom: 1px solid #E4E7ED;
    .goback {
      margin-right: 10px;
        font-size: 18px;
        color: #409EFF;
        cursor: pointer;
        font-weight: 700;
        vertical-align: top;
        .el-icon-back{
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
   .form-content{
    padding: 0 20px;
  }
   /deep/.el-form-item{
    margin-bottom: 1px;
  }
    /deep/ .el-table__body{
      .el-input__inner{
          text-align: center;
      }
      tr td{
      text-align: center;
     }
  }
  .custom-table-n {
       /deep/ th:nth-last-child(2){
      border-right:1px solid #DCDFE6;
    }
  } 
  
  .el-table thead.is-group th{
          background: #EBEEF5;
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
   /deep/ .el-table th.is-leaf{
    background:  #EBEEF5;
  }
  /deep/.el-table thead.is-group th{
      text-align: center;
      background: #EBEEF5;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
  .el-range-editor.el-input__inner {
    width: 100%;
  }
  .remark-block{
         background: #EBEEF5;
        padding: 20px;
        margin: 30px 10px;
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
    .block-lline {
      border-bottom: 1px solid #dcdfe6;
      margin-top: 10px;
    }
    .block-title {
     padding: 0 10px;
      line-height: 16px;
      color: #303133;
      font-weight: 600;
      height: 16px;
      border-left: 6px solid #47a87d;
      margin-bottom: 20px;
    }
    .block-title-subtitle {
      margin: 10px;
      color: #303133;
      .cirl {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #47a87d;
      }
      padding: 0 10px;
    }
    .block-content {
      padding: 20px;
      padding-bottom: 0;
      padding-top: 2px;
      .block-item {
        display: flex;
        flex-wrap: wrap;
      }
      .item-list {
        width: 33%;
        .unit {
          position: absolute;
          right: 10px;
          color: #909399;
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
      margin-top: -18px;
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
