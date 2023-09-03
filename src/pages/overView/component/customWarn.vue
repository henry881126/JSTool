<template>
  <div :class="isShow ? 'class-show' : 'class-hide'">
    <div class="box-card">
      <div class="title">大客户商机/预警</div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="card border-grey risk-customer"
               @click="openValueList"
               v-trace="{title:'总览-大客户商机/预警-商机客户'}">
            <div class="card-grey">
              <!-- {{ opportunityAndWarningData.opportunity }} -->
              {{opportunityNum}}
            </div>
            <p>商机客户(个)</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="card border-yellow risk-customer"
               @click="openRiskCustomerList"
               v-trace="{title:'总览-大客户商机/预警-风险客户'}">
            <div class="card-yellow">{{ opportunityAndWarningData.risk }}</div>
            <p>风险客户(个)</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { log } from 'mathjs';
import api from '../../../http/api'
export default {
  name: "CustomWarn",
  data () {
    return {
      companyCode: "",
      opportunityNum: 0
    };
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    opportunityAndWarningData: {
      type: Object
    },
    curCompany: {
      type: String
    }
  },
  watch: {
    curCompany: {
      immediate: true,
      handler (val) {
        return val;
      },
      deep: true
    }
  },
  mounted () {
    let curComCode = this.$store.getters.curCom
    console.log(curComCode)
    let params = {
      orgCode: curComCode,
      // orgCode:'5031932',
      pageNum: 1,
      pageSize: 10,
      queryType: 'recognize_value'
    }
    api.getValueList.getList(params).then(
      res => {
        if (res) {
          this.opportunityNum = res.total
        }
      }
    )
  },
  methods: {
    openRiskCustomerList () {
      //跳转风险客户列表
      this.$router.push({
        path: "/customerRiskAnalysis",
        query: {
          companyCode: this.curCompany,
          riskCustomerNumber: this.opportunityAndWarningData.risk
        }
      });
    },
    openValueList () {
      //跳转价值列表
      this.$router.push({
        path: "/valueList",
      });
    },
  }
};
</script>

<style lang="scss" scoped>
@import "./common";
.class-show {
  .icon-top-round {
    border-radius: 20px;
    background: $greenColor;
    height: 20px;
    width: 20px;
    line-height: 20px;
  }
  .card-bg-yellow {
    background: #ff545d;
  }
  .card-bg-grey {
    background: #33b27d;
  }
  .border-grey {
    border: 1px solid rgba(66, 74, 172, 0.46);
  }

  .border-yellow {
    border: 1px solid rgba(255, 124, 37, 0.41);
  }
  .risk-customer {
    cursor: pointer;
  }

  @media screen and (min-width: 1580px) {
    .box-card {
      height: 128px;
      background: #ffffff;
      padding: 14px 30px;
      border-radius: 12px;
    }
    .title {
      font-weight: 500;
      color: #3f5896;
      line-height: 28px;
      margin-bottom: 6px;
      font-size: 20px;
    }
    .card {
      border-radius: 20px;
      padding: 3px 24px;
      height: 92px;
    }
    .card-grey {
      margin: 6px 0;
      color: #4850b0;
      font-size: 35px;
      font-weight: bold;
    }
    .card-yellow {
      margin: 6px 0;
      color: #ff7a20;
      font-size: 35px;
      font-weight: bold;
    }
    p {
      margin: 3px 0;
      font-size: 16px;
      font-weight: 400;
      color: #5d7096;
    }
    .color-yellow {
      color: #ff545d;
      font-size: 14px;
      font-weight: 600;
    }
    .color-green {
      font-size: 14px;
      font-weight: 600;
      color: #33b27d;
    }
  }
  @media screen and (max-width: 1580px) {
    .box-card {
      height: 117px;
      background: #ffffff;
      padding: 9px 20px;
      border-radius: 9px;
      box-sizing: border-box;
    }
    .title {
      font-weight: 500;
      color: #3f5896;
      line-height: 22px;
      margin-bottom: 5px;
      font-size: 16px;
    }
    .card {
      border-radius: 9px;
      padding: 4px 18px;
      height: 63px;
    }
    .card-grey {
      margin: 5px 0;
      color: #4850b0;
      font-size: 26px;
      font-weight: bold;
    }
    .card-yellow {
      margin: 5px 0;
      color: #ff7a20;
      font-size: 26px;
      font-weight: bold;
    }
    p {
      margin: 0;
      font-size: 14px;
      font-weight: 400;
      color: #5d7096;
    }
    .color-yellow {
      font-size: 14px;
      font-weight: 600;
    }
    .color-green {
      font-size: 14px;
      font-weight: 600;
    }
  }
}
.class-hide {
  //客户投诉模块隐藏
  .icon-top-round {
    border-radius: 20px;
    background: $greenColor;
    height: 20px;
    width: 20px;
    line-height: 20px;
  }
  .card-bg-yellow {
    background: rgba(255, 124, 37, 0.41);
  }
  .card-bg-grey {
    background: rgba(66, 74, 172, 0.46);
  }
  .border-grey {
    border: 1px solid rgba(66, 74, 172, 0.46);
  }

  .border-yellow {
    border: 1px solid rgba(255, 124, 37, 0.41);
  }
  .risk-customer {
    cursor: pointer;
  }

  @media screen and (min-width: 1580px) {
    .box-card {
      height: 198px;
      background: #ffffff;
      padding: 14px 30px 20px 30px;
      border-radius: 12px;
    }
    .title {
      font-weight: 500;
      color: #3f5896;
      line-height: 28px;
      margin-bottom: 14px;
      font-size: 20px;
    }
    .card {
      border-radius: 20px;
      padding: 23px 24px;
      height: 109px;
    }
    .card-grey {
      color: #4850b0;
      font-size: 35px;
      font-weight: bold;
      margin: 10px 0;
    }
    .card-yellow {
      color: #ff7a20;
      font-size: 35px;
      font-weight: bold;
      margin: 10px 0;
    }
    p {
      font-size: 16px;
      font-weight: 400;
      color: #5d7096;
    }
    .color-yellow {
      color: rgba(255, 124, 37, 0.41);
      font-size: 14px;
      font-weight: 600;
    }
    .color-green {
      font-size: 14px;
      font-weight: 600;
    }
  }
  @media screen and (max-width: 1580px) {
    .box-card {
      height: 174px;
      background: #ffffff;
      padding: 9px 21px 16px 23px;
      border-radius: 9px;
      box-sizing: border-box;
    }
    .title {
      font-weight: 500;
      color: #3f5896;
      line-height: 22px;
      margin-bottom: 11px;
      font-size: 16px;
    }
    .card {
      border-radius: 20px;
      padding: 18px 18px 20px 18px;
      height: 78px;
    }
    .card-grey {
      color: #4850b0;
      font-size: 26px;
      font-weight: bold;
      margin: 8px 0;
    }
    .card-yellow {
      color: #ff7a20;
      font-size: 26px;
      font-weight: bold;
      margin: 8px 0;
    }
    p {
      margin: 5px 0;
      font-size: 14px;
      font-weight: 400;
      color: #5d7096;
    }
    .color-yellow {
      color: #ff7a20;
      font-size: 14px;
      font-weight: 600;
    }
    .color-green {
      font-size: 14px;
      font-weight: 600;
    }
  }
}
</style>
