<template>
  <div>
       <el-form
                  ref="form"
                  :model="form"
                >
                  <el-form-item label="客户名称" prop="name">
                    <i>*</i>
                    <el-select
                      v-model="form.name"
                      filterable
                      :filter-method="brandKeyChange"
                       @change="handleSelectChangeEvent"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.bp"
                        :label="item.name"
                        :value="item.bp"
                      >
                      </el-option>                      
                    </el-select>
                  <el-form-item label="客户简称" prop="abbreviation">
                    <el-input
                      v-model="form.abbreviation"
                    ></el-input>
                  </el-form-item>                   
                  </el-form-item>
       </el-form>
  </div>
</template>

<script>
import api from "/src/http/api";

export default {
    data() {
        return {
            form: {
                name: '',
                abbreviation:""
            },
            options:[]
        }
    },
    methods: {
        handleSelectChangeEvent(val) {
            console.log("val1:", val)
            let data={
                bp:val
            }
            api.users.userSerchBP(data).then((res11)=>{
                console.log("res1111111111111111:",res11)
                // this.$nextTick(() => {
                    this.form.abbreviation = res11[0].companyName;

                // })
            })
            
        },

        brandKeyChange(inputKey){
        let data = {
            code:this.$store.getters.curCom,
            name: inputKey,
            orgLevel: this.$store.getters.curComInfo.orgLevel,
        };     
        api.users.userSerch(data).then((res) => {
            console.log('search result:', res[0])
            this.options=res[0];
        })
        },        
    }
}
</script>

<style>

</style>