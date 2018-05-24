<template>
    <div id="allWrapper">
      <Header v-show="showHead==true" :title="title"></Header> 
        <section>
            <ul class="form-list">
                <li>
                    <div class="form-item form-tel">
                        <div class="div1"><label>{{telTitle}}</label></div>
                        <div class="div2"><input type="number" v-model="telNum" placeholder="请输入手机号"></div>
                        <div class="div3"></div>
                    </div>
                </li>
                <li>
                    <div class="form-item form-code">
                        <div class="div1"><label>验证码</label></div>
                        <div class="div2"><input type="text" v-model="yanCode" placeholder="请输入验证码" onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"></div>
                        <div @click="getCode" class="div3">
                          <a v-show="show">获取验证码</a>
                          <a v-show="!show" class="count" style="color:#999">{{count}}s后获取</a></div>
                    </div>
                </li>
            </ul>
        </section>
        <section>
            <div @click="submitAction" v-show="btnColor" class="form-submit" style="background:#1A88E6">
                <a href="javascript:void(0)">提交</a>
            </div>
            <div v-show="!btnColor" class="form-submit">
                <a>提交</a>
            </div>
            <div class="tip">
                <!-- <p>认证通过后，可通过手机号码直接登录小悠快批平台</p> -->
            </div>
        </section>
        <message></message>
        <classMessage :message="msgTip"></classMessage>

        <loading :message="loadTip"></loading>
    </div>
</template>

<script>
import loading from "@/base/loading/loading";
import cookie from "js-cookie";
import Header from "@/base/header";
import message from "@/base/message";
import classMessage from "@/base/classMessage";
export default {
  components: { Header, message, classMessage, loading },
  name: "tel_check",
  data: function() {
    return {
      showHead: false, //是否显示title栏
      title: "手机认证", //标题栏内容
      telNum: "",
      yanCode: "",
      telTitle: "手机号",
      // 用于倒计时
      show: true,
      timerOff: true,
      count: "",
      timer: null,
      // 弹窗提示
      msgTip: "",
      loadTip: ""
    };
  },
  computed: {
    btnColor() {
      if (this.telNum && this.yanCode) {
        return true;
      } else {
        return false;
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    cookie.set("outKey", "0");
    next(function(vm) {
      vm.$client.system("documentTitle", {
        title: "手机认证"
      });
    });
  },
  created() {
    // 监听返回键
    cookie.set("outKey", "0");
    if (cookie.get("showHeader") == "true") {
      this.showHead = true;
    } else {
      this.showHead = false;
    }
    let _this = this;
    // this.backBTN();
    setTimeout(function() {
      if (cookie.get("S_L_S") != 1) {
        _this.$router.push({
          path: `/login`
        });
      }
    }, 100);
    // 如果是change_tel过来的，改文案
    if (this.$route.query.fromChangeTel == 1) {
      this.telTitle = "新手机号"
    }
  },
  methods: {
    getCode() {
      const TIME_COUNT = 60;
      if (!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.telNum)) {
        this.$store.dispatch("ERROR_MESSAGE", "手机号格式不正确");
      } else if (this.timerOff) {
        // 获取后台验证码
        this.$http
          .post(
            "/ycorrect/user/center/sendMobileAuthCode",
            {},
            {
              params: {
                mobile: this.telNum
              }
            }
          )
          .then(
            response => {
              console.log(response.data);
              if (response.data.ret_code == 0) {
                this.timerOff = false;
                // 倒计时逻辑
                if (!this.timer) {
                  this.count = TIME_COUNT;
                  this.show = false;
                  this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                      this.count--;
                    } else {
                      this.show = true;
                      clearInterval(this.timer);
                      this.timer = null;
                      this.timerOff = true;
                    }
                  }, 1000);
                }
              } else {
                this.$store.dispatch("ERROR_MESSAGE", response.data.ret_msg);
              }
            },
            ({ response }) => {
              this.$store.dispatch("ERROR_MESSAGE", "网络异常");
            }
          );
      }
    },
    submitAction() {
      let _this = this;
      if (!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.telNum)) {
        this.$store.dispatch("ERROR_MESSAGE", "手机号格式不正确");
      } else {
        this.$http
          .post(
            "/ycorrect/user/center/submitMobileAuth",
            {},
            {
              params: {
                mobile: this.telNum,
                verifyCode: this.yanCode
              }
            }
          )
          .then(
            response => {
              console.log(response.data);
              if (response.data.ret_code == 0) {
                // 验证通过
                this.msgTip = "认证通过";
                setTimeout(function() {
                  _this.$router.push({
                    path: "/check_success"
                  });
                }, 1600);
              } else {
                this.$store.dispatch("ERROR_MESSAGE", response.data.ret_msg);
              }
            },
            ({ response }) => {
              this.$store.dispatch("ERROR_MESSAGE", "网络异常");
            }
          );
      }
    },
    backBTN() {
      var _this = this;
      /**
       * 使用 HTML5 的 History 新 API pushState 来曲线监听 Android 设备的返回按钮
       * XBack.listen(function(){
          alert('oh! you press the back button');
        });
      */
      !(function(pkg, undefined) {
        var STATE = "x-back";
        var element;
        var onPopState = function(event) {
          event.state === STATE && fire();
        };
        var record = function(state) {
          history.pushState(state, null, location.href);
        };
        var fire = function() {
          var event = document.createEvent("Events");
          event.initEvent(STATE, false, false);
          element.dispatchEvent(event);
        };
        var listen = function(listener) {
          element.addEventListener(STATE, listener, false);
        };
        !function() {
          element = document.createElement("span");
          window.addEventListener("popstate", onPopState);
          this.listen = listen;
          this.record = record(STATE);
          record(STATE);
        }.call((window[pkg] = window[pkg] || {}));
      })("XBack");
      XBack.listen(function() {
        // 点击返回键回掉
        _this.$router.push({
          path: `/personal`
        });
      });
    }
  }
};
</script>

<style scoped>
#allWrapper {
  width: 750px;
  max-width: 750px;
  height: auto;
  margin: 0 auto;
}

a {
  text-decoration: none;
  cursor: default;
}
input {
  color: #30343d;
}
.tip {
  text-align: center;
  font-size: 24px;
  color: #949da4;
}
.form-list {
  background-color: #fff;
}
.form-list li {
  line-height: 90px;
  border-bottom: 1px solid #f6f6f9;
}
.form-item {
  width: 100%;
  height: 100px;
}
.form-item .div1 {
  width: 130px;
  padding-left: 26px;
  float: left;
  text-align: left;
  font-size: 30px;
}
.form-item .div2 {
  width: 340px;
  float: left;
  padding: 0 20px;
  font-size: 30px;
}
.form-item .div3 {
  float: left;
  font-size: 30px;
  width: 200px;
  text-align: center;
}
.form-code > div:nth-child(3) a {
  color: #386cfe;
}
.form-code > div:nth-child(3):active {
  opacity: 0.5;
}
.form-submit {
  margin: 44px 30px 36px;
  height: 96px;
  text-align: center;
  background-color: #c9d5de;
  border-radius: 60px;
}
.form-submit a {
  line-height: 96px;
  color: #fff;
  font-size: 32px;
}

.mhome.result {
  padding-top: 0px;
  background-color: #fff;
}
.result-show {
  margin: 0 20px;
  line-height: 300px;
  text-align: center;
  border-bottom: 1px solid #eaeaea;
}
.result-success {
  display: inline-block;
  line-height: 90px;
  padding-left: 120px;
  background-image: url("./phone_adopt.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.m-box {
  margin: 40px 20px 30px;
  background-color: #f4f6f9;
  border: 1px solid #eaeaea;
  border-radius: 20px;
  text-align: center;
  padding: 30px 0;
}
.m-box > div {
  line-height: 64px;
  font-size: 36px;
}
.btn-nobg {
  margin: 84px 30px 36px;
  height: 96px;
  text-align: center;
  border-radius: 60px;
}
.btn-nobg a {
  line-height: 96px;
  color: #386cfe;
}
</style>
