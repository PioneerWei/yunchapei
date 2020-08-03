// pages/collect/collect.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1
  },
  // 跳转详情页
  toDetails:function(e){
    wx.navigateTo({
      url: '../details/details?pid=' + e.currentTarget.dataset.pid,
    })
  },
  touchStart:function(e){
    this.setData({
      startX: e.changedTouches[0].pageX,
      moveIndex: e.currentTarget.dataset.index
    })
  }, 
  touchEnd: function (e) {
    let endX = e.changedTouches[0].pageX
    let x = endX - this.data.startX
    if (x < -50){
      this.setData({
        isLeft:true
      })
    }else{
      this.setData({
        isLeft: false
      })
    }
  },
  // 删除
  removeGoods:function(e){
    let that = this;
    let pid = e.currentTarget.dataset.pid;
    let index = e.currentTarget.dataset.index;
    util.sendRequest('user/opefav','POST',{
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      pid:pid,
      type:1
    }).then(res => {
      that.data.list.splice(index,1)
      that.setData({
        list:that.data.list,
        isLeft:false
      })
    }).catch(err => {
      console.log(err)
    })
  },
  addCar:function(e){
    let that = this;
    let pid = e.currentTarget.dataset.pid;
    let index = e.currentTarget.dataset.index;
    util.sendRequest('user/opecart','POST',{
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      pid:pid,
      type:1
    }).then(res => {
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.sendRequest('user/fav','POST',{
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      page:that.data.page
    }).then(res => {
      that.setData({
        list:res.data.data.list,
        page:that.data.page+1
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
    var that = this;
    util.sendRequest('user/fav', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      page: that.data.page
    }).then(res => {
      that.setData({
        list: that.data.list.concat(res.data.data.list),
        page:that.data.page+1
      })
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})