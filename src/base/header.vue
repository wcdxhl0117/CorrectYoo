<template>
    <div class="head_wrap">
        <div class="head_back" @click="back">
            <p class="head_back_arr"></p>
            <a>返回</a>
        </div>
        {{title}}
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    methods: {
        back() {
            window.history.back()
        }
    }
}
</script>

<style scoped>
.head_wrap {
  height: 34px;
  padding: 25px;
  text-align: center;
  position: relative;
  line-height: 34px;
  font-size: 30px;
  background: #1a88e6;
  color: #ffffff;
}
.head_back_arr {
  display: inline-block;
  border-left: 2px solid;
  border-top: 2px solid;
  width: 20px;
  height: 20px;
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg); /* IE 9 */
  -moz-transform: rotate(-45deg); /* Firefox */
  -webkit-transform: rotate(-45deg); /* Safari 和 Chrome */
  -o-transform: rotate(-45deg); /* Opera */
  margin-right: -6px;
}
.head_back {
  position: absolute;
  left: 22px;
}
.head_back a {
  color: #ffffff;
}
</style>
