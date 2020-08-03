// pages/account/account.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    selectType: false,
    selectStart: false,
    selectEnd:false,
    nowDate: util.formatTime(new Date()),
    page:1
  },
  // 普通选择器
  bindTypeChange: function (e) {
    this.setData({
      index: e.detail.value,
      selectType: !this.data.selectType,
      selectText: this.data.typelist[e.detail.value],
      selectIndex: e.detail.value
    })
  },
  bindTypeTap: function (e) {
    this.setData({
      index: e.detail.value,
      selectType: !this.data.selectType
    })
  },
  bindTypeCancel: function (e) {
    this.setData({
      index: e.detail.value,
      selectType: !this.data.selectType
    })
  },
  // 开始日期选择器
  bindStartChange: function (e) {
    this.setData({
      startDate: e.detail.value,
      selectStart: !this.data.selectStart,
      startText: e.detail.value
    })
  },
  bindStartTap: function (e) {
    this.setData({
      selectStart: !this.data.selectStart
    })
  },
  bindStartCancel: function (e) {
    this.setData({
      selectStart: !this.data.selectStart
    })
  },
  // 结束日期选择器
  bindEndChange: function (e) {
    this.setData({
      endDate: e.detail.value,
      selectEnd: !this.data.selectEnd,
      endText:e.detail.value
    })
  },
  bindEndTap: function (e) {
    this.setData({
      selectEnd: !this.data.selectEnd
    })
  },
  bindEndCancel: function (e) {
    this.setData({
      selectEnd: !this.data.selectEnd
    })
  },
  // 查询
  query:function(e){
    var that = this;
    if (!this.data.selectIndex){
      this.setData({
        selectIndex: ''
      })
    }
    util.sendRequest('user/account', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      type: that.data.selectIndex,
      start: that.data.startText,
      end: that.data.endText
    }).then((res)=>{
      that.setData({
        list: res.data.data.list
      })
    }).catch((err)=>{
      console.log(err)
    })
  },
  // 重置
  reset:function(e){
    var that = this;
    util.sendRequest('user/account', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
    }).then((res) => {
      that.setData({
        list: res.data.data.list,
        selectText: res.data.data.typelist[0],
        startDate: '开始时间',
        endDate: '结束时间'
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.sendRequest('user/account', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      page:that.data.page
    }).then((res)=>{
      that.setData({
        xianjin: res.data.data.useraccount.xianjin,
        xinyong: res.data.data.useraccount.xinyong,
        xinyong_edu: res.data.data.useraccount.xinyong_edu,
        tuijian: res.data.data.useraccount.tuijian,
        typelist: res.data.data.typelist,
        list: res.data.data.list,
        selectText: res.data.data.typelist[0],
        startDate: '开始时间',
        endDate: '结束时间',
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
    if (!that.data.startText){
      that.setData({
        startText:'',
        endText:''
      })
    }
    if (!that.data.selectIndex) {
      that.setData({
        selectIndex: ''
      })
    }
    util.sendRequest('user/account', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      type: that.data.selectIndex,
      start: that.data.startText,
      end: that.data.endText,
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