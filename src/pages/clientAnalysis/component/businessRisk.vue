<template>
  <div class="business-risk">
    <el-row>
      <el-col :span="17">
        <p class="business-title">风险识别</p>
      </el-col>
      <el-col :span="7"
              v-if="activeHead==='2'">
        <p class="business-title">建议</p>
      </el-col>
    </el-row>
    <div class="table-box">

      <el-table :data="tableData"
                :v-loading="loading"
                :show-header="false"
                :style="{width:activeHead==='2'?'100%':'63.8%'}"
                :cell-class-name="cellClassName"
                :span-method="spanMethod">
        <el-table-column prop="name"
                         min-width="12.5%"></el-table-column>
        <el-table-column prop="remark"
                         min-width="48%"
                         show-overflow-tooltip>

        </el-table-column>
        <template v-if="activeHead==='2'">
          <el-table-column prop="line"
                           min-width="5.5%">
            <div class="splitLine"></div>
          </el-table-column>
          <el-table-column prop="suggest"
                           min-width="34%"
                           show-overflow-tooltip>

          </el-table-column>

        </template>

      </el-table>

    </div>

  </div>
</template>
<script>
import api from '@/api/clientAnalyse'

export default {
  name: 'businessRisk',
  props: {
    activeHead: String,
  },
  data() {
    return {
      loading: false,
      tableData: [
        { name: '失信/诉讼/行政处罚' },
        { name: '生产经营状况 ' },
        { name: '股权变更' },
        { name: '企业外迁' },
      ],
      params: {},
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
    // 单元格类名
    cellClassName({ column, row }) {
      let name = `${column.property}Cell`
      if (column.property === 'name' && row.index % 2) {
        name += ' evenNameCell'
      }
      // if()
      return name
    },
    // 合并单元格
    spanMethod({ column, rowIndex }) {
      let obj = { colspan: 1, rowspan: 1 }
      const columnName = ['name']
      if (column.property === 'line') {
        if (rowIndex === 0) {
          obj = {
            colspan: 1,
            rowspan: this.tableData.length,
          }
        } else {
          obj = {
            colspan: 1,
            rowspan: 0,
          }
        }
      } else {
        if (columnName.indexOf(column.property) > -1) {
          obj = this.rowspanData.find((item) => rowIndex === item.minIndex) || {
            colspan: 1,
            rowspan: 0,
          }
        }
      }
      return obj
    },
    //
    async getOperatingStrategyList() {
      const { compCode, partner, distinct } = this.$route.query
      const params = {
        compCode,
        distinct,
        partner,
      }
      this.loading = true
      try {
        const res = await api.getOperatingStrategyList(params)
        this.loading = false
        if (res && res.resultCode === 0) {
          const { data } = res
          const obj = {
            lawsuit: '失信/诉讼/行政处罚',
            changeOfEquity: '生产经营状况 ',
            outsourcingFirms: '企业外迁',
            stateOfOperation: '企业外迁',
          }

          this.tableData = Object.keys(data).reduce((prev, key, index) => {
            const arr = data[key].map((item) => ({
              ...item,
              nameCode: key,
              name: obj[key],
              index,
            }))
            prev = [...prev, ...arr]
            return prev
          }, [])

          //   this.tableData = Object.keys(data).map((key) => {
          //     return {
          //       nameCode: key,
          //       name: obj[key],
          //       things: data[key],
          //     }
          //   })
        }
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    getRowspanData(data, columnName) {
      return data.reduce((prev, curr, index, arr) => {
        const { length } = prev
        // 第一项
        if (index === 0) {
          prev.push({
            minIndex: index,
            colspan: 1,
            rowspan: 1,
          })
        } else if (
          // 前一项id 和当前id不一致//存下colspan。
          arr[index - 1][columnName] !== curr[columnName] ||
          !curr[columnName]
        ) {
          prev[length - 1].rowspan = index - prev[length - 1].minIndex
          prev.push({
            minIndex: index,
            colspan: 1,
            rowspan: 1,
          })
        } else if (index === arr.length - 1) {
          //
          prev[length - 1].rowspan = index - prev[length - 1].minIndex + 1
        }
        return prev
      }, [])
    },
  },
  computed: {
    // tableData(){},
    rowspanData() {
      return this.getRowspanData(this.tableData, 'nameCode')
    },
  },
  created() {
    this.getOperatingStrategyList()
  },
}
</script>
<style lang="scss" scoped>
p {
  margin-block-start: 0em;
  margin-block-end: 0em;
}
.business-risk {
  padding-left: 18px;
  padding-right: 15px;
  .business-title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #3f5896;
    margin: 10px 0 10px 0;
  }
}
/deep/ .el-table {
  background: #fff;
  tr,
  td,
  th {
    // position: relative;
    padding: 0;
    border: none;
  }
  .cell {
    padding-left: 0;
  }
  tr:hover td {
    background: #fff;
  }
  &::before {
    display: none;
  }
  tr {
    height: 50px;
    &:nth-child(2n + 1):not(.lineCell):not(.nameCell),
    &:nth-child(2n + 1):hover td:not(.lineCell):not(.nameCell) {
      background: #f2f4f8;
      border-radius: 25px;
      .remarkCell::before {
        background: #f2f4f8;
      }
    }
  }
  td {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #505356;
  }
  .remarkCell::before {
    content: '\200B';
    position: absolute;
    width: 10px;
    // width: 20.4%;
    height: 100%;
    left: -10px;
    // transform: scaleX(0.2);
    // transform-origin: 100% 0;
    top: 0;
    z-index: 0;
  }
  td.nameCell{
    padding-left: 25px;
  }
  td.nameCell,
  tr:hover td.nameCell {
    background: #dce6f9;
    border-radius: 10px;
    z-index: 2;
  }
  td.evenNameCell,
  tr:hover td.evenNameCell,
  tr:nth-child(2n) td:nth-child(1) {
    background: #eaf0fd;
  }
  .remarkCell {
    border-radius: 0 25px 25px 0;
    padding-left: 25px;
    // z-index: 1;
  }
  .lineCell,
  tr:hover td.lineCell {
    background: #fff;
  }
  .suggestCell {
    border-radius: 25px;
    padding-left: 50px;
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
    padding-left: 8px;
    .business-title {
      font-size: 16px;
      margin: 16px 0 16px 0px;
    }
  }

  /deep/.el-table {
    tr {
      height: 38px;
      &:nth-child(2n + 1) {
        border-radius: 19px;
      }
    }
    td {
      font-size: 12px;
      &.nameCell {
        padding-left: 18px;
      }
      &.remarkCell {
        border-radius: 0 19px 19px 0;
        padding-left: 19px;
      }
      &.suggestCell {
        border-radius: 19px;
        padding-left: 38px;
      }
      &.splitLine {
        top: 25px;
        bottom: 25px;
      }
    }
  }
}
</style>