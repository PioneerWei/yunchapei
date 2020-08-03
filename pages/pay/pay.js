// pages/pay/pay.
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  checkboxChange: function(e) {
    switch (parseInt(e.detail.value[0])) {
      case 0:
        this.setData({
          isXyChecked: false,
          isXjChecked: false,
          typeText: '微信',
          paytype: 1
        })
        break;
      case 1:
        this.setData({
          isWxChecked: false,
          isXyChecked: false,
          typeText: '现金',
          paytype: 2
        })
        break;
      case 2:
        this.setData({
          isWxChecked: false,
          isXjChecked: false,
          typeText: '信用',
          paytype: 3
        })
        break;
    }
  },
  pay: function(e) {
    var that = this;
    switch (parseInt(that.data.type)) {
      // 信用还款
      case 1:
        util.sendRequest('order/czaccount', 'POST', {
          openid: wx.getStorageSync('openid'),
          uid: wx.getStorageSync('uid'),
          sessionkey: wx.getStorageSync('sessionkey'),
          account: that.data.account,
          type: 2,
          paytype: that.data.paytype
        }).then(res => {
          if (parseInt(that.data.paytype) != 1) {
            if (res.data.data) {
              wx.showToast({
                title: '现金还款成功',
                success: (success => {
                  wx.redirectTo({
                    url: '../account/account',
                  })
                })
              })
            } else {
              wx.showToast({
                icon: 'none',
                title: res.data.error_msg
              })
            }
          } else {
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.package,
              signType: 'MD5',
              paySign: res.data.data.paySign,
              success: (resPay => {
                wx.showToast({
                  title: '微信还款成功',
                  success:(success => {
                    wx.navigateBack()
                  })
                })
              }),
              fail(res) {}
            })
          }
        }).catch(err => {
          console.log(err)
        })
        break;
      // 积分充值
      case 2:
        util.sendRequest('order/dobuyintegralweixin', 'POST', {
          openid: wx.getStorageSync('openid'),
          uid: wx.getStorageSync('uid'),
          sessionkey: wx.getStorageSync('sessionkey'),
          integral: that.data.account,
          paytype: that.data.paytype
        }).then(res => {
          if (parseInt(that.data.paytype) != 1) {
            if(!res.data.data){
              wx.showToast({
                icon: 'none',
                title: res.data.error_msg
              })
            }else{
              wx.showToast({
                title: '现金充值成功',
                success: (success => {
                  wx.navigateBack({
                    delta:2
                  })
                })
              })
            }
          } else {
            if(res.data.data){
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                signType: 'MD5',
                paySign: res.data.data.paySign,
                success(resPay) {
                  wx.showToast({
                    title: '微信充值成功',
                    success: (success => {
                      wx.navigateBack()
                    })
                  })
                },
                fail(res) { }
              })
            }else{
              wx.showToast({
                icon:'none',
                title: res.data.error_msg
              })
            }
          }
        }).catch(err => {
          console.log(err)
        })
        break;
        // 订单支付
      default:
        util.sendRequest('order/orderpay', 'POST', {
          openid: wx.getStorageSync('openid'),
          uid: wx.getStorageSync('uid'),
          sessionkey: wx.getStorageSync('sessionkey'),
          oid: that.data.oid,
          remark: that.data.remark,
          shipping_type: that.data.shippingtype,
          wuliu: that.data.wuliu,
          book_id: that.data.bookid,
          paytype: that.data.paytype,
          cangku: that.data.cangku
        }).then(res => {
          switch (parseInt(that.data.paytype)) {
            case 1:
              if(res.data.data){
                wx.requestPayment({
                  timeStamp: res.data.data.timeStamp,
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.package,
                  signType: 'MD5',
                  paySign: res.data.data.paySign,
                  success(resPay) {
                    wx.showToast({
                      title: '微信支付成功',
                      success: (success => {
                        wx.redirectTo({
                          url: '../order/order',
                        })
                      })
                    })
                  },
                  fail(res) { }
                })
              }else{
                wx.showToast({
                  icon: 'none',
                  title: res.data.error_msg
                })
              }
              break;
            case 2:
              if (res.data.data) {
                wx.showToast({
                  icon: 'none',
                  title: '现金支付成功',
                  success: (success => {
                    wx.redirectTo({
                      url: '../order/order',
                    })
                  })
                })
              } else {
                wx.showToast({
                  icon: 'none',
                  title: res.data.error_msg
                })
              }
              break;
            case 3:
              if (res.data.data) {
                wx.showToast({
                  icon: 'none',
                  title: '信用支付成功',
                  success: (success => {
                    wx.redirectTo({
                      url: '../order/order',
                    })
                  })
                })
              } else {
                wx.showToast({
                  icon: 'none',
                  title: res.data.error_msg
                })
              }
              break;
          }
        }).catch(err => {
          console.log(err)
        })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.type) {
      this.setData({
        isXyShow: true,
        type: options.type
      })
    }
    console.log(options)
    this.setData({
      account: options.number,
      bookid: options.bookid,
      oid: options.oid,
      remark: options.remark,
      shippingtype: options.shippingtype,
      wuliu: options.wuliu,
      cangku: options.cangku
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