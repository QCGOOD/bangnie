//app.js
var systemData = require("utils/util.js");

App({
  
  onLaunch: function () {
    // 展示本地存储能力
    var t=this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    this.login();

  
  // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(wx.getStorageInfoSync("key"));
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // wx.getUserInfo({
          //   success: res => {
          //     // 可以将 res 发送给后台解码出 unionId
          //     this.globalData.userInfo = res.userInfo

          //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          //     // 所以此处加入 callback 以防止这种情况
          //     if (this.userInfoReadyCallback) {
          //       this.userInfoReadyCallback(res)
          //     }
          //   }
          // })
        }
      }
    })
  },
  // 登录--换取code
  login: function () {
    var t = this;
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
          url: `${t.http}/app/login`,
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: {
            code: "" + res.code
          },
          success: function (r) {
            console.log("执行用户登录login");
            console.log('换取sessionKey======', r);
            if(r.data.code == 20000) {
              t.setData({
                key: r.data.data.wego168SessionKey
              });
              wx.setStorageSync('key', r.data.data.wego168SessionKey);
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
    // key: systemData.login(),
    http: 'https://abn.wego168.com/helpyou/api/v1',
    // http: 'http://192.168.1.18:8011/helpyou/api/v1',
    
    // url: 'http://192.168.1.18:8011/helpyou/api/v1',

    imgHost: 'http://helpyou-1255600302.cosgz.myqcloud.com',
  }
})