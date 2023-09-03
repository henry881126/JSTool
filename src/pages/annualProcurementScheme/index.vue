<template>
  <div class="container gas-page-bg">
      <TopMenu title="智慧分销" />
      <div class="breadcrumb-wrapper">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>资源统筹</el-breadcrumb-item>
        <el-breadcrumb-item>年度采购方案</el-breadcrumb-item>
        <el-breadcrumb-item>方案测算</el-breadcrumb-item>
        </el-breadcrumb>          
      </div>
      <div class="content-wrapper">
          <div class="content-header-wrapper">
              <span class="back-btn" @click="goBack" v-show="title ==='编辑采购方案' || title === '查看采购方案'"><i class="el-icon-back"></i>返回</span>
              <el-divider direction="vertical" v-if="title ==='编辑采购方案' || title === '查看采购方案'"></el-divider>
              <div class="title">{{ title }}</div>
              <div class="date-picker-wrapper">
                <el-date-picker
                    v-model="year"
                    type="year"
                    value-format="yyyy"
                    >
                </el-date-picker>
              </div>
          </div>
          <!-- 方案测算页面 -->
          <AnnualGasDemand ref="annualGasDemand" :year="year" />
      </div>
  </div>
</template>

<script>
import TopMenu from '@components/topMenu/topMenu2'
import AnnualGasDemand from './procurementScheme/schemeCalculation'

export default {
    components: {
        TopMenu,
        AnnualGasDemand,
    },
    data() {
        return {
            year: new Date().getFullYear().toString(),
             // 年度用气需求量
            annualGasDemand: [
                {
                    supplier_name: '合计',
                    rowKey: Math.random().toString(),
                    editable: true,
                    sum: 0,
                    '4': 0,
                    '5': 0,
                    '6': 0,
                    '7': 0,
                    '8': 0,
                    '9': 0,
                    '10': 0,
                    '11': 0,
                    '12': 0,
                    '1': 0,
                    '2': 0,
                    '3': 0,
                }
            ],   
            purchaseCostList: [],   // 采购成本列表
            purchaseGasVolumnList: [],  // 采购气量列表
            title: '',
        }
    },
    computed: {
        curComCode() {
            return this.$store.getters.curCom
        },
        timer() {
            return new Date().getTime()
        }
    },
    created() {
        this.$nextTick(() => {
            this.title = this.$refs.annualGasDemand.title
        })
    },
    methods: {  
        goBack() {
          this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
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
            .content-header-wrapper {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                .back-btn {
                    font-size: 18px;
                    font-weight: 500;
                    color: #409EFF;
                    cursor: pointer;
                }        
                /deep/ .el-divider {
                  margin: 0 20px;
                }        
                .title {
                    font-size: 18px;
                    font-weight: 500;
                    color: #303133;
                    margin-right: 30px;
                }
                .date-picker-wrapper {
                    /deep/ .el-input__inner {
                        height: 32px;
                        line-height: 32px;
                        border-radius: 16px;
                        background: #F5F7FA;
                        color: #303133;
                    }
                    /deep/ .el-input__icon {
                        height: 32px;
                        line-height: 32px;
                    }
                    /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
                        width: 182px;
                        height: 32px;
                        line-height: 32px;

                    }
                }
            }
        }
    }
</style>