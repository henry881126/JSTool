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
                prop="dayNumReply"
                align="center">
              <template slot-scope="scope">
                <div class="reply-input-wrapper">
                  <el-input class="reply-input"
                            v-if="scope.row.status === 1 && scope.row.selectFormStatus === '1'"
                            v-model="scope.row.dayNumReply"
                            @input="dayNumReplyChange()"
                            placeholder="请输入内容">
                  </el-input>
                  <div v-else>
                    {{ scope.row.dayNumReply === null ? '-' : scope.row.dayNumReply }}
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
    </el-table>
  </div>
</template>

<script>
import api from "../../http/api";
import * as mathjs from 'mathjs'
export default {
  name: "innerTable",
  props: {
    data: Object,
    prop: String
  },

  created() {
    this.dayNumReplyChange()
  },

  methods: {
    arraySpanMethod: function ({ columnIndex }) {
      if(columnIndex === 3) {
        return {
          rowspan: 1,
          colspan: 5
        };
      }
      if(columnIndex > 3) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },
    dayNumReplyChange: function () {
      if(this.data.toBeApprovedVO.toBeApprovedDownGasPlaceVOList.length <= 1) {
        return
      }
      let dayNameReplyTotal = '-'
      for (let v of this.data.toBeApprovedVO.toBeApprovedDownGasPlaceVOList) {
        if(v.dayNumReply == null) {
          continue
        } else if(dayNameReplyTotal === '-') {
          dayNameReplyTotal = 0
        }
        dayNameReplyTotal = mathjs.add(mathjs.bignumber(dayNameReplyTotal), mathjs.bignumber(parseFloat(v.dayNumReply)))
      }
      this.data.toBeApprovedTotalVO.dayNumReply = isNaN(dayNameReplyTotal) ? '-' : dayNameReplyTotal.toString()
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