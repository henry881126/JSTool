<!--
  * @Description:管存详情页面
  * @Author:jiawenjin baizhiqiang
  * @Date:2021-11-02
-->
<template>
  <div class="pipe-container">
    <div class="center-box">
      <div class="center-left">
        <div class="rect-body" v-for="(item,index) in pipesStoreList" :key="index">
          <pipeContent :arrInfo="item" @changePipes='changePipes'></pipeContent>
        </div>
      </div>
      <div class="center-right">
        <map2 :mapData="mapData"></map2>
      </div>
    </div>
  </div>
</template>

<script>
import pipeContent from "./pipe-content";
import { pipeSaveList } from "@/idsPages/api/stockAndPipeSave";
import  map2  from "./map.vue";
export default {
  components:{
    pipeContent,
    map2
  },
  data(){
    return{
      pipesTotal:{},
      pipesStoreList:[],
      timer:null,
      mapData:null
    }
  },
  created(){
    this.getPipeSaveList()
    this.timer = setInterval(() => {
      this.getPipeSaveList()
    }, 1000*60*3);
  },
  destroyed() {
    this.timer && clearInterval(this.timer);
  },
  mounted(){
    
  },
  methods:{
    getPipeSaveList(){
      pipeSaveList().then(res=>{
        if(res.resultCode === 0){
          this.pipesTotal = res.data.pipesTotal
          let pipesList = res.data.pipesList
          let rates = Number(this.pipesTotal.pipesRate)
          this.$set(this.pipesTotal,'pipesRate',rates)
          if(pipesList.length){
            let upVolume = this.pipesTotal.pipesUpVolume
            pipesList.map((item,index)=>{
              item.pipesRate = Number(item.pipesRate)
              item.pipesUpRate = Number(item.pipesUpRate)
              item.pipesLowerRate = Number(item.pipesLowerRate)
              item.width = (item.pipesUpVolume)/upVolume
              switch(item.pipesKey){
                  case 'HmToLsPipe':
                    item.width='1157'
                    break;
                  case 'BwlPipe':
                    item.width='224'
                    break;
                  case 'TmtPipe':
                    item.width='212'
                    break;
                  case 'HmcPipe':
                    item.width='246'
                    break;
                  case 'XgToQsPipe':
                    item.width='212'
                    break;
                  case 'XgToDcPipe':
                    item.width='446'
                    break;
                  case 'DcToTsPipe':
                    item.width='246'
                    break;
                  case 'TsToGbPipe':
                    item.width='299'
                    break;
                  case 'NwhPipe':
                    item.width='350'
                    break;
                  case 'LsdPipe':
                    item.width='299'
                    break;
                  case 'HmPipe':
                    item.width='246'
              }
            })
            pipesList.splice(0,0,this.pipesTotal)
            this.pipesStoreList = pipesList
          }else{
            this.pipesStoreList = []
          }
         // console.log(this.pipesStoreList)
        }
      })
    },
    changePipes(val){
      this.mapData=val;
    }
  }
}
</script>
<style lang='scss'>
.pipe-water {
	svg {
		display: none;
	}
	canvas {
		margin: 0;
		width: 100%;
		height: 100%;
	}
}
</style>
<style scoped lang="scss">
* {
	margin: 0;
	padding: 0;
}
.pipe-container {
	display: flex;
	height: 900px;
	ul {
		li {
			list-style: none;
			width: 144px;
			height: 62px;
			margin-bottom: 5px;
			padding: 5px 0;
			background: #ffffff;
			box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
			border: 1px solid #dcdfe6;
			box-sizing: border-box;
			h5 {
				font-size: 20px;
				font-weight: 500;
				color: #303133;
				line-height: 28px;
				text-align: center;
				span {
					font-size: 12px;
				}
			}
			p {
				font-size: 14px;
				color: #909399;
				line-height: 20px;
				text-align: center;
			}
		}
	}
	.center-box {
    width: 1792px;
    position: relative;
		.center-left {
			width: 100%;
      position: absolute;
			.rect-body {
        width: 100%;
        margin-bottom: 5px;
      }
		}
    .center-right{
      width: 831px;
      height: 667px;
      position: absolute;
      right: 39px;
      top: 170px;
    }
	}
}
</style>