<template>
  <div class="container gas-page-bg">
    <top-menu title="天然气输配(调度)智慧管理平台"></top-menu>
    <div class="page">
      <iframe :src="url" class="iframe" id="iframe"></iframe>
    </div>
  </div>
</template>

<script>
import TopMenu from '@components/topMenu/topMenu2'
import axios from 'axios'

export default {
  components: {
    TopMenu
  },
  data() {
      return {
          url:'',
          code: this.$store.getters.curCom, // 接口返回的气源code（分销code转换成气源的code）
      }
  },
  created() {
    console.log('process.env.VUE_APP_QIYUAN_URL:', process.env.VUE_APP_QIYUAN_URL)
    const curComInfo = this.$store.getters.curComInfo
    let routeStr = this.$store.getters.currentUrl || ''
    let route = routeStr.substr(routeStr.indexOf('#') + 1)
    if(curComInfo.orgLevel === 1 || curComInfo.orgLevel === 2) {
      this.convertCurComCode(curComInfo.ecode,curComInfo.orgLevel).then(res => {
        // 在分销中访问气源页面时，在url查询参数中携带fenxiaoIsShow、token、code三个参数（fenxiaoIsShow:气源管理系统根据此参数，隐藏顶部和左侧导航；token:保持登录状态；code:右上角公司编码（this.$store.getters.curCom值））
        let url = process.env.VUE_APP_QIYUAN_URL + "#/login?fenxiaoIsShow=fenxiao&token=" + this.$store.getters.qiyuanToken + "&code="+this.code+"&name="+this.$store.getters.userInfo.name+"&password="+this.$store.getters.userInfo.password + "&route=" + route
        this.url = url
      })
    } else {
        this.code = curComInfo.ecode
        let url = process.env.VUE_APP_QIYUAN_URL + "#/login?fenxiaoIsShow=fenxiao&token=" + this.$store.getters.qiyuanToken + "&code="+this.code+"&name="+this.$store.getters.userInfo.name+"&password="+this.$store.getters.userInfo.password + "&route=" + route
        this.url = url      
    }
  },
  computed: {
    // 气源管理系统中页面url
    currentUrl: function () {
      return this.$store.getters.currentUrl
    },
    curCom: function () {
      return this.$store.getters.curComInfo
    }
  },
  watch:  {
    // 监听currentUrl，更新this.url（实现单击气源菜单时，iframe加载气源页面）
    currentUrl: {
      immediate: true,
      handler: function (n, o) {
        this.url = this.$store.getters.currentUrl + "?fenxiaoIsShow=fenxiao&token=" + this.$store.getters.qiyuanToken + "&code="+this.code+"&name="+this.$store.getters.userInfo.name+"&password="+this.$store.getters.userInfo.password
      }
    },
    // 监听ecode（右上角公司切换），如果orgLevel是1或2，则调用气源接口，将分销的ecode转换为气源的ecode
    curCom: {
      immediate: true,
      handler: function (n, o) {
        if(n && o) {
          const curComInfo = this.$store.getters.curComInfo
          if(curComInfo.orgLevel === 1 || curComInfo.orgLevel === 2) {
            this.convertCurComCode(curComInfo.ecode,curComInfo.orgLevel).then(res => {
              this.url = this.$store.getters.currentUrl + "?fenxiaoIsShow=fenxiao&token=" + this.$store.getters.qiyuanToken + "&code="+this.code+"&name="+this.$store.getters.userInfo.name+"&password="+this.$store.getters.userInfo.password
              window.location.reload()
            })
          } else {
              this.code = curComInfo.ecode
              this.url = this.$store.getters.currentUrl + "?fenxiaoIsShow=fenxiao&token=" + this.$store.getters.qiyuanToken + "&code="+this.code+"&name="+this.$store.getters.userInfo.name+"&password="+this.$store.getters.userInfo.password
              window.location.reload()
          } 
        }
      }      
    }
  },
  methods: {
    // 转换ecode（将分销的ecode转换为气源的ecode）
    convertCurComCode(code,orgLevel) {
      return new Promise((resolve, reject) => {
          const url = '/htapi/api/v1/gsm-manage-api/ex/authorg/ecode'
          const data = {
            orgCode: code,
            orgType: orgLevel
          }
          axios.post(url,data).then(res => {
            this.code = res.data.result.ecode
            resolve(res)
          }).catch(err => {
            reject(err)
          })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .container {
      width: 100%;
      height:100%;
      overflow: hidden;
  }
  .page {
    height: 100%;
    display: flex;
  }
  .iframe {
      margin-left: 20px;
      margin-right: 20px;
      margin-top: 10px;;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: none;
      border-radius:4px;
  }
</style>