<template>
  <div class='report-wrapper'>
    <!-- 标题 -->
    <div class="header">
        <span class='company-name'>{{ companyName }}</span>
        <div class="status" v-if="checkStatus === '审批中' || checkStatus === '审批通过'" :class="{statusChecking:checkStatus==='审批中',statusChecked:checkStatus==='审批通过'}">{{ checkStatus }}</div>
        <!-- <div class="status">{{ checkStatus }}11</div> -->
        <!-- 提示信息、审批状态 -->
        <div class="tips"><img :src='warningImg' class='tips-time-img' /> 变更时间为当天<span class='tips-time'>14:00</span>之前。</div>
    </div>
    <div class='line'></div>
    <!-- 计划日期 -->
    <span class='plan-date'><img :src='planDateImg' class='plan-date-img' />计划日期：{{ calcPlanDate }}</span>
    <!-- 表格 -->
    <div class="table-wrapper">
      <el-form :model='model' ref='form' :rules='rules'>
        <el-table 
            :data="model.list" 
            show-summary
            :summary-method='calcSummary'
            :span-method='mergeRow'
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            class="custom-table-n" 
            border
            ref='dayReportTable'
        >
            <el-table-column  label='序号' prop='id' type='index' :index='1' width='82'></el-table-column>
            <el-table-column  label='资源方' prop='resourcesName' width="150" show-overflow-tooltip></el-table-column>
            <el-table-column  label='月度合同日均量' prop='contractDayAverage' width='162'>
              <template slot-scope="scope">{{ reserveFourDecimal(scope.row.contractDayAverage) }}</template>
            </el-table-column>
            <el-table-column  label='剩余合同日均量' prop='remainingContractDayAverage' width='162'>
              <template slot-scope="scope">{{ reserveFourDecimal(scope.row.remainingContractDayAverage) }}</template>
            </el-table-column>
            <el-table-column  label='输气站场' prop='downGasPlace' width="133" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column  label='昨日交割量' prop='yesterdayGasPlan'>
              <template slot-scope="scope">{{ reserveFourDecimal(scope.row.yesterdayGasPlan) }}</template>
            </el-table-column> -->
            <el-table-column  label='日指定量' prop='dayNum' width="115" show-overflow-tooltip>
              <template slot-scope="scope">{{ reserveFourDecimal(scope.row.dayNum) }}</template>
            </el-table-column>
            <el-table-column  label='批复量' prop='dayNumReply' width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{ reserveFourDecimal(scope.row.dayNumReply) }}</template>
            </el-table-column>
            <el-table-column  label='变更量' prop='dayNumChange' width="150">
              <template slot-scope="scope">
                <el-form-item :prop="'list.'+scope.$index+'.dayNumChange'" :rules="rules.dayNumChange">
                  <el-input
                    v-if='!isDisabled' 
                    size='mini' 
                    v-model='scope.row.dayNumChange' 
                    :disabled='isDisabled'
                    v-on:input='handleInputChange(scope)'
                  ></el-input>
                  <div v-else>{{ scope.row.dayNumChange ? scope.row.dayNumChange : '-' }}</div>
                </el-form-item>                
              </template>
              
            </el-table-column>
            <el-table-column  label='变更批复量' prop='dayNumChangeReply' width="130" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="checkStatus === '新建' || checkStatus === '审批中'">-</span>    
                <span v-else>{{ reserveFourDecimal(scope.row.dayNumChangeReply) }}</span>         
              </template>
            </el-table-column>            
            <el-table-column  label='备注' prop='desc'>
              <template slot-scope='scope'>
                <el-input v-if='!isDisabled' size='mini' v-model="scope.row.desc" :disabled='isDisabled'></el-input>
                <div v-else>{{ scope.row.desc }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="98">
              <template slot-scope="scope">
                <span style="color: #aaa;">{{ scope.row.status === 5 ? '已驳回' : '' }}</span>
              </template>
            </el-table-column>
        </el-table>
      </el-form>
    </div>
    <!-- 底部按钮 -->
    <div class="buttons">
        <el-button :disabled="isDisabled" round class='btn-report' :type="btnType === 'report' ? 'primary' : '' " @click="handleReportAndSave('report')" v-trace="{title:'计划管理-日计划变更-点击确认上报'}" >确认上报</el-button>
        <el-button :disabled="isDisabled" round class='btn-save' :type="btnType === 'save' ? 'primary' : '' " @click="handleReportAndSave('save')" >暂存</el-button>
    </div>
  </div>
</template>

<script>
import api from 'src/http/api'
import dateFormater from '@components/dateFormater/dateFormater'
import { decimalMixin } from '@utils/mixin'

export default {
  name:'dayPlanReport',
  mixins:[dateFormater,decimalMixin],
  props: {
    currentType:String
  },
  data() {
    return {
      model:{
        list:[],
      },
      btnType:'report',       // 上报（report）或暂存按钮（change）
      uniqueResrouce:'',      // 存储资源方名称（数组中每个资源方名称都是唯一的，即去重后资源方）
      rowArr:[],
      checkStatus:null,       // 审批状态
      warningImg:require('@assets/img/warning@2x.png'),         // 警告图标
      planDateImg:require('@assets/img/calendar-2.png'),        // 计划日期图标     
      firstContractDayAverage:null,  // 列表中第一行contractDayAverage字段值，做为合并行数据
      firstRemainingContractDayAverage:null,  // 列表中第一行remainingContractDayAverage字段值，做为合并行数据
      // 表格中日指定量文本框验证规则
      rules: {
        dayNumChange:[
          {
            required:true,message:'请输入变更量',trigger:'change'
          }
        ]
      }
    }
  },
  computed:{
    // 获取公司名称（右上角下拉列表中公司名称）
    companyName() {
      return this.$store.getters.curComName
    },
    // 计划日期
    calcPlanDate() {
      let oneDayTimestamp = 24 * 60 * 60 *1000
      let tomorrowTimeStamp = Date.now()          // 今天
      let afterTomorrowTimeStamp = Date.now() + oneDayTimestamp     // 明天
      let str = `${this.getFormatDateDetail(tomorrowTimeStamp)}8:00-${this.getFormatDateDetail(afterTomorrowTimeStamp)}8:00`
      return str
    },
    // 公司编号
    companyCode() {
      return this.$store.getters.curCom
    },
    // 判断时间是否在14点之后
    judegTimeExceed14() {
      return new Date().getHours() >= 14
    },
    isDisabled() {
      return (this.checkStatus === '审批中' || this.checkStatus === '审批通过' ||  this.judegTimeExceed14) ? true :false
    }
  },
  methods: {
    // 请求接口，获取日计划上报列表
    getDayPlanReportList() {
      let params = {
        'compCode':this.$store.getters.curCom,
        'listFlag':1
      }
      api.planManagement.getDayPlanReportList(params).then(res => {
        this.model.list = res[0]
        this.model.list.map(item => {
          // item.yesterdayGasPlan =  item.yesterdayGasPlan === 0 ? '-' : item.yesterdayGasPlan
          // item.dayNum =  item.dayNum === 0 ? '-' : item.dayNum
          // item.dayNumReply =  item.dayNumReply === 0 ? '-' : item.dayNumReply
          // item.dayNumChangeReply =  item.dayNumChangeReply === 0 ? '-' : item.dayNumChangeReply
          item.contractDayAverage = item.contractDayAverage === null || item.contractDayAverage === 0 ? '-' : item.contractDayAverage
          item.remainingContractDayAverage = item.remainingContractDayAverage === null || item.remainingContractDayAverage === 0 ? '-' : item.remainingContractDayAverage          
        })
        // this.firstContractDayAverage = res[0][0].contractDayAverage
        // this.firstRemainingContractDayAverage = res[0][0].remainingContractDayAverage
        this.firstContractDayAverage = res[0][0].contractDayAverage === null || res[0][0].contractDayAverage === 0 ? '-' : res[0][0].contractDayAverage
        this.firstRemainingContractDayAverage = res[0][0].remainingContractDayAverage === null || res[0][0].remainingContractDayAverage === 0 ? '-' : res[0][0].remainingContractDayAverage        
        // 合并表格行
        this.calcMergeRow(this.model.list)
        // 判断审批状态
        // let status = res[0][0]['status']
        let status = this.model.list[0]['status']
        this.getCheckStatus(status)
      }).catch(err => {

      })
    },
    /* 判断审批状态
    上报审批状态：a 待审批对应以前的新建未审批；b 审批通过对应以前的新建已审批；c 以前的未创建状态，对应现在空白
    变更审批状态：a 待审批对应以前的变更未审批；b 审批通过对应以前的变更已审批；    
    接口返回状态：0:新建, 1：新建后未审批,2：新建后已审批,3：变更后未审批,4：变更后已审批 */
    getCheckStatus(status) {
        if(status === 2 ){
          this.checkStatus = '新建'
        }else if(status === 3) {
          this.checkStatus = '审批中'
        } else if(status === 4) {
          this.checkStatus = '审批通过'
        }  
    },
    // 合并表格中特定行
    mergeRow({row,column,rowIndex,columnIndex}) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
        const _row = this.rowArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    // 计算第2列（资源方）需要合并行的行数
    calcMergeRow(list) {
      let position
      this.rowArr = []
      list.forEach((item, index) => {
        if (index === 0) {
          this.rowArr.push(1)
          position = 0;
        } else {
          if (list[index]['resourcesName'] ===list[index - 1]['resourcesName']) {
            this.rowArr[position] += 1;
            this.rowArr.push(0);
          } else {
            this.rowArr.push(1);
            position = index;
          }
        }
      })
    },
    // 自定义表格合计方法
    calcSummary(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if(index === 2) {
            return sums[index] = this.firstContractDayAverage
          }
          if(index === 3) {
            return sums[index] = this.firstRemainingContractDayAverage === '-' ? '-' : this.reserveFourDecimal(parseFloat(this.firstRemainingContractDayAverage))
          }
          // 不计算合计的列
          if ([1,4,9].indexOf(index) != -1) {
            return
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return this.reserveFourDecimal(prev + curr);
              } else {
                return prev;
              }
            }, 0);
            // sums[index] += ' 元';
          } else {
            // sums[index] = 'N/A';   
            sums[index] = '';          
          }
        });
        if(sums[7] === 0) {
          sums[7] = ''
        }   
        if(sums[8] === 0) {
          sums[8] = ''
        }             
        return sums;
    }, 
    // 上报事件、暂存事件
    handleReportAndSave(type){
      this.$refs['form'].validate((valid) => {
        if(!valid) {
          if(!valid) {
            this.$message({
              message:'日指定量必须填写，请填写后再提交！',
              type:'warning'
            })
            return false
          }
        }else {
          window.zhuge.track('计划管理-日计划变更-点击确认上报')
          this.btnType = type
          let listCopy = JSON.parse(JSON.stringify(this.model.list))
          // 删除列表中不需要的元素，构造接口需要的数据
          let toDeleteKeys = ['contractDayAverage',
            'dayNumChangeReply',
            'dayNumReply',
            'downGasPlace',
            'remainingContractDayAverage',
            'resourcesName',
            'yesterdayGasPlan',
            'dayNum'
          ]
          listCopy.map(item => {
            item.status = this.btnType === 'report' ? 1 : 0       // 上报时状态为1，暂存时状态为0
            this.deleteKeys(item,toDeleteKeys)
          })
          // 调接口
          api.planManagement.dayPlanReportAndSave(listCopy).then(res => {
            if(res) {
              this.$message({
                'message':this.btnType === 'report' ? '上报成功' : '暂存成功',
                'type':'success'
              })
              this.getDayPlanReportList()
            }
          })          
        }
      })
    },
    // 删除对象中部分元素
    deleteKeys(obj,keys) {
      keys.map(key => delete obj[key])
    },
    // 文本框数据输入规则   
    handleInputChange(scope) {
      let dayNumChange = scope.row.dayNumChange.toString()
      dayNumChange = dayNumChange.toString()
      if (dayNumChange.match(/[^\d]/)) {
        dayNumChange = dayNumChange.replace(/[^\d.]/g, '') /* 如果输入的是非数字，则清空掉 */
        if(dayNumChange.indexOf('.') != -1) {      
          dayNumChange= dayNumChange.slice(0,dayNumChange.indexOf('.') + 5)          // 只保留4位小数
        }    
      } else {
          dayNumChange = dayNumChange && parseFloat(dayNumChange)
      }
      scope.row.dayNumChange = dayNumChange       // 绑定数据
    }    
  },
  watch: {
    companyCode() {
      // this.$refs.dayReportTable.doLayout()
      this.getDayPlanReportList()
    },
    currentType() {
      this.getDayPlanReportList()
    }
  },
  mounted() {
    // this.getUniqueResource()
    this.getDayPlanReportList()     
  },
  // 解决表格错位问题（切换右上角公司时，重新发送请求），但未解决---------------------------？？？？？？？？？？？？？？？？？？？
  updated() {
    this.$nextTick(() => {
      this.$refs.dayReportTable.doLayout()
    })
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.report-wrapper {
      width:calc(100% - 62px); 
      background: #fff;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      padding: 20px 30px;
      box-sizing: border-box;
      margin-top: 35px;
      margin-bottom: 48px;
      margin-left:32px;
      position: relative;
    .header {
          position: relative;
          font-size: 24px;
          font-weight: 500;
          margin-bottom: 28px;
          margin-bottom: 82px;;
          display: flex;
          .company-name{
              margin-right: 10px;
          }
        .status {
            border-radius: 23px;
            height:36px;
            text-align: center;
            line-height: 36px;
            font-size: 14px;
        }
        .statusChecking {
          background:rgba(237,123,26,.1);
          color:#ED7B1A;     
          width:82px;
     
        }
        .statusChecked {
          background:rgba(15,178,171,.1);
          color:#0FB2AB;
          width:96px;
        }        
        .tips {
            position:absolute;
            top:0;
            right:0;
            color: #FF523C;
            font-size:16px;
            font-weight: bold;
            .tips-time {
              font-size: 20px;
              font-weight: bold;
            }
            .tips-time-img {
              width:20px;
              height:18px;
              position: relative;
              top:3px;
              right:10px;
            }
        }
      }
    .line {
      border-bottom:1px solid #E5E5E5;
      width:100%;
      position: absolute;
      top:70px;
      left:0;
    }
    .plan-date {
      font-size: 16px;
      color:#505356;
      margin-top:25px;
      margin-bottom: 15px;
      .plan-date-img {
        width:15px;
        height:14px;
        margin-right: 10px;
        position:relative;
        top:2px;
      }    
    }
    .table-wrapper {
        /* 表格标题和数据居中对齐 */
        /deep/.el-table th > .cell {
          text-align: center;
        }
        /deep/.el-table .cell {
          text-align: center;
        }
        // 文本框未验证通过时提示文本的样式
        /deep/ .el-form-item__error {
          left:18px;
        }
        /deep/ .el-table__row {
          background: transparent;
        }  
        /deep/ .el-form-item {
          position: relative;
          top:10px;
        }         
        // 文本框样式
        /deep/ .el-form-item__content {
          position: relative;
          top:-4px;
          /* width:180px; */
          height:30px;
          line-height: 30px;
        }             
    }
    .buttons {
        text-align: center;
        margin-top:40px;
        .btn-report,.btn-save {
            width:140px;
            height:40px;
        }
        /deep/ .el-button--primary {
            background: #0FB2AB;
            color:#fff;
        }
        /deep/ .el-button--primary.is-disabled {
          background:#a0cfff;
        }
    }
}
</style>