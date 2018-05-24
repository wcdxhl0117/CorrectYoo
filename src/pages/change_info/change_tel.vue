<template>
    <div id="allWrapper">
      <Header v-show="showHead==true" :title="title"></Header> 
        <section>
            <ul class="form-list">
                <li>
                    <div class="form-item form-old-tel">
                        <div class="div1"><label>原手机号:</label></div>
                        <div class="div2"><span>{{cardNumChu}}</span></div>
                    </div>
                </li>
                <li>
                    <div class="form-item form-code">
                        <div class="div1"><label>验证码</label></div>
                        <div class="div2"><input type="text" v-model="yanCode" placeholder="请输入验证码" onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"></div>
                        <div class="div3" @click="getCode">
                          <a v-show="show">获取验证码</a>
                          <a v-show="!show" class="count" style="color:#999">{{count}}s后获取</a>
                        </div>
                    </div>
                </li>
            </ul>
        </section>
        <section>
            <div @click="submitAction" v-show="btnColor" class="form-submit" style="background:#1A88E6">
                <a href="javascript:void(0)">下一步</a>
            </div>
            <div v-show="!btnColor" class="form-submit">
                <a>下一步</a>
            </div>
            <div class="tip">
                <p>若手机已停用，请致电客服：{{serviceTel}}</p>
            </div>
        </section>
        <classMessage :message="msgTip"></classMessage>
        <loading :message="loadTip"></loading>
        <message></message>
    </div>
</template>

<script>
import message from "@/base/message";
import loading from "@/base/loading/loading";
import cookie from "js-cookie";
import Header from "@/base/header";
import classMessage from "@/base/classMessage";

export default {
  components: { Header, classMessage, loading, message },
  name: "",
  data: function() {
    return {
      showHead: false, //是否显示title栏
      title: "修改手机号", //标题栏内容
      yanCode: "",
      tel: "15655428130",
      serviceTel: "400-828－6506",
      // 用于倒计时
      show: true,
      count: "",
      timer: null,
      msgTip: "",
      loadTip: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    cookie.set("outKey", "0");
    next(function(vm) {
      vm.$client.system("documentTitle", {
        title: "修改手机号"
      });
    });
  },
  created() {
    cookie.set("outKey", "0");
    if (cookie.get("showHeader") == "true") {
      this.showHead = true;
    } else {
      this.showHead = false;
    }
    let _this = this;
    setTimeout(function() {
      if (cookie.get("S_L_S") != 1) {
        _this.$router.push({
          path: `/login`
        });
      }
    }, 100);
  },
  mounted() {
    this.$http.post("/ycorrect/user/center/getMobileAuth", {}, {}).then(
      response => {
        if (response.data.ret_code == 0) {
          console.log(response.data.ret);
          this.tel = response.data.ret.mobile;
          this.serviceTel = response.data.ret.customerTel;
        } else {
          this.$store.dispatch("ERROR_MESSAGE", response.data.ret_msg);
        }
      },
      ({ response }) => {
        this.$store.dispatch("ERROR_MESSAGE", "网络异常");
      }
    );
  },
  computed: {
    btnColor() {
      if (this.yanCode) {
        return true;
      } else {
        return false;
      }
    },
    cardNumChu() {
      var str;
      str = this.tel.replace(this.tel.substr(3, 4), "****");
      return str;
    }
  },
  methods: {
    getCode() {
      const TIME_COUNT = 60;
      if (!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.tel)) {
        this.$store.dispatch("ERROR_MESSAGE", "手机号格式不正确");
      } else {
        // 获取后台验证码
        this.$http
          .post(
            "/ycorrect/user/center/sendMobileAuthCode",
            {},
            {
              params: {}
            }
          )
          .then(
            response => {
              console.log(response.data);
              if (response.data.ret_code == 0) {
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
              }else{
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
      // 验证二维码
      this.$http
        .post(
          "/ycorrect/user/center/checkMobileVerifyCode",
          {},
          {
            params: {
              verifyCode: this.yanCode
            }
          }
        )
        .then(
          response => {
            console.log(response.data);
            if (response.data.ret_code == 0) {
              this.msgTip = "修改成功";
              setTimeout(function() {
                _this.$router.push({
                  path: "/tel_check",
                  query: {   
                      fromChangeTel: 1 
                  }  
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
  }
};
</script>

<style scoped>
#allWrapper {
  width: 750px;
  max-width: 750px;
  height: 100%;
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
  font-size: 26px;
  color: #949da4;
}
.tip p {
  padding-left: 18px;
}
.form-list {
  background-color: #fff;
}
.form-list li {
  line-height: 98px;
  border-bottom: 3px solid #f6f6f9;
}
.form-item {
  width: 100%;
  height: auto;
  overflow: hidden;
}
.form-old-tel .div1 {
  float: left;
  width: 168px;
  text-align: center;
  font-size: 30px;
}
.form-old-tel .div2 {
  float: left;
  padding: 0 30px;
  font-size: 30px;
}
.form-code .div1 {
  float: left;
  width: 134px;
  text-align: center;
  font-size: 30px;
}
.form-code .div2 {
  float: left;
  width: 300px;
  padding: 0 30px;
  font-size: 30px;
}
.form-code .div3 {
  float: left;
  font-size: 30px;
  width: 240px;
  text-align: center;
}
.form-code .div3 a {
  color: #386cfe;
}
.form-code .div3:active {
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
  font-size: 32px;
  color: #fff;
}
.form-old-tel {
  background-color: #e9e8ee;
}
.form-old-tel > div:nth-child(1) {
  width: 168px;
  text-align: center;
  font-size: 30px;
}
.form-old-tel > div:nth-child(2) {
  padding: 0 30px 0 0;
  text-align: left;
}
.pwd-panel .tip {
  text-align: left;
  padding: 20px;
}
.form-pwd > div:nth-child(3) {
  width: 120px;
  text-align: center;
}
.form-pwd .eye {
  vertical-align: middle;
  width: 56px;
}
</style>
