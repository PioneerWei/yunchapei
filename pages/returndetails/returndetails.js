// pages/returndetails/returndetails.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  kuaidi: function(e) {
    this.setData({
      kuaidi: e.detail.value
    })
  },
  kuaidi_code: function(e) {
    this.setData({
      kuaidi_code: e.detail.value
    })
  },
  remark: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  // 跳转订单详情页
  toOrderdetails: function(e) {
    wx.navigateTo({
      url: '../orderdetails/orderdetails',
    })
  },
  // 确定
  sureReturn: function(e) {
    var that = this;
    if (that.data.kuaidi || that.data.kuaid_code) {
      util.sendRequest('order/tuihuofahuo', 'POST', {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey'),
        oid: that.data.oid,
        kuaidi: that.data.kuaidi,
        kuaidi_code: that.data.kuaidi_code,
        remark: that.data.remark
      }).then(res => {
        if (res.data.data) {
          wx.navigateBack()
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.error_msg
          })
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请完善快递信息'
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    util.sendRequest('order/orderdetail', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      oid: options.oid,
      type: 2
    }).then(res => {
      that.setData({
        order_status: res.data.data.order_status,
        tuihuo_status: parseInt(res.data.data.tuihuoorder.tuihuo_status),
        tuihuo_kuaidi: res.data.data.tuihuoorder.tuihuo_kuaidi,
        tuihuo_kuaidi_code: res.data.data.tuihuoorder.tuihuo_kuaidi_code,
        detail: res.data.data.detail,
        orderstatus: res.data.data.orderstatus,
        tuihuoorder: res.data.data.tuihuoorder,
        dangqianyunfei: res.data.data.account.dangqianyunfei,
        heji: res.data.data.account.heji,
        remark: res.data.data.order.remark,
        product_jine: res.data.data.account.product_jine,
        shangyiciyunfei: res.data.data.account.shangyiciyunfei,
        shifu: res.data.data.account.shifu,
        accyunfei: res.data.data.account.yunfei,
        oid: options.oid
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