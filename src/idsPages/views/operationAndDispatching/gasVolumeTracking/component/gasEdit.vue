<template>
  <div class="gasedit-page" v-if="dataList.length">
    <div class="main-left">
      <div class="gas-box1">
        <div class="tit-box">
          <span class="t-tit">气源</span>
          <span>
            日批复量(万m³)
            <img class="img" :src="triangleImg" />
          </span>
        </div>
      </div>
      <div class="gas-box2">
        <div class="tit-box" v-for="(item, i) in gasList1" :key="i">
          <span>{{ item.sourceName }}</span>
          <el-input
            class="gas-input"
            v-model="item.todayReply"
            placeholder="-"
            :maxlength="7"
            @change="
              (val) => {
                validateDecimal(val, 1);
              }
            "
          ></el-input>
        </div>
      </div>
      <div class="gas-box2">
        <div class="tit-box" v-for="(item, i) in gasList2" :key="i">
          <span>{{ item.sourceName }}</span>
          <el-input
            class="gas-input"
            v-model="item.todayReply"
            placeholder="-"
            :maxlength="7"
            @change="
              (val) => {
                validateDecimal(val, 1);
              }
            "
          ></el-input>
        </div>
      </div>
      <div class="gas-box4">
        <div class="tit-box" v-for="(item, i) in gasList3" :key="i">
          <span>{{ item.sourceName }}</span>
          <el-input
            class="gas-input"
            v-model="item.todayReply"
            placeholder="-"
            :maxlength="7"
            @change="
              (val) => {
                validateDecimal(val, 2);
              }
            "
          ></el-input>
        </div>
      </div>
      <div class="gas-box5">
        <div class="tit-box" v-for="(item, i) in gasList4" :key="i">
          <span>{{ item.sourceName }}</span>
          <el-input
            class="gas-input"
            v-model="item.todayReply"
            placeholder="-"
            :maxlength="7"
            @change="
              (val) => {
                validateDecimal(val, 3);
              }
            "
          ></el-input>
        </div>
      </div>
    </div>
    <div class="main-center">
      <span class="gas-name1">国网</span>
      <span class="gas-name2">省网</span>
      <span class="gas-name3">九丰</span>
      <span class="gas-name4">大鹏</span>
    </div>
    <div class="main-right">
      <div class="tit-box">
        <span class="t-tit">门站日计划下气量(万m³)</span>
        <span>
          <img class="img" :src="triangleImg" />
        </span>
      </div>
      <!-- 路线 -->
      <div class="line1"></div>
      <div class="line2"></div>
      <div class="line3"></div>
      <div class="line4"></div>
      <div class="line5"></div>
      <!-- 门站名称 -->
      <div class="stat-name stat-name1">
        <span>谢岗门站</span>
        <span class="text-box">{{ statList[0].todayReply }}</span>
      </div>
      <div class="stat-name stat-name2">
        <span>九丰LNG站</span>
        <span class="text-box">{{ statList[1].todayReply }}</span>
      </div>
      <div class="stat-name stat-name3">
        <span>东城门站</span>
        <el-input
          class="gas-input"
          v-model="statList[2].todayReply"
          placeholder="-"
          :maxlength="7"
          @change="
            (val) => {
              validateDecimal(val, 3);
            }
          "
        ></el-input>
      </div>
      <div class="stat-name stat-name4">
        <span>高埗门站</span>
        <el-input
          class="gas-input"
          v-model="statList[3].todayReply"
          placeholder="-"
          :maxlength="7"
          @change="
            (val) => {
              validateDecimal(val, 3);
            }
          "
        ></el-input>
      </div>
      <div class="stat-name stat-name5">
        <span>樟木头门站</span>
        <span class="text-box">{{ statList[4].todayReply }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      triangleImg: require("@/idsPages/images/gasVolumeTracking/triangle.png"),
      value: null,
      gasList1: [], //国网
      gasList2: [], //省网
      gasList3: [], //九丰
      gasList4: [], //大鹏
      statList: [],
    };
  },
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    dataList: {
      immediate: true,
      handler(newVal) {
        this.setData(newVal);
      },
    },
  },
  mounted() {},
  methods: {
    // 数据获取并处理
    setData(data) {
      let gdata = [],
        sdata = [];
      data.forEach((items) => {
        items.sourceList.forEach((item) => {
          gdata.push(item);
        });
        items.stationList.forEach((item) => {
          sdata.push(item);
        });
      });
      this.gasList1 = [];
      this.gasList2 = [];
      this.gasList3 = [];
      this.gasList4 = [];
      // this.gasList = gdata;
      gdata.forEach((item) => {
        if (item.pipeName == "国网") {
          this.gasList1.push(item);
        }
        if (item.pipeName == "省网") {
          this.gasList2.push(item);
        }
        if (item.pipeName == "九丰") {
          this.gasList3.push(item);
        }
        if (item.pipeName == "大鹏") {
          this.gasList4.push(item);
        }
      });
      this.statList = sdata;
    },
    // 气源三位小数校验
    validateDecimal(value, type) {
      let reg = /^\d{1,3}(\.\d{1,3})?$/;
      // console.log(value);
      if (value == "") {
        value = Number(value).toFixed(3);
      }
      // 正则判断数据的正却行
      if (!reg.test(value)) {
        this.$message.warning(
          "您输入的数值有问题，请输入0~999.999之间的数！！"
        );
        this.dataList.isOk = true;
        return;
      } else {
        this.dataList.isOk = false;
      }
      let sum = 0;
      if (type == 1) {
        this.gasList1.forEach((item) => {
          item.todayReply = Number(item.todayReply).toFixed(3);
          sum += Number(item.todayReply);
        });
        this.gasList2.forEach((item) => {
          item.todayReply = Number(item.todayReply).toFixed(3);
          sum += Number(item.todayReply);
        });
        if (sum < 0) {
          this.dataList.isOk = true;
        } else {
          this.dataList.isOk = false;
        }
        this.statList[0].todayReply = sum.toFixed(3);
      }
      if (type == 2) {
        this.gasList3.forEach((item) => {
          item.todayReply = Number(item.todayReply).toFixed(3);
          sum += Number(item.todayReply);
        });
        if (sum < 0) {
          this.dataList.isOk = true;
        } else {
          this.dataList.isOk = false;
        }
        this.statList[1].todayReply = sum.toFixed(3);
      }
      if (type == 3) {
        this.gasList4.forEach((item) => {
          item.todayReply = Number(item.todayReply).toFixed(3);
          sum += Number(item.todayReply);
        });
        this.statList[2].todayReply = Number(
          this.statList[2].todayReply
        ).toFixed(3);
        this.statList[3].todayReply = Number(
          this.statList[3].todayReply
        ).toFixed(3);
        let newValue =
          sum -
          Number(this.statList[2].todayReply) -
          Number(this.statList[3].todayReply);
        this.statList[4].todayReply = newValue.toFixed(3);
        if (newValue < 0) {
          this.$message.warning("门站指定量或气源批复量不能小于零！");
          this.dataList.isOk = true;
          return;
        } else {
          this.dataList.isOk = false;
        }
      }
    },
  },
};
</script>
<style lang="scss">
.gas-input {
  .el-input__inner {
    height: 26px;
    line-height: 26px;
    border-radius: 0;
    border: 1px solid #dcdfe6;
    padding: 0 10px;
    text-align: center;
  }
}
</style>
<style lang="scss" scoped>
.gasedit-page {
  overflow-y: auto;
  height: 53vh;
  max-height: 560px;
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  .main-left,
  .main-right {
    height: 560px;
    width: 356px;
    background: #f2f6fc;
    padding: 10px;
    box-sizing: border-box;
    div,
    .tit-box {
      background: #fff;
      border-radius: 4px;
    }
    .gas-box2,
    .gas-box3,
    .gas-box4,
    .gas-box5 {
      margin-top: 10px;
      .tit-box {
        padding: 5px 10px;
      }
    }
    .gas-box4 {
      margin-top: 35px;
    }
    .gas-box5 {
      margin-top: 105px;
    }
    .tit-box {
      display: flex;

      justify-content: space-between;
      flex-flow: wrap;
      padding: 0 10px;
      height: 26px;
      line-height: 26px;
      .gas-input {
        float: right;
        margin-right: 38px;
        width: 74px;
      }
      .t-tit {
        width: 176px;
        color: #333333;
        display: inline-block;
        font-size: 14px;
        &::before {
          content: "";
          display: inline-block;
          width: 12px;
          height: 12px;
          margin-right: 5px;
          background: #47a87d;
        }
      }
      .img {
        position: relative;
        width: 6px;
        margin-left: 20px;
        top: -3px;
      }
    }
  }
  .main-right {
    div {
      background: none;
      border-radius: 0;
    }

    position: relative;
    .line1 {
      width: 107px;
      height: 90px;
      border: 6px solid #f5222d;
      border-left: none;
      position: absolute;
      left: 0px;
      top: 82px;
    }
    .line2 {
      width: 236px;
      border-top: 6px solid #f5222d;
      position: absolute;
      left: 107px;
      top: 127px;
    }
    .line3 {
      width: 347px;
      border-top: 6px solid #f5222d;
      position: absolute;
      left: 0;
      top: 286px;
    }
    .line4 {
      width: 236px;
      height: 138px;
      border: 6px solid #f5222d;
      border-right: none;
      border-bottom: 6px solid #d734d6;
      position: absolute;
      right: 10px;
      top: 394px;
    }
    .line5 {
      width: 347px;
      border-top: 6px solid #f5222d;
      position: absolute;
      left: 0;
      top: 462px;
    }
    .stat-name {
      position: absolute;
      font-size: 14px;
      height: 26px;
      line-height: 26px;
      span {
        display: inline-block;
        vertical-align: middle;
      }
      .gas-input {
        float: right;
        margin-left: 5px;
        width: 74px;
      }
      .text-box {
        width: 74px;
        text-align: center;
        box-sizing: border-box;
        background: #ffffff;
        border: 1px solid #dcdfe6;
        margin-left: 5px;
        height: 26px;
      }
    }
    .stat-name1 {
      right: 30px;
      top: 97px;
    }
    .stat-name2 {
      right: 30px;
      top: 256px;
    }
    .stat-name3 {
      right: 30px;
      top: 364px;
    }
    .stat-name4 {
      right: 30px;
      top: 432px;
    }
    .stat-name5 {
      right: 30px;
      top: 508px;
    }
  }
  .main-center {
    position: relative;
    width: 28px;
    span {
      position: absolute;
      font-size: 14px;
    }
    .gas-name1 {
      top: 75px;
    }
    .gas-name2 {
      top: 172px;
    }
    .gas-name3 {
      top: 280px;
    }
    .gas-name4 {
      top: 456px;
    }
  }
}
</style>