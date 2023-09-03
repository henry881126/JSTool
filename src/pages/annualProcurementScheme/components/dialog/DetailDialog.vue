<template>
  <div class="container">
      <el-dialog
        :visible.sync="visible"
        :width="'1040px'"
      >
        <div slot="title" class="dialog-title-wrapper">
            <span class="title">{{ this.$parent.detailDialogTitle || '' }}</span>
            <span class="unit">(单位：万方)</span>
            <span class="subtitle">夏冬供气比【{{ rate }}】</span>
        </div>
        <div>
            <el-table
                :data="customDialogList"
                header-row-class-name="custom-table-header"
                header-cell-class-name="custom-table-header-cell"
                cell-class-name="custom-table-cell"
                class="custom-table-n"   
                border
            >
                <el-table-column prop="nameA" label="名称" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="4" label="4月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div class="pr24">{{ scope.row["4"] }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="5" label="5月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div class="pr24">{{ scope.row["5"]}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="6" label="6月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div class="pr24">{{ scope.row['6'] }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="7" label="7月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div class="pr24">{{ scope.row['7'] }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="8" label="8月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div class="pr24">{{ scope.row['8'] }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="9" label="9月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div class="pr24">{{ scope.row['9'] }}</div>
                    </template>
                </el-table-column>                    
                <el-table-column prop="10" label="10月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div class="pr24">{{ scope.row['10'] }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="nameB" label="" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="11" label="11月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div class="pr24">{{ scope.row['11'] }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="12" label="12月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div class="pr24">{{ scope.row['12'] }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="1" label="1月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div class="pr24">{{ scope.row['1'] }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="2" label="2月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div class="pr24">{{ scope.row['2'] }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="3" label="3月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div class="pr24">{{ scope.row['3'] }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="vSum" label="合计" align="right" min-width="90"></el-table-column>
            </el-table>
        </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
    props: {
        customDialogList: {
            type: Array,
            default: () => []
        },
        // 夏冬供气比
        rate: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            visible: false,
        }
    }
}
</script>

<style lang='scss' scoped>
.container {
    /deep/.el-dialog__header {
        padding-left: 0;
        padding-right: 0;
        padding-bottom: 20px;
    }
    /deep/.el-dialog__body {
        padding-top: 0;
    }
    .dialog-title-wrapper {
        border-bottom: 1px solid #DCDFE6;
        padding-left: 20px;
        padding-bottom: 12px;
        .title {
            color: #303133;
            font-size: 18px;
            font-weight: 500;
        }
        .unit {
            color: #606266;
            font-size: 14px;
            font-weight: 400;
        }
        .subtitle {
            color: #E6A23C;
            font-size: 14px;
            font-weight: 500;
            background: #FCF6EC;
            border-radius: 14px;
            padding: 5px 10px;
            margin-left:10px;
        }
    }
    /deep/ .el-table th .cell {
        padding: 0px 10px!important;
    }
    /deep/ .el-table__row .cell {
        padding: 0 10px!important;
    }
    /deep/ .el-table__row:last-child {
        background: #F5F7FA;
        .cell {
            color: #303133;
            font-size: 14px;
            font-weight: 500;
        }
    }    
    /* /deep/ .el-table__footer-wrapper .cell {
        color: #303133;
        font-size: 14px;
        font-weight: 500;
        padding: 0 14px!important;
    } */
}
</style>