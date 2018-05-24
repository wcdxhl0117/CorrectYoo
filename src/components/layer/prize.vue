<template>
    <div class="fullPage"
         v-if="isPrize">
        <div class="box">
            <div class="main">
                <img src="../../assets/img/team/close.png"
                     class="close"
                     @click="close()">
                <p class="tit">我的礼包</p>
                <p class="num">（一共获得了{{ num }}个礼包）</p>
                <ul class="space">
                    <li class="list"
                        v-for="(item,index) in prizeList">
                        <p class="awardsTime">{{ awardsTime[index] }}</p>
                        <img src="../../assets/img/team/treasure.png"
                             v-show="item.viewed == 0"
                             class="treasure"
                             @click="touchPrize(index)"
                             ref="items">
                        <img :src="item.img"
                             v-show="item.viewed == 1"
                             :class="item.className"
                             ref="cards" />
                    </li>
                </ul>
                <button @click="exchange()">兑换礼包中的奖品</button>
            </div>
        </div>
    </div>
</template>
    
<script>
export default {
    props: ['isPrize', 'num'],
    data: function () {
        return {
            prizeList: [1, 2, 3, 4],
            prizeClose: false,
            exchangeVal: false,
            isinputedprize: false,
            isTouch: false,
            awardsTime: []
        }
    },
    mounted: function () {
        console.log('hahahhaah')
        this.$http.post('/zy/m/s/examActivity01/getGifts', {}, {
            params: {
                code: this.$route.params.code
            }
        }).then((response) => {
            let list = response.data.ret.gifts
            for (let gif of list) {
                gif.className = gif.viewed === 1 ? 'card' : 'cardanmiate'
                switch (gif.value0) {
                    case 0: {
                        gif.img = require('../../assets/img/team/card02.png')
                        break
                    }
                    case 2: {
                        gif.img = require('../../assets/img/team/card04.png')
                        break
                    }
                    case 5: {
                        gif.img = require('../../assets/img/team/card03.png')
                        break
                    }
                    case 10: {
                        gif.img = require('../../assets/img/team/card01.png')
                        break
                    }
                }
            }
            this.prizeList = list
            for (let i = 0; i < this.prizeList.length; i++) {
                this.awardsTime.push(this.getTimeStr(this.prizeList[i].createAt))
            }
            console.log(this.prizeList)
            // this.prizeList[0].viewed = 1 // for test
            if (response.data.ret.needQQ) {
                this.exchangeVal = true
            } else {
                this.isinputedprize = true
            }
        }, (response) => {
            // to do
        })
    },
    methods: {
        close: function () {
            this.$emit('fromPrize', this.prizeClose)
        },
        exchange: function () {
            this.$http.post('/zy/m/s/examActivity01/getGifts', {}, {
                params: {
                    code: this.$route.params.code
                }
            }).then((response) => {
                if (response.data.ret.needQQ) {
                    this.exchangeVal = true
                } else {
                    this.isinputedprize = true
                }
                this.$emit('fromPrizeChange', this.exchangeVal, this.isinputedprize)
            }, (response) => {
                // to do
            })
        },
        touchPrize: function (index) {
            let self = this
            let img = this.$refs.items[index]
            this.$http.post('/zy/m/s/examActivity01/confirmGift', {}, {
                params: {
                    giftId: this.prizeList[index].id
                }
            }).then((response) => {
                // 打开礼包
                if (response.data.ret_code === 0) {
                    img.className = 'tr-active'
                    self.prizeList[index].className = 'cardanmiate'
                    self.prizeList[index].viewed = 1
                    setTimeout(function () {
                        self.prizeList[index].className = 'card'
                    }, 500)
                    // need change the viewed ，这里需要调用改变 这个礼品viewed字段的接口
                }
            }, (response) => {
                // to do
            })
        },
        // 格式化时间
        getTimeStr: function (s) {
            let d = new Date(s)
            let y = d.getFullYear()
            let mon = d.getMonth() + 1
            let day = d.getDate()
            if (mon < 10) {
                mon = '0' + mon
            }
            if (day < 10) {
                day = '0' + day
            }
            return y + '.' + mon + '.' + day
        }
    }
}
</script>
    
<style scoped>
.fullPage {
    width: 100%;
    min-height: 100%;
    position: absolute;
    top: 0px;
    background-color: rgba(0, 0, 0, 0.5)
}

.box {
    width: 750px;
    height: 560px;
    background-color: #1a88e6;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
}

.tit {
    font-size: 32px;
    color: #fff;
    text-align: center;
    margin-top: 30px;
}

.num {
    color: #fff;
    font-size: 25px;
    text-align: center;
    margin-top: 35px;
}

.list {
    display: inline-flex;
    justify-content: center;
    /*align-items:center;*/
    width: 180px;
    height: 220px;
    margin-right: 15px;
    margin-left: 30px;
    background-image: url(../../assets/img/team/treasure_bottom.jpg);
    background-size: 180px 220px;
    position: relative;
}

.space {
    width: 100%;
    display: inline;
    white-space: nowrap;
    overflow-x: auto;
    float: left;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    margin-top: 40px;
}

.space::-webkit-scrollbar {
    display: none;
}

button {
    width: 690px;
    height: 95px;
    background-color: #2ab7f7;
    border-radius: 10px;
    margin-top: 37px;
    color: #fff;
    font-size: 30px;
}

.main {
    text-align: center;
}

.close {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 35px;
    left: 700px;
}

.treasure {
    width: 92px;
    height: 105px;
    left: 50px;
    position: absolute;
    animation-name: 'ripple';
    animation-duration: 1s;
    animation-timing-function: ease;
    /*动画频率，和transition-timing-function是一样的*/
    animation-delay: 0s;
    /*动画延迟时间*/
    animation-iteration-count: infinite;
    /*定义循环资料，infinite为无限次*/
    animation-direction: alternate;
    /*定义动画方式*/
    -webkit-animation-name: 'ripple';
    -webkit-animation-duration: 1.5s;
    -webkit-animation-timing-function: ease;
    /*动画频率，和transition-timing-function是一样的*/
    -webkit-animation-delay: 0s;
    /*动画延迟时间*/
    -webkit-animation-iteration-count: infinite;
    /*定义循环资料，infinite为无限次*/
    -webkit-animation-direction: alternate;
    /*定义动画方式*/
    top: 20%;
}

@keyframes ripple {
    0% {
        transform: scale(0.8);
        /*width:90px;
        height:102px;*/
    }
    100% {
        transform: scale(1);
        /*width:109px;
        height:124px;*/
    }
}

.tr-active {
    opacity:0;
    animation-play-state: paused;
    -webkit-animation-play-state: paused;
}

.card {
    width: 180px;
    height: 220px;
    position: absolute;
    left: 0px;
    
}

.cardanmiate {
    width: 180px;
    height: 220px;
    position: absolute;
    left: 0px;
    animation-name: 'lottery';
    animation-duration: 1s;
    animation-timing-function: ease;
    /*动画频率，和transition-timing-function是一样的*/
    animation-delay: 0s;
    /*动画延迟时间*/
    animation-iteration-count: 1;
    /*定义循环资料，infinite为无限次*/
    animation-direction: alternate;
    /*定义动画方式*/
    -webkit-animation-name: 'ripple';
    -webkit-animation-duration: 1s;
    -webkit-animation-timing-function: ease;
    /*动画频率，和transition-timing-function是一样的*/
    -webkit-animation-delay: 0s;
    /*动画延迟时间*/
    -webkit-animation-iteration-count: 1;
    /*定义循环资料，infinite为无限次*/
    -webkit-animation-direction: alternate;
    /*定义动画方式*/
    
}

.awardsTime {
    position: absolute;
    top: 195px;
    color: #dc9642;
    font-size: 20px;
    left: 40px;
}
</style>
