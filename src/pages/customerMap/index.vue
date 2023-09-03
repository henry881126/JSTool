<template>
<div class="page">
    <iframe 
            class="iframe"
            src="https://mapsg.enn.cn/"
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
  beforeRouteEnter(to,from,next) {
    next((vm) => {
      vm.fromPath = from.path
    })
  },
  mounted() {
    // 从总览页单击分销中心链接进入资源地图页面后，进行埋点
    if(this.fromPath === '/overView') {
      window.zhuge.track('总览-点击分销中心进入资源地图页面',{'页面名称':'总览-点击分销中心进入资源地图页面'})
      // 页面加载完成后开始计时
      this.getBrowerTime()
    } else {
      this.getBrowerTime()
      window.zhuge.track('资源中心-进入资源通路客户地图页面',{'页面名称':'资源地图页面'})
    }
  },
  methods:{
    getBrowerTime() {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    if(this.fromPath === '/overView') {
      window.zhuge.track('点击分销中心进入资源地图页面',{'进入导航页资源地图页停留时长':this.browerTime})
    } else {
      window.zhuge.track('资源中心-进入资源通路客户地图页面停留时长',{'资源地图页面停留时长':this.browerTime})
    }
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
