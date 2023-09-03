export default {
  methods: {
    echartConfig(params) {
      let percentComplete = this.detailData.percentComplete;
      let percentNoComplete = 0;
      if (percentComplete > 100) {
        percentComplete = 100;
      } else {
        percentNoComplete = 100 - percentComplete;
      }
      return {
        title: {
          text: "完成\n\n" + params.percent,
          left: "center",
          top: "33%",
          padding: [18, 10],
          textStyle: {
            color: "#2F5DBB",
            align: "center",
            fontSize: this.sizeFlag ? "14" : "12",
          },
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            itemStyle: {
              normal: {
                color: "#fff",
              },
            },
            name: "",
            type: "pie",
            selectedMode: "single",
            radius: [0, "31%"],
            label: {
              show: false,
            },
            hoverAnimation: false,
            selectedOffset: 0,
            labelLine: {
              show: false,
            },
            data: [{ value: 0, name: "完成", tooltip: { trigger: "none" } }],
          },
          {
            name: "访问来源",
            type: "pie",
            selectedMode: "single",
            labelLine: {
              // 图形外文字线
              normal: {
                length: this.sizeFlag ? 15 : 10,
                length2: 0,
                lineStyle: {
                  color: "#28B1C7",
                },
              },
            },
            label: {
              opacity: 1,
              normal: {
                formatter: function(params) {
                  return params.name;
                },
                color: "#ffffff",
              },
            },
            radius: ["50%", "50%"],
            selectedOffset: 0,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                color: "#3260a0",
              },
            },
            data: [
              {
                value: 0,
                name: "第一季度\n\n" + (this.detailData.q1Targets || 0),
                tooltip: { trigger: "none" },
              },
              {
                value: 0,
                name: "第二季度\n\n" + (this.detailData.q2Targets || 0),
                tooltip: { trigger: "none" },
              },
              {
                value: 0,
                name: "第三季度\n\n" + (this.detailData.q3Targets || 0),
                tooltip: { trigger: "none" },
              },
              {
                value: 0,
                name: "第四季度\n\n" + (this.detailData.q4Targets || 0),
                tooltip: { trigger: "none" },
              },
            ],
          },
          {
            name: "完成率",
            type: "pie",
            selectedMode: "single",
            selectedOffset: 0,
            labelLine: {
              // 图形外文字线
              normal: {
                length: this.sizeFlag ? 15 : 10,
                length2: 0,
                lineStyle: {
                  color: "#28B1C7",
                },
              },
            },
            label: {
              show: false,
              // normal: {
              //     formatter: function(params) {
              //         return params.name + '\n\n' + params.value
              //     },
              //     color: '#ffffff'
              // },
            },
            radius: ["30%", "50%"],
            data: [
              {
                value: percentComplete / 100,
                name: "完成",
                tooltip: {
                  trigger: "item",
                  formatter: "{b} : " + this.detailData.percentComplete + "%",
                },
                itemStyle: {
                  color: "#18CE00",
                },
              },
              {
                value: percentNoComplete ? percentNoComplete / 100 : 0,
                name: "未完成",
                tooltip: {
                  trigger: "item",
                  formatter: "{b} : " + percentNoComplete + "%",
                },
                itemStyle: {
                  color: "#5578ac",
                },
              },
            ],
          },
        ],
      };
    },
  },
};
