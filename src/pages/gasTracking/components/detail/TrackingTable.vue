<template>
  <div class="container">
      <el-table 
        :data="list" 
        max-height="520"
        header-row-class-name="custom-table-header"
        header-cell-class-name="custom-table-header-cell"
        cell-class-name="custom-table-cell"
        border
        class="table-wrapper custom-table-n"        
      >
          <!-- <div v-for="(item, key) in headerArr" :key="key">
              <el-table-column :prop="key" :label="item"></el-table-column>
          </div> -->
          <el-table-column prop="time" label="用气时段"></el-table-column>
          <el-table-column prop="contractGasNum" label="月计划量"></el-table-column>
          <el-table-column v-for="(item,index) in headerGasArr" :key="index"  :label="item.val" :prop="item.key"></el-table-column>            
          <el-table-column prop="extractVolume" label="日提取量"></el-table-column>
          <el-table-column prop="offsetVolume" label="当日偏差量"></el-table-column>
          <el-table-column label="当日偏差率">
            <template slot-scope="scope">{{scope.row.offsetRate}}%</template>
          </el-table-column>
          <el-table-column prop="yujing" label="预警情况" width="150">
            <template slot-scope="scope">
              <div class="early-wraning-btn-wrapper">
                <i v-if="scope.row.isRead === '0' && !(scope.row.warningTag === '' || scope.row.warningTag === null)" class="el-icon-warning" />
                <i v-if="scope.row.isRead === '1' && !(scope.row.warningTag === '' || scope.row.warningTag === null)" class="el-icon-success" />
                <img v-if="scope.row.isRead === '-1' && !(scope.row.warningTag === '' || scope.row.warningTag === null)" :src="require('@/assets/img/position.png')" style="padding-right: 8px;position: relative;top: 2px;" />
                <div class="early-wraning-btn" v-if="scope.row.isRead !== '-1' && !(scope.row.warningTag === '' || scope.row.warningTag === null)">{{ scope.row.warningTag }}</div>  

                <div class="early-wraning-btn" v-if="scope.row.isRead === '-1' && !(scope.row.warningTag === '' || scope.row.warningTag === null) && !isHistoryDate(scope.row.time)" style="background: #409EFF; color: #fff;">{{ scope.row.warningTag }}</div>   
                <div class="early-wraning-btn" v-if="scope.row.isRead === '-1' && !(scope.row.warningTag === '' || scope.row.warningTag === null) && isHistoryDate(scope.row.time)" style="background: #F5F7FA; color: #606266;">{{ scope.row.warningTag }}</div>   

                <div v-if="scope.row.warningTag === '' || scope.row.warningTag === null" style="color: #aaa;">-</div>   
              </div>
            </template>
          </el-table-column>          
      </el-table>
  </div>
</template>

<script>
import api from '/src/http/api'

export default {
    data() {
        return {
          headerArr: [],
          list: [],
          headerGasArr: [], // 将接口返回的表头数据中以gas开头的数据存储到此数组中（接口可能返回gas0、gas1、gas2...gasN，数量不确定，但名称均以gas开头，为形成动态数据，故需做此处理）
        }
    },
    props: {
        currentRecord:Object
    },
    computed: {
      // 判断当前记录是否是历史日期（昨天或昨天之前即是历史日期）
      isHistoryDate() {
        return (d) => {
          const currentDateTimestamp = new Date().setHours(0,0,0,0) // 当天0点0时0分0秒的时间戳
          const currentRecordTimestamp = new Date(d).getTime()  // 当前记录时间戳
          if(currentDateTimestamp -  currentRecordTimestamp > 0) {
            return true
          } else {
            return false
          }
        }
      }
    },
    created() {
      this.getList()
    },
    watch: {
      currentRecord() {
        this.getList()
      }
    },
    methods: {
      getList() {
        this.headerGasArr = []
        console.log('childrne:', this.currentRecord)
        const params= {
          bp: this.currentRecord.customerCode,
          time: this.currentRecord.time,
          type: 1
        }
        api.gasTracking.month.getMonthGasTrackingDetail(params).then(res => {
          this.headerArr = res[0][0]
          // 将接口返回的数量、名称不固定的字段（gas0、gas1、gas2...gasN）存储到headerGasArr数组中
          for(let key in res[0][0]) {
            if(key.indexOf('gas') !== -1) {
              this.headerGasArr.push({
                key: key,
                val: res[0][0][key]
              })
            }
          }
          this.list = res[0].slice(1)
        })
      },
      showEarlyWraningDialog() {
        console.log(1)
      }
    }
}
</script>

<style lang='scss' scoped>
@import '../../css/customer_public_css.scss';
.container {
  .table-wrapper  {
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

  }
}
</style>