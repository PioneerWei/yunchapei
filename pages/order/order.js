// pages/order/order.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: [{ key: '', name: '全部' }, { key: 0, name: '待付款' }, { key: 1, name: '已付款' }, { key: 2, name: '已发货' }, { key: 3, name: '已收货' }],
    orderActive:0,
    startDate: '不限',
    endDate:'结束时间',
    selectStart: false,
    selectEnd: false,
    nowDate: util.formatTime(new Date())
  },
  // 跳转订单详情页
  toOrderDetails:function(e){
    wx.navigateTo({
      url: '../orderdetails/orderdetails?oid=' + e.currentTarget.dataset.oid,
    })
  },
  // 订单状态切换
  orderTab: function(e) {
    var that = this;
    util.sendRequest('user/getorderlist', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid:1,
      sessionkey: wx.getStorageSync('sessionkey'),
      order_status: e.currentTarget.dataset.key
    }).then(res => {
      that.setData({
        list: res.data.data.list,
        orderActive: e.currentTarget.dataset.index
      })
    }).catch(err => {
      console.log(err)
    })
  },
  // 开始日期选择器
  bindStartChange: function (e) {
    this.setData({
      startDate: e.detail.value,
      selectStart: !this.data.selectStart
    })
  },
  bindStartTap:function(e){
    this.setData({
      selectStart: !this.data.selectStart
    })
  },
  bindStartCancel: function (e) {
    this.setData({
      selectStart: !this.data.selectStart
    })
  },
  // 结束日期选择器
  bindEndChange: function (e) {
    this.setData({
      endDate: e.detail.value,
      selectEnd: !this.data.selectEnd
    })
    var that = this;
    util.sendRequest('user/getorderlist', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      start: that.data.startDate,
      end: e.detail.value
    }).then(res => {
      that.setData({
        list: res.data.data.list
      })
    }).catch(err => {
      console.log(err)
    })
  },
  bindEndTap: function (e) {
    this.setData({
      selectEnd: !this.data.selectEnd
    })
  },
  bindEndCancel: function (e) {
    this.setData({
      selectEnd: !this.data.selectEnd
    })
  },
  // 搜索单号
  search:function(e){
    var that = this;
    util.sendRequest('user/getorderlist', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      ordercode: e.detail.orderValue
    }).then(res => {
      that.setData({
        list: res.data.data.list
      })
    }).catch(err => {
      console.log(err)
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    util.sendRequest('user/getorderlist', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then(res => {
      that.setData({
        list: res.data.data.list
      })
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})