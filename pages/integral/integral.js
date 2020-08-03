// pages/integral/integral.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1
  },
  toRechargeInteg:function(e){
    wx.navigateTo({
      url: '../rechargeinteg/rechargeinteg',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.sendRequest('user/integral', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      page:that.data.page
    }).then((res)=>{
      that.setData({
        curintegral: res.data.data.curintegral,
        list: res.data.data.list,
        page:that.data.page+1
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
    var that = this;
    util.sendRequest('user/integral', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      page: that.data.page
    }).then((res) => {
      that.setData({
        list: that.data.list.concat(res.data.data.list),
        page: that.data.page + 1
      })
    }).catch((err) => {
      console.log(err)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})