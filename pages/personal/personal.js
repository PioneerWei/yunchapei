// pages/personal/personal.js
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isChangeModalName: true,
    isChangeModalTel: true,
    isChangeModalMail: true
  },
  // 解除绑定
  switch1Change:function(e){
    if(!e.detail.value){
      util.sendRequest('user/unbind','POST',{
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey')
      }).then(res => {
        if(res.data.data){
          wx.clearStorageSync()
          wx.reLaunch({
            url: '../index/index',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  // 关闭弹窗
  cancel:function(e){
    this.setData({
      isChangeModalName: true,
      isChangeModalTel: true,
      isChangeModalMail:true
    })
  },
  // 修改昵称
  changeName:function(e){
    this.setData({
      isChangeModalName:false
    })
  },
  // 修改电话
  changeTel: function (e) {
    this.setData({
      isChangeModalTel: false
    })
  },
  // 修改邮箱
  changeMail: function (e) {
    this.setData({
      isChangeModalMail: false
    })
  },
  name:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  tel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  email: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  //保存
  saveName:function(e){
    let that = this;
    util.sendRequest('user/modifyinfo','POST',{
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      name:that.data.name
    }).then(res => {
      that.setData({
        isChangeModalName: true,
        name:res.data.data.name
      })
    }).catch(err => {
      console.log(err)
    })
  },
  saveTel: function (e) {
    let that = this;
    util.sendRequest('user/modifyinfo', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      telephone: that.data.tel
    }).then(res => {
      that.setData({
        isChangeModalTel: true,
        telephone:res.data.data.telephone
      })
    }).catch(err => {
      console.log(err)
    })
  },
  saveEmail: function (e) {
    let that = this;
    util.sendRequest('user/modifyinfo', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      email: that.data.email
    }).then(res => {
      that.setData({
        isChangeModalMail: true,
        email:res.data.data.email
      })
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    util.sendRequest('user/getuserinfo','POST',{
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then(res => {
      that.setData({
        name: res.data.data.name,
        telephone: res.data.data.telephone,
        email: res.data.data.email
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