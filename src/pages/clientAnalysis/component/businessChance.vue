<template>
  <div class="business-risk">
    <el-row>
      <el-col :span="17">
        <p class="business-title">风险识别</p>
      </el-col>
      <!-- <el-col :span="7">
        <p class="business-title">建议</p>
      </el-col> -->
    </el-row>
    <div class="table-box">
      <el-table :data="tableData"
                :show-header="false"
                :cell-class-name="cellClassName"
                :span-method="spanMethod">
        <!-- <el-table-column prop="name" min-width="11%"></el-table-column> -->
        <el-table-column prop="things"
                         min-width="64.8%">
          <template slot-scope="scoped">
            <ul>
              <li class="name-box">{{scoped.row.name}}</li>
              <li v-for="(thing,index) in scoped.row.things"
                  :key="index"
                  :class="getLiClass(scoped.$index,index)">
                <span> {{thing}} </span>

              </li>
            </ul>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="line"
                         min-width="6%">
          <div class="splitLine"></div>
        </el-table-column>
        <el-table-column prop="suggest"
                         min-width="29.2%"></el-table-column> -->
      </el-table>

    </div>

  </div>
</template>
<script>
export default {
  name: 'businessRisk',
  data() {
    return {
      // rowspanData:[],
      tableData: [
        {
          id: 1,
          name: '失信/诉讼/行政处罚',
          things: [
            '董事长张波被限制高消费',
            '知识产权纠纷，赔偿 350 元',
            '安全违规停产 7 天，排污未达标罚款 1200 万元',
          ],
          line: '这是线条',
          suggest: '支付方式由分期支付调整为预期',
        },
        {
          id: 2,
          name: '生产经营状况',
          things: ['年用气增长率一 5 %', '6 一 7 月份非正常减产 32 . 5 %'],
          suggest: '关注客户用能成本，提供节能服务',
          line: '这是线条',
        },
        {
          id: 3,
          name: '企业外迁',
          things: ['计划 25 年迁出浙江，已投资， 5 亿在贵州建厂'],
          suggest: '寻求在云南继续合作供气',
          line: '这是线条',
        },
        {
          id: 4,
          name: '股权变更',
          things: ['XX 集团出资 20 亿收购该公司 30 ％股权，成为最大股东'],
          suggest: '开展集团化合作',
          line: '这是线条',
        },
      ],
    }
  },
  watch: {},
  methods: {
    getLiClass($index, index) {
      const newIndex = this.tableData.reduce((prev, curr, i) => {
        $index > i && (prev += curr.things.length)
        return prev
      }, 0)
      console.log('newIndex=', newIndex)
      let totalIndex = newIndex + index
      if (totalIndex % 2) {
        return 'evenLi'
      } else {
        return 'oddLi'
      }
    },
    // 行类名

    // 单元格类名
    cellClassName({ column }) {
      return `${column.property}Cell`
    },

    // 合并单元格
    spanMethod({ column, rowIndex }) {
      if (column.property === 'line') {
        if (rowIndex === 0) {
          return {
            colspan: 1,
            rowspan: this.tableData.length,
          }
        } else {
          return {
            colspan: 1,
            rowspan: 0,
          }
        }
      }
      return {
        colspan: 1,
        rowspan: 1,
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.business-risk {
  .business-title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #3f5896;
    margin: 10px 10px 9px 0;
  }
}

/deep/.el-table {
  background: transparent;
  tr,
  th,
  td,
  .cell {
    border: none;
    padding: 0;
    margin: 0;
  }
  &::before {
    display: none;
  }
  tr {
    &:hover > td {
      background: #fff;
    }
    border-radius: 10px;
    &:nth-child(2n + 1) {
      .suggestCell {
        background: #f5f6f8;
      }
      // background: #F5F6F8;
      .name-box {
        border-radius: 10px;
        background: #dce6f9;
      }
    }
    &:nth-child(2n) {
      .suggestCell {
        background: #fff;
      }
      .name-box {
        border-radius: 10px;
        background: #eaf0fd;
      }
    }
    .lineCell {
      background: #fff;
      position: relative;
    }
  }
  td {
    background: #fff;
    ul {
      position: relative;
      line-height: 0;
      border-radius: 10px 0px 0px 10px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #505356;
      li:not(.name-box) {
        box-sizing: border-box;
        padding-left: 17%;
        border-radius: 10px 25px 25px 10px;
        height: 50px;
        line-height: 50px;

        span {
          padding-left: 25px;
        }
        // padding-left: 25px;
      }
      .evenLi {
        background: #fff;
      }
      .oddLi {
        background: #f2f4f8;
      }
      .name-box {
        position: absolute;
        top: 0;
        width: 17%;
        bottom: 0;
        left: 0;
        display: flex;
        // justify-content: center;
        padding-left: 8px;
        align-items: center;
      }
    }
  }
  .suggestCell {
      border-radius: 10px;
    padding-left: 37px;
  }
  .nameCell {
    padding-left: 8px;
  }
  .splitLine {
    width: 0px;
    position: absolute;
    left: 50%;
    top: 30px;
    bottom: 30px;
    border-left: 2px dashed #b6b8bd;
    transform: translateX(-50%);
  }
}
@media only screen and (max-width: 1460px) {
  .business-risk {
    
    .business-title {
      font-size: 16px;
      margin: 16px 0px 0px 8px;
      
    }
  }
  /deep/.el-table {
    td {
      ul {
        font-size: 14px;

        li:not(.name-box) {
          height: 38px;
          line-height: 38px;
        }
      }
    }

    .splitLine {
      top: 25px;
      bottom: 25px;
    }
  }
}
</style>