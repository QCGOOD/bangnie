// pages/main/main.js
var app = getApp().globalData;
var appJs = getApp();
var page;
var rq = require("../../utils/util.js");
Page({
  data: {
    //下拉列表的数据
    selectData: '',
    //选择的下拉列表下标
    index: 0,
    kindActive: 0,
    //导航处轮播图
    imgUrls: [],
    serviceData: [],
    swiperIndex: 0,
    newData: [],
    hotData: [],
    kindId: '',
    name: '',
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
    // if (options.index) {
    //   this.setData({
    //     kindActive: options.index
    //   })
    // }
    that.setData({
      newData: [],
      kindActive: options.index || 0,
      selectData: wx.getStorageSync("city"),
      newSearch: {
        pageNum: 1,
        pageSize: 20,
        pageTotal: -1,
        type: 1,
        areaId: wx.getStorageSync("id"),
        categoryId: options.serviceId || '',
        keyWord: options.keyWord || '',
        mytype: 'newData',
      },
    })
    // that.setData({
    //   newData: [],
    //   hotData: [],
    //   newType: false,
    //   hotType: false,
    //   swiperIndex: 0,
    //   selectData: wx.getStorageSync("city"),
    //   newSearch: {
    //     pageNum: 1,
    //     pageSize: 20,
    //     pageTotal: -1,
    //     type: 1,
    //     areaId: wx.getStorageSync("id"),
    //     categoryId: options.serviceId,
    //     mytype: 'newData'
    //   },
    //   hotSearch: {
    //     pageNum: 1,
    //     pageSize: 20,
    //     pageTotal: -1,
    //     type: 2,
    //     areaId: wx.getStorageSync("id"),
    //     categoryId: options.serviceId,
    //     mytype: 'hotData'
    //   },
    // });
    that.getKind()
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
    // if (index == 0) {
    //   this.getMessage(this.data.newSearch);
    // } else {
    //   this.getMessage(this.data.hotSearch);
    // }
  },

  chooseKind(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    this.data.newSearch.categoryId = id;
    this.data.newSearch.pageNum = 1;
    this.data.newSearch.pageSize = 20;
    this.data.newSearch.pageTotal = -1;
    this.setData({
      kindActive: index,
      newData: [],
      newSearch: this.data.newSearch
    })
    this.getMessage(this.data.newSearch);
  },

  //从后台获取栏目列表
  getKind: function() {
    var t = this;
    wx.request({
      url: `${app.http}/category/page`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        pageNum: 1,
        pageSize: 50
      },
      success: function(res) {
        wx.stopPullDownRefresh();
        console.log('栏目==', res.data)
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            t.getKind()
          })
        } else if (res.data.code == 20000) {
          // t.getMessage(t.data.newSearch);
          // for (let i = 0; i < res.data.data.list.length; i++) {

          //   t.data.serviceData[i] = {
          //     url: 'http://helpyou-1255600302.cosgz.myqcloud.com' + res.data.data.list[i].iconUrl,
          //     text: res.data.data.list[i].name,
          //     service_id: res.data.data.list[i].id
          //   };
          // }
          
          t.setData({
            kindList: res.data.data.list
          });
        }
      }
    })
  },

  // 获取资讯列表
  getMessage: function (data) {
    data.wego168SessionKey = wx.getStorageSync("key");
    var _this = this;
    if (this.isNext(data)) {
      wx.showLoading({title: '加载中…'})
      wx.request({
        url: `${app.http}/app/information/page`,
        method: "GET",
        data: data,
        success: function (res) {
          wx.hideLoading()
          wx.stopPullDownRefresh();
          if (res.data.code == 50103) {
            appJs.apiLogin(() => {
              _this.getMessage(data)
            })
          }else if (res.data.code == 20000) {
            if (res.data.data.total == 0) {
              if (data.type == 1) {
                console.log('scsc')
                _this.setData({
                  newType: true
                })
              } else {
                _this.setData({
                  hotType: true
                })
              }
              return
            }
            res.data.data.list.map(res => {
              if (res.imgUrl != '') {
                return res.imgUrl = res.imgUrl.split(',')
              }
            })
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
          } else {
            appJs.toast(res.data.message)
          }
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
  // 预览
  onPreviewImage(e) {
    let key = e.currentTarget.dataset.key;
    let index = e.currentTarget.dataset.index;
    if (this.data.swiperIndex == 0) {
      let list = [];
      this.data.newData[key].imgUrl.map(item => {
        list.push(this.data.imgHost + item)
      })
      wx.previewImage({
        current: this.data.newData[key].imgUrl[index],
        urls: list
      })
    } else {
      let list2 = [];
      this.data.hotData[key].imgUrl.map(item => {
        list2.push(this.data.imgHost + item)
      })
      wx.previewImage({
        current: this.data.hotData[key].imgUrl[index],
        urls: list2
      })
    }
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