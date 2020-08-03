// pages/login/login.js
let LOGIN_CODE = '';
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //wx.login获取code
  getLoginCode: function () {
    var that = this;
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          LOGIN_CODE = res.code;
          wx.setStorageSync('jscode', res.code);
          resolve();
        },
        fail: () => {
          reject();
        }
      })
    })
  },
  //获取openid
  getOpenid: function (login_code) {
    var that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: util.realm + 'user/getwxuserinfo',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          jscode: login_code
        },
        success: (res) => {
          if (res.data.error_code == 0) {
            let _openid = res.data.data.openid;
            let _unionid = res.data.data.unionid;
            let _uid = res.data.data.uid;
            let _sessionkey = res.data.data.sessionkey;
            wx.setStorageSync('openid', _openid);
            wx.setStorageSync('unionid', _unionid);
            wx.setStorageSync('uid', _uid);
            wx.setStorageSync('sessionkey', _sessionkey);
            resolve({
              'openid': _openid,
              'unionid': _unionid,
              'uid': _uid
            });
          } else {
            wx.showToast({
              title: '网络请求出错，请重试',
              icon: 'none',
              mask: true,
              duration: 2000
            });
            reject('获取openid返回值出错');
          }
        }
      })
    })
  },
  //登录按钮获取用户信息
  onGotUserInfo: function (e) {
    var that = this;
    if (e.detail.errMsg === 'getUserInfo:ok') {
      this.getOpenid(LOGIN_CODE).then((res) => {
        let nickname = e.detail.userInfo.nickName;
        let avatar = e.detail.userInfo.avatarUrl;
        let openid = res.openid;
        // let unionid = res.unionid;
        wx.setStorageSync('nickname', nickname);
        wx.setStorageSync('avatar', avatar);
        // that.uploadUser(nickname, avatar, openid)
        wx.reLaunch({
          url: '../user/user',
        })
        that.onBack()
      })
    }
  },
  onBack: function () {
    var that = this;
    let _backToPath = wx.getStorageSync('BACK_TO_PATH');
    if (_backToPath) {
      if (_backToPath.pathType === 'tabbar') {
        wx.reLaunch({
          url: _backToPath.path
        });
      } else {
        wx.redirectTo({
          url: _backToPath.path
        });
      }
    } else {
      wx.navigateTo({
        url: '../index/index',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLoginCode()
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
    // wx.removeStorageSync('BACK_TO_PATH');
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