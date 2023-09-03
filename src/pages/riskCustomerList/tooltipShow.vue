<template>
  <div class="text-tooltip">
    <el-tooltip class="item" effect="dark" :disabled="isShowTooltip"  placement="top">
      <div class="tooltip-item" v-html="content" slot="content"></div>
      <p class="over-flow" :class="className" @mouseover="onMouseOver(refName)">
        <span :ref="refName">{{content||'-'}}</span>
      </p>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'textTooltip',
    props: {
      // 显示的文字内容
      content: {
        type: String,
        default: () => {
          return ''
        }
      },
      // 外层框的样式，在传入的这个类名中设置文字显示的宽度
      className: {
        type: String,
        default: () => {
          return ''
        }
      },
      // 为页面文字标识（如在同一页面中调用多次组件，此参数不可重复）
      refName: {
        type: String,
        default: () => {
          return ''
        }
      }
    },
    data() {
      return {
        isShowTooltip: true
      }
    },
    methods: {
      onMouseOver(str) {
        let parentHeight = this.$refs[str].parentNode.offsetHeight;
        let contentHeight = this.$refs[str].offsetHeight;
        // 判断是否开启tooltip功能
        if (contentHeight < parentHeight) {
          this.isShowTooltip = true;
        } else {
          this.isShowTooltip = false;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.over-flow {
//   overflow: hidden;
//   white-space: nowrap;
//   text-overflow: ellipsis;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all; //字符默认不自动换行，强制换行。汉字可以自动换行

}
.wid190 {
    width: 100%;
}
p{
    margin: 0;
}
.tooltip-item{
  width: 220px;
  // text-align: center;
  white-space: pre-line;
}
</style>