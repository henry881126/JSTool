<template>
  <div class="container">
      <el-dialog
        :title="title"
        :visible.sync = "isVisible"
        :close-on-click-modal="false"
      >
      <div class="content" v-html="content"></div>

      <div slot="footer">
        <el-button round class="btn-cancel" @click="isVisible = false">取 消</el-button>
        <!-- <el-button round class="btn-cancel"  @click="handleToVoidEvent">作 废</el-button> -->
        <el-button round type="primary" class="btn-confirm" @click="handleConfirmEvent">确 定</el-button>
      </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            isVisible: false
        }
    },
    props: {
        title: {
            type: String,
            default: '提示'
        },
        content: {
            type: String,
            default: ''
        },
        confirmEvent: {
            type: Function
        },
        toVoidEvent: {
            type: Function
        }
    },
    methods: {
        handleConfirmEvent() {
            this.confirmEvent()
        },
        handleToVoidEvent() {
            this.toVoidEvent()
        }
    }
}
</script>

<style lang='scss' scoped>
.container {
    /deep/ .el-dialog {
        width: 570px;
    }
    /deep/ .el-dialog__header .el-dialog__title {
        font-size: 18px;
        color: #303133;
        font-weight: bold;
    }
    /deep/ .el-dialog__body {
        padding: 0px 20px 20px 20px;

    }
    /deep/ .el-button {
            width: 58px;
            height: 32px;
            padding: 0;
            font-size: 14px;
            line-height: 32px;
    }
    /deep/ .el-button--primary {
            background: #47A87D;
            border-color: #47A87D;
    }
    .content {

    }
    .footer {
        .btn-cancel {
            
        }
        .btn-confirm {

        }
    }
}
</style>