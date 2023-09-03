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
      <div class="search-wrapper">
        <!-- <div class="search-title">规则设置</div> -->
        <el-form :inline="true">
          <el-form-item label="规则设置">
            <el-input 
              @input="getList(1)" 
              @blur="getList(1)" 
              v-model="keyword"
              type="text" 
              prefix-icon="el-icon-search" 
              placeholder="请输入规则名称" 
              clearable
              class="search-input" 
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="card-wrapper">
        <!-- <el-row > -->
          <div style="cursor:pointer;" class="card-item card-spacing" v-if="this.pager.currentPage === 1">
            <!-- <el-col :md="6" :sm="8"> -->
              <el-card shadow="always" class="card">
                <div @click="addMessageRules">
                  <div class="plus-icon"><i class="el-icon-plus"></i></div>
                  <div class="tips">新增消息规则</div>
                </div>
              </el-card>
            <!-- </el-col> -->
          </div>

          <div v-for="(item, index) in list" :key="index" class="card-item">
            <!-- <el-col :md="6" :sm="8"> -->
              <el-card shadow="always" class="card card-spacing">
                <div slot="header" class="header-wrapper">
                  <div class="header-name">{{ item.name }}</div>
                  <el-dropdown class="header-dropdown">
                    <span class="el-dropdown-link"><i class="el-icon-more"></i></span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-edit" @click.native="handleUpdateEvent(index)"> 编辑</el-dropdown-item>
                      <el-dropdown-item icon="el-icon-delete" @click.native="showConfirmDialog(item.id,'delete')"> 删除</el-dropdown-item>
                      <el-dropdown-item icon="el-icon-delete" @click.native="showConfirmDialog(item.id,'enable')" v-if="item.rstatus === 2"> 启用</el-dropdown-item>
                      <el-dropdown-item icon="el-icon-remove-outline" @click.native="showConfirmDialog(item.id,'stop')" v-if="item.rstatus === 1"> 停用</el-dropdown-item>
                      <el-dropdown-item icon="el-icon-view" @click.native="handleViewEvent(index)"> 查看</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div class="desc" @click="handleViewEvent(index)" style="cursor: pointer;">{{ item.ruleDesc }}</div>
                <div class="update-date"><span>更新日期：</span><span>{{ item.updateTime | dateFormat }}</span></div>
              </el-card>
            <!-- </el-col> -->
          </div>
        <!-- </el-row> -->
      </div>
      <el-pagination background class="custom-page-n pagers" layout="prev, pager, next" :current-page="pager.currentPage" :page-size="pager.pageSize" :total="pager.totalPage" @current-change="currentChange"></el-pagination>
      <confirm-dialog ref="deleteDialog" title="删除" content="确定执行删除操作吗？" :confirmEvent="handleDeleteEvent"></confirm-dialog>
      <confirm-dialog ref="stopDialog" title="停用" content="确定执行停用操作吗？" :confirmEvent="handleStopEvent"></confirm-dialog>
      <confirm-dialog ref="enableDialog" title="启用" content="确定执行启用操作吗？" :confirmEvent="handleEnableEvent"></confirm-dialog>
  </div>
</template>

<script>
import api from '/src/http/api'
import TopMenu from '@components/topMenu/topMenu2'
import ConfirmDialog from '../components/confirmDialog.vue'
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'

export default {
  components: {
    TopMenu,
    ConfirmDialog
  },
  mixins: [buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
  data() {
    return {
      id: null,
      keyword: '',  // 搜索关键字
      list: [],
      pager: {
        currentPage: 1,
        pageSize: 7,
        totalPage: null
      }
    }
  },
  computed: {
    curCom() {
      return this.$store.getters.curCom
    }
  },
  watch: {
    curCom() {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(flag = '') {
      if(flag === 1) {
        this.pager.currentPage = 1
      }
      const params = {
        code: this.$store.getters.curCom,
        name: this.keyword,
        current: this.pager.currentPage,
        pageSize: this.pager.pageSize
      }
      api.messageManagement.messageRules.getList(params).then(res => {
        this.list = res[0].records
        this.pager.totalPage = res[0].total
        console.log("res:", res)
      })
    },
    // 添加事件
    addMessageRules() {
      this.$router.push({name: 'addRemindMessage'})
    },
    // 编辑事件
    handleUpdateEvent(index) {
      console.log('index:', index)
      this.$router.push({
        name: 'addRemindMessage',
        params: {
          formData: this.list[index]
        }
      })
    },
    // 分页
    currentChange(page) {
      this.pager.currentPage = page
      this.getList()
    },
    // 显示确认对话框
    showConfirmDialog(id,dialogType) {
      console.log(2228)
      this.id = id
      if(dialogType === 'delete') {
        this.$refs.deleteDialog.isVisible = true
      } else if(dialogType === 'stop') {
        this.$refs.stopDialog.isVisible = true
      } else {
        this.$refs.enableDialog.isVisible = true
      }
    },
    // 删除事件
    handleDeleteEvent() {
      console.log('delete',this.id)
      const params = {
        id: this.id,
      }
      api.messageManagement.messageRules.deleteMessage(params).then(res => {
        if(res) {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.$refs.deleteDialog.isVisible = false
          this.getList()
        }
      })         
    },
    // 停用事件
    handleStopEvent() {
      console.log('stop',this.id)
      const params = {
        id: this.id,
        rstatus: 2
      }
      api.messageManagement.messageRules.updateMessage(params).then(res => {
        if(res) {
          this.$message({
            type: 'success',
            message: '停用成功！'
          })
          this.$refs.stopDialog.isVisible = false
          this.getList()
        }
      })      
    },
    // 启用事件
    handleEnableEvent() {
      console.log('stop',this.id)
      const params = {
        id: this.id,
        rstatus: 1
      }
      api.messageManagement.messageRules.updateMessage(params).then(res => {
        if(res) {
          this.$message({
            type: 'success',
            message: '启用成功！'
          })
          this.$refs.enableDialog.isVisible = false
          this.getList()
        }
      })      
    },
    // 查看规则
    handleViewEvent(index) {
      console.log('index:', index)
      this.$router.push({
        name: 'viewRemindMessage',
        params: {
          formData: this.list[index]
        }
      })
    }
  },
  filters: {
    dateFormat(val) {
      console.log(typeof val)
      const d = val.split(' ')[0].split('-')
      return `${d[0]}/${d[1]}/${d[2]}`
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-input .el-input__inner { 
    width: 180px;
    height: 32px;
  }  
  /deep/ .el-pagination {
    padding: 0;
    margin-top: 24px;
  }  
  .container {
    min-width: auto!important;
    /* /deep/.el-dropdown-menu__item:not(.is-disabled):hover {
      color: #f00!important;
      background: #EDF6F2!important;
    } */
    /* 面包屑导航样式 */
    .breadcrumb-wrapper {
      margin: 10px 0 0 20px;
      /deep/ .el-breadcrumb__item:last-child > .el-breadcrumb__inner {
        color: #fff;
      }
      /deep/ .el-breadcrumb__inner {
        color: rgba(255, 255, 255, 0.5);
      }
    }      
    .search-wrapper {
      display: flex;
      align-items: center;
      margin: 20px;
      /deep/ .el-form-item  {
        padding: 0;
        margin: 0;
      }
      /deep/.el-form-item__label {
        color: #fff;
        font-weight: 500;
        font-size: 18px;
        padding: 0;
        margin-right: 20px;
      }      
      .search-title {
        color: #fff;
        font-weight: 500;
        margin-right: 20px;
        font-size: 18px;
      }
      .search-input {
        padding: 6px, 0px, 6px, 0px;
      }  
      /deep/ .el-input__inner {
        border-radius: 40px;
        background: #F5F7FA;
        border: 1px solid #DCDFE6;
        height: 32px;
      }
    }
    .card-wrapper {
      box-shadow: none;
      margin: 20px 20px 0 20px;
      /* border: 1px solid red; */
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      background: transparent;
      /* justify-content: space-between; */
      .card-item {
        width: 400px; 
        /* border:1px solid red; */
        margin-right: 10px;
      }
     
      /* .card-item:last-child:nth-child(4n + 2) {
        margin-right: calc((100% - 400px) / 3 * 2);
      }
      .card-item:last-child:nth-child(4n + 3) {
        margin-right: calc((100% - 400px) / 3 * 1);
      } */
      .card {
        background-image: url('../../../assets/img/rule_setting_card_bg.png');
        height: 240px;
        padding: 0;
        border-radius: 8px;
        /deep/ .el-card__header {
          padding: 7px 15px;
        }
        /deep/ .el-card__body {
          padding: 15px;
        }
        .plus-icon {
          font-size: 50px;
          text-align: center;
          color: #47A87D;
          font-size: 34px;
          font-weight: 500;  
          margin-top: 70px;
          margin-bottom: 18px;        
        }
        .tips {
          text-align: center;
          color: #47A87D;
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 84px;
        }
        .header-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .header-name {
            font-size: 18px;
            font-weight: 500;
          }
          .header-dropdown {
            .el-dropdown-link {
              font-weight: bold;
              font-size: 20px;
              cursor: pointer;
            }

          }
        }
        .desc {
          color: #606266;
          font-size: 14px;
          line-height: 140%;
          height: 150px;
          /* border: 1px solid red; */
          overflow-y: auto;
        }
        .update-date {
          color: #606266;
          font-size: 14px;
          margin-top: 5px;
        }
        .action-btn {
          float: right;
        }
      }
      .card-spacing {
        margin-bottom:20px;
      }
    }
    .pagers {
      margin-left: 20px;
    }
  }
</style>