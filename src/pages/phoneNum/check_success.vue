<template>
  <div id="allWrapper">
    <Header v-show="showHead==true" :title="title"></Header> 
    <section>
        <div class="result-show">
            <div class="result-success">手机认证已通过</div>
        </div>
    </section>
    <section>
        <div class="m-box">
            <div class=""><label>手机号</label></div>
            <div class=""><span>{{telNum}}</span></div>
        </div>
        <div class="tip">
            <!-- <p>手机号码可直接登录小悠快批平台</p> -->
        </div>
    </section>
    <section>
        <div class="btn-nobg">
            <a @click="changeTel" href="javascript:void(0)">修改手机号</a>
        </div>
    </section>
    <message></message>
  </div>
</template>

<script>
import cookie from "js-cookie";
import Header from "@/base/header";
import message from "@/base/message";

export default {
  components: { Header, message },
  name: "check_success",
  data: function() {
    return {
      showHead: false, //是否显示title栏
      title: "手机认证", //标题栏内容
      telNum: ""
    };
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
    setTimeout(function() {
      if (cookie.get("S_L_S") != 1) {
        _this.$router.push({
          path: `/login`
        });
      }
    }, 100);
    this.telData();
    // this.backBTN();
  },
  methods: {
    changeTel() {
      this.$router.push({
        path: "/change_tel"
      });
    },
    telData() {
      this.$http
        .post(
          "/ycorrect/user/center/getMobileAuth",
          {},
          {
            params: {}
          }
        )
        .then(
          response => {
            console.log(response.data.ret);
            if (response.data.ret_code == 0) {
              let data = response.data.ret;
              this.telNum = this.cardNumChu(data.mobile);
            } else {
              this.$store.dispatch("ERROR_MESSAGE", response.data.ret_msg);
            }
          },
          ({ response }) => {
            this.$store.dispatch("ERROR_MESSAGE", "网络异常");
          }
        );
    },
    cardNumChu(s) {
      var str;
      str = s.replace(s.substr(3, 4), "****");
      return str;
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
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 750px;
  max-width: 750px;
  height: 100%;
  font-size: 30px;
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
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.form-item > div:nth-child(1) {
  width: 168px;
  text-align: center;
  font-size: 30px;
}
.form-item > div:nth-child(2) {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding: 0 30px;
  font-size: 30px;
}
.form-item > div:nth-child(3) {
  font-size: 30px;
  width: 240px;
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
  font-size: 30px;
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
  font-size: 28px;
}
</style>
