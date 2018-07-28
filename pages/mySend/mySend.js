// pages/mySend/mySend.js
var app = getApp().globalData;
var appJs = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHost: app.imgHost,
    height: app.height - 10,
    page:1,
    userData:[],
    searchData: {},
    moreData: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      trueheight: app.trueHeight,
    });
    this.setData({
      userData: [],
      moreData: true,
      searchData: {
        areaId: "",
        categoryId:  "",
        // wx.getStorageSync("id")
        // wx.getStorageSync("categoryId") ||
        pageNum: 1,
        pageSize: 20,
        pageTotal: -1,
        type: 1,
        listType:2
      }
    })
    this.getMessage(this.data.searchData);
  },

  // 回退到首页
  back () {
    wx.navigateBack({
      delta: 1
    })
  },

  // 显示选择框
  showSelect(e) {
    let index = e.currentTarget.dataset.index;
    let showSelect =`userData[${index}].showSelect`;
    this.setData({ [showSelect]: !this.data.userData[index].showSelect })
  },

  // 跳转
  jumpPage(e){
    console.log(e)
    let _id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../send/send?id='+_id,
    })
  },

    /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    console.log('下拉')
    this.onLoad();
  },
  /**
   * 上拉加载
   */
  onReachBottom() {
    console.log('上拉')
    this.getMessage(this.data.searchData)
  },
  /**
   * 是否存在下一页
   */
  isNext(data) {
    if (data.pageNum <= Math.ceil(data.pageTotal / data.pageSize) || data.pageTotal == -1) {
      return true
    }
    return false
  },

  // 获取资讯列表
  getMessage(data) {
    var _this = this;
    data.wego168SessionKey = wx.getStorageSync("key");
    if (this.isNext(data)) {
      wx.showLoading({title: '加载中…'})
      wx.request({
        url: `${app.http}/app/information/page`,
        method: "GET",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: data,
        success: function (res) {
          wx.hideLoading()
          if (res.data.code == 50103) {
            appJs.apiLogin(() => {
              _this.getMessage(data)
            })
          } else if (res.data.code == 20000) {
            if (res.data.data.total == 0) { 
              this.setData({
                moreData: false
              })
            }
            let tempArr = [];
            res.data.data.list.map((item, i) => {
              item.showSelect = false;
              if(item.imgUrl != "") {
                item.imgUrl = item.imgUrl.split(',')
              }else{
                item.imgUrl = []
              }
            })
          _this.data.searchData.pageNum++;
          _this.data.searchData.pageTotal = res.data.data.total
          wx.stopPullDownRefresh();
          _this.setData({
            userData: [..._this.data.userData, ...res.data.data.list],
            searchData: _this.data.searchData
          })
          if (!_this.isNext(data)) {
            _this.setData({
              moreData: false
            })
          }
          
          }
        }
      })
    } else {
      this.setData({
        moreData: false
      })
    }
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
    let isAudit = e.currentTarget.dataset.audit;
    if (!isAudit) {
      appJs.toast('审核未通过,不可查看')
      return;
    }
    wx.navigateTo({
      url: '/pages/details/details?id=' + e.currentTarget.dataset.id + "&isPraise=" + e.currentTarget.dataset.ispraise
    })
  },
  //点赞开始
  onLike: function (e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let url = `${app.http}/app/praise/insert`;
    let type =`userData[${index}]`;

    if (this.data.userData[index].isPraise) {
      // 取消点赞
      url = `${app.http}/app/praise/delete`
      this.data.userData[index].isPraise = false;
      this.data.userData[index].praiseQuantity -= 1;
    } else {
      // 点赞
      this.data.userData[index].isPraise = true;
      this.data.userData[index].praiseQuantity += 1;
    }
    this.setData({
      [type]: this.data.userData[index]
    })
    wx.request({
      url: url,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        sourceId: id
      },
      success: function (res) {
        console.log('点赞功能 请求到数据了');
      }
    });
  },

  //删除资讯
  delete:function(e){
    let t = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    this.apiDelete(id, index)
  },

  apiDelete(id, index) {
    let t = this;
    wx.request({
      url: `${app.http}/app/information/delete`,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        id: id
      },
      success: function (res) {
        console.log('删除资讯', res);
        if (res.data.code == 50103) {
          appJs.apiLogin(() => {
            t.apiDelete(id, index)
          })
        }else if(res.data.code == 20000) {
          appJs.toast('删除成功')
          t.data.userData.splice(index, 1)
          t.setData({
            userData: t.data.userData
          })
          // setTimeout(() => {
          //   t.getMessage(t.data.searchData);
          // }, 500);
        }else{
          appJs.toast('删除失败')
        }
      }
    })
  },

    // 预览
    onPreviewImage(e) {
      let key = e.currentTarget.dataset.key;
      let index = e.currentTarget.dataset.index;
      let list = [];
      this.data.userData[key].imgUrl.map(item => {
        list.push(this.data.imgHost + item)
      })
      wx.previewImage({
        current: this.data.userData[key].imgUrl[index],
        urls: list
      })
    },
  // onShareAppMessage() {
  //   return {
  //     title: '海外华人一站式服务平台',
  //   }  
  // },
})