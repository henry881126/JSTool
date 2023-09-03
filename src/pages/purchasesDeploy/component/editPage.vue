<template>
  <div class="">
    <!-- <el-dialog title="" :visible.sync="dialogFormVisible"> -->
      <el-form ref="form" :model="form">
        <!-- <div class="set-detail">
          <div class="detail-title">
            <div class="title-left"></div>
          </div>
          <div class="detail-content loser-detail"> -->
            <el-tabs
              v-model="activeName"
              @tab-click="handleClickGSF"
              class="custom-tab"
            >
              <el-tab-pane label="基础配置" name="01">
                <div  class="purchases-deploy-step1">
                  <el-form-item
                    label="天然气下气站点："
                    class="lower-gas-point"
                  >
                    <el-select v-model="downGasPlace" multiple clearable placeholder="请选择">
                      <el-option
                        v-for="item in optionsList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <!-- <el-input v-model="form.downGasPlace"></el-input> -->
                  </el-form-item>
                  <div class="step-item-block">
                    <el-form-item label="基准门站价：" class="item-list">
                      <el-input v-model="form.baseGasPrice"></el-input>
                      <span class="custom-unit">元/方</span>
                    </el-form-item>
                    <el-form-item label="可调配：" class="item-list">
                      <el-select
                        v-model="deployed"
                        placeholder="请选择"
                        class="deployed"
                      >
                        <el-option
                          v-for="item in deployedS"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <el-input
                        v-model="form.baseGasNum"
                        :disabled="deployed === '02'"
                        class="deployedS-input"
                      ></el-input>
                      
                    </el-form-item>
                  </div>
                  <div class="step-item-block">
                    <el-form-item label="偏差结算系数：" class="item-list">
                      <el-input v-model="form.deviationNum"></el-input>
                    </el-form-item>
                    <el-form-item label="管输费：" class="item-list">
                      <el-input type="number" v-model="form.pipelinePrice"></el-input>
                      <span class="custom-unit">元/方</span>
                    </el-form-item>
                  </div>
                  <div class="step-item-block">
                    <el-form-item label="冬夏供气比：" class="item-list">
                      <el-input v-model="form.gasSupply"></el-input>
                    </el-form-item>
                    <el-form-item label="调峰系数：" class="item-list">
                      <el-input v-model="form.peakShavingNum"></el-input>
                    </el-form-item>
                  </div>
                  <div class="step-item-block">
                  <el-form-item label="初始日均值：" class="item-list">
                    <el-input v-model="form.averageDayNum"></el-input>
                  </el-form-item>
                </div>
                  <el-form-item class="step1-btn">
                    <el-button type="primary" @click="step1Next1"
                      >下一步</el-button
                    >
                    <!-- <div>
           <el-button type="primary" >保存</el-button>
           <el-button>取消</el-button>
        </div> -->
                  </el-form-item>
                </div>
                <!-- <step1></step1> -->
              </el-tab-pane>
              <el-tab-pane label="天然气销售价格机制" name="02">
                <!-- <stepSecond></stepSecond> -->
                <div class="purchases-deploy-step2" >
                  <div class="non-heating-season">
                    <img src="../assets/noheatingseason.png" alt="" />
                    非采暖季
                  </div>
                  <div class="step-item-block">
                    <el-form-item label="时间：" class="item-list">
                      <el-date-picker
                        v-model="gasNoHeatingSeasonDate"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy/MM/dd"
                        placeholder="选择日期时间"
                        @change="NoHeatingSeasonChange"
                        class="table-date"
                        disabled
                      >
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item
                      label="计量方式："
                      class="item-list calculate"
                    >
                      <el-cascader
                        :options="calculateStyle"
                        v-model="calculateStylev"
                        :props="{
                          multiple: true,
                          checkStrictly: true,
                        }"
                        @change="calculateStyleChange"

                        ref="cascaderAddr"
                        clearable
                      ></el-cascader>
                    </el-form-item>
                  </div>
                  <div class="step-select-list" v-show="iSShowStock">
                    <div class="list-title">存量气量</div>
                    <div >
                      <el-form-item label="存量销售价格系数：" class="item-list">
                        <el-input
                        type="number"
                          v-model="form.noHeatingStockNum"
                        ></el-input>
                      </el-form-item>
                      <!-- <el-form-item label="存量销售价格：" class="item-list">
                        <el-input
                        type="number"
                          v-model="form.noHeatingStockNum"
                          
                        ></el-input>
                      </el-form-item> -->
                    </div>
                  </div>
                  <div class="step-select-list" v-show="iSShowincrement">
                    <div class="list-title">增量气量</div>
                    <div >
                      <el-form-item label="增量销售价格系数：" class="item-list">
                        <el-input
                        type="number"
                          v-model="form.noHeatingIncrementalNum"
                        ></el-input>
                      </el-form-item>
                      <!-- <el-form-item label="存量销售价格：" class="item-list">
                        <el-input
                         type="number"
                          v-model="form.noHeatingStockIncrementalNum"
                          
                        ></el-input>
                      </el-form-item> -->
                    </div>
                  </div>
                  <div class="heating-season">
                    <img src="../assets/heatingseason.png" alt="" />
                    采暖季
                  </div>
                  <div class="step-item-block">
                    <el-form-item label="时间" class="item-list">
                      <el-date-picker
                        v-model="gasHeatingSeasonDate"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy/MM/dd"
                        placeholder="选择日期时间"
                        @change="HeatingSeasonChange"
                        class="table-date"
                        disabled
                      >
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item
                      label="计量方式1："
                      class="item-list calculate"
                    >
                      <el-cascader
                        :options="NcalculateStyle"
                        v-model="NcalculateStylev"
                        :props="{
                          multiple: true,
                          checkStrictly: true,
                        }"
                        @change="NocalculateStyleChange"
                        
                        ref="cascaderAddr"
                        clearable
                      ></el-cascader>
                    </el-form-item>
                  </div>
                  <div class="step-select-list" v-show="iSShowresident">
                    <div class="list-title">居民气量</div>
                    <div >
                      <el-form-item label="居民销售价格系数：" class="item-list">
                        <el-input
                         type="number"
                          v-model="form.heatingResidentsGasIncrementalNum"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="step-select-list" v-show="iSShowbalanced">
                    <div class="list-title">均衡气量</div>
                    <div class="step-item-block">
                    <el-form-item label="均衡一销售价格系数：" class="item-list">
                      <el-input type="number" v-model="form.equilibriumGasOneNum"></el-input>
                    </el-form-item>
                    <el-form-item label="气量系数" class="item-list">
                      <el-input v-model="form.equilibriumGasPeakShaving"></el-input>
                    </el-form-item>
                    </div>
                    <div class="list-item-label">均衡二销售价格系数：</div>
                    <div class="step-item-block">
                      <el-form-item label="" class="item-list">
                        <el-cascader
                          :options="balance1"
                          v-model="balance1V1"
                          :props="{
                            multiple: true,
                            checkStrictly: true,
                          }"
                          @change="handleChange"
                          collapse-tags
                          ref="cascaderAddr"
                          clearable
                        ></el-cascader>
                      </el-form-item>
                      <el-form-item label="" class="item-list">
                        <el-input
                        type="number"
                          v-model="form.equilibriumGasTwoOneNum"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div class="step-item-block">
                      <el-form-item label="" class="item-list">
                        <el-cascader
                          :options="balance2"
                          v-model="balance1V2"
                          :props="{
                            multiple: true,
                            checkStrictly: true,
                          }"
                          @change="handleChange"
                          collapse-tags
                          ref="cascaderAddr"
                          clearable
                        ></el-cascader>
                      </el-form-item>
                      <el-form-item label="" class="item-list">
                        <el-input
                        type="number"
                          v-model="form.equilibriumGasTwoTwoNum"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div class="list-item-label">气量系数：</div>
                    <div class="step-item-block">
                      <el-form-item label="" class="item-list">
                        <el-input v-model="form.equilibriumGasTwoPeakShaving"></el-input>
                      </el-form-item>
                    </div>
                  </div>

                  <div class="step-select-list" v-show="iSShowpeakRegulation">
                    <div class="list-title">调峰气量</div>
                    <div class="list-item-label">非居民调峰：</div>
                    <div class="step-item-block">
                      <el-form-item label="" class="item-list">
                        <el-cascader
                          :options="pitchPeak1"
                          v-model="pitchPeakV1"
                          :props="{
                            multiple: true,
                            checkStrictly: true,
                          }"
                          @change="handleChange"
                          collapse-tags
                          ref="cascaderAddr"
                          clearable
                        ></el-cascader>
                      </el-form-item>
                      <el-form-item label="" class="item-list">
                        <el-input type="number" v-model="form.peakOneNum"></el-input>
                      </el-form-item>
                    </div>
                    <div class="step-item-block">
                      <el-form-item label="" class="item-list">
                        <el-cascader
                          :options="pitchPeak2"
                          v-model="pitchPeakV2"
                          :props="{
                            multiple: true,
                            checkStrictly: true,
                          }"
                          @change="handleChange"
                          collapse-tags
                          ref="cascaderAddr"
                          clearable
                        ></el-cascader>
                      </el-form-item>
                      <el-form-item label="" class="item-list">
                        <el-input type="number" v-model="form.peakTwoNum"></el-input>
                      </el-form-item>
                    </div>
                    <div class="list-item-label">气量系数：</div>
                    <div class="step-item-block">
                      <el-form-item label="" class="item-list">
                        <el-input v-model="form.peakPeakShaving"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <el-form-item class="step1-btn">
                  
                    <el-button @click="firstBtn">上一步</el-button>
                    <el-button type="primary" @click="step2Submit"
                      >下一步</el-button
                    >
                  </el-form-item>
                </div>
              </el-tab-pane>
              <el-tab-pane label="逐月居民用气量" name="03">
                <!-- <step3></step3> -->
                <div class="purchases-deploy-step3" >
                  <div class="step3-item-block">
                    <div
                      v-for="(item, index) in setMouth"
                      :key="index"
                      class="item-list"
                    >
                      <el-form-item :label="item.label">
                        <el-input type="number" v-model="item.residents_gas"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="step1-btn">
                    <el-button @click="secondBtn">上一步</el-button>
                    <el-button type="primary" @click="submitBtn">提交</el-button>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          <!-- </div>
        </div> -->
      </el-form>
    <!-- </el-dialog> -->
  </div>
</template>

<script>
// import topMenu from "../../../components/topMenu/topMenu";
import api from "/src/http/api";
import exportApi from "/src/components/export/export";
import mergeTableRow from "/src/components/mergeTableRow/reply";
// import step1 from "./step1";
// import stepSecond from "./step2";
// import step3 from "./step3";
export default {
  name: "reply",
  mixins: [exportApi, mergeTableRow],
  data: function () {
    return {
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
      // options123: [{
      //     value: '选项1',
      //     label: '黄金糕'
      //   }, {
      //     value: '选项2',
      //     label: '双皮奶'
      //   }, {
      //     value: '选项3',
      //     label: '蚵仔煎'
      //   }, {
      //     value: '选项4',
      //     label: '龙须面'
      //   }, {
      //     value: '选项5',
      //     label: '北京烤鸭'
      //   }],
      downGasPlace: "", //下气站点，多个用逗哥隔开
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
        {
          value: "04",
          label: "存量气量",
        },
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
      value: "",
      pitchPeakV2:'',
      pitchPeakV1:'',
      balance1V1: "",//均衡
      balance1V2: "",//均衡
      form: {
        averageDayNum: '', //日均量
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
        equilibriumGasTwoPeakShaving:'',//均衡气量，非居民均衡二调峰系数
        peakPeakShaving:'',//非居民调峰系数
        equilibriumGasPeakShaving:'',//均衡气量，非居民均衡一调峰系数
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
      supplierData: [
        {
          componey: "河北省天然气有限公司",
          componeyCode: "h1234",
          supperNum: "1111",
          superconcat: "222",
          pointdowload: "河北站、廊坊站",
          pcxs: "97%",
          change: "10%",
          isuse: "是",
        },
        {
          componey: "河北中石油昆仑天然气有限公司",
          componeyCode: "h1234",
          supperNum: "1111",
          superconcat: "222",
          pointdowload: "河北站、廊坊站",
          pcxs: "97%",
          change: "10%",
          isuse: "是",
        },
        {
          componey: "中石油河北分公司",
          componeyCode: "h1234",
          supperNum: "1111",
          superconcat: "222",
          pointdowload: "河北站、廊坊站",
          pcxs: "97%",
          change: "10%",
          isuse: "是",
        },
        {
          componey: "河北新奥能源发展分公司",
          componeyCode: "h1234",
          supperNum: "1111",
          superconcat: "222",
          pointdowload: "河北站、廊坊站",
          pcxs: "97%",
          change: "10%",
          isuse: "是",
        },
      ], //获取供应商列表数据
      // setComponyArray: "", //获取当前选择要编辑的供应商
      supplierList: [],
      comOptions: "",
    };
  },

  components: {
    // topMenu,
    // step1,
    // stepSecond,
    // step3,
  },

  created() {
    this.gasNoHeatingSeasonDate[0] = "2021-04-01";
    this.gasNoHeatingSeasonDate[1] = "2021-10-30";
    this.gasHeatingSeasonDate[0] = "2021-11-01";
    this.gasHeatingSeasonDate[1] = "2022-03-31";
    this.startTime = this.getFormatTime(Date.now());
    this.endTime = this.getFormatTime(Date.now() + 24 * 3600000);
    this.getList();
    this.comOptions = this.$store.getters["companyList"];
    // this.curComCode = this.$store.getters["curCom"];
    this.getSupperq()
    this.activeName ='01'
  },
 props: ["setComponyArray"],
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom;
    },
  },

  watch: {
    // curComCode: {
    //   immediate: true,
    //   handler: function (n, o) {
    //     if (n && o) {
    //     }
    //   },
    // },
    // activeName:{
    //      immediate: true,
    //     handler: function (n, o) {
    //         if (n && o) {
    //             this.activeName = this.activeName
    //         }
    //   },
    // }
  },

  mounted() {},

  methods: {
    formatData(element){
        let noHeatingMethod = element.split(',')
        // let HeatingMethod = this.supplierData[0].noHeatingMethod.split(',')
        let noHeatingMethodD =[]
        noHeatingMethod.forEach(item=>{
            let itemA =[]
        itemA.push(item)
        noHeatingMethodD.push(itemA)
        })
        return noHeatingMethodD
    },
    getSupperq(){
       let datalList = {
         id:this.setComponyArray.id
       }
        api.purchasesDeploy.getSupperq(datalList).then((res) => {
        this.supplierData = res
        let getnoHeatingMethod = this.formatData(this.supplierData[0].noHeatingMethod)
        let getHeatingMethod = this.formatData(this.supplierData[0].heatingMethod)
        this.form =this.supplierData[0]
        this.downGasPlace = this.form.downGasPlace?this.form.downGasPlace.split(","):''
        //  this.calculateStylev = [['01'],['02']]
        this.calculateStylev = getnoHeatingMethod
        this.NcalculateStylev = getHeatingMethod
        this.NocalculateStyleChange(getHeatingMethod)
        this.calculateStyleChange(getnoHeatingMethod)
        let equilibriumGasTwoOneMethod = this.formatData(this.supplierData[0].equilibriumGasTwoOneMethod)
        let equilibriumGasTwoTwoMethod = this.formatData(this.supplierData[0].equilibriumGasTwoTwoMethod)
        let getpeakOneMethod = this.formatData(this.supplierData[0].peakOneMethod)
        let getpeakTwoMethod = this.formatData(this.supplierData[0].peakTwoMethod)
        this.pitchPeakV2 = getpeakTwoMethod
        this.pitchPeakV1 = getpeakOneMethod
        this.balance1V1 = equilibriumGasTwoOneMethod
        this.balance1V2 = equilibriumGasTwoTwoMethod
        this.NcalculateStylev = getHeatingMethod
        this.calculateStylev = getnoHeatingMethod
        this.setMouth.forEach((item) =>{
            for(let i in this.supplierData[0].smartAdoptCalculateResidentGas.txt){
                if(item.index == i){
                  item.residents_gas = this.supplierData[0].smartAdoptCalculateResidentGas.txt[i].residents_gas
                } 
            }
        })
    
      });
    },
      NoHeatingSeasonChange(){

    },
    HeatingSeasonChange(){

    },
    handleChange() {},
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
  
    secondBtn() {
      this.stepActive = 2;
      this.activeName = '02'
    },
    firstBtn(){
       this.stepActive = 1;
       this.activeName = '01'
    },
    submitBtn() {
      let getMonthData = {};
        this.setMouth.forEach((element) => {
        let obj = {};
        obj.residents_gas = element.residents_gas;
        getMonthData[element.index] = obj;
      });
      // this.setMouth.forEach((element, index) => {
      //   let obj = {};
      //   obj.residents_gas = element.residents_gas;
      //   getMonthData[index + 1] = obj;
      // });
      let datalList = {
        status:this.setComponyArray.status?1:0,
        averageDayNum: this.form.averageDayNum, //日均量
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
        equilibriumGasTwoOneMethod: this.balance1V1
          ? this.balance1V1.join(",")
          : "", //均衡气量，非居民均衡二方式
        equilibriumGasTwoOneNum: this.form.equilibriumGasTwoOneNum, //均衡气量，非居民均衡二百分比【存小数点】
        equilibriumGasTwoOneTime: this.form.equilibriumGasTwoOneTime, //均衡气量，非居民均衡二时间

        equilibriumGasTwoTwoMethod: this.balance1V2
          ? this.balance1V2.join(",")
          : "", //均衡气量，非居民均衡二，第二个，方式
        equilibriumGasTwoTwoNum: this.form.equilibriumGasTwoTwoNum, //均衡气量，非居民均衡二，第二个，百分比【存小数点】
        equilibriumGasTwoTwoTime: this.form.equilibriumGasTwoTwoTime, //均衡气量，非居民均衡二，第二个，时间
        funText: {}, //计算公式json格式

        gasSupply: this.form.gasSupply, //冬夏供气比

        heatingEndTime: this.gasHeatingSeasonDate[1], //采暖季结束时间

        heatingMethod: this.NcalculateStylev
          ? this.NcalculateStylev.join(",")
          : "", //非采暖季计量方式

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
        noHeatingMethod: 
          this.calculateStylev
          ? this.calculateStylev.join(",")
          : "", //采暖计量方式
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
        // averageDayNum:this.form.averageDayNum,//初始日均值

        peakTwoMethod: this.pitchPeakV2 ? this.pitchPeakV2.join(",") : "", //非居民调峰二方式
        peakTwoNum: this.form.peakTwoNum, //非居民调峰二数值

        peakTwoTime: this.form.peakTwoTime, //非居民调峰二时间

        pipelinePrice: this.form.pipelinePrice, //管输费
        equilibriumGasTwoPeakShaving:this.form.equilibriumGasTwoPeakShaving,//均衡气量，非居民均衡二调峰系数
        peakPeakShaving:this.form.peakPeakShaving,//非居民调峰系数
        equilibriumGasPeakShaving:this.form.equilibriumGasPeakShaving,//均衡气量，非居民均衡一调峰系数

        smartAdoptCalculateResidentGas: {
          //采销每月居民用气量
          code: this.form.code,
          codeTxt: this.form.codeTxt,
          creator: "",
          id: this.form.smartAdoptCalculateResidentGas.id,
          modifier: "",
          txt: getMonthData,
          year: "",
        },
        version: this.form.version,
        xaReig: this.curComCode,
        xaReigTxt: "",
      };
      api.purchasesDeploy.supplierUupdate(datalList).then((res) => {
        if(res){
            this.$message({
              message: "保存成功",
              type: "success",
              duration: 1000,
            });
            this.$emit('editSubmitSuccess',datalList)
         
        }else{
            this.$emit('editSubmitFail',datalList)
        }
        // this.supplieradd = res;
      });
    },
    getList() {
      let data = {
        XA_REIG: "50311932",
      };
      api.purchasesDeploy.supplierList(data).then((res) => {
        
        this.supplierList = res;
      });
    },
    finishUser() {},
    finished() {
      this.stepActive = 1;
      this.isSubmit = false;
      this.dialogFormVisibleNew = false;
    },
    backReset() {},
    step1Next() {
      this.stepActive = 2;
    },
     // 第一步提交
    step1Next1() {
      // this.$emit("step1Next")
      this.activeName='02',
      this.stepActive = 2;
    },
    // 第二步提交
    step2Submit() {
        this.activeName='03',
      this.stepActive = 3;
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
      //   this.getData()
    },
    // 管输方tab栏
    handleClickGSF(tab) {
      if (tab.name == "first") {
        // this.getlistPipelinePrice();
      } else if (tab.name === "second") {
        // 供应商预付费用list
        // this.pipelinePriceList();
      }
    },

    getFormatTime: function (timestamp) {
      let date = new Date(timestamp);
      let yyyy = date.getFullYear();
      let mm =
        date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return yyyy + "-" + mm + "-" + dd;
    },
    setData(val) {
      this.setComponyArray = val;
      
      this.dialogFormVisible = true;
    },
  },
};
</script>
<style lang="scss">
  .purchases-deploy .el-date-editor--daterange.el-input__inner{
        width: 100%;
    }  
  .purchases-deploy-step3 {
    padding: 20px;
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
    .purchases-deploy-step2{
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
        .el-date-editor--daterange.el-input__inner{
            width: 100%;
        }
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
  height: 100%;

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
      background: #f6f7fa;
    }
    .step-item-block {
      display: flex;
      .custom-unit {
          position: absolute;
          top: 38px;
          right: 18px;
          color: #74788d;
        }
      .item-list {
        width: 50%;
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
    left: 13%;
    padding: 6px 20px;
    background: #f7eded4f;
    border-radius: 20px;
    color: #ffffffa6;
  }
  .dialog-title {
    display: flex;
    justify-content: space-between;
    margin: 20px 20px;
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
        vertical-align: baseline;
      }
    }
    .switch {
      display: inline-block;
      margin-left: 76px;
      .switch-label {
        margin-right: 10px;
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
        width: 300px;
        height: 172px;
    }
  }
  .purchases-deploy-content {
    display: flex;
    padding: 54px 20px;
    flex-wrap: wrap;
    // justify-content: space-between;
    .deploy-content-item {
      width: 30%;
      background: #fff;
      padding: 20px;
      border-radius: 16px;
      margin-right: 10px;
      margin-bottom: 10px;
      // display: flex;
      // justify-content: space-between;
      .deploy-content-item-title {
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        justify-content: space-between;
        padding: 20px 0;
        .deploy-content-item-set {
          background: #e6f7f7;
          border-radius: 10px;
          padding: 4px 20px;
          color: #0fb2ab;
        }
        .title {
          font-weight: 700;
        }
      }
      .deploy-content {
        .content-list {
          display: flex;
          line-height: 50px;
        }
      }
    }
  }
}
</style>