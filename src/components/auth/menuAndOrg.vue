<script>
import axios from "axios";

export default {
  name: "menuAndOrg",
  methods: {
    getMenuAndOrg: function (userName, comCode) {
      let params = {
        userName: userName
      }
      if(comCode) {
        params.ecode = comCode
      }
      axios.get('/auth/api/user/login-infoByName', {
        params: params
      }).then(res => {
        if(res.status === 200 && res.data.retCode === '000000') {
          if(this.$store.getters['curCom'] === '') {
            let treeData = res.data.result.orgMenuDTOList
            this.$store.commit('SET_COMPANY_LIST', treeData);
            let curCom = this.findFirstSelectableItem(treeData)
            this.$store.commit('SET_CUR_COM', curCom.orgCode);
            this.$store.commit('SET_CUR_COM_NAME', curCom.orgName);
            this.$store.commit('SET_CUR_COM_INFO', curCom);
          }
          if(!comCode) {
            let c = this.$store.getters['curCom'] || '000000'
            this.getMenuAndOrg(userName, c)
          } else {
            let menu = res.data.result.resourceMenuDTO.resourceChildren
            this.$store.commit('SET_MENU', menu);
            if(menu && menu.length > 0) {
              let m = this.findMenu(menu, this.$route.path)
              if(!m) {
                let firsetMenu = this.findFirstMenu(menu)
                this.$store.commit('SET_CURRENT_MENU', firsetMenu)
                this.$router.push({
                  path: firsetMenu.resourceUrl
                })
              }
            } else {
              this.$store.commit('SET_CURRENT_MENU', {})
              this.$router.push({
                path: '/noAccess'
              })
            }
          }
        } else {
          this.$message({
            message: res.data.retMsg,
            type: 'error',
            duration: 3000
          })
        }
      })
    },
    findFirstSelectableItem: function (tree) {
      for (let i in tree) {
        if(tree[i].selectable === 1) {
          return tree[i]
        } else if (tree[i].orgChildren.length > 0) {
          let c = this.findFirstSelectableItem(tree[i].orgChildren)
          if(c) {
            return c
          }
        }
      }
      return false
    },
    findMenu: function (menu, url) {
      for (let i in menu) {
        if(menu[i].resourceUrl === url) {
          return menu[i]
        } else if(menu[i].resourceChildren.length > 0) {
          let c = this.findMenu(menu[i].resourceChildren, url)
          if(c) {
            return c
          }
        }
      }
      return false
    },
    findFirstMenu: function (menu) {
      for (let i in menu) {
        if(menu[i].resourceUrl !== '/') {
          return menu[i]
        } else if(menu[i].resourceChildren.length > 0) {
          let c = this.findFirstMenu(menu[i].resourceChildren)
          if(c) {
            return c
          }
        }
      }
      return false
    },
    findXMenu: function (menu, x = 1) {
      for (let i in menu) {
        if(menu[i].resourceUrl !== '/') {
          if(x === 1) {
            return menu[i]
          } else {
            x--
          }
        } else if(menu[i].resourceChildren.length > 0) {
          let c = this.findXMenu(menu[i].resourceChildren)
          if(c) {
            if(x === 1) {
              return c
            } else {
              x--
            }
          }
        }
      }
      return false
    },
  }
}
</script>