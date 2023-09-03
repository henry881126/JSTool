<template>
  <div class="container gas-page-bg">
    <top-menu title="天然气输配(调度)智慧管理平台"></top-menu>
    
    <div class="breadcrumb-wrapper">
      <el-breadcrumb>
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用气执行跟踪</el-breadcrumb-item>
      </el-breadcrumb>
    </div>  

    <div class="content-wrapper">
        <div class="header-wrapper">
            <div class="title">用气执行跟踪</div>
            <el-button circle class="day" @click="handleDateClickEvent('day') " :type="buttonType === 'day' ? 'primary' : '' ">日</el-button>
            <el-button circle class="month" @click="handleDateClickEvent('month')" :type="buttonType === 'month' ? 'primary' : '' ">月</el-button>
            <div class="search-wrapper">
                <el-form :inline="true" :model="formData" >
                    <el-form-item>
                        <el-date-picker 
                          v-model="formData.time" 
                          :type="datePickerType" 
                          :format="datePickerFormat"
                          :clearable="false"
                          :key="datePickerKey"
                          :picker-options="pickOptions"
                          value-format="yyyy-MM-dd"
                          >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formData.customerName" placeholder="请输入客户名称" :clearable="true" prefix-icon="el-icon-search"></el-input>
                    </el-form-item>                    
                    <el-form-item>
                    <el-select v-model="formData.contractType" placeholder="合同类型" :clearable="true">
                        <el-option value="1" label="代输"></el-option>
                        <el-option value="2" label="代销"></el-option>
                        <el-option value="3" label="直销"></el-option>
                    </el-select>
                    </el-form-item>

                </el-form>
            </div>
        </div>
        <div class="content-body-wrapper">
            <component :is="compType" :formData="formData"></component>
        </div>
    </div>  
  </div>
</template>

<script>
import TopMenu from '@components/topMenu/topMenu2'
import DayGas from './components/DayGas.vue'
import MonthGas from './components/MonthGas.vue'
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'

export default {
  components: {
    TopMenu,
    DayGas,
    MonthGas
  },
  mixins: [buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
  data() {
    const oneDay = 24 * 60 * 60 * 1000
    return {
      compType:'dayGas',    // 组件类型，默认为日组件，dayGas:日组件，monthGas:月组件,
      buttonType: 'day', // 按钮类型，primary 或 空
      datePickerType: 'date', // datePicker类型
      datePickerKey: 'date', // datePicker日期选项器的key，使用key解决切换日期选择器类型时产生的问题（切换类型后在垂直方向上挤走了下面的列表）
      datePickerFormat: 'yyyy/MM/dd', // datePicker数据显示格式
      defaultVal:new Date(),
      formData: {
        time: this.convertTimestampToDate(new Date() - oneDay),
        customerName: '',
        contractType:''
      },
      pickOptions: {
        disabledDate(currentDate) {
          const oneDay = 24 * 60 * 60 * 1000
          return currentDate > new Date()
        }
      }
    }
  },
  computed: {
    customerDate() {
      return this.formData.time
    }
  },
  watch: {
    // 监听日期选择器，如果日期为空（单击日期选择器右侧清空按钮时，值会设置为null），则绑定当前日期
    customerDate(n) {
      if(!n) {
       this.formData.time = new Date() 
      }
    }
  },
  methods: {
    handleDatePickerChangeEvent() {
      this.formData.time = this.convertTimestampToDate(this.formData.time)
    },
    // 将时间戳转换成中划线分隔的年月日，格式： 2021-09-03
    convertTimestampToDate(time) {
      console.log("timeeeeeeeee:",time)
      let d = new Date(time)
      let y = d.getFullYear()
      let m = d.getMonth() + 1
      let day = d.getDate()
      m = m.toString().padStart(2, '0')
      day = day.toString().padStart(2, '0')
      const customerDate = `${y}-${m}-${day}`
      console.log("y3:",y,"m3:",m,"d3:",day,customerDate)
      return customerDate
    },  
    // 切换日、月（单击日或月按钮）事件
    handleDateClickEvent(type) {
      if(type === 'day') {
        this.compType = 'dayGas'
        this.buttonType='day' 
        // 单击 日 按钮，设置日期选择器为日期型
        this.datePickerType = 'date'
        this.datePickerKey = 'date'
        this.datePickerFormat = "yyyy/MM/dd"            
      } else {
        this.compType = 'monthGas'
        this.buttonType='month'
        // 单击 月 按钮，设置日期选择器为month型
        this.datePickerType = 'month'
        this.datePickerKey = 'month'
        this.datePickerFormat = "yyyy/MM"        
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import './css/customer_public_css.scss';

.container {
    min-width: auto!important;
  .breadcrumb-wrapper {
    margin: 10px 20px 0 20px;
    /deep/ .el-breadcrumb__item:last-child > .el-breadcrumb__inner {
      color: #fff;
    }
    /deep/ .el-breadcrumb__inner {
      color: rgba(255, 255, 255, 0.5);
    }
  }     
  .content-wrapper {
    background: #fff;
    border-radius: 4px;
    margin: 10px 20px 20px 20px;
    .header-wrapper {
      display: flex;
      /* align-items: center; */
      color:red;
      padding: 20px 0 0 20px;
      .title {
        color: #303133;
        font-size: 18px;
        font-weight: 500;
        margin-right: 39px;
        position: relative;
        top: 3px;
      }
      .day {
        margin-right: 10px;
        width: 32px;
        height: 32px;
        text-align: center;
        padding: 0;
        &.el-button--primary {
          background: #47A87D;
          border: none;
        }
      }
      .month {
        margin: 0;
        margin-right: 10px;
        width: 32px;
        height: 32px;
        padding: 0;
        text-align: center;
        &.el-button--primary {
          background: #47A87D;
          border: none;
        }        
      }      
      .search-wrapper {
        margin: 0;
        margin-top: -4px;
        padding: 0;
          .search-input {
            width: 240px;
            padding: 6px, 0px, 6px, 0px;
          }  
          /deep/ .el-input__inner {
            border-radius: 40px;
            background: #F5F7FA;
            border: 1px solid #DCDFE6;
            height: 32px;
          }
      }
    }
    .content-body-wrapper {
      padding: 0px 20px 20px 20px;
    }
  }
}
</style>