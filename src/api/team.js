import { $http } from '@/libs/ajax'

export const chapterData = (params, cb, error) => {
    $http.post('/zy/m/s/report/learning2/sectionMasterNoVip', {}, {}).then(({ data }) => {
        if (data.ret_code === 0) {
            let obj = data.ret
            cb(obj)
        } else {
            console.log(data)
        }
    })
}
