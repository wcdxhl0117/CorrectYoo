<template>
    <div id="allWrapper">
      <Header v-show="showHead==true" :title="title"></Header>
      <div class="balance" :class="{'noHaveheader':showHead}">
          <div class="balance-top">
              <div class="balance-mountain">
                  <div class="balance-info">
                      <div class="balance-info-title">
                          <p class="balabce-tip">余额(元)</p>
                          <div @click="showRule"><span>提现规则 </span><p class="rule-arrow"><img src="./jian.png" alt=""></p></div>
                      </div>
                      <div class="bal-num">{{balanceData.balance}}</div>
                      <div class="bal-use">
                        <p>可用余额{{obalance}}元</p> 
                        <div class="bal-use-right">
                          <img class="imgBtn" @click="toggleShowTip" src="./tipinfo.png">
                          <transition name="mini">
                            <div v-show="showTheTip" class="theTip">
                              <img src="./thetip.png" alt="">
                              <p>为了降低你的账户风险<br/>仅上周日之前的收入可提现</p>
                            </div>
                          </transition>
                        </div>
                      </div>
                  </div>
                  
              </div>
          </div>
          <div class="info-card" @click="withDraw">
              <div class="info-card-con">
                  <img src="./card_pay.png"/>
              <p>提现到支付宝</p>
              <div class="cash-arrow"></div>
              </div>
          </div>
          <div class="info-card-detail">
              <h1>明细</h1>
              <ul v-if="!notHave">
                <!-- 取 -->
                  <li v-for="item in balanceData.correctBills">
                      <div class="card-detail-line card-detail-gray">
                          <p class="p1">{{timestampToTime(item.date)}}</p>
                          <p class="p2">批改{{item.correctCount}}题</p>
                      </div>
                      <div v-if="item.correctFee!=0" class="card-detail-line card-detail-cash">
                          <p  class="p1">批改费用</p>
                          <p class="p2">＋{{item.correctFee.toFixed(2)}}</p>
                      </div>
                      <div v-if="item.rewardFee!=0" class="card-detail-line card-detail-cash">
                          <p class="p1">奖励</p>
                          <p class="p2">＋{{item.rewardFee.toFixed(2)}}</p>
                      </div>
                      <div v-if="item.withdrawFee!=0" class="card-detail-line card-detail-cash">
                          <p class="p1">提现</p>
                          <p class="p2">{{item.withdrawFee.toFixed(2)}}</p>
                      </div>
                      <div v-if="item.errorFee!=0" class="card-detail-line card-detail-cash">
                          <p class="p1">批错扣费 <span class="xq" @click="toDetail(item.date)">&nbsp;&nbsp;详情</span></p>
                          <p class="p2">{{item.errorFee.toFixed(2)}}</p>
                      </div>
                      <div v-if="item.withdrawRefundFee!=0" class="card-detail-line card-detail-cash">
                          <p class="p1">提现失败</p>
                          <p class="p2">{{item.withdrawRefundFee.toFixed(2)}}</p>
                      </div>
                      <!-- <d  -->
                  </li>
                  
              </ul>
              <div v-if="sevenDay&&!notHave" @click="lookMore" class="bal-more"><a>查看更多</a></div>
              <!-- 没有明细显示 -->
              <div v-if="notHave" class="notHave">
                <img src="./notHave.png" alt="">
                <p>暂无记录</p>
              </div>
          </div>
      </div>
      <!-- 规则提示 -->
      <balance_rule ref="ruleInfo"></balance_rule>
      <loading :message="loadTip"></loading>
      <message></message>
    </div>
</template>

<script>
import loading from "@/base/loading/loading";
import cookie from "js-cookie";
import Header from "@/base/header";
import balance_rule from "./balance_rule";
import message from "@/base/message";

export default {
  components: { Header, balance_rule, loading, message },
  name: "balance",
  data: function() {
    return {
      showHead: false, //是否显示title栏
      title: "我的余额", //标题栏内容
      balanceData: {},
      obalance: 0,
      showTheTip: false,
      notHave: false, //明细没有数据
      sevenDay: false, //超过7天显示查看更多，否则不显示
      loadTip: ""
    };
  },
  beforeCreate: function() {
    document
      .getElementsByTagName("body")[0]
      .setAttribute("style", "background-color:#e9e9eb");
  },
  beforeRouteEnter(to, from, next) {
    cookie.set("outKey", "0");
    next(function(vm) {
      vm.$client.system("documentTitle", {
        title: "我的余额"
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
    this.balanceDataGet();
  },
  methods: {
    toDetail(res) {
      // this.$router.push({
      //   path: `/wrongInfo`,
      //   query: {
      //     d: res
      //   }
      // });
    },
    showRule() {
      this.$refs.ruleInfo.show();
    },
    toggleShowTip() {
      this.showTheTip = !this.showTheTip;
    },
    withDraw() {
      this.$router.push({
        path: `/withdrawal`
      });
    },
    lookMore() {
      this.$router.push({
        path: `/balance_detail`
      });
    },
    balanceDataGet() {
      let _this = this;
      this.$http
        .post(
          "/ycorrect/user/center/myBalance",
          {},
          {
            params: {
              size: 70
            }
          }
        )
        .then(
          response => {
            console.log(response.data.ret);
            if (response.data.ret_code == 0) {
              let data = response.data.ret;
              this.balanceData = data;
              this.balanceData.balance = this.balanceData.balance.toFixed(2);
              if (this.balanceData.obalance) {
                this.obalance = this.balanceData.obalance.toFixed(2);
              } else {
                this.obalance = this.obalance.toFixed(2);
              }

              // 处理数据，看是否展示，那些数据暂时
              for (let i = 0; i < this.balanceData.correctBills.length; i++) {
                if (
                  this.balanceData.correctBills[i].correctFee == 0 &&
                  this.balanceData.correctBills[i].errorFee == 0 &&
                  this.balanceData.correctBills[i].rewardFee == 0 &&
                  this.balanceData.correctBills[i].withdrawFee == 0 &&
                  this.balanceData.correctBills[i].withdrawRefundFee == 0
                ) {
                  this.balanceData.correctBills.splice(i, 1);
                }
              }

              // 大于7天，显示查看更多
              if (this.balanceData.correctBills.length >= 7) {
                // 截取前7个
                this.balanceData.correctBills = this.balanceData.correctBills.slice(
                  0,
                  7
                );
                this.sevenDay = true;
              } else {
                this.sevenDay = false;
              }
              // 没数据
              if (this.balanceData.correctBills.length == 0) {
                this.notHave = true;
              }
              // for (let i = 0; i < this.balanceData.correctBills.length; i++) {
              //   this.balanceData.correctBills[i].date = this.timestampToTime(
              //     parseInt(this.balanceData.correctBills[i].date)
              //   );
              // }
            } else {
              this.$store.dispatch("ERROR_MESSAGE", response.data.ret_msg);
            }
          },
          ({ response }) => {
            this.$store.dispatch("ERROR_MESSAGE", "网络异常");
          }
        );
    },
    timestampToTime(timestamp) {
      let date = new Date(timestamp); //如果timestamp为10位需要乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      let h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      let m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D;
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
.balance {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}
.noHaveheader {
  top: 80px;
}
::-webkit-scrollbar {
  width: 0;
}
balance::-webkit-scrollbar {
  display: none;
}
.balance-top {
  background-color: #1a88e6;
  position: relative;
  height: 340px;
  width: 100%;
  text-align: center;
  color: #fff;
  padding-top: 0;
  /* display: flex;
  justify-content: center; */
}
.balance-mountain {
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background: url("./balance_bg.jpg") no-repeat;
  /* width: 100%;
  height: 100%; */
  background-size: 100% 100%;
  z-index: 1;
}
.theTip {
  position: absolute;
  top: -110px;
  left: -136px;
  width: 310px;
  height: 115px;
}
.theTip img {
  width: 310px;
  height: 115px;
}
.theTip p {
  position: absolute;
  top: 16px;
  left: 10px;
  font-size: 24px;
  line-height: 30px;
}
.back-arr {
  display: inline-block;
  border-left: 2px solid;
  border-top: 2px solid;
  width: 20px;
  height: 20px;
  transform: rotate(-45deg);
}
.balance-title {
  height: 90px;
  line-height: 90px;
  position: relative;
  font-size: 33px;
}
.back {
  position: absolute;
  left: 30px;
  font-size: 30px;
}
.back a {
  color: #ffffff;
}
.balance-info {
  padding-top: 60px;
  width: 94%;
  margin: 0 auto;
  position: relative;
}
.balance-info-title {
  width: 100%;
  font-size: 30px;
  height: 60px;
  line-height: 60px;
}
.balance-info-title p {
  float: left;
  width: auto;
}
.balance-info-title div {
  float: right;
  width: 150px;
}
.balance-info-title div span {
  float: left;
}
.rule-arrow {
  float: left;
}
.rule-arrow img {
  float: left;
  width: 16px;
  height: auto;
  margin: 15px 0 0 2px;
}
.balabce-tip {
  color: #86ccf8;
  font-size: 30px;
}
.bal-num {
  font-size: 45px;
  text-align: left;
  height: 60px;
  line-height: 60px;
}
.bal-use {
  text-align: left;
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 28px;
}
.bal-use p {
  float: left;
}
.bal-use .bal-use-right {
  float: left;
  margin-left: 10px;
  width: 50px;
  height: 60px;
  position: relative;
}
.bal-use .bal-use-right .imgBtn {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  margin-top: -10px;
  padding: 20px 40px 20px 0;
}
.info-card {
  background-color: #fff;
  border-radius: 20px;
  width: 94%;
  margin: 0 auto;
  position: relative;
  margin-top: -60px;
  box-shadow: 4px 4px 4px #c0c0c0;
  z-index: 99;
  margin-bottom: 30px;
}
.info-card-con {
  padding: 0 30px;
  overflow: hidden;
  padding-top: 18px;
  padding-bottom: 10px;
}
.info-card-con img {
  width: 90px;
  height: 92px;
  float: left;
  vertical-align: middle;
}
.info-card-con p {
  font-size: 33px;
  font-weight: 700;
  float: left;
  padding-left: 10px;
  line-height: 120px;

  line-break: 60px;
  color: #383d48;
}
.cash-arrow {
  display: inline-block;
  border-right: 2px solid;
  border-bottom: 2px solid;
  width: 20px;
  height: 20px;
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg); /* IE 9 */
  -moz-transform: rotate(-45deg); /* Firefox */
  -webkit-transform: rotate(-45deg); /* Safari 和 Chrome */
  -o-transform: rotate(-45deg); /* Opera */
  float: right;
  margin-top: 45px;
}
.info-card-detail {
  position: relative;
  /* min-height: 760px; */
  background-color: #fff;
  border-radius: 20px;
  width: 94%;
  margin: 0 auto;
  position: relative;
  border: 1px solid #c0c0c0;
  box-shadow: 2px 2px 2px #c0c0c0;
  z-index: 99;
  margin-bottom: 30px;
}
.info-card-detail h1 {
  border-bottom: 3px solid #e2e2e2;
  font-size: 33px;
  font-weight: 700;
  height: 90px;
  line-height: 90px;
  padding-left: 30px;
  color: #383d48;
}
.info-card-detail ul li {
  border-bottom: 3px solid #f0f0f0;
  height: auto;
  padding: 0 30px;
}
.card-detail-line {
  /* display: flex;
  justify-content: space-between; */
  height: 60px;
  line-height: 60px;
  color: #383d48;
}
.card-detail-line .p1 {
  float: left;
}
.card-detail-line .p2 {
  float: right;
}
.card-detail-gray {
  color: #96aab4;
  font-size: 24px;
}
.xq {
  color: #007aff;
}
.card-detail-cash p {
  font-size: 30px;
}
.card-detail-cash .p2 {
  font-weight: 700;
}
.bal-more a {
  display: block;
  color: #007aff;
  font-weight: 700;
  text-align: center;
  width: 100%;
  font-size: 30px;
  height: 90px;
  line-height: 90px;
}

/**明细页面开始**/
.balance-detail {
  width: 100%;
}
.balance-detail-top {
  background-color: #1987e6;
  width: 100%;
  text-align: center;
  color: #fff;
  display: flex;
  justify-content: center;
}
.bal-card-detail {
  border-radius: 0;
  width: 100%;
  overflow-x: hidden;
  box-shadow: none;
}
.bal-none {
  text-align: center;
  color: #839096;
  height: 90px;
  line-height: 90px;
  background-color: #e9e9eb;
}

.notHave {
  /* position: absolute;
  top: 280px;
  left: 0; */
  width: 100%;
  min-height: 420px;
  text-align: center;
}
.notHave img {
  margin-top: 100px;
  width: 120px;
  height: 120px;
}
.notHave p {
  width: 100%;
  line-height: 40px;
  text-align: center;
  color: #839096;
  font-size: 24px;
}

/**帮助中心开始**/
.helper-card {
  background-color: #fff;
  padding: 0 30px;
  margin-bottom: 20px;
}
.helper-title {
  border-bottom: 1px solid #d3dde5;
  height: 90px;
  line-height: 90px;
  color: #1a88e6;
  font-weight: 700;
  font-size: 33px;
  position: relative;
  padding-left: 20px;
}
.helper-title span {
  border-left: 3px solid #1a88e6;
  width: 0;
  height: 36px;
  display: inline-block;
  position: absolute;
  left: 0;
  top: 32px;
}
.helper-content {
  padding: 15px 0;
  line-height: 45px;
  font-size: 30px;
}
.helper-content span {
  font-weight: 700;
}

.mini-enter-active,
.mini-leave-active {
  transition: all 0.4s;
}
.mini-enter,
.mini-leave-to {
  opacity: 0;
}
</style>
