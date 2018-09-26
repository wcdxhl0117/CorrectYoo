<template>
  <div class="waitingWrap" :style="mainStyles">
    <div class="inner">
      <img class="img" src="./Jloading.gif">
      <p class="tip">等待派题中...</p>
      <h4 class="title">有新的题目，系统会自动派题给你</h4>
      <p class="content">未停止接收新题目前，请不要关闭此页面</p>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
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
  destoryed () {

  },
  methods: {

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
  }
}

</style>
