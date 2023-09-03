<template>
    <div class="usegas-water">
        <div class="primary">
           <dv-water-level-pond :config="config" class="water" v-if='percentage&&flag'/>
        </div>
        <p>{{ percentage ? percentage : 0 }}%</p>
        <img src="@/idsPages/images/dispatchingHome/waterbg.png" class="bg"/>
    </div>
</template>
<script>
export default{
    props:{
        percentage:{
            type:Number,
            default:0
        }
    },
    data() {
        return{
            config:{
                data:[],
                waveNum:1,
                waveHeight:3,
                colors:['#12B090','#12B090'],
                waveOpacity:1,
            },
            flag:false,
        }
    },  
    watch:{
        percentage:{
            handler(newval,oldval){
                this.flag=false;
                if(newval && newval>0){
                    if(newval > 100){
                        this.$set(this.config.data,0,100)
                    }else{
                        this.$set(this.config.data,0,newval)
                    }
                }else{
                    this.$set(this.config.data,0,0)
                }
                this.$nextTick(()=>{
                    this.flag=true;
                })
            },
            immediate:true
        }
    }
}
</script>
<style lang='scss'>
.water{
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
<style lang="scss" scoped>
.usegas-water{
    width: 100%;
    height: 100%;
    position: relative;
    .primary{
        width: 22px;
        border: 2px solid #B4E6DB;
        position: absolute;
        top: 0;
        left: 76px;
        bottom: 5px;
    }
    p{
        margin: 0;
        padding-top: 14px;
        text-align: center;
        line-height: 20px;
        font-size: 14px;
        font-weight: 500;
        color: #303133; 
    }
    .bg{
        width:100%;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>
