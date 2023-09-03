<template>
  <div class="client-analyse">
    <div class="top-analyse">
      <div class="frist-row">
        <img :src="diamond" alt="" v-if="customerSurvey.userLevel === '钻石'" />
        <img :src="gold" alt="" v-if="customerSurvey.userLevel === '黄金'" />
        <img
          :src="platinum"
          alt=""
          v-if="customerSurvey.userLevel === '铂金'"
        />
        <img :src="normal" alt="" v-if="customerSurvey.userLevel === '普通'" />
        <span class="top-title">{{ customerSurvey.mcName1 }}</span>
        <span class="client-detail" @click="showClientDetail">客户详情</span>
      </div>
      <div class="second-row">
        <span
          >客户行业：
          {{
            customerSurvey.customerIndustry
              ? customerSurvey.customerIndustry
              : "-"
          }}</span
        >
        <span
          >年日均用气量：
          {{
            customerSurvey.avgAbumenger ? customerSurvey.avgAbumenger : "-"
          }}万方/日</span
        >
        <!-- <span
          >平均气价：
          {{
            customerSurvey.averagePrice ? customerSurvey.averagePrice : "-"
          }}元/方</span
        > -->
        <span
          >平均气价：
          ***元/方</span
        >
        <span
          v-if="Number(this.$route.query.distinct)==2"
          >当地供气城燃企业：
          {{
            customerSurvey.supplyGasEnterprise ? customerSurvey.supplyGasEnterprise : "-"
          }}</span
        >
      </div>
      <div class="third-row">
        <img :src="lowrisk" alt="" v-if="customerSurvey.grade === '低' &&Number(this.$route.query.distinct)==1" />
        <img :src="midrisk" alt="" v-if="customerSurvey.grade === '中'&&Number(this.$route.query.distinct)==1" />
        <img :src="highrisk" alt="" v-if="customerSurvey.grade === '高'&&Number(this.$route.query.distinct)==1" />
        <img :src="lowopp" alt="" v-if="(customerSurvey.grade === '小') &&Number(this.$route.query.distinct)==2" />
        <img :src="midopp" alt="" v-if="customerSurvey.grade === '中'&&Number(this.$route.query.distinct)==2" />
        <img :src="highopp" alt="" v-if="(customerSurvey.grade === '大')&&Number(this.$route.query.distinct)==2" />
        <span v-for="item in customerSurvey.mark" :key="item">{{ item }}</span>
      </div>
    </div>
    <div
      :class="{
        'body-analyse': true,
        'is-project-map': activeTitleforCost === '4' && activeHead === '1',
      }"
    >
      <div class="top-btn">
        <span class="btn-groups">
          <span
            v-for="(item, index) in headBtns"
            :key="item.id"
            :class="{ 'is-active': item.active }"
            @click="headBtnsChange(index)"
            >{{ item.label }}</span
          >
        </span>
      </div>
      <div class="analyse-content" v-if="activeHead === '1'">
        <div class="content-head">
          <li
            v-for="(item, index) in titleListforCost"
            :key="item.id"
            :class="{ 'is-active': activeTitleforCost === item.id }"
            @click="titleListforCostChange(index)"
          >
            {{ item.label }}
          </li>
        </div>
        <div class="content-body">
          <potentialAnalyse
            v-if="activeTitleforCost === '1'"
            :propData="$route.query"
          />
          <businessOptimize v-if="activeTitleforCost === '2'" />
          <productAnalyse v-if="activeTitleforCost === '3'" />
          <projectMap v-if="activeTitleforCost === '4'" />
        </div>
      </div>
      <div class="analyse-content" v-else-if="activeHead === '2'">
        <div class="content-head">
          <li
            v-for="(item, index) in titleListforRisk"
            :key="item.id"
            :class="{ 'is-active': activeTitleforRisk === item.id }"
            @click="titleListforRiskChange(index)"
          >
            {{ item.label }}
          </li>
        </div>
        <div class="content-body">
          <directRisk v-if="activeTitleforRisk === '1'" />
          <businessRisk
            v-if="activeTitleforRisk === '2'"
            :activeHead="activeHead"
          />
        </div>
      </div>
      <div class="analyse-content" v-else>
        <div class="content-head">
          <li
            v-for="(item, index) in titleListforChance"
            :key="item.id"
            :class="{ 'is-active': activeTitleforChance === item.id }"
            @click="titleListforChanceChange(index)"
          >
            {{ item.label }}
          </li>
        </div>
        <div class="content-body">
          <businessDevelopment v-if="activeTitleforChance === '1'" />
          <businessRisk
            v-if="activeTitleforChance === '2'"
            :activeHead="activeHead"
          />
          <!-- <businessChance v-if="activeTitleforChance === '2'" />  -->
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="showdetailDialog" title="客户详情" width="42%">
      <div class="client-detail-dialog">
        <span
          v-for="(item, index) in detailList"
          :key="item.label"
          :class="{
            'detail-span': true,
            'is-even': Math.floor(index / 2) % 2 === 0,
          }"
        >
          <el-col :span="9">{{ item.label }}</el-col>
          <el-col :span="15">{{ item.desc }}</el-col>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 客户分析
import diamond from "@/assets/img/diamond.png";
import gold from "@/assets/img/gold.png";
import normal from "@/assets/img/normal.png";
import platinum from "@/assets/img/platinum.png";
import lowrisk from "@/assets/img/lowrisk.png";
import highrisk from "@/assets/img/highrisk.png";
import midrisk from "@/assets/img/midrisk.png";
import lowopp from "@/assets/img/lowopp.png";
import highopp from "@/assets/img/highopp.png";
import midopp from "@/assets/img/midopp.png";
import potentialAnalyse from "./potentialAnalyse";
import businessOptimize from "./businessOptimize";
import productAnalyse from "./productAnalyse";
import projectMap from "./projectMap";
import directRisk from "./directRisk";
import businessRisk from "./businessRisk";
import businessDevelopment from "./businessDevelopment";

export default {
  name: "clientAnalyse",
  components: {
    businessDevelopment,
    potentialAnalyse,
    businessOptimize,
    productAnalyse,
    projectMap,
    directRisk,
    businessRisk,
  },
  props: {},
  data() {
    return {
      activeTitleforChance: "1",
      diamond,
      gold,
      midopp,
      highopp,
      lowopp,
      platinum,
      normal,
      midrisk,
      lowrisk,
      highrisk,
      activeHead: "1",
      activeTitleforCost: "1",
      activeTitleforRisk: "1",
      showdetailDialog: false,
      customerSurvey: {}, //客户概况
      headBtns: [],
      titleListforCost: [
        {
          id: "1",
          label: "潜力分析",
          active: true,
        },
        {
          id: "2",
          label: "商务条件优化",
          active: false,
        },
        {
          id: "3",
          label: "生产规律识别",
          active: false,
        },
        {
          id: "4",
          label: "计划准确率",
          active: false,
        },
      ],
      titleListforRisk: [
        {
          id: "1",
          label: "客户直供风险识别与应付",
          active: true,
        },
        {
          id: "2",
          label: "客户经营风险识别与应对",
          active: false,
        },
      ],
      titleListforChance: [
        {
          id: "1",
          label: "客户开发机会与策略",
          active: true,
        },
        {
          id: "2",
          label: "客户经营状况识别与策略",
          active: false,
        },
      ],
      detailList: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    if (Number(this.$route.query.distinct) === 1) {
      this.headBtns = [
        {
          id: "1",
          label: "价值",
          active: true,
        },
        {
          id: "2",
          label: "风险",
          active: false,
        },
      ];
    } else { //域外
      this.headBtns = [
        {
          id: "1",
          label: "价值",
          active: true,
        },
        {
          id: "3",
          label: "机会",
          active: false,
        },
      ];
      this.titleListforCost=[
        {
          id: "1",
          label: "潜力分析",
          active: true,
        },
        {
          id: "2",
          label: "商务条件优化",
          active: false,
        },
        {
          id: "3",
          label: "生产规律识别",
          active: false,
        },
      ];
    }
    this.getCustomerSurvey();
    this.getCustomerDetail();
  },
  methods: {
    async getCustomerSurvey() {
      const params = {
        compCode: this.$route.query.compCode,
        distinct: Number(this.$route.query.distinct),
        partner: this.$route.query.partner,
      };
      const res = await this.$api.getCustomerSurvey(params);
      if (res.resultCode === 0) {
        this.customerSurvey = res.data;
      } else {
        this.$message.error(res.resultMessage);
      }
    },
    async getCustomerDetail() {
      const params = {
        compCode: this.$route.query.compCode,
        distinct: Number(this.$route.query.distinct),
        partner: this.$route.query.partner,
      };
      const res = await this.$api.getCustomerDetail(params);
      if (res.resultCode === 0) {
        let obj = {
          groupVisitor: "是否集团客户",
          listedCompany: "是否上市公司",
          annualRevenue: "年营业收入",
          employees: "企业人数",
          customerIndustry: "客户行业",
          majorProduct: "主要产品",
          canUseProcess: "用能工艺",
          equipment: "用能设备",
          canUseType: "用能类型",
          gasSupplyWay: "供气方式",
          durationOfVentilation: "通气时间",
          customerContact: "客户联系人",
          duty: "职务",
          phone: "电话",
        };
        this.detailList = Object.keys(obj).map((key) => ({
          label: obj[key],
          desc: res.data[key],
        }));
      } else {
        this.$message.error(res.resultMessage);
      }
    },
    headBtnsChange(index) {
      this.activeHead = this.headBtns[index].id;
      this.headBtns = this.headBtns.map((one, indexi) => {
        one.active = indexi === index;
        return one;
      });
      this.activeTitleforCost = "1";
      this.activeTitleforChance = "1";
      this.activeTitleforRisk = "1";
    },
    titleListforCostChange(index) {
      this.activeTitleforCost = this.titleListforCost[index].id;
    },
    titleListforRiskChange(index) {
      this.activeTitleforRisk = this.titleListforRisk[index].id;
    },
    titleListforChanceChange(index) {
      this.activeTitleforChance = this.titleListforChance[index].id;
    },

    showClientDetail() {
      this.showdetailDialog = true;
    },
  },
};
</script>

<style lang='scss' scoped>
@import "./../style/clientAnalyse1440.scss";
@import "./../style/clientAnalyse1920.scss";
</style>
