// pages/user/user.js
let LOGIN_CODE = '';
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBindModal: true
  },
  // 跳转个人资料页
  toPersonal: function(e) {
    wx.navigateTo({
      url: '../personal/personal',
    })
  },
  // 跳转积分页
  toIntegral: function(e) {
    wx.navigateTo({
      url: '../integral/integral',
    })
  },
  // 跳转订单页
  toOrder: function(e) {
    wx.navigateTo({
      url: '../order/order',
    })
  },
  // 跳转收藏页
  toCollect: function(e) {
    wx.navigateTo({
      url: '../collect/collect',
    })
  },
  // 跳转账户明细页
  toAccount: function(e) {
    wx.navigateTo({
      url: '../account/account',
    })
  },
  // 跳转账户充值页
  toRecharge: function(e) {
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },
  // 跳转信用还款页
  toRepayment: function(e) {
    wx.navigateTo({
      url: '../repayment/repayment',
    })
  },
  // 跳转我的地址
  toAddress: function(e) {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  // 跳退货订单页
  toReturnorder: function(e) {
    wx.navigateTo({
      url: '../returnorder/returnorder',
    })
  },
  //退出登录
  outLogin: function(e) {
    wx.removeStorageSync('openid');
    wx.reLaunch({
      url: '../user/user',
    })
  },
  // 跳转绑定用户页
  toBind: function(e) {
    wx.navigateTo({
      url: '../bind/bind'
    })
  },
  // 跳转注册页
  toRegistered: function(e) {
    wx,
    wx.navigateTo({
      url: '../registered/registered'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      isLogin: false,
      nickname: wx.getStorageSync('nickname'),
      avatar: wx.getStorageSync('avatar')
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
    let that = this;
    if (wx.getStorageSync('uid') != 0) {
      util.sendRequest('user/getuserinfo', 'POST', {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey')
      }).then((res) => {
        that.setData({
          telephone: res.data.data.telephone,
          jifen: res.data.data.jifen,
          ordercount: res.data.data.ordercount,
          favorite: res.data.data.favorite,
          account: res.data.data.account
        })
      }).catch((err) => {
        console.log(err)
      })
    } else {
      this.setData({
        isBindModal: false
      })
    }
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