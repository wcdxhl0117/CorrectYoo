<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text" v-html="text"></p>
          <div class="operate">
            <div v-if="noCancel" @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    // 是否有取消按钮,默认有
    noCancel: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: ""
    },
    confirmBtnText: {
      type: String,
      default: "确定"
    },
    cancelBtnText: {
      type: String,
      default: "取消"
    }
  },
  data() {
    return {
      showFlag: false
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
      this.hide();
      this.$emit("cancel");
    },
    confirm() {
      this.hide();
      this.$emit("confirmNoTitle");
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
    .confirm-content {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -120px;
      margin-left: -275px;
      width: 550px;
      height: 240px;
      border-radius: 13px;
      background: #ffffff;

      .text {
        position: absolute;
        top: 50px;
        left: 50px;
        right: 50px;
        bottom: 100px;
        height: auto;
        text-align: center;
        font-size: 30px;
        color: rgba(56, 61, 72, 1);
        line-height: 42px;
      }

      .operate {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 100px;
        line-height: 100%;
        text-align: center;
        border-top: 2px solid #DEE6EE;
        width: 100%;
        // display: flex
        // align-items: center
        text-align: center;
        font-size: 30px;

        .operate-btn {
          height: 100px;
          line-height: 100px;
          // flex: 1
          width: 49%;
          float: left;
          font-size: 34px;
          color: rgba(26, 136, 230, 1);
          color: $color-text-d;

          &.left {
            border-right: 2px solid #DEE6EE;
          }
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
