<template>
  <div class="box-card">
    <div class="title">客户投诉处理率</div>
    <el-row>
      <el-col :span="13">
        <span class="complete-percent"
          >客户投诉数(次)<span class="font-large font-bolder">{{
            customerComlainData.dccl_lv
          }}</span></span
        >
      </el-col>
      <el-col :span="11">
        <span class="complete-percent"
          >处理完成率(%)<span class="font-large font-bolder">{{
            customerComlainData.zl_tsl
          }}</span></span
        >
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "CustomerComplaint",
  props: {
    customerComlainData: Object
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import "./common";
@media screen and (min-width: 1580px) {
  .box-card {
    height: 68px;
    background: #ffffff;
    padding: 14px 30px;
    border-radius: 12px;
    margin-top: 20px;
  }
  .title {
    font-weight: 500;
    color: #3f5896;
    line-height: 28px;
    margin-bottom: 14px;
    font-size: 20px;
  }
  .font-large {
    font-size: 24px;
    padding-left: 4px;
  }
  .complete-percent {
    font-size: 16px;
    font-weight: 400;
    color: #5d7096;
    line-height: 24px;
    width: 205px;
  }
}
@media screen and (max-width: 1580px) {
  .box-card {
    height: 73px;
    background: #ffffff;
    padding: 9px 20px;
    border-radius: 9px;
    box-sizing: border-box;
    margin-top: 15px;
  }
  .title {
    font-weight: 500;
    color: #3f5896;
    line-height: 22px;
    margin-bottom: 10px;
    font-size: 16px;
  }
  .font-large {
    font-size: 18px;
    padding-left: 4px;
  }
  .complete-percent {
    font-size: 14px;
    font-weight: 400;
    color: #5d7096;
    line-height: 20px;
  }
}
</style>
