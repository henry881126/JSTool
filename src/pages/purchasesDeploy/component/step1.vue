<template>
  <div class="purchases-deploy-step1">
    <el-form ref="form" :model="form">
      <el-form-item label="公司名称：">
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
        <!-- <el-input v-model="form.name"></el-input> -->
      </el-form-item>
      <div class="step-item-block">
        <el-form-item label="基准门站价：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="可调配：" class="item-list">
           <el-select v-model="deployed" placeholder="请选择" class="deployed">
                <el-option
                v-for="item in deployedS"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select> 
          <el-input v-model="form.name" :disabled="deployed==='02'" class="deployedS-input"></el-input>
        </el-form-item>
      </div>
      <div class="step-item-block">
        <el-form-item label="偏差结算系数：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="管输费：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </div>
      <div class="step-item-block">
        <el-form-item label="冬夏供气比：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="调峰系数：" class="item-list">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </div>
      <el-form-item class="step1-btn">
        <el-button type="primary" @click="step1Next1">下一步</el-button>
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
        deployedS: [{
            value: '01',
            label: '是'
        }, {
            value: '02',
            label: '否'
        }],
        deployed:'01',
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
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

  mounted() {
  },

  methods: {
      step1Next1(){
          console.log(8888)
        this.$emit("step1Next")
        console.log(66)
      },
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
.purchases-deploy-step1 {
  padding: 20px;
  color: red;
  .lower-gas-point{
      .el-select{
          width: 100%;
      }
  }
  .step1-btn{
      text-align: right;
      .el-button{
            border-radius: 43px;
            background-color: #0FB2AB;
            border-color: #0FB2AB;
            &.el-button--default{
                background-color: #fff;
            }
      }
  }
  .el-input__inner{
    border-radius: 29px;
    background: #F6F7FA;
  }
  .step-item-block {
    display: flex;
    .item-list{
        width: 50%;
        margin-right: 10px;
        .deployed{
                 width: 79px;
                 position: absolute;
                 z-index: 2;
                 .el-input__inner{
                    padding-left: 10px;
                    background: #EDEEF4;
                    color: #495464;
                 }
                 
        }
        .deployedS-input{
            .el-input__inner{
                 padding-left: 89px;
            }
            
        }
    }
  }
}
</style>