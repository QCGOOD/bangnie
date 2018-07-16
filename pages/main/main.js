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
    flag: true,
    adData: [{
      text: "蔡当局蔡当局蔡当局蔡当局蔡当局蔡当局蔡当局蔡当局"
    }, {
      text: "四问汽车四问汽车四问汽车四问汽车四问汽车"
    }], //广告数据
    swiperIndex: 0,
    newData: [],
    newSearch: {
      pageNum: 1,
      pageSize: 20,
      pageTotal: -1,
      type: 1,
      wego168SessionKey: wx.getStorageSync("key"),
      areaId: wx.getStorageSync("id"),
      categoryId: '',
    },
    hotData: [],
    hotSearch: {
      pageNum: 1,
      pageSize: 20,
      pageTotal: -1,
      type: 2,
      wego168SessionKey: wx.getStorageSync("key"),
      areaId: wx.getStorageSync("id"),
      categoryId: '',
    },
    imgHost: app.imgHost,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    page = 1;
    if (!wx.getStorageSync("city")) {
      that.choose();
    }
    that.setData({
      width: app.width,
      height: app.height,
      trueHeight: app.trueHeight,
      selectData: wx.getStorageSync("city"),
    });
    that.getImg();
    that.getKind();
    that.getMessage(this.data.newSearch);
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
    this.getMessage(this.data.newSearch)
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
  //跳转测试
  nav: function(e) {
    wx.navigateTo({
      url: '/pages/move/move?serviceId=' + e.currentTarget.dataset.service_id,
    })
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
  //进入说说的详情页面
  intoDetails: function(e) {
    wx.navigateTo({
      url: '/pages/details/details?id=' + e.currentTarget.dataset.id + "&isPraise=" + e.currentTarget.dataset.ispraise
    })
  },
  //重新选择城市
  choose: function() {
    wx.redirectTo({
      url: '/pages/welcome/welcome?back=' + 1,
    })
  },
  //输入框失焦事件
  blur: function() {
    if (this.data.inputValue) {
      this.setData({
        flag: false,
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
          res.data.data.list.map(res => {
            return res.imgUrl = res.imgUrl.split(',')
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
        }
      })
    } else {
      console.log('没有数据了')
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
  // 点击选取城市
  click: function(e) {
    wx.switchTab({
      url: '/pages/main/main',
    })
    wx.setStorage({
      key: 'city',
      data: e.currentTarget.dataset.value,
    })
    wx.setStorage({
      key: 'id',
      data: e.currentTarget.dataset.id,
    })
    wx.request({
      url: `${app.http}/app/choose`,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        id: e.currentTarget.dataset.id
      },
      success: function(res) {

      }
    })
    // this.getMessage(page);
  },
  //点赞开始
  dianzanT: function(e) {
    var t = this;
    let numFather = t.data.userData[e.currentTarget.dataset.index];
    numFather.others[2] = {
      key: "/images/succ.png",
      value: numFather.others[2].value + 1,
      flag: true

    }
    t.setData({
      userData: t.data.userData
    })
    wx.request({
      url: `${app.http}/app/praise/insert`,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),

        sourceId: e.currentTarget.dataset.sourceid
      },
      success: function(res) {
        if (res.data.code == 20000) {}
      }
    });
  },
  //取消点赞
  dianzanF: function(e) {
    var t = this;
    let numFather = t.data.userData[e.currentTarget.dataset.index];
    numFather.others[2] = {
      key: "/images/dianzan.png",
      value: numFather.others[2].value - 1,
      flag: false
    }
    t.setData({
      userData: t.data.userData
    })
    wx.request({
      url: `${app.http}/app/praise/delete`,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),

        sourceId: e.currentTarget.dataset.sourceid
      },
      success: function(res) {
        if (res.data.code == 20000) {
          // let numFather = t.data.userData[e.currentTarget.dataset.index];
          // numFather.others[2] = {
          //   key: "/images/dianzan.png",
          //   value: numFather.others[2].value - 1,
          //   flag:false
          // }

        }
        // t.setData({
        //   userData: t.data.userData
        // })
      }
    });
  },
  // 获取用户的绑定手机号
  getPhoneNumber: function(e) {
    wx.request({
      url: `${app.http}/app/phone`,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function(res) {}
    });
  },
  //获取城市轮播图片
  getImg: function() {
    var t = this;
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
        t.data.imgUrls = [];
        for (let i = 0; i < res.data.data.length; i++) {
          t.data.imgUrls.push({
            id: i,
            url: 'http://helpyou-1255600302.cosgz.myqcloud.com' + res.data.data[i].url
          });
        }
        t.setData({
          imgUrls: t.data.imgUrls
        });
      }
    });
  },
  //进入留言
  intoComments: function(e) {
    wx.navigateTo({
      url: '/pages/allcomments/allcomment?sourceId=' + e.currentTarget.dataset.sourceid,
    })
  }
})