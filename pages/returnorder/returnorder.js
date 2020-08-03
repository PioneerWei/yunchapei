// pages/returnorder/returnorder.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderActive: 0
  },
  // 订单状态切换
  orderTab: function (e) {
    var that = this;
    util.sendRequest('user/thorder', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      order_status: e.currentTarget.dataset.status
    }).then((res)=>{
      that.setData({
        list: res.data.data.list,
        orderActive: e.currentTarget.dataset.index
      })
    }).catch((err)=>{
      console.log(err)
    })
  },
  orderValue:function(e){
    this.setData({
      value:e.detail.value
    })
  },
  // 搜索
  search:function(e){
    var that = this;
    util.sendRequest('user/thorder', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      ordercode: that.data.value
    }).then((res)=>{
      that.setData({
        list: res.data.data.list
      })
    }).catch((err)=>{
      console.log(err)
    })
  },
  // 跳转退单详情
  toReturndetails:function(e){
    wx.navigateTo({
      url: '../returndetails/returndetails?oid=' + e.currentTarget.dataset.oid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.sendRequest('user/thorder', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then((res)=>{
      that.setData({
        list: res.data.data.list,
        orderStatus: res.data.data.showstatus
      })
    }).catch((err)=>{
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})