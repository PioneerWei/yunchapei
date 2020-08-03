// pages/registered/registered.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    second: 59,
    isCode: false,
    getText: '获取验证码'
  },
  username: function(e) {
    this.setData({
      username: e.detail.value
    })
  },
  name: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  telcode: function(e) {
    this.setData({
      telcode: e.detail.value
    })
  },
  password: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  tuijian: function(e) {
    this.setData({
      tuijian: e.detail.value
    })
  },
  // 获取验证码
  getCode: function(e) {
    var that = this;
    if (this.data.username) {
      wx.request({
        url: util.realm +'user/gettelcode',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          telephone: that.data.username,
          type: 1
        },
        success: (res) => {
          that.setData({
            isCode: true
          })
          let setsetInterval = setInterval(() => {
            if (that.data.second <= 0) {
              clearInterval(setsetInterval)
              that.setData({
                getText: '重新发送',
                isCode: false,
                second:59
              })
            } else {
              that.setData({
                second: that.data.second - 1
              })
            }
          }, 1000)

        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请输入手机号'
      })
    }

  },
  // 立即注册
  registeredNow: function(e) {
    var that = this;
    wx.request({
      url: util.realm +'user/userbindnew',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        username: that.data.username,
        name: that.data.name,
        telcode: that.data.telcode,
        password: that.data.password,
        tuijian: that.data.tuijian,
        avatar: wx.getStorageSync('avatar'),
        openid: wx.getStorageSync('openid')
      },
      success: (res) => {
        if(res.data.data){
          wx.setStorageSync('uid', res.data.data.uid)
          wx.setStorageSync('sessionkey', res.data.data.sessionkey)
          wx.reLaunch({
            url: '../index/index',
          })
        }else{
          wx.showToast({
            icon:'none',
            title: res.data.error_msg
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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