<template>
  <div class="stations usegas-box">
    <div class="usegas-box">
      <div class="tips-group">
        <div class="tips" v-for="item in four" :key="item.trackKey">
          <div class="tips-top">
            <div class="tips-left">
              <h5>
                <span>
                  <img
                    :src="require('@/idsPages/images/dispatchingHome/gps.png')"
                  />
                </span>
                <span style="height: 22px">{{ item.trackName }}</span>
              </h5>
              <div class="usegas-progress">
                <stations-w :percentage="item.usedRate"></stations-w>
              </div>
            </div>
            <div class="wrapper-table">
              <dl>
                <dt>
                  <div>
                    <span>名称</span>
                    <span>单位</span>
                  </div>
                  <p>指定量</p>
                  <p>已提取量</p>
                  <p>未提取量</p>
                </dt>
                <dd>
                  <div>万m³</div>
                  <p>
                    {{ item.replyVolume ? item.replyVolume : "-" }}
                  </p>
                  <p>
                    {{ item.volumeUsed ? item.volumeUsed : "-" }}
                  </p>
                  <p>
                    {{
                      item.balanceVolumeUsable ? item.balanceVolumeUsable : "-"
                    }}
                  </p>
                </dd>
              </dl>
              <dl>
                <dt>
                  <div>
                    <span>名称</span>
                    <span>单位</span>
                  </div>
                  <p>总瞬时量</p>
                  <p>剩余时间</p>
                </dt>
                <dd>
                  <div></div>
                  <p>
                    {{
                      item.currentInstantFlow ? item.currentInstantFlow : "-"
                    }}万m³/h
                  </p>
                  <p>{{ item.balanceHour ? item.balanceHour : "-" }}h</p>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="tips tips2" v-for="item in one" :key="item.trackKey">
          <div class="tips-top">
            <div class="tips-left">
              <h5>
                <span>
                  <img
                    :src="require('@/idsPages/images/dispatchingHome/gps.png')"
                  />
                </span>
                <span style="height: 22px">{{ item.trackName }}</span>
              </h5>
              <div class="usegas-progress">
                <stations-w :percentage="item.usedRate"></stations-w>
              </div>
            </div>
            <div class="three">
              <div class="wrapper-table">
                <dl>
                  <dt>
                    <div>
                      <span>名称</span>
                      <span>单位</span>
                    </div>
                    <p>指定量</p>
                    <p>未提取量</p>
                  </dt>
                  <dd>
                    <div>万m³</div>
                    <p>
                      {{ item.replyVolume ? item.replyVolume : "-" }}
                    </p>
                    <p>
                      {{
                        item.balanceVolumeUsable
                          ? item.balanceVolumeUsable
                          : "-"
                      }}
                    </p>
                  </dd>
                </dl>
                <h5 class="h5">
                  <span>
                    <img
                      :src="
                        require('@/idsPages/images/dispatchingHome/gps.png')
                      "
                    />
                  </span>
                  <span style="font-size: 12px">东城门站</span>
                </h5>
                <dl>
                  <dt>
                    <div>
                      <span>名称</span>
                      <span>单位</span>
                    </div>
                    <p>总瞬时量</p>
                    <p>已提取量</p>
                  </dt>
                  <dd>
                    <div></div>
                    <p>
                      {{ dc.currentInstantFlow ? dc.currentInstantFlow : "-"
                      }}<span class="mi">万m³/h</span>
                    </p>
                    <p>
                      {{ dc.volumeUsed ? dc.volumeUsed : "-"
                      }}<span class="mi">万m³</span>
                    </p>
                  </dd>
                </dl>
              </div>
            </div>
            <div class="three">
              <div class="wrapper-table">
                <dl>
                  <dt>
                    <div>
                      <span>名称</span>
                      <span>单位</span>
                    </div>
                    <p>总瞬时量</p>
                    <p>-</p>
                  </dt>
                  <dd>
                    <div>万m³/h</div>
                    <p>
                      {{
                        item.currentInstantFlow ? item.currentInstantFlow : "-"
                      }}
                    </p>
                    <p>-</p>
                  </dd>
                </dl>
                <h5 class="h5">
                  <span>
                    <img
                      :src="
                        require('@/idsPages/images/dispatchingHome/gps.png')
                      "
                    />
                  </span>
                  <span style="font-size: 12px">高埗门站</span>
                </h5>
                <dl>
                  <dt>
                    <div>
                      <span>名称</span>
                      <span>单位</span>
                    </div>
                    <p>总瞬时量</p>
                    <p>已提取量</p>
                  </dt>
                  <dd>
                    <div></div>
                    <p>
                      {{ gb.currentInstantFlow ? gb.currentInstantFlow : "-"
                      }}<span class="mi">万m³/h</span>
                    </p>
                    <p>
                      {{ gb.volumeUsed ? gb.volumeUsed : "-"
                      }}<span class="mi">万m³</span>
                    </p>
                  </dd>
                </dl>
              </div>
            </div>
            <div class="three">
              <div class="wrapper-table">
                <dl>
                  <dt>
                    <div>
                      <span>名称</span>
                      <span>单位</span>
                    </div>
                    <p>剩余时间</p>
                    <p>-</p>
                  </dt>
                  <dd>
                    <div>h</div>
                    <p>{{ item.balanceHour ? item.balanceHour : "-" }}</p>
                    <p>-</p>
                  </dd>
                </dl>
                <h5 class="h5">
                  <span>
                    <img
                      :src="
                        require('@/idsPages/images/dispatchingHome/gps.png')
                      "
                    />
                  </span>
                  <span style="font-size: 12px">樟木头门站</span>
                </h5>
                <dl>
                  <dt>
                    <div>
                      <span>名称</span>
                      <span>单位</span>
                    </div>
                    <p>总瞬时量</p>
                    <p>已提取量</p>
                  </dt>
                  <dd>
                    <div></div>
                    <p>
                      {{
                        zmt.currentInstantFlow ? zmt.currentInstantFlow : "-"
                      }}
                      <span class="mi">万m³/h</span>
                    </p>
                    <p>
                      {{ zmt.volumeUsed ? zmt.volumeUsed : "-"
                      }}<span class="mi">万m³</span>
                    </p>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="tips" v-for="item in last" :key="item.trackKey">
          <div class="tips-top">
            <div class="tips-left">
              <h5>
                <span>
                  <img
                    :src="require('@/idsPages/images/dispatchingHome/gps.png')"
                  />
                </span>
                <span style="height: 22px">{{ item.trackName }}</span>
              </h5>
              <div class="usegas-progress">
                <stations-w :percentage="item.usedRate"></stations-w>
              </div>
            </div>
            <div class="wrapper-table">
              <dl>
                <dt>
                  <div>
                    <span>名称</span>
                    <span>单位</span>
                  </div>
                  <p>指定量</p>
                  <p>已提取量</p>
                  <p>未提取量</p>
                </dt>
                <dd>
                  <div>万m³</div>
                  <p>
                    {{ item.replyVolume ? item.replyVolume : "-" }}
                  </p>
                  <p>
                    {{ item.volumeUsed ? item.volumeUsed : "-" }}
                  </p>
                  <p>
                    {{
                      item.balanceVolumeUsable ? item.balanceVolumeUsable : "-"
                    }}
                  </p>
                </dd>
              </dl>
              <dl>
                <dt>
                  <div>
                    <span>名称</span>
                    <span>单位</span>
                  </div>
                  <p>总瞬时量</p>
                  <p>剩余时间</p>
                </dt>
                <dd>
                  <div></div>
                  <p>
                    {{
                      item.currentInstantFlow ? item.currentInstantFlow : "-"
                    }}万m³/h
                  </p>
                  <p>{{ item.balanceHour ? item.balanceHour : "-" }}h</p>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import stationsW from "./stationsW.vue";
export default {
    name:'stations',
  components: {
    stationsW,
  },
  props: {
    czStationLists: {
      type: Object,
      default: null,
    },
    item: {
      type: Object,
      default: null,
    },
  },
  watch: {
    //newval['DP'],newval['ZT']
    czStationLists: {
      handler(newval) {
        this.four = [newval["GW_XG"], newval["SW_XG"], newval["JF_LNG"]];
        this.one = [newval["DP"]];
        this.last = [newval["ZT"]];
        this.dc = newval["DC"];
          this.zmt = newval["ZMT"];
          this.gb = newval["GB"];
      },
    },
  },
  //GB ZMT
  data() {
    return {
      four: [
        {
          balanceHour: "",
          balanceVolumeUsable: "",
          currentInstantFlow: "",
          replyVolume: "",
          sort: "",
          trackKey: "GW_XG",
          trackName: "国网-谢岗门站",
          usedRate: "",
          volumeUsed: "",
        },
        {
          balanceHour: "",
          balanceVolumeUsable: "",
          currentInstantFlow: "",
          replyVolume: "",
          sort: "",
          trackKey: "SW_XG",
          trackName: "省网-谢岗门站",
          usedRate: "",
          volumeUsed: "",
        },
        {
          balanceHour: "",
          balanceVolumeUsable: "",
          currentInstantFlow: "",
          replyVolume: "",
          sort: "",
          trackKey: "JF_LNG",
          trackName: "九丰LNG站",
          usedRate: "",
          volumeUsed: "",
        },
      ],
      one: [
        {
          balanceHour: "",
          balanceVolumeUsable: "",
          currentInstantFlow: "",
          replyVolume: "",
          sort: "",
          trackKey: "DP",
          trackName: "大鹏气源",
          usedRate: "",
          volumeUsed: "",
        },
      ],
      last: [
        {
          balanceHour: "",
          balanceVolumeUsable: "",
          currentInstantFlow: "",
          replyVolume: "",
          sort: "",
          trackKey: "ZT",
          trackName: "中堂门站",
          usedRate: "",
          volumeUsed: "",
        },
      ],
      dc: {
        balanceHour: "",
        balanceVolumeUsable: "",
        currentInstantFlow: "",
        replyVolume: "",
        sort: "",
        trackKey: "",
        trackName: "东城门站",
        usedRate: "",
        volumeUsed: "",
      },
      zmt: {
        balanceHour: "",
        balanceVolumeUsable: "",
        currentInstantFlow: "",
        replyVolume: "",
        sort: "",
        trackKey: "",
        trackName: "樟木头门站",
        usedRate: "",
        volumeUsed: "",
      },
      gb: {
        balanceHour: "",
        balanceVolumeUsable: "",
        currentInstantFlow: "",
        replyVolume: "",
        sort: "",
        trackKey: "",
        trackName: "高埗门站",
        usedRate: "",
        volumeUsed: "",
      },
    };
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.h5 {
  position: relative;
  top: 3px;
  font-size: 12px;
}
.mi {
  zoom: 0.6;
}
.three {
  width: 30%;
}
.wrapper-table {
  flex: 1;
  display: flex;
  dl {
    display: flex;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid #e8e8e8;
    overflow: hidden;
    dt,
    dd {
      width: 1px;
      flex: 1;
      p {
        color: #303133;
        &:last-child {
          border-bottom: none;
        }
      }
      //   p{
      //       padding-left: 16px;
      //   }
      //   div{
      //     padding-left: 16px;
      //   }
      p,
      div {
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        border-bottom: 1px solid #e8e8e8;
        text-align: center;
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
          line-height: 21px;
          color: #909399;
          &:first-child {
            margin-top: 7px;
          }
        }
      }
    }
    dd {
      div {
        color: #909399;
        background: #edfff7;
      }
    }
  }
}
.stations {
  width: 100%;
  height: 466px;
  margin-top: 10px;
  overflow-y: auto;
  border-radius: 8px;
  box-sizing: border-box;
  overflow: hidden;
  .usegas-box {
    height: 100%;
    .tips-group {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      flex-wrap: wrap;
      clear: both;
      .tips {
        width: 30.5%;
        margin-bottom: 10px;
        border-radius: 8px;
        padding: 13px 10px;
        background: #fff;
        // flex: 1;
        h5 {
          span {
            display: inline-block;
            &:last-child {
              font-size: 14px;
              font-weight: 400;
              color: #303133;
              line-height: 22px;
            }
            &:first-child {
              position: relative;
              top: 2px;
              img {
                width: 12px;
                margin-right: 3px;
                display: inline-block;
              }
            }
          }
        }
        .tips-top {
          display: flex;
          .usegas-progress {
            margin: 10px 0 0 -10px;
            width: 120px;
            height: 110px;
          }
          .wrapper-table {
            height: 157px;
            margin-left: 5px;
            flex-direction: column;
            dl {
              dt,
              dd {
                p,
                div {
                  height: 21px;
                  line-height: 21px;
                }
              }
              dt {
                div {
                  padding: 0 3px;
                  span {
                    &:first-child {
                      margin-top: 3px;
                    }
                    &:last-child {
                      line-height: 15px;
                    }
                  }
                }
              }
              dd {
                div {
                  padding-left: 6px;
                }
              }
              &:last-child {
                margin-top: 4px;
              }
            }
          }
        }
        &:first-child {
          h5 {
            span {
              &:first-child {
                margin-left: 0;
              }
            }
          }
        }
        &:last-child {
          dl {
            dd {
              border-right: none;
            }
          }
        }
      }
    }
  }
}
.tips2 {
  width: 64% !important;
}
</style>
