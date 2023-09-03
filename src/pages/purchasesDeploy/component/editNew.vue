<template>
  <div class="deploy-edit">

    <el-tabs
      v-model="activeName"
      @tab-click="handleClickGSF"
      class="custom-tab"
    >
      <el-tab-pane label="基础配置" name="01">
        <el-form ref="formF" :model="formF" :rules="rules">
          <div class="purchases-deploy-step1">
            <el-form-item
              label="天然气下气站点："
              class="lower-gas-point"
              prop="downGasPlace"
            >
              <el-select
                v-model="formF.downGasPlace"
                multiple
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsList"
                  :key="item.value + 'a'"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <div class="step-item-block">
              <el-form-item
                label="基准门站价："
                class="item-list"
                prop="baseGasPrice"
              >

                <el-input
                  type="number"
                  oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<0){value=value.slice(0,1)} "
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
                  oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<0){value=value.slice(0,1)} "
                  v-model="formF.pipelinePrice"
                ></el-input>
                <span class="custom-unit">元/方</span>
              </el-form-item>
            </div>
            <div class="step-item-block">
              <el-form-item
                label="冬夏供气比："
                class="item-list"
                prop="gasSupply"
              >
                <el-input  v-model="formF.gasSupply"></el-input>
              </el-form-item>
            </div>
            <el-form-item class="step1-btn">
              <el-button type="primary" @click="step1Next1('formF')"
                >下一步</el-button
              >
            </el-form-item>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="天然气销售价格机制" name="02">
        <el-form ref="form1" :model="form1" :rules="rules">
          <div class="purchases-deploy-step2">
            <div class="non-heating-season">
              <img src="../assets/noheatingseason.png" alt="" />
              非采暖季
              <span>{{curYear+"/04/01"}} - {{curYear+"/10/30"}}</span>
            </div>
            <div class="calculateV">
              <el-form-item
                label="气量类型："
                class="item-list calculate"
                prop="calculateStylev"
              >
              </el-form-item>
              <el-select
                v-model="form1.calculateStylev"
                multiple
                clearable
                placeholder="请选择"
                @change="calculateStyleChange"
              >
                <el-option
                  v-for="item in calculateStyle"
                  :key="item.value + 'a'"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <!-- 非采暖季start new 如果是增量和存量没有气量系数，其他的有 -->
            <div class="non-heating-season-new">
              <div class="non-heating-season-title">
                <div class="title-item first-item">名称</div>
                <div class="title-item">价格系数</div>
                <div class="title-item">气量系数</div>
              </div>
              <div
                class="non-heating-season-contant"
                :key="index + 'lv'"
                v-for="(item, index) in form1.getPriceReportDataNo"
              >
                <div class="con-left">
                  {{ NcalculateStylechange[item.index1] }}：
                </div>
                <div class="con-right">
                  <div class="con-right-top">
                    <div class="top-item price">
                      <el-form-item
                        label=""
                        class="item-list"
                        :prop="'getPriceReportDataNo.' + index + '.price'"
                        :rules="[
                          {
                            required: true,
                            message: '请输入价格系数',
                            trigger: 'blur',
                          },
                        ]"
                      >
                        <el-input
                          type="number"
                          oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<0){value=value.slice(0,1)} "
                          v-model="item.price"
                        ></el-input>
                        <!-- <span class="custom-unit">元/方</span> -->
                      </el-form-item>
                    </div>
                    <div
                      class="top-item gas"
                      v-if="
                        item.index1 != 'stock' && item.index1 != 'incremental'&& item.index1 !='residents'
                      "
                    >
                      <el-form-item
                        label=""
                        class="item-list"
                        :prop="'getPriceReportDataNo.' + index + '.gas'"
                        :rules="[
                          {
                            required: true,
                            message: '请输入气量系数',
                            trigger: 'blur',
                          },
                        ]"
                      >
                        <el-input
                          type="number"
                          oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<0){value=value.slice(0,1)} "
                          v-model="item.gas"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 非采暖季end new -->

            <div class="heating-season">
              <img src="../assets/heatingseason.png" alt="" />
              采暖季
              <span>{{curYear+"/11/01"}} - {{nextYear+"/03/31"}}</span>
            </div>
            <div class="calculateV">
              <el-form-item
                label="气量类型："
                class="calculate"
                prop="NcalculateStylev"
              >
                <!-- <el-cascader
                  :options="NcalculateStyle"
                  v-model="form1.NcalculateStylev"
                  :props="optionProps"
                  @change="NocalculateStyleChange"
                  ref="cascaderAddr"
                  clearable
                ></el-cascader> -->
                <el-select
                v-model="form1.NcalculateStylev"
                multiple
                clearable
                placeholder="请选择"
                @change="NocalculateStyleChange"
              >
                <el-option
                  v-for="item in NcalculateStyle"
                  :key="item.value + 'a'"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              </el-form-item>
            </div>
            <!-- 采暖季start new -->
            <div class="heating-season-new">
              <div class="heating-season-title">
                <div class="title-item first-item">名称</div>
                <div class="title-item">价格系数</div>
                <div class="title-item">气量系数</div>
              </div>
              <div
                class="heating-season-contant"
                :key="index + 'll'"
                v-for="(item, index) in form1.getPriceReportData1"
              >
                <div class="con-left">
                  {{ NcalculateStylechange[item.index1] }}：
                </div>
                <div class="con-right">
                  <div
                    v-if="
                      item.index1 != 'equilibrium2' && item.index1 != 'peak' &&
                    item.index1 != 'equilibrium3'
                    "
                  >
                    <div class="con-right-top">
                      <div class="top-item price">
                        <el-form-item
                          label=""
                          class="item-list"
                          :prop="'getPriceReportData1.' + index + '.price'"
                          :rules="[
                            {
                              required: true,
                              message: '请输入价格系数',
                              trigger: 'blur',
                            },
                          ]"
                        >
                          <el-input
                            type="number"
                            oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<0){value=value.slice(0,1)} "
                            v-model="item.price"
                          ></el-input>
                          <!-- <span class="custom-unit">元/方</span> -->
                        </el-form-item>
                      </div>
                      <div class="top-item gas"
                      v-if="
                        item.index1 != 'stock' && item.index1 != 'incremental'&& item.index1 !='residents'
                      ">
                        <el-form-item
                          label=""
                          class="item-list"
                          :prop="'getPriceReportData1.' + index + '.gas'"
                          :rules="[
                            {
                              required: true,
                              message: '请输入气量系数',
                              trigger: 'blur',
                            },
                          ]"
                        >
                          <el-input
                            type="number"
                            oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<0){value=value.slice(0,1)} "
                            v-model="item.gas"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                    <!-- {{getPriceReportData1}} -->
                    <div class="con-right-bottom">
                      <el-form-item label="" class="item-list">
                        <el-cascader
                          :options="item.mounth"
                          v-model="item.changeM"
                          :props="{
                            multiple: true,
                            checkStrictly: true,
                          }"
                          @change="handleChange"
                          ref="cascaderAddr"
                          clearable
                        ></el-cascader>
                        <span class="month">月份</span>
                      </el-form-item>
                    </div>
                  </div>
                  <div v-else>
                    <div
                      v-for="(item2, index2) in item.childs"
                      :key="index2 + 'kj'"
                      class="type-num"
                    >
                      <div class="typr-title">类型{{ index2 + 1 }}</div>
                      <div class="type-cont">
                        <div class="con-right-top">
                          <div class="top-item price">
                            <el-form-item
                              label=""
                              class="item-list"
                              :prop="
                                'getPriceReportData1.' +
                                index +
                                '.childs.' +
                                index2 +
                                '.price'
                              "
                              :rules="[
                                {
                                  required: true,
                                  message: '请输入价格系数',
                                  trigger: 'blur',
                                },
                              ]"
                            >
                              <el-input
                                type="number"
                                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<0){value=value.slice(0,1)} "
                                v-model="item2.price"
                              ></el-input>
                              <!-- <span class="custom-unit">元/方</span> -->
                            </el-form-item>
                          </div>
                          <div class="top-item gas">
                            <el-form-item
                              label=""
                              class="item-list"
                              :prop="
                                'getPriceReportData1.' +
                                index +
                                '.childs.' +
                                index2 +
                                '.gas'
                              "
                              :rules="[
                                {
                                  required: true,
                                  message: '请输入气量系数',
                                  trigger: 'blur',
                                },
                              ]"
                            >
                              <el-input
                                type="number"
                                oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<0){value=value.slice(0,1)} "
                                v-model="item2.gas"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                        <div class="con-right-bottom">
                          <el-form-item label="" class="item-list">
                            <el-cascader
                              :options="item2.mounth"
                              v-model="item2.changeM"
                              :props="{
                                multiple: true,
                                checkStrictly: true,
                              }"
                              @change="handleChange"
                              ref="cascaderAddr"
                              clearable
                            ></el-cascader>
                            <span class="month">月份</span>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 采暖季end -->
            <el-form-item class="step1-btn">
              <el-button @click="firstBtn">上一步</el-button>
              <el-button type="primary" @click="step2Submit('form1')"
                >下一步</el-button
              >
            </el-form-item>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="逐月居民用气量" name="03">
        <el-form ref="formT" :model="formT" :rules="rules">
          <div class="purchases-deploy-step3">
            <div class="step3-item-title">
              <div class="title-name">月份</div>
              <div class="title-gas">气量</div>
            </div>
            <div class="step3-item-block">
              <template v-if="NoheatingEndjumin">
                <div
                  v-for="(item, index) in formT.setMouth1"
                  :key="index + 'c'"
                  class="item-list"
                >
                  <div class="title">{{ item.label }}</div>
                  <div class="month-con">
                    <el-form-item
                      :prop="'setMouth1.' + index + '.residents_gas'"
                      :rules="[
                        {
                          required: true,
                          message: '请输入气量',
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <el-input
                        type="number"
                        oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<0){value=value.slice(0,1)} "
                        v-model="item.residents_gas"
                      ></el-input>
                    </el-form-item>
                  </div>
                </div>
              </template>
              <template v-if="heatingEndjumin">
                <div
                  v-show="heatingEndjumin"
                  v-for="(item, index) in formT.setMouth2"
                  :key="index + 'b'"
                  class="item-list"
                >
                  <div class="title">{{ item.label }}</div>
                  <div class="month-con">
                    <el-form-item
                      :prop="'setMouth2.' + index + '.residents_gas'"
                      :rules="[
                        {
                          required: true,
                          message: '请输入气量',
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <el-input
                        type="number"
                        oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<0){value=value.slice(0,1)} "
                        v-model="item.residents_gas"
                      ></el-input>
                    </el-form-item>
                  </div>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
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
      },
      formF: {
        downGasPlace: "", //下气站点，多个用逗哥隔开
        gasSupply: "", //冬夏供气比
        baseGasPrice: "", //基准门站价
        pipelinePrice: "", //管输费
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
      rules: {
        gasSupply: [
          { required: true, message: "请选择冬夏供气比", trigger: "change" },
        ],
        downGasPlace: [
          { required: true, message: "请选择下气点", trigger: "change" },
        ],
        baseGasPrice: [
          { required: true, message: "请选择基准门站价", trigger: "change" },
        ], //基准门站价
        pipelinePrice: [
          { required: true, message: "请选择管输费", trigger: "change" },
        ], //管输费
        calculateStylev: [
          { required: true, message: "请输入气量类型", trigger: "change" },
        ],
        NcalculateStylev: [
          { required: true, message: "请输入气量类型", trigger: "change" },
        ],
      },

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
      NcalculateStylev: "", //采暖季
      // 非采暖季是否选择了居民方式
      NoheatingEndjumin: false,
      // 采暖季是否选择了居民方式
      heatingEndjumin: false,
      gasNoHeatingSeasonDate: [], //日报表日期
      gasHeatingSeasonDate: [], //获取采暖季时间
      iSShowStock: "", //存量用户展示
      iSShowincrement: "", //增量用户展示
      iSShowresident: "", //居民气量
      iSShowbalanced: "", // 均衡气量
      iSShowpeakRegulation: "", // 调峰气量

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
          value: "11",
          label: "11月",
        },
        {
          value: "12",
          label: "12月",
        },
      ],
      calculateStyle: [
      ],
      NcalculateStylechange: {
      },

      NcalculateStyle: [
        {
          value: "02",
          label: "居民气量",
        },
        {
          value: "03",
          label: "均衡气量",
        },
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
        },
      ],
     
      value: "",
      pitchPeakV2: "",
      pitchPeakV1: "",
      balance1V1: "", //均衡
      balance1V2: "", //均衡
      form: {
        averageDayNum: "", //日均量
        baseGasNum: "", //可调配（是：有需要数值【小数点】。 否：没有具体数值）
        baseGasPrice: "", //基准门站价
        code: "", //供应商编码
        codeOrder: 0, //供应商顺序
        codeTxt: "", //供应商
        creator: "", //创建人
        deviationNum: "", //偏差系数，小数点
        downGasPlace: "", //下气站点，多个用逗哥隔开
        equilibriumGasOneMethod: "", //均衡气量，非居民均衡一方式
        equilibriumGasOneNum: "", //均衡气量，非居民均衡一价格
        equilibriumGasTwoOneMethod: "", //均衡气量，非居民均衡二方式
        equilibriumGasTwoOneNum: "", //均衡气量，非居民均衡二百分比【存小数点】
        equilibriumGasTwoOneTime: "", //均衡气量，非居民均衡二时间
        equilibriumGasTwoTwoMethod: "", //均衡气量，非居民均衡二，第二个，方式
        equilibriumGasTwoTwoNum: "", //均衡气量，非居民均衡二，第二个，百分比【存小数点】
        equilibriumGasTwoTwoTime: "", //均衡气量，非居民均衡二，第二个，时间
        gasSupply: "", //冬夏供气比
        heatingEndTime: "", //采暖季结束时间
        heatingMethod: "", //采暖计量方式
        heatingResidentsGasIncrementalMethod: "", //居民用气， 增量销售价格方式
        heatingResidentsGasIncrementalNum: "", //居民用气【增量销售价格】
        heatingStartTime: "", //采暖季开始时间
        id: 0, //主键
        modifier: "", //修改人
        noHeatingEndTime: "", //非采暖季结束时间
        noHeatingIncrementalMethod: "", //增量用户【增量销售价格方式】
        noHeatingIncrementalNum: "", //增量用户【增量销售价格】
        noHeatingMethod: "", //非采暖季计量方式
        noHeatingStartTime: "", //非采暖季开始时间
        noHeatingStockIncrementalMethod: "", //增量用户【存量销售价格方式】
        noHeatingStockIncrementalNum: "", //增量用户【存量销售价格】
        noHeatingStockMethod: "", //存量用户【存量销售价格方式】
        noHeatingStockNum: "", //存量用户【存量销售价格】
        noHeatingStockOfIncrementalMethod: "", //存量用户【增量销售价格方式】
        noHeatingStockOfIncrementalNum: "", //存量用户【增量销售价格】
        peakOneMethod: "", //非居民调峰一方式
        peakOneNum: "", //非居民调峰一数值
        peakOneTime: "", //非居民调峰一时间
        peakShavingNum: "", //调峰系数
        peakTwoMethod: "", //非居民调峰二方式
        peakTwoNum: "", //非居民调峰二数值
        peakTwoTime: "", //非居民调峰二时间
        pipelinePrice: "", //管输费
        equilibriumGasTwoPeakShaving: "", //均衡气量，非居民均衡二调峰系数
        peakPeakShaving: "", //非居民调峰系数
        equilibriumGasPeakShaving: "", //均衡气量，非居民均衡一调峰系数
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
      curYear:'',//当前年
      nextYear:''//下一年
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
    let getdate = new Date();
    this.curYear = getdate.getFullYear();
    this.nextYear = getdate.getFullYear() +1;
    this.startTime = this.getFormatTime(Date.now());
    this.endTime = this.getFormatTime(Date.now() + 24 * 3600000);
    // 获取气量类型
    this.supplierGetGasType();
    this.comOptions = this.$store.getters["companyList"];
    // this.curComCode = this.$store.getters["curCom"];
    this.getSupperq();
    this.activeName = "01";
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
    formatData(element) {
      let noHeatingMethod = element?element.split(","):[];
      // let HeatingMethod = this.supplierData[0].noHeatingMethod.split(',')
      let noHeatingMethodD = [];
      noHeatingMethod.forEach((item) => {
        let itemA = [];
        itemA.push(item);
        noHeatingMethodD.push(itemA);
      });
      return noHeatingMethodD;
    },
    getSupperq() {
      let datalList = {
        id: this.setComponyArray.id,
      };
      api.purchasesDeploy.getSupperq(datalList).then((res) => {
        console.log(res);
        this.supplierData = res;
        if (this.supplierData) {
          this.supplierData[0].gasTypeConfigs.forEach((item) => {
            if (item.type == 1) {
              let obj = {};
              (obj.gasType = item.gasTypeValue),
                (obj.price = item.priceNum),
                (obj.gas = item.gasNum),
                (obj.index1 = item.gasTypeValue),
                obj.id = item.id;
                obj.smartSupplierConfigId =item.smartSupplierConfigId;
                (obj.mounth = this.balance2),
                (obj.changeM = this.formatData(item.month)),
                (obj.type = item.type), //采暖季
                (obj.childs = []);
              if (item.childs) {
                item.childs.forEach((item1) => {
                  let obj1 = {};
                  (obj1.gasType = item1.gasTypeValue),
                    (obj1.price = item1.priceNum),
                    (obj1.gas = item1.gasNum),
                     obj1.id = item1.id;
                    (obj1.index1 = item1.gasTypeValue),
                    (obj1.childTypeName = item1.childTypeName),
                    (obj1.mounth = this.balance2),
                    (obj1.changeM = this.formatData(item1.month)),
                    (obj1.type = item1.type), //采暖季
                    obj.childs.push(obj1);
                });
              }
              this.form1.getPriceReportData1.push(obj);
            } else if (item.type == 0) {
              let obj = {};
              (obj.gasType = item.gasTypeValue),
                (obj.price = item.priceNum),
                (obj.gas = item.gasNum),
                obj.id = item.id;
                obj.smartSupplierConfigId =item.smartSupplierConfigId;
                (obj.index1 = item.gasTypeValue),
                (obj.mounth = this.balance2),
                (obj.changeM = this.formatData(item.month)),
                (obj.type = item.type), //采暖季
                (obj.childs = item.childs);
              this.form1.getPriceReportDataNo.push(obj);
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
          console.log(this.form.downGasPlace);
          this.formF.downGasPlace = this.form.downGasPlace
            ? this.form.downGasPlace.split(",")
            : "";
            this.form1.calculateStylev = this.form.noHeatingGasType
            ? this.form.noHeatingGasType.split(",")
            : "";
            this.form1.NcalculateStylev = this.form.heatingGasType
            ? this.form.heatingGasType.split(",")
            : "";
          this.formF.baseGasPrice = this.form.baseGasPrice;
          this.formF.gasSupply = this.form.gasSupply; //冬夏供气比
          this.formF.pipelinePrice = this.form.pipelinePrice; //管输费
          // this.form1.calculateStylev = getnoHeatingMethod;
          // this.form1.NcalculateStylev = getHeatingMethod;
          // this.form1.NcalculateStylev = getHeatingMethod;
          // this.form1.calculateStylev = getnoHeatingMethod;
        }
      });
    },
    handleChange() {},
    supplierGetGasType() {
      api.purchasesDeploy.supplierGetGasType().then((res) => {
        if (res) {
          this.calculateStyle = res;
          this.NcalculateStyle = res;
          console.log(res);
          this.calculateStyle.forEach((item) => {
            this.NcalculateStylechange[item.value] = item.name;
          });
          console.log(this.NcalculateStylechange);
        }
      });
    },
    // 非采暖季
    calculateStyleChange(val) {
      this.creatArrayNo(val);
      let iSShowStock = val.some((value) => {
        return value[0] == "04";
      });
      let iSShowincrement = val.some((value) => {
        return value[0] == "01";
      });
      this.iSShowStock = iSShowStock; //存量用户展示
      this.iSShowincrement = iSShowincrement; //增量用户展示
    },
    changeDict(dict, val) {
      dict.forEach((item) => {
        if (item.value === val) {
          return item.label;
        }
      });
    },
    creatArrayNo(val) {
      let asd = [];
      console.log(val);
      let tempArray1 = [];
      let tempArray2 = [];
      if (val.length <= this.form1.getPriceReportDataNo.length) {
        console.log("相等");
        for (let i = 0; i < val.length; i++) {
          tempArray1[val[i]] = true; //巧妙地方：把数组B的值当成临时数组1的键并赋值为真
        }
        for (let i = 0; i < this.form1.getPriceReportDataNo.length; i++) {
          if (tempArray1[this.form1.getPriceReportDataNo[i].gasType]) {
            tempArray2.push(this.form1.getPriceReportDataNo[i]); 
          }
        }
        this.form1.getPriceReportDataNo = tempArray2;
      } else if (val.length > this.form1.getPriceReportDataNo.length) {
        console.log('buxiangdeng---')
        for (let i = 0; i < this.form1.getPriceReportDataNo.length; i++) {
          tempArray1[this.form1.getPriceReportDataNo[i].gasType] = true; 
        }
        for (let i = 0; i < val.length; i++) {
          if (tempArray1[val[i]]) {
            console.log(tempArray1[val[i]]);
          } else {
            console.log("非调峰");
            let obj = {};
            // (obj.gasType = val[i][0]),
            (obj.gasType = val[i]),
              (obj.price = ""),
              (obj.gas = ""),
              // (obj.index1 = val[i][0]),
              (obj.index1 = val[i]),
              (obj.mounth = this.balance2),
              (obj.changeM = ""),
              (obj.type = 0); //采暖季
            tempArray2.push(obj);
          }
        }
        this.form1.getPriceReportDataNo = [
          ...this.form1.getPriceReportDataNo,
          ...tempArray2,
        ];
      }
      val.forEach((item) => {
        if (this.form1.getPriceReportDataNo.length > 0) {
          this.form1.getPriceReportDataNo.forEach((item1) => {
            if (item[0] === item1.index1) {
              return;
            } else {
              let obj = {};
              (obj.gasType = item[0]),
                (obj.price = ""),
                (obj.gas = ""),
                (obj.index1 = item[0]),
                (obj.mounth = this.balance2),
                (obj.changeM = ""),
                (obj.type = 0); //非采暖季
              asd.push(obj);
            }
          });
        } else {
          let obj = {};
          (obj.gasType = item[0]),
            (obj.price = ""),
            (obj.gas = ""),
            (obj.index1 = item[0]),
            (obj.mounth = this.balance2),
            (obj.changeM = ""),
            (obj.type = 0); //非采暖季
          asd.push(obj);
        }
      });
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
          console.log(this.form1.getPriceReportData1);
          tempArray1[this.form1.getPriceReportData1[i].gasType] = true; 
        }
        for (let i = 0; i < val.length; i++) {
          console.log(val[i]);
          if (tempArray1[val[i]]) {
            console.log(tempArray1[val[i]]);
          } else {
            // if (val[i][0] == "equilibrium2" || val[i][0] == "peak"  || val[i][0] == 'equilibrium3') {
             if (val[i] == "equilibrium2" || val[i] == "peak"  || val[i]== 'equilibrium3') {
             let obj = {
                childs: [],
              };
              let arrobj1 = {};
              let arrobj2 = {};
              (arrobj1.price = ""),
                (arrobj1.gas = ""),
                (arrobj1.mounth = this.balance2),
                (arrobj1.changeM = "");
              (arrobj2.price = ""),
                (arrobj2.gas = ""),
                (arrobj2.mounth = this.balance2),
                (arrobj2.changeM = "");
              (obj.index1 = val[i]),
                (obj.gasType = val[i]),
                // (obj.index1 = val[i][0]),
                // (obj.gasType = val[i][0]),
                (obj.type = 1); //采暖季
              obj.childs.push(arrobj1);
              obj.childs.push(arrobj2);
              tempArray2.push(obj);
            } else {
              console.log("非调峰");
              let obj = {};
              // (obj.gasType = val[i][0]),
              (obj.gasType = val[i]),
                (obj.price = ""),
                (obj.gas = ""),
                // (obj.index1 = val[i][0]),
                (obj.index1 = val[i]),
                (obj.mounth = this.balance2),
                (obj.changeM = ""),
                (obj.type = 1); //采暖季
              tempArray2.push(obj);
            }
          }
        }
        this.form1.getPriceReportData1 = [
          ...this.form1.getPriceReportData1,
          ...tempArray2,
        ];
        console.log(this.form1.getPriceReportData1);
      }
      return asd;
    },
    NocalculateStyleChange(val) {
      // 居民：02
      // 均衡：03
      // 存量：04
      // 调峰：05}
      this.creatArray(val);
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
      this.activeName = "02";
    },
    firstBtn() {
      this.stepActive = 1;
      this.activeName = "01";
    },
    submitBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let getMonthData = {};
          this.formT.setMouth1.forEach((element) => {
            let obj = {};
            obj.residents_gas = element.residents_gas;
            getMonthData[element.index] = obj;
          });
          this.formT.setMouth2.forEach((element) => {
            let obj = {};
            obj.residents_gas = element.residents_gas;
            getMonthData[element.index] = obj;
          });
          let dats = {
            averageDayNum: 0,
            baseGasPrice: this.formF.baseGasPrice, //基准门站价
            code: this.form.code, //供应商编码
            codeOrder: this.form.codeOrder, //供应商顺序
            codeTxt: this.form.codeTxt, //供应商
            creator: this.form.creator, //创建人
            downGasPlace: this.formF.downGasPlace
              ? this.formF.downGasPlace.join(",")
              : "", //下气站点，多个用逗哥隔开
            funText: {},
            gasSupply: this.formF.gasSupply, //冬夏供气比
            gasTypeConfigs: [],
            heatingEndTime: this.nextYear+"-03-01",
            heatingStartTime: this.curYear+"-11-01",
            id: this.form.id,
            modifier: this.form.modifier,
            noHeatingEndTime: this.curYear+"-10-30",
            noHeatingStartTime: this.curYear+"-04-01",
            pipelinePrice: this.formF.pipelinePrice,
            smartAdoptCalculateResidentGas: {
              code: this.form.code,
              codeTxt: this.form.codeTxt,
              creator: "",
              id: this.form.smartAdoptCalculateResidentGas?this.form.smartAdoptCalculateResidentGas.id:'',
              modifier: this.form.modifier,
              txt: getMonthData,
              year: "",
            },
            status:this.setComponyArray.status?1:0,
            version: this.form.version,
            xaReig: this.curComCode,
            xaReigTxt: "",
          };
          let arrCon = [
            ...this.form1.getPriceReportDataNo,
            ...this.form1.getPriceReportData1,
          ];
          this.form1.getPriceReportDataNo.forEach(element => {
            element.changeM = ['4','5','6','7','8','9','10']
          });
          arrCon.forEach((item, index) => {
              if(item.childs && item.childs.length>0){
                  item.childs.forEach(item1=>{
                      let obj = {};
                      obj.gasNum = item1.gas;
                      (obj.gasTypeName = this.NcalculateStylechange[item.gasType]),
                        (obj.gasTypeValue = item.gasType),
                        obj.id = item1.id;
                        // obj.childs = item.childs;
                        obj.smartSupplierConfigId = item.smartSupplierConfigId;
                        (obj.month = item1.changeM ? item1.changeM.join(",") : ""),
                        (obj.priceNum = item1.price),
                        (obj.type = item.type);
                        dats.gasTypeConfigs.push(obj)
                  })
              }else{
                  let obj = {};
                console.log(item)
                obj.gasNum = item.gas;
                (obj.gasTypeName = this.NcalculateStylechange[item.gasType]),
                (obj.gasTypeValue = item.gasType),
                obj.id = item.id;
                obj.childs = item.childs;
                 obj.smartSupplierConfigId = item.smartSupplierConfigId;
                (obj.month = item.changeM ? item.changeM.join(",") : ""),
                (obj.priceNum = item.price),
                (obj.type = item.type);
               dats.gasTypeConfigs.push(obj);
              }
              
          });
          api.purchasesDeploy.supplierUupdate(dats).then((res) => {
            if (res) {
              this.$message({
                message: "保存成功",
                type: "success",
                duration: 1000,
              });
              this.$emit("editSubmitSuccess", dats);
            } else {
              this.$emit("editSubmitFail", dats);
            }

          });
        } else {
          console.log("error submit!!");
          return false;
        }
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
    step1Next1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          (this.activeName = "02"), (this.stepActive = 2);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 第二步提交
    step2Submit(formName) {
      // 非采暖季
      let noheathing = this.form1.calculateStylev
        ? this.form1.calculateStylev.join(",")
        : "";
      if (noheathing.indexOf("residents") != -1) {
        this.NoheatingEndjumin = true;
      }
      // 采暖季
      let heathing = this.form1.NcalculateStylev.join(",");
      if (heathing.indexOf("residents") != -1) {
        this.heatingEndjumin = true;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          (this.activeName = "03"), (this.stepActive = 3);
          console.log('uidhhj')
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
    // 管输方tab栏
    handleClickGSF(tab) {
      console.log(tab)
      if (tab.name == "01") {
      } else if (tab.name === "02") {
      }
      else if(tab.name === "03"){
        this.step2Submit('form1') 
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
// .calculateV {
//     .el-select{
//       width: 100%;
//     }}
.purchases-deploy .el-date-editor--daterange.el-input__inner {
  width: 100%;
}
.deploy-edit{
    input[type=number]::-webkit-inner-spin-button,  
    input[type=number]::-webkit-outer-spin-button {  
        -webkit-appearance: none;  
        margin: 0;  
    }

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
    //   display: flex;
    //   flex-wrap: wrap;
    //   justify-content: center;
    .item-list {
      display: flex;
      // width: 30%;
      margin-right: 10px;
      .title {
        width: 30%;
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
  padding: 20px;
  .calculateV {
    .el-select{
      width: 100%;
    }
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
    span{
        font-size: 15px;
        color: #495464;
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
    span{
        font-size: 15px;
        color: #495464;
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
    .el-date-editor--daterange.el-input__inner {
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
  .purchases-deploy-step2 {
    .non-heating-season-new {
      .non-heating-season-title {
        display: flex;
        line-height: 50px;
        color: #a6a9b4;
        .title-item {
          font-size: 16px;
          &.first-item {
            width: 29%;
          }
          width: 40%;
        }
      }
      .non-heating-season-contant {
        padding-top: 10px;
        display: flex;
        .con-left {
          // width: 20%;
          width: 152px;
          font-size: 16px;
          color: #2c3e50;
          margin-top: 10px;
        }
        .con-right {
          width: 100%;

          .con-right-top {
            display: flex;
            width: 100%;
            .top-item {
              width: 50%;
              margin: 5px;
              .item-list {
                margin-bottom: 10px;
                .custom-unit {
                  position: absolute;
                  top: 0px;
                  right: 18px;
                }
              }
            }

            .price {
            }
            .gas {
            }
          }
          .con-right-bottom {
            padding: 6px;
            /deep/.el-cascader {
              width: 100%;
              .el-cascader__tags {
                left: 38px;
              }
            }
            .item-list {
            }
          }
        }
      }
    }
    .heating-season-new {
      .heating-season-title {
        display: flex;
        line-height: 50px;
        color: #a6a9b4;
        .title-item {
          font-size: 16px;
          &.first-item {
            width: 29%;
          }
          width: 40%;
        }
      }
      .heating-season-contant {
        padding-top: 10px;
        display: flex;
        .con-left {
          // width: 20%;
          width: 152px;
          font-size: 16px;
          color: #2c3e50;
          margin-top: 10px;
        }
        .con-right {
          width: 80%;
          //   .item-list{
          margin-bottom: 10px;
          .type-num {
            display: flex;
            .typr-title {
              width: 100px;
              position: absolute;
              left: 100px;
              margin-top: 10px;
            }
            .type-cont{
              width: 100%;
            }
          }
          .custom-unit {
            position: absolute;
            top: 0px;
            right: 18px;
          }
          .month {
            position: absolute;
            top: 0;
            left: 10px;
          }
          .con-right-top {
            display: flex;
            width: 100%;
            .top-item {
              width: 50%;
              margin: 5px;
              .item-list {
                margin-bottom: 10px;
                .custom-unit {
                  position: absolute;
                  top: 0px;
                  right: 18px;
                }
                .month {
                  position: absolute;
                  top: 0;
                  left: 10px;
                }
              }
            }

            .price {
            }
            .gas {
            }
          }
          .con-right-bottom {
            padding: 6px;
            /deep/.el-cascader {
              width: 100%;
              .el-input__inner {
                padding-left: 40px;
              }
              .el-cascader__tags {
                left: 40px;
              }
            }
          }
          //   }
        }
      }
    }
  }
}
</style>