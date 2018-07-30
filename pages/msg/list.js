
var app = getApp().globalData;
var appJs = getApp();
Page({

  data: {
    imgHost: app.imgHost,
    list: [],
  },

  onLoad: function (options) {
    this.getMessage();
  },

  // 回退到首页
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  jumpPage(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './detail/detail?id='+id,
    })
  },
  
  // 获取列表
  getMessage: function () {
    wx.showLoading({title: '加载中…'})
    var _this = this;
    wx.request({
      url: `${app.http}/app/message/page`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        pageNum: 1,
        pageSize: 100
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            _this.getMessage()
          })
        } else if (res.data.code == 20000) {
          if (res.data.data.list.length > 0) {
            res.data.data.list.map(item => {
              item.createTime = item.createTime.substr(0, 16)
            })
          }
          _this.setData({
            list: res.data.data.list
          });
        }
      }
    })
  },
})