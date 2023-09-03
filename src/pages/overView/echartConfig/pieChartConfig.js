export default {
  methods: {
    pieChartConfig() {
      return {
        title: {
          left: "center",
          top: "36%",
          padding: [15, 0],
          textStyle: {
            color: "#000",
            align: "center",
            fontSize: this.sizeFlag ? "16" : "12",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          icon: "circle",
          itemWidth: this.sizeFlag ? 14 : 12,
          itemHeight: this.sizeFlag ? 14 : 12,
          top: 10,
          data: ["PNG", "LNG", "能源贸易"],
          textStyle: {
            fontSize: this.sizeFlag ? 14 : 12,
          },
        },
        color: ["#53A8E2", "#76DDFB", "#18CE00"],
        series: [
          {
            name: "访问来源",
            type: "pie",
            selectedMode: "single",
            label: {
              normal: {
                formatter: function(params) {
                  return params.value + "%";
                },
              },
            },
            labelLine: {
              normal: {
                length: 0,
              },
            },
            radius: ["25%", "45%"],
            data: this.pieChartData,
          },
        ],
      };
    },
  },
};
