<template>
  <div class="construction">
    <img src="../../images/construction.png" alt="" />
    <p>功能建设中</p>
  </div>
</template>

<script>
export default {
  name: "Construction",
};
</script>

<style scoped lang="scss">
.construction {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  img {
    width: 130px;
    height: 120px;
  }

  p {
    margin: 0;
    margin-left: -20px;
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #c0c4cc;
  }
}
</style>
