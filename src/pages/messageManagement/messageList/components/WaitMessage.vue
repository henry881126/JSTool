<template>
  <div class="container">
    <div class="content-wrapper">
      <div class="header-wrapper">
        <div class="search-wrapper">
          <el-form :inline="true"
                   class="elForm"
                   v-model="formData">
            <el-form-item style="margin-right: 20px;">
              <el-input @change="getList(1)"
                        @input="getList(1)"
                        v-model="formData.keyword"
                        type="text"
                        :disabled="tableLoading"
                        prefix-icon="el-icon-search"
                        placeholder="请输入搜索的内容"
                        class="search-input">
              </el-input>
            </el-form-item>
            <el-form-item label=""
                          style="margin-right: 20px;">
              <el-select v-model="formData.mstatus"
                         placeholder="消息分类"
                         :clearable='true'
                         :disabled="tableLoading"
                         @change="getList">
                <el-option :label="item.dicValue"
                           :value="item.id"
                           :key="item.id"
                           v-for="item in messageCategoryList"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <div class="right-button-wrapper">
          <el-button @click="exportMessage"
                     round
                     class="export"
                     icon="el-icon-upload2">导出</el-button>
          <el-button @click="becomeInvalid"
                     round
                     class="fail"
                     icon="el-icon-delete">一键作废</el-button>
          <el-button @click="showBatchSendMessageDialog"
                     round
                     class="send"
                     icon="el-icon-position">一键发送</el-button>
        </div>
      </div>
      <el-table :data="list"
                v-loading="tableLoading"
                header-row-class-name="custom-table-header"
                header-cell-class-name="custom-table-header-cell"
                cell-class-name="custom-table-cell"
                class="custom-table-n"
                ref="waitTable"
                border>
        <el-table-column type="selection"
                         width="65"></el-table-column>
        <el-table-column prop="name"
                         label="客户名称"
                         min-width="200"
                         show-overflow-tooltip
                         fixed></el-table-column>
        <el-table-column label="慧用能使用情况"
                         width="162">
          <template slot-scope="scope">
            <div v-if="scope.row.used === '1'"><span style="display:inline-block;width:10px;height:10px;border-radius:10px;background:#67C23A;"></span> <span>已使用</span></div>
            <div v-if="scope.row.used === '0'"><span style="display:inline-block;width:10px;height:10px;border-radius:10px;background:#67C23A;background:#F56C6C;"></span> <span>未使用</span></div>
          </template>
        </el-table-column>
        <el-table-column prop="title"
                         label="消息标题"
                         width="220"
                         show-overflow-tooltip=""></el-table-column>
        <el-table-column prop="messageId"
                         label="消息分类"
                         width="220"
                         show-overflow-tooltip="">
          <template slot-scope="scope">
            {{messageTypes[scope.row.messageId]}}
          </template>
        </el-table-column>
        <el-table-column prop="content"
                         label="通知具体内容"
                         min-width="250">
          <template slot-scope="scope">
            <el-tooltip placement="top">
              <div slot="content"
                   style="width: 450px;line-height:120%;">{{scope.row.content}}</div>
              <div class="custom-ellipsis">{{scope.row.content}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createTime"
                         label="生成时间"
                         width="210"></el-table-column>
        <el-table-column label="操作"
                         width="138"
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="showSendMessageDialog(scope.row)"
                       v-if="scope.row.used === '1'">发送<span style="padding-left:10px;">|</span></el-button>
            <el-button type="text"
                       @click="showSendMessageDialog(scope.row)"
                       v-if="scope.row.used !== '1'"
                       :disabled="true"
                       style="color: #C0C4CC;">发送<span style="padding-left:10px;">|</span></el-button>
            <el-button type="text"
                       @click="showVoidMessageDialog(scope.row)">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     class="custom-page-n"
                     layout="total, slot, prev, pager, next, sizes"
                     :current-page="pager.currentPage"
                     :page-size="pager.pageSize"
                     :page-sizes="[10,20,30]"
                     :total="pager.totalPage"
                     @current-change="handleCurrentChangeEvent"
                     @size-change="handleSizeChange"><span style="color: #606266;">当前{{this.list.length}}条</span></el-pagination>
    </div>
    <ConfirmDialog ref="confirmDialog"
                   title="超能预警消息发送"
                   :content="contentOfSendMessage"
                   :confirmEvent="handleSendEvent"></ConfirmDialog>
    <ConfirmDialog ref="voidDialog"
                   title="提示"
                   :content="contentOfVoidMessage"
                   :confirmEvent="handleAbolishEvent"></ConfirmDialog>
    <ConfirmDialog ref="batchSendDialog"
                   title="超能预警消息一键发送"
                   :content="contentOfBatchSendMessage"
                   :confirmEvent="handleBatchSendEvent"></ConfirmDialog>
    <ConfirmDialog ref="becomeInvalid"
                   title="超能预警消息一键作废"
                   :content="subBecomeInvalidMessage"
                   :confirmEvent="subBecomeInvalid"></ConfirmDialog>
  </div>
</template>

<script>
import axios from 'axios'
import api from '/src/http/api'
import exportApi from '/src/components/export/export'
import ConfirmDialog from '../../components/confirmDialog.vue'

export default {
  mixins: [exportApi],
  components: {
    ConfirmDialog
  },
  data () {
    return {
      messageTypes: {},
      tableLoading: false,
      messageCategoryList: [],//消息分类列表
      id: null, // 记录ID
      list: [],
      formData: {
        keyword: '',
        mstatus: '',
      },
      pager: {
        currentPage: 1,
        pageSize: 10,
        totalPage: null,
      },
      contentOfSendMessage: '',
      contentOfVoidMessage: '',
      contentOfBatchSendMessage: '',
      subBecomeInvalidMessage: '',
    }
  },
  computed: {
    curCom () {
      return this.$store.getters.curCom
    }
  },
  watch: {
    curCom () {
      this.getList()
    }
  },
  created () {
    this.getList()
    this.getMessageCategory()
  },
  methods: {
    // 一键作废
    becomeInvalid () {
      const selection = this.$refs.waitTable.selection
      if (!selection || selection.length < 1) {
        this.$message({
          type: 'warning',
          message: '请选择数据后再执行一键作废操作！',
          duration: 3000
        })
        return false
      }
      this.$refs.becomeInvalid.isVisible = true
      this.subBecomeInvalidMessage = `<p>确认要执行批量一键作废操作吗？</p>`
    },
    subBecomeInvalid () {
      const params = {
        messageSendVOList: []
      }
      let loginId = this.$store.getters.userInfo.userId
      let loginName = this.$store.getters.userInfo.name
      const selection = this.$refs.waitTable.selection
      selection.forEach(item => {
        let obj = {
          id: item.id,
          loginId,
          loginName
        }
        params.messageSendVOList.push(obj)
      })
      // JSON.stringify(params)
      api.messageManagement.messageList.waitToBeSendMessage.voidMessage(params.messageSendVOList).then(res => {
        if (res) {
          this.$refs.becomeInvalid.isVisible = false
          this.$message({
            type: 'success',
            message: '作废成功！'
          })
          this.getList()
        }
      })
    },
    getMessageCategory () {
      const params = {
        "dicKey": "smart_message_subject"
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
          this.messageCategoryList.forEach(item => {
            this.messageTypes[item.id] = item.remark
          })
          // 在编辑表单中根据 消息分类 下拉列表中当前值，获取可用变量条件
          // if (this.formData.className) {
          //   const currentMessageCategory = this.messageCategoryList.find(item => item.dicValue === this.formData.className)
          //   this.handleEnableVariableConditionChange({ id: currentMessageCategory.id })
          // }
        })
      })

    },
    getList (flag = '') {
      if (flag === 1) {
        this.pager.currentPage = 1
      }
      const params = {
        current: this.pager.currentPage,
        pageSize: this.pager.pageSize,
        code: this.$store.getters.curCom,
        messageType: this.formData.mstatus,
        orgLevel: this.$store.getters.curComInfo.orgLevel,  // 3 管理实体 4 法人公司
        keyword: this.formData.keyword
      }
      this.tableLoading = true
      api.messageManagement.messageList.waitToBeSendMessage.getList(params).then(res => {
        this.tableLoading = false
        this.list = res[0].list
        this.pager.totalPage = res[0].total
      })

    },
    // 发送 链接 事件，弹出dialog
    showSendMessageDialog (row) {
      this.$refs.confirmDialog.isVisible = true
      this.id = row.id
      // this.contentOfSendMessage = `<p style="font-weight:bold;">发送至<span style="padding-right:10px;"></span>${row.name}有限公司</p>
      //           <p>${row.content}</p>
      //           <p style="font-weight:bold;text-align:right;">通知时间：${this.getCurrentDate()}</p>
      //         `     
      this.contentOfSendMessage = `<p style="font-weight:bold;">发送至<span style="padding-right:10px;"></span>${row.name}有限公司</p>
                <p>${row.content}</p>
              `
    },
    // 发送动作
    handleSendEvent () {
      const param = [{
        id: this.id,
        loginID: this.$store.getters.userInfo.userId,
        loginName: this.$store.getters.userInfo.name
      }]
      api.messageManagement.messageList.waitToBeSendMessage.sendMessage(param).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '发送成功！'
          })
          this.$refs.confirmDialog.isVisible = false
          this.getList()
        }
      })
    },
    // 作废 链接 事件，弹出dialog
    showVoidMessageDialog (row) {
      this.$refs.voidDialog.isVisible = true
      this.id = row.id
      this.contentOfVoidMessage = `<p>确认要作废“${row.name}”的“反馈服务通知”吗？</p>`
    },
    // 作废运作
    handleAbolishEvent () {
      const params = {
        messageSendVOList: [{
          id: this.id,
          loginId: this.$store.getters.userInfo.userId,
          loginName: this.$store.getters.userInfo.name
        }]
      }
      api.messageManagement.messageList.waitToBeSendMessage.voidMessage(params.messageSendVOList).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '作废成功！'
          })
          this.$refs.voidDialog.isVisible = false
          this.getList()
        }
      })
    },
    // 一键发送 事件，弹出dialog
    showBatchSendMessageDialog () {
      // 如果用户未选择任何数据，则给出提示
      const selection = this.$refs.waitTable.selection
      if (!selection || selection.length < 1) {
        this.$message({
          type: 'warning',
          message: '请选择数据后再执行一键发送操作！',
          duration: 3000
        })
        return false
      }
      // 显示提示dialog
      this.$refs.batchSendDialog.isVisible = true
      this.contentOfBatchSendMessage = `<p>确认要执行批量一键发送操作吗？</p>`
    },
    // 一键发送动作
    handleBatchSendEvent () {
      const selection = this.$refs.waitTable.selection
      let idsArr = []
      selection.map(item => {
        idsArr.push({
          id: item.id
        })
      })
      api.messageManagement.messageList.waitToBeSendMessage.sendMessage(idsArr).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '一键发送成功！'
          })
          this.$refs.batchSendDialog.isVisible = false
          this.getList()
        }
      })
    },
    // 导出
    exportMessage () {
      let params = {
        current: this.pager.currentPage,
        pageSize: this.pager.pageSize,
        code: this.$store.getters.curCom,
        customerName: this.formData.customerName,
        mstatus: this.formData.mstatus,
        orgLevel: this.$store.getters.curComInfo.orgLevel,  // 3 管理实体 4 法人公司
        title: this.formData.title
      }
      api.messageManagement.messageList.waitToBeSendMessage.export(params).then(res => {
        this.download(res, 'xlsx', '消息列表 待发消息')
      })
    },
    // 一键发送
    send () {

    },
    // 分页
    handleCurrentChangeEvent (currentPage) {
      this.pager.currentPage = currentPage;
      this.getList();
    },
    // 分页器记录显示数量调整事件
    handleSizeChange (val) {
      this.pager.pageSize = val
      this.pager.currentPage = 1
      this.getList()
    },
    // 获取当前日期
    getCurrentDate () {
      const d = new Date()
      return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
    }
  }
};
</script>

<style lang='scss' scoped>
/* @import '../../css/customer_public_css.scss'; */

.elForm /deep/ input::-webkit-input-placeholder {
  color: #606266;
}
.elForm /deep/ input:-moz-placeholder {
  color: #606266;
}
.elForm /deep/ input::-moz-placeholder {
  color: #606266;
}
.elForm /deep/ input:-ms-input-placeholder {
  color: #606266;
}
.elForm /deep/ input {
  color: #303133;
}
.elForm /deep/ .el-select input {
  color: #303133;
}
/deep/ .el-select .el-input__inner {
  border-radius: 4px;
  background: #fff;
  border: 1px solid #e4e7ed;
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
  border-left: none; // 去除原全局样式中的左侧竖线
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
          background: #f5f7fa;
          border: 1px solid #dcdfe6;
          height: 32px;
        }
        /deep/ .el-input__prefix,
        .el-input__suffix {
          top: 0px;
        }
      }
      .right-button-wrapper {
        margin-bottom: 16px;
        .export {
          width: 79px;
          height: 32px;
          padding: 0;
          background: #f5f7fa;
        }
        .send {
          width: 107px;
          height: 32px;
          padding: 0;
          background: #47a87d;
          color: #fff;
          text-align: center;
          border: none;
        }
        .fail {
          width: 107px;
          height: 32px;
          padding: 0;
          background: #f5f7fa;
          text-align: center;
        }
      }
    }
  }
  .custom-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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