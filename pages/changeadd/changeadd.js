// pages/changeadd/changeadd.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customItem: '全部',
    is_default: 0
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
  address: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  
  // 省市区选择器
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      isText: true,
      province: e.detail.value[0],
      city: e.detail.value[1],
      area: e.detail.value[2],
    })
  },
  switChange:function(e){
    if (e.detail.value){
      this.setData({
        is_default:1
      })
    }else{
      this.setData({
        is_default: 0
      })
    }
    
  },
  textarea:function(e){
    this.setData({
      textarea:e.detail.value
    })
  },
  // 一键粘贴
  createAdd:function(e){
    var that = this;
    wx.request({
      url: util.realm + 'user/docreatebook',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey'),
        copy: that.data.textarea
      },
      success: (res) => {
        that.setData({
          name: res.data.data.info.name,
          telephone: res.data.data.info.telephone,
          region: [res.data.data.info.province, res.data.data.info.city, res.data.data.info.area],
          address: res.data.data.info.address,
          id: res.data.data.info.bid,
          isText:true
        })
      }
    })
  },
  // 保存地址
  saveAddress:function(e){
    var that = this;
    wx.request({
      url: util.realm + 'user/docreatebook',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey'),
        name: that.data.name,
        telephone: that.data.tel,
        province: that.data.region[0],
        city: that.data.region[1],
        area: that.data.region[2],
        address: that.data.address,
        id:that.data.id,
        is_default:that.data.is_default
      },
      success:(res)=>{
        wx.navigateBack()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        isText: true,
        isCopy: true,
        name: options.name,
        telephone: options.telephone,
        region: [options.province, options.city, options.area],
        address: options.address,
        id: options.id
      })
      wx.setNavigationBarTitle({
        title: '修改地址'
      })
    }else{
      this.setData({
        isText: false,
        isChecked:false,
        isCopy:false,
        region: ['广东省', '广州市', '海珠区'],
        id:''
      })
    }
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