<template>  
  <div id="allWrapper">
    <Header v-show="showHead==true" :title="title"></Header> 
    <div class="noPassTip">
      <img src="./pass.png">
      <div class="right">
        <h4>实名认证已通过</h4>
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
      cardNumber: "510722199101175334",
      theName: "王小二"
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
    this.getIDData();
  },
  computed: {
    cardNumChu() {
      var str;
      str = this.cardNumber.replace(
        this.cardNumber.substr(3, 12),
        "************"
      );
      return str;
    }
  },
  mounted() {
    // this.backBTN();
  },

  methods: {
    getIDData() {
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
                this.cardNumber = data.idCard;
                this.theName = data.realname;
              } else if (data.idCardAuthStatus == "CHECK") {
                // this.$router.push({
                //   path: `/IDwating`
                // });
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
  width: 100%;
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
  left: 180px;
}
.noPassTip .right {
  position: absolute;
  top: 100px;
  left: 300px;
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
