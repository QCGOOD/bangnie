// pages/mine/mine.js
var app = getApp().globalData;
var appJs = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: true,
    putfor: false,
    mes: false,
    ques: false,
    concact: false,
    show:false,
    page: 1,
    vip:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var t = this;
    this.setData({
      width: app.width,
      height: app.height,
      trueheight: app.trueHeight,
    });
    
    this.ziliao();
  },

  // 点击事件
  jumpPage: function(e) {
    let path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: path,
    })
  },
  //进入资料编辑页面、
  intoZiliao: function() {
    var that=this;
    wx.navigateTo({
      url: '/pages/ziliao/ziliao?vip='+that.data.vip,
    })
  },
  //编辑资料接口
  ziliao: function () {
    var t = this;
    wx.request({
      url: `${app.http}/app/memberAuthenticate/get`,
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key")
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 40000) {
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
  // 回退到首页
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 获取资讯列表
  getMessage: function (page) {
    var t = this;
    console.log("获取资讯列表执行了" + wx.getStorageSync("id") + page);
    var categoryId = wx.getStorageSync("categoryId") || "";
    // console.log(categoryId);
    console.log(categoryId);

    wx.request({
      url: `${app.http}/app/information/page`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        areaId: wx.getStorageSync("id"),
        categoryId: categoryId,
        pageNum: page,
        pageSize: 20,
        listType: 2
      },
      success: function (res) {
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
              value: "111"
            }, {
              key: "/images/succ.png",
              value: res.data.data.list[i].praiseQuantity,
              flag: res.data.data.list[i].isPraise

            }, {
              key: "/images/share.png",
              value: "111"
            },],
            message_id: res.data.data.list[i].id,
            len: content[i].length,
            error: false,

            isPraise: res.data.data.list[i].isPraise
          };
        };
        t.data.userData = t.data.userData.concat(tempArr);
        console.log(t.data.userData);
        t.setData({
          userData: t.data.userData
        });
      }
    })
  },
})