import request from '@/utils/request'

export function fetchUserList(query) {
  return request({
    url: '/setting/user/userlist',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/setting/user/createUser',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/setting/user/updateUser',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/setting/user/del/${id}`,
    method: 'delete'
  })
}

export function getTypesName(query) {
  return request({
    url: '/setting/getTypesNameList',
    method: 'get',
    params: query
  })
}

export function getTypesContent(query) {
  return request({
    url: '/setting/getTypesContent',
    method: 'get',
    params: query
  })
}

export function delTag(id) {
  return request({
    url: `/setting/delTag/del/${id}`,
    method: 'delete'
  })
}

export function addTypesContent(data) {
  return request({
    url: '/setting/addTypesContent',
    method: 'post',
    data
  })
}

export function getNothing(query) {
  return request({
    url: '/setting/getNothing',
    method: 'get',
    params: query
  })
}

export function addNothing(data) {
  return request({
    url: '/setting/addNothing',
    method: 'post',
    data
  })
}

export function delNothing(id) {
  return request({
    url: `/setting/delNothing/del/${id}`,
    method: 'delete'
  })
}

// 获取案例的select
export function getSelects(query) {
  return request({
    url: '/setting/getSelects',
    method: 'get',
    params: query
  })
}

export function createCase(data) {
  return request({
    url: '/setting/createCase',
    method: 'post',
    data
  })
}

export function updateCase(data) {
  return request({
    url: '/setting/updateCase',
    method: 'post',
    data
  })
}

export function getCasesList(query) {
  return request({
    url: '/setting/getCasesList',
    method: 'get',
    params: query
  })
}

export function deleteCase(id) {
  return request({
    url: `/setting/deleteCase/${id}`,
    method: 'delete'
  })
}

export function getArticleType(query) {
  return request({
    url: '/setting/getArticleType',
    method: 'get',
    params: query
  })
}