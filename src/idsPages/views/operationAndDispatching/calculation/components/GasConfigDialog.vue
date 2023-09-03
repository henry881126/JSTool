<!--
 * @Description: 气量参数获取/配置组件，包含"气源"、"门站"、"调压站"、"客户"数据
 * @author: wanghongxuan
 * @date: 2021-11-09
-->
<template>
  <div class="gas-config">
    <el-dialog
      width="1645px"
      :show-close="false"
      :visible.sync="visible"
      custom-class="gas-config-dialog"
      class="custom-dialog-n"
      :before-close="cancel"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div slot="title" class="dialog-title">
        <span class="gas-config-title">日气量参数提取/配置/确认</span>
        <select-date
          :isPrePlanPage="isPrePlanPage"
          @planDateChange="planDateChange"
        ></select-date>
      </div>
      <div class="gas-config-content">
        <div class="gas-source">
          <div class="gas-header">
            <span class="gas-header-label">气源</span>
            <div>
              <span>日批复量(万m³)</span>
              <img :src="pullIcon" alt="" />
            </div>
          </div>
          <div class="gas-source-type gas-source-position1">
            <div class="gas-source-type-item">
              <span>中石油</span>
              <el-input
                v-model="gasSource.zsy.todayReply"
                placeholder="-"
                :maxlength="7"
                @change="
                  (val) => {
                    validateDecimal(val, 'zsy');
                  }
                "
              ></el-input>
            </div>
            <div class="gas-source-type-item">
              <span>中海油</span>
              <el-input
                v-model="gasSource.zhy.todayReply"
                placeholder="-"
                :maxlength="7"
                @change="
                  (val) => {
                    validateDecimal(val, 'zhy');
                  }
                "
              ></el-input>
            </div>
            <div class="gas-source-type-item">
              <span>中石化</span>
              <el-input
                v-model="gasSource.zsh.todayReply"
                placeholder="-"
                :maxlength="7"
                @change="
                  (val) => {
                    validateDecimal(val, 'zsh');
                  }
                "
              ></el-input>
            </div>
          </div>
          <div class="gas-source-type gas-source-position2">
            <div class="gas-source-type-item">
              <span>九丰</span>
              <el-input
                v-model="gasSource.jf.todayReply"
                placeholder="-"
                :maxlength="7"
                @change="
                  (val) => {
                    validateDecimal(val, 'jf');
                  }
                "
              ></el-input>
            </div>
          </div>
          <div class="gas-source-type gas-source-position3">
            <div class="gas-source-type-item">
              <span>大鹏合同气</span>
              <el-input
                v-model="gasSource.dphtq.todayReply"
                placeholder="-"
                :maxlength="7"
                @change="
                  (val) => {
                    validateDecimal(val, 'dphtq');
                  }
                "
              ></el-input>
            </div>
            <div class="gas-source-type-item">
              <span>大鹏代加工</span>
              <el-input
                v-model="gasSource.dpdjg.todayReply"
                placeholder="-"
                :maxlength="7"
                @change="
                  (val) => {
                    validateDecimal(val, 'dpdjg');
                  }
                "
              ></el-input>
            </div>
          </div>
        </div>
        <div class="gas-station">
          <div class="gas-header">
            <span class="gas-header-label">门站</span>
            <img :src="pullIcon" alt="" />
          </div>
          <div class="gas-station-content">
            <svg class="gas-station-content-svg">
              <!-- 底色线段 -->
              <g class="svg-line-path">
                <polyline points="0,3 110,3 110,48 291,48 291,129 376,129" />
                <polyline points="0,93 110,93 110,48" />
                <line x1="0" y1="209" x2="291" y2="209" />
                <polyline points="0,410 291,410 291,129" />
                <polyline points="110,410 110,340 291,340" />
                <line x1="110" y1="410" x2="110" y2="483" />
                <polyline points="113,480 376,480" style="stroke: #d734d6" />
              </g>
              <!-- 动画线段填充 -->
              <g class="svg-line-fill">
                <polyline points="0,3 110,3 110,48 291,48 291,129 376,129" />
                <polyline points="0,93 110,93 110,48" />
                <line x1="0" y1="209" x2="291" y2="209" />
                <polyline points="0,410 291,410 291,129" />
                <polyline points="110,410 110,340 291,340" />
                <line x1="110" y1="410" x2="110" y2="483" />
                <polyline points="113,480 376,480" />
              </g>
            </svg>
            <span class="pipe1">国网</span>
            <span class="pipe2">省网</span>
            <span class="pipe3">九丰</span>
            <span class="pipe4">大鹏</span>
            <span class="station1">
              谢岗门站
              <span
                v-show="gateStation.xg.stationId"
                class="station-config-detail"
                @click="showStationConfig(gateStation.xg, 'xg')"
              >
                <img
                  :src="isXgConfigDone ? greenConfigIcon : blackConfigIcon"
                  alt=""
                />详细设置
              </span>
            </span>
            <span class="station2">
              九丰LNG站
              <span
                v-show="gateStation.jf.stationId"
                class="station-config-detail"
                @click="showStationConfig(gateStation.jf, 'jf')"
              >
                <img
                  :src="isJfConfigDone ? greenConfigIcon : blackConfigIcon"
                  alt=""
                />详细设置
              </span>
            </span>
            <span class="station3">
              东城门站
              <span
                v-show="gateStation.dc.stationId"
                class="station-config-detail"
                @click="showStationConfig(gateStation.dc, 'dc')"
              >
                <img
                  :src="isDcConfigDone ? greenConfigIcon : blackConfigIcon"
                  alt=""
                />详细设置
              </span>
            </span>
            <span class="station4">
              高埗门站
              <span
                v-show="gateStation.gb.stationId"
                class="station-config-detail"
                @click="showStationConfig(gateStation.gb, 'gb')"
              >
                <img
                  :src="isGbConfigDone ? greenConfigIcon : blackConfigIcon"
                  alt=""
                />详细设置
              </span>
            </span>
            <span class="station5">
              樟木头门站
              <span
                v-show="gateStation.zmt.stationId"
                class="station-config-detail"
                @click="showStationConfig(gateStation.zmt, 'zmt')"
              >
                <img
                  :src="isZmtConfigDone ? greenConfigIcon : blackConfigIcon"
                  alt=""
                />详细设置
              </span>
            </span>
          </div>
        </div>
        <div class="gas-pressure">
          <div class="gas-pressure-top">
            <div class="gas-header">
              <span class="gas-header-label">调压站</span>
              <div>
                <span>日计划(万m³)</span>
                <span>最大瞬时(万m³/h)</span>
                <img :src="pullIcon" alt="" />
              </div>
            </div>
            <ul class="gas-pressure-list">
              <li
                v-for="(item, index) in pressureList"
                :key="item.stationId + index"
              >
                <span>{{ item.stationName }}</span>
                <el-input
                  v-model="item.todayPlan"
                  placeholder="-"
                  :maxlength="7"
                  @change="
                    (val) => {
                      validateDecimalSC(
                        val,
                        index,
                        'pressureList',
                        'todayPlan'
                      );
                    }
                  "
                ></el-input>
                <el-input
                  v-model="item.maxInstantFlow"
                  placeholder="-"
                  :maxlength="7"
                  @change="
                    (val) => {
                      validateDecimalSC(
                        val,
                        index,
                        'pressureList',
                        'maxInstantFlow'
                      );
                    }
                  "
                ></el-input>
              </li>
            </ul>
          </div>
          <div class="gas-pressure-bottom">
            <div class="gas-header">
              <span class="gas-header-label">调压站</span>
              <div>
                <span>日计划(万m³)</span>
                <span>最大瞬时(万m³/h)</span>
                <img :src="pullIcon" alt="" />
              </div>
            </div>
            <ul class="gas-pressure-list">
              <li
                v-for="(item, index) in pressureList2"
                :key="item.stationId + index"
              >
                <span>{{ item.stationName }}</span>
                <el-input
                  v-model="item.todayPlan"
                  placeholder="-"
                  :maxlength="7"
                  @change="
                    (val) => {
                      validateDecimalSC(
                        val,
                        index,
                        'pressureList2',
                        'todayPlan'
                      );
                    }
                  "
                ></el-input>
                <el-input
                  v-model="item.maxInstantFlow"
                  placeholder="-"
                  :maxlength="7"
                  @change="
                    (val) => {
                      validateDecimalSC(
                        val,
                        index,
                        'pressureList2',
                        'maxInstantFlow'
                      );
                    }
                  "
                ></el-input>
              </li>
            </ul>
          </div>
        </div>
        <div class="gas-customer">
          <div class="gas-header">
            <span class="gas-header-label">客户</span>
            <div>
              <span>日指定量(万m³)</span>
              <span>最大瞬时(万m³/h)</span>
              <span>压力下限(MPa)</span>
              <img :src="pullIcon" alt="" />
            </div>
          </div>
          <ul class="gas-customer-list">
            <li
              v-for="(item, index) in customerList"
              :key="item.simulationId + index"
            >
              <span>{{ item.customerName }}</span>
              <el-input
                v-model="item.todayReply"
                placeholder="-"
                :maxlength="7"
                @change="
                  (val) => {
                    validateDecimalSC(val, index, 'customerList', 'todayReply');
                  }
                "
              ></el-input>
              <el-input
                v-model="item.maxInstantFlow"
                placeholder="-"
                :maxlength="7"
                @change="
                  (val) => {
                    validateDecimalSC(
                      val,
                      index,
                      'customerList',
                      'maxInstantFlow'
                    );
                  }
                "
              ></el-input>
              <el-input
                v-model="item.minPressure"
                placeholder="-"
                :maxlength="7"
                @change="
                  (val) => {
                    validateDecimalSC(
                      val,
                      index,
                      'customerList',
                      'minPressure'
                    );
                  }
                "
              ></el-input>
              <img
                v-show="item.customerCode"
                :src="
                  item.setupCompleted == 1 ? greenConfigIcon : blackConfigIcon
                "
                alt=""
                @click="showCustomerConfig(item, index)"
              />
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer gas-footer-btn">
        <!-- <button v-show="!isPrePlanPage" @click="savePrePlan">保存预案</button> -->
        <el-button type="primary" @click="confirm" round :loading="confirmLoading">确定</el-button>
        <el-button type="detault" @click="cancel" round>取消</el-button>
      </div>
    </el-dialog>

    <!-- 门站详细设置 -->
    <station-config-detail
      v-if="stationVisible"
      :dialogVisible.sync="stationVisible"
      :pageType="isPrePlanPage ? 2 : 1"
      @changeClose="getStationsDetailData"
    />

    <!-- 客户详细设置 -->
    <customer-config-detail
      v-if="customerVisible"
      :dialogVisible.sync="customerVisible"
      :pageType="isPrePlanPage ? 2 : 1"
      @changeClose="getCustomerDetailData"
    />

    <!-- 保存为预案弹窗 (已弃用)-->
    <!-- <el-dialog
      title="新建预案"
      width="447px"
      v-if="planNameVisible"
      custom-class="create-plan-name-dialog"
      :visible.sync="planNameVisible"
      :before-close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="70px"
        label-position="left"
        :hide-required-asterisk="true"
      >
        <el-form-item
          label="预案名称"
          prop="planName"
          label-width="80px"
          :rules="[{ required: true, message: '预案名称不能为空' }]"
        >
          <el-input v-model="form.planName" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit" :loading="submitLoading">
          确定
        </el-button>
        <el-button @click="close">取消</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import SelectDate from "./GasConfigSelectDate.vue";
import CustomerConfigDetail from "./clientconfig-newlog.vue";
import StationConfigDetail from "./stationinfo-newlog.vue";
export default {
  components: { SelectDate, CustomerConfigDetail, StationConfigDetail },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isPrePlanPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        planName: "",
      },
      submitLoading: false,
      confirmLoading: false,
      // planNameVisible: false,
      stationData: {
        stationAbbr: "",
        stationId: "",
        stationName: "",
        setupCompleted: "",
        historyFlag: "",
        flowList: [{ defaultValue: "", currentValue: "" }],
        pressList: [{ defaultValue: "", currentValue: "" }],
      },
      customerData: {
        customerIndex: "",
        customerCode: "",
        customerName: "",
        setupCompleted: "",
        historyFlag: "", // 历史工矿 0为没选择 1为选择
        flowList: [{ defaultValue: "", currentValue: "" }],
      },
      pullIcon: require("../../../../images/pull.png"),
      setupComplete: "0",
      stationVisible: false,
      customerVisible: false,
      blackConfigIcon: require("../../../../images/black-config.png"),
      greenConfigIcon: require("../../../../images/green-config.png"),
      // 气源
      gasSource: {
        zsy: { todayReply: "", simulationId: "" },
        zhy: { todayReply: "", simulationId: "" },
        zsh: { todayReply: "", simulationId: "" },
        jf: { todayReply: "", simulationId: "" },
        dphtq: { todayReply: "", simulationId: "" },
        dpdjg: { todayReply: "", simulationId: "" },
      },
      // 门站
      gateStation: {
        xg: { stationId: "", stationName: "谢岗门站", setupCompleted: 0 },
        jf: { stationId: "", stationName: "九丰LNG站", setupCompleted: 0 },
        dc: { stationId: "", stationName: "东城门站", setupCompleted: 0 },
        gb: { stationId: "", stationName: "高埗门站", setupCompleted: 0 },
        zmt: { stationId: "", stationName: "樟木头门站", setupCompleted: 0 },
      },
      // 调压站
      pressureList: [],
      pressureList2: [],
      // 客户
      customerList: [],
    };
  },
  computed: {
    ...mapState({
      planId: (state) => state.calculation.planId,
    }),
    isXgConfigDone() {
      if (this.gateStation.xg.setupCompleted == 1) return true;
    },
    isJfConfigDone() {
      if (this.gateStation.jf.setupCompleted == 1) return true;
    },
    isDcConfigDone() {
      if (this.gateStation.dc.setupCompleted == 1) return true;
    },
    isGbConfigDone() {
      if (this.gateStation.gb.setupCompleted == 1) return true;
    },
    isZmtConfigDone() {
      if (this.gateStation.zmt.setupCompleted == 1) return true;
    },
  },
  created() {
    // 页面初始化获取日气量参数设置详情
    this.initPlanConfigDetail();
  },
  methods: {
    // 初始化时，获取气量参数详情
    initPlanConfigDetail() {
      const params = {
        planId: this.planId,
      };
      this.$store
        .dispatch("calculation/getPlanConfigDetailInit", params)
        .then((res) => {
          const { resultCode, data } = res;
          if (resultCode == 0) {
            const { gas, gateStation, regulatorStationList, customerList } =
              data;
            // 气源
            this.gasSource = gas;
            // 门站
            this.gateStation = gateStation;
            // 客户列表
            if (this.isPrePlanPage) {
              // 预案库模式下不设默认值
              this.customerList = customerList;
            } else {
              // 24小时模式下，玖龙与虎门压力下线默认值设置为3.000，
              customerList.forEach((item) => {
                if (item.customerName === "玖龙纸业" && !item.minPressure) {
                  item.minPressure = "3.000";
                }
                if (item.customerName === "虎门电厂" && !item.minPressure) {
                  item.minPressure = "3.000";
                }
              });
              this.customerList = customerList;
            }
            // 调压站，从列表中提取单独的"塘厦调压站"
            let pList = JSON.parse(JSON.stringify(regulatorStationList));
            let i = pList.findIndex(
              (item) => item.stationName === "塘厦调压站"
            );
            // 获取塘厦调压站
            if (i > -1) {
              this.pressureList2 = pList.splice(i, 1);
            }
            this.pressureList = pList;
          }
        });
    },
    // 选择日期时，获取气量参数详情
    planDateChange(date) {
      this.pressureList = [];
      this.pressureList2 = [];
      this.customerList = [];
      if (!date) return;
      const params = {
        planId: this.planId,
        planDate: date,
      };
      this.$store
        .dispatch("calculation/getPlanConfigDetail", params)
        .then((res) => {
          const { resultCode, data } = res;
          if (resultCode === 0) {
            const { gas, gateStation, regulatorStationList, customerList } =
              data;
            // 气源
            this.gasSource = gas;
            // 门站
            this.gateStation = gateStation;
            // 客户列表，24小时模式下，玖龙与虎门压力下线默认3.000
            if (this.isPrePlanPage) {
              this.customerList = customerList;
            } else {
              customerList.forEach((item) => {
                if (item.customerName === "玖龙纸业" && !item.minPressure) {
                  item.minPressure = "3.000";
                }
                if (item.customerName === "虎门电厂" && !item.minPressure) {
                  item.minPressure = "3.000";
                }
              });
              this.customerList = customerList;
            }
            // 调压站，从列表中提取单独的"塘厦调压站"
            let pList = JSON.parse(JSON.stringify(regulatorStationList));
            let i = pList.findIndex(
              (item) => item.stationName === "塘厦调压站"
            );
            // 获取塘厦调压站
            if (i > -1) {
              this.pressureList2 = pList.splice(i, 1);
            }
            this.pressureList = pList;
          }
        });
    },
    // 气量参数数据保存为预案
    // savePrePlan() {
    //   this.planNameVisible = true;
    // },
    // submit() {
    //   this.$refs.form.validate((valid) => {
    //     if (valid) {
    //       this.submitLoading = true;
    //       const params = {
    //         planId: this.planId,
    //         planName: this.form.planName, // 预案库名称
    //         gas: this.gasSource,
    //         gateStation: this.gateStation,
    //         regulatorStationList: [...this.pressureList, ...this.pressureList2],
    //         customerList: this.customerList,
    //       };
    //       this.$store
    //         .dispatch("calculation/saveReservePlanConfig", params)
    //         .then((res) => {
    //           const { resultCode, data } = res;
    //           if (resultCode == 0) {
    //             this.submitLoading = false;
    //             // 关闭新建预案弹框
    //             this.planNameVisible = false;
    //             // 关闭日气量参数弹框
    //             this.removeLocal();
    //             this.$emit("update:visible", false);
    //           }
    //         });
    //     } else {
    //       this.submitLoading = false;
    //     }
    //   });
    // },
    // close() {
    //   this.planNameVisible = false;
    // },
    // 气量参数数据保存
    confirm() {
      this.confirmLoading = true;
      // 校验必填项
      let rsList = [...this.pressureList, ...this.pressureList2];
      // 如果是预案库页面，校验数据(后端校验，前端不做校验)
      // if (this.isPrePlanPage) {
      //   let isNext = this.validateStaAndCus(rsList, this.customerList);
      //   if (!isNext) return;
      // }

      // 场站设置筛选进口压力数据
      let gateStationObj = this.filterPressureOfStation(this.gateStation);

      const params = {
        planId: this.planId,
        gas: this.gasSource,
        gateStation: gateStationObj,
        regulatorStationList: rsList,
        customerList: this.customerList,
      };
      this.$store.dispatch("calculation/savePlanConfig", params).then((res) => {
        const { resultCode, data } = res;
        if (resultCode === 0) {
          this.removeLocal();
          this.$message.success("保存成功");
          this.$emit("update:visible", false);
          this.$store.commit(
            "calculation/IS_ALL_GAS_CONFIG_DONE",
            data.setupCompleted
          );
          localStorage.setItem("_setupCompleted", data.setupCompleted);
          this.confirmLoading = false;
        }
      });
    },
    // 取消
    cancel() {
      this.removeLocal();
      this.$emit("update:visible", false);
    },
    removeLocal() {
      localStorage.removeItem("stationObj");
      localStorage.removeItem("customerObj");
    },
    // 点击门站详细设置
    showStationConfig(station, abbr) {
      // 进口压力开关默认参数修改
      let pressLen = station?.pressList?.length;
      for (let i = 0; i < pressLen; i++) {
        const item = station.pressList[i];
        if (item.parameterName === "进口压力") {
          item.openFlag = 1;
          break;
        }
      }
      this.stationData = {
        stationAbbr: abbr,
        ...station,
      };
      localStorage.setItem("stationObj", JSON.stringify(this.stationData));
      this.stationVisible = true;
    },
    // 点击客户详细设置
    showCustomerConfig(customer, i) {
      this.customerData = {
        customerIndex: i,
        ...customer,
      };
      localStorage.setItem("customerObj", JSON.stringify(this.customerData));
      this.customerVisible = true;
    },
    // 获取门站详细设置数据
    getStationsDetailData(stationData) {
      // console.log("stationData", stationData);
      // 处理逻辑
      Object.keys(this.gateStation).forEach((key, index) => {
        if (stationData.stationAbbr === key) {
          delete stationData.stationAbbr;
          this.gateStation[key] = stationData;
        }
      });
    },
    // 获取客户详细设置数据
    getCustomerDetailData(customerData) {
      // console.log("customerData", customerData);
      // 处理逻辑
      let index = customerData.customerIndex;
      delete customerData.customerIndex;
      this.customerList.splice(index, 1, customerData);
    },
    // 校验调压站与客户的必填项
    // validateStaAndCus(staList, cuslist) {
    //   let isNext = true;
    //   for (let index = 0, len = staList.length; index < len; index++) {
    //     const item = staList[index];
    //     if (!item.todayPlan || !item.maxFlow) {
    //       this.$message.error("调压站数据不能为空");
    //       isNext = false;
    //       break;
    //     }
    //   }
    //   if (!isNext) return;
    //   for (let index = 0, len = cuslist.length; index < len; index++) {
    //     const item = cuslist[index];
    //     if (!item.todayReply || !item.maxFlow) {
    //       this.$message.error("客户数据不能为空");
    //       isNext = false;
    //       break;
    //     }
    //   }
    //   return isNext;
    // },
    // 气源三位小数校验
    validateDecimal(value, path) {
      if (!value) return;
      let reg = /^\d{1,3}(\.\d{1,3})?$/;
      // 正则判断数据的正却行
      if (!reg.test(value)) {
        this.gasSource[path].todayReply = "";
        this.$message.warning("请输入正确的格式");
        return;
      }
      value = parseFloat(value).toString();
      // 如果带小数点
      let hasDecimal = value.includes(".");
      if (hasDecimal) {
        let decimals = value.split(".")[1];
        if (decimals.length === 1) {
          this.gasSource[path].todayReply = `${value}00`;
        } else if (decimals.length === 2) {
          this.gasSource[path].todayReply = `${value}0`;
        }
      } else {
        this.gasSource[path].todayReply = `${value}.000`;
      }
    },
    // 调压站、客户三位小数校验
    validateDecimalSC(value, i, parentName, key) {
      if (!value) return;
      let reg = /^\d{1,3}(\.\d{1,3})?$/;
      // 正则判断数据的正却行
      if (!reg.test(value)) {
        this[parentName][i][key] = "";
        this.$message.warning("请输入正确的格式");
        return;
      }
      value = parseFloat(value).toString();
      // 如果带小数点
      let hasDecimal = value.includes(".");
      if (hasDecimal) {
        let decimals = value.split(".")[1];
        if (decimals.length === 1) {
          this[parentName][i][key] = `${value}00`;
        } else if (decimals.length === 2) {
          this[parentName][i][key] = `${value}0`;
        }
      } else {
        this[parentName][i][key] = `${value}.000`;
      }
    },
    // 筛选非进口压力数据
    filterPressureOfStation(station) {
      let stationKeys = ["xg", "jf", "dc", "gb", "zmt"];
      stationKeys.forEach((key) => {
        station[key].pressList = station[key].pressList.filter(
          (item) => item.parameterName !== "进口压力"
        );
      });
      return station;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-title {
  text-align: left;
}
.gas-config-title {
  width: 215px;
  height: 25px;
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 25px;
  margin-right: 21px;
}
.gas-config-content {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .gas-source,
  .gas-station,
  .gas-customer {
    height: 572px;
    background: #f2f6fc;
    padding: 10px;
    box-sizing: border-box;
  }

  .gas-source {
    width: 261px;
    margin-right: 53px;

    .gas-source-type {
      width: 100%;
      background: #ffffff;
      margin: 10px 0;
      padding: 0 10px;
      box-sizing: border-box;
      overflow: hidden;

      .gas-source-type-item {
        overflow: hidden;
        width: 100%;
        text-align: left;
        height: 36px;
        line-height: 36px;

        .el-input {
          float: right;
          margin-right: 38px;
        }
      }
    }
    .gas-source-position2 {
      margin-top: 94px;
    }

    .gas-source-position3 {
      margin-top: 142px;
    }
  }
  .gas-station {
    position: relative;
    width: 356px;
    margin-right: 20px;

    .gas-station-content {
      position: absolute;
      left: 0;
      top: 54px;
      width: 376px;
      height: 500px;

      .station-config-detail {
        &:hover {
          cursor: pointer;
        }
      }
      .gas-station-content-svg {
        width: 100%;
        height: 100%;

        .svg-line-path {
          line,
          polyline {
            fill: none;
            stroke-width: 6;
            stroke: #f5222d;
          }
        }
        .svg-line-fill {
          line,
          polyline {
            fill: none;
            stroke-width: 4;
            stroke: #fff;
            stroke-dasharray: 10;
            stroke-dashoffset: 0;
            animation: lineMove 150s linear infinite;
          }

          // 设置动画
          @keyframes lineMove {
            100% {
              stroke-dashoffset: -2400;
            }
          }
        }
      }
    }

    .pipe1 {
      position: absolute;
      left: -30px;
      top: -7px;
    }
    .pipe2 {
      position: absolute;
      left: -30px;
      top: 83px;
    }
    .pipe3 {
      position: absolute;
      left: -30px;
      top: 199px;
    }
    .pipe4 {
      position: absolute;
      left: -30px;
      top: 400px;
    }

    .pipe1,
    .pipe2,
    .pipe3,
    .pipe4 {
      width: 28px;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #303133;
      line-height: 20px;
    }

    .station1 {
      position: absolute;
      right: 105px;
      top: 24px;
    }
    .station2 {
      position: absolute;
      right: 105px;
      top: 186px;
    }
    .station3 {
      position: absolute;
      right: 105px;
      top: 316px;
    }
    .station4 {
      position: absolute;
      right: 105px;
      top: 386px;
    }
    .station5 {
      position: absolute;
      right: 105px;
      top: 456px;
    }

    .station1,
    .station2,
    .station3,
    .station4,
    .station5 {
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #303133;
      line-height: 20px;

      img {
        height: 10px;
        width: 10px;
        margin: 0 5px;
      }
    }
  }
  .gas-pressure {
    width: 394px;
    height: 572px;
    margin-right: 20px;

    .gas-pressure-top {
      height: 470px;
      background: #f2f6fc;
      margin-bottom: 20px;
      padding: 10px;
      box-sizing: border-box;
    }

    .gas-pressure-bottom {
      height: 82px;
      background: #f2f6fc;
      padding: 10px;
      box-sizing: border-box;
    }
    .gas-pressure-list {
      overflow: auto;
      height: 416px;
      text-align: left;
      padding: 0 10px;
      margin-top: 10px;

      li {
        position: relative;
        height: 30px;
        line-height: 30px;

        .el-input:nth-child(2) {
          position: absolute;
          right: 156px;
        }
        .el-input:nth-child(3) {
          position: absolute;
          right: 50px;
        }
      }
    }
  }
  .gas-customer {
    width: 501px;

    .gas-customer-list {
      overflow: auto;
      text-align: left;
      padding: 0 10px;
      margin-top: 10px;
      height: 520px;

      li {
        position: relative;
        height: 30px;
        line-height: 30px;

        .el-input:nth-child(2) {
          position: absolute;
          right: 260px;
        }
        .el-input:nth-child(3) {
          position: absolute;
          right: 146px;
        }
        .el-input:nth-child(4) {
          position: absolute;
          right: 36px;
        }

        img {
          position: absolute;
          top: 12px;
          right: 6px;
          height: 10px;
          width: 10px;

          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }

  .gas-header {
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 26px;
    line-height: 26px;
    background: #ffffff;
    border-radius: 4px;
    padding: 3px 10px;
    box-sizing: border-box;

    img {
      margin-left: 15px;
    }

    & > div {
      span {
        margin: 0 5px;
      }
    }

    .gas-header-label {
      &:before {
        content: "";
        display: inline-block;
        position: relative;
        top: 1px;
        width: 12px;
        height: 12px;
        background: #47a87d;
        margin-right: 5px;
      }
    }
  }
}

.gas-footer-btn {
  button {
    width: 84px;
    height: 32px;
    padding: 5px 10px;
  }
}
</style>

<style lang="scss">
.gas-config {
  .gas-config-dialog {
    margin-top: 13vh !important;

    .el-dialog__footer {
      text-align: center;
      padding: 0 20px 20px;
    }
    // 选择日期样式修改
    .el-input--prefix .el-input__inner {
      width: 224px;
      height: 32px;
      border-radius: 16px;
    }

    .el-input__icon {
      line-height: 32px;
    }

    .gas-config-content {
      .el-input {
        width: 74px;

        .el-input__inner {
          height: 26px;
          line-height: 26px;
          border-radius: 0;
          border: 1px solid #dcdfe6;
          padding: 0 10px;
        }
      }

      input::-ms-input-placeholder {
        text-align: center;
      }
      input::-webkit-input-placeholder {
        text-align: center;
      }
    }
  }
  .create-plan-name-dialog {
    .el-dialog__title {
      font-size: 18px;
      color: #333333;
    }

    // .el-form,
    // .el-form-item {
    //   margin-bottom: 0 !important;
    // }

    .el-input {
      font-size: 16px;
      color: #333333;

      .el-input__inner {
        height: 30px;
        line-height: 30px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
      }
    }

    .el-dialog__footer {
      button {
        width: 84px;
        height: 32px;
        padding: 0 20px;
      }
    }
  }
}
</style>
