<template>
  <div>
    <div v-if="rowData.yinsu === '气象'" class="qixiang-wrapper">
      <img :src="'/static/img/tempicon/' + rowData[columnName] + '.png'" onerror="this.src='/static/img/tempicon/默认天气.png'" alt="">
      <span>{{ rowData[columnName] }}</span>
    </div>
    <div v-else-if="rowData.yinsu === '气温'" class="qiwen-wrapper">
      <div class="charts-wrapper">
        <svg width="104" height="20" viewBox="0 0 104 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M52 2L2 18L102 18V12L52 2Z" fill="#EDF6F2"/>
          <path d="M102 12L52 2L2 18" stroke="#47A87D"/>
          <ellipse cx="2.5" cy="17.4685" rx="2.5" ry="2.53158" fill="#47A87D"/>
          <ellipse cx="51.5" cy="2.53158" rx="2.5" ry="2.53158" fill="#47A87D"/>
          <ellipse cx="101.5" cy="11.5189" rx="2.5" ry="2.53158" fill="#47A87D"/>
        </svg>
      </div>
      <div>平均：{{ getNum('avg') }}°C</div>
      <div>最高：{{ getNum('max') }}°C</div>
      <div>最低：{{ getNum('min') }}°C</div>
    </div>
    <div v-else>{{ rowData[columnName] }}</div>
  </div>
</template>

<script>
export default {
  name: "recentTableItem",
  props: {
    columnName: {
      type: String
    },
    rowData: {
      type: Object
    }
  },
  methods: {
    getNum: function (type) {
      if(this.rowData[this.columnName]) {
        return this.rowData[this.columnName][type]
      }
    }
  }
}
</script>

<style scoped lang="scss">
.qixiang-wrapper {
  img {
    width: 23px;
    height: 23px;
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
    transition: transform .3s ease;
  }
  img:hover {
    transform: scale(1.2);
  }
  span {
    display: inline-block;
    vertical-align: top;
  }
}
.qiwen-wrapper {
  padding: 10px 0;
  .charts-wrapper {
    width: 100%;;
    height: 20px;
  }
}
</style>