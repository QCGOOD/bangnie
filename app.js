//app.js
var systemData = require("utils/util.js");

App({
  onLaunch: function () {
    // 先清下缓存-防止新用户进来用的上次的sessionKey
    wx.removeStorageSync('key');
    console.log(1111111)
    this.login();
  },
  // 登录--换取code
  login: function () {
    var _this = this;
    //登录前监察网络状态
    // wx.getNetworkType({
    //   success: function (res) {
    //     // 返回网络类型, 有效值：
    //     // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
    //     var networkType = res.networkType
    //     if (networkType == "2g" || networkType == "3g") {
    //       wx.showToast({
    //         title: '网络不好，请重试~',
    //         icon: 'loading',
    //         duration: 1000
    //       })
    //     }
    //   }
    // })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.showLoading({title: '登录中…'});
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
            wx.hideLoading();
            console.log('换取sessionKey======', r.data);
            if(r.data.code == 20000) {
              wx.setStorageSync('key', r.data.data.wego168SessionKey);
              if (_this.loginReadyCallback) {
                console.log('我是app.js')
                _this.loginReadyCallback(r.data.data.wego168SessionKey)
              }
            }
          },
          fail: function () {
            _this.toast('登录失败请重试');
            wx.hideLoading();
          }
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
        wx.showLoading({title: '重新登录中…'});
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
            wx.hideLoading();
            console.log('换取sessionKey===', r.data);
            wx.setStorageSync('key', r.data.data.wego168SessionKey);
            callback && callback()
          },
          fail: function () {
            _this.toast('登录失败请重试');
            wx.hideLoading();
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