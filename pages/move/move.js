// pages/main/main.js
var app = getApp().globalData;
var page;
var rq = require("../../utils/util.js");
Page({
  data: {
    //下拉列表的数据
    selectData: '',
    //选择的下拉列表下标
    index: 0,
    //导航处轮播图
    imgUrls: [],
    serviceData: [],
    swiperIndex: 0,
    newData: [],
    hotData: [],
    imgHost: app.imgHost,
    newType: false,
    hotType: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!wx.getStorageSync("city")) {
      that.jumpChoosePage();
    }
    that.setData({
      newData: [],
      hotData: [],
      newType: false,
      hotType: false,
      swiperIndex: 0,
      selectData: wx.getStorageSync("city"),
      newSearch: {
        pageNum: 1,
        pageSize: 20,
        pageTotal: -1,
        type: 1,
        wego168SessionKey: wx.getStorageSync("key"),
        areaId: wx.getStorageSync("id"),
        categoryId: options.serviceId,
        mytype: 'newData'
      },
      hotSearch: {
        pageNum: 1,
        pageSize: 20,
        pageTotal: -1,
        type: 2,
        wego168SessionKey: wx.getStorageSync("key"),
        areaId: wx.getStorageSync("id"),
        categoryId: options.serviceId,
        mytype: 'hotData'
      },
    });
    that.getMessage(this.data.newSearch);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.swiperIndex == 0) {
      this.getMessage(this.data.newSearch)
    } else {
      this.getMessage(this.data.hotSearch)
    }
  },
  /**
   * 是否存在下一页
   */
  isNext(data) {
    if (data.pageNum <= Math.ceil(data.pageTotal / data.pageSize) || data.pageTotal == -1) {
      return true
    }
    return false
  },

  //切换最新最热
  changeTabbar: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      swiperIndex: index,
    });
    if (index == 0) {
      this.getMessage(this.data.newSearch);
    } else {
      this.getMessage(this.data.hotSearch);
    }
  },
  // 获取资讯列表
  getMessage: function (data) {
    var _this = this;
    if (this.isNext(data)) {
      wx.request({
        url: `${app.http}/app/information/page`,
        method: "GET",
        data: data,
        success: function (res) {
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
          try {
            res.data.data.list.map(res => {
              if (res.imgUrl != '') {
                return res.imgUrl = res.imgUrl.split(',')
              }
            })
          } catch (e) {
            console.log(wx.getStorageSync("key"));
          }
          if (data.type == 1) {
            _this.setData({
              newData: [..._this.data.newData, ...res.data.data.list],
            })
            _this.data.newSearch.pageNum++;
            _this.data.newSearch.pageTotal = res.data.data.total
          } else {
            _this.setData({
              hotData: [..._this.data.hotData, ...res.data.data.list],
            })
            _this.data.hotSearch.pageNum++;
            _this.data.hotSearch.pageTotal = res.data.data.total
          }
          wx.stopPullDownRefresh();
        }
      })
    } else if (data.type == 1) {
      this.setData({
        newType: true
      })
    } else {
      this.setData({
        hotType: true
      })
    }
  },
  //点赞开始
  onLike: function (e) {
    console.log(e.currentTarget.dataset.type)
    let index = e.currentTarget.dataset.index,
      url = `${app.http}/app/praise/insert`,
      type = e.currentTarget.dataset.type;

    if (this.data[type][index].isPraise) {
      // 取消点赞
      url = `${app.http}/app/praise/delete`
      this.data[type][index].isPraise = false
      this.data[type][index].praiseQuantity -= 1
    } else {
      // 点赞
      this.data[type][index].isPraise = true
      this.data[type][index].praiseQuantity += 1
    }
    this.setData({
      [type]: this.data[type]
    })
    wx.request({
      url: url,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        sourceId: this.data[type][index].id
      },
      success: function (res) {
        console.log('点赞功能 请求到数据了');
      }
    });
  },
  //进入留言
  jumpComments: function (e) {
    wx.navigateTo({
      url: '/pages/allcomments/allcomment?sourceId=' + e.currentTarget.dataset.sourceid,
    })
  },
  //进入说说的详情页面
  jumpDetails: function (e) {
    wx.navigateTo({
      url: '/pages/details/details?id=' + e.currentTarget.dataset.id + "&isPraise=" + e.currentTarget.dataset.ispraise
    })
  },
})