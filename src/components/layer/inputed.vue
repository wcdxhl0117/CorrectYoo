<template>
    <div class="fullPage"
         @touchmove.prevent
         v-if="isInputed">
        <div class="box">
            <div class="main">
                <img src="../../assets/img/team/back.png"
                     class="back"
                     @click="back()">
                <p class="tit">兑换礼包中的奖品</p>
                <p class="hint">集齐10Q点可以兑换1Q币，集齐20Q点可以兑换2Q币，依次类推。未满10的倍数不予兑换</p>
                <p class="content">已经提交QQ号，小悠会在活动结束后，直接将Q币充值到填写的QQ账户中。</p>
                <p class="number">你的QQ号：{{ qqNum }}</p>
            </div>
            <footer>请于2018.01.25前提交你的联系方式，过期后奖品作废。如有其它问题请联系小悠，小悠QQ：3196426910</footer>
        </div>
    </div>
</template>
    
<script>
export default {
    props: ['isInputed', 'qqNum'],
    data: function () {
        return {
            inputPrize: true
        }
    },
    // mounted: function () {
    //     this.$http.post('/zy/m/s/examActivity01/getUser', {}, {
    //         params: {
    //             code: this.$route.params.code
    //         }
    //     }).then((response) => {
    //         if (response.data.ret.user) {
    //             this.qqNum = response.data.ret.user.qq
    //         }
    //     }, (response) => {
    //         // to do
    //     })
    // },
    methods: {
        back: function () {
            this.$emit('fromInputed', this.inputPrize)
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

footer {
    color: #64b9fa;
    font-size: 23px;
    width: 680px;
    margin: 40px auto 0 auto;
    line-height: 35px;
}

.back {
    position: absolute;
    top: 35px;
    left: 35px;
    width: 20px;
}

.number {
    width: 690px;
    height: 95px;
    margin: 40px auto 0 auto;
    background-color: #2ab7f7;
    border-radius: 10px;
    color: #fff;
    font-size: 36px;
    text-align: center;
    line-height: 95px;
}
</style>
