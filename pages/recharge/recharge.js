// pages/recharge/recharge.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  account:function(e){
    this.setData({
      account:e.detail.value
    })
  },
  toPay:function(e){
    var that = this;
    if(that.data.account){
      util.sendRequest('order/czaccount', 'POST', {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey'),
        account: that.data.account,
        type: 1,
        paytype: 1
      }).then(res => {
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: 'MD5',
          paySign: res.data.data.paySign,
          success(res) { },
          fail(res) { }
        })
      }).catch(err => {
        console.log(err)
      })
    }else{
      wx.showToast({
        icon:'none',
        title: '请输入金额'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.sendRequest('user/getuseraccount', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then(res => {
      that.setData({
        xianjin: res.data.data.useraccount.xianjin,
        xinyong: res.data.data.useraccount.xinyong,
        xinyong_edu: res.data.data.useraccount.xinyong_edu
      })
    }).catch(err => {
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