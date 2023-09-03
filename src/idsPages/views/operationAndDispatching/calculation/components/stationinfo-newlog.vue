<!--
  * @Description:场站设置弹窗
  * @Author:jiawenjin
  * @Date:2021-11-13
-->
<template>
  <div class="dialog-box">
    <el-dialog
      :visible.sync="dialogVisible"
      width="65%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      class="custom-dialog-n station-dialog"
    >
      <div slot="title" class="dialog-title">
        <header>
          <div class="panel-parameterName">{{ submitObj.stationName }}</div>
          <div class="panel-control">
            <el-button size="small" :class="['font-size',{'btn':item.type!=checkedBtn}]" v-for="(item,index) in btnGroup" :key="index" :type="item.type==checkedBtn?'primary':''" @click="changeBtn(item.type)" round>{{item.name}}</el-button>
          </div>  
        </header>
      </div>
      <div class="dialog-content">
        <section>
          <!-- 编辑页面 -->
          <el-table
            v-show="stationInfoList.length"
            :data="stationInfoList"
            style="width: 100%"
            height="100%"
            :show-header="false"
            :cell-style="{ height: '32px', padding: '4px 0', fontSize: '14px' }"
            row-key="uuid"
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            class="plan-table"
          >
            <!-- 场站名称 -->
            <el-table-column prop="parameterName" min-width="120">
              <template slot-scope="scope">
                <div
                  class="parameterName"
                  :title="!scope.row.isChildren ? scope.row.parameterName : ''"
                >{{ !scope.row.isChildren ? scope.row.parameterName : "" }}</div>
              </template>
            </el-table-column>
            <!-- 计数器固定值 -->
            <el-table-column prop="currentValue" min-width="120">
              <template slot-scope="scope">
                {{
                  scope.row.currentValue || "--"
                }}
                {{checkedBtn==1?'Nm³/h':'MPa'}}
              </template>
            </el-table-column>
            <!-- 计数器 -->
            <el-table-column prop="defaultValue" align="center" width="150">
              <template slot-scope="scope">
                <div v-show="scope.row.parameterName!='进口压力'">
                  <el-input-number
                    :disabled="isDetail"
                    v-model="scope.row.defaultValue"
                    :precision="checkedBtn==1?0:3"
                    :step="checkedBtn==1?1000:0.1"
                    size="mini"
                    :min="0"
                    style="width:130px"
                  ></el-input-number>
                </div>
              </template>
            </el-table-column>
            <!-- 阀门开关 -->
            <el-table-column prop="openFlag" align="center" width="55">
              <template slot-scope="scope">
                <div v-show="scope.row.parameterName!='进口压力'">
                  <el-switch
                    :disabled="isDetail"
                    v-model="scope.row.openFlag"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#1AB394"
                    inactive-color="#CCCCCC"
                  ></el-switch>
                </div>
              </template>
            </el-table-column>
            <!-- 起止时间 -->
            <el-table-column align="left" width="270">
              <template slot-scope="scope">
                <div v-show="scope.row.parameterName!='进口压力'">
                  <div>
                    <el-select
                      class="stationSelect"
                      v-model="scope.row.beginTime"
                      :disabled="isDetail"
                      @visible-change="
                      changeTimeSelectOptions(scope.row.beginTime)
                      "
                      @change="handleStartOrEndTime(scope.row)"
                    >
                      <span class="timeImg" slot="prefix">
                        <img :src="timeIcon" />
                      </span>
                      <el-option v-for="time in options" :key="time" :label="time" :value="time"></el-option>
                    </el-select> -
                    <el-select
                      class="stationSelect"
                      v-model="scope.row.finishTime"
                      :disabled="isDetail"
                      @visible-change="
                      changeTimeSelectOptions(scope.row.finishTime)
                      "
                      @change="handleStartOrEndTime(scope.row)"
                    >
                      <span class="timeImg" slot="prefix">
                        <img :src="timeIcon" />
                      </span>
                      <el-option v-for="time in options" :key="time" :label="time" :value="time"></el-option>
                    </el-select>
                    <span style="margin-left: 8px">{{ scope.row.tomorrow || "" }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="right" width="75">
              <template slot-scope="scope">
                <div v-show="scope.row.parameterName!='进口压力'">
                  {{
                    scope.row.timeDifference === 0
                      ? "0"
                      : scope.row.timeDifference || "--"
                  }}h
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="60">
              <template slot-scope="scope">
                <span
                  class="panel-addBtn"
                  v-if="!scope.row.isChildren && scope.row.parameterName!='进口压力'"
                  @click="add(scope.row, scope.$index)"
                >+</span>
                <span class="panel-addBtn" v-if="scope.row.isChildren && scope.row.parameterName!='进口压力'" @click="remove(scope.row)">-</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="no-data" v-show="!stationInfoList.length">
            <div>
              <img :src="noneIcon"/>
              <p>{{checkedBtn == 2?'当前无设备～～':'暂无数据～～'}}</p>
            </div>
          </div>
        </section>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit" class="footer-btn" round>确 定</el-button>
        <el-button @click="closeDialog" class="footer-btn" round>取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getHoursAndMinutes } from "@/idsPages/utils";
import { getClientConfigList } from "@/idsPages/api/calculation";
import { mapState } from "vuex";
import timeOptions from "./timeOptions";
import moment from "moment";
export default {
  data() {
    return {
      stationInfoList: [],//页面展示数据
      submitObj:{},//提交数据
      type: "", //24小时或者预案
      triangleIcon: require("@/idsPages/images/pull.png"),
      noneIcon: require("@/idsPages/images/none.png"),
      timeIcon: require("@/idsPages/images/time.png"),
      options: [],
      isClose: false, //是否关闭当前页面
      isSave: false, //是否满足保存条件
      timer: null,
      btnGroup:[{
        name:"流量设置(Nm³/h)",
        type:'1'
      },{
        name:"压力设置(MPa)",
        type:'2'
      }],
      checkedBtn:'1',//1瞬流 2压力
      state:"",//1瞬流 2压力 3关闭
    };
  },
  props: {
    isDetail: {//是否可编辑 true不可编辑 false可编辑
      type: Boolean,
      default: false,
    },
    pageType:{//1代表24小时 2代表预案
      type: Number,
      default: 0,
    },
    dialogVisible:{//false代表弹窗关闭 true代表开启
      type: Boolean,
      default: false,
    }, 
  },
  watch: {
    checkedBtn:{
      handler(newVal,oldVal){
        if(newVal){
          this.timer && clearInterval(this.timer);
          let stationInfoArr = []
          if(newVal==1){
            stationInfoArr = this.submitObj.flowList
          }else{
            stationInfoArr = this.submitObj.pressList
          }
          this.stationInfoList = stationInfoArr.map((item, index) => {
            let isChildren = true;
            if (item.openFlag != 1 && !item.beginTime) {
              //初始状态，开关关闭且没有开始结束时间
              // 当前数据是24小时，则获取当前时间
              // 当前数据是预案，则08:00
              let time = getHoursAndMinutes();
              let start = this.pageType == 1 ? time : "08:00";
              let end = this.pageType == 1 ? time : "08:00";
              if (time === "24:00") {
                start = "00:00";
              }
              item.beginTime = start;
              item.finishTime = end;
              item.timeDifference = "24";
            } else {
              item.beginTime = getHoursAndMinutes(item.beginTime);
              item.finishTime = getHoursAndMinutes(item.finishTime);
            }
            if (item.children.length) {
              item.children.map((cItem, cIndex) => {
                cItem.isChildren = isChildren;
                cItem.beginTime = getHoursAndMinutes(cItem.beginTime);
                cItem.finishTime = getHoursAndMinutes(cItem.finishTime);
                cItem.tomorrow = this.getStartAndEndTimes(
                  cItem.beginTime,
                  cItem.finishTime
                );
              });
            }
            const { beginTime, finishTime } = item;
            let tomorrow = this.getStartAndEndTimes(beginTime, finishTime);
            return{
              ...item,
              index: index,
              tomorrow,
            }
          });
          this.timer = setInterval(() => {
            this.getPressureFlowRefreshInfo();
          }, 1000 * 60 * 3);
        }
      },
      //immediate:true
    },
    pageType:{
      handler(newval,oldval){
        if(newval){
          this.type = newval == 1 ? "hour" : "plan";//1为24小时模式 2为预案裤模式
        }
      },
      deep:true,
      immediate:true
    },
    dialogVisible(newVal, oldVal) {
      if (newVal) {
        // 添加间隔定时器，每3分钟轮询调取接口
        this.timer = setInterval(() => {
          this.getPressureFlowRefreshInfo();
        }, 1000 * 60 * 3);
      } else {
        this.timer && clearInterval(this.timer);
      }
    },
  },
  computed:{
    ...mapState({
      planId: (state) => state.calculation.planId,
    }),
  },
  created(){
    let obj = window.localStorage.getItem('stationObj')
    this.submitObj = JSON.parse(obj);
  },
  mounted(){
    this.getInfo()
  },
  destroyed(){
    this.timer && clearInterval(this.timer);
  },
  methods: {
    getupCompleted(){//1为所有开关都打开 0为开关没有全部被打开
      let flowList = this.submitObj.flowList,
          pressList = this.submitObj.pressList,
          flagCount = 0,//顺流总开关个数
          pflagCount = 0,//压力总开关个数
          fOpenFlagArr=[],//顺流开启开关个数
          pOpenFlagArr = [];//压力开启开关个数
      flowList.map((item, index) => {
        flagCount += 1;
        if(item.openFlag){
          fOpenFlagArr.push({
            index: index,
            flag: item.openFlag,
          });
        }
        if (item.children.length) {
          item.children.map((cItem, cIndex) => {
            flagCount += 1;
            if(cItem.openFlag){
              fOpenFlagArr.push({
                index: index,
                flag: cItem.openFlag,
              });
            }
          });
        }
      });
      pressList.map((item, index) => {
        pflagCount += 1;
        if(item.openFlag){
          pOpenFlagArr.push({
            index: index,
            flag: item.openFlag,
          });
        }
        if (item.children.length) {
          item.children.map((cItem, cIndex) => {
            pflagCount += 1;
            if(cItem.openFlag){
              pOpenFlagArr.push({
                index: index,
                flag: cItem.openFlag,
              });
            }
          });
        }
      });
      if((fOpenFlagArr.length == flagCount) && (pOpenFlagArr.length == pflagCount)){
        return '1'
      }else{
        return '0'
      }
    },
    getPressureFlowRefreshInfo() {//3分钟刷新
      let params = {
        planId: this.planId,//预案id
        gaugingPointType:this.checkedBtn,//1瞬流 2压力
        stationId:this.submitObj.stationId,//门站id
        nodeType: '1' //1 场站; 2客户
      }
      getClientConfigList(params).then((res) => {
        if (res.resultCode === 0) {
          const length = this.stationInfoList.length;
          const dataLength = res.data.list.length;
          // 循环判断是否为相同项, 相同则更新currentValue字段
          for (let i = 0; i < length; i++) {
            const station = this.stationInfoList[i];
            for (let j = 0; j < dataLength; j++) {
              const item = res.data.list[j];
              if (station.deviceId === item.deviceId) {
                station.currentValue = item.currentValue;
                if (station.children.length) {
                  station.children.map((sItem, sIndex) => {
                    sItem.currentValue = item.currentValue;
                  });
                }
              }
            }
          }
        }
      });
    },
    getInfo(){//页面初始化获取数据并按需修改数据
      if(this.submitObj.flowList.length){
        this.stationInfoList = this.submitObj.flowList.map((item, index) => {
          let isChildren = true;
          if (item.openFlag != 1 && !item.beginTime) {
            //初始状态，开关关闭且没有开始结束时间
            // 当前数据是24小时，则获取当前时间
            // 当前数据是预案，则08:00
            let time = getHoursAndMinutes();
            let start = this.pageType == 1 ? time : "08:00";
            let end = this.pageType == 1 ? time : "08:00";
            if (time === "24:00") {
              start = "00:00";
            }
            item.beginTime = start;
            item.finishTime = end;
            item.timeDifference = "24";
          } else {
            item.beginTime = getHoursAndMinutes(item.beginTime);
            item.finishTime = getHoursAndMinutes(item.finishTime);
          }

          if (item.children.length) {
            item.children.map((cItem, cIndex) => {
              cItem.isChildren = isChildren;
              cItem.beginTime = getHoursAndMinutes(cItem.beginTime);
              cItem.finishTime = getHoursAndMinutes(cItem.finishTime);
              cItem.tomorrow = this.getStartAndEndTimes(
                cItem.beginTime,
                cItem.finishTime
              );
            });
          }
          const { beginTime, finishTime } = item;
          let tomorrow = this.getStartAndEndTimes(beginTime, finishTime);
          return {
            ...item,
            index: index,
            tomorrow,
          };
        });
      }
    },
    changeBtn(val){//按钮切换
      if(val!=this.checkedBtn){//当选中的按钮改变时
        this.state = val;
        this.savePlanTopicListInfo();
      }
    },
    submit() {//确定时保存
      if (!this.isDetail) {
        this.state = 3;
        this.savePlanTopicListInfo();
      } 
    },
    closeDialog(){//关闭弹窗
      this.$confirm(`是否确定取消`, "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnClickModal: false,
        showClose: false,
        roundButton:true,
        type: "warning",
      }).then(()=>{
        this.$emit("update:dialogVisible", false);
      })
    },
    add(val, index) {//添加子级
      if (!this.isDetail) {
        let temp = JSON.parse(JSON.stringify(val.children));
        let time = this.type == "hour" ? getHoursAndMinutes() : "08:00";
        let uuid = val.children.length + 1;
        temp.push({
          simulationId: val.simulationId,
          parameterName: val.parameterName,
          deviceId: val.deviceId,
          parameterName: val.parameterName,
          currentValue: val.currentValue,
          defaultValue: 0,
          openFlag: 0,
          beginTime: time,
          finishTime: time,
          detailId: "",
          tomorrow: this.getStartAndEndTimes(time, time),
          timeDifference: this.getTimeDifference(time, time),
          uuid: `${val.index}${uuid}`,
          isChildren: true,
        });
        this.$set(val, "children", temp);
      }
    },
    remove(val) {//删除子级
      if (!this.isDetail) {
        let children = [];
        this.stationInfoList.map((item, index) => {
          if (item.children.length) {
            children = item.children.filter((x) => {
              return x.uuid !== val.uuid;
            });
            this.$set(item, "children", children);
          }
        });
      }
    },
    //时间转换成时分秒
    conversionTime(list) {
      const { beginTime, finishTime, openFlag } = list;
      let start;
      let end;
      let startAll = 0;
      let endAll = 0;
      start = this.formatTimeOfSave(beginTime); // 转换时间格式YYYY-MM-DD HH:mm:ss
      // 开始时间毫秒数
      if (beginTime) {
        let startTimes = beginTime.split(":");
        let startHoursSplit = Number(startTimes[0]) * 60 * 60 * 1000;
        let startMinutesSplit = Number(startTimes[1]) * 60 * 1000;
        startAll = startHoursSplit + startMinutesSplit;
      }
      // 结束时间毫秒数
      if (finishTime) {
        let endTimes = finishTime.split(":");
        let endHoursSplit = Number(endTimes[0]) * 60 * 60 * 1000;
        let endMinutesSplit = Number(endTimes[1]) * 60 * 1000;
        endAll = endHoursSplit + endMinutesSplit;
      }
      // 判断终止日期是当天还是明天
      if (startAll < endAll) {
        end = this.formatTimeOfSave(finishTime);
      } else if (startAll > endAll) {
        let startMillisecond = 24 * 60 * 60 * 1000 - startAll;
        let endMillisecond =
          new Date(start).getTime() + startMillisecond + endAll;
        end = moment(endMillisecond).format("YYYY-MM-DD HH:mm:ss");
      } else {
        // 开始时间和结束时间相等
        let endMillisecond = new Date(start).getTime() + 24 * 60 * 60 * 1000;
        end = moment(endMillisecond).format("YYYY-MM-DD HH:mm:ss");
      }
      delete list.tomorrow;
      return {
        ...list,
        beginTime: start,
        finishTime: end,
      };
    },
     // 保存数据前进行相关校验
    // 1、判断时间段是否有重叠；
    // 2、时间总和是否大于24小时；
    validateDataBeforeSave(list) {
      for (let i = 0; i < list.length; i++) {
        let startTimeArr = [],
          endTimeArr = [],
          begin = [],
          over = [],
          flag = [],
          count = -1,
          firstStart = "",
          lastOver = "";
        startTimeArr.push(new Date(list[i].beginTime).getTime());
        endTimeArr.push(new Date(list[i].finishTime).getTime());
        flag.push(list[i].openFlag);
        count = Number(list[i].timeDifference);
        if (list[i].children.length) {
          for (let c = 0; c < list[i].children.length; c++) {
            startTimeArr.push(
              new Date(list[i].children[c].beginTime).getTime()
            );
            endTimeArr.push(new Date(list[i].children[c].finishTime).getTime());
            flag.push(list[i].children[c].openFlag);
            count += Number(list[i].children[c].timeDifference);
          }
        }
        begin = startTimeArr.sort();
        over = endTimeArr.sort();
        
        // if (this.type === "plan") {
        //   let s = "",
        //     e = "";
        //   firstStart = list[i].beginTime.split(" ")[1];
        //   if (list[i].children.length) {
        //     let len = list[i].children.length - 1;
        //     lastOver = list[i].children[len].finishTime.split(" ")[1];
        //   } else {
        //     lastOver = list[i].finishTime.split(" ")[1];
        //   }
        //   s = `${firstStart.split(":")[0]}:${firstStart.split(":")[1]}`;
        //   e = `${lastOver.split(":")[0]}:${lastOver.split(":")[1]}`;
        //   if (s !== "08:00" || e !== "08:00") {
        //     this.isSave = false;
        //     this.$confirm(`开始时间和结束时间必须是为8点`, "设置未完成", {
        //       confirmButtonText: "继续设置",
        //       cancelButtonText: "放弃设置",
        //       closeOnClickModal: false,
        //       showClose: false,
        //       type: "warning",
        //     })
        //       .then(() => {
        //         //this.dialogVisible = true;
        //       })
        //       .catch(() => {
        //         this.getInfo()
        //         if(this.state && this.state != 3){
        //           this.checkedBtn = this.state
        //         }
        //         if(this.state == 3){
        //           this.$emit('changeClose',this.submitObj)
        //         }
        //       });
        //     return false;
        //   }
        // }

        for (var k = 1; k < begin.length; k++) {//时间段设置存在重叠
          if (begin[k] < over[k - 1]) {
            this.isSave = false;
            this.$confirm(
              `${list[i].parameterName}的时间段设置存在重叠`,
              "设置未完成",
              {
                confirmButtonText: "继续设置",
                cancelButtonText: "放弃设置",
                closeOnClickModal: false,
                showClose: false,
                roundButton:true,
                type: "warning",
              }
            )
              .then(() => {
               // this.dialogVisible = true;
              })
              .catch(() => {
                let obj = window.localStorage.getItem('stationObj')
                this.submitObj = JSON.parse(obj);
                if(this.state && this.state != 3){
                  this.checkedBtn = this.state
                }
                if(this.state == 3){
                  this.$emit('changeClose',this.submitObj)
                  this.$emit("update:dialogVisible", false);
                }
              });
            return false;
          }
        }
        if (count > 24) {//时间段设置不可以超过24小时
          this.isSave = false;
          this.$confirm(
            `${list[i].parameterName}时间段设置不可以超过24小时`,
            "设置未完成",
            {
              confirmButtonText: "继续设置",
              cancelButtonText: "放弃设置",
              closeOnClickModal: false,
              showClose: false,
              roundButton:true,
              type: "warning",
            }
          )
            .then(() => {
              //this.dialogVisible = true;
            })
            .catch(() => {
              let obj = window.localStorage.getItem('stationObj')
              this.submitObj = JSON.parse(obj);
              if(this.state && this.state != 3){
                this.checkedBtn = this.state
              }
              if(this.state == 3){
                this.$emit('changeClose',this.submitObj)
                this.$emit("update:dialogVisible", false);
              }
            });
          return false;
        }
        // if (this.type == "plan") {//时间段设置不足24小时
        //   //当为预案时
        //   if (count != 24) {
        //     this.isSave = false;
        //     this.$confirm(
        //       `${list[i].parameterName}时间段设置不足24小时`,
        //       "设置未完成",
        //       {
        //         confirmButtonText: "继续设置",
        //         cancelButtonText: "放弃设置",
        //         closeOnClickModal: false,
        //         showClose: false,
        //         type: "warning",
        //       }
        //     )
        //       .then(() => {
        //         //this.dialogVisible = true;
        //       })
        //       .catch(() => {
        //         this.getInfo()
        //         if(this.state && this.state != 3){
        //           this.checkedBtn = this.state
        //         }
        //         if(this.state == 3){
        //           this.$emit("update:dialogVisible", false);
        //         }
        //       });
        //     return false;
        //   }
        // }
      }
      this.isSave = true;
    },
    // 保存"场站信息及预案设置"列表
    savePlanTopicListInfo() {
      let planTopicDetailList = [],
          arr = [],
          flags = [];
      const tempList = JSON.parse(JSON.stringify(this.stationInfoList));
      tempList.map((item, index) => {
        arr.push({
          index: index,
          value: item.defaultValue,
          flag: item.openFlag,
          name: item.parameterName
        });
        if (item.children.length) {
          item.children.map((cItem, cIndex) => {
            arr.push({
              index: index,
              value: cItem.defaultValue,
              flag: cItem.openFlag,
              name: item.parameterName
            });
            item.children.splice(cIndex, 1, this.conversionTime(cItem));
          });
        }
        planTopicDetailList.push(this.conversionTime(item));
      });
      // 保存之前校验数据
      this.validateDataBeforeSave(planTopicDetailList);

      if (!this.isSave) {
        //不符合保存条件
        return false;
      } else {
        flags = arr.filter((item) => item.flag === 1 && item.parameterName!='进口压力');
        if (flags.length) {
          //开关有开启
          //查看预设值是否有0的情况
          arr = flags.filter((item) => item.value === 0);
          if (arr.length) {
            let textList = [];
            arr.forEach((item, index) => {
              textList.push(item.name)
            });
            textList = [...new Set(textList)];
            let text = textList.toString();
            this.$confirm(`确定将${text}属性设置为0？`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消", 
              roundButton:true,
              type: "warning",
            }).then(() => {
              //保存接口
              this.submitList(planTopicDetailList);
            });
          } else {
            //保存接口
            this.submitList(planTopicDetailList);
          }
        } else {
          //保存接口
          this.submitList(planTopicDetailList);
        }
      }
    },
    //保存数据
    submitList(list) {
      let lists = [];
      lists=list.map((item, index) => {
          delete item.tomorrow;
          if (this.type == "plan") {
            item.beginTime = item.beginTime.split(" ")[1];
            item.finishTime = item.finishTime.split(" ")[1];
          }
          if (item.children.length) {
            item.children.map((cItem, cIndex) => {
              delete cItem.isChildren;
              delete cItem.tomorrow;
              if (this.type == "plan") {
                cItem.beginTime = cItem.beginTime.split(" ")[1];
                cItem.finishTime = cItem.finishTime.split(" ")[1];
              }
            });
          }
          return {
            ...item,
          };
      });
      
      if(this.state && this.state != 3){//流量/压力按钮切换时保存
        if(this.checkedBtn == 1){
          this.$set(this.submitObj,'flowList',lists)
        }else{
          this.$set(this.submitObj,'pressList',lists)
        }
        this.$nextTick(()=>{
          window.localStorage.setItem('stationObj',JSON.stringify
          (this.submitObj))
          this.checkedBtn = this.state
        })
        
      }
      if(this.state == 3){//确定时保存
        if(this.checkedBtn == 1){
          this.$set(this.submitObj,'flowList',lists)
        }else{
          this.$set(this.submitObj,'pressList',lists)
        } 
        this.$nextTick(()=>{
          this.$set(this.submitObj,'setupCompleted',this.getupCompleted())
          this.$emit('changeClose',this.submitObj)
          this.$emit("update:dialogVisible", false);
        })
      }
      console.log(this.submitObj)
    },
    // 选择起止时间
    handleStartOrEndTime(row) {
      const { beginTime, finishTime } = row;
      row.tomorrow = this.getStartAndEndTimes(beginTime, finishTime);
      row.timeDifference = this.getTimeDifference(beginTime, finishTime);
    },
    // 获取时间差
    getTimeDifference(start, end) {
      if (!start || !end) return;
      const startHours = start.split(":")[0];
      const startMinutes = start.split(":")[1];
      const startTimes = startHours * 60 * 60 * 1000 + startMinutes * 60 * 1000;
      const endHours = end.split(":")[0];
      const endMinutes = end.split(":")[1];
      const endTimes = endHours * 60 * 60 * 1000 + endMinutes * 60 * 1000;
      if (startTimes < endTimes) {
        return (endTimes - startTimes) / 1000 / 60 / 60;
      } else if (startTimes > endTimes) {
        const millisecond = 24 * 60 * 60 * 1000;
        return (millisecond - startTimes + endTimes) / 1000 / 60 / 60;
      } else {
        return "24";
      }
    },
    // 保存列表时时间格式HH:mm转化为yyyy-mm-dd HH:mm:ss
    formatTimeOfSave(time) {
      if (!time) return;
      const date = new Date();
      var year = date.getFullYear(); //获取当前年份
      var month = date.getMonth() + 1; //获取当前月份
      var day = date.getDate(); //获取当前日
      var seconds = date.getSeconds(); //获取秒
      if (String(month).length === 1) {
        month = `0${month}`;
      }
      if (String(day).length === 1) {
        day = `0${day}`;
      }
      if (String(seconds).length === 1) {
        seconds = `0${seconds}`;
      }
      return `${year}-${month}-${day} ${time}:${seconds}`;
    },
    // 获取开始时间和结束时间毫秒数（是否显示+1）
    getStartAndEndTimes(start, end) {
      if (!start || !end) return;
      const startHours = start.split(":")[0];
      const startMinutes = start.split(":")[1];
      const startTimes = startHours * 60 * 60 * 1000 + startMinutes * 60 * 1000;
      const endHours = end.split(":")[0];
      const endMinutes = end.split(":")[1];
      const endTimes = endHours * 60 * 60 * 1000 + endMinutes * 60 * 1000;
      if (startTimes < endTimes) {
        return "";
      } else {
        return "+1";
      }
    },
    // 更改时间下拉框选项
    changeTimeSelectOptions(time) {
      let timeList = [...timeOptions];
      if (!time) {
        time = getHoursAndMinutes();
      }
      if (time === "23:45") {
        return timeList;
      }

      let index;
      const length = timeList.length;
      for (let i = 0; i < length; i++) {
        const optionsTime = timeList[i];
        if (time === optionsTime) {
          index = i;
          break;
        }
      }
      let frontTime = timeList.splice(0, index);
      timeList = [...timeList, ...frontTime];

      this.options = timeList;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-content{
  width: 100%;
  height: 200px;
}
header {
  width:100%;
  height: 40px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
  .panel-parameterName {
    font-size: 14px;
    font-weight: 400;
    color:#303133;
    &::before {
      content: "";
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: 10px;
      background-color: #47A87D;
    }
  }
  .panel-control {
    display: flex;
    align-items: center;
    .btn{
      color: #303133;
      background:#EBEEF5;
    }
    .font-size{
      font-size: 14px;
    }
  }
  
}
section {
  height: 100%;
  .el-select {
    width: 105px;
  }

  .el-date-editor {
    width: 105px;
  }
  .el-input-number {
    width: 105px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.65);
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
  }

  .timeImg {
    display: inline-block;
    height: 100%;
    line-height: 3;
    margin-top: -2px;
    img {
      width: 16px;
    }
  }

  .plan-table {
    .parameterName {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .panel-addBtn {
    width: 19px;
    height: 18px;
    color: #333;
    font-size: 14px;
    line-height: 14px;
    text-align: center;
    cursor: pointer;
    display: inline-block;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid #1ab394;
  }

  .no-data {
    width: 100%;
    height: 100%;
    background: #f9f9f9;
    position: relative;

    div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;

      img {
        width: 74px;
        height: 74px;
      }

      p {
        margin: 0;
        color: #333333;
        margin-top: 10px;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
}
</style>

<style lang="scss">
.station-dialog{
  .el-dialog__header{
    padding: 0!important;
  }
  .el-dialog__body{
    padding: 0!important;
  }
  .el-dialog__footer{
    padding: 10px;
  }
}
.stationSelect{
  .el-input--prefix{
    .el-input__inner{
      color: #303133;
      background: #fff;
      border: 1px solid #DCDFE6;
    }
  }
  .el-input__suffix{
    right: 2px;
    padding-left: 0;
    border-left: none;
  }
  .el-input{
    .el-select__caret{
      color:#DCDFE6;
      margin-top: 4px;
    }
    .el-select__caret.is-reverse{
      margin-top: -4px;
    }
  } 
}
.plan-table {
  .el-table__expand-icon{
    display: none!important;;
  }
  .cell{
    white-space: nowrap!important;;
  }
}
.footer-btn{
  padding: 9px 35px!important;
}

</style>