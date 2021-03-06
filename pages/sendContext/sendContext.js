var QQMapWX = require("../../libs/qqmap-wx-jssdk.min.js");
var qqMapWX;
var app = getApp().globalData;

Page({
  data: {
    warnforwx: 0,
    model: {
      wego168SessionKey: '',
      areaId: '',
      categoryId: '',
      address: '',
      content: '',
      imgUrl: '',
      phone: '',
      appellation: '',
      formId: '',
    },
    tempFilePaths: [],
    imageUrl: [],
    name: '',
    id: '',
    imgHost: app.imgHost,
    count: 0,
    height: 0,
    isGetPhone: false
  },
  onLoad (options) {
    
    this.setData({
      height: app.height
    })
    this.data.name = options.name
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.detail(options.id)
    } else {
      this.memberAuthenticate();
      this.data.model = {
        wego168SessionKey: wx.getStorageSync("key"),
        areaId: wx.getStorageSync("id"),
        categoryId: options.categoryId,
        address: wx.getStorageSync("LCDetails"),
        content: '',
        imgUrl: '',
        phone: '',
        appellation: '',
        formId: ''
      }
    }
    if(options.id){
      this.setData({id: options.id})
      // 详情
    }
    this.setData({
      model: this.data.model,
      name: this.data.name
    })
  },

  // 腾讯地图
  qqMap() {
    let that = this;
    //实例化腾讯地图德核心类
    qqMapWX = new QQMapWX({
      // key: "BH5BZ-6NCWW-2HQR4-O7E7Y-Z6IZZ-OKBMQ"
      key: "WTHBZ-BZT36-YX6SJ-M5AJW-BGSDF-YVBT4"
    });
    //获取经纬度
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度,使用德时候注意查看官方文档注意兼容问题
      altitude: true,
      success: function(res) {
        that.getCity(res.longitude, res.latitude);
      },
    })
  },

  //获取当前的城市
  getCity: function(longitude, latitude) {
    var that = this;
    qqMapWX.reverseGeocoder({
      location: {
        latitude: '' + latitude,
        longitude: '' + longitude,
      }, //location的格式是传入一个字符对象
      coord_type: 5,
      success: function(res) {
        wx.setStorage({
          key: "LCDetails",
          data: res.result.address,
        })
        let address = 'model.address';
        console.log('定位了')
        that.setData({
          [address]: wx.getStorageSync("LCDetails"),
        })
      }
    });
  },

  // 清除缓存位置
  clearAddress() {
    wx.removeStorageSync('address');
    this.qqMap();
  },

  contentInput (e) {
    this.data.model.content = e.detail.value
    this.setData({
      model: this.data.model
    })
  },
  phoneInput(e) {
    this.data.model.phone = e.detail.value
    this.setData({
      model: this.data.model
    })
  },
  nameInput(e) {
    this.data.model.appellation = e.detail.value
    this.setData({
      model: this.data.model
    })
  },
  chooseImage() {
    wx.chooseImage({
      count: 9 - this.data.imageUrl.length, // 默认9
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        
        // tempFilePaths.map(item => {
        //   this.data.tempFilePaths.push(item)
        // })
        this.setData({
          tempFilePaths: tempFilePaths,
          count: 0
        })
        this.loopImg(this.data.tempFilePaths)
        // this.uploadFile(tempFilePaths[0])
      }
    })
  },
  chehui(e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    this.data.imageUrl.splice(index, 1)
    this.setData({
      imageUrl: this.data.imageUrl
    })
  },
  uploadFile(path) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.http + '/attachments/images/tencent_cloud',
        filePath: path,
        name: 'file',
        formData: {
          imageType: 'member'
        },
        success: (res) => {
          let data = JSON.parse(res.data)
          console.log('Promise == ', data);
          if (data.code === 20000) {
            resolve(res)
          } else {
            reject(res)
          }
          // resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  },
  uploadImg(path) {
    wx.showLoading({
      title: '正在上传图片'
    })
    this.uploadFile(path).then(res => {
      console.log('uploadImg === ', res.data)
      let imgJSon = JSON.parse(res.data).data.imageUrl;
      this.data.imageUrl.push(imgJSon)
      this.setData({
        imageUrl: this.data.imageUrl
      })
      this.loopImg()
    }).catch(err => {
      wx.hideLoading()
      this.setData({
        imageUrl: []
      })
      this.showToast('图片上传失败，请重新上传')
    })
  },
  loopImg() {
    let tempFilePaths = this.data.tempFilePaths
    if (this.data.count < tempFilePaths.length) {
      this.uploadImg(tempFilePaths[this.data.count])
      this.setData({
        count: this.data.count + 1
      })
    } else {
      wx.hideLoading()
      console.log(this.data.imageUrl)
    }
  },
  showToast(title, icon) {
    wx.showToast({
      title: title,
      icon: icon || 'none'
    })
  },
  submit(e) {
    this.data.model.formId = e.detail.formId
    this.setData({
      model: this.data.model
    })
    let model = this.data.model
    if (model.content === "") {
      this.showToast('请输入内容')
      return
    }
    if (model.appellation === "") {
      this.showToast('请输入称呼')
      return
    }
    if (model.phone === "") {
      this.showToast('请输入手机号码')
      return
    }
    if (this.data.imageUrl.length > 0) {
      let imageUrl = ''
      this.data.imageUrl.map(item => {
        imageUrl += item + ','
      })
      imageUrl = imageUrl.substring(0, imageUrl.length - 1)
      this.data.model.imgUrl = imageUrl
      this.setData({
        model: this.data.model
      })
    }
    // 敏感字
    let reg = RegExp(/微信/);
    if (this.data.model.content.match(reg)){
      if (this.data.warnforwx == 0) {
        this.setData({
          warnforwx: 1
        })
        wx.showModal({
          title: '温馨提醒',
          content: '为了保护您的个人隐私和安全，建议不要提供个人微信号。',
          showCancel: false,
          confirmText: '知道了',
        })
        return false;
      }
    }
    
    if (this.data.id) {
      this.update()
    } else {
      this.save()
    }
    
  },
  save() {
    // return
    wx.showLoading({
      title: '正在发布'
    })
    let model = this.data.model;
    model.wego168SessionKey = wx.getStorageSync("key");
    this.postData('/app/information/save', model).then(res => {
      wx.hideLoading()
      if (res.data.data.isAudit) {
        this.showToast('发布成功')
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/details/details?id='+res.data.data.id
          })
        }, 1500)
      } else {
        this.showToast('提交成功，等待审核')
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/sendSuccess/sendSuccess'
          })
        }, 1500)
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(data.message)
      this.showToast(data.message)
    })
  },
  update() {
    // return
    wx.showLoading({
      title: '正在修改'
    })
    let model = this.data.model;
    model.wego168SessionKey = wx.getStorageSync("key");
    this.postData('/app/information/update', model).then(res => {
      wx.hideLoading()
      if (res.data.data.isAudit) this.showToast('修改成功');
      else this.showToast('提交成功，等待审核');
      
      setTimeout(() => {
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
          success: function(res){
            var page = getCurrentPages().pop(); 
            if (page == undefined || page == null) return; 
            page.onLoad(); 
          }
        })
      }, 1500)
    }).catch(err => {
      wx.hideLoading()
      console.log(data.message)
      this.showToast(data.message)
    })
  },
  detail(id) {
    wx.showLoading({
      title: '数据加载中'
    })
    this.getData('/app/information/get', {id: id}).then(res => {
      wx.hideLoading();
      let data = res.data.data
      let model = {}
      model.content = data.content
      model.id = data.id
      model.phone = data.phone
      model.appellation = data.appellation
      model.address = data.address
      model.categoryId = data.categoryId
      if (data.imgUrl) {
        if (new RegExp(",").test(data.imgUrl)) {
          console.log(12313)
          this.data.imageUrl = data.imgUrl.split(',')
        } else {
          console.log('fsdfsfdsfsd')
          this.data.imageUrl[0] = data.imgUrl
        }
      }
      this.setData({
        model: model,
        imageUrl: this.data.imageUrl
      })
    }).catch(err => {
      wx.hideLoading();
      this.showToast(data.message)
    })
  },
  memberAuthenticate() {
    this.getData('/app/memberAuthenticate/get').then(res => {
      console.log(res.data)
      if (res.data.data && res.data.data.phoneNumber) {
        this.data.model.phone = res.data.data.phoneNumber
        this.data.model.appellation = res.data.data.appellation
        this.setData({
          model: this.data.model,
          isGetPhone: false
        })
      } else {
        this.setData({
          isGetPhone: true
        })
      }
    })
  },
  // // 判断是否需要获取手机号
  // judgePhone() {
  //   var t = this;
  //   wx.request({
  //     url: `${app.http}/app/isNeed`,
  //     method: "GET",
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  //     },
  //     data: {
  //       wego168SessionKey: wx.getStorageSync("key")
  //     },
  //     success: function(res) {
  //       if (res.data.code == 50103) {
  //         appJs.apiLogin(() => {
  //           t.judgePhone()
  //         })
  //       } else if (res.data.code == 20000) {
  //         t.setData({
  //           isGetPhone: res.data.data
  //         });
  //       }
  //     }
  //   });
  // },
  // common.filterEmoji = function (name) {
  //   let newName = ''
  //   let is4Byte = function (str) {
  //     return str.codePointAt(0) > 65535
  //   }
  //   for (let item of name) {
  //     if (!is4Byte(item)) {
  //       newName += item
  //     }
  //   }
  //   newName = common.isEmpty(newName) ? '*' : newName
  //   return newName
  // }
  getPhoneNumber(e) {
    console.log(e)
    if (e.detail.encryptedData) {
      let params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      this.postData('/app/phone', params).then(res => {
        console.log(res.data)
        this.data.model.phone = res.data.message
        this.setData({
          model: this.data.model
        })
      })
    }
  },
  getData (url, params = {}) {
    params.wego168SessionKey = wx.getStorageSync("key")
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.http + url,
        data: params,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: res => {
          if (res.data.code === 20000) {
            resolve(res)
          } else {
            wx.showToast({
              title: res.data.message || '系统出错',
              icon: 'none',
              duration: 2000
            })
            reject(res)
          }
        },
        fail: err => {
          wx.showToast({
            title: res.data.message || '系统出错',
            icon: 'none',
            duration: 2000
          })
          reject(err)
        }
      })
    })
  },
  postData (url, params = {}) {
    params.wego168SessionKey = wx.getStorageSync("key")
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.http + url,
        data: params,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if (res.data.code === 20000) {
            resolve(res)
          } else {
            wx.showToast({
              title: res.data.message || '系统出错',
              icon: 'none',
              duration: 2000
            })
            reject(err)
          }
        },
        fail: err => {
          wx.showToast({
            title: res.data.message || '系统出错',
            icon: 'none',
            duration: 2000
          })
          reject(err)
        },
      })
    })
  },
})