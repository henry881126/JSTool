<!-- 库存及调峰-库存页面-->
<template>
  <div class="stock-page">
    <div class="content-left">
      <div class="header-box">
        <div class="header-left">
          <div class="tips-box" v-for="(item, i) in tipsList" :key="i">
            <span class="tips-value" :title="item.value + item.unit">
              {{ item.value }}
              <span class="tips-unit">{{ item.unit }}</span>
            </span>
            <span class="tips-name">{{ item.name }}</span>
          </div>
        </div>
        <div class="header-right" v-if="config.data.length">
          <!-- 管存占比水波图 -->
          <img class="stock-img" :src="stockImg" />
          <dv-water-level-pond :config="config" class="pipe-water" />
          <div class="pipe-title">库存占比：{{ config.data[0] }}%</div>
          <div class="pot-lower"></div>
          <div class="pot-up"></div>
        </div>
      </div>
      <div class="left-line"></div>
      <div class="left-main" v-if="stationList.length">
        <div class="detail-box" v-for="(item, i) in stationList" :key="i">
          <span class="t-tit">{{ item.stationName }}</span>
          <el-button
            type="primary"
            round
            size="small"
            class="pot-btn"
            @click="openDetail(item.stationId)"
          >
            储罐详情
          </el-button>
          <img class="pot-img" :src="potImg" />
          <dv-water-level-pond :config="item.config" class="detail-water" />
          <div
            class="box-blue"
            v-if="Number(item.tankRate) >= Number(item.tankLowerRate)"
          ></div>
          <div
            class="box-green"
            v-if="Number(item.tankRate) >= Number(item.tankUpRate)"
          ></div>
          <div class="pot-lower"></div>
          <div class="pot-up"></div>
          <div
            :class="
              item.tankRate >= '85'
                ? 'tit-red'
                : item.tankRate <= '15'
                ? 'tit-blue'
                : 'tit-dark'
            "
          >
            库存占比: {{ item.tankRate }}%
          </div>
          <div class="detail-table">
            <div class="wrapper-table">
              <dl>
                <dt>
                  <div>
                    <span>名称</span>
                    <span>单位</span>
                  </div>
                  <p>最大总液位</p>
                  <p>当前总液位</p>
                </dt>
                <dd>
                  <div>CM</div>
                  <p>{{ item.maxLevel }}</p>
                  <p>{{ item.level }}</p>
                </dd>
              </dl>
              <dl class="last-dl">
                <dt>
                  <div>
                    <span>名称</span>
                    <span>单位</span>
                  </div>
                  <p>最大总储量</p>
                  <p>当前总储量</p>
                  <p>可存入库存</p>
                  <p>可用库存量</p>
                </dt>
                <dd>
                  <div>万m³</div>
                  <p>{{ item.maxTankVolume }}</p>
                  <p>{{ item.tankVolume }}</p>
                  <p>{{ item.enterableVolume }}</p>
                  <p>{{ item.usableVolume }}</p>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-right">
      <img class="map-img" :src="mapImg" />
    </div>
    <el-dialog
      :title="detailTitle"
      :visible.sync="detailDialog"
      :before-close="closeDialog"
      width="82.3%"
      class="custom-dialog-n"
    >
      <div class="detatil-dialog">
        <ul class="main-list">
          <li v-for="(item, index) in list.children" :key="index">
            <div class="top-box">
              <p>{{ item.tankName }}</p>
              <p>当前液位：{{ item.level }}mm</p>
              <p>当前储存量：{{ item.tankVolume }}Nm³</p>
              <p>可存入罐存量：{{ item.enterableVolume }}Nm³</p>
            </div>
            <div class="main-box">
              <img class="cover-img" :src="potImg" />
              <div
                class="box-blue"
                v-if="Number(item.tankRate) >= Number(item.tankLowerRate)"
              ></div>
              <div
                class="box-green"
                v-if="Number(item.tankRate) >= Number(item.tankUpRate)"
              ></div>
              <div class="pot-lower">
                <span class="lower-limit"> <i>——</i>下限 </span>
              </div>
              <div class="pot-up">
                <span class="upper-limit"> <i>——</i>上限 </span>
              </div>
              <div class="limit-val-box">
                <dv-water-level-pond
                  :config="item.config"
                  class="water"
                  ref="water-box"
                />

                <span class="now-val" :style="{ top: item.nowValTop + 'px' }">
                  <span>{{ item.tankRate }}%</span><i>——</i>
                </span>
              </div>
            </div>
            <div class="bottom-box">
              <p>可用罐存量：{{ item.usableVolume }}Nm³</p>
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStockData } from "@/idsPages/api/stockAndPipeSave";
export default {
  data() {
    return {
      list: { children: [] },
      lngH: 168,
      isShowElement: true,
      tipsList: [
        { name: "LNG库存上限", value: "-", unit: "万m³" },
        { name: "可存入LNG库存", value: "-", unit: "万m³" },
        { name: "当前LNG库存", value: "-", unit: "万m³" },
        { name: "可用LNG库存", value: "-", unit: "万m³" },
      ],
      config: {
        data: [],
        waveNum: 1,
        waveOpacity: 1,
        waveHeight: 7,
        colors: ["#47A87D", "#47A87D"],
      },
      potImg: require("@/idsPages/images/peakShaving/pot.png"),
      mapImg: require("@/idsPages/images/peakShaving/statMap.png"),
      stockImg: require("@/idsPages/images/peakShaving/stockimg.png"),
      detailDialog: false,
      stationList: [],
      dataTimer: null,
      detailTitle: "",
    };
  },
  created() {
    this.getData();
    this.dataTimer = setInterval(this.getData, 180000);
  },
  // 页面关闭清除定时器
  destroyed() {
    if (this.dataTimer) {
      clearInterval(this.dataTimer);
    }
  },
  methods: {
    // 获取接口数据
    getData() {
      getStockData().then((res) => {
        let total = res.data.tankStoreTotal;
        this.tipsList[0].value = total.tankUpVolume;
        this.tipsList[1].value = total.enterableVolume;
        this.tipsList[2].value = total.tankVolume;
        this.tipsList[3].value = total.usableVolume;
        this.config.data[0] = Number(total.tankRate);
        if (this.config.data[0] <= 15) {
          this.config.colors = ["#2F3F95", "#2F3F95"];
        } else if (this.config.data[0] >= 85) {
          this.config.colors = ["#F5222D", "#F5222D"];
        }
        if (res.data.lngStationList.length) {
          this.stationList = this.handleData(res.data.lngStationList);
          this.stationList.forEach((item) => {
            item.children = this.handleData(item.children);
            let tankRate = Number(item.tankRate);
            let tankUpRate = Number(item.tankUpRate);
            let tankLowerRate = Number(item.tankLowerRate);
            if (tankRate > tankUpRate) {
              item.isCode = "2";
            } else if (tankRate < tankLowerRate) {
              item.isCode = "1";
            } else {
              item.isCode = "0";
            }
          });
        }
      });
    },
    // 关闭弹窗
    closeDialog() {
      this.detailDialog = false;
    },
    // 储站单选框选择事件
    openDetail(stationId) {
      let data = this.stationList.filter((item) => {
        return item.stationId == stationId;
      });
      this.detailTitle =
        data[0].stationName +
        "：共" +
        data[0].tankNum +
        "个罐，停用" +
        data[0].tankClosedNum +
        "个罐";
      this.list = data[0];
      this.detailDialog = true;
    },
    handleData(dataList) {
      if (dataList.length > 0) {
        let originalH = this.lngH;
        for (let i = 0; i < dataList.length; i++) {
          let item = dataList[i];
          let nowH = ((originalH * Number(item.tankRate)) / 100).toFixed(2);
          let waterColor = "#47A87D";
          item.nowValTop = originalH - nowH;
          if (Number(item.tankRate) <= Number(item.tankLowerRate)) {
            waterColor = "#2F3F95";
          } else if (Number(item.tankRate) >= Number(item.tankUpRate)) {
            waterColor = "#F5222D";
          }
          item.config = {
            data: [Number(item.tankRate)],
            waveNum: 1,
            waveOpacity: 1,
            waveHeight: 7,
            colors: [waterColor, waterColor],
          };
        }
        return dataList;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.stock-page {
  overflow: hidden;
  display: flex;
  height: 843px;
  justify-content: space-between;
  flex-flow: wrap;
  margin: 30px 13px 15px 42px;
  box-sizing: border-box;
  .pot-lower {
    border-top: 1px dashed #2f3f95;
    position: absolute;
    z-index: 4;
  }
  .pot-up {
    border-top: 1px dashed #f5222d;
    position: absolute;
    z-index: 4;
  }
  .content-left {
    width: 720px;
    height: 100%;
    box-sizing: border-box;
    border-right: 1px solid #e4e7ed;
    .header-box {
      width: 645px;
      height: 237px;
      border: 1px dashed #47a87d;
      padding: 54px 86px 31px;
      box-sizing: border-box;
      display: flex;
      .header-left {
        width: 293px;
        overflow: hidden;
        :nth-child(2n) {
          margin-left: 5px;
        }
        .tips-box {
          display: inline-block;
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
          .tips-value {
            display: inline-block;
            width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .tips-unit {
            display: inline;
            font-size: 12px;
          }
          .tips-name {
            display: block;
            height: 20px;
            font-weight: 400;
            font-size: 14px;
            color: #909399;
            line-height: 20px;
          }
        }
      }
      .header-right {
        margin-left: 25px;
        position: relative;
        width: 140px;
        .pipe-title {
          position: absolute;
          width: 100%;
          bottom: 16px;
          text-align: center;
          font-size: 14px;
        }
        .stock-img {
          position: absolute;
          z-index: 2;
          width: 100%;
          top: -7px;
        }
        .pipe-water {
          width: 77px;
          height: 110px;
          position: absolute;
          z-index: 1;
          left: 13px;
          bottom: 44px;
          border-radius: 32px 32px 0 0;
        }
        .pot-lower {
          width: 77px;
          bottom: 60.5px;
          left: 13px;
        }
        .pot-up {
          width: 73px;
          bottom: 137.5px;
          left: 15px;
        }
        .pipe-data {
          position: absolute;
          top: 61px;
          height: 28px;
          line-height: 28px;
          width: 100%;
          font-size: 20px;
          font-weight: 500;
          text-align: center;
          color: #303133;
        }
      }
    }
    .left-line {
      width: 157px;
      height: 47px;
      border-left: 1px dashed #47a87d;
      border-right: 1px dashed #47a87d;
      margin-left: 216px;
      margin-bottom: 10px;
    }
    .left-main {
      overflow: hidden;
      width: 645px;
      display: flex;
      justify-content: space-between;
      flex-flow: wrap;
      .detail-box {
        width: 313px;
        height: 260px;
        margin-bottom: 20px;
        position: relative;
        .t-tit {
          width: 176px;
          color: #333333;
          display: inline-block;
          height: 22px;
          line-height: 22px;
          font-size: 16px;
          margin-bottom: 11px;
          font-weight: 600;
          &::before {
            content: "";
            display: inline-block;
            width: 12px;
            height: 12px;
            margin-right: 5px;
            background: #47a87d;
          }
        }
        .pot-btn {
          float: right;
          width: 86px;
          height: 23px;
          line-height: 23px;
          font-size: 14px;
          padding: 0;
        }
        .pot-img {
          position: absolute;
          left: 10px;
          top: 33px;
          width: 81px;
          z-index: 3;
        }
        .detail-water {
          width: 65px;
          height: 170px;
          position: absolute;
          bottom: 48px;
          left: 18px;
          z-index: 0;
          border-radius: 10px;
        }
        .box-blue {
          width: 65px;
          height: 25px;
          position: absolute;
          bottom: 48px;
          left: 18px;
          z-index: 2;
          background: #2f3f95;
        }
        .box-green {
          width: 65px;
          height: 144px;
          position: absolute;
          bottom: 48px;
          left: 18px;
          z-index: 1;
          background: #47a87d;
        }
        .pot-lower {
          width: 79px;
          bottom: 73.5px;
          left: 11px;
        }
        .pot-up {
          width: 79px;
          bottom: 192.5px;
          left: 11px;
        }
        .tit-dark {
          position: absolute;
          bottom: 0;
          font-size: 14px;
        }
        .tit-red {
          position: absolute;
          bottom: 0;
          font-size: 14px;
          color: #f5222d;
        }
        .tit-blue {
          position: absolute;
          bottom: 0;
          font-size: 14px;
          color: #2f3f95;
        }
        .detail-table {
          height: 200px;
          float: right;
          width: 200px;
          .wrapper-table {
            flex: 1;
            dl {
              display: flex;
              border-radius: 4px;
              box-sizing: border-box;
              border: 1px solid #e8e8e8;
              overflow: hidden;
              margin: 0;
              p {
                margin: 0;
              }
              dt,
              dd {
                width: 100px;
                flex: 1;
                p {
                  color: #303133;
                  &:last-child {
                    border-bottom: none;
                  }
                }
                p,
                div {
                  height: 26px;
                  line-height: 26px;
                  padding-left: 16px;
                  font-size: 12px;
                  border-bottom: 1px solid #e8e8e8;
                }
              }
              dt {
                p {
                  background: #f2f6fc;
                  border-right: 1px solid #e8e8e8;
                }
                div {
                  display: flex;
                  padding-right: 16px;
                  justify-content: space-between;
                  background-image: linear-gradient(
                    to top right,
                    #f2f6fc 48%,
                    #e8e8e8,
                    #edfff7 52%
                  );
                  border-right: 1px solid #e8e8e8;
                  span {
                    font-size: 12px;
                    line-height: 18px;
                    color: #909399;
                    &:first-child {
                      margin-top: 7px;
                    }
                  }
                }
              }
              dd {
                margin: 0;
                div {
                  color: #909399;
                  background: #edfff7;
                }
              }
            }
            .last-dl {
              margin-top: 8px;
            }
          }
        }
      }
    }
  }
  .content-right {
    width: calc(100% - 720px);
    position: relative;
    .map-img {
      margin-left: 9%;
      position: absolute;
      width: calc(100% - 76px);
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .detatil-dialog {
    max-height: 63vh;
    overflow-y: auto;
    box-sizing: border-box;
    padding-bottom: 1px;
    .main-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, 300px);
      grid-gap: 10px;
      overflow: hidden;
      li {
        display: inline-grid;
        width: 300px;
        height: 331px;
        padding: 10px;
        box-sizing: border-box;
        border: solid 1px #ebeef5;
        font-size: 14px;
        color: #303133;
        background: #ffffff;
        float: left;
        p {
          margin: 0 0 5px 0;
          padding: 0;
        }
        .top-box {
          p {
            text-align: left;
          }
        }
        .bottom-box {
          p {
            text-align: center;
          }
        }
        .main-box {
          height: 195px;
          position: relative;
          .water {
            position: absolute;
            z-index: 0;
            height: 170px;
            width: 65px;
            left: 50%;
            border-radius: 10px;
            margin-left: -53px;
            top: 9px;
            box-sizing: border-box;
          }
          .box-blue {
            width: 65px;
            height: 26px;
            position: absolute;
            bottom: 16px;
            left: 92px;
            z-index: 2;
            background: #2f3f95;
          }
          .box-green {
            width: 65px;
            height: 145px;
            position: absolute;
            bottom: 16px;
            left: 92px;
            z-index: 1;
            background: #47a87d;
          }
          .pot-lower {
            width: 79px;
            bottom: 41.5px;
            left: 85px;
          }
          .pot-up {
            width: 79px;
            bottom: 160.5px;
            left: 85px;
          }
          .cover-img {
            position: absolute;
            z-index: 3;
            display: block;
            height: 195px;
            left: 50%;
            margin-left: -55px;
          }
          .limit-val-box {
            position: absolute;
            z-index: 0;
            height: 195px;
            width: 290px;
            left: 0;
          }
          .upper-limit {
            position: absolute;
            width: 59px;
            left: 82px;
            margin-top: -11px;
          }
          .lower-limit {
            position: absolute;
            width: 59px;
            left: 82px;
            margin-top: -11px;
          }
          .now-val {
            position: absolute;
            left: -6px;
            span {
              width: 65px;
              text-align: right;
              display: inline-block;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.stock-page {
  .dv-water-pond-level svg {
    display: none;
  }
  .dv-water-pond-level canvas {
    margin: 0px;
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
</style>
