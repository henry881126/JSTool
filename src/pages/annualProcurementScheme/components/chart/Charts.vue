<template>
  <div class="container">
          <ChartPurchaseGasVolume :purchaseGasVolumnList="purchaseGasVolumnList" :year="year" :key="timer" />
          <ChartPurchaseUnitPrice :purchaseCostList="purchaseCostList" />
          <ChartPurchaseCost :purchaseCostList="purchaseCostList" />
  </div>
</template>

<script>
import ChartPurchaseGasVolume from './ChartPurchaseGasVolume'
import ChartPurchaseUnitPrice from './ChartPurchaseUnitPrice'
import ChartPurchaseCost from './ChartPurchaseCost'

export default {
    components: {
        ChartPurchaseGasVolume,
        ChartPurchaseUnitPrice,
        ChartPurchaseCost
    },
    props: {
        purchaseCostList: {
            type: Array,
            default: () => []
        },
        purchaseGasVolumnList: {
            type: Array,
            default: () => []
        },
        year: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            echart: null
        }
    },
    computed: {
        timer() {
            return new Date().getTime()
        }
    },
    created() {
    },
    methods: {


    }
}
</script>

<style lang="scss" scoped>
    .container {
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
        width: 100%;
        .chart-purchase-gas-volume, .chart-purchase-unit-price, .chart-purchase-cost {
            height: 304px;
            border: 1px solid #DCDFE6;
            border-radius: 8px;
            padding: 10px;
            width:calc((100% - 99px)/3)
            /* width: 100%; */
        }
    }
</style>