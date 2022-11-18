import axios from "axios";
import {Message} from 'element-ui'
// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:9001',
  timeout: 15000 // 请求超时时间
})
// http request 拦截器
service.interceptors.request.use(
  config => {
    if (window.sessionStorage.getItem('token')) {
      config.headers.Authorization = window.sessionStorage.getItem('token')
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })
// http response 拦截器
service.interceptors.response.use(
  response => {
    if (response.data.code == 401){
      Message({
        message: 'token is gone',
        type: 'error',
        duration: 5 * 1000
      })
      window.location.href = '/';
    }
    if (response.data.code !== 200) {
      Message({
        message: response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(response.data)
    } else {
      return response.data
    }
  },
  error => {
    return Promise.reject(error.response)
  })
export default service
