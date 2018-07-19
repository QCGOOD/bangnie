// pages/welcome/welcome.js
//导入腾讯地图的sdk,注意对引用文件合法域名的检测
var QQMapWX = require("../../libs/qqmap-wx-jssdk.min.js");
var qqMapWX;
var app = getApp().globalData;
// var rq = require("../../utils/util.js");
// var page;
// let key="";
// console.log(app.key);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityData: [],
    flag: true,
    inputValue: '',
    login: false,
    // key:''
    second: true,
    searchStr: {},
    net_flag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // console.log(options.back)
    //  page = 1;
    this.checkLogin();
    try {
      if (!options.back) {
        
        this.login();
        
        this.getCityList();
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
            console.log(res);
            try {
              let id = "undefined" || res.data.data.id;
              // console.log(res);
              if (res.data.data.id != "undefined") {
                that.setData({
                  second: false
                });
                console.log("zhixingle");

                wx.switchTab({
                  url: '/pages/main/main',
                })
              } else {
                that.setData({
                  login: true
                });

              }
            } catch (er) {
              console.log("未知错误！");
              // that.setData({
              //   login: true
              // });
              // that.getCityList();
            }

            

          }
        })
      } else {
        that.setData({
          login: true
        });
        that.getCityList();
      }
    } catch (err) {
      that.setData({
        login: true
      });
      that.getCityList();
      // that.getMessage(page);
    }

    // console.log(rq);

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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log(this.data.key);

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
    this.onLoad();
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

  //获取当前的城市
  getCity: function(longitude, latitude) {
    var that = this;
    qqMapWX.reverseGeocoder({
      location: {
        latitude: '' + latitude,
        longitude: '' + longitude,
      }, //location的格式是传入一个字符对象
      success: function(res) {
        console.log(res.result.address);
        wx.setStorage({
          key: "LCDetails",
          data: res.result.address,
        })
        var len = res.result.address_component.city.length;
        that.setData({
          nation: res.result.address_component.nation,
          province: res.result.address_component.province,
          city: res.result.address_component.city.substring(0, len - 1),
        });
        wx.showToast({
          title: '请稍候~',
          icon: 'loading'
        })
      },
      fail: function(info) {}
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
      success: function(res) {
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
          // wx.showToast({
          //   title: '请稍候~',
          // })
          t.login();
          // t.login(); t.getCityList();
          // if(t.data.net_flag<=4){
          //   t.login();t.getCityList();
          t.setData({
            net_flag: t.data.net_flag + 1
          });

          // }else{
          // let l=setTimeout(function(){
          //   // wx.showToast({
          //   //   title: '请稍候再试~',
          //   // })
          //   t.onUnload();
          // },10000);

        }

      },








      fail: function() {
        console.log("登录失效");
        t.setData({
          login: false
        });
      }
    })
  },
  //输入框的聚焦事件
  focus: function() {
    // str=
    // t.data.li[str] = value;
    var t = this;
    t.setData({
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
    console.log("blur:", e.detail.value);
    for (let i in t.data.searchStr) {
      // console.log(i);
      if (e.detail.value == i) {
        t.click(null, i, t.data.searchStr[i]);
        return;
      }
    }
    
  },
  //检测用户的授权状态
  checkLogin: function() {
    var t = this;
    wx.getSetting({
      success: function(res) {
        console.log(res);
        if (!res.authSetting["scope.userInfo"]) {
          console.log("没有授权");
          t.setData({
            login: false
          });
        } else {
          t.setData({
            login: true
          });
          wx.showToast({
            title: '自动登录中...',
            icon: "loading",
            duration: 500
          })
          // console.log(t.data.key);
          // t.getCityList();
          // wx.switchTab({
          //   url: '/pages/main/main',
          // })
        }
      },
      fail:function(){
        t.setData({
          login: false
        });
      },
    })
  },
  //用户授权登录事件，向后台传数据
  getUserInfo: function(e) {
    var t = this;

    console.log(e);
    if (e.detail.userInfo){
      this.setData({
        login: true
      });
      console.log("key值：", t.data.key);
      wx.showToast({
        title: '登录中...',
        icon: "loading",
        duration: 500
      })
      let data = {
        wego168SessionKey: t.data.key,
        name: e.detail.userInfo.nickName,
        headImage: e.detail.userInfo.avatarUrl,
        sex: e.detail.userInfo.gender
      };

      wx.request({
        url: `${app.http}/app/member/save`,
        method: "POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          // 'Content-type': 'application/X-WWW-FORM-URLENCODED; charset=UTF-8'
        },
        data: data,
        success: function (res) {
          console.log(res);
          t.getCityList();
          t.judgePhone();
        }

      })
    }else{
      wx.showModal({
        title: '注意',
        showCancel: false,
        confirmText: '好去授权',
        content: '为了您更好的体验,请先同意授权',
        success: function (res) {
          
        }
      })
    }
    
  },
  login: function() {
    var t = this;
    //登录前监察网络状态
    wx.getNetworkType({
      success: function(res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        // console.log(res);
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
    console.log("执行用户登录login");
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        wx.request({
          url: `${app.http}/app/login`,
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: {
            code: "" + res.code
          },
          success: function(r) {
            console.log(r);
            console.log("成功登录");
            // console.log(r.data.data.wego168SessionKey);
            if (r.data.data.wego168SessionKey == undefined) {
              console.log("网络不好");
            }
            t.setData({
              key: r.data.data.wego168SessionKey
            });
            wx.setStorage({
              key: 'key',
              data: r.data.data.wego168SessionKey,
              success: function(res) {
t.setData({
  login_flag:true
});
              }
            })
            t.getCityList();


          },
          fail: function(err) {
            console.log("失败了", err);
          }

        })
      }
    })
  },
  // 点击选取城市
  click: function(e, cityName, searchId) {
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
    // console.log(city);
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
      success: function(res) {
        console.log(res);

      }
    })
    // this.getMessage(page);
  },
  //对定位城市的服务判断
  click2: function(e) {
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
        console.log(res);
        t.setData({
          phone_flag: res.data.data
        });
      }
    });
  },
  // 获取用户的绑定手机号
  getPhoneNumber: function(e) {
    var t = this;
    console.log(e);
    t.setData({
      phone_flag: false
    });
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
          console.log(res);
          t.setData({
            phone_flag: false
          });
          if (res.data.errMsg == "request:ok") {
            t.setData({
              phone_flag: false
            });
          }

        }
      });
    } else {
      t.setData({
        phone_flag: false
      });
    }

  },


})