<template>
  <div class="container">
      <el-dialog
        :visible.sync="visible"
        :width="'420px'"
      >
        <div slot="title" class="dialog-title-wrapper">
            <span class="title">生成方案</span>
        </div>
        <div>
            <div class="programme-name">方案名称</div>
            <div><el-input type="text" maxlength="30" show-word-limit placeholder="请输入方案名称" v-model="name"/></div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button class="btn" round @click="visible = false">取 消</el-button>
            <el-button class="btn" round type="primary" @click="handleOkEvent">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
    props: {
        customDialogList: {
            type: Array,
            default: () => []
        },
        generateProgrammeAction: {
            type: Function,
            defalt: () => {}
        }
    },
    data() {
        return {
            visible: false,
            name: ''
        }
    },
    methods: {
        handleOkEvent() {
            this.visible = false
            if(this.name === '') {
                this.$message({
                    message: '方案名称不能为空！',
                    type: 'info',
                    duration: 1000
                })
                return false
            }
            this.generateProgrammeAction(this.name)
        }
    }
}
</script>

<style lang='scss' scoped>
.container {
    /deep/.el-dialog__header {
        padding-left: 0;
        padding-right: 0;
        padding-bottom: 20px;
    }
    /deep/.el-dialog__body {
        padding-top: 0;
    }
    .dialog-title-wrapper {
        padding-left: 20px;
        padding-bottom: 12px;
        .title {
            color: #303133;
            font-size: 18px;
            font-weight: 500;
        }
        .unit {
            color: #606266;
            font-size: 14px;
            font-weight: 400;
        }
        .subtitle {
            color: #E6A23C;
            font-size: 14px;
            font-weight: 500;
            background: #FCF6EC;
            border-radius: 14px;
            padding: 5px 10px;
            margin-left:10px;
        }
    }
    .programme-name {
        color: #606266;
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 10px;
    }
    .btn {
        width: 58px;
        height: 32px;
        padding: 0;
    }
}
</style>