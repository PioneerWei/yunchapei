//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    index: 0, //选择的下拉列表下标,
    tapIndex: 0,
    imgIndex: 762,
    isCollect: false,
    isfavs: []
  },
  // 获取子组件传过来的数据
  getValue: function (e) {
    app.globalData.value = e.detail;
  },
  getCount: function (e) {
    app.globalData.count = e.detail;
  },
  getBrand: function (e) {
    app.globalData.brand = e.detail;
  },
  getBigcateg: function (e) {
    app.globalData.bigcateg = e.detail;
  },
  getCateg: function (e) {
    app.globalData.categ = e.detail;
  },
  getSearch: function(e) {
    if (e.detail != 'isStatusOE'){
      app.globalData.search = e.detail;
      wx.switchTab({
        url: '../type/type',
      })
    }else{
      this.setData({
        fixed:true
      })
    }
    
  },
  
  showLiModal: function(e) {
    this.setData({
      showModalIndex: e.currentTarget.dataset.index
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
  cancelCollect: function(e) {
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
      if(res.data.data){
        wx.setStorageSync('carNum', res.data.data.basketnum)
        wx.setTabBarBadge({
          index: 3,
          text: res.data.data.basketnum
        })
        that.setData({
          showModalIndex: -1
        })
      }else{
        wx.showToast({
          icon: 'none',
          title: res.data.error_msg
        })
      }
      
    }).catch((err) => {
      console.log(err)
    })
  },
  // 跳转产品订购页
  toType: function(e) {
    wx.switchTab({
      url: '../type/type',
    })
  },
  // 跳转订单页
  toOrder: function(e) {
    wx.navigateTo({
      url: '../order/order',
    })
  },
  // 跳转车型查询页
  toModel: function(e) {
    wx.switchTab({
      url: '../model/model',
    })
  },
  // 跳转详情页
  toDetails: function(e) {
    wx.navigateTo({
      url: '../details/details?pid=' + e.currentTarget.dataset.pid,
    })
  },
  //选项卡切换
  scrollnavTab: function(e) {
    var that = this;
    util.sendRequest('index/getcatepro', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      cateid: e.currentTarget.dataset.id
    }).then((res) => {
      that.setData({
        tapIndex: e.currentTarget.dataset.index,
        list: res.data.data.list,
        showModalIndex: -1
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  onLoad: function() {
    var that = this;
    if (!wx.getStorageSync('openid')) { //未登录状态
      wx.setStorageSync('BACK_TO_PATH', {
        pathType: 'tabbar',
        path: '/pages/index/index',
      });
      return wx.redirectTo({
        url: '/pages/login/login'
      });
    }
    if (!wx.getStorageSync('uid')) { //未绑定状态
      wx.reLaunch({
        url: '../user/user',
      })
    }
    // 轮播图
    util.sendRequest('index/lunbo', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then((res) => {
      that.setData({
        lunbo: res.data.data.lunbo
      })
    }).catch((err) => {
      console.log(err)
    })
    // 榜单
    util.sendRequest('index/bangdan', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then((res) => {
      that.setData({
        bangdan: res.data.data.bangdan
      })
    }).catch((err) => {
      console.log(err)
    })
    // 内容
    util.sendRequest('index/indexcategory', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then((res) => {
      that.setData({
        category: res.data.data.category
      })
    }).catch((err) => {
      console.log(err)
    })
    util.sendRequest('index/getcatepro', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then((res) => {
      that.setData({
        list: res.data.data.list
      })
      res.data.data.list.forEach(function(item, index) {
        that.setData({
          isfavs: that.data.isfavs.concat(item.isfav)
        })
      })
    }).catch((err) => {
      console.log(err)
    })
    // 购物车初始数量
    util.sendRequest('user/basketnum', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey')
    }).then(res => {
      if (parseInt(res.data.error_code) != 0) {
        wx.login({
          success: resLogin => {
            util.sendRequest('user/getwxuserinfo', 'POST', {
              jscode: resLogin.code
            }).then(openidRes => {
              let _sessionkey = openidRes.data.data.sessionkey;
              wx.setStorageSync('sessionkey', _sessionkey);
            }).catch(openidErr => {
              console.log(openidErr)
            })
          }
        })
      } else {
        wx.setStorageSync('carNum', res.data.data.basketnum)
        if (parseInt(res.data.data.basketnum) != 0) {
          wx.setTabBarBadge({
            index: 3,
            text: res.data.data.basketnum
          })
        }
      }
    })
  },
  onHide:function(){
    this.setData({
      fixed:false,
      showModalIndex:-1
    })
  }
})