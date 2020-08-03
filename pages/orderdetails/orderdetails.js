// pages/orderdetails/orderdetails.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 500,
    clickReturn: false,
    returnStatus: 0,
    pid:[],
    quantity:[],
    count:[],
    wuliuIndex: 0,
    yunfeiIndex:0,
    cangku:[]
  },
  // 选择地址
  toSelectAddress:function(e){
    if (this.data.order_status == '0'){
      wx.navigateTo({
        url: '../selectadd/selectadd',
      })
    }
  },
  // 确认收货
  confirmReceipt: function(e) {
    var that = this;
    util.sendRequest('order/orderalter', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      oid: that.data.oid
    }).then(res => {
      if(res.data.data.status){
        wx.redirectTo({
          url: '../order/order',
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  checkboxChange:function(e){
    if(e.detail.value[0]){
      this.data.pid.push(e.detail.value)
      if (!this.data.count[e.currentTarget.dataset.index]){
        this.data.quantity.push(e.currentTarget.dataset.quantity)
      }
    }else{
      this.data.pid.splice(e.currentTarget.dataset.index,1)
      this.data.quantity.splice(e.currentTarget.dataset.index,1)
    }
  },
  // 加
  add:function(e){
    let index = e.currentTarget.dataset.index;
    this.data.count.splice(index, 1, parseInt(this.data.count[index])+1);
    this.data.quantity.splice(index, 1, this.data.count);
    this.setData({
      count:this.data.count
    })
  },
  // 减
  jian:function(e){
    let index = e.currentTarget.dataset.index;
    this.data.count.splice(index,1,parseInt(this.data.count[index])-1);
    this.data.quantity.splice(index, 1, this.data.count)
    if(this.data.count[index] < 0){
      this.data.count[index] = 0
    }
    this.setData({
      count: this.data.count
    })
  },
  // 申请退货
  toReturn: function(e) {
    var that = this;
    if (that.data.returnStatus) {
      util.sendRequest('order/tuihuosubmit', 'POST', {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey'),
        oid: that.data.oid,
        pid: that.data.pid.join(),
        quantity: that.data.quantity.join()
      }).then(res => {
        if(res.data.data.status){
          wx.redirectTo({
            url: '../returnorder/returnorder',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      that.setData({
        clickReturn: true,
        returnStatus: 1
      })
    }
  },
  //查看退货进度
  viewReturn:function(e){
    wx.navigateTo({
      url: '../returndetails/returndetails?oid=' + this.data.oid,
    })
  },
  // 备注
  remark:function(e){
    this.setData({
      remark:e.detail.value
    })
  },
  // 去支付
  toPay:function(e){
    if(!this.data.remark){
      this.setData({
        remark: ''
      })
    }
    wx.navigateTo({
      url: '../pay/pay?number=' + this.data.shifu + '&oid=' + this.data.oid + '&remark=' + this.data.remark + '&shippingtype=' + this.data.yunfei[this.data.yunfeiIndex].id + '&wuliu=' + this.data.wuliu[this.data.wuliuIndex].id + '&bookid=' + this.data.bookid + '&cangku=' + JSON.stringify(this.data.cangku),
    })
  },
  wuliuPickerChange: function (e) {
    this.setData({
      wuliuIndex: e.detail.value
    })
  },
  yunfeiPickerChange: function (e) {
    this.setData({
      yunfeiIndex: e.detail.value
    })
  },
  storeChange:function(e){
    if(e.detail.value[0]){
      let cangObj ={parame: e.currentTarget.dataset.parame, value: e.currentTarget.dataset.value};
      this.data.cangku.push(cangObj)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    util.sendRequest('order/orderdetail', 'POST', {
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid'),
      sessionkey: wx.getStorageSync('sessionkey'),
      oid: options.oid,
      type: 1
    }).then(res => {
      if(res.data.data){
        that.setData({
          order_status: res.data.data.order_status,
          detail: res.data.data.detail,
          paytype: res.data.data.paytype,
          orderstatus: res.data.data.orderstatus,
          orderinfo: res.data.data.orderinfo,
          dangqianyunfei: res.data.data.account.dangqianyunfei,
          heji: res.data.data.account.heji,
          product_jine: res.data.data.account.product_jine,
          shangyiciyunfei: res.data.data.account.shangyiciyunfei,
          shifu: res.data.data.account.shifu,
          accyunfei: res.data.data.account.yunfei,
          useraccount: res.data.data.useraccount,
          wuliu: res.data.data.wuliu,
          yunfei: res.data.data.yunfei,
          address: res.data.data.book.address,
          bookid: res.data.data.book.id,
          city: res.data.data.book.city,
          name: res.data.data.book.name,
          province: res.data.data.book.province,
          country: res.data.data.book.country,
          telephone: res.data.data.book.telephone,
          textarea: res.data.data.order.remark,
          oid: options.oid
        })
        res.data.data.detail[0].prolist.forEach(function (item, index) {
          that.setData({
            count: that.data.count.concat(item.quantity)
          })
        })
      }else{
        wx.showToast({
          icon:'none',
          title: res.data.error_msg,
          success:success => {
            setTimeout(function(){
              wx.navigateBack()
            },1000)
          }
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
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.province) {
      this.setData({
        //将携带的参数赋值
        province: currPage.data.province,
        city: currPage.data.city,
        country: currPage.data.country,
        address: currPage.data.address,
        telephone: currPage.data.telephone,
        bookid: currPage.data.bookid,
        name: currPage.data.nmae
      });
    }
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