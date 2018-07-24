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
    //导航处轮播图
    imgUrls: [],
    serviceData: [],
    isAuthorizePhone: false,
    flag: true,
    adData: [{
      text: ""
    }, {
      text: ""
    }], //广告数据
    swiperIndex: 0,
    newData: [],
    hotData: [],
    imgHost: app.imgHost,
    newType: false,
    hotType: false,
    isDetail: false
  },
  onLoad: function(options) {
    var that = this;
    page = 1;
    that.judgePhone()
    if (!wx.getStorageSync("city")) {
      that.jumpChoosePage();
    }
    that.setData({
      trueHeight: app.trueHeight,
      selectData: wx.getStorageSync("city"),
      newSearch: {
        pageNum: 1,
        pageSize: 20,
        pageTotal: -1,
        type: 1,
        wego168SessionKey: wx.getStorageSync("key"),
        areaId: wx.getStorageSync("id"),
        categoryId: '',
        mytype: 'newData'
      },
      hotSearch: {
        pageNum: 1,
        pageSize: 20,
        pageTotal: -1,
        type: 2,
        wego168SessionKey: wx.getStorageSync("key"),
        areaId: wx.getStorageSync("id"),
        categoryId: '',
        mytype: 'hotData'
      },
    });
    that.getImg();
    that.getKind();
    that.setData({
      newData: [],
      hotData: [],
      newType: false,
      hotType: false,
      swiperIndex: 0
    })
    that.data.newSearch.pageNum = 1
    that.getMessage(that.data.newSearch);
  },
  onPageScroll() {
    wx.createSelectorQuery().select('#tabbar').boundingClientRect(res => {
      if (res.top < 0) {
        this.setData({
          flexd: true
        })
      } else {
        this.setData({
          flexd: false
        })
      }
    }).exec()
  },
  // 关闭手机授权
  closeAuthorizePhone() {
    this.setData({
      isAuthorizePhone: false
    })
  },
  //判断是否需要获取手机号
  judgePhone: function() {
    var t = this;
    wx.request({
      url: `${app.http}/app/isNeed`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key")
      },
      success: function(res) {
        if (res.data.code == 40000) {
          appJs.apiLogin(() => {
            t.judgePhone()
          })
        } else if (res.data.code == 20000) {
          t.setData({
            isAuthorizePhone: res.data.data
          });
        }
      }
    });
  },
  // 获取用户的绑定手机号
  getPhoneNumber: function(e) {
    var t = this;
    console.log(e);
    t.closeAuthorizePhone();
    console.log(e.detail.encryptedData, e.detail.iv);
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: `${app.http}/app/phone`,
        method: "POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: {
          wego168SessionKey: wx.getStorageSync("key"),
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        success: function(res) {
          // if (res.data.code == 40000) {
          //   appJs.apiLogin(() => {
          //     t.getPhoneNumber()
          //   })
          // }
        }
      });
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onLoad();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
  changeTabbar: function(e) {
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
  //输入框失焦事件
  blur: function() {
    if (this.data.inputValue) {
      this.setData({
        flag: true,
        inputValue: ''
      });
      if (this.data.inputValue.indexOf(this.data.searchStr) != -1) {

      }
    } else {
      this.setData({
        flag: true
      })
    }
  },
  inputValue: function(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        flag: false,
        inputValue: e.detail.value
      });
    } else {
      this.setData({
        flag: true
      });
    }
  },
  // 获取资讯列表
  getMessage: function(data) {
    var _this = this;
    if (this.isNext(data)) {
      wx.request({
        url: `${app.http}/app/information/page`,
        method: "GET",
        data: data,
        success: function(res) {
          if (res.data.code == 40000) {
            appJs.apiLogin(() => {
              _this.getMessage(data)
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
        pageSize: 10
      },
      success: function(res) {
        if (res.data.code == 40000) {
          appJs.apiLogin(() => {
            t.getKind()
          })
        }
        for (let i = 0; i < res.data.data.list.length; i++) {
          t.data.serviceData[i] = {
            url: 'http://helpyou-1255600302.cosgz.myqcloud.com' + res.data.data.list[i].iconUrl,
            text: res.data.data.list[i].name,
            service_id: res.data.data.list[i].id
          };
        }
        t.setData({
          serviceData: t.data.serviceData
        });
      }
    })
  },
  //点赞开始
  onLike: function(e) {
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
      success: function(res) {
        console.log('点赞功能 请求到数据了');
      }
    });
  },
  //获取城市轮播图片
  getImg: function() {
    let _this = this;
    wx.request({
      url: `${app.http}/attachment/list`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        areaId: wx.getStorageSync("id")
      },
      success: function(res) {
        if (res.data.code == 40000) {
          appJs.apiLogin(() => {
            _this.getImg()
          })
        }
        _this.setData({
          imgUrls: res.data.data
        });
      }
    });
  },
  //进入留言
  jumpComments: function(e) {
    wx.navigateTo({
      url: '/pages/allcomments/allcomment?sourceId=' + e.currentTarget.dataset.sourceid,
    })
  },
  //重新选择城市
  jumpChoosePage: function() {
    wx.redirectTo({
      url: '/pages/welcome/welcome?back=' + 1,
    })
  },
  //跳转测试
  jumpNav: function(e) {
    wx.navigateTo({
      url: '/pages/move/move?serviceId=' + e.currentTarget.dataset.service_id,
    })
  },
  //进入说说的详情页面
  jumpDetails: function(e) {
    wx.navigateTo({
      url: '/pages/details/details?id=' + e.currentTarget.dataset.id + "&isPraise=" + e.currentTarget.dataset.ispraise
    })
  },
})