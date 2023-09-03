<template>
  <div style="height: 100%;">
    <level3 v-if="(curComInfo.orgLevel === 2 || curComInfo.orgLevel === 3) && curComInfo.orgChildren !== null"></level3>
    <level4 v-if="curComInfo.orgLevel === 4 || (curComInfo.orgLevel === 3 && curComInfo.orgChildren === null)"></level4>
  </div>
</template>

<script>
import level3 from './level3/index'
import level4 from './level4/index'
export default {
  data() {
    return {

    }
  },
  computed: {
    curComInfo: function () {
      return this.$store.getters.curComInfo
    }
  },
  components: {
    level3,
    level4
  }
}

</script>

<style scoped lang="scss">
</style>
