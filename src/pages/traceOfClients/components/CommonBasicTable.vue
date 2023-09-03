<template>
  <div class="container">
      <el-table 
        :data="list" 
        stripe
        header-row-class-name="custom-table-header"
        header-cell-class-name="custom-table-header-cell"
        cell-class-name="custom-table-cell"
        class="custom-table-r"   
        >
        <el-table-column 
          v-for='(item,index) in headerTitleArr' 
          :key='index' 
          :label='item.value' 
          :prop='item.key'
          >
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
    name:'table',
    data() {
         return {
           name:'ddd'
        }
    },
    props:{
      headerTitleArr: {
        type:Array
      },
      list: {
        type:Array
      }
    }
}
</script>

<style scoped>
/* 表格标题和数据居中对齐 */
/deep/.el-table th > .cell {
  text-align: center;
}
/deep/.el-table .cell {
  text-align: center;
}
</style>