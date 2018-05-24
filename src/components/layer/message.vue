<template>
    <transition name="fade" mode="out-in">
        <div class="message" v-if="message.length" >
            <div class="box">
                <div v-html="message"></div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState({
            message: state => state.message
        })
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
}

.message .box {
    height: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
}

.message .box>div {
    background-color: rgba(10, 10, 10, 0.7);
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
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
