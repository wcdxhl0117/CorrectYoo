<template>
  <div class="theBottomWrap" :class='{horizontal: horizontal}'>
    <div v-if='!horizontal' class="pinMu btmBase" @click="changeDirection" >
      <img class="img" src="./pingmu.png">
      <p class="btn">屏幕切换</p>
    </div>
    <div v-if='!horizontal' class="problem btmBase" @click="putQues" >
      <img class="img" src="./huihua.png">
      <p class="btn">问题反馈</p>
    </div>
    <p v-if='!horizontal' class="subResult" :class="{'not':!btmBtnBg}" @click="subResult">提交批改结果</p>
    <div v-if='horizontal' class="pinMu btmBase " @click="changeDirection" >
      <img class="img " src="./pingmu_horz.png">
    </div>
    <div v-if='horizontal' class="problem btmBase " @click="putQues" >
      <img class="img " src="./huihua_horz.png">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    horizontal: {
      type: Boolean,
      default: false
    },
    btmBtnBg: {
      type: Boolean,
      default: false
    }
  },
  mounted () {

  },
  methods: {
    changeDirection () {
      this.$emit("changeDirection");
    },
    subResult () {
      this.$emit("commitResult");
    },
    putQues () {
      this.$emit("putQues");
    }
  }
};
</script>

<style lang="scss" scoped>
.theBottomWrap {
  position: absolute;
  bottom: 0;
  z-index: 1;
  .btmBase {
    height: 100px;
    float: left;
    width: 150px;
    text-align: center;
    background: #ffffff;
    .img {
      width: 40px;
      height: 40px;
      margin: 14px 0 4px 0;
      display: inline-block;
    }
    .btn {
      line-height: 30px;
      font-size: 20px;
      color: #839096;
      text-align: center;
    }
  }
  .subResult {
    float: right;
    width: 450px;
    height: 100px;
    background: rgba(26, 136, 230, 1);
    line-height: 100px;
    text-align: center;
    font-size: 34px;
    color: #ffffff;
  }
  .not {
    background: #d3dde5;
  }
  &.horizontal{
    height: auto;
    .btmBase{
      background:rgba(0, 0, 0, 0.8);
      width: 80px;
      height: 80px;
      line-height: 80px;
      margin: 20px 0 20px 20px;
      padding: 20px;
      border-radius: 20px;
      box-sizing: border-box;
      font-size: 0;
      .img{
        margin: 0;
      }
    }
  }
}
</style>
