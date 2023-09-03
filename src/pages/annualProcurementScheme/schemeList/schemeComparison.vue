<template>
  <div class="container gas-page-bg">
    <TopMenu title="智慧分销" />
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>资源统筹</el-breadcrumb-item>
      <el-breadcrumb-item>年度采购方案</el-breadcrumb-item>
      <el-breadcrumb-item>方案列表</el-breadcrumb-item>
      </el-breadcrumb>          
    </div>
    <div class="content-wrapper">
        <div class="compare-card-wrapper">
            <div class="gas-tab-title">
                <div>
                    <span class="back-btn" @click="goBack"><i class="el-icon-back"></i>返回</span>
                    <el-divider direction="vertical"></el-divider>
                    <span class="scheme-compare">方案对比</span>
                </div>
                <el-button round size="small" type="primary" @click="exportCompare()" class="custom-button" icon="el-icon-download">导出</el-button>
            </div>
            <!-- table实现方案对比 -->
            <div class="table-wrapper" style="margin-top:22px;">
                <el-table :data="list" border :show-header="false">
                    <el-table-column prop="0" min-width="200"></el-table-column>
                    <el-table-column prop="1" width="184" align="right">
                        <template slot-scope="scope">
                            <div class="close-icon" v-show="scope.$index === 0 && scope.row['1']" @click="removeColumn(1, scope.row['1'])"><i class="el-icon-close"></i></div>
                            <div v-show="scope.$index === 0 && !scope.row['1']">
                                <el-select v-model="schemeNameArr[0]" placeholder="请选择" @change="handleSelectChangeEvent" value-key="id" :filterable="true" :remote="true" :remote-method="remoteMethod">
                                        <el-option v-for="item in schemeNameOptionsArr" :key="item.id" :label="item.name" :value="item" :disabled="item.disabled"></el-option>
                                </el-select>
                            </div>
                            <div>
                                <span v-if="scope.$index === 0">{{ scope.row['1'] }}</span>
                                <span v-else>{{ scope.row['1'] ? scope.row['1'] : '-' }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="2" width="184" align="right">
                        <template slot-scope="scope">
                            <div class="close-icon" v-show="scope.$index === 0 && scope.row['2']" @click="removeColumn(2, scope.row['2'])"><i class="el-icon-close"></i></div>
                            <div v-show="scope.$index === 0 && !scope.row['2']">
                                <el-select v-model="schemeNameArr[1]" placeholder="请选择" @change="handleSelectChangeEvent" value-key="id" :filterable="true" :remote="true" :remote-method="remoteMethod">
                                        <el-option v-for="item in schemeNameOptionsArr" :key="item.id" :label="item.name" :value="item" :disabled="item.disabled"></el-option>
                                </el-select>
                            </div>                            
                            <div>
                                <span v-if="scope.$index === 0">{{ scope.row['2'] }}</span>
                                <span v-else>{{ scope.row['2'] ? scope.row['2'] : '-' }}</span>
                            </div>
                        </template>                        
                    </el-table-column>
                    <el-table-column prop="3" width="184" align="right">
                        <template slot-scope="scope">
                            <div slot="header">
                                <div class="close-icon" v-show="scope.$index === 0 && scope.row['3']" @click="removeColumn(3, scope.row['3'])"><i class="el-icon-close"></i></div>
                                <div v-show="scope.$index === 0 && !scope.row['3']">
                                    <el-select v-model="schemeNameArr[2]" placeholder="请选择" @change="handleSelectChangeEvent" value-key="id" :filterable="true" :remote="true" :remote-method="remoteMethod">
                                        <el-option v-for="item in schemeNameOptionsArr" :key="item.id" :label="item.name" :value="item" :disabled="item.disabled"></el-option>
                                    </el-select>
                                </div>                                
                                <div>
                                    <span v-if="scope.$index === 0">{{ scope.row['3'] }}</span>
                                    <span v-else>{{ scope.row['3'] ? scope.row['3'] : '-' }}</span>
                                </div>
                            </div>
                        </template>                                  
                    </el-table-column>
                    <el-table-column prop="4" width="184" align="right">
                        <template slot-scope="scope">
                            <div slot="header">
                                <div class="close-icon" v-show="scope.$index === 0 && scope.row['4']" @click="removeColumn(4, scope.row['4'])"><i class="el-icon-close"></i></div>
                                <div v-show="scope.$index === 0 && !scope.row['4']">
                                    <el-select v-model="schemeNameArr[3]" placeholder="请选择" @change="handleSelectChangeEvent" value-key="id" :filterable="true" :remote="true" :remote-method="remoteMethod">
                                        <el-option v-for="item in schemeNameOptionsArr" :key="item.id" :label="item.name" :value="item" :disabled="item.disabled"></el-option>
                                    </el-select>
                                </div>                                
                                <div>
                                    <span v-if="scope.$index === 0">{{ scope.row['4'] }}</span>
                                    <span v-else>{{ scope.row['4'] ? scope.row['4'] : '-' }}</span>
                                </div>
                            </div>
                        </template>                                  
                    </el-table-column>
                    <el-table-column prop="5" width="184" align="right">
                        <template slot-scope="scope">
                            <div slot="header">
                                <div class="close-icon" v-show="scope.$index === 0 && scope.row['5']" @click="removeColumn(5, scope.row['5'])"><i class="el-icon-close"></i></div>
                                <div v-show="scope.$index === 0 && !scope.row['5']">
                                    <el-select v-model="schemeNameArr[4]" placeholder="请选择" @change="handleSelectChangeEvent" value-key="id" :filterable="true" :remote="true" :remote-method="remoteMethod">
                                        <el-option v-for="item in schemeNameOptionsArr" :key="item.id" :label="item.name" :value="item" :disabled="item.disabled"></el-option>
                                    </el-select>
                                </div>                                
                                <div>
                                    <span v-if="scope.$index === 0">{{ scope.row['5'] }}</span>
                                    <span v-else>{{ scope.row['5'] ? scope.row['5'] : '-' }}</span>
                                </div>
                            </div>
                        </template>                                  
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import TopMenu from '@components/topMenu/topMenu2'
import api from '@/http/api'
import exportApi from '/src/components/export/export'

export default {
    mixins: [exportApi],
    components: {
        TopMenu
    },
    data() {
        return {
            ids: '',
            list: [],
            schemeNameArr: [],    // 下拉框绑定值
            schemeNameOptionsArr: [],  // 下拉框option用
            sortBy: 'id',
            sortType: 'desc',
            keyword: '',    // 下拉框搜索内容
        }
    },
    async created() {
        this.ids = this.$route.params.ids.substring(1)
        this.getList()
        this.schemeNameOptionsArr = await this.getNewestSchemeList()    // 获取下拉框option用数据
    },
    methods: {
        getList() {
            api.purchasingEstimation.comparePlans({
                ids: this.ids
            }).then(res => {
                if(res) {
                    res.map(item => item.planText.total.splice(1, 1))   // 去除planText下total中的合计行
                    this.list = res
                    const arr = []
                    const headerArr = ['']
                    for(let i in res) {
                        arr.push(res[i]['planText']['total'][0])    // 表体数据（未处理前）
                        headerArr.push(res[i]['name'])  // 表头数据
                    }
                    // 表体数据（处理后：行列转置）
                    let resultArr = []
                    let comprehensive_price = ['综合价格(元/方)']
                    let cost_price = ['采购成本(万元)']
                    let not_heating_comprehensive_price = ['非采暖季价格(元/方)']
                    let heating_comprehensive_price = ['采暖季综合价格(元/方)']
                    let heating_not_residents_price = ['采暖季非居综合价格(元/方)']
                    let not_residents_price = ['全年非居综合价格(元/方)']                    
                    for(let i in arr) {
                        comprehensive_price.push(arr[i]['comprehensive_price'])
                        cost_price.push(arr[i]['cost_price'])
                        not_heating_comprehensive_price.push(arr[i]['not_heating_comprehensive_price'])
                        heating_comprehensive_price.push(arr[i]['heating_comprehensive_price'])
                        heating_not_residents_price.push(arr[i]['heating_not_residents_price'])
                        not_residents_price.push(arr[i]['not_residents_price'])
                    }
                    resultArr.push(comprehensive_price, cost_price, not_heating_comprehensive_price, heating_comprehensive_price, heating_not_residents_price, not_residents_price)
                    this.list = resultArr
                    this.list.unshift(headerArr)
                }
            })            
        },
        goBack() {
            this.$router.go(-1)
        },
        // 导出
        exportCompare () {
            api.purchasingEstimation.exportCompare({
                ids: this.ids
            }).then(res => {
                this.download(res, 'xls', 'export')
            })
        },
        // 列表首行X图表事件（移除列）----table布局用
        async removeColumn(columnIndex, schemeName) {
            this.keyword = schemeName
            this.schemeNameArr = [] // 下拉框恢复默认值
            // 移除列
            this.list.map(item => {
                item.splice(columnIndex, 1)
            })
            // 通过方案名称（schemeName）获取方案ID，从this.ids中移除此id，用于下拉框option启用、禁用状态
            const scheme = await this.getNewestSchemeList()
            const id = scheme[0]['id'].toString()
            const arr = this.ids.split(',').filter(item => item !== id)
            this.ids = arr.join(',')
            this.setSelectOptionStatus()    // 更新下拉框option状态
        },
        // 下拉框change事件
        async handleSelectChangeEvent(item) {
            this.schemeNameArr = []
            this.ids += ',' + item.id   // 连接id，导出入参
            // 获取方案数据
            const res = await this.getSchemeItem(item.id)
            this.list[1].push(res.comprehensive_price)
            this.list[2].push(res.cost_price)
            this.list[3].push(res.not_heating_comprehensive_price)
            this.list[4].push(res.heating_comprehensive_price)
            this.list[5].push(res.heating_not_residents_price)
            this.list[6].push(res.not_residents_price)
            this.setSelectOptionStatus()    // 更新下拉框option状态
        },      
        // 获取最新10条方案列表，下拉框中使用
        getNewestSchemeList(name = '') {
            let params = {
                xaReig: this.$store.getters.curCom,
                name: this.keyword || name,
                pageNum: 1,
                pageSize: 10,
                orderByColumn: this.sortBy,
                isAsc: this.sortType
            }
            return new Promise((resolve) => api.purchasingEstimation.getPlans(params).then(res => {
                if (res) {
                    // 更新下拉框option disabled状态
                    const idsArr = this.ids.split(',')
                    res[0]['list'].map(item => {
                        if(idsArr.includes(item.id.toString())) {
                            item.disabled = true
                        } else {
                            item.disabled = false
                        }
                    })
                    // 返回下拉框option数据
                    resolve(res[0].list)
                }
            }))                  
        },
        // 获取方案（下拉列表中切换方案名称时获取对应的方案数据）
        getSchemeItem(id) {
            return new Promise((resolve) => api.purchasingEstimation.comparePlans({
                ids: id
            }).then(res => {
                this.list[0].push(res[0].name) // 表格标题
                resolve(res[0]['planText']['total'][0])
            }))    
        },
        // 下拉框远程搜索（按方案名称（val）从方案列表(listPlan接口)中搜索方案，之后获取到方案id）
        async remoteMethod(val) {
            this.keyword = val
            const scheme = await this.getNewestSchemeList()
            const id = scheme[0]['id']
            this.ids += ',' + id
            const res = await this.getSchemeItem(id)
            this.list[1].push(res.comprehensive_price)
            this.list[2].push(res.cost_price)
            this.list[3].push(res.not_heating_comprehensive_price)
            this.list[4].push(res.heating_comprehensive_price)
            this.list[5].push(res.heating_not_residents_price)
            this.list[6].push(res.not_residents_price)            
            this.setSelectOptionStatus()    // 更新下拉框option状态
        },
        // 更新下拉框option状态
        async setSelectOptionStatus() {
            this.keyword = ''
            this.schemeNameOptionsArr = await this.getNewestSchemeList()
        }
    }
}
</script>

<style lang='scss' scoped>
.container {
  min-width: auto!important;
  .breadcrumb-wrapper {
    margin: 10px 20px 0 20px;
    /deep/ .el-breadcrumb__inner {
        color: rgba(255, 255, 255, 0.5);
    }            
    /deep/ .el-breadcrumb__item:last-child > .el-breadcrumb__inner {
        color: #fff;
    }
  }
  .content-wrapper{
    background: #fff;
    border-radius: 8px;
    margin: 10px 20px 0 20px;
    padding: 20px;
    .compare-card-wrapper {
        .gas-tab-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #DCDFE6;
            margin-bottom: 20px;
            padding-bottom: 16px;
            .back-btn {
                font-size: 18px;
                font-weight: 500;
                color: #409EFF;
                cursor: pointer;
            }
            .scheme-compare {
                font-size: 18px;
                font-weight: 500;
                color: #303133;
            }
            .custom-button {
                width: 79px;
            }
            .el-divider--vertical {
                margin: 0 20px;
            }
        }
        /* table实现方案对比列表的样式 */
        .table-wrapper {
            /deep/ .el-table tr:first-child td {
                background: #F5F7FA;
                height: 116px;
                font-size: 18px;
                font-weight: 500;
                text-align: center!important;
                /* position: relative; */
            }            
            /deep/ .el-table {
                width: 1150px;
                border-radius: 8px;
                color: #303133;
            }
            .close-icon {
                position: absolute;
                top: 4px;
                right: 4px;
                font-size: 14px;
                cursor: pointer;
            }
            /* 2、3、4、5、6列首行单元格实现顶部颜色条 */
            /deep/ .el-table tr:first-child td:nth-child(2) {
                border-top: 5px solid #E6A23C;
            }
            /deep/ .el-table tr:first-child td:nth-child(3) {
                border-top: 5px solid #67C23A;
            }
            /deep/ .el-table tr:first-child td:nth-child(4) {
                border-top: 5px solid #47A87D;
            }
            /deep/ .el-table tr:first-child td:nth-child(5) {
                border-top: 5px solid #409EFF;
            }
            /deep/ .el-table tr:first-child td:nth-child(6) {
                border-top: 5px solid #567DB9;
            }
            /* 下拉框placeholder */
            /deep/ .el-select .el-input__inner {
                &::placeholder {
                    color: #606266;
                }
            }
            /* 奇数行设置背景色 */
            /deep/ .el-table tr:nth-child(odd) {
                background: #F5F7FA;
            }
            /* 第2、3行着重设置背景色 */
            /deep/ .el-table tr:nth-child(2) {
                background: #DFE7F2!important;
            }                                                 
            /deep/ .el-table tr:nth-child(3) {
                background: #DFE7F2;
            }
        }
    }
  }
}
</style>