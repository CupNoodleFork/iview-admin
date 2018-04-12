import axios from 'axios';

const config = {
    // 自定义的请求头
    headers: {
        post: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        'X-Requested-With': 'XMLHttpRequest'
    },
    // 超时设置
    timeout: 10000,
    // 跨域是否带Token
    withCredentials: true,
    responseType: 'json'
};

const request = axios.create(config);

request.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 返回结果处理
request.interceptors.response.use(
    res => {
        return res.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export default request;
