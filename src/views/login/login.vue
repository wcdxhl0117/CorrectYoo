<template>
    <div id="allWrapper">
        <div id="login">
            <img src="./logo.png">
            <div class="theTitle">
              <img src="./logoTitle.png" alt="">
            </div>
            <form @submit.prevent="submit">
                <!--<label> 用户名： </label>-->
                <div class="username">
                    <input class="inp inp-username" v-model="user.username" type="text" placeholder="请输入用户名/手机/邮箱">
                </div>

                </br>

                <!--<label> 密码： </label>-->
                <div class="password">
                    <input class="inp inp-pass" v-model="user.password" type="password" placeholder="请输入密码">
                </div>

                <!--<div class="red-tip">和姐姐减肥减肥减肥</div>-->

                </br>
                <a class="submit-btn" @click="submit">登录</a>
                </br>
            </form>
        </div>
        <message></message>
        <loading :message="loadTip"></loading>
    </div>
</template>

<script>
import loading from '@/base/loading/loading'
import message from '@/base/message'
import cookie from 'js-cookie'
import { setTimeout } from 'timers'
export default {
    components: { message, loading },
    name: 'login',
    data: function() {
        return {
            user: {
                username: '',
                password: ''
            },
            loadTip: ''
        }
    },
    created() {},
    mounted() {
        cookie.set('showHeader', false)
        // let _this = this;
        // if (cookie.get("S_L_S") == 1) {
        //   cookie.set("showHeader", false);
        //   this.$router.push({
        //     path: `/home`
        //   });
        // }
        this.backBTN()
    },
    methods: {
        // this.$refs.videoT.volume = 0
        submit: function() {
            let _this = this
            // 设置是否显示头部
            cookie.set('showHeader', true)
            if (!this.user.username) {
                this.$store.dispatch("ERROR_MESSAGE", "用户名不能为空")
                return
            }
            if (!this.user.password) {
                this.$store.dispatch('ERROR_MESSAGE', '密码不能为空')
                return
            } else {
                this.loadTip = '正在登陆...'
                this.$http.post('/ycorrect/user/login', {}, {
                    params: this.user 
                }).then((response) => {
                    if (response.data.ret_code == 0) {
                        this.loadTip = ''
                        response.data.ret_msg = '登陆成功'
                        window.setTimeout(function() {
                            _this.$router.push({
                                path: `/home`
                            })
                        }, 1500)
                    }
                    this.loadTip = ''
                    this.$store.dispatch('ERROR_MESSAGE', response.data.ret_msg)
                }, ({ response }) => {
                    this.loadTip = ''
                    this.$store.dispatch('ERROR_MESSAGE', '网络异常')
                })
            }
        },
        backBTN() {
            var _this = this
            /**
             * 使用 HTML5 的 History 新 API pushState 来曲线监听 Android 设备的返回按钮
             * XBack.listen(function(){
                alert('oh! you press the back button')
              })
            */
            !(function(pkg, undefined) {
                var STATE = 'x-back'
                var element
                var onPopState = function(event) {
                    event.state === STATE && fire()
                }
                var record = function(state) {
                    history.pushState(state, null, location.href)
                }
                var fire = function() {
                    var event = document.createEvent('Events')
                    event.initEvent(STATE, false, false)
                    element.dispatchEvent(event)
                }
                var listen = function(listener) {
                    element.addEventListener(STATE, listener, false)
                }
                !function() {
                    element = document.createElement('span')
                    window.addEventListener('popstate', onPopState)
                    this.listen = listen
                    this.record = record(STATE)
                    record(STATE)
                }.call((window[pkg] = window[pkg] || {}))
            })('XBack')
            XBack.listen(function() {
                // 点击返回键回掉
                if (cookie.get('showHeader')) {
                    window.location.reload()
                }
            })
        }
    }
}
</script>

<style scoped>
#allWrapper {
  position: relative;
  width: 100%;
  height: auto;
  margin: 0 auto;
  background: #ffffff;
}

#login {
  padding: 100px 30px;
}

#login img {
  display: block;
  width: 240px;
  height: 220px;
  margin: 0 auto 40px;
}
.theTitle {
  width: 100%;
  height: auto;
  height: 150px;
  text-align: center;
}
#login .theTitle img {
  width: 240px;
  height: 50px;
}

label {
  line-height: 45px;
  font-size: 18px;
}

#login .inp {
  border: 2px solid #d3dde5;
  /*px*/
  padding: 24px 100px;
  box-sizing: border-box;
  border-radius: 45px;
  height: 90px;
  width: 100%;
  font-size: 30px;
}

#login .inp-username {
  background: url("../../assets/img/login/icon_user@2x.png") no-repeat;
  background-position: 50px 15px;
  background-size: 48px 48px;
}

#login .inp-pass {
  background: url("../../assets/img/login/icon_lock@2x.png") no-repeat;
  background-position: 50px 15px;
  background-size: 48px 48px;
}

#login .submit-btn {
  height: 90px;
  line-height: 90px;
  background: #1a88e6;
  color: #fff;
  text-align: center;
  font-size: 34px;
  display: block;
  width: 100%;
  border-radius: 45px;
  margin-top: 60px;
}

#login .submit-btn:active {
  opacity: 0.8;
}

#login .red-tip {
  color: #f14b40;
  padding-left: 40px;
  margin-top: 20px;
}
</style>
