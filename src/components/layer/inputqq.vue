<template>
    <div class="fullPage"
         @touchmove.prevent
         v-if="isInput">
        <div class="box">
            <div class="main">
                <img src="../../assets/img/team/back.png"
                     class="back"
                     @click="back()">
                <p class="tit">兑换礼包中的奖品</p>
                <p class="hint">集齐10Q点可以兑换1Q币，集齐20Q点可以兑换2Q币，依次类推。未满10的倍数不予兑换</p>
                <p class="content">请输入你的QQ号码，小悠会在活动结束后，直接将Q币充值到填写的QQ账户中。</p>
                <div class="submit">
                    <input v-model="number"
                           placeholder="请输入QQ号码"
                           :class="redClass"></input>
                    <button @click="submit">提交</button>
                    <p class="qqError" v-if="noError">QQ号格式不正确</p>
                </div>
            </div>
            <footer>请于2018.01.25前提交你的联系方式，过期后奖品作废。如有其它问题请联系小悠，小悠QQ：3196426910</footer>
        </div>
    </div>
</template>
    
<script>
export default {
    props: ['isInput'],
    data: function () {
        return {
            number: '',
            prizeShow: true,
            inputShow: true,
            redClass: '',
            noError: false
        }
    },
    methods: {
        back: function () {
            this.$emit('fromInput', this.prizeShow)
        },
        // 提交qq号码
        submit: function () {
            let bValidate = RegExp(/^[1-9][0-9]{4,10}$/).test(this.number)
            if (bValidate) {
                this.redClass = ''
                this.$http.post('/zy/m/s/examActivity01/saveQQ', {}, {
                    params: {
                        code: this.$route.params.code,
                        qq: this.number
                    }
                }).then((response) => {
                    if (response.data.ret_code === 0) {
                        this.$emit('fromSubmit', this.inputShow, this.number)
                    }
                }, (response) => {
                    // to do
                })
            } else {
                this.redClass = 'redborder'
                this.noError = true
            }
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
    color: #fff;
    font-weight: 600;
    font-size: 35px;
    text-align: center;
    margin-top: 30px;
}

.hint {
    margin: 55px auto 0 auto;
    color: #fff600;
    font-size: 28px;
    width: 680px;
    text-align: justify;
    line-height: 40px;
}

.content {
    color: #fff;
    font-size: 28px;
    line-height: 40px;
    text-align: justify;
    width: 680px;
    margin: 20px auto 0 auto;
}

input {
    width: 435px;
    height: 100px;
    border-radius: 10px;
    padding-left: 35px;
    font-size: 35px;
}

:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #d3dde5;
    font-size: 30px;
}

::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #d3dde5;
    font-size: 30px;
}

input:-ms-input-placeholder {
    color: #d3dde5;
    font-size: 30px;
}

input::-webkit-input-placeholder {
    color: #d3dde5;
    font-size: 30px;
}

.submit {
    width: 690px;
    height: 150px;
    margin: 20px auto 0 auto;
}

button {
    color: #fff;
    font-size: 32px;
    width: 170px;
    height: 100px;
    border-radius: 10px;
    background-color: #2ab7f7;
    margin-left: 20px;
}

footer {
    color: #64b9fa;
    font-size: 23px;
    width: 680px;
    margin: 0px auto 0 auto;
    line-height: 35px;
}

.back {
    position: absolute;
    top: 35px;
    left: 35px;
    width: 20px;
}

.redborder {
    border: 2px solid #f14b40;
}
.qqError {
    color: #f14b40;
    font-size: 22px;
    margin-top: 10px;
} 
</style>
