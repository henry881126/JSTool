<!--
  * @Description:输配能力监控
  * @Author:ZuYaun Dong
  * @Date:2021-10-12
-->
<template>
  <div class="delivery-wrapper gas-page-bg-diaodu">
    <top-menu title="天然气输配（调度）智慧管理平台"></top-menu>
    <!-- 面包屑 -->
    <div class="crumb-diaodu">
      <span class="crumb-title1">运营调度 / </span>
      <span class="crumb-title2">输配能力监控</span>
    </div>
    <div class="content-wrapper content-wrapper-diaodu">
      <!-- 标题 -->
      <div class="title">
        <div class="title-part">
          <span class="t1">输配能力监控</span>
          <!-- <span class="t2">{{ this.dateTime }}</span> -->
          <div class="station-serach-part" v-if="showContent == 'stations'">
            <el-select
              class="screen-list"
              v-model="stationValue"
              placeholder="请选择"
              collapse-tags
              @change="stationEvent(stationValue)"
            >
              <el-option label="全部场站" value=""> </el-option>
              <el-option
                v-for="item in stationsList"
                :key="item.filedValue"
                :label="item.filedLabel"
                :value="item.filedValue"
              >
              </el-option>
            </el-select>
            <div class="search-box">
              <el-input
                class="custom-search"
                clearable
                v-model="searchVal"
                placeholder="请输入客户名称/关键字"
                :maxlength="50"
                onkeyup="this.value=this.value.replace(/\s+/g,'')"
              ></el-input>
              <el-button
                type="primary"
                class="custom-btn"
                round
                @click="searchEvent(searchVal)"
              >
                <i class="el-icon-search"></i>
                查询
              </el-button>
            </div>
          </div>
        </div>
        <div class="button-group">
          <span
            v-for="(item, index) in distributionButGroup"
            :key="index"
            @click="changedistribBtn(index)"
            :class="{ checkedBtn: item.status == 2 }"
            >{{ item.name }}</span
          >
        </div>
      </div>
      <!-- 内容部分 -->
      <!-- <div class="content-box">
        <Construction />
      </div> -->
      <div class="content-box" v-if="showContent == 'pipes'">
        <Gridiron :pipeList="pipeList"></Gridiron>
      </div>
      <div class="content-box" v-if="showContent == 'stations'">
        <Stations :stationData="stationData"></Stations>
      </div>
    </div>
  </div>
</template>

<script>
import TopMenu from "@/components/topMenu/topMenu2";
// import Construction from "../../../components/Construction";
import Gridiron from "./components/gridiron.vue";
import Stations from "./components/stations.vue";
import {
  getPipeList,
  getStationDetailList,
} from "@/idsPages/api/monitorAndControl";
export default {
  name: "monitorAndControl",
  components: {
    TopMenu,
    // Construction,
    Gridiron,
    Stations,
  },
  data() {
    return {
      dateTime: "",
      timer: null,
      showContent: "pipes",
      pipeList: [],
      stationData: [],
      distributionButGroup: [
        {
          //输配能力监控btn
          name: "管网",
          status: 2,
        },
        {
          name: "场站",
          status: 1,
        },
      ],
      //筛选场站
      stationValue: "",
      stationsList: [
        {
          filedLabel: "门站",
          filedValue: "NGS.GGS",
        },
        {
          filedLabel: "储站",
          filedValue: "NGS.GRS",
        },
        {
          filedLabel: "调压站",
          filedValue: "NGS.RPS",
        },
      ],
      //模糊搜索
      searchVal: "",

      stationVal: "", //选择场站

      stationType: "",
      stationName: "",
    };
  },
  created() {},
  mounted() {
    this.getPipeData();
    this.getStationData();
    this.timer = setInterval(() => {
      this.getPipeData(), this.getStationData();
    }, 1000 * 60 * 3);
    var getIndexNum = sessionStorage.getItem("tabLiNum");
    if (getIndexNum == "0") {
      this.showContent = "pipes";
      this.distributionButGroup.map((item, index) => {
        if (index == getIndexNum) {
          item.status = 2;
        } else {
          item.status = 1;
        }
      });
    }
    if (getIndexNum == "1") {
      this.showContent = "stations";
      this.distributionButGroup.map((item, index) => {
        if (index == getIndexNum) {
          item.status = 2;
        } else {
          item.status = 1;
        }
      });
    }
  },
  destroyed() {
    sessionStorage.removeItem("tabLiNum");
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    //管网列表-接口请求
    getPipeData() {
      getPipeList().then((res) => {
        this.pipeList = res.data;
      });
    },
    //场站列表-接口请求
    getStationData() {
      let params = {
        stationType: this.stationType,
        name: this.stationName,
      };
      getStationDetailList(params)
        .then((res) => {
          this.stationData = res.data;
        })
        .catch(() => {
          this.stationData = [];
        });
    },
    changedistribBtn(val) {
      // console.log(val, "点击按钮");
      sessionStorage.setItem("tabLiNum", val);
      this.distributionButGroup.map((item, index) => {
        if (index == val) {
          item.status = 2;
        } else {
          item.status = 1;
        }
      });
      //切换内容页面
      if (val === 0) {
        this.showContent = "pipes";
        this.getPipeData();
      } else if (val === 1) {
        this.showContent = "stations";
        this.stationType = "";
        this.stationName = "";
        this.stationValue = "";
        this.searchVal = "";
        this.getStationData();
      }
    },
    //筛选场站
    stationEvent(val) {
      // console.log(val, "筛选场站");
      this.stationType = val;
      sessionStorage.removeItem("statNum");
      this.getStationData();
    },
    //模糊搜索
    searchEvent(val) {
      console.log(val, "模糊搜索");
      sessionStorage.removeItem("statNum");
      this.stationName = val;
      this.getStationData();
    },
  },
};
</script>
<style lang="scss">
.station-serach-part .el-select .el-input__inner {
  width: 140px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
}
.station-serach-part .el-input__icon {
  line-height: 32px;
}
.station-serach-part .el-select .el-input__inner {
  padding-left: 10px;
  background: #fff;
  color: #606266;
}
.station-serach-part .el-select .el-input__suffix {
  text-align: right;
  border: none;
  color: #fff;
}
.station-serach-part .el-select .el-input.is-focus .el-input__inner {
  border: 1px solid #dcdfe6;
}
.custom-search {
  width: 280px;
  .el-input__inner {
    width: 100%;
    height: 32px;
    line-height: 32px;
    border-radius: 100px;
  }
}
</style>

<style lang='scss' rel='stylesheet/scss' scoped>
.selected {
  color: #47a87d;
}

.custom-btn {
  margin-left: 10px;
  border-radius: 16px !important;
  padding: 8px 23px !important;
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
      margin-bottom: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      margin-bottom: 28px;
      .title-part {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .station-serach-part {
          height: 100%;
          width: 560px;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
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
      .t2 {
        width: 184px;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
        line-height: 20px;
      }
    }
    .button-group {
      width: 172px;
      height: 32px;
      margin: 2px 0 0 10px;
      border-radius: 14px;
      overflow: hidden;
      span {
        text-align: center;
        padding: 0 15px;
        display: inline-block;
        width: 56px;
        line-height: 32px;
        font-size: 14px;
        color: #303133;
        background: #eef0f7;
      }
      span.checkedBtn {
        color: #fff;
        background: #47a87d;
      }
    }
    .content-box {
      position: relative;
      width: 100%;
      height: calc(100vh - 222px);
    }
  }
}
</style>