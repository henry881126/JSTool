<template>
<div class="page">
    <iframe 
            class="iframe"
            src="https://dtsg.enn.cn/#/ResourceDynamic/"
    ></iframe>
</div>
    
</template>

<script>

export default {
  data() {
    return {
      browerTime:0,
      timer:null
    }
  },
  methods:{
    getBrowerTime() {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    }
  },
  created() {
    window.zhuge.track('资源中心-进入气源市场动态页面',{'页面名称':'气源市场动态页面'})
  },  
  mounted() {
    this.getBrowerTime()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.zhuge.track('资源中心-气源市场动态页面停留时长',{'市场动态页面停留时长':this.browerTime})
  }  
}

</script>

<style scoped lang="scss">
.page{
    overflow: hidden;
    height: 100%;
    width: 100%;
}
.iframe{
    overflow: hidden;
    height: 100%;
    width: 100%;
    border: 0;
}
</style>
