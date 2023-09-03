<template>
    <div class="day-connect-management gas-page-bg">
        <top-menu
                :date-picker-show="datePickerShow"
                title="用气上报"></top-menu>
      <el-date-picker
          :picker-options="pickerOptions"
          v-show="datePickerShow"
          v-model="dateArr"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="tDateChange"
          value-format="yyyy-MM-dd"
          :clearable="false"
          class="custom-datepicker">
      </el-date-picker>
        <div class="content-center">
            <div class="table-center">
                <div class="title">用气上报</div>
                <div class="tab-change">
                    <div class="asad">
                        <div class="grid-content bg-purple tab-left">
                            <div v-for="(item,index) in navList" :key="index" class="tabBtn"
                                 :class="{active: index === num }" @click="tab(index)">{{item}}
                            </div>
                        </div>
                        <div class="grid-content bg-purple-light tab-right" v-show="tipIsShow && num === 1">
                            <i class="el-icon-warning-outline"></i>
                            余额 <span>{{tipPrice.costResult}}</span> 万元，预计可用{{tipPrice.scheduledTime}}天，请及时充值。
                            <span class="close" @click="closeTip">×</span>
                        </div>
                    </div>
                    <div class="table-content">
                        <div class="table-top">
                            <div class="top-left" v-show="num === 0">{{ startTimeText + ' 8:00 - ' + endTimeText + ' 8:00'}}</div>
                            <div class="top-left" v-show="num === 1">{{ getFormatDate(dateArr[0], '/') + '-' + getFormatDate(dateArr[1], '/')}}</div>
                            <div class="top-right" v-show="num === 1">
                                <el-button type="primary" class="deriveBtn" :class="{deriveBtnT: true}" plain @click="exportRJJ()">
                                    <i class="el-icon-upload2"></i>导出
                                </el-button>
                            </div>
                        </div>
                        <div v-show="num === 0">
                            <el-table
                                stripe
                                    header-row-class-name="custom-table-header"
                                    header-cell-class-name="custom-table-header-cell"
                                    cell-class-name="custom-table-cell"
                                    class="custom-table-r"
                                    :data="replyTable.list"
                                    :span-method="objectSpanMethod">
                                <el-table-column
                                        align="center"
                                        label="日指定时间"
                                        width="150">
                                    <template slot-scope="scope">
                                        <span>{{getFormatDate(scope.row.reportTime, '/')}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="compCode"
                                        align="center"
                                        label="公司编码"
                                        width="130">
                                </el-table-column>
                                <el-table-column
                                        prop="compCodeTxt"
                                        align="center"
                                        label="公司名称"
                                        width="130">
                                </el-table-column>
                                <el-table-column
                                        prop="downGasPlace"
                                        align="center"
                                        label="下载点"
                                        width="130">
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="日指定量状态">
                                    <template slot-scope="scope">
                                        <div v-html=statusArry[scope.row.status]></div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center">
                                    <template slot="header">
                                      <div>日指定量 <br/>（万方）</div>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input
                                                v-if="scope.row.status === 0 && getFormatDate(scope.row.reportTime) === getFormatDate(Date.now() + 24*3600000)"
                                                placeholder="请输入内容"
                                                v-model="scope.row.dayNum"
                                                @change="specifiedSave(scope.row.id, scope.row.dayNum, scope.row.dayNumChange)"
                                                class="custom-input">
                                        </el-input>
                                        <span v-else>
                                            {{scope.row.dayNum}}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="dayNumReply"
                                        align="center">
                                  <template slot="header">
                                    <div>批复量 <br/>（万方）</div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                        align="center">
                                  <template slot="header">
                                    <div>变更量 <br/>（万方）</div>
                                  </template>
                                    <template slot-scope="scope">
                                        <el-input
                                                v-if="scope.row.status === 2 && getFormatDate(scope.row.reportTime) === getFormatDate(Date.now())"
                                                placeholder="请输入内容"
                                                v-model="scope.row.dayNumChange"
                                                @change="specifiedSave(scope.row.id, scope.row.dayNum, scope.row.dayNumChange)"
                                                class="custom-input">
                                        </el-input>
                                      <span v-else>
                                        {{scope.row.dayNumChange}}
                                      </span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="dayNumChangeReply"
                                        align="center">
                                  <template slot="header">
                                    <div>变更批复量 <br/>（万方）</div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="备注">
                                    <template slot-scope="scope">
                                        <div>
                                            <el-input class="reply-input"
                                                      v-model="scope.row.desc"
                                                      @change="saveDesc(scope.row.id, scope.row.desc)"
                                                      type="textarea" :rows="1" placeholder="请输入内容"></el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="success"
                                                   @click="rzdSubmit(scope.row.reportTime)"
                                                   round
                                                   :disabled="(scope.row.status !== 0 || getFormatDate(scope.row.reportTime) !== getFormatDate(Date.now() + 24*3600000)) && (scope.row.status !== 2 || getFormatDate(scope.row.reportTime) !== getFormatDate(Date.now()))"
                                                   size="small" plain class="deriveBtn custom-button">
                                            提交
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div v-show="num === 1">
                            <el-table
                                    :data="rTable.list"
                                    stripe
                                    header-row-class-name="custom-table-header"
                                    header-cell-class-name="custom-table-header-cell"
                                    cell-class-name="custom-table-cell"
                                    class="custom-table-r">
                                <el-table-column
                                        label="日交接时间"
                                        width="150"
                                        align="center">
                                  <template slot-scope="scope">
                                    <span>{{getFormatDate(scope.row.time, '/')}}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                        prop="compCode"
                                        label="公司编码"
                                        width="130"
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        prop="compCodeTxt"
                                        label="公司名称"
                                        width="130"
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        prop="dayNum"
                                        align="center">
                                  <template slot="header">
                                    <div>日指定量 <br/>（万方）</div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                        prop="gasNum"
                                        align="center">
                                  <template slot="header">
                                    <div>日交接量 <br/>（万方）</div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                        prop="gasPrice"
                                        align="center">
                                  <template slot="header">
                                    <div>采购单价 <br/>（元/方）</div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                        prop="gasCost"
                                        align="center">
                                  <template slot="header">
                                    <div>采购成本 <br/>（万元）</div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                        align="center">
                                  <template slot="header">
                                    <div>气款余额 <br/>（万元）</div>
                                  </template>
                                    <template slot-scope="scope">
                                        <span :class="{ balance: scope.row.status === 1}">{{scope.row.balancePrice}}</span>
                                    </template>
                                </el-table-column>
                              <el-table-column
                                  label="操作"
                                  align="center">
                                <template slot-scope="scope">
                                  <el-button type="success"
                                             @click="balancePriceConfirm(scope.row.id)"
                                             round
                                             :disabled="scope.row.status === 1"
                                             size="small" plain class="deriveBtn custom-button">
                                    确认
                                  </el-button>
                                </template>
                              </el-table-column>
                            </el-table>
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
  import mergeTableRow from '/src/components/mergeTableRow/reply'
  import exportApi from '/src/components/export/export'
  import dateFormater from "../../components/dateFormater/dateFormater";
  export default {
    mixins: [mergeTableRow, exportApi, dateFormater],
    data() {
      return {
        navList: ['日指定管理', '日交接管理'],
        num: 0,
        tipIsShow: false,//提示
        replyTable: {
          list: [],
          total: 0,
          pageSize: 15,
          current: 1
        },
        datePickerShow: false,
        rTable: {
          list: [],
          total: 0,
          pageSize: 15,
          current: 1
        },
        dateArr: [],
        pickerOptions: {
          disabledDate: (date) => {
            return !(Date.now() - new Date(date).getTime() > 0 && Date.now() - new Date(date).getTime() < 31*24*3600000)
          }
        },
        statusArry: {
          0: "<span style='color: #505356;'>未创建</span>",
          1: "<span style='color: #FF8948;'>新建后未审批</span>",
          2: "<span style='color: #505356;'>新建后已审批</span>",
          3: "<span style='color: #138496;'>变更后未审批</span>",
          4: "<span style='color: #505356;'>变更后已审批</span>",
        },
        tipPrice: {
          costResult: 0,
          scheduledTime: 0
        }
      }
    },
    computed: {
      startTimeText: function () {
        return this.getFormatDate(Date.now(), '/')
      },
      endTimeText: function () {
        return this.getFormatDate(Date.now()+24*3600000, '/')
      },
      curComCode: function () {
        return this.$store.getters.curCom
      }
    },
    components: {
      topMenu
    },

    watch:  {
      curComCode: {
        immediate: true,
        handler: function (n, o) {
          if(n && o && this.num === 1) {
            this.getRJGData();
            this.getData();
          }
        }
      }
    },
    methods: {
      getData: function() {
        let data = {
          compCode: this.curComCode,
          pageSize: this.replyTable.pageSize,
          current: 1,
          startTime:this.getFormatDate(Date.now()),
          endTime:this.getFormatDate(Date.now() + 24*3600000)
        };
        api.reportSys.getSpecifiedList(data).then(res => {
          if(res) {
            this.replyTable.list = res[0].list;
            this.replyTable.total = res[0].total
            console.log(this.replyTable)
          }
        })
      },
      getRJGData: function() {
        let params = {
          code: this.curComCode,
          startTime: this.dateArr[0],
          endTime: this.dateArr[1]
        };
        api.reportSys.dayDelivery(params).then((res) => {
          if(res.length > 0) {
            this.rTable.list = res
                console.log(this.rTable)
          }
        })
      },
      tab(index) {
        this.num = index
        if(index === 1) {
          this.datePickerShow = true
          this.getRJGData()
        } else {
          this.datePickerShow = false
          this.getData()
        }
      },
      showIndex(val) {
        console.log(val)
        this.tableData.forEach((item, index) => {
          if (val == index) {
            item.status = true
            console.log(item.status)
          }
        })
        this.status = true
      },
      closeTip() {
        this.tipIsShow = false
      },
      tDateChange: function (date) {
        this.dateArr[0] = this.getFormatDate(date[0]);
        this.dateArr[1] = this.getFormatDate(date[1]);
        if(this.num === 0) {
          this.getData();
        } else if (this.num === 1) {
          this.getRJGData()
        }
      },
      specifiedSave: function (id, dayNum, dayNumChange) {
        let data = {
          id: id,
          dayNum: dayNum ? parseInt(dayNum) : 0,
          dayNumChange: dayNumChange ? parseInt(dayNumChange) : 0
        }
        api.reportSys.specifiedSave(data).then(res => {
          if(res) {
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 1000
            });
            this.getData()
          }
        })
      },
      saveDesc: function (id, desc) {
        let params = {
          id: id,
          desc: desc
        }
        api.reportSys.saveDesc(params).then(res => {
          if(res) {
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 1000
            });
            this.getData()
          }
        })
      },
      rzdSubmit: function (reportTime) {
        let data = [];
        for (let k in this.replyTable.list) {
          if(this.replyTable.list[k]['reportTime'] === reportTime) {
            data.push({
              id: this.replyTable.list[k]['id'],
              dayNum: this.replyTable.list[k]['dayNum'],
              dayNumChange: this.replyTable.list[k]['dayNumChange']
            })
          }
        }
        api.reportSys.specifiedSubmit(data).then(res => {
          if(res) {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.getData()
          }
        })
      },
      exportRJJ: function () {
        let params = {
          code: this.curComCode,
          startTime: this.dateArr[0],
          endTime: this.dateArr[1]
        }
        api.reportSys.dayDeliveryExport(params).then(res => {
          this.download(res)
        })
      },
      rTablePageChange: function (page) {
        this.rTable.current = page;
        this.getRJGData()
      },
      balancePriceConfirm: function (id) {
        api.reportSys.confirmBalance({id: id}).then(res => {
          if(res) {
            this.$message({
              message: '已确认',
              type: 'success',
              duration: 1000
            });
            this.getRJGData();
          }
        })
      }
    },
    created() {
      this.dateArr = [this.getFormatDate(Date.now()), this.getFormatDate(Date.now())]
      api.reportSys.tipPrice({
        code: this.curComCode,
        time: this.getFormatDate(Date.now())
      }).then(res => {
        if(res.length > 0) {
          this.tipIsShow = true
          this.tipPrice.costResult = res[0].costResult
          this.tipPrice.scheduledTime = res[0].scheduledTime
        }
      })
      this.getData()
    }
  }

</script>

<style scoped lang="scss">
.custom-datepicker {
  background: #567db9;
  border-radius: 20px;
  border: none;
  color: #ffffff !important;
  position: absolute;
  top: 56px;
  left: 200px;
}
    .day-connect-management {
        .content-center {
            width: calc(100% - 60px);
            margin: 0 auto;
            margin-top: 30px;
            .header {
                padding: 50px 0;
                .herder-left {
                    display: flex;
                    .date-picker {
                        line-height: 65px;
                        border-radius: 20px;
                        background: #567DB9;
                        /deep/ .el-range-input {
                            background: #567DB9;
                        }
                    }
                    .title {
                        margin-right: 52px;
                        color: #ffffff;
                        font-size: 34px;
                        line-height: 48px;
                        letter-spacing: 3px;
                        opacity: 1;
                    }
                }
                .herder-right {
                    line-height: 30px;
                }

            }
            .table-center {
                background: #ffffff;
                border-radius: 10px;
                padding: 10px 0;
                .title {
                    height: 25px;
                    font-size: 18px;
                    font-family: Roboto-Medium;
                    line-height: 30px;
                    color: #2C3E50;
                    opacity: 1;
                    padding: 20px;
                    border-bottom: 1px solid #E5E5E5;
                }
                .tab-change {
                    padding: 20px 30px;
                    .asad {
                        display: flex;
                        justify-content: space-between;

                        .tab-left {
                            display: flex;
                            .tabBtn {
                                cursor: pointer;
                                padding: 10px 20px;
                                border-radius: 25px;
                                margin-right: 20px;
                                border: 1px solid #0FB2AB;
                                color: #0FB2AB;
                            }

                            .active {
                                color: #ffffff;
                                background: #0FB2AB;
                            }
                        }
                        .tab-right {
                            // height: 46px;
                            background: #FFF1EA;
                            border: 1px solid #FF523C;
                            opacity: 1;
                            border-radius: 100px;
                            padding: 10px 30px;
                            color: #FF523C;
                            span {
                                font-weight: 700;
                            }
                            .close {
                                cursor: pointer;
                                margin: 10px;
                                padding: 0 3px;
                              font-size: 20px;
                            }

                        }
                    }
                    .table-content {
                        .table-top {
                            padding: 23px 0;
                            display: flex;
                            justify-content: space-between;
                            .top-left {
                                font-size: 22px;
                                font-family: PingFang SC;
                                font-weight: 700;
                                line-height: 30px;
                                color: #2C3E50;
                                opacity: 1;
                                font-size: 16px;
                            }
                            .top-right {
                                .el-button {
                                    width: 114px;
                                    height: 46px;
                                    background: #FFFFFF;
                                    border: 1px solid #D2D2DC;
                                    opacity: 1;
                                    border-radius: 100px;
                                    font-family: PingFang SC;
                                    font-weight: 500;
                                    i {
                                        margin-right: 5px;
                                    }
                                }
                                .deriveBtn {
                                    color: #74788D;
                                }
                                .deriveBtnT {
                                    color: #0FB2AB;
                                    background: #E5F6F6;
                                    border: none;
                                }
                                .saveBtn {
                                    color: #74788D;
                                }

                                .submitBtn {
                                    color: #0FB2AB;
                                    background: #E5F6F6;
                                    border: none;
                                }

                            }
                        }
                    }

                }

            }
        }
    }
    .page-wrapper {
        height: 32px;
        margin-top: 20px;
    }
    .balance {
      color: #FF523C;
      margin-right: 5px;
    }
</style>
