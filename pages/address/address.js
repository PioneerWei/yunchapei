// pages/address/address.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 修改地址
  chnageAdd: function(e) {
    wx.navigateTo({
      url: '../changeadd/changeadd?title=修改地址&&name=' + e.currentTarget.dataset.name + '&&telephone=' + e.currentTarget.dataset.telephone + '&&province=' + e.currentTarget.dataset.province + '&&city=' + e.currentTarget.dataset.city + '&&area=' + e.currentTarget.dataset.area + '&&address=' + e.currentTarget.dataset.address + '&&id=' + e.currentTarget.dataset.id,
    })
  },
  // 新增地址
  addAddress: function(e) {
    wx.navigateTo({
      url: '../changeadd/changeadd?title=新增地址',
    })
  },
  // 删除地址
  removeAdd: function(e) {
    var that = this;
    util.sendRequest('user/delbook', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      id: e.currentTarget.dataset.id
    }).then((res)=>{
      that.onLoad()
    }).catch((err)=>{
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    util.sendRequest('user/book', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then((res)=>{
      that.setData({
        book: res.data.data.book
      })
    }).catch((err)=>{
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
    this.onLoad()
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