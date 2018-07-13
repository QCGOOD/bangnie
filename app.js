//app.js
var systemData = require("utils/util.js");

App({
  
  onLaunch: function () {
    // 展示本地存储能力
    var t=this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    console.log("app发送时：", systemData.getSystem(), systemData.getSystem().windowHeight
  );
      
    
    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log(res);
    //     wx.request({
    //       url: 'http://192.168.1.18:8011/helpyou/api/v1/app/login',
    //       method:"POST",
    //       header:{
    //         'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //       },
    //       data:{
    //         code:""+res.code
    //       },
    //       success:function(r){
    //         console.log(r.data.data.wego168SessionKey);
    //         var data = r.data.data.wego168SessionKey
    //         t.globalData.key = data;
    //       }

    //     })
    //   }
    // })
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
  globalData: {
    userInfo: null,
    width: systemData.getSystem().screenWidth,
    height: systemData.getSystem().windowHeight,
    trueHeight: systemData.getSystem().windowHeight,
    pixelRatio: systemData.getSystem().pixelRatio,
    key: systemData.login()
  }
})