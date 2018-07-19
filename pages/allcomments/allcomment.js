var app = getApp().globalData;
Page({
  data: {
    comments: []
  },
  onLoad: function(options) {
    var _this = this;
    //获取留言列表
    wx.request({
      url: `${app.http}/app/comment/page`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        sourceId: options.sourceId,
        // content: this.data.neirong
        pageSize: 20,
        pageNum: 1
      },
      success: function(res) {
        console.log(res);
        if (res.data.message == "用户未登录或登录已失效") {
          wx.showToast({
            title: '用户未登录或登录已失效',
            icon: 'loading',
            duration: 1000
          });
          wx.navigateTo({
            url: '/pages/welcome/welcome',
          })
        }
        if (res.data.data.list.length == 0) {
          _this.setData({
            blank: true
          });
        }
        _this.setData({
          comments: res.data.data.list
        })
      }
    })
  },
  //回到详情页面
  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },
})