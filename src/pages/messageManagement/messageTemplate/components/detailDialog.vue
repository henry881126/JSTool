<template>
  <div class="container">
      <el-dialog
        :visible.sync="isVisible"
      >
      <div slot="title" class="dialog-title-wrapper">
          <span class="title">消息模板</span>
      </div>
      <div class="content-wrapper">
        <el-row>
            <span class="title">提醒途径：</span>
            <span class="content">{{detailData.mType}}</span>
        </el-row>

        <el-row>
            <el-col :span="10">
                <span class="title">消息分类：</span>
                <span class="content">{{detailData.className}}</span>
            </el-col>
            <el-col :span="10">
                <span class="title">消息标题：</span>
                <span class="content">{{detailData.mTitle}}</span>
            </el-col>
        </el-row>

        <el-row>
            <span class="title" style="float: left;">消息内容：</span>
            <span class="content message-content" style="float: left;white-space: pre-wrap;">{{detailData.mContent}}</span>
        </el-row>
        <div v-if="detailData.mType.indexOf('微信通知') !== -1">
            <el-row>
                <el-header class="header">
                    <span class="header-tag"></span>
                    <span class="header-title">微信服务通知</span>
                </el-header>
                <span class="title">微信服务通知：</span>
                <span class="content">{{ detailData.wxServiceNoticeStr }}</span>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-header class="header">
                    <span class="header-tag2"></span>
                    <span class="header-title2">关键词：</span>
                </el-header>     
                <div v-for="(item, index) in detailData.wxMessageJson" :key="index">
                    <span class="title">{{ item.name }}：</span>
                    <span class="content">{{ item.value }}</span>
                </div>                                            
            </el-row>                        
        </div>
      </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            isVisible: false,
            keywordArr: [],
            wxServiceNoticeStr: ''
        }
    },
    props: {
        detailData:{
            type:Object
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    /deep/ .el-dialog__wrapper {
        background: rgba(22, 47, 96, 0.5);
        display: flex;
    }
    /deep/ .el-dialog {
        margin: auto!important;
    }
    /deep/.el-dialog__header {
        padding: 0;
    }
    /deep/.el-dialog__close {
        margin-top:5px;
    }
    .dialog-title-wrapper {
        border-bottom: 1px solid #DCDFE6;
        padding: 20px;
        .title {
            font-size: 16px;
            color: #303133;
            font-weight: bold;
            padding:0;
            margin:0;
        }
    }
    .content-wrapper {
        padding: 20px 20px 10px 20px;
        .title {
            display: inline-block;
            width: 132px;
            margin-bottom: 20px;
            color: #606266;
            text-align: right;
        }
        .content {
            color: #303133;
        }
        .message-content {
            display: inline-block;
            /* width: 670px; */
            width: calc(100% - 200px);
            min-height: 80px;
            background: #F5F7FA;
            border-radius: 4px;
            padding: 15px;
        }
        .header {
            display: flex;
            align-items: center;
            font-weight: bolder;
            padding: 0;
            .header-tag {
                width: 4px;
                height: 16px;
                background:#47A87D;
                display: inline-block;
                text-align: center;
                margin-right: 5px;
            }
            .header-title {
                font-size: 16px;
                font-weight: bold;
                color: #303133;
            }
            .header-tag2 {
                width: 8px;
                height: 8px;
                background:#47A87D;
                display: inline-block;
                text-align: center;
                margin-right: 5px;
            }
            .header-title2 {
                font-size: 14px;
                font-weight: bold;
                color: #303133;
            }            
        }
        /* 分隔线样式 */
        .el-divider {
            margin: 0;
        }
    }
}
</style>