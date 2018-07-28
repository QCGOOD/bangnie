var QQMapWX = require("../../libs/qqmap-wx-jssdk.min.js");
var qqMapWX;
var app = getApp().globalData;
var appJs = getApp();

Page({

  data: {
    cityData: [],
    flag: true,
    inputValue: '',
    login: false,
    isAuthorize: false,
    // key:''
    back: null,
    second: true,
    searchStr: {},
    searchCity: '',
    searchType: 1,
    city: '',
    net_flag: 0
  },

  onLoad: function (options) {
    var _this = this;
    if (options.back) {
      this.setData({
        back: options.back
      })
    }
    // 获取定位
    this.qqMap();

    // 由于登录是网络请求, 能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (!wx.getStorageSync('key')) {
      appJs.loginReadyCallback = res => {
        // 查看授权
        this.checkAuth();
        // this.getCityList();
        
      }
    } else {
      // 查看授权
      this.checkAuth();
      // this.getCityList();
    }
  },

  onShareAppMessage() {
    return {
      title: '海外华人一站式服务平台',
    }  
  },

  //检测用户的授权状态
  checkAuth() {
    let t = this;
    wx.getSetting({
      success: res => {
        console.log("getSetting == ", res);
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: (res) => {
              console.log('用户信息===', res)
              if (res.userInfo) {
                let data = {
                  name: res.userInfo.nickName,
                  headImage: res.userInfo.avatarUrl,
                  sex: res.userInfo.gender
                };
                this.saveUserInfo(data);
              }
            }
          })
          this.setData({
            isAuthorize: false
          })
          t.nearCity()
          t.getCityList();
        } else {
          this.setData({
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

  // 腾讯地图
  qqMap() {
    console.log('qqMsap开始')
    let that = this;
    //实例化腾讯地图德核心类
    qqMapWX = new QQMapWX({
      key: "BH5BZ-6NCWW-2HQR4-O7E7Y-Z6IZZ-OKBMQ"
    });
    //获取经纬度
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度,使用德时候注意查看官方文档注意兼容问题
      success: function(res) {
        console.log(res);
        that.getCity(res.longitude, res.latitude);
      },
    })
    that.setData({
      width: app.width,
      height: app.height
    });
  },

  //获取当前的城市
  getCity: function(longitude, latitude) {
    // 有缓存
    if (wx.getStorageSync('city')) {
      this.setData({
        city: wx.getStorageSync('city'),
      });
      return
    }
    // 没有缓存
    var that = this;
    qqMapWX.reverseGeocoder({
      location: {
        latitude: '' + latitude,
        longitude: '' + longitude,
      }, //location的格式是传入一个字符对象
      success: function(res) {
        wx.setStorage({
          key: "LCDetails",
          data: res.result.address,
        })
        var len = res.result.address_component.city.length;
        that.setData({
          nation: res.result.address_component.nation,
          province: res.result.address_component.province,
          city: res.result.address_component.city,
        });
      }
    });
  },

  //获取城市列表
  getCityList: function() {
    var t = this;
    wx.showLoading({title: '加载中…'})
    wx.request({
      url: `${app.http}/area/listWithChild`,
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
      },
      success: function(res) {
        console.log('城市列表===', res.data);
        wx.hideLoading()
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            t.getCityList()
          })
        } else if (res.data.code == 20000) {
          t.setData({
            cityData: res.data.data.list,
          });
          
          var lis = res.data.data.list;
          for (let n = 0; n < lis.length; n++) {
            for (let c = 0; c < lis[n].childList.length; c++) {
              if (lis[n].childList[c].name == t.data.city) {
                wx.setStorageSync('id', lis[n].childList[c].id)
              }
              t.data.searchStr[res.data.data.list[n].childList[c].name] = res.data.data.list[n].childList[c].id;
            }
          }
          t.setData({
            searchStr: t.data.searchStr
          });
        } else {
          t.toast(res.data.message)
        }
      }
    })
  },
    
  //得到输入城市的值
  inputValue: function(e) {
    // console.log("输入的是：", e.detail.value)
    this.setData({
      searchCity: e.detail.value
    });
  },

  //输入框失焦事件
  blur: function(e) {
    console.log('失去焦点')
    var t = this;
    if (this.data.searchCity && this.data.searchCity != '') {
      // this.setData({
      //   searchType: 3,
      // })
      this.getCityList();
    } else {
      this.setData({
        searchType: 1,
      })
    }
  },
  // 用户同意授权-----保存用户基本信息
  getUserInfo(e) {
    var t = this;
    console.log(e);
    t.closeAuthorize()
    if (e.detail.detail.userInfo) {
      let data = {
        name: e.detail.detail.userInfo.nickName,
        headImage: e.detail.detail.userInfo.avatarUrl,
        sex: e.detail.detail.userInfo.gender
      };
      t.nearCity();
      t.getCityList();
      t.saveUserInfo(data);
    }

  },
  saveUserInfo(data) {
    var _this = this;
    data.wego168SessionKey = wx.getStorageSync('key');
    wx.request({
      url: `${app.http}/app/member/save`,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: data,
      success: (res) => {
        console.log('保存用户信息====', res)
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            _this.saveUserInfo(data)
          })
        }
      }
    })
  },
  // 最近城市
  nearCity() {
    let t = this;
    // wx.showLoading({title: '加载中…'})
    wx.request({
      url: `${app.http}/app/recentlyArea`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key")
      },
      success: function(res) {
        // wx.hideLoading()
        console.log('最近城市===', res);
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            t.nearCity()
          })
        } else if (res.data.code == 20000) {
          wx.setStorageSync('city', res.data.data.name);
          wx.setStorageSync('id', res.data.data.id);
          if (t.data.back == 1) {
            return false;
          }
          // 有最近城市 直接去首页
          wx.switchTab({
            url: '/pages/main/main',
          })
        } else {
          // t.toast(res.data.message)
        }
      }
    })
  },
  // 点击选取城市
  click: function(e) {
    let _this = this;
    console.log(e.currentTarget.dataset.value)
    wx.setStorageSync('city', e.currentTarget.dataset.value)
    wx.setStorageSync('id', e.currentTarget.dataset.id)
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
        console.log(res);
      }
    })
    wx.switchTab({
      url: '/pages/main/main',
      success: function (e) { 
        if (_this.data.back == 1) {
          var page = getCurrentPages().pop(); 
          if (page == undefined || page == null) return; 
          page.onLoad(); 
        }
      } 
    })
  },
  // 对定位城市的服务判断
  click2(e) {
    let cityId = wx.getStorageSync('id');
    if (cityId) {
      wx.switchTab({
        url: '/pages/main/main',
      })
    } else {
      this.toast('当前城市未开放');
      // console.log(appJs)
    }
  },
  clear() {
    wx.removeStorageSync('id')
    wx.removeStorageSync('city')
    this.qqMap();
  },
  toast(text, icon) {
    wx.showToast({
      title: text,
      icon: icon || 'none',
      duration:1000
    });
  },
})