<template>
  <div class="waitingWrap" :style="mainStyles">
    <div class="inner">
      <img class="img" src="./stopWaiting.png">
      <h4 class="title">已停止接收题目</h4>
      <!-- <p class="content">点击右上角按钮，开始批改题目</p> -->
      <div class="btnWrap">
        <p class="btn" @click="startJ">开始接收题目</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    
  },
  props: {
    width: {
      type: [Number, String],
      default: 100
    },
    height: {
      type: [Number, String],
      default: 100
    },
    styles: {
      type: Object
    }
  },
  data () {
    return {

    }
  },
  mounted() {

  },
  methods: {
    startJ() {
      this.$emit("endStart")
    }
  },
  computed: {
    mainStyles () {
      let style = {}
      // const width = parseInt(this.width)
      const width = this.width
      const height = this.height

      const styleWidth = {
        width: width <= 100 ? `${width}%` : `${width}px`,
        height: `${height}px`
      }
      const customStyle = this.styles ? this.styles : {}
      Object.assign(style, styleWidth, customStyle)
      return style
    }
  }
};
</script>

<style lang='scss' scoped>
.waitingWrap {
  position: relative;
  width: 100%;
  display: table;
  .inner {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    padding: 4px 10px;
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // text-align: center;
    // transform: translate(-100%, -100%);
    .img {
      // margin-top: 30px;
      width: 290px;
      height: 166px;
    }
    .tip {
      margin-top: 30px;
      font-size: 30px;
      color: #1a88e6;
      line-height: 48px;
    }
    .title {
      margin-top: 58px;
      font-size: 34px;
      color: #383d48;
      line-height: 48px;
      font-weight: 600;
    }
    .content {
      margin-top: 30px;
      font-size: 24px;
      color: #839096;
      line-height: 48px;
    }
    .btnWrap{
      text-align: center;
      padding: 0 20px 0 10px;
      margin: 30px auto;
    }
    .btn{
      display: inline-block;
      white-space: nowrap;
      height: 50px;
      // width: 210px;
      padding: 6px 30px;
      border-radius: 28px;
      font-size: 30px;
      color: #ffffff;
      text-align: center;
      line-height: 50px;
      background: #00BB9D;
    }
  }
}

</style>