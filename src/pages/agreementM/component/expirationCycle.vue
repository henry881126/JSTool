
<template>
  <div class="expiration-cycle" id="boxArea">
    <el-input
      class="inputStyle"
      v-model="inputValue"
      type="text"
      placeholder="请选择交割周期"
      readonly
      @focus="showBox = true"
    >
      <i slot="prefix" class="el-input__icon el-icon-date"></i>
      <!-- 清空图标：有内容的时候渲染出来，鼠标hover到input框的时候再显示出来（即：输入框有内容并且鼠标悬浮时显示该图标） -->
      <i
        slot="suffix"
        class="el-input__icon el-icon-circle-close clearIconStyle"
        v-if="showClear"
        @click="resetMonth"
      ></i>
    </el-input>
    <div class="change-content" v-if="showBox">
      <div class="data-day-type">
        <div class="day-item">
          <!-- {{form.expirationCycleTypeLeft}} -->
          <el-select
            style="border: 1px solid #e4e7ed"
            v-model="form.expirationCycleTypeLeft"
            placeholder="请选择"
            disabled
          >
            <el-option
              disabled
              v-for="item in expirationCycleListType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <ul class="itemV">
            <li
              v-for="(item, index) in expirationCycleListLeft"
              :key="index"
              @click="checkedLeft(item, index)"
            >
              <span :class="{ checkC: ischeckedL == index }">{{
                item.label
              }}</span>
            </li>
          </ul>
        </div>
        <div class="day-item">
          <el-select
            class="custem-select"
            style="border: 1px solid #e4e7ed"
            v-model="form.expirationCycleTypeRight"
            placeholder="请选择"
          >
            <el-option
              v-for="item in expirationCycleListType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <ul class="itemV">
            <li
              v-for="(item, index) in expirationCycleListLeft"
              :key="index"
              @click="checkedRight(item, index)"
            >
              <span :class="{ checkC: ischeckedR == index }">{{
                item.label
              }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="data-day-value"></div>
      <div class="buttonBox t-r">
        <el-button
          class="buttonStyleC"
          size="mini"
          plain
          @click.stop="resetMonth"
          >清空</el-button
        >
        <el-button
          class="buttonStyleS"
          size="mini"
          plain
          @click.stop="handleSubmit"
          >确定</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import Labels from "@antv/g2/lib/component/labels";
import { getCusYear, getCusYear1, publicLableValueC } from "../utils/commen";
import { cos } from 'mathjs';
export default {
  props: ["expirationCycleO"],
  data() {
    return {
      ischeckedL: "-1",
      ischeckedR: "-1",
      inputValue: "",
      expirationCycleListType: [
        {
          label: "本日",
          value: "1",
        },
        {
          label: "次日",
          value: "2",
        },
      ],
      expirationCycleListLeft: [
        {
          label: "0点",
          value: "1",
        },
        {
          label: "1点",
          value: "2",
        },
        {
          label: "2点",
          value: "3",
        },
        {
          label: "3点",
          value: "4",
        },
        {
          label: "4点",
          value: "5",
        },
        {
          label: "5点",
          value: "6",
        },
        {
          label: "6点",
          value: "7",
        },
        {
          label: "7点",
          value: "8",
        },
        {
          label: "8点",
          value: "9",
        },
        {
          label: "9点",
          value: "10",
        },
        {
          label: "10点",
          value: "11",
        },
        {
          label: "11点",
          value: "12",
        },
        {
          label: "12点",
          value: "13",
        },{
          label: "13点",
          value: "14",
        },
        {
          label: "14点",
          value: "15",
        },
        {
          label: "15点",
          value: "16",
        },
        {
          label: "16点",
          value: "17",
        },
        {
          label: "17点",
          value: "18",
        },
        {
          label: "18点",
          value: "19",
        },
        {
          label: "19点",
          value: "20",
        },
        {
          label: "20点",
          value: "21",
        },
        {
          label: "21点",
          value: "22",
        },
        {
          label: "22点",
          value: "23",
        },
        {
          label: "23点",
          value: "24",
        },
       
       
      ],
      showClear: "",
      form: {
        showClear: false, // 是否显示输入框右边的“清空”小图标
        expirationCycleStartTime: "",
        expirationCycleEndTime: "",
        expirationCycleTypeLeft: "1",
        expirationCycleTypeRight: "1",
        expirationCycleRight: "",
        expirationCycleLeft: "",
      },
      showBox: false, // 是否显示月份选择弹框
      leftV: "",
      rightV: "",
    };
  },
  created() {
  },
  watch: {},
  mounted() {
    this.huixian();
           //点击弹框外的任意位置关闭区域弹窗
        document.addEventListener('click',(e) => {
            //获取弹窗对象
            const boxArea = document.getElementById('boxArea');
            //判断弹窗对象中是否包含点击对象
            if(boxArea &&　!boxArea.contains(e.target)) {
                this.showBox = false;
            }
        })
  },

  methods: {
    huixian() {
      if (
        this.expirationCycleO.deliveryCycleBegin &&
        this.expirationCycleO.deliveryCycleEnd
      ) {
        this.expirationCycleListLeft.forEach((item, index) => {
          if (item.label == this.expirationCycleO.deliveryCycleBegin) {
              this.leftV = item
            this.ischeckedL = true;
          }
          if (item.label == this.expirationCycleO.deliveryCycleEnd) {
              this.rightV = item
            this.ischeckedR = true;
          }
        });
      }
      this.form.expirationCycleTypeRight = this.expirationCycleO
        .deliveryCycleTypeR
        ? this.expirationCycleO.deliveryCycleTypeR
        : "1";
      this.form.expirationCycleTypeLeft = this.expirationCycleO
        .deliveryCycleTypeL
        ? this.expirationCycleO.deliveryCycleTypeL
        : "1";
      if (
        this.expirationCycleO.deliveryCycleBegin &&
        this.expirationCycleO.deliveryCycleEnd
      ) {
        this.inputValue =
          publicLableValueC(
            this.expirationCycleListType,
            this.form.expirationCycleTypeLeft
          ) +
          "" +
          this.expirationCycleO.deliveryCycleBegin +
          "-" +
          publicLableValueC(
            this.expirationCycleListType,
            this.form.expirationCycleTypeRight
          ) +
          this.expirationCycleO.deliveryCycleEnd;
      }
      let obj = {};
      obj.typeL = this.form.expirationCycleTypeLeft;
      obj.typeR = this.form.expirationCycleTypeRight;
      obj.valueL = this.expirationCycleO.deliveryCycleBegin;
      obj.valueR = this.expirationCycleO.deliveryCycleEnd;
      this.$emit("dayObj", obj);
    },
    handleSubmit() {
      this.showBox = false;
      if (this.leftV || this.rightV) {
        this.inputValue =
          publicLableValueC(
            this.expirationCycleListType,
            this.form.expirationCycleTypeLeft
          ) +
          "" +
          this.leftV.label +
          "-" +
          publicLableValueC(
            this.expirationCycleListType,
            this.form.expirationCycleTypeRight
          ) +
          this.rightV.label;
      }
      let obj = {};
      obj.typeL = this.form.expirationCycleTypeLeft;
      obj.typeR = this.form.expirationCycleTypeRight;
      obj.valueL = this.leftV.label;
      obj.valueR = this.rightV.label;
      this.$emit("dayObj", obj);
    },
    // 重置
    resetMonth() {
      this.inputValue = "";
    },
    checkedLeft(item, index) {
      this.ischeckedL = index;
      this.leftV = item;
    },
    checkedRight(item, index) {
      this.ischeckedR = index;
      this.rightV = item;
    },
  },
};
</script>
<style lang="scss">
.expiration-cycle {
  .change-content {
    border: 1px solid #e4e7ed;
    position: absolute;
    z-index: 1700;
    background: #fff;
    top: 50px;
    border-radius: 4px;
    .data-day-type {
      display: flex;
      .day-item {
        flex: 1;
        margin: 5px;
        border: 1px solid #e4e7ed;
        .custem-select {
        }
        /deep/.el-select {
          border: 1px solid #e4e7ed !important;
          .el-input__inner {
            border: 1px solid #e4e7ed !important;
          }
        }
        /deep/.el-input__inner {
          text-align: center;
          border: 1px solid #e4e7ed;
        }
        .itemV {
          height: 180px;
          overflow: auto;
          background: #fff;
          text-align: center;
          border: 1px solid #e4e7ed;
          margin-top: 10px;
          .checkC {
            background: #47a87d;
            border-radius: 4px;
            padding: 8px 15px;
            color: #fff;
          }
        }
      }
    }
    .data-day-value {
    }
  }
  .buttonBox {
    text-align: right;
    margin-right: 16px;
    .buttonStyleC {
      color: #47a87d;
      border: none;
    }
    .buttonStyleS {
      color: #000000;
      border: 1px solid #dcdfe6;
      border-radius: 12px;
      //  border: none;
    }
  }
}
</style>