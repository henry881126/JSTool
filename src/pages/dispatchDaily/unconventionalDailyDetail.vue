<template>
  <div class='container gas-page-bg'>
    <!-- 项部 筛选 -->
    <top-menu title='调度日报'></top-menu>

    <!-- tabs 选项卡 -->
    <div class="content-wrapper">
      <div class="table-wrapper">
        <div class="header">
          <div class="title">非常规管道气日报详情</div>
          <div class="export-back-wrapper">
            <div class='export' @click='handleExport'><img :src="exportImg" class='export-img' /> 导出</div>
            <div class='back' @click='handleBack'> 返回 </div>
            <div @click='handleBack'><i class="el-icon-arrow-right"></i></div>
          </div>
        </div>
        <el-divider class='divider' />
        <div class="unit">单位：万方</div>
        <div class="table">
          <el-table
            :data="list"
            :span-method="handleSpanMethod"
            :row-style="handleRowStyle"
            :header-cell-style="handleHeaderCellStyle"
            border
          >
            <!-- <el-table-column 
              v-for="(item,index) in listHeader" 
              :key="index"
              :prop="item.prop" 
              :label="item.label" 
              align="center" 
              :show-overflow-tooltip="true"
            /> -->
            <el-table-column prop="classz" label="分类" align="center" />
            <el-table-column prop="region" label="区域" align="center" />
            <el-table-column prop="detail" label="明细" :show-overflow-tooltip="true" width="200" align="center" />
            <el-table-column prop="d7" :label="tableHeaderLable.d7" align="center" />
            <el-table-column prop="d6" :label="tableHeaderLable.d6" align="center" />
            <el-table-column prop="d5" :label="tableHeaderLable.d5" align="center" />
            <el-table-column prop="d4" :label="tableHeaderLable.d4" align="center" />
            <el-table-column prop="d3" :label="tableHeaderLable.d3" align="center" />
            <el-table-column prop="d2" :label="tableHeaderLable.d2" align="center" />
            <el-table-column prop="d1" :label="tableHeaderLable.d1" align="center" />
            <el-table-column prop="month" label="月累计" align="center" />
            <el-table-column prop="year" label="年累计" align="center" />
          </el-table>
        </div>
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
          >确 定</el-button>
        </span>
    </el-dialog>    
  </div>
</template>

<script>
import TopMenu from '@components/topMenu/topMenu'
import dateFormater from '@components/dateFormater/dateFormater'
import api from '/src/http/api'
import exportApi from '/src/components/export/export'

export default {
  name:'dayDeliveryManagement',
  mixins:[dateFormater,exportApi],
  components: {
      TopMenu,
  },
  data() {
    return {
      field:'hello',
      list: [],
      exportImg:require('@assets/img/export@2x.png'),          // 导出按钮用图标
      params: null,
      date: '', // 非常规列表页 日期选项器当前日期
      // 存储各列合并行规则的对象
      spanObj: {
        classz: {
          spanArr: [],
          position: 0
        },
        region: {
          spanArr: [],
          position: 0
        }
      },
      confirmDialogVisible: false, // 控制导出dialog显隐
      radioValue: '1',  // 导出dialog中单选按钮绑定数据
    }
  },
  computed:{
    // 动态生成表格表头
      tableHeaderLable() {
        return {
          d7:this.generateDate(this.date, 6),
          d6:this.generateDate(this.date, 5),
          d5:this.generateDate(this.date, 4),
          d4:this.generateDate(this.date, 3),
          d3:this.generateDate(this.date, 2),
          d2:this.generateDate(this.date, 1),
          d1:this.generateDate(this.date, 0),
        }
      },
    
    // 计算国网管容所在行号
    guoWangGuanRongRows() {
      return this.list.findIndex(item => item.classz === '国网管容')
    },
    // 计算国网库容所在行号
    guoWangKuRongRows() {
      return this.list.findIndex(item => item.classz === '国网库容')
    },
    // 详情导出dialog中时段
    exportTimeRange() {
      const startDate = new Date(this.date)
      startDate.setDate(startDate.getDate() - 6)
      const endDate = new Date(this.date)
      return this.generateFormateDate(startDate) + '-' + this.generateFormateDate(endDate)
    },
  },
  created() {
    this.params = this.$route.params
    this.date = this.params.date
    if(!this.date) {
      this.date = window.localStorage.getItem('unconventionalCurrentDate')
    }
    window.localStorage.setItem('unconventionalCurrentDate',this.date)
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      let params = {
        date: this.date,
        xaReig: this.$store.getters['curCom']
      }
      api.dispatchDaily.unconventionDetail(params).then(res => {
        this.list = res[0]
        // 计算第一列（分类）合并单元格
        let resultClassz = this.rowspan('classz')  
        this.spanObj.classz.spanArr = resultClassz.spanArr
        this.spanObj.classz.position = resultClassz.position
        // 计算第二列（区域）合并单元格
        let resultRegion = this.rowspan('region')  
        this.spanObj.region.spanArr = resultRegion.spanArr
        this.spanObj.region.position = resultRegion.position      
      })
    },
    handleExport() {
        this.confirmDialogVisible = true
    },
    handleConfirm() {
      const loading = this.$loading({
        lock: 'true',
        text: '正在导出数据，请耐心等待！',
        spinner: 'el-icon-loading',
      })
      const flag = this.radioValue === '0' ? '2' : '1'
      let params = {
        flag,
        date: this.date,
        xaReig: this.$store.getters['curCom']
      }
        this.confirmDialogVisible = false

      api.dispatchDaily.unconventionDetailExport(params).then(res => {
        if(res) {
          loading.close()
          this.download(res, 'xlsx', '非常规管道气日报详情')
        }
      })         
    },
    handleBack() {
      this.$router.go(-1)
    },
    /**
     * 格式化日期，获取某日期前几天的日期，如date值是2021-09-16，num值是2，则此函数返回“9月14日”
     * date String 用户在非常规列表页传递过来的日期（日期选择器当前所选日期）
     * num Number 天数
     */
    generateDate(date,num) {
      let d = new Date(date)
      d.setDate(d.getDate()-num)
      return (d.getMonth()+1).toString() + '月' + d.getDate().toString() + '日'
    },
    // 计算表格合并行
    rowspan(field) {
      let spanArr = []
      let position = 0
      this.list.forEach((item,index) => {
        if( index === 0){
          spanArr.push(1);
          position = 0;
        }else{
          if(this.list[index][field] === this.list[index-1][field] ){
            spanArr[position] += 1;
            spanArr.push(0);
          }else{
            spanArr.push(1);
            position = index;
          }
        }
      })
      return {
        spanArr,
        position
      }
    },
    // 表格合并方法
    handleSpanMethod({row, column, rowIndex, columnIndex}) {
      // 1 列合并：注意列合并需要在行合并上面，否则会出现非预期结果
      if (row.classz === '资源合计' || row.classz === '客户合计') {
        if(columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 3
          }
        } else if(columnIndex === 1 || columnIndex === 2) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      // 2 国网管容 行列合并
      if (rowIndex === this.guoWangGuanRongRows) {
        if(columnIndex === 0) {
          return {
            rowspan: 2,
            colspan: 2
          }
        } else if(columnIndex === 1) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }else if (rowIndex === this.guoWangGuanRongRows + 1) {
        if(columnIndex === 0 || columnIndex === 1) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }      
      }
      // 3 国网库容 行列合并
      if (rowIndex === this.guoWangKuRongRows) {
        if(columnIndex === 0) {
          return {
            rowspan: 2,
            colspan: 2
          }
        } else if(columnIndex === 1) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }else if (rowIndex === this.guoWangKuRongRows + 1) {
        if(columnIndex === 0 || columnIndex === 1) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }      
      }      
      // 4 行合并
      if (columnIndex === 0) {
        const _row = this.spanObj.classz.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 1) {
        const _row = this.spanObj.region.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }  
    },
    // 行样式（合计行设置背景色）
    handleRowStyle({row,rowIndex}) {
      if(row.classz === '资源合计' || row.classz === '客户合计' || row.detail.indexOf('小计') !== -1) {
        return {
          'background-color':'#F5F7FA',
          'font-weight': 'bold'
        }
      }
    },
    // 单元格样式（设置特定单元格背景色为白色），解决“小计”行左侧为空单元格时，此空单元格背景色也填充了小计行背景色问题（不应填充）
    handleCellStyle({row, column, rowIndex, columnIndex}) {
      if(row.region === '' && columnIndex === 1) {
        return {
          'background-color':'#fff',
        }
      }
    },
    // 表格头部样式
    handleHeaderCellStyle({row, rowIndex}) {
      return {
        'background-color': '#F5F7FA',
        'color': '#333333',
        'font-weight': 'bold',
        'text-align': 'center',
      }
    },
    // 生成日期
    generateFormateDate(d) {
      return `${d.getFullYear()}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getDate().toString().padStart(2,'0')}`
    },    
  }
}
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.container { 
    width:100%;
    position: relative;
    .content-wrapper {
      margin: 30px;
      background: #fff;
      border-radius: 16px;
      .table-wrapper {
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          .title {
            color:#333;
            font-size: 24px;
            font-weight: bold;
          }
          .export-back-wrapper {
            display: flex;
            align-items: center;
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
            .back {
              margin-left: 32px;
              color: #505356;
              font-size: 16px;
              cursor: pointer;
            }
            .el-icon-arrow-right {
              margin-left: 5px;
              color: #505356;
              font-size: 24px;
              cursor: pointer;
            }
          }
        }
        .divider {

        }
        .unit {
          margin-bottom: 16px;
          font-size: 14px;
          color: #999;
          padding: 16px 24px 0 24px;
        }
        .table {
          padding: 0 24px 24px 24px;
        }
      }
    }
    /* 表格外边框样式 */
    /deep/.el-table {
      border-radius: 8px;
      border:1px solid #F5F7FA;
      font-size: 16px;
    }
    /* 表格头部样式 */
    /deep/.el-table__header-wrapper {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    } 
    // 清除divider分隔线默认margin
    /deep/.el-divider--horizontal {
      margin: 0;
    }   
}
</style>