//app.js
var systemData = require("utils/util.js");

App({
  onLaunch: function () {
    this.login();
  },
  // 登录--换取code
  login: function () {
    var _this = this;
    //登录前监察网络状态
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (networkType == "2g" || networkType == "3g") {
          wx.showToast({
            title: '网络不好，请重试~',
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: `${_this.globalData.http}/app/login`,
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: {
            code: "" + res.code
          },
          success: function (r) {
            console.log('换取sessionKey======', r);
            if(r.data.code == 20000) {
              wx.setStorageSync('key', r.data.data.wego168SessionKey);
              if (_this.loginReadyCallback) {
                console.log('我是app.js')
                _this.loginReadyCallback(r.data.data.wego168SessionKey)
              }
            }else{
              wx.showModal({
                title: '提示',
                showCancel: false,
                confirmText: '知道了',
                content: r.data.message,
                success: function (res) {
                  // if (res.confirm) {
                  //   console.log('用户点击确定')
                  // } else if (res.cancel) {
                  //   console.log('用户点击取消')
                  // }
                }
              })
            }
          },
        })
      }
    })
  },
  apiLogin(callback) {
    var _this = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: `${_this.globalData.http}/app/login`,
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: {
            code: "" + res.code
          },
          success: function (r) {
            console.log('换取sessionKey===', r);
            wx.setStorageSync('key', r.data.data.wego168SessionKey);
            callback && callback()
          }
        })
      }
    })
  },
  toast(text, icon) {
    wx.showToast({
      title: text,
      icon: icon || 'none',
      duration:1000
    });
  },
  globalData: {
    userInfo: null,
    width: systemData.getSystem().screenWidth,
    height: systemData.getSystem().windowHeight,
    trueHeight: systemData.getSystem().windowHeight,
    pixelRatio: systemData.getSystem().pixelRatio,
    http: 'https://abn.wego168.com/helpyou/api/v1',
    imgHost: 'https://helpyou-1255600302.cosgz.myqcloud.com',
  }
})