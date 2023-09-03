<template>
  <div class="business-deploy gas-page-bg">
    <top-menu
      @t-date-change="tDateChange"
      :date-picker-show="false"
      :start-time="startTime"
      :end-time="endTime"
      title="需供企业配置"
    ></top-menu>
    <div class="business-deploy-content">
       <div class="tip">
            配置提示：支持单个或多个城燃企业汇总到一个城燃企业名下进行统计，组合城燃企业名称设置完成后，在需供统计跟踪界面会查看到自定义的企业名称。
          </div>
      <!-- 无数据 -->
      <template v-if="demandList.length < 1 && noDataShow">
        <div class="list-item-content-no">
          <div class="list-content">
            <img src="./assets/nodata.png" alt="" />
            <div class="no-data">暂无数据</div>
            <div class="no-data">点击自定义按钮进行配置</div>
            <el-button
              class="customize-btn"
              type="primary"
              round
              @click="customize"
            >
              自定义
            </el-button>
          </div>
        </div>
      </template>
      <!-- 有数据 -->
      <div class="list-item-content" v-if="demandList.length > 0">
        <div class="deploy-content-item deploy-content-item-first">
          <div class="first-item-content" @click="customize">
            <div class="add-deploy">+</div>
            <div >自定义配置</div>
          </div>
        </div>
        <div
          class="deploy-content-item"
          v-for="(item, index) in demandList"
          :key="'a' + index"
        >
          <div class="deploy-content-item-title" @click="consoleSetD(index)">
            <div class="title">{{ item.parent.name }}</div>
            <div
              class="deploy-content-item-set"
              @click.stop="setData(item, index)"
              v-show="item.parent.isTotal!='1'"
            >
              <i class="el-icon-more"></i>
              <div class="set-down" v-show="item.isShowSet">
                <div @click="setBtn(item, index)">
                  <i class="el-icon-edit"> </i>
                  编辑
                </div>
                <div @click="delSetBtn(item, index)">
                  <i class="el-icon-delete"></i>
                  删除
                </div>
              </div>
            </div>
          </div>
          <div class="deploy-content" >
            <div class="content-list" v-for="(itemC, indexC) in item.childList"
          :key="'c' + indexC">
             <img src="./assets/listIcon.png" alt="">
             <span>{{itemC.cpmoName}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 配置 -->
    <el-dialog title="需供企业配置" :visible.sync="dialogFromVisible" :key="editTimer+'d1'">
      <div class="set-detail">
        <div class="tip">
          配置提示：支持单个或多个城燃企业汇总到一个城燃企业名下进行统计，组合城燃企业名称设置完成后，在需供统计跟踪界面会查看到自定义的企业名称。
        </div>
        <div class="all-name">汇总城燃名称：
          <span >{{curComCodeName}}合计</span>
        </div>
        <el-form @submit.native.prevent>
          <div class="search">
            <el-form-item
              label="城燃企业 "
              class="item-list"
              label-width="80px"
            >
              <el-input placeholder="搜索企业名称" @blur="changeBusinessData" @input="changeBusinessData"  @keyup.enter.native="changeBusinessData" v-model="business">
              </el-input>
               <i class="el-icon-search"></i>
            </el-form-item>
            <span v-if="business" class="clear-input" @click="clearSearch">清空</span>
          </div>
        </el-form>
        <div class="detail-title">
        </div>
        <div>
          <el-table
          :data="demandBusinessList2"
          stripe
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          class="custom-table-r"
          @selection-change="handleSelectionChange">
              <template slot="empty">
              　　<span style="color: #969799;">暂无数据 请重新搜索</span>
              </template><br>
               <el-table-column
                     label="企业名称"
                    prop="orgName"
                    align="center">
                </el-table-column>
                <el-table-column
                label="企业编码"
                    prop="ecode"
                    align="center">
                </el-table-column> 
                <el-table-column width="100" label="是否选择" >
                  <template slot-scope="scope">
                      <el-checkbox v-model="demandBusinessList2[scope.$index].isSelect"  ></el-checkbox>
                  </template>
                </el-table-column> 
          </el-table>
          <div class="set-detail-btn" >
            <el-button 
              round 
              @click="consoleBtn"
              :disabled='demandBusinessList2.length<1'
              :class="[demandBusinessList2.length<1?'disabledconsoleBtn':'consoleBtn']">
                取消
             </el-button>
             <el-button type="primary"
              round 
              @click="createBtn"
               :disabled='demandBusinessList2.length<1'
              :class="[demandBusinessList2.length<1?'disabledBtn':'createBtn']">
                生成
             </el-button>
          </div>         
        </div>
      </div>
    </el-dialog>
    <!-- 生成确认 -->
    <el-dialog title="添加组合企业名称" width="35%" :visible.sync="creatDialogFromVisible" :key="editTimer+'f'">
      <div class="set-detail search-detail">
        <el-form  :model="ruleForm"
                ref="ruleForm" 
                :rules="rules"> 
          <div class="search">
            <el-form-item
              label="组合企业名称： "
              class="item-list"
              label-width="130px"
              prop="businesChange" >
              <el-input placeholder="企业名称"  v-model="ruleForm.businesChange"> 
              </el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="detail-list">
          <div class="list-title">选中企业：</div>
            <ul class="list-content" >
              <li v-for="(item,index) in checkedList" :key="index+'l'"> 
               <img src="./assets/listIcon.png" alt="">
                <span>{{item.orgName}}</span>
                </li>    
            </ul>
        </div>
        <div>
          <div class="set-detail-btn">
            <el-button 
              round 
              @click="nextBtn"
              class="consoleBtn">
                上一步
             </el-button>
             <el-button type="primary"
              round 
              @click="createBtnConfirm('ruleForm')"
              class="createBtn">
                确定
             </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog width="30%" :visible.sync="dialogFromVisibleSuccess" :key="editTimer+'g'">
      <div class="set-detail confirmbtn">
        <div class="confirmbtn-content">
          <span v-if="addSuccess">组合企业名称操作完成 !</span> 
          <span v-else>
              添加组合企业名称失败，因{{addErr}}错误，请返回重填！
          </span>
        </div>
        <div>
          <div class="set-detail-btn right">
            <el-button 
              round 
              @click="confirmbtConsoleBtn"
              class="consoleBtn"
              v-if="!addSuccess">
                取消
             </el-button>
             <el-button type="primary"
              round 
              @click="confirmbtnBtn"
              class="createBtn">
                确定
             </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
     <el-dialog width="30%" :visible.sync="dialogFromVisibleDel" :key="editTimer+'h'">
      <div class="set-detail confirmbtn deleteL">
        <div class="confirmbtn-content">
           <span>确定要删除"{{delDataname}}"吗？</span>
        </div>
        <div>
          <div class="set-detail-btn right">
            <el-button 
              round 
              @click="dialogFromVisibleDel = false"
              class="consoleBtn">
                取消
             </el-button>
             <el-button type="primary"
              round 
              @click="delBtnConfirm"
              class="createBtn">
                确定
             </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import topMenu from "../../components/topMenu/topMenu";
import api from "/src/http/xugongqiyeApi";
import qiyuanApi from "/src/http/qiyuanApi";
import exportApi from "/src/components/export/export";
import mergeTableRow from "/src/components/mergeTableRow/reply";
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'

export default {
  mixins: [exportApi, mergeTableRow, buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
  data: function () {
    return {
      multipleSelection:'',
      ruleForm:{
         businesChange:'',
      },
      hasArr: false,
      dialogVisible: false,  
      business: "",
      delIndex: "",
      editTimer: 1,
      dialogFromVisibleDel:false,
      dialogFromVisible: false,
      creatDialogFromVisible:false,
      dialogFromVisibleSuccess:false,
      dialogFormVisible: false,
      dialogFormVisibleNew: false,
      startTime: 0,
      endTime: 0,
      rules: {
          businesChange: [
            { required: true, message: "请输入组合企业名称", trigger: "blur" },
           {
             max:20, message: '长度在不得超过20个字', trigger: 'change',
          }],
      },
      setComponyArray: "", //获取当前选择要编辑的供应商
      comOptions: "",
      isShowSet: false,
      delData: "", //要删除的数据
      demandList:[],
      noDataShow: false,
      isEdit:false,
      editItem:'',//保存编辑选项数据
      allName:'',//汇总名称
      demandBusinessList:[],
      demandBusinessList2:[],
      checkedList:[],//已选择的公司
      addSuccess:false,//是否添加成功
      delDataname:'',
      addErr:'',//添加错误原因
    };
  },
  components: {
    topMenu,
  },
  created() {
    this.startTime = this.getFormatTime(Date.now());
    this.endTime = this.getFormatTime(Date.now() + 24 * 3600000);
    this.demandSetSelect()
    this.comOptions = this.$store.getters["companyList"];
  },
  filters: {
  },
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom;
    },
    curComCodeName: function () {
      return this.$store.getters.curComName;
    },
    loginName:function () {
      return this.$store.getters.loginName;
    },
    curComInfo:function () {
      return this.$store.getters.curComInfo;
    },
  },
  watch: {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if (n && o) {
          this.getData();
        }
      },
    },
  },
  methods: {
    nextBtn(){
      this.creatDialogFromVisible = false
      this.dialogFromVisible = true;
    },
    clearSearch(){
        this.business = ''
        this.changeBusinessData()
    },
    createBtn(){
      let arr = []
      this.demandBusinessList2.forEach((item,index)=>{
        if(item.isSelect){
          arr.push(item)
        }
      })
      this.checkedList = arr
      if(this.checkedList.length>0){
         this.dialogFromVisible = false; 
         this.creatDialogFromVisible = true 
      }else{
        this.$message.error('请选择城然企业')
      }  
    },
     handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    customize() {
      this.demandExAuthorg()
      this.dialogFromVisible = true;
      this.isEdit = false
      this.allName = this.curComCodeName
      this.ruleForm.businesChange = ''
    },
    // 确认生成
    createBtnConfirm(formName){
       this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.isEdit){
            this.demandSetUpdate()
          }else{
              this.demandSetAdd()
          }    
        }
       })  
    },
    getData() {
      this.demandSetSelect()
    },
    consoleBtn(){
        this.dialogFromVisible = false
    },
    // 生成失败取消按钮
    confirmbtConsoleBtn(){
      this.dialogFromVisibleSuccess = false
    },
    // 生成成功失败确认按钮
    confirmbtnBtn(){
      this.dialogFromVisibleSuccess = false
      this.dialogFromVisible = false
      this.creatDialogFromVisible = false
      this.demandSetSelect() 
    },
    // 获取列表
    demandSetSelect(){
      let data = {
        belongCode:this.curComCode
      }
       api.demandDisplay.demandSetSelect(data).then((res) => {
        this.demandList = res?res[0]:[];
        this.demandList.forEach(item=>{
          this.$set(item, "isShowSet", false);
        })
         this.noDataShow = true
      });
    },
    changeBusinessData(){
      let changeData =  this.demandBusinessList.filter(item=>item.orgName.indexOf(this.business)>=0);
      this.demandBusinessList2 = changeData
    },
    // 添加组合
    demandSetAdd(){
      let data = {
          "virtualTotalName": this.curComCodeName + '合计',
         	"belongCode": this.curComCode,
          "createDate": this.getFormatTime(Date.now()),
          "createUser": this.loginName,
          "id": "",
          "modifyDate": "",
          "modifyUser": "",
          "name": this.ruleForm.businesChange,
          "settingDetails": []
      }
      this.checkedList.forEach(item=>{
        let obj = {
          cpmoCode:item.ecode,
          cpmoName:item.orgName,
          "id": null,
          "parentId": ""
        }
        data.settingDetails.push(obj)
      })
      api.demandDisplay.demandSetAdd(data).then((res) => {
        if(res&&res.errorCode==0){
           this.dialogFromVisibleSuccess = true
           this.addSuccess = true
           if(this.addSuccess){
                setTimeout(() => {
                  console.log('成功成功');
                  this.confirmbtnBtn()
                }, 3000);
            }
        }else{
           this.addSuccess = false
           this.dialogFromVisibleSuccess = true
           this.addErr = res.errorMsg
           this.$message.error(res.errorMsg)
        }
      });
    },
    // 编辑组合
    demandSetUpdate(){
      let data = {
          "virtualTotalName": this.curComCodeName + '合计',
         	"belongCode": this.curComCode,
          "createDate": '',
          "createUser": '',
          "id": this.editItem.parent.id,
          "modifyDate": this.getFormatTime(Date.now()),
          "modifyUser": this.loginName,
          "name": this.ruleForm.businesChange,
          "settingDetails": [
          ]
      }
      this.checkedList.forEach(item=>{
        let obj = {
          cpmoCode:item.ecode,
          cpmoName:item.orgName,
          "id": null,
          "parentId": ""
        }
        data.settingDetails.push(obj)
      })
        api.demandDisplay.demandSetUpdate(data).then((res) => {
        if(res&&res.errorCode == 0){
           this.dialogFromVisibleSuccess = true
           this.addSuccess = true
            if(this.addSuccess){
                setTimeout(() => {
                  console.log('成功成功');
                  this.confirmbtnBtn()
                }, 3000);
            }
        }else{
           this.addSuccess = false
           this.dialogFromVisibleSuccess = true
           this.addErr = res.errorMsg
           this.$message.error(res.errorMsg)
        }
      });
    },
      // 编辑回显选择内容
    echoEdit(val){
      val.childList.forEach(item1=>{
      this.demandBusinessList.forEach((item,index)=>{
            if(item.ecode == item1.cpmoCode){
              this.$nextTick(()=>{
                this.demandBusinessList[index].isSelect = true
              })
            }
          })  
      }) 
    },
    // 获取企业组织名称
    demandExAuthorg(){
         let data = {
          "orgCode": this.curComCode,
          "orgName": '',
          "orgType": this.curComInfo.orgLevel,
          "pageNum": 1,
          "pageSize": 1000
        }
       qiyuanApi.demandDisplay.demandExAuthorg(data).then((res) => {
        this.demandBusinessList = res.list
        this.demandBusinessList.forEach((item,index)=>{
        this.$set(this.demandBusinessList[index],'isSelect',false)
      })   
        this.demandBusinessList2 = this.demandBusinessList
        if(this.isEdit){
           this.echoEdit(this.editItem)
        }  
      });
    },
    tDateChange: function (date) {
      this.startTime = new Date(date).getTime() / 1000;
      this.endTime = this.startTime + 24 * 60 * 60;
    },
    getFormatTime: function (timestamp) {
      let date = new Date(timestamp);
      let yyyy = date.getFullYear();
      let mm =
        date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return yyyy + "-" + mm + "-" + dd;
    },
    setData(val, index) {
      this.demandList[index].isShowSet = !this.demandList[index].isShowSet;
    },
    setBtn(val, index) {
      this.demandExAuthorg()
      this.setComponyArray = val;
      this.setComponyArray.status == 1 ? true : false;
      this.isEdit = true
      this.editItem = val
      this.ruleForm.businesChange = this.editItem.parent.name
      this.dialogFromVisible = true;
      this.demandList[index].isShowSet = false;
    },
    // 删除列表
    delSetBtn(val, index) {
      this.dialogFromVisibleDel = true;
      this.delData = val;
      this.delIndex = index;
      this.delDataname = this.delData.parent.name
      this.demandList[index].isShowSet = false;
    },
    // s删除列表确认
    delBtnConfirm(){
     this.dialogFromVisibleDel = false;
     let data = {
         belongCode:this.delData.parent.belongCode,
         id:this.delData.parent.id
     }
     api.demandDisplay.demandSetDel(data).then((res) => {
        if(res){
          this.$message.success('删除成功')
          this.demandSetSelect()
        }
      });
    },
    consoleSetD(index) {
      this.demandList[index].isShowSet = false;
    },
  },
};
</script>
<style lang="scss">
.business-deploy {
  .el-dialog__header .el-dialog__title{
    color: #333333;
  }
  .el-input__suffix {
    border: none !important;
  }
  .el-select .el-input__inner {
    height: 40px;
    background: #edeef4;
  }
  .el-date-editor--daterange.el-input__inner {
    width: 100%;
  }
}
</style>
<style scoped lang="scss">
.business-deploy {
  /deep/.el-form-item__label{
      font-size: 16px;
      font-weight: 600;
  }
  .del-dialog {
    /deep/.el-dialog__body {
      text-align: center;
    }
    /deep/.el-dialog__footer {
      text-align: center;
    }
    .dialog-con {
      text-align: center;
    }
  }
  .set-detail {
    padding: 0 20px;
    margin-top: 10px;
    padding-top: 10px;
        border-top: 1px solid #E4E7ED;
      /deep/.el-checkbox__input.is-checked .el-checkbox__inner{
         background-color: #0FB3AD;
         border-color: #0FB3AD;
      }
      .custom-table-r{
        /deep/.el-table__body-wrapper{
          overflow-y:auto;
          height: 260px;
        }
      }
    .tip {
      background: #FDF2E9;
      border-radius: 8px;
      color: #ed7b1a;
      padding: 8px 24px;
    }
    .all-name{
      line-height: 50px;
      font-size: 16px;
      margin-left: 2px;
      font-weight: 600;
    }
    .search{
      display: flex;
      font-size: 16px;
      .clear-input{
           line-height: 37px;
           margin-left: 10px;
           color: #3480FF;
      }
      /deep/.el-input__inner{
          background-color: rgba(244, 247, 250, 1);
          border-radius: 24.3px;
          border: none;
          padding-right: 33px;
      }
      .el-icon-search{
        position: absolute;
        top: 35%;
        right: 17px;
      }
    }
    .set-detail-btn{
        text-align: center;
        padding: 25px;
        font-size: 16px;
         .consoleBtn{
            border: 1px solid #0fb2ab;
            color: #0fb2ab;
            margin-right: 22px;
          }
          .disabledconsoleBtn{
            border: 1px solid #0fb2ab33;
            color: #0fb2ab52;
            margin-right: 22px;
          }
          .createBtn{
            background: #0fb2ab;
            color: #fff;
          }
          .disabledBtn{
            background: #0fb2ab42;
            border: none;
            color: #fff;
          }
    }  
  }
  .confirmbtn{
    margin-top: 20px;
    .confirmbtn-content{
        font-size: 24px;
    }
    .right{
      text-align: right;
    }
  }
  .search-detail{
    padding: 0 20px;
    padding-top: 10px;
    .search{
      display: block;
      /deep/.el-form-item__label{
          font-size: 14px;
          font-weight: 500;
          padding-right: 0px;
      }
        /deep/.el-input__inner{
          padding-right: 12px;
      }
    }
    .detail-list{
      display: flex;
      margin-top: -10px;
      .list-title{
          width: 130px;
         text-align: right;
         margin-right: 28px;
         margin-top: 10px;
      }
      .list-content{
        max-height: 175px;
        overflow: auto;
        width: 65%;
        li{
          line-height: 35px;
          img{
            vertical-align: middle;
            margin-right: 10px;
          }
          i{
            margin-right: 6px;
          }
        }
      }
    }
  }
  .deleteL{
    border: none;
    margin: 0;
  }
  .business-deploy-content {
    padding: 5px 20px;
    margin: 10px;
    margin-top: 32px;
    border-radius: 20px;
    .list-item-content {
      display: flex;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .deploy-content-item {
      width: 29%;
      background: #fff;
      padding: 30px 0;
      border-radius: 16px;
      margin: 10px;
      padding-top: 0;
      background-image: url('./assets/list-bg.png');
      background-repeat: no-repeat;
      background-size: 100%;
      height: 260px;
      box-shadow: 0px 1px 5px rgba(86, 125, 185, 0.1);
      border: 1px solid rgba(220, 223, 230, 1);
      background-color: rgba(255, 255, 255, 1);
      .deploy-content-item-title {
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        justify-content: space-between;
        padding: 10px 30px;
        .deploy-content-item-set {
          border-radius: 10px;
          padding: 4px 2px;
          line-height: 30px;
          position: relative;
          .set-down {
            padding: 12px;
            box-shadow: 0px 10px 20px rgba(86, 125, 185, 0.1);
            border-radius: 20px;
            position: absolute;
            right: -20px;
            z-index: 10;
            background: #ffffff;
            width: 54px;
          }
        }
        .title {
          font-weight: 700;
          margin-top: 5px;
          font-size: 16px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .deploy-content {
        height: 210px;
        overflow: auto;
        color: #666666;
        padding: 0 30px;
        .content-list {
          display: flex;
          line-height: 45px;
          align-items: center;
          font-size: 14px;
          img{
            height: 16px;
            margin-right: 8px;
          }
          i{
            line-height: 40px;
            margin-right: 6px;
            color: #C4C4C4;
          }
          label {
            font-weight: 500;
            color: #2c3e50;
            font-family: PingFang SC;
            width: 195px;
          }
          .start-using {
            color: #0fb2ab;
          }
        }
      }
    }
      .tip {
        background-color: #e5e8f326;
        border-radius: 8px;
        color: #ffffff;
        padding: 0 20px;
        height: 37px;
        line-height: 37px;
        margin: 0 28px 0 10px;
        font-size: 14px;
      }
    .list-item-content-no {
      .list-content {
          text-align: center;
          margin: 46px 141px;
        img {
          height: 158px;
        }
        .no-data {
          line-height: 28px;
          color: #FFFFFF;
        }
        .customize-btn {
          margin: 20px;
          background: #0fb3ad;
        }
      }
    }
    .deploy-content-item-first {
      background: #f5f7fa;
      text-align: center;
      color: #0fb3ad;
      .first-item-content {
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        cursor: pointer;
        .add-deploy {
          font-weight: 700;
          font-size: 48px;
        }
      }
    }
  }
}
</style>