<template>
  <div class="container gas-page-bg">
    <top-menu title="天然气输配(调度)智慧管理平台"></top-menu>
    
    <div class="breadcrumb-wrapper">
      <el-breadcrumb>
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>消息管理</el-breadcrumb-item>
        <el-breadcrumb-item>消息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>  

    <div class="content-wrapper">
      <el-tabs v-model="messageType" @tab-click="handleTabsChange">
        <el-tab-pane label="待发消息" name="waitMessage">
          <wait-message ref="waitMessage"></wait-message>
        </el-tab-pane>
        <el-tab-pane label="历史消息" name="historyMessage">
          <history-message ref="historyMessage"></history-message>
        </el-tab-pane>
      </el-tabs>
    </div>  
  </div>
</template>

<script>
import TopMenu from '@components/topMenu/topMenu2'
import WaitMessage from './components/WaitMessage.vue'
import HistoryMessage from './components/HistoryMessage.vue'
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'

export default {
  components: {
    TopMenu,
    WaitMessage,
    HistoryMessage
  },
  mixins: [buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],
  data() {
    return {
      messageType:'waitMessage'
    }
  },
  methods: {
    handleTabsChange(val) {
      console.log('val:',val, this.messageType)
      if(val.index === '0') {
        this.$refs.waitMessage.getList()
      } else if(val.index === '1') {
        this.$refs.historyMessage.getList()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.container {
  min-width: auto!important;
  .breadcrumb-wrapper {
    margin: 10px 20px 0 20px;
    /deep/ .el-breadcrumb__item:last-child > .el-breadcrumb__inner {
      color: #fff;
    }
    /deep/ .el-breadcrumb__inner {
      color: rgba(255, 255, 255, 0.5);
    }
  }     
  .content-wrapper {
    background: #fff;
    border-radius: 4px;
    margin: 10px 20px 10px 20px;
    padding: 15px 20px 20px 20px;
    /* height: calc(100vh - 170px); */
    /* overflow: scroll; */
    /deep/ .el-tabs__item {
      height: 0;
      line-height: 0;
      padding-bottom: 20px;
    }
    /deep/.el-tabs__item:hover {
      color: #47A87D;
    }
    /deep/.el-tabs__item.is-active {
      color: #47A87D;
    }
    /deep/.el-tabs__item {
      /* color: #47A87D; */
      font-size: 14px;
      font-weight: 500;
    }
    /deep/.el-tabs__active-bar {
      background: #47A87D;
    }
  }
}
</style>