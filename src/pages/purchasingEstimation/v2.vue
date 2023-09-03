<template>
  <div class="gas-page-bg" style="margin-bottom: 231px;">
    <top-menu :date-picker-show="false"
              title="气源采购方案"></top-menu>
    <div class="gas-pu-container" v-show="!comparePop">
      <div class="gas-tab-card-header">
        <div :class="{'tab-card-header': true, 'tab-card-header-active': toggleTabIndex === 0}"
             @click="toggleTabHandler(0)" >自定义采购方案
        </div>
        <div :class="{'tab-card-header': true, 'tab-card-header-active': toggleTabIndex === 1}"
             @click="toggleTabHandler(1)" v-trace="{title:'气源采购-采购测算-点击方案列表'}">方案列表
        </div>
      </div>
      <div class="gas-tab-card-wrapper" v-show="(toggleTabIndex === 0) || (toggleTabIndex === 1 && isHiddenOfCesuan === false)">
        <div class="gas-tab-card">
          <div class="gas-tab-title" style="height: auto;margin-top: 7px;">
            <div v-if="toggleTabIndex === 1" style="font-size: 24px;margin-bottom: 10px;">
              {{ editPlanItem.name + ' - ' + getFormatDate(editPlanItem.createTime, '/') }}
              <span class="back-btn-wrapper" @click="backPlanList()" v-show="toggleTabIndex === 1">
                <span class="back-btn">返回</span>
                <i class="el-icon-arrow-right"></i>
              </span>
              <el-button round plain type="success" @click="createPlan(true)" class="custom-button" v-show="toggleTabIndex === 1 && isHiddenOfModifyBtn === false" >生成新方案</el-button>
              <el-button round plain type="success" @click="createPlan(false)" class="custom-button" v-show="toggleTabIndex === 1 && isHiddenOfModifyBtn === false" >覆盖并保存</el-button>
              <el-button round plain type="success" @click="exportExcel()" class="custom-button" icon="el-icon-upload2" v-show="!edit" >导出</el-button>
              <div style="width: calc(100% + 60px);margin-left: -30px;height: 1px;background: #E5E5E5;margin-top: 10px;"></div>
            </div>
            <div>
              采购详情
              <div v-if="toggleTabIndex === 0" style="float: right">
                <el-button round plain type="success" @click="createPlan(true)" class="custom-button" v-trace="{title:'气源采购-采购测算-自定义采购方案-点击生成方案'}" >生成方案</el-button>
                <el-button round plain type="success" @click="resetStore()" class="custom-button" v-trace="{title:'气源采购-采购测算-自定义采购方案-点击重置缓存'}" >重置缓存</el-button>
                <el-button round plain type="success" @click="exportExcel()" class="custom-button" icon="el-icon-upload2" v-trace="{title:'气源采购-采购测算-自定义采购方案-点击导出'}" >导出</el-button>
              </div>
            </div>
          </div>
          <el-table
              v-loading="loading"
              :data="descTable.list"
              stripe
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
              class="custom-table-r"
              style="width: calc(100% - 60px); margin-top: 20px;margin-left: 30px;">
            <el-table-column
                prop="supplier_name"
                label="供应商"
                align="center"
                width="200">
            </el-table-column>
            <el-table-column
                prop="gas"
                align="center"
                width="130">
              <template slot="header">
                <div>购气量 <br/>（万方）</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="accounted"
                align="center"
                label="采购占比"
                width="130">
              <template slot-scope="scope">
                {{ getPercent(scope.row.accounted) + '%' }}
              </template>
            </el-table-column>
            <el-table-column
                prop="not_heating_comprehensive_price"
                align="center">
              <template slot="header">
                <div>非采暖季价格 <br/>（元/方）</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="heating_comprehensive_price"
                align="center">
              <template slot="header">
                <div>采暖季综合价格 <br/>（元/方）</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="heating_not_residents_price"
                align="center">
              <template slot="header">
                <div>采暖季非居综合价格 <br/>（元/方）</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="not_residents_price"
                width="160px"
                align="center">
              <template slot="header">
                <div>全年非居综合价格 <br/>（元/方）</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="comprehensive_price"
                align="center">
              <template slot="header">
                <div>综合价格 <br/>（元/方）</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="cost_price"
                align="center">
              <template slot="header">
                <div>采购成本 <br/>（万元）</div>
              </template>
            </el-table-column>
          </el-table>
          <p class="gas-tab-title">
            分配方案
            <el-button round plain type="success" @click="editBtnHandle()" class="custom-button" icon="el-icon-edit" v-show="isHiddenOfModifyBtn === false || toggleTabIndex === 0" 
            v-trace="{title:`${edit ? '气源采购-采购测算-自定义采购方案-点击测算' : '气源采购-采购测算-自定义采购方案-点击编辑'}`}" >
              {{ edit ? '测算' : '编辑' }}
            </el-button>
            <el-button round plain type="success" @click="edit = false;getData();" class="custom-button" icon="el-icon-document-delete" v-show="(isHiddenOfModifyBtn === false || toggleTabIndex === 0) && edit">
              取消
            </el-button>
          </p>
          <el-table
              :data="fpTable.list"
              v-loading="loading"
              stripe
              ref="fpTable"
              row-key="rowKey"
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
              class="custom-table-r"
              style="width: calc(100% - 60px); margin-top: 20px;margin-left: 30px;">
            <el-table-column
                prop="supplier_name"
                label="供应商"
                align="center"
                width="100">
            </el-table-column>
            <el-table-column
                prop="nameA"
                align="center"
                width="80">
            </el-table-column>
            <el-table-column
                align="center"
                label="4月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-if="edit && scope.row.editable">
                  <el-input class="reply-input"
                            v-model="scope.row['4']"
                            oninput='value=(value.match(/^[0-9]+(\.[0-9]{0,4})?/g) ?? [0])[0]'
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-else>
                  {{ scope.row['4'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="5月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-if="edit && scope.row.editable">
                  <el-input class="reply-input"
                            v-model="scope.row['5']"
                            oninput='value=(value.match(/^[0-9]+(\.[0-9]{0,4})?/g) ?? [0])[0]'
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-else>
                  {{ scope.row['5'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="6月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-if="edit && scope.row.editable">
                  <el-input class="reply-input"
                            v-model="scope.row['6']"
                            oninput='value=(value.match(/^[0-9]+(\.[0-9]{0,4})?/g) ?? [0])[0]'
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-else>
                  {{ scope.row['6'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="7月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-if="edit && scope.row.editable">
                  <el-input class="reply-input"
                            v-model="scope.row['7']"
                            oninput='value=(value.match(/^[0-9]+(\.[0-9]{0,4})?/g) ?? [0])[0]'
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-else>
                  {{ scope.row['7'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="8月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-if="edit && scope.row.editable">
                  <el-input class="reply-input"
                            v-model="scope.row['8']"
                            oninput='value=(value.match(/^[0-9]+(\.[0-9]{0,4})?/g) ?? [0])[0]'
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-else>
                  {{ scope.row['8'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="9月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-if="edit && scope.row.editable">
                  <el-input class="reply-input"
                            v-model="scope.row['9']"
                            oninput='value=(value.match(/^[0-9]+(\.[0-9]{0,4})?/g) ?? [0])[0]'
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-else>
                  {{ scope.row['9'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="10月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-if="edit && scope.row.editable">
                  <el-input class="reply-input"
                            v-model="scope.row['10']"
                            oninput='value=(value.match(/^[0-9]+(\.[0-9]{0,4})?/g) ?? [0])[0]'
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-else>
                  {{ scope.row['10'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="nameB"
                align="center"
                width="80">
            </el-table-column>
            <el-table-column
                align="center"
                label="11月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-if="edit && scope.row.editable">
                  <el-input class="reply-input"
                            v-model="scope.row['11']"
                            oninput='value=(value.match(/^[0-9]+(\.[0-9]{0,4})?/g) ?? [0])[0]'
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-else>
                  {{ scope.row['11'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="12月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-if="edit && scope.row.editable">
                  <el-input class="reply-input"
                            v-model="scope.row['12']"
                            oninput='value=(value.match(/^[0-9]+(\.[0-9]{0,4})?/g) ?? [0])[0]'
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-else>
                  {{ scope.row['12'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="1月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-if="edit && scope.row.editable">
                  <el-input class="reply-input"
                            v-model="scope.row['1']"
                            oninput='value=(value.match(/^[0-9]+(\.[0-9]{0,4})?/g) ?? [0])[0]'
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-else>
                  {{ scope.row['1'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="2月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-if="edit && scope.row.editable">
                  <el-input class="reply-input"
                            v-model="scope.row['2']"
                            oninput='value=(value.match(/^[0-9]+(\.[0-9]{0,4})?/g) ?? [0])[0]'
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-else>
                  {{ scope.row['2'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="3月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-if="edit && scope.row.editable">
                  <el-input class="reply-input"
                            v-model="scope.row['3']"
                            oninput='value=(value.match(/^[0-9]+(\.[0-9]{0,4})?/g) ?? [0])[0]'
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-else>
                  {{ scope.row['3'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="sum"
                label="合计"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="gas-tab-card-wrapper" v-show="toggleTabIndex === 1 && isHiddenOfCesuan === true">
        <div class="gas-tab-title" style="margin-top: 10px;">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" @submit.native.prevent>
<!--            <el-form-item label="生成日期">-->
<!--              <div class="gas-page-com-wrapper">-->
<!--                <el-date-picker-->
<!--                    v-model="searchForm.date"-->
<!--                    @change="searchDateChange"-->
<!--                    :clearable="false"-->
<!--                    type="daterange"-->
<!--                    format="yyyy/MM/dd"-->
<!--                    class="custom-datepicker">-->
<!--                </el-date-picker>-->
<!--              </div>-->
<!--            </el-form-item>-->
            <el-form-item label="方案名称">
              <div class="gas-tool-search-wrapper">
                <el-input v-model="searchForm.name" placeholder="请输入方案名称" @change="searchNameChange"></el-input>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="plan-table-wrapper">
          <el-table
              :data="planTable.list"
              stripe
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
              @sort-change="tablePlansSortChange"
              v-loading="loading"
              @select="planSelect"
              class="custom-table"
              ref="planTable"
              style="width: 100%; margin-top: 20px;">
            <el-table-column
                type="selection"
                :selectable="planSelectable"
                align="center"
                width="100px">
              <template slot="header">
                <div>对比</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="name"
                align="center"
                label="方案名称">
            </el-table-column>
            <el-table-column
                prop="comprehensive_price_num"
                align="center">
              <template slot="header">
                <div>购气量 <br/>（万方）</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="comprehensive_price"
                sortable="custom"
                align="center">
              <template slot="header">
                <div style="display: inline-block;vertical-align: middle;">综合价格 <br/>（元/方）</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="comprehensive_price_sum"
                sortable="custom"
                align="center">
              <template slot="header">
                <div style="display: inline-block;vertical-align: middle;">总采购成本 <br/>（万元）</div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="生成时间">
              <template slot-scope="scope">
                {{ getFormatDate(scope.row.createTime, '/') }}
              </template>
            </el-table-column>
            <el-table-column
                prop="compNum"
                align="center"
                label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="planDesc(scope.row)" v-trace="{title:'气源采购-采购测算-点击方案列表-点击详情'}">详情</el-button>
                <el-button type="text" @click="planModify(scope.row)" v-trace="{title:'气源采购-采购测算-点击方案列表-点击编辑'}">编辑</el-button>
                <el-button type="text" @click="planDelete(scope.row.id)" v-trace="{title:'气源采购-采购测算-点击方案列表-点击删除'}">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="plan-page-wrapper custom-page">
          <el-pagination
              layout="prev, pager, next"
              @current-change="tablePlanChange"
              :current-page="planTable.current"
              :page-size="planTable.pageSize"
              :total="planTable.total">
          </el-pagination>
        </div>
        <div class="plan-compare-wrapper" v-if="compareFixVisiable">
          <i class="el-icon-circle-close" @click="compareBannerClose()"></i>
          <div class="gas-tab-title">
            方案对比
          </div>
          <div class="plan-compare-list-wrapper">
            <div class="plan-compare-list-item-wrapper" v-for="v in planCompareList" :key="v.id">
              <i class="el-icon-error" @click="planCompareDelete(v.id)"></i>
              <div class="plan-compare-item-name">{{ v.name }}</div>
              <div class="plan-compare-jiage">
                <span class="plan-compare-jiage-span">综合价格：</span>
                <span class="plan-compare-jiage-span">{{ v.comprehensive_price }}</span>
              </div>
              <div class="plan-compare-jiage">
                <span class="plan-compare-jiage-span">总采购成本：</span>
                <span class="plan-compare-jiage-span">{{ v.comprehensive_price_sum }}</span>
              </div>
            </div>
            <div class="plan-compare-list-null-wrapper" v-for="v in [1, 2, 3, 4]" :key="v" :style="{left: (v - 1) * 306 + 'px'}">
              您还可以继续添加
            </div>
          </div>
          <el-button  round plain type="success" @click="planCompareSubmit()" size="large" class="custom-button compare-btn">对比</el-button>
          <el-button  round plain type="success" @click="planCompareReset()" size="large" class="custom-button reset-btn">清空</el-button>
        </div>
      </div>

      <el-dialog
          title="添加方案"
          :visible.sync="dialogAddVisible"
          :close-on-click-modal="false"
          width="400px">
        <div style="margin-left: 30px;">
          方案名称：
          <el-input
              style="width: 200px;"
              placeholder="请输入方案名称"
              :before-close="createPlanHandle"
              v-model="planName">
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="submitBtnDisabled" @click="createPlanHandle">确 定</el-button>
      </span>
      </el-dialog>
    </div>
    <div class="banner-card-wrapper compare-card-wrapper" v-show="comparePop">
      <div class="gas-tab-title">
        方案对比
        <span class="back-btn-wrapper" @click="comparePop = false">
          <span class="back-btn">返回</span>
          <i class="el-icon-arrow-right"></i>
        </span>
        <el-button round plain type="success" @click="exportCompare()" class="custom-button" icon="el-icon-upload2">
          导出
        </el-button>
      </div>
      <div class="compare-wrapper">
        <div class="compare-l-wrapper">
          <div class="compare-item">
            非采暖季价格
          </div>
          <div class="compare-item">
            采暖季综合价格
          </div>
          <div class="compare-item">
            采暖季非居综合价格
          </div>
          <div class="compare-item">
            全年非居综合价格
          </div>
          <div class="compare-item">
            综合价格
          </div>
          <div class="compare-item">
            采购成本
          </div>
          <div class="compare-item">
            综合单价
          </div>
          <div class="compare-item">
            总成本
          </div>
        </div>
        <div class="compare-r-wrapper">
          <div class="compare-r-item" v-for="v in list" :key="v.id">
            <div class="compare-r-item-title">
              {{ v.name }}
            </div>
            <div v-for="vv in v.planText.total" :key="vv.supplier_name" class="compare-r-item-wrapper">
              <div class="compare-item">
                {{ vv.supplier_name }}
              </div>
              <div class="compare-item">
                {{ vv.not_heating_comprehensive_price }}
              </div>
              <div class="compare-item">
                {{ vv.heating_comprehensive_price }}
              </div>
              <div class="compare-item">
                {{ vv.heating_not_residents_price }}
              </div>
              <div class="compare-item">
                {{ vv.not_residents_price }}
              </div>
              <div class="compare-item">
                {{ vv.comprehensive_price }}
              </div>
              <div class="compare-item">
                {{ vv.cost_price }}
              </div>
            </div>
            <div class="compare-item-total">
              {{ v.comprehensivePrice }}
            </div>
            <div class="compare-item-total">
              {{ v.comprehensivePriceSum }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topMenu from "../../components/topMenu/topMenu";
import api from '/src/http/api';
import exportApi from '/src/components/export/export'
import dateFormater from "../../components/dateFormater/dateFormater";
import * as mathjs from 'mathjs'

export default {
  name: 'purchasingEstimation',
  mixins: [exportApi, dateFormater],
  data: function () {
    return {
      browerTime:0,
      timer:null,
      comparePop: false,
      toggleTabIndex: 0, // 控制上方tab显示
      isHiddenOfCesuan: true,  //在方案列表页是否让测算页面显示
      isHiddenOfModifyBtn: true,
      loading: false,
      descTable: {
        list: []
      },
      fpTable: {
        list: [
          {
            supplier_name: '合计',
            rowKey: Math.random().toString(),
            editable: true,
            sum: 0,
            '4': 0,
            '5': 0,
            '6': 0,
            '7': 0,
            '8': 0,
            '9': 0,
            '10': 0,
            '11': 0,
            '12': 0,
            '1': 0,
            '2': 0,
            '3': 0,
          }
        ]
      },
      dialogAddVisible: false,
      planName: '',
      planText: {},
      submitBtnDisabled: false,
      searchForm: {
        date: [Date.now()-30*24*3600, Date.now()],
        name: ''
      },
      planTable: {
        list: [],
        total: 0,
        pageSize: 10,
        current: 1
      },
      planCompareList: [],
      compareFixVisiable: false,
      list: [],
      edit: false,
      editPlanItem: {
        name: '',
        createTime: Date.now()
      },
      isAddPlan: true,
      sortBy: 'id',
      sortType: 'desc'
    }
  },
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom
    },
    curComCodeName: function () {
      return this.$store.getters.curComName
    }
  },
  watch: {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if (n && o) {
          this.getData()
        }
      }
    }
  },
  created() {
    window.zhuge.track('气源采购-进入采购测算页面',{'页面名称':'采购测算页面'})
    this.getData()
  },
  mounted() {
    this.getBrowerTime()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.zhuge.track('气源采购-采购测算页面停留时长',{'采购测算页面停留时长':this.browerTime})
  },  
  methods: {
    getBrowerTime() {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    },    
    getData: function () {
      switch (this.toggleTabIndex) {
        case 0:
          this.getStore();
          break;
        case 1:
          if(this.isHiddenOfCesuan === true) {
            this.getPlan();
          } else {
            this.getPlanById(this.editPlanItem.id)
          }
          break;
      }
    },
    getStore: function () {
      this.loading = true
      api.purchasingEstimation.getStore({
        creator: this.$store.getters.loginName,
        xaReig: this.curComCode,
        year: new Date().getFullYear(),
        level: this.$store.getters.curComInfo.orgLevel
      }).then(res => {
        this.loading = false
        if (res) {
          if(res.length > 0) {
            this.setTable(res[0].planText.total, res[0].planText.suppliers)
            this.planText = res[0]['planText']
          } else {
            this.setTable([], [])
          }
        }
      })
    },
    getPlanById: function (planId) {
      this.loading = true
      api.purchasingEstimation.getPlanById({
        id: planId
      }).then(res => {
        this.loading = false;
        if(res && res.length > 0) {
          this.setTable(res[0].planText.total, res[0].planText.suppliers)
        }
      })
    },
    toggleTabHandler: function (index) {
      if(index === this.toggleTabIndex) {
        return false
      }
      this.edit = false
      this.toggleTabIndex = index
      this.isHiddenOfCesuan = true
      this.getData()
    },
    setTable: function (totalTableList, fpTableList) {
      this.descTable.list = totalTableList;
      this.fpTable.list = [
        {
          supplier_name: '合计',
          rowKey: Math.random().toString(),
          editable: true,
          sum: 0,
          '4': 0,
          '5': 0,
          '6': 0,
          '7': 0,
          '8': 0,
          '9': 0,
          '10': 0,
          '11': 0,
          '12': 0,
          '1': 0,
          '2': 0,
          '3': 0,
        }
      ]
      for (let index in fpTableList) {
        if((Object.prototype.hasOwnProperty.call(fpTableList[index], 'heatingChild') && fpTableList[index].heatingChild.length > 0)
            || (Object.prototype.hasOwnProperty.call(fpTableList[index], 'noHeatingChild') && fpTableList[index].noHeatingChild.length > 0)) {
          let item = {
            supplier_name: fpTableList[index].supplier_name,
            supplier_code: fpTableList[index].supplier_code,
            sum: fpTableList[index].sum,
            editable: true,
            rowKey: Math.random().toString(),
            children: []
          }
          for (let i = 1; i <= 12; i++) {
            item[i.toString()] = fpTableList[index][i.toString()] ? parseFloat(fpTableList[index][i.toString()], 2) : 0
          }
          for (let i in fpTableList[index].heatingChild) {
            item.children[i] = {
              supplier_name: '',
              nameA: fpTableList[index].noHeatingChild[i] ? fpTableList[index].noHeatingChild[i].name : '-',
              nameB: fpTableList[index].heatingChild[i].name,
              sum: null,
              editable: false,
              rowKey: Math.random().toString(),
              '4': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['4'], 2) : '-',
              '5': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['5'], 2) : '-',
              '6': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['6'], 2) : '-',
              '7': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['7'], 2) : '-',
              '8': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['8'], 2) : '-',
              '9': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['9'], 2) : '-',
              '10': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['10'], 2) : '-',
              '11': parseFloat(fpTableList[index].heatingChild[i]['11'], 2),
              '12': parseFloat(fpTableList[index].heatingChild[i]['12'], 2),
              '1': parseFloat(fpTableList[index].heatingChild[i]['1'], 2),
              '2': parseFloat(fpTableList[index].heatingChild[i]['2'], 2),
              '3': parseFloat(fpTableList[index].heatingChild[i]['3'], 2),
            }
            this.$set(this.fpTable.list, index, item)
          }
        } else {
          let item = {
            supplier_name: fpTableList[index].supplier_name,
            supplier_code: fpTableList[index].supplier_code,
            rowKey: Math.random().toString(),
            editable: true,
            sum: fpTableList[index].sum || 0
          }
          for (let i = 1; i <= 12; i++) {
            item[i.toString()] = fpTableList[index][i.toString()] ? parseFloat(fpTableList[index][i.toString()], 2) : 0
          }
          this.$set(this.fpTable.list, index, item)
        }
      }
    },
    getPlan: function () {
      let params = {
        // beginTime: this.getFormatDate(this.searchForm.date[0]),
        // endTime: this.getFormatDate(this.searchForm.date[1]),
        xaReig: this.curComCode,
        name: this.searchForm.name,
        pageNum: this.planTable.current,
        pageSize: this.planTable.pageSize,
        orderByColumn: this.sortBy,
        isAsc: this.sortType
      }
      this.loading = true
      api.purchasingEstimation.getPlans(params).then(res => {
        this.loading = false
        if (res) {
          this.planTable.list = res[0].list
          this.planTable.current = res[0].pageNum
          this.planTable.total = res[0].total
          this.setSelection()
        }
      })
    },
    setSelection: function () {
      let that = this
      for (let i in this.planTable.list) {
        let fI = function (element) {
          return element.id === that.planTable.list[i].id
        }
        if(this.planCompareList.findIndex(fI) !== -1) {
          this.$nextTick(() => {
            this.$refs.planTable.toggleRowSelection(this.planTable.list[i], true)
          })
        }
      }
    },
    totalHandle: function (row) {
      let params = {
        creator: this.$store.getters.loginName,
        year: new Date().getFullYear(),
        xaReig: this.curComCode
      }
      let data = {}
      for (let i = 1; i < 13; i++) {
        data[i.toString()] = {
          total: parseFloat(row[i.toString()])
        }
      }
      this.loading = true
      api.purchasingEstimation.getDataByTotal(params, data).then(res => {
        this.loading = false
        if (res.length > 0) {
          this.planText = res[0]
          this.setTable(res[0].total, res[0].suppliers)
          this.$message({
            message: '已完成测算！',
            type: 'success'
          });
        }
      })
    },
    totalHandleAgain: function () {
      let params = {
        creator: this.$store.getters.loginName,
        year: new Date().getFullYear(),
        xaReig: this.curComCode
      }
      let total = this.fpTable.list[0]
      let totalExe = {
        '4': 0,
        '5': 0,
        '6': 0,
        '7': 0,
        '8': 0,
        '9': 0,
        '10': 0,
        '11': 0,
        '12': 0,
        '1': 0,
        '2': 0,
        '3': 0,
      }
      for (let index in this.fpTable.list) {
        for (let i = 1; i < 13; i++) {
          this.fpTable.list[index][i.toString()] = this.fpTable.list[index][i.toString()] ? parseFloat(this.fpTable.list[index][i.toString()]) : 0
          if(index > 0) {
            totalExe[i.toString()] = mathjs.add(mathjs.bignumber(totalExe[i.toString()]), mathjs.bignumber(this.fpTable.list[index][i.toString()]))
          }
        }
      }
            console.log('未清除缓存 采购有数据时22222,,,222---------：', total, totalExe)

      let errorMonth = ''
      for (let i = 1; i < 13; i++) {
        if(total[i].toString() !== totalExe[i.toString()].toString()) {
          errorMonth += '、' + i + '月'
        }
      }
      if(errorMonth !== '') {
        errorMonth += '合计总量与各供应商气量合计值不相等，请修正。'
        this.$message({
          message: errorMonth.substring(1),
          type: 'error'
        })
        return false
      }
      this.loading = true
      api.purchasingEstimation.getDataByTotalAgain(params, this.fpTable.list).then(res => {
        this.loading = false
        if (res.length > 0) {
          this.planText = res[0]
          this.setTable(res[0].total, res[0].suppliers)
          this.$message({
            message: '已完成测算！',
            type: 'success'
          });
        }
      })
    },
    createPlan: function (isNewPlan = true) {
      this.submitBtnDisabled = false
      if(isNewPlan) {
        this.isAddPlan = true
        this.planName = ''
      } else {
        this.isAddPlan = false
        this.planName = this.editPlanItem.name
      }
      this.dialogAddVisible = true
    },
    createPlanHandle: function () {
      if (this.planName === '') {
        this.$message({
          message: '方案名不能为空',
          type: 'error',
          duration: 1000
        });
        return false
      }
      this.submitBtnDisabled = true
      let data = {
        name: this.planName,
        planText: this.planText,
        xaReig: this.curComCode,
        xaReigTxt: this.curComCodeName,
        year: new Date().getFullYear()
      }
      if(!this.isAddPlan) {
        data.id = this.editPlanItem.id
      }
      api.purchasingEstimation.createPlan(data).then(res => {
        if (res) {
          this.planName = ''
          this.dialogAddVisible = false
          this.submitBtnDisabled = false
        }
      })
    },
    resetStore: function () {
      let params = {
        creator: this.$store.getters.loginName,
        xaReig: this.curComCode
      }
      api.purchasingEstimation.resetStore(params).then(res => {
        if (res) {
          this.$message({
            message: '重置成功',
            type: 'success',
            duration: 1000
          });
          this.descTable.list = []
          this.fpTable.list = [
            {
              supplier_name: '合计',
              rowKey: Math.random().toString(),
              editable: true,
              sum: 0,
              '4': 0,
              '5': 0,
              '6': 0,
              '7': 0,
              '8': 0,
              '9': 0,
              '10': 0,
              '11': 0,
              '12': 0,
              '1': 0,
              '2': 0,
              '3': 0,
            }
          ]
        }
      })
    },
    exportExcel: function () {
      let params = {
        xaReig: this.curComCode
      }
      if(this.toggleTabIndex === 1 && this.isHiddenOfCesuan === false) {
        params.id = this.editPlanItem.id
      } else {
        params.creator = this.$store.getters.loginName
      }
      api.purchasingEstimation.exportStore(params).then((res) => {
        this.download(res, 'xls', 'export')
      })
    },
    tablePlanChange: function (page) {
      this.planTable.current = page
      this.getData()
    },
    searchDateChange: function () {
      this.getData()
    },
    planSelect: function (selection, row) {
      this.compareFixVisiable = true
      let findCallback = function (element) {
        return element.id === row.id
      }
      let fI = this.planCompareList.findIndex(findCallback)
      if(fI === -1) {
        this.planCompareList.push(row)
      } else {
        this.planCompareList.splice(fI, 1)
      }
    },
    planCompareDelete: function (id) {
      for (let index in this.planCompareList) {
        if(this.planCompareList[index].id === id) {
          this.planCompareList.splice(index, 1)
        }
      }
    },
    planSelectable: function (row) {
      if(this.planCompareList.length < 4) {
        return true
      }
      for (let v of this.planCompareList) {
        if(row.id === v.id) {
          return true
        }
      }
      return false
    },
    planCompareSubmit: function () {
      if(this.planCompareList.length <= 1) {
        this.$message({
          message: '至少需要选择两条方案！',
          type: 'warning'
        });
        return false
      }
      let ids = '';
      for (let v of this.planCompareList) {
        ids += ',' + v.id
      }
      api.purchasingEstimation.comparePlans({
        ids: ids.substring(1)
      }).then(res => {
        if(res) {
          this.list = res
          this.comparePop = true
        }
      })
    },

    exportCompare: function () {
      let ids = '';
      for (let v of this.planCompareList) {
        ids += ',' + v.id
      }
      api.purchasingEstimation.exportCompare({
        ids: ids.substring(1)
      }).then(res => {
        this.download(res, 'xls', 'export')
      })
    },

    planCompareReset: function () {
      this.planCompareList.splice(0, this.planCompareList.length);
      this.$refs.planTable.clearSelection();
    },
    searchNameChange: function () {
      this.getData()
    },
    planDesc: function (plan) {
      this.editPlanItem = plan
      this.toggleTabIndex = 1
      this.isHiddenOfCesuan = false
      this.isHiddenOfModifyBtn = true
      this.getData()
    },
    planModify: function (plan) {
      this.planDesc(plan)
      this.edit = true
      this.isHiddenOfModifyBtn = false
    },
    planDelete: function (planID) {
      this.$confirm('确认删除该方案吗？')
          .then(() => {
            api.purchasingEstimation.deletePlan({
              id: planID
            }).then(res => {
              if(res) {
                this.$message({
                  message: '删除方案成功！',
                  type: 'success'
                });
                this.getData()
              }
            })
          })
    },
    compareBannerClose: function () {
      this.planCompareReset()
      this.compareFixVisiable = false
    },
    editBtnHandle: function () {
      for (let i in this.$refs.fpTable.data) {
        this.$refs.fpTable.toggleRowExpansion(this.$refs.fpTable.data[i], false)
      }
      if(this.edit) {
        if(this.fpTable.list.length > 1) {
          this.totalHandleAgain()
        } else {
          this.totalHandle(this.fpTable.list[0])
        }
        return this.edit = false
      }
      this.edit = true
    },
    getRowKey: function () {
      return Math.random()
    },
    backPlanList: function () {
      this.isHiddenOfCesuan = true
      this.edit = false
      this.getData()
    },
    tablePlansSortChange: function ({ prop, order }) {
      this.sortBy = prop
      switch (order) {
        case 'ascending':
          this.sortType = 'asc'
          break;
        case 'descending':
          this.sortType = 'desc'
          break;
        default:
          this.sortBy = 'id'
          this.sortType = 'desc'
          break;
      }
      this.getData()
    },
    getPercent(num) {
      return mathjs.multiply(mathjs.bignumber(num), 100)
    }
  },
  components: {
    topMenu
  },
}
</script>

<style scoped lang="scss">
.gas-page-bg {
  min-width: auto;
}
.gas-pu-container {
  width: calc(100% - 60px);
  margin-left: 30px;
  margin-top: 30px;
}

.gas-wrapper-title span {
  font-size: 14px;
  color: #74788D;
  margin-left: 14px;
}

.gas-tab-card-header {
  width: 450px;
  height: 80px;
  line-height: 80px;
  font-size: 22px;
  background: #ffffff;
  box-shadow: 0px 10px 20px rgba(38, 51, 88, 0.07);
  opacity: 1;
  border-radius: 10px 10px 0px 0px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
}

.tab-card-header {
  flex: 1;
  height: 100%;
  float: left;
  color: #ffffff;
  background: #8D95B4;
  text-align: center;
  cursor: pointer;
}

.tab-card-header-active {
  background: #FFFFFF !important;
  border-bottom: none;
  opacity: 1;
  color: #74788D;
  border-radius: 12px 12px 0px 0px;
}

.gas-tab-card-wrapper {
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  box-shadow: 0px 2px 8px rgba(38, 51, 88, 0.12);
  opacity: 1;
  border-radius: 0px 12px 12px 12px;
  padding-top: 15px;
  padding-bottom: 30px;
  overflow: hidden;
  position: relative;
}

.gas-plan-wrapper {
  margin-top: 25px;
  width: 264px;
  background-color: rgba(239, 242, 246, 1);
  border-radius: 10px;
  margin-left: 30px;
  float: left;
  position: relative;
}

.plan-title,
.price,
.cost {
  margin-top: 25px;
  margin-left: 30px;
  height: 25px;
  font-size: 18px;
}

.cost,
.price {
  color: #12C2BA;
  margin-top: 5px !important;
}

.cost {
  margin-bottom: 30px;
}

.plan-item {
  margin-left: 30px;
  margin-top: 5px;
  font-size: 18px;
}

.item-name,
.item-value {
  width: 100px;
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
}

.demo-form-inline {
  /deep/ .el-form-item__label {
    color: #74788D;
    font-size: 16px;
  }

  /deep/ .gas-el-select .el-input__suffix {
    border-left: none;
    right: 12px;
  }
}

.custom-datepicker {
  background: #F6F7FA;
  border-radius: 20px;
  border: none;
}

.custom-datepicker {
  /deep/ .el-input__inner {
    color: #495464 !important;
  }
}

.gas-tool-search-wrapper {
  width: 210px;
  height: 42px;
  background: #F6F7FA;
  opacity: 1;
  border-radius: 20px;
}

.plan-table-wrapper {
  padding: 0 30px;
  box-sizing: border-box;
  margin-top: 10px;
  overflow: hidden;
}

.plan-page-wrapper {
  padding: 0 30px;
  box-sizing: border-box;
}

.plan-page-wrapper {
  margin-top: 20px;
}
.plan-compare-wrapper {
  width: calc(100% - 285px);
  padding: 20px 0 30px 0;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 12px;
  height: 231px;
  z-index: 10;
}
.plan-compare-list-wrapper {
  width: calc(100% - 400px);
  margin-top: 8px;
  margin-left: 30px;
  height: 139px;
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
}
.compare-btn, .reset-btn {
  float: none !important;
  position: absolute;
  right: 100px;
  width: 190px;
  height: 46px;
  border-radius: 50px;
}
.compare-btn {
  color: #ffffff !important;
  background: rgba(15, 178, 171, 1) !important;
  top: 70px;
}
.reset-btn {
  bottom: 41px;
  background: #FFFFFF !important;
  border: 1px solid #D2D2DC !important;
  color: #74788D !important;
}
.plan-compare-list-item-wrapper {
  width: 286px;
  height: 119px;
  margin-top: 12px;
  border: 1px solid #D2D2DC;
  border-left: 11px solid #0FB2AB;
  border-radius: 12px;
  margin-right: 20px;
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  padding-left: 20px;
  background: #ffffff;
  z-index: 2;
}
.plan-compare-list-null-wrapper {
  width: 286px;
  height: 119px;
  margin-top: 12px;
  border: 1px dashed #D2D2DC;
  border-radius: 12px;
  margin-right: 20px;
  box-sizing: border-box;
  position: absolute;
  display: inline-block;
  line-height: 119px;
  color: #A6A9B4;
  text-align: center;
  z-index: 1;
}
.el-icon-error {
  font-size: 24px;
  position: absolute;
  top: -12px;
  right: -12px;
  color: #999999;
  cursor: pointer;
}
.plan-compare-item-name {
  font-size: 16px;
  font-weight: 600;
  margin-top: 13px;
  height: 22px;
  width: 220px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.plan-compare-jiage {
  height: 22px;
  font-size: 16px;
  margin-top: 9px;
}
.plan-compare-jiage-span {
  display: inline-block;
  width: 110px;
  vertical-align: top;
}
.custom-table {
  /deep/ .el-table__header-wrapper  .el-checkbox{
    display:none
  }
  /deep/ .custom-table-header .el-table-column--selection::before {
    content: "对比";
    display: block;
    position: absolute;
    width: 100%;
  }
}

.el-icon-circle-close {
  width: 35px;
  height: 35px;
  font-size: 35px;
  right: 10px;
  top: 10px;
  position: absolute;
  text-align: right;
  color: #666;
  cursor: pointer;
}
.compare-card-wrapper {
  height: 631px;
}
.gas-tab-title {
  height: 46px;
  font-size: 19px;
  font-weight: 500;
  line-height: 40px;
  color: #2C3E50;
  opacity: 1;
  margin-top: 15px;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  overflow: hidden;
}
.custom-button {
  float: right;
  margin-right: 0px;
  margin-left: 20px;
  height: 40px;
}
.compare-wrapper {
  height: 520px;
  margin-top: 20px;
  padding: 0 30px;
  box-sizing: border-box;
}
.compare-l-wrapper {
  display: inline-block;
  height: 100%;
  width: 160px;
  vertical-align: top;
  padding-top: 110px;
  box-sizing: border-box;
}
.compare-r-wrapper {
  display: inline-block;
  height: 100%;
  width: calc(100% - 160px);
  vertical-align: top;
  white-space: nowrap;
  overflow-x: auto;
}
.compare-item {
  height: 48px;
  line-height: 48px;
  color: #505356;
}
.compare-item-total {
  height: 48px;
  line-height: 48px;
  color: #505356;
  text-align: center;
}
.compare-r-item {
  margin-left: 50px;
  display: inline-block;
  vertical-align: top;
}
.compare-r-item-wrapper {
  display: inline-block;
  vertical-align: top;
  margin-right: 25px;
  padding-left: 14px;
  box-sizing: border-box;
  margin-top: 10px;
}
.compare-r-item-title {
  height: 51px;
  background: #FFFFFF;
  border: 1px solid #D2D2DC;
  border-left: 14px solid #0FB2AB;
  opacity: 1;
  border-radius: 12px;
  text-indent: 30px;
  line-height: 51px;
  color: #2C3E50;
  font-weight: 600;
}
.el-icon-arrow-right {
  font-size: 12px;
  border: none;
  border-radius: 10px;
  line-height: 16px;
  height: 16px;
  width: 16px;
  text-align: center;
  background: rgba(116, 120, 141, 0.1);
  vertical-align: middle;
}
.back-btn-wrapper {
  color: #74788D;
  float: right;
  font-size: 14px;
  margin-left: 20px;
  cursor: pointer;
}
.back-btn {
  display: inline-block;
  margin-right: 5px;
  height: 16px;
  line-height: 16px;
  vertical-align: middle;
}
.custom-datepicker {
  /deep/ .el-range-input {
    color: #495464 !important;
  }
  /deep/ .el-range-separator {
    color: #495464 !important;
  }
}
</style>