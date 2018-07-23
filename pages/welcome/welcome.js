var QQMapWX = require("../../libs/qqmap-wx-jssdk.min.js");
var qqMapWX;
var app = getApp().globalData;
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
    second: true,
    searchStr: {},
    net_flag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.login();
    t.checkAuth();
    t.qqMap();
  },

  // 登录--换取code
  login: function () {
    var t = this;
    //登录前监察网络状态
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (networkType == "2g" || networkType == "3g") {
          wx.showToast({
            title: '网络不好，请重试~',
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: `${app.http}/app/login`,
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: {
            code: "" + res.code
          },
          success: function (r) {
            console.log("执行用户登录login");
            console.log('换取sessionKey======', r);
            if(r.data.code == 20000) {
              t.setData({
                key: r.data.data.wego168SessionKey
              });
              wx.setStorageSync('key', r.data.data.wego168SessionKey);
              // t.checkAuth();
              // console.log('qqMsap开始2')
              // t.qqMap();
            }else{
              wx.showModal({
                title: '提示',
                showCancel: false,
                confirmText: '知道了',
                content: r.data.message,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          },
        })
      }
    })
  },

  //检测用户的授权状态
  checkAuth () {
    let t = this;
    wx.getSetting({
      success: res => {
        console.log("getSetting == ", res);
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: (res) => {
              console.log('用户信息=======',res)
              if(res.errMsg == 'getUserInfo:ok') {
                console.log(res.userInfo)
                let data = {
                  wego168SessionKey: this.data.key,
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
      success: function (res) {
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
  getCity: function (longitude, latitude) {
    var that = this;
    qqMapWX.reverseGeocoder({
      location: {
        latitude: '' + latitude,
        longitude: '' + longitude,
      }, //location的格式是传入一个字符对象
      success: function (res) {
        wx.setStorage({
          key: "LCDetails",
          data: res.result.address,
        })
        console.log('当前位置====', res);
        var len = res.result.address_component.city.length;
        that.setData({
          nation: res.result.address_component.nation,
          province: res.result.address_component.province,
          city: res.result.address_component.city,
        });
        console.log('当前城市====', res.result.address_component.city);
        // wx.showToast({
        //   title: '请稍候~',
        //   icon: 'loading'
        // })
      }
    });
  },
  //得到输入城市的值
  inputValue: function (e) {
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
  getCityList: function () {
    var t = this;
    // 正确代码
    // console.log(wx.getStorageSync("key"));
    // if (wx.getStorageSync("key")==undefined){
    //     t.login();
    // }
    console.log(app.http);
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
      success: function (res) {
        console.log(res);
        // console.log(res.data.data.list);
        // console.log(res.data.data.list[1].childList)
        try {
          var lis = res.data.data.list;
          for (let n = 0; n < lis.length; n++) {
            for (let c = 0; c < lis[n].childList.length; c++) {
              //     // console.log(res.data.data.list[n].childList[c].id);
              //     let name = res.data.data.list[n].childList[c].name;
              //     let id = res.data.data.list[n].childList[c].id;
              t.data.searchStr[res.data.data.list[n].childList[c].name] = res.data.data.list[n].childList[c].id;
            }
          }
          // console.log(t.data.searchStr);
          t.setData({
            searchStr: t.data.searchStr
          });
          try {
            t.data.cityData = res.data.data.list;
            t.setData({
              cityData: t.data.cityData,
            });
          } catch (err) {
            console.log("登录失效");
            t.setData({
              login: false
            });
            t.login();
            // t.getCityList();
          }
        } catch (e) {
          console.log("trycatch已经执行了");
          t.login();
          t.setData({
            net_flag: t.data.net_flag + 1
          });
        }
      },
      fail: function () {
        console.log("登录失效");
        t.setData({
          login: false
        });
      }
    })
  },
  //输入框的聚焦事件
  focus: function () {
    this.setData({
      flag: false
    })
  },
  //输入框失焦事件
  blur: function (e) {
    var t = this;
    if (this.data.inputValue) {
      this.setData({
        flag: false
      })
    }
    else {
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
  getUserInfo (e) {
    var t = this;
    console.log(e);
    t.closeAuthorize()
    if (e.detail.detail.errMsg == 'getUserInfo:ok') {
      let data = {
        wego168SessionKey: t.data.key,
        name: e.detail.detail.userInfo.nickName,
        headImage: e.detail.detail.userInfo.avatarUrl,
        sex: e.detail.detail.userInfo.gender
      };
      t.saveUserInfo(data);
    }

  },
  saveUserInfo(data) {
    wx.request({
      url: `${app.http}/app/member/save`,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: data,
      success: (res) => {
        console.log('保存用户信息====', res)
        this.nearCity()
      }
    })
  },
  // 最近城市
  nearCity(){
    let t = this;
    wx.request({
      url: `${app.http}/app/recentlyArea`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key")
      },
      success: function (res) {
        console.log('最近城市====', res);
        if (res.data.code == 20000) {
          wx.setStorageSync('city', res.data.data.name);
          wx.setStorageSync('id', res.data.data.id);
          // 有最近城市 直接去首页
          wx.switchTab({
            url: '/pages/main/main',
          })
        }else{
          
          t.getCityList();
        }
      }
    })
  },
  // 点击选取城市
  click: function (e, cityName, searchId) {
    // console.log(e.currentTarget.dataset);
    if (!e) {
      wx.setStorage({
        key: 'city',
        data: cityName,
      })
      wx.setStorage({
        key: 'id',
        data: searchId,
      })
    } else {
      wx.setStorage({
        key: 'city',
        data: e.currentTarget.dataset.value,
      })
      wx.setStorage({
        key: 'id',
        data: e.currentTarget.dataset.id,
      })
    }
    wx.switchTab({
      url: '/pages/main/main',
    })

    console.log(wx.getStorageSync("key"));
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
      success: function (res) {
        console.log(res);

      }
    })
    // this.getMessage(page);
  },
  //对定位城市的服务判断
  click2: function (e) {
    var t = this;
    // console.log(e);
    let flag = false;
    for (let i in t.data.searchStr) {
      console.log(i);
      if (e.currentTarget.dataset.value == i) {
        // t.click(null, i, t.data.searchStr[i]);
        flag = true;
        return;
      }
    }
    if (flag) {
      t.click(null, e.currentTarget.dataset.value, t.data.searchStr[e.currentTarget.dataset.value]);
    } else {
      wx.showToast({
        title: '当前城市未开放服务，敬请期待！',
        icon: "fail",
        duration: 1000
      })
    }
  },
})