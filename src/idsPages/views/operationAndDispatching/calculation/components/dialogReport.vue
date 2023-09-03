<!-- 输配测算门站、管网、管网末端仿真结果-曲线图弹窗-->
<template>
  <div class="line-box">
    <el-dialog
        class="custom-dialog-n"
      width="1200px"
      title="输配能力测算报告"
      :visible.sync="showRepo"
      :before-close="close"
    >
      <div class="table-con">
        <el-table :data="stationC.stationInfoList" style="width: 100%">
          <el-table-column prop="name" label="场站" width="180">
            <template slot-scope="scope">
              {{ scope.row.name!==null?
                scope.row.name :'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="dailyIn" label="日提取总量(万m³)" width="180">
            <template slot-scope="scope">
              {{ scope.row.dailyIn!==null?
                scope.row.dailyIn.toFixed(3) :'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="maxInstantOut" label="最大下气瞬时流量(万m³/h)">
            <template slot-scope="scope">
              {{ scope.row.maxInstantOut!==null?
                scope.row.maxInstantOut.toFixed(3) :'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="upLimit" label="最大输配能力(万m³)" width="180">
            <template slot-scope="scope">
              {{ scope.row.upLimit!==null?
                scope.row.upLimit.toFixed(3) :'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="dailyOut" label="当日输配能力(万m³)" width="180">
            <template slot-scope="scope">
                <span :style="scope.row.isWarn==='1'?'color:red':'color:#000'">
              {{ scope.row.dailyOut!==null?
                scope.row.dailyOut.toFixed(3) :'-'}}
                </span>
            </template>
          </el-table-column>
          <el-table-column prop="freeSpace" label="剩余输配能力(万m³)">
            <template slot-scope="scope">
                <span :style="scope.row.isWarn==='1'?'color:red':'color:#000'">
              {{ scope.row.freeSpace!==null?
                scope.row.freeSpace.toFixed(3) :'-'}}
                </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-con">
        <el-table :data="pipeC.pipeInfoList" style="width: 100%">
          <el-table-column prop="name" label="管段" width="180">
            <template slot-scope="scope">
              {{ scope.row.name!==null?
                scope.row.name :'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="remains" label="管段管存(万m³)" width="180">
            <template slot-scope="scope">
              {{ scope.row.remains!==null?
                scope.row.remains.toFixed(3) :'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="upLimit" label="输配能力上限(万m³)">
            <template slot-scope="scope">
              {{ scope.row.upLimit!==null?
                scope.row.upLimit.toFixed(3) :'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="dailyFlow" label="当日输配能力(万m³)" width="180">
            <template slot-scope="scope">
                <span :style="scope.row.isWarn==='1'?'color:red':'color:#000'">
              {{ scope.row.dailyFlow!==null?
                scope.row.dailyFlow.toFixed(3) :'-'}}
                </span>
            </template>
          </el-table-column>
          <el-table-column prop="freeSpace" label="剩余输配能力(万m³)" width="180">
            <template slot-scope="scope">
                <span :style="scope.row.isWarn==='1'?'color:red':'color:#000'">
              {{ scope.row.freeSpace!==null?
                scope.row.freeSpace.toFixed(3) :'-'}}
                  </span>
            </template>
          </el-table-column>
          <el-table-column prop="percent" label="输配能力占比(%)">
            <template slot-scope="scope">
                <span :style="scope.row.isWarn==='1'?'color:red':'color:#000'">
              {{ scope.row.percent!==null?
                scope.row.percent :'-'}}
                </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-con">
        <el-table :data="endCustomerC.endInfoList" style="width: 100%">
          <el-table-column prop="name" label="管网末端">
          </el-table-column>
          <el-table-column prop="lowerLimit" label="最小压力需求(MPa)">
            <template slot-scope="scope">
              {{ scope.row.lowerLimit!==null?
                scope.row.lowerLimit.toFixed(3) :'-'}}
            </template>
          </el-table-column>
          <el-table-column label="压力变化范围(MPa)">
            <template slot-scope="scope">
              <span :style="scope.row.isWarn==='1'?'color:red':'color:#000'">
              {{ scope.row.minimumPressure!==null&&scope.row.maximumPressure!==null?
                scope.row.minimumPressure.toFixed(3) + '~' + scope.row.maximumPressure.toFixed(3):'-'}}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="exportList" round>导出报表</el-button>
        <el-button @click="close" round>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getStatisticsDetail } from '@/idsPages/api/calculation.js'
import { getStatisticsExportReport } from '../../../../api/calculate'
import { downloadFile } from '../../../../utils/download'
import { mapState } from "vuex";
export default {
  name: "dialogReport",
  props: {
    showRepo: {
      type: Boolean,
      default: false,
    },
    dataType: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapState({
      planId: (state) => state.calculation.planId,
      version: (state) => state.calculation.version,
    }),
  },
  data() {
    return {
      stationC: {},
      pipeC: {},
      endCustomerC: {}
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    close() {
      this.$emit("update:showRepo", false);
    },
    getData() {
      const params = {
        planId: this.planId,
        version: this.version,
      }
      getStatisticsDetail(params).then(res => {
        if (res.resultCode === 0) {
          const {endCustomerC, pipeC, stationC} = res.data
          stationC.totalInfo.name = '全部场站合计'
          stationC.stationInfoList.unshift(stationC.totalInfo)

          pipeC.totalInfo.name = '全部管段合计'
          pipeC.pipeInfoList.unshift(pipeC.totalInfo)
          this.stationC = stationC
          this.pipeC = pipeC
          this.endCustomerC = endCustomerC
        }
      })
    },
    exportList(){
      const params = {
        planId: this.planId,
        version: this.version,
      }
      getStatisticsExportReport(params).then(res=>{
        downloadFile(res,'输配能力测算','.xls')
      })
    }
  }
}
</script>
<style scoped>
::v-deep .el-dialog .el-dialog__header .el-dialog__title {
  color: #333333;
}
::v-deep .el-dialog__body {
  padding: 0 20px 20px 20px;
}
.line-box {
  width: 100%;
  height: 572px;
}
.table-con {
  padding: 10px;
  margin-bottom: 12px;
  border: solid 1px #e8e8e8;
}
.dialog-footer{
  text-align: center;
}
</style>
