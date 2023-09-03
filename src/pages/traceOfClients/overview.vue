<template>
  <div>
    <!-- 三 关键指标 -->
    <div class="container-header-key-indicators-wrapper">
      <div class="container-header-key-indicators-title">关键指标</div>
      <div class="container-header-key-indicators-item-wrapper">
        <!-- <div class='container-header-key-indicators-item' v-for='(item,index) in keyIndicatorsArr' :key='index'> -->
        <div :class='setClass(index)' v-for='(item,index) in keyIndicatorsArr' :key='index'>
          <div v-if='index === 0' class='indicator indicator1'>
            <div class="indicators-total-gas-volume-indicator-title1">{{item.title}}</div>
            <div class="indicators-total-gas-volume-indicator-title2">{{item.sum_abrmenge}}</div>
            <div class='indicators-total-gas-volume-indicator-title3-title4-wrapper'>
              <div class="indicators-total-gas-volume-indicator-title3">
                同比
                <img class="indicators-total-gas-volume-indicator-tongbi" src='../../assets/img/tongbi@2x.png' v-if='item.sum_abrmenge_basis >= 0' />
                <img class="indicators-total-gas-volume-indicator-tongbi" src='../../assets/img/huanbi@2x.png' v-else />
                <br/>{{item.sum_abrmenge_basis}}%
              </div>
              <div class="indicators-total-gas-volume-indicator-title4">
                环比
                <img class="indicators-total-gas-volume-indicator-huanbi" src='../../assets/img/tongbi@2x.png' v-if='item.sum_abrmenge_ratio >= 0' />
                <img class="indicators-total-gas-volume-indicator-huanbi" src='../../assets/img/huanbi@2x.png' v-else />
                <br/>{{item.sum_abrmenge_ratio}}%
              </div>
              <div></div>
            </div>
          </div>
          <div v-if='index === 1' class='indicator indicator2'>
            <div class="indicators-total-gas-volume-indicator-title1">{{item.title}}</div>
            <div class="indicators-total-gas-volume-indicator-title2">{{item.indu_abrmenge}}</div>
            <div class='indicators-total-gas-volume-indicator-title3-title4-wrapper'>
              <div class="indicators-total-gas-volume-indicator-title3">
                同比
                <img class="indicators-total-gas-volume-indicator-tongbi" src='../../assets/img/tongbi@2x.png' v-if='item.indu_abrmenge_basis >= 0' />
                <img class="indicators-total-gas-volume-indicator-tongbi" src='../../assets/img/huanbi@2x.png' v-else />
                <br/>{{item.indu_abrmenge_basis}}%
              </div>
              <div class="indicators-total-gas-volume-indicator-title4">
                环比
                <img class="indicators-total-gas-volume-indicator-huanbi" src='../../assets/img/tongbi@2x.png' v-if='item.indu_abrmenge_ratio >= 0' />
                <img class="indicators-total-gas-volume-indicator-huanbi" src='../../assets/img/huanbi@2x.png' v-else />
                <br/>{{item.indu_abrmenge_ratio}}%
              </div>
              <div></div>
            </div>
          </div>
          <div v-if='index === 2' class='indicator indicator3'>
            <div class="indicators-total-gas-volume-indicator-title1">{{item.title}}</div>
            <div class="indicators-total-gas-volume-indicator-title2">{{item.cusum_abrmenge}}</div>
            <div class='indicators-total-gas-volume-indicator-title3-title4-wrapper'>
              <div class="indicators-total-gas-volume-indicator-title3">
                同比
                <img class="indicators-total-gas-volume-indicator-tongbi" src='../../assets/img/tongbi@2x.png' v-if='item.cusum_abrmenge_basis >= 0' />
                <img class="indicators-total-gas-volume-indicator-tongbi" src='../../assets/img/huanbi@2x.png' v-else />
                <br/>{{item.cusum_abrmenge_basis}}%
              </div>
              <div class="indicators-total-gas-volume-indicator-title4">
                环比
                <img class="indicators-total-gas-volume-indicator-huanbi" src='../../assets/img/tongbi@2x.png' v-if='item.cusum_abrmenge_ratio >= 0' />
                <img class="indicators-total-gas-volume-indicator-huanbi" src='../../assets/img/huanbi@2x.png' v-else />
                <br/>{{item.cusum_abrmenge_ratio}}%
              </div>
              <div></div>
            </div>
            <div class="indicators-total-gas-volume-indicator-img-wrapper">
              <img class="indicators-total-gas-volume-indicator-img" src="../../assets/img/triangle.png">
            </div>
          </div>
          <div v-if='index === 3' class='indicator indicator4'>
            <div class="indicators-total-gas-volume-indicator-title1-1">{{item.title}}</div>
            <div class="indicators-total-gas-volume-indicator-title2-1">{{item.cusp_abrmenge}}</div>
            <div class='indicators-total-gas-volume-indicator-title3-title4-wrapper'>
              <div class="indicators-total-gas-volume-indicator-title3-1">
                同比
                <img class="indicators-total-gas-volume-indicator-tongbi" src='../../assets/img/tongbi@2x.png' v-if='item.cusp_abrmenge_basis >= 0' />
                <img class="indicators-total-gas-volume-indicator-tongbi" src='../../assets/img/huanbi@2x.png' v-else />
                <br/>{{item.cusp_abrmenge_basis}}%
              </div>
              <div class="indicators-total-gas-volume-indicator-title4-1">
                环比
                <img class="indicators-total-gas-volume-indicator-huanbi" src='../../assets/img/tongbi@2x.png' v-if='item.cusp_abrmenge_ratio >= 0' />
                <img class="indicators-total-gas-volume-indicator-huanbi" src='../../assets/img/huanbi@2x.png' v-else />
                <br/>{{item.cusp_abrmenge_ratio}}%
              </div>
              <div></div>
            </div>
          </div>
          <div v-if='index === 4' class='indicator indicator5'>
            <div class="indicators-total-gas-volume-indicator-title1-1">{{item.title}}</div>
            <div class="indicators-total-gas-volume-indicator-title2-1">{{item.cusk_abrmenge}}</div>
            <div class='indicators-total-gas-volume-indicator-title3-title4-wrapper'>
              <div class="indicators-total-gas-volume-indicator-title3-1">
                同比
                <img class="indicators-total-gas-volume-indicator-tongbi" src='../../assets/img/tongbi@2x.png' v-if='item.cusk_abrmenge_basis >= 0' />
                <img class="indicators-total-gas-volume-indicator-tongbi" src='../../assets/img/huanbi@2x.png' v-else />
                <br/>{{item.cusk_abrmenge_basis}}%
              </div>
              <div class="indicators-total-gas-volume-indicator-title4-1">
                环比
                <img class="indicators-total-gas-volume-indicator-huanbi" src='../../assets/img/tongbi@2x.png' v-if='item.cusk_abrmenge_ratio >= 0' />
                <img class="indicators-total-gas-volume-indicator-huanbi" src='../../assets/img/huanbi@2x.png' v-else />
                <br/>{{item.cusk_abrmenge_ratio}}%
              </div>
              <div></div>
            </div>
          </div>
          <div v-if='index === 5' class='indicator indicator6'>
            <div class="indicators-total-gas-volume-indicator-title1-1">{{item.title}}</div>
            <div class="indicators-total-gas-volume-indicator-title2-1">{{item.cusyc_abrmenge}}</div>
            <div class='indicators-total-gas-volume-indicator-title3-title4-wrapper'>
              <div class="indicators-total-gas-volume-indicator-title3-1">
                同比
                <img class="indicators-total-gas-volume-indicator-tongbi" src='../../assets/img/tongbi@2x.png' v-if='item.cusyc_abrmenge_basis >= 0' />
                <img class="indicators-total-gas-volume-indicator-tongbi" src='../../assets/img/huanbi@2x.png' v-else />
                <br/>{{item.cusyc_abrmenge_basis}}%
              </div>
              <div class="indicators-total-gas-volume-indicator-title4-1">
                环比
                <img class="indicators-total-gas-volume-indicator-huanbi" src='../../assets/img/tongbi@2x.png' v-if='item.cusyc_abrmenge_ratio >= 0' />
                <img class="indicators-total-gas-volume-indicator-huanbi" src='../../assets/img/huanbi@2x.png' v-else />
                <br/>{{item.cusyc_abrmenge_ratio}}%
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="container-header-key-indicators-item-wrapper-placeholder" v-if='keyIndicatorsArr.length === 0'>暂无数据</div> -->
    </div>
    <!-- 四 销售占比 -->
    <div class='container-sale-ratio-wrapper'>
      <div class="container-sale-ratio-title">销售占比</div>
      <div class="container-sale-ratio-graph-wrapper">
        <div class="container-sale-ratio-chart1" v-html='pieChartAHtml'>图表1</div>
        <div class="container-sale-ratio-chart1" v-html='pieChartBHtml'>图表2</div>
        <div class="container-sale-ratio-desc-wrapper">
          <div class="container-sale-ratio-desc-data-analysis-wrapper">
            <div class="container-sale-ratio-desc-data-analysis-title">数据解读</div>
            <div class="container-sale-ratio-desc-data-analysis-content" v-html="dataExplain"></div>
          </div>
          <div class="container-sale-ratio-desc-supplement-explain-wrapper">
            <div class="container-sale-ratio-desc-supplement-explain-title-wrapper">
              <div class="container-sale-ratio-desc-supplement-explain-title">补充说明</div>
              <div class="container-sale-ratio-desc-supplement-explain-save" @click='saveSupplementExplain'>保存</div>
              <!-- <div class="container-sale-ratio-desc-supplement-explain-save" @click='saveSupplementExplain' v-if='pieChartA.data.length != 0 || pieChartB.data.length != 0'>保存</div> -->
              <!-- <div class="container-sale-ratio-desc-supplement-explain-save" style='color:#999;cursor:auto;' v-if='pieChartA.data.length === 0 && pieChartB.data.length === 0'>保存</div> -->
            </div>
            <div class="container-sale-ratio-desc-supplement-explain-content-wrapper">
              <!-- <el-input type='textarea' class="container-sale-ratio-desc-supplement-explain-content-input" v-model='supplementExplain' placeholder="请您填写内容进行补充说明" rows='5'></el-input> -->
              <textarea class="container-sale-ratio-desc-supplement-explain-content-input" v-model='supplementExplain' placeholder="请您填写内容进行补充说明" rows='5'></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 五 用气销售明细 -->
    <div class="container-gas-sale-detail-wrapper">
      <div class="container-gas-sale-detail-header-wrapper">
        <div class="container-gas-sale-detail-title-wraper">
          <div class="container-gas-sale-detail-title">用气销售明细</div>
          <div class="container-gas-sale-detail-unit">单位：万方</div>
        </div>
        <div class="container-gas-sale-detail-title-export" @click='exportCustomerSalesDetails' v-if='' ><i class="el-icon-upload2"></i> 导出</div>
      </div>
      <div class="container-gas-sale-detail-table-wrapper">
        <CommonBasicTable :headerTitleArr='tableData.title' :list='tableData.list'></CommonBasicTable>
      </div>
    </div>
  </div>
</template>

<script>
import api from '/src/http/api'
import CommonBasicTable from './components/CommonBasicTable.vue'
import pieChartConfig from './components/pieChartConfig'
import exportApi from '/src/components/export/export'
export default {
  name: "overview",
  mixins:[pieChartConfig,exportApi],
  props: {
    time: {
      type:[Number,Date]
    },
    // 日期选择器值
    currentDate:{
      type:[Date,String],
    },
    // 
    curComCode: {
      type:[Number,String]
    }
  },
  data: function () {
    return {
      keyIndicatorsArr:[],         // 关键指标数据
      chart:'',                    // 图表对象
      // 雷达图DOM
      pieChartAHtml:'',
      pieChartBHtml:'',
      // 雷达图相关参数
      pieChartA: {
        title:'',                   // 标题
        data:[],                    // 数据
        legendIsShow:true,         // 是否显示图例
        color:[],                   // 饼图各饼子的颜色
      },
      pieChartB: {
        title:'',
        data:[],
        legendIsShow:true
      },
      dataExplain:'',             // 数据解读
      supplementExplain:'',       // 补充说明
      // 表格相关数据
      tableData: {
        headerTitleArr:[],          // 表格标题
        list:[],                    // 表格数据
      }
    }
  },

  components: {
    CommonBasicTable
  },
  methods: {
    // 保存补充说明
    saveSupplementExplain() {
      let params = {
        compCode:this.curComCode,
        text:this.supplementExplain,
        type:1      // 类型  1:总体 2：工商户：3工商户分类 4：民用户 5：民用普表 6：民用卡表 7：民用物联网表'
      }
      api.gasReservesAnalysis.saveSupplementExplain(params).then(res => {
        if(res) {
          this.$message('保存成功')
        }
      })
    },
    // 导出用户销售明细
    exportCustomerSalesDetails() {
      let params = {
        budat:this.currentDate,
        compCode:this.curComCode
      }
      api.gasReservesAnalysis.customerGasTrackExport(params).then(res => {
        // if(res) {
        // this.$message('导出成功')
        this.download(res, 'xlsx', '用户销售明细')
        // }
      })
    },
    // 请求接口数据
    getData() {
      this.getKeyIndicatorsData()
      this.getSalesDetails()
    },
    // 关键指标、雷达图数据
    getKeyIndicatorsData() {
      let params = {
        // budat:moment(this.currentDate).format('yyyyMM'),
        budat:this.currentDate,
        compCode:this.curComCode
      }
      api.gasReservesAnalysis.getKeyIndicators(params).then(res => {
        let data = res.data.data[0]
        // 关键指标数据
        this.keyIndicatorsArr = [
          {
            title:'总销售气量（万方）',
            sum_abrmenge:data.sum_abrmenge,
            sum_abrmenge_basis:data.sum_abrmenge_basis,
            sum_abrmenge_ratio:data.sum_abrmenge_ratio
          },
          {
            title:'工商气量（万方）',
            indu_abrmenge:data.indu_abrmenge,
            indu_abrmenge_basis:data.indu_abrmenge_basis,
            indu_abrmenge_ratio:data.indu_abrmenge_ratio
          },
          {
            title:'民用气量（万方）',
            cusum_abrmenge:data.cusum_abrmenge,
            cusum_abrmenge_basis:data.cusum_abrmenge_basis,
            cusum_abrmenge_ratio:data.cusum_abrmenge_ratio
          },
          {
            title:'民用气量（普表）(万方)',
            cusp_abrmenge:data.cusp_abrmenge,
            cusp_abrmenge_basis:data.cusp_abrmenge_basis,
            cusp_abrmenge_ratio:data.cusp_abrmenge_ratio
          },
          {
            title:'民用气量（卡表）(万方)',
            cusk_abrmenge:data.cusk_abrmenge,
            cusk_abrmenge_basis:data.cusk_abrmenge_basis,
            cusk_abrmenge_ratio:data.cusk_abrmenge_ratio
          },
          {
            title:'民用气量（物联网表）(万方)',
            cusyc_abrmenge:data.cusyc_abrmenge,
            cusyc_abrmenge_basis:data.cusyc_abrmenge_basis,
            cusyc_abrmenge_ratio:data.cusyc_abrmenge_ratio
          },
        ],
        // A雷达图（左侧）数据
        this.pieChartA.title = '工商和民用用气占比（万方）'
        this.pieChartA.data = [
          {
            name:'民用户用气量',
            value:data.civil_ratio
          },
          {
            name:'工商户用气量',
            value:data.indu_ratio
          },
          this.pieChartA.color = ['#52CCA3','#6699FF']
        ],
        // B雷达图（右侧）数据
        this.pieChartB.title = '民用用气各类型占比（万方）'
        this.pieChartB.data = [
          {
            // name:'民用（普表）',
            name:'普表',
            value:data.cusp_ratio
          },
          {
            // name:'民用（卡表）',
            name:'卡表',
            value:data.cusk_ratio
          },
          {
            // name:'民用（物联网表）',
            name:'物联网表',
            value:data.cusyc_ratio
          },
          this.pieChartB.color = ['#52CCA3','#B3CDFF','#6699FF']
        ],
        // 数据解读、补充说明
        this.dataExplain = data.explain
        this.supplementExplain = data.replenish
        // 补充说明
      }).catch(err => {
        console.log('err',err)
        this.resetData()
      })
    },
    // 请求用户销售明细数据
    getSalesDetails() {
      let params = {
        // budat:moment(this.currentDate).format('yyyyMM'),
        budat:this.currentDate,
        compCode:this.curComCode
      }
      api.gasReservesAnalysis.getSalesDetails(params).then(res => {
        let list = res.data.data
        let lastItemOfList = list.splice(-1,1)
        list.unshift(lastItemOfList[0])
        // 构造标题
        let headerTitleArr = [
          {
            key:'month',
            value:'日期'
          },
          {
            key:'indu_abrmenge',
            value:'工商用气'
          },
          {
            key:'indu_ratio',
            value:'工商用气占比'
          },
          {
            key:'cusum_abrmenge',
            value:'民用用气量'
          },
          {
            key:'cusum_ratio',
            value:'民用占比'
          },
          {
            key:'cusp_abrmenge',
            value:'普表-民用'
          },
          {
            key:'cusp_ratio',
            value:'普表占比-民用'
          },
          {
            key:'cusk_abrmenge',
            value:'卡表-民用'
          },
          {
            key:'cusk_ratio',
            value:'卡表占比-民用'
          },
          {
            key:'cusyc_abrmenge',
            value:'物联网表-民用'
          },
          {
            key:'cusyc_ratio',
            value:'物联网表占比'
          },
          {
            key:'sum_abrmenge',
            value:'气量合计'
          }
        ]
        this.tableData.title = headerTitleArr
        // this.tableData.list = list
        this.tableData.list = this.addPercent(list)
      }).catch(err => {
        console.log('err',err)
      })

    },
    // 雷达图A
    initPieChartA() {
      this.pieChartAHtml = "";
      this.$nextTick(() => {
        // if (this.showPieChart) {
        this.pieChartAHtml =
            '<div style=" height: 100%;width: 100%;" id="pieChartA"></div>';
        this.$nextTick(() => {
          this.chart = this.$echarts.init(document.getElementById("pieChartA"));
          // this.chart.resize({ width: "auto" });
          // this.chart.setOption(this.pieChartConfig(this.pieChartA));
          this.chart.setOption(this.pieChartConfig(this.pieChartA));
          window.onresize = this.chart.resize
        });
        // }
      });
    },
    // 雷达图B
    initPieChartB() {
      this.pieChartBHtml = ''
      this.$nextTick(() => {
        this.pieChartBHtml = "<div style='width:100%;height:100%;' id='pieChartB'></div>"
        this.$nextTick(() => {
          this.chart = this.$echarts.init(document.getElementById('pieChartB'))
          this.chart.setOption(this.pieChartConfig(this.pieChartB))
          window.onresize = this.chart.resize
        })
      })
    },
    // 初始化雷达图数据
    resetData() {
      this.keyIndicatorsArr = this.keyIndicatorsArr = [
          {
            title:'总销售气量（万方）',
            sum_abrmenge:0,
            sum_abrmenge_basis:0,
            sum_abrmenge_ratio:0
          },
          {
            title:'工商气量（万方）',
            indu_abrmenge:0,
            indu_abrmenge_basis:0,
            indu_abrmenge_ratio:0
          },
          {
            title:'民用气量（万方）',
            cusum_abrmenge:0,
            cusum_abrmenge_basis:0,
            cusum_abrmenge_ratio:0
          },
          {
            title:'民用气量（普表）(万方)',
            cusp_abrmenge:0,
            cusp_abrmenge_basis:0,
            cusp_abrmenge_ratio:0
          },
          {
            title:'民用气量（卡表）(万方)',
            cusk_abrmenge:0,
            cusk_abrmenge_basis:0,
            cusk_abrmenge_ratio:0
          },
          {
            title:'民用气量（物联网表）(万方)',
            cusyc_abrmenge:0,
            cusyc_abrmenge_basis:0,
            cusyc_abrmenge_ratio:0
          },
        ],
      this.pieChartA.title = '工商和民用用气占比（万方）'
      this.pieChartA.data = []
      this.pieChartB.title = '民用用气各类型占比（万方）'
      this.pieChartB.data = []
      this.dataExplain = ''
      this.supplementExplain = ''
    },
    // 用户销售明细列表中各占比字段末尾加百分号（%）
    addPercent(list) {
      list.map(item => {
        item.cusk_ratio += '%'
        item.cusp_ratio += '%'
        item.cusum_ratio += '%'
        item.cusyc_ratio += '%'
        item.indu_ratio += '%'      
      })
      return list
    },
    // 动态创建class，在关键指定中使用，前三个元素宽度自适应，后三个宽度固定
    setClass(index) {
        let obj = {face: true}
        obj["container-header-key-indicators-item"+`${index}`] = true
        return obj
    }  
  },
  watch: {
    pieChartA: {
      handler() {
        this.initPieChartA()
      },
      deep: true
    },
    pieChartB:{
      handler() {
        this.initPieChartB()
      },
      deep:true
    },
    time: {
      handler(newValue,oldValue) {
        // console.log(newValue,'121.....121',oldValue)
        this.getData()
      },
      deep: true
    }
  },
  mounted() {
    this.getData()
    this.initPieChartA()
    this.initPieChartB()
  }
}
</script>

<style scoped>

/* 关键指标 */
.container-header-key-indicators-wrapper {
  width:100%;
  display: flex;
  flex-direction: column;
  /* margin-left:30px;
  margin-right: 30px; */
  padding:0 30px  0 30px;
  margin-bottom:33px;
  box-sizing: border-box;
}
.container-header-key-indicators-title {
  font-size: 24px;
  font-weight: 500;
  margin:30px 0 20px 0;
  box-sizing: border-box;
  color:#fff;
}
.container-header-key-indicators-item-wrapper {
  display: flex;
}
/* 关键指标前三个宽度自适应，后三个宽度固定 */
.container-header-key-indicators-item0,.container-header-key-indicators-item1,.container-header-key-indicators-item2 {
  flex:1;
}
.container-header-key-indicators-item-wrapper-placeholder {
  background:rgba(0,0,0,.1);
  height:204px;
  line-height: 204px;
  border-radius: 12px;
  text-align: center;
  color:#999;
}
.container-header-key-indicators-item {
  box-sizing: border-box;
  border-radius: 22px;
}
.indicator {
  border-radius: 12px;
  padding:31px 0 21px 0;
  padding-left:20px;
  padding-right:20px;
  box-sizing: border-box;
  white-space:nowrap;
  transition:all .5s;
}
.indicator:hover {
  transform:scale(1.05)
}
.indicator1{
  background: rgb(224,97,228,.65);
  /* width:310px; */
  /* width:255px; */
  height:204px;
  margin-right:10px;
}
.indicator2{
  background: rgba(113,255,191,.65);
  /* width:310px; */
  /* width:255px; */
  height:204px;
  margin-right:10px;
}
.indicator3{
  background: rgba(100,255,255,.65);
  /* width:310px; */
  /* width:255px; */
  height:204px;
  position:relative;
}
.indicator4{
  background: #225cb8;
  width:198px;
  /* width:198px; */
  height:204px;
}
.indicator5{
  background: #255dc3;
  width:198px;
  /* width:178px; */
  height:204px;
}
.indicator6{
  background: #3962b6;
  /* width:230px; */
  width:240px;
  /* flex:1 1 240px; */
  height:204px;
}
.indicators-total-gas-volume-indicator-title1 {
  color:#fff;
  font-size: 18px;
  font-weight: 500;
}
.indicators-total-gas-volume-indicator-title2 {
  color:#fff;
  font-size: 45px;
  font-weight: 700;
  line-height: 63px;
  margin:10px 0;
  font-family: 'DI';
}
.indicators-total-gas-volume-indicator-title3-title4-wrapper {
  display:flex;
  justify-content: space-between;
}
.indicators-total-gas-volume-indicator-title3 {
  color:#fff;
  font-size: 18px;
  font-weight: 500;
}
.indicators-total-gas-volume-indicator-title4 {
  color:#fff;
  font-size: 18px;
  font-weight: 500;
}

.indicators-total-gas-volume-indicator-title1-1 {
  color:#fff;
  font-size: 16px;
  font-weight: 500;
}
.indicators-total-gas-volume-indicator-title2-1 {
  color:#fff;
  font-size: 30px;
  font-weight: 700;
  line-height: 42px;
  margin:15px 0 9px 0;
  font-family: 'DI';
}
.indicators-total-gas-volume-indicator-title3-title4-wrapper {
  display:flex;
  justify-content: space-between;
}
.indicators-total-gas-volume-indicator-title3-1 {
  color:#fff;
  font-size: 18px;
  font-weight: 500;
}
.indicators-total-gas-volume-indicator-title4-1 {
  color:#fff;
  font-size: 18px;
  font-weight: 500;
}
.indicators-total-gas-volume-indicator-img-wrapper {
  position:absolute;
  top:89px;
  right:-13px;
}
.indicators-total-gas-volume-indicator-img {
  width:15px;
  height:30px;
}
.indicators-total-gas-volume-indicator-tongbi {
  width:10px;
  height:10px;
  margin-left:7px;
  margin-bottom:2px;
}
.indicators-total-gas-volume-indicator-huanbi {
  width:10px;
  height:10px;
  margin-left:7px;
  margin-bottom:2px;
}
/* 销售占比 */
.container-sale-ratio-wrapper {
  width:100%;
  display: flex;
  flex-direction: column;
  position: relative;
  /* top:-76px; */
  top:-16px;
  padding:0 30px 0 30px;
  box-sizing: border-box;
}
.container-sale-ratio-title {
  font-size: 24px;
  font-weight: 500;
  color:#fff;
  margin-bottom: 20px;
}
.container-sale-ratio-graph-wrapper {
  /* width:1606px; */
  /* height:454px; */
  border-radius: 12px;
  background: #fff;
  display: flex;
  padding:24px 30px;
}
.container-sale-ratio-chart1{
  /* background: rgba(0,0,0,.2); */
  flex:1;
}
.container-sale-ratio-chart2{
  /* background: rgba(0,0,0,.4); */
  flex:1;
}
/* 销售占比 数据解读 */
.container-sale-ratio-desc-wrapper {
  /* background: rgba(0,0,0,.6); */
  flex:0 1 328px;
}
.container-sale-ratio-desc-data-analysis-wrapper {
  display:flex;
  flex-direction: column;
}
.container-sale-ratio-desc-data-analysis-title {
  font-size: 16px;
  font-weight: 400;
  color:#333;
  margin-bottom: 22px;
}
.container-sale-ratio-desc-data-analysis-content {
  width:328px;
  height:182px;
  background: #F2F3F6;
  border-radius: 10px;
  padding:18px;
  box-sizing: border-box;
  line-height: 150%;
}

/* 销售占比 补充说明 */
.container-sale-ratio-desc-supplement-explain-wrapper {
  display:flex;
  flex-direction: column;
}
.container-sale-ratio-desc-supplement-explain-title-wrapper {
  display: flex;
  justify-content: space-between;
  margin:28px 10px 20px 0;
  box-sizing: border-box;
}
.container-sale-ratio-desc-supplement-explain-title {
  font-size: 16px;
  font-weight: 400;
  color:#333;
}
.container-sale-ratio-desc-supplement-explain-save {
  font-size: 18px;
  font-weight: 400;
  color:#0FB2AB;
  cursor:pointer;
}
.container-sale-ratio-desc-supplement-explain-content-wrapper {

}
.container-sale-ratio-desc-supplement-explain-content-input {
  width:328px;
  height:113px;
  background:#F2F3F6;
  border-radius: 10px;
  color:#909090;
  border:none;
  outline: none;
  resize:none;
  padding:10px;
  box-sizing: border-box;
  font-size:16px;
}
.container-sale-ratio-graph-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height:454px;
  border-radius: 12px;
  background: rgba(0,0,0,.2);
  color:#777;
}
/* 用气销售明细 */
.container-gas-sale-detail-wrapper {
  width: calc(100% - 62px);
  /* width:1606px; */
  /* height:551px; */
  background: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding:20px 30px;
  box-sizing: border-box;
  margin-top:0px;
  margin-bottom: 48px;
  margin-left:32px;
}
.container-gas-sale-detail-header-wrapper {
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

}
.container-gas-sale-detail-title-wraper {
  display: flex;
  flex-direction: column;
}
.container-gas-sale-detail-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 17px;
}
.container-gas-sale-detail-unit {
  font-size: 18px;
  font-weight: 400;
  color:#333;
  margin-bottom: 23px;
}
.container-gas-sale-detail-title-export {
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 17px;
  width:98px;
  height:46px;
  border-radius: 23px;
  background:#E5F6F6;
  color:#0FB2AB;
  text-align: center;
  line-height: 46px;
  cursor:pointer;
}
/* .container-gas-sale-detail-title-export {
  width:17px;
  height:17px;
  color:#0FB2AB;
} */
.container-gas-sale-detail-table-wrapper {
}
</style>