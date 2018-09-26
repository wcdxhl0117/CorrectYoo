<template>
    <transition name="fade" mode="out-in">
        <div class="message" v-if="message.length" >
            <div class="box">
                <div class="">
                    <img :src="imgSrc">
                    <p v-html="message"></p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            default: ''
        },
        imgSrc: {
            type: String,
            default: require('./loadinngBg.png')
        },
        count: {
            type: String,
            default: ''
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
  height: auto;
  width: 300px;
}

.message .box > div {
  background-color: rgba(0, 0, 0, 0.7);
  padding-top: 25px;
  color: #fff;
  font-size: 25px;
  border-radius: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -85px;
  margin-left: -135px;
  height: 170px;
  width: 270px;
  text-align: center;
  display: inline-block;
  line-height: 40px;
}
.message .box img {
  width: 100px;
  height: 100px;
  text-align: center;
  animation: rot 2s linear infinite;
}
/* 旋转 */
@keyframes rot {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
