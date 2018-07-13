// pages/main/main.js
var app = getApp().globalData;
var page;
var rq = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: '', //下拉列表的数据
    index: 0, //选择的下拉列表下标
    imgUrls: [ //导航处轮播图
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    serviceData: [],

    flag: true,
    adData: [{
      text: "蔡当局蔡当局蔡当局蔡当局蔡当局蔡当局蔡当局蔡当局"
    }, {
      text: "四问汽车四问汽车四问汽车四问汽车四问汽车"
    }], //广告数据
    swiperData: [{
      index: 0,
      text: "最新发布"
    }, {
      index: 1,
      text: "最热资讯"
    }], //滑块数据
    swiperIndex: 0,
    currentData: [0, 1],
    userData1: [],
    userData2: [],
    page: 1,
    swiperHeight: 600
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // that.select('userData1');
    page = 1;
    // console.log(that.data.userData[2].text.length)
    // console.log(wx.getStorageSync("city"));
    // this.data.selectData[0] = wx.getStorageSync("city")
    // console.log(options);
    if (!wx.getStorageSync("city")) {
      console.log("请选择城市");
      that.choose();
    }
    that.setData({
      width: app.width,
      height: app.height,
      trueHeight: app.trueHeight,
      selectData: wx.getStorageSync("city"),
      userData1: [],
      userData2: []
    });

    that.getKind();
    that.getImg();
    that.getMessage(page, that.data.swiperIndex + 1, that.data.swiperIndex + 1);
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
    var t = this;
    console.log("你想下拉刷新吗？");
    t.onLoad();

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
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
 
  //跳转测试
  nav: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/move/move?serviceId=' + e.currentTarget.dataset.service_id,
    })
  },
  //切换最新最热
  change: function(e) {
    var t = this;
    console.log(e);
    this.setData({
      swiperIndex: e.currentTarget.dataset.index,
      page: 1
    });
    t.getMessage(t.data.page, t.data.swiperIndex + 1, t.data.swiperIndex + 1);
  },
  ceshi: function(e) {
    console.log(e);
    if (e.detail.source == "touch") {
      this.setData({
        swiperIndex: e.detail.current
      });
    }

  },
  //进入说说的详情页面
  intoDetails: function(e) {
    console.log("点击跳转：", e.currentTarget.dataset.id);
    console.log(e.currentTarget.dataset.ispraise);
    // var flag=e.currentTarget.dataset.flag;
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
    var t = this;
    if (this.data.inputValue) {

      console.log(this.data.inputValue);
      this.setData({
        flag: false,
        inputValue: ''
      });
      if (t.data.inputValue.indexOf(t.data.searchStr) != -1) {

      }
    } else {
      this.setData({
        flag: true
      })
    }

  },
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
  // 获取资讯列表
  getMessage: function(page, typekind, num) {
    var t = this;
    console.log(typekind);
    console.log("获取资讯列表执行了" + wx.getStorageSync("id") + page);
    var categoryId = wx.getStorageSync("categoryId") || "";
    // console.log(categoryId);
    console.log(categoryId);

    wx.request({
      url: 'http://192.168.1.18:8011/helpyou/api/v1/app/information/page',
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        areaId: wx.getStorageSync("id"),
        categoryId: categoryId,
        type: typekind,
        pageNum: page,
        pageSize: 20
      },
      success: function(res) {
        console.log(res);
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
        let tempArr = [];
        for (let i = 0; i < res.data.data.list.length; i++) {
          let content = [];
          let len;
          // console.log("当前userData位置:", t.data.userData.length + 1);
          // console.log(res.data.data.list[i].imgUrl.split(","));
          if (res.data.data.list[i].imgUrl != '') {
            content[i] = res.data.data.list[i].imgUrl.split(','); //记得修改
            for (let l = 0; l < content[i].length; l++) {
              content[i][l] = 'http://helpyou-1255600302.cosgz.myqcloud.com' + content[i][l]
            }
          } else {
            content[i] = [];
          }

          //  if (content[i].length==0){
          //     len=false;
          //  }
          tempArr[i] = {
            name: res.data.data.list[i].username,
            timeStamp: res.data.data.list[i].createTime,
            avatarUrl: res.data.data.list[i].headImage,
            text: res.data.data.list[i].content,
            content: content[i],
            address: res.data.data.list[i].address,
            category: res.data.data.list[i].category,
            others: [{
              key: "/images/liulan.png",
              value: res.data.data.list[i].visitQuantity

            }, {
              key: "/images/comments.png",
              value: res.data.data.list[i].commentQuantity || 0
            }, {
              key: "/images/succ.png",
              value: res.data.data.list[i].praiseQuantity,
              flag: res.data.data.list[i].isPraise

            }, {
              key: "/images/share.png",
              value: "111"
            }, ],
            message_id: res.data.data.list[i].id,
            len: content[i].length,
            error: false,
            // pos: t.data.userData.length + 1,
            isPraise: res.data.data.list[i].isPraise
          };
        };
        if (num == 1) {
          t.data.userData1 = t.data.userData1.concat(tempArr);
          console.log(t.data.userData1);
          t.setData({
            userData1: t.data.userData1
          });
          // t.select('userData1');
        } else {
          t.data.userData2 = t.data.userData2.concat(tempArr);
          console.log(t.data.userData2);
          t.setData({
            userData2: t.data.userData2
          });
          // t.select('userData2');
        }


      }
    })
  },
  //从后台获取栏目列表
  getKind: function() {
    var t = this;
    wx.request({
      url: 'http://192.168.1.18:8011/helpyou/api/v1/category/page',
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
        console.log(res);
        for (let i = 0; i < res.data.data.list.length; i++) {
          t.data.serviceData[i] = {
            url: 'http://helpyou-1255600302.cosgz.myqcloud.com' + res.data.data.list[i].iconUrl,
            text: res.data.data.list[i].name,
            service_id: res.data.data.list[i].id
          };
        }
        console.log(t.data.serviceData);
        t.setData({
          serviceData: t.data.serviceData
        });

      }
    })
  },
  //加载图片出错
  error: function(e) {
    var t = this;
    // console.log(e.currentTarget.dataset.totalIndex);
    // console.log(t.data.userData[e.currentTarget.dataset.totalIndex].err);
    // t.data.userData[e.currentTarget.dataset.totalIndex].err=true;
    // t.setData({
    //   userData:t.userData
    // });
  },

  // 点击选取城市
  click: function(e) {
    console.log(e.currentTarget.dataset);

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
    console.log(wx.getStorageSync("key"));
    wx.request({
      url: 'http://192.168.1.18:8011/helpyou/api/v1/app/choose',
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
    // this.getMessage(page);
  },
  //点赞开始
  dianzanT: function(e) {
    var t = this;
    console.log(e);
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
      url: 'http://192.168.1.18:8011/helpyou/api/v1/app/praise/insert',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),

        sourceId: e.currentTarget.dataset.sourceid
      },
      success: function(res) {
        console.log(res);
        if (res.data.code == 20000) {
          // let numFather = t.data.userData[e.currentTarget.dataset.index];
          // numFather.others[2] = {
          //   key: "/images/succ.png",
          //   value: numFather.others[2].value + 1,
          //   flag:true

          // }

        }
        // t.setData({
        //   userData:t.data.userData
        // })
      }
    });
  },
  //取消点赞
  dianzanF: function(e) {
    var t = this;
    console.log(e);
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
      url: 'http://192.168.1.18:8011/helpyou/api/v1/app/praise/delete',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),

        sourceId: e.currentTarget.dataset.sourceid
      },
      success: function(res) {
        console.log(res);
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
    console.log(e);
    console.log(e.detail.encryptedData, e.detail.iv);
    wx.request({
      url: 'http://192.168.1.18:8011/helpyou/api/v1/app/phone',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function(res) {
        console.log(res);
        // if (res.data.code == 20000) {
        //   let numFather = t.data.userData[e.currentTarget.dataset.index];
        //   numFather.others[2] = {
        //     key: "/images/dianzan.png",
        //     value: numFather.others[2].value - 1,
        //     flag: false
        //   }

        // }
        // t.setData({
        //   userData: t.data.userData
        // })
      }
    });
  },

  //朋友圈资讯滚动上啦加载；
  lower: function() {
    var t = this;
    console.log("你拉我伽马？");
    // wx.
    t.setData({
      page: t.data.page + 1
    });
    // console.log(t.data.page);
    t.getMessage(t.data.page, t.data.swiperIndex + 1, t.data.swiperIndex + 1);
  },
  //获取城市轮播图片
  getImg: function() {
    var t = this;
    wx.request({
      url: 'http://192.168.1.18:8011/helpyou/api/v1/attachment/list',
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        areaId: wx.getStorageSync("id")
      },
      success: function(res) {
        console.log(res);
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
    console.log(e)
    wx.navigateTo({
      url: '/pages/allcomments/allcomment?sourceId=' + e.currentTarget.dataset.sourceid,
    })
  },
  //选择器
  select: function(id) {
    var t = this;
    var query = wx.createSelectorQuery()
    var str = '#' + id;
    query.select(str).boundingClientRect()
    // query.selectViewport().scrollOffset()
    query.exec(function(res) {
      console.log(res);
      if(res[0].dataset.height==t.data.swiperHeight){
        console.log("ok");
      }else{
        t.data.swiperHeight=res[0].dataset.height;
        // t.setData({
        //   swiperHeight: t.data.swiperHeight
        // });
      }
      
    })
    // console.log(t.data.swiperHeight);
  }


})