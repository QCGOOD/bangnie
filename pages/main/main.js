import timeText from '../../utils/timeText.js';
var app = getApp().globalData;
var appJs = getApp();

Page({
  data: {
    selectData: '',
    index: 0,
    imgUrls: [],
    serviceData: [],
    isAuthorizePhone: false,
    isAuthorize: false,
    flag: true,
    adData: [
      { text: ""}, 
      { text: "" }
    ], //广告数据
    swiperIndex: 0,
    newData: [],
    hotData: [],
    imgHost: app.imgHost,
    newType: false,
    hotType: false,
    isDetail: false
  },
  onLoad: function(options) {
    console.log('我是主页');
    var that = this;
    
    // 请先选择城市
    if (!wx.getStorageSync("city")) {
      this.jumpChoosePage();
      return;
    }
    this.setData({
      trueHeight: app.trueHeight,
      selectData: wx.getStorageSync("city"),
      newSearch: {
        pageNum: 1,
        pageSize: 20,
        pageTotal: -1,
        type: 1,
        areaId: wx.getStorageSync("id"),
        categoryId: '',
        mytype: 'newData'
      },
      hotSearch: {
        pageNum: 1,
        pageSize: 20,
        pageTotal: -1,
        type: 2,
        areaId: wx.getStorageSync("id"),
        categoryId: '',
        mytype: 'hotData'
      },
    });
    
    this.setData({
      newData: [],
      hotData: [],
      newType: false,
      hotType: false,
      swiperIndex: 0
    })
    this.data.newSearch.pageNum = 1;

    // 轮播图
    this.getImg();

    // 由于登录是网络请求, 能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (!wx.getStorageSync('key')) {
      appJs.loginReadyCallback = res => {
        this.getKind();
        this.getMessage(this.data.newSearch);
      }
    } else {
      this.getKind();
      this.getMessage(this.data.newSearch);
    }
  },

  onShow() {
    this.setData({
      inputValue: ''
    })
  },

  onShareAppMessage() {
    return {
      title: '海外华人一站式服务平台',
    }  
  },

  onPageScroll() {
    wx.createSelectorQuery().select('#tabbar').boundingClientRect(res => {
      // console.log('滚动=====',  res)
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

  //检测用户的授权状态
  checkAuth() {
    let _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: (res) => {
              console.log('用户信息=======', res)
              if (res.userInfo) {
                // console.log(res.userInfo)
                let data = {
                  name: res.userInfo.nickName,
                  headImage: res.userInfo.avatarUrl,
                  sex: res.userInfo.gender
                };
                _this.saveUserInfo(data);
              }
            }
          })
          _this.setData({
            isAuthorize: false
          })
        } else {
          console.log('没有授权信息', this.data.isAuthorize)
          _this.setData({
            isAuthorize: true
          })
        }
      }
    });
  },

  // 关闭授权
  closeAuthorize() {
    this.setData({
      isAuthorize: false
    })
  },
  // 用户点击
  getUserInfo(e) {
    var t = this;
    t.closeAuthorize()
    if (e.detail.detail.userInfo) {
      let data = {
        name: e.detail.detail.userInfo.nickName,
        headImage: e.detail.detail.userInfo.avatarUrl,
        sex: e.detail.detail.userInfo.gender
      };
      t.saveUserInfo(data);
    }
  },

  // 保存用户信息到后台/
  saveUserInfo(data) {
    data.wego168SessionKey = wx.getStorageSync("key");
    var _this = this;
    wx.request({
      url: `${app.http}/app/member/save`,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: data,
      success: (res) => {
        console.log('提交的用户信息', data)
        console.log('保存返回的用户信息', res.data)
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            _this.saveUserInfo(data)
          })
        }
      }
    })
  },
  // 关闭手机授权
  closeAuthorizePhone() {
    this.setData({
      isAuthorizePhone: false
    })
  },
  // 判断是否需要获取手机号
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
        if (res.data.code == 50103) {
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
    if (this.data.inputValue && this.data.inputValue != '') {
      wx.navigateTo({
        url: '/pages/move/move?keyWord='+this.data.inputValue,
      })
    }
  },
  inputValue: function(e) {
    let value = e.detail.value;
    this.setData({
      inputValue: value.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
    });
  },
  // 获取资讯列表
  getMessage: function(data) {
    data.wego168SessionKey = wx.getStorageSync("key");
    var _this = this;
    if (this.isNext(data)) {
      wx.showLoading({title: '加载中…'})
      wx.request({
        url: `${app.http}/app/information/page`,
        method: "GET",
        data: data,
        success: function(res) {
          wx.hideLoading()
          if (res.data.code == 50103) {
            appJs.apiLogin(() => {
              _this.getMessage(data)
            })
          } else if (res.data.code == 20000){
            _this.checkAuth()
            res.data.data.list.map(res => {
              // res.timeText = timeText.getTimeText(res.createTime)
              // console.log(timeText.getTimeText(res.createTime), res.createTime)
              if (res.imgUrl != '') {
                return res.imgUrl = res.imgUrl.split(',')
              }
            })
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
        console.log('栏目==', res.data)
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            t.getKind()
          })
        } else if (res.data.code == 20000) {
          
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
        areaId: wx.getStorageSync("id"),
        type: 1 
      },
      success: function(res) {
        console.log('首页轮播图', res.data)
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            _this.getImg()
          })
        } else if (res.data.code == 20000) {
          _this.setData({
            imgUrls: res.data.data
          })
        }
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
  jumpComments: function(e) {
    wx.navigateTo({
      url: '/pages/allcomments/allcomment?sourceId=' + e.currentTarget.dataset.sourceid,
    })
  },
  //重新选择城市
  jumpChoosePage: function() {
    wx.navigateTo({
      url: '/pages/welcome/welcome?back=' + 1,
    })
  },
  //跳转测试
  jumpNav: function(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.service_id;
    wx.navigateTo({
      url: `/pages/move/move?serviceId=${id}&index=${index+1}`,
    })
  },
  //进入说说的详情页面
  jumpDetails: function(e) {
    wx.navigateTo({
      url: '/pages/details/details?id=' + e.currentTarget.dataset.id + "&isPraise=" + e.currentTarget.dataset.ispraise
    })
  },
})