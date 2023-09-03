<template>
  <div class="page-bg">
    <div class="top-bag">
      <div class="top-header">
        <top-menu :date-picker-show="false"
                  title="天然气输配(调度)智慧管理平台"></top-menu>
        <div class="separator-wrapper">
          <el-breadcrumb class="custom-separator">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>客户管理</el-breadcrumb-item>
            <el-breadcrumb-item>客户列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="top-header-serch">
          <el-dialog :visible.sync="dialogVisible1"
                     custom-class='box'>

            <div class="top">
              <h3>{{ formType === "add" ? "新增客户" : "编辑" }}</h3>

            </div>
            <el-form ref="form"
                     :model="form"
                     label-width="240px"
                     class="userPopup"
                     :rules="rules">
              <el-form-item label="客户名称"
                            prop="name">
                <i>*</i>
                <el-select v-model="form.name"
                           filterable
                           @change="handleSelectChangeEvent"
                           :filter-method="brandKeyChange"
                           placeholder="请输入客户名称全称"
                           popper-class="Change_small_arrow"
                           :disabled="disableKehuName"
                           style="width: 80%;float:left;margin-left:28px">
                  <el-option v-for="item in options"
                             :key="item.bp"
                             :label="item.name"
                             :value="item.bp">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户简称"
                            prop="abbreviation">
                <i>*</i>
                <el-input v-model="form.abbreviation"
                          placeholder="请输入客户名称简称"
                          style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="客户BP号"
                            prop="bp">
                <i>*</i>
                <el-input v-model="form.bp"
                          placeholder="请输入客户BP号"
                          :disabled="disableBP"
                          style="width: 80%;float:left;"></el-input>
              </el-form-item>
              <el-form-item label="所属行业"
                            prop="industryName">
                <i>*</i>
                <el-select v-model="form.industryName"
                           filterable
                           placeholder="请输入客户所属行业"
                           :disabled="disableindustryName"
                           popper-class="Change_small_arrow"
                           style="width: 80%;float:left;margin-left:28px">
                  <el-option v-for="item in selectoptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="社会信用代码"
                            prop="sociology">
                <i>*</i>
                <el-input v-model="form.sociology"
                          placeholder="请输入社会信用代码"
                          :disabled="disableCredit"
                          style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="慧用能使用证号"
                            prop="huiCardNumber">
                <i>*</i>
                <el-input v-model="form.huiCardNumber"
                          placeholder="请输入慧用能使用证号"
                          style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="注册地址"
                            prop="address">
                <i>*</i>
                <el-input v-model="form.address"
                          placeholder="请输入注册地址"
                          style="width: 80%;"
                          :disabled="disableress"></el-input>
              </el-form-item>
              <el-form-item label="对接人姓名"
                            prop="dockingPeopleName">
                <el-input v-model="form.dockingPeopleName"
                          placeholder="请输入对接人姓名"
                          style="width: 80%;"
                          :disabled="disableName"></el-input>
              </el-form-item>
              <el-form-item label="对接人手机号"
                            prop="dockingPeopleTel">
                <el-input v-model="form.dockingPeopleTel"
                          placeholder="请输入授权人手机号"
                          style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item></el-form-item>
            </el-form>
            <el-button type="primary"
                       @click="onSubmit"
                       class="submitBtn"
                       v-if="formType === 'add'">提交
            </el-button>
            <el-button type="primary"
                       @click="handleUserUpdateEvent"
                       v-else>提交
            </el-button>

          </el-dialog>
        </div>
        <div class="card-wrapper"
             style="padding: 20px;box-sizing: border-box;">
          <div class="top-content-header">
            <p>客户列表</p>
            <div class="top-content-serch">
              <i class="el-icon-search"></i>
              <input v-model="keyword"
                     type="text"
                     placeholder="请输入客户名称，BP号"
                     ref="empty"
                     @change="userInformationlist($event)" />
            </div>
            <div>
              <el-button @click="exportData"
                         round
                         class="export"
                         icon="el-icon-upload2"
                         style="margin-right: 10px;">导出</el-button>
              <button @click="newBtn"
                      class="btn"><i>+</i> 新增客户</button>
            </div>
          </div>
          <el-dialog :visible.sync="dialogVisible"
                     custom-class='seeUser'>

            <div class="seeuser-top">
              <h3>{{ dialogTitle || messageArr.name }}</h3>
              <!-- <i class="el-icon-close" @click="showMask = false"></i> -->
              <!-- <i class="el-icon-close"
                   @click="handleDialogCloseEvent"></i> -->
            </div>
            <ul class="seeuser-content">
              <li><span>客户名称 :</span> {{ messageArr.name }}</li>
              <li><span>客户简称 :</span> {{ messageArr.commonName }}</li>
              <li><span>客户BP号 : </span> {{ messageArr.bp }}</li>
              <li><span>所属行业 : </span> {{ messageArr.dicValue }}</li>
              <li><span>社会信用代码 :</span> {{ messageArr.creditCode }}</li>
              <li>
                <span>慧用能使用账号 : </span> {{ messageArr.huiCardNumber }}
              </li>
              <li><span>注册地址 : </span> {{ messageArr.address }}</li>
              <li>
                <span>对接人姓名 :</span> {{ messageArr.dockingPeoPleName }}
              </li>
              <li>
                <span>对接人手机号 :</span> {{ messageArr.dockingPeopleTel }}
              </li>
            </ul>

          </el-dialog>
          <el-table :data="tableData"
                    header-row-class-name="custom-table-header"
                    header-cell-class-name="custom-table-header-cell"
                    cell-class-name="custom-table-cell"
                    class="custom-table-n"
                    border
                    style="color:#303133"
                    ref="customerTable">
            <el-table-column type="selection"
                             width="65"></el-table-column>
            <el-table-column prop="bp"
                             label="客户BP号"
                             width="">
            </el-table-column>
            <el-table-column prop="name"
                             label="客户名称"
                             min-width="110">
            </el-table-column>
            <el-table-column prop="industryName"
                             label="所属行业"
                             width="">
            </el-table-column>
            <el-table-column label="更新时间"
                             width="">
              <template slot-scope="scope">
                {{scope.row.updateTime ? scope.row.updateTime : '-'}}
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row.id)"
                           type="text"
                           size="small">查看</el-button>
                <span class="userSpan">|</span>
                <el-button type="text"
                           size="small"
                           @click="userUpdate(scope.row)">编辑</el-button>
                <span class="userSpan">|</span>
                <el-button type="text"
                           @click="open(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="currentPage"
            :page-sizes="[10,20,30]"
            :page-size="pageSize"
            :total="pageTotal"
            background
            class="custom-page-n"
            layout="total, slot, prev, pager, next, sizes">
            <span style="color:#606266;">当前{{this.tableData.length || 0}}条</span>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import topMenu from "../../components/topMenu/topMenu2";
import api from "/src/http/api";
import axios from "axios"
import exportApi from '/src/components/export/export'
import {buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin} from '@/utils/mixin'


export default {
  mixins: [exportApi, buriedPointOfStayTimeMixin, buriedPointOfEnterPageMixin],

  data () {
    return {
      selectoptions: [
        {
          value: "其他",
          label: "其他",
        },
        {
          value: "包装纸类",
          label: "包装纸类",
        },
        {
          value: "餐饮",
          label: "餐饮",
        },
        {
          value: "其他高端纸制品",
          label: "其他高端纸制品",
        },
        {
          value: "纸浆制造",
          label: "纸浆制造",
        },
        {
          value: "办公用纸",
          label: "办公用纸",
        },
        {
          value: "食品制造业",
          label: "食品制造业",
        },
        {
          value: "搪瓷制品制造",
          label: "搪瓷制品制造",
        },
        {
          value: "平板玻璃制造",
          label: "平板玻璃制造",
        },
        {
          value: "金属工具制造",
          label: "金属工具制造",
        },
        {
          value: "建筑陶瓷制品制造",
          label: "建筑陶瓷制品制造",
        },
        {
          value: "服装原料业",
          label: "服装原料业",
        },
        {
          value: "集中供热",
          label: "集中供热",
        },
        {
          value: "服装成品业",
          label: "服装成品业",
        },
        {
          value: "电厂生产与供应",
          label: "电厂生产与供应",
        },
        {
          value: "汽车及零配件制造",
          label: "汽车及零配件制造",
        },
        {
          value: "其他能源生产与共应",
          label: "其他能源生产与共应",
        },
        {
          value: "饲料加工业",
          label: "饲料加工业",
        },

      ],
      rules: {
        huiCardNumber: [
          {
            required: true,
            message: "慧用能使用账号不能为空",
            trigger: "blur",
          },
        ],
        dockingPeopleName: [
          { required: true, message: "对接人姓名不能为空", trigger: "blur" },
        ],
        dockingPeopleTel: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "客户名称不能为空", trigger: "blur" },
        ],
        abbreviation: [
          { required: true, message: "客户简称不能为空", trigger: "blur" },
        ],
        bp: [{ required: true, message: "bp号不能为空", trigger: "blur" }],
        sociology: [
          { required: true, message: "社会信用代码不能为空", trigger: "blur" },
        ],
        address: [
          { required: true, message: "注册地址不能为空", trigger: "blur" },
        ],
        industryName: [
          { required: true, message: "所属行业不能为空", trigger: "blur" },
        ],
      },
      edit: true,
      id: null,
      optionsArr: [],
      messageArr: [],
      value: "",
      offset: 0,
      formType: "add", // add 添加表单 update 编辑表单
      //用户基础信息列表
      tableData: [],
      data: [],
      showModal: false,
      showMask: false,
      form: {
        name: "",
        abbreviation: "",
        bp: "",
        industryName: "",
        sociology: "",
        huiCardNumber: "",
        address: "",
        dockingPeopleName: "",
        dockingPeopleTel: "",
      },
      options: [],
      list: [],
      loading: false,
      pageSize: 10,
      pageTotal: 0,
      currentPage: 1,
      //默认disable为false
      disableKehuName: false,
      disableAtion: false,
      disableBP: false,
      disableindustryName: false,
      disableCredit: false,
      disableress: false,
      disableName: false,
      disableTel: false,
      dialogVisible1: false,
      dialogVisible: false,
      keyword: "",
      dialogTitle: '',
      timer: '',  // 计时器，防抖用
    };
  },
  //点击切换城市刷新页面
  computed: {
    curCom () {
      return this.$store.getters.curCom;
    }
  },
  watch: {
    curCom () {
      if (this.$store.getters.curCom !== "") {
        this.userInformationlist();
      }
    },
    keyword: {
      handler(n, o) {
        this.debounce(this.userInformationlist, 500)
      }
    }
  },
  mounted () {
    //初始化调用列表接口
    this.userInformationlist();
  },
  destroyed () {
    this.$off();
  },

  created () {
    window.zhuge.track('客户管理-进入客户列表页面',{'页面名称':'客户列表页面'})
  },
  methods: {
    // 搜索文本框 @input 事件防抖
    debounce(fn, wait) {
      if(this.timer !== null) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(fn, wait);
    },
    // 导出
    exportData () {
      const checkedRecord = this.$refs.customerTable.selection
      if (!checkedRecord || checkedRecord.length < 1) {
        this.$message({
          type: 'warning',
          message: '请选择数据后再执行导出操作！',
          duration: 3000
        })
        return false
      }
      let ids = ''
      checkedRecord.map(item => {
        ids += item.id + ','
      })
      let params = {
        idList: ids.substr(0, ids.length - 1)
      }
      api.users.exportData(params).then(res => {
        this.download(res, 'xlsx', '客户列表')
      })
    },
    handleDialogCloseEvent () {
      this.messageArr = []
      this.showMask = false
    },
    //查询
    userSerch (keyword) {
      let data = {
        code: this.$store.getters.curCom,
        name: keyword,
        orgLevel: this.$store.getters.curComInfo.orgLevel,
      };
      api.users.userSerch(data).then((res) => {
        const arr = [];
        res[0].map((item) => {
          arr.push({
            value: item.bp,
            label: item.name,
          });
        });
        this.list = arr;
      });
    },
    //动态实时搜索
    brandKeyChange: function (inputKey) {
      let data = {
        code: this.$store.getters.curCom,
        name: inputKey,
        orgLevel: this.$store.getters.curComInfo.orgLevel,
      };
      api.users.userSerch(data).then((res) => {
        console.log("search result:", res[0]);
        this.options = res[0];
      });
    },
    //搜索
    userInp (ev) {
      let data = {
        //登陆返回code
        code: this.$store.getters.curCom,
        //登陆返回level
        orgLevel: this.$store.getters.curComInfo.orgLevel,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        keyWord: ev.target.value,
      };
      api.users.userInformationlist(data).then((res) => {
        this.tableData = res[0].list;
        this.pageTotal = res[0].total;
      });
    },
    //分页
    handleCurrentChange (val) {
      this.currentPage = val;
      this.userInformationlist();
      this.currentPage = 1
    },
    // 调整每页显示条数
    handleSizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      this.userInformationlist()
    },
    //查看
    handleClick (id) {
      this.dialogVisible = true
      let data = {
        id: id,
      };
      this.dialogTitle = this.tableData.find(item => item.id === id)?.['name']
      api.users.userIdQuery(data).then((res) => {
        if (res) {
          console.log("res0000000", res[0]);
          this.messageArr = res[0];
          console.log(this.messageArr.bp, 999999999);
          this.showMask = true;
        }
      });
    },
    //删除
    open (row) {
      this.$confirm(`确定要删除“ ${row.name} ”吗`, "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        cancelButtonClass: "user-list-cancel-button-class",
        confirmButtonClass: "user-list-cancel-button-class",
      }).then(() => {
        let data = {
          id: row.id,
        };
        api.users.userDeletion(data).then((res) => {
          if (res) {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.userInformationlist();
          }
        });
      });
    },
    //自动填充
    handleSelectChangeEvent (val) {
      let data = {
        bp: val,
      };
      api.users.userSerchBP(data).then((res11) => {
        this.form.abbreviation = res11[0].commonName;
        this.form.bp = res11[0].bp;
        this.form.industryName = res11[0].dicValue;
        this.form.sociology = res11[0].creditCode;
        this.form.address = res11[0].address;
        this.form.dockingPeopleName = res11[0].name;
        this.form.dockingPeopleTel = res11[0].tel;
        this.disableAtion = !(res11[0].commonName === null || res11[0].commonName === '')
        this.disableBP = !(res11[0].bp === null || res11[0].bp === '')
        this.disableindustryName = !(res11[0].dicValue === null || res11[0].dicValue === '')
        this.disableCredit = !(res11[0].creditCode === null || res11[0].creditCode === '')
        this.disableress = !(res11[0].address === null || res11[0].address === '')
        this.disableName = !(res11[0].name === null || res11[0].name === '')
        this.disableTel = !(res11[0].tel === null || res11[0].tel === '')
      });
    },
    //模糊搜索
    remoteMethod (query) {
      if (this.query !== "") {
        setTimeout(() => {
          this.options = this.list.filter((item) => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    //新增客户按钮
    newBtn () {
      this.dialogVisible1 = true;
      this.resetForm()
      this.formType = "add";
    },
    //用户列表
    userInformationlist () {
      console.log(1111111111111111111111);
      let data = {
        //登陆返回code
        code: this.$store.getters.curCom,
        //登陆返回level
        keyWord: this.keyword,
        orgLevel: this.$store.getters.curComInfo.orgLevel,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      };
      api.users.userInformationlist(data).then((res) => {
        this.tableData = res[0].list;
        this.pageTotal = res[0].total;
        console.log("res222:", this.pageTotal);
      });
    },
    //提交按钮
    onSubmit () {
      this.formType = "add";
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.userSaving();
          this.closeModal()
        } else {
          return false;
        }
      });
    },
    //基础信息修改
    userUpdate (row) {
      this.dialogVisible1 = true
      let data = {
        id: row.id,
      };
      this.id = row.id;
      api.users.userIdQuery(data).then((res) => {
        let tempArr = [];
        if (res) {
          tempArr = res[0];
          this.form = {
            name: tempArr["name"],
            abbreviation: tempArr["commonName"],
            bp: tempArr["bp"],
            industryName: tempArr["dicValue"],
            sociology: tempArr["creditCode"],
            huiCardNumber: tempArr["huiCardNumber"],
            address: tempArr["address"],
            dockingPeopleName: tempArr["dockingPeoPleName"],
            dockingPeopleTel: tempArr["dockingPeopleTel"],
          };
        }
      });
      this.formType = "update";
      this.form = row;
      this.resetForm();
      this.disableKehuName = true
      this.showModal = true;
    },
    //编辑提交按钮
    handleUserUpdateEvent () {
      this.$refs.form.allDisabled = false;
      this.$refs["form"].validate((valid) => {
        const formmm = {
          bp: this.form.bp,
          commonName: this.form.abbreviation,
          customerIndustry: this.form.industryName,
          dockingPeopleName: this.form.dockingPeopleName,
          dockingPeopleTel: this.form.dockingPeopleTel,
          huiCardNumber: this.form.huiCardNumber,
          id: this.id,
        };
        if (valid) {
          console.log("bianji");
          this.showModal = false;
          api.users.userUpdata(formmm).then((res) => {
            if (res) {
              this.$message({
                type: "success",
                message: "编辑成功",
              });

              this.form = {};
              this.$refs["empty"].value = "";
              this.userInformationlist();
            }
          });
        } else {
          return false;
        }
      });
    },

    //用户基础信息保存
    userSaving () {
      let data = {
        bp: this.form.bp,
        commonName: this.form.abbreviation,
        customerIndustry: this.form.industryName,
        dockingPeopleName: this.form.dockingPeopleName,
        dockingPeopleTel: this.form.dockingPeopleTel,
        huiCardNumber: this.form.huiCardNumber,
        loginName: this.form.name,
      };

      axios.request({
        url: 'dongwan/basicInfo/save',
        method: 'post',
        data
      }).then(res => {
        if (res.data) {
          console.log('stop res:', res)
          this.userInformationlist()
          this.$message.success(res.data.message);

        }

      })

    },

    //用户基本信息删除
    userDeletion () {
      let data = {
        id: 1,
      };
      api.users.userDeletion(data).then((res) => {
        if (res) {
          this.$message({
            type: "success",
            message: "删除成功",
          });
        }
      });
    },
    closeModal: function () {
      this.showModal = false
    },
    //封装表单输入的函数
    resetForm: function () {
      this.form = {
        name: "",
        abbreviation: "",
        bp: "",
        industryName: "",
        sociology: "",
        huiCardNumber: "",
        address: "",
        dockingPeopleName: "",
        dockingPeopleTel: "",
      };
      this.disableKehuName = false
      this.disableAtion = false
      this.disableBP = false
      this.disableindustryName = false
      this.disableCredit = false
      this.disableress = false
      this.disableName = false
      this.disableTel = false
    }
  },
  components: {
    topMenu,
  },
};
</script>
<style lang="scss">
.Change_small_arrow {
  width: 543px;
  margin-left: -30px;
}

.user-list-cancel-button-class {
  border-radius: 22px;
  color: "red";
  margin-bottom: 10px;

  &:nth-child(2) {
    background-color: #47a87d;
    border: 0;
  }
}

.el-message-box__wrapper {
  background: rgba(86, 125, 185, 0.4);
}
</style>
<style scoped lang='scss'>
/deep/ .el-input__inner {
  padding-left: 24px !important;
}

.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: 0;
}

/deep/ .el-table {
  color: #303133 !important;
}

/deep/ ::-webkit-input-placeholder {
  color: #909399 !important;
}

/deep/ .el-container {
  height: 0vh !important;
}

/deep/ .el-input--suffix .el-input__inner {
  color: #303133 !important;
  background-color: #fff;
}

/deep/ .el-input.is-disabled .el-input__inner {
  color: #303133 !important;
}

.el-table::-webkit-scrollbar {
  display: none; /*隐藏滚动条*/
}

/deep/ .el-select-dropdown__list {
  padding: 0 0 0 40px !important;
}

/deep/ .el-input--suffix .el-input__inner {
  height: 40px;
}

/deep/ [data-v-54f414a3] .el-input__inner {
  padding-left: 24px;
}

/deep/ .el-button--small,
.el-button--small.is-round {
  border-radius: 40px !important;
}

.el-button--text {
  font-size: 14px;
}

.el-input {
  width: 90%;
  float: left;
}

/deep/ .el-form-item__label:before {
  display: none;
}

/deep/ .el-input--suffix .el-input__inner {
  // width: 542px;
  border-radius: 4px;

  color: #c0c4cc;
  border: 1px solid #dcdfe6;
  margin-left: -30px;
}

/deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #fff;
}

/deep/ .el-breadcrumb__inner.is-link {
  color: #ccc;
}

/deep/ .el-input.is-disabled .el-input__inner {
  color: #909399;
  padding-left: 24px;
}

.el-form-item {
  margin-bottom: 12px;
}

/deep/ .el-form-item__error {
  top: 36px;
  font-size: 4px;
  left: 15px;
}

.custom-table-n .custom-table-header-cell {
  height: 70px;
}

.custom-table-n .custom-table-cell {
  height: 60px;
}

/deep/ .el-select .el-input__suffix {
  border-left: none; // 去除原全局样式中的左侧竖线
  right: 30px;
}

.el-select .el-input__suffix {
  border: 0;
}

.el-form-item__label:before {
  display: none;
}

.userSpan {
  color: #409eff;
  padding: 0 5px;
}

.el-button--small {
  border-radius: 25px;
}

/deep/ .el-message-box__btns {
  padding: 10px 20px;
}

.el-message-box__btns button:nth-child(2) {
  background-color: #47a87d;
}
/deep/.el-dialog__wrapper {
  background: rgba(86, 125, 185, 0.3);
}
/deep/ .el-select-dropdown {
  position: absolute !important;
  left: 517px !important;
  width: 545px !important;
}
/deep/.el-dialog__body {
  padding: 4px 0;
}
/deep/.el-dialog__header {
  padding: 0;
}
/deep/.seeUser {
  width: 600px;
  height: 476px;
  background-color: #fff;
  // position: fixed;
  // left: 33%;
  // z-index: 10;
  border-radius: 4px;

  .seeuser-top {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid #dcdfe6;
    color: #303133;
    h3 {
      font-style: normal;
      font-size: 20px;
      font-weight: 900;
    }
    i {
      padding-top: 20px;
      font-size: 20px;
    }
  }

  .seeuser-content {
    width: 100%;
    // height: 400px;
    text-align: left;
    padding-top: 20px;
    // overflow: hidden !important;
    span {
      display: inline-block;
      width: 150px;
      height: 20px;
      text-align: right;
      color: #606166;
    }

    li {
      color: #303133;
      display: flex;
      line-height: 35px;
      font-size: 14px;
      padding-left: 60px;
      height: 42px;
      // padding: 5px 0;
    }
  }
}

.userPopup {
  text-align: center;
  height: 482px;
  border-bottom: 1px solid #dcdfe6;
}

.top-content-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  position: relative;

  p {
    float: left;
    margin-top: 4px;
    font-weight: 900;
    font-size: 18px;
  }

  .top-content-serch {
    left: 200px;
    width: 240px;
    height: 32px;
    background-color: #f5f7fa;
    border: 0;
    color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 16px;
    padding-left: 20px;
    display: flex;
    position: absolute;
    left: 103px;
    .el-icon-search {
      line-height: 1.9;
      padding-right: 5px;
      width: 13.53px;
      height: 13.53px;
      color: #303133;
    }

    input {
      border: 0;
      background-color: #f5f7fa;
      color: #aaa;
      outline: none;
    }
  }
}

.userList {
  height: 30px;
  line-height: 30px;
  padding-left: 20px;
  margin-bottom: -25px;
  // margin-top: 10px;
  color: #afb7c5;

  /deep/ .el-breadcrumb__inner.is-link {
    color: #afb7c5;
    font-weight: 400;
  }

  .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: #fff;
    font-weight: 400;
  }

  a {
    text-decoration: none;
    color: #ccc;
    font-weight: 400;
  }

  // .late {
  //   color: #fff;
  // }
}

.updataframe {
  width: 400px;
  height: 400px;
  background-color: red;
}

/deep/ .mask {
  background-color: #567db9;
  opacity: 0.5;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.top {
  span {
    cursor: pointer;
    margin-top: 20px;
  }
}

.pop {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 842px;
  height: 649px;
  z-index: 2;
  border-radius: 4px;
}
.export {
  width: 79px;
  height: 32px;
  padding: 0;
}
.btn {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid blue;
  padding: 4px 12px;
  cursor: pointer;
  width: 107px;
  height: 32px;
  line-height: 30px;
  padding: 0 10px;
  background-color: #47a87d;
  color: #fff;
  border: 0;
  border-radius: 25px;
  outline: none;

  i {
    font-size: 14px;
    padding-right: 5px;
  }
}

.gas-page-bg {
  min-width: auto;
}

.top-header-serch {
  margin-left: 30px;
  margin-right: 55px;
  display: flex;
  justify-content: space-between;

  .el-form-item__label {
    position: relative;
    color: #303133;
  }

  i {
    position: absolute;
    top: 0px;
    left: -10px;
    z-index: 10;
    color: red;
  }
}

.top-content {
  border-radius: 4px;
  box-sizing: border-box;
  padding: 20px;
  width: 97.5%;
  // height: 84.5vh;
  background-color: #fff;
  margin-top: -6px;
  margin-left: 20px;
  padding-bottom: 110px;
  text-align: center;
  // overflow: hidden;
}

.cell {
  text-align: center;
}

.box {
  // width: 100%;
  // height: 90%;

  .top {
    width: 100%;
    display: flex;
    height: 60px;
    box-sizing: border-box;
    justify-content: space-between;
    border-bottom: 1px solid #dcdfe6;
    margin-bottom: 26px;
    padding: 0 20px;

    .el-icon-close {
      font-size: 20px;
    }

    h3 {
      display: inline-block;
      color: #303133;
    }
  }

  .el-button {
    width: 86px;
    height: 40px;
    background-color: #47a87d;
    border-radius: 25px;
    border: 0;
    margin-left: 50%;
    margin-top: 20px;
  }

  .submitBtn {
    border-top: 1px solid #ccc;
  }
}

.el-table {
  position: static;
  color: #303133;
}

.el-input__inner {
  // background-color: #f5f7fa;
  width: 393px;
  height: 32px;
  margin-left: -130px;
}

/deep/ .el-input__inner {
  margin-left: 15px;
}

.el-select .el-input__inner {
  width: 393px;
  height: 32px;
  border-radius: 0;
  background-color: #f5f7fa;
  padding-left: 15px;
  border: 1px solid #ccc;
  color: #000;
  margin-left: -130px;
}

/deep/ .el-select .el-input.is-focus .el-input__inner {
  color: #303133;
  border: 1px solid #dcdfe6;
}
.custom-page-n {
  margin-top: 20px;
}
/deep/.el-pagination__sizes {
  margin-left: 30px;
}
/deep/.el-pagination__sizes .el-input .el-input__inner {
  width: 100px;
  height: 30px;
  border-radius: 0;
}
</style>