<template>
    <div class="allWrapper">
      <Header v-show="showHead==true" :title="title"></Header> 
      <div class="chooseWrap">
        <div v-if="!schoolList.length" class="chooseList lis">
          <!-- 点击带参数，记录城市 -->
          <div v-for="(item,index) in dataArr">
            <p  @click="chooseClick(item.code)">{{item.name}}</p>
            <img src="./hui_jian.png" alt="">
          </div>
        </div>
        <!-- 学校列表 -->
        <div v-if="schoolList.length" class="schoolList lis">
          <div v-for="(item,index) in dataArr">
            <p @click="chooseClick(item.code)">{{item.name}}</p>
          </div>
        </div>
      </div>

      <loading :message="loadTip"></loading>
    </div>
</template>

<script>
import loading from "@/base/loading/loading";
import cookie from "js-cookie";
import Header from "@/base/header";

export default {
  components: { Header, loading },
  name: "area",
  data: function() {
    return {
      showHead: false, //是否显示title栏
      title: "学校认证", //标题栏内容
      schoolChoose: "", // 放选中的学校
      dataArr: [], //后台数据集合
      schoolList: [],
      loadTip: ""
    };
  },
  created() {
    if (cookie.get("showHeader") == "true") {
      this.showHead = true;
    } else {
      this.showHead = false;
    }
    let _this = this;
    setTimeout(function() {
      if (cookie.get("S_L_S") != 1) {
        _this.$router.push({
          path: `/login`
        });
      }
    }, 100);
    this.getCity(" ");
  },
  methods: {
    chooseClick(code) {
      console.log(code);
      if (code) {
        // 用点击城市的code请求数据，在跟新dataArr
        this.getCity(code);
      } else {
      }
    },
    getCity(code) {
      this.$http
        .post(
          "/common/district/query",
          {},
          {
            params: {
              pcode: code
            }
          }
        )
        .then(
          response => {
            console.log(response.data.ret);
            if (response.data.ret_code == 0) {
              let data = response.data.ret;
              this.showTip = !data.authenticated;
              this.dataArr = data;
            }
          },
          ({ response }) => {
            this.$store.dispatch("ERROR_MESSAGE", response.statusText);
          }
        );
    }
  }
};
</script>

<style scoped>
.allWrapper {
  width: 750px;
  max-width: 750px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: auto;
  margin: 0 auto;
}
.lis {
  height: 80px;
  width: 100%;
  line-height: 80px;
  font-size: 30px;
  color: #383d48;
  border-bottom: 1px solid #f0f0f0;
}
.lis div {
  width: 710px;
  margin: 0 auto;
  height: 80px;
}
.lis div p {
  width: 694px;
  float: left;
}
.lis div img {
  /* text-align: right; */
  width: 16px;
  height: 28px;
  margin-top: 26px;
  float: left;
}
</style>
