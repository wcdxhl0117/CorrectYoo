<template>
    <div id="allWrapper">
        <Header v-show="showHead" :title="title"></Header> 
        <div class="balanceWrap">
            <p class="p1">我的余额（元）</p>
            <p class="p2">{{myBalance}}</p>
            <p class="p3">共批改{{personData.totalCorrectCount}}道题</p>
            <p class="p4" @click="toBalance">提现 <img src="./jian.png"></p>
        </div>
        <div v-show="showTip" class="tipConfirm">通过以下三项认证，即可开始批改项目</div>

        <!-- 上面一部分 -->
        <div class="part">
            <!-- 教师认证 -->
            <div class="clum" @click="toTeacherC">
                <div class="clum_left">
                    <img src="./jiaoshirenzheng.png">
                    <span>教师认证</span>
                </div>
                <div v-if="passT==1" class="clum_right">
                    <img class="img1" src="./gou.png">
                    <span>已通过</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
                <div v-if="passT==2" class="clum_right">
                    <img class="img1" src="./during.png">
                    <span>审核中</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
                <div v-if="passT==3" class="clum_right">
                    <img class="img1" src="./cha.png">
                    <span style="color:#f14b40">未通过</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
                <div v-if="passT==4" class="clum_right">
                    <img class="img1" src="./cha.png">
                    <span style="color:#f14b40">未认证</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
            </div>

            <div class="clum" @click="toIDcard">
                <div class="clum_left">
                    <img src="./shiming.png">
                    <span>实名认证</span>
                </div>
                <div v-if="passM==1" class="clum_right">
                    <img class="img1" src="./gou.png">
                    <span>已通过</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
                <div v-if="passM==2" class="clum_right">
                    <img class="img1" src="./during.png">
                    <span>审核中</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
                <div v-if="passM==3" class="clum_right">
                    <img class="img1" src="./cha.png">
                    <span style="color:#f14b40">未通过</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
                <div v-if="passM==4" class="clum_right">
                    <img class="img1" src="./cha.png">
                    <span style="color:#f14b40">未认证</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
            </div>

            <div class="clum"  @click="toTel">
                <div class="clum_left">
                    <img src="./shouji.png">
                    <span>手机认证</span>
                </div>
                <div v-if="passTel==1" class="clum_right">
                    <img class="img1" src="./gou.png">
                    <span>已通过</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
                <div v-if="passTel==2" class="clum_right">
                    <img class="img1" src="./during.png">
                    <span>审核中</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
                <div v-if="passTel==3" class="clum_right">
                    <img class="img1" src="./cha.png">
                    <span style="color:#f14b40">未通过</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
                <div v-if="passTel==4" class="clum_right">
                    <img class="img1" src="./cha.png">
                    <span style="color:#f14b40">未认证</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
            </div>

            <!-- 选学校（学校数据放在cookie） -->
            <div class="clum" @click="toSchool">
                <div class="clum_left">
                    <img src="./xuexiao.png">
                    <span>学校</span>
                </div>
                <div class="clum_right">
                    <!-- <img class="img1" src="./gou.png"> -->
                    <span>{{theSchool}}</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
            </div>

            <!-- 选年级（年级数据放在cookie） -->
            <div class="clum" @click="showGradeChoose">
                <div class="clum_left">
                    <img src="./jiaoxuejieduan.png">
                    <span>教学阶段</span>
                </div>
                <div class="clum_right">
                    <!-- <img class="img1" src="./gou.png"> -->
                    <span>{{gradeType}}</span>
                    <img class="img2" src="./hui_jian.png">
                </div>
            </div>
        </div>
        <div class="part">
            <div class="clum" @click="changePssword">
                <div class="clum_left">
                    <img src="./xiugaimima.png">
                    <span>修改密码</span>
                </div>
                <div class="clum_right">
                    <!-- <img class="img1" src="./gou.png"> -->
                    <span></span>
                    <img class="img2" src="./hui_jian.png">
                </div>
            </div>
        </div>
        <!-- 选年级弹窗 -->
        <garadePop ref="grade" @GradeChoose="gradeC"></garadePop>
        <!-- app端不展示 -->
        <div v-if="!AppK" class="part" @click="outAp">
            <p class="changePsd">退出账号</p>
        </div>
        <noTitleComfirm ref="noTitleComfirm" @confirmNoTitle="sureOut" :text="outCountTip"></noTitleComfirm>
        <loading :message="loadTip"></loading>
        <message></message>
    </div>
</template>

<script>
import loading from "@/base/loading/loading";
import cookie from "js-cookie";
import Header from "@/base/header";
import noTitleComfirm from "@/base/noTitleComfirm";
import garadePop from "./garadePop";
import message from "@/base/message";

export default {
  components: { Header, noTitleComfirm, garadePop, loading, message },
  name: "",
  data: function() {
    return {
      showHead: false, //是否显示title栏
      title: "个人中心", //标题栏内容
      showTip: false,
      personData: {},
      myBalance: 0,
      gradeType: "",
      theSchool: "",
      passT: 3, //1为通过，2为审核中，3为未通过，4为未认证
      passM: 4,
      passTel: 4, //手机号只有已认证和未认证两个状态，及1,4
      AppK: false, //是否是app端
      outCountTip: "确认退出当前账号",
      loadTip: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    cookie.set("outKey", "0");
    next(function(vm) {
      // 监听返回键
      vm.$client.system("documentTitle", {
        title: "个人中心"
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
    this.AppK = !this.showHead;
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
    this.personDataGet();
  },
  methods: {
    toBalance() {
      this.$router.push({
        path: `/balance`
      });
    },
    changePssword() {
      this.$router.push({
        path: `/change_pwd`
      });
    },
    outAp() {
      // 退出账号功能
      this.$refs.noTitleComfirm.show();
    },
    sureOut() {
      // 退出账号，清空账号信息
      console.log("退出账号");
      this.$http
        .post(
          "/ycorrect/user/logout",
          {},
          {
            params: {}
          }
        )
        .then(
          response => {
            if (response.data.ret_code == 0) {
              this.$router.push({
                path: `/login`
              });
            } else {
              this.$store.dispatch("ERROR_MESSAGE", response.data.ret_msg);
            }
          },
          ({ response }) => {
            this.$store.dispatch("ERROR_MESSAGE", "网络异常");
          }
        );
    },
    toTeacherC() {
      if (this.passT == 1) {
        // 已通过
        this.$router.push({
          path: `/audited`
        });
      } else if (this.passT == 2) {
        // 正在认证
        this.$router.push({
          path: `/auditing`
        });
      } else if (this.passT == 3) {
        // 未通过
        this.$router.push({
          path: `/teacherCert`,
          query: {
            passStu: 3
          }
        });
      } else {
        // 未认证
        this.$router.push({
          path: `/teacherCert`
        });
      }
    },
    toIDcard() {
      if (this.passM == 1) {
        // 已通过
        this.$router.push({
          path: `/IDpass`
        });
      } else if (this.passM == 2) {
        // 正在认证
        this.$router.push({
          path: `/IDwating`
        });
      } else if (this.passM == 3) {
        // 未通过
        this.$router.push({
          path: `/IDcard`,
          query: {
            passStu: 3
          }
        });
      } else {
        // 未认证
        this.$router.push({
          path: `/IDcard`
        });
      }
    },
    toTel() {
      if (this.passTel == 1) {
        // 已通过
        this.$router.push({
          path: `/check_success`
        });
      } else {
        // 未认证
        this.$router.push({
          path: `/tel_check`
        });
      }
    },
    toSchool() {
      this.$router.push({
        path: `/school`
      });
    },
    showGradeChoose() {
      this.$refs.grade.show();
    },
    gradeC(num) {
      this.setGrade(num);
    },
    personDataGet() {
      this.$http
        .post(
          "/ycorrect/user/center/index",
          {},
          {
            params: {}
          }
        )
        .then(
          response => {
            console.log(response.data.ret);
            if (response.data.ret_code == 0) {
              this.personData = response.data.ret;
              this.myBalance =  this.personData.balance.toFixed(2);
              // 电话
              if (this.personData.mobileAuthStatus == "PASS") {
                this.passTel = 1;
              } else if (this.personData.mobileAuthStatus == "CHECK") {
                this.showTip = true;
                this.passTel = 2;
              } else if (this.personData.mobileAuthStatus == "FAIL") {
                this.showTip = true;
                this.passTel = 3;
              } else if (this.personData.mobileAuthStatus == "DEFAULT") {
                this.showTip = true;
                this.passTel = 4;
              }
              // 身份证
              if (this.personData.idCardAuthStatus == "PASS") {
                this.passM = 1;
              } else if (this.personData.idCardAuthStatus == "CHECK") {
                this.showTip = true;
                this.passM = 2;
              } else if (this.personData.idCardAuthStatus == "FAIL") {
                this.showTip = true;
                this.passM = 3;
              } else if (this.personData.idCardAuthStatus == "DEFAULT") {
                this.showTip = true;
                this.passM = 4;
              }
              // 教师
              if (this.personData.qualificationAuthStatus == "PASS") {
                this.passT = 1;
              } else if (this.personData.qualificationAuthStatus == "CHECK") {
                this.showTip = true;
                this.passT = 2;
              } else if (this.personData.qualificationAuthStatus == "FAIL") {
                this.showTip = true;
                this.passT = 3;
              } else if (this.personData.qualificationAuthStatus == "DEFAULT") {
                this.showTip = true;
                this.passT = 4;
              }
              // 阶段
              if (this.personData.phase) {
                this.gradeType = this.personData.phase.name;
              } else {
                this.gradeType = "未选择";
              }
              // 学校
              if (this.personData.school) {
                this.theSchool = this.personData.school.name;
              } else {
                this.theSchool = "未选择";
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
    setGrade(gradeNum) {
      this.$http
        .post(
          "/ycorrect/user/center/setPhase",
          {},
          {
            params: {
              phaseCode: gradeNum
            }
          }
        )
        .then(
          response => {
            console.log(response.data);
            if (response.data.ret_code == 0) {
              let data = response.data.ret;
              if (gradeNum == 2) {
                this.gradeType = "初中";
              } else if (gradeNum == 3) {
                this.gradeType = "高中";
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
        cookie.set("outKey", "0");
        _this.$router.push({
          path: `/home`
        });
      });
    }
  },
  beforeDestroy: function() {
    document
      .getElementsByTagName("body")[0]
      .setAttribute("style", "background-color:#fff");
  }
};
</script>

<style scoped>
#allWrapper {
  width: 750px;
  max-width: 750px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: auto;
  margin: 0 auto;
  background: #e9e9eb;
}
.balanceWrap {
  width: 100%;
  height: 290px;
  position: relative;
  background: url("./balance_bg.jpg") no-repeat;
  background-size: 100% 100%;
  margin-top: -2px;
  margin-bottom: 20px;
}
.balanceWrap .p1 {
  position: absolute;
  top: 50px;
  left: 30px;
  font-size: 30px;
  color: #ffffff;
}
.balanceWrap .p2 {
  position: absolute;
  top: 110px;
  left: 30px;
  font-weight: 900;
  font-size: 60px;
  color: rgba(255, 255, 255, 1);
  font-size: 60px;
  color: #ffffff;
}
.balanceWrap .p3 {
  position: absolute;
  left: 30px;
  bottom: 60px;
  font-size: 30px;
  color: #ffffff;
}
.balanceWrap .p4 {
  position: absolute;
  right: 0;
  padding: 30px;
  font-size: 34px;
  font-weight: 900;
  top: 90px;
  color: #ffffff;
}
.balanceWrap .p4 img {
  vertical-align: middle;
  width: 16px;
  height: 28px;
  margin-top: -6px;
}
.tipConfirm {
  height: 80px;
  padding-left: 30px;
  background: #f8c438;
  line-height: 80px;
  font-size: 30px;
  color: #ffffff;
  margin-bottom: 20px;
}
.part {
  margin-bottom: 20px;
  background: #ffffff;
  height: auto;
}
.part .clum {
  padding: 0 30px;
  width: 690px;
  height: 100px;
  border-bottom: 3px solid #f0f0f0;
  line-height: 100px;
  font-size: 34px;
}
.part .clum .clum_left {
  float: left;
  color: #383d48;
  height: 100px;
}
.part .clum .clum_left img {
  width: 46px;
  height: 46px;
  vertical-align: middle;
  margin-top: -6px;
}
.part .clum .clum_right {
  color: #383d48;
  float: right;
  text-align: right;
  height: 100px;
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.part .clum .clum_right .img1 {
  width: 30px;
  height: 30px;
  vertical-align: middle;
}
.part .clum .clum_right .img2 {
  width: 14px;
  height: 25px;
  vertical-align: middle;
  margin-top: -6px;
}
.changePsd {
  color: #f14b40;
  height: 100px;
  width: 100%;
  text-align: center;
  line-height: 100px;
  font-size: 34px;
}
</style>
