import request from './request'

// 登录函数
export function login(username, password) {
  return request.post('/user/login', { username, password })
}

export function fetchUsers() {
  return request.post('/user/list')
}

export function register(user) {
  return request.post('/user/register', { user })
}

export function deleteUser(id) {
  return request.post('/user/delete', { id })
}

export function updateUser(user) {
  return request.post('/user/update', user)
}