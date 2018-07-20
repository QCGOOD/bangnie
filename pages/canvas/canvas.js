// pages/canvas/canvas.js
var app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canShow: false,
    imgBox: [],
    // erweima: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options);

    console.log(options.sourceId);
    this.setData({
      width: app.width,
      height: app.height,
      trueheight: app.trueHeight,
      sourceId: options.sourceId

    });
    wx.showLoading()
    // that.getDetails(that.data.sourceId);
    that.erweima();
  },

  //生成背景图
  // makeBg:function(){

  // },
  /*
  str:要绘制的字符串
  canvas:canvas对象
  initX:绘制字符串起始x坐标
  initY:绘制字符串起始y坐标
  lineHeight:字行高，自己定义个值即可
  */
  canvasTextAutoLine: function(str, ctx, initX, initY, lineHeight) {
    var that = this;
    let line = 1;
    var lineWidth = 0;
    var canvasWidth = 300;
    var lastSubStrIndex = 0;
    if (str.length > 33) {
      str = str.substring(0, 33) + '...';
    }
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth - initX) { //减去initX,防止边界出现的问题
        ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
        initY += lineHeight;
        lineWidth = 0;
        line++;
        lastSubStrIndex = i;
      }
      console.log(line);
      that.setData({
        line: line
      });
      if (i == str.length - 1) {
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
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
        // wx.downloadFile({
        //   url: res.data.data.headImage,
        //   success: function(res) {
        //     console.log("laile", res);
        //     if (res.statusCode == 200) {

        //       t.setData({
        //         headimg: res.tempFilePath
        //       });
        //       // t.readyDraw();
        //     }
        //   }
        // })
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
          category: res.data.data.category
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
    var that = this;
    let len = t.data.userData.content.length;
    if (len > 3) {
      len = 3;
    }
    // console.log
    wx.downloadFile({
      url: t.data.userData.avatarUrl,
      success: function(res) {
        console.log("laile", res);
        if (res.statusCode == 200) {

          t.setData({
            headimg: res.tempFilePath
          });
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              wx.downloadFile({
                url: t.data.userData.content[i],
                success: function(res) {
                  // console.log("laile", res);
                  if (res.statusCode == 200) {
                    t.data.imgBox.push(res.tempFilePath);
                    t.setData({
                      imgBox: t.data.imgBox,
                      // true_flag:true
                    });
                    t.readyDraw();
                  }
                }
              })
            };
          } else {
            t.onlyDraw();
          }

        }
      }
    })
  },
  //onlydraw
  onlyDraw: function() {
    var that = this;
    // console.log("临时路径", that.data.imgBox);
    console.log(that.data.userData.text);
    var ctx = wx.createCanvasContext("share");
    var str = "徐若海";
    var str2 = that.data.userData.text;
    console.log(str2);
    var width = this.data.width;
    var height = this.data.trueheight;
    // 2path
    var ctx2 = wx.createCanvasContext("sharehidden");
    ctx2.drawImage("/images/bgli.png", 0, 0, width, height * 0.8);
    ctx2.drawImage("/images/blank.png", width * 0.15 - 50, height * 0.28 - 50, 350, height * 0.18 + 3 * 16 + 40 + 43 - height * 0.18 + 45);
    ctx2.save()
    ctx2.setFontSize(16);
    ctx2.setFillStyle("white");
    ctx2.setTextAlign('center')
    ctx2.fillText(that.data.userData.name + "发布了一条", 0.5 * width, height * 0.05, );
    ctx2.setFontSize(20);
    ctx2.fillText('#' + that.data.userData.category + "#", width * 0.5, height * 0.09, );
    ctx2.restore()
    ctx2.save()
    ctx2.beginPath();
    ctx2.arc(width * 0.15, height * 0.28, 20, 0, 2 * Math.PI);
    ctx2.clip();
    ctx2.drawImage(that.data.headimg, width * 0.15 - 20, height * 0.28 - 20, 40, 40);
    ctx2.setTransform(0.1, 0, 0, 0.1, 0, 0);
    ctx2.restore()
    ctx2.setFontSize(16);
    ctx2.setFillStyle("black");
    ctx2.fillText(that.data.userData.name, width * 0.15 + 30, height * 0.28 - 5);
    ctx2.setFillStyle("#ccc");
    ctx2.fillText(that.data.userData.timeStamp, width * 0.15 + 35, height * 0.28 + 15);
    ctx2.setFillStyle("black");
    ctx2.setFontSize(14);
    that.canvasTextAutoLine(str2, ctx2, width * 0.15 - 20, height * 0.28 + 45, 16);
    ctx2.setFontSize(14);
    ctx2.setFillStyle("#ccc");
    ctx2.fillText("地址:" + that.data.userData.address, width * 0.15 - 20, height * 0.28 + that.data.line * 16 + 40 + 20);
    for (let i = 0; i < that.data.userData.others.length; i++) {
      console.log('======>', that.data.userData.others[i].key)
      ctx2.drawImage(that.data.userData.others[i].key, width * 0.15 - 20 + i * (60 + width * 0.025), height * 0.28 + that.data.line * 16 + 40 + 30, 15, 5);
      ctx2.fillText(that.data.userData.others[i].value, width * 0.15 - 20 + i * (60 + width * 0.03) + width * 0.031 + 5, height * 0.28 + that.data.line * 16 + 40 + 43, width * 0.03, height * 0.03);
    }
    ctx2.drawImage(that.data.erweima, width - 80, height * 0.85 - 80, 60, 60);
    ctx2.draw(false, function() {
      that.setData({
        canShow: true
      });

    });
  },
  //已经画好的
  readyDraw: function() {
    wx.showToast({
      title: '我执行了画图'
    })
    var that = this;
    // console.log("临时路径", that.data.imgBox);
    console.log(that.data.userData.text);
    var ctx = wx.createCanvasContext("share");
    var str = "徐若海";
    var str2 = that.data.userData.text;
    console.log(str2);
    var width = this.data.width;
    var height = this.data.trueheight;
    // 2path
    var ctx2 = wx.createCanvasContext("sharehidden");
    ctx2.drawImage("/images/bgli.png", 0, 0, width, height * 0.8);
    if (that.data.imgBox.length == 0) {
      ctx2.drawImage("/images/blank.png", width * 0.15 - 50, height * 0.18 - 50, 350, height * 0.18 + 3 * 16 + 40 + 43 - height * 0.18 + 45); //来一张纯白色背景图
    } else if (that.data.imgBox.length == 1) {
      ctx2.drawImage("/images/blank.png", width * 0.15 - 50, height * 0.18 - 50, 350, height * 0.18 + 3 * 16 + width * 0.3 + 40 + 43 - height * 0.18 + 40); //来一张纯白色背景图
    } else {
      ctx2.drawImage("/images/blank.png", width * 0.15 - 50, height * 0.18 - 50, 350, height * 0.18 + 3 * 16 + 40 + width * 0.23 + 43 - height * 0.18 + 45); //来一张纯白色背景图
    }
    ctx2.save()
    ctx2.setFontSize(16);
    ctx2.setFillStyle("white");
    ctx2.setTextAlign('center')
    ctx2.fillText(that.data.userData.name + "发布了一条", 0.5 * width, height * 0.05, );
    ctx2.setFontSize(20);
    ctx2.fillText('#' + that.data.userData.category + "#", width * 0.5, height * 0.09, );
    ctx2.restore()
    ctx2.save()
    ctx2.beginPath();
    ctx2.arc(width * 0.15, height * 0.18, 20, 0, 2 * Math.PI);
    ctx2.clip();
    ctx2.drawImage(that.data.headimg, width * 0.15 - 20, height * 0.18 - 20, 40, 40);
    ctx2.setTransform(0.1, 0, 0, 0.1, 0, 0);
    ctx2.restore()
    ctx2.setFontSize(16);
    ctx2.setFillStyle("black");
    // if (that.data.userData.name.length>4){
    //   that.data.userData.name = that.data.userData.name.substring(0,3)+'...';
    //   that.setData({
    //     userData:userData
    //   });
    // }
    ctx2.fillText(that.data.userData.name, width * 0.15 + 30, height * 0.18 - 5);
    ctx2.setFillStyle("#ccc");
    ctx2.fillText(that.data.userData.timeStamp, width * 0.15 + 35, height * 0.18 + 15);
    ctx2.setFillStyle("black");
    ctx2.setFontSize(14);
    that.canvasTextAutoLine(str2, ctx2, width * 0.15 - 20, height * 0.18 + 45, 16);
    //不能存在文件没加载完成就画，也不有空文件
    if (that.data.imgBox.length == 0) {
      ctx2.setFontSize(14);
      ctx2.setFillStyle("#ccc");
      ctx2.fillText("地址:" + that.data.userData.address, width * 0.15 - 20, height * 0.18 + that.data.line * 16 + 40 + 20);
      for (let i = 0; i < that.data.userData.others.length; i++) {
        ctx2.drawImage(that.data.userData.others[i].key, width * 0.15 - 20 + i * (60 + width * 0.025), height * 0.18 + that.data.line * 16 + 40 + 30, width * 0.025, height * 0.025);
        ctx2.fillText(that.data.userData.others[i].value, width * 0.15 - 20 + i * (60 + width * 0.03) + width * 0.031 + 5, height * 0.18 + that.data.line * 16 + 40 + 43, width * 0.03, height * 0.03);
      }
      // return;
    } else
    if (that.data.imgBox.length == 1) {
      ctx2.save();
      ctx2.drawImage(that.data.imgBox[0], width * 0.15 - 20, height * 0.18 + that.data.line * 16 + 40, width * 0.3, width * 0.3);
      ctx2.restore();
      ctx2.setFontSize(14);
      ctx2.setFillStyle("#ccc");
      ctx2.fillText("地址:" + that.data.userData.address, width * 0.15 - 20, height * 0.18 + that.data.line * 16 + 40 + width * 0.3 + 20);
      for (let i = 0; i < that.data.userData.others.length; i++) {
        ctx2.drawImage(that.data.userData.others[i].key, width * 0.15 - 20 + i * (60 + width * 0.025), height * 0.18 + that.data.line * 16 + 40 + width * 0.3 + 30, width * 0.025, height * 0.025);
        ctx2.fillText(that.data.userData.others[i].value, width * 0.15 - 20 + i * (60 + width * 0.03) + width * 0.031 + 5, height * 0.18 + that.data.line * 16 + 40 + width * 0.3 + 43, width * 0.03, height * 0.03);
      }
    } else {
      for (let i = 0; i < that.data.imgBox.length; i++) {
        ctx2.save();
        ctx2.drawImage(that.data.imgBox[i], width * 0.15 - 20 + i * (10 + width * 0.23), height * 0.18 + that.data.line * 16 + 40, width * 0.23, width * 0.23);
        ctx2.restore();
        ctx2.setFontSize(14);
        ctx2.setFillStyle("#ccc");
        ctx2.fillText("地址:" + that.data.userData.address, width * 0.15 - 20, height * 0.18 + that.data.line * 16 + 40 + width * 0.23 + 20);
        for (let i = 0; i < that.data.userData.others.length; i++) {
          ctx2.drawImage(that.data.userData.others[i].key, width * 0.15 - 20 + i * (60 + width * 0.025), height * 0.18 + that.data.line * 16 + 40 + width * 0.23 + 30, width * 0.025, height * 0.025);
          ctx2.fillText(that.data.userData.others[i].value, width * 0.15 - 20 + i * (60 + width * 0.03) + width * 0.031 + 5, height * 0.18 + that.data.line * 16 + 40 + width * 0.23 + 43, width * 0.03, height * 0.03);
        }
      }
    }



    // console.log(that.data.erweima);
    ctx2.drawImage(that.data.erweima, width - 80, height * 0.85 - 80, 60, 60);

    ctx2.draw(false, function() {

      that.setData({
        canShow: true
      });

    });
  },
  erweima: function() {
    var that = this;

    wx.request({
      url: `${app.http}/app/qrcode/get`,

      method: "GET",
      data: {
        wego168SessionKey: wx.getStorageSync("key"),
        id: that.data.sourceId
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
        wx.downloadFile({
          url: 'https://helpyou-1255600302.cosgz.myqcloud.com' + res.data.message,
          success: function(response) {
            console.log(response);
            if (response.statusCode == 200) {
              that.data.erweima = response.tempFilePath;
              that.setData({
                erweima: that.data.erweima
              });
              wx.hideLoading();
              // wx.navigateTo({
              //   url: '/pages/canvas/canvas?path=' + response.tempFilePath + "&sourceId=" + that.data.sourceId,
              // })
              that.getDetails(that.data.sourceId);
            }
          }
        })
      }

    })
  },

})