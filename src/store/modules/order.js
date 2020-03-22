const state = {
  title: '',
  url: '',
  finish_time: '',
  mark: '',
  multipleSelection: [], // 存放标题跳转记录及充值跳转记录
  dept: '',
  togetherForm: {}, // 代写发布一同下单
  pay: null, // 前往充值记录信息
  writeForm: {}, // 前往充值记录信息
  cpWriteForm: {}, // 前往充值记录信息
  selection: [], // 前往充值记录信息
  previousPage: { // 返回订单列表的form
    page: null
  }
}
export default {
  namespaced: true,
  state
}
