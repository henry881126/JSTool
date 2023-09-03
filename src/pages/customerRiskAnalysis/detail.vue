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
        <div :class="[title-risk-level,riskLevelCss.className]">风险等级：{{ riskLevelCss.level}}</div>
      </div>       
      <div class="right-part">
        <div class="radar-picture">
          <div class="value">
            <div class="danger-value">
              <span class="title"
                >客户综合风险
                <span class="num">{{ data.score }}</span>
              </span>
              <el-button
                type="danger"
                v-if="data.level == '高风险'"
                class="iconbuttonred"
                :icon="data.isRemind ? 'el-icon-warning' : null"
                >{{ data.level }}</el-button
              >
              <el-button
                type="danger"
                v-else-if="data.level == '中风险'"
                class="iconbuttonyellow"
                :icon="data.isRemind ? 'el-icon-warning' : null"
                >{{ data.level }}</el-button
              >
              <el-button
                type="danger"
                v-else-if="data.level == '低风险'"
                class="iconbuttongreen"
                :icon="data.isRemind ? 'el-icon-warning' : null"
                >{{ data.level }}</el-button
              >
              <el-button
                type="danger"
                v-else-if="data.level == '未评估'"
                class="iconbuttongray"
                :icon="data.isRemind ? 'el-icon-warning' : null"
                >{{ data.level }}</el-button
              >
              <span class="access-day"
                >评估日期:
                <span>{{ data.assessDate }}</span>
              </span>
              <span class="res-day"
                >评估有效期:
                <span class="day2"
                  ><span v-if="data.isOverLimit">超期</span>
                  <span v-if="data.isRemind" class="rend">{{ data.leftDays }}天</span>
                  <span v-else>{{ data.leftDays }}天</span>
                  </span
                >
                <i v-if="data.isOverLimit" class="el-icon-warning rend"></i>
              </span>
              <div class="risk-tips" v-if='riskLevel'><span class='el-icon-warning-outline risk-icon'></span> 客户存在代输直供高风险，需重点关注</div>
            </div>
          </div>
          <div class="radar-bg">
            <div class="radar-con">
              <div class="pic-1" id="myChart"></div>
              <div class='middle-line'></div>
              <div class="pic-2" id="myLine"></div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import axios from 'axios'
import topMenu from '../../components/topMenu/topMenu'

export default {
  components: {
    topMenu
  },
  data() {
    return {
      aaa:'iconbuttonyellow',
      data: {},
      avatar:require('../../assets/img/tx_null.jpg'),
      parentParams:Object,
    };
  },
  computed:{
    riskLevel() {
      return this.data.level == '高风险' ? true : false;  
    },
    riskLevelCss() {
      let className = ''
      let level = ''
      if(this.data.level === '高风险') {
        className = 'riskRed'
        level = '高'
      }else if(this.data.level === '中风险') {
        className = 'riskYellow'
        level = '中'
      }else if(this.data.level === '低风险') {
        className = 'riskGreen'
        level = '低'
      }else if(this.data.level === '未评估') {
        className = 'riskGray'
        level = '未评估'
      }
      return {
        className:className,
        level:level
      }
    }
  },
  mounted() {
    // this.comOptions = this.$store.getters['companyList']
    // this.curComCode = this.$store.getters['curCom'];
    console.log('parent params',this.$route.params)
    this.parentParams = this.$route.params
    this.handleGetRiskAssesstip();
  },
  methods: {
    // curComChangeHandler: function (curCom) {
    //   this.curCom = curCom
    //   this.$store.commit('SET_CUR_COM', curCom)
    //   for (let v of this.comOptions) {
    //     if(v.code === curCom) {
    //       this.$store.commit('SET_CUR_COM_NAME', v.resources_name)
    //     }
    //   }
    // },    
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        this.$router.push("/login");
      });
    },
    againTest() {
      this.$router.push("/wenjuan");
    },
    handleGetRiskAssesstip() {
      let params = this.$route.params
      axios.get('/fxpgcenter/risk/assesstip',{
        params
      }).then((res) => {
        console.log('chart',res);
        this.data = res.data.data;
        let arr = [];
        this.data.radar.map((item,index)=>{
          if(index!==4){
            arr.push(item)
          }
        })
        arr.unshift(this.data.radar[4]);
        this.drawLine(arr);
        this.drawChart(this.data.stackMap);        
      })
    },
    //雷达图
    drawLine(list) {
      console.log('radar',list)
      var chartDom = document.getElementById("myChart");
      // var myChart = echarts.init(chartDom);
      var myChart = this.$echarts.init(chartDom);
      var option;

      option = {
        color: ["#826AF9"],
        // backgroundColor:['rgba(104,78,237,0.30)'],
        radar: [
          {
            indicator: [
              { text: "客户综合风险",max: 6, },
              { text: "代输直供风险",max: 6,  },
              { text: "专线直供风险",max: 6,  },
              { text: "其他能源替代风险",max: 6,  },
              { text: "LNG点供风险" ,max: 6, },
            ],
            center: ["45%", "55%"],
            radius: 170,
            startAngle: 90,
            splitNumber: 3,
            shape: "circle",
            name: {
              formatter: "{value}",
              textStyle: {
                color: "#999",
                fontSize: 16,
              },
            },
            splitArea: {
              areaStyle: {
                color: ["#ffd09d","#ffba8a", "#ff8f8f"],                
                shadowColor: "rgba(0, 0, 0, 0.2)",
                // shadowBlur: 10,
              },
            },
            axisLine: {
              lineStyle: {
                color: "rgba(211, 253, 250, 0.8)",
              },
            },
          },
        ],
        series: [
          {
            name: "雷达图",
            type: "radar",
            symobl:'rect',
            emphasis: {
              lineStyle: {
                width: 4,
              },
            },
            data: [
              {
                value: list,
                name: "本客户风险值",
                areaStyle: {
                  color: "rgba(100, 100, 100, 0.6)",
                },
              },
            ],
          },
        ],
        tooltip:{
          trigger:'item',
          backgroundColor:'#ffffff',
          formatter:function(params) {
            let indicator = [
             "客户综合风险",
             "代输直供风险",
             "专线直供风险",
             "其他能源替代风险",
             "LNG点供风险" 
            ]
             
            let values = params.value
            let labels = `<div style='margin-bottom:5px;font-weight:bolder;'>${params.name}</div>`
            for(let i in values) {
              labels += `<div style='line-height:220%;'><span>${params.marker}</span><span>${indicator[i]}</span><span style='padding-left:40px;float:right;'>${returnFloat(values[i])}</span></div>`
            }
            return labels
          },
          backgroundColor:'#ffffff',
          borderColor:"#ffffff",
          borderWidth:0
        }
      };
      myChart.clear()
      option && myChart.setOption(option);
    },
    //柱状堆叠图
    drawChart(datalist) {
      console.log('datalist',datalist)
      var chartDom = document.getElementById("myLine");
      // var myChart = echarts.init(chartDom);
      var myChart = this.$echarts.init(chartDom);
      var option;
      option = {
        color:["#ff0000","#ff0000","#ff0000","#ff0000","#ff0000"],
        tooltip: {
          trigger: "axis",
          backgroundColor: "#ffffff", //调节弹出框的背景颜色
          zIndex: 1,
          textStyle: {
            color: "#666", //设置文字颜色
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效，'line' | 'cross'
            type:"cross"
          },
          // 20200530 night add new ,format tooltip
          formatter(params){
            let label = `<div style='margin-bottom:5px;font-weight:bolder;'>${params[0].name}</div>`
            for(let item of params) {
              label += `<div style='line-height:220%;'><span>${item.marker}</span><span>${item.seriesName}</span><span style='padding-left:40px;float:right;'>${returnFloat(item.data)}</span></div>`
            }
            return label
          },
        },
        legend: {
          data: [
            datalist[0].typeCode,
            datalist[1].typeCode,
            datalist[2].typeCode,
            datalist[3].typeCode,
            datalist[4].typeCode,
          ],
          y:'bottom',
          orient: 'horizontal',
          icon:'circle',
          padding:[0,100,5,0]
        },
        grid: {
          left: "10%",
          right: "5%",
          bottom: "10%",
          containLabel: true,
          height:550,
        },
        xAxis: [
          {
            axisTick: {
              //去掉刻度
              show: false,
            },
            type: "category",
            data: [
              "代输直供风险",
              "专线直供风险",
              "其他能源替代风险",
              "LNG点供风险",
            ],
            axisLabel: {
              //设置每行字体个数的函数
              formatter: function (value) {
                var ret = ""; //拼接加\n返回的类目项
                var maxLength = 6; //每项显示文字个数
                var valLength = value.length; //X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                if (rowN > 1) {
                  //如果类目项的文字大于3,
                  for (var i = 0; i < rowN; i++) {
                    var temp = ""; //每次截取的字符串
                    var start = i * maxLength; //开始截取的位置
                    var end = start + maxLength; //结束截取的位置
                    //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + "\n";
                    ret += temp; //凭借最终的字符串
                  }
                  return ret;
                } else {
                  return value;
                }
              },

              textStyle: {
                color: "#999999",
                fontSize: 16,
                width: 96,
              },
            },
          },
        ],
        yAxis: [
          {
            axisTick: {
              //去掉刻度
              show: false,
            },
            type: "value",
            min: 0,
            max: 8,
            interval: 2,
            axisLabel: {
              formatter: function (value) {
                var texts = [];
                if (value <= 2 && value != 0) {
                  texts.push("\n\n\n\n\n\n\n\n\n\n\n低");
                } else if (value <= 4 && value != 0) {
                  texts.push("\n\n\n\n\n\n\n\n\n\n\n中");
                } else if (value <= 6 && value != 0) {
                  texts.push("\n\n\n\n\n\n\n\n\n\n\n高");
                }                
                return texts;                
              },
            },
          },
        ],
        series: [
          {
            name: datalist[0].typeCode,
            type: "bar",
            barWidth: 50,
            stack: "待输出风险",
            itemStyle: {
              normal: {
                color: "#5d779f",
              },
            },
            emphasis: {
              focus: "series",
            },
            data: datalist[0].riskTypeScores,
          },
          {
            name: datalist[1].typeCode,
            type: "bar",
            barWidth: 50,
            stack: "待输出风险",
            itemStyle: {
              normal: {
                color: "#ffae75",
              },
            },
            emphasis: {
              focus: "series",
            },
            data: datalist[1].riskTypeScores,
          },
          {
            name: datalist[2].typeCode,
            type: "bar",
            barWidth: 50,
            stack: "待输出风险",
            itemStyle: {
              normal: {
                color: "#54a0d8",
              },
            },
            emphasis: {
              focus: "series",
            },
            data: datalist[2].riskTypeScores,
          },
          {
            name: datalist[3].typeCode,
            type: "bar",
            barWidth: 50,
            stack: "待输出风险",
            itemStyle: {
              normal: {
                color: "#a89cdf",
              },
            },
            emphasis: {
              focus: "series",
            },
            data: datalist[3].riskTypeScores,
          },
          {
            name: datalist[4].typeCode,
            type: "bar",
            barWidth: 50,
            stack: "待输出风险",
            itemStyle: {
              normal: {
                color: "#fe8181",
              },
            },
            emphasis: {
              focus: "series",
            },
            data: datalist[4].riskTypeScores,
          },
        ],
      };
      option && myChart.setOption(option);
    },
  },
};

function returnFloat(value){
  var value=Math.round(parseFloat(value)*100)/100;
  var s=value.toString().split(".");
  if(s.length==1){
    value=value.toString()+".00";
    return value;
  }
  if(s.length>1){
    if(s[1].length<2){
      value=value.toString()+"0";
    }
    return value;
  }
}
</script>
<style scoped>
.container{
  display: flex;
  flex-direction: column;
}
.right-part{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.radar-picture {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20px;
  width:96%;
  margin:40px;
}
.radar-bg {
  background: #fff;
  border-bottom-left-radius: 33px;
  border-bottom-right-radius: 33px;
}
.radar-con {
  display: flex;
  justify-content: space-between;
  padding:0 50px;
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
  margin:50px 0;
  border:1px solid #eee;
}
.riskRed,
.riskYellow,
.riskGreen,
.riskGray {
  border-radius: 30px;
  color:#fff;
  width: 130px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  padding: 0;
  color:#fff;
  margin-left:32px;
}
.riskRed {
  background:#F56C6C;
}
.riskYellow {
  background:#E6A23C;
}
.riskGreen {
  background:#67C23A;
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
  background:rgb(255,241,234);
  border:1px solid red;
  border-radius: 50px;
  padding:12px 20px;
  width:400px;
  color:red;
  margin:20px 0;
}
.risk-icon {
  padding-right: 10px;
  font-size: 20px;
}
.title-wrapper {
  display: flex;
  flex-direction: column;
}
.title-name{
  font-size: 34px;
  color: #FFFFFF;
  float: left;
}
.title-other {
  display: flex;
  margin: 35px 0 35px 32px;  

}
.title-other div{
  margin-right:30px;
  color:#fff;
}
.title-risk-level {
  margin:0 0 0 32px;
  border-radius:20px;
}
</style>
