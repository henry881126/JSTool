<template>
  <div>
  </div>
</template>

<script>
import api from "../../http/api";
export default {
  name: "sso",
  data: function () {
    return {
      res: null
    }
  },
  created() {
    let data = {
      "appId": this.$route.query.appId,
      "data": this.$route.query.data
    }
    api.sso.ssoLogin(data).then(res => {
      if(res) {
        this.$store.commit('SET_LOGIN_NAME', res.userInfo.userName);
        this.$store.commit('SET_USER_INFO', {
          loginName: res.userInfo.userName,
          name: res.userInfo.userName,
          userId: res.userInfo.userId
        });
        this.$store.commit('SET_COMPANY_LIST', res.userInfo.orgMenuDTOList);
        this.$store.commit('SET_CUR_COM', res.userInfo.userCompanyCode);
        this.$store.commit('SET_CUR_COM_NAME', res.userInfo.userCompanyName);
        this.$store.commit('SET_CUR_COM_INFO', this.findCurCom(res.userInfo.orgMenuDTOList, res.userInfo.userCompanyCode));
        this.$store.commit('SET_MENU', res.userInfo.resourceMenuDTO.resourceChildren);
        this.$router.push(res.optData.routePath)
      }
    })
  },
  methods: {
    findCurCom: function (tree, curCode) {
      for (let i in tree) {
        if(tree[i].orgCode === curCode) {
          return tree[i]
        } else if (tree[i].orgChildren && tree[i].orgChildren.length > 0) {
          let c = this.findCurCom(tree[i].orgChildren, curCode)
          if(c) {
            return c
          }
        }
      }
      return false
    }
  }
}
</script>

<style scoped>

</style>