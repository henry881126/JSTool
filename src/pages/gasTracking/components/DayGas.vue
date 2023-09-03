<template>
  <div class="day-gas-container">
    <div class="content-wrapper">
      <div class="header-wrapper">
        <div class="title">{{ this.formData.time | convertDate(this.formData.time) }}</div>
        <el-button @click="exportMessage" round type="primary" class="export-btn" icon="el-icon-upload2">导出</el-button>
      </div>

      <el-table 
        :data="list"
        header-row-class-name="custom-table-header"
        header-cell-class-name="custom-table-header-cell"
        cell-class-name="custom-table-cell"
        class="table-wrapper custom-table-n"
        border
      >
        <el-table-column label="客户名称" min-width="400" show-overflow-tooltip="">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.contractType === '1'" class="tag-daishu">代输</el-tag>
            <el-tag v-else-if="scope.row.contractType === '2'" class="tag-sanfang">代销</el-tag>
            <el-tag v-else-if="scope.row.contractType === '3'" class="tag-zhixiao">直销</el-tag>
            <el-tag v-else class="tag-daishu">多种</el-tag>
            <span>{{scope.row.customerName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="replyVolume" label="批复量(方)" min-width="130" align="right"></el-table-column>
        <el-table-column prop="extractVolume" label="提取量(方)" min-width="130" align="right"></el-table-column>
        <el-table-column prop="offsetVolume" label="偏差量(方)" min-width="130" align="right">
          <template slot-scope="{row}">
            <span v-if="row.offsetVolume > 0" style="color:#F56C6C;">+{{ row.offsetVolume}}</span>
            <span v-if="row.offsetVolume === 0" style="color:#000;">{{ row.offsetVolume}}</span>
            <span v-if="row.offsetVolume < 0" style="color:#67C23A;">{{ row.offsetVolume}}</span>
          </template>
        </el-table-column>
        <el-table-column label="偏差率" min-width="130" align="right">
          <template slot-scope="{row}">
            <span v-if="row.offsetVolume > 0" style="color:#F56C6C;">+{{ row.offsetRate}}%</span>
            <span v-if="row.offsetVolume === 0" style="color:#000;">{{ row.offsetRate}}%</span>
            <span v-if="row.offsetVolume < 0" style="color:#67C23A;">{{ row.offsetRate}}%</span>
          </template> 
        </el-table-column>
      </el-table>
      <el-pagination background class="custom-page-n" layout="total, slot, prev, pager, next, sizes" :current-page="pager.currentPage" :page-size="pager.pageSize" :page-sizes="[10,20,30]" :total="pager.totalPage" @current-change="handleCurrentChangeEvent" @size-change="handleSizeChange"><span style="color:#606266;">当前{{this.list.length}}条</span></el-pagination>
    </div>
  </div>
</template>

<script>
import api from '/src/http/api'
import exportApi from '/src/components/export/export'

export default {
  mixins:[exportApi],

  data() {
    return {
      id: null, // 记录ID
      list: [],
      pager: {
        currentPage: 1,
        pageSize: 10,
        totalPage: null,
      },
      contentOfSendMessage: '',
      contentOfVoidMessage: '',
      contentOfBatchSendMessage: '',
    }
  },
  props: {
    formData: {
      type: Object
    }
  },
  computed: {
    curCom() {
      return this.$store.getters.curCom
    }
  },
  filters: {
    convertDate(item) {
      const arr = item.split('-')
      return arr[0] + '年' + arr[1] + '月' + arr[2] + '日'
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
    },    
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const params = {
        code: this.$store.getters.curCom,
        currentPage: this.pager.currentPage,
        pageSize: this.pager.pageSize,
        orgLevel: this.$store.getters.curComInfo.orgLevel,
        ...this.formData
      }
      api.gasTracking.day.getDayGasTrackingList(params).then(res => {
        console.log('res:', res)
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
      api.gasTracking.day.export(params).then(res => {
        this.download(res, 'xlsx', '用气执行跟踪 日 导出')
      })
        console.log('export')
    },

    // 分页
    handleCurrentChangeEvent(currentPage) {
      this.pager.currentPage = currentPage;
      this.getList();
    },
    // 调整每页显示数量
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.pager.currentPage = 1
      this.getList()
    },
    // 获取当前日期
    getCurrentDate() {
      const d = new Date()
      return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDay()
    }    
  }
};
</script>

<style lang='scss' scoped>
@import '../css/customer_public_css.scss';
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
        border: 1px solid #E6A23C;
        font-size:14px;
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
    /deep/.el-pagination__sizes .el-input .el-input__inner {
      width: 100px;
      height: 30px;
      border-radius: 0;
    }
  }
</style>