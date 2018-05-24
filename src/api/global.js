import { $http } from '@/libs/ajax'

export const sysEvn = (params, cb, error) => {
    $http.post('/common/parameter', {}, {
        params: {
            product: 'YOOMATH',
            key: 'h5.hosts'
        }
    }).then(({ data }) => {
        if (data.ret_code === 0) {
            let obj = JSON.parse(data.ret)
            obj['URL_API_M'] = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
            cb(obj)
        } else {
            console.log(data)
        }
    })
}
