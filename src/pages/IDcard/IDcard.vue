<template>  
  <div ref="allWrapper" id="allWrapper">
    <Header v-show="showHead==true" :title="title"></Header> 
    <div v-show="noPass" class="noPassTip">
      <img src="./no.png">
      <div class="right">
        <h4>认证未通过</h4>
        <p>{{noPassReason}}</p>
      </div>
    </div>

    <P style="height:10px;background:#e9e9eb;width:100%"></P>
    <div class="clum">
        <p>真实姓名</p>
        <input type="text" v-model="relName" maxlength="15">
    </div>
    <div class="clum">
        <p>身份证号</p>
        <input v-model="CardNum" type="text" placeholder="请输入身份证号"  onKeyUp="value=value.replace(/[^\d|[a-zA-Z]/g,'')">
    </div>
    <!-- 间隙 -->
    <P style="height:10px;background:#e9e9eb;width:100%"></P>

    <p class="thetip">请上传身份证照片</p>
    <div class="upLoad" @click="showTipUp">
        <img v-show="!showImg" class="delImgUp" @click.stop="delUpImg" src="./delImgUp.png" alt="">
        <img ref="imgShow" class="imgYuLan" :src="headerImage">
        <img v-show="showImg" class="upBg" src="./jia.png">
        <p v-show="showImg">点击上传图片</p>
        <!-- <input type="file" id="upload" accept="image" @change="upload">  -->
    </div>
    <p v-show="!submitYes" ref="btn" class="btn">提交</p>
    <p v-show="submitYes" ref="btn" @click="submitImg" class="btn" style="background:#1A88E6;">提交</p>
    <p class="lastTip">你的信息仅用于平台审核，绝不外泄</p>
    <message></message>
    <classMessage :message="TheMessage"></classMessage>
    <!-- 弹窗 -->
    <transition name="fade">
      <div v-if="showPop" class="upTip">
        <div class="tipInner">
          <div class="innerTop">
            <img @click="closePop" src="./close.png">
            <span>实名认证</span>
          </div>
          <div class="innerImg">
            <img src="./eg.png" alt="">
          </div>
          <p class="tipTxt">请提交身份证正面照片，确保文字清晰、无反光、无遮挡</p>
          <div class="innerBtn">
            <input type="file" id="upload" accept="image" @change="upload">
            <p>拍照或选择相册图片</p>
          </div>
        </div>
      </div>
    </transition>

    <loading :message="loadTip"></loading>
  </div>  
</template>
  
<script>
import loading from "@/base/loading/loading";
import cookie from "js-cookie";
import Header from "@/base/header";
import message from "@/base/message";
import classMessage from "@/base/classMessage";
import Exif from "exif-js";

export default {
  components: { Header, message, classMessage, loading },
  name: "teacherCert",
  data() {
    return {
      showHead: false, //是否显示title栏
      title: "实名认证", //标题栏内容
      showImg: true,
      headerImage: "",
      picValue: "",
      relName: "",
      noPass: false, // 是否是审核未通过
      noPassReason: "",
      CardNum: "",
      TheMessage: "", // classMessage的提示
      showPop: false,
      loadTip: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    cookie.set("outKey", "0");
    next(function(vm) {
      vm.$client.system("documentTitle", {
        title: "实名认证"
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
    if (this.$route.query.passStu == 3) {
      this.noPass = true;
    }
    this.getIDData();
  },
  mounted() {
    // this.backBTN();
  },
  computed: {
    submitYes() {
      if (this.CardNum && this.headerImage && this.relName) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    submitImg() {
      let _this = this;
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
      // 提实名信息
      if (!this.CardNum) {
        return;
      } else if (!this.headerImage) {
        return;
      } else if (!reg.test(this.CardNum)) {
        this.$store.dispatch("ERROR_MESSAGE", "身份证信息输入有误");
      } else {
        // 提交图片
        if (this.headerImage) {
          // let params = new URLSearchParams();
          // params.append("base64Size", this.headerImage.length);
          // params.append("baseData", this.headerImage);
          let params = {};
          params.base64Size = this.headerImage.length;
          params.baseData = this.headerImage;

          this.$http
            .post(
              "/f/up/base64/answer-img",
              {},
              {
                data: {
                  base64Size: this.headerImage.length,
                  base64Data: this.headerImage,
                  base64Type: "jpeg"
                }
              }
            )
            .then(
              response => {
                console.log(response.data.ret);
                if (response.data.ret_code == 0) {
                  let thisImgId = response.data.ret.id;
                  this.$http
                    .post(
                      "/ycorrect/user/center/submitIDCardAuth",
                      {},
                      {
                        params: {
                          imgId: thisImgId,
                          realName: this.relName,
                          idCard: this.CardNum
                        }
                      }
                    )
                    .then(
                      response => {
                        if (response.data.ret_code == 0) {
                          this.TheMessage = "提交成功<br/>等待审核通过";
                          setTimeout(function() {
                            _this.TheMessage = "";
                            window.history.back();
                          }, 1500);
                        } else {
                          this.$store.dispatch(
                            "ERROR_MESSAGE",
                            response.data.ret_msg
                          );
                        }
                      },
                      ({ response }) => {
                        this.$store.dispatch(
                          "ERROR_MESSAGE",
                          response.statusText
                        );
                      }
                    );
                } else {
                  this.$store.dispatch("ERROR_MESSAGE", response.data.ret_msg);
                }
              },
              ({ response }) => {
                this.$store.dispatch("ERROR_MESSAGE", "网络异常");
              }
            );
        }

        // 提交
        // this.TheMessage = "提交成功<br/>等待审核通过";
        // setTimeout(function() {
        //   _this.TheMessage = "";
        //   window.history.back();
        // }, 1500);
      }
    },
    showTipUp() {
      this.showPop = true;
      this.$refs.allWrapper.scrollTop = 0;
      this.$refs.allWrapper.style.overflow = "hidden";
    },
    closePop() {
      this.showPop = false;
      this.$refs.allWrapper.style.overflow = "auto";
    },
    delUpImg() {
      this.headerImage = "";
      this.showImg = true;
      this.$refs.imgShow.style.display = "none";
    },
    upload(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.imgPreview(this.picValue);
      this.closePop();
    },
    imgPreview(file) {
      let self = this;
      let Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, "Orientation");
      });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= 100 * 1024) {
            self.headerImage = this.result;
            self.postImg();
          } else {
            img.onload = function() {
              let data = self.compress(img, Orientation);
              self.headerImage = data;
              self.postImg();
            };
          }
          // 图片处理好了，自己写的后面的vue逻辑
          self.$refs.imgShow.style.display = "block";
          // 上传图片的+号和文字消失
          self.showImg = false;
        };
      }
    },
    postImg() {
      //这里写接口
    },
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == "right") {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180;
      let ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    compress(img, Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
        console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = width * height / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            this.rotateImg(img, "left", canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            this.rotateImg(img, "right", canvas);
            break;
          case 3: //需要180度旋转
            this.rotateImg(img, "right", canvas); //转两次
            this.rotateImg(img, "right", canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.1);
      console.log("压缩前：" + initSize);
      console.log("压缩后：" + ndata.length);
      console.log(
        "压缩率：" + ~~(100 * (initSize - ndata.length) / initSize) + "%"
      );
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    getIDData() {
      this.$http
        .post(
          "/ycorrect/user/center/getIDCardAuth",
          {},
          {
            params: {}
          }
        )
        .then(
          response => {
            console.log(response.data);
            if (response.data.ret_code == 0) {
              let data = response.data.ret;
              // this.relName = data.realname;
              // 防止私改链接的路由参数乱跳转
              if (data.idCardAuthStatus == "PASS") {
                // this.$router.push({
                //   path: `/IDpass`
                // });
              } else if (data.idCardAuthStatus == "CHECK") {
                // this.$router.push({
                //   path: `/IDwating`
                // });
              } else if (data.idCardAuthStatus == "FAIL") {
                this.noPass = true;
                this.noPassReason = data.noPassReason;
              } else if (data.idCardAuthStatus == "DEFAULT") {
                // 未认证
              }
            } else {
              this.$store.dispatch("ERROR_MESSAGE", response.data.ret_msg);
            }
          },
          ({ response }) => {
            this.$store.dispatch("ERROR_MESSAGE", "网络异常");
          }
        );
    },
    backBTN() {
      var _this = this;
      /**
       * 使用 HTML5 的 History 新 API pushState 来曲线监听 Android 设备的返回按钮
       * XBack.listen(function(){
          alert('oh! you press the back button');
        });
      */
      !(function(pkg, undefined) {
        var STATE = "x-back";
        var element;
        var onPopState = function(event) {
          event.state === STATE && fire();
        };
        var record = function(state) {
          history.pushState(state, null, location.href);
        };
        var fire = function() {
          var event = document.createEvent("Events");
          event.initEvent(STATE, false, false);
          element.dispatchEvent(event);
        };
        var listen = function(listener) {
          element.addEventListener(STATE, listener, false);
        };
        !function() {
          element = document.createElement("span");
          window.addEventListener("popstate", onPopState);
          this.listen = listen;
          this.record = record(STATE);
          record(STATE);
        }.call((window[pkg] = window[pkg] || {}));
      })("XBack");
      XBack.listen(function() {
        // 点击返回键回掉
        _this.$router.push({
          path: `/personal`
        });
      });
    }
  }
};
</script>  
  
<style scoped>
#allWrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 750px;
  max-width: 750px;
  height: 100%;
  font-size: 30px;
  margin: 0 auto;
}
.clum {
  /* width: 100%; */
  height: 100px;
  display: flex;
  display: -webkit-flex;
  background: #ffffff;
  border: 1px solid #ededf3;
}
.clum p {
  width: 244px;
  height: 100px;
  line-height: 100px;
  padding-left: 20px;
  font-size: 34px;
  color: #383d48;
  font-weight: 900;
}
.clum input {
  height: 40px;
  padding: 30px 0;
  line-height: 40px;
  font-size: 34px;
  color: #383d48;
}
.noPassTip {
  width: 710px;
  height: 230px;
  position: relative;
  margin: 0 auto;
  border-bottom: 2px solid #e5e5e5;
}
.noPassTip img {
  height: 102px;
  width: 102px;
  position: absolute;
  top: 74px;
  left: 40px;
}
.noPassTip .right {
  position: absolute;
  top: 86px;
  left: 160px;
}
.noPassTip .right h4 {
  height: 42px;
  font-size: 34px;
  font-weight: 900;
  color: rgba(241, 75, 64, 1);
  line-height: 42px;
}
.noPassTip .right p {
  height: 42px;
  font-size: 24px;
  color: rgba(241, 75, 64, 1);
  line-height: 42px;
}
.thetip {
  height: 100px;
  padding: 0 20px;
  line-height: 100px;
  color: #383d48;
  font-weight: 900;
}
#upload {
  width: 710px;
  height: 436px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.upLoad {
  width: 710px;
  height: 436px;
  background: #f6f6f6;
  position: relative;
  margin: 0 auto;
  border: 2px dashed #839096;
  border-radius: 16px;
}
.delImgUp {
  width: 72px;
  height: 72px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
.upLoad .imgYuLan {
  width: 710px;
  height: 436px;
  border-radius: 16px;
  display: none;
}
.upLoad .upBg {
  position: absolute;
  top: 114px;
  left: 282px;
  width: 140px;
  height: 140px;
}
.upLoad p {
  position: absolute;
  top: 274px;
  left: 0;
  width: 100%;
  text-align: center;
  color: #839096;
}
.btn {
  width: 710px;
  height: 100px;
  line-height: 100px;
  margin: 50px auto 30px;
  background: #d3dde5;
  border-radius: 50px;
  color: #ffffff;
  text-align: center;
  font-size: 34px;
  font-weight: 900;
}
.lastTip {
  text-align: center;
  color: #839096;
  font-size: 24px;
}
.upTip {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.7);
}
.upTip .tipInner {
  position: absolute;
  height: auto;
  overflow: auto;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
}
.upTip .tipInner::-webkit-scrollbar {
  display: none;
}
.innerTop {
  height: 92px;
  width: 100%;
  text-align: center;
  line-height: 92px;
  position: relative;
}
.innerTop span {
  color: #383d48;
  font-weight: 900;
}
.innerTop img {
  position: absolute;
  top: 0;
  padding: 35px 30px;
  left: 0;
  width: 20px;
  height: 20px;
}
.innerImg img {
  width: 710px;
  height: 498px;
  margin-left: 20px;
}
.tipTxt {
  font-size: 24px;
  color: #839096;
  height: 90px;
  line-height: 90px;
  text-align: center;
}
.innerBtn {
  width: 710px;
  height: 90px;
  margin: 0 auto;
  margin-bottom: 20px;
  border-radius: 45px;
  border: 2px solid #1a88e6;
  text-align: center;
  line-height: 90px;
  color: #1a88e6;
  position: relative;
}
#upload {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style> 