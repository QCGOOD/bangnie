// pages/sendSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuthorize: false
  },

  onLoad() {
    // wx.getSetting({
    //   success: res => {
    //     console.log("getSetting == ", res);
    //     if (res.authSetting["scope.userInfo"]) {
    //       this.setData({
    //         isAuthorize: false
    //       })
    //     } else {
    //       this.setData({
    //         isAuthorize: true
    //       })
    //     }
    //   }
    // });
  },
  back() {
    wx.switchTab({
      url: '/pages/main/main',
      success: function () {
        let pages = getCurrentPages()
        pages.map(item => {
          if (item.route == 'pages/main/main') {
            item.onLoad()
          }
        })
      }
    })
  },
  closeAuthorize() {
    this.setData({
      isAuthorize: false
    })
  }
})