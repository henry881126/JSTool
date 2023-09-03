<!--
  * @Description:下拉框组件
  * @Author:jiawenjin
  * @Date:2021-10-12
-->
<template>
<!-- 下拉框组件html结构（子组件） -->
<div class="select-box" @click="changeStatus">
<!-- changeStatus事件: 点击实现下拉框的显示和隐藏 -->
<h3 class="select-title"
 :name="selectData.selectOptions[selectData.defaultIndex].name"
 :class="{'title-active': selectData.selectStatus}"> 
 <!--属性name class的动态绑定-->
 {{ selectData.selectOptions[selectData.defaultIndex].context }} 
 <!--这里主要绑定选择的数据-->
</h3>
<transition name="slide-down">
<!--transition 实现下拉列表显示隐藏时的动画-->
<ul class="select-options" v-show="selectData.selectStatus">
 <li class="options-item" 
  v-for="(item,index) in selectData.selectOptions"
  :key="index"
  @click="EmitchangeOption(index)"
  :class="{'option-active':selectData.defaultIndex===index}">
  <!--
   v-for：循环数据渲染下拉列表
   EmitchangeOption：点击下拉列表事件
   class：动态绑定被选中的数据
  -->
  {{ selectData.selectOptions[index].context }}
  
 </li>
</ul> 
</transition> 
</div> 
</template>
<script>
export default{
 name: 'oSelect', //建议大家都写上这个，有利于我们知道这个组件叫什么名字
 //通过props来接收父组件传过来的数据
 props:{
  selectData: {
  type: Object //规定传过来的数据为对象，否则就会报错（其实这样写就是规避错误和良好的习惯）
  }
 },
 methods:{
  EmitchangeOption(index){
  this.$emit('changeOption',index);
   // 通过点击事件触发EmitchangeOption函数，传入当前点击下拉列表中的索引值index
   // 下拉框通过emit方法触发父组件中changeOption函数，动态传给父组件需要的数据，这里为索引值
  },
  changeStatus(){
   // 通过changeStatus事件动态改变selectStatus的值，从而控制下拉框的显示隐藏
   this.$emit('changeShowStatus');
  
  }
 }
}
</script>
<style>
.select-box{
    position: relative;
    width:100%;
    line-height: 35px;
    z-index:111;
}
.select-title{
    position: relative;
    width: 100%;
    height: 100%;
    margin:0;
    color: #fff;
    font-size: 14px;
    line-height: 28px;
    text-indent: 15px;
    font-weight: normal;
    border-radius: 14px;
    transition-duration: 300ms;
    cursor: pointer;
    background: #47A87D;
}
.select-title:after{
    content: '';
    position: absolute;
    height: 0;
    width: 0;
    border-top: 6px solid #fff;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    right: 15px;
    top: 0;
    bottom: 0;
    margin: auto;
    transition-duration: 300ms;
    transition-timing-function: ease-in-out;
}
.title-active:after{
    transform: rotate(-180deg);
}
.select-options{
    margin: 0;
    padding:0;
    width: 100%;
    height: auto;
    max-height: 150px;
    position: absolute;
    top: 35px;
    border-radius: 4px;
    background:#fff;
    border:1px solid #E8E8E8;
    overflow: auto;
}
.options-item{
    list-style: none;
    font-size:12px;
    padding:0 15px;
    color:#303133;
    cursor: pointer;
    transition-duration: 300ms;
}
.options-item:hover,.option-active{
    background: #EEF0F7;
}
<!--下拉框显示隐藏动画-->
.slide-down-enter-active,.slide-down-leave{
    transition: all .3s ease-in-out;
    transform-origin:0 top;
    transform: scaleY(1);
}
.slide-down-enter{
    transform: scaleY(0);
}
.slide-down-leave-active{
    transition: all .3s ease-in-out;
    transform-origin:0 top;
    transform: scaleY(0);
}
</style>