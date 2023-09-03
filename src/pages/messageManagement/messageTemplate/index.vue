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
    <div class="table-wrapper1">
      <div class="header-wrapper1">
        <div class="search-wrapper1">
          <!-- <div class="search-title1">消息模板</div> -->
          <el-form :inline="true">
            <el-form-item label="消息模板" label-width="200">
              <el-input 
                @change="getList(1)" 
                @input="getList(1)"
                v-model="formData.keyword"
                type="text" 
                prefix-icon="el-icon-search" 
                placeholder="请输入搜索的内容" 
                clearable
                class="search-input1" 
              >
              </el-input>

            </el-form-item>

          </el-form>
        </div>
        <div class="right-button-wrapper1">
          <el-button @click="addMessageTemplate" round class="btn1" icon="el-icon-plus">新增模板</el-button>
        </div>
      </div>
      <div class="table">
        <el-table 
          :data="list"
          header-row-class-name="custom-table-header"
          header-cell-class-name="custom-table-header-cell"
          cell-class-name="custom-table-cell"
          class="custom-table-n"  
          border
        >
          <el-table-column prop="className" label="消息分类" width="220"></el-table-column>
          <el-table-column prop="mTitle" label="消息标题" width="300" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="mContent"
            label="通知模板内容"
            min-width="300"
          >
            <template slot-scope="scope">
              <el-tooltip placement="top">
                <div slot="content" style="width: 300px;line-height:150%;">{{scope.row.mContent}}</div>
                <div class="customer-ellipsis">{{scope.row.mContent}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="210"></el-table-column>
          <el-table-column prop="" label="操作" width="196" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="handleView(scope.row.id)">查看<span style="padding-left:10px;">|</span></el-button>
              <el-button type="text" @click="handleEdit(scope.row)">编辑<span style="padding-left:10px;">|</span></el-button>
              <el-button type="text" @click="handleStop(scope.row)">{{ scope.row.mStatus === 1 ? "停用" : "启用" }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeEvent"
          background
          class="custom-page-n"
          layout="total, slot, prev, pager, next, sizes"
          :total="pager.totalPage"
          :page-size="pager.pageSize"
          :page-sizes="[10,20,30]"
          :current-page="pager.currentPage"
          @size-change="handleSizeChange"
        >
          <span style="color: #606266;">当前{{this.list.length}}条</span>
        </el-pagination>
      </div>
      <!-- <edit-message ref="addDialog"></edit-message> -->
      <detail-dialog ref="detailDialog" :detailData="detailData"></detail-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import TopMenu from '@components/topMenu/topMenu2'
import api from "/src/http/api";
// import editMessage from "./components/editMessage.vue";
import DetailDialog from "./components/detailDialog.vue"
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'

export default {
  components: {
    // EditMessage: editMessage,
    DetailDialog,
    TopMenu
  },
  mixins: [buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
  data() {
    return {
      list: [],
      formData: {
        // className: "",
        // mTitle: "",
        keyword: ''
      },
      pager: {
        currentPage: 1,
        pageSize: 10,
        totalPage: 0,
      },
      detailData:{},  // 详情页面数据
      wxServiceNoticeList: []
    };
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
    this.getList();
    this.getWxServiceNoticeList()
  },
  methods: {
    // 获取消息列表
    getList(flag = '') {
      if(flag === 1) {
        this.pager.currentPage = 1
      }
      const params = {
        compCode: this.$store.getters.curCom,
        currentPage: this.pager.currentPage,
        pageSize: this.pager.pageSize,
        // className: this.formData.className,
        // mTitle: this.formData.mTitle,
        keyword: this.formData.keyword
      };
      api.messageManagement.messageTemplate.getList(params).then((res) => {
        this.list = res[0].list;
        this.pager.totalPage = res[0].total;
        console.log("1 get list:", res);
      });
    },
    // 打开新增对话框
    addMessageTemplate() {
      // this.$refs.addDialog.isVisible = true;
      this.$router.push({name: 'addMessageTemplate'})
    },
    // 查看
    handleView(id) {
      this.$refs.detailDialog.isVisible = true
      console.log("handle view id:", id);
      const params = {
        id,
      };
      api.messageManagement.messageTemplate.getDetail(params).then((res) => {
        console.log("get detail:", res);
        this.detailData = res[0]
        this.detailData.wxMessageJson = JSON.parse(this.detailData.wxMessageJson) // 详情页构造关键词区域表单元素用
        // 微信服务通知内容
        if(this.detailData.wxMessageId) {
          const arr = this.wxServiceNoticeList.find(item => item.id === this.detailData.wxMessageId)
          this.detailData.wxServiceNoticeStr = arr['name']
        }
        // 提醒途径
        this.convertMtype()
      });
    },
    // 构造提醒途径（将逗号分隔的字符串转换成相应的汉字）  
    convertMtype() {
      let arr = [
        '小程序内部通知',"","",'微信通知'
      ]
      let str = ''
      let mType = this.detailData.mType;
      mType.split(',').map(item => {
       str+= arr[item-1]+"、";
      })
      str=str.substring(0,str.length-1);
      this.detailData.mType = str
    },
    // 编辑
    handleEdit(row) {
      console.log("edit row:", row);
      this.$router.push({
        name: 'addMessageTemplate',
        params: {
          formData: row
        }
      })
    },
    // 停用
    handleStop(row) {
      let params = {
        id: row.id,
        mStatus: row.mStatus === 1 ? 2 : 1,
      };
      // let mstatusStr = row.mStatus === 1 ? "停用" : "启用";
      // api.messageManagement.messageTemplate.stopMessage(params).then((res) => {
      //   console.log('stop res:', res)
      //   if (res) {
      //     this.$message.success(mstatusStr + "成功！");
      //     this.getList();
      //     this.isVisible = false;
      //   }
      // });
      // 为了获取到接口返回的提示信息并展示给用户，这里单独使用axios直接发送请求、获取数据（未使用封装的http请求方法）
      axios.request({
        url: 'dongwan/smartMessageTemplate/delete',
        method: 'get',
        params
      }).then(res => {
        if (res.data.errorCode === '0') {
          console.log('stop res:', res)
          this.$message.success(res.data.message);
          this.getList();
          this.isVisible = false;
        }        
      })      
      this.getList()
    },
    // 分页
    handleCurrentChangeEvent(currentPage) {
      this.pager.currentPage = currentPage;
      this.getList();
    },
    // 分页器 调整每页显示数量 
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.pager.currentPage = 1
      this.getList()
    },
    // 获取微信服务通知列表
    getWxServiceNoticeList() {
        api.messageManagement.messageTemplate.getWxMessageNoticeList().then(res => {
            this.wxServiceNoticeList = res[0]
        })      
    }
  },
};
</script>

<style lang='scss' scoped>
/* @import '../css/customer_public_css.scss'; */
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
  /* 面包屑导航样式 */
  .breadcrumb-wrapper {
    margin: 10px 20px 0 20px;
    /deep/ .el-breadcrumb__item:last-child > .el-breadcrumb__inner {
      color: #fff;
    }
    /deep/ .el-breadcrumb__inner {
      color: rgba(255, 255, 255, 0.5);
    }
  }   
  .table-wrapper1 {
    background: #fff;
    margin: 10px 20px 20px 20px;
    padding: 20px;
    border-radius: 4px;
    .header-wrapper1 {
      display: flex;
      justify-content: space-between;
      .search-wrapper1 {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        /deep/.el-form-item__label {
          color: #303133;
          font-weight: 500;
          padding: 0;
          margin-right: 20px;
          font-size: 18px;          
        }
        /deep/ .el-form-item  {
          padding: 0;
          margin: 0;
        }
        /deep/ .el-input__inner {
          border-radius: 40px;
          background: #F5F7FA;
          border: 1px solid #DCDFE6;
          height: 32px;
        }
      }
      .right-button-wrapper1 {
        .btn1 {
          width: 107px;
          height: 32px; 
          padding: 0;
          background: #47A87D;
          color: #fff;
          text-align: center;
          border: none;
        }
      }
    }
  }
  .customer-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /deep/.el-pagination__sizes .el-input .el-input__inner {
    width: 100px;
    height: 30px;
    border-radius: 0;
  }
}
</style>