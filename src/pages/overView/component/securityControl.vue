<template>
  <div :class="isShow ? 'class-show' : 'class-hide'">
    <div class="box-card">
      <div class="title">
        安全管控<span class="security-warn margin-lr-20">一级或重大隐患</span>
      </div>
      <div class="block-group">
        <div class="block-group-img-wrapper">
          <img class="vertical-align margin-right" :src="require('@/assets/img/user.png')"/>
          <span>民用户</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="9" >
            <div class="block-109 flex">
              <el-image
                :src="require('@//assets/img/security-control.png')"
                :fit="'cover'"
              ></el-image>
              <div class="font-group margin-lr-10">
                <p>整改率</p>
                <span class="color-green"
                  >{{ securityControlData.customerRevisionRate }}%</span
                >
              </div>
            </div>
          </el-col>
          <el-col :span="9" >
            <div class="block-109 grey-bg text-right">
              <div class="margin-lr-10">
                <p>剩余整改数(个)</p>
                <span class="color-green">{{
                  securityControlData.customerRevisionResidue
                }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6" >
            <div class="block-73 grey-bg text-right">
              <div class=" margin-lr-10">
                <p>安检率</p>
                <span class="color-green"
                  >{{ securityControlData.customerScreeningRate }}%</span
                >
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="block-group">
        <div class="block-group-img-wrapper">
          <img class="vertical-align margin-right" :src="require('@/assets/img/industrial-commercial.png')"/>
          <span>工商户</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="9" >
            <div class="block-109 flex">
              <el-image
                :src="require('@//assets/img/security-control.png')"
                :fit="'cover'"
              ></el-image>
              <div class="font-group margin-lr-10">
                <p>整改率</p>
                <span class="color-green"
                  >{{ securityControlData.commercialRevisionRate }}%</span
                >
              </div>
            </div>
          </el-col>
          <el-col :span="9" >
            <div class="block-109 grey-bg text-right">
              <div class="margin-lr-10">
                <p>剩余整改数(个)</p>
                <span class="color-green">{{
                  securityControlData.commercialRevisionResidue
                }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6" >
            <div class="block-73 grey-bg text-right">
              <div class=" margin-lr-10">
                <p>安检率</p>
                <span class="color-green"
                  >{{ securityControlData.commercialScreeningRate }}%</span
                >
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="block-group">
        <div class="block-group-img-wrapper">
          <img class="vertical-align margin-right" :src="require('@/assets/img/pipe-network.png')"/>
          <span>管网</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="9" >
            <div class="block-109 flex">
              <el-image
                :src="require('@//assets/img/security-control.png')"
                :fit="'cover'"
              ></el-image>
              <div class="font-group margin-lr-10">
                <p>整改率</p>
                <span class="color-green"
                  >{{ securityControlData.pipeRevisionRate }}%</span
                >
              </div>
            </div>
          </el-col>
          <el-col :span="15" >
            <div class="block-207 grey-bg text-center">
              <div class=" margin-lr-10">
                <p>剩余整改数(个)</p>
                <span class="color-green">{{
                  securityControlData.pipeRevisionResidue
                }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="block-group">
        <div class="block-group-img-wrapper">
          <img class="vertical-align margin-right" :src="require('@/assets/img/air-station.png')"/>
          <span>场站</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="9" >
            <div class="block-109 flex">
              <el-image
                :src="require('@//assets/img/security-control.png')"
                :fit="'cover'"
              ></el-image>
              <div class="font-group margin-lr-10">
                <p>整改率</p>
                <span class="color-green"
                  >{{ securityControlData.stationRevisionRate }}%</span
                >
              </div>
            </div>
          </el-col>
          <el-col :span="15" >
            <div class="block-207 grey-bg text-center">
              <div class=" margin-lr-10">
                <p>剩余整改数(个)</p>
                <span class="color-green">{{
                  securityControlData.stationRevisionResidue
                }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SecurityControl",
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    securityControlData: {
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./common";
.block-group-img-wrapper {
  height: 18px;
  vertical-align: top;
}
.block-group-img-wrapper>span {
  vertical-align: top;
  display: inline-block;
  height: 18px;
  line-height: 16px;
}
.block-group>div>img {
  height: 18px;
}
.vertical-align {
  vertical-align: top;
}
.class-show {
  .grey-bg {
    background: $lineColor;
  }
  .margin-lr-10 {
    margin: 4px 3px;
  }
  .margin-right {
    margin-right: 10px;
  }
  @media screen and (min-width: 1580px) {
    .font-group {
      font-size: 14px;
    }
    .box-card {
      height: 389px;
      background: #ffffff;
      padding: 11px 30px;
      border-radius: 12px;
      margin-top: 20px;
    }
    .title {
      font-weight: 500;
      color: #3f5896;
      line-height: 28px;
      margin-bottom: 9px;
      font-size: 20px;
    }
    .security-warn {
      font-size: 14px;
      font-weight: 500;
      color: #ff7a20;
      background: #ff863636;
      border-radius: 13px;
      padding: 3px 10px;
      position: absolute;
      height: 19px;
      line-height: 19px;
    }
    p {
      margin-top: 0;
      margin-bottom: 3px;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
    }
    .block-109 {
      border: 1px solid $lineColor;
      border-radius: 4px;
      height: 56px;
      width: 100%;
    }
    .block-73 {
      border: 1px solid $lineColor;
      border-radius: 4px;
      height: 56px;
      width: 100%;
    }
    .block-207 {
      border: 1px solid $lineColor;
      border-radius: 4px;
      height: 56px;
      width: 100%;
    }
    .color-green {
      font-size: 20px;
      font-weight: bold;
    }
  }
  @media screen and (max-width: 1580px) {
    .font-group {
      font-size: 12px;
    }
    .box-card {
      height: 308px;
      background: #ffffff;
      padding: 8px 20px;
      border-radius: 9px;
      box-sizing: border-box;
      margin-top: 15px;
    }
    .title {
      font-weight: 500;
      color: #3f5896;
      line-height: 22px;
      margin-bottom: 5px;
      font-size: 16px;
    }
    .security-warn {
      font-size: 12px;
      font-weight: 500;
      color: #ff7a20;
      background: #ff863636;
      border-radius: 9px;
      padding: 1px 5px;
      position: absolute;
    }
    p {
      margin-top: 0;
      margin-bottom: 0;
      font-size: 12px;
      font-weight: 400;
      color: #000000;
    }
    .block-109 {
      border: 1px solid $lineColor;
      border-radius: 4px;
      height: 42px;
      width: 100%;
    }
    .block-73 {
      border: 1px solid $lineColor;
      border-radius: 4px;
      height: 42px;
      width: 100%;
    }
    .block-207 {
      border: 1px solid $lineColor;
      border-radius: 4px;
      height: 42px;
      width: 100%;
    }
    .color-green {
      font-size: 15px;
      font-weight: bold;
    }
  }
}

.class-hide {
  //隐藏客户投诉时
  .grey-bg {
    background: $lineColor;
  }
  .margin-lr-10 {
    margin: 4px 3px;
  }
  .margin-right {
    margin-right: 10px;
  }
  @media screen and (min-width: 1580px) {
    .font-group {
      font-size: 14px;
    }
    .box-card {
      height: 429px;
      background: #ffffff;
      padding: 11px 30px;
      border-radius: 12px;
      margin-top: 20px;
    }
    .title {
      font-weight: 500;
      color: #3f5896;
      line-height: 28px;
      margin-bottom: 13px;
      font-size: 20px;
    }
    .security-warn {
      font-size: 14px;
      font-weight: 500;
      color: #ff7a20;
      background: #ff863636;
      border-radius: 13px;
      padding: 3px 10px;
      position: absolute;
      height: 19px;
      line-height: 19px;
    }
    p {
      margin-top: 0;
      margin-bottom: 3px;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
    }
    .block-109 {
      border: 1px solid $lineColor;
      border-radius: 4px;
      height: 56px;
      width: 100%;
      margin: 5px 0;
    }
    .block-73 {
      border: 1px solid $lineColor;
      border-radius: 4px;
      height: 56px;
      width: 100%;
      margin: 5px 0;
    }
    .block-207 {
      border: 1px solid $lineColor;
      border-radius: 4px;
      height: 56px;
      width: 100%;
      margin: 5px 0;
    }
    .color-green {
      font-size: 20px;
      font-weight: bold;
    }
  }
  @media screen and (max-width: 1580px) {
    .font-group {
      font-size: 12px;
    }
    .box-card {
      height: 340px;
      background: #ffffff;
      padding: 9px 22px 6px 23px;
      border-radius: 9px;
      box-sizing: border-box;
      margin-top: 15px;
    }
    .title {
      font-weight: 500;
      color: #3f5896;
      line-height: 22px;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .security-warn {
      font-size: 12px;
      font-weight: 500;
      color: #ff7a20;
      background: #ff863636;
      border-radius: 9px;
      padding: 1px 5px;
      position: absolute;
    }
    p {
      margin-top: 0;
      margin-bottom: 0;
      font-size: 12px;
      font-weight: 400;
      color: #000000;
    }
    .block-109 {
      border: 1px solid $lineColor;
      border-radius: 4px;
      height: 42px;
      width: 100%;
      margin: 5px 0;
    }
    .block-73 {
      border: 1px solid $lineColor;
      border-radius: 4px;
      height: 42px;
      width: 100%;
      margin: 5px 0;
    }
    .block-207 {
      border: 1px solid $lineColor;
      border-radius: 4px;
      height: 42px;
      width: 100%;
      margin: 5px 0;
    }
    .color-green {
      font-size: 15px;
      font-weight: bold;
    }
  }
}
</style>
