<template>
  <div class="project-map-table">
    <div class="project-table">
      <span class="project-word">单位 : 万方</span>
      <el-button @click="exportFile"><span class="outWord">导出</span></el-button>
    </div>
    <el-table :data="tableData"
      :height="this.tableHeight"
      :show-header="true"
      :row-class-name="tableRowStyle"
      :header-cell-style="{
        'background-color': '#F2F4F8',
        'font-size': '16px',
        'font-family': 'PingFangSC-Medium, PingFang SC',
        'font-weight': 500,
        'color': '#333333',
        'border-radius':'30.5px',
        }">
      <el-table-column prop="time" label="日期"></el-table-column>
      <el-table-column prop="reportGas" label="上报量"></el-table-column>
      <el-table-column prop="gasCons" label="实际用气量"></el-table-column>
      <el-table-column prop="deviationValue" label="偏差量" sortable></el-table-column>
      <el-table-column prop="deviationValueDate" label="偏差率" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.deviationValueDate > 0">{{scope.row.deviationValueDate}}%</span>
          <span v-else-if="scope.row.deviationValueDate < 0" style="color:#D0021B">{{scope.row.deviationValueDate}}%</span>
          <span v-else>0.0%</span>
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>
<script>
import bus from "@/utils/bus";
export default {
  data() {
    return {
      screenWidth:'',
      tableHeight: 0,
      timeData:'',
    };
  },
  props:["tableData"],
  mounted(){
    
  },
  created() {
    this.screenWidth = window.screen.width;
    if(this.screenWidth > 1900){
      this.tableHeight = 303;
    }else{
      this.tableHeight = 255;
    }
    bus.$on('timeObject',(val) => {
      this.timeData = val;
    })
  },
  methods:{
      async exportFile(){
        let param = {
        "compCode": this.$route.query.compCode,
        "endDate": this.timeData.endTime,
        "partner": this.$route.query.partner,
        "startDate": this.timeData.startTime,
        "type": this.timeData.type
      }
      const res = await this.$api.exportAccuracyAnalysis(param);
      if (res.resultCode === 0) {
        let objectUrl = res.data;
        let link = document.createElement('a');
        link.href = objectUrl;
        link.setAttribute('download', '测试');
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
    } else {
        this.$message.error(res.resultMessage);
    }
      },
      tableRowStyle({row, rowIndex}) {
        if(rowIndex % 2 == 1){
           return 'odd-row';
        }
        return 'single-row'
   
  },
  }
};
</script>
<style lang="scss" scoped>
@media screen and (min-width:1900px) and (max-width:1940px) {
  .project-map-table {
    height: 423px;
  .project-table {
    .project-word {
      float: left;
      margin: 70px 0 30px 30px;
    }
    .el-button {
      float: right;
      margin-top: 60px;
      border: 1px solid #0cb2ab;
      border-radius: 25px;
      padding: 10px 18px;
    }
    .outWord {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #0cb2ab;
    }
  }
  /deep/ .el-table{
    height: 360px;
    overflow: auto;
    background-color: transparent;
    &:th{
      background-color: #F2F4F8;
      
    }
    &:tr{
      background-color: transparent;
    }
    .odd-row{
      background-color: #F2F4F8;
      td:last-child{
        border-radius:0 25.5px 25.5px 0;
        background-color: transparent;
      }
      td:first-child{
        border-radius: 25.5px 0 0 25.5px;
        background-color: transparent;
      }
    }
    .single-row{
      background-color: transparent;
      td:last-child{
        border-radius:0 25.5px 25.5px 0;
        background-color: transparent;
      }
      td:first-child{
        border-radius: 25.5px 0 0 25.5px;
        background-color: transparent;
      }
    }
    td{
      border: none;
      text-align: center;
      padding: 12px 0 16px 0;
    }
    .cell{
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #505356;
      line-height: 22px;
      text-align: center;
    }
    th{
      padding: 15px 0 10px 0;
      .cell{
        color: #333;
        height: 34px;
         line-height: 34px;
      }
    }
    
  }
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
   background-color: #F2F4F8;
  }
  /deep/ .el-table__header{
    background-color: #F2F4F8;
    border-radius: 30.5px;
  }
  /deep/ .el-table::before {
    height: 0px;
  }
}
}
@media screen and (min-width:1420px) and (max-width:1460px) {
  .project-map-table {
  height: 317px;
  .project-table {
    .project-word {
      float: left;
      margin: 25px 0 22px 5px;
      font-size: 12px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #666666;
    }
    .el-button {
      float: right;
      margin: 14px 14px 16px 0;
      border: 1px solid #0cb2ab;
      border-radius: 25px;
      padding: 6px 14px 5px 14px;
    }
    .outWord {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #0cb2ab;
    }
  }
   /deep/ .el-table{
     height: 270px;
     overflow: auto;
    background-color: transparent;
    &:th{
      background-color: #F2F4F8;
    }
    &:tr{
      background-color: transparent;
    }
    .odd-row{
      background-color: #F2F4F8;
      td:last-child{
        border-radius:0 19px 19px 0;
        background-color: transparent;
      }
      td:first-child{
        border-radius: 19px 0 0 19px;
        background-color: transparent;
      }
    }
    .single-row{
      background-color: transparent;
      td:last-child{
        border-radius:0 19px 19px 0;
        background-color: transparent;
      }
      td:first-child{
        border-radius: 19px 0 0 19px;
        background-color: transparent;
      }
    }
    td{
      border: none;
      text-align: center;
      padding: 10px 0 11px 0;
    }
    .cell{
      height: 17px;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #505356;
      line-height: 17px;
      
    }
    th{
      padding: 7px 0 3px 0;
      .cell{
        color: #333;
        text-align: center;
        height: 34px;
         line-height: 34px;
      }
    }
  }
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
   background-color: #F2F4F8;
  }
  /deep/ .el-table__header{
    background-color: #F2F4F8;
    border-radius: 30.5px;
    padding: 0;
  }
  /deep/ .el-table::before {
    height: 0px;
  }
}
}
</style>