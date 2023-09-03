<template>
<div class="page">
    <iframe 
        ref="iframe"
        class="iframe"
        :src="url"
    ></iframe>

</div>
    
</template>

<script>

export default {
  data() {
    return {
        companyList: [],
        loginName: '',
        url: '',
    }
  },
  methods:{
  },
  created() {
      this.loginName = this.$store.getters.loginName
      this.companyList = this.$store.getters["companyList"].map((one) => {
        return {code: one.code,resources_name:one.resources_name}
      });
      this.url = 'http://ssd-web-test.opaas.enncloud.cn:80/#/resource?' + 'user=' + this.loginName + '&scoop=' +JSON.stringify(this.companyList) 
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
