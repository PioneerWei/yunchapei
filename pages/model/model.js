// pages/model/model.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectShowBrand: true,
    selectShowSize: false,
    selectShowModel:false,
    selectShowPlace:false,
    isLeft:false,
    brand:'品牌',
    size:'型号',
    model:'车型/年款',
    place:'排量/变速箱/发动机',
    toView:'',
    successText:true,
    isshowMore:true,
    leftIndex:0,
    leftId:1,
    leftText:'滤清系统'
  },
  // 获取子组件传过来的数据
  getSearch: function (e) {
    if (e.detail != 'isStatusOE'){
      let isfavArray = [];
      e.detail.forEach(function (item, index) {
        isfavArray.push(item.isfav)
      })
      this.setData({
        list: e.detail,
        isfavs: isfavArray
      })
    }else{
      this.setData({
        selectShowBrand:false
      })
    }
  },
  //收藏
  collect: function (e) {
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
        pid: e.currentTarget.dataset.pid,
        type: 0
      },
      success: (res) => {
        that.data.isfavs.splice(e.currentTarget.dataset.index, 1, 1)
        that.setData({
          isfavs: that.data.isfavs
        })
      }
    })
  },
  //取消收藏
  collectCancel: function (e) {
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
        pid: e.currentTarget.dataset.pid,
        type: 1
      },
      success: (res) => {
        that.data.isfavs.splice(e.currentTarget.dataset.index, 1, 0)
        that.setData({
          isfavs: that.data.isfavs
        })
      }
    })
  },
  // 加入购物车
  addCar: function (e) {
    var that = this;
    wx.request({
      url: util.realm + 'user/opecart',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey'),
        pid: e.currentTarget.dataset.pid,
        type: 1
      },
      success: (res) => {
        wx.setStorageSync('carNum', res.data.data.basketnum)
        wx.setTabBarBadge({
          index: 3,
          text: res.data.data.basketnum
        })
      }
    })
  },
  toDetails:function(e){
    if (e.currentTarget.dataset.type){
      wx.navigateTo({
        url: '../details/details?pid=' + e.currentTarget.dataset.pid
      })
    }
  },
  // 是否展开
  isLeft:function(e){
    this.setData({
      isLeft:false
    })
  },
  leftTab:function(e){
    this.setData({
      leftIndex: e.currentTarget.dataset.index,
      leftId: e.currentTarget.dataset.id,
      isLeft:true,
      leftText: e.currentTarget.dataset.text
    })
  },
  // 关闭左菜单
  closeLeft:function(e){
    this.setData({
      isLeft: true
    })
  },
  // 选择成功
  selectChange: function (e) {
    this.setData({
      index: e.detail.value,
      selectShow: !this.data.selectShow
    })
  },
  // 取消选择
  selectCancel: function (e) {
    this.setData({
      selectShow: !this.data.selectShow
    });
  },
  
  brand() {
    this.setData({
      selectShowBrand: !this.data.selectShowBrand,
      selectShowSize: false,
    });
  },
  size() {
    this.setData({
      selectShowSize: !this.data.selectShowSize,
      selectShowBrand: false,
    });
  },
  model() {
    this.setData({
      selectShowModel: !this.data.selectShowModel,
      selectShowSize: false,
    });
  },
  displacement() {
    this.setData({
      selectShowPlace: !this.data.selectShowPlace,
      selectShowModel: false,
    });
  },
  pinyinTo:function(e){
    this.setData({
      toView: e.currentTarget.dataset.toid
    })
  },
  // 点击品牌列表
  brandList:function(e){
    var that = this;
    util.sendRequest('vehicle/vehiclexinghao', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      vbid: e.currentTarget.dataset.vbid
    }).then(res => {
      that.setData({
        vehiclexinghao: res.data.data.vehiclexinghao,
        selectShowSize: !this.data.selectShowSize,
        selectShowBrand: false,
        brand: e.currentTarget.dataset.text
      })
    }).catch(err => {
      console.log(err)
    })
  },
  
  sizeList:function(e){
    var that = this;
    util.sendRequest('vehicle/getnianfen', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      vbid: e.currentTarget.dataset.vbid,
      vtype: e.currentTarget.dataset.vtype
    }).then(res => {
      that.setData({
        nianfen: res.data.data.nianfen,
        selectShowModel: !this.data.selectShowModel,
        selectShowSize: false,
        size: e.currentTarget.dataset.text
      })
    }).catch(err => {
      console.log(err)
    })
  },
  modelList:function(e){
    var that = this;
    util.sendRequest('vehicle/getlast', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      vbid: e.currentTarget.dataset.vbid,
      vtype: e.currentTarget.dataset.vtype,
      vnianfen: e.currentTarget.dataset.vfen
    }).then(res => {
      that.setData({
        fadongji: res.data.data.fadongji,
        selectShowPlace: !this.data.selectShowPlace,
        selectShowModel: false,
        model: e.currentTarget.dataset.text
      })
    }).catch(err => {
      console.log(err)
    })
  },
  placeList: function (e) {
    var that = this;
    util.sendRequest('vehicle/getvehicleparts', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      vid: e.currentTarget.dataset.vid
    }).then(res => {
      that.setData({
        bigcategory: res.data.data.bigcategory,
        cateinfo: res.data.data.cateinfo,
        vid: res.data.data.vid,
        sid: res.data.data.sid,
        selectShowPlace: !this.data.selectShowPlace,
        place: e.currentTarget.dataset.text,
        successText: true,
        isshowMore: true,
        success:true,
        rightIndex: -1,
        list:[]
      })
    }).catch(err => {
      console.log(err)
    })
  },
  getOeList:function(e){
    var that = this;
    util.sendRequest('vehicle/searchvehicleparts', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      vid: that.data.vid,
      sid: that.data.sid,
      partcode: e.currentTarget.dataset.code
    }).then(res => {
      that.setData({
        oelist: res.data.data.oelist,
        partcode: e.currentTarget.dataset.code,
        rightIndex: e.currentTarget.dataset.index,
        isLeft:true,
        success:false,
        // successText:true
      })
    }).catch(err => {
      console.log(err)
    })
  },
  oeDetail:function(e){
    var that = this;
    util.sendRequest('product/dosearch', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      search: e.currentTarget.dataset.search,
      partcode: that.data.partcode
    }).then(res => {
      let isfavArray = [];
      res.data.data.list.forEach(function (item, index) {
        if(item.type){
          isfavArray.push(item.isfav)
        }
      })
      that.setData({
        list: res.data.data.list,
        successText:false,
        isfavs: isfavArray,
        isshowMore:false,
        oelist:[]
      })
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.sendRequest('vehicle/vehiclebrandlist', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then(res => {
      that.setData({
        vehiclebrand: res.data.data.vehiclebrand
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
    this.setData({
      fixed: false,
      selectShowBrand: true
    })
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