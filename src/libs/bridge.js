/**
 * 桥
 */
const crash = {
    run: [],
    register: []
}

let lBridge = {
    run: (ag0, ag1, ag2) => {
        crash.run.push({ ag0: ag0, ag1: ag1, ag2: ag2 })
    },
    register: (ag0, ag1, ag2) => {
        crash.register.push({ ag0: ag0, ag1: ag1, ag2: ag2 })
    }
}

export const native = function (name, data) {
    return new Promise(function (resolve, reject) {
        try {
            lBridge.run('MsgTypeFromWeb', {
                msgType: name,
                data
            }, function (_data) {
                resolve(_data)
            })
        } catch (error) {
            reject(error)
        }
    })
}

export const register = function (name, callback) {
    lBridge.register('MsgTypeFromMobile', function (_data, _callback) {
        callback(name, {
            data: _data,
            callback: _callback
        })
    })
}

document.addEventListener('WebViewJavascriptBridgeReady', function (event) {
    lBridge = event.bridge
    lBridge.register = event.bridge.registerHandler
    lBridge.run = event.bridge.callHandler
    lBridge.init()
    // 清空缓存控制
    crash.run.forEach(element => {
        lBridge.run(element.ag0, element.ag1, element.ag2)
    })
    crash.run.length = 0
    crash.register.forEach(element => lBridge.register(element.ag0, element.ag1, element.ag2))
    crash.register.length = 0
}, false)
