<template>
  <div class="over-view">
    <div class="header color-white">
      <top-menu :date-picker-show="false"></top-menu>
      <div class="title">{{ place }}-智慧燃气运营总览</div>
      <div class="time-width">
        <span class="padding-20" @click="goToMenu()" v-trace="{title:'总览-进入分销中心'}">进入分销中心></span>
      </div>
    </div>
    <div class="card-content">
      <div class="area" style="width: 30%;padding-left: 22px;" v-trace="{title:'总览-城燃企业累计销售完成比'}">
        <screen-card
            ref="screenCard1"
            :curCompany="curCompany"
            :data="saleAirData"
            :showCollapse="showCollapse"
            :pieChartData="pieChartData"
        ></screen-card>
      </div>

      <div class="area" style="width: 31%;padding-left: 22px;" v-trace="{title:'总览-城燃企业累计收入完成比'}">
        <screen-card
            ref="screenCard2"
            :curCompany="curCompany"
            :data="profitData"
            :showCollapse="showCollapse"
        ></screen-card>
      </div>

      <div class="area" style="width: 39%;padding-left: 22px;" v-trace="{title:'总览-城燃企业累计发展/安装完成比'}">
        <lst-card
            ref="listCard"
            :data="datas"
            :showCollapse="showCollapse"
            :curCompany="curCompany"
        ></lst-card>
      </div>
    </div>
    <div class="screen-content over-content">
      <div class="left-area area">
        <gas-trail-card :curCompany="curCompany"></gas-trail-card>
        <gas-source-buy :curCompany="curCompany"></gas-source-buy>
      </div>
      <div class="center-area area">
        <iframe
            class="iframe"
            src="https://mapsg.enn.cn/"
            height="100%"
            width="100%"
        ></iframe>
      </div>
      <div class="right-area area">
        <custom-warn
            ref="customWarnRef"
            :curCompany="curCompany"
            :opportunityAndWarningData="opportunityAndWarningData"
            :isShow="isFarengongsi"
        ></custom-warn>
        <customer-complaint
            ref="customerComplaintRef"
            :customerComlainData="customerComlainData"
            v-if="isFarengongsi"
        ></customer-complaint>
        <security-control
            ref="securityControlRef"
            :securityControlData="securityControlData"
            :isShow="isFarengongsi"
        ></security-control>
      </div>
    </div>
  </div>
</template>
<script>
import { getCurrentTime, formatCurrentTime } from "@/utils/dateTime";
import ScreenCard from "./component/card";
import LstCard from "./component/lstCard";
import GasTrailCard from "./component/gasTrailCard";
import GasSourceBuy from "./component/gasSourceBuy";
import CustomWarn from "./component/customWarn";
import CustomerComplaint from "./component/customerComplaint";
import SecurityControl from "./component/securityControl";
import { companyMixin } from '/src/utils/mixin'
import menuAndOrg from "../../components/auth/menuAndOrg";
import topMenu from "../../components/topMenu/topMenu";

export default {
  name: "OverView",
  mixins:[companyMixin, menuAndOrg],
  components: {
    ScreenCard,
    LstCard,
    GasTrailCard,
    CustomWarn,
    CustomerComplaint,
    SecurityControl,
    GasSourceBuy,
    topMenu
  },
  data() {
    return {
      browerTime:0,   // 页面停留时长
      timer:null,     // 计时器
      isShow: false, //判断客户投诉处理显隐
      mapHeight: window.screen.width >= 1920 ? "703px" : "582px",
      mapWidth: 12,
      rightWidth: 5,
      currentTime: "",
      pieChartData: [], //汽源类型饼图数据
      showCollapse: {
        curShow: ""
      },
      saleAirData: {
        data: {}, //销售/利润饼状图数据
        chartName: "chart1",
        title: "年累计销售气量(万方）",
        collapseName: "城燃企业累计销售完成比",
        collapseData: [] //销售/利润完成比条形图数据
      },
      profitData: {
        data: {},
        chartName: "chart2",
        title: "年累计销售收入(万元）",
        collapseName: "城燃企业累计收入完成比",
        collapseData: []
      },
      devData: {
        chartName: "chart3"
      },
      datas: {
        title: ""
      },
      customerComlainData: {},
      securityControlData: {},
      opportunityAndWarningData: {}
    };
  },
  beforeRouteEnter(to,from,next) {
    next((vm) => {
      vm.fromPath = from.path
    })
  },
  created() {
    //下拉列表
    if (this.$store.getters.curComInfo.orgLevel === 2) {
      this.isShow = false;
    } else {
      this.isShow = true;
    }

    this.initData();
    //下拉条形图 1 累计销售 2 累计利润
    this.initPercentComplete(1);
    this.initPercentComplete(2);
  },
  computed: {
    curCompany: {
      get() {
        return this.$store.getters.curCom
      },
      set(val) {
        this.$store.commit('SET_CUR_COM', val)
      }
    },
    place: function () {
      return this.$store.getters.curComName
    },
    isFarengongsi: function () {
      let level = this.$store.getters.curComInfo
      return level.orgLevel === 4
    }
  },
  mounted() {
    // 登录进入总览页面、从分销中心进入总览页面
    if(this.fromPath === '/login') {
      window.zhuge.track('登陆进入总览页面',{'页面名称':'登陆打开总览页面'})
    } else {
      window.zhuge.track('分销中心-点击进入总览页面')
    }
    this.statBrowerTime()       // 页面加载后开始计时（页面停留时工）
    this.mapWidth = window.screen.width >= 1920 ? 12 : 11;
    this.rightWidth = window.screen.width >= 1920 ? 5 : 6;
  },
  beforeDestroy() {
    // 离开页面后清除计时器，上报诸葛接口
    clearInterval(this.timer)
    if(this.fromPath === '/login') {
      window.zhuge.track('登陆总览页停留时长',{'登陆总览页停留时长':this.browerTime})
    } else {
      window.zhuge.track('总览页停留时长',{'总览页停留时长':this.browerTime})
    }
  },
  watch: {
    mapWidth: {
      immediate: true,
      handler(val) {
        this.mapWidth = val;
      }
    },
    curCompany: {
      immediate: true,
      handler: function (n, o) {
        if(n && o) {
          this.initData();
          let level = this.$store.getters.curComInfo.orgLevel
          if(level === 2 || level === 3) {     // 省公司
            this.isShow = false;
            this.initPercentComplete(1);
            this.initPercentComplete(2);
          }else {            // 非省公司
            this.isShow = true;
            this.getComplainData(); //客户投诉处理完成率
          }
        }
      }
    }
  },
  methods: {
    statBrowerTime() {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        this.$router.push("/login");
      });
    },
    // selectCompany(data) {
    //   this.$store.commit('SET_CUR_COM', data)
    //   //下拉框事件
    //   this.initData(); //销售气量/利润
    //   //判断当前公司id,客户投诉率模块显隐
    //   let curCompany = this.$store.getters["companyList"].find(item => {
    //     return item.cpmo_cop;
    //   }).code;
    //   // if (curCompany === data) {
    //   // if ( 50311934 == data || 50311932 == data) {
    //   //   this.isShow = false;
    //   //   this.initPercentComplete(1);
    //   //   this.initPercentComplete(2);
    //   // } else {
    //   //   this.isShow = true;
    //   //   this.getComplainData(); //客户投诉处理完成率
    //   // }
    //   // 判断当前公司是否是省公司（替换上面if...else语句）
    //   if(this.isProvinceCompany(data)) {     // 省公司
    //     this.isShow = false;
    //     this.initPercentComplete(1);
    //     this.initPercentComplete(2);
    //   }else {            // 非省公司
    //     this.isShow = true;
    //     this.getComplainData(); //客户投诉处理完成率
    //   }
    // },

    getCurrentTime, //时间格式YYYY/M/D
    formatCurrentTime, //时间格式YYYY/MM/DD
    initData() {
      //饼图  1 销售气量， 2 经营利润
      this.initCard(1);
      this.initCard(2);
      //气源类型查看
      this.getPieChartData(this.curCompany);
      //安全管控
      this.getSecurityControlData();
      //大客户预警
      this.getBigBusinessData();
      //客户投诉处理完成率
      this.getComplainData();
    },
    initCard(type) {
      //年累计销售气量/年累计经营利润
      this.$api
        .getSalesVolumeProfitList({
          companyCode: this.curCompany,
          distinction: type,
          time: this.formatCurrentTime()
        })
        .then(res => {
          if (res.resultCode === 0) {
            type === 1
              ? (this.saleAirData.data = res.data)
              : (this.profitData.data = res.data);
          }
          this.$refs.screenCard1.initCart();
          this.$refs.screenCard2.initCart();
        });
    },
    initPercentComplete(type) {
      //城燃企业年累计销售完成比/城燃企业年累计利润完成比
      this.$api
        .getPercentCompleteRank({
          companyCode: this.curCompany,
          distinction: type,
          time: this.formatCurrentTime()
        })
        .then(res => {
          if (res.resultCode === 0) {
            type === 1
              ? (this.saleAirData.collapseData = res.data)
              : (this.profitData.collapseData = res.data);
          }
        });
    },
    getComplainData() {
      //客户投诉处理率接口
      this.$api.getCustomerComplaint(this.curCompany).then(res => {
        if (res.resultCode === 0) {
          this.customerComlainData = res.data;
        }
      });
    },
    getSecurityControlData() {
      //获取安全管控数据
      this.$api
        .getSecurityControls(this.curCompany, this.formatCurrentTime())
        .then(res => {
          if (res.resultCode === 0) {
            this.securityControlData = res.data;
          }
        });
    },
    getBigBusinessData() {
      //获取大客户商机/预警数据
      this.$api.getBigBusiness(this.curCompany).then(res => {
        // if (res.resultCode === 0) {
        //   this.opportunityAndWarningData = res.data;
        // }
        if (res.data.code === "00") {
          this.opportunityAndWarningData = { "risk" : res.data.result };
        }        
      });
    },
    getPieChartData(type) {
      //获取气源类型查看数据
      this.$api.getPercentDetail(type).then(res => {
        if (res.resultCode === 0) {
          this.pieChartData = res.data.map(item => {
            return {
              value: item.percent,
              name: item.type
            };
          });
        }
      });
    },
    goToMenu: function () {
      let menu = this.$store.getters.menu
      this.$router.push({
        path: this.findXMenu(menu, 2).resourceUrl
      })
    }
  }
};
</script>
<style lang="scss" scoped>
// 1580以下尺寸
$overTitle: 22px;
$space20: 20px;
$selectFontSize: 14px;
$fontSize14: 14px;

// 1580以上尺寸
$overTitle-1920: 28px;
$space20-1920: 20px;
$selectFontSize-1920: 18px;
.over-view {
  min-width: 1280px;
}
.over-content {
  width: 100%;
  white-space: nowrap;
  margin-bottom: 30px;
}
.card-content {
  white-space: nowrap;
}
.area {
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
}
.left-area {
  width: 28.4%;
  margin-left: 1%;
}
.center-area {
  width: 45%;
  height: 100%;
  margin-left: 1%;
}
.right-area {
  width: 21.4%;
  margin-left: 1%;
  font-family: DI;
}
iframe {
  border: none;
}

// common
.padding-20 {
  padding: 0 $space20;
}

h1, h2, h3 {
  margin: 0;
}

.time-width {
  background: #0FB2AB;
  cursor: pointer;
  border-radius: 18px;
}
@media screen and (min-width: 1580px) {
  .over-view {
    background-size: 100% 540px;
    background-repeat: no-repeat;
    background-image: url('../../assets/img/over-bg.png');
    .left-area{
      margin-left: 30px;
      padding-left: 0 !important;
    }
    .right-area{

    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .header {
      position: relative;
      height: 57px;
      /deep/ .gas-page-header-container {
        margin-top: 0;
        position: absolute;
        top: 20px;
      }
      .title{
        font-size: $overTitle-1920;
        line-height: 60px;
        text-align: center;
        z-index: 999;
        background: url('../../assets/img/transport-bg.png') no-repeat;
        background-size: 100% 100%;
        font-weight: bold;
      }
      .time-width {
        font-size: $selectFontSize-1920;
        z-index: 999;
        position: absolute;
        top: 20px;
        left: 50px;
        height: 32px;
        line-height: 32px;
      }
      .select-width{
        position: absolute;
        top: 20px;
        right: 50px;
        .iconfont{
          font-size: 22px;
          background-color: rgba(255,255,255,0.15);
          padding: 6px;
          border-radius: 50%;
          position: relative;
          top: 2px;
        }
      }
      /deep/ .el-input {
        font-size: $selectFontSize-1920;
      }
    }
    .card-content{
      height: 260px;
      padding: 10px 30px;
    }
    .card-title {
      font-size: $fontSize14;
    }
    .over-content{
      height: 704px;
    }
    /deep/ .el-input__inner {
      line-height: 32px;
      height: 32px;
      background: rgba(255,255,255,0.15);
      border-radius: 25px;
      border: 0;
      z-index: 999;
      color: #fff;
    }
    /deep/.el-input__icon{
      line-height: 39px;
      height: 32px;
    }
    .screen-content {
      .el-row {
        margin: 0!important;
      }
      .iframe {
        border-radius: 9px;
        border: none;
      }
    }
    /deep/ .el-select-dropdown {
      background: rgba(255, 255, 255, 0.15);
    }
    /deep/ .el-select .el-input .el-input__inner{
      height: 32px;
      width: 169px;
      margin-right: 20px;
      padding: 0 15px;
    }
    /deep/ .el-input__suffix {
      display: inline-flex;
      align-items: center;
      right: 27px;
      padding-left: 6px;
      border-left: 1px solid #C0C4CC;
    }
    /deep/ .el-select .el-input .el-input__suffix ::before{
      top:-4px;
      position: relative;
    }
  }
  .h1-size{
    position: relative;
    left:45px
  }
  .top-right-area{
    display: flex;
    justify-content: space-between;
  }
  .loginout-btn{
    width: 31px;
    height: 31px;
    font-size: 18px;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.15);
    .iconxingzhuang2222{
      position: relative;
      top: 5px;
      left: 7px;
    }
  }

}
@media screen and (max-width: 1580px) {
  .over-view {
    background-image: url('../../assets/img/over-bg.png');
    background-size: 100% 405px;
    background-repeat: no-repeat;

    .left-area {
      margin-left: 22.5px;
      padding-left: 0 !important;
    }

    .right-area {

    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    .header {
      position: relative;
      height: 42.5px;
      /deep/ .gas-page-header-container {
        margin-top: 0;
        position: absolute;
        top: 15px;
        transform: scale(0.7);
        transform-origin: top right;
      }
      .title {
        font-size: 22px;
        line-height: 42.5px;
        text-align: center;
        z-index: 999;
        background: url('../../assets/img/transport-bg.png') no-repeat;
        background-size: 100% 100%;
        font-weight: bold;
      }

      .time-width {
        font-size: $selectFontSize;
        z-index: 999;
        position: absolute;
        top: 15px;
        left: 37.5px;
        height: 24px;
        line-height: 24px;
      }

      .select-width {
        position: absolute;
        top: 15px;
        right: 22.5px;

        .iconfont {
          font-size: 16px;
          background-color: rgba(255, 255, 255, 0.15);
          padding: 4px;
          border-radius: 50%;
          position: relative;
          top: 2px;
        }
        /deep/ .el-input__suffix {
          right: 0;
          display: inline-flex;
          align-items: center;
          padding-left: 0px;
          border-left: 1px solid #DEE2EB;
        }
        /deep/ .el-select {
          margin-right:12px;
          height: 24px;
          width: 126px;
        }
      }

      .screen-content {
        .el-row {
          margin: 0 !important;
        }

        .iframe {
          border-radius: 9px;
          border: none;
          width: 640px;
          height: 528px;
        }
      }
      /deep/ .el-input__inner {
        width: 100%;
        line-height: 24px;
        height: 24px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 18px;
        border: 0;
        color: #fff;
        z-index: 999;
        padding-left: 10px;
      }
    }

    .card-content {
      height: 216px;
      padding: 16px 22.5px;
    }

    .over-content {
      margin-top: 15px;
      height: 528px;
    }

    /deep/ .el-input__icon {
      line-height: 22px;
      height: 22px;
    }

    .screen-content {
      .el-row {
        margin: 0 !important;
      }

      /deep/ .el-select .el-input .el-input__inner {
        height: 25px;
        width: 156px;
        padding: 4px 8px 4px 14px;
      }

      /deep/ .el-select .el-input .el-input__suffix ::before {
        top: -8px;
        position: relative;
      }
    }

    .h1-size {
      position: relative;
      left: 45px
    }

    .top-right-area {
      display: flex;
      justify-content: space-between;
    }

    .loginout-btn {
      width: 24px;
      height: 24px;
      font-size: 12px;
      border-radius: 30px;
      background: rgba(255, 255, 255, 0.15);

      .iconxingzhuang2222 {
        position: relative;
        top: 3px;
        left: 18%;
      }
    }

  }

}
</style>
