<template>
    <div class="headWrap">
        <p class="headTip">{{tip}}</p>
        <p ref="headBtn" @click="BtnClick" class="headBtn">{{btnFont}}</p>
    </div>
</template>

<script>
export default {
  components: {},
  name: "topTip",
  props: {
    tip: {
      type: String,
      default: ""
    },
    btnFont: {
      type: String,
      default: ""
    }
  },
  data: function() {
    return {
      btnColor: "#F14B40"
    };
  },
  mounted() {
    this.$refs.headBtn.style.background = this.btnColor;
  },
  methods: {
    BtnClick() {
      if (this.btnColor == "#F14B40") {
        this.btnColor = "#00BB9D";
        this.$refs.headBtn.style.background = "#00BB9D";
        this.$emit("headBtnClick", 1);
      } else {
        this.btnColor = "#F14B40";
        this.$refs.headBtn.style.background = "#F14B40";
        this.$emit("headBtnClick", 2);
      }
    }
  }
};
</script>

<style scoped>
.headWrap {
  height: 100px;
  width: 100%;
  background: #f8c438;
  position: relative;
}
.headWrap .headTip {
  position: absolute;
  top: 22px;
  left: 30px;
  width: 420px;
  line-height: 30px;
  font-size: 24px;
  color: #383d48;
}
.headWrap .headBtn {
  position: absolute;
  top: 25px;
  right: 30px;
  height: 50px;
  width: 210px;
  border-radius: 25px;
  font-size: 24px;
  color: #ffffff;
  text-align: center;
  line-height: 50px;
}
</style>
