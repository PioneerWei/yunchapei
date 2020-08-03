// pages/rechargeinteg/rechargeinteg.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  number:function(e){
    this.setData({
      number:e.detail.value
    })
  },
  // 跳转收银台
  toPay: function (e) {
    if(this.data.number){
      wx.navigateTo({
        url: '../pay/pay?number=' + this.data.number + '&type=2',
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
    var that = this;
    util.sendRequest('user/getuseraccount', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then(res => {
      that.setData({
        xianjin: res.data.data.useraccount.xianjin,
        integral: res.data.data.useraccount.integral
      })
    }).catch(err => {
      console.log(err)
    })
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