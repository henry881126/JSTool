<template>
  <div>
    <div class="top-card-container">
      <div class="top-card-wrapper top-card-wrapper-1">
        <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36 2L36 38C36 38.5304 35.7893 39.0391 35.4142 39.4142C35.0391 39.7893 34.5304 40 34 40L2 40C1.46956 40 0.960856 39.7893 0.585783 39.4142C0.210707 39.0391 -1.68422e-06 38.5304 -1.66103e-06 38L-8.74228e-08 2C-6.42368e-08 1.46957 0.210709 0.960857 0.585785 0.585785C0.960857 0.210712 1.46957 -1.50937e-06 2 -1.48619e-06L34 -8.74228e-08C34.5304 -6.42368e-08 35.0391 0.210714 35.4142 0.585786C35.7893 0.960859 36 1.46957 36 2ZM16 10L8 10L8 14L16 14L16 10ZM28 18L8 18L8 22L28 22L28 18ZM22 26L8 26L8 30L22 30L22 26Z" fill="#E6A23C"/>
        </svg>
        <div class="date">{{ getFormatDate(new Date(date).getTime() + 86400000, '/') }}（明日）</div>
        <div class="data">{{ threeData.tomorrow }} <span>万方</span></div>
        <div class="label">预测用气量</div>
        <svg width="65" height="66" viewBox="0 0 65 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.1" fill-rule="evenodd" clip-rule="evenodd" d="M25 0H40V66H25V0ZM0 28H15V66H0V28ZM65 18H50V66H65V18Z" fill="#E6A23C"/>
        </svg>
      </div>
      <div class="top-card-wrapper top-card-wrapper-2">
        <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 0H38C38.5304 0 39.0391 0.210714 39.4142 0.585786C39.7893 0.960859 40 1.46957 40 2V34C40 34.5304 39.7893 35.0391 39.4142 35.4142C39.0391 35.7893 38.5304 36 38 36H2C1.46957 36 0.960859 35.7893 0.585786 35.4142C0.210714 35.0391 0 34.5304 0 34V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0ZM10 20V28H14V20H10ZM18 8V28H22V8H18ZM26 14V28H30V14H26Z" fill="#67C23A"/>
        </svg>
        <div class="date">{{ getFormatDate(date, '/') }}（今日）</div>
        <div class="data">{{ threeData.today }} <span>万方</span></div>
        <div class="label">预测用气量</div>
        <svg width="65" height="66" viewBox="0 0 65 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.1" fill-rule="evenodd" clip-rule="evenodd" d="M25 0H40V66H25V0ZM0 28H15V66H0V28ZM65 18H50V66H65V18Z" fill="#67C23A"/>
        </svg>
      </div>
      <div class="top-card-wrapper top-card-wrapper-3">
        <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 3.1V25H39.9C38.898 35.106 30.37 43 20 43C8.954 43 0 34.046 0 23C0 12.63 7.894 4.102 18 3.1ZM22 0.0859985C33.106 1.04 41.958 9.894 42.914 21H22V0.0859985Z" fill="#409EFF"/>
        </svg>
        <div class="date">{{ getFormatDate(new Date(date).getTime() - 86400000, '/') }}（昨日）</div>
        <div class="data">{{ threeData.yestoday }} <span>万方</span></div>
        <div class="label">实际用气量</div>
        <svg width="65" height="66" viewBox="0 0 65 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M25 0H40V66H25V0ZM0 28H15V66H0V28ZM65 18H50V66H65V18Z" fill="#C6E2FF"/>
        </svg>
      </div>
    </div>
    <div class="m-wrapper">
      法人公司用气量 <span>(单位:万方)</span>
      <el-button size="small" type="primary" round icon="el-icon-edit" class="modify-btn" v-show="!isModify" @click="modifyData()" v-if="descData.length > 0">修正</el-button>
      <el-button size="small" type="primary" round icon="el-icon-edit" class="modify-btn" v-show="isModify" @click="saveData()">保存</el-button>
      <el-button size="small" round icon="el-icon-close" class="modify-btn" v-show="isModify" @click="resetData()">取消</el-button>
    </div>
    <div class="b-wrapper" v-if="descData.length > 0">
      <div class="b-item-wrapper" v-for="(v, i) in descData" :key="i">
        <div class="title">
          <svg width="22" height="46" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 16.5H22V18.5H0V16.5H2V1.5C2 1.23478 2.10536 0.98043 2.29289 0.792893C2.48043 0.605357 2.73478 0.5 3 0.5H13C13.2652 0.5 13.5196 0.605357 13.7071 0.792893C13.8946 0.98043 14 1.23478 14 1.5V16.5H16V6.5H19C19.2652 6.5 19.5196 6.60536 19.7071 6.79289C19.8946 6.98043 20 7.23478 20 7.5V16.5ZM6 8.5V10.5H10V8.5H6ZM6 4.5V6.5H10V4.5H6Z" fill="#C0C4CC"/>
          </svg>
          {{ v.compName }}
          <el-button size="middle" type="text" class="modify-btn" @click="seeDataDesc(v.compName, v.code)">查看</el-button>
        </div>
        <div class="b-item-flex">
          <div class="b-item">
            <div class="label">
              <svg width="12" height="21" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1.49998L12 13.5C12 13.6768 11.9298 13.8464 11.8047 13.9714C11.6797 14.0964 11.5101 14.1666 11.3333 14.1666L0.666665 14.1666C0.489854 14.1666 0.320284 14.0964 0.19526 13.9714C0.0702366 13.8464 -5.61406e-07 13.6768 -5.53678e-07 13.5L-2.91409e-08 1.49998C-2.14123e-08 1.32317 0.0702371 1.1536 0.195261 1.02857C0.320285 0.90355 0.489855 0.833312 0.666666 0.833312L11.3333 0.833313C11.5101 0.833313 11.6797 0.903551 11.8047 1.02858C11.9298 1.1536 12 1.32317 12 1.49998ZM5.33333 4.16665L2.66667 4.16665L2.66667 5.49998L5.33333 5.49998L5.33333 4.16665ZM9.33333 6.83331L2.66667 6.83331L2.66667 8.16665L9.33333 8.16665L9.33333 6.83331ZM7.33333 9.49998L2.66667 9.49998L2.66667 10.8333L7.33333 10.8333L7.33333 9.49998Z" fill="#E6A23C"/>
              </svg>
              明日预测用气量
            </div>
            <div class="data" v-show="!isModify">{{ v.tomarrowValue }}</div>
            <el-input controls-position="right" size="small" class="custom-input-number" v-show="isModify" v-model="v.tomarrowValue" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
          </div>
          <div class="b-item">
            <div class="label">
              <svg width="14" height="21" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.999674 0.5H12.9997C13.1765 0.5 13.3461 0.570238 13.4711 0.695262C13.5961 0.820286 13.6663 0.989856 13.6663 1.16667V11.8333C13.6663 12.0101 13.5961 12.1797 13.4711 12.3047C13.3461 12.4298 13.1765 12.5 12.9997 12.5H0.999674C0.822863 12.5 0.653294 12.4298 0.52827 12.3047C0.403246 12.1797 0.333008 12.0101 0.333008 11.8333V1.16667C0.333008 0.989856 0.403246 0.820286 0.52827 0.695262C0.653294 0.570238 0.822863 0.5 0.999674 0.5ZM3.66634 7.16667V9.83333H4.99967V7.16667H3.66634ZM6.33301 3.16667V9.83333H7.66634V3.16667H6.33301ZM8.99967 5.16667V9.83333H10.333V5.16667H8.99967Z" fill="#67C23A"/>
              </svg>
              今日预测用气量
            </div>
            <div class="data" v-show="!isModify">{{ v.todayValue }}</div>
            <el-input controls-position="right" size="small" class="custom-input-number" v-show="isModify" v-model="v.todayValue" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
          </div>
          <div class="b-item">
            <div class="label">
              <svg width="15" height="21" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.33301 1.86667V9.16667H13.633C13.299 12.5353 10.4563 15.1667 6.99967 15.1667C3.31767 15.1667 0.333008 12.182 0.333008 8.5C0.333008 5.04333 2.96434 2.20067 6.33301 1.86667ZM7.66634 0.862C11.3683 1.18 14.319 4.13133 14.6377 7.83333H7.66634V0.862Z" fill="#409EFF"/>
              </svg>
              昨日实际用气量
            </div>
            <div class="data">{{ v.yesterdayValue }}</div>
          </div>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <div v-else style="display: flex;">
      <div style="height: 300px;width: 200px;margin: auto;text-align: center;">
        <el-empty description="暂无数据"></el-empty>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible" width="660" class="custom-dialog-n">
      <el-table
          class="custom-table-n"
          border
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          :row-class-name="tableRowClassName"
          :data="gridData">
        <el-table-column
            property="typeName"
            align="left"
            label="分类">
        </el-table-column>
        <el-table-column
            align="right"
            label="明日预测用气量">
          <template slot-scope="scope">
            <span :style="{color: scope.row.typeName === '日环比增长率' || scope.row.typeName === '日同比增长率（周度）' ? '#F56C6C' : '#303133'}">
              {{ scope.row.tomorrow }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
            property="today"
            align="right"
            label="今日预测用气量">
        </el-table-column>
        <el-table-column
            property="yesterday"
            align="right"
            label="昨日实际用气量">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import dateFormater from "@/components/dateFormater/dateFormater";
import api from "../../../http/api";
export default {
  name: "day",
  mixins: [dateFormater],
  props: {
    date: {
      type: Date
    }
  },
  data: function () {
    return {
      isModify: false,
      dialogTableVisible: false,
      threeData: {
        yestoday: 0,
        today: 0,
        tomorrow: 0
      },
      descData: [],
      dialogTitle: '',
      gridData: []
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
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData: function () {
      let params = {
        code: this.curComCode,
        date: this.getFormatDate(this.date)
      }
      api.gasDemand.getDemandDayOfLevel3(params).then(res => {
        this.threeData.yestoday = res[0][0].yesterdayValue
        this.threeData.today = res[0][0].todayValue
        this.threeData.tomorrow = res[0][0].tomarrowValue
        res[0].splice(0, 1)
        this.descData = res[0]
      })
    },
    seeDataDesc: function (compName, code) {
      this.dialogTitle = compName
      let params = {
        code: code,
        date: this.getFormatDate(this.date)
      }
      api.gasDemand.getDemandDayDescOfLevel3(params).then(res => {
        this.gridData = res[0]
      })
      this.dialogTableVisible = true
    },
    saveData: function () {
      let list = []
      for (let v of this.descData) {
        list.push({
          "code": v.code,
          "today": parseFloat(v.todayValue),
          "tommorrow": parseFloat(v.tomarrowValue)
        })
      }
      let data = {
        "cpmo": this.curComCode,
        "cpmoUpdateVOList": list,
        "date": this.getFormatDate(this.date)
      }
      api.gasDemand.saveDataDayOfLevel3(data).then(res => {
        if(res[0]) {
          this.$message.success('法人公司用气量修改成功！')
          this.getData()
        }
      })
      this.isModify = false
    },
    modifyData: function () {
      this.isModify = true
    },
    resetData: function () {
      this.isModify = false
      this.getData()
    },
    tableRowClassName({row}) {
      if(row.typeName === '合计') {
        return 'total-row'
      }
      return '';
    }
  }
}
</script>

<style scoped lang="scss">
.top-card-container {
  width: 100%;
  height: 119px;
  margin-top: 20px;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.top-card-active-wrapper {
  border: 1px solid #47A87D;
  border-left-width: 8px;
  background: #EDF6F2;
}
.top-card-wrapper {
  width: calc(33.3% - 13px);
  height: 119px;
  background: $bgColor2;
  border-radius: 8px;
  text-align: center;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
  svg:first-child {
    position: absolute;
    top: 40px;
    left: 28px;
  }
  svg:last-child {
    position: absolute;
    bottom: 0;
    right: 20px;
  }
  .date {
    height: 20px;
    font-size: 14px;
    margin-top: 15px;
  }
  .data {
    height: 37px;
    font-size: 32px;
    font-family: DI;
    margin-top: 5px;
    line-height: 37px;
    span {
      display: inline-block;
      font-size: 14px;
      vertical-align: bottom;
      height: 21px;
      line-height: 15px;
    }
  }
  .label {
    height: 21px;
    font-size: 14px;
    margin-top: 5px;
  }
}
.top-card-wrapper-1 {
  background: #FCF6EC;
}
.top-card-wrapper-2 {
  background: #F0F9EB;
}
.top-card-wrapper-3 {
  background: #ECF5FF;
}
.m-wrapper {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  margin-top: 40px;
  font-size: 18px;
  font-weight: 600;
  height: 32px;
  line-height: 32px;
  text-indent: 5px;
  vertical-align: top;
  span {
    display: inline-block;
    font-size: 14px;
    font-weight: normal;
    color: #606266;
  }
  .modify-btn {
    float: right;
    margin-left: 10px;
  }
}
.m-wrapper:before {
  display: inline-block;
  content: '';
  width: 4px;
  height: 16px;
  background: #47A87D;
  margin-top: 8px;
  vertical-align: top;
}
.b-wrapper {
  width: 100%;
  padding-left: 20px;
  margin-top: 20px;
  box-sizing: border-box;
  height: auto;
  .clear {
    clear: both;
  }
  .b-item-wrapper {
    width: calc(50% - 23px);
    height: 161px;
    border: 1px solid $borderColor;
    border-radius: 8px;
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
    .title {
      height: 46px;
      font-size: 18px;
      line-height: 47px;
      padding-left: 20px;
      box-sizing: border-box;
      border-bottom: 1px solid $borderColor;
      vertical-align: top;
      svg {
        vertical-align: top;
      }
      .modify-btn {
        float: right;
        margin-right: 15px;
        margin-top: 3px;
      }
    }
    .b-item-flex {
      width: 100%;
      height: 114px;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .b-item {
        height: 100%;
        width: calc(33.3% - 13px);
        background: $bgColor2;
        border-radius: 4px;
        .label {
          font-size: 14px;
          height: 21px;
          line-height: 21px;
          margin-top: 10px;
          padding-left: 12px;
          box-sizing: border-box;
          vertical-align: top;
          svg {
            vertical-align: top;
          }
        }
        .data {
          height: 28px;
          line-height: 28px;
          font-size: 24px;
          font-family: DI;
          margin-top: 5px;
          text-align: center;
        }
        .custom-input-number {
          width: 96px;
          margin-top: 2px;
          margin-left: calc(50% - 48px);
        }
      }
    }
  }
}
.custom-table-n {
  /deep/ .total-row {
    background: #F5F7FA;
  }
}
</style>