<template>  
  <div id="allWrapper">
    <Header v-show="showHead==true" :title="title"></Header> 
    <div class="noPassTip">
      <img src="./pass.png">
      <div class="right">
        <h4>教师认证已通过</h4>
      </div>
    </div>
    <p class="thetip">本人教师资格证照片</p>
    <div class="upLoad">
        <img ref="imgShow" class="imgYuLan" :src="info">
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
  name: "audited",
  data() {
    return {
      showHead: false, //是否显示title栏
      title: "教师认证", //标题栏内容
      showImg: true,
      info: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    cookie.set("outKey", "0");
    next(function(vm) {
      // 监听返回键
      vm.$client.system("documentTitle", {
        title: "教师认证"
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
    this.getTeacherData();
  },
  mounted() {
    // this.backBTN();
  },
  methods: {
    getTeacherData() {
      this.$http
        .post(
          "/ycorrect/user/center/getQualificationAuth",
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
              if (data.qualificationAuthStatus == "PASS") {
                this.info = data.qualificationImgSrc;
              } else if (data.qualificationAuthStatus == "CHECK") {
                // this.$router.push({
                //   path: `/auditing`
                // });
              } else if (data.qualificationAuthStatus == "FAIL") {
                // this.$router.push({
                //   path: `/teacherCert`,
                //   query: {
                //     passStu: 3
                //   }
                // });
              } else if (data.qualificationAuthStatus == "DEFAULT") {
                // 未认证
                // this.$router.push({
                //   path: `/teacherCert`
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
.thetip {
  height: 100px;
  padding: 0 20px;
  line-height: 100px;
  color: #383d48;
  font-weight: 900;
}
#upload {
  width: 710px;
  height: 500px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.upLoad {
  width: 710px;
  height: 500px;
  background: #f6f6f6;
  margin: 0 auto;
  border: 2px dashed #839096;
  border-radius: 16px;
}
.upLoad .imgYuLan {
  width: 710px;
  height: 500px;
  border-radius: 16px;
}
</style> 