<template>
  <div class="day-gas-container">
    <div class="content-wrapper">
      <div class="header-wrapper">
        <div class="title">{{ this.formData.time | convertDate }} {{ new Date() | convertTime }}</div>
        <el-button @click="exportMessage" round type="primary" class="export-btn" icon="el-icon-upload2">导出</el-button>
      </div>

      <el-table 
        :data="list"
        border
        header-row-class-name="custom-table-header"
        header-cell-class-name="custom-table-header-cell"
        cell-class-name="custom-table-cell"
        class="table-wrapper custom-table-n"   
        ref="gasTrackingTable"
      >
        <el-table-column label="客户名称" min-width="400" show-overflow-tooltip="" fixed="left" :key="Math.random()">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.contractType === '1'" class="tag-daishu">代输</el-tag>
            <el-tag v-else-if="scope.row.contractType === '2'" class="tag-sanfang">代销</el-tag>
            <el-tag v-else-if="scope.row.contractType === '3'" class="tag-zhixiao">直销</el-tag>
            <el-tag v-else class="tag-daishu">多种</el-tag>
            <span>{{scope.row.customerName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contractGasNum" label="月合同量(万方)" min-width="150" align="right" :key="Math.random()"></el-table-column>
        <el-table-column prop="extractVolume" label="累计提取量(万方)" min-width="160" align="right" :key="Math.random()"></el-table-column>
        <el-table-column prop="offsetVolume" label="当前累计偏差(方)" min-width="160" align="right" v-if="isHistoryDate" :key="Math.random()">
          <template slot-scope="{row}">
            <span v-if="row.offsetVolume > 0" style="color:#F56C6C;">+{{ row.offsetVolume}}</span>
            <span v-if="row.offsetVolume === 0" style="color:#000;">{{ row.offsetVolume}}</span>
            <span v-if="row.offsetVolume < 0" style="color:#67C23A;">{{ row.offsetVolume}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dateRate" label="时间进度/提取进度" min-width="190" v-if="isHistoryDate" :key="Math.random()">
          <template slot-scope="{row}">
            <el-progress :percentage="row.dateRate | convertPercent" color="#909399" :format="progressFormat(row.dateRate)"></el-progress>
            <el-progress :percentage="row.extractRate | convertPercent" :color="row.dateRate-row.extractRate < 0 ? '#F56C6C' : '#67C23A'" :format="progressFormat(row.extractRate)"></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="offsetVolumePre" label="预计当月偏差量(方)" min-width="180" align="right" v-if="isHistoryDate" :key="Math.random()">
          <template slot-scope="{row}">
            <span v-if="row.offsetVolumePre > 0" style="color:#F56C6C;">+{{ row.offsetVolumePre}}</span>
            <span v-if="row.offsetVolumePre === 0" style="color:#000;">{{ row.offsetVolumePre}}</span>
            <span v-if="row.offsetVolumePre < 0" style="color:#67C23A;">{{ row.offsetVolumePre}}</span>
          </template>          
        </el-table-column>
        <el-table-column prop="offsetVolume" label="当月总偏差(方)" min-width="160" align="right" v-if="!isHistoryDate" :key="Math.random()">
          <template slot-scope="{row}">
            <span v-if="row.offsetVolume >= 0" style="color:#F56C6C;">+{{ row.offsetVolume}}</span>
            <span v-if="row.offsetVolume < 0" style="color:#67C23A;">{{ row.offsetVolume}}</span>
          </template>          
        </el-table-column>
        <el-table-column prop="offsetRate" label="偏差率" min-width="160" align="right" v-if="!isHistoryDate" :key="Math.random()">
          <template slot-scope="{row}">
            <span v-if="row.offsetRate >= 0" style="color:#F56C6C;">+{{ row.offsetRate}}%</span>
            <span v-if="row.offsetRate < 0" style="color:#67C23A;">{{ row.offsetRate}}%</span>
          </template>   
        </el-table-column>            
        <el-table-column prop="extractRate" label="提取进度" min-width="120" fixed="right" :key="Math.random()">
          <template slot-scope="scope">
            <el-button type="text" @click="getDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="yujing" label="预警通知" min-width="155" fixed="right" v-if="isHistoryDate" :key="Math.random()">
          <template slot-scope="scope">
            <div class="early-wraning-btn-wrapper">
              <i v-if="scope.row.isRead === '0' && scope.row.warningTag !== ''" class="el-icon-warning" />
              <i v-if="scope.row.isRead === '1' && scope.row.warningTag !== ''" class="el-icon-success" />
              <img v-if="scope.row.isRead === '-1' && scope.row.warningTag !== ''" :src="require('@/assets/img/position.png')" style="padding-right: 8px;position: relative;top: 2px;" />
              <!-- 当isRead值为-1值，支持单击事件（弹出对话框，发送消息） -->
              <div class="early-wraning-btn" 
                v-if="scope.row.isRead === '-1' && scope.row.warningTag !== '' && scope.row.contractType !== '3'" 
                @click="showEarlyWraningDialog(scope.row)" 
                style="background: #409EFF; color: #fff; cursor: pointer;">
                  {{ scope.row.warningTag }}
              </div>  
              <!-- 未发送，但合同类型是直销，此时不可点击 -->
              <div class="early-wraning-btn" 
                v-if="scope.row.isRead === '-1' && scope.row.warningTag !== '' && scope.row.contractType === '3'" 
                style="color: #606266;cursor:not-allowed;">
                {{ scope.row.warningTag }}
              </div>        
              <div class="early-wraning-btn" v-if="scope.row.warningTag !== '' && scope.row.isRead !== '-1'">
                <span :style="{color:(scope.row.isRead === 0 ? '#606266' : '#606266')}">{{ scope.row.warningTag }}</span>
              </div>        
              <div v-if="scope.row.warningTag === ''" style="color: #aaa;">-</div>    
            </div>
          </template>
        </el-table-column>    
      </el-table>
      <el-pagination background class="custom-page-n" layout="total, slot, prev, pager, next, sizes" :current-page="pager.currentPage" :page-size="pager.pageSize" :page-sizes="[10,20,30]" :total="pager.totalPage" @current-change="handleCurrentChangeEvent" @size-change="handleSizeChange"><span style="color:#606266;">当前{{this.list.length}}条</span></el-pagination>
    </div>
    <EarlyWarningDialog ref="EarlyWarningDialog" :title="titleOfToVoidMessage" :content="contentOfToVoidMessage" :confirmEvent="handleSendEvent" :toVoidEvent="handleToVoidEvent" />
    <div v-if="isVisible">
      <el-dialog
        title="提示"
        :visible.sync="isVisible"
        width="1300px"
        class="dialog-wrapper"
      >
        <div slot="title" class="dialog-title-wrapper">
          <div class="title">{{getDialogTitle}}</div>
          <div class="btn-wrapper">
            <el-button @click="handleTrackingTableClickEveng" class="btn-tracking-table" :class="dynamicComponent === 'TrackingTable' ? 'btn-pressed' : ''">跟踪表</el-button>
            <el-button @click="handleTrackingChartClickEveng" class="btn-tracking-chart" :class="dynamicComponent === 'TrackingChart' ? 'btn-pressed' : ''">跟踪图</el-button>
            <el-button @click="handleCumulativeChartClickEveng" class="btn-cumulative-chart" :class="dynamicComponent === 'CumulativeChart' ? 'btn-pressed' : ''">累计图</el-button>
          </div>
        </div>  
        <div>
          <component :is="dynamicComponent" :currentRecord="currentRecord"></component>
        </div>
      </el-dialog>    
    </div>
  </div>
</template>

<script>
import api from '/src/http/api'
import exportApi from '/src/components/export/export'
import EarlyWarningDialog from './CommonDialog.vue'
import TrackingTable from './detail/TrackingTable.vue'
import TrackingChart from './detail/TrackingChart.vue'
import CumulativeChart from './detail/CumulativeChart.vue'
export default {
  mixins:[exportApi],
  components: {
    EarlyWarningDialog,
    TrackingTable,
    TrackingChart,
    CumulativeChart
  },
  data() {
    return {
      id: null, // 记录ID
      list: [],
      pager: {
        currentPage: 1,
        pageSize: 10,
        totalPage: null,
      },
      titleOfToVoidMessage: '',
      contentOfToVoidMessage: '',
      isVisible: false,
      dynamicComponent: 'TrackingTable',
      currentRecord: {},  // 当前记录，查看详情时使用此变量存储的数据
      dialogTitle: '',  // 对话框标题
      bp: '', // 当前记录bp号
    }
  },
  props: {
    formData: {
      type: Object
    }
  },
  filters: {
    convertDate(item) {
      const arr = item.split('-')
      return arr[0] + '年' + arr[1] + '月' + arr[2] + '日'
    },  
    convertTime() {
      const d = new Date()
      return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0')
    },
    convertPercent(val) {
      return parseFloat(val.toFixed(2)) > 100 ? 100 : parseFloat(val.toFixed(2))
    }
  },
  computed: {
    getDialogTitle() {
      const arr = this.formData.time.split('-')
      const d = arr[0] + '年' + arr[1] + '月'
      return  this.currentRecord.customerName + d + '月度执行跟踪详情'
    },
    curCom() {
      return this.$store.getters.curCom
    },
    // 判断用户选择的筛选日期是否是当前月
    isHistoryDate() {
      const currentMonth = new Date().getMonth() + 1
      const searchMonth = new Date(this.formData.time).getMonth() + 1
      console.log('timestape:', currentMonth, searchMonth)
      return currentMonth > searchMonth ? false : true
    }  
  },
  watch: {
    formData: {
      deep: true,
      handler(n, o) {
        this.pager.currentPage = 1
        this.getList()
      }
    },
    curCom: {
      immediate: true,
      handler: function (n, o) {
        if (n && o) {
          this.getList()
        }
      },
    }
  },
  created() {
    this.getList()
  },
  beforeUpdate() {
    // 解决搜索时表格抖动问题
    this.$nextTick(() => {
      this.$refs.gasTrackingTable.doLayout()
    }) 
  },
  methods: {
    getList() {
      this.list = []
      const params = {
        code: this.$store.getters.curCom,
        currentPage: this.pager.currentPage,
        pageSize: this.pager.pageSize,
        orgLevel: this.$store.getters.curComInfo.orgLevel,
        ...this.formData
      }
      api.gasTracking.month.getMonthGasTrackingList(params).then(res => {
        this.list = res[0].list
        this.pager.totalPage = res[0].total
      })
    },
     
    // 导出
    exportMessage() {
      let params = {
        code: this.$store.getters.curCom,
        orgLevel:  this.$store.getters.curComInfo.orgLevel,  // 3 管理实体 4 法人公司
        ...this.formData
      }
      api.gasTracking.month.export(params).then(res => {
        this.download(res, 'xlsx', '用气执行跟踪 月 导出')
      })
    },

    // 分页
    handleCurrentChangeEvent(currentPage) {
      this.pager.currentPage = currentPage;
      this.getList();
    },
    // 调整当前页记录显示数量事件
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.pager.currentPage = 1
      this.getList()
    },
    // 获取当前日期
    getCurrentDate() {
      const d = new Date()
      return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDay()
    },
    // 提取详情
    getDetail(row) {
      this.currentRecord = row
      this.currentRecord.time = this.formData.time
      this.isVisible = true
    },
    // 超能预警 事件 弹出对话框
    showEarlyWraningDialog(row) {
      this.bp = row.customerCode
      const d = this.formData.time.split('-')
      let params = {
        bp: row.customerCode,
        code: this.$store.getters.curCom,
        time: d[0] + '-' + d[1]
      }
      api.gasTracking.month.getMonthGasTrackingEarlyWarningContent(params).then(res => {
        // 从返回的通知内容中获取通知时间
        // const pos = res[0].indexOf('通知时间')
        // const noticeTimeStr = res[0].substr(pos)
        const content = res[0].replaceAll('##','<br/>') // 将接口返回内容中的##替换成<br/>，即实现换行
        this.currentRecord = row
        this.$refs.EarlyWarningDialog.isVisible = true
        this.titleOfToVoidMessage = `${row.warningTag}消息发送`
        // this.contentOfToVoidMessage = `<p style="font-weight:bold;">发送至<span style="padding-right:10px;"></span>${this.currentRecord.customerName}有限公司</p>
        //     <p>${res[0]}</p>
        //     <p style="font-weight:bold;text-align:right;">${noticeTimeStr}</p>
        //   `  
        this.contentOfToVoidMessage = `<p style="font-weight:bold;">发送至<span style="padding-right:10px;"></span>${this.currentRecord.customerName}</p>
            <p style="line-height:180%;">${content}</p>
          `          
      }) 
    },
    // dialog 作废 按钮 事件（作废功能暂不实现）
    handleToVoidEvent() {
      console.log(1)
    },
    // dialog 确定 按钮 事件（单击确定按钮后，发送预警通知）
    handleSendEvent() {
      const d = this.formData.time.split('-')
      let params = {
        bp: this.bp,
        code: this.$store.getters.curCom,
        loginName: this.$store.getters.userInfo.name,
        time: d[0] + '-' + d[1]
      }
      api.gasTracking.month.sendMonthGasTrackingMessage(params).then(res => {
        if(res) {
          this.$message({
            type: 'success',
            message: '处理成功！'
          })
          this.$refs.EarlyWarningDialog.isVisible = false
          this.getList()
        }
      })      
    },
    handleTrackingTableClickEveng() {
      this.dynamicComponent = 'TrackingTable'
    },
    handleTrackingChartClickEveng() {
      this.dynamicComponent = 'TrackingChart'
    },
    handleCumulativeChartClickEveng() {
      this.dynamicComponent = 'CumulativeChart'
    },
    // 指定el-progress文字内容（文本型）（解决el-progress的pencent值大于100时（percent值为数值型），控制台报警告问题）
    progressFormat(val) {
      return () => {
        return parseFloat(val.toFixed(2)) + '%'
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.day-gas-container {
  .content-wrapper {
    .header-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .title {
        color: #303133;
        font-size: 16px;
        font-weight: 500;
      }
      .export-btn {
          width: 79px;
          height: 32px;
          padding: 0;
          &.el-button--primary {
            background: #47A87D;
            border: none;
          }            
      }
    }
    .table-wrapper {
      /* 进度条样式 */
      /deep/.el-progress-bar {
        width:85%;
      }
      /deep/ .el-progress__text {
        margin-left: 10px;
      }      
      .early-wraning-btn-wrapper {
        .early-wraning-btn {
          display: inline-block;
          width: 76px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border-radius: 12px;
          background: #F5F7FA;
          font-size: 14px;
          font-weight: bold;
          color: #909399;
        }
        .el-button {
          width: 76px;
          height: 23px;
          padding: 0;
          margin: 0;
          font-size: 12px;
          font-weight: 500;
          color: #909399;
          border: none;
        }
        .el-button--primary {
          color: #fff;
        }
        .el-button--info.is-plain {
          &:hover {
            background: #F5F7FA;
            background: #ddd;
          }
        }
        /* 圆圈 叹号 */
        .el-icon-warning {
          color: #E6A23C;
          font-size: 16px;
          margin-right: 6px;
        }
        /* 圆圈 对勾 */
        .el-icon-success {
          color: #67C23A;
          font-size: 16px;
          margin-right: 6px;
        }
        /* 圆圈 位置 */
        .el-icon-position {
          color: #409EFF;
          font-size: 16px;
          margin-right: 6px;
        }
      }
      .tag-daishu {
        width: 48px;
        height: 24px;
        line-height: 24px;
        background:#FEF0F0;
        color:#F56C6C;
        font-size:14px;
        border:1px solid #F56C6C;        
        border-radius:16px;
        margin-right:16px;
        line-height: 21px;
      }
      .tag-sanfang {
        width: 48px;
        height: 24px;
        line-height: 24px;        
        background:#FCF6EC;
        color:#E6A23C;   
        font-size:14px;
        border: 1px solid #E6A23C;
        border-radius:16px;
        margin-right:16px;
        line-height: 21px;
      }
      .tag-zhixiao {
        width: 48px;
        height: 24px;
        line-height: 24px;        
        background:#ECF5FF;
        color: #409EFF;
        font-size:14px;
        border: 1px solid #409EFF;
        border-radius:16px;
        margin-right:16px;
        line-height: 21px;
      }        
    }
  }
  .dialog-wrapper {
    /deep/.el-dialog {
      border-radius: 4px;
    }
    /deep/.el-dialog__header {
      border-radius: 4px 4px 0 0;
    }
    .dialog-title-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      /* height: 65px; */
      margin: 0;
      padding: 0;
      .title {
        color: #303133;
        font-size: 18px;
        font-weight: 500px;
      }
      .btn-wrapper {
        margin-right: 20px;
        /deep/ .el-button {
          width: 72px;
          height: 32px;
          margin: 0;
          padding: 0;
          border-radius: 0;
          font-size: 14px;
        }
        .btn-tracking-table {
          border-radius: 16px 0px 0px 16px;
          &:active, &:hover {
            background: rgba(71, 168, 125, 0.1);
            border: 1px solid #47A87D;
            color: #47A87D;
          }
        }
        .btn-tracking-chart {
          border-left: none;
          border-right: none;
          &:active, &:hover {
            background: rgba(71, 168, 125, 0.1);
            border: 1px solid #47A87D;
            color: #47A87D;
          }
        }      
        .btn-cumulative-chart {
          border-left: none;
          border-radius: 0px 16px 16px 0px;
          &:active, &:hover {
            background: rgba(71, 168, 125, 0.1);
            border: 1px solid #47A87D;
            color: #47A87D;
          }        
        }
        .btn-pressed {
          background: rgba(71, 168, 125, 0.1);
          border: 1px solid #47A87D;
          color: #47A87D;
        }
      }
    }
  }
  /deep/ .el-dialog__wrapper {
      background: rgba(22, 47, 96, .5);
      display: flex;
  } 
  /deep/ .el-dialog {
      width: 570px;
      margin: auto!important;
  }  
  /deep/ .el-dialog .el-dialog__header {
    border: 1px solid #DCDFE6;

  }
  /deep/.el-dialog .el-dialog__body {
    padding: 20px;
  }
  /deep/.el-pagination__sizes .el-input .el-input__inner {
    width: 100px;
    height: 30px;
    border-radius: 0;
  }
}
</style>