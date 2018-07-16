// pages/details/details.js
var app = getApp().globalData;
var time=require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData:{},
    commentsData: [],//留言信息的存储
    show:false,//对底部进行隐藏
    toggle:false,//大图是否显示
    bigSrc:[],//存放大图信息
    touch:{
      distance: 0,
      scale: 1,
      baseWidth: 100,
      baseHeight: 100,
      scaleWidth: null,
      scaleHeight: null
    },//触摸的相关数据
    bigIndex:0,//大图默认显示第一张
    changeImg:{
      start:0,
      end:0
    },
    liuyan:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t=this;
    console.log("当前时间",time.formatTime(new Date()));
    console.log(options);
    let id=options.id;
    let flag=options.isPraise;
    // console.log(typeof flag);
    console.log(flag);
    this.setData({
      width: app.width,
      height: app.height,
      trueheight: app.trueHeight,
      "touch.baseWidth":app.width*0.9,
      "touch.baseHeight": app.width * 0.9,
      sourceId:id,
      flag:flag
    });
    this.size();
    this.getDetails(id);
    //获取留言列表
    wx.request({
      url: `${app.http}/app/comment/page`,


      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        sourceId: id,
        // content: this.data.neirong
        pageSize: 20,
        pageNum: 1
      },

      success: function (res) {
        console.log(res);
        for (let i = 0; i < res.data.data.list.length; i++) {
          if(i>=3){
            return;
          }else{
            t.data.commentsData.push({
              imgUrl: res.data.data.list[i].memberHeadImage,
              name: res.data.data.list[i].memberName,
              timeStamp: res.data.data.list[i].createTime,
              content: res.data.data.list[i].content
            });
          }
          console.log(t.data.commentsData);
          t.setData({
            commentsData: t.data.commentsData
          })
          }
          


      }

    })
    t.getImg();
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
      toggle:false
    });
    wx.navigateBack({
      delta: 1
    })
  },
  //判断留言字数大小，布局相应变化
  size:function(){

  },
  //用户分享操作
  share:function(){
    // console.log("zhixingle");
      this.setData({
        show:true
      })
  },
  //view点击查看大图
  view:function(e){
    console.log(e);
    
    this.data.bigSrc=e.currentTarget.dataset.src;
    this.setData({
      toggle: !this.data.toggle,
      bigSrc:this.data.bigSrc,
      bigIndex: e.currentTarget.dataset.index,
      "touch.baseWidth": app.width * 0.9,
      "touch.baseHeight": app.width * 0.9
    });
    console.log(this.data.bigSrc);
  },
  //触摸开始函数
  touchStart: function (e) { 
    // console.log("触摸开始：",e);
    // 单手指缩放开始，也不做任何处理 
    if (e.touches.length == 1) {
      console.log("单滑开始了：",e.touches[0].clientX)
      this.setData({
        "changeImg.start": e.touches[0].clientX
      })
      return
    }
    // console.log('双手指触发开始')
    // 注意touchstartCallback 真正代码的开始 
    // 一开始我并没有这个回调函数，会出现缩小的时候有瞬间被放大过程的bug 
    // 当两根手指放上去的时候，就将distance 初始化。 
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    this.setData({
      "touch.distance": distance,
    })
    console.log("距离显示：",this.data.touch.distance);
    
  },
  //触摸时移动函数
  touchMove:function(e){
    console.log("触摸移动：", e);
    let touch = this.data.touch
    // 单手指缩放我们不做任何操作 
    if (e.touches.length == 1) {
      console.log("单滑了");
      console.log("单滑结束了：", e.touches[0].clientX)
      this.setData({
        "changeImg.end": e.touches[0].clientX
      })
      return
    }
    console.log('双手指运动开始')
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    // 新的 ditance 
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    let distanceDiff = distance - touch.distance;
    let newScale = touch.scale + 0.005 * distanceDiff
    // 为了防止缩放得太大，所以scale需要限制，同理最小值也是 
    if (newScale >= 2) {
      newScale = 2
    }
    if (newScale <= 0.6) {
      newScale = 0.6
    }
    let scaleWidth = newScale * touch.baseWidth
    let scaleHeight = newScale * touch.baseHeight
    // 赋值 新的 => 旧的 
    this.setData({
      'touch.distance': distance,
      'touch.scale': newScale,
      'touch.scaleWidth': scaleWidth,
      'touch.scaleHeight': scaleHeight,//防止类似：'touch.baseHeight': scaleHeight,的死循环
      'touch.diff': distanceDiff
    })
  },
  //触摸结束函数
  touchEnd:function(e){
    console.log("我被触发了");
    
      
      this.setData({
        "changeImg.end": this.data.changeImg.end
      })
      // console.log("img：", this.data.changeImg.end);
      // let check = this.data.changeImg.end - this.data.changeImg.start;
      // if (check > 50 && this.data.bigIndex>0){
      //   this.setData({
      //     bigIndex: this.data.bigIndex - 1 //向左向右滑动触发图片切换
      //   })
      // } else if (check < -50 && this.data.bigIndex < this.data.bigSrc.length-1){
      //   this.setData({
      //     bigIndex: this.data.bigIndex + 1 //向左向右滑动触发图片切换
      //   })
      // }
      return
    
  },
  //fanhui
  fan:function(){
    this.setData({
      toggle:!this.data.toggle
    })
  },
  // 进入canvas画图界面
 drawImage:function(){
   var t=this;
    wx.navigateTo({
      url: '/pages/canvas/canvas?sourceId='+t.data.sourceId,
    })
 },
//  获取详情的资讯
getDetails:function(id){
  var t=this;
  console.log("id是："+id);
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
        let content=res.data.data.imgUrl.split(',');
        // console.log(content.length);
        if (res.data.data.imgUrl != '') {
          content = res.data.data.imgUrl.split(','); //记得修改
          for (let l = 0; l < content.length; l++) {
            content[l] = 'http://helpyou-1255600302.cosgz.myqcloud.com' + content[l]
          }
        } else {
          content = [];
        }
        t.data.userData = {
          name: res.data.data.username, timeStamp: res.data.data.createTime, avatarUrl: res.data.data.headImage, text: res.data.data.content, content: content, 
          // address: res.data.data.address, 
          address: res.data.data.address,
          praiseQuantity:res.data.data.praiseQuantity,
          others: [{
            key: "/images/liulan.png",
            value: res.data.data.visitQuantity

          }, {
            key: "/images/comments.png",
            value: "111"
          }, {
            key: "/images/dianzan.png",
            value: res.data.data.praiseQuantity

          }, {
            key: "/images/share.png",
            value: "111"
          },], 
          message_id: res.data.data.id,
          call:res.data.data.appellation,
          phone:res.data.data.phone,
          visitQuantity:res.data.data.visitQuantity
         }
         console.log(t.data.userData);
         t.setData({
           userData:t.data.userData
         });
      }
    
  })
},
//用户留言
liuyan:function(){
  this.setData({
    liuyan:true
  })
},
// 获取用户留言输入
value:function(e){
  console.log(e.detail.value);
  this.setData({
    neirong:e.detail.value,
    liuyan:false
  });
},
//发送留言
sendLY:function(){
  var t=this;
  console.log(wx.getStorageSync("key"), this.data.sourceId, this.data.neirong);
  wx.request({
    url: `${app.http}/app/comment/insert`,


    method: "POST",
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: {
      wego168SessionKey: wx.getStorageSync("key"),
      sourceId: this.data.sourceId,
      content:this.data.neirong
    },

    success: function (res) {
      console.log(res);
      t.setData({
        createTime: res.data.data.createTime,
        updateTime:res.data.data.updateTime,
        liuyan:false
      })
      wx.showToast({
        title: '留言发布成功~',
        icon:'success'
      })
    }

  })
},
//获取留言列表
getLYList:function(){
  var t=this;
  wx.navigateTo({
    url: '/pages/allcomments/allcomment?sourceId='+t.data.sourceId,
  })
  // wx.request({
  //   url: 'http://192.168.1.18:8011/helpyou/api/v1/app/comment/page',


  //   method: "GET",
  //   header: {
  //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  //   },
  //   data: {
  //     wego168SessionKey: wx.getStorageSync("key"),
  //     sourceId: this.data.sourceId,
  //     // content: this.data.neirong
  //     pageSize:20,
  //     pageNum:1
  //   },

  //   success: function (res) {
  //     console.log(res);
     

  //   }

  // })
},
//开始打电话
call:function(){
  wx.makePhoneCall({
    phoneNumber: '18814118034',
  })
},
// 获取点赞的信息
// dianzan:function(){
//   wx.request({
//     url: 'http://192.168.1.18:8011/helpyou/api/v1/app/praise/insert',


//     method: "POST",
//     header: {
//       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//     },
//     data: {
//       wego168SessionKey: wx.getStorageSync("key"),
//       sourceId: this.data.sourceId,
      
      
//     },

//     success: function (res) {
//       console.log(res);


//     }

//   })
// },
//点赞开始
dianzanT: function (e) {
  var t = this;
  console.log(e);
  wx.request({
    url: `${app.http}/app/praise/insert`,
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
      if (res.data.code == 20000) {
       

      }
      t.data.userData.praiseQuantity = t.data.userData.praiseQuantity + 1;
      t.setData({
        userData: t.data.userData,
        flag: "true"
      })
     
    }
  });
},
//取消点赞
dianzanF: function (e) {
  var t = this;
  console.log(e);
  wx.request({
    url: `${app.http}/app/praise/delete`,
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
      if (res.data.code == 20000) {
        
        
      }
      t.data.userData.praiseQuantity = t.data.userData.praiseQuantity-1;
      t.setData({

        flag: "false",
userData:t.data.userData
      })
    }
  });
},
toback:function(){
  this.setData({
    toggle:false
  });
},
clickback:function(){
  this.setData({
    show:false
  });
},
//获取城市轮播图片
getImg: function () {
  var t = this;
  wx.request({
    url: `${app.http}/attachment/list`,
    method: "GET",
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: {
      areaId: wx.getStorageSync("id")
    },
    success: function (res) {
      console.log(res);
      t.data.imgUrls = [];
      for (let i = 0; i < res.data.data.length; i++) {
        t.data.imgUrls.push({
          id: i,
          url: 'http://helpyou-1255600302.cosgz.myqcloud.com' + res.data.data[i].url
        });
      }
      // console.log(t.data.imgUrls[0]);
      t.setData({
        imgUrls: t.data.imgUrls
      });

    }
  });
},
})