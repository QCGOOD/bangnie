var QQMapWX = require("../../libs/qqmap-wx-jssdk.min.js");
var qqMapWX;
var app = getApp().globalData;
var appJs = getApp();
Page({
  /**
   * 页面的初始数据
   */
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
    net_flag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (options.back) {
      this.setData({
        back: options.back
      })
    }
    this.getCityList();
    this.qqMap();
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
              console.log('用户信息=======', res)
              if (res.errMsg == 'getUserInfo:ok') {
                console.log(res.userInfo)
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
    if (wx.getStorageSync('city')) {
      this.setData({
        city: wx.getStorageSync('city'),
      });
      return
    }
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
  //得到输入城市的值
  inputValue: function(e) {
    console.log("输入的是：", e.detail.value)
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
  //获取城市列表
  getCityList: function() {
    var t = this;
    wx.showLoading({title: '加载中…'})
    wx.request({
      url: `${app.http}/area/listWithChild`,
      // url: 'http://192.168.1.18:8011/helpyou/api/v1/area/listWithChild',
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key")
      },
      success: function(res) {
        console.log('城市列表===', res);
        wx.hideLoading()
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            t.getCityList()
          })
        } else if (res.data.code == 20000) {
          t.checkAuth();
          var lis = res.data.data.list;
          for (let n = 0; n < lis.length; n++) {
            for (let c = 0; c < lis[n].childList.length; c++) {
              t.data.searchStr[res.data.data.list[n].childList[c].name] = res.data.data.list[n].childList[c].id;
            }
          }
          t.setData({
            searchStr: t.data.searchStr
          });
          t.data.cityData = res.data.data.list;
          t.setData({
            cityData: t.data.cityData,
          });
        } else {
          appJs.toast(res.data.message)
        }
      }
    })
  },
  //输入框的聚焦事件
  focus: function() {
    this.setData({
      flag: false
    })
  },
  //输入框失焦事件
  blur: function(e) {
    var t = this;
    if (this.data.inputValue) {
      this.setData({
        flag: false
      })
    } else {
      // this.setData({
      //   flag: true
      // })
      wx.showToast({
        title: '不能输入为空哦~',
        icon: "fail",
        duration: 1000
      })
    }
    for (let i in t.data.searchStr) {
      // console.log(i);
      if (e.detail.value == i) {
        t.click(null, i, t.data.searchStr[i]);
        return;
      }
    }
    wx.showToast({
      title: '当前城市未开放',
      icon: "none",
      duration: 1000
    });
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
          // appJs.toast(res.data.message)
        }
      }
    })
  },
  // 点击选取城市
  click: function(e) {
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
        id: wx.getStorageSync("id")
      },
      success: function(res) {
        console.log(res);
      }
    })
    wx.switchTab({
      url: '/pages/main/main',
      success: function (e) { 
        let page = getCurrentPages().pop(); 
        if (page == undefined || page == null) return; 
          page.onLoad(); 
      } 
    })
  },
  // 对定位城市的服务判断
  click2: function(e) {
    wx.showToast({
      title: '请选择下列的城市！',
      icon: "fail",
      duration: 1000
    })
  },
  clear() {
    wx.removeStorage({
      key: 'city',
      success: (res) => {
        this.qqMap();
      },
    })
  }
})