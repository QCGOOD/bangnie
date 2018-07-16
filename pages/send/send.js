// pages/send/send.js
var app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    none:false,//不能再添加图片了
    linshi:[],
    nochange:true,//是否切换界面
    serviceData: [],
    temp:[],
  fixed:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t=this;
    t.setData({
      width: app.width,
      height: app.height,
      // trueheight:
      LCDetails:wx.getStorageSync("LCDetails")
    });
    t.getKind();
    
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
  //从后台获取栏目列表
  getKind: function () {
    var t = this;
    wx.request({
      url: app.http+'category/page',
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),

        pageNum: 1,
        pageSize: 10
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
        for (let i = 0; i < res.data.data.list.length; i++) {
          t.data.serviceData.push({
            url: 'http://helpyou-1255600302.cosgz.myqcloud.com' + res.data.data.list[i].iconUrl,
            text: res.data.data.list[i].name,
            service_id: res.data.data.list[i].id
          });
        }
        console.log(t.data.serviceData);
        t.setData({
          serviceData: t.data.serviceData
        });

      }
    })
  },
  //进入发布页
  nav:function(e){
    console.log(e.currentTarget.dataset.id);
    this.setData({
      nochange:false,
      categoryId: e.currentTarget.dataset.id,
      name:e.currentTarget.dataset.name
    });
  },
  //获取textarea
  blur:function(e){
    console.log("文字内容",e.detail.value);
    if (e.detail.value==""){
      this.setData({
        textValue: ''
      })
    }else{
      this.setData({
        textValue: "" + e.detail.value
      })
    }
    
  },
  // input:function(e){
  //     console.log("shuru的数据",e.detail.value);
  // },
  //获取表单数据值
  formSubmit:function(e){
    var t=this;
    console.log(e)
    console.log(this.data.categoryId);
    console.log("表单wozhixingle ");
    // wx.request({
    //       url: 'http://192.168.1.18:8011/helpyou/api/v1/attachments/images/tencent_cloud',
    //       method: "POST",
    //       header: {
    //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //       },
    //       data: {
    //         imageType: '/attachments/member',
    //         file:t.data.temp
    //       },
    //       success: function (res) {
    //         console.log(res);


    //       }
    //     })
    let validateCodeByMember;
    if(t.data.getCode_flag){
      validateCodeByMember = e.detail.value.code;
      }else{
      validateCodeByMember = '';
      }
    wx.request({
      url: app.http+'app/information/save',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        areaId: wx.getStorageSync("id"),
        categoryId: this.data.categoryId,
        address: wx.getStorageSync("LCDetails"),
        content:this.data.textValue,
        imgUrl: this.data.linshi,
        phone:e.detail.value.phone,
        appellation:e.detail.value.name,
        validateCodeByMember: validateCodeByMember
      },
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '发布成功',
          icon:'success',
          duration:1000
        })
t.setData({
  temp:[],
  value1: '',
  value2: '',
  value3:'',
});
      }
    })
  },
  //上传图片
  upImg:function(){
    var t=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // var linshi=[];
        console.log(tempFilePaths[0]);
        // wx.request({
        //   url: 'http://192.168.1.18:8011/helpyou/api/v1/attachments/images/tencent_cloud',
        //   method: "POST",
        //   header: {
        //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //   },
        //   data: {
        //     imageType: '/attachments/member',
        //     filepath:tempFilePaths[0]
        //   },
        //   success: function (res) {
        //     console.log(res);


        //   }
        // })
        wx.uploadFile({
          url: app.http+'attachments/images/tencent_cloud',
          filePath: tempFilePaths[0] ,
          name:'file',
          formData:{
            imageType:'member'
          },
          success:function(res){
            let imgJSon=JSON.parse(res.data).data.imageUrl;
            // console.log(res);
            console.log('http://helpyou-1255600302.cosgz.myqcloud.com'+imgJSon);
            t.data.linshi.push(imgJSon);
            t.setData({
              linshi:t.data.linshi
            })
          }
        })
        if(t.data.temp.length<9){
          let arr = t.data.temp.concat(tempFilePaths[0]);
          console.log(arr);
          t.setData({
            temp: arr
          })
          console.log(t.data.temp.length);
          if (t.data.temp.length==4){
            t.setData({
              fixed:false
            });
          }
          if (t.data.temp.length == 9){
            t.setData({
              none:true
            });
          }
        }
        
      }
    })
  },
  //取消发布，返回首页
  cancel:function(){
    wx.switchTab({
      url: '/pages/main/main',
    })
  },
  //手机相关的信息
  phone_blur:function(e){
    var t=this;
    console.log(e);
    wx.request({
      url: app.http+'app/information/validatePhone',
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        
        phone: e.detail.value,
        
      },
      success: function (res) {
        console.log(res);
        if(res.data.data){
          t.setData({
            getCode_flag: false,
            phone: e.detail.value
          });
        }else{
          t.setData({
            getCode_flag: false,//注释掉验证手机验证码，以后再开启
            phone: e.detail.value
          });
        }
        console.log(t.data.getCode_flag);
       

      }
    })
  },
  //获取验证码
  getCode:function(){
    var t=this;
    // console.log(typeof t.data.phone);
    // console.log(typeof ''+t.data.phone);
    wx.request({
      url: app.http+'app/validateCode',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        wego168SessionKey: wx.getStorageSync("key"),

        phone: ""+t.data.phone,

      },
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '验证码发送成功',
          icon:"success",
          duration:1000
        })
        


      }
    })
  },
  chehui:function(e){
    var t=this;
console.log(e.currentTarget.dataset.index);
console.log(t.data.temp);
    t.data.temp.splice(e.currentTarget.dataset.index,1);
    t.setData({
      temp:t.data.temp
    });

  },
})