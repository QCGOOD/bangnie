var app = getApp().globalData;

Page({
  data: {
    model: {
      wego168SessionKey: '',
      areaId: '',
      categoryId: '',
      address: '',
      content: '',
      imgUrl: '',
      phone: '',
      appellation: '',
      formId: ''
    },
    tempFilePaths: [],
    imageUrl: [],
    name: '',
  },
  onLoad (options) {
    console.log(options)
    // console.log(this.data.model)
    console.log('onLoad == ', this.data)
    this.data.name = options.name
    this.data.model = {
      wego168SessionKey: wx.getStorageSync("key"),
      areaId: wx.getStorageSync("id"),
      categoryId: options.id,
      address: wx.getStorageSync("LCDetails"),
      content: '',
      imgUrl: '',
      phone: '',
      appellation: '',
      formId: ''
    }
    this.setData({
      model: this.data.model,
      name: this.data.name
    })
    console.log('onLoad === ', this.data.model)
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
      count: 9 - this.data.tempFilePaths.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        tempFilePaths.map(item => {
          this.data.tempFilePaths.push(item)
        })
        this.setData({
          tempFilePaths: this.data.tempFilePaths
        })
        // this.uploadFile(tempFilePaths[0])
      }
    })
  },
  chehui(e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    this.data.tempFilePaths.splice(index, 1)
    this.setData({
      tempFilePaths: this.data.tempFilePaths
    })
  },
  uploadFile(path) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.http + 'attachments/images/tencent_cloud',
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
      this.showToast('图片上传失败，请重新点击发布')
    })
  },
  loopImg() {
    let tempFilePaths = this.data.tempFilePaths
    let imageUrl = this.data.imageUrl
    if (imageUrl.length < tempFilePaths.length) {
      let path = tempFilePaths[tempFilePaths.length - (tempFilePaths.length - imageUrl.length)]
      console.log('path === ', path)
      this.uploadImg(path)
    } else {
      if (imageUrl.length !== tempFilePaths.length) {
        this.setData({
          imageUrl: []
        })
        this.loopImg()
      } else {
        let imageUrl = ''
        this.data.imageUrl.map(item => {
          imageUrl += item + ','
        })
        imageUrl = imageUrl.substring(0, imageUrl.length - 1)
        this.data.model.imgUrl = imageUrl
        this.setData({
          model: this.data.model
        })
        wx.hideLoading()
        this.save();
      }
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
    console.log(this.data.model)
    // return
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
    if (this.data.tempFilePaths.length > 0) {
      this.loopImg()
    } else {
      this.save()
    }
  },
  save() {
    // return
    wx.showLoading({
      title: '正在发布'
    })
    console.log(this.data.model)
    wx.request({
      url: `${app.http}/app/information/save`,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: this.data.model,
      success: (res) => {
        wx.hideLoading();
        console.log(res.data);
        let data = res.data
        if (data.code === 20000) {
          this.showToast('发布成功', 'success')
          wx.redirectTo({
            url: '/pages/sendSuccess/sendSuccess'
          })
        } else {
          console.log(data.message)
          this.showToast(data.message)
        }
      }
    })
  }
})