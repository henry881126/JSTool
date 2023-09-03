<template>
  <div class="dispatchingHome_list_container">
    <el-button type="primary" round size="medium" @click="showListEvent('station')">场站状态监控</el-button>
    <el-button type="primary" round size="medium" @click="showListEvent('customer')">重点客户监控</el-button>
    <!-- 场站列表 -->
    <div class="popup_list_box" v-show="isStationShow">
      <h1 class="title">
        <span class="name">场站列表</span>
        <a class="btn_close" @click="closeEvent"></a>
      </h1>
      <div class="search_box">
        <div class="main">
          <i class="icon"></i>
          <input type="text" maxlength="50" v-model="stationSearchWords" @blur="searchEvent"/>
        </div>
      </div>
      <div class="scroll_box enn_scroll">
        <ul class="popup_list">
          <li v-for="(item,index) in stationList" 
              :key="index" 
              @click="chooseItem(item,index)"
              :class="{clicked:item.chooseState}">
            <span class="name">{{item.stationName}}</span>
            <i class="icon"></i>
          </li>
        </ul>
      </div>      
    </div>
    <!-- 客户列表 -->
    <div class="popup_list_box" v-show="isCustomerShow">
      <h1 class="title">
        <span class="name">重点客户列表</span>
        <a class="btn_close" @click="closeEvent"></a>
      </h1>
      <div class="search_box">
        <div class="main">
          <i class="icon"></i>
          <input type="text" maxlength="50" v-model="customerSearchWords" @blur="searchEvent"/>
        </div>
      </div>
      <div class="scroll_box enn_scroll">
        <ul class="popup_list">
          <li v-for="(item,index) in customerList" 
              :key="index" 
              @click="chooseItem(item,index)"
              :class="{clicked:item.chooseState}">
            <span class="name">{{item.stationName}}</span>
            <i class="icon"></i>
          </li>
        </ul>
      </div>      
    </div>   
  </div>
</template>

<script>
import {getStationList,getCustomerList} from "@/idsPages/api/operationSituation"
import {PointType} from "@/idsPages/utils/mapConstants"
export default {
  data(){
    return{
      customerList:[],
      stationList:[],
      isCustomerShow:false,
      isStationShow:false,
      historyIndex:null,
      stationSearchWords:'',
      customerSearchWords:'',
      timer:null,
      originStationData:[], //场站原始数据
      originCustomerData:[],  //客户原始数据
    }
  },
  props:{
    popupDataCancel:Object,
    changeAllPopupList:Object,
    pressurePointDataFlag:Boolean,
    customerPointDataFlag:Boolean,
  },
  watch:{
    popupDataCancel:{
      handler(newVal){
        if(newVal.type == PointType.Station || newVal.type == PointType.Pressure){
          for(let i = 0; i < this.stationList.length; i ++){
            if(this.stationList[i].stationId == newVal.stationId){
              this.stationList.splice(i,1,newVal);
              break;             
            }
          }
          for(let j= 0; j < this.originStationData.length; j ++){
            if(newVal.stationId === this.originStationData[j].stationId){
              this.originStationData.splice(j,1,newVal);
              break;
            }
          }
        }
        if(newVal.type == PointType.Customer){
          for(let i = 0; i < this.customerList.length; i ++){
            if(this.customerList[i].stationId == newVal.stationId){
              this.customerList.splice(i,1,newVal);
              break;
            }
          }
          for(let j = 0; j < this.originCustomerData.length; j ++){
            if(newVal.stationId === this.originCustomerData[j].stationId){
              this.originCustomerData.splice(j,1,newVal);
              break;
            }
          }
        }
      },
      deep:true,
    },
    changeAllPopupList:{
      handler(newVal){
        if(newVal.type == PointType.Customer){
          for(let i = 0; i < this.customerList.length; i ++){
            let item = this.customerList[i];
            item.chooseState = false;
            this.customerList.splice(i,1,item);
          }
          for(let j = 0; j < this.originCustomerData.length; j ++){
            let item = this.originCustomerData[j];
            item.chooseState = false;
            this.originCustomerData.splice(j,1,item);
          }
        }
        if(newVal.type == PointType.Pressure){
          for(let i = 0; i < this.stationList.length; i ++){
            let item = this.stationList[i];
            if(item.type == PointType.Pressure){
              if(!newVal.value){
                this.$set(item,'chooseState',false);
                this.stationList.splice(i,1,item);
                
              }
              
            }          
          }   
          for(let j = 0; j < this.originStationData.length; j ++){
            let item = this.originStationData[j];
            if(item.type == PointType.Pressure){
              if(!newVal.value){
                item.chooseState = false;
                this.originStationData.splice(j,1,item);
              }
            }
          }    
        }
        if(newVal.type == PointType.Station){
          for(let i = 0; i < this.stationList.length; i ++){
            let item = this.stationList[i];
            if(item.type == PointType.Station){
              if(newVal.value){
                this.$set(item,'chooseState',true);
              }else{
                this.$set(item,'chooseState',false);
              }
              this.stationList.splice(i,1,item);
            } 
          }   
          for(let j = 0; j < this.originStationData.length; j ++){
            let item = this.originStationData[j];
            if(item.type == PointType.Station){
              if(newVal.value){
                item.chooseState = true;
              }else{
                item.chooseState = false;
              }
              this.originStationData.splice(j,1,item);
              
            }
          }     
        }
      },
      deep:true,
    },
    pressurePointDataFlag:{
      handler(){
        this.getStationData();
      },
      
    },
    customerPointDataFlag:{
      handler(){
        this.getCustomerData();
      },
      
    },
  },
  
  methods:{
    showListEvent(type){
      if(type == 'station'){
        this.isStationShow = !this.isStationShow;
        this.isCustomerShow = false;
      }
      if(type == 'customer'){
        this.isCustomerShow = !this.isCustomerShow;
        this.isStationShow = false;
      }
    },
    closeEvent(){
      this.isStationShow = false;
      this.isCustomerShow = false;         
    },
    chooseItem(data,index){
      data.chooseState = !data.chooseState;
      if(this.isCustomerShow){
        // if(this.historyIndex !== null){
        //   this.customerList[this.historyIndex].chooseState = false;
        //   this.$set(this.customerList,this.historyIndex,this.customerList[this.historyIndex])
        // }
        this.customerList.splice(index,1,data);
        for(let i = 0; i < this.originCustomerData.length; i ++){
          if(data.stationId === this.originCustomerData[i].stationId){
            this.originCustomerData.splice(i,1,data);
            break;
          }
        }
        
      }
      if(this.isStationShow){
        // if(this.historyIndex !== null){
        //   this.stationList[this.historyIndex].chooseState = false;
        //   this.$set(this.stationList,this.historyIndex,this.stationList[this.historyIndex])
        // }
        this.stationList.splice(index,1,data);
        for(let j = 0; j < this.originStationData.length; j ++){
          if(data.stationId === this.originStationData[j].stationId){
            this.originStationData.splice(j,1,data);
            break;
          }
        }
      }
      this.$emit('notPopupCreate',false); //创建弹窗
      this.$emit('getChooseListData',data);
     // this.historyIndex = index;
    },
    searchEvent(){
      if(this.isCustomerShow){
        let customerList = this.fuzzySearchArr(this.customerSearchWords,this.originCustomerData,'stationName');
        this.customerList.splice(0,this.customerList.length,...customerList);
      }
      if(this.isStationShow){
        let stationList = this.fuzzySearchArr(this.stationSearchWords,this.originStationData,'stationName');
        this.stationList.splice(0,this.stationList.length,...stationList);
      }
    },
    //数组模糊搜索
    fuzzySearchArr(target,originArr,attribute){
      if(target && originArr && originArr.length){
        let tempArr = [];
        for(let i = 0; i < originArr.length; i ++){
          let origin = attribute ? originArr[i][attribute] : originArr[i];
          if(origin.indexOf(target) >= 0){
            tempArr.push(originArr[i]);
          }
          
        }    
        return tempArr;
      }else{
        return originArr;
      }
      
    },
    //获取场站列表
    getStationData(){  
      let params = {
        stationName:'',
      }    
      getStationList(params).then((res) => {
        if(res.data && res.data.length > 0){          
          if(this.stationList.length > 0){
            let newData = res.data, stationList2 = [];
            for(let i = 0; i < newData.length; i ++){
              newData[i].stationId = newData[i].domainCode + newData[i].stationId;  //stationId字段唯一性处理

              if(newData[i].domainCode == 'NGS.GGS'){                
                newData[i].chooseState = false;
                newData[i].type = PointType.Station;
              }
              if(newData[i].domainCode == 'NGS.RPS'){               
                newData[i].chooseState = false;                
                newData[i].type = PointType.Pressure;
              }
              for(let j = 0; j < this.stationList.length; j ++){
                if(this.stationList[j].stationId == newData[i].stationId){
                  newData[i].chooseState = this.stationList[j].chooseState;
                  stationList2.push(newData[i]);
                  
                  break;
                }
              }
              for(let k = 0; k < this.originStationData.length; k ++){
                if(this.originStationData[k].stationId == newData[i].stationId){
                  newData[i].chooseState = this.originStationData[k].chooseState;                 
                  break;
                }
              }
              if(newData[i].chooseState){
                this.$emit('notPopupCreate',true);  //不创建新弹窗
                this.$emit('getChooseListData',newData[i]);
              }
              
            }
            this.stationList.splice(0,this.stationList.length,...stationList2);
            
          }else{
            res.data.forEach(item => {
              item.stationId = item.domainCode + item.stationId;  //stationId字段唯一性处理
              if(item.domainCode == 'NGS.GGS'){
                item.chooseState = true;
                item.type = PointType.Station;
              }
              if(item.domainCode == 'NGS.RPS'){
                item.chooseState = false;
                item.type = PointType.Pressure;
              }
  
            });
            this.stationList = res.data;
          }
          
          this.originStationData = JSON.parse(JSON.stringify(res.data));
        }
        
      }).catch((error) => {
        console.log(error);
      });
      
    },
    //获取客户列表
    getCustomerData(){
      let params = {
        stationName:'',
      }    
      getCustomerList(params).then((res) => {
        if(res.data && res.data.length > 0){         
          if(this.customerList.length > 0){
            let newData = res.data, customerList2 = [];
            for(let i = 0; i < newData.length; i ++){
              newData[i].stationId = newData[i].domainCode + newData[i].stationId;  //stationId字段唯一性处理
              newData[i].chooseState = false;
              newData[i].type = PointType.Customer;

              for(let j = 0; j < this.customerList.length; j ++){
                if(this.customerList[j].stationId == newData[i].stationId){
                  newData[i].chooseState = this.customerList[j].chooseState;
                  customerList2.push(newData[i]);                  
                  break;
                }
              }
              for(let k = 0; k < this.originCustomerData.length; k ++){
                if(this.originCustomerData[k].stationId == newData[i].stationId){
                  newData[i].chooseState = this.originCustomerData[k].chooseState;                 
                  break;
                }
              }
              if(newData[i].chooseState){
                this.$emit('notPopupCreate',true);  //不创建新弹窗
                this.$emit('getChooseListData',newData[i]);
              }
              
            }
            this.customerList.splice(0,this.customerList.length,...customerList2);
          }else{
            res.data.forEach(item => {
              item.stationId = item.domainCode + item.stationId;  //stationId字段唯一性处理
              item.type = PointType.Customer;
              item.chooseState = false;
            });
            this.customerList = res.data;
          }
          
          this.originCustomerData = JSON.parse(JSON.stringify(res.data));
        }
        
      }).catch((error) => {
        console.log(error);
      });
    },
  },
}
</script>

<style lang="scss" scoped>
  .dispatchingHome_list_container{
    position: relative;
    .popup_list_box{
      width: 370px;
      background: #F5F7FA;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
      border: 1px solid #E4E7ED;
      padding:0px 10px 10px;
      box-sizing: border-box;
      position: absolute;
      z-index:2;
      top:50px;
      right: 0px;
      .title{
        width:100%;
        height: 45px;
        line-height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin:0px;
        .name{
          color: #303133;
          font-size:16px;
        }
        .name::before{
          content:"";
          display: inline-block;
          width:12px;
          height: 12px;
          background:#47A87D;
          margin-right:10px;
        }
        .btn_close{
          background:url("../../../../images/operationSituation/icon_close.png") no-repeat center center;
          background-size:100%;
          display: inline-block;
          width:14px;
          height: 14px;
          cursor: pointer;
        }
      }
      .search_box{
        background:#fff;
        height: 40px;
        box-sizing: border-box;
        padding:8px 7px 0px;
        .main{
          height: 24px;
          background: #F0F2F5;
          border-radius: 14px;
          padding:0 10px;
          display: flex;
          align-items: center;
          justify-content: left;
          .icon{
            background:url("../../../../images/operationSituation/search.png") no-repeat center center;
            background-size:100%;
            display: inline-block;
            width:16px;
            height: 16px;
          }
          input[type='text']{
            border: none;
            outline: none;
            background:none;
            margin-left:5px;
            font-size:12px;
            color:#303133;
            width:100%;
          }
        }
      }
      .scroll_box{
        max-height: 450px;
        overflow-y:auto;
      }
      .popup_list{
        border-top:solid 1px #F0F2F5;
        list-style-type: none;
        padding:0px;
        margin:0px;
        background:#fff;
        li{
          width:100%;
          box-sizing: border-box;
          line-height: 40px;
          border-bottom:solid 1px #F0F2F5;
          font-size:14px;
          font-weight: bold;
          color:#303133;
          display: flex;
          align-items:center;
          justify-content: space-between;
          padding:0px 5px 0px 20px;
          margin:0px;
          cursor: pointer;
          .icon{
            background:url("../../../../images/operationSituation/location.png") no-repeat center center;
            background-size:100%;
            display: inline-block;
            width:14px;
            height: 16px;
          }
          .name{
            display: inline-block;
            max-width: 340px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
          }
        }
        li.clicked{
          background:#F2F6FC;
          color:#47A87D;
          .icon{
            background:url("../../../../images/operationSituation/location_clicked.png") no-repeat center center;
            background-size:100%;
            display: inline-block;
            width:14px;
            height: 16px;
          }
        }
      }
    }
    
    /*滚动条样式重置*/
    .enn_scroll::-webkit-scrollbar {
      width: 5px;
      border-radius: 8px;
      height: 5px;
    }

    .enn_scroll::-webkit-scrollbar-track {
      background-color: #fff;

    }

    .enn_scroll::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background: #ccc;

    }
  }
</style>
<style lang="scss">
  .dispatchingHome_list_container{
    .el-button--primary:focus, .el-button--primary:hover {
      background: #47A87D;
      border-color: #47A87D;
      color: #FFF;
    }
    .el-button--primary{
      background: #47A87D;
      border-color: #47A87D;
      color: #FFF;
    }
  }
</style>