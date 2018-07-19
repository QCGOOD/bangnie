// pages/ziliao/ziliao.js
var app=getApp().globalData;
const appJs = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: {},//存储用户已经有的信息
    getCode: "false"
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
    t.ziliao();
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
    wx.showLoading()
    var t=this;
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
        if (res.data.message == "用户未登录或登录已失效") {
          appJs.toast('用户未登录或登录已失效')
          wx.navigateTo({
            url: '/pages/welcome/welcome',
          })
        }
        t.setData({
          userData: res.data.data
        });
      }
    })
  },
  //是否修改手机
  phone_blur:function(e){
    var t=this;
    console.log(e);
    t.setData({
      blur:true
    });
    wx.request({
      url: `${app.http}/app/memberAuthenticate/isNeed`,
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        phoneByMember: e.detail.value
      },
      success: function (res) {
        console.log(res);
        if (res.data.data) {

        }
        t.setData({
          getCode:"false",
          phone:e.detail.value
        });

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
})