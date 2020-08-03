// pages/type/type.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectAll: true,
    selectShowBrand: false,
    selectShowSort: false,
    isSearchPro: true,
    category_id: '',
    brand_id: '',
    isLeft: true,
    leftId: 1,
    leftIndex: 0,
    index: 0,
    leftText: '滤清系统',
    brandText: '品牌',
    page: 1
  },
  // 跳转详情页
  toDetails: function(e) {
    wx.navigateTo({
      url: '../details/details?pid=' + e.currentTarget.dataset.pid,
    })
  },
  // 获取子组件传过来的数据
  getCount: function(e) {
    this.setData({
      count: e.detail
    })
  },
  getSearch: function(e) {
    if (e.detail != 'isStatusOE') {
      let isfavArray = [];
      e.detail.forEach(function(item, index) {
        isfavArray.push(item.isfav)
      })
      this.setData({
        list: e.detail,
        isSearchPro: false,
        isfavs: isfavArray
      })
    } else {
      this.setData({
        fixed: true
      })
    }
  },
  // 选择成功
  selectChange: function(e) {
    this.setData({
      index: e.detail.value,
      selectShow: !this.data.selectShow
    })
  },
  // 取消选择
  selectCancel: function(e) {
    this.setData({
      selectShow: !this.data.selectShow
    });

  },
  // 全部
  all: function(e) {
    let that = this;
    this.setData({
      selectAll: true,
      selectShowBrand: false
      // selectShowSort: false
    });
    wx.request({
      url: util.realm + 'product/goodlist',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey'),
        search: that.data.val
      },
      success: (res) => {
        that.setData({
          list: res.data.data.list,
          count: res.data.data.count,
          brandText: e.currentTarget.dataset.text
        })
      }
    })
  },
  brandSort() {
    this.setData({
      selectShowBrand: !this.data.selectShowBrand,
      selectShowSort: false,
      selectAll: false
    });
  },
  sort() {
    this.setData({
      selectShowSort: !this.data.selectShowSort,
      selectShowBrand: false,
      selectAll: false
    });
  },
  //关闭弹层
  cancel: function(e) {
    this.setData({
      selectShowBrand: false,
      selectShowSort: false
    })
  },
  // 是否展开
  isLeft: function(e) {
    this.setData({
      isLeft: false
    })
  },
  leftTab: function(e) {
    this.setData({
      leftIndex: e.currentTarget.dataset.index,
      leftId: e.currentTarget.dataset.id,
      isLeft: true,
      leftText: e.currentTarget.dataset.text
    })
  },
  //收藏
  collect: function(e) {
    var that = this;
    util.sendRequest('user/opefav', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      pid: e.currentTarget.dataset.pid,
      type: 0
    }).then((res) => {
      that.data.isfavs.splice(e.currentTarget.dataset.index, 1, 1)
      that.setData({
        isfavs: that.data.isfavs
      })
    }).catch((err) => {
      console.log(err)
    })

  },
  //取消收藏
  collectCancel: function(e) {
    var that = this;
    util.sendRequest('user/opefav', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      pid: e.currentTarget.dataset.pid,
      type: 1
    }).then((res) => {
      that.data.isfavs.splice(e.currentTarget.dataset.index, 1, 0)
      that.setData({
        isfavs: that.data.isfavs
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  // 加入购物车
  addCar: function(e) {
    var that = this;
    util.sendRequest('user/opecart', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      pid: e.currentTarget.dataset.pid,
      type: 1
    }).then((res) => {
      if (res.data.data) {
        wx.setStorageSync('carNum', res.data.data.basketnum)
        wx.setTabBarBadge({
          index: 3,
          text: res.data.data.basketnum
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.error_msg
        })
      }

    }).catch((err) => {
      console.log(err)
    })
  },
  // 品牌筛选
  brandSree: function(e) {
    var that = this;
    util.sendRequest('product/goodlist', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      brand_id: e.currentTarget.dataset.id,
      category_id: that.data.category_id
    }).then((res) => {
      that.setData({
        list: res.data.data.list,
        brand_id: e.currentTarget.dataset.id,
        selectShowBrand: false,
        brandText: e.currentTarget.dataset.text
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  // 排序
  sortSree: function(e) {
    this.setData({
      selectShowSort: false
    })
  },
  // 系统筛选
  categoryScree: function(e) {
    var that = this;
    util.sendRequest('product/goodlist', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      search:that.data.val,
      category_id: e.currentTarget.dataset.id,
      brand_id: that.data.brand_id
    }).then((res) => {
      that.setData({
        list: res.data.data.list,
        category_id: e.currentTarget.dataset.id,
        count: res.data.data.count,
        rightIndex: e.currentTarget.dataset.index
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      count: options.count
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
    var that = this;
    if (app.globalData.search) {
      let isfavArray = [];
      app.globalData.search.forEach(function(item, index) {
        isfavArray.push(item.isfav)
      })
      that.setData({
        list: app.globalData.search,
        isSearchPro: false,
        count: app.globalData.count,
        bigcategory: app.globalData.bigcateg,
        brand: app.globalData.brand,
        category: app.globalData.categ,
        val: app.globalData.value,
        isfavs: isfavArray
      })
    } else {
      util.sendRequest('product/goodlist', 'POST', {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey'),
        page: that.data.page
      }).then((res) => {
        let isfavArray = [];
        res.data.data.list.forEach(function(item, index) {
          isfavArray.push(item.isfav)
        })
        that.setData({
          list: res.data.data.list,
          count: res.data.data.count,
          bigcategory: res.data.data.bigcategory,
          category: res.data.data.category,
          brand: res.data.data.brand,
          isfavs: isfavArray,
          page: that.data.page + 1
        })
      }).catch((err) => {
        console.log(err)
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    app.globalData = {}
    this.setData({
      val:'',
      page: 1,
      fixed: false,
      rightIndex:-1,
      isSearchPro:true,
      brandText: '品牌',
    })
    this.all()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  onPageScroll: function(e) {
    this.setData({
      isLeft: true
    })
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
    var that = this;
    if(!that.data.val){
      that.setData({
        val:''
      })
    }
    if (!that.data.category_id) {
      that.setData({
        category_id: ''
      })
    }
    if (!that.data.brand_id) {
      that.setData({
        brand_id: ''
      })
    }
    util.sendRequest('product/goodlist', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      search:that.data.val,
      category_id: that.data.category_id,
      brand_id: that.data.brand_id,
      page: that.data.page
    }).then((res) => {
      let isfavArray = [];
      res.data.data.list.forEach(function(item, index) {
        isfavArray.push(item.isfav)
      })
      that.setData({
        list: that.data.list.concat(res.data.data.list),
        isfavs: that.data.isfavs.concat(isfavArray),
        page: that.data.page + 1
      })
    }).catch((err) => {
      console.log(err)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})