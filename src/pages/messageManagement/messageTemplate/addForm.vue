<template>
  <div class="container gas-page-bg">
    <top-menu title="天然气输配(调度)智慧管理平台"></top-menu>
    <div class="breadcrumb-wrapper">
      <el-breadcrumb>
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>消息管理</el-breadcrumb-item>
        <el-breadcrumb-item>消息模板</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-wrapper">
      <div class="title-wrapper">
        <span class="back" @click="goBack"><i class="el-icon-back"></i> 返回</span>
        <span class="line">|</span>
        <span class="title" v-if="formData.id">编辑消息模板</span>
        <span class="title" v-else>新增消息模板</span>
      </div>

      <el-form class="form" ref="form1" :model="formData" :rules="rules" label-position="right" label-width="140px">
        <el-row class="area-bg2">
          <el-row>
            <el-form-item label="提醒途径" prop="mType">
              <el-checkbox-group v-model="formData.mType">
                <el-checkbox label="1" name="mType" border size="small">小程序内部通知</el-checkbox>
                <el-checkbox label="4" name="mType" border size="small">微信通知</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>

          <el-row>
            <el-col :md="8">
              <el-form-item label="消息分类" prop="className">
                <el-select filterable allow-create v-model="formData.className" placeholder="请选择消息分类" value-key="id" @change="handleEnableVariableConditionChange">
                  <el-option v-for="item in messageCategoryList" :label="item.dicValue" :value="item" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8">
              <el-form-item label="消息标题" prop="mTitle">
                <el-input v-model="formData.mTitle" placeholder="请输入消息标题" style="width: 240px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
              <div style="float:left;">
                <el-form-item label="消息内容" prop="mContent">
                  <el-input
                    v-model="formData.mContent"
                    type="textarea"
                    :rows="13"
                    placeholder="请输入消息内容"
                    id="mcontent"
                  ></el-input>
                  <div style="color: #909399; font-size: 12px;">备注：如果消息内容需要换行，请在需要结尾处添加##</div>
                </el-form-item>                   
              </div>

              <div style="float:left">
                <el-form-item label-width="20px">
                  <div class="variable-wrapper">
                    <span class="title">可用变量条件</span>
                    <ul class="list-item">
                      <li v-for="item in enableVariableConditionList" :key="item.id" :data-cn-txt="item.dicValue" :data-en-txt="item.dicKey" @click="handleVariableClickEvent">{{item.dicValue}}</li>
                    </ul>              
                  </div>
                </el-form-item>                
              </div>
          </el-row>
        </el-row>

        <el-row class="area-bg2" v-show="formData.mType.indexOf('4') !== -1">
          <div class="area-title">
            <span class="line"></span> 
            <span class="title">微信通知设置</span>
          </div>
          <el-form-item label="微信服务通知" prop="wxMessageId">
            <el-select v-model="formData.wxMessageId" placeholder="请选择微信服务通知" @change="handleWxServiceNoticeChangeEvent">
              <el-option v-for="(item, index) in wxServiceNoticeList" :label="item.name" :value="item.id" :key="index" />
            </el-select>
          </el-form-item>
          <el-divider></el-divider>
          
          <div class="area-title2">
            <span class="line2"></span> 
            <span class="title2">关键词</span>
          </div>
          <div v-for="(item,index) in keywordArr" :key="index">
            <el-row>
              <el-col :md="8">
                <el-form-item :label="item.name">
                    <el-input v-model="keywordItem[index]" :placeholder="`请输入${item.name}`"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </el-form>
    </div>

    <div class="footer">
      <el-button round class="btn" @click="handleSubmitEvent">保存</el-button>
      <!-- <el-button round class="btn btn-yingyong" @click="handleEnableEvent" v-if="formData.id" :disabled="formData.mStatus === 1">启用</el-button> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import api from "/src/http/api";
import TopMenu from '@components/topMenu/topMenu2'
export default {
  components: {
    TopMenu
  },  
  data() {
    // 验证 微信通知设置，如果选择了顶部“微信通知”复选框，则验证“微信通知设置”，否则不进行验证
    const validWxMessageId = (rule, value, callback) => {
      if(this.formData.mType.includes('4')) {
        if(!value) {
          return callback(new Error('微信服务通知不能为空222'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    return {
      weixinAreaIsVisible: false,
      isVisible: false,
      formData: {
        code: this.$store.getters.curCom,
        mType: [],
        className: "", // 消息分类
        mTitle: "",
        mContent: "",        
        wxMessageId: '', // 微信服务通知
      },
      dialogTitle: "新增消息模板",
      messageCategoryList:[], // 消息分类下拉列表数据
      enableVariableConditionList: [],  // 可用变量条件列表
      enableVariableConditionListAccumulator:[], // 切换消息分类下拉列表时，保存多次获取到的不同的可用条件变量
      messageContent: '', // 传递给后端的消息内容（消息内容中可用变量是code，不是前端展示的汉字）
      wxServiceNoticeList: [],    // 微信服务通知下拉列表数据
      keywordArr:[], // 存储关键词，json串，用于生成关键词区域的表单元素
      keywordItem:[],
      currentMessageCategoryId:'',  // 当前消息分类的ID
      sourceRoute: '', // 存储进入此页面的来源页面路由名称
      rules: {
        mType: [
          { required: true, trigger: "change", message: "提醒途径不能为空" },
        ],
        className: [
          { required: true, message: "消息分类不能为空", trigger: "change" },
        ],
        mTitle: [
          { required: true, message: "消息标题不能为空", trigger: "change" },
        ],
        mContent: [
          { required: true, message: "消息内容不能为空", trigger: "blur" },
          { min: 1, max: 500, message: "消息内容字符数量不能超过500个字符", trigger: "blur"}
        ],
        wxMessageId: [
          {validator: validWxMessageId, trigger: 'blur'}
        ],        
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    // 进入路由前，记录来源页面路由名称，提交表单后据此判断跳转到的页面
    next(vm => {
      if(from.name === 'addRemindMessage') {
        vm.sourceRoute = from.name
      }
    })
  },
  created() {
    this.resetForm()
    this.getMessageCategory()  // 获取消息分类，消息分类下拉列表用
    this.getWxMessageNoticeList() // 获取微信通知设置，微信通知设置下拉列表用
    // 编辑
    if(this.$route.params.formData) {
      const formData = this.$route.params['formData']
      // 将接口返回的逗号分隔的mType转换成数组（复选框用）
      if (formData.mType) {
        if (typeof formData.mType === "string") {
          formData.mType = formData.mType.split(",");
        }
      }
      this.formData = formData
      // 把记录中的关键词（json数据）赋值给keywordItem数组，keywordItem绑定了动态生成的关键词表单元素（实现编辑表单时关键词表单元素显示对应的回显值）
      const wxMessageJsonArr = JSON.parse(this.formData.wxMessageJson)
      wxMessageJsonArr.map((item,index) => {
        this.keywordItem[index] = item.value
      })
    }
  },
  methods: {
    // 取消按钮事件
    handleCancelEvent() {
      this.isVisible = false;
      this.resetForm();
    },
    // 可用变量条件项单击事件，将当前单击的可用变量插入到文本域的插入点所在位置
    handleVariableClickEvent(e) {
      this.$nextTick(() => {
        const mcontentObj = document.getElementById("mcontent"); // 消息内容 文本域
        // const currentVariableTxt = e.explicitOriginalTarget.innerText; // 用户当前单击的 可用变量条件
        const currentVariableTxt = e.target.innerText; // 用户当前单击的 可用变量条件
        // const enTxt = e.target.dataset.enTxt
        const startPos = mcontentObj.selectionStart; // 文本域中插入点起始位置
        const endPos = mcontentObj.selectionEnd; // 文本域中插入点结束位置
        if (startPos === undefined || endPos === undefined) {
          return;
        }
        const result = this.formData.mContent.substring(0, startPos) + '[' + currentVariableTxt + ']' + this.formData.mContent.substring(endPos); // 构造文本域中文本（原文本、可用变量）
        // this.messageContent = this.formData.mContent.substring(0, startPos) + '${' + enTxt + '}' + this.formData.mContent.substring(endPos); // 提交表单时传递给后端的文本，与展示在文本域中给用户看的有区别
        this.formData.mContent = result;
        mcontentObj.focus();
        mcontentObj.selectionStart = startPos + currentVariableTxt.length;
        mcontentObj.selectionEnd = startPos + currentVariableTxt.length;
      });
    },
    // 提交表单
    handleSubmitEvent() {
      // 转换消息内容文本域中内容，将汉字占位符（dicValue）替换成dicKey，用于传递给后端存储
      let cStr = this.formData.mContent
      const variableArr = this.flatten(this.enableVariableConditionListAccumulator)   // 多维数组扁平化
      for(let item of variableArr) {
        if(cStr.indexOf(item.dicValue !== -1)) {
          cStr = cStr.replaceAll('[' + item.dicValue + ']','${' + item.dicKey + '}')
        }
      }
      this.formData.mContentEn = cStr

      if (!this.formData.id) {
        // 新增
        this.$refs["form1"].validate((valid) => {
          if (valid) {
            this.formData.code = this.$store.getters.curCom
            this.formData.mType = this.formData.mType.join(",");
            this.formData.className = this.formData.className.dicValue
            this.formData.knBcDictionaryId = this.currentMessageCategoryId
            this.createWxMessageJson()  // 关键词区域json数据
            console.log('save submit formData:',this.formData)
            api.messageManagement.messageTemplate
              .addMessage(this.formData)
              .then((res) => {
                if (res) {
                  this.isVisible = false;
                  this.$message.success("消息添加成功！");
                  this.resetForm();
                  // 如果是从“新增提醒规则”页面通过链接进入此页面，则提交表单后返回到来源页面（新增提醒规则页面）
                  if(this.sourceRoute === 'addRemindMessage') {
                    this.$router.push({name: 'addRemindMessage'})
                  } else {
                    this.$router.push({name: 'messageTemplate'})
                  }
                }
              });
          } else {
            return false;
          }
        });
      } else {
        // 编辑
        this.formData.className = typeof this.formData.className === 'string' ? this.formData.className : this.formData.className.dicValue
        this.formData.knBcDictionaryId = this.currentMessageCategoryId
        this.formData.mType = this.formData.mType.join(",");
        this.createWxMessageJson()  // 关键词区域json数据
        console.log('edit submit formData:',this.formData)
        api.messageManagement.messageTemplate
          .updateMessage(this.formData)
          .then((res) => {
            if (res) {
              this.isVisible = false;
              this.$message.success("消息编辑成功！");
              this.resetForm();
              this.$router.push({name: 'messageTemplate'})
            }
          });
      }
    },
    // 构造关键词区域json数据（获取绑定了关键词表单元素的keywordItem数组中的值，将其赋值给keywordArr数组，最后将keywordArr赋值给了this.formData，传递给接口保存数据）
    createWxMessageJson() {
      for(let i in this.keywordArr) {
        for(let j in this.keywordItem) {
          if(i === j) {
            this.keywordArr[i].value = this.keywordItem[j]
          }
        }
      }  
      this.formData.wxMessageJson = JSON.stringify(this.keywordArr)    
    },
    // 重置表单
    resetForm() {
      // this.$refs["form1"].resetFields();
      this.formData.code = "";
      this.formData.mType = [];
      this.formData.className = "";
      this.formData.mTitle = "";
      this.formData.mContent = "";
    },
    // 返回前一页
    goBack() {
      this.$router.go(-1)
    },
    // 获取消息分类
    getMessageCategory() {
      const params = {
        "dicKey":"smart_message_subject"
      }
      // 第一步，返回一条记录，用此记录id做为入参数，获取下一步数据（消息分类列表），入参："dicKey":"smart_message_subject"
      const url = '/htapi/api/v1/crm/api/systemMgr/dictionarys'
      axios.post(
        url,
        params
      ).then(res => {
        // 第二步，获取 消息分类 列表数据，入参："dicPid": 上一步返回的id
        const id = res.data.result[0].id
        axios.post(
          url,
          {
            dicPid: id
          }
        ).then(res => {
          this.messageCategoryList = res.data.result
          // 在编辑表单中根据 消息分类 下拉列表中当前值，获取可用变量条件
          if(this.formData.className) {
            const currentMessageCategory = this.messageCategoryList.find(item => item.dicValue === this.formData.className)
            this.handleEnableVariableConditionChange({id: currentMessageCategory.id})
          }
        })
      })

    },
    // 消息分类 change 事件，更改消息分类时，获取相应的可用变量条件
    handleEnableVariableConditionChange(item) {
      this.currentMessageCategoryId = item.id
      // 第三步，获取 可用变量条件，入参数： "dicPid": 第二步id
      axios.post(
        '/htapi/api/v1/crm/api/systemMgr/dictionarys',
        {
          dicPid: item.id
        }
      ).then(res => {
        this.enableVariableConditionList = res.data.result
        // 切换消息分类时，存储每次获取的不同的可用变量
        this.enableVariableConditionListAccumulator.push(res.data.result)
      })
    },
    // 启用按钮单击事件
    handleEnableEvent() {
      this.formData.mStatus = 1  // mstatus：1 启用，2 禁用
      this.formData.mType = this.formData.mType.join(',')
      api.messageManagement.messageTemplate.updateMessage(this.formData)
        .then((res) => {
          if (res) {
            this.isVisible = false;
            this.$message.success("消息启用成功！");
            this.resetForm();
            this.$router.push({name: 'messageTemplate'})
          }
        });      
    },
    // 获取微信服务通知列表
    getWxMessageNoticeList() {
      api.messageManagement.messageTemplate.getWxMessageNoticeList().then(res => {
        this.wxServiceNoticeList = res[0]
        console.log('wx Service Notice List',this.wxServiceNoticeList)
        if(this.formData.id) {
          this.handleWxServiceNoticeChangeEvent(this.formData.wxMessageId)
        }
      })
    }, 
    // 微信服务通知下拉列表change事件
    handleWxServiceNoticeChangeEvent(val) {
      // if(this.wxServiceNoticeList) {
        const mContent = this.wxServiceNoticeList.find(item => item.id === val)['mContent']
        this.keywordArr = JSON.parse(mContent) // 关键词区域元素集合
      // }
    },
    // 扁平化数组（多维转一维）
    flatten(arr) { return [].concat( ...arr.map(x => Array.isArray(x) ? this.flatten(x) : x) ) }
  },
};
</script>

<style lang="scss" scoped>
@import '../css/customer_public_css.scss';
.container {
  min-width: auto;
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

    .title-wrapper {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #DCDFE6;
      padding: 20px 22.5px;
      .back{
        cursor: pointer;
        font-size: 18px;
        font-weight: 400;
        color: #409EFF;
        .el-icon-back {
          margin-right: 7px;
        }
      }
      .back i {
        color: #409EFF;
        font-weight: bold;
      }
      .line {
        margin: 0 20px;
      }
      .title {
        color: #303133;
        font-size: 18px;
        font-weight: 500;
      }
    }
    .form {
      /deep/.el-form-item {
        margin: 20px 0 0 0;
      }
      /deep/ .el-checkbox {
        background: #fff;
        border-radius: 4px;
        box-sizing: border-box;
        padding-top:7px;
        border: none;
      }
      /deep/ .el-checkbox.is-bordered.is-checked {
        background: rgba(71, 168, 125, 0.1);
        border-radius: 4px;
        border: 1px solid #47A87D;
        box-sizing: border-box;
      }
      /deep/.el-checkbox__input.is-checked+.el-checkbox__label {
        color: #47A87D;
      }
      /deep/.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background: #47A87D;
      }
      .area-bg1 {
        margin: 14px 20px 20px 20px;
        padding: 20px;
        background: #F5F7FA;
        border-radius: 4px;
      }
      .area-bg2 {
        margin: 20px;
        padding: 20px;
        background: #F5F7FA;
        border-radius: 4px;
        &:first-child {
          padding-top: 0;
        }
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
            font-size: 16px;
            font-weight: 500;
          }
        }
        .area-title2 {
          display: flex;
          align-items: center;
          font-weight: bolder;
          .line2 {
            width: 8px;
            height: 8px;
            background:#47A87D;
            display: inline-block;
            text-align: center;
            margin-right: 5px;
          }
          .title2 {
            font-size: 14px;
            font-weight: 500;
          }
        }
        .variable-wrapper {
          .title {

          }
          .list-item {
            color: #409EFF;
            padding: 0 ;
            margin: 0;
            line-height: 160%;
          }
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
    .btn-yingyong {
      color: #fff;
      background: #47A87D;
    }
  }
  @media screen and (min-width: 1440px) and (max-width: 1920px){  
    /deep/ .el-textarea__inner {
      width: 578px;
      height: 310px;
    }    
  }
  @media screen and (max-width: 1440px) {
    /deep/ .el-textarea__inner {
      width: 578px;
      height: 310px;
    }
  }
  @media screen and (min-width: 1920px) {
    /deep/ .el-textarea__inner {
      width: 916px;
      height: 310px;
    }  
  }  

}
</style>