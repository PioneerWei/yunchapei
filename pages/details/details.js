// pages/details/details.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabArray: ['产品详情', '通用OE', '适用车型'],
    tabIndex: 0,
    isOPen: false
  },
  //收藏
  collect: function(e) {
    var that = this;
    wx.request({
      url: util.realm + 'user/opefav',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey'),
        pid: that.data.pid,
        type: 0
      },
      success: (res) => {
        that.setData({
          isCollect: true
        })
      }
    })
    
  },
  //取消收藏
  cancelCollect: function(e) {
    var that = this;
    wx.request({
      url: util.realm + 'user/opefav',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey'),
        pid: that.data.pid,
        type: 1
      },
      success: (res) => {
        this.setData({
          isCollect: false
        })
      }
    })
    
  },
  // 加入购物车
  toCar: function(e) {
    let that = this;
    util.sendRequest('user/opecart', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      pid: that.data.pid,
      type: 1
    }).then((res) => {
      that.setData({
        cartnum: res.data.data.basketnum
      })
      wx.showToast({
        icon:'none',
        title: '已加入购物车'
      })
      wx.setStorageSync('carNum', res.data.data.basketnum)
      wx.setTabBarBadge({
        index: 3,
        text: res.data.data.basketnum
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  // 跳转订单详情
  toOrderDetails: function(e) {
    let that = this;
    util.sendRequest('user/directbuy','POST',{
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      pid:that.data.pid
    }).then(res => {
      if(res.data.data){
        wx.navigateTo({
          url: '../orderdetails/orderdetails?oid=' + res.data.data.orderid,
        })
      }else{
        wx.showToast({
          icon:'none',
          title: res.data.error_msg,
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // tab
  tabSize: function(e) {
    var that = this;
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
    switch (e.currentTarget.dataset.index) {
      case 1:
        util.sendRequest('product/protyoe', 'POST', {
          openid: wx.getStorageSync('openid'),
          uid: wx.getStorageSync('uid'),
          sessionkey: wx.getStorageSync('sessionkey'),
          pid: that.data.pid
        }).then(res => {
          that.setData({
            tongyongoe: res.data.data.tongyongoe
          })
        }).catch(err => {
          console.log(err)
        })
        break;
      case 2:
        util.sendRequest('product/provehicle', 'POST', {
          openid: wx.getStorageSync('openid'),
          uid: wx.getStorageSync('uid'),
          sessionkey: wx.getStorageSync('sessionkey'),
          pid: that.data.pid
        }).then(res => {
          that.setData({
            shiyongchexing: res.data.data.shiyongchexing
          })
        }).catch(err => {
          console.log(err)
        })
    }
    
  },
  isOpenBox: function(e) {
    this.setData({
      isOpen: !this.data.isOpen
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    util.sendRequest('product/prodetail', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      pid: options.pid
    }).then(res => {
      if(!res.data.data){
        wx.showToast({
          icon:'none',
          title: res.data.error_msg,
          success:(success => {
            setTimeout(function(){
              wx.navigateBack()
            },1000)
          })
        })
      }else{
        that.setData({
          title: res.data.data.title,
          image: res.data.data.image,
          lingshoujia: res.data.data.lingshoujia,
          pifajia: res.data.data.pifajia,
          spec: res.data.data.spec,
          adaptation: res.data.data.adaptation,
          nodes: res.data.data.detail,
          isCollect: res.data.data.isfav,
          cartnum: res.data.data.cartnum,
          pid: options.pid
        })
      }
    }).catch(err => {
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