<!--输配能力监控-管网-->
<template>
  <div class="gridiron-page">
    <div class="gridiron-main" v-for="(item, i) in pipeList" :key="i">
      <span :class="i == 0 ? 't-tit t-weight' : 't-tit'">{{ item.name }}</span>
      <div class="pipe-box">
        <div class="progress-box">
          <div class="value-box">
            <div></div>
            <span
              v-if="item.proportion - 0 >= 95"
              :title="item.capacity + '万m³'"
              >{{ item.capacity }}万m³</span
            >
            <span v-else class="span-judge" :title="item.capacity + '万m³'"
              >{{ item.capacity }}万m³</span
            >
          </div>
          <span>{{ item.proportion }}%</span>
        </div>
      </div>
      <div class="data-wrap">
        <div class="data-box">
          <span :class="i == 0 ? 'v-bg' : ''" :title="item.transportUp">
            {{ item.transportUp }}
          </span>
          <span>万m³</span>
        </div>
        <div class="data-name">最大输配能力</div>
      </div>
      <div class="icon-box" @click="showDialog(item)">
        <img src="../../../../images/chartsImage.png" alt="" />
      </div>
      <div class="title-button" v-if="i == 0">
        <button @click="openEdit()">编辑</button>
      </div>
    </div>
    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑"
      :visible.sync="editDialog"
      :before-close="closeDialog"
      width="473px"
      class="custom-dialog-n"
    >
      <div class="edit-box">
        <span>最大输配能力</span>
        <el-input
          class="input"
          size="small"
          type="number"
          placeholder="请输入内容"
          v-model="editValue"
        >
        </el-input>
        <div class="edit-button">
          <button @click="editOk()">确认</button>
          <button @click="editNo()">取消</button>
        </div>
      </div>
    </el-dialog>
    <!-- 管网折线图表弹窗 -->
    <el-dialog
      class="custom-dialog-n"
      :title="title"
      :visible.sync="echartDialog"
      :before-close="closeDialog"
    >
      <!-- <div style="font-size: 14px">末端压力不小于3MPa</div> -->
      <div class="line-wrap">
        <DialogEcharts :dialogData="dialogData"></DialogEcharts>
      </div>
      <div style="font-size: 14px; margin-top: 23px">
        最大输配能力为{{ transportUp }}万m³/h
      </div>
      <div style="font-size: 14px; margin-top: 5px">
        其中，满负荷运行小时数为{{ fullLoad }}h，占比{{ proportion }}%
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DialogEcharts from "@/idsPages/views/operationAndDispatching/monitorAndControl/components/dialogCharts";
import { update, getChartData } from "@/idsPages/api/monitorAndControl";
export default {
  name: "demo",
  components: { DialogEcharts },
  data() {
    return {
      //弹框数据
      dialogData: {},
      title: "", //标题
      transportUp: "", //最大输配能力
      fullLoad: "", //满负荷运行时长
      proportion: "", //占比
      echartDialog: false,
      editDialog: false,
      editValue: null,
    };
  },
  props: {
    pipeList: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    pipeList: {
      handler(newValue) {
        this.$nextTick(function () {
          let valueList = document.getElementsByClassName("value-box");
          for (let i = 0; i < valueList.length; i++) {
            let proportion = Number(newValue[i].proportion);
            valueList[i].style.background =
              proportion >= 100 ? "#F5222D" : "#47A87D";
            let scale = proportion;
            scale = scale > 100 ? 100 : scale;
            valueList[i].style.width = scale + "%";
          }
        });
      },
    },
  },
  methods: {
    // 点击图片查看折线图
    showDialog(f) {
      getChartData({ name: f.pipeId }).then((res) => {
        this.dialogData = res.data;
        this.title = f.name;
        this.transportUp = res.data.transportUp;
        this.fullLoad = res.data.fullLoad;
        this.proportion = res.data.proportion;
      });
      this.echartDialog = true;
    },
    // 关闭弹窗
    closeDialog() {
      this.echartDialog = false;
      this.editDialog = false;
    },
    // 打开编辑弹窗
    openEdit() {
      this.editValue = "";
      this.editDialog = true;
    },
    // 编辑确定
    editOk() {
      update({ name: "AllPipe", transporUp: this.editValue }).then((res) => {
        if (res.resultMessage == "成功") {
          this.$parent.getPipeData();
          this.$message({
            message: "编辑成功！",
            type: "success",
          });
        }
      });
      this.editDialog = false;
    },
    // 编辑取消
    editNo() {
      this.editDialog = false;
    },
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 30px 20px 20px 20px;
}
::v-deep .el-dialog__header {
  height: 49px;
  box-sizing: border-box;
}
::v-deep .el-dialog .el-dialog__header .el-dialog__title {
  color: #333333;
}
.gridiron-page {
  color: #303133;
  height: 100%;
  overflow-y: auto;
  .gridiron-main {
    display: flex;
    .t-tit {
      width: 176px;
      color: #333333;
      display: inline-block;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      margin-bottom: 32px;
      font-weight: 400;
      &::before {
        content: "";
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 5px;
        background: #47a87d;
      }
    }
    .t-weight {
      font-weight: 600;
    }

    .pipe-box {
      width: 62%;
      position: relative;
      margin-left: 15px;
      margin-right: 20px;

      .progress-box {
        width: 100%;
        height: 32px;
        border: 1px solid #19b494;
        box-sizing: border-box;
        text-align: center;

        span {
          position: relative;
          height: 32px;
          line-height: 32px;
          z-index: 10;

          font-size: 14px;
        }
      }
      .value-box {
        position: absolute;
        width: 500px;
        height: 32px;
        background: #19b494;
        :first-child {
          position: absolute;
          right: 0;
          bottom: -6px;
          height: 6px;
          width: 1px;
          background: #19b494;
        }
        :last-child {
          position: absolute;
          width: 66px;
          right: -33px;
          bottom: -22px;
          font-size: 12px;
          height: 17px;
          line-height: 17px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
        .span-judge {
          width: 120px;
          right: -60px;
        }
      }
    }
    .data-wrap {
      .data-box {
        font-size: 14px;
        height: 32px;
        line-height: 32px;
        :first-child {
          width: 88px;
          text-align: center;
          box-sizing: border-box;
          margin-right: 5px;
        }
        span {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .v-bg {
          border: 1px solid #dcdfe6;
        }
      }
      .data-name {
        font-size: 12px;
        display: block;
        width: 88px;
        text-align: center;
      }
    }
    .icon-box {
      height: 32px;
      line-height: 32px;
      margin: 0 10px;
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
  .line-wrap {
    width: 100%;
    height: 400px;
  }
  .edit-box {
    span {
      font-size: 16px;
    }
    .input {
      width: 317px;
      margin-left: 10px;
    }
    .edit-button {
      text-align: center;
      margin-top: 19px;
      button {
        width: 84px;
        height: 32px;
        background: #47a87d;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        color: #ffffff;
      }
      :last-child {
        border: 1px solid #d9d9d9;
        background: none;
        color: #999999;
        margin-left: 10px;
      }
    }
  }
}
</style>