// pages/bind/bind.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  username:function(e){
    this.setData({
      username: e.detail.value
    })
  },
  password: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 立即绑定
  bindNow:function(e){
    var that = this;
    wx.request({
      url: util.realm +'user/userbind',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        username: that.data.username,
        password: that.data.password,
        avatar: wx.getStorageSync('avatar'),
        openid: wx.getStorageSync('openid')
      },
      success:(res)=>{
        wx.setStorageSync('sessionkey', res.data.data.sessionkey)
        wx.setStorageSync('uid', res.data.data.uid)
        wx.setStorageSync('nickname', res.data.data.name)
        wx.setStorageSync('avatar', res.data.data.avatar)
        wx.reLaunch({
          url: '../user/user',
        })
      }
    })
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