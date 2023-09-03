<template>
  <div class="container">
    <top-menu :date-picker-show="false"
              title="智慧分销"></top-menu>
    <div class="no-access-wrapper">
      <img src="/static/img/noAccess.png" alt="">
      <p>对不起，您没有访问该菜单的权限，请切换正确的组织</p>
    </div>
  </div>
</template>

<script>
import topMenu from "../../components/topMenu/topMenu2";
export default {
  name: "noAccess",
  data: function () {
    return {
      res: null
    }
  },
  created() {

  },
  methods: {

  },
  components: {
    topMenu
  }
}
</script>

<style scoped lang="scss">
.container {
  /deep/ .top-menu-wrapper {
    background: #4773B7;
  }
}
.no-access-wrapper {
  width: 100%;
  height: 350px;
  margin-top: 188px;
  display: flex;
  flex-direction: column;
  img {
    margin: auto;
  }
  p {
    margin: auto;
  }
}
</style>