// component/search/search.js
var util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isStatusOE:{
      type: Boolean
    },
    value: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectShow: false,
    selectData: ['搜产品', 'VIN或OE'],
    index: 0,
    category_id: '',
    brand_id: '',
    isStatus: true,
    isStatusOE: false,
    isLeft:true,
    leftIndex: 0,
    leftId: 1,
    leftText: '滤清系统',
    successText: true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 上传图片
    upImg:function(e){
      let that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          const path = res.tempFilePaths[0]
          wx.getFileSystemManager().readFile({
            filePath: path, //选择图片返回的相对路径
            encoding: "base64",//这个是很重要的
            success: temp => { //成功的回调
              //返回base64格式
              util.sendRequest('ocr/vinocr', 'POST', {
                openid: wx.getStorageSync('openid'),
                uid: wx.getStorageSync('uid'),
                sessionkey: wx.getStorageSync('sessionkey'),
                file: temp.data
              }).then(upRes => {
                that.setData({
                  value: upRes.data.data.vin,
                  index:1
                })
                that.search()
              }).catch(err => {
                console.log(err)
              })
            }
          })
          
        }
      })
    },
    // 点击下拉显示框
    selectTap() {
      this.setData({
        selectShow: !this.data.selectShow
      });
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
    value: function(e) {
      this.setData({
        value: e.detail.value
      })
    },
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
    // 搜索OE状态3
    toTwoDetail: function(e) {
      var that = this;
      wx.request({
        url: util.realm + 'product/dosearch',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          openid: wx.getStorageSync('openid'),
          uid: wx.getStorageSync('uid'),
          sessionkey: wx.getStorageSync('sessionkey'),
          search: that.data.value,
          vin3id: e.currentTarget.dataset.vin3id
        },
        success: (res) => {
          that.setData({
            bigcategory: res.data.data.bigcategory,
            info: res.data.data.info,
            isStatus: true,
            isStatusOE: false
          })
        }
      })
    },
    search: function(e) {
      let that = this;
      if (that.data.index == 1) {
        wx.request({
          url: util.realm + 'product/dosearch',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          data: {
            openid: wx.getStorageSync('openid'),
            uid: wx.getStorageSync('uid'),
            sessionkey: wx.getStorageSync('sessionkey'),
            search: that.data.value
          },
          success: (res) => {
            if (res.data.data){
              switch (res.data.data.status) {
                case 0:
                  wx.showToast({
                    title: '暂无搜索数据',
                    icon: 'none',
                    duration: 2000,
                  })
                  break;
                case 1:
                  that.setData({
                    isStatusOE: true,
                    cateinfo: res.data.data.cateinfo,
                    bigcategory: res.data.data.bigcategory,
                    info: res.data.data.info,
                    vin: res.data.data.search,
                    sid: res.data.data.sid,
                    vinid: res.data.data.vinid
                  })
                  that.triggerEvent('myevent', 'isStatusOE');
                  break;
                case 2:
                  break;
                case 3:
                  that.setData({
                    isStatus: false,
                    vindata: res.data.data.vindata
                  })
                  break;
                case 4:
                  that.triggerEvent('myevent', res.data.data.list);
                  break;
              }
            }else{
              wx.showToast({
                icon:'none',
                title: res.data.error_msg
              })
            }
          }
        })
      } else {
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
            search: that.data.value,
            category_id: that.data.category_id,
            brand_id: that.data.brand_id
          },
          success: (res) => {
            that.triggerEvent('myevent', res.data.data.list)
            that.triggerEvent('mycount', res.data.data.count)
            that.triggerEvent('mybrand', res.data.data.brand)
            that.triggerEvent('mybigcateg', res.data.data.bigcategory)
            that.triggerEvent('mycateg', res.data.data.category)
            that.triggerEvent('myvalue', that.data.value)
          }
        })
      }
    },
    getOeList: function (e) {
      var that = this;
      util.sendRequest('product/searchparts', 'POST', {
        openid: wx.getStorageSync('openid'),
        uid: wx.getStorageSync('uid'),
        sessionkey: wx.getStorageSync('sessionkey'),
        vin:that.data.vin,
        vinid: that.data.vinid,
        sid: that.data.sid,
        partcode: e.currentTarget.dataset.code
      }).then(res => {
        that.setData({
          oelist: res.data.data.list,
          partcode: e.currentTarget.dataset.code,
          rightIndex: e.currentTarget.dataset.index
        })
      }).catch(err => {
        console.log(err)
      })
    },
    oeDetail: function (e) {
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
          if (item.type) {
            isfavArray.push(item.isfav)
          }
        })
        that.setData({
          list: res.data.data.list,
          successText: false,
          isfavs: isfavArray,
          isshowMore: false
        })
      }).catch(err => {
        console.log(err)
      })
    },
  }
})