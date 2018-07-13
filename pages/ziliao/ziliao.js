// pages/ziliao/ziliao.js
var app=getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData:[],//存储用户已经有的信息
    getCode: "false"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    t.setData({
      width: app.width,
      height: app.height,
      trueheight: app.trueHeight,
    });
    t.ziliao();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
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
    var t=this;
    wx.request({
      url: 'http://192.168.1.18:8011/helpyou/api/v1/app/memberAuthenticate/get',
      method:"GET",
      header:{
        "Content-Type":"application/x-www-form-urlencoded;charset=utf-8"
      },
      data:{
        wego168SessionKey:wx.getStorageSync("key")
      },
      success:function(res){
        console.log(res);
        let img = res.data.data.headImage || "/images/content1.png";
        let name = res.data.data.name || "未设置";
        let phone = res.data.data.phoneNumber || "";
        let gs = res.data.data.gs || "";
        let zw=res.data.data.zw||"";
        console.log(img,zw);
        t.data.userData={
          // name:
          img:img,
          name:name,
          phone:phone,
          gs:gs,
          zw:zw
        };
        t.setData({
          userData:t.data.userData
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
      url: 'http://192.168.1.18:8011/helpyou/api/v1/app/memberAuthenticate/isNeed',
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
          // wx.showToast({
          //   title: '请输入验证码',
          //   duration: 1000
          // });
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
    // let code;
    // if(t.data.getCode){code=e.detail.value.code}else{code=''}
    wx.request({
      url: 'http://192.168.1.18:8011/helpyou/api/v1/app/memberAuthenticate/update',
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
        // if(res.data.data){
        //   wx.showToast({
        //     title: '请输入验证码',
        //     duration:1000
        //   });
        // }
        
      }
    })
  },
  //获取验证码
  yanZM:function(){
    var t=this;
    wx.request({
      url: 'http://192.168.1.18:8011/helpyou/api/v1/app/validateCode',
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