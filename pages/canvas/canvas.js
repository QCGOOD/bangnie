import DrawImageData from './json.js';
var app = getApp().globalData;
Page({
  imagePath: '',

  /**
   * 页面的初始数据
   */
  data: {
    template: {},
  },
  onImgOK(e) {
    this.imagePath = e.detail.path;
    wx.hideLoading()
  },

  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
      success() {
        wx.showToast({
          title: '已保存到本地',
        })
      }
    });
  },
  //  获取详情的资讯
  onLoad(opt) {
    wx.showLoading({
      title: '正在生成图片',
    })
    this.getDetails(opt.sourceId)
  },
  getDetails: function(id) {
    var _this = this;
    wx.request({
      url: `${app.http}/app/information/get`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        id: id
      },
      success: function(res) {
        if (res.data.message == "该用户未登录或会话过期") {
          wx.showToast({
            title: '该用户未登录或会话过期',
            icon: 'loading',
            duration: 1000
          });
          wx.navigateTo({
            url: '/pages/welcome/welcome',
          })
        } else {
          _this.getQRCode(res.data.data, id)
        }
      }
    })
  },
  getQRCode(detail, id) {
    let _this = this;
    wx.request({
      url: `${app.http}/app/qrcode/get`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        id: id
      },
      success: function(res) {
        if (res.data.message == "该用户未登录或会话过期") {
          wx.showToast({
            title: '该用户未登录或会话过期',
            icon: 'loading',
            duration: 1000
          });
          wx.navigateTo({
            url: '/pages/welcome/welcome',
          })
        } else {
          console.log()
          _this.setData({
            template: new DrawImageData().palette(detail, app.imgHost + res.data.message),
          });
        }
      }
    })
  }
});