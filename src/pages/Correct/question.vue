<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <h2 class="confirm-head">题目有误</h2>
          <div class="content">
            <div class="c_top">
              <p @click="chooseReason(1)" ref="tg" class="tg">题干有误</p>
              <p @click="chooseReason(2)" ref="da" class="da">正确答案有误</p>
            </div>
            <div class="questionTxt">
              <textarea v-model="otherReson" id="qText" placeholder="其他内容请输入"></textarea>
            </div>
          </div>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">取消</div>
            <div v-if="!subSure" class="operate-btn notSubnit">提交</div>
            <div v-if="subSure" @click="confirm" class="operate-btn">提交</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    subjectId:{
      // type: String,
      // default: ''
    }
  },
  data() {
    return {
      showFlag: false,
      subSure: false,
      reasonChoose: "",
      otherReson: ""
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    cancel() {
      this.reasonChoose = "";
      this.subSure = false;
      this.$refs.da.style.backgroundColor = "#D6E0EA";
      this.$refs.tg.style.backgroundColor = "#D6E0EA";
      this.otherReson = "";
      this.hide();
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("subQuestion", this.reasonChoose, this.otherReson,this.subjectId);
      this.reasonChoose = "";
      this.subSure = false;
      this.$refs.da.style.backgroundColor = "#D6E0EA";
      this.$refs.tg.style.backgroundColor = "#D6E0EA";
      this.otherReson = "";
      this.hide();
    },
    chooseReason(num) {
      this.subSure = true;
      if (num == 1) {
        this.$refs.tg.style.backgroundColor = "#1A88E6";
        this.$refs.da.style.backgroundColor = "#D6E0EA";
        this.reasonChoose = "CONTENT";
      } else {
        this.$refs.da.style.backgroundColor = "#1A88E6";
        this.$refs.tg.style.backgroundColor = "#D6E0EA";
        this.reasonChoose = "ANSWER";
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 998;
  background: rgba(0, 0, 0, 0.8);

  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.3s;

    .confirm-content {
      animation: confirm-zoom 0.3s;
    }
  }

  .confirm-wrapper {
    // position: absolute
    // top: 50%
    // left: 50%
    // transform: translate(-50%, -50%)
    // z-index: 999
    .confirm-content {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -275px;
      margin-top: -310px;
      width: 550px;
      height: 621px;
      border-radius: 13px;
      background: #ffffff;

      .content {
        width: 490px;
        height: 60px;
        margin: 0 auto;

        .c_top {
          // display flex
          // display -webkit-flex
          width: 100%;
          height: 60px;

          p {
            width: 230px;
            float: left;
            text-align: center;
            line-height: 60px;
            font-size: 30px;
            border-radius: 4px;
            color: #FFFFFF;
            background: #D6E0EA;

            &.tg {
              margin-right: 26px;
            }
          }
        }
      }

      .questionTxt {
        width: 490px;
        height: 265px;
        // border 1px solid #C8C7CC
        margin: 20px 0;

        #qText {
          width: 460px;
          height: 235px;
          border: 1px solid #C8C7CC;
          padding: 15px;
          font-size: 30px;
          color: #383D48;
          word-wrap: break-word;
        }
      }

      .confirm-head {
        text-align: center;
        padding: 38px 0;
        font-size: 34px;
        font-weight: 900;
        color: #383D48;
      }

      .operate {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 100px;
        line-height: 100%;
        text-align: center;
        border-top: 1px solid #DEE6EE;
        width: 100%;
        // display: flex
        // align-items: center
        text-align: center;
        font-size: 30px;

        .operate-btn {
          float: left;
          height: 100px;
          line-height: 100px;
          width: 49%;
          // flex: 1
          font-size: 34px;
          color: rgba(26, 136, 230, 1);
          color: $color-text-d;

          &.left {
            border-right: 1px solid #DEE6EE;
          }
        }

        .notSubnit {
          opacity: 0.4;
        }
      }
    }
  }
}

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes confirm-zoom {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
