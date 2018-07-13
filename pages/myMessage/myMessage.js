
var app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    userData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    this.setData({
      width: app.width,
      height: app.height,
      trueheight: app.trueHeight,
    });
    t.getMessage(t.data.page);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 回退到首页
  back: function () {

    wx.navigateBack({
      delta: 1
    })
  },
  // 获取资讯列表
  getMessage: function (page) {
    var t = this;
    console.log("获取资讯列表执行了" + wx.getStorageSync("id") + page);
    var categoryId = wx.getStorageSync("categoryId") || "";
    // console.log(categoryId);
    console.log(categoryId);

    wx.request({
      url: 'http://192.168.1.18:8011/helpyou/api/v1/app/information/page',
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        areaId: wx.getStorageSync("id"),
        categoryId: categoryId,
        pageNum: page,
        pageSize: 20,
        listType: 2
      },
      success: function (res) {
        console.log(res);
        let tempArr = [];
        for (let i = 0; i < res.data.data.list.length; i++) {
          let content = [];
          let len;
          // console.log("当前userData位置:", t.data.userData.length + 1);
          // console.log(res.data.data.list[i].imgUrl.split(","));
          if (res.data.data.list[i].imgUrl != '') {
            content[i] = res.data.data.list[i].imgUrl.split(','); //记得修改
            for (let l = 0; l < content[i].length; l++) {
              content[i][l] = 'http://helpyou-1255600302.cosgz.myqcloud.com' + content[i][l]
            }
          } else {
            content[i] = [];
          }


          tempArr[i] = {
            name: res.data.data.list[i].username,
            timeStamp: res.data.data.list[i].createTime,
            avatarUrl: res.data.data.list[i].headImage,
            text: res.data.data.list[i].content,
            content: content[i],
            address: res.data.data.list[i].address,
            category: res.data.data.list[i].category,
            others: [{
              key: "/images/liulan.png",
              value: res.data.data.list[i].visitQuantity

            }, {
              key: "/images/comments.png",
              value: "111"
            }, {
              key: "/images/succ.png",
              value: res.data.data.list[i].praiseQuantity,
              flag: res.data.data.list[i].isPraise

            }, {
              key: "/images/share.png",
              value: "111"
            },],
            message_id: res.data.data.list[i].id,
            len: content[i].length,
            error: false,

            isPraise: res.data.data.list[i].isPraise
          };
        };
        t.data.userData = t.data.userData.concat(tempArr);
        console.log(t.data.userData);
        t.setData({
          userData: t.data.userData
        });
      }
    })
  },
})