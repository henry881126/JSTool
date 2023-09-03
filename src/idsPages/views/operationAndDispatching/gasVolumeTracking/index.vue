<template>
  <div id="deli_box" class="delivery-wrapper gas-page-bg-diaodu">
    <top-menu title="天然气输配（调度）智慧管理平台"></top-menu>
    <!-- 面包屑 -->
    <div class="crumb-diaodu">
      <span class="crumb-title1">运营调度 / </span>
      <span class="crumb-title2">气量执行与跟踪</span>
    </div>
    <div class="content-wrapper content-wrapper-diaodu">
      <!-- 标题 -->
      <div class="title">
        <span class="t1">气量执行与跟踪</span>
        <el-button type="primary" round size="small" @click="openEdit()">
          <img width="12" :src="editImg" />
          日指定编辑
        </el-button>
      </div>
      <!-- 内容部分 -->
      <div class="content-box">
        <div class="content-tips">
          <div class="tips-box" v-for="(item, i) in tipsList" :key="i">
            <span class="tips_value" :title="item.value + item.unit">
              <span>{{ item.value ? item.value : "-" }}</span>
              <span class="tips_unit">{{ item.unit }}</span>
            </span>
            <span class="tips_name">{{ item.name }}</span>
          </div>
        </div>
        <div id="c_graph" class="content-graph">
          <SvgChart
            id="chart_box"
            :svgData="svgData"
            @openTrack="openTrack"
          ></SvgChart>
        </div>
        <div class="content-track">
          <TrTable class="t-table" v-show="show1" :name="'zx1'"></TrTable>
          <TrTable class="t-table" v-show="show2" :name="'ds2'"></TrTable>
          <TrTable class="t-table" v-show="show3" :name="'dx3'"></TrTable>
          <TrTable class="t-table botm" v-show="show4" :name="'dx4'"></TrTable>
          <TrTable class="t-table botm" v-show="show5" :name="'zx5'"></TrTable>
        </div>
      </div>
    </div>
    <el-dialog
      title="气源及通路日指定"
      :visible.sync="detailDialog"
      :before-close="closeDialog"
      width="795px"
      class="custom-dialog-n"
    >
      <GasEdit :dataList="volumeList"></GasEdit>
      <div class="dialog-btn el-dialog__footer">
        <el-button type="primary" round size="small" @click="ok()">
          确定
        </el-button>
        <el-button round size="small" @click="closeDialog()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/idsPages/utils/index"; // 时间格式化方法
import {
  dailyGasUsedTrack,
  getVolume,
  saveVolume,
  gasExecutionTrack,
} from "@/idsPages/api/gasVolumeTracking";
import setWidth from "./component/setWidth";
import TopMenu from "@/components/topMenu/topMenu2";
import SvgChart from "@/idsPages/views/operationAndDispatching/gasVolumeTracking/component/svgChart";
import TrTable from "@/idsPages/views/operationAndDispatching/gasVolumeTracking/component/trackTable";
import GasEdit from "@/idsPages/views/operationAndDispatching/gasVolumeTracking/component/gasEdit";
export default {
  name: "gasVolumeTracking",
  components: {
    TopMenu,
    SvgChart,
    TrTable,
    GasEdit,
  },
  data() {
    return {
      timer: null,
      tipsList: [
        { name: "今日总指定量", value: "-", unit: "万m³" },
        { name: "今日总提取量", value: "-", unit: "万m³" },
        { name: "剩余总提取量", value: "-", unit: "万m³" },
        { name: "剩余时间", value: "-", unit: "h" },
        { name: "剩余平均提取流量", value: "-", unit: "万m³/h" },
        { name: "总供气量", value: "-", unit: "万m³" },
      ],
      show1: false,
      show2: false,
      show3: true,
      show4: false,
      show5: false,
      zIndex: 1,
      editImg: require("@/idsPages/images/gasVolumeTracking/edit.png"),
      detailDialog: false,
      volumeList: [],
      svgData: {},
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.timer = setInterval(this.getData, 180000);
    // 输配图加载自适应缩放
    setWidth("deli_box", "c_graph", "chart_box", 988);
  },
  methods: {
    // 获取数据
    getData() {
      let time = new Date().getTime();
      let newDate = parseTime(time, "{y}-{m}");
      let newDay = parseTime(time, "{d}");
      let newHour = parseTime(time, "{h}");
      if (newHour - 0 < 8) {
        newDay = parseTime(time - 24 * 60 * 60 * 1000, "{d}");
      }
      newDate = newDate + "-" + newDay;
      let data = { collectDate: newDate, dataType: "gasInAndOut" };
      dailyGasUsedTrack(data).then((res) => {
        this.tipsList[0].value = res.data.replyVolume;
        this.tipsList[1].value = res.data.volumeUsed;
        this.tipsList[2].value = res.data.balanceVolumeUsable;
        this.tipsList[3].value = res.data.balanceHour;
        this.tipsList[4].value = res.data.balanceAvgUsable;
        this.tipsList[5].value = res.data.todaySupply;
      });
      gasExecutionTrack().then((res) => {
        this.svgData = res.data;
      });
    },
    getVolume() {
      getVolume().then((res) => {
        this.volumeList = res.data;
        this.volumeList.sort((a, b) => {
          return a.sort - b.sort;
        });
      });
    },
    // 接收子组件传递的右侧表格数据
    openTrack(num, bool) {
      let List = document.getElementsByClassName("t-table");
      let domList = [...List];
      switch (num) {
        case 9:
          if (bool) {
            this.show1 = true;
          } else {
            this.show1 = false;
          }
          break;
        case 10:
          if (bool) {
            this.show2 = true;
          } else {
            this.show2 = false;
          }
          break;
        case 11:
          if (bool) {
            this.show3 = true;
          } else {
            this.show3 = false;
          }
          break;
        case 12:
          if (bool) {
            this.show4 = true;
          } else {
            this.show4 = false;
          }
          break;
        case 13:
          if (bool) {
            this.show5 = true;
          } else {
            this.show5 = false;
          }
          break;
      }
      if (bool) {
        this.zIndex++;
        domList[num - 9].style.zIndex = this.zIndex;
      }
    },
    openEdit() {
      this.getVolume();
      this.detailDialog = true;
    },
    // 关闭弹窗
    closeDialog() {
      this.detailDialog = false;
    },
    // 弹窗确定/取消方法
    ok() {
      if (this.volumeList.isOk) {
        this.$message.closeAll();
        this.$message.warning(
          "您输入的数值异常，请确保气源总批复量和门站总指定量相同！"
        );
        return;
      }
      saveVolume(this.volumeList).then((res) => {
        if (res.resultMessage == "成功") {
          this.detailDialog = false;
          this.getData();
          this.getVolume();
          this.$message({
            message: "修改成功！",
            type: "success",
          });
        }
      });
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.delivery-wrapper {
  width: 100%;
  position: relative;
  .content-wrapper {
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      margin-bottom: 28px;
      button {
        font-size: 14px;
      }
      .t1 {
        height: 25px;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 25px;
        display: inline-block;
        margin-right: 10px;
      }
    }
    .content-box {
      overflow: hidden;
      display: flex;
      .content-tips {
        width: 180px;
        .tips-box {
          width: 144px;
          height: 62px;
          box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
          border: 1px solid #dcdfe6;
          text-align: center;
          box-sizing: border-box;
          margin-bottom: 5px;
          span {
            height: 28px;
            font-size: 20px;
            font-weight: 600;
            color: #303133;
            line-height: 34px;
          }
          .tips_value {
            display: inline-block;
            width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .tips_unit {
            display: inline;
            font-size: 12px;
          }
          .tips_name {
            display: block;
            height: 20px;
            font-weight: 400;
            font-size: 14px;
            color: #909399;
            line-height: 20px;
          }
        }
      }
      .content-graph {
        width: calc(100% - 617px);
      }
      .content-track {
        margin-top: 77px;
        width: 443px;
        position: relative;
        .t-table {
          position: absolute;
          width: 100%;
          z-index: 0;
          height: 374px;
        }
        .botm {
          top: 50%;
        }
      }
    }
  }
  .dialog-btn {
    width: 100%;
    margin-top: 10px;
    text-align: center;
    border-top: 1px solid #dcdfe6;
    button {
      width: 84px;
    }
  }
}
</style>