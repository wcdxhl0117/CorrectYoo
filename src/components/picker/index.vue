<template>
    <div class="picker"  @touchmove.prevent>
        <transition name="fade">
            <div class="overlay" @click="cancelHandler" v-if="show"></div>
        </transition>
        <transition name="scroll">
            <div class="popup" v-if="show">
                <div class="toolbar">
                    <span @click="cancelHandler">取消</span>
                    <div class="title">{{data[0].title}}</div>
                    <span @click="sureHandler">确认</span>
                </div>
                <div class="smooth-picker flex-box">
                    <div ref="smoothGroup" v-for="(group, gIndex) in data" :key="gIndex" class="smooth-group" :class="getGroupClass(gIndex)">
                        <div class="smooth-list">
                            <div v-if="group.divider" class="smooth-item divider" :class="getItemClass(gIndex, iIndex, true)">{{ group.text }}</div>
                            <div v-else v-for="(item, iIndex) in group.list" :key="iIndex" class="smooth-item" :class="getItemClass(gIndex, iIndex)" :style="getItemStyle(gIndex, iIndex)">
                                {{ item.value || item }}
                            </div>
                        </div>
                    </div>
                    <div ref="smoothHandleLayer" class="smooth-handle-layer flex-box direction-column">
                        <div data-type="top" class="smooth-top flex-1"></div>
                        <div data-type="middle" class="smooth-middle"></div>
                        <div data-type="bottom" class="smooth-bottom flex-1"></div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #000;
    opacity: .5;
    z-index: 1000;
}

.popup {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 1001;
    height: 500px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s
}

.fade-enter,
.fade-leave-to {
    opacity: 0
}

.scroll-enter-active,
.scroll-leave-active {
    transition: bottom .2s
}

.scroll-enter,
.scroll-leave-to {
    bottom: -500px;
}

.toolbar {
    height: 80px;
    line-height: 80px;
    display: flex;
}

.toolbar .title{
    font-size: 30px;
    flex: 1;
    text-align: center
}

.toolbar>span {
    font-size: 30px;
    color: #1a88e6;
    padding: 0 20px;
}


</style>

<style lang="stylus" scoped>

  r(val)
    (val / 75) * 1rem

  $smoothPickerHeight = 320
  $smoothMiddleLayerHeight = 100

  .smooth-picker
    height: r($smoothPickerHeight)
    margin: r(50) r(75)
    position: relative
    background-color: white
    overflow: hidden
    .smooth-group
      //
    .smooth-list
      height: r(100)
      position: relative

      top: r($smoothPickerHeight / 2 - $smoothMiddleLayerHeight / 2) // half of picker height - half of item height
    .smooth-item
      position: absolute
      top: 0
      left: 0

      overflow: hidden
      width: 100%
      text-overflow: ellipsis
      white-space: nowrap
      display: block
      text-align: center

      will-change: transform
      contain: strict

      height: r(100)
      line-height: r(100)
      font-size: r(48)
    .selected-item
      //
    .smooth-handle-layer
      position: absolute
      width: 100%
      height: calc(100% + 2px)/*px*/
      left: 0
      right: 0
      top: -1px
      bottom: -1px
      .smooth-top
        border-bottom: 2px solid #ccc
        background: linear-gradient(to bottom, rgba(255,255,255,0.9) 55%, rgba(255, 255, 255, 0.5) 100%)
        transform: translate3d(0, 0, 3.625rem)
      .smooth-middle
        height: r($smoothMiddleLayerHeight)
      .smooth-bottom
        border-top: 2px solid #ccc
        background: linear-gradient(to top, rgba(255,255,255,0.9) 55%, rgba(255, 255, 255, 0.5) 100%)
        transform: translate3d(0, 0, 3.625rem)

  /* flex system */
  .flex-box
    display: flex
    for prop in column row
      &.direction-{prop}
        flex-direction: prop

    /* for items */
    for n in 1..12
      .flex-{n}
        flex: n

</style>

<script>
export default {
    name: 'popup',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default: []
        }
    },
    watch: {
        show: function (val) {
            if (val) {
                this.currentIndexList = this.getInitialCurrentIndexList()
                setTimeout(() => {
                    this.eventsRegister()
                    this.getGroupsRectList()
                }, 300)
            }
        }
    },
    data: function () {
        return {
            currentIndexList: this.getInitialCurrentIndexList(),
            groupsRectList: new Array(this.data.length),
            touchOrMouse: {
                isTouchable: 'ontouchstart' in window,
                isMouseDown: false
            },
            draggingInfo: {
                isDragging: false,
                groupIndex: null,
                startPageY: null
            }
        }
    },
    methods: {
        cancelHandler: function () {
            this.$emit('close')
        },
        sureHandler: function () {
            let ar = this.getCurrentIndexList()
            let resAr = []
            ar.forEach((item, index) => {
                resAr.push(this.data[index].list[item])
            })
            this.$emit('change', resAr)
            this.$emit('close')
        },
        setGroupData: function (gIndex, groupData) {
            this.data[gIndex] = groupData
            const iCI = groupData.currentIndex
            console.log(iCI)
            let movedIndex = 0
            if (typeof iCI === 'number' && iCI >= 0 && groupData.list && groupData.list.length && iCI <= groupData.list.length - 1) {
                movedIndex = Math.round(iCI)
            }
            this.currentIndexList[gIndex] = movedIndex
        },
        getInitialCurrentIndexList: function () {
            return this.data.map((item, index) => {
                const iCI = item.currentIndex
                if (typeof iCI === 'number' && iCI >= 0 && item.list && item.list.length && iCI <= item.list.length - 1) {
                    return Math.round(iCI)
                }
                return 0
            })
        },
        getGroupsRectList: function () {
            if (this.$refs.smoothGroup) {
                this.$refs.smoothGroup.forEach((item, index) => {
                    this.groupsRectList[index] = item.getBoundingClientRect()
                })
            }
        },
        eventsRegister: function () {
            const handleEventLayer = this.$refs.smoothHandleLayer
            if (handleEventLayer) {
                this.addEventsForElement(handleEventLayer)
            }
        },
        addEventsForElement: function (el) {
            const _ = this.touchOrMouse.isTouchable
            const eventHandlerList = [
                { name: _ ? 'touchstart' : 'mousedown', handler: this.handleStart },
                { name: _ ? 'touchmove' : 'mousemove', handler: this.handleMove },
                { name: _ ? 'touchend' : 'mouseup', handler: this.handleEnd },
                { name: _ ? 'touchcancel' : 'mouseleave', handler: this.handleCancel }
            ]
            eventHandlerList.forEach((item, index) => {
                el.removeEventListener(item.name, item.handler, false)
                el.addEventListener(item.name, item.handler, false)
            })
        },
        triggerMiddleLayerGroupClick: function (gIndex) {
            const data = this.data
            if (typeof gIndex === 'number' && typeof data[gIndex].onClick === 'function') {
                data[gIndex].onClick(gIndex, this.currentIndexList[gIndex])
            }
        },
        triggerAboveLayerClick: function (ev, gIndex) {
            const movedIndex = this.currentIndexList[gIndex] + 1
            this.$set(this.currentIndexList, gIndex, movedIndex)
            this.correctionCurrentIndex(ev, gIndex)
        },
        triggerMiddleLayerClick: function (ev, gIndex) {
            this.triggerMiddleLayerGroupClick(gIndex)
        },
        triggerBelowLayerClick: function (ev, gIndex) {
            const movedIndex = this.currentIndexList[gIndex] - 1
            this.$set(this.currentIndexList, gIndex, movedIndex)
            this.correctionCurrentIndex(ev, gIndex)
        },
        getTouchInfo: function (ev) {
            return this.touchOrMouse.isTouchable ? ev.changedTouches[0] || ev.touches[0] : ev
        },
        getGroupIndexBelongsEvent: function (ev) {
            const touchInfo = this.getTouchInfo(ev)

            for (let i = 0; i < this.groupsRectList.length; i++) {
                const item = this.groupsRectList[i]
                if (item.left < touchInfo.pageX && touchInfo.pageX < item.right) {
                    return i
                }
            }
            return null
        },
        handleEventClick: function (ev) {
            const gIndex = this.getGroupIndexBelongsEvent(ev)

            switch (ev.target.dataset.type) {
                case 'top':
                    this.triggerAboveLayerClick(ev, gIndex)
                    break
                case 'middle':
                    this.triggerMiddleLayerClick(ev, gIndex)
                    break
                case 'bottom':
                    this.triggerBelowLayerClick(ev, gIndex)
                    break
                default:
            }
        },
        handleStart: function (ev) {
            if (ev.cancelable) {
                ev.preventDefault()
                ev.stopPropagation()
            }

            const touchInfo = this.getTouchInfo(ev)
            this.draggingInfo.startPageY = touchInfo.pageY
            if (!this.touchOrMouse.isTouchable) {
                this.touchOrMouse.isMouseDown = true
            }
        },
        handleMove: function (ev) {
            ev.preventDefault()
            ev.stopPropagation()
            if (this.touchOrMouse.isTouchable || this.touchOrMouse.isMouseDown) {
                this.draggingInfo.isDragging = true
                this.setCurrentIndexOnMove(ev)
            }
        },
        handleEnd: function (ev) {
            ev.preventDefault()
            ev.stopPropagation()

            if (!this.draggingInfo.isDragging) {
                this.handleEventClick(ev)
            }
            this.draggingInfo.isDragging = false
            this.touchOrMouse.isMouseDown = false

            this.correctionAfterDragging(ev)
        },
        handleCancel: function (ev) {
            ev.preventDefault()
            ev.stopPropagation()

            if (this.touchOrMouse.isTouchable || this.touchOrMouse.isMouseDown) {
                this.correctionAfterDragging(ev)
                this.touchOrMouse.isMouseDown = false
                this.draggingInfo.isDragging = false
            }
        },
        setCurrentIndexOnMove: function (ev) {
            const touchInfo = this.getTouchInfo(ev)
            if (this.draggingInfo.groupIndex === null) {
                this.draggingInfo.groupIndex = this.getGroupIndexBelongsEvent(ev)
            }

            const gIndex = this.draggingInfo.groupIndex
            if (typeof gIndex === 'number' && (this.data[gIndex].divider || !this.data[gIndex].list)) {
                return
            }

            const moveCount = (this.draggingInfo.startPageY - touchInfo.pageY) / 20
            const movedIndex = this.currentIndexList[gIndex] + moveCount

            this.$set(this.currentIndexList, gIndex, movedIndex)

            this.draggingInfo.startPageY = touchInfo.pageY
        },
        correctionAfterDragging: function (ev) {
            const gIndex = this.draggingInfo.groupIndex
            this.correctionCurrentIndex(ev, gIndex)

            this.draggingInfo.groupIndex = null
            this.draggingInfo.startPageY = null
        },
        correctionCurrentIndex: function (ev, gIndex) {
            setTimeout(() => {
                if (typeof gIndex === 'number' && this.data[gIndex].divider !== true && this.data[gIndex].list.length > 0) {
                    const unsafeGroupIndex = this.currentIndexList[gIndex]

                    let movedIndex = unsafeGroupIndex
                    if (unsafeGroupIndex > this.data[gIndex].list.length - 1) {
                        movedIndex = this.data[gIndex].list.length - 1
                    } else if (unsafeGroupIndex < 0) {
                        movedIndex = 0
                    }
                    movedIndex = Math.round(movedIndex)
                    this.$set(this.currentIndexList, gIndex, movedIndex)
                }
            }, 100)
        },
        isCurrentItem: function (gIndex, iIndex) {
            return this.currentIndexList[gIndex] === iIndex
        },
        getCurrentIndexList: function () {
            return this.currentIndexList
        },
        getGroupClass: function (gIndex) {
            const group = this.data[gIndex]
            const defaultFlexClass = 'flex-' + (group.flex || 1)
            const groupClass = [defaultFlexClass]
            if (group.className) {
                groupClass.push(group.className)
            }
            return groupClass
        },
        getItemClass: function (gIndex, iIndex, isDevider = false) {
            const itemClass = []
            const group = this.data[gIndex]
            if (group.textAlign) {
                itemClass.push('text-' + group.textAlign)
            }
            if (!isDevider && this.isCurrentItem(gIndex, iIndex)) {
                itemClass.push('smooth-item-selected')
            }
            return itemClass
        },
        getItemStyle: function (gIndex, iIndex) {
            const gapCount = this.currentIndexList[gIndex] - iIndex
            let scale = 0.8
            if (Math.abs(gapCount) < 3) {
                let rotateStyle = 'transform: rotateX(' + (gapCount * 23 * Math.pow(scale, Math.abs(gapCount))) + 'deg) translate3d(0, 0, 3.625rem);' +
                    'font-size:' + 48 / 75 * Math.pow(scale, Math.abs(gapCount)) + 'rem;'
                if (!this.draggingInfo.isDragging) {
                    rotateStyle += ' transition: all 150ms ease-out;'
                }
                return rotateStyle
            }
            if (gapCount > 0) {
                return 'transform: rotateX(100deg) translate3d(0, 0, 3.625rem)'
            } else {
                return 'transform: rotateX(-100deg) translate3d(0, 0, 3.625rem)'
            }
        }
    },
    mounted: function () {
        this.eventsRegister()
        this.getGroupsRectList()
    }
}
</script>
