<template>
    <div class="img-view">
        <div class="theTop">
          <img @click="closePopImg" class="commentclose" src="./commentclose.png" alt="">
          <div class="prevBtn">
              <img @click="prevClick" :src="prevBtnBg">
          </div>
          <div class="nowNum">
              <span>{{nowNum+1}}/{{imgArr.length}}</span>
          </div>
          <div class="nextBtn">
              <img @click="nextClick" :src="nextBtnBg" alt="">
          </div>
        </div>
        <div class="img">
            <img ref="imgPlus" :src="imgArr[nowNum]">
        </div>
        <div class="theBtm">
          <img @click="smallClick" class="small" :src="smallBtnBg" alt="">
          <img @click="bigClick" class="big" :src="bigBtnBg" alt="">
          <img @click="tranImg(90)" class="right" src="./right.png" alt="">
        </div>
    </div>
</template>

<script>
import cookie from "js-cookie";
export default {
  data: function() {
    return {
      nowNum: 1,
      bigSmall: false,
      current: 0,
      imgArr: [
        // "http://img.taopic.com/uploads/allimg/120727/201995-120HG1030762.jpg",
        // "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2855034090,3563845855&fm=27&gp=0.jpg",
        // "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2363381210,3320941679&fm=27&gp=0.jpg",
        // "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4237912649,2177909106&fm=27&gp=0.jpg"
      ]
    };
  },
  mounted() {
    //  那图片数据和nowNum
    this.nowNum = parseInt(cookie.get("imgIndex"));
    this.imgArr = JSON.parse(cookie.get("JDimgArr"));
  },
  computed: {
    //  计算按钮路径
    prevBtnBg() {
      if (this.nowNum == 0) {
        return require("./Prepage_unclick.png");
      } else {
        return require("./Prepage.png");
      }
    },
    nextBtnBg() {
      if (this.nowNum == this.imgArr.length - 1) {
        return require("./nextpage_unclick.png");
      } else {
        return require("./nextpage.png");
      }
    },
    smallBtnBg() {
      if (this.bigSmall) {
        return require("./narrow.png");
      } else {
        return require("./narrow_unclick.png");
      }
    },
    bigBtnBg() {
      if (this.bigSmall) {
        return require("./enlarge_unclick.png");
      } else {
        return require("./enlarge.png");
      }
    }
  },
  methods: {
    prevClick() {
      this.nowNum--;
      if (this.nowNum < 0) {
        this.nowNum = 0;
      } else {
        this.smallClick();
        this.tranImg(-this.current);
      }
    },
    nextClick() {
      this.nowNum++;
      if (this.nowNum > this.imgArr.length - 1) {
        this.nowNum = this.imgArr.length - 1;
      } else {
        this.smallClick();
        this.tranImg(-this.current);
      } 
    },
    smallClick() {
      if (this.bigSmall) {
        this.bigSmall = false;
        this.$refs.imgPlus.style.width = "100%";
      } else {
      }
    },
    bigClick() {
      if (this.bigSmall) {
      } else {
        this.bigSmall = true;
        this.$refs.imgPlus.style.width = "150%";
      }
    },
    closePopImg() {
      this.$emit("closeImgPop");
    },
    tranImg(trun) {
      this.current = (this.current + trun) % 360;
      this.$refs.imgPlus.style.transform = "rotate(" + this.current + "deg)";
      this.$refs.imgPlus.style.webkitTransform = "rotate(" + this.current + "deg)";
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s linear;
  transform: translate3D(0, 0, 0);
}

.fade-enter,
.fade-leave-active {
  transform: translate3D(100%, 0, 0);
}

/* bigimg */
.img-view {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 1);
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.theTop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  color: #ffffff;
}
.theTop .prevBtn img {
  position: absolute;
  top: 38px;
  left: 162px;
  width: 130px;
  height: 32px;
}
.theTop .nowNum {
  position: absolute;
  top: 38px;
  left: 350px;
  font-size: 30px;
  height: 32px;
  line-height: 32px;
  color: #ffffff;
}
.commentclose {
  position: absolute;
  top: 22px;
  left: 12px;
  width: 32px;
  height: 32px;
  padding: 15px;
}
.theTop .nextBtn img {
  position: absolute;
  top: 38px;
  right: 162px;
  width: 130px;
  height: 32px;
}
.theBtm {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  color: #ffffff;
}
.theBtm .small {
  width: 100px;
  height: 32px;
  position: absolute;
  top: 30px;
  left: 76px;
}
.theBtm .big {
  width: 100px;
  height: 32px;
  position: absolute;
  top: 30px;
  right: 326px;
}
.theBtm .right{
  width: 100px;
  height: 32px;
  position: absolute;
  top: 30px;
  right: 76px;
}
.img-view .img {
  position: absolute;
  top: 100px;
  bottom: 100px;
  left: 0;
  right: 0;
  overflow: auto;
  /* display: -webkit-flex;
  justify-content: center;
  align-items: center; */
}
/* .img-view .img::-webkit-scrollbar {
  display: none;
} */

.img-view .img img {
  width: 750px;
  height: auto;
  /* vertical-align: middle; */
}
.rotate{
  position: absolute;
  z-index: 10000
}
</style>
