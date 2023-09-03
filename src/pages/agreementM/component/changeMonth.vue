
<template>
   <div class="selectMonthBoxSquare rel clearFixed" id="boxArea">
       <!-- el-input输入框：readonly和clearable属性不能同时使用 -->
       {{inputValue}}

        <el-input class="inputStyle" @change="jjjj" v-model="inputValue" type="text" placeholder="请选择查询月份" readonly @focus="showBox = true">
            <i slot="prefix" class="el-input__icon el-icon-date"></i>
            <!-- 清空图标：有内容的时候渲染出来，鼠标hover到input框的时候再显示出来（即：输入框有内容并且鼠标悬浮时显示该图标） -->
            <i slot="suffix" class="el-input__icon el-icon-circle-close clearIconStyle" v-if="showClear" @click="resetMonth"></i>
        </el-input>
        <!-- 年份月份选择弹框 -->
        <div class="selectContentBox" v-if="showBox">
           <div class="contentArea">
               <!-- 年份 -->
               {{curIndex}}
                <div class=" flex-wrap flex-around" style="padding: 15px 0;border-bottom: 1px solid #e5e5e5;">
                    <div class="top-title">
                    <div class="cursor" v-if="curIndex == DateList.length - 1" style="width: 15%;"><i class="el-icon-arrow-left"></i></div>
                    <div class="cursor" v-else @click="reduceYear" style="width: 15%;"><i class="el-icon-arrow-left"></i></div>
                        <div>{{OneY}}年</div>
                        <div class="cursor t-r" v-if="curIndex == 0" style="width: 15%;"><i class="el-icon-arrow-right"></i></div>
                        <div class="cursor t-r" v-else @click="addYear" style="width: 15%;"><i class="el-icon-arrow-right"></i></div>
                    </div>
                <!-- 月份 -->
                <div class="conterList">
                    <el-checkbox-group class=" flex-wrap" v-model="optTime[curIndex].queryTime" @change="onChange" >
                        <el-checkbox class="onSelect flex-x-center" v-for="(item,index) in DateList[curIndex].queryTime" :key="index" :label="`${DateList[curIndex].TimeYear}-${(item<=9)?`0${item}`:item}`">
                        {{monthMap[item]}}月
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <!-- 按钮 -->
            <div class="buttonBox t-r">
                <el-button class="buttonStyle" size="mini" type="primary" plain @click.stop="handleSubmit">确定</el-button>
                <el-button class="buttonStyle" size="mini" plain @click.stop="resetMonth">重置</el-button>
            </div>
       </div>
   </div>
   </div>
</template>
<script>
export default {
    data(){
        return{
            DateList: [], // 年份月份数组
            optTime: [], // 月份选中结果数组
            OneY: '', // 当前年份
            curIndex: 0, // 当前年份下标值
            optTimes: [], // 点击月份时的所有选中结果
            resultTimes: [], // 点击“确定”按钮后的选择结果
            showBox: false, // 是否显示月份选择弹框
            inputValue: '', // 输入框的绑定值
            showClear: false, // 是否显示输入框右边的“清空”小图标
            monthMap: { // 月份显示为中文
                '1': '一',
                '2': '二',
                '3': '三',
                '4': '四',
                '5': '五',
                '6': '六',
                '7': '七',
                '8': '八',
                '9': '九',
                '10': '十',
                '11': '十一',
                '12': '十二',
            }
        }
    },
    created(){
        this.init();
    },
    watch:{
        inputValue: {
      immediate: true,
      handler: function (n, o) {
        if (n && o) {
            console.log('chufale---------')
         this.$emit('inputValue',this.inputValue)
        }
      },
    }

    },
    mounted() {
        
        //点击弹框外的任意位置关闭区域弹窗
        document.addEventListener('click',(e) => {
            //获取弹窗对象
            const boxArea = document.getElementById('boxArea');
            //判断弹窗对象中是否包含点击对象
            if(boxArea &&　!boxArea.contains(e.target)) {
                // 判断当前选中月份与上次点击“确定”按钮时的选择结果是否一致
                let equalArr = this.resultTimes.sort().toString() == this.optTimes.sort().toString()
                if(!equalArr) {
                    // 如果不一致（因为是多选，所以必须是点击了“确定”按钮后才能进行查询）：
                    // 将选择结果恢复到上次点击“确定”按钮时的结果
                    this.optTimes = this.resultTimes
                    // 将输入框的值恢复到上次点击“确定”按钮时的值
                    this.inputValue = this.optTimes.join(',')
                    // 根据输入框是否有值来判断清空图标是否渲染
                    this.showClear = this.inputValue == '' ? false : true
                    // 将月份选中结果恢复到上次点击“确定”按钮时的选中月份
                    let _opt = this.resultTimes.map(v => { return v.substring(0,4) });
                    for( let item in this.optTime ){
                        this.optTime[item].queryTime = []
                        _opt.map((items,indexs)=>{
                            if( items == this.optTime[item].TimeYear ){
                                this.optTime[item].queryTime.push(this.resultTimes[indexs])
                            }
                        })
                    }
                }
                // 关闭弹框
                this.showBox = false;
            }
        })
    },
    methods:{
        jjjj(){
            console.log('hhhhhhh')
          this.$emit('inputValue',this.inputValue)
        },
        // 初始化数据，获取前20年，然后循环 每一年里面都有12个月的 得到数组 opTime 和 DateList
        init(){
            const _this = this;
            let _opt = [];
            let _optTime = []
            let arr = new Array(12);
            let optDate = this.getDateList();
            optDate.map((item,index)=>{
                // 月份选择时el-checkbox-group绑定的值
                _optTime[index] = {
                    TimeYear: item,
                    queryTime: []
                }
                // 给每一年份设置12个月份，el-checkbox初始化显示时使用
                _opt[index] = {
                    TimeYear: item, 
                    queryTime: []
                }
                for(let i = 1; i<= arr.length; i++){
                     _opt[index].queryTime.push(i)
                }
            })
            _this.optTime = _optTime
            _this.DateList = _opt;
        },
        // 获取近20年年份列表，倒序排列，最新一年在最前面
        getDateList(){
            let Dates = new Date();
            let year = Dates.getFullYear();
            this.OneY = year;
            let  optDate = [];
            for( let i = year - 20; i <= year; i++ ){
                optDate.push(i)
            }
            return optDate.reverse()
        },
        // 确定
        handleSubmit(){
            const _this = this;
            // 更新输入框的值
            _this.inputValue = _this.optTimes.join(',')
            // 根据输入框是否有值来判断清空图标是否渲染
            _this.showClear = _this.inputValue == '' ? false : true
            // 将点击“确定”按钮的选择结果保存起来（该值将在哪里使用：在点击弹框以外区域关闭弹框时使用，mounted中）
            _this.resultTimes = _this.optTimes
            // 关闭弹框
            _this.showBox = false
            _this.$emit('submitBtn',_this.resultTimes)
        },
        // 重置
        resetMonth() {
            const _this = this;
            // 将年份重置到当前年份
            let Dates = new Date();
            let year = Dates.getFullYear();
            _this.OneY = year;
            // 将已选择的月份清空
            _this.optTimes = [];
            for( let i in _this.optTime  ){
                _this.optTime[i].queryTime =[]
            }
            // 将输入框清空
            _this.inputValue = ''
            // 根据输入框是否有值来判断清空图标是否渲染，此处必然不渲染
            this.showClear = false
            // 将点击“确定”按钮的选择结果清空
            _this.resultTimes = []
            // 关闭月份选择弹框
            _this.showBox = false
            _this.$emit('resetBtn')
            this.$emit('inputValue',this.inputValue)
        },
        // 左上角年份减少
        reduceYear() {
            console.log('zuobian')
            const _this = this;
            // 如果已经是最后一年了，则年份不能再减少了
            if(_this.curIndex == _this.DateList.length - 1) return;
            // 当前下标值+1，根据下标值获取年份值
            _this.curIndex = _this.curIndex + 1
            _this.OneY = _this.DateList[_this.curIndex].TimeYear
        },
        // 左上角年份增加
        addYear() {
            const _this = this;
            // 如果已经是当前年份了，则年份不能再增加了
            if(_this.curIndex == 0) return;
            console.log(_this.curIndex)
            // 当前下标值-1，根据下标值获取年份值
            _this.curIndex = _this.curIndex - 1
             console.log(_this.curIndex)
            console.log(this.DateList)
            _this.OneY = _this.DateList[_this.curIndex].TimeYear
             console.log(_this.OneY)
       },
        // 选择月份
        onChange(){
            
            const _this = this;
            // 遍历optTime中已选择的月份，将已选结果塞到optTimes数组中
            let _opt = _this.optTime;
            let arr = [];
             for(let item in _opt ){
                if(_opt[item].queryTime.length > 0)  _opt[item].queryTime.filter( v => { arr.push(v) })
             }
            _this.optTimes = arr
            // 更新输入框的值
            _this.inputValue = _this.optTimes.join(',')
            // 根据输入框是否有值来判断清空图标是否渲染
            _this.showClear = _this.inputValue == '' ? false : true
           this.$emit('inputValue',this.inputValue)
        }
    }
}
</script>
<style lang="scss">
 
.selectMonthBoxSquare {
    margin-top: 10px;
    width: 250px;
    .inputStyle {
        width: 250px;
    }
    .clearIconStyle {
        display: none;
    }
    .inputStyle:hover .clearIconStyle{
        display: block;
    }
    .selectContentBox {
        position: absolute;
        top: 35px;
        left: 0;
        z-index: 2021;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 3px;
        .top-title{
            display: flex;
        }
        .contentArea {
            width: 330px;
        }
    }
    .conterList{
        text-align: center;
        .onSelect{
            width: 25% !important;
            margin: 20px 0 !important;
        }
        .columWidth {
            width: 33.33%;
        }
        .el-checkbox__input {
            display: none !important;
        }
        .el-checkbox__label {
            padding-left: 0px !important;
        }
    }
    .selectBox {
        width: 100px;
        
        input {
            height: 25px;
            line-height: 25px;
        }
        .el-input .el-input__icon {
            line-height: 25px;
        }
    }
    .tagStyle {
        margin-right: 10px;
        height: 25px;
        line-height: 25px;
    }
    .lableStyle {
        font-size: 14px;
    }
    .el-button--mini {
        padding: 5px 15px;
        font-size: 12px;
        border-radius: 3px;
    }
    .buttonBox {
        border-top: 1px solid #e5e5e5;
        padding: 10px 10px 10px 0;
    }
}
</style>