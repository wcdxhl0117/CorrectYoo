<template>
    <div id='allWrapper' class='mhome'>
      <Header v-show='showHead==true' :title='title'></Header> 
      <section class='pwd-panel'>
        <ul class='form-list'>
            <li>
                <div class='form-item form-pwd'>
                    <div class='div1'><label>原密码</label></div>
                    <div class='div2'><input ref='oldPwd' type='password' name='' placeholder='请输入当前密码' v-model='oldPwd'></div>
                    <div class='div3'><img ref='img1' @click='showPwd(1)' src='./icon_hide@2x.png' class='eye'></div>
                </div>
            </li>
            <li>
                <div class='form-item form-pwd'>
                    <div class='div1'><label>新密码</label></div>
                    <div class='div2'><input ref='newPwd' type='password' name='' placeholder='请输入新密码' v-model='newPwd'></div>
                    <div class='div3'><img ref='img2' @click='showPwd(2)' src='./icon_hide@2x.png' class='eye'></div>
                </div>
            </li>
        </ul>
        <div class='tip'>
            <p>密码由6-16位字母、数字和符号组成</p>
        </div>
      </section>
      <section>
        <div v-show='btnColor' class='form-submit yes' @click='submitChange'>
            <a href='javascript:void(0)'>提交</a>
        </div>
        <div v-show='!btnColor' class='form-submit'>
            <a href='javascript:void(0)'>提交</a>
        </div>
      </section>
      <message></message>
      <loading :message='loadTip'></loading>
    </div>
</template>

<script>
import loading from '@/base/loading/loading'
import cookie from 'js-cookie'
import Header from '@/base/header'
import message from '@/base/message'
export default {
    components: { Header, message, loading },
    name: 'change_pwd',
    data: function() {
        return {
            showHead: false, //是否显示title栏
            title: '修改密码', //标题栏内容
            oldPwd: '',
            newPwd: '',
            loadTip: ''
        }
    },
    beforeRouteEnter(to, from, next) {
        cookie.set('outKey', '0')
        next(function(vm) {
            vm.$client.system('documentTitle', {
                title: '修改密码'
            })
        })
    },
    created() {
        cookie.set('outKey', '0')
        if (cookie.get('showHeader') === 'true') {
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
    },
    computed: {
        btnColor() {
            if (this.oldPwd && this.newPwd) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        showPwd(num) {
            if (num == 1) {
                if (this.$refs.oldPwd.type == 'password') {
                    this.$refs.oldPwd.type = 'text'
                    this.$refs.img1.src = require('./xian.png')
                } else {
                    this.$refs.oldPwd.type = 'password'
                    this.$refs.img1.src = require('./icon_hide@2x.png')
                }
            } else {
                if (this.$refs.newPwd.type == 'password') {
                    this.$refs.newPwd.type = 'text'
                    this.$refs.img2.src = require('./xian.png')
                } else {
                    this.$refs.newPwd.type = 'password'
                    this.$refs.img2.src = require('./icon_hide@2x.png')
                }
            }
        },
        submitChange() {
            let reg = /^([a-z0-9\.\@\!\#\$\%\^\&\*\(\)\+\_\-\>\<\~\,\'\']){6,16}$/i
            // 新旧密码格式正确
            if (reg.test(this.oldPwd) && reg.test(this.newPwd)) {
                // 两次密码一样
                if (this.oldPwd == this.newPwd) {
                    this.$store.dispatch('ERROR_MESSAGE', '新旧密码不能一样')
                } else {
                    // 两次密码不一样，提交
                    this.loadTip = '正在提交...'
                    this.subChangeHxb()
                }
            } else {
                // 匹配失败
                this.$store.dispatch('ERROR_MESSAGE', '密码格式有误')
            }
        },
        subChangeHxb() {
          let _this = this
          this.$http.post('/ycorrect/user/center/resetPassWord', {}, {
                  params: {
                      p1: this.oldPwd,
                      p2: this.newPwd
                  }
              }).then(response => {
                  this.loadTip = ''
                  console.log(response.data)
                  if (response.data.ret_code == 0) {
                      this.$store.dispatch('ERROR_MESSAGE', '修改成功！')
                      setTimeout(function() {
                          _this.$router.push({
                              path: `/personal`
                          })
                      }, 1000)
                  } else {
                      this.$store.dispatch('ERROR_MESSAGE', response.data.ret_msg)
                  }
              }, ({ response }) => {
                  this.$store.dispatch('ERROR_MESSAGE', '网络异常')
              })
        }
    }
}
</script>

<style scoped>
#allWrapper {
  width: 750px;
  max-width: 750px;
  height: 100%;
  margin: 0 auto;
}
a {
  text-decoration: none;
  cursor: default;
}
input {
  color: #30343d;
}
.tip {
  text-align: center;
  font-size: 26px;
  color: #949da4;
}
.tip p {
  padding-left: 18px;
}
.form-list {
  background-color: #fff;
}
.form-list li {
  line-height: 98px;
  height: 98px;
  width: 100%;
  border-bottom: 2px solid #f6f6f9;
}
.form-item {
  height: 98px;
  line-height: 98px;
  width: 100%;
  /* display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex; */
}
.form-item .div1 {
  width: 168px;
  float: left;
  text-align: center;
  font-size: 30px;
}
.form-item .div2 {
  float: left;
  width: 400px;
  padding: 0 30px;
  font-size: 30px;
}
.form-item .div3 {
  float: left;
  font-size: 30px;
  width: 240px;
  text-align: center;
}
.form-code > div:nth-child(3) a {
  color: #386cfe;
}
.form-code > div:nth-child(3):active {
  opacity: 0.5;
}
.form-submit {
  margin: 44px 30px 36px;
  height: 96px;
  text-align: center;
  background-color: #c9d5de;
  border-radius: 60px;
}
.form-submit a {
  line-height: 96px;
  font-size: 32px;
  color: #fff;
}
.form-old-tel {
  background-color: #e9e8ee;
}
.form-old-tel > div:nth-child(1) {
  width: 230px;
  text-align: center;
  font-size: 30px;
}
.form-old-tel > div:nth-child(2) {
  padding: 0 30px 0 0;
}
.pwd-panel .tip {
  text-align: left;
  padding: 20px;
}
.form-pwd > div:nth-child(3) {
  width: 120px;
  text-align: center;
}
.form-pwd .eye {
  vertical-align: middle;
  width: 56px;
}
.yes {
  background: #1a88e6;
}
</style>
