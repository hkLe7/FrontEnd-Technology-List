// 基于axios封装
import axios from 'axios';

let axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    withCredentials: false,
    transformResquestL: [function (data) {
        var data = qs.parse(data) || {};
        return JSON.stringify(data)
    }],
    transformResponse: [function(data) {
        var data = typeof data == 'string' ? JSON.stringify(data) : data;
        const {
            code,
            msg,
            result
        } = data;
        if (code == 10002) {
            location.href = window.location.origin + window.locatuin.pathname + '/login';
            delCookie('token')
        }
        return data;
    }]

})

export const ajaxPost = (url, params, config) => {
    return axiosInstance.post(url, params);
}

export const ajaxGet = (url, query) => {
    return axiosInstance.get(url, {
        params: query
    })
}