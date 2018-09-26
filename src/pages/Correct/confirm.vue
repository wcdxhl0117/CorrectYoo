<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <h2 class="confirm-head">提示</h2>
          <p class="text">系统检测到你30s未进行任何操作<br/>请确认是否还在批改中<br/><span>10s内无操作，将自动停止批改</span></p>
          <div class="operate">
            <div v-if="noCancel" @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn">我在批改（{{timeNum}}s）</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
    props: {
        tipHead: {
            type: String,
            default: ''
        },
        // 是否有取消按钮,默认有
        noCancel: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: ''
        },
        confirmBtnText: {
            type: String,
            default: '确定'
        },
        cancelBtnText: {
            type: String,
            default: '取消'
        }
    },
    data() {
        return {
            showFlag: false,
            timeNum: '10'
        }
    },
    methods: {
        show() {
            this.showFlag = true
        },
        hide() {
            this.showFlag = false
        },
        cancel() {
            this.hide()
            this.$emit("cancel")
        },
        confirm() {
            this.hide()
            this.$emit("confirm")
        },
        theTime() {
            let count = 10
            this.timer = setInterval(() => {
                if (count <= 0) {
                    clearInterval(this.timer)
                    this.timer = null
                    this.showFlag = false
                    // 进入停止接替页面
                    this.$emit("confirmStop")
                } else {
                    count--
                    // if (count < 10) {
                    //   count = "0" + count
                    // }
                }
                this.timeNum = count
            }, 1000)
        }
    }
}
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
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;

    .confirm-content {
      position: relative;
      width: 550px;
      height: 350px;
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
        top: 100px;
        left: 50px;
        right: 50px;
        bottom: 100px;
        height: auto;
        text-align: center;
        font-size: 30px;
        color: rgba(56, 61, 72, 1);
        line-height: 42px;

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
