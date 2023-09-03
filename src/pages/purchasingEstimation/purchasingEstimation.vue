<template>
  <div class="gas-page-bg">
    <top-menu :date-picker-show="false"
              title="气源采购方案"></top-menu>
    <div class="gas-pu-container">
      <div class="gas-tab-card-header">
        <div :class="{'tab-card-header': true, 'tab-card-header-active': toggleTabIndex === 0}"
             @click="toggleTabHandler(0)">自定义采购方案
        </div>
        <div :class="{'tab-card-header': true, 'tab-card-header-active': toggleTabIndex === 1}"
             @click="toggleTabHandler(1)">方案列表
        </div>
      </div>
      <div class="gas-tab-card-wrapper" v-show="toggleTabIndex === 0">
        <div class="gas-tab-card">
          <div class="gas-tab-title">
            采购详情
            <el-button round plain type="success" @click="createPlan()" class="custom-button" >生成方案</el-button>
            <el-button round plain type="success" @click="resetStore()" class="custom-button" >重置缓存</el-button>
            <el-button round plain type="success" @click="exportExcel()" class="custom-button" icon="el-icon-upload2" >导出</el-button>
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
          </p>
          <el-table
              :data="fpTable.list"
              v-loading="loading"
              stripe
              ref="fpTable"
              row-key="rowkey"
              header-row-class-name="custom-table-header"
              header-cell-class-name="custom-table-header-cell"
              cell-class-name="custom-table-cell"
              class="custom-table-r"
              style="width: calc(100% - 60px); margin-top: 20px;margin-left: 30px;">
            <el-table-column
                prop="name"
                label="供应商"
                width="200">
            </el-table-column>
            <el-table-column
                align="center"
                label="4月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-show="scope.row.edit">
                  <el-input class="reply-input"
                            v-model="scope.row['4']"
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-show="!scope.row.edit">
                  {{ scope.row['4'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="5月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-show="scope.row.edit">
                  <el-input class="reply-input"
                            v-model="scope.row['5']"
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-show="!scope.row.edit">
                  {{ scope.row['5'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="6月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-show="scope.row.edit">
                  <el-input class="reply-input"
                            v-model="scope.row['6']"
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-show="!scope.row.edit">
                  {{ scope.row['6'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="7月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-show="scope.row.edit">
                  <el-input class="reply-input"
                            v-model="scope.row['7']"
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-show="!scope.row.edit">
                  {{ scope.row['7'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="8月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-show="scope.row.edit">
                  <el-input class="reply-input"
                            v-model="scope.row['8']"
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-show="!scope.row.edit">
                  {{ scope.row['8'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="9月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-show="scope.row.edit">
                  <el-input class="reply-input"
                            v-model="scope.row['9']"
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-show="!scope.row.edit">
                  {{ scope.row['9'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="10月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-show="scope.row.edit">
                  <el-input class="reply-input"
                            v-model="scope.row['10']"
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-show="!scope.row.edit">
                  {{ scope.row['10'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="11月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-show="scope.row.edit">
                  <el-input class="reply-input"
                            v-model="scope.row['11']"
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-show="!scope.row.edit">
                  {{ scope.row['11'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="12月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-show="scope.row.edit">
                  <el-input class="reply-input"
                            v-model="scope.row['12']"
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-show="!scope.row.edit">
                  {{ scope.row['12'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="1月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-show="scope.row.edit">
                  <el-input class="reply-input"
                            v-model="scope.row['1']"
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-show="!scope.row.edit">
                  {{ scope.row['1'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="2月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-show="scope.row.edit">
                  <el-input class="reply-input"
                            v-model="scope.row['2']"
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-show="!scope.row.edit">
                  {{ scope.row['2'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="3月">
              <template slot-scope="scope">
                <div class="reply-input-wrapper" v-show="scope.row.edit">
                  <el-input class="reply-input"
                            v-model="scope.row['3']"
                            placeholder="请输入内容"></el-input>
                </div>
                <div v-show="!scope.row.edit">
                  {{ scope.row['3'] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="sum"
              label="合计"
            ></el-table-column>
            <el-table-column
                align="center"
                label="操作">
              <template slot-scope="scope">
                <el-button type="success"
                           v-if="scope.row.canEdit"
                           @click="totalHandle(scope.row)"
                           round
                           size="small" plain class="deriveBtn custom-button">
                  {{ scope.row.editText ? '完成' : '编辑' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="gas-tab-card-wrapper" v-show="toggleTabIndex === 1">
        <div class="gas-tab-title">
          方案列表
        </div>
        <div v-for="plan in planList" :key="plan.id" class="gas-plan-wrapper">
          <div class="plan-title">{{plan.name}}</div>
          <div :style="{'height': planItemHeight, 'overflow': 'hidden'}">
            <div class="plan-item" v-for="(v, i) in plan.suppliers" :key="i">
              <div class="item-name">{{ v.supplier_name }}</div>
              <div class="item-value">：{{ parseFloat(v.accounted*100) + '%' }}</div>
            </div>
          </div>
          <div class="price" style="margin-top: 15px !important;">综合单价：{{ plan.comprehensive_price }}元/方</div>
          <div class="cost">总成本：{{plan.comprehensive_price_sum}}元</div>
        </div>
      </div>
    </div>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="submitBtnDisabled" @click="createPlanHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import topMenu from "../../components/topMenu/topMenu";
import api from '/src/http/api';
import exportApi from '/src/components/export/export'

export default {
  name: 'purchasingEstimation',
  mixins: [exportApi],
  data: function () {
    return {
      toggleTabIndex: 0,
      loading: false,
      descTable: {
        list: []
      },
      fpTable: {
        list: [
          {
            id: 1,
            name: '合计',
            edit: false,
            editText: false,
            canEdit: true,
            rowkey: Math.random(),
            total: 0,
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
      dialogVisible: false,
      planName: '',
      planText: {},
      planList: [],
      submitBtnDisabled: false,
      planItemHeight: 0
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
  watch:  {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if(n && o) {
          this.getData()
        }
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData: function () {
      switch (this.toggleTabIndex) {
        case 0:
          this.getStore();
          break;
        case 1:
          this.getPlan();
          break;
      }
    },
    getStore: function () {
      this.loading = true
      api.purchasingEstimation.getStore({
        creator: this.$store.getters.loginName
      }).then(res => {
        this.loading = false
        if(res && res.length > 0) {
          this.setTable(res[0].planText.total, res[0].planText.suppliers)
          this.planText = res[0]['planText']
        }
      })
    },
    toggleTabHandler: function (index) {
      this.toggleTabIndex = index
      this.getData()
    },
    setTable: function (descTableList, fpTableList) {
      this.descTable.list = descTableList;
      for (let index in fpTableList) {
        if(index === '0') {
          this.fpTable.list[0]['sum'] = fpTableList[0]['sum']
          for (let i = 1; i <= 12; i++) {
            this.fpTable.list[0][i.toString()] = fpTableList[0][i.toString()]
          }
        } else {
          let key = parseInt(index)
          fpTableList[index].name = fpTableList[index].supplier_name
          fpTableList[index].edit = false
          fpTableList[index].canEdit = true
          fpTableList[index].rowkey = Math.random()
          for (let v of fpTableList[index].child) {
            v.rowkey = Math.random()
          }
          fpTableList[index].children = fpTableList[index].child
          this.$set(this.fpTable.list, key, fpTableList[index])
        }

      }
    },
    getPlan: function () {
      api.purchasingEstimation.getPlan({
        xaReig: this.curComCode
      }).then(res => {
        if(res) {
          this.planList = res
          let l = 0;
          for (let v of this.planList) {
            if(v.suppliers && v.suppliers.length > l) {
              l = v.suppliers.length
            }
          }
          this.planItemHeight = l*29 + 'px'
        }
      })
    },
    totalHandle: function (row) {
      let params = {
        creator: this.$store.getters.loginName,
        year: new Date().getFullYear()
      }
      if (row.name === '合计') {
        if (row.edit) {
          let data = {}
          for (let i = 1; i < 13; i++) {
            data[i.toString()] = {
              total: row[i.toString()]
            }
          }
          this.loading = true
          api.purchasingEstimation.getDataByTotal(params, data).then(res => {
            this.loading = false
            if (res.length > 0) {
              this.planText = res[0]
              this.setTable(res[0].total, res[0].suppliers)
              this.descTable.list = res[0].total
            }
          })
        }
        row.edit = !row.edit
        row.editText = !row.editText
      } else {
        if (!row.editText) {
          this.$refs['fpTable'].toggleRowExpansion(row, true)
          for (let v of row.children) {
            if (v.key === 'supplier_total') {
              this.$set(v, 'edit', true)
            }
          }
          row.editText = !row.editText
        } else {
          let data = {};
          for (let i = 1; i < 13; i++) {
            data[i] = {
              total: this.fpTable.list[0][i],
              supplier_code: row.supplier_code,
              supplier_total: row.children[0][i]
            }
          }
          this.loading = true
          api.purchasingEstimation.getDataByTotalAgain(params, data).then(res => {
            this.loading = false
            if (res.length > 0) {
              this.planText = res[0]
              this.setTable(res[0].total, res[0].suppliers)
            }
          })
        }
      }
    },
    createPlan: function () {
      this.dialogVisible = true
    },
    createPlanHandle: function () {
      if(this.planName === '') {
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
      api.purchasingEstimation.createPlan(data).then(res => {
        if(res) {
          this.planName = ''
          this.dialogVisible = false
          this.submitBtnDisabled = false
        }
      })
    },
    resetStore: function () {
      let params = {
        creator: this.$store.getters.loginName
      }
      api.purchasingEstimation.resetStore(params).then(res => {
        if(res) {
          this.$message({
            message: '重置成功',
            type: 'success',
            duration: 1000
          });
          this.descTable.list = []
          this.fpTable.list = [
            {
              id: 1,
              name: '合计',
              edit: false,
              editText: false,
              canEdit: true,
              rowkey: Math.random(),
              total: 0,
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
        creator: this.$store.getters.loginName
      }
      api.purchasingEstimation.exportStore(params).then((res) => {
        this.download(res, 'xls', 'export')
      })
    }
  },
  components: {
    topMenu
  },
}
</script>

<style scoped>
.gas-pu-container {
  width: calc(100% - 60px);
  margin-left: 30px;
  margin-top: 50px;
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

.gas-tab-title {
  height: 50px;
  font-size: 19px;
  font-weight: 500;
  line-height: 50px;
  color: #2C3E50;
  opacity: 1;
  margin-left: 30px;
  width: calc(100% - 60px);
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
.cost{
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
.item-value{
  width: 100px;
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  font-size: 16px;
}
.custom-button {
  float: right;
  margin-right: 0px;
  margin-left: 20px;
  margin-top: 5px;
}
</style>