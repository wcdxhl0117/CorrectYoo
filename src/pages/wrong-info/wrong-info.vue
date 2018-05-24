<template>
  <div id="allWrapper">
      <div class="top">
          <p>扣费时间：<span>2018-03-06</span></p>
          <p>批错数量：<span>4题（2填空+2解答）</span></p>
          <p>扣费：<span>-1.50</span></p>
      </div>
      <!-- 主内容 -->
      <div class="theContent">
          <div class="loop">
              <!-- 填空结构 -->
              <div class="completion">
                  <div class="date_wrap">
                    <p class="date_left">批改日期：2018-04-06</p>
                    <p class="date_right" @click="lookInfo(123)">查看题干</p>
                  </div>
                  <!-- 空循环结构 -->
                  <div class="kong">
                      <p class="k_p1">第1空</p>
                      <div class="k_content">
                          <div class="k_con">
                              <span class="c_con_left">正确答案</span>
                              <span class="c_con_right">12345678998976543211234567899897654321</span>
                          </div>
                          <div class="k_con">
                              <span class="c_con_left">作答答案</span>
                              <span class="c_con_right">12345678998976543211234567899897654321</span>
                          </div>
                          <div class="k_con">
                              <span class="c_con_left">我的批改结果</span>
                              <span class="c_con_right">
                                  <img src="./quanduic.png" alt="">
                                  <!-- <img src="./quancuoc.png" alt=""> -->
                              </span>
                          </div>
                          <div class="k_con no_btm_border">
                              <span class="c_con_left">二次批改结果</span>
                              <span class="c_con_right">
                                  <!-- <img src="./quanduic.png" alt=""> -->
                                  <img src="./quancuoc.png" alt="">
                              </span>
                          </div>
                      </div>
                  </div>
              </div>
              <!-- 解答题结构 -->
              <div class="answer">
                  <div class="date_wrap">
                    <p class="date_left">批改日期：2018-04-06</p>
                    <p class="date_right" @click="lookInfo(123)">查看题干</p>
                  </div>
                  <div class="rightA">
                      <p class="rp1">正确答案</p>
                      <p class="rp2">
                          事件A、B、C至多发生两个的概率分别为75%和50%，事件A、B、 C至多发生两个的概率分别为75%和50%，事件A、B、C至
                      </p>
                  </div>
                  <div class="stuAn">
                      <p>作答答案</p>
                      <div>
                         <img src="./banduic.png" alt="">
                      </div>
                  </div>
                  <div class="k_content">
                    <div class="k_con">
                        <span class="c_con_left">我的批改结果</span>
                        <span class="c_con_right">
                            <img src="./quanduic.png" alt="">
                            <!-- <img src="./quancuoc.png" alt=""> -->
                            <!-- <img src="./banduic.png" alt=""> -->
                        </span>
                    </div>
                    <div class="k_con no_btm_border">
                        <span class="c_con_left">二次批改结果</span>
                        <span class="c_con_right">
                            <!-- <img src="./quanduic.png" alt=""> -->
                            <!-- <img src="./quancuoc.png" alt=""> -->
                            <img src="./banduic.png" alt="">
                        </span>
                    </div>
                </div>
                  
              </div>
              <!-- 管理员抽查 -->
              <div class="checkUp">
                  <div class="date_wrap">
                    <p class="date_left">批改日期：2018-04-06</p>
                    <p class="date_right"></p>
                  </div>
                  <div class="infos">
                      <p>类型：管理员后台抽查</p>
                      <p>原因：解答题批改错误</p>
                      <p>描述：解答题批改错误</p>
                      <p>截图：</p>
                  </div>
                  <div class="imgs">
                    <!-- tranImg -->
                    <div>
                        <img class="tImg" src="./quanduic.png" alt="">
                        <img @click="tranImg(0)" class="right" src="./xuan.png" alt="">
                    </div>
                    <div>
                        <img class="tImg" src="./banduic.png" alt="">
                        <img @click="tranImg(1)" class="right" src="./xuan.png" alt="">
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
                  <p class="tCon">{{nowTg}}</p>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  components: {  },
  name: "wrong-info",
  data: function() {
    return {
      showPop: false,
      nowTg: '',
      current: []
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
  created() {
   
  },
  mounted() {
    if(this.$route.query.d){
        console.log(this.$route.query.d)
    }

    // 初始化current
    for(let i=0;i<2;i++){
        this.current[i] = 0
    }

  },
  methods: {
    lookInfo(info){
        this.showPop = true;
        this.nowTg = info
    },
    closePop(){
        this.showPop = false;
        this.nowTg = ''
    },
    tranImg(idx) {
      this.current[idx] = (this.current[idx] + 90) % 360;
      console.log(this.current[idx])
      this.$el.querySelectorAll(".tImg")[idx].style.transform = "rotate(" + this.current[idx] + "deg)";
      this.$el.querySelectorAll(".tImg")[idx].style.webkitTransform = "rotate(" + this.current[idx] + "deg)";
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
