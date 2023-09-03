<template>
  <div class=" deploy-add-new">
    <div class="detail-title">
      <div class="title-left"></div>
    </div>
    <div class="detail-content loser-detail">
      <el-steps :active="stepActive" align-center>
        <el-step title="基本信息" description=""> </el-step>
        <el-step title="购销合同政策" description=""> </el-step>
        <el-step v-if="NoheatingEndjumin || heatingEndjumin" title="居民气量" description=""></el-step>
      </el-steps>
      <el-form ref="formF" :rules="rules" :model="formF">
        <div v-if="stepActive === 1" class="purchases-deploy-step1">
          <div class="step-content">
           <div class=" block-title">
            供应商信息
          </div>
          <div class="step-item-block">
            <el-form-item label="供应商名称：" class="item-list" prop="codeTxt">
                <el-select
                  v-model="formF.codeTxt"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入供应商名称"
                  @change="handleSelectChangeEvent"
                  @focus="handleSelectChangeEvent"
                  :remote-method="supplierGetProvider"
                  clearable
                >
                  <el-option
                    v-for="item in supplierNameList"
                    :key="item.providerCode + '9a'"
                    :label="item.providerName"
                    :value="item.providerCode"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="供应商编码：" class="item-list" prop="code">
              <el-input disabled placeholder="请输入供应商编码" v-model="formF.code"></el-input>
            </el-form-item>
            <el-form-item label="供应商简称：" class="item-list" prop="codeShorterTxt">
              <el-input clearable placeholder="请输入供应商简称" v-model="formF.codeShorterTxt"></el-input>
            </el-form-item>
          </div>
          <div class="step-item-block">
            <el-form-item
            label="接气门站："
            class="lower-gas-point item-list"
          >
            <el-select
              v-model="formF.downGasPlace"
              multiple
              clearable
              placeholder="请选择站点"
            >
              <el-option
                v-for="item in optionsList"
                :key="item.stationCode+'p1'"
                :label="item.stationName"
                :value="item.stationCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
            <el-form-item
              label="基准门站价："
              class="item-list"
              prop="baseGasPrice"
            >
              <el-input
                type="number"
                clearable
                placeholder="请输入门站价"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                v-model="formF.baseGasPrice"
              ></el-input>
              <span class="custom-unit">元/方</span>
            </el-form-item>
            <el-form-item
              label="管输费："
              class="item-list"
              prop="pipelinePrice"
            >
              <el-input
                type="number"
                clearable
                placeholder="请输入管输费"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                v-model="formF.pipelinePrice"
              ></el-input>
              <span class="custom-unit">元/方</span>
            </el-form-item>
          </div>
          <div class="step-item-block">
            <el-form-item
              label="夏冬供气比："
              class="item-list"
              prop="gasSupply"
            >
              <el-input clearable placeholder="请输入供气比" v-model="formF.gasSupply"></el-input>
            </el-form-item>
          </div>
          </div>
          <el-form-item class="step1-btn">
            <el-button type="primary" @click="step1Next1('formF')"
              >下一步</el-button
            >
          </el-form-item>
        </div>
      </el-form>
      <el-form ref="form1" :rules="rules" :model="form1">
        <div class="purchases-deploy-step2" v-if="stepActive === 2">
        <div class="step-content">
          <div class="non-heating-season block-title">
            非供暖季
            <span>{{"04/01"}} - {{"10/30"}}</span>
          </div>
          <div class="gas-type">
            <el-form-item
              label="气量类型："
              class=" calculate"
              prop="calculateStylev"
            >
              <el-cascader
                :options="calculateStyle"
                v-model="form1.calculateStylev"
                :props="optionProps"
                @change="calculateStyleChange"
                ref="cascaderAddr"
                clearable
                placeholder="请选择气量类型"  
              ></el-cascader>
            </el-form-item>
          </div>
          <div class="balance-ratio">
            <div class="step-item-block">
            <el-form-item
            label="均衡量计算系数"
            class="lower-gas-point item-list"
            prop="NbalanceCoefficient"
            v-if="changeEquilibriumN.equilibrium1"
          >
             <el-input
                type="number" 
                placeholder="请输入计算系数"
                controls-position="right"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                v-model="form1.NbalanceCoefficient"
              ></el-input>
              
          </el-form-item>
            <el-form-item
              label="均衡1/均衡量比例"
              class="item-list"
              prop="Nbalance1Scale"
              v-if="changeEquilibriumN.equilibrium1"
            >
             <el-input
                placeholder="请输入比例"
                type="number" 
                controls-position="right"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                v-model="form1.Nbalance1Scale"
              ></el-input>
              <span class="unit">%</span>
            </el-form-item>
            <el-form-item
              label="均衡2/均衡量比例"
              class="item-list"
              prop="Nbalance2Scale"
              v-if="changeEquilibriumN.equilibrium2"
            >
              <el-input
               placeholder="请输入比例"
                type="number"
                controls-position="right"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)} "
                v-model="form1.Nbalance2Scale"
              ></el-input>
              <span class="unit">%</span>
            </el-form-item>           
          </div>
          <div class="step-item-block">
              <el-form-item
              label="均衡3/均衡量比例"
              class="item-list"
              prop="Nbalance3Scale"
              v-if="changeEquilibriumN.equilibrium3"
            >
              <el-input
               placeholder="请输入比例"
                type="number"
                controls-position="right"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                v-model="form1.Nbalance3Scale"
              ></el-input>
              <span class="unit">%</span>
            </el-form-item>
          </div>
          </div>
          <el-form-item label-width="0" prop="getPriceReportDataNo">
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
              prop="customerName"
              label="名称"
              align="left"
              width="90px"
              >
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
              width="150px"
              >
              <template v-slot="{  row }">
                  <el-form-item class="table-form-cun item-list" :prop="`${row.customIndex!=='tempIndex'?`getPriceReportDataNo${getPathByKey(row.customIndex,'customIndex',form1.getPriceReportDataNo)}.price`:''}`" 
                   :rules="[{required: true, message: '请输入价格上浮动比例',  trigger: 'change', },]">  
                  <el-input-number
                  controls-position="right"
                   v-model="row.price" :min="0" :precision="2">
                  </el-input-number>
                 </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="changeM"
              label="生效月份"
              align="center"
              >
              <template v-slot="{  row }">
                  <el-form-item label="" class="item-list" :prop="`${row.customIndex!=='tempIndex'?`getPriceReportDataNo${getPathByKey(row.customIndex,'customIndex',form1.getPriceReportDataNo)}.changeM`:''}`"
                   :rules="[
                                {
                                  required: true,
                                  message: '请输入生效月份',
                                  trigger: 'change',
                                },
                              ]">
                      <el-cascader
                        :options="row.mounth"
                        v-model="row.changeM"
                        :props="{
                          multiple: true,
                          checkStrictly: true,
                        }"
                         @remove-tag='quedingC(row,row.$index,$event)'
                        @visible-change='queding(row,row.$index,$event)'
                        ref="cascaderAddr1"
                        clearable
                      ></el-cascader>
                    </el-form-item> 
              </template>
            </el-table-column>
          </el-table>
          </el-form-item>      
          <div class="heating-season block-title">   
            供暖季
             <span>{{"11/01"}} - {{"03/31"}}</span>
          </div>
          <div class="gas-type">
            <el-form-item
              label="气量类型："
              class="calculate"
              prop="NcalculateStylev"
            >
              <el-cascader
                :options="NcalculateStyle"
                v-model="form1.NcalculateStylev"
                :props="optionProps"
                @change="NocalculateStyleChange"
                ref="cascaderAddr"
                clearable
                 placeholder="请选择气量类型"
              ></el-cascader>
            </el-form-item>
          </div>
          <div class="step-item-block">
            <el-form-item
            label="均衡量计算系数"
            class="lower-gas-point item-list"
            prop="balanceCoefficient"
            v-if="changeEquilibrium.equilibrium1"
          >
             <!-- <el-input-number
                type="number" :min="1" :precision="2"
                 placeholder="请输入均衡量计算系数"
                controls-position="right"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<0){value=value.slice(0,1)} "
                v-model="form1.balanceCoefficient"
              ></el-input-number> -->
              <el-input
                type="number" 
                 placeholder="请输入计算系数"
                controls-position="right"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                v-model="form1.balanceCoefficient"
              ></el-input>
          </el-form-item>
            <el-form-item
              label="均衡1/均衡量比例"
              class="item-list"
              prop="balance1Scale"
              v-if="changeEquilibrium.equilibrium1"
            >
             <!-- <el-input-number
                placeholder="请输入均衡1/均衡量比例"
                type="number" :min="1" :precision="2"
                controls-position="right"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                v-model="form1.balance1Scale"
              ></el-input-number> -->
              <el-input
                placeholder="请输入比例"
                type="number"
                controls-position="right"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                v-model="form1.balance1Scale"
              ></el-input>
              <span class="unit">%</span>
            </el-form-item>
            <el-form-item
              label="均衡2/均衡量比例"
              class="item-list"
              prop="balance2Scale"
              v-if="changeEquilibrium.equilibrium2"
            >
              <el-input
               placeholder="请输入比例"
                type="number"
                controls-position="right"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                v-model="form1.balance2Scale"
              ></el-input>
              <span class="unit">%</span>
            </el-form-item>
          </div>
          <div class="step-item-block">
              <el-form-item
              label="均衡3/均衡量比例"
              class="item-list"
              prop="balance3Scale"
              v-if="changeEquilibrium.equilibrium3"
            >
              <el-input
               placeholder="请输入比例"
                type="number"
                controls-position="right"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                v-model="form1.balance3Scale"
              ></el-input>
              <span class="unit">%</span>
            </el-form-item>
          </div>
          <el-form-item label-width="0" prop="getPriceReportData1">
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
                }">
                <el-table-column
                prop="customerName"
                label="名称"
                align="left"
                width="90px"
                >
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
                width="150px"
                >
                <template v-slot="{  row }">
                     <el-form-item class="table-form-cun item-list" :prop="`${row.customIndex!=='tempIndex'?`getPriceReportData1${getPathByKey(row.customIndex,'customIndex',form1.getPriceReportData1)}.price`:''}`" 
                     :rules="[{required: true,  message: '请输入价格上浮动比例',  trigger: 'change', },]"> 
                    <el-input-number
                        controls-position="right"
                        v-model="row.price" :min="0" :precision="2">  
                    </el-input-number>
                     </el-form-item>
                </template>
                </el-table-column>
                <el-table-column
                prop="contractNo"
                label="生效月份"
                align="center"
                >
                <template v-slot="{  row }">
                    <el-form-item label="" class="item-list" :prop="`${row.customIndex!=='tempIndex'?`getPriceReportData1${getPathByKey(row.customIndex,'customIndex',form1.getPriceReportData1)}.changeM`:''}`"
                    :rules="[{ required: true, message: '请输入生效月份',  trigger: 'change', },]">
                        <el-cascader
                            :options="row.mounth"
                            v-model="row.changeM"
                            :props="{
                            multiple: true,
                            checkStrictly: true,}"
                            ref="cascaderAddr1"
                             @remove-tag='queding1C(row,row.$index,$event)'
                            @visible-change='queding1(row,row.$index,$event)'
                            clearable
                        ></el-cascader>
                    </el-form-item> 
                </template>
                </el-table-column>
            </el-table>
          </el-form-item>
          <div>
         <div class="heating-season block-title"> 
            附加条件
          </div>
          <div class="step-item-block">
              <el-form-item
              label="总用气量最小值"
              class="item-list" 
            >
              <el-input-number
               placeholder="请输入最小值"
                type="number"
                controls-position="right"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<1){value=value.slice(0,1)} "
                v-model="form1.sumGasMin"
              ></el-input-number>
              <span class="unit">万方</span>
            </el-form-item>
            <el-form-item
              label="总用气量最大值"
              class="item-list" 
            >
              <el-input-number
               placeholder="请输入最大值"
                type="number"
                controls-position="right"
                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<1){value=value.slice(0,1)} "
                v-model="form1.sumGasMax"
              ></el-input-number>
              <span class="unit">万方</span>
            </el-form-item>
          </div>
          </div>
        </div>
          <el-form-item class="step1-btn">
            <el-button @click="firstBtn">上一步</el-button>
            <el-button v-if="this.NoheatingEndjumin || this.heatingEndjumin" type="primary" @click="step2Submit('form1')" v-trace="{title:'气源采购-采购配置-点击供应商设置-提交'}"
              >下一步</el-button
            >
            <el-button v-else type="primary" @click="step2Submit('form1')" v-trace="{title:'气源采购-采购配置-点击供应商设置-提交'}"
              >提交</el-button
            >
          </el-form-item>
        </div>
      </el-form>
      <!-- 步骤三 -->
      <el-form ref="formT" :model="formT" :rules="rules">
        <div class="purchases-deploy-step3 step3-new" v-if="stepActive === 3">
          <div class="step-content">
            <div class="step3-item-block">
              <template v-if="NoheatingEndjumin">
                 <div
                      v-for="(item, index) in formT.setMouth1"
                      :key="index+'l'"
                      class="item-list"
                    >
                      <el-form-item :label="item.label+'气量'"
                         :prop="'setMouth1.' + index + '.residents_gas'"
                            :rules="[{ required: true, message: '请输入气量',},]">
                        <el-input type="number" v-model="item.residents_gas"></el-input>
                      </el-form-item>
                    </div>
               </template>
              <template v-if="heatingEndjumin">
                  <div
                    v-for="(item, index) in formT.setMouth2"
                    :key="index"
                    class="item-list">
                    <el-form-item :label="item.label +'气量'"  :prop="'setMouth2.' + index + '.residents_gas'"
                    :rules="[{required: true, message: '请输入气量',},]">
                      <el-input type="number" v-model="item.residents_gas"></el-input>
                    </el-form-item>
                  </div>
              </template>
          </div>
          </div>
          <div class="step1-btn">
            <el-button @click="secondBtn">上一步</el-button>
            <el-button class="primary-btn" type="primary" @click="submitBtn('formT')"
              >提交</el-button>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import api from "/src/http/api";
import qiyuanApi from "/src/http/qiyuanApi";
import {setIndex,getPathByKey} from "../utils/commen"
export default {
  name: "reply",
  data: function () {
    return {
      getPathByKey:getPathByKey,
      optionProps: {
        value: "value",
        label: "name",
        children: "",
        multiple: true,
        checkStrictly: true,
      },
      form1: {
        getPriceReportDataNo: [],
        getPriceReportData1: [],
        calculateStylev: "",
        NcalculateStylev: "", //采暖季
        // 非采暖季均衡系数
        NbalanceCoefficient:undefined,//非采暖季均衡系数
        Nbalance1Scale:undefined,//非采暖季均衡1比例
        Nbalance2Scale:undefined,//非采暖季均衡2比例
        Nbalance3Scale:undefined,//非采暖季均衡3比例
        // 采暖季均衡系数
        balanceCoefficient:undefined,//非采暖季均衡系数
        balance1Scale:undefined,//非采暖季均衡1比例
        balance2Scale:undefined,//非采暖季均衡2比例
        balance3Scale:undefined,//非采暖季均衡3比例
        sumGasMin:undefined,
        sumGasMax:undefined
      },
      formF: {
        codeTxt: "",//供应商
        code: "", //供应商code
        codeShorterTxt:'',//供应商code
        downGasPlace: [], //下气站点，多个用逗哥隔开
        gasSupply: "", //冬夏供气比
        baseGasPrice: "", //基准门站价
        pipelinePrice: "", //管输费
      },
      stepActive: 1,
      form: {
        baseGasNum: "", //可调配（是：有需要数值【小数点】。 否：没有具体数值）
        baseGasPrice: "", //基准门站价
        code: "", //供应商编码
        codeOrder: 0, //供应商顺序
        codeTxt: "", //供应商
        codeShorterTxt:'',
        creator: "", //创建人
        deviationNum: "", //偏差系数，小数点
        downGasPlace: "", //下气站点，多个用逗哥隔开
        funText: {}, //计算公式json格式
        gasSupply: "", //冬夏供气比
        heatingEndTime: "", //采暖季结束时间
        heatingMethod: "", //采暖计量方式
        heatingStartTime: "", //采暖季开始时间
        id: 0, //主键
        modifier: "", //修改人
        noHeatingEndTime: "", //非采暖季结束时间
        noHeatingMethod: "", //非采暖季计量方式
        noHeatingStartTime: "", //非采暖季开始时间
        pipelinePrice: "", //管输费
        averageDayNum: "", //初始日均值
        smartAdoptCalculateResidentGas: {
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
      downGasPlace: "",
      balance1V2: "",
      balance1V1: "",
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
      optionsList: [],// 天然气下气点
      deployed: "01",
      NoheatingEndjumin: false, // 非采暖季是否选择了居民方式
      heatingEndjumin: false, // 采暖季是否选择了居民方式
      calculateStyle: [],
      NcalculateStyle: [],
      NcalculateStylechange: {
      },
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
      iSShowStock: "", //存量用户展示
      iSShowincrement: "", //增量用户展示
      iSShowresident: "", //居民气量
      iSShowbalanced: "", // 均衡气量
      iSShowpeakRegulation: "", // 调峰气量
      isSubmitSuccess: "1", //提交成功
      isSubmit: false,
      SubmitSuccessData: "", //提交成功返回数据
      rules: {
        code: [{ required: true, message: "请输入供应商编码", trigger: "change" }],
        codeTxt: [
          { required: true, message: "请输入供应商名称", trigger: "change" },
        ],
        codeShorterTxt: [
          { required: true, message: "请输入供应商简称", trigger: "blur" },
        ],
        calculateStylev: [
          { required: true, message: "请输入气量类型", trigger: "change" },
        ],
        NcalculateStylev: [
          { required: true, message: "请输入气量类型", trigger: "change" },
        ],
         NbalanceCoefficient: [
          { required: true, message: "请输入非采暖季均衡系数", trigger: "change" },
           {pattern:/^\d+(\.\d+)?$/,message: "不能输入负数",trigger: "blur"}
        ],
        Nbalance1Scale:[
          { required: true, message: "请输入非采暖季均衡1比例", trigger: "change" },
           {pattern:/^\d+(\.\d+)?$/,message: "不能输入负数",trigger: "blur"}
        ],
        Nbalance2Scale:[
          { required: true, message: "请输入非采暖季均衡2比例", trigger: "change" },
        ],
        Nbalance3Scale:[
          { required: true, message: "请输入非采暖季均衡3比例", trigger: "change" },
           {pattern:/^\d+(\.\d+)?$/,message: "不能输入负数",trigger: "blur"}
        ],
          balanceCoefficient: [
          { required: true, message: "请输入采暖季均衡系数", trigger: "change" },
          {pattern:/^\d+(\.\d+)?$/,message: "不能输入负数",trigger: "blur"}
        ],
        balance1Scale:[
          { required: true, message: "请输入采暖季均衡1比例", trigger: "change" },
          {pattern:/^\d+(\.\d+)?$/,message: "不能输入负数",trigger: "blur"}
        ],
        balance2Scale:[
          { required: true, message: "请输入采暖季均衡2比例", trigger: "change" },
          {pattern:/^\d+(\.\d+)?$/,message: "不能输入负数",trigger: "blur"}
        ],
        balance3Scale:[
          { required: true, message: "请输入采暖季均衡3比例", trigger: "change" },
          {pattern:/^\d+(\.\d+)?$/,message: "不能输入负数",trigger: "blur"}
        ],
        gasSupply: [
          { required: true, message: "请输入冬夏供气比", trigger: "change" },
          { pattern: /^\d+:|：\d+$/, message: "请输入正确的格式",trigger: "blur"},],
        downGasPlace: [
          { required: true, message: "请选择接气门站", trigger: "change" },
        ],
        baseGasPrice: [
          { required: true, message: "请输入基准门站价", trigger: "change" },
          {pattern:/^\d+(\.\d+)?$/,message: "不能输入负数",trigger: "blur"}
        ], //基准门站价
        pipelinePrice: [
          { required: true, message: "请输入管输费", trigger: "change" },
          {pattern:/^\d+(\.\d+)?$/,message: "不能输入负数",trigger: "blur"}
        ], //管输费
        sumGasMin:[
           { required: true, message: "请输入总气量最小值", trigger: "change" },
            {pattern:/^[0-9]*[1-9][0-9]*$/,message: "请输入正整数",trigger: "blur"}
        ],
        sumGasMax:[
           { required: true, message: "请输入总气量最大值", trigger: "change" },
            {pattern:/^[0-9]*[1-9][0-9]*$/,message: "请输入正整数",trigger: "blur"}
        ]
      },
      curYear:'',//当前年
      nextYear:'',//下一年 
      changeEquilibrium:{},
      changeEquilibriumN:{},
      supplierData:'',//获取详情数据
      supplierNameList:'',//供应商数据
    };
  },
  components: {},
  props: ["isEdit","setComponyArray","searchYear"],
  created() {
    this.apiqiyuan()// 获取下气点
    this.supplierGetGasType();
    let getdate = new Date();
    this.curYear = getdate.getFullYear();
    this.nextYear = getdate.getFullYear() +1;
    this.supplierGetProvider('')
    if(this.isEdit){
         this.getSupperq();
    }
  },
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom;
    },
    curComInfo: function () {
      return this.$store.getters.curComInfo;
    },
    userInfo: function () {
      return this.$store.getters.userInfo
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
  methods: {
    handleSelectChangeEvent(val) {
      this.supplierNameList.forEach((item) => {
        if (item.providerCode == val) {
          this.formF.code = item.providerCode;
          this.formF.codeTxt = item.providerName;
          this.formF.codeShorterTxt = item.providerShortName
          this.supplierGetGasSupply(this.formF.code,this.formF.codeTxt)
        }
      });
    },
    //   回显选中
    huixian(item){
        if(item){
            if(item.changeM.length<item.mounth.length){
                if( item.childs && item.childs.length>0){
                   item.childs[0].mounth.forEach((Mitem,index)=>{
                         item.changeM.forEach(Vitem=>{
                         if(Mitem.value == Vitem){
                           item.childs[0].mounth[index].disabled = true
                         }
                      })
                    })   
                } 
            }
        }
    },  
    supplierGetGasSupply(code,name){
        let year = this.searchYear
          ? typeof this.searchYear == "string"
            ? this.searchYear
            : this.searchYear.getFullYear()
          : ""
        let data = {
            level:this.curComInfo.orgLevel,
            managerCode:this.curComCode,
            providerName:name,
            providerCode:code,
            year:year
        }
        api.purchasesDeploy.supplierGetGasSupply(data).then((res)=>{
            if(res){
                this.formF.gasSupply = res[0]
            }
        }) 
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
           }
       })
    },
    supplierGetProvider(inputValue){
        let data = {
            level:this.curComInfo.orgLevel,
            managerCode:this.curComCode,
            providerName:inputValue,
            year:''
        }
        api.purchasesDeploy.supplierGetProvider(data).then((res)=>{
            if(res){
                this.supplierNameList = res
            }
        })
    },
    // 详情
    getSupperq() {
      this.supplierData = []
      let datalList = {
        id: this.setComponyArray.id,
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
                obj.changeM = this.formatData(item.month)
                obj.type = item.type //采暖季
                obj.rowKey = Math.random().toString();
                obj.equilibriumRatio = item.equilibriumRatio
                obj.childs = []
                this.changeEquilibrium = changeObj
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
                    obj1.changeM = this.formatData(item1.month)
                    obj1.type = item1.type //采暖季
                    obj1.equilibriumRatio = item1.equilibriumRatio
                    obj1.rowKey = Math.random().toString();
                    obj.childs.push(obj1);
                });
              }
              this.form1.getPriceReportData1.push(obj);
              setIndex(this.form1.getPriceReportData1)
               let equilibriumC1 = {
                    equilibrium1:'',
                    equilibrium2:'',
                    equilibrium3:''
                }
                let changeObj = {}
                this.form1.getPriceReportData1.forEach(item=>{
                    for(let i in equilibriumC1){
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
                let equilibriumC = {
                        equilibrium1:'',
                        equilibrium2:'',
                        equilibrium3:''
                    }
                let changeObj = {}
                this.form1.getPriceReportDataNo.forEach(item=>{
                    for(let i in equilibriumC){
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
            setIndex(this.form1.getPriceReportDataNo)
            this.form1.getPriceReportData1.forEach((item,index)=>{
            }) 
          });
          this.formT.setMouth1.forEach((item) => {
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
          this.formT.setMouth2.forEach((item) => {
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
          let getnoHeatingMethod = this.formatData(
            this.supplierData[0].noHeatingGasType?this.supplierData[0].noHeatingGasType:''
          );
          let getHeatingMethod = this.formatData(
            this.supplierData[0].heatingGasType?this.supplierData[0].heatingGasType:''
          );
          this.form = this.supplierData[0];
          this.formF.downGasPlace = this.form.downGasPlace
            ? this.form.downGasPlace.split(",")
            : "";
            this.form1.calculateStylev = this.form.noHeatingGasType
            ? this.form.noHeatingGasType.split(",")
            : "";
            this.form1.NcalculateStylev = this.form.heatingGasType
            ? this.form.heatingGasType.split(",")
            : "";
            this.hasResidents(this.form1.calculateStylev,this.form1.NcalculateStylev)
            this.form1.balanceCoefficient = this.form.equilibriumCoefficient
            this.form1.NbalanceCoefficient = this.form.noHeatingEquilibriumCoefficient
            this.form1.sumGasMax = this.form.sumGasMax ==null?undefined:this.form.sumGasMax
            this.form1.sumGasMin = this.form.sumGasMin ==null?undefined:this.form.sumGasMin
            this.formF.baseGasPrice = this.form.baseGasPrice;
            this.formF.gasSupply = this.form.gasSupply; //冬夏供气比
            this.formF.pipelinePrice = this.form.pipelinePrice; //管输费
            this.formF.codeTxt = this.form.codeTxt
            this.formF.codeShorterTxt = this.form.codeShorterTxt
            this.formF.code = this.form.code
        }
      });
    },
    formatData(element) {
      let noHeatingMethod = element.split(",");
      let noHeatingMethodD = [];
      noHeatingMethod.forEach((item) => {
        let itemA = [];
        itemA.push(item);
        noHeatingMethodD.push(itemA);
      });
      return noHeatingMethodD;
    },
    handleChange(){},
    queding1(val,index,event){
     if(!event){
        this.handleChange1(val,index)
      }else{
            return
      }
    },
    queding(val,index,event){
        if(!event){
            this.handleChange(val,index)
        }else{
            return
        } 
    },
    queding1C(val,index){
      this.$nextTick(() => {
        this.handleChange1(val,index)
      })
    },
    quedingC(val,index){
      this.$nextTick(() => {
        this.handleChange(val,index)
      })
    },
    handleChange(val) {
      if(val.childs){
        if(val.changeM.length==7){
           this.form1.getPriceReportDataNo.forEach((item,index1)=>{
             if(item.gasType == val.gasType){
               this.form1.getPriceReportDataNo[index1].childs = []
             }
           })
        }else{
            this.form1.getPriceReportDataNo.forEach((item,ind)=>{
                item.rowKey = Math.random().toString();
                if(item.gasType == val.gasType){
                  this.form1.getPriceReportDataNo[ind].childs = []
                    let obj = {}
                    obj.gasType = val.gasType
                    obj.price = ""
                    obj.gas = ""
                    obj.childIndex = item.childs.length
                    obj.index1 = val.index1
                    obj.mounth = JSON.parse(JSON.stringify(this.balance3)) 
                    obj.changeM = ""
                    obj.equilibriumRatio = ''
                    obj.type = 0
                    item.childs.push(obj)
                    item.childs.forEach(item1=>{
                        item1.rowKey = Math.random().toString();
                    })
                       item.childs[0].mounth.forEach((Mitem,index)=>{
                         item.changeM.forEach(Vitem=>{
                         if(Mitem.value == Vitem){
                           item.childs[0].mounth[index].disabled = true
                         }
                      })
                    })
                }
            })
        } 
      }else{
        let tempArr = []
        val.mounth.forEach(item=>{
          if(item.disabled){
             tempArr.push(item.value)
          }
        })
          this.form1.getPriceReportDataNo.forEach((item,ind)=>{
            item.rowKey = Math.random().toString();
            if(item.gasType == val.gasType){
               if(item.childs.length - val.childIndex>1){
                   if(val.childIndex+1){
                        item.childs.splice(val.childIndex+1,5)
                   }  
               }
              let asd  = item.childs[val.childIndex].changeM.flat()
              let tempArr1 = [...tempArr,...asd]
                   let obj = {}
                obj.gasType = val.gasType
                obj.price = ""
                obj.gas = ""
                obj.childIndex = item.childs.length
                obj.index1 = val.index1
                obj.mounth = JSON.parse(JSON.stringify(this.balance3))
                obj.changeM = ""
                obj.type = 0 
                obj.equilibriumRatio = ''
                item.childs.push(obj)
                item.childs.forEach(item1=>{
                   item1.rowKey = Math.random().toString();
                })
                item.childs[val.childIndex+1].mounth.forEach((element,index) => {
                tempArr1.forEach(item2=>{
                    if(element.value ==item2){
                      (item.childs[val.childIndex+1]).mounth[index].disabled = true
                    }
                  })
                });
                if(tempArr1.length > 6 ){
                    item.childs.pop()
                }
            }
        })
      } 
      setIndex(this.form1.getPriceReportDataNo)
    },
    handleChange1(val) {
      if(val.childs){
        if(val.changeM.length == 5){
           this.form1.getPriceReportData1.forEach((item,index1)=>{
             if(item.gasType == val.gasType){
               this.form1.getPriceReportData1[index1].childs = []
             }
           })
        }else{
            this.form1.getPriceReportData1.forEach((item,ind)=>{
                item.rowKey = Math.random().toString();
                if(item.gasType == val.gasType){
                  this.form1.getPriceReportData1[ind].childs = []
                    let obj = {}
                    obj.gasType = val.gasType
                    obj.price = ""
                    obj.gas = ""
                    obj.childIndex = item.childs.length
                    obj.index1 = val.index1
                    obj.mounth = JSON.parse(JSON.stringify(this.balance2)) 
                    obj.changeM = ""
                    obj.equilibriumRatio = ''
                    obj.type = 1
                    item.childs.push(obj)
                    item.childs.forEach(item1=>{
                        item1.rowKey = Math.random().toString();
                    })
                       item.childs[0].mounth.forEach((Mitem,index)=>{
                         item.changeM.forEach(Vitem=>{
                         if(Mitem.value == Vitem){
                           item.childs[0].mounth[index].disabled = true
                         }
                      })
                    })
                }
            })
        } 
      }else{
        let tempArr = []
        val.mounth.forEach(item=>{
          if(item.disabled){
             tempArr.push(item.value)
          }
        })
          this.form1.getPriceReportData1.forEach((item,ind)=>{
            item.rowKey = Math.random().toString();
            if(item.gasType == val.gasType){
               if(item.childs.length - val.childIndex>1){
                   if(val.childIndex+1){
                      item.childs.splice(val.childIndex+1,5)
                   }   
               }
              let asd  = item.childs[val.childIndex].changeM.flat()
              let tempArr1 = [...tempArr,...asd]
                let obj = {}
                obj.gasType = val.gasType
                obj.price = ""
                obj.gas = ""
                obj.childIndex = item.childs.length
                obj.index1 = val.index1
                obj.mounth = JSON.parse(JSON.stringify(this.balance2))
                obj.changeM = ""
                obj.type = 1
                obj.equilibriumRatio = ''
                item.childs.push(obj)
                item.childs.forEach(item1=>{
                    item1.rowKey = Math.random().toString();
                })
                item.childs[val.childIndex+1].mounth.forEach((element,index) => {
                tempArr1.forEach(item2=>{
                    if(element.value ==item2){
                      (item.childs[val.childIndex+1]).mounth[index].disabled = true
                    }
                  })
                });
                if(tempArr1.length >4 ){
                    item.childs.pop()
                }
            }
        })
      } 
      setIndex(this.form1.getPriceReportData1)
    },
    firstBtn() {
      this.stepActive = 1;
    },
    secondBtn() {
      this.stepActive = 2;
    },
    //  判断是否展示居民步骤
    hasResidents(calculateStylev,NcalculateStylev){
         let noheathing = calculateStylev? calculateStylev.join(","): "";
          if (noheathing.indexOf("residents") != -1) {
            this.NoheatingEndjumin = true;
          }else{
            this.NoheatingEndjumin = false;
          }
          // 采暖季
          let heathing = NcalculateStylev
            ? NcalculateStylev.join(",")
            : "";
          if (heathing.indexOf("residents") != -1) {
            this.heatingEndjumin = true;
          }else{
            this.heatingEndjumin = false;
          }
    },
    // 第二步提交
    step2Submit(formName) { 
      this.$refs[formName].validate((valid) => {
        if (valid) {  
          let flag = false
          let flag_1 = false
            if(this.changeEquilibriumN.equilibrium1 || this.changeEquilibriumN.equilibrium2 ||this.changeEquilibriumN.equilibrium3){
             let ratio =  0
              ratio = (this.form1.Nbalance1Scale?Number(this.form1.Nbalance1Scale):0) + (this.form1.Nbalance2Scale?Number(this.form1.Nbalance2Scale):0)+ (this.form1.Nbalance3Scale?Number(this.form1.Nbalance3Scale):0)
              if(ratio!=100){
                    this.$message({
                            message: "非供暖季均衡量比例必须等于100",
                            type: "error",
                            duration: 1000,
                        });
                }else{
                   flag = true
                } 
            }else {
              flag = true
            }
            if(this.changeEquilibrium.equilibrium1 || this.changeEquilibrium.equilibrium2 ||this.changeEquilibrium.equilibrium3){
                    let ratio1 = 0
                    ratio1 = (this.form1.balance2Scale?Number(this.form1.balance2Scale):0)+(this.form1.balance1Scale?Number(this.form1.balance1Scale):0)+(this.form1.balance3Scale?Number(this.form1.balance3Scale):0)
                        if(ratio1!=100){
                            this.$message({
                                    message: "供暖季均衡量比例必须等于100",
                                    type: "error",
                                    duration: 1000,
                                });
                        }else{
                          flag_1 = true
                        } 
                  }else{
                    flag_1 = true
                  }
              if(this.form1.sumGasMax > 9999999){
                this.$message({
                      message: "总用气量最大值超出限制9999999，请调整",
                      type: "error",
                      duration: 1000,
                  });
                  return
              }
              // 判断是否展示居民步骤
              if(flag_1 && flag){
                  this.hasResidents(this.form1.calculateStylev,this.form1.NcalculateStylev)
                  if(this.NoheatingEndjumin || this.heatingEndjumin){
                      this.stepActive = 3; 
                  }else{
                      this.submitBtn(formName)
                  }
              }   
        } else {
          this.$message({
                    message: "请将信息填写完整",
                    type: "error",
                    duration: 1000,
                });
          return false;
        }
      });
    },
    step1Next1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.stepActive = 2;
        } else {
          return false;
        }
      });
    },
    submitSaveData(){
        let getMonthData = {}; 
          if (this.NoheatingEndjumin) {
            this.formT.setMouth1.forEach((element) => {
              let obj = {};
              obj.residents_gas = element.residents_gas;
              getMonthData[element.index] = obj;
            });
          }
           if (this.heatingEndjumin) {
            this.formT.setMouth2.forEach((element) => {
              let obj = {};
              obj.residents_gas = element.residents_gas;
              getMonthData[element.index] = obj;
            });
          }
          let getYear = this.searchYear
          ? typeof this.searchYear == "string"
            ? this.searchYear
            : this.searchYear.getFullYear()
          : ""
          console.log(this.form1.sumGasMax)
          let dats = {
            averageDayNum: 0,
            baseGasPrice: this.formF.baseGasPrice, //基准门站价
            code: this.formF.code, //供应商编码
            codeOrder: this.form.codeOrder, //供应商顺序
            codeTxt: this.formF.codeTxt, //供应商
            codeShorterTxt : this.formF.codeShorterTxt, 
            creator: this.userInfo.name, //创建人
            year:getYear,
            downGasPlace: this.formF.downGasPlace? this.formF.downGasPlace.join(","): "", //下气站点，多个用逗哥隔开
            funText: {},
            gasSupply: this.formF.gasSupply, //冬夏供气比
            gasTypeConfigs: [],
            heatingEndTime: this.nextYear+"-03-01",
            heatingStartTime: this.curYear+"-11-01",
            id: this.form.id?this.form.id:0,
            modifier: this.form.modifier,
            noHeatingEndTime: this.curYear+"-10-30",
            noHeatingStartTime: this.curYear+"-04-01",
            pipelinePrice: this.formF.pipelinePrice,
            sumGasMin:this.form1.sumGasMin?this.form1.sumGasMin:null,
            sumGasMax:this.form1.sumGasMax?this.form1.sumGasMax:null,
            equilibriumCoefficient:this.form1.balanceCoefficient,
            noHeatingEquilibriumCoefficient:this.form1.NbalanceCoefficient,
            smartAdoptCalculateResidentGas: {
              code: this.formF.code,
              codeTxt: this.formF.codeTxt,
              creator: "",
              id: this.form.smartAdoptCalculateResidentGas?this.form.smartAdoptCalculateResidentGas.id:'',
              modifier: this.form.modifier,
              txt: getMonthData,
              year: "",
            },
            status: this.setComponyArray.status?1:0,
            version: this.form.version,
            xaReig: this.curComCode,
            xaReigTxt: "",
          };
          let getPriceReportDataNo = JSON.parse(JSON.stringify(this.form1.getPriceReportDataNo))
             getPriceReportDataNo.forEach(item=>{
               if(item.gasType =='equilibrium1'){
                    item.equilibriumRatio = this.form1.Nbalance1Scale
               }else if(item.gasType =='equilibrium2'){
                    item.equilibriumRatio = this.form1.Nbalance2Scale
               }else if(item.gasType =='equilibrium3'){
                    item.equilibriumRatio = this.form1.Nbalance3Scale
               }
                if (item.childs && item.childs.length>0) {
                  let obj = {}
                  item.childs.unshift(item)
                }
           })  
            let getPriceReportData1 = JSON.parse(JSON.stringify(this.form1.getPriceReportData1))
            getPriceReportData1.forEach(item=>{
                if(item.gasType =='equilibrium1'){
                        item.equilibriumRatio = this.form1.balance1Scale
                }else if(item.gasType =='equilibrium2'){
                        item.equilibriumRatio = this.form1.balance2Scale
                }else if(item.gasType =='equilibrium3'){
                        item.equilibriumRatio = this.form1.balance3Scale
                }
                if (item.childs && item.childs.length>0) {
                  item.childs.unshift(item)
                }
            }) 
          let arrCon = [
            ...getPriceReportDataNo,
            ...getPriceReportData1,
          ];
          arrCon.forEach((item, index) => {  
            if (item.childs && item.childs.length>0) {
              item.childs.forEach((item1) => {
                let obj = {};
                  obj.gasNum = item1.gas;
                  obj.gasTypeName = this.NcalculateStylechange[item.gasType]
                  obj.gasTypeValue = item.gasType
                  obj.id = item.id?item.id:0
                  obj.month = item1.changeM ? item1.changeM.join(",") : ""
                  obj.priceNum = item1.price
                  obj.smartSupplierConfigId = item.smartSupplierConfigId?item.smartSupplierConfigId:0
                  obj.type = item.type
                  obj.equilibriumRatio = item1.equilibriumRatio
                dats.gasTypeConfigs.push(obj);
              });
            } else {
              let obj = {};
                obj.gasNum = item.gas;
                obj.gasTypeName = this.NcalculateStylechange[item.gasType]
                obj.gasTypeValue = item.gasType
                obj.id = item.id?item.id:0
                obj.month = item.changeM ? item.changeM.join(",") : ""
                obj.priceNum = item.price
                obj.smartSupplierConfigId = item.smartSupplierConfigId?item.smartSupplierConfigId:0
                obj.type = item.type
                obj.equilibriumRatio = item.equilibriumRatio
                dats.gasTypeConfigs.push(obj);
            }
          });
          return dats
    },
    submitBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
         let dats = this.submitSaveData()
          if(!this.isEdit){
             api.purchasesDeploy.supplierAdd(dats).then((res) => {
                if (res) {
                this.$message({
                    message: "保存成功",
                    type: "success",
                    duration: 1000,
                });
                    this.isSubmit = true;
                    this.isSubmitSuccess = "1";
                    if (res.length > 0) {
                        this.$emit("addSubmitSuccess", res[0],false);
                        this.SubmitSuccessData = res[0];
                    }
                } else {
                this.$emit("addSubmitFail", dats,false);
                }
            });
          }else{
              //  编辑
                api.purchasesDeploy.supplierUupdate(dats).then((res) => {
                    if (res) {
                    this.$message({
                        message: "编辑成功",
                        type: "success",
                        duration: 1000,
                    });
                    this.$emit("addSubmitSuccess", dats,true);
                    } else {
                    this.$emit("addSubmitFail", dats,true);
                    }
                });
          }
        } else {
          return false;
        }
      });
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
    calculateStyleChange(val) {
      this.creatArrayNo(val);
      let obj = {
        equilibrium1:'',
        equilibrium2:'',
        equilibrium3:''
      }
      let changeObj = {}
      val.forEach(item=>{
        for(let i in obj){
             if(item == i){
             changeObj[i] = true
             }
        }
      })
      this.changeEquilibriumN = changeObj
      this.hasResidents(this.form1.calculateStylev,this.form1.NcalculateStylev)
      let iSShowStock = val.some((value) => {
        return value[0] == "04";
      });
      let iSShowincrement = val.some((value) => {
        return value[0] == "01";
      });
      this.iSShowStock = iSShowStock; //存量用户展示
      this.iSShowincrement = iSShowincrement; //增量用户展示
    },
    creatArrayNo(val) {
      let asd = [];
      let tempArray1 = [];
      let tempArray2 = [];
      if (val.length <= this.form1.getPriceReportDataNo.length) {
        for (let i = 0; i < val.length; i++) {
          tempArray1[val[i]] = true; //把数组B的值当成临时数组1的键并赋值为真
        }
        for (let i = 0; i < this.form1.getPriceReportDataNo.length; i++) {
          if (tempArray1[this.form1.getPriceReportDataNo[i].gasType]) {
            tempArray2.push(this.form1.getPriceReportDataNo[i]); 
          }
        }
        this.form1.getPriceReportDataNo = tempArray2;
      } else if (val.length > this.form1.getPriceReportDataNo.length) {
        for (let i = 0; i < this.form1.getPriceReportDataNo.length; i++) {
            this.form1.getPriceReportDataNo[i].rowKey = Math.random().toString();
          tempArray1[this.form1.getPriceReportDataNo[i].gasType] = true; 
        }
        for (let i = 0; i < val.length; i++) {
          if (tempArray1[val[i]]) {
          } else {
            let obj = {
                childs:[]
            };
              obj.equilibriumRatio = 0
              obj.gasType = val[i][0]
              obj.price = ""
              obj.gas = ""
              obj.index1 = val[i][0]
              obj.mounth = this.balance3
              obj.changeM = ""
              obj.type = 0
            tempArray2.push(obj);
          }
        }
        this.form1.getPriceReportDataNo = [
          ...this.form1.getPriceReportDataNo,
          ...tempArray2,
        ];
        this.form1.getPriceReportDataNo.forEach((item,index)=>{
            item.rowKey = Math.random().toString();
            item.childs.forEach(item1=>{
                item1.rowKey = Math.random().toString();
            })  
        })
      }
      setIndex(this.form1.getPriceReportDataNo)
      return asd;
    },
    creatArray(val) {
      let asd = [];
      let tempArray1 = [];
      let tempArray2 = [];
      if (val.length <= this.form1.getPriceReportData1.length) {
        for (let i = 0; i < val.length; i++) {
          tempArray1[val[i]] = true; //巧妙地方：把数组B的值当成临时数组1的键并赋值为真
        }
        for (let i = 0; i < this.form1.getPriceReportData1.length; i++) {
          if (tempArray1[this.form1.getPriceReportData1[i].gasType]) {
            tempArray2.push(this.form1.getPriceReportData1[i]); 
          }
        }
        this.form1.getPriceReportData1 = tempArray2;
      } else if (val.length > this.form1.getPriceReportData1.length) {
        for (let i = 0; i < this.form1.getPriceReportData1.length; i++) {
          tempArray1[this.form1.getPriceReportData1[i].gasType] = true; 
        }
        for (let i = 0; i < val.length; i++) {
          if (tempArray1[val[i]]) {
          } else {
            let obj = {
                childs:[]
            };
            obj.gasType = val[i][0]
              obj.price = ""
              obj.gas = ""
              obj.index1 = val[i][0]
              obj.mounth = this.balance2
              obj.changeM = ""
              obj.type = 1
              obj.equilibriumRatio = ''
            tempArray2.push(obj);
          }
        }
        this.form1.getPriceReportData1 = [
          ...this.form1.getPriceReportData1,
          ...tempArray2,
        ];
      }
      setIndex(this.form1.getPriceReportData1)
      return asd;
    },
    NocalculateStyleChange(val) {
      this.creatArray(val);
      let obj = {
        equilibrium1:'',
        equilibrium2:'',
        equilibrium3:''
      }
      let changeObj = {}
      val.forEach(item=>{
        for(let i in obj){
             if(item == i){
               changeObj[i] = true
             }
        }
      })
      this.changeEquilibrium = changeObj
      this.hasResidents(this.form1.calculateStylev,this.form1.NcalculateStylev)
    }, 
  },
};
</script>
<style lang="scss" scoped>
.deploy-add-new{
    max-height: 500px;
    overflow: auto;
  .step3-new{
    /deep/.el-input__inner{
      border-radius: 5px;
    }
  }
   /deep/input::-webkit-input-placeholder {
    color: #606266;
  }
  /deep/input::-moz-input-placeholder {
    color: #606266;
  }
  /deep/input::-ms-input-placeholder {
    color: #606266;
  }
   /deep/.el-input__inner{
    color: #303133;
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
  .step1-btn {
    text-align: right;
    padding: 20px;
    padding-bottom: 0;
    border-top: 1px solid #DCDFE6;
    position: sticky;
    bottom: 0px;
    background: #ffffff;
    .el-button {
      border-radius: 43px;
      background-color: #47A87D;
      border-color: #47A87D;
      &.el-button--default {
            background-color: #f5f7fa;
            border-color: #dcdfe6;
      }
    }
    .primary-btn{
        background-color: #47A87D;
      border-color: #47A87D;
    }
  } 
   input[type=number]::-webkit-inner-spin-button,  
   input[type=number]::-webkit-outer-spin-button {  
        -webkit-appearance: none;  
        margin: 0;  
    }
     /deep/.el-table [class*="el-table__row--level"] .el-table__expand-icon {
    display: none;
    }
    /deep/.el-table__indent {
        padding-left: 0px !important;
    }
    .step-content{
        padding: 0px 55px;
        padding-top: 20px;
    }
    .purchases-deploy-step1{
      padding: 20px 0;
      padding-bottom: 0;
      /deep/.el-input__inner{
        background-color: #F5F7FA;
      }
        .el-select{
          width: 100%;
          /deep/.el-tag{
            color: #303133;
          }
        }
        .block-title {
        padding: 0 10px;
        line-height: 16px;
        color: #303133;
        font-weight: 600;
        font-size: 18px;
        border-left: 6px solid #47a87d;
        margin-bottom: 10px;
        }
        .step-item-block {
            display: flex;
            .item-list {
                width: 30%;
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
        /deep/.el-form-item{
            .is-disabled{
                .el-input__inner{
                    background: #E4E7ED;
                }
            }
        }     
    }
    .purchases-deploy-step3 {
      padding: 0;
      .step-content{
          margin-bottom: 20px;
      }
      .el-input__inner {
          border-radius: 5px!important;
          background: #f6f7fa;
      }
      .step-select-list {
          .list-title {
          color: #a6a9b4;
          }
      }
      .step3-item-title {
          display: flex;
          line-height: 57px;
          color: #a6a9b4;
          font-size: 16px;
          .title-name {
          width: 30%;
          }
          .title-gas {
          width: 80%;
          }
      }
      .step3-item-block {
          display: flex;
          flex-wrap: wrap;
          .item-list {
          margin-right: 10px;
          width: 30%;
          .title {
              font-size: 16px;
              color: #2c3e50;
          }
          .month-con {
              width: 80%;
          }
          .deployed {
              width: 79px;
              position: absolute;
              z-index: 2;
              .el-input__inner {
              padding-left: 10px;
              background: #edeef4;
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
    .purchases-deploy-step2 {
        padding: 0;
            .item-list{
                .unit {
                    position: absolute;
                    right: 10px;
                    color: #909399;
                }
            }
            .step-item-block{
                .item-list{
                width: 30%;
                }
            }
            /deep/.el-cascader__tags .el-tag{
                    background: #fff;
                }
        .custom-table{
        .custom-table-header{
            height: 48px!important; 
        }
        /deep/.el-table__header-wrapper{
            border-top-right-radius: 2px;
            border-top-left-radius:2px;
        }
        /deep/ .el-cascader{
            line-height: 32px;
            .el-input__suffix{
            margin-top: -6px;
            }
        }
            .item-list{
                .unit {
                position: absolute;
                right: 10px;
                top: 22px;
                color: #909399;
                }
            }
            /deep/.el-form-item__content{
                line-height: 0px;
                .el-cascader{
                  width: 100%;
                  .el-cascader__tags .el-tag{
                      background: #fff;
                      margin: 2px 0 2px 2px;
                  }
                  .el-tag--small{
                      padding: 0 3px;
                  }
                }
            }
            /deep/.el-form-item{
                margin: 15px 0;
            }
            /deep/.el-input {
              border-radius: 5px;
              vertical-align: middle;
              box-shadow: none;
              line-height: 32px;
             .el-input__inner{
                height: 32px;
              line-height: 32px;
              }
            }
        }
        /deep/.el-input__inner {
        border-radius: 5px;
        }
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
              padding-right: 10px;
          }
        }
        .block-title {
          padding: 0 10px;
          line-height: 16px;
          color: #303133;
          font-weight: 600;
          font-size: 18px;
          border-left: 6px solid #47a87d;
        }
        .gas-type{
            .el-cascader{
                width:100%
            } 
        }
    }
}
</style>