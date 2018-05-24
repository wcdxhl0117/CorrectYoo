<template>
    <div id="allWrapper">
        <div class="balance">
            <Header v-show="showHead==true" :title="title"></Header> 
            <div class="info-card-detail bal-card-detail">
                <Scroll 
                ref="secoller"
                class="listview" 
                :class="{'noHaveheader':showHead}"
                :data="allInfo" 
                :pullUp="true"
                :listenScroll="true"
                :probeType="3"
                @scrollToEnd="endSrcoll"
                @scroll="scrollInfo"
                >
                  <ul>
                     <li v-for="item in allInfo">
                        <div class="card-detail-line card-detail-gray">
                            <p class="p1">{{timestampToTime(item.date)}}</p>
                            <p class="p2">批改{{item.correctCount}}题</p>
                        </div>
                        <div v-if="item.correctFee!=0" class="card-detail-line card-detail-cash">
                            <p class="p1">批改费用</p>
                            <p class="p2">＋{{item.correctFee.toFixed(2)}}</p>
                        </div>
                        <div v-if="item.rewardFee!=0" class="card-detail-line card-detail-cash">
                          <p class="p1">奖励</p>
                          <p class="p2">＋{{item.rewardFee.toFixed(2)}}</p>
                      </div>
                      <div v-if="item.withdrawFee!=0" class="card-detail-line card-detail-cash">
                          <p class="p1">提现</p>
                          <p class="p2">{{item.withdrawFee.toFixed(2)}}</p>
                      </div>
                      <div v-if="item.errorFee!=0" class="card-detail-line card-detail-cash">
                          <p class="p1">批错扣费 <span class="xq" @click="toDetail(item.date)">&nbsp;&nbsp;详情</span></p>
                          <p class="p2">{{item.errorFee.toFixed(2)}}</p>
                      </div>
                      <div v-if="item.withdrawRefundFee!=0" class="card-detail-line card-detail-cash">
                          <p class="p1">提现失败</p>
                          <p class="p2">{{item.withdrawRefundFee.toFixed(2)}}</p>
                      </div>
                    </li>
                    <div ref="pullUp" class="bal-none">{{puUPLoding}}</div>
                  </ul>
                </Scroll>
            </div>
        </div>
        <loading :message="loadTip"></loading>
        <message></message>
    </div>
</template>

<script>
import loading from "@/base/loading/loading";
import cookie from "js-cookie";
import Header from "@/base/header";
import Scroll from "@/base/scroll/scroll";
import message from "@/base/message";

export default {
  components: { Header, Scroll, loading, message },
  name: "balance_detail",
  data: function() {
    return {
      showHead: false, //是否显示title栏
      title: "余额明细", //标题栏内容
      allInfo: [],
      getDataOff: true, //上拉加载的开关
      puUPLoding: "上拉加载更多",
      scrollTop: "",
      nextTimeTrp: "",
      loadTip: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    cookie.set("outKey", "0");
    next(function(vm) {
      vm.$client.system("documentTitle", {
        title: "余额明细"
      });
    });
  },
  created() {
    // 监听返回键
    cookie.set("outKey", "0");
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
    this.getDetail(this.nextTimeTrp);
  },
  mounted() {},
  methods: {
    toDetail(res) {
      console.log(res)
      // this.$router.push({
      //   path: `/wrongInfo`,
      //   query: {   
      //       d: res 
      //   }  
      // });
    },
    endSrcoll() {
      // 上拉加载
      if (this.getDataOff) {
        this.getDataOff = false;
        console.log("上拉加载");
        this.getDetail(this.nextTimeTrp);
      }
    },
    scrollInfo(pos) {
      this.scrollTop = pos.y;
      // console.log(this.scrollTop);
    },
    getDetail(timetrp) {
      this.puUPLoding = "加载中...";
      let _this = this;
      this.$http
        .post(
          "/ycorrect/user/center/myBalance",
          {},
          {
            params: {
              lastBillDate: timetrp,
              size: 20
            }
          }
        )
        .then(
          response => {
            this.puUPLoding = "上拉加载更多";
            this.getDataOff = true; //打开下拉加载的开关
            // console.log(response.data.ret);
            if (response.data.ret_code == 0) {
              let data = response.data.ret;
              if(data.correctBills.length<20){
                this.getDataOff = false;
                this.puUPLoding = "没有更多了";
              }
              for (let i = 0; i < data.correctBills.length; i++) {
                this.nextTimeTrp = data.correctBills[i].date;
                // data.correctBills[i].date = this.timestampToTime(
                //   parseInt(data.correctBills[i].date)
                // );
                // 处理数据，看是否展示，那些数据展示
                if (
                  data.correctBills[i].correctFee == 0 &&
                  data.correctBills[i].errorFee == 0 &&
                  data.correctBills[i].rewardFee == 0 &&
                  data.correctBills[i].withdrawFee == 0 &&
                  data.correctBills[i].withdrawRefundFee == 0
                ) {
                  // 都为0，数据不要
                } else {
                  this.allInfo.push(data.correctBills[i]);
                }
              }
              console.log(this.allInfo)
            } else {
              this.$store.dispatch("ERROR_MESSAGE", response.data.ret_msg);
            }
          },
          ({ response }) => {
            this.puUPLoding = "加载失败";
            this.getDataOff = true; //打开下拉加载的开关
             this.$store.dispatch("ERROR_MESSAGE", "网络异常");
          }
        );
    },
    timestampToTime(timestamp) {
      let date = new Date(timestamp); //如果timestamp为10位需要乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      let h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      let m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D;
      // return Y+M+D+h+m+s;
    }
  }
};
</script>

<style scoped>
#allWrapper {
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
.listview {
  position: fixed;
  top: 0px;
  left: 20px;
  right: 20px;
  bottom: 0;
}
.listview ul{
  /* width: 100%; */
  max-width: 750px;
  overflow-x: hidden;
  margin: 0 auto;
}
.noHaveheader {
  top: 80px;
}
/* header */
.head_wrap {
  height: 34px;
  padding: 25px;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  line-height: 34px;
  font-size: 30px;
  background: #1a88e6;
  color: #ffffff;
  z-index: 100;
}

.balance-top {
  background-color: #1a88e6;
  position: relative;
  height: 360px;
  width: 100%;
  text-align: center;
  color: #fff;
  padding-top: 90px;
  display: flex;
  justify-content: center;
}
.balance-mountain {
  position: absolute;
  bottom: 0;
  background: url("./balance_bg.jpg") no-repeat;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  z-index: 1;
}
.back-arr {
  display: inline-block;
  border-left: 2px solid;
  border-top: 2px solid;
  width: 20px;
  height: 20px;
  transform: rotate(-45deg);
}
.balance-title {
  height: 90px;
  line-height: 90px;
  position: relative;
  font-size: 33px;
}
.back {
  position: absolute;
  left: 30px;
  font-size: 30px;
}
.back a {
  color: #ffffff;
}
.balance-info {
  padding-top: 60px;
  width: 94%;
  margin: 0 auto;
}
.balance-info-title {
  display: flex;
  justify-content: space-between;
  height: 60px;
  line-height: 60px;
}
.rule-arrow {
  display: inline-block;
  border-right: 2px solid;
  border-bottom: 2px solid;
  width: 16px;
  height: 16px;
  transform: rotate(-45deg);
}
.balabce-tip {
  color: #86ccf8;
  font-size: 30px;
}
.bal-num {
  font-size: 45px;
  text-align: left;
  height: 60px;
  line-height: 60px;
}
.bal-use {
  text-align: left;
  height: 60px;
  line-height: 60px;
  font-size: 28px;
}
.info-card {
  background-color: #fff;
  border-radius: 20px;
  width: 94%;
  margin: 0 auto;
  position: relative;
  margin-top: -60px;
  box-shadow: 4px 4px 4px #c0c0c0;
  z-index: 99;
  margin-bottom: 30px;
}
.info-card-con {
  padding: 0 30px;
  overflow: hidden;
  padding-top: 18px;
  padding-bottom: 10px;
}
.info-card-con img {
  width: 90px;
  height: 92px;
  float: left;
  vertical-align: middle;
}
.info-card-con p {
  font-size: 33px;
  font-weight: 700;
  float: left;
  padding-left: 10px;
  line-height: 120px;

  line-break: 60px;
  color: #383d48;
}
.cash-arrow {
  display: inline-block;
  border-right: 2px solid;
  border-bottom: 2px solid;
  width: 20px;
  height: 20px;
  transform: rotate(-45deg);
  float: right;
  margin-top: 45px;
}
.info-card-detail {
  background-color: #fff;
  border-radius: 20px;
  width: 94%;
  margin: 0 auto;
  position: relative;
  border: 1px solid #c0c0c0;
  box-shadow: 2px 2px 2px #c0c0c0;
  z-index: 99;
  margin-bottom: 30px;
}
.info-card-detail h1 {
  border-bottom: 1px solid #d3dde5;
  font-size: 33px;
  font-weight: 700;
  height: 90px;
  line-height: 90px;
  padding-left: 30px;
  color: #383d48;
}
.info-card-detail ul li {
  border-bottom: 3px solid #f0f0f0;

  padding: 0 30px;
}
.card-detail-line {
  /* display: flex;
  justify-content: space-between; */
  height: 60px;
  line-height: 60px;
  color: #383d48;
}
.card-detail-line .p1 {
  float: left;
}
.card-detail-line .p2 {
  float: right;
}
.xq{
  color: #007aff;
}
.card-detail-gray {
  color: #96aab4;
  font-size: 24px;
}
.card-detail-cash p {
  font-size: 30px;
}
.card-detail-cash .p2 {
  font-weight: 700;
}
.bal-more a {
  display: block;
  color: #007aff;
  font-weight: 700;
  text-align: center;
  width: 100%;
  font-size: 30px;
  height: 90px;
  line-height: 90px;
}

/**明细页面开始**/
.balance-detail {
  width: 100%;
}
.balance-detail-top {
  background-color: #1987e6;
  width: 100%;
  text-align: center;
  color: #fff;
  display: flex;
  justify-content: center;
}
.bal-card-detail {
  border-radius: 0;
  /* width: 100%; */
  box-shadow: none;
}
.bal-none {
  font-size: 24px;
  text-align: center;
  color: #839096;
  height: 90px;
  line-height: 90px;
  background-color: #e9e9eb;
}

/**帮助中心开始**/
.helper-card {
  background-color: #fff;
  padding: 0 30px;
  margin-bottom: 20px;
}
.helper-title {
  border-bottom: 1px solid #d3dde5;
  height: 90px;
  line-height: 90px;
  color: #1a88e6;
  font-weight: 700;
  font-size: 33px;
  position: relative;
  padding-left: 20px;
}
.helper-title span {
  border-left: 3px solid #1a88e6;
  width: 0;
  height: 36px;
  display: inline-block;
  position: absolute;
  left: 0;
  top: 32px;
}
.helper-content {
  padding: 15px 0;
  line-height: 45px;
  font-size: 30px;
}
.helper-content span {
  font-weight: 700;
}
</style>
