// pages/move/move.js
var app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperIndex:0,
    swiperData: [{
      index: 0,
      text: "最新"
    }, {
      index: 1,
      text: "最热"
    }, ], //滑块数据
    userData: [{ name: '徐若海', timeStamp: '3分钟前', avatarUrl: "/images/service1.png", text: "这里只是一段测试的文字！这里只是一段测试的文字！这里只是一段测试的文字！这里只是一段测试的文字！", content: ["/images/content1.png", "/images/content1.png", "/images/content2.png", "/images/content3.png", "/images/content4.png",], address: "anhuitaihu", others: 'dianzan' }, { name: '徐若海', timeStamp: '3分钟前', avatarUrl: "/images/service1.png", text: "这里只是一段测试的文字！这里只是一段测试的文字！这里只是一段测试的文字！这里只是一段测试的文字！", content: ["/images/content1.png", "/images/content1.png", "/images/content2.png", "/images/content3.png", "/images/content4.png",], address: "anhuitaihu", others: 'dianzan' }, { name: '徐若海', timeStamp: '3分钟前', avatarUrl: "/images/service1.png", text: "这里只是一段测试的文字！这里只是一段测试的文字！这里只是一段测试的文字！这里只是一段测试的文字！", content: ["/images/content1.png", "/images/content1.png", "/images/content2.png", "/images/content3.png", "/images/content4.png",], address: "anhuitaihu", others: 'dianzan' }, { name: '徐若海', timeStamp: '3分钟前', avatarUrl: "/images/service1.png", text: "这里只是一段测试的文字！这里只是一段测试的文字！这里只是一段测试的文字！这里只是一段测试的文字！", content: ["/images/content1.png", "/images/content1.png", "/images/content2.png", "/images/content3.png", "/images/content4.png",], address: "anhuitaihu", others: 'dianzan' },],
  show:true,//是否有数据显示
  userData1:[],
  userData2:[],
  page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var t=this;
    console.log(app);
    console.log(options.serviceId);
    this.setData({
      height: app.height,
      trueheight:app.trueHeight,
      categoryId: options.serviceId
    });
    t.getMessage(t.data.page, t.data.swiperIndex + 1, t.data.swiperIndex + 1,t.data.categoryId);
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
  //切换最新最热
  change: function (e) {
    console.log(e);
    this.setData({
      swiperIndex: e.currentTarget.dataset.index
    });
  },
  ceshi: function (e) {
    console.log(e);
    if (e.detail.source == "touch") {
      this.setData({
        swiperIndex: e.detail.current
      });
    }

  },
  // 回退到首页
  back:function(){
    wx.navigateBack({
      delta:1
    })
  },
// 获取资讯列表
  getMessage: function (page, typekind, num,categoryId) {
    var t = this;
    console.log(typekind);
    console.log("获取资讯列表执行了" + wx.getStorageSync("id") + page);
    var categoryId = categoryId || "";
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
        type: typekind,
        pageNum: page,
        pageSize: 20
      },
      success: function (res) {
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

          //  if (content[i].length==0){
          //     len=false;
          //  }
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
              value: res.data.data.list[i].commentQuantity || 0
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
            // pos: t.data.userData.length + 1,
            isPraise: res.data.data.list[i].isPraise
          };
        };
        if (num == 1) {
          t.data.userData1 = t.data.userData1.concat(tempArr);
          console.log(t.data.userData1);
          t.setData({
            userData1: t.data.userData1
          });
        } else {
          t.data.userData2 = t.data.userData2.concat(tempArr);
          console.log(t.data.userData2);
          t.setData({
            userData2: t.data.userData2
          });
        }


      }
    })
  },
})