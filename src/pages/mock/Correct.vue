<template>
    <div id="allWrapper">
      <!-- <video  
        webkit-playsinline="true"
        ref="videoT"
        controls="controls" 
        width="0" height="0" 
        muted="false"
        autoplay="autoplay" 
        loop="loop" 
        style="display:block; opacity:0;position:fixed;z-index:-100;">
        <source src="http://www.w3cschool.cc/try/demo_source/mov_bbb.mp4" type="video/mp4">   
        </video> -->
      <Header v-show="showHead==true" :title="title"></Header>
      <div class="headWrap">
        <p class="headTip">{{headTip}}</p>
        <p ref="headBtn" @click="BtnClick" class="headBtn">{{headBtnFont}}</p>
      </div>
      <!-- 等待组件 -->
      <startWaiting v-if="showStartWait"></startWaiting>
      <endWaiting v-if="showEndWait"></endWaiting>
      <!-- 批改组件 -->
      <TheMain ref="mianAll" v-if="showMianPi" @tOStop="timeOutStop" :taskNum="NumTData" :taskD="task" @anAll="AnswerGet" @ImgPop="ImgPopNow" :headHave="showHead"></TheMain>
      <!-- 底部提交 -->
      <theBottom v-if="showMianPi" @commitResult="comitRe" @putQues="putQuestion" :btmBtnBg="subResultBtn"></theBottom>
      <!-- 提示弹窗 -->
      <confirm ref="confirm" 
        :text="tipContent" 
        :confirmBtnText="sureTxt" 
        :cancelBtnText="cancelTxt" 
        :tipHead="tipHead"
        @confirm="certification"
        ></confirm>
        <!-- 图片预览组件 -->
      <picBig v-if="jdPicLook" @closeImgPop="closeImgPlus"></picBig>
      <question ref="ques" @subQuestion="subQues"></question>
      <loading :message="loadTip"></loading>
      <classMessage v-if="sucessTip" :message="sucessTip"></classMessage>

      <!-- 模拟批改提示弹窗 -->
      <comfirmTip ref="comfirmTip" @confirmTip="mocSure"></comfirmTip>
      <comfirmTip1 @confirmTip1="toPiGai" ref="comfirmTip1" :text="mocTipPopTxt"></comfirmTip1>

      <message></message>
    </div>
</template>

<script>
import "mathjax?config=TeX-MML-AM_HTMLorMML";
import cookie from "js-cookie";
import Header from "@/base/header";
import TheMain from "./main";
import startWaiting from "./startWaiting";
import endWaiting from "./endWaiting";
import theBottom from "./theBottom";
import confirm from "@/base/confirm/confirm";
import loading from "@/base/loading/loading";
import pgTip from "@/base/pgTip";
import picBig from "./picBig";
import question from "./question";
import classMessage from "@/base/classMessage";
import { clearInterval } from "timers";
import comfirmTip from "@/base/comfirmTip";
import comfirmTip1 from "@/base/comfirmTip1";
import message from "@/base/message";

export default {
  components: {
    Header,
    TheMain,
    startWaiting,
    endWaiting,
    theBottom,
    confirm,
    picBig,
    question,
    pgTip,
    loading,
    classMessage,
    comfirmTip1,
    comfirmTip,
    message
  },
  name: "Correct",
  data: function() {
    return {
      showHead: false, // 是否显示title栏
      title: "批改中", // 标题栏内容
      headTip: "已停止接收题目，点击右侧按钮，开始接收新的题目",
      btnColor: "#00BB9D",
      headBtnFont: "开始接收题目",
      showMianPi: false, // 点击了开始接替，并且匹配到题目时显示（显示答题区）
      showStartWait: false, // 点击开始时，暂时还没有收到题目的waiting
      showEndWait: true, // 点击了结束，并且答题区所有题目都已提交
      jdPicLook: false, // 解答题图片预览组件的显示隐藏
      taskData: {}, // 放后台传过来的题目信息
      btnStatus: 2, // 当前按钮状态，1为正在接题，2为点击了停止
      AnswerArr: [], // 放答案
      NumTData: 0, //当前题号
      toHomeNum: 0, // 当还没正式批改时为0，点击确定模拟开始为1
      QuesChoose: "",
      QuesDetail: "",
      mocTipPopTxt: "恭喜你完成模拟批改,现在可以去正式批改了",
      tipContent: "退出页面，将停止接收新题目<br/>是否退出？",
      sureTxt: "退出",
      cancelTxt: "取消",
      tipHead: "提示",
      loadTip: "",
      sucessTip: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    cookie.set("outKey", "0");
    next(function(vm) {
      vm.$client.system("documentTitle", {
        title: "模拟批改中"
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
  },
  mounted() {
    let _this = this;
    this.$refs.headBtn.style.background = this.btnColor;
    // 监听返回键
    cookie.set("outKey","0");
    // this.backBTN();

    // 确认模拟弹窗
    setTimeout(function() {
      _this.$refs.comfirmTip.show();
    }, 500);

    // // 播放
    // this.$refs.videoT.play();
    // this.$refs.videoT.volume = 0;
  },
  computed: {
    task() {
      return JSON.stringify(this.taskData);
    },
    subResultBtn() {
      if (!this.AnswerArr.length) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    mocSure() {
      this.toHomeNum = 1;
      this.BtnClick();
    },
    toPiGai() {
      this.$http.post("/ycorrect/question/completeMock", {}, {}).then(
        response => {
          if (response.data.ret_code == 0) {
            this.$router.push({
              path: `/home`
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
    timeOutStop() {
      this.StopBtnClick();
      // 30秒未操作，停止批改
      this.headBtnFont = "开始接收题目";
      this.headTip = "已停止接收题目，点击右侧按钮，开始接收新的题目";
      this.showStartWait = false;
      this.showEndWait = true;
      this.showMianPi = false;
      this.btnColor = "#00BB9D";
      this.$refs.headBtn.style.background = this.btnColor;
    },
    BtnClick() {
      // this.backBTN(); //调用返回键事件
      // this.$refs.videoT.play();
      // this.$refs.videoT.volume = 0;
      if (this.btnColor == "#F14B40") {
        // this.btnColor = "#00BB9D";
        // this.$refs.headBtn.style.background = "#00BB9D";
        this.HeadBtnClick(1);
      } else {
        this.btnColor = "#F14B40";
        this.$refs.headBtn.style.background = "#F14B40";
        this.HeadBtnClick(2);
      }
    },
    HeadBtnClick(num) {
      if (num == 1) {
        this.$store.dispatch("ERROR_MESSAGE", "模拟批改，不可操作");
        // // 点击停止，变为结束状态
        // this.headBtnFont = "开始接收题目";
        // this.headTip = "已停止接收题目，点击右侧按钮，开始接收新的题目";
        // // 正在答题时点击停止答题
        // if (this.showMianPi) {
        //   // 后端交互
        //   console.log("点击了停止答题");
        // } else {
        //   // 还没开始答题，点击停止答题,显示停止答题的waiting
        //   this.showStartWait = false;
        //   this.showEndWait = true;
        //   this.taskData = {};
        //   // 调用停止
        //   this.StopBtnClick();
        // }
        // this.btnStatus = 2;
      } else {
        // 点击开始,变为批改状态
        this.headBtnFont = "停止接收新题目";
        this.headTip = "当前处于批改状态，系统会自动派题，请注意查看并及时批改";

        // 正在答题时点击开始答题
        if (this.showMianPi) {
          // 后端交互
          console.log("在答题中点击了开始");
        } else {
          // 没答题，正在等待状态，点击开始
          this.showStartWait = true;
          this.showEndWait = false;
          this.getData();
        }
        this.btnStatus = 1;
      }
    },
    AnswerGet(arr) {
      this.AnswerArr = JSON.parse(arr);
    },
    ImgPopNow() {
      this.jdPicLook = true;
    },
    closeImgPlus() {
      cookie.set("imgIndex", "");
      cookie.set("JDimgArr", "");
      this.jdPicLook = false;
    },
    // 点击提问题回话
    putQuestion() {
      // this.$refs.ques.show();
    },
    // 提交反馈
    subQues(reasonChoose, otherReson) {
      let _this = this;
      console.log(reasonChoose, otherReson);
      // 提交后台同事调用loadding
      this.loadTip = "正在提交...";
      // 延时器模拟后台数据请求
      setTimeout(function() {
        _this.loadTip = "";
        // 调用成功弹窗
        _this.sucessTip = "提交成功";
        setTimeout(function() {
          _this.sucessTip = "";

          // 下一题或停止答题
          _this.OnOrStop();
        }, 1500);
      }, 1500);
    },
    // 提交答案
    comitRe() {
      if (!this.AnswerArr.length) {
        console.log("还没批改，点击了提交");
        return;
      } else {
        console.log("提交结果", this.AnswerArr);
        this.OnOrStop();
      }
    },
    certification() {
      //  提示弹窗确认
      this.$router.push({
        path: `/home`
      });
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
        if (_this.toHomeNum == 1) {
          // 正在批改
          // window.history.forward(1);
          _this.$refs.confirm.show();
        } else {
          _this.$router.push({
            path: `/home`
          });
        }
      });
    },
    // 提交答案或者点击反馈后的后续操作封装
    OnOrStop() {
      this.loadTip = "正在提交..."
      // 将题目清空和答案
      this.taskData = {};
      this.AnswerArr = [];
      // 判断提交时是停止接替状态还是正在接题
      if (this.btnStatus == 1) {
        // 后台提交，成功后再请求数据
        this.showMianPi = false;
        this.showStartWait = true;
        this.showEndWait = false;
        this.getData();
      } else {
        this.StopBtnClick();
        // 后台提交，成功后，会到等待开始接题页面
        this.showMianPi = false;
        this.showStartWait = false;
        this.showEndWait = true;
      }
    },
    // 后台获取题目
    getData() {
      let _this = this;
      if (_this.NumTData >= 10) {
        this.loadTip = "";
        this.$refs.comfirmTip1.show();
      } else {
        this.$http
          .post(
            "/ycorrect/question/getMockCorrectQuestion",
            {},
            {
              params: {}
            }
          )
          .then(
            response => {
              this.loadTip = "";
              // console.log(response);
              if (response.data.ret_code === 0) {
                if (response.data.ret) {
                  _this.taskData = response.data.ret[_this.NumTData];
                  _this.NumTData++;
                  _this.showStartWait = false;
                  _this.showEndWait = false;
                  _this.showMianPi = true;
                  window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
                }
                setTimeout(function() {
                  if (
                    _this.btnStatus == 1 &&
                    JSON.stringify(_this.taskData) == "{}"
                  ) {
                    _this.getData();
                  }
                }, 3000);
              } else {
                this.$store.dispatch("ERROR_MESSAGE", response.data.ret_msg);
              }
            },
            ({ response }) => {
              // alert("网络异常")
              this.loadTip = "";
              this.$store.dispatch("ERROR_MESSAGE", "网络异常");
              this.showMianPi = false;
              this.showStartWait = false;
              this.showEndWait = true;
            }
          );
      }
    },
    // 结束接收题目的后台交互
    StopBtnClick() {
      this.$http.post("/ycorrect/question/stopGetCorrectQuestion", {}, {}).then(
        response => {
          if (response.data.ret_code == 0) {
            console.log(response.data);
            // location.reload();
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
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.headWrap {
  height: 100px;
  width: 100%;
  background: #f8c438;
  position: relative;
}
.headWrap .headTip {
  position: absolute;
  top: 22px;
  left: 30px;
  width: 420px;
  line-height: 30px;
  font-size: 24px;
  color: #383d48;
}
.headWrap .headBtn {
  position: absolute;
  top: 25px;
  right: 30px;
  height: 50px;
  width: 210px;
  border-radius: 25px;
  font-size: 24px;
  color: #ffffff;
  text-align: center;
  line-height: 50px;
}
</style>
