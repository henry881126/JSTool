<template>
  <div class="container">
    <div class="header-wrapper">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="card-box" shadow="never">
            <div class="title">前日{{beforeYesterday}}</div>
            <div class="val"><span>{{ list.theDayBeforeYesterday }}</span><span>万方</span></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="card-box" shadow="never">
            <div class="title">昨日{{yesterday}}</div>
            <div class="val"><span>{{ list.yesterday }}</span><span>万方</span></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="card-box" shadow="never">
            <div class="title">环比</div>
            <div class="val"><span>{{ list.ratio }}%</span><span></span></div>
          </el-card>
        </el-col>                
      </el-row>
    </div>
    <div class="table-wrapper">
      <div class="header">
        <div class="title">{{ currentEnterpriceName }}-前7日数据</div>
        <div class='export' @click='handleExport'><img :src="exportImg" class='export-img' /> 导出</div>
      </div>
      <el-divider class='divider' />
      <div class="unit">单位：万方</div>
      <div class="table">
        <el-table
          :data="list.supplyVOList"
          stripe
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          class="custom-table-r"           
        >
          <el-table-column prop="date" label="日期" align="center" />
          <el-table-column prop="gasNum" label="气量" align="center" />
        </el-table>
      </div>
    </div>
    <!-- 导出确认对话框 -->
    <el-dialog
        title="导出数据"
        :visible.sync="confirmDialogVisible"
        class="custom-dialog"
        width="30%">
        <div style="margin-bottom:10px;"><el-radio v-model="radioValue" label="0">当前时间段：{{ exportTimeRange }}</el-radio></div>
        <div><el-radio v-model="radioValue" label="1">{{new Date().getFullYear()}}年</el-radio></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="confirmDialogVisible = false">取 消</el-button>
          <el-button 
            type="primary" 
            @click="handleConfirm" 
            v-loading.fullscreen.lock="fullScreenLoading" 
            element-loading-text="正在导出数据，请耐心等待！"
            element-loading-spinner="el-icon-loading"
          >确 定</el-button>
        </span>
    </el-dialog>  
  </div>
</template>

<script>
import api from '/src/http/api'
import exportApi from '/src/components/export/export'

export default {
    mixins:[exportApi],
    data() {
      return {
        list: [], // 表格数据
        exportImg:require('@assets/img/export@2x.png'),          // 导出按钮用图标
        confirmDialogVisible: false, // 控制导出dialog显隐
        radioValue: '1',  // 导出dialog中单选按钮绑定数据
        fullScreenLoading: false,
      }
    },
    props: {
      currentEnterpriceName: {
        type: String,
      },
      date: {
        type: [String, Date, Number]
      },
      currentEnterpriceCode: {
        type: String
      }
    },
    computed: {
      exportTimeRange() {
        const startDate = new Date(this.date)
        startDate.setDate(startDate.getDate() - 6)
        const endDate = new Date(this.date)
        return this.generateFormateDate(startDate) + '-' + this.generateFormateDate(endDate)
      },
      yesterday() {
        return this.generateDate(1)
      },
      beforeYesterday() {
        return this.generateDate(2)
      }
    },
    watch: {
      date() {
        this.getData()
      },
      currentEnterpriceName() {
        this.getData()
      }
    },
    mounted() {
      // this.getData()
    },
    methods: {
      // 获取 表格 数据
      getData() {
        const params = {
          compCodeList: this.currentEnterpriceCode,
          rdate: this.date
        }
        api.dispatchDaily.getSupplyGasDaily(params).then(res => {
          this.list = res [0]
        })
      },
      handleExport() {
        this.confirmDialogVisible = true
      },
      // 单击导出按钮，弹出确认对话框，确定按钮单击事件
      handleConfirm() {
        this.handleExport()
        // 如果选择全量导出，则导出当前第一天到最后一天数据，将rdate参数值设置为当年第一天
        let rdate = ''
        const d = new Date()
        const y = d.getFullYear()
        if(this.radioValue === '1') {
          rdate = y + '-' + '01' + '-' + '01'
        }
        
        let params = {
          compCodeList: this.currentEnterpriceCode,
          flag: this.radioValue,
          rdate: rdate ? rdate : this.date,
        }
        this.confirmDialogVisible = false
        this.fullScreenLoading = true
        api.dispatchDaily.supplyGasDailyExport(params).then(res => {
          if(res) {
            this.fullScreenLoading = false
            this.download(res, 'xlsx', '供气日报')
          }
        })
      },
      // 生成日期
      generateFormateDate(d) {
        return `${d.getFullYear()}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getDate().toString().padStart(2,'0')}`
      },
      // 获取指定日期、指定格式的日期
      generateDate(num) {
        let d = new Date(this.date)
        d.setDate(d.getDate()-num)
        return (d.getMonth()+1).toString().padStart(2,'0') + '/' + d.getDate().toString().padStart(2,'0')
      }
    }
}
</script>

<style lang='scss' scoped>
.container {
  .header-wrapper {
    margin-bottom: 32px;
    padding: 0 24px;
    .card-box {
      background: #F5F7FA;
      border-radius: 8px;
      border: none;
      .title {
        color:#333;
        font-size: 14px;
        text-align: center;
        margin-bottom: 8px;
      }
      .val {
        color: #0FB3AD;
        font-size: 32px;
        font-weight: bold;
        text-align: center;
        span:last-child {
          color: #333;
          font-size: 14px;
          margin-left: 6px;
        }
      }
    }
  }
  .table-wrapper {
    /* padding: 0 24px; */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      .title {
        color:#333;
        font-size: 16px;
        font-weight: bold;
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
    .unit {
      padding: 0 24px;
    }
    .table {
      padding: 0 24px;
    }
    .divider {
      margin: 16px 0;
    }
    .unit {
      font-size: 14px;
      color: #999;
      margin-bottom: 16px;
    }
  }
}
</style>