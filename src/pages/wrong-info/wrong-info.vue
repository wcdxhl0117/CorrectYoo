<template>
  <div id="allWrapper">
      <div class="top">
          <p>扣费时间：<span>{{thisDate}}</span></p>
          <p>批错数量：<span>{{answerNum + fillNum}}题（{{fillNum}}填空+{{answerNum}}解答）</span></p>
          <p>扣费：<span>{{deduction}}</span></p>
      </div>
      <!-- 主内容 -->
      <div class="theContent">
          <div class="loop" v-for="item in arrTi">
              <!-- 填空结构 -->
              <div v-if="item.question.type=='FILL_BLANK'" class="completion">
                  <div class="date_wrap">
                    <p class="date_left">批改日期：{{timestampToTime(item.studentHomeworkQuestion.correctAt)}}</p>
                    <p class="date_right" @click="lookInfo(item.question.content)">查看题干</p>
                  </div>
                  <!-- 空循环结构 -->
                  <div class="kong" v-for="(kong,index) in item.question.answers">
                      <p class="k_p1">第{{index + 1}}空</p>
                      <div class="k_content">
                          <div class="k_con">
                              <span class="c_con_left">正确答案</span>
                              <span class="c_con_right" v-html="parseTexMathContent(kong.content)"></span>
                          </div>
                          <div class="k_con">
                              <span class="c_con_left">作答答案</span>
                              <span class="c_con_right" v-html="parseTexMathContent(item.studentHomeworkAnswers[index].content)"></span>
                          </div>
                          <!-- 老数据没有批改记录数据，不展示批改结果对比 -->
                          <div class="k_con" v-if="item.myResults">
                              <span class="c_con_left">我的批改结果</span>
                              <span class="c_con_right">
                                  <img v-if="item.myResults[index]==='RIGHT'" src="./quanduic.png" alt="">
                                  <img v-if="item.myResults[index]==='WRONG'" src="./quancuoc.png" alt="">
                              </span>
                          </div>
                          <div class="k_con no_btm_border" v-if="item.otherResults">
                              <span class="c_con_left">二次批改结果</span>
                              <span class="c_con_right">
                                  <img v-if="item.otherResults[index]==='RIGHT'" src="./quanduic.png" alt="">
                                  <img v-if="item.otherResults[index]==='WRONG'" src="./quancuoc.png" alt="">
                              </span>
                          </div>
                      </div>
                  </div>
              </div>
              <!-- 解答题结构 -->
              <div v-if="item.question.type=='QUESTION_ANSWERING'" class="answer">
                  <div class="date_wrap">
                    <p class="date_left">批改日期：{{timestampToTime(item.studentHomeworkQuestion.correctAt)}}</p>
                    <p class="date_right" @click="lookInfo(item.question.content)">查看题干</p>
                  </div>
                  <div class="rightA">
                      <p class="rp1">正确答案</p>
                      <p class="rp2" v-html="parseTexMathContent(item.question.answers[0].content)"></p>
                  </div>
                  <div class="stuAn">
                      <p>作答答案</p>
                      <div v-for="img in item.studentHomeworkQuestion.answerImgs">
                        <img :src="img" alt="">
                      </div>
                  </div>
                  <div class="k_content" v-if="item.otherRightRate">
                    <div class="k_con">
                        <span class="c_con_left">我的批改结果</span>
                        <span class="c_con_right">
                            <img v-if="item.myRightRate==100" src="./quanduic.png" alt="">
                            <img v-if="item.myRightRate==0" src="./quancuoc.png" alt="">
                            <img v-if="item.myRightRate!=100&&item.myRightRate!=0" src="./banduic.png" alt="">
                        </span>
                    </div>
                    <div class="k_con no_btm_border" v-if="item.otherRightRate">
                        <span class="c_con_left">二次批改结果</span>
                        <span class="c_con_right">
                            <img v-if="item.otherRightRate==100" src="./quanduic.png" alt="">
                            <img v-if="item.otherRightRate==0" src="./quancuoc.png" alt="">
                            <img v-if="item.otherRightRate!=100&&item.otherRightRate!=0" src="./banduic.png" alt="">
                        </span>
                    </div>
                </div>
                  
              </div>
          </div>
      </div>
      <div class="theContent">
          <div class="loop" v-for="item in adminTi">
              <!-- 管理员抽查 -->
              <div class="checkUp">
                  <div class="date_wrap">
                    <p class="date_left">批改日期：{{timestampToTime(item.correctAt)}}</p>
                    <p class="date_right"></p>
                  </div>
                  <div class="infos">
                      <p>类型：{{item.type}}</p>
                      <p>原因：{{item.reason}}</p>
                      <p>描述：{{item.description}}</p>
                      <p>截图：</p>
                  </div>
                  <div class="imgs">
                    <!-- tranImg -->
                    <div>
                        <img class="tImg" :src="item.imageUrl" alt="">
                    </div>
                  </div>
              </div>
          </div>
      </div>
      <!-- 题干弹窗 -->
      <div v-if="showPop" class="btmPop">
          <div class="contentWrap">
              <div class="content">
                  <img class="closePop" @click="closePop" src="./close.png">
                  <p class="topHead">题干</p>
                  <p class="tCon" v-html="nowTg"></p>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  components: {},
  name: "wrong-info",
  data: function() {
    return {
      showPop: false,
      nowTg: "",
      thisDate: "",
      fillNum: 0,
      answerNum: 0,
      deduction: 0,
      arrTi: [], // 批错题目数组
      adminTi: [], // 管理员扣费数组
      myRe: [], // 我的批改结果数组
      otherRe: [] // 其他人批改结果数组 
    };
  },
  beforeCreate: function() {
    document
      .getElementsByTagName("body")[0]
      .setAttribute("style", "background-color:#e9e9eb");
  },
  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      vm.$client.system("documentTitle", {
        title: "详情"
      });
    });
  },
  created() {},
  mounted() {
    if (this.$route.query.d) {
      console.log(this.$route.query.d);
      let dateNun = parseInt(this.$route.query.d);
      // 获取批错信息
      this.$http
        .post(
          "/ycorrect/user/center/myErrorDetail",
          {},
          {
            params: {
              date: dateNun
            }
          }
        )
        .then(
          response => {
            console.log(response.data);
            if (response.data.ret_code == 0) {
              let res = response.data.ret;
              this.thisDate = this.timestampToTime(parseInt(res.date));
              this.fillNum = res.fills;
              this.answerNum = res.answers;
              this.deduction = res.errorFee;
              this.arrTi = res.errorQuestions;
              this.adminTi = res.manualFees;
            //   修复操作后公示才解析的bug
              window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            } else {
              this.$store.dispatch("ERROR_MESSAGE", response.data.ret_msg);
            }
          },
          ({ response }) => {
            this.loadTip = "";
            this.$store.dispatch("ERROR_MESSAGE", "网络异常");
          }
        );
    }
  },
  methods: {
    lookInfo(info) {
      this.showPop = true;
      this.nowTg = this.parseTexMathContent(info);
    },
    closePop() {
      this.showPop = false;
      this.nowTg = "";
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
      // return Y+M+D+h+m+s;
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
      txt = txt.replace(/\n/g, "<br/>");
      return txt;
    },
    timestampToTime(timestamp) {
        let date = new Date(timestamp) //如果timestamp为10位需要乘1000
        let Y = date.getFullYear() + '-'
        let M =
        (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-'
        let D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
        let h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        let m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
        let s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return Y + M + D
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
  overflow-y: auto;
  margin: 0 auto;
  background: #e9e9eb;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  -webkit-overflow-scrolling: touch;
}
#allWrapper::-webkit-scrollbar{
  display: none;
}
.top{
    height: 200px;
    padding: 20px;
    padding-bottom: 0;
    background: #ffffff;
    margin-bottom: 20px;
}
.top p{
    line-height: 60px;
    height: 60px;
    font-size: 30px;
    color: #383D48;
    font-weight: 900;
}
.theContent{
    height: auto;
}
.loop{
    height: auto;
    background: #ffffff;
    padding: 20px;
    margin-bottom:20px;
}
.completion,.answer,.checkUp{
    width: 100%;
    height: auto;
}
.date_wrap{
    height: 80px;
    line-height: 80px;
    width: 100%;
    border-bottom: 1px solid #E5E5E5;
    font-size: 30px;
    color: #383D48;
}
.date_wrap .date_left{
    float: left;
    font-weight: 900;
}
.date_wrap .date_right{
    float: right;
    font-size: 24px;
    color: #007AFF;
}
.kong{
    height: auto;
    width: 100%;
}
.kong .k_p1{
    height: 80px;
    line-height: 80px;
    color: #383D48;
    font-size: 24px;
}
.k_content{
    height: auto;
    border: 1px solid #D3DDE5;
}
.k_con{
    font-size: 24px;
    color: #383D48;
    border-bottom: 1px solid #D3DDE5;
    position: relative;
    display: inline-block;
	vertical-align: bottom;
    width: 100%;
    /* 圣杯核心 */
    overflow: hidden;
}
.k_con .c_con_left{
    display: block;
    float: left;
    background: #EEF2F6;
    /* border-bottom: 1px solid #D3DDE5; */
    text-align: center;
    width: 180px;
    height: auto;
    line-height: 90px;
    min-height: 90px;
    /* /* 圣杯核心 */
    margin-bottom: -10000px;
    padding-bottom: 10000px;
}
.k_con .c_con_right{
    display: block;
    font-size: 34px;
    color: #383D48;
    float: left;
    padding-left: 20px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 480px;
    min-height: 90px;
    line-height: 90px;
    overflow-x: auto;
    height: auto;
    /* 圣杯核心 */
    margin-bottom: -10000px;
    padding-bottom: 10000px;
}
.k_con .c_con_right img{
    width: 48px;
    height: 48px;
    position: absolute;
    top: 20px;
    left: 206px;
}
.no_btm_border{
    border: none !important;
}
.answer .rightA{
    border-bottom: 1px solid #E5E5E5;
}
.answer .rightA .rp1{
     height: 70px;
     line-height: 70px;
     font-size: 24px;
     color: #383D48;
}
.answer .rightA .rp2{
     height: auto;
     line-height: 36px;
     font-size: 24px;
     color: #383D48;
}
.answer .stuAn p{
    height: 80px;
    line-height: 80px;
    font-size: 24px;
    color: #383D48;
}
.answer .stuAn div{
    margin-bottom: 20px;
    width: 100%;
    height: auto;
}
.answer .stuAn img{
    width: 100%;
    height: auto;
}
.checkUp .infos{
    height: auto;
    padding: 10px 0;
}
.checkUp .infos p{
    line-height: 46px;
    font-size: 24px;
    color: #383D48;
}
.checkUp .imgs{
    width: 100%;
    height: auto;
}
.checkUp .imgs .tImg{
    width: 100%;
    height: auto;
    margin-bottom: 20px;
}
.btmPop{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4)
}
.btmPop .contentWrap{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
}
.btmPop .content{
    width: 750px;
    max-width: 750px;
    height: 700px;
    margin: 0 auto;
    background: #ffffff;
    position: relative;
}
.btmPop .content .closePop{
    position: absolute;
    top: 16px;
    left: 0px;
    width: 24px;
    height: 24px;
    padding: 20px;
}
.btmPop .content .topHead{
    height: 90px;
    line-height: 90px;
    font-size: 32px;
    font-weight: 900;
    width: 100%;
    text-align: center;
    color: #383d48;
}
.btmPop .content .tCon{
    padding: 0 20px;
    font-size: 30px;
    line-height: 46px;
    color: #383d48;
}
</style>
