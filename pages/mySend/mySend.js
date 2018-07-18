// pages/mySend/mySend.js
var app=getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  page:1,
  userData:[],
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    this.setData({
      width: app.width,
      height: app.height,
      trueheight: app.trueHeight,
    });
t.getMessage(t.data.page);
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
// console.log("第"+page+"页");
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
        pageSize: 3,
        listType:2
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
              value: res.data.data.list[i].commentQuantity
            }, {
              key: "/images/succ.png",
              value: res.data.data.list[i].praiseQuantity,
              flag: res.data.data.list[i].isPraise

            }, {
              key: "/images/share.png",
              value: res.data.data.list[i].visitQuantity
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
          userData: t.data.userData,
          page:t.data.page+1
        });
      }
    })
  },
  //进入留言
  jumpComments: function (e) {
    wx.navigateTo({
      url: '/pages/allcomments/allcomment?sourceId=' + e.currentTarget.dataset.sourceid,
    })
  },
  
  // 点赞开始
  dianzanT:function(e){
    var that=this;
    console.log(e);
    let url = `${app.http}/app/praise/insert`;
    wx.request({
      url: url,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        sourceId: e.currentTarget.dataset.sourceid
      },
      success: function (res) {
        console.log(res);
        console.log('点赞功能 请求到数据了');
        that.data.userData[e.currentTarget.dataset.type].others[2].value++;
        that.data.userData[e.currentTarget.dataset.type].others[2].flag=true;
        that.setData({
          userData:that.data.userData
        });
      }
    });
  },
  //取消点赞
  dianzanF: function (e) {
    var that = this;
    console.log(e);
    let url = `${app.http}/app/praise/delete`;
    wx.request({
      url: url,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        sourceId: e.currentTarget.dataset.sourceid
      },
      success: function (res) {
        console.log(res);
        // console.log('点赞功能 请求到数据了');
        that.data.userData[e.currentTarget.dataset.type].others[2].value--;
        that.data.userData[e.currentTarget.dataset.type].others[2].flag = false;
        that.setData({
          userData: that.data.userData
        });
      }
    });
  },
  lower:function(){
    console.log("我被处罚了");
    this.getMessage(this.data.page);
    },
    //进入详情页面
    intoDetails:function(e){
      console.log(e);
      wx.navigateTo({
        url: '/pages/details/details?id=' + e.currentTarget.dataset.id + "&isPraise=" + e.currentTarget.dataset.ispraise
      })
    },
    //点赞开始
    onLike: function (e) {
      console.log(e.currentTarget.dataset.type)
      let index = e.currentTarget.dataset.type, url = `${app.http}/app/praise/insert`, type ='userData';

      if (this.data[type][index].others[2].flag) {
        // 取消点赞
        url = `${app.http}/app/praise/delete`
        this.data[type][index].others[2].flag = false
        this.data[type][index].others[2].value -= 1
      } else {
        // 点赞
        this.data[type][index].others[2].flag = true
        this.data[type][index].others[2].value += 1
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
          sourceId: this.data[type][index].id
        },
        success: function (res) {
          console.log('点赞功能 请求到数据了');
        }
      });
    },
    //删除资讯
    delete:function(e){
      console.log(e.currentTarget.dataset.id);
      console.log("删除资讯");
      wx.request({
        url: `${app.http}/app/information/delete`,
        method: "POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: {
          wego168SessionKey: wx.getStorageSync("key"),
          id: e.currentTarget.dataset.id
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
          
        }
      })
    }
})