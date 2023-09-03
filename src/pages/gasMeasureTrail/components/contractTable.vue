<template>
  <div class="contract-table">
    <el-table :data="tableData.dataList" style="width: 100%" v-if="tableData.theadList">
      <el-table-column prop="time" label="日期" width="150" sortable>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in tableData.theadList.slice(1)"
        :key="index"
        prop=""
        :label="item.label"
        align="center"
      >
        <el-table-column
          v-for="oneConf in item.children"
          :key="oneConf.prop"
          :prop="oneConf.prop"
          :label="oneConf.label"
        ></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {
    tableData: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
    };
  },
  computed: {},
  watch: {
  },
  methods: {

  },
  created() {
  },
};
</script>

<style lang='scss' scoped>
@import "./../scss/contract-table.scss";
</style>