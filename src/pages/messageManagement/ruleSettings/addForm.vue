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
        <span class="title" v-if="this.$route.params.formData">编辑提醒规则</span>
        <span class="title" v-else>新增提醒规则</span>
      </div>
      <el-form :model="formData" label-width="120px" class="form" :rules="rules" ref="addForm">
        <el-row class='area-bg1'>
          <el-form-item 
            label="规则名称"
            prop="name"
          >
            <el-col :span="6">
              <el-input v-model="formData.name" type="text" placeholder="请输入规则名称" :clearable="true" />
            </el-col>
          </el-form-item>

          <el-form-item label="备注说明">
            <el-input type="textarea" rows="5" placeholder="请输入备注说明" v-model="formData.ruleDesc" maxlength="500" show-word-limit :clearable="true" />
          </el-form-item>
        </el-row>

        <el-row class="area-bg2">
          <div class="area-title">
            <span class="line"></span> 
            <span class="title">适用模板</span>
          </div>
          <el-form-item label="消息模板" prop="messageId">
            <el-select v-model="formData.messageId" @change="(value) => handleMessageTemplateChangeEvent(value, true)" placeholder="请选择消息模板" :clearable="true" @clear="handleClearEvent">
              <el-option 
                v-for="item in messageTemplateList" 
                :label="item.mTitle" 
                :value="item.id" 
                :key="item.id">
              </el-option>
            </el-select>
            <div span class="tip">未选择到需要的消息模板，点击此处</span><router-link tag="a" class="tip-link" :to="{name: 'addMessageTemplate'}">创建消息模板</router-link></div>
          </el-form-item>        
        </el-row>

        <el-row class="area-bg2">
          <div class="area-title">
            <span class="line"></span> 
            <span class="title">适用客户</span>
          </div>
          <el-col :span="8">
            <el-form-item label="客户所属组织">
              <el-select v-model="formData.receiveCode" :clearable="true">
                <el-option :value="node" style="height: auto;">
                  <el-tree 
                    @node-click="handleNodeClickEvent" 
                    :data="treeData" 
                    :props="defaultProps" 
                    :default-expand-all="true" 
                    :expand-on-click-node="false"
                    node-key="orgCode" 
                    class="customer-tree"></el-tree>
                </el-option>
              </el-select>
            </el-form-item>            
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同类型">
              <el-select v-model="formData.receiveContractType" :clearable="true">
                <el-option label="代输" value="1"></el-option>
                <el-option label="代销" value="2"></el-option>
                <el-option label="直销" value="3" v-if="isVisibleOfContractType"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户类型">
              <el-select v-model="formData.receiveCustomerType" :clearable="true">
                <el-option label="工业" value="01"></el-option>
                <el-option label="商业" value="03"></el-option>
                <el-option label="福利" value="02"></el-option>
                <el-option label="园区" value="07"></el-option>
              </el-select>
            </el-form-item>
          </el-col>          
        </el-row>

        <el-row class="area-bg2" v-if="isShowJudegConditionArea">
          <div class="area-title">
            <span class="line"></span> 
            <span class="title">判断条件</span>
          </div>
            <el-form-item label="判断条件">
              <el-select v-model="formData.rconditions">
                <el-option label="代输/代销预警规则" value="1"></el-option>
                <el-option label="直销预警规则" value="2"></el-option>
              </el-select>
              <div class="tip">备注：具体计算公司为实际剩余天数 × 日均用气量>剩余气量，超提预警：实际剩余天数×日均用气量<剩余气量，欠提预警；</div>
            </el-form-item>
        </el-row>
        <el-row class="area-bg2">
          <div class="area-title">
            <span class="line"></span> 
            <span class="title">发送条件</span>
          </div>
          <el-form-item label="发送方式">
            <el-radio-group v-model="formData.sendWay" v-if="isVisibleOfSendWay">
              <el-radio :label="1" border size="small" v-show="conditionOfSendType === '1'">自动</el-radio>
              <el-radio :label="2" border size="small" v-show="conditionOfSendType === '0' || conditionOfSendType === '1'">手动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row v-if="formData.sendWay === 1">
            <el-col :span="8">
              <el-form-item label="执行周期">
                <el-select v-model="formData.sendType" :clearable="true">
                  <el-option label="每日" value="1"></el-option>
                  <el-option label="每周" value="2"></el-option>
                  <el-option label="每月" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="起始时间(每日)">
                <el-select v-model="formData.sendTime" :clearable="true">
                  <el-option label="00:00" value="0"></el-option>
                  <el-option label="02:00" value="2"></el-option>
                  <el-option label="04:00" value="4"></el-option>
                  <el-option label="06:00" value="6"></el-option>
                  <el-option label="08:00" value="7"></el-option>
                  <el-option label="10:00" value="10"></el-option>
                  <el-option label="12:00" value="12"></el-option>
                  <el-option label="14:00" value="14"></el-option>
                  <el-option label="16:00" value="16"></el-option>
                  <el-option label="18:00" value="18"></el-option>
                  <el-option label="20:00" value="20"></el-option>
                  <el-option label="客户计量时间后两小时" value="24"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </div>
    <div class="footer">
      <el-button class="btn" round @click="saveRuleMessage('save')">保存</el-button>
      <!-- <el-button class="btn" type="primary" round @click="saveRuleMessage('enable')" :disabled="formData.rstatus === 1" v-if="formType">启用</el-button> -->
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
      isVisibleOfSendWay: true, // 发送方式区域显隐
      isVisibleOfContractType: true,  // 当为false时，则隐藏合同类型下拉列表中直销选项
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
      rules: {
        name: [
          {
            required:true, message:'请输入规则名称', trigger:'blur'
          }
        ],
        messageId: [
          {
            required:true, message:'请选择消息模板', trigger:'change'
          }
        ],
        // rconditions: [
        //   {
        //     required:true, message:'请选择判断条件', trigger:'blur'
        //   }
        // ]
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
    // 判断是添加表单或编辑表单，true：编辑表单，false：添加表单
    formType() {
      return this.$route.params.formData
    },
    treeData: {
      get () {
        return this.$store.getters.companyList === '' ? [] : this.$store.getters.companyList
      }
    }
  },
  created() {
    this.getMessageTemplate()
    if(this.$route.params.formData) {
      const formData = this.$route.params.formData
      this.formData = formData
      console.log('edit form data:', this.formData)
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
    }
  },
  methods: {
    // 保存按钮事件
    saveRuleMessage(type) {
      if(this.$route.params.formData) {
        console.log('formData:', this.$route.params.formData)
        // 编辑接口
        this.$refs['addForm'].validate(valid => {
          if(valid) {
            if(type === 'enable') {
              this.formData.rstatus = 1
            }
            const message = type === 'enable' ? '启用成功' : '编辑成功'
            this.formData.receiveCode = this.node.orgCode
            this.formData.receiveCodeType = this.node.orgLevel
            this.formData.loginID = this.$store.getters.userInfo.userId
            this.formData.loginName = this.$store.getters.userInfo.name        
            api.messageManagement.messageRules.updateMessage(this.formData).then(res => {
              console.log('update message:', res)
              if(res) {
                this.$message({
                  type:'success',
                  message
                })
                this.$router.push({ name: 'ruleSettings' })
              }
            })  
          } else {
            return false
          }
        })
      } else {
        // 新增接口
        this.$refs['addForm'].validate(valid => {
          if(valid) {
            this.formData.receiveCode = this.node.orgCode // 新增数据时将this.formData.receiveCode由label值转换成code值，传递给后端（前端显示的是label汉字）
            this.formData.receiveCodeType = this.node.orgLevel
            this.formData.loginID = this.$store.getters.userInfo.userId
            this.formData.loginName = this.$store.getters.userInfo.name
            api.messageManagement.messageRules.addMessage(this.formData).then(res => {
              console.log('add message:', res)
              if(res) {
                this.$message({
                  type:'success',
                  message: '保存成功！'
                })
                this.recursionTree(this.treeData, this.formData.receiveCode)
                this.formData.receiveCode = this.currentOrgName
                // this.$router.push({ name: 'ruleSettings' })
              }          
            })
          } else {
            return false
          }
        })
      }
    },
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
    handleMessageTemplateChangeEvent(e, flag = false) {
      console.log('e,flag:', e,'-----',flag)
      this.isVisibleOfSendWay = true
      // 如果用户从消息模块下拉列表中选择了日用气分析通知、月用气分析通知、日对账单生成提醒（生产2、3、4，测试87、88、89），则将isVisibleOfContractType设置为false，此时隐藏合同类型下拉列表中的直接选项，
      if([2,3,4].includes(e)) {
        this.isVisibleOfContractType = false
      } else {
        this.isVisibleOfContractType = true
      }
      // 两处位置调用此方法（handleMessageTemplateChangeEvent），当flag为true时，则是在消息模块的change事件中调用此方法
      if(flag) {
        this.formData.sendWay = null
        this.formData.sendType = null
        this.formData.sendTime = null
      }
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
    // tree节点click事件
    handleNodeClickEvent(data) {
      console.log('node click:',data)
      this.formData.receiveCode = data.orgName  // 将客户所属组件下拉列表的绑定值设置为orgName（页面上展示汉字）
      this.node = data
    },
    // 递归treeData，通过orgCode获取orgName
    recursionTree(tree, code) {
      console.log('code:',code)
      tree.map(item => {
        if(item.orgCode === code) {
          this.currentOrgName = item.orgName
          return
        }
        if(item.orgChildren && item.orgChildren.length > 0) {
          this.recursionTree(item.orgChildren, code)
        }
      })
    },
    // 消息模板下拉框 clearable 事件
    handleClearEvent() {
      this.formData.sendWay = null
      this.formData.sendType = null
      this.formData.sendTime = null
      this.isVisibleOfSendWay =false
    }
  }
};
</script>

<style lang='scss' scoped>
@media screen and (max-width: 1440px) {
  /deep/ .el-select .el-input__inner {
    border-radius: 4px;
    background: #fff;
    border:1px solid #e4e7ed;
    padding-left: 14px;
    color: #606266;
    width: 198px;
    height: 32px;
  }
  /deep/ .el-input .el-input__inner { 
    height: 32px;
  }  
}
@media screen and (min-width: 1920px) {
  /deep/ .el-select .el-input__inner {
    border-radius: 4px;
    background: #fff;
    border:1px solid #e4e7ed;
    padding-left: 14px;
    color: #606266;
    width: 379px;
    height: 32px;
  }
  /deep/ .el-input .el-input__inner { 
    height: 32px;
  }  
}
.container {
  min-width: auto;
  // 启用按钮可用时样式
  /deep/.el-button--primary {
      color: #fff;
      background: #47A87D;
  }
  // 启用按钮禁用时样式
  /deep/.el-button--primary.is-disabled, .el-button--primary.is-disabled:active, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:hover {
    color: #fff;
    background: rgba(71, 168, 125, .5);
    border-color: #a0cfff;
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
      /* radio样式 */
      /deep/ .el-radio {
        background: #fff;
        border: none;
      }       
      /deep/ .el-radio.is-bordered.is-checked {
        background: rgba(71, 168, 125, 0.1);
        border-radius: 4px;
        border: 1px solid #47A87D;
        box-sizing: border-box;
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
      /* .area-bg1 >>> .el-form-item {
        margin: 0;
      } */
      .area-bg2 {
        margin: 20px;
        padding: 20px;
        background: #F5F7FA;
        border-radius: 4px;
        .tip {
          font-size: 12px;
          color: #909399;
          margin:15px 0 5px 0; 
          line-height:0px;
        }
        .tip-link {
          font-size: 12px;
          color: #409EFF;
          text-decoration: none;
        }
      }      
    }
  }
  .footer {
    position: fixed;
    right: 0;
    bottom: 0;
    width: calc(100% - 220px);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 80px;
    background: #fff;
    box-sizing: border-box;
    padding: 20px;
    box-shadow: 0px -6px 18px 0px #567DB924;
    .btn {
      width: 86px;
      height: 40px;
      font-size: 14px;
      background: #47A87D;
      color: #fff;
    }
  }
}
</style>