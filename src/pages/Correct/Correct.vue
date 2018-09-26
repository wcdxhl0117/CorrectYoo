<template>
    <div class="allWrapper" :class='{horizontal: isHorizontal}' ref='allWrapper'>
      <!-- 开始的音乐 -->
      <audio ref="startMusic" id="audio" src="/static/start.mp3">
        <source src="/static/start.mp3" type="audio/ogg">
        <source src="/static/start.mp3" type="audio/mpeg">
      </audio>
      <!-- 停止的音乐 -->
      <audio ref="stopMusic" id="audio" src="/static/stop.mp3">
        <source src="/static/stop.mp3" type="audio/ogg">
        <source src="/static/stop.mp3" type="audio/mpeg">
      </audio>
      <!-- 接到题目的音乐 -->
      <audio ref="getMusic" id="audio" loop="loop" src="/static/get.mp3">
        <source src="/static/stop.mp3" type="audio/ogg">
        <source src="/static/stop.mp3" type="audio/mpeg">
      </audio>

      <Header ref='header' v-show="showHead==true" :title="title"></Header>
      <div class="content" :style="{height: `${mainHeight}px`}">
        <TopTip ref='topTip' :content='topTipContent' :width='width' :horizontal='isHorizontal' :status='topTipStatus' @on-click='topTipClick'></TopTip>

      <!-- 等待组件 --> 
        <StartWaiting v-if="showStartWait" :width='width' :height='contentHeight' :horizontal='isHorizontal'></StartWaiting>
        <EndWaiting v-if="showEndWait"  @endStart="topTipClick()" :width='width' :height='contentHeight' :horizontal='isHorizontal'></EndWaiting>
      <!-- 批改组件 -->
        <TheMain ref="mianAll" v-if="showMianPi" :headHave="showHead" :horizontal='isHorizontal' :taskD="task" :mainHeight='mainHeight' :contentHeight='contentHeight' :middleHeight='middleHeight' :width='width' @tOStop="timeOutStop" @anAll="AnswerGet" @ImgPop="ImgPopNow" @stopGetMusic="getMusicP" :btmBtnBg="subResultBtn" @commitResult="comitRe"></TheMain>

      <!-- 底部提交 -->
        <TheBottom ref='footer' v-if="showTheBottom" :horizontal='isHorizontal' :btmBtnBg="subResultBtn" @commitResult="comitRe" @putQues="putQuestion" @changeDirection='changeDirection' ></TheBottom>

      </div>
      <!-- 提示弹窗 -->
      <confirm ref="confirm" 
        :text="tipContent" 
        :confirmBtnText="sureTxt" 
        :cancelBtnText="cancelTxt" 
        :tipHead="tipHead"
        @confirm="certification"
        @cancel="cancelOut"
        ></confirm>
        <!-- 图片预览组件 -->
      <picBig v-if="jdPicLook" @closeImgPop="closeImgPlus"></picBig>
      <question :subjectId="homeworkId" ref="ques" @subQuestion="subQues"></question>
      <loading :message="loadTip"></loading>
      <classMessage v-if="sucessTip" :message="sucessTip"></classMessage>
      <message></message>
    </div>
</template>

<script>
import Qs from 'qs'
import 'mathjax?config=TeX-MML-AM_HTMLorMML'
import message from '@/base/message'
import cookie from 'js-cookie'
import Header from '@/base/header'
import TheMain from './main'

import TopTip from './topTip'

import StartWaiting from './startWaiting'
import EndWaiting from './endWaiting'
import TheBottom from './theBottom'
import confirm from '@/base/confirm/confirm'
import loading from '@/base/loading/loading'
import pgTip from '@/base/pgTip'
import picBig from './picBig'
import question from './question'
import classMessage from '@/base/classMessage'
import { clearInterval } from 'timers'
const VERTICALWIDTH = 100
const HORIZONTALWIDTH = 43.77811094
const VERTICAL = 'vertical'
const HORIZONTAL = 'horizontal'
const START = 'start'
const STOP = 'stop'
const RECEIVING = 1
const STOPRECEIVING = 2
export default {
    components: {
        Header,
        TheMain,
        StartWaiting,
        EndWaiting,
        TheBottom,
        confirm,
        picBig,
        question,
        pgTip,
        loading,
        classMessage,
        message,
        TopTip
    },
    name: 'Correct',
    data() {
        return {
            // 竖屏时html的fontSize
            fontSize: 0,
            // 重置fontSize事件定时器
            resizeTimer: null,
            // 竖屏时右边的宽度设置
            width: VERTICALWIDTH, //宽度百分比
            // 屏幕的高度
            clientHeight: 0,
            // header高度
            headerHeight: 0,
            // toptip的高度
            toptipHeight: 0,
            // footer的高度
            footerHeight: 0,
            //方向
            direction: VERTICAL, //竖屏VERTICAL, 横屏HORIZONTAL， 默认竖屏
            // 屏幕方向切换事件定时器
            orientationChangeTimer: null,
            // 头部提示组件状态
            topTipContent: '当前处于批改状态，系统会自动派题，请注意查看并及时批改。', //内容
            topTipStatus: START, //start, stop
            showHead: false, // 是否显示title栏
            title: '批改中', // 标题栏内容
            btnColor: '#00BB9D',
            headBtnFont: '开始接收题目',
            showMianPi: false, // 点击了开始接替，并且匹配到题目时显示（显示答题区）
            showStartWait: false, // 点击开始时，暂时还没有收到题目的waiting
            showEndWait: false, // 点击了结束，并且答题区所有题目都已提交
            showTheBottom: false, // 显示底部按钮组
            jdPicLook: false, // 解答题图片预览组件的显示隐藏
            taskData: {}, // 放后台传过来的题目信息
            homeworkId: '', // 学生作业ID
            btnStatus: STOPRECEIVING, // 当前按钮状态，正在接题，点击了停止
            AnswerArr: [], // 放答案
            QuesChoose: '',
            QuesDetail: '',
            tipContent: '退出页面，将停止接收新题目<br/>是否退出？',
            sureTxt: '退出',
            cancelTxt: '取消',
            tipHead: '提示',
            loadTip: '',
            sucessTip: ''
        }
    },
    created() {
        this.taskData = {}
        this.AnswerArr = []
        // 通知Native屏幕常亮
        this.$client.system('ScreenBrightOn', {})
        if (cookie.get('showHeader') == 'true') {
            this.showHead = true
        } else {
            this.showHead = false
        }
        let _this = this
        setTimeout(function() {
            if (cookie.get('S_L_S') != 1) {
                _this.$router.push({
                    path: `/login`
                })
            }
        }, 100)
    },
    mounted() {
        let _this = this
        // 设置rem fontSize像素 0.0179910045
        // this.$refs.allWrapper.style.fontSize = ~~(window.document.documentElement.getBoundingClientRect().width * 0.0179910045) + 'px'
        // this.fontSize = document.getElementsByTagName('html')[0].style.fontSize
        this.fontSize = window.document.documentElement.style.fontSize
        // // 监听屏幕切换事件
        // window.addEventListener("orientationchange", this.listenOrientationChange)
        // // 重置html的fontSize
        // window.addEventListener('resize', this.listenResize)
        this.loadTip = '请稍等...'
        // 监听返回键
        cookie.set('outKey', '0')
        this.backBtn()
        // 调用开始接题前的接口，成功开始接题
        this.$http.post('/ycorrect/question/startCorrectQuestion', {}, {}).then(response => {
            this.loadTip = ''
            if (response.data.ret_code == 0) {
                console.log('开始成功！')
                this.setTopTipStatus(STOP) // 状态转变为绿色按钮
                this.topTipClick() // 调用点击事件，开始接收
                // 设置topTip状态
                // topTipContent
                // topTipStatus
            } else {
                this.$store.dispatch('ERROR_MESSAGE', response.data.ret_msg)
            }
        }, ({ response }) => {
            this.loadTip = ''
            this.$store.dispatch('ERROR_MESSAGE', '网络异常')
        })
    },
    updated() {
        // 设置等待组件高度
        // if (this.direction === HORIZONTAL) {
        this.getHeight()
        // }
        // console.log(window.document.documentElement.style.fontSize)
    },
    // beforeDestory () {
    //   window.removeEventListener("orientationchange", this.listenOrientationChange)
    //   window.removeEventListener('resize', this.listenResize)
    // },
    methods: {
        timeOutStop() {
            this.taskData = {}
            this.AnswerArr = []
            this.stopReceiving()
            // 30秒未操作，停止批改
            // this.headBtnFont = "开始接收题目"
            // this.topTipContent = "已停止接收题目，点击右侧按钮，开始接收新的题目"
            this.showStartWait = false
            this.showEndWait = true
            this.showMianPi = false
            this.showTheBottom = false
            // 播放体质接收题目的音乐
            this.$refs.getMusic.currentTime = 0
            this.$refs.stopMusic.currentTime = 0
            this.$refs.startMusic.currentTime = 0
            // 停止接题
            this.$refs.stopMusic.play()
            this.$refs.getMusic.pause()
            this.$refs.startMusic.pause()
            this.setTopTipStatus(STOP)
            // this.btnColor = "#00BB9D";
            // this.$refs.headBtn.style.background = this.btnColor;
        },
        /**
         * 头部提示的点击事件
         * @Author   Chuckle
         * @DateTime 2018-05-10
         */
        topTipClick() {
            let _this = this
            this.backBtn() // 调用返回键事件
            if (this.topTipStatus === START) {
                this.$refs.getMusic.currentTime = 0
                this.$refs.stopMusic.currentTime = 0
                this.$refs.startMusic.currentTime = 0
                // 停止接题
                setTimeout(function() {
                    _this.$refs.stopMusic.play()
                }, 10)
                this.$refs.getMusic.pause()
                this.$refs.startMusic.pause()
                this.setTopTipStatus(STOP)
            } else if (this.topTipStatus === STOP) {
                this.$refs.getMusic.currentTime = 0
                this.$refs.stopMusic.currentTime = 0
                this.$refs.startMusic.currentTime = 0
                // 开始接题
                this.$refs.stopMusic.pause()
                this.$refs.getMusic.pause()
                setTimeout(function() {
                    _this.$refs.startMusic.play()
                }, 10)
                this.setTopTipStatus(START)
            }
        },
        /**
         * 设置toptip状态
         * @Author   Chuckle
         * @DateTime 2018-05-10
         * @param {String} val 组件顶部自定义的START和STOP
         */
        setTopTipStatus(val) {
            if (val === START) {
                this.topTipContent = '当前处于批改状态，系统会自动派题，请注意查看并及时批改。'
                this.topTipStatus = START
                // 正在答题时点击开始答题
                if (this.showMianPi) {
                    // 后端交互
                    console.log('在答题中点击了开始')
                } else {
                    // 没答题，正在等待状态，点击开始
                    this.showStartWait = true
                    this.showEndWait = false
                    this.showTheBottom = false
                    this.taskData = {}
                    this.AnswerArr = []
                    this.getSubject()
                }
                this.btnStatus = RECEIVING
            } else if (val === STOP) {
                this.topTipContent = '已停止接收题目，点击右侧按钮，开始接收新的题目。'
                this.topTipStatus = STOP
                // 正在答题时点击停止答题
                if (this.showMianPi) {
                    // 后端交互
                    console.log('点击了停止答题')
                } else {
                    // 还没开始答题，点击停止答题,显示停止答题的waiting
                    this.showStartWait = false
                    this.showEndWait = true
                    this.showTheBottom = false
                    this.taskData = {}
                    this.AnswerArr = []
                    this.stopReceiving()
                }
                this.btnStatus = STOPRECEIVING
            }
        },
        /**
         * 获取高度
         * @Author   Chuckle
         * @DateTime 2018-05-10
         */
        getHeight() {
            // this.$nextTick(() => {
            // let clientHeight = document.documentElement.clientHeight
            // if (this.$refs.header && this.$refs.topTip) {
            //   this.mainHeight = clientHeight - this.$refs.header.$el.clientHeight
            //   this.subjectHeight = clientHeight - this.$refs.header.$el.clientHeight - this.$refs.topTip.$el.clientHeight
            // }
            this.clientHeight = document.documentElement.clientHeight
            if (this.$refs.header) {
                this.headerHeight = this.$refs.header.$el.clientHeight
            }
            if (this.$refs.topTip) {
                this.toptipHeight = this.$refs.topTip.$el.clientHeight
            }
            if (this.$refs.footer) {
                this.footerHeight = this.$refs.footer.$el.clientHeight
            }
            // })
        },
        /**
         * 监听屏幕切换事件
         * @Author   Chuckle
         * @DateTime 2018-05-10
         */
        listenOrientationChange() {
            clearTimeout(this.orientationChangeTimer)
            this.orientationChangeTimer = setTimeout(() => {
                if ((window.orientation === 0 || window.orientation === 180) && this.direction === HORIZONTAL) {
                    this.changeDirection()
                } else if ((window.orientation === 90 || window.orientation === -90) && this.direction === VERTICAL) {
                    this.changeDirection()
                }
            }, 0)
        },
        /**
         * 监听窗口变动事件
         * @Author   Chuckle
         * @DateTime 2018-05-10
         */
        listenResize() {
            // let time = 0
            clearTimeout(this.resizeTimer)
            this.resizeTimer = setTimeout(() => {
                window.document.documentElement.style.fontSize = this.fontSize
                this.getHeight()
            }, 400)
        },
        AnswerGet(arr) {
            this.AnswerArr = JSON.parse(arr);
        },
        ImgPopNow() {
            this.jdPicLook = true;
        },
        closeImgPlus() {
            cookie.set('imgIndex', '')
            cookie.set('JDimgArr', '')
            this.jdPicLook = false
        },
        // 点击提问题回话
        putQuestion() {
            if (this.$refs.ques) {
                this.$refs.ques.show()
            }
        },
        /**
         * 改变横竖屏方向
         * @Author   Chuckle
         * @DateTime 2018-05-10
         */
        changeDirection() {
            this.$client.system('ScreenConfigChanges')
            if (this.direction === VERTICAL) {
                this.direction = HORIZONTAL
                this.width = HORIZONTALWIDTH
                this.$store.dispatch(
                    'ERROR_MESSAGE',
                    '请开启手机横屏功能，并将手机横向放置'
                );
            } else if (this.direction === HORIZONTAL) {
                this.direction = VERTICAL
                this.width = VERTICALWIDTH
            } else {
                throw new Error('direction值错误')
            }
            console.log(`屏幕方向为${this.direction === VERTICAL ? '竖屏' : '横屏'}`)
        },
        // 提交反馈
        subQues(reasonChoose, otherReson, subjectId) {
            let _this = this
            console.log(reasonChoose, otherReson, subjectId)
            // 提交后台同事调用loadding
            this.loadTip = '正在提交...'
            // 后台数据请求
            this.$http.post('/ycorrect/question/feedback', {}, {
                params: {
                  source: _this.taskData.source,
                  bizId: subjectId,
                  content: otherReson,
                  type: reasonChoose
                }
            }).then(response => {
              if (response.data.ret_code == 0) {
                  this.loadTip = ''
                  _this.sucessTip = '提交成功'
                  _this.taskData = {}
                  _this.AnswerArr = []
                  setTimeout(function() {
                    _this.sucessTip = ''
                    // 下一题或停止答题
                    _this.OnOrStop(2)
                  }, 1500)
              } else {
                  this.$store.dispatch('ERROR_MESSAGE', response.data.ret_msg)
              }
            }, ({ response }) => {
                this.$store.dispatch('ERROR_MESSAGE', '网络异常')
            })
        },
        // 提交答案
        comitRe() {
            if (!this.AnswerArr.length) {
                console.log('还没批改，点击了提交')
                return
            } else {
                console.log('提交结果', this.AnswerArr)
                this.showTheBottom = false
                this.OnOrStop(1)
            }
        },
        // 取消退出
        cancelOut() {
            // 监听屏幕切换事件
            window.addEventListener('orientationchange', this.listenOrientationChange)
        },
        // 退出确定
        certification() {
            //  提示弹窗确认
            
            // 停止音乐
            this.$refs.stopMusic.pause()
            this.$refs.getMusic.pause()
            this.$refs.startMusic.pause()
            this.$refs.getMusic.currentTime = 0
            this.$refs.stopMusic.currentTime = 0
            this.$refs.startMusic.currentTime = 0
            
            // 回收题目
            this.$http.post('/ycorrect/question/stopGetCorrectQuestion', {}, {}).then(response => {
                  console.log(response)
                  if (response.data.ret_code == 0) {
                      // 防止退出组件还轮询
                      this.taskData = { i: 1 }
                      // 告诉native端变为竖屏模式
                      this.$router.push({
                          path: `/home`
                      })
                  } else {
                      this.$store.dispatch('ERROR_MESSAGE', response.data.ret_msg)
                  }
              }, ({ response }) => {
                  this.$store.dispatch('ERROR_MESSAGE', '网络异常')
              })
        },
        backBtn() {
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
                // 点击返回键，将蒋婷横竖屏取消，如果点击取消在监听
                window.removeEventListener(
                    'orientationchange',
                    _this.listenOrientationChange
                )
                // 返回设置为竖屏显示
                _this.direction = VERTICAL
                _this.width = VERTICALWIDTH
                // 点击返回键回掉
                if (_this.btnStatus == RECEIVING) {
                    // 正在批改
                    if (_this.$refs.confirm) {
                        _this.$refs.confirm.show()
                    }
                } else {
                    if (_this.$refs.confirm) {
                        _this.$refs.confirm.show()
                    }
                }
            })
        },
        // 提交答案或者点击反馈后的后续操作封装
        OnOrStop(num) {
            let _this = this
            // 提交答案
            if (num == 1) {
                // 后台提交，成功后再请求数据
                let thisAnData = {} // 共同必须有的
                let DingAnData = {} // 订正题必须传的
                let anArr = [] // 非订正填空的答案数组
                let DingAnArr = [] // 订正填空答案数组
                if (this.taskData.question.type == 'FILL_BLANK') {
                    // 填空题订正
                    if (this.taskData.correctAnswers) {
                        for (let i = 0; i < this.taskData.correctAnswers.length; i++) {
                          DingAnArr.push(this.AnswerArr[2 * i + 1])
                          anArr.push(this.AnswerArr[2 * i])
                        }
                        thisAnData.studentHomeworkQuestionId = this.taskData.studentHomeworkQuestion.id
                        thisAnData.answerResults = anArr
                        thisAnData.costTime = this.$refs.mianAll.allTime
                        // 订正题相关答案
                        DingAnData.studentHomeworkQuestionId = this.taskData.correctHomeworkQuestion.id
                        DingAnData.answerResults = DingAnArr
                        // 初始化答案
                        thisAnData = JSON.stringify(thisAnData)
                        DingAnData = JSON.stringify(DingAnData)
                    } else {
                        // 填空题非订正
                        thisAnData.studentHomeworkQuestionId = this.taskData.studentHomeworkQuestion.id
                        thisAnData.answerResults = this.AnswerArr
                        thisAnData.costTime = this.$refs.mianAll.allTime
                        DingAnData = ''
                        // 初始化答案
                        thisAnData = JSON.stringify(thisAnData)
                    }
                } else {
                    // 解答题订正
                    if (this.taskData.correctHomeworkQuestion) {
                        thisAnData.studentHomeworkQuestionId = this.taskData.studentHomeworkQuestion.id
                        thisAnData.rightRate = this.AnswerArr[0]
                        thisAnData.costTime = this.$refs.mianAll.allTime
                        // 订正题相关答案
                        DingAnData.studentHomeworkQuestionId = this.taskData.correctHomeworkQuestion.id
                        DingAnData.rightRate = this.AnswerArr[1]
                        // 初始化答案
                        thisAnData = JSON.stringify(thisAnData)
                        DingAnData = JSON.stringify(DingAnData)
                    } else {
                        // 解答题非订正
                        thisAnData.studentHomeworkQuestionId = this.taskData.studentHomeworkQuestion.id
                        thisAnData.rightRate = this.AnswerArr[0]
                        thisAnData.costTime = this.$refs.mianAll.allTime
                        DingAnData = ''
                        // 初始化答案
                        thisAnData = JSON.stringify(thisAnData)
                    }
                }
                console.log(thisAnData, DingAnData)
                // let Params = new URLSearchParams();
                // Params.append("json", thisAnData);
                // Params.append("correctJson", DingAnData);
                let Params = {}
                Params.json = thisAnData
                Params.correctJson = DingAnData
                Params.source = this.taskData.source
                this.loadTip = "正在提交..."
                // 如果是提交答案
                this.$http.post("/ycorrect/question/correct", Qs.stringify(Params), {headers: { "Content-Type": "application/x-www-form-urlencoded" }}).then(response => {
                    this.loadTip = ""
                    console.log(response.data)
                    if (response.data.ret_code == 0) {
                        // 将题目清空和答案
                        this.taskData = {}
                        this.AnswerArr = []
                        if (this.btnStatus == RECEIVING) {
                            this.showMianPi = false
                            this.showStartWait = true
                            this.showEndWait = false
                            this.getSubject()
                        } else {
                            this.taskData = {}
                            this.AnswerArr = []
                            this.stopReceiving()
                            // 后台提交，成功后，会到等待开始接题页面
                            this.showMianPi = false
                            this.showStartWait = false
                            this.showEndWait = true
                        }
                    } else {
                        console.log(response.data)
                        this.$store.dispatch('ERROR_MESSAGE', response.data.ret_msg)
                    }
                }, ({ response }) => {
                    this.loadTip = ''
                    this.$store.dispatch('ERROR_MESSAGE', '提交失败！')
                })
            } else {
                this.taskData = {}
                this.AnswerArr = []
                if (this.btnStatus == RECEIVING) {
                    this.showMianPi = false
                    this.showStartWait = true
                    this.showEndWait = false
                    this.getSubject()
                } else {
                    this.stopReceiving()
                    // 后台提交，成功后，会到等待开始接题页面
                    this.showMianPi = false
                    this.showStartWait = false
                    this.showEndWait = true
                }
            }
        },
        // 后台获取题目
        getSubject() {
            let _this = this
            this.$http.post('/ycorrect/question/getCorrectQuestion', {}, {
                params: {}
            }).then(response => {
                // console.log(response)
                if (response.data.ret_code === 0) {
                    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
                    if (response.data.ret) {
                        // 接到题目音乐
                        this.$refs.getMusic.currentTime = 0
                        this.$refs.stopMusic.currentTime = 0
                        this.$refs.startMusic.currentTime = 0
                        this.$refs.stopMusic.pause()
                        this.$refs.getMusic.play()
                        this.$refs.startMusic.pause()
                        _this.taskData = response.data.ret
                        _this.homeworkId = _this.taskData.studentHomeworkQuestion.id
                        _this.showStartWait = false
                        _this.showEndWait = false
                        _this.showMianPi = true
                        _this.showTheBottom = true
                        _this.vibration()
                        // window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub])
                    }
                    setTimeout(function() {
                        if (
                            _this.btnStatus == RECEIVING &&
                            JSON.stringify(_this.taskData) == '{}'
                        ) {
                            _this.getSubject()
                        }
                    }, 1000)
                } else {
                    setTimeout(function() {
                        if (
                            _this.btnStatus == RECEIVING &&
                            JSON.stringify(_this.taskData) == '{}'
                        ) {
                            _this.getSubject()
                        }
                    }, 1000)
                    // this.$store.dispatch("ERROR_MESSAGE", response.data.ret_msg);
                }
            }, ({ response }) => {
                // 获取题目失败，停止接题
                // this.taskData = {};
                // this.AnswerArr = [];
                // // this.stopReceiving();
                // // 将答题中状态变为0
                // this.btnStatus == 0;
                // this.headBtnFont = "开始接收题目";
                // this.topTipContent = "已停止接收题目，点击右侧按钮，开始接收新的题目";
                // this.showStartWait = false;
                // this.showEndWait = true;
                // this.showMianPi = false;
                // this.btnColor = "#00BB9D";
                // this.$refs.headBtn.style.background = this.btnColor;
                // this.$store.dispatch("ERROR_MESSAGE", "获取题目失败");
                this.taskData = {}
                this.AnswerArr = []
                setTimeout(function() {
                    if (
                        _this.btnStatus == RECEIVING &&
                        JSON.stringify(_this.taskData) == '{}'
                    ) {
                        _this.getSubject()
                    }
                }, 1000)
            })
        },
        // 结束接收题目的后台交互
        stopReceiving() {
            this.taskData = {}
            this.AnswerArr = []
            this.$http.post('/ycorrect/question/stopGetCorrectQuestion', {}, {}).then(response => {
                console.log(response)
                if (response.data.ret_code == 0) {
                    console.log(response.data)
                } else {
                    this.$store.dispatch('ERROR_MESSAGE', response.data.ret_msg)
                }
            }, ({ response }) => {
                this.$store.dispatch('ERROR_MESSAGE', '网络异常')
            })
        },
        vibration() {
            navigator.vibrate =
                navigator.vibrate ||
                navigator.webkitVibrate ||
                navigator.mozVibrate ||
                navigator.msVibrate
            if (navigator.vibrate) {
                // 支持
                console.log('支持设备震动！')
                navigator.vibrate([500, 300])
            } else {
                console.log('不支持设备震动！')
            }
        },
        getMusicP() {
            this.$refs.getMusic.currentTime = 0
            this.$refs.stopMusic.currentTime = 0
            this.$refs.startMusic.currentTime = 0
            // 停止接题
            this.$refs.stopMusic.pause()
            this.$refs.getMusic.pause()
            this.$refs.startMusic.pause()
        }
    },
    computed: {
        /**
         * 获取窗口高度减去header的高度
         * @Author   Chuckle
         * @DateTime 2018-05-10
         * @return   {number}
         */
        mainHeight() {
            if (this.showHead) {
                return this.clientHeight - this.headerHeight
            } else {
                return this.clientHeight
            }
        },
        /**
         * 获取窗口高度减去header和toptip的高度
         * @Author   Chuckle
         * @DateTime 2018-05-10
         * @return   {number}
         */
        contentHeight() {
            return this.mainHeight - this.toptipHeight
        },
        /**
         * 获取窗口高度减去header、toptip和footer的高度
         * @Author   Chuckle
         * @DateTime 2018-05-10
         * @return   {number}
         */
        middleHeight() {
            return this.contentHeight - this.footerHeight
        },
        task() {
            return JSON.stringify(this.taskData)
        },
        subResultBtn() {
            if (!this.AnswerArr.length) {
                return false
            } else {
                return true
            }
        },
        /**
         * 返回当前是否是竖屏
         * @Author   Chuckle
         * @DateTime 2018-05-10
         * @return   {Boolean}  true竖屏 false横屏
         */
        isHorizontal() {
            return this.direction === HORIZONTAL
        }
    },
    beforeRouteEnter(to, from, next) {
        console.log('Correct.Vue -->', 'beforeRouteEnter')
        cookie.set('outKey', '0')
        next(vm => {
            vm.$client.system('documentTitle', {
                title: '批改中'
            })
            // 监听屏幕切换事件
            window.addEventListener('orientationchange', vm.listenOrientationChange)
            // 重置html的fontSize
            window.addEventListener('resize', vm.listenResize)
        })
    },
    beforeRouteLeave(to, from, next) {
        console.log('Correct.Vue -->', 'beforeRouteLeave')
        window.removeEventListener('orientationchange', this.listenOrientationChange)
        window.removeEventListener('resize', this.listenResize)
        next()
    }
}
</script>

<style lang='scss' scoped>
.allWrapper {
  width: 750px;
  max-width: 750px;
  height: 100%;
  margin: 0 auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .content {
    overflow: hidden;
  }
  &.horizontal {
    width: 100%;
    max-width: 100%;
    height: 100%;
    margin: 0;
    .content {
      position: relative;
    }
  }
}
</style>
