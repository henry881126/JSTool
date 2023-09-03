<template>
  <div class="gas-page-bg" style="height: 100%;">
    <top-menu></top-menu>
    <div class="tab-title-wrapper">
      <span :class="{'tab-active': tab === 0}" @click="tabClick(0)">日计划批复</span>
      <span style="margin: 0 20px;">/</span>
      <span :class="{'tab-active': tab === 1}" @click="tabClick(1)">日变更批复</span>
    </div>
    <div class="select-wrapper">
      <el-form :inline="true" :model="selectForm" class="demo-form-inline">
        <el-form-item label="状态">
          <div class="gas-page-com-wrapper">
            <el-select v-model="selectForm.status" class="gas-el-select" @change="selectStatusChange">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="未上报" value="0" v-if="tab === 0"></el-option>
              <el-option label="已上报未审批" value="1" v-if="tab === 0"></el-option>
              <el-option label="已上报已审批" value="2" v-if="tab === 0"></el-option>
              <el-option label="未变更" value="2" v-if="tab === 1"></el-option>
              <el-option label="已变更未批复" value="3" v-if="tab === 1"></el-option>
              <el-option label="已变更已批复" value="4" v-if="tab === 1"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="客户">
          <div class="gas-page-com-wrapper">
            <el-select v-model="selectForm.compCode" class="gas-el-select" @change="selectCompChange">
              <el-option label="全部" value="0"></el-option>
              <el-option :label="v.compCodeTxt" :value="v.compCode" v-for="v in selectCompList" :key="v.compCode"></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="banner-card-wrapper">
      <div class="gas-reply-title-wapper">
        <div class="gas-reply-title" v-show="tab === 0">
          日计划批复: {{ this.getFormatDate(Date.now()+24*3600000, '年月日') }} 8:00 - {{ this.getFormatDate(Date.now() + 48*3600000, '年月日') }} 8:00
        </div>
        <div class="gas-reply-title" v-show="tab === 1">
          日变更批复: {{ this.getFormatDate(Date.now(), '年月日') }} 8:00 - {{ this.getFormatDate(Date.now() + 24*3600000, '年月日') }} 8:00
        </div>
        <el-button round plain type="success" @click="exportExcel()" class="custom-button" icon="el-icon-upload2" v-trace="{title:'气量调配-用气批复-点击导出'}" >导出</el-button>
        <el-button v-show="selectForm.status === '1' || selectForm.status === '3'" round plain type="success" @click="replyPop()" class="custom-button reply-btn" icon="el-icon-s-check" v-trace="{title:'气量调配-用气批复-点击一键批复'}" >一键批复</el-button>
        <el-button v-show="tab === 0 && (selectForm.status === '1' || selectForm.status === '3')" round plain type="success" @click="handleTemporaryStorage()" class="custom-button reply-btn" icon="el-icon-s-check">暂存</el-button>        
      </div>
      <div class="danwei">
        （单位：万方）
      </div>
      <div class="gas-reply-table-wrapper">
        <div v-show="tab === 0" style="height: 100%;">
          <el-table
              :data="replyTable"
              stripe
              :span-method="arraySpanMethod"
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
              class="custom-table"
              height="100%"
              :key="replyTableKey"
              ref="replyTable"
              style="width: 100%;">
            <el-table-column
                :type="selectForm.status === '1' ? 'selection' : 'index'"
                align="center"
                width="80"
                :selectable="handleColumnSelected">
            </el-table-column>
            <el-table-column
                label="客户名称"
                align="center">
              <template slot-scope="scope">
                <inner-table :data="scope.row" :key="keyG()"></inner-table>
                <el-table :show-header="false"
                          v-if="scope.row.toBeApprovedTotalVO"
                          :data="[scope.row.toBeApprovedTotalVO]"
                          cell-class-name="custom-table-cell custom-table-cell-font-weight-600"
                          class="custom-table">
                  <el-table-column
                      prop="compCodeTxt"
                      align="center">
                  </el-table-column>
                  <el-table-column
                      align="center">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.contractDayAverage === null ? '-' : scope.row.contractDayAverage }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                      align="center">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.remainingContractDayAverage === null ? '-' : scope.row.remainingContractDayAverage }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="downGasPlace"
                      align="center">
                  </el-table-column>
                  <el-table-column
                      prop="yesterdayGasPlan"
                      align="center">
                      <template slot-scope="scope">
                        {{scope.row.yesterdayGasPlan === null ? '-' : scope.row.yesterdayGasPlan}}
                      </template>
                  </el-table-column>
                  <el-table-column
                      align="center">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.dayNum === null ? '-' : scope.row.dayNum }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                      align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.compCodeTxt === '合计'">{{ getDayNumReply === null || getDayNumReply === 0 || getDayNumReply === '0' || getDayNumReply === '0.0000' ? '-' : getDayNumReply }}</span>
                      <span v-else>{{ scope.row.dayNumReply === null ? '-' : scope.row.dayNumReply }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="desc"
                      align="center">
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="月度合同日均量">
            </el-table-column>
            <el-table-column
                align="center"
                label="剩余合同日均量">
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="输气站场">
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="昨日交割量">
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="日指定量">
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="批复量">
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="备注">
            </el-table-column>
          
          </el-table>
        </div>
        <div v-show="tab === 1" style="height: 100%;">
          <el-table
              :data="replyTable"
              stripe
              :span-method="arraySpanMethodChange"
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
              class="custom-table"
              ref="replyChangeTable"
              :key="replyTableKey"
              height="100%"
              style="width: 100%;">
            <el-table-column
                :type="selectForm.status === '3' ? 'selection' : 'index'"
                align="center"
                width="80"
                :selectable="handleColumnSelected">
            </el-table-column>
            <el-table-column
                label="客户名称"
                align="center">
              <template slot-scope="scope">
                <inner-change-table :data="scope.row" :key="keyG()"></inner-change-table>
                <el-table :show-header="false"
                          v-if="scope.row.toBeApprovedTotalVO"
                          :data="[scope.row.toBeApprovedTotalVO]"
                          cell-class-name="custom-table-cell custom-table-cell-font-weight-600"
                          class="custom-table">
                  <el-table-column
                      prop="compCodeTxt"
                      align="center">
                  </el-table-column>
                  <el-table-column
                      align="center">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.contractDayAverage === null ? '-' : scope.row.contractDayAverage }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                      align="center">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.remainingContractDayAverage === null ? '-' : scope.row.remainingContractDayAverage }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="downGasPlace"
                      align="center">
                  </el-table-column>
                  <el-table-column
                      prop="yesterdayGasPlan"
                      align="center">
                      <template slot-scope="scope">
                        {{scope.row.yesterdayGasPlan === null ? '-' : scope.row.yesterdayGasPlan}}
                      </template>
                  </el-table-column>
                  <el-table-column
                      align="center">
                    <template slot-scope="scope">
                      {{ scope.row.dayNum === null ? '-' : scope.row.dayNum }}
                    </template>
                  </el-table-column>
                  <el-table-column
                      align="center">
                    <template slot-scope="scope">
                      {{ scope.row.dayNumReply === null ? '-' : scope.row.dayNumReply }}
                    </template>
                  </el-table-column>
                  <el-table-column
                      align="center">
                    <template slot-scope="scope">
                      {{ scope.row.dayNumChange === null ? '-' : scope.row.dayNumChange }}
                    </template>
                  </el-table-column>
                  <el-table-column
                      align="center">
                    <template slot-scope="scope">
                      <div v-if="scope.row.status || scope.row.status === null">
                        <span v-if="scope.row.compCodeTxt === '合计'">{{ getDayNumChangeReply === null || getDayNumChangeReply === 0 || getDayNumChangeReply === '0' || getDayNumChangeReply === '0.0000' ? '-' : getDayNumChangeReply }}</span>
                        <span v-else>{{ scope.row.dayNumChangeReply === null ? '-' : scope.row.dayNumChangeReply }}</span>                        
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="desc"
                      align="center">
                  </el-table-column>
           
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="月度合同日均量">
            </el-table-column>
            <el-table-column
                align="center"
                label="剩余合同日均量">
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="输气站场">
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="昨日交割量">
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="日指定量">
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="批复量">
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="变更量">
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="变更批复量">
            </el-table-column>
            <el-table-column
                prop="compCode"
                align="center"
                label="备注">
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <div v-if="scope.row.toBeApprovedVO">

                    <el-button type="text" @click="noneDayNumChangeTips()" class="reject" v-if="!scope.row.toBeApprovedVO.statusOfDayNumChange">驳回</el-button>
                    <el-tooltip placement="left" v-else-if="!scope.row.toBeApprovedVO.status4">
                      <div slot="content">变更量已批复，不可操作。</div>
                      <el-button type="text" class="reject" style="cursor: not-allowed">驳回</el-button>
                    </el-tooltip>
                    <el-tooltip placement="left" v-else-if="!scope.row.toBeApprovedVO.statusOther">
                      <div slot="content">支持已变更未批复进行驳回，<br />其他状态不可操作。</div>
                      <el-button type="text" class="reject" style="cursor: not-allowed">驳回</el-button>
                    </el-tooltip>
                    <el-button type="text" @click="handleRejectEvent(scope)" class="reject" v-else>驳回</el-button>
                  </div>
                </template>
            </el-table-column>            
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog title="用气批复"
               :visible.sync="dialogTableVisible"
               width="80%"
               custom-class="custom-dialog">
      <div v-show="tab === 0">
        <el-table
            :data="dialogTable.list"
            stripe
            :span-method="arraySpanMethod"
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            class="custom-table"
            style="width: 100%;">
          <el-table-column
              type="index"
              align="center"
              width="80">
          </el-table-column>
          <el-table-column
              label="客户名称"
              align="center">
            <template slot-scope="scope">
              <inner-table :data="scope.row"></inner-table>
              <el-table :show-header="false"
                        v-if="scope.row.toBeApprovedTotalVO"
                        :data="[scope.row.toBeApprovedTotalVO]"
                        cell-class-name="custom-table-cell"
                        class="custom-table">
                <el-table-column
                    prop="compCodeTxt"
                    align="center">
                  <template slot-scope="scope">
                    <span style="font-weight: 600">{{ scope.row.compCodeTxt }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                    align="center">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.contractDayAverage === null ? '-' : scope.row.contractDayAverage }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                    align="center">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.remainingContractDayAverage === null ? '-' : scope.row.remainingContractDayAverage }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="downGasPlace"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="yesterdayGasPlan"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="dayNum"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="dayNumReply"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="desc"
                    align="center">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="月度合同日均量">
          </el-table-column>
          <el-table-column
              align="center"
              label="剩余合同日均量">
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="输气站场">
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="昨日交割量">
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="日指定量">
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="批复量">
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="备注">
          </el-table-column>
        </el-table>
      </div>
      <div v-show="tab === 1">
        <el-table
            :data="dialogTable.list"
            stripe
            :span-method="arraySpanMethodChange"
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            class="custom-table"
            style="width: 100%;">
          <el-table-column
              type="index"
              align="center"
              width="80">
          </el-table-column>
          <el-table-column
              label="客户名称"
              align="center">
            <template slot-scope="scope">
              <inner-change-table :data="scope.row"></inner-change-table>
              <el-table :show-header="false"
                        v-if="scope.row.toBeApprovedTotalVO"
                        :data="[scope.row.toBeApprovedTotalVO]"
                        cell-class-name="custom-table-cell"
                        class="custom-table">
                <el-table-column
                    prop="compCodeTxt"
                    align="center">
                </el-table-column>
                <el-table-column
                    align="center">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.contractDayAverage === null ? '-' : scope.row.contractDayAverage }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                    align="center">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.remainingContractDayAverage === null ? '-' : scope.row.remainingContractDayAverage }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="downGasPlace"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="yesterdayGasPlan"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="dayNum"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="dayNumReply"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="dayNumChange"
                    align="center">
                </el-table-column>
                <el-table-column
                    align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.status === 3">
                      {{ scope.row.dayNumChangeReply }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="desc"
                    align="center">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="月度合同日均量">
          </el-table-column>
          <el-table-column
              align="center"
              label="剩余合同日均量">
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="输气站场">
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="昨日交割量">
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="日指定量">
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="批复量">
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="变更量">
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="变更批复量">
          </el-table-column>
          <el-table-column
              prop="compCode"
              align="center"
              label="备注">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="replySubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import topMenu from "../../components/topMenu/topMenu";
import api from '/src/http/api';
import exportApi from '/src/components/export/export'
import mergeTableRow from '/src/components/mergeTableRow/reply'
import dateFormater from "../../components/dateFormater/dateFormater";
import innerTable from "./innerTable";
import innerChangeTable from "./innerChangeTable";

export default {
  name: "replyV2",
  mixins: [exportApi, mergeTableRow, dateFormater],
  data: function () {
    return {
      browerTime:0,
      timer:null,
      tab: 0, //0：计划量  1：变更量
      selectCompList: [],
      replyTable: [],
      selectForm: {
        compCode: '0',
        status: '1' //-1：全部，0:未创建，1：已上报未审批，2：已上报已审批，3已变更未审批，4：已变更已审批
      },
      dialogTableVisible: false,
      dialogTable: {
        list: []
      },
      replySubmitData: [],
      replyTableKey: Math.random(),
    }
  },

  created() {
    window.zhuge.track('导航页-气量调配-进入用气批复页面',{'页面名称':'用气批复页面'})
    this.resetSelection();
    this.getSelectCompList();
    this.getData();
  },
  mounted() {
    this.getBrowerTime()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.zhuge.track('气量调配-用气批复页面停留时长',{'用气批复页停留时长':this.browerTime})
  },
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom
    },
    // 日计划批复选项卡中：动态计算底部合计行 批复量 的合计值（用户修改文本框中数据时，合计行批复值动态改变）
    getDayNumReply() {
      let sum = 0
      let data = this.replyTable
      for(let i=0; i<data.length;i++) {
        if(data[i].toBeApprovedVO===null) {
          continue
        }
        let gasPlaceList = data[i].toBeApprovedVO.toBeApprovedDownGasPlaceVOList
        for(let j=0;j<gasPlaceList.length;j++) {
          // 如果需要累加的值为-或null，则路过累加运算
          if(gasPlaceList[j].dayNumReply === '-' || gasPlaceList[j].dayNumReply === null) {
            continue
          }
          sum += parseFloat(gasPlaceList[j].dayNumReply)
        }
      }
      return sum.toFixed(4)
    },
    // 日变更批复选项卡：动态计算底部合计行 变更批复量 的合计值（用户修改文本框中数据时，合计行批复值动态改变）
    getDayNumChangeReply() {
      let sum = 0
      let data = this.replyTable
      for(let i=0; i<data.length;i++) {
        if(data[i].toBeApprovedVO===null) {
          continue
        }
        let gasPlaceList = data[i].toBeApprovedVO.toBeApprovedDownGasPlaceVOList
        for(let j=0;j<gasPlaceList.length;j++) {
          // 如果需要累加的值为-或null，则路过累加运算
          if(gasPlaceList[j].dayNumChangeReply === '-' || gasPlaceList[j].dayNumChangeReply === null || gasPlaceList[j].dayNumChangeReply === "") {
            continue
          }
          sum += parseFloat(gasPlaceList[j].dayNumChangeReply)
        }
      }
      return sum.toFixed(4)
    }        
  },

  watch:  {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if(n && o) {
          this.resetSelection();
          this.getSelectCompList();
          this.getData()
        }
      }
    }
  },

  methods: {
    getBrowerTime() {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    },
    getData: function () {
      let params = {
        xaReig: this.curComCode,
        compCode: this.selectForm.compCode,
        status: this.selectForm.status,
        time: this.getFormatDate(Date.now()),
        listFlag: this.tab.toString()
      }
      this.replyTableKey = Math.random()
      api.reply.getDateList(params).then(res => {
        if(res) {
          this.replyTable = res[0]
          // 在toBeApprovedVO中增加status属性，用此属性判断当前记录是否可执行驳回操作
          this.replyTable.map(item => {
            if(item.toBeApprovedVO !== null) {
              item.toBeApprovedVO.status4 = this.getRejectStatus(item.toBeApprovedVO.toBeApprovedDownGasPlaceVOList)[0]
              item.toBeApprovedVO.statusOther = this.getRejectStatus(item.toBeApprovedVO.toBeApprovedDownGasPlaceVOList)[1]
              item.toBeApprovedVO.statusOfDayNumChange = this.getRejectStatus(item.toBeApprovedVO.toBeApprovedDownGasPlaceVOList)[2]
            }
          })
          console.log('reply table:', this.replyTable)
          for (let v of this.replyTable) {
            if(v.toBeApprovedVO !== null) {
              for (let vv of v.toBeApprovedVO.toBeApprovedDownGasPlaceVOList) {
                this.$set(vv, 'selectFormStatus', this.selectForm.status)
              }
            }
          }
          this.$refs.replyTable.clearSelection()
          this.$refs.replyTable.toggleAllSelection()
          this.$refs.replyChangeTable.clearSelection()
          this.$refs.replyChangeTable.toggleAllSelection()
        }
      })
    },
    // 根据toBeApprovedVO.toBeApprovedDownGasPlaceVOList中记录的status判断是否可驳回，如果此列表中记录均为3，则可驳回（true），否则不可驳回（false）
    getRejectStatus(obj) {
      let flagOfStatus4 = true
      let flagOfStatusOther = true
      let flagOfDayNumChange = true
      obj.map(item => {
        if(item.status === 4) {
          flagOfStatus4 = false
        }
        if(item.status === 0 || item.status === 1 || item.status === 2) {
          flagOfStatusOther = false
        }
        if(item.dayNumChange === null) {
          flagOfDayNumChange = false
        }
      })
      return [flagOfStatus4, flagOfStatusOther, flagOfDayNumChange]
    },  
    getSelectCompList: function () {
      api.reply.getCompList({
        xaReig: this.curComCode
      }).then(res => {
        if(res) {
          this.selectCompList = res[0]
        }
      })
    },

    tabClick: function (tabValue) {
      if(tabValue === this.tab) {
        return false;
      }
      this.tab = tabValue;
      this.resetSelection();
      this.getData();
    },

    resetSelection: function () {
      this.selectForm = {
        compCode: '0',
        status: this.tab === 0 ? '1' : '3'
      }
    },

    selectCompChange: function () {
      this.getData();
    },

    selectStatusChange: function () {
      this.getData();
    },
    arraySpanMethod: function ({ columnIndex }) {
      if(columnIndex === 1) {
        return {
          rowspan: 1,
          colspan: 8
        };
      }
      if(columnIndex > 1) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },
    arraySpanMethodChange: function ({ columnIndex }) {
      if(columnIndex === 1) {
        return {
          rowspan: 1,
          colspan: 10
        };
      }
      if(columnIndex > 1 && columnIndex < 11) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },
    // 暂存事件
    handleTemporaryStorage() {
      this.dialogTable.list = this.$refs.replyTable.selection
      console.log('selection112:', this.dialogTable.list)
      if(this.dialogTable.list.length === 0) {
        this.$message({
          message: '没有要暂存的数据！',
          type: 'warning'
        });
        return false
      }     
      let data = [];
      for (let v of this.dialogTable.list) {
        for (let vv of v.toBeApprovedVO.toBeApprovedDownGasPlaceVOList) {
          let l = {
            id: vv.id,
            cpmoCopTxt: v.toBeApprovedVO.compCodeTxt
          }
          if(this.tab === 0) {
            l.dayNumReply = vv.dayNumReply
          }
          data.push(l)
        }
      }
      // console.log('data112:', data);return
      api.reply.temporaryStorage(data).then((res) => {
        if(res) {
          this.$message({
            message: '暂存成功',
            type: 'success',
            duration: 1000
          });
          this.getData();
        }
      })           

    },
    replyPop: function () {
      this.replySubmitData = []
      if(this.tab === 0) {
        this.dialogTable.list = this.$refs.replyTable.selection
      } else {
        this.dialogTable.list = this.$refs.replyChangeTable.selection
      }
      if(this.dialogTable.list.length === 0) {
        this.$message({
          message: '没有要批复的数据！',
          type: 'warning'
        });
        return false
      }
      this.dialogTableVisible = true
    },
    replySubmit: function () {
      let data = [];
      for (let v of this.dialogTable.list) {
        for (let vv of v.toBeApprovedVO.toBeApprovedDownGasPlaceVOList) {
          let l = {
            id: vv.id,
            cpmoCopTxt: v.toBeApprovedVO.compCodeTxt
          }
          if(this.tab === 0) {
            l.dayNumReply = vv.dayNumReply
          }
          if(this.tab === 1) {
            l.dayNumChangeReply = vv.dayNumChangeReply
          }
          data.push(l)
        }
      }
      api.reply.replySubmit(data).then((res) => {
        if(res) {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 1000
          });
          this.getData();
          this.dialogTableVisible = false
        }
      })
    },
    exportExcel: function () {
      let params = {
        xaReig: this.curComCode,
        compCode: this.selectForm.compCode,
        status: this.selectForm.status,
        time: this.getFormatDate(Date.now()),
        listFlag: this.tab.toString()
      }
      api.reply.export(params).then((res) => {
        this.download(res, 'xls', 'export')
      })
    },
    keyG: function () {
      return Math.random()
    },
    // 无变量量时的提示
    noneDayNumChangeTips() {
      this.$alert('暂无变更量，不能执行驳回操作！' , {
        confirmButtonText: '确定',
        showClose: false,
        type:'warning',
      })      
    },
    // 驳回操作
    handleRejectEvent(scope) {
      // 判断是否提交了变更量，如果未提交，则不允许执行驳回操作
      let flag = 0
      let ids = []
      scope.row.toBeApprovedVO.toBeApprovedDownGasPlaceVOList.map(item => {
        if(item.status !== 3) {
          flag = 1
          return false
        } else {
          ids.push(item.id)
        }
      })

      if(flag) {
        this.rejectStatus = false
        this.$alert('暂无变更量，不能执行驳回操作！' , {
          confirmButtonText: '确定',
          showClose: false,
          type:'warning',
        })
        return        
      } else {
        this.rejectStatus = true
      }
      // 驳回操作方法
      console.log('scope0000:', scope)
      const h = this.$createElement
      const name = scope.row.toBeApprovedVO.compCodeTxt
      let biangengliang
      // if(scope.row.toBeApprovedTotalVO.dayNumChange) {
      //   biangengliang = scope.row.toBeApprovedTotalVO.dayNumChange
      // } else {
      //   biangengliang = scope.row.toBeApprovedVO.toBeApprovedDownGasPlaceVOList[0]
      // }

      if(scope.row.toBeApprovedTotalVO === null) {
        biangengliang = scope.row.toBeApprovedVO.toBeApprovedDownGasPlaceVOList[0].dayNumChange
      } else {
        biangengliang = scope.row.toBeApprovedTotalVO.dayNumChange
      }      
      
        ids = ids.join(',')
        const params = {
          id: ids
        }
      this.$msgbox({
        title:'驳回操作',
        message: h('p', null, [
          h('span', null, '是否要驳回 '),
          h('span', {style: 'fontWeight: bold'}, `${name} `),
          h('span', null, '变更量 '),
          h('span', {style: 'fontWeight: bold'}, `${biangengliang} `),
          h('span', '万方？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if(action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            api.reply.reject(params).then(res => {
                done()
                instance.confirmButtonLoading = false
                this.getData()
            })
          } else {
            done()
          }
        }
      }).then(res => {
        this.$message({
          type: 'success',
          message: '驳回成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消驳回操作!'
        })
      })
    },
    // 当表格首列为复选框时，设置最后一行“合计”行复选框不可选
    handleColumnSelected(row) {
      if(row.toBeApprovedTotalVO) {
        if(row.toBeApprovedTotalVO.compCodeTxt === '合计') {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    }
  },

  components: {
    topMenu,
    innerTable,
    innerChangeTable
  },
}
</script>

<style scoped lang="scss">

.tab-title-wrapper {
    position: absolute;
    top: 52px;
    left: 30px;
    height: 48px;
    font-size: 26px;
  }
  .tab-title-wrapper span {
    display: inline-block;
    vertical-align: bottom;
    color: #ffffff;
    cursor: pointer;
  }
  .tab-active {
    font-size: 34px;
  }
  .select-wrapper {
    height: 40px;
    margin-top: 30px;
    padding: 0 30px;
    box-sizing: border-box;
  }
  .gas-page-com-wrapper {
    width: 158px;
    height: 40px;
    background: #567DB9;
    opacity: 1;
    border-radius: 24px;
    float: right;
    margin-right: 20px;
    overflow: hidden;
  }
  .gas-reply-title-wapper {
    height: 76px;
    line-height: 76px;
    padding: 0 30px;
    box-sizing: border-box;
    border-bottom: 1px solid #E5E5E5;
  }
  .gas-reply-title {
    display: inline-block;
    width: 700px;
    float: left;
    font-size: 24px;
    font-weight: 500;
    color: #2C3E50;
    opacity: 1;
  }
  .demo-form-inline {
    /deep/ .el-form-item__label {
      color: #ffffff;
      font-size: 16px;
    }

    /deep/ .gas-el-select .el-input__suffix {
      border-left: none;
      right: 12px;
    }
  }
  .banner-card-wrapper {
    height: calc(100% - 200px);
  }
  .danwei {
    height: 70px;
    line-height: 70px;
    font-size: 14px;
    padding: 0 30px;
    box-sizing: border-box;
    color: #505356;
  }
  .gas-reply-table-wrapper {
    padding: 0 30px;
    padding-bottom: 30px;
    height: calc(100% - 146px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .custom-table {
    background-color: transparent !important;
    /deep/ tr {
      background-color: transparent !important;
    }
  }

  .custom-button {
    float: right;
    margin-left: 30px;
    margin-top: 20px;
  }
  .reply-btn {
    color: #ffffff !important;
    background: rgba(15, 178, 171, 1) !important;
  }
  .reject {
    color: #aaa;
    :hover {
      color: #409EFF;
    }
  }
</style>