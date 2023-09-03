/**
 * @Description:
 * @author XiaoLong Zhang
 * @date 2021/11/4
*/
<template>
  <el-select
      class="MultipleSelect"
      v-model="selectValues"
      v-bind="$attrs"
      multiple
      collapse-tags
      :placeholder="firstOption.label"
      style="margin-right: 10px"
      @change="changeSelect"
  >
    <el-option
        v-if="options.length"
        :key="firstOption.code"
        :label="firstOption.label"
        :value="firstOption.code"
    >
      <el-checkbox v-model="isSelectAll" @click.prevent.native class="MultipleCheckBox">
        {{ firstOption.label }}
      </el-checkbox>
    </el-option>
    <el-option
        v-for="item in options"
        :key="item[props.value]"
        :label="item[props.label]"
        :value="item[props.value]"
    >
      <el-checkbox v-model="item.isCheck" @click.prevent.native class="MultipleCheckBox">
        {{ item[props.label] }}
      </el-checkbox>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "MultipleSelect",
  inheritAttrs: false, // 似乎设不设置都可以
  // v-model
  model: {
    prop: "initSelectValues",
    event: "change",
  },
  props: {
    // 全选内容
    firstOption: {
      type: Object,
      default: () => {
        return {
          label: "全选",
          code: "all",
        };
      },
    },
    // 初始选中项数组
    initSelectValues: {
      type: Array,
      default: () => [],
    },
    // 全部下拉选项数据
    options: {
      type: Array,
      default: () => [],
    },
    // 选项键值对
    props: {
      type: Object,
      default: () => {
        return {
          label: "label",
          value: "value",
        };
      },
    },
  },
  data() {
    return {
      selectValues: [],
      isSelectAll: false,
    };
  },
  watch: {
    options: { // 后台返回的数据列表
      handler() {
        this.selectValues = this.initSelectValues;
      },
    },
    // 监听选中项（全选，全不选以及checkbox是否勾选）
    selectValues: {
      handler(newValue) {
        this.options.forEach((item) => {
          if (newValue.includes(item[this.props.value])) {
            item.isCheck = true;
          } else {
            item.isCheck = false;
          }
        });
        if (this.options.length !== 0) {
          if (newValue.length === this.options.length) {
            this.isSelectAll = true;
          } else {
            this.isSelectAll = false;
          }
        }
        // 强制更新（checkbox回显)
        this.$forceUpdate();
      },
    },
  },
  methods: {
    changeSelect(val) {
      // all|key|state|type代表"全选checkbox"是checked状态
      if (val.includes(this.firstOption.code)) {
        // 说明已经全选了，所以全不选
        if (val.length > this.options.length) {
          this.selectValues = [];
        } else {
          this.selectValues = this.options.map(
              (item) => item[this.props.value]
          );
        }
      }
      this.$emit("change", this.selectValues);
    },
  },
};
</script>
<style lang="scss">
.MultipleSelect{
  height: 32px;
  margin-right:15px;
}
.MultipleSelect .el-input__inner{
  background:none;
  height: 32px;
  border-radius: 20px;
  border: 1px solid #DCDFE6 !important;
}
.MultipleSelect .el-input__inner::placeholder {
  color: #000;
  text-align:center;
}
.MultipleSelect .el-input__icon{
  line-height: 32px;
}
.MultipleSelect .el-icon-arrow-up:before {
  content: "\e6e1";
  color: #000;
}
.MultipleSelect  .el-input__suffix {
  right: 10px;
  padding-left: 0;
  border-left: none;
}
.MultipleSelect .el-input--suffix .el-input__inner {
  padding-left: 15px;
}
.MultipleCheckBox .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #47A87D;
  border-color: #47A87D;
}
.MultipleCheckBox .el-checkbox__input.is-checked+.el-checkbox__label {
  color: #606266;
}
</style>
<style lang="scss" scoped>
//隐藏对勾
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  position: absolute;
  right: 20px;
  font-family: element-icons;
  content: "\e6da";
  font-size: 12px;
  font-weight: 700;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  opacity: 0;
}
</style>
