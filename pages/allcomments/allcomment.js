var app = getApp().globalData;
var appJs = getApp();

Page({
  data: {
    comments: [],
    moreData: true,
    searchData: {}
  },
  onLoad: function(options) {
    this.setData({
      moreData: true,
      searchData: {
        sourceId: options.sourceId || '',
        pageSize: 50,
        pageNum: 1,
        pageTotal: -1
      }
    })
    this.getLeaveMsg(this.data.searchData)
  },

  getLeaveMsg(data) {
    var _this = this;
    data.wego168SessionKey = wx.getStorageSync("key");
    if (this.isNext(data)) {
      //获取留言列表
      wx.showLoading({title: '加载中…'})
      wx.request({
        url: `${app.http}/app/comment/page`,
        method: "GET",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: data,
        success: function(res) {
          console.log('留言列表', res.data);
          wx.hideLoading()
          if (res.data.code == 50103) {
            appJs.apiLogin(() => {
              _this.getLeaveMsg(data)
            })
          } else if (res.data.code == 20000) {
            if (res.data.data.total == 0) { 
              this.setData({
                moreData: false
              })
            }
            _this.data.searchData.pageNum++;
            _this.data.searchData.pageTotal = res.data.data.total
            wx.stopPullDownRefresh();
            _this.setData({
              comments: res.data.data.list,
              searchData: _this.data.searchData
            })
            if (!_this.isNext(data)) {
              _this.setData({
                moreData: false
              })
            }
          } else {
            appJs.toast('加载失败')
            _this.setData({
              moreData: false
            })
          }
        }
      })
    } else {
      _this.setData({
        moreData: false
      })
    }
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

  //回到详情页面
  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },
})