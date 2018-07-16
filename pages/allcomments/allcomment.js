// pages/allcomments/allcomment.js
var app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LYList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.sourceId);
    var t = this;
    this.setData({
      width: app.width,
      height: app.height,
      trueheight: app.trueHeight,
    });
    //获取留言列表
    wx.request({
      url: app.http + 'app/comment/page',


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
          t.setData({
            blank: true
          });
        }
        for (let i = 0; i < res.data.data.list.length; i++) {
          t.data.LYList.push({
            imgUrl: res.data.data.list[i].memberHeadImage,
            name: res.data.data.list[i].memberName,
            timeStamp: res.data.data.list[i].createTime,
            content: res.data.data.list[i].content
          });
        }
        console.log(t.data.LYList);
        t.setData({
          LYList: t.data.LYList
        })


      }

    })
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
  //回到详情页面
  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },
})