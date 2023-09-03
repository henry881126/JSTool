<template>
  <div class="delivery-wrapper gas-page-bg">
    <top-menu title="天然气输配（调度）智慧管理平台" parentMenu="运营调度"></top-menu>
    <!-- 面包屑 -->
		<div class="crumb-diaodu">
			<span class="crumb-title1">运营调度 / </span>
			<span class="crumb-title2">运行监控</span>
		</div>
    <div class="content-wrapper content-wrapper-diaodu">
      <!-- 标题 -->
      <div class="title">
        <div class="t1">运行监控</div>
        <div class="right" style="position:relative">
          <!-- 客户，场站浮窗列表 -->
          <PopupList @getChooseListData="getChooseListData"
                     @notPopupCreate="notPopupCreate" 
                     :popupDataCancel="popupDataCancel"
                     :changeAllPopupList="changeAllPopupList"
                     :pressurePointDataFlag="pressurePointDataFlag"
                     :customerPointDataFlag="customerPointDataFlag"/>
        </div>
      </div>
      <!-- 信息看板 -->
      <ul class="message_kanban">
        <li v-for="(item,index) in kanbanData" :key="index">
          <p>
            <span class="number">{{item.data}}</span>
            <span class="unit">{{item.unit}}</span>
          </p>
          <p>
            <span class="name">{{item.title}}</span>
          </p>
        </li>
      </ul>
      <!-- 地图 -->
      <div class="map_module">
        <div id="map" class="map"></div>
        <ul class="legend">
          <li>
            <el-checkbox v-model="legendVal.highPressure.val" size="medium" 
                         @change="legendChange(legendVal.highPressure,'layer')">
              <i class="icon_pipe icon_pipe_red"></i>
              <span class="legend_title">已建高压管道</span>
            </el-checkbox>
          </li>
          <li>
            <el-checkbox v-model="legendVal.finishedCi.val" 
                         @change="legendChange(legendVal.finishedCi,'layer')">
              <i class="icon_pipe icon_pipe_purple"></i>
              <span class="legend_title">已建次高压管道</span>
            </el-checkbox>
          </li>
          <li>
            <el-checkbox v-model="legendVal.intermediatePressure.val" 
                         @change="legendChange(legendVal.intermediatePressure,'layer')">
              <i class="icon_pipe icon_pipe_black"></i>
              <span class="legend_title">中压</span>
            </el-checkbox>
          </li>
          <!-- <li>
            <el-checkbox v-model="legendVal.xiqiPipe.val" 
                         @change="legendChange(legendVal.xiqiPipe,'layer')">
              <i class="icon_pipe icon_pipe_green"></i>
              <span class="legend_title">西气东输管道</span>
            </el-checkbox>
          </li>
          <li>
            <el-checkbox v-model="legendVal.dapengPipe.val" 
                         @change="legendChange(legendVal.dapengPipe,'layer')">
              <i class="icon_pipe icon_pipe_yellow"></i>
              <span class="legend_title">大鹏气管道</span>
            </el-checkbox>
          </li>
          <li>
            <el-checkbox v-model="legendVal.jinqiPipe.val" 
                         @change="legendChange(legendVal.jinqiPipe,'layer')">
              <i class="icon_pipe dotted icon_pipe_blue"></i>
              <span class="legend_title">近期规划</span>
            </el-checkbox>
          </li>
          <li>
            <el-checkbox v-model="legendVal.yuanqiVal.val" 
                         @change="legendChange(legendVal.yuanqiVal,'layer')">
              <i class="icon_pipe dotted icon_pipe_green_dotted"></i>
              <span class="legend_title">远期规划</span>
            </el-checkbox>
          </li> -->
          <li>
            <el-checkbox v-model="legendVal.LNGVal.val" 
                         @change="legendChange(legendVal.LNGVal,'point')">
              <i class="icon_pipe_img lng">
                <img src="../../../images/operationSituation/legend_icon_save.png" alt="">
              </i>
              <span class="legend_title">LNG</span>
            </el-checkbox>
          </li>
          <li>
            <el-checkbox v-model="legendVal.stationVal.val" 
                         @change="legendChange(legendVal.stationVal,'point')">
              <i class="icon_pipe_img lng">
                <img src="../../../images/operationSituation/legend_icon_station.png" alt="">
              </i>
              <span class="legend_title">门站</span>
            </el-checkbox>
          </li>
          <li>
            <el-checkbox v-model="legendVal.roomVal.val" 
                         @change="legendChange(legendVal.roomVal,'point')">
              <i class="icon_pipe_img lng">
                <img src="../../../images/operationSituation/legent_icon_room.png" alt="">
              </i>
              <span class="legend_title">阀室</span>
            </el-checkbox>
          </li>
          <li>
            <el-checkbox v-model="legendVal.pressureRoomVal.val" 
                         @change="legendChange(legendVal.pressureRoomVal,'point')">
              <i class="icon_pipe_img lng">
                <img src="../../../images/operationSituation/legent_icon_pressure.png" alt="">
              </i>
              <span class="legend_title">调压站</span>
            </el-checkbox>
          </li>
          <li>
            <el-checkbox v-model="legendVal.customerVal.val"
                          @change="legendChange(legendVal.customerVal,'point')">
              <i class="icon_pipe_img lng">
                <img src="../../../images/operationSituation/legend_icon_customer.png" alt="">
              </i>
              <span class="legend_title">客户</span>
            </el-checkbox>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import "ol/ol.css"
import Map from 'ol/Map';
import View from "ol/View";
import Feature from "ol/Feature";
import Overlay from "ol/Overlay";
import { Icon, Style, Stroke, Fill, Circle, Text } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { LineString, Point } from "ol/geom";
import Polygon from 'ol/geom/Polygon';
import { ScaleLine, defaults as defaultControls } from "ol/control";
import { transform} from 'ol/proj';
//import OSM from 'ol/source/OSM';
//import { getCenter,boundingExtent, returnOrUpdate } from "ol/extent";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";
import mapPipe from "../../../images/operationSituation/map_pipe.png"
import mapJson from "../operationSituation/map.json"
import {IconConstants,Constants,PipeWidth,PipeNetStateColor,PointType} from "../../../utils/mapConstants"
import TopMenu from "@/components/topMenu/topMenu2";
import PopupList from '../operationSituation/components/list'
import {getMapPipeData,getMapPointData,getKanbanData,getImportantPoint} from "@/idsPages/api/operationSituation"
import { parseTime } from '@/idsPages/utils/index'

export default {
  name: "gasVolumeTracking",
  components: {
    TopMenu,
    PopupList
  },
  data() {
    return {
      popupContent:{},
      kanbanData:[
        {
          data:'-',
          unit:'万m³',
          title:'今日总指定量',
          type:'replyVolume',
        },
        {
          data:'-',
          unit:'万m³',
          title:'今日总提取量',
          type:'volumeUsed',
        },
        {
          data:'-',
          unit:'万m³',
          title:'剩余总提取量',
          type:'balanceVolumeUsable',
        },
        {
          data:'-',
          unit:'h',
          title:'剩余时间',
          type:'balanceHour',
        },
        {
          data:'-',
          unit:'万m³/h',
          title:'剩余平均提取流量',
          type:'balanceAvgUsable',
        },
        {
          data:'-',
          unit:'万m³/h',
          title:'当日输配能力上限',
          type:'instantFlowUp',
        },
        {
          data:'-',
          unit:'万m³/h',
          title:'当前全网输配能力',
          type:'currentInstantFlow',
        },
        {
          data:'-',
          unit:'万m³/h',
          title:'当日剩余输配能力',
          type:'balanceInstantFlow',
        },
        {
          data:'-',
          unit:'%',
          title:'当前输配能力占比',
          type:'instantFlowRate',
        },
        {
          data:'-',
          unit:'万m³',
          title:'当前LNG总储量',
          type:'lngStoreVolume',
        },
        {
          data:'-',
          unit:'万m³',
          title:'LNG最大可用量',
          type:'lngMaxUsable',
        },
        {
          data:'-',
          unit:'m',
          title:'当前LNG液位',
          type:'lngLevel',
        },
        {
          data:'-',
          unit:'%',
          title:'LNG储备占比',
          type:'lngStoreRate',
        },
      ],
      legendVal:{
        highPressure:{
          val:true,
          type:Constants.FinishedHighPressure,
        }, //已建高压
        finishedCi:{
          val:true,
          type:Constants.FinishedSubHighPressure,
        }, //已建次高压
        intermediatePressure:{
          val:false,
          type:Constants.MainlyMediumPressure,
        }, //中压
        xiqiPipe:{
          val:false,
          type:Constants.XiqidongshuPipe,
        }, //西气东输
        dapengPipe:{
          val:false,
          type:Constants.DapengPipe,
        }, //大鹏
        jinqiPipe:{
          val:false,
          type:Constants.JinqiPipe,
        }, //近期规划
        yuanqiVal:{
          val:false,
          type:Constants.YuanqiPipe
        },  //远期规划
        LNGVal:{
          val:false,
          type:PointType.Lng,
        }, //LNG
        stationVal:{
          val:true,
          type:PointType.Station,
        }, //门站
        roomVal:{
          val:false,
          type:PointType.Valve,
        }, //阀室
        pressureRoomVal:{
          val:false,
          type:PointType.Pressure,
        }, //调压站
        customerVal:{
          val:false,
          type:PointType.Customer,
        },  //客户
      },
      map: null,
      overLayList:[],
      pointLayer:null,
      showOverLay:false,
      mapCenter:[113.746262,23.046237],
      popupDataCancel:{}, //关闭弹窗的数据
      changeAllPopupList:{},//图例全部取消类型
      mapLayers:{},
      pointFeatureListLNG:[],
      pointFeatureListStation:[],
      pointFeatureListValve:[],
      pointFeatureListPressure:[],
      pointFeatureListCustomer:[],
      singlePointCreatedList:[],  //场站，客户列表添加点集合
      timer:null,
      mapMaxExtent:[],
      isFirst:true, //是否为第一次请求(不是3分钟请求)
      saveShowOverlay:[], //存储地图上的弹窗(3分钟刷新恢复客户操作依据)
      pressurePointDataFlag:false,  //调压站数据是否请求完毕
      customerPointDataFlag:false,  //客户数据是否请求完毕
      isListPopupCreate:false,  //列表点击弹窗是否创建
    };
  },
  mounted(){
    this.initMap();
    this.getPipeData('GAOYA');  //高压
    this.getPipeData('CIGAOYA');  //次高压
    this.getPipeData('ZHONGYA');  //中压
    this.getKanbanData();
    this.getPointData('NGS.GGS'); //门站
    this.getPointData('NGS.GRS'); //LNG
    this.getPointData('NGS.RPS'); //调压站
    this.getPointData('UGM.GFM'); //客户
    this.getPointData('NGN.GP');  //阀室
    this.getImportantPoint();
    this.timer = setInterval(() => {      
      this.isFirst = false;  
      this.pointFeatureListLNG = [];
      this.pointFeatureListStation = [];
      this.pointFeatureListValve = [];
      this.pointFeatureListPressure = [];
      this.pointFeatureListCustomer = [];
      this.singlePointCreatedList = [];  
      this.saveCustomerHandle();  
      this.getKanbanData();
      this.getPointData('NGS.GGS'); //门站
      this.getPointData('NGS.GRS'); //LNG
      this.getPointData('NGS.RPS'); //调压站
      this.getPointData('UGM.GFM'); //客户
      this.getPointData('NGN.GP');  //阀室
      this.getPipeData('GAOYA');    //高压
      this.getPipeData('CIGAOYA');  //次高压
      this.getPipeData('ZHONGYA');  //中压
      this.getImportantPoint();
      this.clearMapOverlay();
    },180000);
  },
  methods:{
    //获取看板信息
    getKanbanData(){   
      let params = {
        collectDate:this.getParamsDate(),
        dataType:'lngStore ',
      }  
      getKanbanData(params).then((res) => {
        if(res.data){
          let result = res.data;
          this.kanbanData.forEach(item => {
            for(let name in result){
              if(item.type == name){
                item.data = result[name]?result[name]:'-';
              }
            }
          })
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    getPipeData(pipeType){
      let paramse = {
        type:pipeType,
      }
      getMapPipeData(paramse).then((res) => {
        if(res.data){
          let result = res.data;
          if(pipeType == 'GAOYA'){ //高压
            if(!this.isFirst){
              this.clearMapPipe(Constants.FinishedHighPressure)
            }            
            this.createPipe(Constants.FinishedHighPressure,result);
            this.getPipeTitle(result,Constants.FinishedHighPressure);
            if(!this.isFirst){
              this.updateOverlayPipe(Constants.FinishedHighPressure);
            }
          }
          if(pipeType == 'CIGAOYA'){ //次高压
            if(!this.isFirst){
              this.clearMapPipe(Constants.FinishedSubHighPressure)
            } 
            this.createPipe(Constants.FinishedSubHighPressure,result);
            this.getPipeTitle(result,Constants.FinishedSubHighPressure);
            if(!this.isFirst){
              this.updateOverlayPipe(Constants.FinishedSubHighPressure);
            }
          }
          if(pipeType == 'ZHONGYA'){ //中压
            if(!this.isFirst){
              this.clearMapPipe(Constants.MainlyMediumPressure)
            } 
            this.createPipe(Constants.MainlyMediumPressure,result);
            if(!this.isFirst){
              this.updateOverlayPipe(Constants.MainlyMediumPressure);
            }
          }
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    getPointData(type){
      let params = {
        domainCode:type,
      }
      getMapPointData(params).then((res) => {
        if(res.data){
          let result = res.data; 
          for(let item of result){
            item.stationId = item.domainCode + item.stationId;  //stationId字段唯一性处理
          }
          switch (type){
            case 'NGS.GGS': //门站
              if(!this.isFirst){
                this.clearMapPoint(PointType.Station);
              }
              this.createPoint(result,
                IconConstants.iconMapStation,
                PointType.Station,
                this.pointFeatureListStation); 
              
              if(!this.isFirst){
                this.updateOverlayPoint(result,'stationId',PointType.Station);
              } 
              break;
            case 'NGS.GRS':  //储气站
              if(!this.isFirst){
                this.clearMapPoint(PointType.Lng);
              }
              this.createPoint(
                result,
                IconConstants.iconMapLNG,
                PointType.Lng,
                this.pointFeatureListLNG);
              
              if(!this.isFirst){
                this.updateOverlayPoint(result,'stationId',PointType.Lng);
              } 
              break;
            case 'NGS.RPS':  //调压站
              if(!this.isFirst){
                this.clearMapPoint(PointType.Pressure);
              }
              this.createPoint(result,
                IconConstants.iconMapPressure,
                PointType.Pressure,
                this.pointFeatureListPressure);
              
              this.pressurePointDataFlag = !this.pressurePointDataFlag;//调压站数据是否请求完毕

              if(!this.isFirst){
                this.updateOverlayPoint(result,'stationId',PointType.Pressure);
              }
              break;
            case 'UGM.GFM':  //客户
              if(!this.isFirst){
                this.clearMapPoint(PointType.Customer);
              }
              this.createPoint(result,
                IconConstants.iconMapCustomer,
                PointType.Customer,
                this.pointFeatureListCustomer);

              this.customerPointDataFlag = !this.customerPointDataFlag;//客户数据是否请求完毕

              if(!this.isFirst){
                this.updateOverlayPoint(result,'stationId',PointType.Customer);
              }
              break;
            case 'NGN.GP':  //阀室
              if(!this.isFirst){
                this.clearMapPoint(PointType.Valve);
              }
              this.createPoint(result,
                IconConstants.iconMapValve,
                PointType.Valve,
                this.pointFeatureListValve);

              if(!this.isFirst){
                this.updateOverlayPoint(result,'stationId',PointType.Valve);
              }
              break;
          }
          
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    getImportantPoint(){     
      getImportantPoint().then((res) => {
        if(res.data){
          let result = res.data;
          this.createImportantPoint(result);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    //图例事件
    legendChange(dataObj,type){     
      if(type == 'layer'){ //管线
        this.lgentTypePipe(dataObj)
      }else{  //站点
        this.legentTypePoint(dataObj);
      }
            
    },
    //站点-图例联动事件
    legentTypePoint(dataObj){
      //撒点前删除同类型已添加的点
      if(dataObj.val){
        if(this.singlePointCreatedList.length > 0){
          let deleteArr = [];
          for(let j = 0; j < this.singlePointCreatedList.length; j ++){
            let temp = this.singlePointCreatedList[j];
            if(dataObj.type == temp.values_.type){
              this.pointLayer.getSource().removeFeature(temp);
              deleteArr.push(this.singlePointCreatedList[j]);
            }
          }
          this.deleteArrayEqual(deleteArr,this.singlePointCreatedList,'values_','type');//去掉数组中被移除的点
        }
      }
              
      let tempList = this.screenMapPointList(dataObj.type);
      
      for(let i = 0; i < tempList.length; i ++){
        let temp = tempList[i];
        if(dataObj.val){  //添加点
          this.pointLayer.getSource().addFeature(temp);
          if(dataObj.type == PointType.Station){  //只有门站勾选时显示弹窗
            this.createPopupTemplate(temp.values_);
          }              
        }else{  //移除点
          this.pointLayer.getSource().removeFeature(temp);
        } 
      }
      if(!dataObj.val){ //取消点勾选的时候删除弹窗
        let deleteIndexArr = [];
        for(let i = 0; i < this.overLayList.length; i ++){
          if(this.overLayList[i].options.type == dataObj.type){
            deleteIndexArr.push(this.overLayList[i]);
            this.map.removeOverlay(this.overLayList[i]);     //去掉地图弹窗                               
          }
        }
        //从数组去掉存储的弹窗数据
        this.deleteArrayEqual(deleteIndexArr,this.overLayList,'options','id')
        this.$set(this.changeAllPopupList,'type',dataObj.type); //图例勾选结果传给子组件（未勾选）
        this.$set(this.changeAllPopupList,'value',false);
      }else{
        this.$set(this.changeAllPopupList,'type',dataObj.type); //图例勾选结果传给子组件（已勾选）
        this.$set(this.changeAllPopupList,'value',true);
      }
    },
    //管线图例联动事件
    lgentTypePipe(dataObj){
      let layers = this.map.getLayers();
      if(dataObj.val){
        layers.insertAt(2,this.mapLayers[dataObj.type]);
      }else{
        this.map.removeLayer(this.mapLayers[dataObj.type]);
        let deleteIndexArr = [];
        for(let i = 0; i < this.overLayList.length; i ++){
          if(this.overLayList[i].options.type == dataObj.type){
            deleteIndexArr.push(this.overLayList[i]);
            this.map.removeOverlay(this.overLayList[i]);     //去掉地图弹窗                               
          }
        } 
        //从数组去掉存储的弹窗数据
        this.deleteArrayEqual(deleteIndexArr,this.overLayList,'options','type')

      }
    },
    //筛选地图点集合数据
    screenMapPointList(type){
      let tempList = [];
      switch(type){
        case PointType.Lng:
          tempList = this.pointFeatureListLNG;
          break;
        case PointType.Station:
          tempList = this.pointFeatureListStation;
          break;
        case PointType.Valve:
          tempList = this.pointFeatureListValve;
          break;
        case PointType.Pressure:
          tempList = this.pointFeatureListPressure;
          break;
        case PointType.Customer:
          tempList = this.pointFeatureListCustomer;
          break;
      }
      return tempList;
    },
    //去除两个数组相同项
    deleteArrayEqual(arr1,arr2,attribute1,attribute2){//arr2需要处理的数组，arr1对照数组
      for(let item of arr1){ 
        for(let j = 0; j < arr2.length; j ++){
          let temp1,temp2;
          if(attribute1 && attribute2){
            temp1 = item[attribute1][attribute2];
            temp2 = arr2[j][attribute1][attribute2];
          }
          else if(attribute1 && !attribute2){
            temp1 = item[attribute1];
            temp2 = arr2[j][attribute1];
          }else{
            temp1 = item;
            temp2 = arr2[j];
          }
          if(temp1 == temp2){
            arr2.splice(j,1);
            break;
          }
        }
      }
    },
    //关闭弹窗
    closePopup(data) {           
      let flag;
      for(let name in this.legendVal){
        if(this.legendVal[name].type == data.type){
          flag = this.legendVal[name].val;
        }
      }
      
      if(flag){
        this.$set(data,'chooseState',false);
        this.popupDataCancel = data;
      }
      
      this.removePopup(data);
    },
    //点击列表后是否创建显示弹窗
    notPopupCreate(data){
      this.isListPopupCreate =  data;
    },
    //获取弹窗信息
    getChooseListData(data){
      let hasChoose = false;  //图例是否勾选
      for(let name in this.legendVal){
        let temp = this.legendVal[name];
        if(temp.type == data.type && temp.val){
          hasChoose = true;
        }
      }
      
      if(data.chooseState && !this.isListPopupCreate){
        this.createPopupTemplate(data);
      }
      if(!data.chooseState){
        this.removePopup(data);
      }
      if(!hasChoose){ //添加，删除图标
        let tempList = this.screenMapPointList(data.type);
        for(let i = 0; i < tempList.length; i ++){
          if(data.stationId == tempList[i].values_.stationId){
            if(data.chooseState){
              this.pointLayer.getSource().addFeature(tempList[i]);
              this.singlePointCreatedList.push(tempList[i]);
              break;
            }else{
              for(let j = 0; j < this.singlePointCreatedList.length; j ++){
                let item = this.singlePointCreatedList[j];
                if(item.values_.stationId == data.stationId){
                  this.singlePointCreatedList.splice(j,1);
                  break;
                }
              }              
              this.pointLayer.getSource().removeFeature(tempList[i]);              
              break;
            }
            
          }
        }
      }
    },
    //创建弹窗模板
    createPopupTemplate(popupData,isUpdate){
      let hasFlag = true;
      if(!isUpdate){  //不是做弹窗数据更新，判断数据在存储弹窗的数组是已否存在
        hasFlag = this.excludePopup(popupData);
      }
      
      if(!hasFlag){
        return false;
      }
      
      let ODiv = '', divId = '',
          newElement = document.createElement('div');
      if(popupData.type == PointType.Station){
        let content = '';
        if(popupData.stationList && popupData.stationList.length > 0){
          popupData.stationList.forEach(item => {
            content += `<p>${item}</p>`
          })
        }
        ODiv = `<span
                  href="#"
                  ref="popupCloser"
                  class="ol-popup-closer"
                ></span>
                <div class="main_box">
                  <p>${popupData.stationName}</p>
                  ${content}
                </div>` 
             
        divId = `popupDiv_station${popupData.stationId}`;
      }
      if(popupData.type == PointType.Customer){
        ODiv = `<span
                  href="#"
                  ref="popupCloser"
                  class="ol-popup-closer"
                  @click="closePopup"
                ></span>
                <div class="customer_box main_box">
                  <p>
                    <span class="name">客户名称：</span>
                    <span class="value">${popupData.stationName}</span>
                  </p>
                  <p>
                    <span class="name">压力：</span>
                    <span class="value">${popupData.enterPressure?popupData.enterPressure:'-'}MPa</span>
                  </p>
                  <p>
                    <span class="name">瞬时流量：</span>
                    <span class="value val_bg">${popupData.alongFlow?popupData.alongFlow:'-'}Nm³/h</span>
                  </p>
                  <p>
                    <span class="name">当日累流：</span>
                    <span class="value val_bg">${popupData.dayFlow?popupData.dayFlow:'-'}Nm³</span>
                  </p>
                </div>` 
        divId = `popupDiv_customer${popupData.stationId}`
      }
      if(popupData.type == PointType.Lng){
        ODiv = `<span
                  href="#"
                  ref="popupCloser"
                  class="ol-popup-closer"
                ></span>
                <div class="main_box">
                  <p>${popupData.stationName}</p>
                  <p>
                    <span class="name">压力：</span>
                    <span class="value">${popupData.outPressure?popupData.outPressure:'-'}MPa</span>
                  </p>
                  <p>
                    <span class="name">瞬时流量：</span>
                    <span class="value">${popupData.alongFlow?popupData.alongFlow:'-'}Nm³/h</span>
                  </p>
                  <p>
                    <span class="name">当日累流：</span>
                    <span class="value">${popupData.dayFlow?popupData.dayFlow:'-'}万Nm³</span>
                  </p>
                  <p>
                    <span class="name">储备量：</span>
                    <span class="value">${popupData.reserve?popupData.reserve:'-'}万Nm³</span>
                  </p>
                </div>`       
        divId = `popupDiv_station${popupData.stationId}`;
      }
      if((popupData.type == PointType.Pressure)){
        if(popupData.stationId !== '0611_000043'){  //调压站九丰气源不显示进口压力
          ODiv = `<span
                  href="#"
                  ref="popupCloser"
                  class="ol-popup-closer"
                ></span>
                <div class="main_box">
                  <p>${popupData.stationName}</p>
                  <p>
                    <span class="name">进口压力：</span>
                    <span class="value">${popupData.enterPressure?popupData.enterPressure:'-'}MPa</span>
                  </p>
                  <p>
                    <span class="name">出口压力：</span>
                    <span class="value">${popupData.outPressure?popupData.outPressure:'-'}MPa</span>
                  </p>
                  <p>
                    <span class="name">瞬时流量：</span>
                    <span class="value">${popupData.alongFlow?popupData.alongFlow:'-'}Nm³/h</span>
                  </p>
                </div>` 
        }else{
          ODiv = `<span
                  href="#"
                  ref="popupCloser"
                  class="ol-popup-closer"
                ></span>
                <div class="main_box">
                  <p>${popupData.stationName}</p>
                  <p>
                    <span class="name">出口压力：</span>
                    <span class="value">${popupData.outPressure?popupData.outPressure:'-'}MPa</span>
                  </p>
                  <p>
                    <span class="name">瞬时流量：</span>
                    <span class="value">${popupData.alongFlow?popupData.alongFlow:'-'}Nm³/h</span>
                  </p>
                </div>` 
        }
              
        divId = `popupDiv_station${popupData.stationId}`;
      }
      if(popupData.type == PointType.Valve){
        ODiv = `<span
                  href="#"
                  ref="popupCloser"
                  class="ol-popup-closer"
                ></span>
                <div class="main_box">
                  <p>${popupData.stationName}</p>
                  <p>
                    <span class="name">状态：</span>
                    <span class="value">${popupData.state == 1 ? '开' :'关'}</span>
                  </p>
                  <p>
                    <span class="name">进口压力：</span>
                    <span class="value">${popupData.enterPressure?popupData.enterPressure:'-'}MPa</span>
                  </p>
                  <p>
                    <span class="name">出口压力：</span>
                    <span class="value">${popupData.outPressure?popupData.outPressure:'-'}MPa</span>
                  </p>
                  <p>
                    <span class="name">当日总瞬流：</span>
                    <span class="value">${popupData.dayTotalFlow?popupData.dayTotalFlow:'-'}万Nm³/h</span>
                  </p>
                </div>`       
        divId = `popupDiv_station${popupData.stationId}`;
      }
      if(popupData.type == Constants.FinishedHighPressure || popupData.type == Constants.FinishedSubHighPressure 
        || popupData.type == Constants.MainlyMediumPressure){
        ODiv = `<span
                  href="#"
                  ref="popupCloser"
                  class="ol-popup-closer"
                ></span>
                <div class="main_box">
                  <p>${popupData.pipeName}</p>
                  <p>
                    <span class="name">管径：</span>
                    <span class="value">${popupData.diameter?popupData.diameter:'-'}mm</span>
                  </p>
                  <p>
                    <span class="name">管长：</span>
                    <span class="value">${popupData.length?popupData.length:'-'}m</span>
                  </p>
                  <p>
                    <span class="name">温度：</span>
                    <span class="value">${popupData.enterTemperature?popupData.enterTemperature:'-'}℃</span>
                  </p>
                  <p>
                    <span class="name">流速：</span>
                    <span class="value">${popupData.speed?popupData.speed:'-'}m/s</span>
                  </p>
                  <p>
                    <span class="name">压力：</span>
                    <span class="value">${popupData.enterPressure?popupData.enterPressure:'-'}Mpa</span>
                  </p>
                  <p>
                    <span class="name">最大输配能力：</span>
                    <span class="value">${popupData.upLimit?popupData.upLimit:'-'}Nm³/h</span>
                  </p>
                  <p>
                    <span class="name">当前输配能力：</span>
                    <span class="value">${popupData.instantFlow?popupData.instantFlow:'-'}Nm³/h</span>
                  </p>
                  <p>
                    <span class="name">剩余输配能力：</span>
                    <span class="value">${popupData.surplusLimit?popupData.surplusLimit:'-'}Nm³/h</span>
                  </p>
                  <p>
                    <span class="name">输配能力占比：</span>
                    <span class="value">${popupData.rateLimit?popupData.rateLimit:'-'}%</span>
                  </p>
                </div>`  
        let id = Math.floor((Math.random() * 100000));     
        divId = `popupDiv_station${id}`;
      }  
      if(popupData.type == PointType.Important){
        ODiv = `<div class="main_box">
                  <p>
                    <span class="name">压力：</span>
                    <span class="value">${popupData.pressure?popupData.pressure:'-'}MPa</span>
                  </p>
                  <p>
                    <span class="name">温度：</span>
                    <span class="value">${popupData.temperature?popupData.temperature:'-'}℃</span>
                  </p>
                </div>`       
        divId = `popupDiv_station${popupData.stationId}`;
      }  
      newElement.innerHTML = ODiv;
      newElement.id = divId;
      newElement.className = 'ol-popup';
      this.$nextTick(() => {
        newElement.children[0].onclick = () => {
          this.closePopup(popupData);
        }
        newElement.onclick = () => {  //点击弹窗置前
          for(let item of this.overLayList){
            let myStyle = item.element.firstChild.parentNode.style;
            myStyle.zIndex = 1;
          }
          newElement.parentNode.style.zIndex = 4;
        }
      })
           
      let map = document.getElementById('map');
      map.appendChild(newElement);
      this.$nextTick(() => {
        if(popupData.type == PointType.Important){
          this.addPopup(divId,popupData,PointType.Important);
        }else{
          this.addPopup(divId,popupData);
        }
        
      })     
    },
    
    removePopup(data){
      for(let i = 0; i < this.overLayList.length; i ++){
        let target = this.overLayList[i].id;
        if(data.stationId == target || data.id == target){
          this.map.removeOverlay(this.overLayList[i]);
          this.overLayList.splice(i,1);
          break;
        }
      }
    },
    addPopup(id,data,type){    
      let overLay = null;
      if(type == PointType.Important){
        overLay = new Overlay({
          id:data.stationId,
          type:data.type,
          element: document.getElementById(id),
          elementId:id,
          offset:[0,-5],
          autoPan: true,
          autoPanAnimation: {
            duration: 250,
          },
        });
      }else{
        overLay = new Overlay({
          id:data.stationId,
          type:data.type,
          element: document.getElementById(id),
          elementId:id,
          offset:[0,-20],
          autoPan: true,
          autoPanAnimation: {
            duration: 250,
          },
        });
      }
      let overLaySit = [];
      if(data.coordinatesList && data.coordinatesList.length > 0){
        overLaySit = data.coordinatesList;        
        this.overLayList.push(overLay);
        this.map.addOverlay(overLay);
        overLay.setPosition(overLaySit);
      }
      else{
        this.$message.warning('无坐标')
      }
      if(data.type == PointType.Station || data.type == PointType.Pressure){
        this.$set(data,'chooseState',true);
        this.popupDataCancel = data;
      }
      
    },
    //排除重复弹窗
    excludePopup(data){
      for(let i = 0; i < this.overLayList.length; i ++){
        let temp = this.overLayList[i].options;
        if(data.stationId == temp.id){
          return false;
        }
      }
      return true;
    },
    scaleControl() {
      return new ScaleLine({
          units: 'metric'
        });
    },
    initMap(){
      //东莞市轮廓地标获取
      let coordinates = mapJson.features[0].geometry.coordinates[0];
      //var coordinatesPolygon = [];
      //循环遍历将经纬度转到"EPSG:3857"投影坐标系下
      // for (var i = 0; i < coordinates.length; i++) {
      //   var pointTransform = fromLonLat([coordinates[i][0], coordinates[i][1]], "EPSG:3857");
      //   coordinatesPolygon.push(pointTransform);
      // }
      var source = new VectorSource();
      //矢量图层(底图)
      var vector = new VectorLayer({
          source: source,
          style: new Style({
              fill: new Fill({
                  color: '#F7F7F7'
              }),
              stroke: new Stroke({
                  color: '#C8CCD3',
                  width: 2
              }),
              image: new Circle({
                  radius: 10,
                  fill: new Fill({
                      color: '#ffcc33'
                  })
              })
          })
      });
      //底图服务
      // let vector = new TileLayer({
      //     source: new TileArcGISRest({
      //       url:mapServerApi,
      //     }),
      //      name:'baseMap'
      //   });

      let plygon = new Polygon([coordinates])
      //多边形要素类(地图轮廓)
      let feature = new Feature({
          geometry: plygon,
      });
      
      source.addFeature(feature);

      let centerSit = transform(this.mapCenter, "EPSG:4326",'EPSG:3857');
      centerSit[0] = centerSit[0] + 12000;
      centerSit[1] = centerSit[1] - 21000;
      //let maxExtent = boundingExtent(this.mapMaxExtent);
      let view = new View({
            center:centerSit,
            zoom: 11,
            minZoom:10,
            maxZoom:12,
            projection: "EPSG:3857",
            //extent:transformExtent(maxExtent, 'EPSG:4326', 'EPSG:3857'),
          })
      let extent = [
            centerSit[0] - 2300 * 35 / 2 + 7000,
            centerSit[1] - 1294 * 35 / 2 + 5000,
            centerSit[0] + 2300 * 35 / 2 + 7000,
            centerSit[1] + 1294 * 35 / 2 + 5000,
          ]
      let layerMapPipe = new ImageLayer({
            source: new ImageStatic({ 
              url: mapPipe, // 加载静态地图
              imageExtent: extent, // 映射到地图的范围
            })
          });
      this.pointLayer = new VectorLayer({
        source: new VectorSource(),
        name:'pointLayer',
       // zIndex:2,
      });
      
      this.map = new Map({
        target: "map",
        layers: [
          //tileLayer,
          vector,
          layerMapPipe,
          this.pointLayer,
        ],
        controls: defaultControls().extend([this.scaleControl()]),
        view:view,
      });
      this.mapEvent();
    },
    //地图事件
    mapEvent(){
      this.map.on('click',(event) => {
        if(event.dragging){
          return;
        }
        let pixel = this.map.getEventPixel(event.originalEvent);
        let myFeature = 0;
        this.map.forEachFeatureAtPixel(pixel,(feature) => {
          if(feature.values_.type && myFeature === 0){
            myFeature ++;
            let overLayMsg = feature.values_;
            this.createPopupTemplate(overLayMsg);
          }       
          
        })
        
      })
      this.map.on('pointermove',(event) => {
        let pixel = this.map.getEventPixel(event.originalEvent);
        let feature = this.map.forEachFeatureAtPixel(pixel,(feature) => {
          if(feature.values_.type == PointType.Important){
            return feature;
          }
        })
        if(feature){
          let overLayMsg = feature.values_;
          this.createPopupTemplate(overLayMsg);
        }else{
          //移除弹窗
          for(let i = 0; i < this.overLayList.length; i ++){
            let type = this.overLayList[i].options.type;
            if(type == PointType.Important){
              this.map.removeOverlay(this.overLayList[i]);
              this.overLayList.splice(i,1);
              break;
            }
          }
        }
      })
    },

    initLineFeature(lineData,type) {
      let tempArr = [];
      lineData.forEach(item => {
        let valueObj = {
            pipeName:item['namePipe'],
            enterPressure:item['enterPressure'],
            outPressure:item['outPressure'],
            enterTemperature:item['enterTemperature'],
            outTemperature:item['outTemperature'],
            flow:item['flow'],
            speed:item['speed'],
            upLimit:item['upLimit'],
            instantFlow:item['instantFlow'],
            diameter:item['diameter'],
            length:item['length'],
            surplusLimit:item['surplusLimit'],
            rateLimit:item['rateLimit'],
            pipeType:item['type'],
            stationId:item['name'],
            
          }
        if (item['coordinatesList']){
          let sitList = item['coordinatesList'];
            for(let i = 0; i < sitList.length; i ++){
              let sit = sitList[i],
                  length = sit.length,
                  index = Math.floor(length / 2),
                  overLayPosition = sit[index];

              let feature =  new Feature({
                geometry: new LineString(sit),
                coordinatesList:overLayPosition,
                overLayPosition:overLayPosition,
                type:type,
                ...valueObj
              });
              tempArr.push(feature);
            }          
        }
                    
      });
      return tempArr;
    },
    createPipe(type,pipeData) {
      let that = this;
      let lineLayer = new VectorLayer({
        source: new VectorSource({
          features: this.initLineFeature(pipeData,type),
        }),
        name:type,
        style: function(){
          return that.getStyle(type);
        }
      });
      this.mapLayers[type] = lineLayer;  //存储所有图层
      for(let name in this.legendVal){  //根据图例勾选结果决定图层是否添加
        if(this.legendVal[name].type == type && this.legendVal[name].val){
          let layers = this.map.getLayers();
          layers.insertAt(2,lineLayer);
          break;
        }
      }
      
    },
    //设置管线样式
    getStyle(type){
      return new Style({
         stroke: new Stroke({
           width: PipeWidth[type],
           color: PipeNetStateColor[type],
           //lineDash:[15,10],
         }),
         zIndex:2,
       })
    },
    setPointStyle(data, iconUrl,type){
      var anchor = new Feature({
        geometry: new Point(data.coordinatesList),
        type:type,   
        stationName:data.stationName,
        stationId:data.stationId,
        enterPressure:data.enterPressure,
        outPressure:data.outPressure,
        enterFlow:data.enterFlow,
        outFlow:data.outFlow,
        dayFlow:data.dayFlow,
        alongFlow:data.alongFlow,
        coordinatesList:data.coordinatesList,
        state:data.state,
        outPressureG:data.outPressureG,
        outPressureC:data.outPressureC,
        outPressureZ:data.outPressureZ,
        dayTotalFlow:data.dayTotalFlow,
        reserve:data.reserve,
        stationList:data.stationList?data.stationList:'',
      });
      let that = this;
      anchor.setStyle(function () {
        return [
          new Style({
            image: new Icon({
              src: iconUrl,
              scale: that.map.getView().getZoom() / 30,
              anchor:[35,3],
              anchorOrigin: 'bottom-right',     //标注样式的起点位置
              anchorXUnits: 'pixels',    //X方向单位：分数
              anchorYUnits: 'pixels',     //Y方向单位：像素

            }),
            zIndex:3,
          }),
        ];
      });
      return anchor;
    },
    createPoint(data,icon,type,saveList){
      let hasAddFeature = false;
      for(let name in this.legendVal){  //根据图例勾选结果决定图层是否添加
        if(this.legendVal[name].type == type && this.legendVal[name].val){
          hasAddFeature = true;
        }
      }
      data.forEach(item => {
        if(item.coordinatesList && item.coordinatesList.length > 0){
          //item.coordinatesList = transform(item.coordinatesList, "EPSG:4326",'EPSG:3857');
          let point = this.setPointStyle(item,icon,type);
          saveList.push(point);
          
          if(hasAddFeature){
            this.pointLayer.getSource().addFeature(point);
          }
          if(this.isFirst && type == PointType.Station){
            item.type = type;
            this.createPopupTemplate(item)
          }
          
        }       
      })
      
      
    },
    //关键节点添加
    setImportantPointStyle(data){
      var anchor = new Feature({
        geometry: new Point(data.coordinatesList),
        coordinatesList:data.coordinatesList,
        type:PointType.Important,
        temperature:data.temperature,
        pressure:data.pressure,  
        stationId:data.id,      
      });
      anchor.setStyle(function () {
        return [
          new Style({
            fill: new Fill({
              color: "#47A87D",
            }),              
            image: new Circle({
              radius: 5,
              fill: new Fill({
                color: "#47A87D",
              }),
            }),
            zIndex: 5,
          })
        ];
      });
      return anchor;
    },
    createImportantPoint(data){
      data.forEach(item => {
        if(item.coordinatesList && item.coordinatesList.length > 1){
          let point = this.setImportantPointStyle(item);
          this.pointLayer.getSource().addFeature(point);
        }
      })
    },
    //地图清除弹窗
    clearMapOverlay(){            
      for(let i = 0; i < this.overLayList.length; i ++){  //清除弹窗
        this.map.removeOverlay(this.overLayList[i]);
      }
    },
    //根据类型清除点
    clearMapPoint(type){
      let source = this.pointLayer.getSource(),
          features = source.getFeatures();
      for(let item of features){
        if(item.values_.type == type){
          source.removeFeature(item);
        }        
      }
    },
    //根据类型清除管线图层
    clearMapPipe(type){
      let layer = this.mapLayers[type];
      this.map.removeLayer(layer);
    },
    //日期处理
    getParamsDate(){
      let time = new Date().getTime(),
          newDate = parseTime(time, "{y}-{m}"),
          newDay = parseTime(time, "{d}"),
          newHour = parseTime(time, "{h}");
      if (newHour - 0 < 8) {
        newDay = parseTime(time - 24 * 60 * 60 * 1000, "{d}");
      }
      return newDate = newDate + "-" + newDay;
    },
    getPipeTitle(list,type){
      if(list.length > 0){
        let tempArr = [];
        for(let item of list){
          let temp = {
            name:item.namePipe,
            type:type,
            id:item.name,
          }
          if(item.coordinatesList && item.coordinatesList.length > 0){
            let index = Math.floor(item.coordinatesList.length / 2),
                arr = item.coordinatesList[index];
            if(arr.length > 0){
              let centerIndex = Math.floor(arr.length / 2);
              temp.sit = arr[centerIndex];
            }
          }
          tempArr.push(temp);
        }
        this.initPipeName(tempArr);
      }      
    },
    //创建管线名称
    initPipeName(data){
      for(let item of data){
        let feature = new Feature({
          geometry: new Point(item.sit),
          type:item.type, 
          name:item.name,
          id:item.id,
        });
        switch (item.id){
          case 'XgToDcPipe':
            item.offsetY = 30;
            item.offsetX = 25;
            break;
          case 'DcToTsPipe':
            item.offsetY = 0;
            item.offsetX = 70;
            break;
          case 'TsToGbPipe':
            item.offsetY = 0;
            item.offsetX = 70;
            break;
          case 'NwhPipe':
            item.offsetY = 10;
            item.offsetX = 50;
            break;
          case 'HmPipe':
            item.offsetY = 0;
            item.offsetX = 50;
            break;
          case 'LsdPipe':
            item.offsetY = 0;
            item.offsetX = -60;
            break;
          case 'BwlPipe':
            item.offsetY = -20;
            item.offsetX = 0;
            break;
          case 'TmtPipe':
            item.offsetY = 0;
            item.offsetX = 60;
            break;
          case 'HmcPipe':
            item.offsetY = -30;
            item.offsetX = -10;
            break;
          case 'XgToQsPipe':
            item.offsetY = -10;
            item.offsetX = 70;
            break;
        }
        feature.setStyle(function () {
          return [
            new Style({
              text: new Text({
                text:item.name,
                textAlign:'center',
                textBaseline:'center',
                offsetY:item.offsetY,
                offsetX:item.offsetX,
                font:'14px',
                fill:new Fill({color:'#303133'}),
              }),
              zIndex:3,
            }),
          ];
        });
        this.mapLayers[item.type].getSource().addFeature(feature);
      }
    },
    //更新弹窗数据(站点)
    updateOverlayPoint(dataArray,paramsName,type){
      for(let i = 0; i < this.saveShowOverlay.length; i ++){
        for(let j = 0; j < dataArray.length; j ++){
          if(this.saveShowOverlay[i].stationId == dataArray[j][paramsName]){
            dataArray[j].type = type;            
            let data = dataArray[j];
            for(let k = 0; k < this.overLayList.length; k ++){
              if(this.overLayList[k].options.id == data[paramsName]){
                this.overLayList.splice(k,1);
                break;
              }
            }
            this.createPopupTemplate(data,true);
            break;
          }
        }
      }
    },
    //更新弹窗数据（管线）
    updateOverlayPipe(pipeType){
      let source = this.mapLayers[pipeType].getSource(),
          feature = source.getFeatures();
      for(let i = 0; i < this.saveShowOverlay.length; i ++){
        for(let j = 0; j < feature.length; j ++){
          let data = feature[j].values_;
          if(!data.coordinatesList){
            continue;
          }         
          if(this.saveShowOverlay[i].coordinatesList[0] == data.coordinatesList[0]
            && this.saveShowOverlay[i].coordinatesList[1] == data.coordinatesList[1]){
            for(let k = 0; k < this.overLayList.length; k ++){
              if(this.overLayList[k].options.id == data.stationId){
                this.overLayList.splice(k,1);
                break;
              }
            }
            this.createPopupTemplate(data,true);
            break;
          }
        }
      }
    },
    //存储用户操作
    saveCustomerHandle(){
      this.saveShowOverlay = [];
      for(let item of this.overLayList){
        let temp = {
          stationId:item.options.id,
          coordinatesList:item.values_.position,
        }
        this.saveShowOverlay.push(temp);
      }
      
    },
    //鼠标悬浮弹窗显示
    
  },
  beforeDestroy(){
    clearInterval(this.timer);
  },
};
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.delivery-wrapper {
  width: 100%;
  position: relative;

  .content-wrapper {
    position: relative;
    width: calc(100% - 40px);
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 28px;

      .t1{
        height: 25px;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 25px;
        display: inline-block;
      }
    }

    // .unit-tips-wrapper {
    //   display: flex;
    //   justify-content: space-between;
    //   align-items: center;
    //   margin-top: 40px;
    //   margin-bottom: 10px;
    // }
  }
  .message_kanban{
    position:absolute;
    left:30px;
    top:70px;
    z-index: 10;
    li{
      width: 144px;
      background: #FFFFFF;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
      border: 1px solid #DCDFE6;
      margin:0 0 5px 0;
      padding:3px 0;
      p{
        margin:4px 0;
        text-align: center;
        .number{
          font-size:20px;
          font-weight: 500;
          color:#303133;
        }
        .unit{
          font-size:12px;
        }
        .name{
          font-size:14px;
          color:#909399;
        }
      }
    }
  }
  .map_module{
    min-height: 960px;
    position: relative;
    .legend{
      position: absolute;
      right:5px;
      top:0px;
      background: #FFFFFF;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
      border: 1px solid #E4E7ED;
      list-style: none;
      padding:10px 14px;
      box-sizing: border-box;
      .legend_title{
        font-size:12px;
        color:#333;
      }
      .icon_pipe{
        display: inline-block;
        width: 21px;
        height: 6px;        
        border-radius: 3px;
        margin-right: 7px;
      }
      .icon_pipe_red{
        background: #FF260F;
      }
      .icon_pipe_purple{
        background: #D734D6;
      }
      .icon_pipe_black{
        background:#303133;
      }
      .icon_pipe_green{
        background:#01B147;
      }
      .icon_pipe_yellow{
        background:#D1CB61;
      }
      .dotted::after,.dotted::before{
        content:'';
        display: inline-block;
        width:9px;
        height: 6px;
        border-radius: 50%;
      }
      .icon_pipe_blue::after{        
        background:#8EB3EB;
      }
      .icon_pipe_blue::before{
        background:#8EB3EB;
        margin-right:5px;
      }
      .icon_pipe_green_dotted::after{        
        background:#38C817;
      }
      .icon_pipe_green_dotted::before{
        background:#38C817;
        margin-right:5px;
      }
      .icon_pipe_img{
        display: inline-block;
        width:20px;
        margin-right:7px;
      }
      img{
        width:100%;
        vertical-align:middle;
      }
    }
  }
  #map{
    height:900px;
  }
  
  
}
</style>
<style lang='scss'>
.delivery-wrapper{
  #map{
    .ol-zoom {
      top: 23em;
      left: auto;
      bottom: auto;
      right: 0.5em;
    }
    .ol-scale-line{
      top: 20em;
      left: auto;
      right: 0.5em;
      bottom: auto;
      background:none;
      .ol-scale-line-inner{
        color:#333; 
        border-color:#333;
      }
    }
    .ol-popup {
      position: absolute;
      z-index: 3;
      background-color: white;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.14);
      padding: 7px 12px;
      padding-right: 0px;
      border: 2px solid #47A87D;
      bottom: 12px;
      left: -50px;
      p{
        font-size:16px;
        color:#303133;
        font-weight: 400;
        margin:2px 0;
        min-width: 170px;
        white-space: nowrap;
        .date{
          font-size:12px;
          margin-left:5px;
        }
      }
      .customer_box{       
        p{
          min-width: 300px;
        }
      }
      .main_box{
        margin-right: 25px;
      }
    }
    .ol-popup:after,
    .ol-popup:before {
      top: 100%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }
    .ol-popup:after {
      border-top-color: white;
      border-width: 10px;
      left: 48px;
      margin-left: -10px;
    }
    .ol-popup:before {
      border-top-color: #cccccc;
      border-width: 11px;
      left: 48px;
      margin-left: -11px;
    }
    .ol-popup-closer {
      text-decoration: none;
      position: absolute;
      top: 2px;
      right: 0px;
      padding:5px 7px;
    }
    .ol-popup-closer:after {
      content: "✖";
      cursor: pointer;
    }
    
  }
  .legend{
    .el-checkbox__input.is-checked .el-checkbox__inner{
      background-color: #47A87D;
      border-color: #47A87D;
    }
  }

}
 
</style>