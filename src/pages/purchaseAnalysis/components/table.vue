<template>
    <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        stripe
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="tableData.dataList"
        style="width: 100%"
        height="95%"
        v-if="render"
    >
        <!-- 动态生成列 -->
        <el-table-column
            v-for="(item, index) in tableData.theadList"
            :key="'a' + index"
            :label="item.label"
            :prop="item.prop"
        >
            <el-table-column
                v-for="(el, idx) in item.children"
                :key="'b' + idx"
                :label="el.label"
                :prop="el.prop"
            >
                <template slot-scope="{ row }">
                    {{ row[el.prop] || '-' }}
                </template>
                <el-table-column
                    v-for="(m, i) in el.children"
                    :key="'c' + i"
                    :label="m.label"
                    :prop="m.prop"
                >
                    <template slot-scope="{ row }">
                        {{ row[m.prop] || '-' }}
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table-column>
        <!-- 动态生成列结束 -->
    </el-table>
</template>

<script>
//import x from ''
export default {
    name: 'tableCom',
    components: {},
    props: {
        activedTagIndex: {
            default: '1'
        },
        selectCompCode: {},
        startTime: {},
        endTime: {},
        dateType: {}
    },
    data() {
        return {
            render: true,
            tableData: {
                theadList: [],
                dataList: []
            },
            paramsObj: {
                activedTagIndex: this.activedTagIndex,
                selectCompCode: this.selectCompCode,
                startTime: this.startTime,
                endTime: this.endTime,
                dateType: this.dateType
            },
            loading: true
        };
    },
    computed: {
        watchManyData() {
            let {
                selectCompCode,
                startTime,
                endTime,
                activedTagIndex,
                dateType
            } = this;
            return {
                selectCompCode,
                startTime,
                endTime,
                activedTagIndex,
                dateType
            };
        }
    },
    watch: {
        watchManyData: {
            handler() {
                this.getTableData();
            }
        }
    },
    created() {},
    mounted() {
        this.getTableData();
    },
    methods: {
        getTableData() {
            this.tableData = {};
            this.loading = true;
            let params = {
                compCode: this.selectCompCode,
                endTime: this.endTime,
                endType: this.activedTagIndex,
                startTime: this.startTime,
                timeUnit: this.dateType // day 1 week 2 month 3 year 4
            };
            //防止参数为空就发送请求
            if (
                params.compCode === '' ||
                params.startTime === '' ||
                params.endTime === ''
            ) {
                return false;
            }
            this.$api.getPurchaseTableData(params).then(res => {
                if (res.resultCode === 0) {
                    this.tableData = res.data;
                    this.loading = false;
                    this.render = false;
                    this.$nextTick(() => {
                        this.render = true;
                    });
                } else {
                    // this.$message({
                    //     message: res.message,
                    //     type: 'error'
                    // });
                    this.loading = false;
                }
            });
        }
    }
};
</script>

<style lang='scss' scoped>
/deep/ .el-table thead.is-group th {
    background: #f2f4f8;
}
/deep/ .el-table__body {
    tr.el-table__row--striped {
        td {
            background: #f2f4f8;
        }
    }
}
</style>