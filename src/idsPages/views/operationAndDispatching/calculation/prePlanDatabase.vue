<template>
  <div class="delivery-wrapper gas-page-bg planLibrary-page">
    <top-menu title="天然气输配（调度）智慧管理平台"></top-menu>
    <!-- 面包屑 -->
    <div class="crumb-diaodu">
      <span class="crumb-title1">运营调度 / </span>
      <span class="crumb-title2">输配能力测算</span>
    </div>
    <div class="content-wrapper content-wrapper-diaodu calculation">
      <!-- 标题 -->
      <div class="title">
        <div class="left-box">
          <a @click="back" class="btn-back el-icon-back">返回</a>
          <i class="line"></i>
          <span class="title-label">预案库</span>
          <div class="search-box">
            <el-input
                  class="custom-search"
                  clearable
                  v-model="searchWords"
                  placeholder="请输入储罐名称/关键字"
                  maxlength="50"
                  @keyup.enter.native="searchEvent"
              ></el-input>
            <el-button type="primary" class="custom-btn" round @click="searchEvent">
              <i class="el-icon-search"></i>查询
            </el-button>
          </div>
        </div>
        <div class="title-button">
          <button @click="createEvent()">新建预案</button>
        </div>
      </div>
      <!-- 内容部分 -->
      <div class="content-box">
        <div class="list-box">
          <!-- <li>
            <span class="name">名称</span>
            <span class="handle">
              <a class="btn edit" @click="editEvent()">编辑</a>
              <a class="btn delete" @click="deleteEvent()">删除</a>
            </span>
          </li> -->
          <el-table
            ref="myTable"
            highlight-current-row
            :data="listData"
            class="my_table"
            height="calc(100vh - 280px)"
            style="width: 100%"
            :row-style="{height:'38px', lineHeight:'38px'}"
          >
            <el-table-column
              prop="planName"
              label="预案库名称"
              align="left"
            ></el-table-column>
            <el-table-column label="状态" align="center" width="200px">
              <template slot-scope="scope">
                <div :class="{ state_color: scope.row.setupCompleted == 0 }">
                  {{ scope.row.setupCompleted == 0 ? "待补充" : "已完成" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200px">
              <template slot-scope="scope">
                <el-button type="text" @click="editEvent(scope.row)"
                  >编辑</el-button
                >
                <span class="tip"> </span>
                <el-button
                  type="text"
                  style="color: #f5222d"
                  @click="deleteEvent(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-box">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            background
            class="page-content custom-page-n"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageParams.current"
            :page-sizes="[20,30,40,50]"
            :page-size="pageParams.pageSize"
            :total="pageParams.total"
          >
          </el-pagination>
          
        </div>
      </div>
      <el-dialog
        class="custom-dialog-n"
        title="新建预案"
        :visible.sync="dialogVisible"
        width="447px"
        @click="closeEvent('form')"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="70px"
          style="margin-top:20px;"
        >
          <el-form-item label="预案名称" prop="planName">
            <el-input v-model="form.planName"
                      placeholder="请输入预案库名称"
                      maxlength="15"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="submitEvent('form')"
            :loading="submitLoading"
            round
            >确定并进入新预案设置</el-button
          >
          <el-button @click="closeEvent('form')" round>取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import TopMenu from "@/components/topMenu/topMenu2";
import {
  getPlanLibraryData,
  createPlanLibrary,
  deletePlanLibrary,
} from "@/idsPages/api/calculation.js";
export default {
  name: "prePlanDatabase",
  components: {
    TopMenu,
  },
  data() {
    return {
      listData: [],
      searchWords: "",
      pageParams: {
        current: 1,
        pageSize: 20,
        total: 0,
      },
      dialogVisible: false,
      form: {
        planName: "",
      },
      rules: {
        planName: [{ validator: this.validate, trigger: "blur" }],
      },
      submitLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    getList() {
      let params = {
        planName: this.searchWords,
        pageNum: this.pageParams.current,
        pageSize: this.pageParams.pageSize,
      };
      getPlanLibraryData(params)
        .then((res) => {
          this.listData = res.data.list;
          this.pageParams.total = res.data.total;
        })
        .catch((error) => {
          this.submitLoading = false;
          console.log(error);
        });
    },
    searchEvent() {
      this.pageParams.current = 1;
      this.pageParams.pageSize = 10;
      this.getList();
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageParams.current = val;
      this.getList();
    },
    createEvent() {
      this.dialogVisible = true;
    },
    editEvent(row) {
      this.$router.push({
        path: "/prePlanDatabaseDetail",
        query: {
          planName: row.planName,
          planId: row.planId,
          version: row.version,
          setupCompleted: row.setupCompleted,
        },
      });
    },
    //校验
    validate(rule, value, callback) {
      if (value.trim() == "") {
        callback(new Error("请输入"));
      } else {
        callback();
      }
    },
    closeEvent(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
      this.form = {
        planName: "",
      };
    },
    //新建预案提交
    submitEvent(formName) {
      // real data
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          createPlanLibrary(this.form)
            .then((res) => {
              const { resultCode, data } = res;
              if (resultCode === 0) {
                this.submitLoading = false;
                this.$message.success("新建预案成功");
                this.$router.push({
                  path: "/prePlanDatabaseDetail",
                  query: {
                    planName: data.planName,
                    planId: data.planId,
                    version: data.version,
                    setupCompleted: data.setupCompleted,
                  },
                });
              }
            })
            .catch((error) => {
              this.submitLoading = false;
              console.log(error);
            });
        } else {
          this.submitLoading = false;
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除
    deleteEvent(data) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        cancelButtonClass:'prePlanDataBase-delete-massage-box-btn',
        confirmButtonClass:'prePlanDataBase-delete-massage-box-btn',
      })
        .then((_) => {
          let params = {
            planId: data.planId,
          };
          deletePlanLibrary(params)
            .then((res) => {
              this.$message.success("删除成功");
              this.getList();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((_) => {});
    },
  },
};
</script>

<style lang="scss" scoped rel='stylesheet/scss'>
.content {
  width: 100%;
  height: 100%;
  position: relative;
}
.tip {
  margin-right: 15px;
}
.state_color {
  color: red;
}
.delivery-wrapper {
  width: 100%;
  position: relative;
  padding-bottom: 0;
  .content-wrapper {
    height: calc(100vh - 132px);
    position: relative;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    font-family: PingFangSC-Regular, PingFang SC;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      margin-bottom: 28px;
      .left-box {
        display: flex;
        align-items: center;
        .btn-back {
          font-size: 14px;
          color: #303133;
          cursor: pointer;
        }
        i.line {
          width: 1px;
          height: 17px;
          background: #c0c4cc;
          display: inline-block;
          margin: 0 12px;
        }
      }
      .search-box {
        display: flex;
        float: right;
        justify-content: space-between;
        align-items: center;
        margin-left: 30px;
      }
      .title-label {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }
      .title-button {
        button {
          width: 86px;
          height: 32px;
          line-height: 32px;
          background: #47a87d;
          border: none;
          outline: none;
          color: white;
          border-radius: 100px;

          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .content-box {
      position: relative;
      height: 91%;
      border: solid 1px #e8e8e8;
      border-radius: 4px;
      padding: 8px;
      box-sizing: border-box;
      .list-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0px;
        span {
          font-weight: 600;
          color: #303133;
          font-size: 14px;
        }
      }
      .list-box {
        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: solid 1px #e8e8e8;
          line-height: 38px;
          font-size: 14px;
          color: #303133;
          .btn {
            color: #47a87d;
            cursor: pointer;
            display: inline-block;
            margin-right: 15px;
          }
          .delete {
            color: #f5222d;
          }
        }
      }
      .handle {
        display: inline-block;
        width: 110px;
      }
    }
    .page-box {
      // position: absolute;
      // bottom: 12px;
      // left: 50%;
      // transform: translateX(-50%);
      // text-align: center;
      // .page-content {
      //   display: inline-block;
      // }
      text-align: center;
    }
    
  }
}

</style>
<style lang="scss">
.planLibrary-page {
  .my_table::before{
    content:'';
    height: 0px;
  }
  .my_table .el-table__row td{
    padding:0px;
  }
  .custom-search{
    width: 280px;
    .el-input__inner{
      width: 100%;
      height: 32px;
      line-height: 32px;
      border-radius: 100px;
    }
    .el-input__suffix{
        top: -5px;
    }
  }
  .custom-btn{
    margin-left: 10px;
    i{
      margin-right: 5px;
    }
  }
  // .el-button--primary:focus,
  // .el-button--primary:hover,
  // .el-button--primary {
  //   background: #47a87d;
  //   border-color: #47a87d;
  //   color: #fff;
  // }
  // .el-button:focus,
  // .el-button:hover {
  //   background: #47a87d;
  //   border-color: #47a87d;
  //   color: #fff;
  // }
  
  .el-button {
    height: 32px;
    line-height: 32px;
    padding-top: 0px;
    padding-bottom: 0px;
  }
  // .el-dialog__body {
  //   padding: 30px 20px;
  //   padding-bottom: 0px;
  // }
  // .el-form-item {
  //   margin-bottom: 0px;
  // }
  .el-dialog__footer {
    text-align: center;
    //padding: 15px 20px 20px;
  }
  // .el-dialog__header {
  //   padding: 13px 20px 12px;
  //   background: #fff;
  // }
  // .el-dialog {
  //   background: #fafafa;
  // }
  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}
.prePlanDataBase-delete-massage-box-btn{
  border-radius: 20px;
}
</style>