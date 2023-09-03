
<template>
   <div class="settlement-period" id="boxArea1">
       <el-input class="inputStyle"  v-model="inputValue" type="text" placeholder="请选择结算周期" readonly @focus="showBox = true">
            <i slot="prefix" class="el-input__icon el-icon-date"></i>
            <!-- 清空图标：有内容的时候渲染出来，鼠标hover到input框的时候再显示出来（即：输入框有内容并且鼠标悬浮时显示该图标） -->
            <i slot="suffix" class="el-input__icon el-icon-circle-close clearIconStyle" v-if="showClear" @click="resetMonth"></i>
        </el-input>
        <div class="change-content" v-if="showBox">
            <el-tabs tab-position="left" v-model="activeName"  @tab-click="tabhandleClick">
            <el-tab-pane label="月" name="3">
                <div class="data-day-type">
                    <div class="day-item">
                            <el-select style="border:1px solid #E4E7ED"  v-model="form.expirationCycleTypeLeft" placeholder="请选择">
                                <el-option
                                v-for="item in expirationCycleListType1"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                                </el-option>
                            </el-select>
                            <ul class="itemV">
                                <li v-for="(item,index) in expirationCycleListLeft" :key="index"
                                @click="monthCheckedFirst(item,index)"
                                >
                                <span  :class="{'checkC':monthIscheckedFirst == index}">{{item.label}}</span>        
                                </li>
                            </ul>
                    </div>
                    <div class="day-item">
                        <el-select class="custem-select" style="border:1px solid #E4E7ED" v-model="form.expirationCycleTypeRight" placeholder="请选择">
                            <el-option
                            v-for="item in expirationCycleListType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <ul class="itemV">
                            <li v-for="(item,index) in expirationCycleListLeft" :key="index"
                            @click="monthCheckedSecond(item,index)"
                            >
                            <span  :class="{'checkC':monthIscheckedSecond ==index}">{{item.label}}</span> 
                            </li>
                        </ul>
                    </div>
                 </div>
                <div class="buttonBox t-r">
                    <el-button class="buttonStyleC" size="mini" plain @click.stop="resetMonth">清空</el-button>
                    <el-button class="buttonStyleS" size="mini"  plain @click.stop="handleSubmit">确定</el-button> 
                </div>
            </el-tab-pane>
            <el-tab-pane label="双周" name="2">
                <div class="data-day-type">
                    <div class="day-item">
                            <el-input v-model="one"></el-input>
                            <ul class="itemV">
                                <li v-for="(item,index) in expirationCycleListLeft" :key="index"
                                @click="weekCheckedFirst(item,index)"
                                >
                                <span  :class="{'checkC':weekIscheckedFirst==index}">{{item.label}}</span>
                                    
                                </li>
                            </ul>
                    </div>
                    <div class="day-item">
                        <el-input v-model="two"></el-input>
                        <ul class="itemV">
                            <li v-for="(item,index) in expirationCycleListLeft" :key="index"
                            @click="weekCheckedSecond (item,index)"
                            >
                            <span  :class="{'checkC':weekIscheckedSecond==index}">{{item.label}}</span> 
                            </li>
                        </ul>
                    </div>
                    <div class="day-item">
                        <el-input v-model="three"></el-input>
                        <ul class="itemV">
                            <li v-for="(item,index) in expirationCycleListLeft" :key="index"
                            @click="weekCheckedthird(item,index)"
                            >
                            <span  :class="{'checkC':weekIscheckedThird==index}">{{item.label}}</span> 
                            </li>
                        </ul>
                    </div>
                    <div class="day-item">
                        <el-input v-model="four"></el-input>
                        <ul class="itemV">
                            <li v-for="(item,index) in expirationCycleListLeft" :key="index"
                            @click="weekCheckedFourth(item,index)"
                            >
                            <span  :class="{'checkC':weekIsCheckedFourth==index}">{{item.label}}</span> 
                            </li>
                        </ul>
                    </div>
                 </div>
                <div class="buttonBox t-r">
                    <el-button class="buttonStyleC" size="mini" plain @click.stop="weekResetMonth">清空</el-button>
                    <el-button class="buttonStyleS" size="mini"  plain @click.stop="weekHandleSubmit">确定</el-button> 
                </div>
            </el-tab-pane>
            
        </el-tabs>    
        </div>
   </div>
</template>
<script>
import Labels from '@antv/g2/lib/component/labels';
import {
  getCusYear,
  getCusYear1,
  publicLableValueC
} from "../utils/commen"
export default {
    props:["expirationCycleO","settlementPeriod","settlementPeriodType","settlementPeriod1"],
    data(){
        return{
            activeName:'3',
            ischeckedFirst:'-1',
            ischeckedSecond:'-1',
            monthIscheckedFirst:'-1',
            monthIscheckedSecond:'-1',
            weekIscheckedFirst:'-1',
            weekIscheckedSecond:'-1',
            weekIscheckedThird:'-1',
            weekIsCheckedFourth:'-1',
            // 已选值
            monthFirstV:'',
            monthSecondV:'',
            weekFirstV:'',
            weekSecondV:'',
            weekThird:'',
            weekFourthV:'',
            inputValue:'',
            one:'第一周开始时间',
            two:'第一周结束时间',
            three:'第二周开始时间',
            four:'第二周结束时间',
             expirationCycleListType1:[
                {
                    label:'本月',
                    value:'1'
                },{
                    label:'上月',
                    value:'2'
                }
            ],
            expirationCycleListType:[
                {
                    label:'本月',
                    value:'1'
                },{
                    label:'次月',
                    value:'2'
                }
            ],
            weekType:[
                {
                    label:'本月',
                    value:'1'
                },{
                    label:'次月',
                    value:'2'
                }
            ],
            expirationCycleListLeft:[
               {
                    label:'1日',
                    value:'1'
                },{
                    label:'2日',
                    value:'2'
                },{
                    label:'3日',
                    value:'3'
                },{
                    label:'4日',
                    value:'4'
                },{
                    label:'5日',
                    value:'5'
                },{
                    label:'6日',
                    value:'6'
                },{
                    label:'7日',
                    value:'7'
                },{
                    label:'8日',
                    value:'8'
                },{
                    label:'9日',
                    value:'9'
                },{
                    label:'10日',
                    value:'10'
                },{
                    label:'11日',
                    value:'11'
                },{
                    label:'12日',
                    value:'12'
                },{
                    label:'13日',
                    value:'13'
                },{
                    label:'14日',
                    value:'14'
                },{
                    label:'15日',
                    value:'15'
                },{
                    label:'16日',
                    value:'16'
                },{
                    label:'17日',
                    value:'17'
                },{
                    label:'18日',
                    value:'18'
                },{
                    label:'19日',
                    value:'19'
                },{
                    label:'20日',
                    value:'20'
                },{
                    label:'21日',
                    value:'21'
                },{
                    label:'22日',
                    value:'22'
                },{
                    label:'23日',
                    value:'23'
                },{
                    label:'24日',
                    value:'24'
                },{
                    label:'25日',
                    value:'25'
                },{
                    label:'26日',
                    value:'26'
                },{
                    label:'27日',
                    value:'27'
                },{
                    label:'28日',
                    value:'28'
                },{
                    label:'29日',
                    value:'29'
                },{
                    label:'30日',
                    value:'30'
                },{
                    label:'31日',
                    value:'31'
                }
            ],
            showClear:'',
            form:{
                showClear: false, // 是否显示输入框右边的“清空”小图标
               expirationCycleStartTime:'',
               expirationCycleEndTime:'',
               expirationCycleTypeLeft:'1',
               expirationCycleTypeRight:'1',
               expirationCycleRight:'',
               expirationCycleLeft:''
            },
            showBox: false, // 是否显示月份选择弹框
            leftV:'',
            rightV:''
        }
    },
    created(){
        // this.init();
    },
    computed:{

    },
    watch:{
    },
    mounted() {
            this.huixian()
                //点击弹框外的任意位置关闭区域弹窗
        document.addEventListener('click',(e) => {
            //获取弹窗对象
            const boxArea = document.getElementById('boxArea1');
            //判断弹窗对象中是否包含点击对象
            if(boxArea &&　!boxArea.contains(e.target)) {
                this.showBox = false;
            }
        })
    },
    methods:{
        tabhandleClick(val){
        },
         huixian(){
                if(this.settlementPeriod1 &&this.settlementPeriod1.length=='4'){   
                     this.inputValue = this.settlementPeriod1[0]+''+this.settlementPeriod1[1]+ '-'+this.settlementPeriod1[2]+''+this.settlementPeriod1[3]
                }
                // 判断是双周还是月
                if(this.settlementPeriodType =='3'){
                    this.form.expirationCycleTypeLeft = this.settlementPeriod1[0] =='本月'?'1':'2'
                    this.form.expirationCycleTypeRight = this.settlementPeriod1[2] =='本月'?'1':'2'
                    this.expirationCycleListLeft.forEach((item,index)=>{
                        if(this.settlementPeriod1[1] == item.label){
                          this.monthIscheckedFirst = index
                          this.monthFirstV = item
                        }
                    })
                    this.expirationCycleListLeft.forEach((item,index)=>{
                        if(this.settlementPeriod1[3] == item.label){
                          this.monthIscheckedSecond = index
                          this.monthSecondV = item
                        }
                    })
                        let obj ={}
                        obj.typeL = this.form.expirationCycleTypeLeft 
                        obj.typeR = this.form.expirationCycleTypeRight
                        obj.valueL= this.monthFirstV.label
                        obj.valueR= this.monthSecondV.label
                        this.activeName = '3'
                        this.$emit('MonthObj',obj)
                        this.$emit('monthOrweek',this.activeName)
                }else if(this.settlementPeriodType =='2'){
                     this.expirationCycleListLeft.forEach((item,index)=>{
                        if(this.settlementPeriod1[0] == item.label){
                           this.weekIscheckedFirst = index
                          this.weekFirstV = item
                        }
                    })
                    this.expirationCycleListLeft.forEach((item,index)=>{
                        if(this.settlementPeriod1[1] == item.label){
                            this.weekIscheckedSecond =index
                            this.weekSecondV =item
                        }
                    })
                    this.expirationCycleListLeft.forEach((item,index)=>{
                        if(this.settlementPeriod1[2] == item.label){
                            this.weekIscheckedThird = index
                            this.weekThird = item
                        }
                    })
                    this.expirationCycleListLeft.forEach((item,index)=>{
                        if(this.settlementPeriod1[3] == item.label){
                           this.weekIsCheckedFourth = index
                           this.weekFourthV = item
                        }
                    })
              
                    let obj = {}
                    obj.firstV= this.weekFirstV.label
                    obj.secondV = this.weekSecondV.label
                    obj.thirdV = this.weekThird.label
                    obj.fourthV = this.weekFourthV.label
                    this.activeName = '2'
                    this.$emit('weekObj',obj)
                    this.$emit('monthOrweek',this.activeName)
                    
                }     
        },
        handleSubmit(){
            this.showBox = false
            if(this.monthFirstV && this.monthSecondV){
             this.inputValue = publicLableValueC(this.expirationCycleListType1,this.form.expirationCycleTypeLeft)+ this.monthFirstV.label +'-'+publicLableValueC(this.expirationCycleListType,this.form.expirationCycleTypeRight)+ this.monthSecondV.label
             }
            let obj ={}
            obj.typeL = this.form.expirationCycleTypeLeft 
            obj.typeR = this.form.expirationCycleTypeRight
            obj.valueL= this.monthFirstV.label
            obj.valueR= this.monthSecondV.label
            console.log(this.monthFirstV)
            console.log(obj)
            this.$emit('MonthObj',obj)
            this.$emit('monthOrweek',this.activeName)
       },
            // 重置
        resetMonth() {
           this.inputValue = ''
        },
        weekResetMonth(){
          this.inputValue = ''
        },
        weekHandleSubmit(){
          this.showBox = false
          if(this.weekFirstV && this.weekSecondV && this.weekThird &&this.weekFourthV){
                //  this.inputValue = publicLableValueC(this.expirationCycleListType,this.form.expirationCycleTypeLeft)+''+ this.leftV.label +'-'+publicLableValueC(this.expirationCycleListType,this.form.expirationCycleTypeRight)+this.rightV.label
            this.inputValue =  this.weekFirstV.label +'-'+this.weekSecondV.label+','+this.weekThird.label+'-'+this.weekFourthV.label
            }
            let obj = {}
            obj.firstV= this.weekFirstV.label
            obj.secondV = this.weekSecondV.label
            obj.thirdV = this.weekThird.label
            obj.fourthV = this.weekFourthV.label
            this.$emit('weekObj',obj)
            this.$emit('monthOrweek',this.activeName)
        },
        monthCheckedFirst(item,index){
          this.monthIscheckedFirst =index
          this.monthFirstV = item
        },
        monthCheckedSecond(item,index){
          this.monthIscheckedSecond =index
          this.monthSecondV = item
        },
        weekCheckedFirst(item,index){
            this.weekIscheckedFirst = index
            this.weekFirstV = item
            // this.leftV = item

        },
        weekCheckedSecond(item,index){
          this.weekIscheckedSecond =index
          this.weekSecondV =item
        },
        weekCheckedthird(item,index){
         this.weekIscheckedThird = index
         this.weekThird = item
        },
        weekCheckedFourth(item,index){
         this.weekIsCheckedFourth = index
         this.weekFourthV = item
        },
        checkedRight(item,index){
            this.ischeckedR = index
             this.rightV = item   
        },
    
    }
}
</script>
<style lang="scss">
  .settlement-period{
     .change-content{
         border: 1px solid #E4E7ED;
        position: absolute;
        z-index: 1700;
        background: #fff;
        top: 50px;
        border-radius: 4px;
            width: 650px;
         .data-day-type{
             display: flex;
             .day-item{
                 flex: 1;
                 margin: 5px;
                  border: 1px solid #E4E7ED;
                  .custem-select{

                  }
                  /deep/.el-select{
                     border: 1px solid #E4E7ED!important;
                      .el-input__inner{
                         border: 1px solid #E4E7ED!important;
                      }
                  }
                 /deep/.el-input__inner{
                     text-align: center;
                     border: 1px solid #E4E7ED;
                 }
                 .itemV{
                         height: 180px;
                        overflow: auto;
                        background: #fff;
                        text-align: center;
                        border: 1px solid #E4E7ED;
                        margin-top: 10px;
                        .checkC{
                            background: #47A87D;
                            border-radius: 4px;
                            padding: 8px 15px;
                            color: #fff;
                        }
                 }
             }
             
         }
         .data-day-value{

         }

     }
     .buttonBox{
                 text-align: right;
                 margin-right: 16px;
                 .buttonStyleC{
                     color: #47A87D;
                     border: none;
                 }
                 .buttonStyleS{
                     color: #000000;
                     border: 1px solid #DCDFE6;
                     border-radius: 12px;
                    //  border: none;
                 }
             }
  }
</style>