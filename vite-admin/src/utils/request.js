import axios from 'axios'
import { message } from 'ant-design-vue' // 如果你用了 ant-design-vue

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:3000/api', // 从环境变量读取基础路径
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 假设后端返回数据格式为 { code: 0, data: {...}, message: '' }
    const res = response.data
    if (res.code !== 0) {
      message.error(res.message || '请求错误')
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res.data // 直接返回有效数据部分
  },
  error => {
    message.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default service
