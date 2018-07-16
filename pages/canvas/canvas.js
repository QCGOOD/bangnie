// pages/canvas/canvas.js
var app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canShow: false,
    imgBox: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options.sourceId);
    this.setData({
      width: app.width,
      height: app.height,
      trueheight: app.trueHeight,
    });
    that.getDetails(options.sourceId);
// that.erweima(options.sourceId);


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // console.log(this.data.imagePath);
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
  //生成背景图
  // makeBg:function(){

  // },

  // canvas自动换行
  /*
str:要绘制的字符串
canvas:canvas对象
initX:绘制字符串起始x坐标
initY:绘制字符串起始y坐标
lineHeight:字行高，自己定义个值即可
*/
  canvasTextAutoLine: function(str, canvas, initX, initY, lineHeight, w) {

    var lineWidth = 0;
    var canvasWidth = 285 * w;
    var lastSubStrIndex = 0;
    canvas.setFontSize(16 * w);
    console.log(str.length);
    if (str.length >= 35) {

      str = str.substring(0, 35);
      str += "...";
      console.log(str);
    }else{
      str=str;
    }

    for (let i = 0; i < 37; i++) {
      lineWidth += canvas.measureText(str[i]).width;
      // console.log("第" + i + "个字符:" + canvas.measureText(str[i]).width)
      if (lineWidth > canvasWidth - initX) { //减去initX,防止边界出现的问题
        canvas.fillText(str.substring(lastSubStrIndex, i), initX, initY);
        initY += lineHeight;
        lineWidth = 0;
        lastSubStrIndex = i;
      }
      if (i == 37) {
        canvas.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
      }
    }
  },

  //保存canvas图片到本机相册
  //绘制图片
  save: function() {
    var that = this;
    wx.showToast({
      title: '分享图片生成中...',
      icon: 'loading',
      duration: 1000
    });
    let s = setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'sharehidden',
        success: function(res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          that.setData({
            imagePath: tempFilePath,
            maskHidden: false
            // canvasHidden:true
          });
          wx.hideToast();
          wx.saveImageToPhotosAlbum({
            filePath: "" + res.tempFilePath,
            success(res) {
              console.log("保存成功");
            },
            fail: (err) => {
              console.log(err.errMsg);

            }
          })
        },
        fail: function(res) {
          console.log(res);
        }
      })
    }, 1000);

  },
  // 回退到首页
  back: function() {

    wx.navigateBack({
      delta: 1
    })
  },
  //  获取详情的资讯
  getDetails: function(id) {
    var t = this;
    console.log("id是：" + id);
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
        let content = res.data.data.imgUrl.split(',');
        // console.log(content.length);
        if (res.data.data.imgUrl != '') {
          content = res.data.data.imgUrl.split(','); //记得修改
          for (let l = 0; l < content.length; l++) {
            content[l] = 'https://helpyou-1255600302.cosgz.myqcloud.com' + content[l]
          }
        } else {
          content = [];
        }
        t.data.userData = {
          name: res.data.data.username,
          timeStamp: res.data.data.createTime,
          avatarUrl: res.data.data.headImage,
          text: res.data.data.content,
          content: content,
          // address: res.data.data.address, 
          address: res.data.data.address,
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
          }, ],
          message_id: res.data.data.id,
          call: res.data.data.appellation,
          phone: res.data.data.phone,
          visitQuantity: res.data.data.visitQuantity,
          category:res.data.data.category
        }
        console.log(t.data.userData);
        t.setData({
          userData: t.data.userData
        });
        t.downLoadImg();
      }

    })
  },
  //下载图片
  downLoadImg: function() {
    var t = this;
    let len = t.data.userData.content.length;
    if (len > 3) {
      len = 3;
    }
    // console.log
    for (let i = 0; i < len; i++) {
      wx.downloadFile({
        url: t.data.userData.content[i],
        success: function(res) {
          console.log("laile", res);
          if (res.statusCode == 200) {
            t.data.imgBox.push(res.tempFilePath);
            t.setData({
              imgBox: t.data.imgBox
            });
            wx.downloadFile({
              url: t.data.userData.avatarUrl,
              success: function (res) {
                console.log("laile", res);
                if (res.statusCode == 200) {

                  t.setData({
                    headimg: res.tempFilePath
                  });
                  t.readyDraw();
                }
              }
            })
          }
        }
      })
    };
    

  },
  //已经画好的
  readyDraw: function() {
    var that = this;
    console.log("临时路径", that.data.imgBox);
    console.log(that.data.userData.text);
    var ctx = wx.createCanvasContext("share");
    var str = "徐若海";
    var str2 = that.data.userData.text;
    console.log(str2);
    var width = this.data.width;
    var height = this.data.trueheight;
    var w = width / 375 * 1.2*0.7;
    var h = height / 667 * 1.5*0.8;
    var pi = app.pixelRatio;
var va=29*height/667;

    // 2path
    var ctx2 = wx.createCanvasContext("sharehidden");

    console.log(width * 0.16 * w - 40 * w, width * 0.15 * h - 40 * h, width, width * 0.12 * h + 100 * h + height * h * 0.26 - (width * 0.1 * h - 40 * h));


    // ctx2.setFillStyle('white')
    // ctx2.fillRect(width * 0.16 * w - 40 * w, width * 0.15 * h - 40 * h, width, width * 0.12 * h + 100 * h + height * h * 0.26 - (width * 0.1 * h - 40 * h))
    ctx2.drawImage("/images/bgli.png", 0, 0, width, height * 0.8);
    ctx2.drawImage("/images/blank.png", width * 0.12 * w - 57 * w+va, width * 0.25 * h - 50 * h, (width + 20 * w)*0.8+va, (width * 0.12 * h + 100 * h + height * h * 0.22 - (width * 0.1 * h - 40 * h))); //来一张纯白色背景图
    ctx2.setFontSize(18 * w);
    ctx2.setFillStyle("white");
    ctx.setTextAlign('center')
    ctx2.fillText(that.data.userData.name + "发布了一条", width * 0.30 * w - 57 * w + va, width * 0.21 * h - 50 * h,);
    ctx2.setFontSize(22 * w);
    ctx2.fillText('#' + that.data.userData.category + "#", width * 0.48 * w - 57 * w + va, width * 0.265 * h - 50 * h,);
    ctx2.save()

    ctx2.beginPath();

    ctx2.arc(width * 0.137 * w+va, width * 0.26 * h, 30 * w, 0, 2 * Math.PI);
    ctx2.clip();


    ctx2.drawImage(that.data.headimg, width * 0.137 * w - 40 * w+va, width * 0.29 * h - 40 * h, 80 * w, 80 * h);
    ctx2.setTransform(0.1 * w, 0, 0, 0.1 * h, 0, 0);

    ctx2.restore()

    ctx2.setFontSize(16 * w);
    ctx2.setFillStyle("black");
    ctx2.fillText(that.data.userData.name, width * 0.137 * w + 60 * w+va, width * 0.25 * h);
    ctx2.setFillStyle("#ccc");
    ctx2.fillText(that.data.userData.timeStamp, width * 0.137 * w + 50 * w+va, width * 0.31 * h);
    ctx2.setFillStyle("black");

    that.canvasTextAutoLine(str2, ctx2, width * 0.137 * w - 40 * w+va, width * 0.23* h + 60 * h, 25 * h, w);


    // if (pi > 2) {
    if(that.data.imgBox.length==1){
      ctx2.save();
      ctx2.drawImage(that.data.imgBox[0], width * 0.137 * w + va - 40 * w , width * 0.24 * h + 80 * h, width * 0.34 * w, height * h * 0.16);
      ctx2.restore();
    }else{
      for (let i = 0; i < that.data.imgBox.length; i++) {
        ctx2.save();
        ctx2.drawImage(that.data.imgBox[i], width * 0.137 * w + va - 40 * w + i * width * 0.25, width * 0.24* h + 80 * h, width * 0.24 * w, height * h * 0.14);
        ctx2.restore();
      }
    }
    
    
    ctx2.setFontSize(14 * w);
    ctx2.setFillStyle("#ccc");
    ctx2.fillText("地址:"+that.data.userData.address, width * 0.137 * w +va- 40 * w, width * 0.20 * h + 60 * h + height * h * 0.24);
    for (let i = 0; i < that.data.userData.others.length; i++){
      ctx2.drawImage(that.data.userData.others[i].key, width * 0.135 * w + va - 40 * w+100*w*i-20*i, width * 0.18 * h+ 60 * h + height * h * 0.27,18*w,12*h);
      ctx2.fillText(that.data.userData.others[i].value, width * 0.135 * w + va - 40 * w + 100 * w * i-20 * i+20, width * 0.180 * h + 70 * h + height * h * 0.27);
    }
    

    // } 
    ctx2.draw(false, function() {
      // console.log("wozhixingle");
      // wx.canvasToTempFilePath({
      //   canvasId: 'sharehidden',
      //   success: function(res) {
      //     var tempFilePath = res.tempFilePath;
      //     console.log(tempFilePath);
      //     that.setData({
      //       imagePath: tempFilePath,

      //     });
      //     console.log(that.data.imagePath);
      //     var ctx = wx.createCanvasContext("share");
      //     // ctx.setFillStyle("#ccc");
      //     // ctx.fillText("3分钟之前", width * 0.23 * w, width * 0.39 * h);

      //     // ctx.draw()
      //     ctx.drawImage("/images/bgli.png", 0, 0, width, height * 0.8);

      //     ctx.drawImage(that.data.imagePath, 34, 96, 276 * w, 235 * h)
      //     ctx.draw(false, function() {
            that.setData({
              canShow: true
            });
      //     });

      //   },
      //   fail: function(res) {
      //     console.log(res);
      //   }
      // })
    });
  },
erweima:function(id){
  wx.request({
    url: 'http://192.168.1.18:8011/helpyou/api/v1/app/qrcode/get',


    method: "GET",
    
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
      
    }

  })
},
})