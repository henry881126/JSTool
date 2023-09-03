export default {
  methods: {
    echartConfig() {
      return {
        title: {
          show: false,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: function(params) {
            let res = "";
            for (let i = 0; i < params.length; i++) {
              let one = params[i];
              if (i != 0) {
                res += "<br/>";
              }
              if (one.data) {
                res += one.marker + one.seriesName + "  " + one.data + "%";
              } else {
                res += one.marker + one.seriesName + "  " + "--" + "%";
              }
            }
            return res;
          },
        },
        legend: {
          show: false,
          data: ["发展", "安装"],
        },
        grid: {
          left: "0%",
          right: "4%",
          bottom: "3%",
          top: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          show: false,
        },
        yAxis: {
          type: "category",
          axisLine: {
            show: true,
            lineStyle: {
              color: "#49CEFF",
            },
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          data: this.companyName,
        },
        series: [
          {
            name: "发展",
            type: "bar",
            data: this.installDatas,
            barWidth: 6,
            itemStyle: {
              normal: {
                color: "#45E3FF", //柱状的颜色
                borderRadius: 4,
              },
            },
          },
          {
            name: "安装",
            type: "bar",
            barWidth: 6,
            data: this.devDatas,
            itemStyle: {
              normal: {
                color: "#28FFB6", //柱状的颜色
                borderRadius: 4,
              },
            },
          },
          // {
          //   name: "已发展未安装",
          //   type: "bar",
          //   data: this.installAndDevPersents,
          //   barWidth: 6,
          //   itemStyle: {
          //     normal: {
          //       color: "#DFFF5C", //柱状的颜色
          //       borderRadius: 4,
          //     },
          //   },
          // },
        ],
      };
    },
  },
};
