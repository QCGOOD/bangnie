var app = getApp().globalData;
var appJs = getApp();

Page({
  data: {
    detail: {}
  },

  onLoad: function (options) {
    this.getDetail(options.id)
  },

  // 获取列表
  getDetail: function (id) {
    wx.showLoading({title: '加载中…'})
    var _this = this;
    wx.request({
      url: `${app.http}/app/message/get`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        id: id
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            _this.getDetail(id)
          })
        } else if (res.data.code == 20000) {
          res.data.data.createTime = res.data.data.createTime.substr(0, 16)
          _this.setData({
            detail: res.data.data
          });
        }
      }
    })
  },

})