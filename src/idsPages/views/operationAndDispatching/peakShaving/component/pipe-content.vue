<!--
  * @Description:管存详情页面管段图组件
  * @Author:jiawenjin
  * @Date:2021-11-02
-->
<template>
    <div class="content">
        <h5>{{arrInfo.pipesName?arrInfo.pipesName:'全部管存'}}</h5>
        <div class="center-rect" @click="changeMap(arrInfo)">
            <div class="rect-left" :style="{background:arrInfo.pipesRate>20?'#0074FF':'#fff'}"></div>
            <div class="rect" v-if="arrInfo!==null || arrInfo!=='null'" :style="{width:`${arrInfo.width}px`}">
                <div :style="{width:`${arrInfo.pipesRate}%`}"></div>
                <p class="lower" :style="{background:arrInfo.pipesRate>20?'#0074FF':'none'}"></p>
                <p class="up">
                    <span v-show="arrInfo.pipesRate>80" :style="{width:`${(arrInfo.pipesRate - 80)/20*100}%`}"></span>
                </p>
                <el-tooltip placement="top">
                    <div slot="content">管存上限：{{arrInfo.pipesUpVolume}}万m³<br/>管存下限：{{arrInfo.pipesLowerVolume}}万m³<br/></div>
                    <div style="width:100%;background:transparent"></div>
                </el-tooltip>
            </div>
            <div class="rect-right" :style="{background:arrInfo.pipesRate>=100?'#F5222D':'#fff'}"></div>
        </div>
        <div class="bottom" v-if="arrInfo!==null || arrInfo!=='null'">
            <span v-if="!arrInfo.width">全网管存上限:{{arrInfo.pipesUpVolume?arrInfo.pipesUpVolume:'-'}}万m³</span>
            <span>{{!arrInfo.width?'全网':''}}当前管存:{{arrInfo.pipesVolume}}万m³</span>
            <span>{{!arrInfo.width?'全网':''}}可用管存:{{arrInfo.usableVolume}}万m³</span>
            <span>{{!arrInfo.width?'全网':''}}管存占比:{{arrInfo.pipesRate}}%</span>
            <span v-if="!arrInfo.width">可用时间:{{arrInfo.usableHour?arrInfo.usableHour:'-'}}h</span>
        </div>
        
    </div>
</template>
<script>
export default{
    props:{
        arrInfo:{
            type:Object,
            default:{}
        }
    },
    data(){
        return{

        }
    },
    methods:{
        changeMap(val){
            let params = {
                pipesKey:val.pipesKey,//val.pipesKey,
                pipesType:val.pipeType
            }
            this.$emit('changePipes',params)
        }
    }
}
</script>
<style scoped lang="scss">
*{
    margin:0;
    padding:0;
}
.content{
    width:100%;
    h5{
        margin-bottom: 5px;
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        line-height: 20px;
        &::before{
            content: "";
            display: inline-block;
            width: 12px;
            height: 12px;
            margin: -2px 5px 0 0;
            vertical-align: middle;
            background: #47A87D;
        }
    }
    .center-rect{
        display:flex;
        align-items: center;
        .rect-left,
        .rect-right{
            width: 6px;
            height: 28px;
        }
        .rect-left{
            border-radius: 0px 100px 100px 0px;
            border: 1px solid #0074FF;
        }
        .rect-right{
            border-radius: 100px 0px 0px 100px;
            border: 1px solid #47A87D;
        }
        .rect{
            width:100%;
            height:20px;
            cursor: pointer;
            position: relative;
            border-radius: 4px;
            margin: 0 2px;
            border: 1px solid #47A87D;
            overflow: hidden;
            div{
                position: absolute;
                left: 0;
                top: 0;
                width:0%;
                height: 20px;
                background:#47A87D;
            }
            p{
                position: absolute;
                width:20%;
                height:20px;
                top: 0; 
                span{
                    display: block;
                    height: 20px;
                    background: #F5222D;
                }
            }
            .lower{
                left:0%;
                border-right:2px solid #0074FF;
            }
            .up{
                right: 0%;
                border-left:2px solid #F5222D;
            }
        }
    }
    .bottom{
        width:auto;
        display: flex;
        box-sizing: border-box;
        span{
            color: #303133;
            font-size: 12px;
            line-height: 17px;
            margin-right: 10px;
            
        }
        &:hover{
            span{
                cursor: pointer;
                color: #F5222D;
            }    
        }
    }
}
</style>
