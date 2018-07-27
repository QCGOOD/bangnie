// pages/ziliao/ziliao.js
var app=getApp().globalData;
const appJs = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: {},//存储用户已经有的信息
    getCode: "false",
    isGetPhone: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    console.log(options.vip);
    t.setData({
      width: app.width,
      height: app.height,
      trueheight: app.trueHeight,
      vip: !options.vipvip
    });
    this.ziliao();
    this.judgePhone();
  },

  // 回退到首页
  back: function () {
    this.setData({
      toggle: false
    });
    wx.navigateBack({
      delta: 1
    })
  },
  //编辑资料接口
  ziliao:function(){
    wx.showLoading({title: '加载中…'})
    var _this = this;
    wx.request({
      url: `${app.http}/app/memberAuthenticate/get`,
      method:"GET",
      header:{
        "Content-Type":"application/x-www-form-urlencoded;charset=utf-8"
      },
      data:{
        wego168SessionKey:wx.getStorageSync("key")
      },
      success:function(res){
        wx.hideLoading()
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            _this.ziliao()
          })
        } else if (res.data.code == 20000) {
          _this.setData({
            userData: res.data.data
          });
        } else {
          appJs.toast(res.data.message)
        }
      }
    })
  },
  // memberAuthenticate() {
  //   this.getData('/app/memberAuthenticate/get').then(res => {
  //     console.log(res.data)
  //     if (res.data.data && res.data.data.phoneNumber) {
  //       this.data.userData.phoneNumber = res.data.data.phoneNumber
  //       this.setData({
  //         userData: this.data.userData,
  //         isGetPhone: false
  //       })
  //     } else {
  //       this.setData({
  //         isGetPhone: true
  //       })
  //     }
  //   })
  // },
  // 判断是否需要获取手机号
  judgePhone() {
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
            isGetPhone: res.data.data
          });
        }
      }
    });
  },
  // 保存手机号
  getPhoneNumber(e) {
    console.log(e)
    if (e.detail.encryptedData) {
      let params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      };
      this.savePhoneNumber(params)
      
    }
  },
  savePhoneNumber(params) {
    let _this = this;
    params.wego168SessionKey = wx.getStorageSync("key");
    wx.request({
      url: `${app.http}/app/phone`,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: params,
      success: function (res) {
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            _this.ziliao(params)
          })
        } else if (res.data.code == 20000) {
          _this.data.userData.phoneNumber = res.data.message;
          _this.setData({
            userData: _this.data.userData,
            isGetPhone: false
          })
        }
        
      }
    })
  },

  //提交表单数据
  formsubmit:function(e){
    var t=this;
    console.log(e);
    wx.request({
      url: `${app.http}/app/memberAuthenticate/update`,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        // validateCodeByMember:code,
        appellation:e.detail.value.name,
        phoneNumber:e.detail.value.phone,
        company:e.detail.value.gs,
        position:e.detail.value.zw
      },
      success: function (res) {
        console.log(res);
        if(res.data.code == 20000) {
          appJs.toast(res.data.message)
          setTimeout(() => {
            wx.navigateBack({
              delta: 1, 
            })
          }, 500)
        }else{
          appJs.toast(res.data.message)
        }
      }
    })
  },
  //获取验证码
  yanZM:function(){
    var t=this;
    wx.request({
      url: `${app.http}/app/validateCode`,
      method: "POST",
      header: {
        "Content-Type": "x-www-form-urlcoded;charset=utf-8"
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        phone:t.data.phone
      },
      success: function (res) {
        console.log(res);
        

      }
    })
  },
  getData (url, params = {}) {
    params.wego168SessionKey = wx.getStorageSync("key")
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.http + url,
        data: params,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: res => {
          if (res.data.code === 20000) {
            resolve(res)
          } else {
            wx.showToast({
              title: res.data.message || '系统出错',
              icon: 'none',
              duration: 2000
            })
            reject(res)
          }
        },
        fail: err => {
          wx.showToast({
            title: res.data.message || '系统出错',
            icon: 'none',
            duration: 2000
          })
          reject(err)
        }
      })
    })
  },
  postData (url, params = {}) {
    params.wego168SessionKey = wx.getStorageSync("key")
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.http + url,
        data: params,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if (res.data.code === 20000) {
            resolve(res)
          } else {
            wx.showToast({
              title: res.data.message || '系统出错',
              icon: 'none',
              duration: 2000
            })
            reject(err)
          }
        },
        fail: err => {
          wx.showToast({
            title: res.data.message || '系统出错',
            icon: 'none',
            duration: 2000
          })
          reject(err)
        },
      })
    })
  },
})