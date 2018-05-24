<template>
    <transition name="fade" mode="out-in">
        <div class="message" v-if="message.length" >
            <div class="box">
                <div class="t_all_wrap">
                  <p v-html="message"></p>
                  <div class="t_btm">
                    <img :src="imgSrc">
                    <span>{{count}}</span>
                  </div>
                  
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
      default: ""
    },
    imgSrc: {
      type: String,
      default: require("./sucess.png")
    },
    count: {
      type: String,
      default: ""
    }
  }
};
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
  /* height: 270px;
  width: 340px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
}

.message .box .t_all_wrap {
  background-color: rgba(0, 0, 0, 0.7);
  padding-top: 25px;
  color: #fff;
  font-size: 25px;
  border-radius: 8px;
  height: 170px;
  width: 270px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -85px;
  margin-left: -135px;
  text-align: center;
  display: inline-block;
  line-height: 40px;
}
.message .box p {
  font-size: 34px;
  color: #ffffff;
}
.message .box .t_btm {
  height: 110px;
  line-height: 110px;
  text-align: center;
  width: 100%;
  margin-top: 15px;
}
.message .t_btm img {
  width: 100px;
  height: 100px;
  margin-top: 6px;
  vertical-align: top;
}
.message .box span {
  font-size: 62px;
  display: inline-block;
  color: #f8c438;
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
