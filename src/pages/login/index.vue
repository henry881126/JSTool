
<template>
  <div class="login-body" v-loading="loading">
    <div class="login-container">
      <div class="new-box">
        <div class="hello-line">Hello!</div>
        <!-- <div class="title-line">智慧分销</div> -->
        <div class="title-line" v-html="generateTitle"></div>
        <div class="form-content">
          <el-tabs v-model="activeName">
            <!-- 账号登录 -->
            <el-tab-pane label="账号登录" name="first">
              <el-form :model="loginForm" ref="loginForm" :rules="loginRules" class="form-area" label-position="top">
                <div class="form-area">
                  <el-form-item prop="username" label="用户名">
                    <el-input v-model="loginForm.username" name="username" type="text" auto-complete="new-account"
                              placeholder="用户名 / 手机">
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password" label="密码">
                    <el-input v-model="loginForm.password" name="password" type="password" auto-complete="new-password"
                              placeholder="密码" @keyup.enter.native="handleLogin">
                    </el-input>
                  </el-form-item>
                </div>
              </el-form>
            </el-tab-pane>
            <!-- 验证码登录 ----------------临时注释，下次上线时开启 -->
            <el-tab-pane label="验证码登录" name="second">
              <el-form :model="loginForm" ref="LoginMsg" :rules="loginRules" class="form-area" label-position="top">
                <div class="form-area">
                  <el-form-item prop="phone" label="手机号">
                    <el-input v-model="loginForm.phone" name="phone" type="text" auto-complete="new-phone"
                              placeholder="请输入手机号码">
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="message" label="验证码">
                    <el-input v-model="loginForm.message" name="identifyingCode" type="text" auto-complete="new-message"
                              placeholder="请输入验证码">

                    </el-input>
                    <el-button class="btnSend" round @click="sendMsg" id="bt01">发送验证码</el-button>
                  </el-form-item>
                </div>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- 账号登录 -->
        <div class="form-btn" @click="handleLogin"></div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '/src/http/api'
import menuAndOrg from '/src/components/auth/menuAndOrg'
import {switchTheme} from '/src/components/theme/themes'
import {loadSessionStorage, saveSessionStorage} from '@/utils/cache'
import axios from 'axios'
import  qs from 'qs'

export default {
  name: "Login",
  mixins: [menuAndOrg],
  data() {
    const validateUsername = (rule, value, callback) => {
      let myreg = /^[1][0-9]{10}$/;
      let phoneReg = /^[0-9]{11}$/
      if (phoneReg.test(value) && myreg.test(value)) {
        if (phoneReg.test(value) && !myreg.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback(new Error("请输入账号"));
        } else {
          callback()
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      let myreg = /^[1][0-9]{10}$/;
      if (!myreg.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    }
    const validateMessage = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    }
    return {
      activeName: "first",
      loading: false,
      loginForm: {
        username: "",
        password: "",
        phone: "",
        message: "",
        loginType: 1
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            validator: validateUsername,
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePass,
          },
        ],
        phone: [
          {
            required: true,
            trigger: "blur",
            validator: validatePhone,
          },
        ],
        message: [
          {
            required: true,
            trigger: "blur",
            validator: validateMessage,
          },
        ]
      },
      pwdType: "password",
      redirect: undefined,
      setFontSize: () => {
      },
      menuPermissionCodes: [],
    };
  },
  computed: {
    // 登录页根据域名显示不同的标题（页面中标题：Hello!下面、登录表单上面，不是文档标题）
    generateTitle() {
      const currentUrl = window.location.href
      const url1 = 'sg.enn.cn'
      const url2 = 'dongguan.ids.enn.cn'
      let title = ''
      if(currentUrl.indexOf(url1) !== -1) {
        title = '智慧分销'
      } else if(currentUrl.indexOf(url2) !== -1) {
        title = "<span style='font-size:0.4rem;'>天然气输配（调度）智慧管理平台</span>"
      } else {
        title = '智慧分销'
      }
      return title
    }
  },
  created() {
    window.zhuge.track('打开智慧分销产品',{'产品名称':'智慧分销产品'})
    this.setFontSize = () => {
      const designSize = 1920; // 设计图尺寸
      let deviceWidth = document.documentElement.clientWidth; // 窗口宽度
      deviceWidth = Math.max(1366, deviceWidth);
      const remToPx = (deviceWidth * 100) / designSize; //1920宽度下设置1rem=100px
      document.documentElement.style.fontSize = remToPx + "px";
    };
    this.setFontSize();
    window.onresize = () => {
      this.setFontSize;
    };
  },
  beforeRouteLeave: function (to, from, next) {
    window.removeEventListener("onresize", this.setFontSize);
    next();
  },
  methods: {
    gotoPage() {
      this.getMenuAndOrg(this.$store.getters.loginName)
    },
    //发送验证码
    sendMsg() {
      let myreg = /^[1][0-9]{10}$/;
      if (!myreg.test(this.loginForm.phone)) {
        return
      } else {
        let bt01 = document.getElementById("bt01");
        let time = 60;  //倒计时60秒
        let timer = setInterval(() => {
          time--;
          if (time >= 0) {
            bt01.disabled = true;
            bt01.innerHTML = "重新发送 " + time + "s";
          } else {
            bt01.innerHTML = "重新发送验证码";
            bt01.disabled = false;  //倒计时结束能够重新点击发送的按钮
            clearTimeout(timer);  //清除定时器
            time = 60;  //设置循环重新开始条件
          }
        }, 1000);  //设置定时器
      }
      let params = {
        phone: this.loginForm.phone
      }
      api.auth.sendCode(params).then(res => {
        if(res) {
          this.$message.success("验证码发送成功！");
        }
      })
    },
    //用户名登录
    handleLogin() {
      this.loading = true;
      let loginForm
      if(this.activeName === 'first') {
        loginForm = this.$refs.loginForm
      } else if(this.activeName === 'second') {
        loginForm = this.$refs.LoginMsg
      }
      loginForm.validate((valid) => {
        if (valid) {
          this.loginForm.loginType = this.getLoginType()
          this.$store.dispatch("Login", this.loginForm)
              .then((res) => {
                if (res && res.token) {
                  //诸葛 记录登录用户的用户名
                  window.zhuge.identify(this.$store.getters.loginName,{
                    'LOGIN_NAME':this.$store.getters.loginName,
                    'idcode':this.$store.getters.loginName
                  }) 
                  // ***气源登录接口调用开始
                  // 分销登录成功后需要再调用气源管理系统的登录接口，调用气源登录接口成功后，则分销中气源系统即处于登录状态，无需在分销中手动登录气源（气源登录接口返回token，将此token保存到Store中，之后在分销中访问气源页面时在url查询参数中携带此参数，以保持登录状态）
                  // let paramsOfQiyuan = {
                  //   username: 'maruic',
                  //   password: '123',
                  //   client_id: 'GSM',
                  //   client_secret: '123',
                  //   grant_type: 'password'
                  // }
                  // // console.log('qs.stringify---------------:', qs.stringify(paramsOfQiyuan))
                  // axios.post(`/qiyuan/gsm-env-oauth2/oauth/token?${qs.stringify({ ...paramsOfQiyuan})}`).then(res => {
                  //   // console.log('qiyuan res:', res)
                  //   this.$store.commit('SET_QIYUAN_TOKEN',res.data['access_token'])
                  // }).catch(err => {
                  //   console.log('qiyuan login fail:', err)
                  // })                    
                  // ***气源登录接口调用结束
                  this.gotoPage();
                } else {
                  this.$message.error(res);
                }
                this.loading = false;
              }).catch((err) => {
                this.$message.error(err)
                this.loading = false
              });
        } else {
          if(this.activeName === 'first') {
            this.$message.error("用户名或密码格式不正确！");
          } else {
            this.$message.error("手机号或验证码格式不正确！");
          }
          this.loading = false;
          return false;
        }
      });
    },
    // 验证是手机号登录还是账号登录（登录类型：1-手机验证码登录, 2-手机号密码登录, 3-账号密码登录）
    getLoginType() {
      let phoneReg = /^[1][0-9]{10}$/;
      let val
      if (this.activeName === 'first') {
        val = this.loginForm.username
        if (phoneReg.test(val)) {
          return 2  // 手机号/密码登录
        } else {
          return 3  // 账号/密码登录
        }
      } else {
        return 1  // 单击了“验证码登录”选项卡
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.login-body {
  height: 100vh;
  width: 100%;
  background: #fff;

  .login-container {
    height: 100vh;
    width: 100%;
    background: url("../../assets/img/login-bg.png") no-repeat;
    background-size: 100%;

    .new-box {
      width: 40%;
      margin: 0 auto;
      top: 1.5rem;
      left: 2rem;
      position: absolute;

      .hello-line {
        height: 0.84rem;
        font-size: 0.6rem;
        font-family: PingFangSC-Light, PingFang SC, sans-serif;
        font-weight: 300;
        color: #000000;
        line-height: 0.84rem;
        margin-bottom: 0.1rem;
      }

      .title-line {
        height: 0.84rem;
        font-size: 0.6rem;
        font-family: PingFangSC-Semibold, PingFang SC, sans-serif;
        font-weight: 600;
        color: #000000;
        line-height: 0.84rem;
        letter-spacing: 0.05rem;
        margin-bottom: 0.4rem;
      }

      /deep/.el-tabs__nav-wrap::after{
        background-color: transparent !important;
      }
      .btnSend{
        position: absolute;
        right: 0;
        bottom: 4px;
        color: #3480FF;
        border-color: #3480FF;
        height: 34px;
        text-align: center;
        line-height: 10px;
      }
      .form-content {
        background: transparent;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        position: relative;

        .form-area {
          width: 100%;
          height: 100%;
          background-color: transparent;
          display: flex;

          .form-area {
            height: calc(100% - 20px);
            width: 65%;
            background-color: transparent;
            overflow: hidden;
            display: flex;
            align-content: center;
            flex-wrap: wrap;

            /deep/ .el-form-item {
              margin-bottom: 7%;
              width: 100%;
              border-bottom: 1px solid #dcdddd;

              input {
                border: none;
                box-shadow: inset 0 0 0 1000px RGBA(249, 251, 254, 1) !important;
              }

              .el-input__inner {
                font-size: 0.22rem;
                font-weight: 500;
                color: #333333;
                height: 36px;
                line-height: 36px;
                border-radius: 0;
              }
            }

            /deep/ .el-form-item__error {
              font-size: 0.16rem;
            }

            /deep/ .el-form-item__label {
              font-size: 0.22rem;
              font-weight: 400;
              color: #768092;
            }
          }
        }
      }

      .form-btn {
        position: absolute;
        margin-top: 0.2rem;
        width: 2rem;
        height: 0.9rem;
        background: url("./../../assets/img/login-btn.png") no-repeat;
        background-size: 100%;
      }
    }
  }
}

.el-tabs__item {
  font-size: 18px !important;
}

.el-tabs__nav-wrap::after {
  width: 65%;
}
</style>