import request from '@/utils/request'

export function orderPay(data) {
  return request({
    url: '/finance/orderPay',
    method: 'post',
    data
  })
}

export function getAccountMoney(data) {
  return request({
    url: '/finance/getAccountMoney',
    method: 'post',
    data
  })
}

export function getFreezeMoney(data) {
  return request({
    url: '/finance/getFreezeMoney',
    method: 'post',
    data
  })
}

export function getUsableMoney(data) {
  return request({
    url: '/finance/getUsableMoney',
    method: 'post',
    data
  })
}

export function aliVerifySign(data) {
  return request({
    url: '/alipay/verifySign',
    method: 'post',
    data
  })
}

export function getFinanceList(query) {
  return request({
    url: '/finance/getFinanceList',
    method: 'get',
    params: query
  })
}

export function getWithdrawList(query) {
  return request({
    url: '/finance/getWithdrawList',
    method: 'get',
    params: query
  })
}

export function changeMoney(data) {
  return request({
    url: '/finance/changeMoney',
    method: 'post',
    data
  })
}

export function getUsableBill() {
  return request({
    url: '/finance/getUsableBill',
    method: 'get'
  })
}

export function submitBill(data) {
  return request({
    url: '/finance/submitBill',
    method: 'post',
    data
  })
}

export function getInvoiceList(query) {
  return request({
    url: '/finance/getInvoiceList',
    method: 'get',
    params: query
  })
}

export function updateBill(data) {
  return request({
    url: '/finance/updateBill',
    method: 'post',
    data
  })
}

export function getFinances(query) {
  return request({
    url: '/finance/getFinances',
    method: 'get',
    params: query
  })
}

export function getPersonalFinance(query) {
  return request({
    url: '/finance/getPersonalFinance',
    method: 'get',
    params: query
  })
}
