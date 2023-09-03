<template>
  <div>
    <el-popover
        placement="bottom-start"
        width="983"
        @after-enter="showPop"
        popper-class="custom-popover"
        v-show="hasData"
        trigger="hover">
      <div class="pop-container">
        <div class="gas-recommend-tip-wrapper gas-tip-left"
             @click="recommendMove(-125)">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="gas-recommend-tip-wrapper gas-tip-right"
             @click="recommendMove(125)">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="gas-recommend-item-wrapper">
          <div ref="recomendWrapper">
            <div :class="{'gas-recommend-item': true, 'gas-recommend-item-active': v.date === active}"
                 v-for="v in scope"
                 @click="clickWe(v)"
                 :key="v.date">
              <div class="gas-recommend-item-date">{{ v.week }}</div>
              <div class="gas-recommend-item-date" style="margin-top: 5px;color: #606266;">{{ v.date }}</div>
              <img :src="'/static/img/tempicon/' + v.reportPeriod + '.png'" alt="" class="img-wrapper" onerror="this.src='/static/img/tempicon/默认天气.png'">
              <div class="gas-recommend-item-use gas-recommend-item-text" style="margin-top: 4px;">
                {{v.reportPeriod}}
              </div>
              <div class="gas-recommend-item-tem gas-recommend-item-text" style="margin-top: 7px;">
                {{v.mintemp + ' ~ ' + v.maxtemp}}℃
              </div>
            </div>
          </div>
        </div>
        <div class="charts" id="charts"></div>
      </div>
      <div class="weather-container" slot="reference">
        <div class="weather-place-wrapper weather-item-wrapepr">
          <i class="el-icon-location-outline"></i>
          {{today.cityName}}
        </div>
        <div class="weather-date-wrapper weather-item-wrapepr">{{ getFormatDate(today.date, '/') + ' ' + today.week }}</div>
        <div class="weather-wrapper weather-item-wrapepr">今{{today.reportPeriod}} {{today.mintemp}}℃~{{today.maxtemp}}℃ 良</div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import api from "/src/http/api";
import dateFormater from "../../components/dateFormater/dateFormater";
export default {
  name: "weatherTip1",
  mixins: [dateFormater],
  data: function () {
    return {
      visible: true,
      today: {},
      scope: [],
      hasData: false,
      active: '',
      current: {
        '08': {},
        '11': {},
        '14': {},
        '17': {},
        '20': {},
        '23': {},
        '02': {},
        '05': {}
      },
      charts: null,
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          top: 15,
          bottom: 30,
          left: 40,
          right: 40
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: true
          },
          axisTick: {
            show: false
          },
          data: ['08时', '11时', '14时', '17时', '20时', '23时', '02时', '05时']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line',
          lineStyle: {
            color: '#47A87D'
          },
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#47A87D' },
              { offset: 1, color: "rgba(126, 194, 164, 0.1)" }
            ])
          }
        }]
      }
    }
  },
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom
    }
  },
  watch:  {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if(n && o) {
          this.getData()
        }
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData: function () {
      api.gasDemand.getWeatherScope({
        code: this.curComCode
      }).then(res => {
        if(res) {
          if(res[0].length === 0) {
            this.hasData = false
            return
          }
          this.hasData = true
          this.scope = res[0]
          this.option.series[0].data = []
          for (let v of this.scope) {
            if(v.date === this.getFormatDate(Date.now())) {
              for (let vv of v.weatherHoursVOList) {
                if(Object.prototype.hasOwnProperty.call(this.current, vv.hour)) {
                  this.current[vv.hour] = vv
                }
              }
            }
          }
          for (let v in this.current) {
            this.option.series[0].data.push(this.current[v].currenttemp)
          }
          this.charts.setOption(this.option, true)
        }
      })
      api.gasDemand.getWeather({
        code: this.curComCode
      }).then(res => {
        if(res) {
          this.today = res[0]
        }
      })
      this.$nextTick(() => {
        this.charts = this.$echarts.init(document.getElementById('charts'))
      })
      this.active = this.getFormatDate(Date.now())
    },
    recommendMove: function (left) {
      let last = this.$refs["recomendWrapper"].scrollLeft;
      if (last === 0 && left < 0) {
        return;
      }
      this.$refs["recomendWrapper"].scrollTo({
        left: this.$refs["recomendWrapper"].scrollLeft + left,
        behavior: "smooth",
      });
    },
    clickWe: function (item) {
      this.active = item.date
      for (let v of item.weatherHoursVOList) {
        if(Object.prototype.hasOwnProperty.call(this.current, v.hour)) {
          this.current[v.hour] = v
        }
      }
      this.option.series[0].data = []
      for (let v in this.current) {
        this.option.series[0].data.push(this.current[v].currenttemp)
      }
      this.charts.setOption(this.option, true)
    },
    showPop: function () {
      document.getElementsByClassName('gas-recommend-item-active')[0].scrollIntoView({
        behavior: "smooth"
      })
    }
  }
}
</script>

<style scoped>
.weather-container {
  height: 20px;
  position: absolute;
  top: 71px;
  right: 20px;
}
.weather-item-wrapepr {
  display: inline-block;
  vertical-align: top;
  height: 20px;
  font-size: 14px;
  line-height: 20px;
  color: #FFFFFF;
  opacity: 1;
  margin-left: 30px;
}
.pop-container {
  width: 100%;
  height: 419px;
  position: relative;
}
.gas-recommend-tip-wrapper {
  width: 37px;
  height: 148px;
  border-radius: 8px;
  box-shadow: 0 0 10px 3px rgba(200, 200, 200, 0.3);
  position: absolute;
  top: 60px;
  cursor: pointer;
}

.gas-tip-left {
  left: 8px;
  display: flex;
}

.gas-recommend-tip-wrapper i {
  margin: auto;
  transform: scale(2);
  color: #0fb2ab;
}

.gas-tip-right {
  right: 8px;
  display: flex;
}

.gas-recommend-item-wrapper {
  width: 870px;
  height: 215px;
  position: absolute;
  top: 10px;
  left: 55px;
  overflow: hidden;
  /*transition: ;*/
}

.gas-recommend-item-wrapper > div {
  height: 215px;
  width: 100%;
  position: absolute;
  top: 0;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: auto;
}

.gas-recommend-item {
  width: 120px;
  height: 200px;
  display: inline-block;
  margin-left: 5px;
  position: relative;
  cursor: pointer;
  border-radius: 4px;
  background: #F5F7FA;
  text-align: center;
  color: #303133;
}

.gas-recommend-item-active {
  background: #D9EDE4;;
}

.gas-recommend-item:first-child::before {
  width: 0;
}

.gas-recommend-item-date {
  text-align: center;
  margin-top: 20px;
  width: 100%;
  height: 22px;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
}

.gas-recommend-item-text {
  width: 100%;
  height: 22px;
  font-size: 14px;
  line-height: 28px;
  text-align: center;
  margin-top: 12px;
}
.gas-recommend-item-tem {
  margin-top: 48px;
}
.charts {
  width: 870px;
  height: 176px;
  background: #F5F7FA;
  position: absolute;
  left: 55px;
  bottom: 8px;
  border-radius: 4px;
}
.img-wrapper {
  width: 40px;
  height: 40px;
  margin-top: 6px;
}
</style>