<template>
    <transition name="fade" mode="out-in">
        <div class="message" v-if="message.length" >
            <div class="box">
                <div class="">{{message}}</div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        message: {
            type: String
        }
    }
}
</script>

<style scoped>
.message {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2000;
}

.message .box {
    height: 100%;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    -webkit-align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
    text-align: center;
}

.message .box>div {
    background-color: rgba(10, 10, 10, 1);
    padding: 15px 20px;
    color: #fff;
    font-size: 25px;
    border-radius: 8px;
    min-width: 260px;
    max-width: 500px;
    display: inline-block;
    line-height: 40px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
