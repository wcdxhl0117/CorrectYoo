<template>
    <div class="fullPage"
         v-if="isClose" @touchmove.prevent>
        <div class="how">
            <p class="tit">如何获取红包</p>
            <p class="content">
                1.在[查缺补漏]或[超越自我]类别中，每天完成一份在线练习，即可获得一个礼包。
            </p>
            <p class="content">
                2.每人每天最多可获得1个礼包
            </p>
            <div class="sure"
                 @click="close">确定</div>
        </div>
    </div>
</template>

<script>
export default {
    props: [ 'isClose' ],
    data: function () {
        return {
            closeCon: false
        }
    },
    methods: {
        close: function () {
            this.$emit('fromWays', this.closeCon)
        }
    }
}
</script>

<style scoped>
.fullPage {
    width: 100%;
    min-height: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
}

.how {
    width: 550px;
    height: 450px;
    background-color: #f8f9fa;
    border-radius: 15px;
    margin: 360px auto 0 auto;
}

.tit {
    color: #383d48;
    font-weight: 600;
    font-size: 32px;
    text-align: center;
    padding-top: 45px;
}

.content {
    width: 430px;
    font-size: 30px;
    text-align: justify;
    margin: 35px auto 0 auto;
    line-height: 45px;
}

.sure {
    color: #2990e7;
    font-size: 32px;
    width: 100%;
    border-top: 2px solid #dee6ee;
    margin-top: 45px;
    text-align: center;
    padding-top: 20px;
}
</style>
