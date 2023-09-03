<template>
  <div>
    <div class="title-wrapper">
      {{ getFormatYear(date) }}{{ type === '1' ? '合同年' : '自然年' }}度(逐月)预测用气量 <span>(单位:万方)</span> <span class="is-change-wrapper" v-if="updateInfo.isChange">预测结果已更新，更新时间：{{ updateInfo.changeTime }}</span>
      <el-button type="primary" size="small" round class="save-btn" icon="el-icon-data-analysis" @click="saveData">保存并预测</el-button>
    </div>
    <div class="table-wrapper">
      <el-table
          class="custom-table-n"
          border
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          v-loading="loading"
          :row-class-name="tableRowClassName"
          :data="list">
        <el-table-column
            property="type"
            fixed="left"
            align="left"
            width="200"
            label="类型">
          <template slot-scope="scope">
            {{ scope.row.type === '实际用气量' ? getFormatYearPre(date) + (type === '1' ? '合同年' : '自然年') + scope.row.type : scope.row.type }}
          </template>
        </el-table-column>
        <template v-for="(v, i) in tableColumn">
          <el-table-column
              :key="i < 12 ? getFormatYear(date) + '-' + v : getFormatYearNext(date) + '-' + v"
              v-if="(type === '1' && i > 2) || (type === '2' && i < 12)"
              :property="i < 12 ? getFormatYear(date) + '-' + v : getFormatYearNext(date) + '-' + v"
              align="left"
              min-width="120"
              :label="i < 12 ? getFormatYear(date) + '/' + v : getFormatYearNext(date) + '/' + v">
            <template slot-scope="scope">
              <div v-if="scope.row.type === '环比增长率'">
                {{ scope.row[i < 12 ? getFormatYear(date) + '-' + v : getFormatYearNext(date) + '-' + v] }}%
              </div>
              <div v-else-if="scope.row.type === '新增客户(可调整)'">
                <el-input @input="calc" v-model="scope.row[i < 12 ? getFormatYear(date) + '-' + v : getFormatYearNext(date) + '-' + v]" class="custom-input-r" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
              </div>
              <div v-else>
                {{ scope.row[i < 12 ? getFormatYear(date) + '-' + v : getFormatYearNext(date) + '-' + v] }}
              </div>
            </template>
          </el-table-column>
        </template>
        <el-table-column
            property="total"
            fixed="right"
            align="right"
            width="130"
            label="合计">
          <template slot-scope="scope">
            {{scope.row.total}}<span v-if="scope.row.type === '环比增长率'">%</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="title-wrapper" style="margin-top: 15px;">
      {{ getFormatYear(date) }}{{ type === '1' ? '合同年' : '自然年' }}度(逐月)预测用气量图示 <span>(单位:万方)</span>
    </div>
    <div class="charts-wrapper" id="charts-wrapper">

    </div>
  </div>
</template>

<script>
import dateFormater from "../../../components/dateFormater/dateFormater";
import api from '@/http/api'

export default {
  name: "year",
  mixins: [dateFormater],
  props: {
    date: {
      type: Date
    },
    type: {
      type: String
    }
  },

  data: function () {
    return {
      loading: false,
      tableColumn: ['01','02','03','04','05','06','07','08','09','10','11','12','01','02','03'],
      list: [],
      updateInfo: {
        isChange: false,
        changeTime: ''
      },
      charts: null,
      newRow: {},
      totalRow: {},
      lastYearRow: {},
      rateRow: {},
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
          left: '0px',
          right: '0px',
          bottom: '0px',
          containLabel: true
        },
        legend: {
          data: []
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: 'Evaporation',
            type: 'bar',
            barWidth : 20,
            data: []
          },
          {
            name: 'Precipitation',
            type: 'bar',
            barWidth : 20,
            data: []
          },
          {
            name: 'Temperature',
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ]
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
    },
    date: {
      handler: function (n, o) {
        if(n && o) {
          this.getData()
        }
      }
    },
    type: {
      handler: function (n, o) {
        if(n && o) {
          this.getData()
        }
      }
    }
  },
  created() {
    this.getData()
    this.$nextTick(() => {
      this.charts = this.$echarts.init(document.getElementById('charts-wrapper'));
    })
  },
  methods: {
    getData: function () {
      let params = {
        code: this.curComCode,
        date: this.getFormatYear(this.date),
        type: this.type
      }
      this.loading = true
      api.gasDemand.getDemandOfYear(params).then(res => {
        if(res) {
          this.list = res[0].list
          this.updateInfo.isChange = res[0].yearChangeInfoVO.isChange
          this.updateInfo.changeTime = res[0].yearChangeInfoVO.changeTime
          this.loading = false
          this.setChartsOption()
        }
      })
    },
    setChartsOption: function () {
      for (let v of this.list) {
        if(v.type === '合计') {
          this.totalRow = v
        } else if(v.type === '实际用气量') {
          this.lastYearRow = v
        } else if(v.type === '环比增长率') {
          this.rateRow = v
        } else if(v.type === '新增客户(可调整)') {
          this.newRow = v
        }
      }
      this.option.legend.data = [this.getFormatYearPre(this.date) + '实际用气量', this.getFormatYear(this.date) + '预测用气量', '预测增长率']
      this.option.series[0].name = this.option.legend.data[0]
      this.option.series[1].name = this.option.legend.data[1]
      this.option.series[2].name = this.option.legend.data[2]
      this.option.xAxis[0].data = []
      this.option.series[0].data = []
      this.option.series[1].data = []
      this.option.series[2].data = []
      if(this.type === '1') {
        for (let i = 4; i < 17; i++) {
          if(i === 13) {continue}
          let item = ''
          if(i < 13) {
            item = this.getFormatYear(this.date) + '/' + (i < 10 ? '0' + i : i)
          } else {
            item = this.getFormatYearNext(this.date) + '/' + (i%13 < 10 ? '0' + i%13 : i%13)
          }
          this.option.series[0].data.push(this.lastYearRow[this.getFormatMonth(item)])
          this.option.series[1].data.push(this.totalRow[this.getFormatMonth(item)])
          this.option.series[2].data.push(this.rateRow[this.getFormatMonth(item)])
          this.option.xAxis[0].data.push(item)
        }
      } else {
        for (let i = 1; i < 13; i++) {
          let item = ''
          item = this.getFormatYear(this.date) + '/' + (i < 10 ? '0' + i : i)
          this.option.series[0].data.push(this.lastYearRow[this.getFormatMonth(item)])
          this.option.series[1].data.push(this.totalRow[this.getFormatMonth(item)])
          this.option.series[2].data.push(this.rateRow[this.getFormatMonth(item)])
          this.option.xAxis[0].data.push(item)
        }
      }
      this.charts.setOption(this.option, true)
    },
    tableRowClassName({row}) {
      if(row.type === '合计') {
        return 'total-row'
      }
      return '';
    },
    saveData: function () {
      let data = {
        "code": this.curComCode,
        "date": this.getFormatYear(this.date),
        "list": this.newRow,
        "type": this.type
      }
      api.gasDemand.saveDataYear(data).then(res => {
        if(res[0]) {
          this.$message.success('修改成功')
          this.getData()
        }
      })
    },
    calc: function () {
      this.newRow.total = 0
      for (let i in this.newRow) {
        if(i === 'type' || i === 'total') {
          continue
        }
        if(!isNaN(parseInt(this.newRow[i]))) {
          this.newRow.total = parseInt(this.newRow.total) + parseInt(this.newRow[i])
        }
      }
      for (let date in this.totalRow) {
        if(date === 'type') {
          continue
        }
        this.totalRow[date] = 0
      }
      for (let i in this.list) {
        if(this.list[i].type === '合计' || this.list[i].type === '实际用气量' || this.list[i].type === '环比增长率') {
          continue
        }

        for (let date in this.totalRow) {
          if(!isNaN(parseInt(this.list[i][date]))) {
            this.totalRow[date] += parseInt(this.list[i][date])
          }

        }
      }
      for (let i in this.rateRow) {
        if(i === 'type') {
          continue
        }
        if(this.lastYearRow[i] === 0) {
          this.rateRow[i] = '-'
        } else {
          this.rateRow[i] = parseInt((this.totalRow[i] - this.lastYearRow[i])/this.lastYearRow[i]*100)
        }

      }

    }
  }
}
</script>

<style scoped lang="scss">
.title-wrapper {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  margin-top: 20px;
  font-size: 18px;
  font-weight: 600;
  height: 32px;
  line-height: 32px;
  vertical-align: top;
  span {
    display: inline-block;
    font-size: 14px;
    font-weight: normal;
    color: #606266;
  }
  .is-change-wrapper {
    font-size: 12px;
    height: 27px;
    background: #DFE7F2;
    border-radius: 20px;
    line-height: 27px;
    padding: 0 10px;
  }
}
.save-btn {
  float: right;
}
.table-wrapper {
  margin-top: 20px;
  padding: 0 20px;
}
.line {
  padding: 0 20px;
  height: 1px;
  background: #DCDFE6;
  margin-top: 20px;
}
.charts-wrapper {
  height: 289px;
  padding: 0 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.custom-table-n {
  /deep/ .total-row {
    font-weight: 600;
    background: #F5F7FA;
  }
}
</style>