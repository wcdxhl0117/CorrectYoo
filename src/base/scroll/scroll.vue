<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';

export default {
    props: {
        probeType: {
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        },
        // data其实就是用来更新scroll
        data: {
            type: Array,
            default: null
        },
        // 是否监听滚动，如果监听的话，probeType=3
        listenScroll: {
            type: Boolean,
            default: false
        },
        // 是否开启上拉加载
        pullUp: {
            type: Boolean,
            default: false
        },
        beforeScroll: {
            type: Boolean,
            default: false
        },
        refreshDelay: {
            type: Number,
            default: 20
        }
    },
    mounted() {
        if (this.data != null) {
            setTimeout(() => {
                this._initScroll()
            }, 200)
        }
    },
    methods: {
        _initScroll() {
            if (!this.$refs.wrapper) {
                return
            }
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click,
                mouseWheel: true
            })
            if (this.listenScroll) {
                let me = this
                this.scroll.on('scroll', pos => {
                    me.$emit('scroll', pos)
                })
            }
            if (this.pullUp) {
                this.scroll.on('scrollEnd', () => {
                    if (this.scroll.y <= this.scroll.maxScrollY + 50) {
                        this.$emit('scrollToEnd')
                    }
                })
            }
            if (this.beforeScroll) {
                this.scroll.on('beforeScrollStart', () => {
                    this.$emit('beforeScroll')
                })
            }
        },
        // 面是scroll代理的方法
        enable() {
            this.scroll && this.scroll.enable()
        },
        disable() {
            this.scroll && this.scroll.disable()
        },
        refresh() {
            this.scroll && this.scroll.refresh()
        },
        scrollTo() {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement() {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        }
    },
    // 监听data变化，变化就refresh
    watch: {
        data() {
            setTimeout(() => {
                this.refresh()
            }, this.refreshDelay)
        }
    },
    component: {
        BScroll
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
