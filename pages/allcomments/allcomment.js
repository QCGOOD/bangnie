var app = getApp().globalData;
var appJs = getApp();

Page({
  data: {
    comments: []
  },
  onLoad: function(options) {
    this.getLeaveMsg(options.sourceId)
  },

  getLeaveMsg(id) {
    var _this = this;
    //获取留言列表
    wx.showLoading({title: '加载中…'})
    wx.request({
      url: `${app.http}/app/comment/page`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        sourceId: id,
        // content: this.data.neirong
        pageSize: 100,
        pageNum: 1
      },
      success: function(res) {
        console.log('留言列表', res.data);
        wx.hideLoading()
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            _this.getLeaveMsg()
          })
        } else if (res.data.code == 20000) {
          if (res.data.data.list.length == 0) {
            _this.setData({
              blank: true
            });
          }
          _this.setData({
            comments: res.data.data.list
          })
        } else {
          appJs.toast('加载失败')
        }
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