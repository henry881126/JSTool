<template>
  <div>
    <el-table :show-header="false"
              :data="[data.toBeApprovedVO]"
              cell-class-name="custom-table-cell"
              :span-method="arraySpanMethod"
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
          prop="prop"
          align="center">
        <template slot-scope="scope">
          <el-table :show-header="false"
                    :data="scope.row.toBeApprovedDownGasPlaceVOList"
                    cell-class-name="custom-table-cell"
                    class="custom-table">
            <el-table-column
                prop="downGasPlace"
                align="center">
            </el-table-column>
            <el-table-column
                prop="yesterdayGasPlan"
                align="center">
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
                <div class="reply-input-wrapper">
                  <el-input class="reply-input"
                            v-if="scope.row.status === 3 && scope.row.selectFormStatus === '3'"
                            v-model="scope.row.dayNumChangeReply"
                            @input="dayNumChangeReplyChange()"
                            v-on:input="handleInputChange(scope)"
                            placeholder="请输入内容"></el-input>
                  <div v-else>
                    {{ scope.row.dayNumChangeReply === null ? '-' : scope.row.dayNumChangeReply }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center">
              <template slot-scope="scope">
                <div>
                  <el-input class="reply-input"
                            v-model="scope.row.desc"
                            @change="replyDescPut(scope.row.id, scope.row.desc)"
                            placeholder="请输入内容"></el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
          align="center">
      </el-table-column>
      <el-table-column
          align="center">
      </el-table-column>
      <el-table-column
          align="center">
      </el-table-column>
      <el-table-column
          align="center">
      </el-table-column>
      <el-table-column
          align="center">
      </el-table-column>
      <el-table-column
          align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from "../../http/api";
import * as mathjs from 'mathjs'
export default {
  name: "innerChangeTable",
  props: {
    data: Object,
    prop: String
  },

  created() {
    this.dayNumChangeReplyChange()
  },

  methods: {
    arraySpanMethod: function ({ columnIndex }) {
      if(columnIndex === 3) {
        return {
          rowspan: 1,
          colspan: 7
        };
      }
      if(columnIndex > 3) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },
    dayNumChangeReplyChange: function () {
      if(this.data.toBeApprovedVO.toBeApprovedDownGasPlaceVOList.length <= 1) {
        return
      }
      let dayNameReplyTotal = '-'
      for (let v of this.data.toBeApprovedVO.toBeApprovedDownGasPlaceVOList) {
        if(v.dayNumChangeReply == null) {
          continue
        } else if(dayNameReplyTotal === '-') {
          dayNameReplyTotal = 0
        }
        dayNameReplyTotal = mathjs.add(mathjs.bignumber(dayNameReplyTotal), mathjs.bignumber(parseFloat(v.dayNumChangeReply)))
      }
      this.data.toBeApprovedTotalVO.dayNumChangeReply = isNaN(dayNameReplyTotal) ? '-' : dayNameReplyTotal.toString()
    },
    replyDescPut: function (id, desc) {
      let data = {
        id: id,
        desc: desc
      }
      api.reply.replyDescPut(data).then((res) => {
        if(res) {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 1000
          })
        }
      })
    },
    handleInputChange(scope) {
      this.$nextTick(()=>{
        console.log('input121 $index',scope)
        let dayNumChangeReply = scope.row.dayNumChangeReply
        dayNumChangeReply = dayNumChangeReply.toString()
        if (dayNumChangeReply.match(/[^\d]/)) {
          dayNumChangeReply = dayNumChangeReply.replace(/[^\d.]/g, '') /* 如果输入的是非数字，则清空掉 */
          if(dayNumChangeReply.indexOf('.') != -1) {      
            dayNumChangeReply= dayNumChangeReply.slice(0,dayNumChangeReply.indexOf('.') + 5)          // 只保留4位小数
          }    
        } else {
            dayNumChangeReply = dayNumChangeReply && parseFloat(dayNumChangeReply)
        }
        scope.row.dayNumChangeReply = dayNumChangeReply       // 绑定数据
      })
    },     
  }
}
</script>

<style scoped lang="scss">
  .custom-table {
    background-color: transparent !important;
    /deep/ tr {
      background-color: transparent !important;
    }
  }
</style>