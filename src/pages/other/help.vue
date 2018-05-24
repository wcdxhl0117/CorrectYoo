<template>
    <div id="allWrapper">
      <Header v-show="showHead==true" :title="title"></Header>
      <div class="balance" :class="{'noHaveheader':showHead}">
        <div class="helper-card">
            <h1 class="helper-title">
                <span></span>信任值
            </h1>
            <div class="helper-content">
                <p>信任值是对批改老师所提供服务的综合评价。</p>
                <p>根据近5000题的批改效率、批改准确率、响应时间和每周出勤率由系统自动计算得出。信任值初始分为{{helpData.defaultTrustRank}}分，{{helpData.minTrustRank}}分以下，系统暂停其批改功能。</p>
            </div>
        </div>
        <div class="helper-card">
            <h1 class="helper-title">
                <span></span>计费
            </h1>
            <div class="helper-content">
                <p>用户的收入由批改费用、奖励费用构成。</p>
                <p>批改费用</p>
                <p>填空题：{{helpData.blankQuestionFee}} 元/题</p>
                <p>解答题：{{helpData.answerQuestionFee}} 元/题</p>
                <p>奖励费用请在首页任务奖励中进行查看。</p>
            </div>
        </div>
        <div class="helper-card">
            <h1 class="helper-title">
                <span></span>惩罚
            </h1>
            <div class="helper-content">
                <p>题目批改错误，管理员核实后，按照批改单题收入的{{helpData.blankQuestionReduceRate}}倍费用进行扣除，例如：</p>
                <p>填空题被确认批改错误，扣费：{{helpData.blankQuestionFee}}*{{helpData.blankQuestionReduceRate}}={{(helpData.blankQuestionFee*helpData.blankQuestionReduceRate).toFixed(2)}}</p>
                <p>解答题被确认批改错误，扣费：{{helpData.answerQuestionFee}}*{{helpData.answerQuestionReduceRate}}={{(helpData.answerQuestionFee*helpData.answerQuestionReduceRate).toFixed(2)}}</p>
            </div>
        </div>
        <div class="helper-card">
            <h1 class="helper-title">
                <span></span>提现
            </h1>
            <div class="helper-content">
                <p><span>提现时间：</span>每周{{helpData.withdrawWeekDay}} {{helpData.withdrawBt}} ~ {{helpData.withdrawEt}}</p>
                <p><span>可提收入：</span>上周日24:00前所有未提现收入</p>
                <p><span>单日提现限额：</span>{{helpData.dayWithdrawMax}}元</p>
                <p><span>到账时间：</span>{{helpData.transferTimeComment}}</p>
                <p><span>提现次数：</span>每周{{helpData.dayWithdrawCount}}次</p>
                <p>* 仅支持提现到支付宝账户</p>
                <p>* 实名认证的姓名与支付宝账户姓名必须一致</p>
                <p>* 出现提现失败的用户</p>
                <p>请核查实名认证信息与支付宝信息是否一致</p>
                <p>支付宝账户是否设置为不可查询与搜索</p>
                <p>支付宝账号是否隐藏了真实姓名</p>
            </div>
        </div>
        <div class="helper-card">
            <h1 class="helper-title">
                <span></span>派题规则
            </h1>
            <div class="helper-content">
                <p>系统根据信任值的高低自动进行分配题目，信任值高的用户优先获得题目。</p>
            </div>
        </div>
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
  name: "help",
  data: function() {
    return {
      showHead: false, //是否显示title栏
      title: "帮助中心", //标题栏内容
      helpData: {}
    };
  },
  beforeRouteEnter(to, from, next) {
    cookie.set("outKey", "0");
    next(function(vm) {
      vm.$client.system("documentTitle", {
        title: "帮助中心"
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

    this.$http
      .post(
        "/ycorrect/home/help",
        {},
        {
          params: {}
        }
      )
      .then(
        response => {
          console.log(response.data.ret);
          if (response.data.ret_code == 0) {
            this.helpData = response.data.ret;
            if (this.helpData.withdrawWeekDay === 1) {
              this.helpData.withdrawWeekDay = "一";
            } else if (this.helpData.withdrawWeekDay === 2) {
              this.helpData.withdrawWeekDay = "二";
            } else if (this.helpData.withdrawWeekDay === 3) {
              this.helpData.withdrawWeekDay = "三";
            } else if (this.helpData.withdrawWeekDay === 4) {
              this.helpData.withdrawWeekDay = "四";
            } else if (this.helpData.withdrawWeekDay === 5) {
              this.helpData.withdrawWeekDay = "五";
            } else if (this.helpData.withdrawWeekDay === 6) {
              this.helpData.withdrawWeekDay = "六";
            } else if (this.helpData.withdrawWeekDay === 7) {
              this.helpData.withdrawWeekDay = "日";
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
        cookie.set("outKey", "0");
        _this.$router.push({
          path: `/home`
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
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.noHaveheader {
  top: 80px;
}
.balance::-webkit-scrollbar {
  width: 0;
}
.balance-top {
  background-color: #1a88e6;
  position: relative;
  height: 360px;
  width: 100%;
  text-align: center;
  color: #fff;
  padding-top: 90px;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  -webkit-justify-content: center;
}
.balance-mountain {
  position: absolute;
  bottom: 0;
  background: url("./balance_bg.jpg") no-repeat;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  z-index: 1;
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
}
.balance-info-title {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  height: 60px;
  line-height: 60px;
}
.rule-arrow {
  display: inline-block;
  border-right: 2px solid;
  border-bottom: 2px solid;
  width: 16px;
  height: 16px;
  transform: rotate(-45deg);
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
  height: 60px;
  line-height: 60px;
  font-size: 28px;
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
  float: right;
  margin-top: 45px;
}
.info-card-detail {
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
  border-bottom: 1px solid #d3dde5;
  font-size: 33px;
  font-weight: 700;
  height: 90px;
  line-height: 90px;
  padding-left: 30px;
  color: #383d48;
}
.info-card-detail ul li {
  border-bottom: 1px solid #d3dde5;

  padding: 0 30px;
}
.card-detail-line {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  height: 60px;
  line-height: 60px;
  color: #383d48;
}
.card-detail-gray {
  color: #96aab4;
  font-size: 24px;
}
.card-detail-cash p {
  font-size: 30px;
}
.card-detail-cash p:last-child {
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
  display: -webkit-flex;
  justify-content: center;
  -webkit-justify-content: center;
}
.bal-card-detail {
  border-radius: 0;
  width: 100%;
  box-shadow: none;
}
.bal-none {
  text-align: center;
  color: #839096;
  height: 90px;
  line-height: 90px;
  background-color: #e9e9eb;
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
  font-size: 30px;
  position: relative;
  padding-left: 20px;
}
.helper-title span {
  border-left: 6px solid #1a88e6;
  width: 0;
  height: 36px;
  display: inline-block;
  position: absolute;
  left: 0;
  top: 28px;
}
.helper-content {
  padding: 15px 0;
  line-height: 45px;
  font-size: 30px;
}
.helper-content span {
  font-weight: 700;
}
</style>
