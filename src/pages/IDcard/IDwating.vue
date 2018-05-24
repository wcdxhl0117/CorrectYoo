<template>  
  <div id="allWrapper">
    <Header v-show="showHead==true" :title="title"></Header> 
    <div class="noPassTip">
      <img src="./ing.png">
      <div class="right">
        <h4>正在进行审核，请耐心等待...</h4>
      </div>
    </div>
    
    <div class="theInfo">
      <p class="theName">{{theName}}</p>
      <p class="theIdNum">{{cardNumChu}}</p>
    </div>
    <message></message>
  </div>  
</template>
  
<script>
import cookie from "js-cookie";
import Header from "@/base/header";
import message from "@/base/message";

export default {
  components: { Header, message },
  name: "auditing",
  data() {
    return {
      showHead: false, //是否显示title栏
      title: "实名认证", //标题栏内容
      showImg: true,
      cardNumber: "",
      theName: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    cookie.set("outKey", "0");
    next(function(vm) {
      vm.$client.system("documentTitle", {
        title: "实名认证"
      });
    });
  },
  created() {
    // 监听返回键
    cookie.set("outKey", "0");
    // this.backBTN();
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
    // id认证信息
    this.$http
      .post(
        "/ycorrect/user/center/getIDCardAuth",
        {},
        {
          params: {}
        }
      )
      .then(
        response => {
          console.log(response.data);
          if (response.data.ret_code == 0) {
            let data = response.data.ret;
            // 防止私改链接的路由参数乱跳转
            if (data.idCardAuthStatus == "PASS") {
              // this.$router.push({
              //   path: `/IDpass`
              // });
            } else if (data.idCardAuthStatus == "CHECK") {
              this.cardNumber = data.idCard;
              this.theName = data.realname;
            } else if (data.idCardAuthStatus == "FAIL") {
              // 未通过
              // this.$router.push({
              //   path: `/IDcard`,
              //   query: {
              //     passStu: 3
              //   }
              // });
            } else if (data.idCardAuthStatus == "DEFAULT") {
              // 未认证
              // this.$router.push({
              //   path: `/IDcard`
              // });
            }
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
    cardNumChu() {
      var str;
      str = this.cardNumber.replace(
        this.cardNumber.substr(3, 12),
        "************"
      );
      console.log(str);
      return str;
    }
  },
  methods: {
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
.noPassTip {
  width: 710px;
  height: 230px;
  position: relative;
  margin: 0 auto;
  border-bottom: 2px solid #e5e5e5;
}
.noPassTip img {
  height: 102px;
  width: 102px;
  position: absolute;
  top: 74px;
  left: 40px;
}
.noPassTip .right {
  position: absolute;
  top: 100px;
  left: 160px;
}
.noPassTip .right h4 {
  height: 42px;
  font-size: 34px;
  font-weight: 900;
  color: #383d48;
  line-height: 42px;
}
.noPassTip .right p {
  height: 42px;
  font-size: 24px;
  color: rgba(241, 75, 64, 1);
  line-height: 42px;
}
.theInfo {
  width: 710px;
  height: 168px;
  margin: 0 auto;
  background: rgba(246, 248, 250, 1);
  border-radius: 20px;
  border: 1px solid #f6f8fa;
  position: relative;
}
.theInfo .theName {
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  text-align: center;
  font-weight: 900;
  color: #383d48;
  font-size: 34px;
}
.theInfo .theIdNum {
  position: absolute;
  top: 102px;
  left: 0;
  width: 100%;
  text-align: center;
  color: #383d48;
  font-size: 34px;
}
</style> 
