<template>
    <div class="waitingWrap">
        <div class="inner">
          <img src="./Jloading.gif">
          <p class="p1">等待派题中...</p>
          <h4>有新的题目，系统会自动派题给你</h4>
          <p class="p2">未停止接收新题目前，请不要关闭此页面</p>
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
  width: 290px;
  height: 166px;
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
