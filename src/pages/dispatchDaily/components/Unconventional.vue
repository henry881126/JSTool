<template>
  <div class="container">
    <div class="talbe-wrapper">
      <div class="header">
        <div class="unit">单位：万方</div>
        <div 
          class='export' 
          @click='handleExport' 
        >
          <img :src="exportImg" class='export-img' /> 导出
        </div>
      </div>
      <div class="table">
        <el-table
          :span-method="handleSpanMethod"
          :data="list"
          stripe
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          class="custom-table-r">
          <el-table-column prop="enterpriseName" label="企业" align="center" />
          <el-table-column prop="enterpriseGas" label="气量" align="center" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.opt === '详情'">
                <router-link tag="p" :to="{name:'unconventionalDailyDetail', params:{date:date,pid:0}}"><span class="detail">详情</span></router-link>
              </div>
              <div v-else>{{ scope.row.opt }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 导出确认对话框 -->
    <el-dialog
        title="导出数据"
        :visible.sync="confirmDialogVisible"
        class="custom-dialog"
        width="30%">
        <div style="margin-bottom:10px;"><el-radio v-model="radioValue" label="0">当前时间：{{ date }}</el-radio></div>
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
import api from '/src/http/api'
import exportApi from '/src/components/export/export'

export default {
    mixins:[exportApi],
    data() {
      return {
        list: [],
        exportImg:require('@assets/img/export@2x.png'),          // 导出按钮用图标
        spanArr: [],
        position: 0,
        confirmDialogVisible: false, // 控制导出dialog显隐
        radioValue: '1',  // 导出dialog中单选按钮绑定数据
      }
    },
    props: {
      date: {
        type: [String, Date, Number]
      },
      curComcode: {
        type: String
      }
    },
    watch: {
      date() {
        this.getData()
      },
      curComcode() {
        this.getData()
      }
    },    
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        const params = {
          date: this.date,
          xaReig: this.$store.getters['curCom']
        }
        api.dispatchDaily.getSupplyGasDailyList(params).then(res => {
          this.list = res[0]
          // 处理this.list，增加opt列，设置首先opt列为“-”，如果尾行是“客户合计”，则尾行opt列也设置为“-”，其余行opt列设置为“详情”
          const len = this.list.length
          this.list.map((item, index) => {
            if (index === 0) {
              this.list[index].opt = '-'
            }
            if (index > 0) {
              this.list[index].opt = '详情'
            }
            if(index === len - 1) {
              if(this.list[len-1].enterpriseName === '客户合计') {
                this.list[len-1].opt = '-'
              }   
            }                   
          })
          this.rowspan()  // 调用rowSpan，计算合并行列时的rowspan、colspan
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
          date: this.date,    // 导出年时，date参数可传任意值，后端会根据flag值获取当年数据，所以这里不处理选择年时date参数的值
          xaReig: this.$store.getters['curCom']
        }
        this.confirmDialogVisible = false
        api.dispatchDaily.unconventionExport(params).then(res => {
          if(res) {
            loading.close()
            this.download(res, 'xlsx', '非常规管道气日报')
          }
        })        
      },
      // 表格行列合并规则：{ rowspan: 0,colspan: 0, } 隐藏该单元格，{ rowspan: 1,colspan: 1, } 合并一行一列，{rowsapn:2, colspan:1} 该行合并两行、列不合并
      handleSpanMethod({ row, column, rowIndex, columnIndex}) {
        if (columnIndex === 2) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },
      // 计算合并行时rowspan、colspan值
      rowspan() {
        this.spanArr = []
        this.position = 0
        this.list.forEach((item,index) => {
          if( index === 0){
            this.spanArr.push(1);
            this.position = 0;
          }else{
            if(this.list[index].opt === this.list[index-1].opt ){
              this.spanArr[this.position] += 1;
              this.spanArr.push(0);
            }else{
              this.spanArr.push(1);
              this.position = index;
            }
          }
        })
      }
    }
}
</script>

<style lang='scss' scoped>
.container {
  .talbe-wrapper {
    padding: 0 24px;
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
    .table {
      padding-bottom: 24px;
      .detail {
        font-size:16px;
        color: #3480FF;
        font-weight: 600;
        cursor: pointer;
      }
    }
  }
}
</style>