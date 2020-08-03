// pages/selectadd/selectadd.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 返回
  back:function(e){
    let pages = getCurrentPages();   //当前页面
    let prevPage = pages[pages.length - 2];   //上一页面
    let province = e.currentTarget.dataset.province;
    let city = e.currentTarget.dataset.city;
    let area = e.currentTarget.dataset.area;
    let address = e.currentTarget.dataset.address;
    let bid = e.currentTarget.dataset.bid;
    let tel = e.currentTarget.dataset.tel;
    let name = e.currentTarget.dataset.name;
    prevPage.setData({
      //直接给上一个页面赋值
      province: province,
      city: city,
      country: area,
      address: address,
      telephone: tel,
      bookid: bid,
      name: name
    });
    wx.navigateBack({
      delta:1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    util.sendRequest('user/book','POST',{
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then(res => {
      that.setData({
        book:res.data.data.book
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
  onShow: function (e) {
    
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