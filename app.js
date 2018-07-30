//app.js
var systemData = require("utils/util.js");

App({
  onLaunch: function () {
    // 先清下缓存-防止新用户进来用的上次的sessionKey
    wx.removeStorageSync('key');
    this.login();
  },
  // 登录--换取code
  login: function () {
    var _this = this;
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
                console.log('我是app.js；回调了')
                _this.loginReadyCallback(r.data.data.wego168SessionKey)
              }
            } else {
              _this.toast('登录失败请重试');
              _this.login(callback)
            }
          },
          fail: function () {
            _this.toast('登录失败请重试');
            _this.login(callback)
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
            if (r.data.code == 20000) {
              wx.setStorageSync('key', r.data.data.wego168SessionKey);
              callback && callback()
            } else {
              _this.toast('登录失败请重试');
              _this.apiLogin(callback)
            }
          },
          fail: function () {
            _this.toast('登录失败请重试');
            _this.apiLogin(callback)
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
    // http: 'http://192.168.1.18:8011/helpyou/api/v1',
    imgHost: 'https://helpyou-1255600302.cosgz.myqcloud.com',
  }
})