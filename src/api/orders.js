import request from '@/utils/request'

export function addOrder(data) {
  return request({
    url: '/order/addOrder',
    method: 'post',
    data
  })
}
export function getCommitTable(data) {
  return request({
    url: '/order/getCommitTable',
    method: 'post',
    data
  })
}
// 后台获取订单
export function getOrderTable(query) {
  return request({
    url: '/order/getOrderTable',
    method: 'get',
    params: query
  })
}

export function getOrderDetail(query) {
  return request({
    url: '/order/getOrderDetail',
    method: 'get',
    params: query
  })
}

export function saveState(data) {
  return request({
    url: '/order/saveState',
    method: 'post',
    data
  })
}

export function failState(data) {
  return request({
    url: '/order/failState',
    method: 'post',
    data
  })
}

export function finishState(data) {
  return request({
    url: '/order/finishState',
    method: 'post',
    data
  })
}

export function submitOrder(data) {
  return request({
    url: '/order/submitOrder',
    method: 'post',
    data
  })
}

// 客户获取订单
export function getMyOrder(query) {
  return request({
    url: '/order/getMyOrder',
    method: 'get',
    params: query
  })
}

export function getUrl(query) {
  return request({
    url: '/order/getUrl',
    method: 'get',
    params: query
  })
}

export function applyUrl(data) {
  return request({
    url: '/order/applyUrl',
    method: 'post',
    data
  })
}

export function addUrl(data) {
  return request({
    url: '/order/addUrl',
    method: 'post',
    data
  })
}

export function toggleCollection(data) {
  return request({
    url: '/order/toggleCollection',
    method: 'post',
    data
  })
}
