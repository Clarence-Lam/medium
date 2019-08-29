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
