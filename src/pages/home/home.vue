<template>
  <div id="allWrapper">
      <audio ref="bgMusic" id="audio" autoplay="autoplay" :src="tipMusic">
        <source :src="tipMusic" type="audio/ogg">
        <source :src="tipMusic" type="audio/mpeg">
        <!-- http://pic.ibaotu.com/00/43/23/41F888piC5fv.mp3 -->
        <!-- /static/step1.mp3 -->
      </audio>

      <div class="index">
          <div class="index-top">
              <div class="index-mountain"></div>
              <div class="index-intr">
                  <!-- <p class="title">小悠快批</p> -->
                  <p style="height:20px" v-if="!showTip"></p>
                  <p class="the_tip" v-if="showTip">你还没有进行认证，通过认证后才能批改题目 <span @click="certification">点击认证 <img src="./jian.png"></span></p>
                  <p class="trust">信任值(分)</p>
                  <div class="num">{{homeData.trustRank}}</div>
              </div>
          </div>
          <div class="info-card">
              <div class="card-top">
                  <div class="card-top-left" @click="toBalance">
                      <p>今日批改(题)</p>
                      <p>{{homeData.todayCorrect}}</p>
                  </div>
                  <div class="card-top-right" @click="toBalance">
                      <p>今日流水(元)</p>
                      <p>{{homeData.todayEarn}}</p>
                  </div>
              </div>
              <div class="card-bottom" @click="startCorrecting">
                  <a class="start-correct">点击开始批改</a>
              </div>
          </div>
          <div class="personal">
              <div class="per-title" @click="toBalance">
                  <p v-if="!homeData.canWithdraw"><img src="./coin.png"/> 我的余额: {{homeData.balance}}元，下一个提现日 {{homeData.nextWithdrawDate}}</p>
                  <p v-if="homeData.canWithdraw"><img src="./coin.png"/> 我的余额: {{homeData.balance}}元，今日{{homeData.withdrawBt}}~{{homeData.withdrawEt}}可提现</p>
                  <a>
                      <span>查看</span>
                      <p class="triangle-right"></p>
                  </a>
              </div>
              <div class="per-con">
                  <p @click="certification"><img src="./icon_per.png"/><a>个人中心</a></p>
                  <p @click="toHelp"><img src="./icon_question.png"/><a>帮助中心</a></p>
              </div>
          </div>
          <div class="reward">
              <p class="re-title">每日奖励任务</p>
              <ul>
                  <li v-for="item in homeData.todayRewards">
                      <div class="re-left">
                          <p class="p1">{{getNowFormatDate()}}</p>
                          <p class="p2">批改完成{{item.correctQuestionCount}}道题，奖励{{item.fee}}元</p>
                      </div>
                      <div class="re-right">
                          <div v-if="item.complete" class="task-complete">
                              <img src="./icon_hook.png"/>
                              <span>已完成</span>
                          </div>
                          <div v-if="!item.complete" class="task-uncomplete">
                              未完成
                          </div>
                      </div>
                  </li>
              </ul>
          </div>
      </div>
      <confirm ref="confirm" 
        :text="tip" 
        :confirmBtnText="sureTxt" 
        :cancelBtnText="cancelTxt" 
        :tipHead="tipHead"
        :noCancel="noCancel"
        @confirm="certification"
        ></confirm>
      <firstTip ref="firstTip" 
        :text="tip" 
        :confirmBtnText="sureTxt" 
        :cancelBtnText="cancelTxt" 
        :tipHead="tipHead"
        :noCancel="noCancel"
        @confirm="firstTip"
        ></firstTip>
      <lowTip ref="lowTip" 
        :text="tip" 
        :confirmBtnText="sureTxt" 
        :cancelBtnText="cancelTxt" 
        :tipHead="tipHead"
        :noCancel="noCancel"
        @confirm="lowTip"
        ></lowTip>
        <message></message>
  </div>
</template>

<script>
import cookie from "js-cookie";
import confirm from "@/base/confirm/confirm";
import firstTip from "./firstTip";
import lowTip from "./lowTip";
import message from "@/base/message";

export default {
  components: { confirm, lowTip, firstTip, message },
  name: "home",
  data: function() {
    return {
      showTip: false, //true为显示，就是未认证
      homeData: {},
      tipHead: "提示", //标题
      tip: "你还没有进行认证，<br/>通过认证后才能批改题目", //内容
      sureTxt: "去认证",
      cancelTxt: "取消",
      noCancel: true,
      tipMusic: '/static/step1.mp3'
    };
  },
  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      vm.$client.system("documentTitle", {
        title: "小悠快批"
      });
    });
  },
  created() {
    cookie.set("outKey", "1");
    this.backBTN();
  },
  mounted() {
    this.checkMusic('/static/step1.mp3')

    let _this = this;
    setTimeout(() => {
      if (!cookie.get("DEVICE_TYPE") && cookie.get("S_L_S") != 1) {
        _this.$router.push({
          path: `/login`
        });
      }
    }, 100);
//////////////////////////////////////////////////////////////////////////////////////////////////////
    this.$http
      .post(
        "/ycorrect/home/index",
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
            this.showTip = !data.authenticated;
            this.homeData = data;
            this.homeData.balance = this.homeData.balance.toFixed(2);
            this.homeData.todayEarn = this.homeData.todayEarn.toFixed(2);
          } else {
            // this.$store.dispatch("ERROR_MESSAGE", response.data.ret_msg);
          }
        },
        ({ response }) => {
          this.$store.dispatch("ERROR_MESSAGE", "网络异常");
        }
      );
  },
  methods: {
    checkMusic(src) {
      this.tipMusic = src
      this.$refs.bgMusic.play();
    },
    toHelp() {
      this.checkMusic('http://pic.ibaotu.com/00/43/23/41F888piC5fv.mp3')
      // this.$router.push({
      //   path: `/help`
      // });
    },
    toBalance() {
      this.$router.push({
        path: `/balance`
      });
    },
    startCorrecting() {
      // 未认证通过
      if (JSON.stringify(this.homeData) == "{}") {
        this.$store.dispatch("ERROR_MESSAGE", "网络异常");
      } else if (this.showTip) {
        this.showConfirm();
      } else {
        // 第一次批改
        if (!this.homeData.isPassSimulation) {
          // 进模拟
          this.tip = "在开始正式批改前请先进行批改<br/>模拟操作，熟悉批改流程";
          this.sureTxt = "模拟批改";
          this.$refs.firstTip.show();
        } else if (this.homeData.trustRank < 60) {
          // 分数低于60分
          this.tip =
            "由于你的信任值低于60，系统已暂时关闭了你的批改权限，有任何疑问请联系客服";
          this.sureTxt = "确定";
          this.noCancel = false;
          this.$refs.lowTip.show();
        } else {
          // 进入批改
          this.$router.push({
            path: `/Correct`
          });
        }
      }
    },
    // 跳转认证（弹窗确认，提示，个人中心按钮）
    certification() {
      this.checkMusic('/static/step1.mp3')
      // this.$router.push({
      //   path: `/personal`
      // });
    },
    firstTip() {
      this.$router.push({
        path: `/mock`
      });
    },
    lowTip() {},
    showConfirm() {
      this.$refs.confirm.show();
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
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
        // outKey
        if (cookie.get("outKey") == "1") {
          _this.$router.push({
            path: `/home`
          });
        }
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
  background: #e9e9eb;
}
.index-top {
  background-color: #1a88e6;
  position: relative;
  height: 300px;
  width: 100%;
  text-align: center;
  color: #fff;
  padding-top: 20px;
  /* display: flex;
  display: -webkit-flex;
  justify-content: center; */
}
.index-mountain {
  position: absolute;
  bottom: 0;
  background: url("./index_mou.png") no-repeat;
  width: 100%;
  height: 100%;
  background-size: cover;
  z-index: 1;
}
.index-top .title {
  font-size: 34px;
  height: 65px;
  line-height: 50px;
}
.index-top .the_tip {
  position: relative;
  line-height: 60px;
  margin: 0 auto;
  width: 670px;
  height: 60px;
  background: rgba(248, 196, 56, 1);
  border-radius: 10px;
  text-align: left;
  padding: 0 25px;
  font-size: 24px;
  color: rgba(255, 255, 255, 1);
}
.index-top .the_tip span {
  display: inline-block;
  position: absolute;
  top: 0;
  right: 20px;
  height: 100%;
}
.index-top .the_tip img {
  width: 14px;
  height: 22px;
  vertical-align: middle;
  margin-top: -8px;
}
.index-top .trust {
  font-size: 24px;
  height: 60px;
  line-height: 60px;
}
.index-top .num {
  font-size: 90px;
}
.index-intr {
  width: 100%;
  position: absolute;
  z-index: 99;
  left: 0;
}
.index {
  background-color: #e9e9eb;
}
.info-card {
  background-color: #fff;
  border-radius: 20px;
  width: 94%;
  margin: 0 auto;
  position: relative;
  margin-top: -30px;
  box-shadow: 4px 4px 4px #c0c0c0;
  z-index: 99;
  margin-bottom: 30px;
}
.card-top {
  height: 60px;
  overflow: hidden;
  padding: 30px;
  display: flex;
  justify-content: space-between;
}
.card-top-left,
.card-top-right {
  float: left;
  width: 50%;
  text-align: center;
}
.card-top-left :first-child,
.card-top-right :first-child {
  color: #839096;
  font-size: 24px;
  height: 45px;
  line-height: 45px;
}
.card-top-left :last-child,
.card-top-right :last-child {
  color: #383d48;
  font-size: 45px;
  height: 45px;
  line-height: 45px;
}
.start-correct {
  height: 80px;
  width: 440px;
  line-height: 80px;
  background-color: #2cd594;
  color: #fff;
  text-align: center;
  font-size: 34px;
  display: block;
  border-radius: 90px;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 30px;
}
.card-bottom {
  width: 100%;
  height: auto;
  padding-bottom: 20px;
  /* display:-webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  display: -webkit-flex;
  -webkit-justify-content:center;
  justify-content: center; */
}
.personal {
  background-color: #fff;
  margin-bottom: 30px;
}
.per-title {
  height: 90px;
  line-height: 92px;
  width: 94%;
  margin: 0 auto;
  overflow: hidden;
  font-size: 24px;
  color: #383d48;
}
.per-title p {
  float: left;
}
.per-title p img {
  width: 24px;
  height: 24px;
  margin-top: -6px;
  vertical-align: middle;
}
.per-title a {
  float: right;
  display: block;
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
}
.per-con {
  border-top: 1px solid #d3dde5;
  width: 100%;
  padding: 30px 0;
  line-height: 64px;
  height: 60px;
}
.per-con p {
  float: left;
  width: 49%;
  text-align: center;
}
.per-con p a {
  float: left;
  font-size: 30px;
  font-weight: 700;
  color: #383d48;
}
.per-con p img {
  width: 48px;
  height: 48px;
  margin-right: 10px;
  float: left;
  margin-left: 90px;
  margin-top: 6px;
}
.per-con p:first-child {
  border-right: 1px solid #d3dde5;
}
.triangle-right {
  display: inline-block;
  border-right: 1px solid;
  border-bottom: 1px solid;
  width: 12px;
  height: 12px;
  transform: rotate(-45deg);
  margin-top: 38px;
  margin-right: 4px;
}
.reward {
  background-color: #fff;
}
.reward .re-title {
  border-bottom: 1px solid #d3dde5;
  height: 90px;
  line-height: 90px;
  padding-left: 3%;
  font-weight: 700;
  font-size: 30px;
  color: #383d48;
}
.reward ul {
  width: 94%;
  margin: 0 auto;
}
.reward ul li {
  border-bottom: 1px solid #d3dde5;
  padding: 30px 0;
  height: 90px;
  /* display: flex; */
  /* display: -webkit-flex;
  -webkit-align-items: center; */
  /* align-items: center; */
  /* -webkit-justify-content:space-between;
  justify-content: space-between; */
}
.reward .re-left {
  width: 76%;
  height: auto;
  text-align: left;
  float: left;
}
.reward .re-left p {
  height: 45px;
  line-height: 45px;
}
.reward .re-left .p1 {
  color: #ccc;
  font-size: 24px;
}
.reward .re-left .p2 {
  color: #383d48;
  font-size: 30px;
  font-weight: 700;
}
.re-right {
  width: 24%;
  float: left;
  margin-top: 35px;
  text-align: right;
}
.task-complete {
  color: #73e9bc;
  font-size: 30px;
  font-weight: 700;
}
.task-complete img {
  width: 34px;
  height: 34px;
  margin-top: -10px;
  vertical-align: middle;
}
.task-complete span {
  display: inline-block;
}
.task-uncomplete {
  color: #d3dde5;
  font-size: 30px;
  font-weight: 700;
}
</style>
