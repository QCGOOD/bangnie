// pages/mine/mine.js
var app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: true,
    putfor: false,
    mes: false,
    ques: false,
    concact: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      height: app.height,
      trueheight: app.trueHeight
    });
    this.ziliao();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 点击事件
  putfor: function() {
    wx.navigateTo({
      url: '/pages/mySend/mySend',
    })
  },
  mes: function() {
    wx.navigateTo({
      url: '/pages/myMessage/myMessage',
    })
  },
  ques: function() {
    wx.navigateTo({
      url: '/pages/que/que',
    })
  },
  contact: function() {
    wx.navigateTo({
      url: '/pages/kefu/kefu',
    })
  },
  //进入资料编辑页面、
  intoZiliao: function() {
    wx.navigateTo({
      url: '/pages/ziliao/ziliao',
    })
  },
  //编辑资料接口
  ziliao: function () {
    var t = this;
    wx.request({
      url: 'http://192.168.1.18:8011/helpyou/api/v1/app/memberAuthenticate/get',
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key")
      },
      success: function (res) {
        console.log(res);
        let img = res.data.data.headImage || "/images/content1.png";
        let name = res.data.data.name || "未设置";
        let phone = res.data.data.phoneNumber || "";
        let gs = res.data.data.gs || "";
        let zw = res.data.data.zw || "";
        console.log(img, zw);
        t.data.userData = {
          // name:
          img: img,
          name: name,
          phone: phone,
          gs: gs,
          zw: zw
        };
        t.setData({
          userData: t.data.userData
        });
      }
    })
  },
})