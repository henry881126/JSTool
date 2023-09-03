<!--
 * @Description: 输配能力测算详情页面，包含GIS地图、气量参数获取/配置、仿真计算等功能
 * @author: wanghongxuan
 * @date: 2021-11-09
-->
<template>
  <div class="delivery-wrapper gas-page-bg-diaodu">
    <top-menu title="天然气输配（调度）智慧管理平台"></top-menu>
    <!-- 面包屑 -->
    <div class="crumb-diaodu">
      <span class="crumb-title1">运营调度 / </span>
      <span class="crumb-title2">输配能力测算</span>
    </div>
    <div class="content-wrapper content-wrapper-diaodu">
      <!-- 标题 -->
      <div class="title">
        <div class="title-label">{{ planName }}</div>
        <div class="title-button">
          <button @click="jumpToPreviousPage">返回</button>
        </div>
      </div>
      <!-- 内容部分 -->
      <div class="content-box">
        <!-- 左侧GIS地图 -->
        <div class="gis-map">
          <!-- <img :src="require('@/idsPages/images/dispatchingHome/map.png')" /> -->
          <aaa :isPrePlanPage="true"></aaa>
        </div>

        <!-- 右侧仿真计算 -->
        <div class="computed">
          <div class="computed-header">
            <div>
              <p>输配能力测算（预案）</p>
              <img :src="require('../../../images/pull.png')" alt="" />
            </div>
            <div class="computed-gas-config">
              <span
                :class="{ 'not-allowed': isComputing }"
                @click="!isComputing && setGasConfigDialog()"
              >
                气量参数获取/配置
              </span>
            </div>
            <div class="computed-start">
              <div
                v-if="!isComputing"
                class="computed-start-label"
                :class="[isClickStart ? 'start-abled' : 'start-disabled']"
                @click="isClickStart && clickStartComputed()"
              >
                开始计算
              </div>
              <div
                v-else
                class="computed-start-label start-abled"
                @click="finishComputed"
              >
                结束计算
              </div>
              <div id="progressFloor" class="computed-start-progress">
                <div id="progressCeiling"></div>
                <span>进度：{{ percent }}%</span>
              </div>
            </div>
          </div>
          <div class="computed-content">
            <div class="computed-content-header">
              <p>输配能力预测</p>
              <img :src="require('../../../images/pull.png')" alt="" />
              <div v-show="isEnd" class="export-report" @click="showReport">
                导出报告
              </div>
            </div>
            <div
              id="computedResult"
              class="computed-result"
              v-loading="loading"
              element-loading-spinner="el-icon-loading"
              @click="isEnd && showReport()"
            >
              <div class="square-item" v-show="showResultText">
                <span class="square-item1"></span>
                <span class="square-item2">
                  气源批复总量：{{
                    computedResult.totalApproval.toFixed(3)
                  }}万m³ 预计提取总量：{{
                    computedResult.dailyIn.toFixed(3)
                  }}万m³ 预计购进气差：{{ computedResult.freeSpaceRatio }}
                </span>
              </div>
              <div class="square-item" v-show="showResultText">
                <span class="square-item1"></span>
                <span class="square-item2">
                  管网流量上限：{{
                    computedResult.pipeUpLimitSum.toFixed(3)
                  }}Nm³/h 最大瞬时流量：{{
                    computedResult.pipeMaxInstantFlowSum.toFixed(3)
                  }}Nm³/h 输配能力占比：{{ computedResult.pipeOccupationRatio }}
                </span>
              </div>
              <div
                class="square-item"
                v-if="
                  showResultText &&
                  computedResult.customerSummaryInfoList.length
                "
              >
                <span
                  class="square-item1"
                  :style="{ background: isWarnAll ? '#F27F04' : '#47A87D' }"
                ></span>
                <span class="square-item2">
                  <span
                    :style="{
                      color:
                        computedResult.customerSummaryInfoList[0].isWarn === '1'
                          ? '#F27F04'
                          : '#303133',
                      marginRight: '8px',
                    }"
                  >
                    {{ computedResult.customerSummaryInfoList[0].name }}：{{
                      computedResult.customerSummaryInfoList[0].minimumPressure
                        ? computedResult.customerSummaryInfoList[0].minimumPressure.toFixed(
                            3
                          )
                        : ""
                    }}-{{
                      computedResult.customerSummaryInfoList[0].maximumPressure
                        ? computedResult.customerSummaryInfoList[0].maximumPressure.toFixed(
                            3
                          )
                        : ""
                    }}MPa
                  </span>
                  <span
                    :style="{
                      color:
                        computedResult.customerSummaryInfoList[1].isWarn === '1'
                          ? '#F27F04'
                          : '#303133',
                    }"
                  >
                    {{ computedResult.customerSummaryInfoList[1].name }}：{{
                      computedResult.customerSummaryInfoList[1].minimumPressure
                        ? computedResult.customerSummaryInfoList[1].minimumPressure.toFixed(
                            3
                          )
                        : ""
                    }}-{{
                      computedResult.customerSummaryInfoList[1].maximumPressure
                        ? computedResult.customerSummaryInfoList[1].maximumPressure.toFixed(
                            3
                          )
                        : ""
                    }}MPa
                  </span>
                </span>
              </div>
            </div>
            <!-- 全部门站（进口流量） -->
            <div class="computed-list">
              <ul class="station">
                <li v-for="(item, index) in stationList" :key="item.id">
                  <div :style="{ 'font-weight': index === 0 ? '600' : '' }">
                    {{ item.name }}
                  </div>
                  <div>
                    <progress-bar
                      :barData="item"
                      :indexP="index + '-sta'"
                      :isStart="isStart"
                      alarmColor="#F5222D"
                      @displayCurveGraph="displayCurveGraphStation(item.typeId)"
                    />
                  </div>
                </li>
              </ul>
              <!-- 全部管网（流量） -->
              <ul class="pipe">
                <li v-for="(item, index) in pipeList" :key="item.id">
                  <div :style="{ 'font-weight': index === 0 ? '600' : '' }">
                    {{ item.name }}
                  </div>
                  <div>
                    <progress-bar
                      :barData="item"
                      :indexP="index + '-pip'"
                      :isStart="isStart"
                      alarmColor="#F5222D"
                      @displayCurveGraph="displayCurveGraphPipe(item.typeId)"
                    />
                  </div>
                </li>
              </ul>
              <!-- 管网末端（压力变化） -->
              <div class="pressure">
                <div class="pressure-label">管网末端（压力变化）</div>
                <ul>
                  <li v-for="(item, index) in pipeEndList" :key="item.id">
                    <div>{{ item.name }}</div>
                    <div>
                      <progress-bar
                        :barData="item"
                        :indexP="index + '-pre'"
                        :isStart="isStart"
                        alarmColor="#F27F04"
                        @displayCurveGraph="
                          displayCurveGraphPipeEnd(item.typeId)
                        "
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 气量参数获取/配置弹框 -->
    <gas-config-dialog
      v-if="gasConfigVisible"
      :visible.sync="gasConfigVisible"
      :isPrePlanPage="true"
    ></gas-config-dialog>
    <!-- 下气进度弹框 -->
    <stationGasDialog
      v-if="showStationDialog"
      :showStationDialog.sync="showStationDialog"
      :typeId="typeId"
    >
    </stationGasDialog>
    <!-- 管网、管网末端弹框 -->
    <dialogEcharts
      v-if="showEchartDialog"
      :showEchartDialog.sync="showEchartDialog"
      :dataType="dataType"
      :typeId="typeId"
    ></dialogEcharts>
    <!-- 导出报告弹框 -->
    <dialogReport
      v-if="showRepo"
      :showRepo.sync="showRepo"
      :dataType="dataType"
    ></dialogReport>
  </div>
</template>

<script>
import dialogEcharts from "./components/CurveGraphComponent.vue";
import dialogReport from "./components/dialogReport.vue";
import stationGasDialog from "./components/gasStationDialog.vue";
import TopMenu from "@/components/topMenu/topMenu2";
import ProgressBar from "./components/ProgressBar";
import GasConfigDialog from "./components/GasConfigDialog.vue";
import aaa from "./components/map";
import { mapState } from "vuex";

let progressElm = null;
let progressFloorElm = null;
let timer = null;
let timer2 = null;

export default {
  name: "prePlanDatabaseDetail",
  components: {
    TopMenu,
    ProgressBar,
    GasConfigDialog,
    aaa,
    dialogEcharts,
    dialogReport,
    stationGasDialog,
  },
  data() {
    return {
      percent: 0,
      stationList: [
        {
          name: "全部门站（进口流量）",
          value: "",
          base: "",
        },
        {
          name: "谢岗门站",
          value: "",
          base: "",
        },
        {
          name: "东城门站",
          value: "",
          base: "",
        },
        {
          name: "高埗门站",
          value: "",
          base: "",
        },
        {
          name: "樟木头门站",
          value: "",
          base: "",
        },
        {
          name: "九丰LNG站",
          value: "",
          base: "",
        },
      ],
      pipeList: [
        {
          name: "全部管网（流量）",
          value: "",
          base: "",
        },
        {
          name: "东城门站至同沙立交",
          value: "",
          base: "",
        },
        {
          name: "谢岗至东城门站",
          value: "",
          base: "",
        },
        {
          name: "南五环",
          value: "",
          base: "",
        },
        {
          name: "同沙立交至高埗门站",
          value: "",
          base: "",
        },
        {
          name: "立沙岛支线",
          value: "",
          base: "",
        },
        {
          name: "虎门支线",
          value: "",
          base: "",
        },
        {
          name: "北王路孤网",
          value: "",
          base: "",
        },
        {
          name: "谢岗至企石次高压",
          value: "",
          base: "",
        },
        {
          name: "洪梅次高压",
          value: "",
          base: "",
        },
        {
          name: "樟木头次高压孤网",
          value: "",
          base: "",
        },
      ],
      pipeEndList: [
        {
          name: "玖龙纸业",
          value: "",
          base: "",
        },
        {
          name: "虎门电厂",
          value: "",
          base: "",
        },
      ],
      // 输配能力预测统计信息
      computedResult: {
        totalApproval: 0,
        dailyIn: 0,
        freeSpaceRatio: "",
        pipeUpLimitSum: 0,
        pipeMaxInstantFlowSum: 0,
        pipeOccupationRatio: "",
        customerSummaryInfoList: [
          {
            typeId: "",
            name: "玖龙纸业",
            minimumPressure: 0,
            maximumPressure: 0,
            isWarn: "0",
          },
          {
            typeId: "",
            name: "虎门电厂",
            minimumPressure: 0,
            maximumPressure: 0,
            isWarn: "0",
          },
        ],
      },
      isStart: false,
      isEnd: false,
      loading: false,
      showResultText: false,
      gasConfigVisible: false,
      finishOrNot: "0",
      planName: "",
      hasError: false,

      //曲线图数据
      dataType: "",
      typeId: "",
      showEchartDialog: false,
      showStationDialog: false,
      showRepo: false,
    };
  },
  computed: {
    ...mapState({
      planId: (state) => state.calculation.planId,
      version: (state) => state.calculation.version,
      isAllGasConfigDone: (state) => state.calculation.isAllGasConfigDone,
      isComputing: (state) => state.calculation.isComputing,
      isTimeOver: (state) => state.calculation.isTimeOver,
      isWarnAll() {
        if (this.computedResult.customerSummaryInfoList?.length) {
          let length = this.computedResult.customerSummaryInfoList.length;
          if (length === 1) {
            return (
              this.computedResult.customerSummaryInfoList[0].isWarn === "1"
            );
          } else if (length === 2) {
            return (
              this.computedResult.customerSummaryInfoList[0].isWarn === "1" &&
              this.computedResult.customerSummaryInfoList[1].isWarn === "1"
            );
          } else {
            return false;
          }
        }
      },
      // 是否可点击开始按钮
      isClickStart() {
        return this.isAllGasConfigDone == 1 && !this.isComputing;
      },
      isShowExport() {
        return this.version !== 0 && !this.isComputing;
      },
    }),
  },
  async created() {
    const { planId, planName, version, setupCompleted } = this.$route.query;
    this.planName = planName;
    this.$store.commit("calculation/SET_PLAN_ID", planId);
    // localStorage解决页面刷新，setupCompleted字段值初始化问题，导致无法点击开始计算
    let _setupCompleted = localStorage.getItem("_setupCompleted");
    let _version = localStorage.getItem("_version");
    if (_version) {
      this.$store.commit("calculation/SET_VERSION", Number(_version));
    } else {
      this.$store.commit("calculation/SET_VERSION", Number(version));
    }
    if (_setupCompleted) {
      this.$store.commit("calculation/IS_ALL_GAS_CONFIG_DONE", _setupCompleted);
    } else {
      this.$store.commit("calculation/IS_ALL_GAS_CONFIG_DONE", setupCompleted);
    }

    // 获取仿真历史数据
    await this.getStationAndPipeHistory();
    if (this.hasError) return;
    if (this.finishOrNot !== "1") {
      // 若finishOrNot!=="1"，则状态为仿真计算进行中(同时两个人做仿真计算)
      this.$store.commit("calculation/IS_COMPUTING", true);
      timer = setInterval(this.getStationAndPipeInfoOfLoop, 5000);
    }
  },
  mounted() {
    progressFloorElm = document.querySelector("#progressFloor");
    progressElm = document.querySelector("#progressCeiling");
  },
  beforeDestroy() {
    timer && clearInterval(timer);
    let _setupCompleted = localStorage.getItem("_setupCompleted");
    let _version = localStorage.getItem("_version");
    if (_setupCompleted) {
      localStorage.removeItem("_setupCompleted");
    }
    if (_version) {
      localStorage.removeItem("_version");
    }
  },
  methods: {
    // 终止计算
    finishComputed() {
      const params = {
        simulationCode: "2", // 1代表输配能力测算仿真，2代表预案库仿真
        planId: this.planId,
        version: this.version,
      };
      this.$store.dispatch("calculation/cancelComputed", params).then((res) => {
        const { resultCode, data } = res;
        if (resultCode === 0) {
          const { waitTime, message } = data;
          timer && clearInterval(timer);
          this.$store.commit("calculation/IS_COMPUTING", false);
          this.$store.commit("calculation/IS_TIMEOVER", false);
          this.loading = false;
          this.$message.success(message);
          // 两分钟后才能再次点击开始计算
          timer2 = setTimeout(() => {
            this.$store.commit("calculation/IS_TIMEOVER", true);
          }, Number(waitTime) * 1000);
        }
      });
    },
    // 预案库页面跳转
    jumpToPreviousPage() {
      this.$router.go(-1);
    },
    // 气量参数获取/配置弹出框
    setGasConfigDialog() {
      this.gasConfigVisible = true;
    },
    // 初始化进入页面时，获取全部门站、全部管网历史记录
    getStationAndPipeHistory() {
      this.loading = true;
      this.showResultText = false;

      // real data
      const params = {
        planId: this.planId,
        version: this.version,
      };
      return this.$store
        .dispatch("calculation/getComputedResult", params)
        .then((res) => {
          const { resultCode, data } = res;
          if (resultCode === 0) {
            const { stationC, pipeC, endCustomerC, finishOrNot, progressBar } =
              data;
            // 如果finishOrNot的值是0，则为仿真计算中状态，created中循环调取仿真计算接口；
            this.finishOrNot = finishOrNot;

            // 如果有历史记录或者无仿真数据，则获取数据；
            if (finishOrNot === "1") {
              // 全部门站列表
              stationC.totalInfo.name = "全部门站（进口流量）";
              let stationList = [
                stationC.totalInfo,
                ...stationC.stationInfoList,
              ];
              let stationLength = stationList.length;
              for (let i = 0; i < stationLength; i++) {
                for (let j = 0; j < stationLength; j++) {
                  if (stationList[i].name === this.stationList[j].name) {
                    this.stationList.splice(j, 1, stationList[i]);
                    break;
                  }
                }
              }
              // 全部管网列表
              pipeC.totalInfo.name = "全部管网（流量）";
              let pipeList = [pipeC.totalInfo, ...pipeC.pipeInfoList];
              let pipeLength = pipeList.length;
              for (let i = 0; i < pipeLength; i++) {
                for (let j = 0; j < pipeLength; j++) {
                  if (pipeList[i].name === this.pipeList[j].name) {
                    this.pipeList.splice(j, 1, pipeList[i]);
                    break;
                  }
                }
              }
              // 管网末端列表
              let pipeEndList = endCustomerC.endInfoList;
              let pipeEndLength = pipeEndList.length;
              for (let i = 0; i < pipeEndLength; i++) {
                for (let j = 0; j < pipeEndLength; j++) {
                  if (pipeEndList[i].name === this.pipeEndList[j].name) {
                    this.pipeEndList.splice(j, 1, pipeEndList[i]);
                    break;
                  }
                }
              }

              // 仿真计算中状态更新
              this.finishOrNot = finishOrNot;
              this.$store.commit("calculation/IS_COMPUTING", false);
              this.percent = progressBar * 100;
              let fillWidth = progressFloorElm.clientWidth * progressBar;
              this.moveProgress(fillWidth);

              if (this.version) {
                this.isEnd = true;
              } else {
                this.loading = false;
                return;
              }
              // 获取输配能力预测统计信息
              this.getStatisticsSummary();
            }
          }
        })
        .catch(() => {
          this.$store.commit("calculation/IS_COMPUTING", false);
          this.loading = false;
          this.hasError = true;
        });
    },
    // 点击开始计算按钮
    clickStartComputed() {
      if (!this.isTimeOver) {
        this.$message.error("后台正在终止上次计算，请等待2分钟再次开始计算！");
        return;
      }
      // 点击开始计算，loading效果加载，计算结束后显示计算结果数值，loading效果结束
      this.loading = true;
      this.isStart = true;
      this.isEnd = false;
      this.showResultText = false;
      this.percent = 0;
      this.initProgress();
      // 仿真计算中状态更新
      this.$store.commit("calculation/IS_COMPUTING", true);
      // 开始计算接口，更新version
      this.startComputed();
    },
    // 开始计算，更新version字段
    startComputed() {
      const params = {
        planId: this.planId,
        version: this.version,
        simulationCode: "2", // 1代表输配能力测算仿真，2代表预案库仿真
      };
      return this.$store
        .dispatch("calculation/startComputed", params)
        .then((res) => {
          const { resultCode, data } = res;
          if (resultCode === 0 && data) {
            const { tipCode = 0, planName } = data;
            if (tipCode == 0) {
              localStorage.setItem("_version", data.version);
              // 5s轮询获取全部门站、全部管网、管网末端数据
              timer = setInterval(this.getStationAndPipeInfoOfLoop, 5000);
            } else {
              this.$message.error(
                `后台正在计算${planName}预案，请等该预案测算完成再开始计算!`
              );
              this.$store.commit("calculation/IS_COMPUTING", false);
              this.loading = false;
            }
          }
        })
        .catch(() => {
          // 仿真计算中状态更新
          this.$store.commit("calculation/IS_COMPUTING", false);
          this.loading = false;
        });
    },
    // 仿真计算进行中，获取全部门站、全部管网、管网末端数据
    getStationAndPipeInfoOfLoop() {
      // real data
      const params = {
        planId: this.planId,
        version: this.version,
      };
      return this.$store
        .dispatch("calculation/getComputedResult", params)
        .then((res) => {
          const { resultCode, data } = res;
          if (resultCode === 0) {
            const {
              isTimeout, // 5分钟超时处理标识
              finishOrNot, // 是否获取全部数据标识
              progressBar, // 总体进度条0.7
              stationC,
              pipeC,
              endCustomerC,
            } = data;
            if (isTimeout == "1") {
              this.isStart = false;
              this.isEnd = true;
              this.loading = false;
              this.$store.commit("calculation/IS_COMPUTING", false);
              timer && clearInterval(timer);
              this.$message.error("测算出现异常，已终止计算！");
              return;
            }
            // 全部门站列表
            stationC.totalInfo.name = "全部门站（进口流量）";
            let stationList = [stationC.totalInfo, ...stationC.stationInfoList];
            let stationLength = stationList.length;
            for (let i = 0; i < stationLength; i++) {
              for (let j = 0; j < stationLength; j++) {
                if (stationList[i].name === this.stationList[j].name) {
                  this.stationList.splice(j, 1, stationList[i]);
                  break;
                }
              }
            }
            // 全部管网列表
            pipeC.totalInfo.name = "全部管网（流量）";
            let pipeList = [pipeC.totalInfo, ...pipeC.pipeInfoList];
            let pipeLength = pipeList.length;
            for (let i = 0; i < pipeLength; i++) {
              for (let j = 0; j < pipeLength; j++) {
                if (pipeList[i].name === this.pipeList[j].name) {
                  this.pipeList.splice(j, 1, pipeList[i]);
                  break;
                }
              }
            }
            // 管网末端列表
            let pipeEndList = endCustomerC.endInfoList;
            let pipeEndLength = pipeEndList.length;
            for (let i = 0; i < pipeEndLength; i++) {
              for (let j = 0; j < pipeEndLength; j++) {
                if (pipeEndList[i].name === this.pipeEndList[j].name) {
                  this.pipeEndList.splice(j, 1, pipeEndList[i]);
                  break;
                }
              }
            }

            // 总进度条
            this.percent = progressBar * 100;
            let fillWidth = progressFloorElm.clientWidth * progressBar;
            this.moveProgress(fillWidth);

            // 轮询结束，清除定时器
            if (finishOrNot === "1") {
              this.isStart = false;
              this.isEnd = true;
              this.$store.commit("calculation/IS_COMPUTING", false);
              timer && clearInterval(timer);

              if (!this.version) {
                this.loading = false;
                return;
              }
              // 获取输配能力预测统计信息
              this.getStatisticsSummary();
            }
          }
        })
        .catch(() => {
          this.$store.commit("calculation/IS_COMPUTING", false);
          timer && clearInterval(timer);
          this.loading = false;
        });
    },
    // 获取输配能力预测统计信息
    getStatisticsSummary() {
      const params = {
        planId: this.planId,
        version: this.version,
      };
      this.$store
        .dispatch("calculation/getStatisticsSummary", params)
        .then((res) => {
          const { resultCode, data } = res;
          if (resultCode == 0) {
            if (data?.summary) {
              this.computedResult = data.summary;
              this.showResultText = true;
            }
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 初始化进度条
    initProgress() {
      if (progressElm) {
        progressElm.style.transition = "";
        progressElm.style.width = 0;
      }
    },
    // 移动进度条·
    moveProgress(fillWidth) {
      if (progressElm) {
        progressElm.style.transition = "width 1.5s linear";
        progressElm.style.width = fillWidth + "px";
      }
    },
    // 报告弹窗
    showReport() {
      this.dataType = "displayCurveGraphPipe";
      this.showRepo = true;
    },
    // 门站下气进度
    displayCurveGraphStation(typeId) {
      this.typeId = typeId;
      this.showStationDialog = true;
    },
    // 管网曲线图
    displayCurveGraphPipe(typeId) {
      this.dataType = "displayCurveGraphPipe";
      this.typeId = typeId;
      this.showEchartDialog = true;
    },
    // 管网末端曲线图
    displayCurveGraphPipeEnd(typeId) {
      this.dataType = "displayCurveGraphPipeEnd";
      this.typeId = typeId;
      this.showEchartDialog = true;
    },
  },
};
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
}
.not-allowed {
  &:hover {
    cursor: not-allowed !important;
  }
}
.delivery-wrapper {
  width: 100%;
  position: relative;
  .content-wrapper {
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      margin-bottom: 10px;

      .title-label {
        width: 242px;
        height: 25px;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 25px;
      }
      .title-button {
        button {
          width: 86px;
          height: 32px;
          line-height: 32px;
          background: #47a87d;
          border: none;
          outline: none;
          color: white;
          border-radius: 100px;

          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .content-box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .gis-map {
        flex: 1;
        height: 872px;
        img {
          width: 1162px;
        }
      }

      .computed {
        width: 440px;
        height: 872px;
        background: #f2f6fc;
        padding: 10px;
        color: #303133;
        box-sizing: border-box;

        p {
          display: inline-block;
          margin: 0;
          width: 137;
          height: 20px;
          font-size: 14px;

          &:before {
            content: "";
            display: inline-block;
            position: relative;
            top: 1px;
            height: 12px;
            width: 12px;
            background: #47a87d;
            margin-right: 5px;
          }
        }

        img {
          float: right;
          margin-top: 8px;
        }

        .computed-header {
          font-size: 14px;
          margin-bottom: 10px;

          .computed-gas-config {
            width: 100%;
            height: 32px;
            line-height: 32px;
            color: white;
            background: #47a87d;
            border-radius: 4px;
            text-align: center;
            margin: 5px 0;

            & > span:hover {
              cursor: pointer;
            }

            &:before {
              content: "";
              display: inline-block;
              position: relative;
              top: 2px;
              right: 6px;
              width: 18px;
              height: 16px;
              background-image: url("../../../images/gasConfig.png");
              background-size: 100% 100%;
            }
          }

          .computed-start {
            width: 100%;
            height: 32px;
            display: flex;
            justify-content: space-between;

            .start-abled {
              &:hover {
                cursor: pointer;
              }
            }

            .start-disabled {
              &:hover {
                cursor: not-allowed;
              }
            }

            .computed-start-label {
              width: 86px;
              height: 32px;
              line-height: 32px;
              color: white;
              background: #47a87d;
              border-radius: 4px;
              text-align: center;

              &:before {
                content: "";
                display: inline-block;
                position: relative;
                top: 3px;
                right: 2px;
                width: 16px;
                height: 16px;
                background: url("../../../images/startImg.png");
                background-size: 100% 100%;
              }
            }

            .computed-start-progress {
              width: 328px;
              height: 32px;
              background: #e4e7ed;
              border-radius: 4px;
              position: relative;

              div {
                width: 0;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                border-radius: 4px;
                background: #47a87d;
              }

              span {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                color: #303133;
              }
            }
          }
        }

        .computed-content {
          .export-report {
            float: right;
            height: 17px;
            margin-right: 10px;
            font-size: 12px;
            color: #47a87d;
            line-height: 17px;
            cursor: pointer;

            &:before {
              content: "";
              display: inline-block;
              position: relative;
              top: 3px;
              margin-right: 3px;
              width: 16px;
              height: 16px;
              background: url("../../../images/export.png");
              background-size: 100% 100%;
            }
          }
          .computed-result {
            width: 420px;
            height: 104px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            margin-top: 7px;
            padding: 0 10px;
            font-size: 12px;
            box-sizing: border-box;

            .square-item {
              display: flex;
              justify-content: flex-start;
              margin: 5px 0;

              .square-item1 {
                display: block;
                position: relative;
                top: 3px;
                width: 12px;
                height: 12px;
                background: #47a87d;
                margin-right: 5px;
              }

              .square-item2 {
                display: block;
                width: 380px;
              }
            }
          }
          .computed-list {
            ul {
              list-style: none;

              li {
                display: flex;
                justify-content: space-between;
                align-items: center;

                width: 100%;
                height: 26px;
                background: #ffffff;
                border-radius: 4px;
                box-sizing: border-box;
                margin: 5px 0;
                padding: 0 5px;

                div:nth-child(1) {
                  height: 17px;
                  font-size: 12px;
                  color: #303133;
                  line-height: 17px;
                }

                div:nth-child(2) {
                  width: 200px;
                  height: 16px;
                }
              }
            }

            .pressure-label {
              height: 26px;
              font-size: 12px;
              color: #303133;
              line-height: 26px;

              &:before {
                content: "";
                display: inline-block;
                position: relative;
                top: 2px;
                margin-right: 5px;
                width: 12px;
                height: 12px;
                background: #47a87d;
              }
            }
          }
        }
      }
    }
  }
}
// .line-wrap {
//   width: 100%;
//   height: 400px;
//   // background: chocolate;
// }
</style>

<style lang="scss">
.computed-result {
  .el-loading-spinner i {
    color: #e4e7ed;
    font-size: 36px;
  }
}
</style>