<!-- 输配测算门站、管网、管网末端仿真结果-曲线图弹窗-->
<template>
  <div class="line-box">
    <el-dialog
      class="custom-dialog-n"
      :title="chartData.title"
      :visible.sync="showEchartDialog"
      :before-close="close"
    >
    
      <div style="height: 400px" v-if="dataCheck == 'pass'">
        <echartPart :chartData="chartData"></echartPart>
      </div>
      <div style="height: 400px" v-if="dataCheck == 'fail'">相关数据不全而无法显示</div>

      <div
        style="font-size: 14px; margin-top: 23px"
        v-if="chartData.type == 'displayCurveGraphPipeEnd'"
      >
        压力下限为{{ chartData.warnArea[0] }}MPa
      </div>
      <div
        style="font-size: 14px; margin-top: 23px"
        v-if="chartData.type == 'displayCurveGraphPipe'"
      >
        最大输配能力为{{ chartData.warnArea[0] }}万m³/h
      </div>
      <div
        style="font-size: 14px; margin-top: 5px"
        v-if="chartData.type == 'displayCurveGraphPipe'"
      >
        其中，满负荷运行小时数为{{ chartData.runningHoursBgeUpper }}h，占比{{
          chartData.percentBgeUpper
        }}
      </div>
    </el-dialog>
  </div>
</template>
<script>
import echartPart from "./chartComponent.vue";
import { mapState } from "vuex";
import {
  generatePipeCurve,
  generateCustomerCurve,
} from "@/idsPages/api/calculate.js";
export default {
  name: "CurveGraphComponent",
  props: {
    showEchartDialog: {
      type: Boolean,
      default: false,
    },
    dataType: {
      type: String,
      default: "",
    },
    typeId: {
      type: String,
      default: "",
    },
  },
  directives: {
    // 使用局部注册指令的方式
    resize: {
      // 指令的名称
      bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        let width = "",
          height = "";
        function isReize() {
          const style = document.defaultView.getComputedStyle(el);
          if (width !== style.width || height !== style.height) {
            binding.value(); // 关键
          }
          width = style.width;
          height = style.height;
        }
        el.__vueSetInterval__ = setInterval(isReize, 300);
      },
      unbind(el) {
        clearInterval(el.__vueSetInterval__);
      },
    },
  },
  components: {
    echartPart,
  },
  data() {
    return {
      chartData: {},
      dataCheck: "pass",
    };
  },
  computed: {
    ...mapState({
      planId: (state) => state.calculation.planId,
      version: (state) => state.calculation.version,
    }),
  },
  created() {
    this.getData();
  },
  methods: {
    close() {
      this.$emit("update:showEchartDialog", false);
    },
    getData() {
      if (this.dataType == "displayCurveGraphPipe") {
        let params = {
          planId: this.planId,
          version: this.version,
          typeId: this.typeId,
        };
        generatePipeCurve(params).then((res) => {
          let dataList = {
            warnArea: [],
            markLineData: [],
            datahX: [],
          };
          let actualData = [],
            dataX = [];

          console.log(res, " 管段输配能力变化曲线");
          res.data.dataList.map((item, index) => {
            actualData.push(item.value);
            dataX.push(item.time);
          });
          dataList.title = res.data.name;
          dataList.type = "displayCurveGraphPipe";
          dataList.actualData = actualData;
          dataList.dataX = dataX;
          dataList.datahX = res.data.onTimeList;
          dataList.warnArea.push(res.data.upperLimit);
          dataList.markLineData = res.data.crossList;
          dataList.percentBgeUpper = res.data.percentBgeUpper;
          dataList.runningHoursBgeUpper = res.data.runningHoursBgeUpper;
          this.dataCheck = res.data.dataCheck;
          if(this.dataCheck == 'fail'){
            this.$message({
            type: 'error',
            message: '相关数据不全而无法显示'
          })
          }
          // console.log(dataList);
          this.chartData = dataList;
        });
      }
      if (this.dataType == "displayCurveGraphPipeEnd") {
        let params = {
          planId: this.planId,
          version: this.version,
          typeId: this.typeId,
        };
        generateCustomerCurve(params).then((res) => {
          // console.log(res, " 管网末端压力变化曲线");
          let dataList = {
            warnArea: [],
            markLineData: [],
            datahX: [],
          };
          let actualData = [],
            dataX = [];

          // console.log(res, " 管段输配能力变化曲线");
          res.data.dataList.map((item, index) => {
            actualData.push(item.value);
            dataX.push(item.time);
          });
          dataList.title = res.data.name;
          dataList.type = "displayCurveGraphPipeEnd";
          dataList.actualData = actualData;
          dataList.dataX = dataX;
          dataList.datahX = res.data.onTimeList;
          dataList.warnArea.push(res.data.lowerLimit);
          dataList.markLineData = res.data.crossList;
          this.dataCheck = res.data.dataCheck;
          if(this.dataCheck == 'fail'){
            this.$message({
            type: 'error',
            message: '相关数据不全而无法显示'
          })
          }
          this.chartData = dataList;
        });
      }
    },
  },
  beforeDestroy() {
    this.chartData = {};
  },
};
</script>
<style lang="scss" scoped>
.line-box {
  width: 100%;
  height: 572px;
}
</style>