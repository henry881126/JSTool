<!--
 * @Description: 仿真计算进度条组件，包含"全部门站"、"全部管网"、"管网末端"数据
 * @author: wanghongxuan
 * @date: 2021-11-09
-->
<template>
  <div
    :id="'progress-bar' + indexP"
    class="progress-bar-floor"
    :style="{ background: '#e4e7ed', 'border-radius': radius + 'px' }"
  >
    <div
      :id="'progress-bar-ceiling' + indexP"
      class="progress-bar-ceiling"
      :style="{ background: '#47a87d', 'border-radius': radius + 'px' }"
      @click="!isComputing && !isTitleClick && clickProgress()"
    ></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    indexP: {
      type: String,
      default: "",
    },
    barData: {
      type: Object,
      default: {},
    },
    radius: {
      type: Number,
      default: 10,
    },
    isStart: {
      type: Boolean,
      default: false,
    },
    alarmColor: {
      type: String,
      default: "#F5222D",
    },
  },
  data() {
    return {
      floorId: "",
      ceilingId: "",
      progressBarElm: null,
      progressBarCeilingElm: null,
    };
  },
  computed: {
    ...mapState({
      isComputing: (state) => state.calculation.isComputing,
      isTitleClick() {
        return !this.barData.typeId;
      },
    }),
  },
  watch: {
    barData: {
      handler(newValue, oldValue) {
        // console.log(newValue.name);
        // console.log(newValue);
        if (newValue) {
          const { base, value, isWarn = "0" } = newValue;
          if (!base || !value) {
            return;
          }
          let warn = isWarn;
          let percent = Number(base) / Number(value);
          // 门站进度条处理逻辑
          if (this.indexP.includes("-sta")) {
            percent = Number(value) / Number(base);
            if (value > base) {
              warn = "1";
            }
          }
          // console.log("percent",percent)
          if (percent > 1) {
            percent = 1;
          }
          let fillWidth = this.progressBarElm.clientWidth * percent;
          let currentColor = this.progressBarCeilingElm.style.backgroundColor;
          this.moveProgress(fillWidth);
          // 如果报警颜色已经设置过，则不再设置报警颜色，rgb(71, 168, 125)===#47a87d（绿色）
          if (currentColor === "rgb(71, 168, 125)") {
            if (warn === "1") {
              this.setBgColor();
            }
          }
        }
      },
      // deep: true,
    },
    isStart(newValue, oldValue) {
      if (newValue) {
        this.initProgress();
      }
    },
  },
  mounted() {
    this.floorId = "#progress-bar" + this.indexP;
    this.ceilingId = "#progress-bar-ceiling" + this.indexP;
    this.progressBarElm = document.querySelector(this.floorId);
    this.progressBarCeilingElm = document.querySelector(this.ceilingId);
  },
  methods: {
    // 初始化进度条
    initProgress() {
      if (this.progressBarCeilingElm) {
        this.progressBarCeilingElm.style.transition = "";
        this.progressBarCeilingElm.style.width = 0;
      }
    },
    // 移动进度条·
    moveProgress(fillWidth) {
      if (this.progressBarCeilingElm) {
        this.progressBarCeilingElm.style.transition = "width 1.5s linear";
        this.progressBarCeilingElm.style.width = fillWidth + "px";
      }
    },
    // 报警颜色改变
    setBgColor() {
      this.progressBarCeilingElm.style.background = this.alarmColor;
    },
    // 触发弹出曲线图方法
    clickProgress() {
      this.$emit("displayCurveGraph");
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-bar-floor {
  position: relative;
  width: 100%;
  height: 100%;
}
.progress-bar-ceiling {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 16px;
}
</style>