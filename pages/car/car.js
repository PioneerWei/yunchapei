// pages/car/car.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    totaText: 0,
    checkArray:[],
    ids:[]
  },
  touchStart: function(e) {
    this.setData({
      startX: e.changedTouches[0].pageX,
      moveIndex: e.currentTarget.dataset.index
    })
  },
  touchEnd: function(e) {
    let endX = e.changedTouches[0].pageX
    let x = endX - this.data.startX
    if (x < -50) {
      this.setData({
        isLeft: true
      })
    } else {
      this.setData({
        isLeft: false
      })
    }
  },
  // 跳转详情页
  toDetails: function(e) {
    wx.navigateTo({
      url: '../details/details?pid=' + e.currentTarget.dataset.pid,
    })
  },
  // 结算
  toCardetails: function(e) {
    let that = this;
    if (this.data.ids.length == 0){
      wx.showToast({
        icon:'none',
        title: '还没有勾选商品'
      })
    }else{
      let idsStr = that.data.ids.join();
      util.sendRequest('order/ordercreate', "POST", {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey'),
        ids: idsStr
      }).then(res => {
        if (res.data.data) {
          wx.navigateTo({
            url: '../orderdetails/orderdetails?oid=' + res.data.data.orderid,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.error_msg,
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  // 删除单个商品
  removeGoods: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let price = e.currentTarget.dataset.price;
    util.sendRequest('user/basketdelete', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      pid: e.currentTarget.dataset.pid
    }).then((res)=>{
      let total = that.data.total - (price * that.data.count[index])
      if (that.data.checkedLi[index]) {
        that.setData({
          totaText: that.data.totaText - 1
        })
      }
      that.data.basket.splice(index, 1)
      that.data.checkedLi.splice(index, 1)
      if (total < 0) {
        total = 0
      }
      that.setData({
        basket: that.data.basket,
        isLeft: false,
        carNum: wx.getStorageSync('carNum') - 1,
        total: total.toFixed(2),
        checkedLi: that.data.checkedLi
      })
      wx.setStorageSync('carNum', that.data.carNum)
      wx.setTabBarBadge({
        index: 3,
        text: String(that.data.carNum)
      })
    }).catch((err)=>{
      console.log(err)
    })
  },
  // 数量加
  add: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let price = e.currentTarget.dataset.price;
    let count = e.currentTarget.dataset.count; 
    that.data.count.splice(index, 1,  count+ 1)
    that.setData({
      count: that.data.count
    })
    if (that.data.checkedLi[index]) {
      that.setData({
        total: parseFloat((that.data.total + price).toFixed(2))
      })
    }
  },
  // 数量减
  jian: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let price = e.currentTarget.dataset.price;
    let count = e.currentTarget.dataset.count;
    if (count == 0) {
      that.data.count.splice(index, 1, 0)
      that.setData({
        count: that.data.count
      })
    } else {
      that.data.count.splice(index, 1, count - 1)
      that.setData({
        count: that.data.count
      })
      if (that.data.checkedLi[index]) {
        that.setData({
          total: parseFloat((that.data.total - price).toFixed(2))
        })
      }
    }
  },
  // 单选
  checkboxLi: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let price = e.currentTarget.dataset.price;
    if (e.detail.value[0]) {
      that.data.checkedLi.splice(index, 1, true)
      that.data.ids.push(id)
      that.setData({
        total: parseFloat(that.data.total) + (price * that.data.count[index]),
        totaText: that.data.totaText+1
      })
    } else {
      let searIndex = that.data.ids.indexOf(id);
      that.data.ids.splice(searIndex,1)
      that.data.checkedLi.splice(index, 1, false)
      that.setData({
        total: parseFloat(that.data.total) - (price * that.data.count[index]),
        totaText: that.data.totaText - 1
      })
    }
  },
  // 全选
  checkboxAll: function(e) {
    let that = this;
    if(e.detail.value[0]){
      let total = 0;
      this.data.basket.forEach(function(item,index){
        total += item.price*that.data.count[index]
        that.data.checkedLi.splice(index,1,true)
        that.data.ids.push(item.basket_id)
      })
      this.setData({
        total: total.toFixed(2),
        checkedLi: that.data.checkedLi,
        totaText:this.data.basket.length
      })
    }else{
      this.data.basket.forEach(function (item, index) {
        that.data.checkedLi.splice(index, 1, false)
      })
      this.setData({
        total: 0,
        checkedLi: that.data.checkedLi,
        totaText:0
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    util.sendRequest('user/basket', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then((res)=>{
      let count = [];
      let checkedLi = [];
      res.data.data.basket.forEach(function (item, index) {
        count.push(parseInt(item.buycount))
        checkedLi.push(false)
      })
      that.setData({
        basket: res.data.data.basket,
        count: count,
        checkedLi: checkedLi
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
    this.setData({
      isCheckedAll:false,
      ids:[],
      totaText:0,
      total:0
    })
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