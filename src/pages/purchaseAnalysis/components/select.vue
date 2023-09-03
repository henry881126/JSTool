<template>
    <el-select
        v-model="selectArea"
        placeholder="请选择"
        class="select-wrap"
        @change="changeOption"
    >
        <el-option
            v-for="item in options"
            :key="item.resources_id"
            :label="item.resources_name"
            :value="item.code"
        >
        </el-option>
    </el-select>
</template>

<script>
//import x from ''
export default {
    name: 'selectCom',
    components: {},
    props: ['optionsArr', 'selectVal'],
    data() {
        return {
            selectArea: '',
            options: []
        };
    },
    watch: {
        selectVal: {
            handler() {
                this.selectArea = this.selectVal;
            },
            immediate: true
        },
        optionsArr: {
            handler() {
                this.options = this.optionsArr;
            },
            immediate: true
        }
    },
    computed: {},
    created() {},
    mounted() {
        // this.$emit('changeSelect', this.selectArea);
    },
    methods: {
        getUrl() {
            // 获取URL中的变量给下拉框，然后请求数据
        },
        getOption() {},
        changeOption(val) {
            this.selectArea = val;
            this.$emit('changeSelect', this.selectArea);
        }
    }
};
</script>

<style lang='scss' scoped>
.select-wrap {
    /deep/ .el-input {
        background-color: #ffffff1a;
        border-radius: 20px;
        border: #ffffff00;
        // width: 195px;
        .el-input__inner {
            border: none;
        }
        input {
            background-color: #ffffff00;
            color: $whiteColor;
        }
    }
}
</style>