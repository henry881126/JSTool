<template>
  <div class="purchases-deploy-step3">
    <el-form ref="form" :model="form">
      <div class="step3-item-block">
        <el-form-item label="1月：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="2月：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="3月：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="4月：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="5月：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="6月：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="7月：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="8月：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="9月：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="10月：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </div>

      <el-form-item class="step1-btn">
        <el-button type="primary" @click="step3Save">保存</el-button>
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
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      balance1: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      balance1V: "",
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
    step3Save(){
        this.$emit('step3Submit', '1')

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
.purchases-deploy-step3 {
  padding: 20px;
  .non-heating-season {
    color: #2c3e50;
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 19px;
    color: #2c3e50;
    opacity: 1;
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
    }
  }
  .step3-item-block {
    display: flex;
    flex-wrap: wrap;
    .item-list {
      width: 30%;
      margin-right: 10px;
      .deployed {
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