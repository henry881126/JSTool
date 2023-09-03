<!--代销/直销/代输表格组件-->
<template>
  <div class="track-page">
    <div v-if="zxShow">
      <span class="t-tit">调压站提取跟踪</span>
      <div class="table-box">
        <el-table max-height="340" :data="tableData" style="width: 100%">
          <el-table-column prop="stationName" label="调压站" width="80">
            <template slot-scope="scope">
              <div :title="scope.row.stationName" class="t-hidden">
                <span>{{ scope.row.stationName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="瞬时提取(万m³/h)" width="81">
            <template slot-scope="scope">
              {{ scope.row.instantFlow }}
            </template>
          </el-table-column>
          <el-table-column label="日累计提取(万m³)" width="90">
            <template slot-scope="scope">
              {{ scope.row.dailyCumulativeExtract }}
            </template>
          </el-table-column>
          <el-table-column label="进站压力(MPa)">
            <template slot-scope="scope">
              {{ scope.row.enterStationPressure }}
            </template>
          </el-table-column>
          <el-table-column width="90" label="出站压力(MPa)">
            <template slot-scope="scope">
              <el-dropdown
                @command="handleCommand"
                v-if="scope.row.outStationPressure.length"
              >
                <span class="el-dropdown-link">
                  <span class="device-name" :title="scope.row.name">
                    {{ scope.row.name }}
                  </span>
                  <i class="el-icon-caret-bottom"></i>
                </span>
                <span class="device-value">
                  {{
                    scope.row.value
                      ? scope.row.value
                      : scope.row.outStationPressure[0].deviceValue
                  }}
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, i) in scope.row.outStationPressure"
                    :key="i"
                    :command="{
                      data: item,
                      scope: scope.row,
                    }"
                    >{{ item.deviceName }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-if="dsShow">
      <span class="t-tit">代输客户提取跟踪</span>
      <div class="table-box">
        <el-table max-height="340" :data="tableData" style="width: 100%">
          <el-table-column prop="customerName" label="代输客户" width="80">
            <template slot-scope="scope">
              <div :title="scope.row.customerName" class="t-hidden">
                <span>{{ scope.row.customerName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="日指定（万m³）" align="center" width="85">
            <template slot-scope="scope">
              {{ scope.row.replyVolume }}
            </template>
          </el-table-column>
          <el-table-column label="提取进度" align="center">
            <template slot-scope="scope">
              <el-progress
                v-for="(item, i) in scope.row.gasProgress"
                :key="i"
                class="el-prog"
                :text-inside="true"
                :stroke-width="16"
                :percentage="item"
                :color="changeColor"
              ></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="超欠量（万m³）" align="center" width="85">
            <template slot-scope="scope">
              {{ scope.row.overUnder }}
            </template>
          </el-table-column>
          <el-table-column label="预计超欠提" width="90">
            <template slot-scope="scope">
              {{ scope.row.expectOverdrawn + "%" }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-if="dxShow">
      <span class="t-tit">代销客户提取跟踪</span>
      <div class="table-box">
        <el-table max-height="340" :data="tableData" style="width: 100%">
          <el-table-column prop="customerName" label="代销客户" width="80">
            <template slot-scope="scope">
              <div :title="scope.row.customerName" class="t-hidden">
                <span>{{ scope.row.customerName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="日指定（万m³）" align="center" width="85">
            <template slot-scope="scope">
              {{ scope.row.replyVolume }}
            </template>
          </el-table-column>
          <el-table-column label="提取进度" align="center">
            <template slot-scope="scope">
              <el-progress
                v-for="(item, i) in scope.row.gasProgress"
                :key="i"
                class="el-prog"
                :text-inside="true"
                :stroke-width="16"
                :percentage="item"
                :color="changeColor"
              ></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="超欠量（万m³）" align="center" width="85">
            <template slot-scope="scope">
              {{ scope.row.overUnder }}
            </template>
          </el-table-column>
          <el-table-column label="预计超欠提" width="90">
            <template slot-scope="scope">
              {{ scope.row.expectOverdrawn + "%" }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  salesList,
  transList,
  directList,
} from "@/idsPages/api/gasVolumeTracking";
export default {
  data() {
    return {
      zxShow: false,
      dsShow: false,
      dxShow: true,
      tableData: [],
      custom: null,
      timer: null,
    };
  },
  props: {
    name: {
      type: String,
    },
  },
  created() {
    this._switch();
    this.timer = setInterval(this._switch, 180000);
  },
  mounted() {},
  methods: {
    // 循环判断表格展示类型（zx1/zx5:直销，ds2：代输，dx3/dx4：代销）
    _switch() {
      switch (this.name) {
        case "zx1":
          this.zxShow = true;
          this.dsShow = false;
          this.dxShow = false;
          this.getData(2);

          break;
        case "ds2":
          this.zxShow = false;
          this.dsShow = true;
          this.dxShow = false;
          this.getData();
          break;
        case "dx3":
          this.zxShow = false;
          this.dsShow = false;
          this.dxShow = true;
          this.getData("2");
          break;
        case "dx4":
          this.zxShow = false;
          this.dsShow = false;
          this.dxShow = true;
          this.getData("1");
          break;
        case "zx5":
          this.zxShow = true;
          this.dsShow = false;
          this.dxShow = false;
          this.getData(1);
          break;
      }
    },
    _format(value) {
      return () => {
        return value + "%";
      };
    },
    changeColor(number) {
      if (number <= 100) {
        return "#47A87D";
      } else {
        return "#F5222D";
      }
    },
    // 接口调用获取列表数据
    getData(type) {
      if (this.zxShow) {
        directList({ directSalesType: type }).then((res) => {
          this.tableData = res.data;
          this.tableData.forEach((item) => {
            if (item.outStationPressure.length) {
              item.name = item.outStationPressure[0].deviceName;
            }
            if (item.outStationPressure.length) {
              item.value = item.outStationPressure[0].deviceValue;
            }
            this.changeStr(item);
          });
        });
      }
      if (this.dsShow) {
        transList().then((res) => {
          this.tableData = res.data;
          this.tableData.forEach((item) => {
            this.changeStr(item);
          });
        });
      }
      if (this.dxShow) {
        salesList({ agentSalesType: type }).then((res) => {
          this.tableData = res.data;
          this.tableData.forEach((item) => {
            this.changeStr(item);
          });
        });
      }
    },
    // 空串转换成"-"
    changeStr(data) {
      for (let i in data) {
        if (data[i] === "") {
          data[i] = "-";
        }
      }
    },
    // 下拉菜单切换触发方法
    handleCommand(command) {
      command.scope.name = command.data.deviceName;
      command.scope.value = command.data.deviceValue;
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss">
.track-page {
  height: 100%;
  .el-progress-bar__innerText {
    color: #303133;
    display: block;
    width: 60px;
    text-align: center;
    margin: 0;
    line-height: 16px;
  }
  .el-progress-bar__outer,
  .el-progress-bar__inner {
    border-radius: 0;
  }
  .el-table td,
  .el-table th {
    padding: 7px 0;
    color: #303133;
  }
}
</style>
<style lang="scss" scoped>
.track-page {
  background: #fff;
  .t-tit {
    color: #333333;
    display: inline-block;
    margin-top: 4px;
    margin-left: 8px;
    margin: 4px 0px 7px 8px;
    font-weight: 600;
    &::before {
      content: "";
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: 10px;
      background: #47a87d;
    }
  }
  .table-box {
    padding: 0 8px;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
    color: #303133;
    .el-prog {
      margin: 1px 0;
      text-align: center;
    }
    .device-name {
      display: inline-block;
      width: 50px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 12px;
      font-size: 12px;
      color: #303133;
    }
    .device-value {
      font-size: 14px;
      color: #303133;
    }
    .t-hidden {
      width: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
