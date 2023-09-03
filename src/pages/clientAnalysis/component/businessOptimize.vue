<template>
    <el-row :gutter="0" class="container-wrap">
        <el-col :span="24" :lg="24" :xl="24">
            <el-col
                :span="11"
                :lg="11"
                :xl="11"
                :offset="0"
                class="block-one-wrap"
                ><div class="title-one">现状</div>
                <div class="common">
                    <div class="padding-left width1">定价机制</div>
                    <div
                        class="width2"
                        style="display: flex; justify-content: space-between"
                    >
                        <div>{{ objData.pricingMechanisms }}</div>
                        <div v-if="isLand === '1'">
                            <el-popover
                                placement="bottom"
                                width="220"
                                trigger="click"
                            >
                                <el-table :data="objData.gasPriceDetailDTOList">
                                    <el-table-column
                                        width="135"
                                        property="differentialPrice"
                                        label="日气均量(方)"
                                    ></el-table-column>
                                    <el-table-column
                                        width="90"
                                        property="gasPrice"
                                        label="气价(元/方)"
                                    ></el-table-column>
                                </el-table>
                                <el-button slot="reference">明细</el-button>
                            </el-popover>
                        </div>
                    </div>
                </div>
                <div class="common">
                    <div class="padding-left width1">支付方式</div>
                    <div class="width2">{{ objData.payment }}</div>
                </div>
                <div class="common">
                    <div class="padding-left width1">计划偏差考核</div>
                    <div class="width2">
                        {{ objData.assessmentOfDeviation }}
                    </div>
                </div>
                <div class="common">
                    <div class="padding-left width1">合同期限</div>
                    <div class="width2">{{ objData.contractPeriod }}</div>
                </div>
                <div class="common">
                    <div class="padding-left width1">延伸业务</div>
                    <div class="width2">{{ objData.extensionOfBusiness }}</div>
                </div>
                <div class="common">
                    <div class="padding-left width1">工程安装费</div>
                    <div class="width2">
                        {{
                            objData.engineeringInstallation === '-'
                                ? objData.engineeringInstallation
                                : objData.engineeringInstallation + ' 万元'
                        }}
                    </div>
                </div></el-col
            >
            <el-col :span="1" :lg="1" :xl="1" :offset="0" class="block-two-wrap"
                ><div class="split-line"></div
            ></el-col>
            <el-col
                :span="11"
                :lg="11"
                :xl="11"
                :offset="0"
                class="block-three-wrap"
                ><div class="title-one">建议结果</div>
                <div
                    class="common"
                    :class="{ blueColor: objData.pricingSymbol === 1 }"
                >
                    <div class="padding-left width1">定价机制</div>
                    <div class="width2">{{ objData.pricingSuggestions }}</div>
                </div>
                <div class="common">
                    <div class="padding-left width1">支付方式</div>
                    <div class="width2">{{ objData.paymentSuggestions }}</div>
                </div>
                <div
                    class="common"
                    style="height: 180px; border-color: black"
                    :class="{ blueColor: objData.deviationSymbol === 1 }"
                >
                    <div class="padding-left width1">计划偏差考核</div>
                    <div
                        class="width2"
                        v-html="objData.deviationSuggestions"
                    ></div>
                </div>
                <div
                    class="common"
                    :class="{ blueColor: objData.contractPeriodSymbol === 1 }"
                >
                    <div class="padding-left width1">合同期限</div>
                    <div class="width2">
                        {{ objData.contractPeriodSuggestions }}
                    </div>
                </div>
                <div
                    class="common"
                    :class="{ blueColor: objData.extensionSymbol === 1 }"
                >
                    <div class="padding-left width1">延伸业务</div>
                    <div class="width2">{{ objData.extensionSuggestions }}</div>
                </div>
                <div
                    class="common"
                    :class="{ blueColor: objData.engineeringSymbol === 1 }"
                >
                    <div class="padding-left width1">工程安装费</div>
                    <div class="width2">
                        {{
                            objData.engineeringSuggestions === '-'
                                ? objData.engineeringSuggestions
                                : objData.engineeringSuggestions + ' 万元'
                        }}
                    </div>
                </div></el-col
            >
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: 'businessOptimize',
    components: {},
    props: {},
    data() {
        return {
            isLand: '1', //默认域内1
            compCode: '', //公司代码
            partner: '', //公司编码
            routeQueryObj: {}, //获取路由参数
            objData: {
                assessmentOfDeviation: '无',
                contractPeriod: 1,
                contractPeriodSuggestions: 1,
                contractPeriodSymbol: 1,
                deviationSuggestions: '无',
                deviationSymbol: 1,
                engineeringInstallation: 1,
                engineeringSuggestions: 1,
                engineeringSymbol: 1,
                extensionOfBusiness: 1,
                extensionSuggestions: 1,
                extensionSymbol: 1,
                gasPriceDetailDTOList: [],
                payment: '现金',
                paymentSuggestions: '现金',
                paymentSymbol: '现金',
                pricingMechanisms: '3.2元/方',
                pricingSuggestions: '3.2元/方',
                pricingSymbol: '3.2元/方'
            }
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.routeQueryObj = this.$route.query;
        this.isLand = this.routeQueryObj.distinct || '1';
        this.getBusinessOptimizationList();
    },
    methods: {
        getBusinessOptimizationList() {
            let params = {
                compCode: this.routeQueryObj.compCode,
                distinct: this.routeQueryObj.distinct || '1',
                partner: this.routeQueryObj.partner
            };
            this.$api.getBusinessOptimizationList(params).then(res => {
                if (res.resultCode === 0) {
                    this.objData = res.data;
                } else {
                    this.$message({
                        message: res.resultMessage,
                        type: 'error'
                    });
                }
            });
        }
    }
};
</script>

<style lang='scss' scoped>
@import '~@/pages/clientAnalysis/style/businessOptimize';
</style>