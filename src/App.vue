<template>
  <div id="app">
    <!-- <router-view/> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import { switchTheme } from '/src/components/theme/themes'
export default {
  name: 'App',
  mounted () {
    switchTheme(this.$store.getters.theme)
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: DI;
  src: url("/static/font/DIN Alternate Bold.ttf");
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: left;
  height: 100%;
  font-size: $middleFontSize;
  font-family: PingFang SC;
}
body .el-table th.gutter {
  display: table-cell !important;
}

body .el-table colgroup.gutter {
  display: table-cell !important;
}
.gas-tool-search-wrapper input {
  border: none !important;
  background: transparent;
}

.day-month-tog-wrapper .el-button.el-button--primary {
  color: #fff;
  background-color: #0fb2ab;
  border-color: #0fb2ab;
}

.day-month-tog-wrapper .el-button {
  color: #fff;
  background-color: #567db9;
  border-color: #567db9;
}
</style>
