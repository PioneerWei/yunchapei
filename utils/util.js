const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const realm = 'https://test1.yunchapei.com/'

var sendRequest = function (url, method, data = {}) {
  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: 'https://test1.yunchapei.com/'+url,
      data: data,
      method: method,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      success: function (data) {
        //做一些统一处理操作，例如401验证
        //resolve用于具体调用中
        resolve(data);
      },
      fail: function (data) {
        reject(data);
      }
    })
  })
  return promise
}

module.exports = {
  formatTime: formatTime,
  realm: realm,
  sendRequest: sendRequest
}
