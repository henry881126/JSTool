<template>
  <div class="purchases-deploy-step2">
    <el-form ref="form" :model="form">
      <div class="non-heating-season">
          <img src="../assets/noheatingseason.png" alt="">
          非采暖季</div>
      <!-- <el-form-item label="公司名称：">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="天然气下气站点：" class="lower-gas-point">
          <el-select v-model="value" clearable placeholder="请选择">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
      </el-form-item> -->
      {{ calculateStylev }}
      <div class="step-item-block">
        <el-form-item label="时间：" class="item-list">
            <el-date-picker
                v-model="gasNoHeatingSeasonDate"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy/MM/dd"
                placeholder="选择日期时间"
                @change="NoHeatingSeasonChange"
                class="table-date"
                disabled

              >
              </el-date-picker>
          <!-- <el-input v-model="form.name"></el-input> -->
        </el-form-item>
        <el-form-item label="计量方式：" class="item-list calculate">
          <el-cascader
            :options="calculateStyle"
            v-model="calculateStylev"
            :props="{
              multiple: true,
              checkStrictly: true,
            }"
            @change="calculateStyleChange"
            collapse-tags
            ref="cascaderAddr"
            clearable
          ></el-cascader>
        </el-form-item>
      </div>
      <div class="step-select-list" v-show="iSShowStock">
        <div class="list-title">存量用户</div>
        <div class="step-item-block">
          <el-form-item label="增量销售价格：" class="item-list">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="存量销售价格：" class="item-list">
            <el-input v-model="form.name" class="deployedS-input"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="step-select-list" v-show="iSShowincrement">
        <div class="list-title">增量用户</div>
        <div class="step-item-block">
          <el-form-item label="增量销售价格：" class="item-list">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="存量销售价格：" class="item-list">
            <el-input v-model="form.name" class="deployedS-input"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="heating-season">
          <img src="../assets/heatingseason.png" alt="">
          采暖季</div>
      <div class="step-item-block">
        <el-form-item label="时间" class="item-list">
            <el-date-picker
                v-model="gasHeatingSeasonDate"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy/MM/dd"
                placeholder="选择日期时间"
                @change="HeatingSeasonChange"
                class="table-date"
                disabled

              >
              </el-date-picker>
          <!-- <el-input v-model="form.name"></el-input> -->
        </el-form-item>
        <el-form-item label="计量方式：" class="item-list calculate">
          <el-cascader
            :options="NcalculateStyle"
            v-model="NcalculateStylev"
            :props="{
              multiple: true,
              checkStrictly: true,
            }"
            @change="NocalculateStyleChange"
            collapse-tags
            ref="cascaderAddr"
            clearable
          ></el-cascader>
        </el-form-item>
      </div>
      <div class="step-select-list" v-show="iSShowresident">
        <div class="list-title">居民气量</div>
        <div class="step-item-block">
          <el-form-item label="增量销售价格：" class="item-list">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="存量销售价格：" class="item-list">
            <el-input v-model="form.name" class="deployedS-input"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="step-select-list" v-show="iSShowbalanced">
        <div class="list-title">均衡气量</div>
        <el-form-item label="非居民均衡一：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <div class="list-item-label">非居民均衡二：</div>
        <!-- <el-form-item label="" class="item-list"> -->
        <div class="step-item-block">
          <el-form-item label="" class="item-list">
            <el-cascader
              :options="balance1"
              v-model="balance1V1"
              :props="{
                multiple: true,
                checkStrictly: true,
              }"
              @change="handleChange"
              collapse-tags
              ref="cascaderAddr"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="" class="item-list">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </div>
        <div class="step-item-block">
          <el-form-item label="" class="item-list">
            <el-cascader
              :options="balance2"
              v-model="balance1V2"
              :props="{
                multiple: true,
                checkStrictly: true,
              }"
              @change="handleChange"
              collapse-tags
              ref="cascaderAddr"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="" class="item-list">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </div>
        <div class="list-item-label">调峰系数：</div>
        <div class="step-item-block">
          <el-form-item label="" class="item-list">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </div>
      </div>

      <div class="step-select-list" v-show="iSShowpeakRegulation">
        <div class="list-title">调峰气量</div>
        <div class="list-item-label">非居民调峰：</div>
        <!-- <el-form-item label="" class="item-list"> -->
        <div class="step-item-block">
          <el-form-item label="" class="item-list">
            <el-cascader
              :options="pitchPeak1"
              v-model="pitchPeakV1"
              :props="{
                multiple: true,
                checkStrictly: true,
              }"
              @change="handleChange"
              collapse-tags
              ref="cascaderAddr"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="" class="item-list">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </div>
        <div class="step-item-block">
          <el-form-item label="" class="item-list">
            <el-cascader
              :options="pitchPeak2"
              v-model="pitchPeakV2"
              :props="{
                multiple: true,
                checkStrictly: true,
              }"
              @change="handleChange"
              collapse-tags
              ref="cascaderAddr"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="" class="item-list">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </div>
        <div class="list-item-label">调峰系数：</div>
        <div class="step-item-block">
          <el-form-item label="" class="item-list">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item class="step1-btn">
        <el-button type="primary" @click="step2Submit">提交</el-button>
        <!-- <div>
           <el-button type="primary" >保存</el-button>
           <el-button>取消</el-button>
        </div> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from "/src/http/api";
import exportApi from "/src/components/export/export";
import mergeTableRow from "/src/components/mergeTableRow/reply";
export default {
  name: "reply",
  mixins: [exportApi, mergeTableRow],
  data: function () {
    return {
      dialogFormVisible: false,
      startTime: 0,
      endTime: 0,
      dialogTableVisible: false,
      calculateStylev: "",
      NcalculateStylev: "",
      gasNoHeatingSeasonDate: [], //日报表日期
      gasHeatingSeasonDate:[],//获取采暖季时间
      calculateStyle: [
        {
          value: "01",
          label: "增量气量",
        },
        {
          value: "02",
          label: "居民气量",
        },
        {
          value: "03",
          label: "均衡气量",
        },
        {
          value: "04",
          label: "存量气量",
        },
        {
          value: "05",
          label: "调峰气量",
        },
      ],
      NcalculateStyle: [
        {
          value: "01",
          label: "增量气量",
        },
        {
          value: "02",
          label: "居民气量",
        },
        {
          value: "03",
          label: "均衡气量",
        },
        {
          value: "04",
          label: "存量气量",
        },
        {
          value: "05",
          label: "调峰气量",
        },
      ],
      iSShowStock: "", //存量用户展示
      iSShowincrement: "", //增量用户展示
      iSShowresident: "", //居民气量
      iSShowbalanced: "", // 均衡气量
      iSShowpeakRegulation: "", // 调峰气量
      deployedS: [
        {
          value: "01",
          label: "是",
        },
        {
          value: "02",
          label: "否",
        },
      ],
      deployed: "01",
      balance2: [
        {
          value: "01",
          label: "1月",
        },
        {
          value: "02",
          label: "2月",
        },
        {
          value: "03",
          label: "3月",
        },
        {
          value: "04",
          label: "4月",
        },
        {
          value: "05",
          label: "5月",
        },
      ],
      balance1: [
        {
          value: "01",
          label: "1月",
        },
        {
          value: "02",
          label: "2月",
        },
        {
          value: "03",
          label: "3月",
        },
        {
          value: "04",
          label: "4月",
        },
        {
          value: "05",
          label: "5月",
        },
      ],
      pitchPeak1: [
        {
          value: "01",
          label: "1月",
        },
        {
          value: "02",
          label: "2月",
        },
        {
          value: "03",
          label: "3月",
        },
        {
          value: "04",
          label: "4月",
        },
        {
          value: "05",
          label: "5月",
        },
      ],
      pitchPeak2: [
        {
          value: "01",
          label: "1月",
        },
        {
          value: "02",
          label: "2月",
        },
        {
          value: "03",
          label: "3月",
        },
        {
          value: "04",
          label: "4月",
        },
        {
          value: "05",
          label: "5月",
        },
      ],
      pitchPeakV1:'',//调峰
      pitchPeakV2:'',//调峰2
      balance1V1: "",//均衡
      balance1V2: "",//均衡
      value: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
    };
  },

  components: {},

  created() {
    // this.gasReportDate[0] = Date.now();
    // this.gasReportDate[1] = Date.now();
    this.gasNoHeatingSeasonDate[0] = '2021/04/01';
    this.gasNoHeatingSeasonDate[1] = '2021/10/30';
    this.gasHeatingSeasonDate[0] = '2021/11/01';
    this.gasHeatingSeasonDate[1] = '2022/03/31';
    this.startTime = this.getFormatTime(Date.now());
    this.endTime = this.getFormatTime(Date.now() + 24 * 3600000);
  },

  computed: {
    curComCode: function () {
      return this.$store.getters.curCom;
    },
  },

  watch: {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if (n && o) {
        }
      },
    },
  },

  mounted() {},

  methods: {
    NoHeatingSeasonChange(){

    },
    HeatingSeasonChange(){

    },
    calculateStyleChange(val) {
      console.log(val);
      let iSShowStock = val.some((value, index) => {
        return value[0] == "04";
      });
      let iSShowincrement = val.some((value, index) => {
        return value[0] == "01";
      });
      this.iSShowStock = iSShowStock; //存量用户展示
      this.iSShowincrement = iSShowincrement; //增量用户展示
      //  console.log(changeA)
    },
    NocalculateStyleChange(val) {
      let iSShowresident = val.some((value, index) => {
        return value[0] == "02";
      });
      let iSShowbalanced = val.some((value, index) => {
        return value[0] == "03";
      });
      let iSShowpeakRegulation = val.some((value, index) => {
        return value[0] == "05";
      });
      (this.iSShowresident = iSShowresident), //居民气量
        (this.iSShowbalanced = iSShowbalanced), // 均衡气量
        (this.iSShowpeakRegulation = iSShowpeakRegulation); // 调峰气量
      //  console.log(changeA)
    },
    step2Submit() {
      this.$emit("step2Submit");
    },
    handleChange() {},
    // 管输方tab栏
    handleClickGSF(tab, event) {
      if (tab.name == "first") {
        // this.getlistPipelinePrice();
      } else if (tab.name === "second") {
        // 供应商预付费用list
        // this.pipelinePriceList();
      }
    },

    getFormatTime: function (timestamp) {
      let date = new Date(timestamp);
      let yyyy = date.getFullYear();
      let mm =
        date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return yyyy + "-" + mm + "-" + dd;
    },
    setData() {
      this.dialogFormVisible = true;
    },
  },
};
</script>


<style  lang="scss">
.purchases-deploy-step2 {
  padding: 20px;
  .calculate {
    .el-form-item__content {
      .el-cascader {
        width: 100% !important;
      }
    }
  }
  .non-heating-season {
    color: #2c3e50;
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 19px;
    color: #2c3e50;
    opacity: 1;
    img{
        width: 28px;
        height: 28px;
        vertical-align: middle;
    }
  }
  .heating-season {
    color: #2c3e50;
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 19px;
    color: #2c3e50;
    opacity: 1;
    img{
        width: 28px;
        height: 28px;
        vertical-align: middle;
    }
  }
  .lower-gas-point {
    .el-select {
      width: 100%;
    }
  }
  .step1-btn {
    text-align: right;
    .el-button {
      border-radius: 43px;
      background-color: #0fb2ab;
      border-color: #0fb2ab;
      &.el-button--default {
        background-color: #fff;
      }
    }
  }
  .el-input__inner {
    border-radius: 29px;
    background: #f6f7fa;
  }
  .step-select-list {
    .list-title {
      color: #a6a9b4;
      line-height: 40px;
    }
    .list-item-label {
      line-height: 42px;
    }
  }
  .step-item-block {
    display: flex;
    .el-cascader {
        width: 100% !important;
      }
    .calculate {
      /deep/.el-form-item__content {
        /deep/.el-cascader {
          width: 100% !important;
        }
      }
    }
    .item-list {
      width: 50%;
      margin-right: 10px;
      & .deployed {
        width: 79px;
        position: absolute;
        z-index: 2;
        .el-input__inner {
          padding-left: 10px;
          background: #e5e5e5;
          color: #495464;
        }
      }
      .deployedS-input {
        .el-input__inner {
          padding-left: 89px;
        }
      }
    }
  }
}
</style>