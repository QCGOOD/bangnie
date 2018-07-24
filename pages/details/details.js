// pages/details/details.js
var app = getApp().globalData;
var appJs = getApp();
var time = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    commentsData: [], //留言信息的存储
    show: false, //对底部进行隐藏
    isAuthorize: false,
    liuyan: false,
    lockRemark: false,
    imgHost: app.imgHost,
    adImg: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({title: '加载中…'})
    this.checkAuth();
    this.setData({
      sourceId: options.id,
    });
    this.getDetail(this.data.sourceId);
    this.getComments(this.data.sourceId);
    this.getImg();
  },
  onShareAppMessage() {
    return {
      title: '好帖子就是要分享的，戳我查看详情',
    }  
  },
  //检测用户的授权状态
  checkAuth() {
    wx.getSetting({
      success: res => {
        console.log("getSetting == ", res);
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: (res) => {
              // console.log('用户信息=======', res)
              if (res.errMsg == 'getUserInfo:ok') {
                // console.log(res.userInfo)
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
        } else {
          console.log('没有授权信息', this.data.isAuthorize)
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

   // 用户点击
   getUserInfo(e) {
    var t = this;
    console.log(e);
    t.closeAuthorize()
    if (e.detail.detail.errMsg == 'getUserInfo:ok') {
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
    data.wego168SessionKey =  wx.getStorageSync("key");
    var _this = this;
    wx.request({
      url: `${app.http}/app/member/save`,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: data,
      success: (res) => {
        console.log('保存用户信息', res)
        if (res.data.code == 40000) {
          appJs.apiLogin(() => {
            _this.saveUserInfo(data)
          })
        }
      }
    })
  },

  home() {
    wx.switchTab({
      url: '../main/main'
    })
  },

  //用户分享操作
  share: function() {
    this.setData({
      show: true
    })
  },
  // 进入canvas画图界面
  drawImage: function() {
    var t = this;
    wx.navigateTo({
      url: '/pages/canvas/canvas?sourceId=' + t.data.sourceId,
    })
  },
  //  获取详情的资讯
  getDetail: function(id) {
    var _this = this;
    wx.showLoading({title: '加载中……'})
    wx.request({
      url: `${app.http}/app/information/get`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        id: id
      },
      success: function(res) {
        wx.hideLoading()
        let getData = res.data.data;
        if (res.data.code == 40000) {
          appJs.apiLogin(() => {
            _this.getDetail(id)
          })
        } else if (res.data.code == 20000) {
          if (getData.imgUrl != '') {
            getData.imgUrl = getData.imgUrl.split(',');
            getData.imgUrl = getData.imgUrl.map(res => {
              return _this.data.imgHost + res
            })
          }
          _this.setData({
            detail: res.data.data
          })
        }else{
          appJs.toast(res.data.message)
        }
      }
    })
  },
  //获取留言列表
  getComments(id) {
    let _this = this;
    wx.request({
      url: `${app.http}/app/comment/page`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        sourceId: id,
        pageSize: 5,
        pageNum: 1
      },
      success(res) {
        console.log('留言列表===', res)
        if (res.data.code == 40000) {
          appJs.apiLogin(() => {
            _this.getComments(id)
          })
        } else if (res.data.code == 20000) {
          _this.setData({
            commentsData: res.data.data.list
          })
        } else {
          appJs.toast(res.data.message)
        }
      }
    })
  },
  // 获取广告图片
  getImg() {
    var _this = this;
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
        } else if (res.data.code == 20000){
          if (!res.data.data.length > 0) return;
          _this.setData({
            adImg: res.data.data[0]
          })
        }
      }
    });
  },
  //用户留言
  liuyan: function() {
    this.setData({
      liuyan: true
    })
  },
  //用户输入内容
  onNeirongChange: function(e) {
    this.setData({
      neirong: e.detail.value
    });
  },
  // 失去焦点获取用户留言输入
  onInputBlur: function(e) {
    if (this.data.neirong) {
      return;
    }
    this.setData({
      liuyan: false
    });
  },
  //发送留言
  sendLY: function() {
    var _this = this;
    if (!this.data.neirong) {
      wx.showToast({
        title: '请输入留言内容',
        icon: 'none'
      })
      return
    }
    this.setData({
      lockRemark: true
    })
    wx.showLoading({title: '发送中……'})
    wx.request({
      url: `${app.http}/app/comment/insert`,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        sourceId: this.data.sourceId,
        content: this.data.neirong
      },
      success: function(res) {
        wx.hideLoading()
        if (res.data.code == 40000) {
          appJs.apiLogin(() => {
            _this.getImg()
          })
        } else if (res.data.code == 20000){
          _this.setData({
            liuyan: false
          })
          appJs.toast('发布成功')
          _this.getComments(_this.data.sourceId)
        } else {
          appJs.toast(res.data.message)
        }
      },
      complete() {
        _this.setData({
          lockRemark: false
        })
      }
    })
  },
  //获取留言列表
  getLYList: function() {
    var t = this;
    wx.navigateTo({
      url: '/pages/allcomments/allcomment?sourceId=' + t.data.sourceId,
    })
  },
  //开始打电话
  call: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.detail.phone,
    })
  },
  //点赞开始
  onLike: function(e) {
    let url = `${app.http}/app/praise/insert`,
      type = e.currentTarget.dataset.type;
    if (!this.data[type].praiseQuantity) {
      this.data[type].praiseQuantity = 0;
    }
    if (this.data[type].isPraise) {
      // 取消点赞
      url = `${app.http}/app/praise/delete`
      this.data[type].isPraise = false
      this.data[type].praiseQuantity -= 1
    } else {
      // 点赞
      this.data[type].isPraise = true
      this.data[type].praiseQuantity += 1
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
        sourceId: this.data[type].id
      },
      success: function(res) {
        console.log('点赞功能 请求到数据了');
      }
    });
  },
  clickback: function() {
    this.setData({
      show: false
    });
  },
  onPreviewImage(e) {
    console.log(e.target.dataset.index)
    wx.previewImage({
      current: this.data.detail.imgUrl[e.target.dataset.index],
      urls: this.data.detail.imgUrl
    })
  },
  homePage() {
    wx.redirectTo({
      url: '/pages/welcome/welcome'
    });
  }
})