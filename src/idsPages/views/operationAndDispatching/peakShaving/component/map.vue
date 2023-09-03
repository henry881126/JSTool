<template>
  <div style="width: 100%; height: 100%" class="map-con">
    <div id="map1" style="width: 100%; height: 100%"></div>

    <div ref="popupContainer" class="ol-popup"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import Overlay from "ol/Overlay";
import { Icon, Style, Stroke, Fill, Circle, Text } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Point, LineString } from "ol/geom";
import Polygon from "ol/geom/Polygon";
import { transform } from "ol/proj";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";
import mapPipe from "@/idsPages/images/operationSituation/map_pipe.png";
import mapJson2 from "@/idsPages/views/operationAndDispatching/operationSituation/map.json";
import { getMapPipeData } from "@/idsPages/api/operationSituation";
import {
  IconConstants,
  //mapServerApi,
} from "@/idsPages/utils/mapConstants";
import { getAllStation } from "@/idsPages/api/plan";
import { normalizeSourceUrl } from "ol/layer/MapboxVector";
export default {
  name: "map1",
  data() {
    return {
      nowLine: null,
      map: null,
      mapCenter: [113.746262, 23.046237],
      styleArr: null,
      popupType: "",
      overLay: null,
      lineStyle: new Style({
        stroke: new Stroke({
          width: 4,
          color: "#aaa",
        }),
      }),
      redLineStyle: new Style({
        stroke: new Stroke({
          width: 4,
          color: "red",
        }),
      }),
    };
  },
  props: {
    mapData: {
      type: Object,
      default: null,
    },
  },
  watch: {
    mapData: {
      handler(newVal) {
        let arr1 = ["XgToDcPipe", "HmPipe", "LsdPipe"];
        for (let v of arr1) {
          let features = this[v].getSource().getFeatures();
          features.forEach((item) => {
            let styles = item.getStyle();
            if (styles.length == undefined) {
              item.setStyle(this.lineStyle);
            } else {
              item.setStyle([this.lineStyle, this.initPipeName(item.values_)]);
            }
          });
        }
        if (newVal.pipesKey == "HmToLsPipe") {
          this.findLine1(newVal);
        } else {
          this.findLine(newVal);
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.initPopup();
    this.initMap();
    this.getPipeData("GAOYA"); //高压
    this.getPipeData("CIGAOYA"); //次高压
    this.getPipeData("ZHONGYA"); //中压
    // this.getAllStation();
  },
  methods: {
    //处理谢岗至虎门支线至立沙岛支线主管网这条特殊的线
    findLine1({ pipesType, pipesKey }) {
      let arr = ["XgToDcPipe", "HmPipe", "LsdPipe"];
      for (let v of arr) {
        let features = this[v].getSource().getFeatures();
        features.forEach((item) => {
          let styles = item.getStyle();
          if (styles.length == undefined) {
            item.setStyle(this.redLineStyle);
          } else {
            item.setStyle([this.redLineStyle, this.initPipeName(item.values_)]);
          }
        });
      }
    },
    findLine({ pipesType, pipesKey }) {
      if (this.nowLine) {
        let nowFeatures = this.nowLine.getSource().getFeatures();
        nowFeatures.forEach((item) => {
          let styles = item.getStyle();
          if (styles.length == undefined) {
            item.setStyle(this.lineStyle);
          } else {
            item.setStyle([this.lineStyle, this.initPipeName(item.values_)]);
          }
        });
      }
      if (!this[pipesKey]) {
        this.nowLine = null;
        return;
      }
      let features = this[pipesKey].getSource().getFeatures();
      features.forEach((item) => {
        let styles = item.getStyle();
        if (styles.length == undefined) {
          item.setStyle(this.redLineStyle);
        } else {
          item.setStyle([this.redLineStyle, this.initPipeName(item.values_)]);
        }
      });
      this.nowLine = this[pipesKey];
    },
    //初始化地图
    initMap() {
      //东莞市轮廓地标获取、
      let coordinates = mapJson2.features[0].geometry.coordinates[0];
      //矢量图层(底图)
      var vector = new VectorLayer({
        source: new VectorSource({
          features: [
            new Feature({
              geometry: new Polygon([coordinates]),
            }),
          ],
        }),
        style: new Style({
          fill: new Fill({
            color: "#F7F7F7",
          }),
          stroke: new Stroke({
            color: "#C8CCD3",
            width: 2,
          }),
          image: new Circle({
            radius: 10,
            fill: new Fill({
              color: "#ff0000",
            }),
          }),
        }),
      });
      //底图服务
      // let vector = new TileLayer({
      //     source: new TileArcGISRest({
      //       url:mapServerApi,
      //     }),
      //      name:'baseMap'
      //   });
      let centerSit = transform(this.mapCenter, "EPSG:4326", "EPSG:3857");
      centerSit[0] = centerSit[0] + 12000;
      centerSit[1] = centerSit[1] - 21000;
      //let maxExtent = boundingExtent(this.mapMaxExtent);
      let view = new View({
        center: centerSit,
        zoom: 10.5,
        minZoom: 10,
        maxZoom: 12,
        projection: "EPSG:3857",
        //extent:transformExtent(maxExtent, 'EPSG:4326', 'EPSG:3857'),
      });
      let extent = [
        centerSit[0] - (2300 * 35) / 2 + 7000,
        centerSit[1] - (1294 * 35) / 2 + 5000,
        centerSit[0] + (2300 * 35) / 2 + 7000,
        centerSit[1] + (1294 * 35) / 2 + 5000,
      ];
      let layerMapPipe = new ImageLayer({
        source: new ImageStatic({
          url: mapPipe, // 加载静态地图
          imageExtent: extent, // 映射到地图的范围
        }),
      });
      this.pointLayer = new VectorLayer({
        source: new VectorSource(),
        name: "pointLayer",
        zIndex: 2,
      });
      this.map = new Map({
        target: "map1",
        layers: [
          //tileLayer,
          vector,
          layerMapPipe,
          this.pointLayer,
        ],
        view: view,
        overlays: [this.overLay],
      });
      // this.mapEvent();
    },
    //地图事件
    mapEvent() {
      this.map.on("click", (evt) => {
        if (evt.dragging) {
          return;
        }
        let coordinate = evt.coordinate;
        let arr = this.map.getFeaturesAtPixel(evt.pixel);
        let feature = arr[0];
        let hasOverLay = this.overLay.getPosition();
        if (!this.isComputing && feature && feature.values_.stationName) {
          if (!feature.values_.stationId || hasOverLay) {
            return false;
          }

          this.popupType = feature.values_.type;
          let tempData = {
            nodeType: feature.values_.type == "station" ? "1" : "2",
            nodeCode: feature.values_.stationId,
            nodeName: feature.values_.stationName,
            planId: this.planId,
            simulationType: this.isPrePlanPage ? "2" : "1",
          };
          this.sendChildData.pageType = +tempData.simulationType;
          this.sendChildData.paramsList = tempData;

          this.overLay.setPosition(coordinate);
        }
      });
    },

    getAllStation() {
      getAllStation()
        .then((res) => {
          this.map.addLayer(
            this.initPointsLayers(res.data.stationList, "station")
          );
          this.map.addLayer(
            this.initPointsLayers(res.data.customerList, "customer")
          );
        })
        .catch((error) => {});
    },
    initPointsLayers(pointData, type) {
      return new VectorLayer({
        source: new VectorSource({
          features: this.initPointFeature(pointData, type),
        }),
      });
    },
    initPointFeature(pointData, type) {
      return pointData.map((item) => {
        let { coordinatesList, stationName, stationId } = item;
        let feature = new Feature({
          geometry: new Point(coordinatesList),
          stationName,
          stationId,
          type: type,
        });
        feature.setStyle((resolution) => {
          return this.createStyle(item.type, item.stationName);
        });
        return feature;
      });
    },
    initLineLayers(pointData, type) {
      return new VectorLayer({
        source: new VectorSource({
          features: this.initLineFeature(pointData, type),
        }),
      });
    },
    initLineFeature(item, type) {
      let tempArr = [];
      let { coordinatesList, name, pipeName, namePipe } = item;
      let center = Math.floor(item.coordinatesList.length / 2);
      coordinatesList.forEach((it, index) => {
        let feature = new Feature({
          geometry: new LineString(it),
          pipeName,
          namePipe,
          name,
          type,
        });
        if (index == center) {
          // debugger
          feature.setStyle([this.lineStyle, this.initPipeName(item)]);
          feature.setId(index);
        } else {
          feature.setStyle(this.lineStyle);
        }
        // feature.setStyle(this.lineStyle);
        tempArr.push(feature);
      });
      return tempArr;
    },
    //创建管线名称
    initPipeName(item) {
      let offsetY = 0;
      let offsetX = 25;
      switch (item.name) {
        case "XgToDcPipe":
          offsetY = 30;
          offsetX = 25;
          break;
        case "DcToTsPipe":
          offsetY = 0;
          offsetX = 70;
          break;
        case "TsToGbPipe":
          offsetY = 0;
          offsetX = 70;
          break;
        case "NwhPipe":
          offsetY = 10;
          offsetX = 50;
          break;
        case "HmPipe":
          offsetY = 0;
          offsetX = 50;
          break;
        case "LsdPipe":
          offsetY = 0;
          offsetX = -60;
          break;
        case "BwlPipe":
          offsetY = -20;
          offsetX = 0;
          break;
        case "TmtPipe":
          offsetY = 0;
          offsetX = 45;
          break;
        case "HmcPipe":
          offsetY = -30;
          offsetX = -10;
          break;
        case "XgToQsPipe":
          offsetY = 0;
          offsetX = 45;
          break;
      }
      return new Style({
        text: new Text({
          text: item.namePipe,
          textAlign: "center",
          textBaseline: "center",
          offsetY: offsetY,
          offsetX: offsetX,
          font: "14px",
          fill: new Fill({ color: "#303133" }),
        }),
        zIndex: 3,
      });
    },
    createStyle(type, name) {
      let icon = "";
      switch (type) {
        case 1: //门站
          icon = IconConstants.iconMapStation;
          break;
        case 2: //储气站
          icon = IconConstants.iconMapLNG;
          break;
        case 3: //调压站
          icon = IconConstants.iconMapPressure;
          break;
        case 4: //客户
          icon = IconConstants.iconMapCustomer;
          break;
        case 5: //阀室
          icon = IconConstants.iconMapValve;
          break;
        case 6: //电力
          icon = IconConstants.iconMapPower;
          break;
      }
      return new Style({
        image: new Icon({
          src: icon,
          scale: this.map.getView().getZoom() / 30,
        }),
        text: new Text({
          text: name,
          offsetY: -25,
          font: "bold 12px sans-serif",
          fill: new Fill({ color: "#303133" }),
        }),
        zIndex: 3,
      });
    },
    closePopup() {
      this.overLay.setPosition(undefined);
    },
    //初始化弹窗
    initPopup() {
      this.overLay = new Overlay({
        element: this.$refs.popupContainer,
        autoPan: true,
        className: "calculation-map-overlay",
        positioning: "bottom-center",
        autoPanAnimation: {
          duration: 250,
        },
      });
    },
    //获取管线
    getPipeData(pipeType) {
      // debugger
      let paramse = {
        type: pipeType,
      };
      getMapPipeData(paramse)
        .then((res) => {
          if (res.data) {
            let result = res.data;
            this.chuData(result, pipeType);
            //高压
            // this[pipeType] = this.initLineLayers(result, pipeType);
            // this.map.addLayer(this[pipeType]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    chuData(data, pipeType) {
      for (let item of data) {
        this[item.name] = this.initLineLayers(item, pipeType);
        this.map.addLayer(this[item.name]);
      }
    },
  },
};
</script>

<style lang='scss'>
.map-con {
  .ol-popup {
    background: none;
    border: none;
  }
  .close {
    text-align: right;
  }
  .el-icon-close {
    cursor: pointer;
  }
  .calculation-map-overlay {
    min-width: 888px;
    min-height: 296px;
  }
}
</style>