<template>
  <div class="submit-page">
       <img src="../assets/success.png" alt="" />
          <div class="sub-tip">提交成功</div>
          <div class="submit-desc">
            您可以通过采购配置查看/配置您提交的供应商
          </div>
          <div class="submit-btn">
            <el-button type="primary" class="finishUser" @click="finishUser"
              >完成并启用</el-button
            >
            <el-button type="primary" @click="finished">完成</el-button>
          </div>
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
       editData1:this.editData1

    };
  },
  props: ["editData1"],
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
      finishUser() {
          console.log(this.editData1)
          let data ={
              id:''
             
          }
    //     api.purchasesDeploy.supplierUupdate(data).then((res) => {
    //     console.log(res);
    //   });
      },
    //   修改状态
      stattusSupplierUupdate(){
     
      },
    finished() {
    //   this.stepActive = 1;
    //   this.isSubmit = false;
    //   console.log(this.stepActive);
    this.$emit('successFinish')
      this.dialogFormVisibleNew = false;
    },
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
// .submit-page {
//     text-align: center;
//     padding: 36px;
//     .sub-tip {
//       font-size: 24px;
//       color: #2c3e50;
//       margin-bottom: 20px;
//     }
//     .submit-btn {
//       padding: 50px;
//       .el-button {
//         border-radius: 43px;
//         background-color: #0fb2ab;
//         border-color: #0fb2ab;
//         &.el-button--default {
//           background-color: #fff;
//         }
//       }
//       .finishUser {
//         &.el-button {
//           border-radius: 43px;
//           background-color: #ffffff;
//           border-color: #0fb2ab;
//           color: #0fb2ab;
//           &.el-button--default {
//             background-color: #fff;
//           }
//         }
//       }
//     }
//     .submit-desc {
//     }
//     .submitSuccess {
//       img {
//         width: 300px;
//         height: 172px;
//       }
//     }
//     .submitFail {
//       img{
//         width: 300px;
//         height: 172px;
//       }
//     }
//   }
// .purchases-deploy-step1 {
//   padding: 20px;
//   color: red;
//   .lower-gas-point{
//       .el-select{
//           width: 100%;
//       }
//   }
//   .step1-btn{
//       text-align: right;
//       .el-button{
//             border-radius: 43px;
//             background-color: #0FB2AB;
//             border-color: #0FB2AB;
//             &.el-button--default{
//                 background-color: #fff;
//             }
//       }
//   }
//   .el-input__inner{
//     border-radius: 29px;
//     background: #F6F7FA;
//   }
//   .step-item-block {
//     display: flex;
//     .item-list{
//         width: 50%;
//         margin-right: 10px;
//         .deployed{
//                  width: 79px;
//                  position: absolute;
//                  z-index: 2;
//                  .el-input__inner{
//                     padding-left: 10px;
//                     background: #E5E5E5;
//                     color: #495464;
//                  }
                 
//         }
//         .deployedS-input{
//             .el-input__inner{
//                  padding-left: 89px;
//             }
            
//         }
//     }
//   }
// }
</style>