<template>
    <div class="waitingWrap">
        <div class="inner">
          <img src="./stopWaiting.png">
          <h4>已停止接收题目</h4>
          <p class="p2">点击右上角按钮，开始批改题目</p>
        </div>
    </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data: function() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>
.waitingWrap {
  position: absolute;
  top: 180px;
  bottom: 0;
  right: 0;
  left: 0;
}
.inner {
  width: 100%;
  height: auto;
  position: absolute;
  top: 252px;
  left: 0;
  text-align: center;
}
.inner img {
  width: 300px;
  height: 200px;
}
.inner .p1 {
  font-size: 30px;
  color: #1a88e6;
  line-height: 60px;
}
.inner h4 {
  font-size: 34px;
  color: #383d48;
  line-height: 60px；;
}
.inner .p2 {
  font-size: 24px;
  color: #839096;
  line-height: 60px;
}
</style>
