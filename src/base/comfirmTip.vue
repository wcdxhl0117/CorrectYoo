<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text" v-html="text"></p>
          <div class="operate">
            <div @click="confirmTip" class="operate-btn">确定</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    text: {
      type: String,
      default: "模拟批改共10道题<br/>请认真完成"
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
    confirmTip() {
      this.hide();
      this.$emit("confirmTip");
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
      width: 420px;
      margin-top: -130px;
      margin-left: -210px;
      height: auto;
      min-height: 260px;
      border-radius: 13px;
      background: #ffffff;

      .confirm-head {
        text-align: center;
        padding: 38px 0;
        font-size: 34px;
        font-weight: 900;
        color: #383D48;
      }

      .text {
        position: absolute;
        top: 40px;
        left: 50px;
        right: 50px;
        bottom: 100px;
        height: auto;
        text-align: center;
        font-size: 30px;
        color: rgba(56, 61, 72, 1);
        line-height: 50px;

        span {
          color: #999;
          font-size: 24px;
        }
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
        display: flex;
        align-items: center;
        text-align: center;
        font-size: 30px;

        .operate-btn {
          height: 100px;
          line-height: 100px;
          flex: 1;
          font-size: 34px;
          color: rgba(26, 136, 230, 1);
          color: $color-text-d;

          &.left {
            border-right: 1px solid #DEE6EE;
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
