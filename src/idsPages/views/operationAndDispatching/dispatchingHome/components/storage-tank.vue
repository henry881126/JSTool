<!--
  * @Description:库存及调峰气量储罐图组件
  * @Author:jiawenjin
  * @Date:2021-11-01
-->
<template>
    <div class="storage-box">
        <div class="primary">
           <dv-water-level-pond :config="config" class="storage-water" v-if="storeRate"/>
            <div class="toplimit" :style="{height:`${upLimit}%`}"></div>
            <div class="lowerlimit" :style="{height:`${lowerLimit}%`}"></div>
        </div>
        <img src="@/idsPages/images/dispatchingHome/storage.png?v=1" class="bg"/>
    </div>
</template>
<script>

export default{
    props:{
        upLimit:{
            type:String,
            default:'85'
        },
        lowerLimit:{
            type:String,
            default:'15'
        },
        storeRate:{
            type:String,
            default:''
        }
    },
    watch:{
        storeRate(newval,oldval){
            if(newval){
                let rate = Number(newval),
                upLimit = Number(this.upLimit),
                lowerLimit = Number(this.lowerLimit)
                this.$set(this.config.data,0,rate)
                if(rate>upLimit){
                    this.config.colors=['#F5222D','#F5222D']
                }
                if(rate<lowerLimit){
                    this.config.colors=['#2F3F95','#2F3F95']
                }
            }
        }
    },
    created(){
        
    },
    data() {
       return{
            config:{
                data:[],
                waveNum:2,
                waveHeight:3,
                colors:['#12B090','#12B090'],
                waveOpacity:1,
            },
       } 
    },

}
</script>
<style lang='scss'>
.storage-water{
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
  svg{
    display: none;
  }
  canvas {
    margin:0;
    width: 100%;
    height: 100%;
  }
}
</style>
<style scoped lang="scss">
.storage-box{
    width:100%;
    height:100%;
    position: relative;
    .primary{
        width:73px;
        position: absolute;
        bottom: 7px;
        left: 6px;
        top: -5px;
        border-top-left-radius: 32px;
        border-top-right-radius: 32px;
        overflow: hidden;
    }
    .bg{
        width:119%;
        display: block;
        position: absolute;
        bottom: -7px;
        left: 50%;
        z-index: 6;
        transform: translate(-50%, 0);
    }
    .toplimit,.lowerlimit{
        width:100%;
        position: absolute;
        bottom:0px;
        left: 0;
        border-top: 1px dashed #F5222D;
    }
    .lowerlimit{
        border-top: 1px dashed #2F3F95;
    }
}
</style>
