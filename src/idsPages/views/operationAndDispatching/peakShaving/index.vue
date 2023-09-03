<template>
  <div class="delivery-wrapper gas-page-bg-diaodu">
    <top-menu title="天然气输配（调度）智慧管理平台"></top-menu>
    <!-- 面包屑 -->
    <div class="crumb-diaodu">
      <span class="crumb-title1">运营调度 / </span>
      <span class="crumb-title2">库存及调峰</span>
    </div>
    <div class="content-wrapper content-wrapper-diaodu">
      <!-- 标题 -->
      <div class="title">
        <div>
          <span class="t1" v-if="isShowStock">库存及调峰</span>
          <span class="t1" v-if="!isShowStock">管存及调峰</span>
        </div>
        <div class="tab-box">
          <span
            :class="{ 'stock-btn': true, 'choose-btn': isShowStock }"
            @click="tabClick"
            >库存</span
          >
          <span
            :class="{ 'pipe-btn': true, 'choose-btn': !isShowStock }"
            @click="tabClick"
            >管存</span
          >
        </div>
      </div>

      <!-- 内容部分 -->
      <div class="content-box">
        <Stock v-if="isShowStock" />
        <PipeSave v-if="!isShowStock" />
      </div>
    </div>
  </div>
</template>

<script>
import TopMenu from "@/components/topMenu/topMenu2";
import Stock from "../peakShaving/component/Stock";
import PipeSave from "../peakShaving/component/pipe-save";

export default {
  name: "peakShaving",
  components: {
    TopMenu,
    Stock,
    PipeSave,
  },
  data() {
    return {
      isShowStock: true,
    };
  },
  created() {
    let status = this.$route.query.status;
    this.isShowStock = status == 2 ? false : true;
  },
  mounted() {},
  methods: {
    tabClick() {
      this.isShowStock = !this.isShowStock;
    },
  },
};
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.delivery-wrapper {
  width: 100%;
  position: relative;
  .content-wrapper {
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      margin-bottom: 12px;
      .t1 {
        height: 25px;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 25px;
        display: inline-block;
        margin-right: 10px;
      }
      .t2 {
        width: 184px;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
        line-height: 20px;
      }

      .tab-box {
        width: 180px;
        span {
          display: inline-block;
          width: 86px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          color: #303133;
          font-size: 14px;
          background: #ebeef5;
          cursor: pointer;
        }
        .stock-btn {
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
        }
        .pipe-btn {
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
        }
        .choose-btn {
          background: #47a87d;
          color: #fff;
        }
      }
      .handle-box {
        display: inline-block;
        height: 32px;
        margin-right: 15px;
        .sort-btn-box {
          border: solid 1px #dcdfe6;
          display: flex;
          border-radius: 20px;
          float: left;
          margin: 0 15px;
          li {
            display: flex;
            padding: 0 13px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: 14px;
            color: #c0c4cc;
            border-left: solid 1px #cccccc;
            cursor: pointer;
            .text {
              display: flex;
              margin-right: 3px;
            }
            .icon {
              display: flex;
              width: 12px;
              flex-direction: column;
              justify-content: center;
              position: relative;
              i {
                font-size: 12px;
                position: absolute;
              }
              i.el-icon-arrow-up {
                top: 6px;
              }
              i.el-icon-arrow-down {
                top: 14px;
              }
              .ascend {
                color: #47a87d;
              }
              .descend {
                color: #47a87d;
              }
            }
          }
          .left-btn {
            border-left: none;
          }
          .sort-choose-btn {
            .text {
              color: #47a87d;
            }
          }
        }
        .search-box {
          display: flex;
          float: right;
          justify-content: space-between;
          align-items: center;
          width: 260px;
          height: 30px;
          border-radius: 100px;
          border: solid 1px #dcdfe6;
          border-right: none;
          padding-left: 15px;
          input {
            border: none;
            background: none;
            height: 30px;
            width: 100%;
            margin-right: 3px;
            outline: none;
          }
          input::placeholder {
            color: #c0c4cc;
          }
          .search-btn {
            width: 40px;
            height: 30px;
            background: #47a87d;
            border-radius: 0px 100px 100px 0px;
            border: solid 1px #47a87d;
            text-align: center;
            line-height: 30px;
            cursor: pointer;
            img {
              display: inline-block;
              width: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang='scss'>
.delivery-wrapper {
  .title {
    .handle-box {
      .screen-list {
        min-width: 182px;
        height: 32px;
        margin-right: 15px;
      }
      .el-select .el-input__inner {
        background: none;
        height: 32px;
        border: 1px solid #dcdfe6;
        border-radius: 20px;
      }
      .el-select .el-input__suffix {
        border: none;
        color: #fff;
      }
      .el-input__icon {
        line-height: 32px;
      }
      .el-select .el-tag {
        border-radius: 20px;
      }
    }
  }
}
</style>