<template>
  <div class="container">
    <div class="content-wrapper">
      <div class="header-wrapper">
        <div class="search-wrapper">
          <el-form :inline="true" v-model="formData">
            <el-form-item style="margin-right: 20px;">
              <!-- <el-input placeholder="请输入客户名称/消息标题" v-model="formData.name"></el-input> -->
              <el-input 
                @change="getList(1)" 
                @input="getList(1)"
                v-model="formData.keyword"
                type="text" 
                prefix-icon="el-icon-search" 
                placeholder="请输入搜索的内容" 
                clearable
                class="search-input" 
              >
              </el-input>            
            </el-form-item>
            <el-form-item style="margin-right: 20px;">
              <el-select v-model="formData.mstatus" placeholder="发送状态" :clearable="true" @change="getList(1)">
                <el-option label="发送成功" value="1"></el-option>
                <el-option label="消息作废" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <div class="right-button-wrapper">
          <el-button @click="exportMessage" round class="export" icon="el-icon-upload2">导出</el-button>
          <el-button @click="showBatchSendMessageDialog" round class="send" icon="el-icon-position">一键重发</el-button>
        </div>
      </div>
      <el-table
        :data="list"
        header-row-class-name="custom-table-header"
        header-cell-class-name="custom-table-header-cell"
        cell-class-name="custom-table-cell"
        class="custom-table-n"   
        ref="historyTable"
        border
      >
        <el-table-column type="selection" :selectable="handleTableColumnSelected" width="65"></el-table-column>
        <el-table-column prop="name" label="客户名称" min-width="280" show-overflow-tooltip fixed></el-table-column>
        <el-table-column label="慧用能使用情况" width="162">
          <template slot-scope="scope">
            <div v-if="scope.row.used === '1'"><span style="display:inline-block;width:10px;height:10px;border-radius:10px;background:#67C23A;"></span> <span>已使用</span></div>
            <div v-if="scope.row.used === '0'"><span style="display:inline-block;width:10px;height:10px;border-radius:10px;background:#F56C6C;"></span> <span>未使用</span></div>
          </template>          
        </el-table-column>
        <el-table-column prop="title" label="消息标题" width="180" show-overflow-tooltip=""></el-table-column>
        <el-table-column prop="content" label="通知具体内容" width="200">
          <template slot-scope="scope">
            <el-tooltip placement="top">
              <div slot="content" style="width:300px;line-height:120%;">{{scope.row.content}}</div>
              <div class="custom-ellipsis">{{scope.row.content}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发送时间" width="210"></el-table-column>
        <el-table-column prop="" label="操作人员" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.operationUser ? scope.row.operationUser : '系统' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发送状态" width="130">
          <template slot-scope="scope">
            <div v-if="scope.row.mStatus === '1'">
              <span style="display:inline-block;width:10px;height:10px;border-radius:10px;background:#67C23A;"></span> <span>发送成功</span>
            </div>
            <div v-if="scope.row.mStatus === '2'">
              <span style="display:inline-block;width:10px;height:10px;border-radius:10px;background:#F56C6C;"></span> <span>消息作废</span>
            </div>                               
          </template>             
        </el-table-column>
        <el-table-column label="接收状态" width="130">
          <template slot-scope="scope">
            <div v-if="scope.row.isRead === '1'">
              <span style="display:inline-block;width:10px;height:10px;border-radius:10px;background:#67C23A;"></span> <span>已读</span>
            </div>
            <div v-if="scope.row.isRead === '0'">
              <span style="display:inline-block;width:10px;height:10px;border-radius:10px;background:#E6A23C;"></span> <span>未读</span>
            </div>
          </template>          
        </el-table-column>        
        <!-- <el-table-column prop="createTime" label="生成时间" width="210"></el-table-column> -->
        <el-table-column label="操作" width="104" fixed="right">
          <template slot-scope="scope">
            <div v-if="scope.row.mStatus === '2' && scope.row.used === '1'">
              <el-button type="text" @click="handleReSendEvent(scope.row)">重新发送</el-button>
            </div>
            <div v-else>
              <el-button type="text" :disabled="true">重新发送</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background class="custom-page-n" layout="total, slot, prev, pager, next, sizes" :current-page="pager.currentPage" :page-size="pager.pageSize" :page-sizes="[10,20,30]" :total="pager.totalPage" @current-change="handleCurrentChangeEvent" @size-change="handleSizeChange"><span style="color: #606266;">当前{{this.list.length}}条</span></el-pagination>
    </div>
    <ConfirmDialog ref="batchSendDialog" title="超能预警消息一键发送" :content="contentOfBatchSendMessage" :confirmEvent="handleBatchSendEvent"></ConfirmDialog>
  </div>
</template>

<script>
import api from '/src/http/api'
import exportApi from '/src/components/export/export'
import ConfirmDialog from '../../components/confirmDialog.vue'

export default {
  mixins:[exportApi],
  components: {
    ConfirmDialog
  },
  data() {
    return {
      list: [],
      formData: {
        // customerName: "",
        // title: "",
        keyword: '',
        mstatus: "",
      },
      pager: {
        currentPage: 1,
        pageSize: 10,
        totalPage: null
      },
      contentOfBatchSendMessage: '',
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
        current: this.pager.currentPage,
        pageSize: this.pager.pageSize,
        code: this.$store.getters.curCom,
        mStatus: this.formData.mstatus,
        orgLevel: this.$store.getters.curComInfo.orgLevel,  // 3 管理实体 4 法人公司
        keyword: this.formData.keyword
      }
      api.messageManagement.messageList.historyMessage.getList(params).then(res => {
        this.list = res[0].list
        this.pager.totalPage = res[0].total
      })

    },
    // 导出
    exportMessage() {
      let params = {
        current: this.pager.currentPage,
        pageSize: this.pager.pageSize,
        code: this.$store.getters.curCom,
        customerName: this.formData.customerName,
        mstatus: this.formData.mstatus,
        orgLevel:  this.$store.getters.curComInfo.orgLevel,  // 3 管理实体 4 法人公司
        title: this.formData.title
      }
      api.messageManagement.messageList.historyMessage.export(params).then(res => {
        this.download(res, 'xlsx', '消息列表 历史消息')
      })
    },
    // 重新发送
    handleReSendEvent(row) {
      const params = [{
        id: row.id,
        loginId: this.$store.getters.userInfo.userId,
        loginName: this.$store.getters.userInfo.name       
      }]
      const mStatus = row.mStatus
      if(mStatus === 1) {
        this.$message({
          type: 'warning',
          message: '消息处于已发送状态，不能重新发送！'
        })
        return
      }
      api.messageManagement.messageList.historyMessage.reSendMessage(params).then(res => {
        if(res) {
          this.$message({
            type: 'success',
            message: '发送成功！'
          })
          this.getList()
        }
      })
    },
    // 一键发送事件，显示dialog
    showBatchSendMessageDialog() {
      // 如果用户未选择任何数据，则给出提示
      const selection = this.$refs.historyTable.selection
      if(!selection || selection.length <1) {
        this.$message({
          type: 'warning',
          message: '请选择数据后再执行一键发送操作！',
          duration: 3000
        })
        return false
      }
      // 显示提示dialog      
      this.$refs.batchSendDialog.isVisible = true
      // this.id = row.id
      this.contentOfBatchSendMessage = `<p>确认要执行批量一键发送操作吗？</p>`
    },
    // 一键发送
    handleBatchSendEvent() {
      const selection = this.$refs.historyTable.selection
      const idsArr = []
      selection.map(item => {
        idsArr.push({
          id: item.id
        })
      })
      api.messageManagement.messageList.historyMessage.reSendMessage(idsArr).then(res => {
        if(res) {
          this.$message({
            type: 'success',
            message: '发送成功！'
          })
          this.$refs.batchSendDialog.isVisible = false
        }
      })
    },
    // 分页
    handleCurrentChangeEvent(currentPage) {
      this.pager.currentPage = currentPage;
      this.getList();
    },
    // 分页器 调整记录显示数量
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.pager.currentPage = 1
      this.getList()
    },
    // 表格列selectable的回调方法，判断行复选框的可用、禁用状态
    handleTableColumnSelected(row) {
      // 消息发送成功时（mStatus值为1）时，此行不可选，否则可选，一键发送根据复选框选中状态向后端接口传递参数
      if(row.mStatus !== '1') {
        return true
      }
    }
  }
};
</script>

<style lang='scss' scoped>
/* @import '../../css/customer_public_css.scss'; */
/deep/ .el-select .el-input__inner {
    border-radius: 4px;
    background: #fff;
    border:1px solid #e4e7ed;
    padding-left: 14px;
    color: #606266;
    width: 180px;
    height: 32px;
  }
  /deep/ .el-input .el-input__inner { 
    width: 180px;
    height: 32px;
  }  
  /deep/ .el-select .el-input__suffix {
    border-left: none;  // 去除原全局样式中的左侧竖线
  } 

  /deep/ .el-pagination {
    padding: 0;
    margin-top: 24px;
  }  
.container {
  .content-wrapper {
    .header-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;  
        .search-wrapper {
          .search-input {
            padding: 6px, 0px, 6px, 0px;
          }  
          /deep/ .el-input__inner {
            border-radius: 40px;
            background: #F5F7FA;
            border: 1px solid #DCDFE6;
            height: 32px;
          }
          /deep/ .el-input__prefix, .el-input__suffix {
            top:0px;
          }            
        }
        .right-button-wrapper {
          margin-bottom:16px;
          .export {
            width: 79px;
            height: 32px;
            padding: 0;
          }
          .send {
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
    .table-wrapper {

    }
    .custom-ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  /deep/.el-pagination__sizes {
    margin-bottom: 2px;
  }
  /deep/.el-pagination__sizes .el-input .el-input__inner {
    width: 100px;
    height: 30px;
    border-radius: 0;
  }
}
</style>