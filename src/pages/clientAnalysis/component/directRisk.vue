<template>
    <el-row :gutter="0" class="container-wrap">
        <el-row :gutter="0" class="block-one">
            <el-col class="left-wrap">
                <el-col :span="24" class="title">风险识别</el-col>
                <el-col :span="24" class="table-wrap">
                    <div class="row-wrap">
                        <div class="common-width-one header-style">
                            风险指标内容
                        </div>
                        <div class="common-width-two header-style">高</div>
                        <div class="common-width-two header-style">中</div>
                        <div class="common-width-two header-style">低</div>
                        <div class="common-width-two header-style">无</div>
                    </div>
                    <div
                        class="row-wrap"
                        v-for="(item, index) in riskContentData"
                        :key="index"
                    >
                        <el-tooltip
                            class="item"
                            effect="dark"
                            placement="right-start"
                        >
                            <div
                                slot="content"
                                v-html="item.riskIndicator"
                            ></div>
                            <div
                                class="common-style common-width-one"
                                v-html="item.riskIndicator"
                            ></div>
                        </el-tooltip>

                        <el-tooltip
                            class="item"
                            effect="dark"
                            placement="right-start"
                        >
                            <div
                                slot="content"
                                v-html="
                                    item.riskLevel === '1'
                                        ? item.riskContent
                                        : ''
                                "
                            ></div>
                            <div
                                class="common-style common-width-two"
                                :class="{ select: item.riskLevel === '1' }"
                                v-html="
                                    item.riskLevel === '1'
                                        ? item.riskContent
                                        : ''
                                "
                            ></div>
                        </el-tooltip>

                        <el-tooltip
                            class="item"
                            effect="dark"
                            placement="right-start"
                        >
                            <div
                                slot="content"
                                v-html="
                                    item.riskLevel === '2'
                                        ? item.riskContent
                                        : ''
                                "
                            ></div>
                            <div
                                class="common-style common-width-two"
                                :class="{ select: item.riskLevel === '2' }"
                                v-html="
                                    item.riskLevel === '2'
                                        ? item.riskContent
                                        : ''
                                "
                            ></div>
                        </el-tooltip>

                        <el-tooltip
                            class="item"
                            effect="dark"
                            placement="right-start"
                        >
                            <div
                                slot="content"
                                v-html="
                                    item.riskLevel === '3'
                                        ? item.riskContent
                                        : ''
                                "
                            ></div>
                            <div
                                class="common-style common-width-two"
                                :class="{ select: item.riskLevel === '3' }"
                                v-html="
                                    item.riskLevel === '3'
                                        ? item.riskContent
                                        : ''
                                "
                            ></div>
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            placement="right-start"
                        >
                            <div
                                slot="content"
                                v-html="
                                    item.riskLevel === '4'
                                        ? item.riskContent
                                        : ''
                                "
                            ></div>
                            <div
                                class="common-style common-width-two"
                                :class="{ select: item.riskLevel === '4' }"
                                v-html="
                                    item.riskLevel === '4'
                                        ? item.riskContent
                                        : ''
                                "
                            ></div>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-col>
            <el-col class="middle-wrap">
                <el-col :span="24" class="title">模拟计算器</el-col>
                <map-com></map-com>
            </el-col>
            <el-col class="right-wrap">
                <el-col :span="24" class="title"></el-col>
                <el-col :span="24" class="pan-up">
                    <div class="item">
                        <div class="item-label">年日均用气量</div>
                        <div class="item-val">
                            <el-input
                                v-model="itemsObj.yearAverage"
                                placeholder="请输入内容"
                                :disabled="true"
                            ></el-input>
                        </div>
                        <div class="item-unit">万方/日</div>
                    </div>
                    <div class="item">
                        <div class="item-label">距离门站距离</div>
                        <div class="item-val">
                            <el-input
                                v-model="itemsObj.distance"
                                placeholder="请输入内容"
                                :disabled="true"
                            ></el-input>
                        </div>
                        <div class="item-unit">公里</div>
                    </div>
                    <div class="item">
                        <div class="item-label">预计直供管输成本</div>
                        <div class="item-val">
                            <el-input
                                v-model="itemsObj.cost"
                                placeholder="请输入内容"
                                :disabled="true"
                            ></el-input>
                        </div>
                        <div class="item-unit">元/方</div>
                    </div>
                    <div class="item">
                        <div class="item-label">当前门站价</div>
                        <div class="item-val">
                            <el-input
                                v-model="itemsObj.currentPrice"
                                placeholder="请输入内容"
                                :disabled="true"
                            ></el-input>
                        </div>
                        <div class="item-unit">元/方</div>
                    </div>
                    <div class="item">
                        <div class="item-label">直供参考价格</div>
                        <div class="item-val">
                            <el-input
                                v-model="itemsObj.refrencePrice"
                                placeholder="请输入内容"
                                :disabled="true"
                            ></el-input>
                        </div>
                        <div class="item-unit">元/方</div>
                    </div>
                    <div class="item">
                        <div class="item-label">年平均气价</div>
                        <div class="item-val">
                            <el-input
                                v-model="itemsObj.yearAveragePrice"
                                placeholder="请输入内容"
                                :disabled="true"
                            ></el-input>
                        </div>
                        <div class="item-unit">元/方</div>
                    </div>
                </el-col>
                <el-col :span="24" class="pan-down">
                    <div class="item">
                        <div class="item-label">调整后的价格</div>
                        <div class="item-val">
                            <el-input-number
                                v-model="itemsObj.adjustPrice"
                                :precision="2"
                                :step="0.05"
                                :min="itemsObj.refrencePrice"
                                :max="itemsObj.yearAveragePrice"
                            ></el-input-number>
                        </div>
                        <div class="item-unit">
                            元/方
                            <el-tooltip
                                class="item"
                                effect="dark"
                                placement="right-start"
                            >
                                <div slot="content">
                                    1、加/减颗粒度为0.05元/方；<br />
                                    2、最小值不低于直供产考价；<br />
                                    3、最大值不超过该企业年平均气价。
                                </div>
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="item">
                        <div class="item-label">预计利润影响</div>
                        <div class="item-val">
                            <el-input
                                v-model="predictProfit"
                                placeholder="请输入内容"
                                :disabled="true"
                            ></el-input>
                        </div>
                        <div class="item-unit">万元</div>
                    </div>
                </el-col>
            </el-col>
        </el-row>
        <el-row :gutter="0" class="conclusion-wrap">
            <el-col
                :span="24"
                :lg="24"
                :xl="24"
                :offset="0"
                class="conclusion-title"
                >分析结论</el-col
            >
            <el-col
                :span="24"
                :lg="24"
                :xl="24"
                :offset="0"
                class="conclusion"
                style="white-space: pre-line"
                v-html="conclusion"
            ></el-col>
        </el-row>
    </el-row>
</template>

<script>
import mapCom from './map';
export default {
    name: '',
    components: {
        mapCom
    },
    props: {},
    data() {
        return {
            riskContentData: [],
            itemsObj: {
                yearAverage: 4.5, //年日均用气量
                distance: 3.3, //距离门站距离
                cost: 0.42, //预计直供管输成本
                currentPrice: 2.2, //当前门站价
                refrencePrice: 1.0, //直接参考价格
                yearAveragePrice: 2.5, //年平均气价
                adjustPrice: 2.5 //调整后的价格   默认值采用“年平均气价”
            },
            conclusion: '',
            routeQueryObj: {}
        };
    },
    watch: {},
    computed: {
        predictProfit() {
            let total = (
                (this.itemsObj.yearAveragePrice - this.itemsObj.adjustPrice) *
                (this.itemsObj.yearAverage * 330)
            ).toFixed(2);
            return total;
        }
    },
    created() {},
    mounted() {
        this.routeQueryObj = this.$route.query;

        this.getStraightRiskListData();
    },
    methods: {
        async getStraightRiskListData() {
            let params = {
                compCode: this.routeQueryObj.compCode,
                distinct: this.routeQueryObj.distinct,
                partner: this.routeQueryObj.partner
            };
            let res = await this.$api.getStraightRiskList(params);
            if (res.resultCode === 0) {
                let resData = res.data;
                this.riskContentData = resData.straightRiskList;
                let obj = {
                    yearAverage: Number(resData.annualAverageSupply), //年日均用气量
                    distance: Number(resData.stationDistance), //距离门站距离
                    cost: Number(resData.expectCost), //预计直供管输成本
                    currentPrice: Number(resData.currentGatePrice), //当前门站价
                    refrencePrice: Number(resData.directReferencePrice), //直接参考价格
                    yearAveragePrice: Number(resData.annualAveragePrice), //年平均气价
                    adjustPrice: Number(resData.annualAveragePrice) //调整后的价格   默认值采用“年平均气价”
                };
                this.itemsObj = obj;
                this.conclusion = resData.riskAnalysis;
            } else {
                this.$message.error(res.resultMessage);
            }
        }
    }
};
</script>

<style lang='scss' scoped>
@import '~@/pages/clientAnalysis/style/directRisk';
</style>