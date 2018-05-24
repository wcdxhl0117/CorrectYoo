<template>
    <div class="mainWrap" :class="{'noHaveheader':headHave}">
      <div class="CrossScreen">
        <div class="mainTop">
          <!-- 填空题top -->
          <div  v-if="Tshow" class="completion">
            <div class="CountDown">
              <p class="c-itle">填空题</p>
              <p class="nowNum">模拟批改{{taskNum}}/10</p>
              <div class="c-div">
                <span>计时 </span>
                <span>{{min}}:{{sec}}</span>
              </div>
            </div>
           
            <p class="t-info" v-html="parseTexMathContent(taskAllData.question.content)"></p>
          </div>
          <!-- 解答题top -->
          <div v-if="!Tshow" class="computeTop">
            <div class="CountDown">
              <p class="c-itle">解答题</p>
              <p class="nowNum">模拟批改{{taskNum}}/10</p>
              <div class="c-div">
                <span>计时 </span>
                <span>{{min}}:{{sec}}</span>
              </div>
            </div>
            
            <p @click="openTitle" v-show="!computeTitleShow" class="openTitle">点击展开题干</p>
            <p v-show="computeTitleShow" class="t-info" v-html="parseTexMathContent(taskAllData.question.content)"></p>
            <div class="rightAnswer topCommon">
              <p class="p1">正确答案</p>
              <p class="p2" v-html="parseTexMathContent(taskAllData.question.answers[0].content)"></p>
            </div>
            <div class="rightDetail topCommon">
              <p class="p1">解析</p>
              <p class="p2" v-html="parseTexMathContent(taskAllData.question.analysis)"></p>
            </div>
          </div>
        </div>
        <p class="jianx"></p>

        <div class="manBtm">
          <!-- 填空题批改-开始 -->
          <div v-if="Tshow" class="completionBtm">
            <!-- 循环结构,正常批改 -->
            <div v-if="!taskAllData.correctAnswers" v-for="(item,index) in taskAllData.question.answers" class="c_clum">
              <p class="c_clum_t">第{{index+1}}空</p>
              <div class="c_clum_m">
                <div class="z_a_wrap">
                  <div class="div1">
                    <p class="p1">正确答案 </p>
                    <p class="p2"><span v-html="parseTexMathContent(item.content)"></span></p>
                  </div>
                  <div class="choose_result"></div>
                </div>
                <div class="z_a_wrap">
                  <div class="div1">
                    <p class="p1">作答答案 </p>
                    <p class="p2"><span v-html="parseTexMathContent(taskAllData.studentHomeworkAnswers[index].content)"></span></p>
                  </div>
                  <div v-if="taskAllData.studentHomeworkAnswers[index].content" class="choose_result">
                    <p v-if="index==0" class="tipMove">选择批改结果</p>
                    <img 
                      @click="chooseDui(index,taskAllData.studentHomeworkAnswers[index].answerId)"
                      v-if="taskAllData.studentHomeworkAnswers[index].result=='UNKNOW'||taskAllData.studentHomeworkAnswers[index].result=='INIT'||taskAllData.studentHomeworkAnswers[index].result=='WRONG'" 
                      class="img1 dui" src="./dui.png">
                    <img 
                      @click="chooseDui(index,taskAllData.studentHomeworkAnswers[index].answerId)"
                      v-if="taskAllData.studentHomeworkAnswers[index].result=='RIGHT'" 
                      class="img1 dui" src="./duic.png">
                    <img 
                      @click="chooseCuo(index,taskAllData.studentHomeworkAnswers[index].answerId)"
                      v-if="taskAllData.studentHomeworkAnswers[index].result=='UNKNOW'||taskAllData.studentHomeworkAnswers[index].result=='INIT'||taskAllData.studentHomeworkAnswers[index].result=='RIGHT'" 
                      class="img2 cuo" src="./cha.png">
                    <img 
                      @click="chooseCuo(index,taskAllData.studentHomeworkAnswers[index].answerId)"
                      v-if="taskAllData.studentHomeworkAnswers[index].result=='WRONG'" 
                      class="img2 cuo" src="./chac.png">
                    <!-- <img @click="chooseDui(index,taskAllData.studentHomeworkAnswers[index].answerId)" class="img1 dui" src="./dui.png">
                    <img @click="chooseCuo(index,taskAllData.studentHomeworkAnswers[index].answerId)" class="img2 cuo" src="./cha.png">                     -->
                  </div>
                  <!-- 没填，不可改，直接为错 -->
                  <div v-if="!taskAllData.studentHomeworkAnswers[index].content" class="choose_result">
                    <img class="img1 dui" src="./dui.png">
                    <img class="img2 cuo" src="./chac.png">
                  </div>
                </div>
              </div>
            </div>
            <!-- 循环结构,订正批改 -->
            <div v-if="taskAllData.correctAnswers" v-for="(item,index) in taskAllData.question.answers" class="c_clum">
              <p class="c_clum_t">第{{index+1}}空</p>
              <div class="c_clum_m">
                <div class="z_a_wrap">
                  <div class="div1">
                    <p class="p1">正确答案 </p>
                    <p class="p2"><span v-html="item.content"></span></p>
                  </div>
                  <div class="choose_result"></div>
                </div>
                <div class="z_a_wrap">
                  <div class="div1">
                    <p class="p1">作答答案 </p>
                    <p class="p2"><span v-html="parseTexMathContent(taskAllData.studentHomeworkAnswers[index].content)"></span></p>
                  </div>
                  <div class="choose_result">
                    <img 
                      @click="chooseDui(index*2,taskAllData.studentHomeworkAnswers[index].answerId)"
                      v-if="taskAllData.studentHomeworkAnswers[index].result=='WRONG'||'INIT'" 
                      class="img1 dui" src="./dui.png">
                    <img 
                      @click="chooseDui(index*2,taskAllData.studentHomeworkAnswers[index].answerId)"
                      v-if="taskAllData.studentHomeworkAnswers[index].result=='RIGHT'" 
                      class="img1 dui" src="./duic.png">
                    <img 
                      @click="chooseCuo(index*2,taskAllData.studentHomeworkAnswers[index].answerId)"
                      v-if="taskAllData.studentHomeworkAnswers[index].result=='RIGHT'||'INIT'" 
                      class="img2 cuo" src="./cha.png">
                    <img 
                      @click="chooseCuo(index*2,taskAllData.studentHomeworkAnswers[index].answerId)"
                      v-if="taskAllData.studentHomeworkAnswers[index].result=='WRONG'" 
                      class="img2 cuo" src="./chac.png">
                  </div>
                </div>
                <div class="z_a_wrap" v-if="taskAllData.correctAnswers[index].content">
                  <div class="div1">
                    <p class="p1">订正答案 </p>
                    <p class="p2"><span v-html="parseTexMathContent(taskAllData.correctAnswers[index].content)"></span></p>
                  </div>
                  <!-- 订正答案可能为空吗？ -->
                  <div class="choose_result">
                    <img 
                      @click="chooseDui(index*2+1,taskAllData.correctAnswers[index].answerId)"
                      v-if="taskAllData.correctAnswers[index].result=='WRONG'||'INIT'" 
                      class="img1 dui" src="./dui.png">
                    <img 
                      @click="chooseDui(index*2+1,taskAllData.correctAnswers[index].answerId)"
                      v-if="taskAllData.correctAnswers[index].result=='RIGHT'" 
                      class="img1 dui" src="./duic.png">
                    <img 
                      @click="chooseCuo(index*2+1,taskAllData.correctAnswers[index].answerId)"
                      v-if="taskAllData.correctAnswers[index].result=='RIGHT'||'INIT'" 
                      class="img2 cuo" src="./cha.png">
                    <img 
                      @click="chooseCuo(index*2+1,taskAllData.correctAnswers[index].answerId)"
                      v-if="taskAllData.correctAnswers[index].result=='WRONG'" 
                      class="img2 cuo" src="./chac.png">
                    <!-- <img @click="chooseDui(index*2+1,taskAllData.correctAnswers[index].answerId)" class="img1 dui" src="./dui.png">
                    <img @click="chooseCuo(index*2+1,taskAllData.correctAnswers[index].answerId)" class="img2 cuo" src="./cha.png">          -->
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          <!-- 填空结构-结束 -->

          <!-- 解答题-开始 -->
          <div v-if="!Tshow" class="compute">
            <!-- 正常批改 -->
            <div v-if="!taskAllData.correctHomeworkQuestion" class="panDignIf">
              <p class="c_top_title">作答答案<span>（点击图片放大）</span></p>
              <div class="answer_list">
                <img 
                  v-if="taskAllData.studentHomeworkQuestion.notationAnswerImgIds.length>0" 
                  v-for="(item,index) in taskAllData.studentHomeworkQuestion.notationAnswerImgs" 
                  @click="imgPop(index,taskAllData.studentHomeworkQuestion.notationAnswerImgs)" 
                  :src="item">
                <!-- 如果没有批注图片 -->
                <img 
                  v-if="taskAllData.studentHomeworkQuestion.notationAnswerImgIds.length==0" 
                  v-for="(item,index) in taskAllData.studentHomeworkQuestion.answerImgs" 
                  @click="imgPop(index,taskAllData.studentHomeworkQuestion.answerImgs)" 
                  :src="item">
                <!-- <img 
                  v-if="taskAllData.studentHomeworkQuestion.notationAnswerImgIds.length==0" 
                  v-for="(item,index) in taskAllData.studentHomeworkQuestion.answerImgs" 
                  @click="imgPop(index)" 
                  :src="item"> -->
              </div>
              <div class="answer_choose">
                <p>批改结果</p>
                <p class="tipMoveJ">选择批改结果</p>
                <ul class="a_wrap">
                  <li ref="opercent100w" @click="jChoose(100,0)" :class="{ 'class-100':taskAllData.studentHomeworkQuestion.rightRate==100}">
                    <img v-if="taskAllData.studentHomeworkQuestion.rightRate==100" ref="opercent100" src="./quanduic.png">
                    <img v-else ref="opercent100" src="./quandui.png">
                  </li>
                  <li ref="opercent80w" @click="jChoose(80,0)" :class="{ 'class-80':taskAllData.studentHomeworkQuestion.rightRate==80}">
                    <div v-if="taskAllData.studentHomeworkQuestion.rightRate==80">
                      <img ref="opercent80" src="./banduic.png">
                      <span ref="opercent80z" class="anChosed">80%</span>
                    </div>
                    <div v-else >
                      <img ref="opercent80" src="./bandui.png">
                      <span ref="opercent80z">80%</span>
                    </div>
                  </li>
                  <li ref="opercent50w" @click="jChoose(50,0)" :class="{ 'class-50':taskAllData.studentHomeworkQuestion.rightRate==50}">
                    <div v-if="taskAllData.studentHomeworkQuestion.rightRate==50">
                      <img ref="opercent50" src="./banduic.png">
                      <span ref="opercent50z" class="anChosed">50%</span>
                    </div>
                    <div v-else >
                      <img ref="opercent50" src="./bandui.png">
                      <span ref="opercent50z">50%</span>
                    </div>
                  </li>
                  <li ref="opercent20w" @click="jChoose(20,0)" :class="{ 'class-20':taskAllData.studentHomeworkQuestion.rightRate==20}">
                    <div v-if="taskAllData.studentHomeworkQuestion.rightRate==20">
                      <img ref="opercent20" src="./banduic.png">
                      <span ref="opercent20z" class="anChosed">20%</span>
                    </div>
                    <div v-else >
                      <img ref="opercent20" src="./bandui.png">
                      <span ref="opercent20z">20%</span>
                    </div>
                  </li>
                  <li ref="opercent0w" @click="jChoose(0,0)" :class="{ 'class-0':taskAllData.studentHomeworkQuestion.rightRate==0}">
                    <img v-if="taskAllData.studentHomeworkQuestion.rightRate==0" ref="opercent0" src="./quancuoc.png">
                    <img v-else ref="opercent0" src="./quancuo.png">
                  </li>
                </ul>
              </div>
            </div>

            <!-- 订正批改 -->
            <div v-if="taskAllData.correctHomeworkQuestion" class="panDignIf">
              <p class="c_top_title">作答答案<span>（点击图片放大）</span></p>
              <!-- 老结果 -->
              <div class="answer_list"> 
                <!-- 如果没有批注图片 -->
                <img 
                  v-for="(item,index) in taskAllData.studentHomeworkQuestion.answerImgs" 
                  @click="imgPop(index,taskAllData.studentHomeworkQuestion.answerImgs)" 
                  :src="item">
              </div>
              <div class="answer_choose">
                <p>批改结果</p>
                <ul class="a_wrap">
                  <li ref="opercent100w" @click="jChoose(100,0)">
                    <img v-if="taskAllData.studentHomeworkQuestion.rightRate==100" ref="opercent100" src="./quanduic.png">
                    <img v-else ref="opercent100" src="./quandui.png">
                  </li>
                  <li ref="opercent80w" @click="jChoose(80,0)">
                    <div v-if="taskAllData.studentHomeworkQuestion.rightRate==80">
                      <img ref="opercent80" src="./banduic.png">
                      <span ref="opercent80z" class="anChosed">80%</span>
                    </div>
                    <div v-else >
                      <img ref="opercent80" src="./bandui.png">
                      <span ref="opercent80z">80%</span>
                    </div>
                  </li>
                  <li ref="opercent50w" @click="jChoose(50,0)">
                    <div v-if="taskAllData.studentHomeworkQuestion.rightRate==50">
                      <img ref="opercent50" src="./banduic.png">
                      <span ref="opercent50z" class="anChosed">50%</span>
                    </div>
                    <div v-else >
                      <img ref="opercent50" src="./bandui.png">
                      <span ref="opercent50z">50%</span>
                    </div>
                  </li>
                  <li ref="opercent20w" @click="jChoose(20,0)">
                    <div v-if="taskAllData.studentHomeworkQuestion.rightRate==20">
                      <img ref="opercent20" src="./banduic.png">
                      <span ref="opercent20z" class="anChosed">20%</span>
                    </div>
                    <div v-else >
                      <img ref="opercent20" src="./bandui.png">
                      <span ref="opercent20z">20%</span>
                    </div>
                  </li>
                  <li ref="opercent0w" @click="jChoose(0,0)">
                    <img v-if="taskAllData.studentHomeworkQuestion.rightRate==0" ref="opercent0" src="./quancuoc.png">
                    <img v-else ref="opercent0" src="./quancuo.png">
                  </li>
                </ul>
              </div>
              <!-- 订正结果 -->
              <p class="c_top_title">订正答案<span>（点击图片放大）</span></p>
              <div class="answer_list">
                <!-- 讲图片数组也带入，放入cookie -->
                <!-- 如果有批注图片 -->
                <img 
                  v-if="taskAllData.correctHomeworkQuestion.notationAnswerImgIds.length>0" 
                  v-for="(item,index) in taskAllData.correctHomeworkQuestion.notationAnswerImgs" 
                  @click="imgPop(index,taskAllData.correctHomeworkQuestion.notationAnswerImgs)" 
                  :src="item[index]">
                  <!-- 如果没有批注图片 -->
                <img 
                  v-if="taskAllData.correctHomeworkQuestion.notationAnswerImgIds.length==0" 
                  v-for="(item,index) in taskAllData.correctHomeworkQuestion.answerImgs" 
                  @click="imgPop(index,taskAllData.correctHomeworkQuestion.answerImgs)" 
                  :src="item[index]">
              </div>
              <div class="answer_choose">
                <p>订正结果</p>
                <ul class="a_wrap">
                  <li ref="percent100w" @click="jChoose(100,1)">
                    <img v-if="taskAllData.studentHomeworkQuestion.rightRate==100" ref="percent100" src="./quanduic.png">
                    <img v-else ref="percent100" src="./quandui.png">
                  </li>
                  <li ref="percent80w" @click="jChoose(80,1)">
                    <div v-if="taskAllData.studentHomeworkQuestion.rightRate==80">
                      <img ref="percent80" src="./banduic.png">
                      <span ref="percent80z" class="anChosed">80%</span>
                    </div>
                    <div v-else >
                      <img ref="percent80" src="./bandui.png">
                      <span ref="percent80z">80%</span>
                    </div>
                  </li>
                  <li ref="percent50w" @click="jChoose(50,1)">
                    <div v-if="taskAllData.studentHomeworkQuestion.rightRate==50">
                      <img ref="percent50" src="./banduic.png">
                      <span ref="percent50z" class="anChosed">50%</span>
                    </div>
                    <div v-else >
                      <img ref="percent50" src="./bandui.png">
                      <span ref="percent50z">50%</span>
                    </div>
                  </li>
                  <li ref="percent20w" @click="jChoose(20,1)">
                    <div v-if="taskAllData.studentHomeworkQuestion.rightRate==20">
                      <img ref="percent20" src="./banduic.png">
                      <span ref="percent20z" class="anChosed">20%</span>
                    </div>
                    <div v-else >
                      <img ref="percent20" src="./bandui.png">
                      <span ref="percent20z">20%</span>
                    </div>
                  </li>
                  <li ref="percent0w" @click="jChoose(0,1)">
                    <img v-if="taskAllData.studentHomeworkQuestion.rightRate==0" ref="percent0" src="./quancuoc.png">
                    <img v-else ref="percent0" src="./quancuo.png">
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 解答题-结束 -->
        </div>
      </div>
      <!-- 竖屏结束 -->
      
      <!-- 弹窗 -->
      <pgTip :message="tipMsg" :count="chooseCount" :imgSrc="chooseImg"></pgTip>
      <confirm ref="confirm" 
          @confirm="certification"
          @confirmStop="stopGet"
          ></confirm>

      <outTimeTip ref="outTimeTip"
        @confirmStop="stopGet"
        ></outTimeTip>

      <loading :message="loadTip"></loading>
    </div>
</template>

<script>
import "mathjax?config=TeX-MML-AM_HTMLorMML";
import loading from "@/base/loading/loading";
import cookie from "js-cookie";
import pgTip from "@/base/pgTip";
import confirm from "@/base/confirm";
import outTimeTip from "@/base/outTimeTip";

export default {
  components: { pgTip, confirm, outTimeTip, loading },
  props: {
    taskD: {
      type: String,
      default: ""
    },
    headHave: {
      // type: Boolean,
      default: true
    },
    taskNum: {
      
    }
  },
  data: function() {
    return {
      min: "00",
      sec: "00",
      allTime: "00",
      taskAllData: {},
      Tshow: true, //填空题显示
      userFd: true, //用户反馈有误
      userFdContent: "",
      teacherFd: false, //批改人反馈题目有误
      teacherFdContent: "",
      computeTitleShow: false, //是否展示解答题题干
      CrossScreen: true, // 横竖屏
      an_arr: ["", ""], //放解答题答案（填空题在计算属性）
      Tian_arr: [],
      jdPicLook: false, //控制图片预览组件显示
      tipMsg: "",
      chooseImg: "",
      chooseCount: "",
      loadTip: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.noEventhing();
      this.Time();
      // 填空题答案数组初始化
      let arr = [];
      // 根据后台数据来写
      if (this.taskAllData.correctAnswers) {
        for (
          let i = 0;
          i < this.taskAllData.studentHomeworkAnswers.length;
          i++
        ) {
          let ob = {};
          let bj = {};
          let ii = 2 * i;
          let iii = 2 * i + 1;
          // 0为错，1为对，2为未批改,3为没有订正答案
          // 没写答案，直接为0，这里判断条件记得改，不然订正时的按钮状态会有问题
          if (!this.taskAllData.studentHomeworkAnswers[ii].content) {
            ob.c = 0;
            ob.id = this.taskAllData.studentHomeworkAnswers[ii].answerId;
          } else if (
            this.taskAllData.studentHomeworkAnswers[ii].result == "WRONG"
          ) {
            ob.c = 0;
            ob.id = this.taskAllData.studentHomeworkAnswers[ii].answerId;
          } else if (
            this.taskAllData.studentHomeworkAnswers[ii].result == "RIGHT"
          ) {
            ob.c = 1;
            ob.id = this.taskAllData.studentHomeworkAnswers[ii].answerId;
          } else {
            ob.c = 2;
            ob.id = this.taskAllData.studentHomeworkAnswers[ii].answerId;
          }
          arr[ii] = ob;

          if (this.taskAllData.correctAnswers[ii].result == "WRONG") {
            ob.c = 0;
            ob.id = this.taskAllData.correctAnswers[ii].answerId;
          } else if (this.taskAllData.correctAnswers[ii].result == "RIGHT") {
            ob.c = 1;
            ob.id = this.taskAllData.correctAnswers[ii].answerId;
          } else if (this.taskAllData.correctAnswers[ii].result == "INIT"||this.taskAllData.correctAnswers[ii].result=="UNKNOW") {
            bj.c = 2;
            bj.id = this.taskAllData.correctAnswers[ii].answerId;
          } else if (!this.taskAllData.correctAnswers[ii].content) {
            bj.c = 3;
            bj.id = this.taskAllData.correctAnswers[ii].answerId;
          }
          arr[iii] = bj;
        }
        this.Tian_arr = arr;
        console.log(arr);
      } else {
        for (
          let i = 0;
          i < this.taskAllData.studentHomeworkAnswers.length;
          i++
        ) {
          let ob = {};
          // 0为错，1为对，2为未批改
          // 没写答案，直接为0，这里判断条件记得改，不然订正时的按钮状态会有问题
          if(this.taskAllData.studentHomeworkAnswers[i].result == "WRONG"){
            ob.c = 0;
            ob.id = "";
          }else if(this.taskAllData.studentHomeworkAnswers[i].result == "RIGHT"){
            ob.c = 1;
            ob.id = "";
          }else if ((this.taskAllData.studentHomeworkAnswers[i].result == "INIT"||this.taskAllData.studentHomeworkAnswers[i].result=="UNKNOW")&&this.taskAllData.studentHomeworkAnswers[i].content) {
            ob.c = 2;
            ob.id = "";
          }else if (!this.taskAllData.studentHomeworkAnswers[i].content) {
            ob.c = 0;
            ob.id = "";
          }
          arr[i] = ob;
        }
        this.Tian_arr = arr;
        console.log(arr);
      }
    });
  },
  created() {
    this.taskAllData = JSON.parse(this.taskD);
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    window.MathJax.Hub.Config({
      showProcessingMessages: false, //关闭js加载过程信息
      messageStyle: "none", //不显示信息
      extensions: ["tex2jax.js"],
      jax: ["input/TeX", "output/HTML-CSS"],
      tex2jax: {
        inlineMath: [["$", "$"]], //行内公式选择$
        displayMath: [["$$", "$$"]], //段内公式选择$$
        skipTags: [
          "script",
          "noscript",
          "style",
          "textarea",
          "pre",
          "code",
          "a"
        ], //避开某些标签
        ignoreClass: "comment-content" //避开含该Class的标签
      },
      "HTML-CSS": {
        availableFonts: ["STIX", "TeX"], //可选字体
        showMathMenu: false //关闭右击菜单显示
      }
    });
    console.log(this.taskAllData);
    if (this.taskAllData.questionAppealcomment) {
      this.userFd = this.taskAllData.questionAppealcomment.appeal;
      this.userFdContent = this.taskAllData.questionAppealcomment.comment;
    }
    if (this.taskAllData.questionError) {
      this.teacherFd = this.taskAllData.questionError.error;
      this.teacherFdContent = this.taskAllData.questionError.comment;
    }
    if (this.taskAllData.question.type === "FILL_BLANK") {
      this.Tshow = true;
    } else {
      this.Tshow = false;
    }
    // 如果是解答，答案放入
    if (this.taskAllData.studentHomeworkQuestion.rightRate) {
      this.an_arr[0] = this.taskAllData.studentHomeworkQuestion.rightRate;
    }
    if (this.taskAllData.correctHomeworkQuestion.rightRate) {
      this.an_arr[0] = this.taskAllData.correctHomeworkQuestion.rightRate;
    }
  },
  methods: {
    chooseDui(num, id) {
      this.$el.querySelectorAll(".dui")[num].src = require("./duic.png");
      this.$el.querySelectorAll(".cuo")[num].src = require("./cha.png");
      this.Tian_arr[num].c = 1;
      this.Tian_arr[num].id = id;
      console.log(this.Tian_arr);
      // 弹窗提示
      let _this = this;
      this.tipMsg = "批改结果";
      this.chooseImg = require("./quanduic.png");
      this.vibration();
      setTimeout(function() {
        _this.tipMsg = "";
        _this.chooseImg = "";
      }, 500);
      this.anAllY();
    },
    chooseCuo(num, id) {
      this.$el.querySelectorAll(".dui")[num].src = require("./dui.png");
      this.$el.querySelectorAll(".cuo")[num].src = require("./chac.png");
      this.Tian_arr[num].c = 0;
      this.Tian_arr[num].id = id;
      console.log(this.Tian_arr);
      // 弹窗提示
      let _this = this;
      this.tipMsg = "批改结果";
      this.chooseImg = require("./quancuoc.png");
      this.vibration();
      setTimeout(function() {
        _this.tipMsg = "";
        _this.chooseImg = "";
      }, 500);
      this.anAllY();
    },
    // 展开题干
    openTitle() {
      this.computeTitleShow = true;
    },
    jChoose(num, inx) {
      if (num == 100) {
        this.j100(inx);
        // 弹窗提示
        let _this = this;
        this.tipMsg = "批改结果";
        this.chooseCount = "";
        this.chooseImg = require("./quanduic.png");
        setTimeout(function() {
          _this.tipMsg = "";
          _this.chooseImg = "";
          this.chooseCount = "";
        }, 500);
        this.an_arr[inx] = "100";
      } else if (num == 80) {
        this.j80(inx);
        // 弹窗提示
        let _this = this;
        this.tipMsg = "批改结果";
        this.chooseCount = "80%";
        this.chooseImg = require("./banduic.png");
        setTimeout(function() {
          _this.tipMsg = "";
          _this.chooseImg = "";
          this.chooseCount = "";
        }, 500);
        this.an_arr[inx] = "80";
      } else if (num == 50) {
        this.j50(inx);
        // 弹窗提示
        let _this = this;
        this.tipMsg = "批改结果";
        this.chooseCount = "50%";
        this.chooseImg = require("./banduic.png");
        setTimeout(function() {
          _this.tipMsg = "";
          _this.chooseImg = "";
          this.chooseCount = "";
        }, 500);
        this.an_arr[inx] = "50";
      } else if (num == 20) {
        this.j20(inx);
        // 弹窗提示
        let _this = this;
        this.tipMsg = "批改结果";
        this.chooseCount = "20%";
        this.chooseImg = require("./banduic.png");
        setTimeout(function() {
          _this.tipMsg = "";
          _this.chooseImg = "";
          this.chooseCount = "";
        }, 500);
        this.an_arr[inx] = "20";
      } else if (num == 0) {
        this.j0(inx);
        // 弹窗提示
        let _this = this;
        this.tipMsg = "批改结果";
        this.chooseCount = "";
        this.chooseImg = require("./quancuoc.png");
        setTimeout(function() {
          _this.tipMsg = "";
          _this.chooseImg = "";
          this.chooseCount = "";
        }, 500);
        this.an_arr[inx] = "0";
      }
      this.vibration();
      console.log(this.an_arr);
      this.$emit("anAll", JSON.stringify(this.an_arr));
    },
    imgPop(num,imgArr) {
      cookie.set("imgIndex", num);
      cookie.set("JDimgArr", JSON.stringify(imgArr));
      this.$emit("ImgPop");
    },
    Time(inx) {
      let _this = this;
      let count = 0;
      let Off = true;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        count++;
        if (_this.Tshow) {
          if (count >= 120 && Off) {
            // Off = false;
            // console.log("填空题，答题时间大于120");
            // _this.$refs.outTimeTip.show();
            // _this.$refs.outTimeTip.theTime();
          } else if (count > 150) {
            // console.log("填空题时间到");
            // clearInterval(_this.timer);
            // _this.stopGet();
          }
        } else {
          if (count >= 300 && Off) {
            // Off = false;
            // console.log("解答题，答题时间大于300");
            // _this.$refs.outTimeTip.show();
            // _this.$refs.outTimeTip.theTime();
          } else if (count > 330) {
            // console.log("解答题时间到");
            // clearInterval(_this.timer);
            // _this.stopGet();
          }
        }
        this.allTime = count;
        this.min = Math.floor(count / 60) % 60;
        this.sec = count % 60;
        if (this.min < 10) {
          this.min = "0" + this.min;
        }
        if (this.sec < 10) {
          this.sec = "0" + this.sec;
        }
      }, 1000);
    },
    j100(inx) {
      if (inx == 1) {
        this.$refs.percent100.src = require("./quanduic.png");
        this.$refs.percent100w.style.borderColor = "#00BB9D";
        this.$refs.percent100w.style.backgroundColor = "#D9F5F0";
        this.$refs.percent80.src = require("./bandui.png");
        this.$refs.percent80w.style.borderColor = "#fff";
        this.$refs.percent80w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent50.src = require("./bandui.png");
        this.$refs.percent50w.style.borderColor = "#fff";
        this.$refs.percent50w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent20.src = require("./bandui.png");
        this.$refs.percent20w.style.borderColor = "#fff";
        this.$refs.percent20w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent0.src = require("./quancuo.png");
        this.$refs.percent0w.style.borderColor = "#fff";
        this.$refs.percent0w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent20z.style.color = "#C9D2DA";
        this.$refs.percent50z.style.color = "#C9D2DA";
        this.$refs.percent80z.style.color = "#C9D2DA";
      } else {
        this.$refs.opercent100.src = require("./quanduic.png");
        this.$refs.opercent100w.style.borderColor = "#00BB9D";
        this.$refs.opercent100w.style.backgroundColor = "#D9F5F0";
        this.$refs.opercent80.src = require("./bandui.png");
        this.$refs.opercent80w.style.borderColor = "#fff";
        this.$refs.opercent80w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent50.src = require("./bandui.png");
        this.$refs.opercent50w.style.borderColor = "#fff";
        this.$refs.opercent50w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent20.src = require("./bandui.png");
        this.$refs.opercent20w.style.borderColor = "#fff";
        this.$refs.opercent20w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent0.src = require("./quancuo.png");
        this.$refs.opercent0w.style.borderColor = "#fff";
        this.$refs.opercent0w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent20z.style.color = "#C9D2DA";
        this.$refs.opercent50z.style.color = "#C9D2DA";
        this.$refs.opercent80z.style.color = "#C9D2DA";
      }
    },
    j80(inx) {
      if (inx == 1) {
        this.$refs.percent100.src = require("./quandui.png");
        this.$refs.percent100w.style.borderColor = "#fff";
        this.$refs.percent100w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent80.src = require("./banduic.png");
        this.$refs.percent80w.style.borderColor = "#F8C438";
        this.$refs.percent80z.style.color = "#F8C438";
        this.$refs.percent50z.style.color = "#C9D2DA";
        this.$refs.percent20z.style.color = "#C9D2DA";
        this.$refs.percent80w.style.backgroundColor = "#fef6e1";
        this.$refs.percent50.src = require("./bandui.png");
        this.$refs.percent50w.style.borderColor = "#fff";
        this.$refs.percent50w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent20.src = require("./bandui.png");
        this.$refs.percent20w.style.borderColor = "#fff";
        this.$refs.percent20w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent0.src = require("./quancuo.png");
        this.$refs.percent0w.style.borderColor = "#fff";
        this.$refs.percent0w.style.backgroundColor = "#EEF2F6";
      } else {
        this.$refs.opercent100.src = require("./quandui.png");
        this.$refs.opercent100w.style.borderColor = "#fff";
        this.$refs.opercent100w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent80.src = require("./banduic.png");
        this.$refs.opercent80w.style.borderColor = "#F8C438";
        this.$refs.opercent80z.style.color = "#F8C438";
        this.$refs.opercent50z.style.color = "#C9D2DA";
        this.$refs.opercent20z.style.color = "#C9D2DA";
        this.$refs.opercent80w.style.backgroundColor = "#fef6e1";
        this.$refs.opercent50.src = require("./bandui.png");
        this.$refs.opercent50w.style.borderColor = "#fff";
        this.$refs.opercent50w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent20.src = require("./bandui.png");
        this.$refs.opercent20w.style.borderColor = "#fff";
        this.$refs.opercent20w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent0.src = require("./quancuo.png");
        this.$refs.opercent0w.style.borderColor = "#fff";
        this.$refs.opercent0w.style.backgroundColor = "#EEF2F6";
      }
    },
    j50(inx) {
      if (inx == 1) {
        this.$refs.percent100.src = require("./quandui.png");
        this.$refs.percent100w.style.borderColor = "#fff";
        this.$refs.percent100w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent50.src = require("./banduic.png");
        this.$refs.percent50w.style.borderColor = "#F8C438";
        this.$refs.percent50w.style.backgroundColor = "#fef6e1";
        this.$refs.percent80.src = require("./bandui.png");
        this.$refs.percent80w.style.borderColor = "#fff";
        this.$refs.percent50z.style.color = "#F8C438";
        this.$refs.percent20z.style.color = "#C9D2DA";
        this.$refs.percent80z.style.color = "#C9D2DA";
        this.$refs.percent80w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent20.src = require("./bandui.png");
        this.$refs.percent20w.style.borderColor = "#fff";
        this.$refs.percent20w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent0.src = require("./quancuo.png");
        this.$refs.percent0w.style.borderColor = "#fff";
        this.$refs.percent0w.style.backgroundColor = "#EEF2F6";
      } else {
        this.$refs.opercent100.src = require("./quandui.png");
        this.$refs.opercent100w.style.borderColor = "#fff";
        this.$refs.opercent100w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent50.src = require("./banduic.png");
        this.$refs.opercent50w.style.borderColor = "#F8C438";
        this.$refs.opercent50w.style.backgroundColor = "#fef6e1";
        this.$refs.opercent80.src = require("./bandui.png");
        this.$refs.opercent80w.style.borderColor = "#fff";
        this.$refs.opercent50z.style.color = "#F8C438";
        this.$refs.opercent20z.style.color = "#C9D2DA";
        this.$refs.opercent80z.style.color = "#C9D2DA";
        this.$refs.opercent80w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent20.src = require("./bandui.png");
        this.$refs.opercent20w.style.borderColor = "#fff";
        this.$refs.opercent20w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent0.src = require("./quancuo.png");
        this.$refs.opercent0w.style.borderColor = "#fff";
        this.$refs.opercent0w.style.backgroundColor = "#EEF2F6";
      }
    },
    j20(inx) {
      if (inx == 1) {
        this.$refs.percent100.src = require("./quandui.png");
        this.$refs.percent100w.style.borderColor = "#fff";
        this.$refs.percent100w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent20.src = require("./banduic.png");
        this.$refs.percent20w.style.borderColor = "#F8C438";
        this.$refs.percent20w.style.backgroundColor = "#fef6e1";
        this.$refs.percent50.src = require("./bandui.png");
        this.$refs.percent50w.style.borderColor = "#fff";
        this.$refs.percent20z.style.color = "#F8C438";
        this.$refs.percent80z.style.color = "#C9D2DA";
        this.$refs.percent50z.style.color = "#C9D2DA";
        this.$refs.percent50w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent80.src = require("./bandui.png");
        this.$refs.percent80w.style.borderColor = "#fff";
        this.$refs.percent80w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent0.src = require("./quancuo.png");
        this.$refs.percent0w.style.borderColor = "#fff";
        this.$refs.percent0w.style.backgroundColor = "#EEF2F6";
      } else {
        this.$refs.opercent100.src = require("./quandui.png");
        this.$refs.opercent100w.style.borderColor = "#fff";
        this.$refs.opercent100w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent20.src = require("./banduic.png");
        this.$refs.opercent20w.style.borderColor = "#F8C438";
        this.$refs.opercent20w.style.backgroundColor = "#fef6e1";
        this.$refs.opercent50.src = require("./bandui.png");
        this.$refs.opercent50w.style.borderColor = "#fff";
        this.$refs.opercent20z.style.color = "#F8C438";
        this.$refs.opercent80z.style.color = "#C9D2DA";
        this.$refs.opercent50z.style.color = "#C9D2DA";
        this.$refs.opercent50w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent80.src = require("./bandui.png");
        this.$refs.opercent80w.style.borderColor = "#fff";
        this.$refs.opercent80w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent0.src = require("./quancuo.png");
        this.$refs.opercent0w.style.borderColor = "#fff";
        this.$refs.opercent0w.style.backgroundColor = "#EEF2F6";
      }
    },
    j0(inx) {
      if (inx == 1) {
        this.$refs.percent100.src = require("./quandui.png");
        this.$refs.percent100w.style.borderColor = "#fff";
        this.$refs.percent100w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent80.src = require("./bandui.png");
        this.$refs.percent80w.style.borderColor = "#fff";
        this.$refs.percent80w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent50.src = require("./bandui.png");
        this.$refs.percent50w.style.borderColor = "#fff";
        this.$refs.percent50w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent20.src = require("./bandui.png");
        this.$refs.percent20w.style.borderColor = "#fff";
        this.$refs.percent20w.style.backgroundColor = "#EEF2F6";
        this.$refs.percent0.src = require("./quancuoc.png");
        this.$refs.percent0w.style.borderColor = "#F14B40";
        this.$refs.percent0w.style.backgroundColor = "#fde4e3";
        this.$refs.percent20z.style.color = "#C9D2DA";
        this.$refs.percent50z.style.color = "#C9D2DA";
        this.$refs.percent80z.style.color = "#C9D2DA";
      } else {
        this.$refs.opercent100.src = require("./quandui.png");
        this.$refs.opercent100w.style.borderColor = "#fff";
        this.$refs.opercent100w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent80.src = require("./bandui.png");
        this.$refs.opercent80w.style.borderColor = "#fff";
        this.$refs.opercent80w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent50.src = require("./bandui.png");
        this.$refs.opercent50w.style.borderColor = "#fff";
        this.$refs.opercent50w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent20.src = require("./bandui.png");
        this.$refs.opercent20w.style.borderColor = "#fff";
        this.$refs.opercent20w.style.backgroundColor = "#EEF2F6";
        this.$refs.opercent0.src = require("./quancuoc.png");
        this.$refs.opercent0w.style.borderColor = "#F14B40";
        this.$refs.opercent0w.style.backgroundColor = "#fde4e3";
        this.$refs.opercent20z.style.color = "#C9D2DA";
        this.$refs.opercent50z.style.color = "#C9D2DA";
        this.$refs.opercent80z.style.color = "#C9D2DA";
      }
    },
    anAllY() {
      let an_all = true;
      for (let i = 0; i < this.Tian_arr.length; i++) {
        if (this.Tian_arr[i].c == 2) {
          an_all = false;
        }
      }
      if (an_all) {
        this.$emit("anAll", JSON.stringify(this.Tian_arr));
      }
    },
    certification() {
      this.noEventhing();
    },
    stopGet() {
      // 30s没操作，停止接题,后台提交后在emit事件

      this.$emit("tOStop");
    },
    vibration() {
      navigator.vibrate =
        navigator.vibrate ||
        navigator.webkitVibrate ||
        navigator.mozVibrate ||
        navigator.msVibrate;

      if (navigator.vibrate) {
        // 支持
        console.log("支持设备震动！");
        navigator.vibrate([500, 300]);
      } else {
        console.log("不支持设备震动！");
      }
    },
    noEventhing() {
      // var _this = this;
      // (function($) {
      //   let funObj = {
      //     timeUserFun: "timeUserFun"
      //   };
      //   $[funObj.timeUserFun] = function(time) {
      //     var time = time || 30;
      //     var userTime = time;
      //     var objTime = {
      //       init: 0,
      //       time: function() {
      //         objTime.init += 1;
      //         if (objTime.init == userTime) {
      //           // 用户到达未操作事件 做一些处理
      //           _this.$refs.confirm.show();
      //           _this.$refs.confirm.theTime();
      //         }
      //       },
      //       eventFun: function() {
      //         clearInterval(testUser);
      //         objTime.init = 0;
      //         testUser = setInterval(objTime.time, 1000);
      //       }
      //     };
      //     var testUser = setInterval(objTime.time, 1000);
      //     var body = document.querySelector("html");
      //     body.addEventListener("click", objTime.eventFun);
      //     body.addEventListener("scroll", objTime.eventFun);
      //     body.addEventListener("keydown", objTime.eventFun);
      //     body.addEventListener("mousemove", objTime.eventFun);
      //     body.addEventListener("mousewheel", objTime.eventFun);
      //     body.addEventListener("touchstart", objTime.eventFun);
      //     body.addEventListener("touchmove", objTime.eventFun);
      //     body.addEventListener("touchend", objTime.eventFun);
      //   };
      // })(window);

      // // 直接调用 参数代表分钟数,可以有一位小数;
      // timeUserFun(30);
    },
    // 渲染公式
    parseTexMathContent: function(content) {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      var txt = content.replace(
        /<ux-blank sequence=\d+><\/ux-blank>/g,
        "__________"
      );
      txt = txt.replace(
        /<img[^>]+class="insert_fill_txt"[\s\S]*?>/g,
        "__________"
      );
      txt = txt.replace(/<ux-mth>([^"]+?)<\/ux-mth>/g, function(
        match,
        capture
      ) {
        capture = capture.replace(/</g, "&lt;");
        capture = capture.replace(/>/g, "&gt;");
        capture = capture.replace(/\\$/gi, "");
        capture = capture.replace(/\\upsi lon$/gi, "\\upsilon");
        return "$" + capture + "$";
      });
      txt = txt.replace(/<table[\s\S]*?>([\s\S]*?)<\/table>/g, function(
        match,
        capture
      ) {
        return (
          '<table class="table-bordered" style="width:100%">' +
          capture.replace(/\n/g, "") +
          "</table>"
        );
      });
      txt = txt.replace(/\\because/g, "因为<br />");
      txt = txt.replace(/\\therefore/g, "所以<br />");
      txt = txt.replace(/\\varnothing/g, "\\emptyset");
      return txt;
    }
  },
  destroyed() {
    this.timer = null;
    clearInterval(this.timer);
  },
  watch: {}
};
</script>

<style scoped>
.mainWrap {
  width: 100%;
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 100px;
}
.noHaveheader {
  top: 180px;
}
.CrossScreen {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #e9e9eb;
}
.jianx {
  height: 2%;
  width: 100%;
  position: absolute;
  top: 38%;
  left: 0;
  right: 0;
  background: #e9e9eb;
}
.mainTop {
  width: 100%;
  height: 38%;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
/* 填空，解答top公共 */
.mainTop .CountDown {
  height: 100px;
  width: 100;
  line-height: 100px;
  /* display: flex;
  display: -webkit-flex; */
}
.CountDown .c-itle {
  float: left;
  width: 132px;
  text-align: center;
  font-size: 30px;
  color: rgba(56, 61, 72, 1);
}
CountDown .c-itle {
  float: left;
  width: 200px;
  text-align: left;
  padding-left: 20px;
  font-size: 30px;
  color: rgba(56, 61, 72, 1);
}
.CountDown .nowNum {
  float: left;
  width: 270px;
  height: 60px;
  margin-top: 20px;
  margin-left: 80px;
  line-height: 60px;
  text-align: center;
  font-size: 24px;
  color: #ffffff;
  background: url("./nowNumbg.png") no-repeat;
  background-size: cover;
}
.CountDown .c-div {
  /* flex: 1; */
  float: right;
  padding-right: 20px;
  text-align: right;
  font-size: 30px;
  color: rgba(56, 61, 72, 1);
}
.t-info {
  padding: 0 20px;
  font-size: 34px;
  color: rgba(56, 61, 72, 1);
  line-height: 56px;
}
.feedback {
  /* display: flex;
  display: -webkit-flex; */
  margin: 0 auto;
  margin-bottom: 20px;
  width: 690px;
  background: #fde4e3;
  padding: 10px;
  border-radius: 4px;
}
.feedback img {
  width: 24px;
  height: 24px;
  margin-top: 5px;
  margin-right: 4px;
  float: left;
  margin-bottom: 30px;
}
.feedback p {
  color: #fa632e;
  font-size: 24px;
  line-height: 32px;
}

/* 解答top */
.mainTop .openTitle {
  color: #007aff;
  font-size: 30px;
  margin-top: 0;
  margin-left: 20px;
}

.manBtm {
  width: 100%;
  height: 60%;
  background: #fff;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.topCommon {
  height: auto;
  width: 710px;
  margin: 0 auto;
  overflow: hidden;
  font-size: 34px;
  color: #383d48;
  margin-top: 20px;
  margin-bottom: 20px;
}
.topCommon .p1 {
  font-size: 30px;
  margin-top: 8px;
  width: 70px;
  height: auto;
  float: left;
  color: #383d48;
  line-height: 46px;
}
.rightAnswer .p1 {
  margin-top: -8px;
}
.topCommon .p2 {
  float: right;
  width: 600px;
  height: auto;
  color: #383d48;
  line-height: 56px;
}

/* 填空-下 */
.completionBtm .c_clum {
  height: auto;
  width: 710px;
  margin: 0 auto;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}
.completionBtm .c_clum .c_clum_t {
  height: 80px;
  font-size: 24px;
  color: rgba(42, 183, 247, 1);
  line-height: 65px;
}
.completionBtm .z_a_wrap {
  display: flex;
  display: -webkit-flex;
  padding-bottom: 10px;
}
.completionBtm .z_a_wrap .div1 {
  width: 490px;
  height: auto;
  display: flex;
  display: -webkit-flex;
}
.completionBtm .z_a_wrap .div1 .p1 {
  width: 130px;
  color: #383d48;
  line-height: 50px;
  font-size: 28px;
}
.completionBtm .z_a_wrap .div1 .p2 {
  display: inline;
  flex: 1;
  width: 400px;
  overflow: auto; 
  -ms-flex: 1;
  font-size: 28px;
  color: #383d48;
  line-height: 45px;
}
/* .completionBtm .z_a_wrap .div1 .p2::-webkit-scrollbar {display:none}  */
.completionBtm .z_a_wrap .div1 .p2 span {
  padding-bottom: 3px;
  border-bottom: 1px solid #383d48;
}
.completionBtm .z_a_wrap .choose_result {
  -ms-flex: 1;
  flex: 1;
  position: relative;
}

.completionBtm .choose_result img {
  width: 80px;
  height: 60px;
  margin-left: 20px;
  float: left;
}
.completionBtm .choose_result .img1 {
  margin-left: 30px;
}

.completionBtm .z_a_wrap .tipMove {
  position: absolute;
  right: 36px;
  top: -86px;
  width: 230px;
  height: 75px;
  line-height: 65px;
  text-align: center;
  background: url("./moveTip.png") no-repeat;
  background-size: cover;
  font-size: 24px;
  color: #ffffff;
  animation: scal 2.5s 0s infinite;
}

/* 解答题 */
.compute .answer_choose {
  position: relative;
  margin-top: 10px;
}
.compute .answer_choose .a_wrap .class-0{
  border-color: #F14B40;
  background-color:#fde4e3; 
}
.compute .answer_choose .a_wrap .class-20{
  border-color: #F8C438;
  background-color:#fef6e1; 
}
.compute .answer_choose .a_wrap .class-50{
  border-color: #F8C438;
  background-color:#fef6e1; 
}
.compute .answer_choose .a_wrap .class-80{
  border-color: #F8C438;
  background-color:#fef6e1; 
}
.compute .answer_choose .a_wrap .class-100{
  border-color: #00BB9D;
  background-color:#D9F5F0; 
}

.compute .c_top_title {
  display: inline-block;
  width: 730px;
  height: 80px;
  line-height: 80px;
  padding-left: 20px;
  font-size: 30px;
  color: #383d48;
  text-align: left;
}
.compute .c_top_title span {
  font-size: 24px;
  color: #839096;
}
.compute .answer_list {
  height: auto;
  width: 710px;
  margin: 0 auto;
}
.compute .answer_list img {
  width: 710px;
  height: auto;
  margin-bottom: 20px;
}
.compute .answer_choose p {
  width: 710px;
  margin: 0 auto;
  height: 60px;
  line-height: 60px;
  color: #383d48;
  font-size: 30px;
}
.compute .answer_choose .a_wrap {
  width: 710px;
  margin: 0 auto;
  height: 145px;
}
.compute .answer_choose .a_wrap li {
  width: 200px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #c9d2da;
  margin-right: 20px;
  margin-bottom: 20px;
  float: left;
  font-size: 30px;
  background: rgba(238, 242, 246, 1);
  border-radius: 10px;
  border: 2px solid #fff;
}
.compute .answer_choose .a_wrap li img {
  width: 36px;
  height: 36px;
  vertical-align: middle;
}
.compute .answer_choose .a_wrap li .anChosed {
  color: rgb(248, 196, 56);
}

.compute .answer_choose .tipMoveJ {
  position: absolute;
  left: 240px;
  top: -20px;
  width: 230px;
  height: 75px;
  line-height: 65px;
  text-align: center;
  background: url("./moveTip.png") no-repeat;
  background-size: cover;
  font-size: 24px;
  color: #ffffff;
  animation: scal 2.5s 0s infinite;
}

::-webkit-scrollbar {
  width: 0;
}

@keyframes scal {
  0% {
    transform: scale(1, 1);
  }
  5% {
    transform: scale(1.02, 1.02);
  }
  10% {
    transform: scale(1.04, 1.04);
  }
  15% {
    transform: scale(1.06, 1.06);
  }
  20% {
    transform: scale(1.08, 1.08);
  }
  25% {
    transform: scale(1.1, 1.1);
  }
  30% {
    transform: scale(1.08, 1.08);
  }
  35% {
    transform: scale(1.06, 1.06);
  }
  40% {
    transform: scale(1.04, 1.04);
  }
  45% {
    transform: scale(1.02, 1.02);
  }
  50% {
    transform: scale(1, 1);
  }

  55% {
    transform: scale(0.98, 0.98);
  }
  60% {
    transform: scale(0.96, 0.96);
  }
  65% {
    transform: scale(0.94, 0.94);
  }
  70% {
    transform: scale(0.92, 0.92);
  }
  75% {
    transform: scale(0.9, 0.9);
  }
  80% {
    transform: scale(0.92, 0.92);
  }
  85% {
    transform: scale(0.94, 0.94);
  }
  90% {
    transform: scale(0.96, 0.96);
  }
  95% {
    transform: scale(0.98, 0.98);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
