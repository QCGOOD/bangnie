// pages/mine/mine.js
var app = getApp().globalData;
var appJs = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: true,
    putfor: false,
    mes: false,
    ques: false,
    concact: false,
    show:false,
    page: 1,
    vip:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var t = this;
    this.setData({
      width: app.width,
      height: app.height,
      trueheight: app.trueHeight,
    });
    
    this.ziliao();
  },

  // 点击事件
  jumpPage: function(e) {
    let path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: path,
    })
  },
  //进入资料编辑页面、
  intoZiliao: function() {
    var that=this;
    wx.navigateTo({
      url: '/pages/ziliao/ziliao?vip='+that.data.vip,
    })
  },
  //编辑资料接口
  ziliao: function () {
    var t = this;
    wx.request({
      url: `${app.http}/app/memberAuthenticate/get`,
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key")
      },
      success: function (res) {
        // console.log('api用户信息', res);
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            t.ziliao(data)
          })
        } else if (res.data.code == 20000) {
          t.setData({
            userData: res.data.data
          })
        }
      }
    })
  },
  // 回退到首页
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },

})