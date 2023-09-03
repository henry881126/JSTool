<template>
  <div class="gas-page-bg container">
    <top-menu :date-picker-show="false"
              :title="parentParams.name">
    </top-menu>
    <div class="title-wrapper">
      <div class='title-other'>
        <div>BP号：{{ parentParams.customerCode || '-' }}</div>
        <div>客户地址：{{ parentParams.address || '-' }}</div>
        <div>客户类型：{{ parentParams.typeValue || '-' }}</div>
        <div>所属行业：{{ parentParams.industryValue || '-' }}</div>
        <div>供能起始日期：{{ parentParams.startDate || '-' }}</div>
      </div>
    </div>
    <div class="right-part">
      <div class="radar-picture">
        <div class="value-view">
          <div class="value">
            <div class="danger-value">
              <span class="title">综合价值分
                <span class="num">{{ data.scoreQy }}</span>
              </span>
            </div>
          </div>
          <div class="value-bg">
            <div class="value-con">
              <!-- <div class="pic-1" id="myChart"></div> -->
              <!-- <div class="pic-2" id="myLine"></div> -->
              <div class="pic-2"
                   id="myLine"
                   :style='mylineStyle'></div>
              <div class="pic-3"
                   id="mytable">
                <template>
                  <el-table :data="tableData"
                            highlight-current-row
                            ref="singleTable"
                            :row-style="{height:'59px'}"
                            :cell-style="setCellColor"
                            :span-method="objectSpanMethod"
                            border
                            stripe
                            @row-click="handleRowClick"
                            style="width: 580px">
                    <el-table-column prop="dimensionType"
                                     align="center"
                                     width="100"
                                     label="细分维度">
                      <!-- <template slot-scope="scope">
                  <div>
                    {{ scope.row.dimensionType }}
                  </div>
                </template>   -->
                    </el-table-column>
                    <el-table-column prop="labelName"
                                     align="center"
                                     width="120"
                                     label="标签">
                    </el-table-column>
                    <el-table-column prop="labelDescription"
                                     align="center"
                                     label="触发条件">
                      <template slot-scope="scope">
                        <div v-if="scope.row.labelDescription.indexOf('n') > -1">
                          <span>{{scope.row.labelDescription.split('n')[0]}}</span>
                          <p>{{scope.row.labelDescription.split('n')[1]}}</p>
                        </div>
                        <div v-else-if="scope.row.labelDescription.indexOf('n') == -1">
                          <span>{{scope.row.labelDescription}}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="score"
                                     align="center"
                                     width="100"
                                     label="价值分贡献">
                    </el-table-column>
                  </el-table>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import topMenu from '../../components/topMenu/topMenu'
import api from '../../http/api'
export default {
  components: {
    topMenu
  },
  data () {
    return {
      aaa: 'iconbuttonyellow',
      avatar: require('../../assets/img/tx_null.jpg'),
      parentParams: Object,
      data: {
      },
      tableData: [],
      mylineStyle: {},
      colorcol1: '#000',
      colorcol2: '#000',
      colorcol3: '#000',
      colorcol4: '#000',
      fontWeight1: 'normal',
      fontWeight2: 'normal',
      fontWeight3: 'normal',
      fontWeight4: 'normal',
      bgColor1: '#fff',
      bgColor2: '#fff',
      bgColor3: '#fff',
      bgColor4: '#fff',
      valTagTypes: [],
      spanArr: [],
      maxScoreQy: null
    };
  },
  computed: {
    riskLevel () {
      return this.data.level == '高风险' ? true : false;
    },
    riskLevelCss () {
      let className = ''
      let level = ''
      if (this.data.level === '高风险') {
        className = 'riskRed'
        level = '高'
      } else if (this.data.level === '中风险') {
        className = 'riskYellow'
        level = '中'
      } else if (this.data.level === '低风险') {
        className = 'riskGreen'
        level = '低'
      } else if (this.data.level === '未评估') {
        className = 'riskGray'
        level = '未评估'
      }
      return {
        className: className,
        level: level
      }
    }
  },
  mounted () {
    // this.comOptions = this.$store.getters['companyList']
    // this.curComCode = this.$store.getters['curCom'];
    this.parentParams = this.$route.query
    this.handleGetValueTags();
  },
  methods: {
    // againTest() {
    // },
    handleRowClick (row, column, event) {
      this.colorcol1 = '#000';
      this.colorcol2 = '#000';
      this.colorcol3 = '#000';
      this.colorcol4 = '#000';
      this.fontWeight1 = 'normal';
      this.fontWeight2 = 'normal';
      this.fontWeight3 = 'normal';
      this.fontWeight4 = 'normal';
      this.bgColor1 = '#fff';
      this.bgColor2 = '#fff';
      this.bgColor3 = '#fff';
      this.bgColor4 = '#fff';
      this.$refs.singleTable.setCurrentRow(-1);
    },
    getValueDimensionTypes () { //获得价值指标维度
      // axios.getValueDimensionTypes().then(res=>{
      //   let valTagTypes = [];
      //   res.data.data.map(item=>{
      //     valTagTypes.unshift(item.name)
      //   });
      //   this.valTagTypes = valTagTypes;
      // })
    },
    lineClick (param) {
      let serindex;
      let that = this;
      this.tableData.map(function (item, index) {
        if (param.name == item.labelName) {
          serindex = index;
          if (item.dimensionType == '业务情况') {
            that.colorcol1 = '#019FE7';
            that.fontWeight1 = '600';
            that.bgColor1 = '#E3F6FF';
          } else {
            that.colorcol1 = '#000';
            that.fontWeight1 = 'normal';
            that.bgColor1 = '#fff';
          }
          if (item.dimensionType == '利润贡献') {
            that.colorcol2 = '#019FE7';
            that.fontWeight2 = '600';
            that.bgColor2 = '#E3F6FF';
          } else {
            that.colorcol2 = '#000';
            that.fontWeight2 = 'normal';
            that.bgColor2 = '#fff';
          }
          if (item.dimensionType == '客户依存度') {
            that.colorcol3 = '#019FE7';
            that.fontWeight3 = '600';
            that.bgColor3 = '#E3F6FF';
          } else {
            that.colorcol3 = '#000';
            that.fontWeight3 = 'normal';
            that.bgColor3 = '#fff';
          }
          if (item.dimensionType == '信用情况') {
            that.colorcol4 = '#019FE7';
            that.fontWeight4 = '600';
            that.bgColor4 = '#E3F6FF';
          } else {
            that.colorcol4 = '#000';
            that.fontWeight4 = 'normal';
            that.bgColor4 = '#fff';
          }
        }
      });

      this.$refs.singleTable.setCurrentRow(this.tableData[serindex]);
    },

    setCellColor ({ row, column, rowIndex, columnIndex }) {  //{row,column,rowIndex,columnIndex}
      if (row.dimensionType == "业务情况" && columnIndex == 0) {
        return { backgroundColor: this.bgColor1, color: this.colorcol1, fontWeight: this.fontWeight1 };
      }
      if (row.dimensionType == "利润贡献" && columnIndex == 0) {
        return { backgroundColor: this.bgColor2, color: this.colorcol2, fontWeight: this.fontWeight2 };
      }
      if (row.dimensionType == "客户依存度" && columnIndex == 0) {
        return { backgroundColor: this.bgColor3, color: this.colorcol3, fontWeight: this.fontWeight3 };
      }
      if (row.dimensionType == "信用情况" && columnIndex == 0) {
        return { backgroundColor: this.bgColor4, color: this.colorcol4, fontWeight: this.fontWeight4 };
      }
    },
    handleGetValueTags () {
      let params = {
        customerBp: this.$route.query.customerBp,
        orgCode: this.$route.query.orgCode,
      }
      // let params = {
      //   customerBp: '0002002922',
      //   orgCode: '10000800',
      // }
      api.getValueList.getDetail(params).then((res) => {
        if (res.data && res.data.data) {
          this.data = res.data && res.data.data;
          let valTagTypes = [];
          this.data.dimensionTypes.map(item => {
            valTagTypes.unshift(item.name)
          });
          // let height = 150 * valTagTypes.length;
          // let heightl = height+'px !important'
          // this.mylineStyle = {
          //   'height':heightl
          // }
          this.valTagTypes = valTagTypes;
          this.tableData = this.data.listQy;
          let maxnum = this.data.maxScoreQy % 10
          if (maxnum > 0) {
            this.data.maxScoreQy = this.data.maxScoreQy - maxnum + 10;
          }
          this.maxScoreQy = this.data.maxScoreQy;

          //测试合并单元格
          let contactDot = 0;
          this.tableData.forEach((item, index) => {
            if (index === 0) {
              this.spanArr.push(1)
            } else {
              if (item.dimensionType === this.tableData[index - 1].dimensionType) {
                this.spanArr[contactDot] += 1;
                this.spanArr.push(0)
              } else {
                contactDot = index
                this.spanArr.push(1)
              }
            }
          })
          //测试合并单元格
          var data = [];
          var startTime = 0;
          // var categories = ["信用情况", "业务情况", "客户依存度", "利润贡献"];
          var categories = this.valTagTypes;
          var typesColor = {
            "本企业毛利贡献": "#826AF9",
            "控股毛利贡献": "#E465FA",
            "用气时长": "#2CD9C5",
            "本企业气量贡献": "#C62928",
            "控股气量贡献": "#E64A19",
            "用气波动": "#F47C02",
            "用气均衡": "#FF9F00",
            "多业务服务": "#FBBF2D",
            "待回款": "#4CAF50",
            "超龄应收": "#7DD121"
          }
          var types = [];
          this.data.listQy.map(function (item) {
            var qyObj = {};
            qyObj.name = item.labelName;
            qyObj.color = typesColor[item.dimension];
            qyObj.score = item.score;
            qyObj.label = item.dimensionType;
            types.push(qyObj);
          })
          // Generate mock data
          categories.forEach(function (category, index) {
            var baseTime = startTime;
            for (var i = 0; i < types.length; i++) {
              var typeItem = types[i];
              if (typeItem.label == category) {
                data.push({
                  name: typeItem.name,
                  value: [
                    index,
                    baseTime,
                    baseTime + typeItem.score
                  ],
                  itemStyle: {
                    normal: {
                      color: typeItem.color,
                      label: {
                        show: false,
                        position: "top",
                        formatter: "{b}",
                        distance: 5,
                        offset: [0, 0]
                      }
                    }
                  },
                });
                baseTime += typeItem.score
              };

            }
          });
          // arr.unshift(this.data.radar[4]);
          this.drawChart(data);
          // this.drawChart(this.data.stackMap);
        }
      });
    },
    renderItem (params, api) {
      var categoryIndex = api.value(0);
      var start = api.coord([api.value(1), categoryIndex]);
      var end = api.coord([api.value(2), categoryIndex]);
      // var height = api.size([0, 1])[1] * 0.6;
      var height = 54;
      var echarts = this.$echarts
      var rectShape = echarts.graphic.clipRectByRect({
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height
      }, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
      });

      return rectShape && {
        type: 'rect',
        transition: ['shape'],
        shape: rectShape,
        style: api.style()
      };
    },
    //柱状堆叠图
    drawChart (datalist) {
      var chartDom = document.getElementById("myLine");
      var echarts = this.$echarts
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        //color:['#5470c6','#91cc75','#fac858','#ee6666','#73c0de','#3ba272','#fc8452','#9a60b4','#ea7ccc'],
        // tooltip: {
        //   trigger: "axis",
        //   backgroundColor: "#ffffff", //调节弹出框的背景颜色
        //   zIndex: 1,
        //   textStyle: {
        //     color: "#666", //设置文字颜色
        //   },
        //   axisPointer: {
        //     // 坐标轴指示器，坐标轴触发有效
        //     type: "line", // 默认为直线，可选为：'line' | 'shadow'
        //   },
        //   formatter(params){
        //     let label = `<div style='box-shadow:0px  10px 24px #999;padding:0 0 10px 0;'><div style='margin-bottom:5px;font-weight:bolder;padding:10px 20px 3px 20px;'>${params[0].name}</div>`
        //     for(let item of params) {
        //       label += `<div style='line-height:220%;padding:0 20px 0 20px;'><span>${item.marker}</span><span>${item.seriesName}</span><span style='padding-left:40px;float:right;'>${item.data}</span></div>`
        //     }
        //     return label +'</div>'
        //   },
        // },
        // legend: {
        //     data: ['高利润', '控股超高利润', '用气10年', '高用气量', '用气波动', '季节用气', '多服务', '有欠款', '气费超龄']
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          axisTick: {
            //去掉刻度
            show: false,
          },
          splitLine: {
            show: false
          },
          type: 'value',
          min: 0,
          max: this.maxScoreQy,
          interval: 10,
          axisLabel: {
            textStyle: {
              fontFamily: "PingFangSC-Regular",
              fontSize: 14,
              color: "#999999",
              letterSpacing: 0,
              textAlign: "right",
              lineHeight: 14,
              fontWeight: 400
            }
          },
          axisLine: {
            lineStyle: {
              color: "#D8D8D8"
            }
          },
        },
        yAxis: {
          axisTick: {
            //去掉刻度
            show: false,
          },
          type: 'category',
          axisLabel: {
            textStyle: {
              fontFamily: "PingFangSC-Regular",
              fontSize: 14,
              color: "#999999",
              letterSpacing: 0,
              textAlign: "right",
              lineHeight: 14,
              fontWeight: 400
            }
          },
          axisLine: {
            lineStyle: {
              color: "#D8D8D8"
            }
          },
          data: this.valTagTypes
        },
        series: [{
          type: 'custom',
          renderItem: this.renderItem,
          encode: {
            x: [1, 2],
            y: 0
          },
          data: datalist
        }]
      };

      this.autoHeight = this.valTagTypes.length * 120 + 50; // this.counts为柱状图的条数，即数据长度。
      myChart.getDom().style.height = this.autoHeight + "px";

      myChart.resize();
      option && myChart.setOption(option);
      myChart.on("mouseover", this.lineClick);
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  },
};

function returnFloat (value) {
  var value = Math.round(parseFloat(value) * 100) / 100;
  var s = value.toString().split(".");
  if (s.length == 1) {
    value = value.toString() + ".00";
    return value;
  }
  if (s.length > 1) {
    if (s[1].length < 2) {
      value = value.toString() + "0";
    }
    return value;
  }
}
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.right-part {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.radar-picture {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20px;
  width: 96%;
  margin: 40px;
}
.radar-bg {
  background: #fff;
  border-bottom-left-radius: 33px;
  border-bottom-right-radius: 33px;
}
.radar-con {
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
  box-sizing: border-box;
  padding-bottom: 30px;
}
.value {
  width: 1198px;
}
.danger-value {
  margin-left: 48px;
}
.high {
  margin-top: 8px;
  color: #ff4d4f;
  font-size: 14px;
}
.title {
  display: inline-block;
  font-size: 24px;
  color: #333333;
  font-weight: 400;
  margin-top: 25px;
}
.num {
  font-size: 24px;
  color: #333333;
  font-weight: 400;
  margin: 0 10px;
}
.access-day {
  margin-left: 76px;
  font-size: 16px;
  color: #666666;
  font-weight: 400;
  font-family: MicrosoftYaHei;
}
.res-day {
  font-family: MicrosoftYaHei;
  font-size: 16px;
  color: #666666;
  line-height: 21px;
  font-weight: 400;
  margin-left: 76px;
}
.day2 {
  font-size: 16px;
  line-height: 21px;
  font-weight: 400;
}
.pic-1 {
  width: 50%;
  height: 530px;
}
.pic-2 {
  width: 50%;
  height: 530px;
  background-color: #fff;
  z-index: 222;
}
.middle-line {
  margin: 50px 0;
  border: 1px solid #eee;
}
.riskRed,
.riskYellow,
.riskGreen,
.riskGray {
  border-radius: 30px;
  color: #fff;
  width: 130px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  padding: 0;
  color: #fff;
  margin-left: 32px;
}
.riskRed {
  background: #f56c6c;
}
.riskYellow {
  background: #e6a23c;
}
.riskGreen {
  background: #67c23a;
}
.riskGray {
  background: #909399;
}
.iconbuttonwhite,
.iconbuttonred,
.iconbuttonyellow,
.iconbuttongreen,
.iconbuttongray,
.iconbuttonwarning {
  border-radius: 2px;
  width: 78px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  padding: 0;
}
.iconbuttonwhite {
  background: rgba(153, 153, 153, 0.05);
  border: 1px solid #999999;
  color: #999999;
}
.iconbuttonred {
  background: rgba(255, 77, 79, 0.05);
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
}
.iconbuttonyellow {
  background: rgba(255, 170, 0, 0.05);
  border: 1px solid #ffaa00;
  color: #ffaa00;
}
.iconbuttongreen {
  background: rgba(82, 196, 26, 0.05);
  border: 1px solid #52c41a;
  color: #52c41a;
}
.iconbuttongray {
  background: rgba(255, 77, 79, 0.05);
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
}
.iconbuttonwarning {
  background: #ff00000d;
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
}
i.rend {
  color: #ff4d4f;
}
.rend {
  color: #ff4d4f;
}
.risk-tips {
  background: rgb(255, 241, 234);
  border: 1px solid red;
  border-radius: 50px;
  padding: 12px 20px;
  width: 400px;
  color: red;
  margin: 20px 0;
}
.risk-icon {
  padding-right: 10px;
  font-size: 20px;
}
.title-wrapper {
  display: flex;
  flex-direction: column;
}
.title-name {
  font-size: 34px;
  color: #ffffff;
  float: left;
}
.title-other {
  display: flex;
  margin: 35px 0 35px 32px;
}
.title-other div {
  margin-right: 30px;
  color: #fff;
}
.title-risk-level {
  margin: 0 0 0 32px;
  border-radius: 20px;
}
#myLine {
  margin-right: 100px;
}
.value-view {
  background: #fff;
  border-radius: 8px;
}
.value-bg {
  height: 700px;
}
.value-con {
  display: flex;
}
.danger-value {
  margin-left: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 25px;
  padding-right: 48px;
}
.title {
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 24px;
  color: #333333;
  font-weight: 400;
}
.num {
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  color: #333333;
  font-weight: 600;
}

.pic-2 {
  /* margin-top: 36px; */
  width: 491px;
  height: 600px;
  /* margin-top: 36px; */
  /* background-color: #f5f5f5; */
}
.pic-3 {
  width: 578px;
  margin-top: 30px;
  margin-left: 59px;
}

#mytable >>> .el-table_1_column_1.is-center.is-leaf {
  background-color: #f9feff !important;
}
#mytable >>> .is-leaf {
  background-color: #f9feff !important;
}
</style>
