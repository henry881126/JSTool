<template>
  <div class="container gas-page-bg">
    <top-menu title="天然气输配(调度)智慧管理平台"></top-menu>
    <div class="breadcrumb-wrapper">
      <el-breadcrumb>
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>消息管理</el-breadcrumb-item>
        <el-breadcrumb-item>规则设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>    
    <div class="form-wrapper">
      <div class="title-wrapper">
        <span class="back" @click="goBack"><i class="el-icon-back"></i> 返回</span>
        <span class="line">|</span>
        <span class="title" v-if="this.$route.params.formData">查看提醒规则</span>
        <span class="title" v-else>新增提醒规则</span>
      </div>
      <el-form label-width="120px" class="form" ref="addForm">
        <el-row class='area-bg1'>
          <el-form-item label="规则名称：">
            <el-col :span="6">
              <span class="form-element-txt">{{formData.name}}</span>
            </el-col>
          </el-form-item>

          <el-form-item label="备注说明：">
            <span class="form-element-txt">{{formData.ruleDesc}}</span>
          </el-form-item>
        </el-row>

        <el-row class="area-bg2">
          <div class="area-title">
            <span class="line"></span> 
            <span class="title">适用模板</span>
          </div>
          <el-form-item label="消息模板：">
            <span class="form-element-txt">{{getCurrentMessageTemplate}}</span>
          </el-form-item>        
        </el-row>

        <el-row class="area-bg2">
          <div class="area-title">
            <span class="line"></span> 
            <span class="title">适用客户</span>
          </div>
          <el-col :span="8">
            <el-form-item label="客户所属组织：">
              <span class="form-element-txt">{{formData.receiveCode}}</span>
            </el-form-item>            
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同类型：">
              <span class="form-element-txt">{{formData.receiveContractType === "1" ? "代输" : formData.receiveContractType === "2" ? "代销" : "直销"}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户类型：">
              <span class="form-element-txt">{{formData.receiveCustomerType === "01" ? "工业" : formData.receiveCustomerType === "03" ? "商业" : formData.receiveCustomerType === "02" ? "福利" : "园区"}}</span>
            </el-form-item>
          </el-col>          
        </el-row>

        <el-row class="area-bg2" v-if="isShowJudegConditionArea">
          <div class="area-title">
            <span class="line"></span> 
            <span class="title">判断条件</span>
          </div>
            <el-form-item label="判断条件：">
              <span class="form-element-txt">{{formData.rconditions === "1" ? "代输/代销预警规则" : "直销预警规则"}}</span>
            </el-form-item>
        </el-row>
        <el-row class="area-bg2">
          <div class="area-title">
            <span class="line"></span> 
            <span class="title">发送条件</span>
          </div>
          <el-form-item label="发送方式：">
            <span class="form-element-txt">{{formData.sendWay === 1 ? "自动" : "手动"}}</span>
          </el-form-item>
          <el-col :span="8">
            <el-form-item label="执行周期：">
              <span class="form-element-txt">{{formData.sendType === "1" ? "每日" : formData.sendType === "2" ? "每周晚上2点" : formData.sendType === "3" ? "每月" : "每日计量时间后两小时5每月计量时间后一天凌晨2点"}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="起始时间(每日)：">
              <span class="form-element-txt">{{getStartTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '/src/http/api'
import TopMenu from '@components/topMenu/topMenu2'
import axios from 'axios'

export default {
  components: {
    TopMenu
  },
  data() {
    return {
      isVisible: false,
      formData: {
        name: '',
        sendWay: '',  // 发送方式 1 自动 2 手动
        sendType: '', // 1:每日 2：每周晚上2点 3每月 4：每日计量时间后两小时5每月计量时间后一天凌晨2点
        sendTime: '', // 只存数字 例如：每日8点：8
        receiveContractType: '',  // 合同类型: 1 代输 2 三方 3 直销
        receiveCustomerType: '',  // 客户类型: 01 工业 02 商业 03 福利 07 园区
        rconditions: '',  // 判断条件
        ruleDesc: '', // 备注说明
        messageId: '',  // 消息模板
        receiveCode: '', // 客户所属组织
        code: this.$store.getters['curCom'],
        rstatus: '',
      },
      messageTemplateList: [],  // 存储消息模板列表
      conditionOfSendType: '',  // 发送方式显隐规则（空时：手动，非空时：手动、自动）
      defaultProps: {
        label: 'orgName',
        children: 'orgChildren',
        disabled: 'selectable'
      },
      label: '',
      value: '',
      node:  {},
      currentOrgName: '',
      isShowJudegConditionArea: false, // 是否显示判断条件区域（在消息模板下拉列表中选择“月用气分析通知”项时，显示判断条件区域）
    }
  },
  computed: {
    treeData: {
      get () {
        return this.$store.getters.companyList === '' ? [] : this.$store.getters.companyList
      }
    },
    // 获取发送条件区域中的起始赶时间
    getStartTime() {
      const obj = {
        "2": "02:00",
        "4": "04:00",
        "6": "06:00",
        "7": "08:00",
        "10": "10:00",
        "12": "12:00",
        "14": "14:00",
        "16": "16:00",
        "18": "18:00",
        "20": "20:00",
        "22": "客户计量时间前两小时",
        "24": "客户计量时间后两小时",
      }
      let currentObj =''
      Object.keys(obj).forEach(key => {
        if(key === this.formData.sendTime) {
          currentObj = obj[key]
        }
      })
      return currentObj
    },
    // 获取消息模板
    getCurrentMessageTemplate() {
      let messageTemplateTxt = []
      if(this.messageTemplateList && this.messageTemplateList.length > 0) {
        messageTemplateTxt =this.messageTemplateList.find(item => item.id === this.formData.messageId).mTitle
      }
      return messageTemplateTxt
    }
  },
  created() {
    this.getMessageTemplate()
    let formData = null
    if(this.$route.params.formData) {
      formData = this.$route.params.formData
      window.localStorage.setItem('messageManagementFormData', JSON.stringify(this.$route.params.formData))
    } else {
      formData = JSON.parse(window.localStorage.getItem('messageManagementFormData'))
    }
    this.formData = formData
    // console.log('this.formData:', this.formData)
    // 进入编辑页面后，判断是否显示判断条件区域（如果messageId的值为88，即月用气分析通知，则显示判断条件区域）
    if(formData.messageId && formData.messageId === 88) {
      this.isShowJudegConditionArea = true
    }
    this.formData.receiveContractType = this.formData.receiveContractType.toString()
    this.formData.receiveCustomerType = this.formData.receiveCustomerType.toString()
    if(this.formData.sendType) {
      this.formData.sendType = this.formData.sendType.toString()
    }
    // 将接口返回的receiveCode由code值转换成label值（汉字），展示给用户
    this.recursionTree(this.treeData, this.formData.receiveCode)
    this.formData.receiveCode = this.currentOrgName
  },
  // 离开页面前清除缓存
  beforeRouteLeave(to, from, next) {
    window.localStorage.removeItem('messageManagementFormData')
    next()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 获取消息模板（消息模板下拉列表用）--------------------------------------------------------------------------------------------------------------
    getMessageTemplate() {
      const params = {
        code: this.$store.getters.curCom
      }
      api.messageManagement.messageTemplate.getAllTemplate(params).then(res => {
        this.messageTemplateList = res[0]
        // 在编辑状态下，如果消息模板有值，则调用 handleMessageTemplateChangeEvent 处理发送方式（显隐发送方式）
        if(this.$route.params.formData && this.$route.params.formData.messageId) {
          this.handleMessageTemplateChangeEvent(this.formData.messageId)
        }
      })
    },
    // 消息模板下拉列表 change 事件
    handleMessageTemplateChangeEvent(e) {
      // 获取消息模板下拉列表中数据的knBcDictionaryId值
      const midArr = this.messageTemplateList.find(item => item.id === e)
      const knBcDictionaryId = midArr['knBcDictionaryId']
      // 当用户从消息模板下拉框中选择了“月用气分析通知”项时，其knBcDictionaryId值是20715，此时显示判断条件区域，否则隐藏判断条件区域
      if(knBcDictionaryId === 20715) {
        this.isShowJudegConditionArea = true
      } else {
        this.isShowJudegConditionArea = false
      }      
      axios.post(
        '/htapi/api/v1/crm/api/systemMgr/dictionarys',
        {
          dicPid: knBcDictionaryId
        }
      ).then(res => {
        if(res.data.result && res.data.result.length > 0) {
          this.conditionOfSendType = '1'  // 非空
        } else {
          this.conditionOfSendType = '0'  // 空
        }
      })
    },
    // 递归treeData，通过orgCode获取orgName
    recursionTree(tree, code) {
      tree.map(item => {
        if(item.orgCode === code) {
          this.currentOrgName = item.orgName
          return
        }
        if(item.orgChildren && item.orgChildren.length > 0) {
          this.recursionTree(item.orgChildren, code)
        }
      })
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../css/customer_public_css.scss';
.container {
  min-width: auto;
  // 启用按钮可用时样式
  /deep/.el-button--primary {
      color: #fff;
      background: #47A87D;
  }
  /* 面包屑导航样式 */
  .breadcrumb-wrapper {
    margin: 10px 0 10px 20px;
    /deep/ .el-breadcrumb__item:last-child > .el-breadcrumb__inner {
      color: #fff;
    }
    /deep/ .el-breadcrumb__inner {
      color: rgba(255, 255, 255, 0.5);
    }
  }    
  .header {}
  .form-wrapper {
    background: #fff;
    margin: 8px 20px;
    margin-bottom: 80px;
    border-radius: 4px;
    overflow: hidden;
    .area-title {
      display: flex;
      align-items: center;
      font-weight: bolder;
      .line {
        width: 4px;
        height: 16px;
        background:#47A87D;
        display: inline-block;
        text-align: center;
        margin-right: 5px;
      }
      .title {
        color: #303133;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .title-wrapper {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ccc;
      padding: 20px 22.5px;
      .back{
        cursor: pointer;
        font-size: 18px;
        font-weight: 400;
        color: #409EFF;
        .el-icon-back {
          margin-right: 7px;
          font-weight: bold;
        }
      }
      .line {
        margin: 0 20px;
      }
      .title {
        font-size: 18px;
        font-weight: 500;
      }
    }
    .form {
      /deep/.el-form-item {
        margin: 20px 0 0 0;
      }        
      .area-bg1 {
        margin: 14px 20px 20px 20px;
        padding: 20px;
        background: #F5F7FA;
        border-radius: 4px;
        .el-form-item:nth-child(1) {
          margin: 0px;
        }
      }
      .area-bg2 {
        margin: 20px;
        padding: 20px;
        background: #F5F7FA;
        border-radius: 4px;
      }    
      .form-element-txt {
        color: #303133;
      }  
    }
  }
}
</style>