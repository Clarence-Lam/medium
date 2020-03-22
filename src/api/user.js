import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function adminLogin(data) {
  return request({
    url: '/adminLogin',
    method: 'post',
    data
  })
}

export function phoneLogin(data) {
  return request({
    url: '/phoneLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function updateInfo(data) {
  return request({
    url: '/updateInfo',
    method: 'post',
    data
  })
}

export function getCustInfo() {
  return request({
    url: '/getCustInfo',
    method: 'get'
  })
}

export function getSvgCaptcha() {
  return request({
    url: '/getSvgCaptcha',
    method: 'get'
  })
}

export function getSmsCaptcha(data) {
  return request({
    url: '/getSmsCaptcha',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

export function resetting(data) {
  return request({
    url: '/resetting',
    method: 'post',
    data
  })
}

export function getMyself() {
  return request({
    url: '/getMyself',
    method: 'get'
  })
}

export function updateMyself(data) {
  return request({
    url: '/updateMyself',
    method: 'post',
    data
  })
}

export function updatePhone(data) {
  return request({
    url: '/updatePhone',
    method: 'post',
    data
  })
}
