<template>
    <div id='allWrapper'>
        <Header v-show='showHead==true' :title='title'></Header> 
        <div v-show='!dateIn' class='top_tip'>{{firData.wrongTimeTip}}</div>
        <div v-show='withdrawToday' class='top_tip ttip'>你今天已经进行提现了，每日仅可提现1次</div>
        <div class='clum'>
          <p>真实姓名</p>
          <input type='text' :value='firData.realName' readonly='readonly'>
        </div>
        <div class='clum'>
          <p>支付宝账号</p>
          <input @blur='getPayCount' v-model='paycount' type='text' placeholder='请输入支付宝账号'>
          <span class='ComentName'>{{countName}}</span>
        </div>
        <p v-if='!notPass' class='theTip'>请确认支付宝与小悠快批平台的实名认证信息相同</p>
        <p v-if='notPass' class='theTip notPass'>支付宝与小悠快批实名认证信息不一致，无法提现</p>
        <div class='get_amount'>
          <p>提现金额（元）</p>
          <input type='number' v-model='money' placeholder='请输入金额' @blur='moneyDraw' onkeyup="value=value.replace(/[^\d.]/g,'')">
        </div>
        <div class='btmTipWrap'>
          <p class='theTip'>本次可提现<span>{{maxNum}}</span>元</p>
          <p class='tipRight theTip'>单次提现上限800元</p>
        </div>
        <div @click='drawalCash' v-show='btnColor' class='sureBtn colorSure'>确认提现 24小时内到账</div>
        <div v-show='!btnColor' class='sureBtn'>确认提现 24小时内到账</div>
        <!-- message提示 -->
        <Message></Message>
        <!-- 成功弹窗提示 -->
        <classMessage :message='SuccessTip'></classMessage>
        <!-- loading组件 -->
        <loading :message='loadTip'></loading>
    </div>
</template>

<script>
import cookie from 'js-cookie'
import Header from '@/base/header'
import loading from '@/base/loading/loading'
import Message from '@/base/message'
import classMessage from '@/base/classMessage'
export default {
    components: { Header, loading, Message, classMessage },
    name: 'withdrawal',
    data: function() {
      return {
        showHead: false, //是否显示title栏
        title: '提现', //标题栏内容
        firData: {},
        dateIn: true, //是否在规定时间内
        countName: '', //支付宝账号验证返回的实名信息
        notPass: false, //支付宝实名和平台实名不一致true
        maxNum: '', //可提现金额
        paycount: '',
        money: '',
        countOk: false, //账号是否ok
        moneyOk: false, //金额是否ok
        withdrawToday: false, //今日是否已经体现,true为已提现
        loadTip: '',
        SuccessTip: '',
        offDraw: true
      }
    },
    beforeCreate: function() {
      document
        .getElementsByTagName('body')[0]
        .setAttribute('style', 'background-color:#e9e9eb')
    },
    beforeRouteEnter(to, from, next) {
      next(function(vm) {
        vm.$client.system('documentTitle', {
          title: '提现'
        })
      })
    },
    created() {
        // 监听返回键
        cookie.set('outKey', '0')
        if (cookie.get('showHeader') == 'true') {
            this.showHead = true
        } else {
            this.showHead = false
        }
        let _this = this
        setTimeout(function() {
            if (cookie.get('S_L_S') !== '1') {
                _this.$router.push({
                    path: `/login`
                })
            }
        }, 100)
        this.drawInfo()
    },
    methods: {
        getPayCount() {
            // 失去焦点验证(暂时不做)
            if (this.paycount) {
                // 输入了信息，并失去焦点，后端交互
                // 后端验证通过并且正确输了金额后，按钮颜色变为可点击
                // this.loadTip = '正在验证'
                // 支付宝验证
                this.countOk = true
            } else {}
        },
        // 金额验证截取
        moneyDraw() {
            this.moneyOk = false
            if (this.money) {
                let m = this.money.split('.')
                let m1 = m[0]
                let m2
                if (m[1]) {
                    if (m[1].length == 1) {
                        m2 = m[1].concat('0')
                    } else {
                        m2 = m[1].substring(0, 2)
                    }
                } else {
                    m2 = '00'
                }
                m = m1.concat('.' + m2)
                this.money = m
                if (this.money < 0.1) {
                    this.$store.dispatch('ERROR_MESSAGE', '最小提现金额为0.1元')
                    this.money = ''
                } else if ( parseFloat(this.money) > parseFloat(this.maxNum) || parseFloat(this.money) > 800 ) {
                    this.$store.dispatch('ERROR_MESSAGE', '超过最大可提现金额')
                    this.money = ''
                } else {
                    this.moneyOk = true
                }
            }
        },
        drawalCash() {
            let _this = this
            if (_this.offDraw) {
                _this.offDraw = false
                // 后台交互提现，成功classMessage弹窗，失败message弹窗
                this.$http.post('/ycorrect/user/center/withdraw', {}, {
                    params: {
                        amount: parseFloat(this.money),
                        alipayNo: this.paycount
                    }
                }).then(response => {
                    console.log(response.data.ret)
                    if (response.data.ret_code == 0) {
                        this.SuccessTip = '提现成功，24小时内到账'
                        setTimeout(() => {
                            _this.offDraw = true
                            _this.SuccessTip = ''
                            window.history.back()
                        }, 1500)
                    } else {
                        _this.offDraw = true
                        this.$store.dispatch('ERROR_MESSAGE', response.data.ret_msg)
                    }
                }, ({ response }) => {
                    _this.offDraw = true
                    this.$store.dispatch('ERROR_MESSAGE', '网络异常')
                })
            }
            
        },
        drawInfo() {
            let _this = this
            this.$http.post('/ycorrect/user/center/getWithdrawInfo', {}, {
                params: {}
            }).then(response => {
                console.log(response.data.ret)
                if (response.data.ret_code == 0) {
                    let data = response.data.ret
                    this.firData = data
                    this.dateIn = data.isRightTime
                    this.maxNum = data.obalance.toFixed(2)
                    if (parseFloat(this.maxNum) > 800 ) {
                        this.maxNum = 800
                    }
                    this.withdrawToday = data.withdrawToday
                } else {
                    this.$store.dispatch('ERROR_MESSAGE', response.data.ret_msg)
                }
            }, ({ response }) => {
                this.$store.dispatch('ERROR_MESSAGE', '网络异常')
            })
        }
    },
    computed: {
        btnColor() {
            if (this.countOk && this.moneyOk && this.dateIn && !this.withdrawToday) {
                return true
            } else {
                return true
            }
        }
    },
    beforeDestroy: function() {
        document.getElementsByTagName('body')[0].setAttribute('style', 'background-color:#fff')
    }
}
</script>

<style scoped>
#allWrapper {
  width: 750px;
  max-width: 750px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: auto;
  margin: 0 auto;
  background: #e9e9eb;
}
.top_tip {
  height: auto;
  width: 710px;
  padding: 10px 20px;
  background: #f8c438;
  font-size: 30px;
  line-height: 42px;
  color: #ffffff;
  margin-bottom: 20px;
}
.clum {
  width: 100%;
  height: 100px;
  /* display: flex;
  display: -webkit-flex; */
  background: #ffffff;
  border: 1px solid #ededf3;
  position: relative;
}
.ComentName {
  display: inline-block;
  position: absolute;
  height: 100px;
  top: 0;
  right: 20px;
  line-height: 100px;
  font-size: 24px;
  color: rgba(131, 144, 150, 1);
}
.clum p {
  float: left;
  width: 220px;
  height: 100px;
  line-height: 100px;
  padding-left: 20px;
  font-size: 34px;
  color: #383d48;
  font-weight: 900;
}
.clum input {
  width: 400px;
  float: left;
  border: none;
  height: 40px;
  padding: 30px 0;
  line-height: 40px;
  font-size: 34px;
  color: #383d48;
}
.btmTipWrap {
  display: flex;
  display: -webkit-flex;
}
.theTip {
  flex: 1;
  font-size: 24px;
  padding-top: 20px;
  padding-left: 20px;
  padding-bottom: 58px;
  color: rgba(131, 144, 150, 1);
}
.btmTipWrap .tipRight {
  flex: 1;
  text-align: right;
  padding-right: 20px;
}
.notPass {
  color: red;
}
.get_amount {
  height: 200px;
  width: 100%;
  background: #ffffff;
}
.get_amount p {
  height: 100px;
  line-height: 100px;
  color: #383d48;
  font-weight: 900;
  padding-left: 20px;
  font-size: 34px;
}
.get_amount input {
  height: 40px;
  padding: 30px 0;
  line-height: 40px;
  font-size: 34px;
  color: #383d48;
  padding-left: 80px;
  background: url(./rmb.png) no-repeat;
  background-position: 20px 24px;
  background-size: 42px 46px;
}
.sureBtn {
  width: 710px;
  height: 100px;
  background: rgba(211, 221, 229, 1);
  border-radius: 50px;
  color: #ffffff;
  margin: 0 auto;
  line-height: 100px;
  text-align: center;
  font-size: 34px;
}
.colorSure {
  background: #1a88e6;
}
</style>
