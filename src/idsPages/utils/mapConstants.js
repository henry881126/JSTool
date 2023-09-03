import iconLNG from "../images/operationSituation/legend_icon_save.png"
import iconStation from "../images/operationSituation/legend_icon_station.png"
import iconValve from "../images/operationSituation/legent_icon_room.png"
import iconPressure from "../images/operationSituation/legent_icon_pressure.png"
import iconCustomer from "../images/operationSituation/legend_icon_customer.png"
import iconMapStation from "../images/operationSituation/map_icon_station.png"
import iconMapLNG from "../images/operationSituation/map_icon_LNG.png"
import iconMapCustomer from "../images/operationSituation/map_icon_customer.png"
import iconMapPressure from "../images/operationSituation/map_icon_pressure.png"
import iconMapSave from "../images/operationSituation/map_icon_save.png"
import iconMapValve from "../images/operationSituation/map_icon_valve.png"
import iconMapPower from "../images/operationSituation/map_icon_power.png"

export  const Constants  = {
  FinishedHighPressure: 'HIGH_PRESSURE',
  FinishedSubHighPressure: 'SUB-HIGH_PRESSURE',
  MainlyMediumPressure: 'MAINLY_MEDIUM_PRESSURE',
  XiqidongshuPipe:'XIQIDONGSHU_PIPE',
  DapengPipe:'DAPENG_PIPE',
  JinqiPipe:'JINQI_PIPE',
  YuanqiPipe:'YUANQI_PIPE',
  
}
export const PointType = {
  Lng:'LNG',
  Station:'STATION',
  Valve:'VALVE',
  Pressure:'PRESSURE',
  Customer:'CUSTOMER',
  Important:'IMPORTANT',
}
export const OperateMapEvent = {
  ToggleClick: 'toggleClick'
}

export const IconConstants = {
  IconLNG:iconLNG,
  IconStation:iconStation,
  IconValve:iconValve,
  IconPressure:iconPressure,
  IconCustomer:iconCustomer,
  iconMapStation:iconMapStation,
  iconMapLNG:iconMapLNG,
  iconMapCustomer:iconMapCustomer,
  iconMapPressure:iconMapPressure,
  iconMapSave:iconMapSave,
  iconMapValve:iconMapValve,
  iconMapPower:iconMapPower,
}

export const LegendTypeName = {
  GateStation: '接气门站',
  StorageStation: '储气详情',
  SurgeStation:'调压站',
  Warning: 'WARNING',
  ImportantClient: '',
  ValueChamber: '',
}

export const ServerSidePipeNetType = {
  HighPressure: 'intermediatePressureGd',
  MainlyMediumPressure: 'intermediatePressureGd',
  SubHighPressure: 'mesohighPressureGd'
}

export const PipeNetState = {
  SuperHigh: '3',
  Higher: '2',
  Normal: '1',
  Lower: '4',
  UltraLow: '5'
}

export const FeatureType = {
  line: 'LINE',
  pressureNode: 'PRESSURE_NODE',
  animationLine:'ANIMATION_LINE',
  station: 'STATION',
  flowNode: 'FLOW_NODE',
  warningNode: 'WARING_NODE',
  operator: 'OPERATOR'
}

export const PipeWidth = {
  [Constants.FinishedHighPressure] : 5,
  [Constants.FinishedSubHighPressure] : 5,
  [Constants.MainlyMediumPressure] : 2,
  [Constants.XiqidongshuPipe] : 2,
  [Constants.DapengPipe] : 2,
  [Constants.JinqiPipe] : 2,
  [Constants.YuanqiPipe] : 2,
}
export const changeZoomPipeWidth = {
  zoom12:{
    heighW:8,
    mainlyW:4,
    lowerW:6,
  },
  zoom14:{
    heighW:14,
    mainlyW:6,
    lowerW:10,
  },
  defult:{
    heighW:5,
    mainlyW:2,
    lowerW:7,
  }
}
export const MapStyle = {
  PressureNodeRadius: 7,
  StationNodeScale: 0.8,
  StationNodeScale1: 0.4,
  PressureNodeMinZoom:17,
  PressureNodeZIndex: 2,
  PointsLayerZIndex: 3,
  MapZoom: 12,
  MapMaxZoom:22,
  MapMinZoom: 9,
  MapCenter:JSON.parse(localStorage.getItem('cityMapCenter')),
}

export const PipeNetStateColor = {
  [Constants.FinishedHighPressure]: '#FF260F',
  [Constants.FinishedSubHighPressure]: '#D734D6',
  [Constants.MainlyMediumPressure]: '#303133',
  [Constants.XiqidongshuPipe]: '#01B147',
  [Constants.DapengPipe]: '#D1CB61',
  [Constants.JinqiPipe]: '#8EB3EB',
  [Constants.YuanqiPipe]: '#38C817'
}
export const mapServerApi = 'http://gis.enn.cn/OneMapServer/rest/services/DG0611_Map_MCT_T/MapServer';
