<template>
    <transition name="fade" mode="out-in">
        <div class="message" v-if="message.length" >
            <div class="box">
                <div class="div1">
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
            type: String
        },
        imgSrc: {
            type: String,
            default: require('./sucess.png')
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
  height: 240px;
  width: 300px;
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
}

.message .box .div1 {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 25px 15px 0;
  color: #fff;
  font-size: 25px;
  border-radius: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -120px;
  margin-left: -150px;
  width: 270px;
  height: 200px;
  text-align: center;
  display: inline-block;
  line-height: 40px;
}
.message .box img {
  width: 100px;
  height: 100px;
  text-align: center;
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
