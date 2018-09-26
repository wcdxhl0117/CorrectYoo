<template>
  <transition name='confirm-fade'>
    <div class='confirm' v-show='showFlag' @click.stop>
      <div class='confirm-wrapper'>
        <div class='confirm-content'>
          <h2 class='confirm-head'>{{tipHead}} <img @click='hide' src='./cha.png'></h2>
          <div class='text'>
              <div class='c_clum'>
                 <p class='c_clum_l'>提现时间</p>
                 <p class='c_clum_r'>每周{{ruleData.withdrawWeekDay}} {{ruleData.withdrawBt}} ~ {{ruleData.withdrawEt}}</p>
              </div>

              <div class='c_clum'>
                 <p class='c_clum_l'>可提收入</p>
                 <p class='c_clum_r'>上周日及之前的收入</p>
              </div>

              <div class='c_clum'>
                 <p class='c_clum_l'>单日提现限额</p>
                 <p class='c_clum_r'>{{ruleData.dayWithdrawMax}}元</p>
              </div>

              <div class='c_clum'>
                 <p class='c_clum_l'>到账时间</p>
                 <p class='c_clum_r'>{{ruleData.transferTimeComment}}</p>
              </div>

              <div class='c_clum'>
                 <p class='c_clum_l'>提现次数</p>
                 <p class='c_clum_r'>每周{{ruleData.dayWithdrawCount}}次</p>
              </div>
              
              <div class='otherTip'>
                  <p class='p1'>*仅支持提现到支付宝账户</p>
                  <p class='p1'>*实名认证的姓名与支付宝实名信息必须一致</p>
                  <p class='p1'>*出现提现失败的用户</p>
                  <p class='p2'>请核查实名认证信息与支付宝信息是否一致</p>
                  <p class='p2'>支付宝是否进行了实名认证</p>
                  <p class='p2'>支付宝是否设置了隐藏真实姓名</p>
              </div>
          </div>
          <div class='operate'>
            <div v-if='noCancel' @click='cancel' class='operate-btn left'>{{cancelBtnText}}</div>
            <div @click='confirm' class='operate-btn'>{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
      <message></message>
    </div>
  </transition>
</template>

<script type='text/ecmascript-6'>
import message from '@/base/message';
export default {
    components: { message },
    props: {
        tipHead: {
            type: String,
            default: '提现规则'
        },
        // 是否有取消按钮,默认有
        noCancel: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: '内容'
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
            ruleData: {}
        }
    },
    created() {
        this.$http.post('/ycorrect/home/help', {}, {}).then(response => {
            console.log(response.data.ret)
            if (response.data.ret_code == 0) {
                this.ruleData = response.data.ret
                if (this.ruleData.withdrawWeekDay === 1) {
                    this.ruleData.withdrawWeekDay = '一'
                } else if (this.ruleData.withdrawWeekDay === 2) {
                    this.ruleData.withdrawWeekDay = '二'
                } else if (this.ruleData.withdrawWeekDay === 3) {
                    this.ruleData.withdrawWeekDay = '三'
                } else if (this.ruleData.withdrawWeekDay === 4) {
                    this.ruleData.withdrawWeekDay = '四'
                } else if (this.ruleData.withdrawWeekDay === 5) {
                    this.ruleData.withdrawWeekDay = '五'
                } else if (this.ruleData.withdrawWeekDay === 6) {
                    this.ruleData.withdrawWeekDay = '六'
                } else if (this.ruleData.withdrawWeekDay === 7) {
                    this.ruleData.withdrawWeekDay = '日'
                }
            } else {
                this.$store.dispatch('ERROR_MESSAGE', response.data.ret_msg)
            }
        }, ({ response }) => {
            this.$store.dispatch('ERROR_MESSAGE', '网络异常')
        })
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
            this.$emit('cancel')
        },
        confirm() {
            this.hide()
            this.$emit('confirm')
        }
    }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
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
        // position: absolute;
        // top: 50%;
        // left: 50%;
        // transform: translate(-50%, -50%);
        // z-index: 999;
        .confirm-content {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -400px;
            margin-left: -316px;
            width: 632px;
            height: 800px;
            border-radius: 20px;
            background: #ffffff;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;

            .confirm-head {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                text-align: center;
                padding: 28px 0;
                font-size: 34px;
                font-weight: 900;
                color: #fff;
                background: #F8C438;
                border-top-right-radius: 20px;
                border-top-left-radius: 20px;

                img {
                    position: absolute;
                    right: 0;
                    width: 30px;
                    height: 30px;
                    padding: 0 30px 30px 30px;
                }
            }

            .text {
                position: absolute;
                top: 90px;
                left: 0;
                right: 0;
                bottom: 100px;
                overflow: auto;

                .c_clum {
                    margin: 0 30px;
                    height: 100px;
                    line-height: 100px;
                    border-bottom: 1px solid #E5E5E5;

                    .c_clum_l {
                        float: left;
                        color: #383D48;
                        font-size: 30px;
                        font-weight: 900;
                    }

                    .c_clum_r {
                        float: right;
                        color: #839096;
                        font-size: 30px;
                    }
                }

                .otherTip {
                    height: auto;
                    padding: 0 30px;
                    padding-bottom: 30px;

                    .p1 {
                        height: auto;
                        line-height: 60px;
                        color: #666;
                        font-size: 30px;
                    }

                    .p2 {
                        font-size: 24px;
                        height: 50px;
                        padding-left: 15px;
                        color: #333;
                    }
                }
            }

            .text::-webkit-scrollbar {
                display: none;
            }

            .operate {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 120px;
                line-height: 100%;
                text-align: center;
                width: 100%;
                align-items: center;
                text-align: center;
                font-size: 30px;
                background: #ffffff;
                border-top-right-radius: 20px;
                border-top-left-radius: 20px;
                -moz-box-shadow: 0px 0px 0px #ffffff, 0px -10px 100px #ffffff;
                -webkit-box-shadow: 0px 0px 0px #ffffff, 0px -10px 100px #ffffff;
                box-shadow: 0px 0px 0px #ffffff, 0px -10px 100px #ffffff;

                .operate-btn {
                    height: 80px;
                    line-height: 80px;
                    color: #fff;
                    width: 440px;
                    margin: 20px auto;
                    border-radius: 40px;
                    background: #2AB7F7;
                    flex: 1;
                    font-size: 34px;

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
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}
</style>
