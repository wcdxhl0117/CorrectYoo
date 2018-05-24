<template>
    <transition name="fade" mode="out-in">
        <div class="message" v-if="showFlag" >
            <div class="box">
                <p @click="chooseGrade(2)">初中</p>
                <p @click="chooseGrade(3)">高中</p>
                <h2></h2>
                <p class="cancel" @click="chooseGrade(4)">取消</p>
            </div>
        </div>
    </transition>
</template>

<script>
import cookie from "js-cookie";
export default {
  props: {},
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    confirmTip() {
      this.hide();
      this.$emit("confirmTip");
    },
    chooseGrade(num) {
      // 选择后与后台交互，成功后在关闭弹窗
      if (num == 2) {
        // 初中
        this.$emit("GradeChoose", 2);
      } else if (num == 3) {
        // 高中
        this.$emit("GradeChoose", 3);
      } else {
        // 取消
      }
      this.hide();
    }
  }
};
</script>

<style scoped>
.message {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2000;
}
.message .box {
  width: 750px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: auto;
  margin: 0 auto;
  background: #ffffff;
}
.message .box p {
  height: 90px;
  width: 100%;
  text-align: center;
  font-size: 30px;
  line-height: 90px;
  border-bottom: 1px solid #f0f0f0;
}
.message .box h2 {
  height: 30px;
  width: 100%;
  background: #f0f0f0;
}
.cancel {
  color: red;
  border: none;
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
