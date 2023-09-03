<template>
  <div class="gas-page-bg">
    <div class="top-bag">
      <div class="gas-header">
        <top-menu :date-picker-show="false"
                  title="天然气输配(调度)智慧管理平台"></top-menu>
        <div class="breadcrumb-wrapper">
          <el-breadcrumb>
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>客户管理</el-breadcrumb-item>
            <el-breadcrumb-item>气量对账单</el-breadcrumb-item>
            <el-breadcrumb-item>日气量对账</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

      </div>
      <div class="top-content">
        <div class="top-content-header">
          <div class="title">日气量对账</div>
          <el-date-picker v-model="listtime"
                          type="date"
                          placeholder="选择日期时间"
                          @change="demoSerch"
                          :clearable="false"
                          class="datePick"
                          :picker-options="pickOptions"
                          format="yyyy/MM/dd">
          </el-date-picker>
          <el-input class="elinputSelect"
                    v-model="time1"
                    placeholder="请选择偏差率"
                    @focus="slectFocus"
                    :show-tooltip="false"
                    style="color: #dcdfe6"
                    ref="chooseProjectName"
                    clearable>
          </el-input>
          <el-select v-model="userBr"
                     multiple
                     clearable
                     @change="handleChangeEvent"
                     ref="userBref"
                     class="userBref"
                     placeholder="客户标签"
                     collapse-tags>
            <el-option-group v-for="group in this.selectBox"
                             :key="group.id"
                             :label="group.dicValue">
              <el-option v-for="item in group.children"
                         :key="item.id"
                         :label="item.dicValue"
                         :value="item.id">
              </el-option>
            </el-option-group>
          </el-select>
          <!-- </div> -->
          <div class="one"
               v-show="hidden">
            <div class="slider-dialog">
              <el-slider v-model="value"
                         range
                         show-stops
                         :max="10"
                         :min="-10"
                         :step="5"
                         :format-tooltip="formatTooltip"
                         @change="handleTooltipChangeEvent">
              </el-slider>
            </div>
            <div class="slider-footer">
              <a @click="handleSliderClearEvent">清空</a>
              <button @click="handleTooltipChangeEvent1('c')">确认</button>
            </div>
          </div>
        </div>
        <div class="top-content-nav">
          <p>{{ this.listtime |listtime2 }}</p>
          <button class="el-icon-upload2"
                  @click="Listexport()">导出</button>
        </div>
        <el-table :data="tableData"
                  border
                  style="width: 100%;"
                  header-row-class-name="custom-table-header"
                  header-cell-class-name="custom-table-header-cell"
                  cell-class-name="custom-table-cell"
                  class="custom-table-n my-custom-table">
          <el-table-column fixed
                           prop=""
                           :show-overflow-tooltip="true"
                           label="客户名称"
                           min-width="300">
            <template slot-scope="scope">
              <!-- <span :style="{color:scope.row.contractTypeName==='代输'?'#F67777':scope.row.contractTypeName==='直销'?'#58AAFF':scope.row.contractTypeName==='多种'?'#F67E7E':'#EAB565',}"
                    class="scopeType">{{scope.row.contractTypeName}}</span> {{scope.row.customerName}} -->
              <el-tag v-if="scope.row.contractTypeName === '代输'"
                      class="tag-daishu">代输</el-tag>
              <el-tag v-else-if="scope.row.contractTypeName === '直销'"
                      class="tag-sanfang">直销</el-tag>
              <el-tag v-else-if="scope.row.contractTypeName === '代销'"
                      class="tag-zhixiao">代销</el-tag>
              <el-tag v-else
                      class="tag-daishu">多种</el-tag>
              <span>{{scope.row.customerName}}</span>
              <!-- <span>{{scope.row.name}}</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="sysDate"
                           label="交割时间"
                           width="150">
          </el-table-column>
          <el-table-column prop="gasNum"
                           label="指定量(方)"
                           align="right"
                           header-align="right"
                           width="150">
          </el-table-column>
          <el-table-column prop="fillGasNum"
                           label="补提量(方)"
                           align="right"
                           header-align="right"
                           width="150">
          </el-table-column>
          <el-table-column prop="replayGasNum"
                           label="批复量(方)"
                           align="right"
                           header-align="right"
                           width="150">
          </el-table-column>
          <el-table-column prop="gasNumDay"
                           label="提取量(方)"
                           align="right"
                           header-align="right"
                           width="150">
          </el-table-column>
          <el-table-column label="偏差量(方)"
                           align="right"
                           header-align="right"
                           width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.deviationDay > 0"
                    style="color:#F56C6C">+{{
                scope.row.deviationDay
              }}</span>
              <span v-if="scope.row.deviationDay == 0"
                    style="color:#303133">{{
                scope.row.deviationDay
              }}</span>
              <span v-if="scope.row.deviationDay < 0"
                    style="color:#67C23A">{{
                scope.row.deviationDay
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deviationRateDay"
                           label="偏差率"
                           align="right"
                           header-align="right"
                           width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.deviationDay > 0"
                    style="color: #F56C6C">
                <span v-if="scope.row.deviationRateDay===0">{{ scope.row.deviationRateDay }}%</span>
                <span v-else>+{{ scope.row.deviationRateDay }}%</span>
              </span>
              <span v-if="scope.row.deviationDay === 0"
                    style="color: #303133">
                <span v-if="scope.row.deviationRateDay===0">{{ scope.row.deviationRateDay }}%</span>
              </span>
              <span v-if="scope.row.deviationDay < 0"
                    style="color: #67C23A">
                <span v-if="scope.row.deviationRateDay===0">{{ scope.row.deviationRateDay }}%</span>
                <span v-else>{{ scope.row.deviationRateDay }}%</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="customerLabels"
                           label="客户标签"
                           fixed="right"
                           min-width="190">
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.customerLabels.length===0">-</div>
                <el-tooltip effect="light"
                            v-else-if="scope.row.customerLabels.length>0"
                            popper-class="customer_tips_labels"
                            placement="bottom">
                  <div slot="content">
                    <div v-if="scope.row.customerLabels[1].length>0">
                      <span class="tagBox"
                            v-for="item in scope.row.customerLabels[1]"
                            :key="item">{{item}}</span>
                    </div>
                  </div>
                  <div class="showTag"><span>{{scope.row.customerLabels[0]}}</span><span v-if="scope.row.customerLabels[1].length>0">+{{scope.row.customerLabels[1].length}}</span></div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right"
                           prop="status"
                           label="操作"
                           width="140">
            <template slot-scope="scope">
              <div v-if="scope.row.contractTypeName !== '直销'">
                <el-button v-if="scope.row.status === 1"
                           type="text"
                           @click="handleSendClick(scope.row)">确认</el-button>
                <el-button v-if="scope.row.status === 2"
                           type="text"
                           style="color: #ddd; cursor: default">已确认</el-button>
                <el-button v-if="scope.row.status === 3"
                           type="text"
                           style="color: #ddd; cursor: default">已发送</el-button>
                <span class="userSpan">|</span>
                <el-button type="text"
                           size="small"
                           @click="userUpdate(scope.row)">详情</el-button>
              </div>
              <div v-if="scope.row.contractTypeName === '直销'">-</div>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible"
                   min-width="515"
                   :title="dialogTitle"
                   class="dialog">
          <div class="dialog-top">
            发送至 <span>{{ detailData.customerName }}</span>
          </div>

          <div class="dialog-body">
            <div>
              <span class="label">批复量：</span><span>{{ detailData.replayGasNum }}(方)</span>
            </div>
            <div>
              <span class="label">提取量：</span><span>{{ detailData.gasNumDay }}(方)</span>
            </div>
            <div></div>
          </div>
          <div class="dialog-body">
            <div>
              <span class="label">是否超欠提：</span>
              <span :class="{
                    'normalTip':detailData.gasUsedStatus === '正常',
                    'overTip': detailData.gasUsedStatus === '超提',
                    'lessTip': detailData.gasUsedStatus === '欠提'
                  }">{{ detailData.gasUsedStatus }}</span>
            </div>
            <div>
              <span class="label">偏差量：</span>
              <span :class="{
                    'normal':detailData.gasUsedStatus === '正常',
                    'over': detailData.gasUsedStatus === '超提',
                    'less': detailData.gasUsedStatus === '欠提'
                  }">
                <span v-if="detailData.gasUsedStatus === '超提'">+</span>{{ detailData.deviationDay }}(方)</span>
            </div>
            <div style="">
              <span class="label">偏差率：</span>
              <span :class="{
                    'normal':detailData.gasUsedStatus === '正常',
                    'over': detailData.gasUsedStatus === '超提',
                    'less': detailData.gasUsedStatus === '欠提'
                  }">
                <span v-if="detailData.gasUsedStatus === '超提'">+</span>
                {{ detailData.deviationRateDay }}%</span>
            </div>
          </div>
          <el-row> </el-row>
          <!-- <div class="tips">
            <input id="checkbox"
                   @input="checkboxXz($event)"
                   type="checkbox" /><span><label for="checkbox">发送对账单通知给客户</label></span>
          </div> -->
          <!-- 发送只能发送昨天，其他时间禁用 -->
          <div class="tips">
            <el-checkbox class="checkbox"
                         @change="checkboxXz"
                         :disabled="sendFlag"
                         v-model="checked">发送对账单通知给客户</el-checkbox>
          </div>
          <span slot="footer"
                class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>

            <el-button type="primary"
                       v-if="!checked"
                       @click="detailSendList(false)">确 定</el-button>
            <el-button type="primary"
                       v-if="checked"
                       @click="detailSendList(true)">发 送</el-button>
          </span>
        </el-dialog>
        <!-- <el-pagination @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-size="pageSize"
                       :total="pageTotal"
                       background
                       layout="prev, pager, next"
                       class="custom-page-n">
        </el-pagination> -->
        <el-pagination background
                       class="custom-page-n"
                       style="marginTop:13px;"
                       layout="total, slot, prev, pager, next, sizes"
                       :current-page="currentPage"
                       :page-size="pageSize"
                       :page-sizes="[10,20,30]"
                       :total="pageTotal"
                       @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"><span style="color:#606266;">当前{{this.tableData.length}}条</span></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import topMenu from "../../components/topMenu/topMenu2";
import api from "../../http/api";
import exportApi from "../../components/export/export.vue";
import axios from "axios";
// import { buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin } from '@/utils/mixin'
// import { max, min } from 'moment';
let data = {
  listtime: '',
  userBr: '',
  value: '',
}
export default {
  mixins: [exportApi],
  data () {
    return {
      timer: null,
      browerTime: 0,
      currentTime: '',
      sendFlag: false,//只有昨天可发送
      dialogTitle: '日对账单消息确认',
      checked: false,
      detailShow: false,
      selectoption: [],
      userBr: "",
      clearFlag: false,
      detailData: [],
      listtime: new Date() - 86400000,
      time1: "",
      dialogVisible: false,
      hidden: false,
      tableData: [],
      tableDataList: [],
      value: [-10, 10],
      pageSize: 10,
      pageTotal: 0,
      currentPage: 1,
      min: null,
      max: null,
      selectBox: [],
      a: [],
      pickOptions: {
        disabledDate (currentDate) {
          const oneDay = 24 * 60 * 60 * 1000
          return currentDate > new Date() - oneDay
        }
      }
    };
  },
  //点击切换城市刷新页面
  computed: {
    curCom () {
      return this.$store.getters.curCom;
    },
  },
  watch: {
    curCom () {
      this.volumemationList();
    },
    hidden (val) {
      if (!val) {
        setTimeout(() => {
          let dom = document.querySelectorAll('.el-tooltip__popper.is-dark');
          dom.forEach(item => {
            item.style.display = 'none'
          })
        }, 100);
      }
    },
    time1: {
      handler (newName) {
        if (newName === '') {
          this.clearFlag = true
          this.currentPage = 1
          this.value = [-10, 10]
          this.time1 = ''
        }
        this.volumemationList()
      },
      deep: true,
      immediate: false,
    },
  },
  filters: {
    listtime2 (Datedate) {
      let date = new Date(Datedate);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      const listtime = y + "年" + m + "月" + d + '日';
      return listtime;
    },
  },
  components: {
    topMenu,
  },
  activated () {
    console.log('进入对账单');
    window.zhuge.track('客户管理-进入对账单页面', { '页面名称': '对账单页面' })
    this.getBrowerTime()
  },
  deactivated () {
    clearInterval(this.timer)
    console.log('离开对账单', this.browerTime)
    window.zhuge.track('客户管理-对账单页面停留时长', { ['对账单页面停留时长']: this.browerTime })
  },
  created () {
    // 初始化偏差率
    this.clearFlag = true
    this.volumemationList()
    // 获取客户标签树
    this.userBrChange();
    this.currentTime = this.listtime
  },
  methods: {
    getBrowerTime () {
      this.timer = setInterval(() => {
        this.browerTime++
      }, 1000);
    },
    formatTime (Datedate) {
      let date = new Date(Datedate);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      const listtime = y + "/" + m + "/" + d;
      return listtime;
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.volumemationList()
    },
    checkboxXz (val) {
      if (val) {
        this.dialogTitle = '日对账单消息发送'
      } else {
        this.dialogTitle = '日对账单消息确认'
      }
      this.detailShow = val
    },
    //取消
    handleSliderClearEvent () {
      this.value = [-10, 10];
      this.time1 = "";
      this.min = -10;
      this.max = 10;
      this.clearFlag = true
      this.currentPage = 1
      this.volumemationList('clear');
      this.hidden = false;
    },
    //change事件
    handleChangeEvent (val) {
      this.a = val.join(",");
      this.currentPage = 1;
      this.volumemationList()
    },
    userBrChange (val) {
      let data = {
        dicKey: "smart_customer_label",
      };
      axios({
        url: "dongwan/dictionary/getTree",
        params: data,
      }).then((res) => {
        this.selectBox = res.data.data;
      });
    },
    //时间方法
    listtimeOne (Datedate) {
      let date = new Date(Datedate);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      const listtime = y + "/" + m + "/" + d;
      return listtime;
    },
    //时间选择框内容改变触发
    demoSerch (time) {
      // 选择的时间小于currentTime，发送禁用
      let dayNum = (this.currentTime - new Date(time).getTime()) / 86400000
      if (dayNum > 1) {
        this.sendFlag = true
      } else {
        this.sendFlag = false
      }
      this.listtime = time;
      this.volumemationList();
    },
    //弹框发送按钮
    detailSendList (type) {
      let data = {
        id: this.detailData.id,
        type: type,
      };
      api.volumeList.messageSend(data).then((res) => {
        this.dialogVisible = false;
        this.volumemationList();
        if (res) {
          this.$message({
            type: "success",
            message: "发送成功",
          });
        }
      });
    },
    handleTooltipChangeEvent1 (val) {
      this.hidden = false;
      this.handleTooltipChangeEvent(val)
    },
    //
    handleTooltipChangeEvent (val) {
      this.clearFlag = false
      this.currentPage = 1
      if (val === "c") {
        this.min = this.value[0];
        this.max = this.value[1];

      } else {
        this.min = val[0];
        this.max = val[1];
      }

      if (this.min === 10) {
        this.max = null
        this.time1 = `偏差>${this.min}%`;
      } else if (this.max === -10) {
        this.min = null
        this.time1 = `偏差<${this.max}%`;
      } else {
        this.time1 = `偏差>${this.min}% - 偏差<${this.max}%`;
      }
      this.volumemationList('sure');
    },
    //分页
    handleCurrentChange (val) {
      this.currentPage = val;
      this.volumemationList();
    },
    //滑块返回值
    formatTooltip (val) {
      return "<" + val + "%";
    },
    //查询日度气量对账单明细
    serchmationList () {
      let data = {
        id: this.listData.id,
      };
      api.volumeList.serchmationList(data).then((res) => {
        this.tableDataList = res;
      });
    },

    //获取焦点显示
    slectFocus () {
      this.hidden = true;
    },
    //失去焦点隐藏
    slectBlur () {
      this.hidden = false;
      this.currentPage = 1;
    },
    //气量对账单列表导出
    Listexport () {
      let data = {
        code: this.$store.getters.curCom,
        //登陆返回level
        orgLevel: this.$store.getters.curComInfo.orgLevel,
        time: this.listtimeOne(this.listtime),
        current: this.currentPage,
        pageSize: this.pageSize,
        labelIds: this.userBr.join(','),
        minDeviationDay: this.min,
        maxDeviationDay: this.max,
      };
      if (!this.time1) {
        delete data.minDeviationDay
        delete data.maxDeviationDay
      }
      api.volumeList.mationListexport(data).then((res) => {
        this.download(res, "xlsx", "日气量对账单");
      });
    },
    //气量对账单列表
    volumemationList () {
      let data = {
        code: this.$store.getters.curCom,
        //登陆返回level
        orgLevel: this.$store.getters.curComInfo.orgLevel,
        time: this.listtimeOne(this.listtime),
        current: this.currentPage,
        labelIds: this.a,
        pageSize: this.pageSize,
        minDeviationDay: this.min,
        maxDeviationDay: this.max,
      };

      if (this.clearFlag) {
        delete data.minDeviationDay
        delete data.maxDeviationDay
      }
      api.volumeList.volumemationList(data).then((res) => {
        this.pageSize = res[0].pageSize;
        this.pageTotal = res[0].total;
        this.tableData = res[0].list;
        const enumData = [
          {
            value: 1,
            label: "正常",
          },
          {
            value: 2,
            label: "超提",
          },
          { value: 3, label: "欠提" },
        ];
        for (let i in this.tableData) {
          for (let item1 of enumData) {
            if (this.tableData[i].gasUsedStatus === item1.value) {
              this.tableData[i].gasUsedStatus = item1.label;
            }
          }
        }
        //判断数据为空用——代替
        for (let i in this.tableData) {
          for (let j in this.tableData[i]) {
            let tmp = this.tableData[i][j];
            if (!tmp && typeof tmp != "undefined" && tmp != 0) {
              this.tableData[i][j] = "一";
            }
          }
        }
        this.tableData.forEach(item => {
          if (item.customerLabels && item.customerLabels.length > 1) {
            let arr = []
            arr[0] = item.customerLabels[0]
            let others = item.customerLabels.splice(1)
            others.sort((a, b) => {
              if (a.length > b.length) {
                return -1;
              } else if (a.length < b.length) {
                return 1;
              } else {
                return 0;
              }
            })
            item.customerLabels = [arr[0], others]
          } else if (item.customerLabels && item.customerLabels.length === 1) {
            item.customerLabels = [item.customerLabels[0], []]
          } else {
            item.customerLabels = []
          }

        })
      });
    },

    //确认按钮
    handleSendClick (row) {
      this.checked = false
      this.detailData = row;
      this.dialogVisible = true;
    },
    //详情按钮
    userUpdate (row) {
      row.start = this.min
      row.end = this.max
      const userBrLabel = this.userBr
      row.label = { ...userBrLabel }
      this.$router.push({
        path: "/gasVolumeDetail",
        query: {
          sendFlag: !this.sendFlag,
          ...row
        },
      });
    },
  },

};
</script>
<style lang="scss">
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: 0;
}
// .el-tooltip__popper.is-light {
//   width: 306px;
//   padding: 20px;
//   box-sizing: border-box;
// }
// .el-tooltip__popper.is-light div {
//   width: 100%;
//   display: flex;
//   justify-content: space-around;
//   flex-wrap: wrap;
// }
// .el-tooltip__popper.is-light[x-placement^="top"] .popper__arrow {
//   border-top-color: transparent;
// }
// .el-tooltip__popper.is-light[x-placement^="bottom"] .popper__arrow {
//   border-top-color: transparent;
// }
.customer_tips_labels {
  border: 1px solid #dcdfe6 !important;
  box-shadow: 0px 6px 18px rgba(86, 125, 185, 0.14);
}
.customer_tips_labels .popper__arrow {
  border-bottom-color: #dcdfe6 !important;
}
</style>
<style scoped lang="scss">
.breadcrumb-wrapper {
  height: 41px;
  padding: 10px 0 10px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  /deep/ .el-breadcrumb__item:last-child > .el-breadcrumb__inner {
    color: #fff;
  }
  /deep/ .el-breadcrumb__inner {
    color: rgba(255, 255, 255, 0.5);
  }
}
.my-custom-table /deep/ thead th div {
  color: #606266;
}
.my-custom-table /deep/ .el-table_1_column_9 {
  border-left: 1px solid #dcdfe6;
}
.showTag {
  display: flex;
  justify-content: center;
}
.showTag span {
  display: inline-block;
  height: 24px;
  line-height: 24px;
  padding: 0 10px;
  border-radius: 12px;
  border: 1px solid #47a87d;
  background: #edf6f2;
  color: #47a87d;
}
.showTag span:nth-of-type(2) {
  margin-left: 5px;
}
.tagBox {
  display: inline-block;
  height: 24px;
  line-height: 22px;
  padding: 0 10px;
  border-radius: 12px;
  border: 1px solid #47a87d;
  background: #edf6f2;
  color: #47a87d;
  white-space: nowrap;
  margin: 0 5px;
  margin-bottom: 5px;
}
.dialog /deep/ .el-dialog__header {
  display: flex;
  justify-content: space-between;
}
.dialog /deep/ .el-dialog__body {
  padding-top: 20px;
}
.dialog-top {
  font-weight: 500 !important;
  color: #303133;
  font-size: 14px;
  margin-bottom: 20px;
  text-align-last: left;
}
.dialog-body {
  display: flex;
}
.dialog-body > div {
  flex: 1;
}
.normalTip,
.normal {
  font-size: 14px;
  color: #303133;
}
.overTip {
  display: inline-block;
  width: 48px;
  height: 24px;
  line-height: 23px;
  border-radius: 12px;
  text-align: center;
  background-color: #fef0f0;
  box-sizing: border-box;
  border: 1px solid #f56c6c;
  color: #f56c6c;
}
.over {
  color: #f56c6c;
}
.lessTip {
  display: inline-block;
  width: 48px;
  height: 24px;
  line-height: 23px;
  border-radius: 12px;
  text-align: center;
  background-color: #f0f9eb;
  box-sizing: border-box;
  border: 1px solid #67c23a;
  color: #67c23a;
}
.less {
  color: #67c23a;
}
.tips {
  height: 21px;
  display: flex;
  align-items: center;
  margin-top: 30px;
}
.tips input {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
.tips span {
  font-size: 14px;
  color: #303133;
}
.tips input[type="checkbox"] {
  margin-right: 5px;
  cursor: pointer;
  font-size: 14px;
  width: 16px;
  height: 16px;
  position: relative;
  background-color: #409eff;
}

.tips input[type="checkbox"]:after {
  position: absolute;
  width: 16px;
  height: 16px;
  top: 0;
  content: " ";

  color: #fff;
  display: inline-block;
  visibility: visible;
  // padding: 0px 3px;
  // border-radius: 3px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  button {
    width: 58px;
    height: 32px;
    border-radius: 16px;
    text-align: center;
    line-height: 31px;
    padding: 0;
    font-size: 14px;
    &:nth-child(1) {
      background-color: #f5f7fa;
    }
    &:nth-child(2) {
      background-color: #47a87d;
      border: 0;
    }
  }
}
.dialog-body .label {
  margin-bottom: 21px;
  font-size: 14px;
  color: #606266;
  display: inline-block;
  width: 7em;
  text-align: right;
}
.tag-daishu {
  width: 49px;
  height: 24px;
  line-height: 22px;
  background: #fef0f0;
  color: #f56c6c;
  font-size: 14px;
  border: 1px solid #f56c6c;
  border-radius: 12px;
  margin-right: 10px;
  text-align: center;
}
.tag-zhixiao {
  width: 49px;
  height: 24px;
  line-height: 22px;
  background: #fcf6ec;
  color: #e6a23c;
  border: 1px solid #e6a23c;
  font-size: 14px;
  border-radius: 12px;
  margin-right: 10px;
  text-align: center;
}
.tag-sanfang {
  width: 49px;
  height: 24px;
  line-height: 22px;
  background: #ecf5ff;
  color: #409eff;
  font-size: 14px;
  border: 1px solid #409eff;
  border-radius: 12px;
  margin-right: 10px;
  text-align: center;
}
/deep/.scopeType {
  text-align: center;
  display: inline-block;
  width: 48px;
  height: 24px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 12px;
}
/deep/.slider-dialog {
  width: 240px;
}
/deep/.slider-dialog .el-slider {
  display: flex;
  justify-content: center;
}
/deep/.slider-dialog .el-slider__runway {
  width: 220px;
}
/deep/.el-input__inner {
  height: 32px;
  min-width: 100px;
  border: 1px solid #ccc;
}
.gas-page-bg {
  min-width: auto;
}

/deep/.el-input--suffix .el-input__inner {
  color: #303133 !important;
}

/deep/.el-input > .el-input {
  border-radius: 25px;
}

.top-content-header /deep/.el-input .el-input__inner {
  border-radius: 16px;
  background-color: #f5f7fa;
}
/deep/.el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #fff;
}
.el-input .el-input__inner {
  background-color: #dcdfe6;
}
.top-content .top-content-header .el-input .el-input__inner {
  border: 1px solid #dcdfe6;
}
.el-input .el-input__suffix {
  border: 0;
}
/deep/ .el-input .el-input__suffix {
  border-left: none; // 去除原全局样式中的左侧竖线
}
.slider-footer {
  float: right;
  height: 44px;
  line-height: 44px;
  a {
    text-decoration: none;
    color: #47a87d;
    font-size: 12px;
    cursor: pointer;
  }
  button {
    width: 44px;
    height: 24px;
    outline: none;
    border-radius: 12px;
    color: #000;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    margin: 0 10px;
    font-size: 12px;
    cursor: pointer;
  }
}
.el-button--text {
  font-size: 16px;
}
.slider-dialog {
  width: 240px;
  height: 46px;
  border-bottom: 1px solid #dcdfe6;
}
.el-slider__marks-text {
  font-size: 10px;
}
.el-slider__runway {
  width: 220px;
  margin-left: 10px;
}
.el-slider__bar {
  background-color: #47a87d;
}
.one {
  position: absolute;
  width: 240px;
  height: 91px;
  background-color: #ffffff;
  left: 354px;
  top: 158px;
  z-index: 10;
  border-radius: 4px;
  box-shadow: 5px 5px 10px gray;
}
.custom-page-n {
  float: left;
}
.top-content .top-content-header .el-input--prefix .el-input__inner {
  background-color: #f5f7fa;
}
.el-dialog {
  margin-top: 35vh !important;
  .dialog-top {
    font-weight: 500;
    color: #303133;
    font-size: 14px;
    margin-bottom: 20px;
    text-align-last: left;
  }
  .dialog-content {
    width: 100%;
    display: flex;
    div {
      width: 35%;
      text-align: left;
      display: flex;

      i {
        display: inline-block;
        width: 80px;
        text-align: right;
        font-style: normal;
        &:nth-child(2) {
          text-align: left;
        }
      }
      span {
        display: inline-block;
        width: px;
        text-align: left;
      }
    }
  }
  .dialog-content-list {
    height: 40px;
    line-height: 40px;
    width: 100%;
    box-sizing: border-box;
    div {
      width: 33%;
      text-align: left;
      float: left;
    }
    i {
      display: inline-block;
      width: 80px;
      text-align: right;
      font-style: normal;
    }
    span {
      display: inline-block;
      text-align: left;
    }
  }
}
.userSpan {
  padding: 0 5px;
  color: #409eff;
}
.el-dialog .el-dialog__header .el-dialog__title {
  padding: 0;
  float: left;
  margin-left: -5px;
  margin-top: -3px;
  color: #5e73a7;
}
.el-dialog__wrapper {
  background-color: rgba(22, 47, 96, 0.5);
}
.userList {
}
.top-content {
  border-radius: 4px;
  box-sizing: border-box;
  padding: 20px;
  width: 97.5%;
  padding-bottom: 61px;
  background-color: #fff;
  margin-left: 20px;
  text-align: center;

  .top-content-header {
    display: flex;
    align-items: center;
    height: 40px;
    margin-bottom: 10px;
    font-size: 18px;
  }
  .top-content-header > .title {
    font-size: 18px;
    color: #303133;
    text-align: left;
    margin-right: 30px;
    font-weight: bold;
  }
  .datePick {
    width: 180px;
    min-width: 180px;
    height: 32px;
    margin-right: 15px;
  }
  .datePick /deep/ .el-input__prefix {
    top: -4px;
  }
  .elinputSelect {
    width: 180px;
    min-width: 180px;
    height: 32px;
    margin-right: 15px;
  }
  .elinputSelect /deep/ .el-input__suffix {
    top: -4px;
  }
  .userBref {
    min-width: 180px;
    height: 32px;
    margin-right: 15px;
  }
  .userBref /deep/ .el-input .el-input__suffix {
    top: 4px;
  }
  .userBref /deep/ .el-input .el-input__suffix .el-icon-arrow-up.is-reverse {
    transform: translateY(-8px);
  }
  .top-content-nav {
    display: flex;
    justify-content: space-between;
    p {
      font-size: 16px;
      font-weight: 500 !important;
      color: #303133;
    }
    button {
      width: 79px;
      height: 32px;
      background-color: #47a87d;
      outline: none;
      border: 0;
      color: #fff;
      border-radius: 25px;
      cursor: pointer;
    }
  }
}
</style>