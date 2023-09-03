<template>
  <div class="set-detail deploy-add">
    <div class="detail-title">
      <div class="title-left"></div>
    </div>
    <div class="detail-content loser-detail">
      <el-steps :active="stepActive" align-center>
        <el-step title="基础配置" description=""> </el-step>
        <el-step title="天然气销售价格机制" description=""> </el-step>
        <el-step title="完成" description=""></el-step>
      </el-steps>
      <el-form ref="formF" :rules="rules" :model="formF">
        <div v-if="stepActive === 1" class="purchases-deploy-step1">
          <div class="step-item-block">
            <el-form-item label="公司名称：" class="item-list" prop="codeTxt">
              <el-input v-model="formF.codeTxt"></el-input>
            </el-form-item>
            <el-form-item label="公司code：" class="item-list" prop="code">
              <el-input v-model="formF.code"></el-input>
            </el-form-item>
          </div>
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
                :key="item.value+'p'"
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
              <el-input v-model="formF.gasSupply"></el-input>
            </el-form-item>
          </div>
          <el-form-item class="step1-btn">
            <el-button type="primary" @click="step1Next1('formF')"
              >下一步</el-button
            >
          </el-form-item>
        </div>
      </el-form>
      <el-form ref="form1" :rules="rules" :model="form1">
        <!-- 步骤二 -->
        <div class="purchases-deploy-step2" v-if="stepActive === 2">
          <div class="non-heating-season">
            <img src="../assets/noheatingseason.png" alt="" />
            非采暖季
            <span>{{curYear+"/04/01"}} - {{curYear+"/10/30"}}</span>
          </div>
          <div class="">
            <el-form-item
              label="气量类型："
              class="item-list calculate"
              prop="calculateStylev"
            >
              <el-cascader
                :options="calculateStyle"
                v-model="form1.calculateStylev"
                :props="optionProps"
                @change="calculateStyleChange"
                ref="cascaderAddr"
                clearable
              ></el-cascader>
            </el-form-item>
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
              :key="index + 'll'"
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
                        v-model="item.price"
                        oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<0){value=value.slice(0,1)} "
                      ></el-input>
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
          <div class="">
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
              ></el-cascader>
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
              :key="index + 'l1'"
              v-for="(item, index) in form1.getPriceReportData1"
            >
              <div class="con-left">
                {{ NcalculateStylechange[item.index1] }}：
              </div>
              <div class="con-right">
                <div
                  v-if="
                    item.index1 != 'equilibrium2' &&
                    item.index1 != 'peak'
                    &&
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
                          oninput="if(isNaN(value)) { value = parseFloat(value) }if(value<0){value=value.slice(0,1)} "
                          type="number"
                          v-model="item.price"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div class="top-item gas"
                    v-if="
                        item.index1 != 'stock' && item.index1 != 'incremental'&& item.index1 !='residents'">
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
            <el-button type="primary" @click="step2Submit('form1')" v-trace="{title:'气源采购-采购配置-点击供应商设置-提交'}"
              >提交</el-button
            >
          </el-form-item>
        </div>
      </el-form>
      <!-- 步骤三 -->
      <el-form ref="formT" :model="formT" :rules="rules">
        <div class="purchases-deploy-step3" v-if="stepActive === 3">
          <div class="step3-item-title">
            <div class="title-name">月份</div>
            <div class="title-gas">气量</div>
          </div>
          <div class="step3-item-block">
            <template v-if="NoheatingEndjumin">
              <div
                v-for="(item, index) in formT.setMouth1"
                :key="index +'o'"
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
                v-for="(item, index) in formT.setMouth2"
                :key="index +'i'"
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
    </div>
  </div>
</template>
<script>
import api from "/src/http/api";
export default {
  name: "reply",
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
        codeTxt: "",
        code: "", //公司code
        downGasPlace: "", //下气站点，多个用逗哥隔开
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
      downGasPlace: "",
      balance1V2: "",
      balance1V1: "",
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
      // 非采暖季是否选择了居民方式
      NoheatingEndjumin: false,
      // 采暖季是否选择了居民方式
      heatingEndjumin: false,
      calculateStyle: [

      ],
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
      iSShowStock: "", //存量用户展示
      iSShowincrement: "", //增量用户展示
      iSShowresident: "", //居民气量
      iSShowbalanced: "", // 均衡气量
      iSShowpeakRegulation: "", // 调峰气量
      pitchPeakV2: "", //非居民调峰2
      pitchPeakV1: "", //非居民调峰
      gasHeatingSeasonDate: [], //获取采暖季时间
      isSubmitSuccess: "1", //提交成功
      isSubmit: false,
      SubmitSuccessData: "", //提交成功返回数据
      rules: {
        code: [{ required: true, message: "请输入公司code", trigger: "blur" }],
        codeTxt: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        calculateStylev: [
          { required: true, message: "请输入气量类型", trigger: "change" },
        ],
        NcalculateStylev: [
          { required: true, message: "请输入气量类型", trigger: "change" },
        ],
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
      },
      curYear:'',//当前年
      nextYear:''//下一年 
      
    };
  },
  components: {},

  created() {
    // 获取气量类型
    this.supplierGetGasType();
    let getdate = new Date();
    this.curYear = getdate.getFullYear();
    this.nextYear = getdate.getFullYear() +1;
  },

  computed: {
    curComCode: function () {
      return this.$store.getters.curCom;
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

  mounted() {},

  methods: {
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
    handleChange() {},
    firstBtn() {
      this.stepActive = 1;
    },
    secondBtn() {
      this.stepActive = 2;
    },
    // 第二步提交
    step2Submit(formName) {
      console.log("第三步");

      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 非采暖季
          console.log(this.form1.calculateStylev);
          let noheathing = this.form1.calculateStylev
            ? this.form1.calculateStylev.join(",")
            : "";
          if (noheathing.indexOf("residents") != -1) {
            this.NoheatingEndjumin = true;
          }
          // 采暖季
          let heathing = this.form1.NcalculateStylev
            ? this.form1.NcalculateStylev.join(",")
            : "";
          if (heathing.indexOf("residents") != -1) {
            this.heatingEndjumin = true;
          }
          this.stepActive = 3;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    step1Next1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.stepActive = 2;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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

          let dats = {
            averageDayNum: 0,
            baseGasPrice: this.formF.baseGasPrice, //基准门站价
            code: this.formF.code, //供应商编码
            codeOrder: this.form.codeOrder, //供应商顺序
            codeTxt: this.formF.codeTxt, //供应商
            creator: this.form.creator, //创建人
            downGasPlace: this.formF.downGasPlace
              ? this.formF.downGasPlace.join(",")
              : "", //下气站点，多个用逗哥隔开
            funText: {},
            gasSupply: this.formF.gasSupply, //冬夏供气比
            gasTypeConfigs: [],
            heatingEndTime: this.nextYear+"-03-01",
            heatingStartTime: this.curYear+"-11-01",
            id: 0,
            modifier: "",
            noHeatingEndTime: this.curYear+"-10-30",
            noHeatingStartTime: this.curYear+"-04-01",
            pipelinePrice: this.formF.pipelinePrice,
            smartAdoptCalculateResidentGas: {
              code: this.formF.code,
              codeTxt: this.formF.codeTxt,
              creator: "",
              id: 0,
              modifier: "",
              txt: getMonthData,
              year: "",
            },
            status: 0,
            version: 0,
            xaReig: this.curComCode,
            xaReigTxt: "",
          };

          let arrCon = [
            ...this.form1.getPriceReportDataNo,
            ...this.form1.getPriceReportData1,
          ];
          console.log(arrCon);
          this.form1.getPriceReportDataNo.forEach(element => {
            element.changeM = ['4','5','6','7','8','9','10']
          });
          arrCon.forEach((item, index) => {
            if (item.childs && item.childs.length>0) {
              item.childs.forEach((item1) => {
                let obj = {};
                obj.gasNum = item1.gas;
                (obj.gasTypeName = this.NcalculateStylechange[item.gasType]),
                  (obj.gasTypeValue = item.gasType),
                  (obj.id = 0),
                  (obj.month = item1.changeM ? item1.changeM.join(",") : ""),
                  (obj.priceNum = item1.price),
                  (obj.smartSupplierConfigId = 0),
                  (obj.type = item.type);
                dats.gasTypeConfigs.push(obj);
              });
            } else {
              let obj = {};
              obj.gasNum = item.gas;
              (obj.gasTypeName = this.NcalculateStylechange[item.gasType]),
                (obj.gasTypeValue = item.gasType),
                (obj.id = 0),
                (obj.month = item.changeM ? item.changeM.join(",") : ""),
                (obj.priceNum = item.price),
                (obj.smartSupplierConfigId = 0),
                (obj.type = item.type);
              dats.gasTypeConfigs.push(obj);
            }
          });
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
                this.$emit("addSubmitSuccess", res);
                this.SubmitSuccessData = res[0];
              }
            } else {
              this.$emit("addSubmitFail", dats);
              this.isSubmit = true;
              this.isSubmitSuccess = "0";
              this.stepActive = "1";
            }
          });
        } else {
          console.log("error submit!!");
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
          console.log(this.NcalculateStylechange);
        }
      });
    },
    NoHeatingSeasonChange() {},
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
    creatArrayNo(val) {
      let asd = [];
      let tempArray1 = [];
      let tempArray2 = [];
      if (val.length <= this.form1.getPriceReportDataNo.length) {
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
        for (let i = 0; i < this.form1.getPriceReportDataNo.length; i++) {
          tempArray1[this.form1.getPriceReportDataNo[i].gasType] = true; 
        }
        for (let i = 0; i < val.length; i++) {
          if (tempArray1[val[i]]) {
            console.log(tempArray1[val[i]]);
          } else {
            console.log("非调峰");
            let obj = {};
            (obj.gasType = val[i][0]),
              (obj.price = ""),
              (obj.gas = ""),
              (obj.index1 = val[i][0]),
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
                (obj.changeM = ""), //已选择的月份
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
        console.log(this.form1.getPriceReportData1);
      } else if (val.length > this.form1.getPriceReportData1.length) {
        for (let i = 0; i < this.form1.getPriceReportData1.length; i++) {
          console.log(this.form1.getPriceReportData1);
          tempArray1[this.form1.getPriceReportData1[i].gasType] = true; 
        }
        for (let i = 0; i < val.length; i++) {
          if (tempArray1[val[i]]) {
          } else {
            if (val[i][0] == "equilibrium2" || val[i][0] == "peak" || val[i][0] == 'equilibrium3') {
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
                (obj.index1 = val[i][0]),
                (obj.gasType = val[i][0]),
                (obj.type = 1); //采暖季
              obj.childs.push(arrobj1);
              obj.childs.push(arrobj2);
              tempArray2.push(obj);
            } else {
              let obj = {};
                (obj.gasType = val[i][0]),
                (obj.price = ""),
                (obj.gas = ""),
                (obj.index1 = val[i][0]),
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
      }
      return asd;
    },
    NocalculateStyleChange(val) {
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
  },
};
</script>
<style lang="scss" scoped>
.deploy-add{
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
    .item-list {
      display: flex;
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
  .non-heating-season-new {
    .non-heating-season-title {
      display: flex;
      line-height: 50px;
      color: #a6a9b4;
      .title-item {
        font-size: 16px;
        &.first-item {
          width: 23%;
        }
        width: 40%;
      }
    }
    .non-heating-season-contant {
      padding-top: 10px;
      display: flex;
      .con-left {
        width: 20%;
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
          width: 23%;
        }
        width: 40%;
      }
    }
    .heating-season-contant {
      padding-top: 10px;
      display: flex;
      .con-left {
        width: 20%;
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
          position: relative;
          .typr-title {
            width: 100px;
            position: absolute;
              left: -60px;
            margin-top: 10px;
          }
          .type-cont{
            width:100%;
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
      }
    }
  }
}
</style>