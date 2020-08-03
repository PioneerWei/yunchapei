// component/place/place.js
var util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeLeft:{
      type: Array
    },
    placeRight:{
      type:Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isLeft: true,
    leftIndex: 0,
    leftId: 1,
    leftText: '滤清系统'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 是否展开
    isLeft: function (e) {
      this.setData({
        isLeft: false
      })
    },
    leftTab: function (e) {
      this.setData({
        leftIndex: e.currentTarget.dataset.index,
        leftId: e.currentTarget.dataset.id,
        isLeft: true,
        leftText: e.currentTarget.dataset.text
      })
    },
    getOeList: function (e) {
      var that = this;
      util.sendRequest('vehicle/searchvehicleparts', 'POST', {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey'),
        vid: that.data.vid,
        sid: that.data.sid,
        partcode: e.currentTarget.dataset.code
      }).then(res => {
        console.log(res)
        that.setData({
          oelist: res.data.data.oelist,
          partcode: e.currentTarget.dataset.code,
          rightIndex: e.currentTarget.dataset.index
        })
      }).catch(err => {
        console.log(err)
      })
    },
  }
})
