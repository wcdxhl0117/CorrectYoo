<template>
  <div class="topTipWrap" :class='{horizontal: isHorizontal}' :style="mainStyles">
    <div class="topTip">
      <div class="contentWrap">
        <p class="content">
          {{content}}
        </p>
      </div>
      <div class="btnWrap">
        <p class="btn" :class='status' @click="click">{{buttonText}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "topTip",
  data () {
    return {

    }
  },
  props: {
    width: {
      type: [Number, String],
      default: 100
    },
    styles: {
      type: Object
    },
    content: {
      type: String,
      default: ""
    },
    horizontal: {
      type: Boolean,
      default: false
    },
    // 当前状态
    status: {
      type: String,
      default: "start" //start stop
    }
  },
  methods: {
    click () {
      this.$emit("on-click")
    }
  },
  computed: {
    /**
     * 判断当前是否是竖屏
     * @Author   Chuckle
     * @DateTime 2018-05-11
     * @return   {Boolean}  ture竖屏 false横屏
     */
    isHorizontal () {
      return this.horizontal
    },
    /**
     * 按钮内容
     * @Author   Chuckle
     * @DateTime 2018-05-11
     * @return   {String}
     */
    buttonText () {
      if (this.status === 'start' ) {
        if (!!this.isHorizontal) {
          return '停止接收'
        } else {
          return '停止接收新题目'
        }
      } else if (this.status === 'stop') {
        if (!!this.isHorizontal) {
          return '开始接收'
        } else {
          return '开始接收新题目'
        }
      } else {
        throw new Error('题目状态错误')
      }
    },
    /** 
     * topTipWrap样式设置
     * @Author   Chuckle
     * @DateTime 2018-05-11
     * @return   {Object} 
     */
    mainStyles () {
      let style = {}
      // const width = parseInt(this.width)
      const width = this.width
      const styleWidth = {
        width: width <= 100 ? `${width}%` : `${width}px`
      }
      const customStyle = this.styles ? this.styles : {}
      Object.assign(style, styleWidth, customStyle)
      return style
    }
  }
};
</script>

<style lang="scss" scoped>
.topTipWrap {
  position: relative;
  width: 100%;
  height: auto;
  background: #fcedc6;
  display: table;
  .topTip{
    display: table-row;
  }
  .contentWrap{
    padding: 22px 0 22px 30px;
    display: table-cell;
    .content {
      line-height: 32px;
      font-size: 24px;
      color: #383d48;
    }
  }
  .btnWrap{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    padding: 0 20px 0 10px;
    .btn {
      // position: absolute;
      // top: 50%;
      // right: 20px;
      // transform: translate(0, -50%);

      display: inline-block;
      white-space: nowrap;
      height: 50px;
      // width: 210px;
      padding: 0 18px;
      border-radius: 25px;
      font-size: 24px;
      color: #ffffff;
      text-align: center;
      line-height: 50px;
      &.start{
        background: #F14B40;
      }
      &.stop{
        background: #00BB9D;
      }
    }
  }
  &.horizontal{
    width: 43.77811094%;
    .contentWrap{
      .content{
        width: 100%;
      }
    }
    .btnWrap{
      .btn{
        // width: 130px;
      }
    }
  }
}
</style>
