<template>
  <div>
    <el-popover
        placement="bottom-start"
        width="1000"
        @after-enter="showPop"
        trigger="hover">
      <div class="pop-container">
        <div class="gas-recommend-tip-wrapper gas-tip-left"
             @click="recommendMove(-122)">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="gas-recommend-tip-wrapper gas-tip-right"
             @click="recommendMove(122)">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="gas-recommend-item-wrapper">
          <div ref="recomendWrapper">
            <div :class="{'gas-recommend-item': true, 'gas-recommend-item-active': v.date === active}"
                 v-for="v in scope"
                 @click="clickWe(v)"
                 :key="v.date">
              <div class="gas-recommend-item-date">{{ v.date.split('-')[2] + '日 （周' + v.week.split('')[2] + '）' }}</div>
              <div class="gas-recommend-item-use gas-recommend-item-text">
                {{v.reportPeriod}}
              </div>
              <div class="gas-recommend-item-tem gas-recommend-item-text">
                {{v.mintemp + '/' + v.maxtemp}}℃
              </div>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div class="charts" id="charts"></div>
        <div class="feng">
          <div class="feng-item"
               v-for="v in this.current"
               :key="v.hour">
            <div>{{v.winddirection}}</div>
            <div>{{v.windSpeed}}</div>
          </div>
        </div>
      </div>
      <div class="weather-container" slot="reference">
        <div class="weather-place-wrapper weather-item-wrapepr">
          <i class="el-icon-location-outline"></i>
          石家庄
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
  name: "weatherTip",
  mixins: [dateFormater],
  data: function () {
    return {
      visible: true,
      today: {},
      scope: [],
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
        grid: {
          top: 20,
          bottom: 0,
          left: 0,
          right: 0
        },
        xAxis: {
          type: 'category',
          position: 'top',
          offset: -5,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          data: ['08时', '11时', '14时', '17时', '20时', '23时', '02时', '05时']
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line'
        }]
      }
    }
  },
  created() {
    api.gasDemand.getWeatherScope([]).then(res => {
      if(res) {
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
    api.gasDemand.getWeather([]).then(res => {
      if(res) {
        this.today = res[0]
      }
    })
    this.active = this.getFormatDate(Date.now())
    this.$nextTick(() => {
      this.charts = this.$echarts.init(document.getElementById('charts'))
    })
  },
  mounted() {

  },
  methods: {
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
  top: 19px;
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
  height: 411px;
  position: relative;
}
.gas-recommend-tip-wrapper {
  width: 42px;
  height: 160px;
  padding: 5px;
  border-radius: 8px;
  box-shadow: 0 0 10px 3px rgba(200, 200, 200, 0.3);
  position: absolute;
  top: 90px;
  cursor: pointer;
}

.gas-tip-left {
  left: 9px;
  display: flex;
}

.gas-recommend-tip-wrapper i {
  margin: auto;
  transform: scale(2);
  color: #0fb2ab;
}

.gas-tip-right {
  right: 9px;
  display: flex;
}

.gas-recommend-item-wrapper {
  width: calc(100% - 150px);
  height: 186px;
  position: absolute;
  top: 10px;
  left: 75px;
  overflow: hidden;
  /*transition: ;*/
}

.gas-recommend-item-wrapper > div {
  height: 190px;
  width: 100%;
  position: absolute;
  top: 0;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: auto;
}

.gas-recommend-item {
  width: 120px;
  height: 186px;
  background: rgba(15, 178, 171, 0.15);
  display: inline-block;
  margin-left: 2px;
  position: relative;
  cursor: pointer;
}

.gas-recommend-item-active {
  background: #0FB2AB;
}

.gas-recommend-item-active>div {
  color: #ffffff !important;
}

.gas-recommend-item:first-child::before {
  width: 0;
}

.gas-recommend-item::before {
  content: "";
  display: block;
  height: 200px;
  position: absolute;
  width: 1px;
  background: #e2e2e2;
  top: 49px;
}

.gas-recommend-item-date {
  text-align: center;
  margin-top: 23px;
  width: 100%;
  height: 22px;
  font-size: 16px;
  font-weight: 500;
  color: #0FB2AB;
  line-height: 22px;
}

.gas-recommend-item-text {
  width: 100%;
  height: 28px;
  font-size: 16px;
  line-height: 28px;
  color: #0FB2AB;
  text-align: center;
  margin-top: 12px;
}
.gas-recommend-item-tem {
  margin-top: 48px;
}
.line {
  width: 852px;
  height: 1px;
  background: #D8D8D8;
  position: absolute;
  top: 225px;
  left: 75px;
}
.charts {
  width: 852px;
  height: 71px;
  position: absolute;
  left: 75px;
  bottom: 96px;
}
.feng {
  width: 852px;
  height: 51px;
  position: absolute;
  left: 75px;
  bottom: 15px;
}
.feng-item {
  float: left;
  width: 106px;
  height: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #445464;
  line-height: 22px;
}
</style>