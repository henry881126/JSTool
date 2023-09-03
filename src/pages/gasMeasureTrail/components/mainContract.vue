<template>
  <div class="main-contract">
    <div class="contract-body">
      <div class="head-row">
        <span style="font-weight: 550">单位：万方</span>
        <el-button class="export-button" round @click="exportContract" 
          >导出</el-button
        >
      </div>
      <contractTable
        v-if="selectArea.cpmo_cop.toString() === 'true'"
        :tableData="resDataforProvince"
      />
      <custTable
        :tableData="resTableforSubsidiary"
        :conf="subsidiaryConf"
        :defaultProp="defaultProp"
        class="common-table"
        v-else
      >
      </custTable>
    </div>
  </div>
</template>

<script>
import contractTable from "./contractTable";
import custTable from "./../common/components/custTable";
export default {
  name: "",
  components: {
    contractTable,
    custTable,
  },
  props: {
    selectArea: {
      type: Object,
      require: true,
    },
    timeValue: {
      // type: String,
      require: true,
    },
  },
  watch: {
    selectArea: {
      handler(val) {
        if (val.cpmo_cop.toString() === 'true') {
          this.getContractDevitionProvinceList();
        } else {
          this.getContractDevitionSubsidiaryList();
        }
      },
    },
    timeValue: {
      immediate: true,
      handler(val) {
        if (this.selectArea.cpmo_cop.toString() === 'true') {
          this.getContractDevitionProvinceList();
        } else {
          this.getContractDevitionSubsidiaryList();
        }
      },
    },
  },
  data() {
    return {
      defaultProp:{prop: 'time', order: 'descending'},
      resTableforSubsidiary: [],
      resDataforProvince: {},
      subsidiaryConf: [
        { prop: "time", label: "日期" },
        { prop: "contractNumber", label: "合同量" },
        { prop: "gasInNumber", label: "进气量" },
        { prop: "demandPreMeasurement", label: "需求预测量" },
        { prop: "forecastGapNumber", label: "预测缺口量" },
        { prop: "contractDeviationRate", label: "合同偏差率" },
      ],
    };
  },
  computed: {},
  methods: {
    exportContract() {
      if (this.selectArea.cpmo_cop.toString() === 'true') {
        this.exportContractforProvince();
      } else {
        this.exportContractforSubsidiary();
      }
    },
    async exportContractforProvince() {
      if (!this.timeValue || this.selectArea === {}) {
        return;
      }
      const res = await this.$api.exportContractforProvince(this.timeValue,this.selectArea.code);
      if (res.resultCode === 0) {
        let objectUrl = res.data;
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", "测试");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
      } else {
        this.$message.error(res.resultMessage);
      }
    },
    async getContractDevitionProvinceList() {
      if (!this.timeValue || this.selectArea  === {}) {
        return;
      }
      const res = await this.$api.getContractDevitionProvinceList(
        this.timeValue,
        this.selectArea.code
      );
      
      if (res.resultCode === 0) {
        if (res.data) {    
          res.data.dataList =res.data.dataList.map(one=> {
            Object.keys(one).map(key=> {
              if(key.match(/^contractDeviationRate*/gi)) {
                one[key] = `${one[key]}%`
              } 
              if (!one[key] ) {
                one[key]='-'
              }
              // return one
            });
            return one
          });
          this.resDataforProvince = res.data;
          
        }
      } else {
        this.$message.error(res.resultMessage);
      }
    },
    async exportContractforSubsidiary() {
      if (!this.timeValue) {
        return;
      }
      const res = await this.$api.exportContractforSubsidiary(
        this.selectArea.code,
        this.timeValue
      );
      if (res.resultCode === 0) {
        let objectUrl = res.data;
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download1", "测试");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
      } else {
        this.$message.error(res.resultMessage);
      }
    },
    async getContractDevitionSubsidiaryList() {
      if (!this.timeValue) {
        return;
      }
      const res = await this.$api.getContractDevitionSubsidiaryList(
        this.selectArea.code,
        this.timeValue
      );
      if (res.resultCode === 0) {
        if (res.data) {
          let dateDataALLMap = [];
          let sumInfo = {
            time: '总计',
            contractNumber:res.data.statisticsList[0].contractNumber,
            gasInNumber:res.data.statisticsList[0].gasInNumber,
            demandPreMeasurement:res.data.statisticsList[0].demandPreMeasurement,
            forecastGapNumber:res.data.statisticsList[0].forecastGapNumber,
            contractDeviationRate:res.data.statisticsList[0].contractDeviationRate,
          }
          dateDataALLMap.push(sumInfo);
          
          for (let key in res.data.dateDataALLMap) {
            dateDataALLMap.push(res.data.dateDataALLMap[key][0]);
          }
          dateDataALLMap =dateDataALLMap.map(one=> {
            Object.keys(one).map(key=> {
              if(key.match(/^contractDeviationRate*/gi)) {
                one[key] = `${one[key]}%`
              } 
              if (!one[key] ) {
                one[key]='-'
              }
            });
            return one
          });
          this.resTableforSubsidiary = dateDataALLMap;
        }
      } else {
        this.$message.error(res.resultMessage);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
@import "./../scss/main-contract.scss";
</style>