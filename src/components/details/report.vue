<template>
    <div class="full">
        <div v-if="allKip">
            <h1 class="tit">{{ chapterNum }}</h1>
            <swiper :options="swiperOption"
                    class="allContent">
                <swiper-slide v-for="(items,sign) in oneLevel"
                              :key="items"
                              class="content"
                              :class="{'isContent': !isChapter[sign]}">
                    <h2 class="oneLevel"><span class="oneLevelSign">{{ oneLevel[sign] }}</span></h2>
                    <ul class="kpNumList">
                        <!--有章小节-->
                        <li v-for="(chapterList,index) in chapters[sign]"
                            class="twoLevel"
                            v-if="isChapter[sign]">
                            <div class="twoLevelTit"
                                 @click="deploy(sign,index)">
                                <span class="kpList">{{ chapterList }}</span>
                                <span class="knowNum">（{{ knowNum[sign][index] }}个{{ iserrorknow }}）</span>
                                <img src="../../assets/img/team/btn_downarrow@2x.png"
                                     class="small"
                                     v-if="isDeploy[sign][index]">
                                <img src="../../assets/img/team/btn_uparrow@2x.png"
                                     class="small"
                                     v-if="!isDeploy[sign][index]">
                            </div>
                            <ul>
                                <li v-for="(chapterChildList,num) in chapterChild[sign][index]"
                                    v-if="isDeploy[sign][index]"
                                    class="deploy">
                                    <a class="everyDetails"
                                       @click="openStaskLink(env.URL_WEB_M+'/page/mobile/s/knowpoint-card-detail.html?id='+chapterChildList.kpCode)">
                                        <span class="everyChapterList">{{ chapterChildList.kpName }}</span>
                                        <span class="alChapterList"
                                              v-if="chapterChildList.doCount !== '0'">已练{{ chapterChildList.doCount }}题</span>
                                        <span class="alChapterList"
                                              v-else></span>
                                        <span :class="cGclass[sign][index][num]">{{ cGrade[sign][index][num] }}</span>
                                    </a>
                                </li>
                            </ul>
                            <ul class="twoLevelContent"
                                v-if="isDeploy[sign][index] && isWeekCodes[sign][index].length"
                                @click="changeLearn(sign,index)">
                                <li>
                                    <div class="weakPoint weakTwo">
                                        <div class="arrowCon1">本节薄弱知识点针对性练习
                                            <img src="../../assets/img/team/arrow.png"
                                                 class="arrow1">
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <!--无薄弱和一般-->
                            <ul class="twoLevelContent"
                                v-if="isDeploy[sign][index] && !isWeekCodes[sign][index].length">
                                <li>
                                    <div class="weakPoint weakTwo weakEdit">
                                        <div class="arrowCon1">本节暂无薄弱知识点
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <!--无章小节-->
                        <li v-for="(noChapterList,index) in noChapter[sign]"
                            v-if="!isChapter[sign]"
                            class="noTwoLevel">
                            <a class="everyDetails"
                               @click="openStaskLink(env.URL_WEB_M+'/page/mobile/s/knowpoint-card-detail.html?id='+kpCode[sign][index])">
                                <span class="kpList">{{ noChapterList }}</span>
                                <span class="doCount"
                                      v-if="kpNum[sign][index] !== '0'">已练{{ kpNum[sign][index] }}题</span>
                                <span class="doCount"
                                      v-else></span>
                                <span class="rev"
                                      :class="gclass[sign][index]">{{ grade[sign][index] }}</span>
                            </a>
                        </li>
                        <div class="weakPoint"
                             v-if="!isChapter[sign] && isChapterWeek[sign].length"
                             @click="openLearn(sign)">
                            <div class="arrowCon">本节薄弱知识点针对性练习
                                <img src="../../assets/img/team/arrow.png"
                                     class="arrow">
                            </div>
                        </div>
                        <!--无薄弱知识点-->
                        <div class="weakPoint weakEdit"
                             v-if="!isChapter[sign] && !isChapterWeek[sign].length">
                            <div class="arrowCon">本节暂无薄弱知识点
                            </div>
                        </div>
                    </ul>
                </swiper-slide>
                <div class="swiper-pagination"
                     slot="pagination">
                </div>
            </swiper>
            <message :message="classMessage"
                     v-if="isMessage"></message>
        </div>
    </div>
</template>
    
<script>
// var mySwiper = new Swiper('.swiper-container', {})
// console.log(mySwiper.activeIndex)
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import '@/assets/css/swiper-3.4.2.min.css'
import { mapState } from 'vuex'
import cookie from 'js-cookie'
import Message from '@/components/layer/classMessage'
export default {
    props: {
        allKip: {},
        iserrorknow: {}
    },
    components: {
        swiper,
        swiperSlide,
        Message
    },
    computed: {
        ...mapState(['env'])
    },
    data: function () {
        return {
            chapterNum: '',
            oneLevel: [],
            swiperOption: {
                pagination: '.swiper-pagination',
                slidesPerView: 'auto',
                centeredSlides: true,
                paginationClickable: true,
                spaceBetween: 20,
                paginationElement: 'li',
                paginationBulletRender: (swiper, index, className) => {
                    return '<span ' + swiper.container[0].attributes[0].name + ' class="' + className + ' swiper-pagination-bullet-custom"></span>'
                }
            },
            chapters: [],
            isChapter: [],
            noChapter: [],
            kpNum: [],
            kpCode: [],
            gclass: [],
            grade: [],
            knowNum: [],
            sClass: 'small',
            chapterChild: [],
            cGrade: [],
            cGclass: [],
            isDeploy: [],
            isWeekCodes: [],
            isChapterWeek: [],
            DEVICE_TYPE: '',
            _VERSION: '',
            newVer: '',
            isMessage: false,
            classMessage: '请升级到最新版本查看详情',
            provisory: false
        }
    },
    mounted: function () {
        this.DEVICE_TYPE = cookie.get('DEVICE_TYPE')
        this._VERSION = cookie.get('_VERSION')
        this.newVer = parseInt(this._VERSION.replace(/[^0-9]/ig, ''))
        console.log(this.allKip)
        if (this.allKip) {
            this.chapterNum = this.allKip.sectionName
            for (let i = 0; i < this.allKip.childKpList.length; i++) {
                this.oneLevel.push(this.allKip.childKpList[i].name)
                // 章小节
                this.chapters.push([])
                this.noChapter.push([])
                this.kpNum.push([])
                this.kpCode.push([])
                this.gclass.push([])
                this.grade.push([])
                this.knowNum.push([])
                this.chapterChild.push([])
                this.cGrade.push([])
                this.isDeploy.push([])
                this.cGclass.push([])
                this.isWeekCodes.push([])
            }
            for (let i = 0; i < this.chapters.length; i++) {
                // 有章小节
                if (this.allKip.childKpList[i].children) {
                    for (let j = 0; j < this.allKip.childKpList[i].children.length; j++) {
                        this.chapters[i].push(this.allKip.childKpList[i].children[j].name)
                        this.knowNum[i].push(this.allKip.childKpList[i].children[j].kpCount)
                        this.chapterChild[i].push(this.allKip.childKpList[i].children[j].kpList)
                        this.cGrade[i].push([])
                        this.cGclass[i].push([])
                        if (this.allKip.childKpList[i].children[j].weekCodes) {
                            this.isWeekCodes[i].push(this.allKip.childKpList[i].children[j].weekCodes)
                        } else {
                            this.isWeekCodes[i].push([])
                        }
                        // 判断是否为每一章第一个小节
                        if (j === 0) {
                            this.isDeploy[i].push(true)
                        } else {
                            this.isDeploy[i].push(false)
                        }
                        // 判断每个知识点的掌握情况
                        if (this.allKip.childKpList[i].children[j].kpCount) {
                            for (let n = 0; n < this.allKip.childKpList[i].children[j].kpList.length; n++) {
                                // this.cGrade[i][j].push(this.allKip.childKpList[i].children[j].kpList[n].status)
                                switch (this.allKip.childKpList[i].children[j].kpList[n].status) {
                                    case 'EXCELLENT':
                                        this.cGrade[i][j].push('优秀')
                                        this.cGclass[i][j].push('best')
                                        break
                                    case 'GOOD':
                                        this.cGrade[i][j].push('良好')
                                        this.cGclass[i][j].push('good')
                                        break
                                    case 'COMMONLY':
                                        this.cGrade[i][j].push('一般')
                                        this.cGclass[i][j].push('common')
                                        break
                                    case 'WEAK':
                                        this.cGrade[i][j].push('薄弱')
                                        this.cGclass[i][j].push('weak')
                                        break
                                    case 'NO_PRACTICE':
                                        this.cGrade[i][j].push('未练习')
                                        this.cGclass[i][j].push('nopractice')
                                        break
                                }
                            }
                        }
                    }
                    this.isChapter.push(true)
                    this.isChapterWeek.push([])
                } else {
                    // 无章小节
                    if (this.allKip.childKpList[i].weekCodes) {
                        this.isChapterWeek.push(this.allKip.childKpList[i].weekCodes)
                    } else {
                        this.isChapterWeek.push([])
                    }
                    for (let j = 0; j < this.allKip.childKpList[i].kpList.length; j++) {
                        this.noChapter[i].push(this.allKip.childKpList[i].kpList[j].kpName)
                        this.kpNum[i].push(this.allKip.childKpList[i].kpList[j].doCount)
                        this.kpCode[i].push(this.allKip.childKpList[i].kpList[j].kpCode)
                        switch (this.allKip.childKpList[i].kpList[j].status) {
                            case 'EXCELLENT':
                                this.grade[i].push('优秀')
                                this.gclass[i].push('best')
                                break
                            case 'GOOD':
                                this.grade[i].push('良好')
                                this.gclass[i].push('good')
                                break
                            case 'COMMONLY':
                                this.grade[i].push('一般')
                                this.gclass[i].push('common')
                                break
                            case 'WEAK':
                                this.grade[i].push('薄弱')
                                this.gclass[i].push('weak')
                                break
                            case 'NO_PRACTICE':
                                this.grade[i].push('未练习')
                                this.gclass[i].push('nopractice')
                                break
                        }
                    }
                    this.isChapter.push(false)
                }
            }
        }
        // this.$http.post('/zy/m/s/report/learning2/sectionDetail', {}, {
        //     params: { sectionCode: 1522020102 }
        // }).then((res) => {
        //     // success callback
        //     this.allKip = res.data.ret
        //     console.log(this.isChapterWeek)
        // }, (response) => {
        //     // error callback
        // })
    },
    methods: {
        deploy: function (sign, index) {
            for (let i = 0; i < this.isDeploy[sign].length; i++) {
                if (i !== index) {
                    this.$set(this.isDeploy[sign], i, false)
                }
            }
            this.$set(this.isDeploy[sign], index, !this.isDeploy[sign][index])
            console.log(this.isDeploy[sign][index])
        },
        openStaskLink: function (_url) {
            if (this.DEVICE_TYPE === 'IOS' && this.newVer <= 145) {
                this.isMessage = true
                setTimeout(() => {
                    this.isMessage = false
                }, 2000)
            } else {
                this.$client.system('openUrl', {
                    url: _url,
                    fullPath: true,
                    backRe: false
                })
            }
        },
        changeLearn: function (sign, index) {
            console.log(this.isWeekCodes[sign][index])
            let newWeekCodes = this.isWeekCodes[sign][index].join()
            // 打开针对性练习
            this.$client.system('openPertinencyLearn', {
                weekCodes: newWeekCodes,
                activityCode: this.$route.params.code
            })
        },
        openLearn: function (sign) {
            let newChapterWeek = this.isChapterWeek[sign].join()
            // 打开针对性练习
            console.log(newChapterWeek)
            this.$client.system('openPertinencyLearn', {
                weekCodes: newChapterWeek,
                activityCode: this.$route.params.code
            })
        }
    }
}
</script>
    
<style scoped>
.full {
    width: 100%;
    min-height: 100%;
    position: absolute;
    background-color: #e9e9eb;
}

.tit {
    font-size: 28px;
    text-align: center;
    line-height: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 400px;
    overflow: hidden;
    margin: auto;
}

.content {
    width: 600px;
    height: 1000px;
    background-color: #ffffff;
    border-radius: 20px;
    /*margin: auto;*/
    overflow: hidden;
}

.kpNumList::-webkit-scrollbar {
    display: none
}

.kpNumList {
    overflow: auto;
    overflow-x: hidden;
    height: 904px;
    -webkit-overflow-scrolling: touch;
}

.isContent {
    background-color: #f5f7fa;
}

.allContent {
    padding-bottom: 80px;
}

.oneLevelSign {
    font-size: 28px;
    color: #383d48;
    height: 100px;
    text-align: center;
    line-height: 100px;
    font-weight: 800;
    background-color: #ffffff;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 400px;
    overflow: hidden;
    margin: auto;
    display: block;
}

.oneLevel {
    width: 100%;
    border-bottom: 2.5px solid #d3dde5;
    /* px */
    text-align: center;
    background-color: #ffffff;
}

.twoLevel {
    /*width: 570px;*/
    /*height: 100px;*/
    border-bottom: 2.5px solid #d3dde5;
    /* px */
    font-size: 28px;
    line-height: 100px;
    /*padding-left: 30px;*/
}

.noTwoLevel {
    width: 100%;
    height: 100px;
    line-height: 100px;
    /*padding-left: 30px;*/
    font-size: 28px;
}

.best,
.good,
.common,
.weak,
.nopractice {
    border: 2.5px solid #00bb9d;
    background-color: #00bb9d;
    height: 30px;
    color: #ffffff;
    border-radius: 5px;
    line-height: 33px;
    font-size: 24px;
    width: 80px;
    text-align: center;
    vertical-align: middle;
    display: inline-block;
}

.good {
    background-color: #7dca60;
    border: 2.5px solid #7dca60;
}

.common {
    background-color: #f8c438;
    border: 2.5px solid #f8c438;
}

.weak {
    background-color: #f14b40;
    border: 2.5px solid #f14b40;
}

.nopractice {
    background-color: #b5c3c9;
    border: 2.5px solid #b5c3c9;
}

.rev {
    font-size: 30px;
    vertical-align: text-bottom;
    margin-right: 20px;
}

.doCount {
    font-size: 15px;
    color: #8a969c;
    margin-left: 45px;
    width: 150px;
    display: inline-block;
    text-align: right;
}

.kpList {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 250px;
    float: left;
    padding-left: 30px;
}

.weakPoint {
    width: 540px;
    height: 80px;
    background-color: #e8f3fc;
    text-align: center;
    border-radius: 8px;
    border: 2px solid #1a88e6; /* px */
    margin: 20px auto 30px auto;
    font-size: 23px;
    color: #1a88e6;
}
.weakEdit {
    border: 2px solid #839096; /* px */
    color: #839096;
}
.arrowCon {
    padding-top: 28px;
}

.arrowCon1 {
    line-height: 23px;
    padding-top: 28px;
}

.arrow1 {
    width: 23px;
    vertical-align: top;
}

.weakTwo {
    margin: 0 auto;
}

.knowNum {
    font-size: 20px;
    width: 250px;
    display: inline-block;
}

.swiper-pagination-bullet-custom {
    background-color: rgba(255, 255, 255, 1);
    /*width: 20px;
    height: 20px;
    border-radius: 20px;*/
    opacity: 1!important;
    display: inline-block;
}

.swiper-pagination-bullet-active {
    background-color: #1a88e6;
}

.twoLevelTit {
    width: 100%;
    /*border-bottom: 2px solid #d3dde5;*/
    /*padding-left: 30px;*/
}

.twoLevelContent {
    background-color: #f5f7fa;
    padding-bottom: 30px;
    padding-top: 30px;
}

.small {
    width: 30px;
    height: 30px;
    vertical-align: middle;
    /*margin-left: 100px;*/
}

.loadClass {
    text-align: center;
    background-color: #ededf3;
    width: 100%;
    height: 100%;
    padding-bottom: 100%;
}

.loadClass img {
    width: 60px;
    height: 60px;
    padding-top: 50%;
    align-items: center;
}

.loadClass p {
    padding-top: 20px;
    font-size: 24px;
    text-align: center;
}

.arrow {
    width: 23px;
    height: 23px;
    vertical-align: top;
}

.everyChapterList {
    padding-left: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 250px;
    float: left;
}

.alChapterList {
    /*font-size: 15px;
    margin-left: 45px;
    margin-right: 10px;
    width: 150px;
    display: inline-block;*/
    /*display: inline-block;*/
    font-size: 15px;
    color: #8a969c;
    margin-left: 60px;
    width: 150px;
    display: inline-block;
    text-align: right;
}

.deploy {
    background-color: #f5f7fa;
}

.best,
.good,
.common,
.weak,
.nopractice {
    display: inline-block;
    border: 2.5px solid #00bb9d;
    background-color: #00bb9d;
    height: 30px;
    color: #ffffff;
    border-radius: 5px;
    line-height: 33px;
    font-size: 24px;
    width: 80px;
    text-align: center;
    vertical-align: baseline;
}

.good {
    background-color: #7dca60;
    border: 2.5px solid #7dca60;
}

.common {
    background-color: #f8c438;
    border: 2.5px solid #f8c438;
}

.weak {
    background-color: #f14b40;
    border: 2.5px solid #f14b40;
}

.nopractice {
    background-color: #b5c3c9;
    border: 2.5px solid #b5c3c9;
    /*margin-right: 43px;*/
}

.everyDetails {
    display: block;
    color: #383d48;
}
</style>
