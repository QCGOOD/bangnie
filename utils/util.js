const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//添加获取系统信息的方法
const getSystem = () => {
  var sys;
  wx.getSystemInfo({
    success: function(res) {
      // console.log(res);
      sys = res;
    },
  })
  return sys;
}

function request(urlLastAdded, method, data, resolve, reject) {
  // var result;
  var app = getApp().globalData;
  wx.request({
    url: app.http + urlLastAdded,
    method: method,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: data,
    success: function(res) {
      resolve(res);
    },
    fail: function(err) {
      reject(err);
    },
  })
}

module.exports = {
  formatTime: formatTime,
  getSystem: getSystem,
  request: request
}