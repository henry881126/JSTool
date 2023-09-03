<template>
  <div class="container">
    <div class="table-wrapper">
      <div class="header">
        <div class="unit">单位：万方</div>
        <div class='export' @click='handleExport'><img :src="exportImg" class='export-img' /> 导出</div>
      </div>
      <div class="table">
        <el-table
          :data="list"
          border
        >
          <el-table-column prop="enterprise" label="企业" />
          <el-table-column prop="caigouling" label="采购量" />
          <el-table-column prop="xiaoshouling" label="销售量" />
          <el-table-column prop="ziyong" label="自用" />
          <el-table-column prop="stock" label="库存" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
      return {
        list: [],
        exportImg:require('@assets/img/export_new@2x.png'),          // 导出按钮用图标

      }
    },
    props: {
      date: {
        type: [String, Date, Number]
      }
    },
    watch: {
      date() {
        this.getData()
      }
    },          
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        console.log('date---3:',this.date)
        // api.gas.getSupplyGasDailyList(params).then(res => {

        // })
        this.list = [
          {
              enterprise:'邢台新奥能源发展有限公司',
              caigouling:100.3333,
              xiaoshouling:44.4444,
              ziyong:34.4444,
              stock:45.4533
          },            
          {
              enterprise:'献县新奥燃气有限公司',
              gasConsumption:45.4533
          }, 
        ]
      },
      handleExport() {
        console.log('export')
      }      
    }
}
</script>

<style lang='scss' scoped>
.container {
  .table-wrapper {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 16px;
      .unit {
        color: #999;
        font-size: 14px;
      }
      .export {
        width:104px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        border-radius: 20px;
        background: #0FB3AD;
        color:#fff;
        text-align: center;
        cursor:pointer;   
        box-sizing: border-box;             
        .export-img {
          width:16px;
          height:16px;
          position:relative;
          top:2px;
          right:3px;
          filter: grayscale(100%) brightness(200%);
        }
      }  
    }    
  }
}
</style>