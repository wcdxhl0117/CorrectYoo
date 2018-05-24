<template>
    <div class="btmWrap">
        <!-- <div class="pinMu btmBase">
            <img src="./pingmu.png">
            <p>屏幕切换</p>
        </div> -->
        <div @click="putQues" class="problem btmBase" style="margin-left:36px;">
            <img src="./huihua.png">
            <p>问题反馈</p>
        </div>
        <p :class="{'not':!btmBtnBg}" @click="subResult" class="subResult">提交批改结果</p>
    </div>
</template>

<script>
export default {
  components: {},
  props: {
    btmBtnBg: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {};
  },
  mounted() {},
  methods: {
    subResult() {
      this.$emit("commitResult");
    },
    putQues() {
      this.$store.dispatch("ERROR_MESSAGE", "模拟批改，不可操作");
      this.$emit("putQues");
    }
  }
};
</script>

<style scoped>
.btmWrap {
  width: 100%;
  height: 100px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  /* display: flex;
  display: -webkit-flex; */
}
.btmBase {
  height: 100px;
  float: left;
  width: 150px;
  text-align: center;
  background: #ffffff;
}
.btmBase img {
  width: 40px;
  height: 40px;
  margin: 14px 0 4px 0;
}
.btmBase p {
  line-height: 30px;
  font-size: 20px;
  color: #839096;
  text-align: center;
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
</style>
