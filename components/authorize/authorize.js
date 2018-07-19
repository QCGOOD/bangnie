// components/authorize/authorize.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isAuthorize: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo(e) {
      console.log(e)
      if (e.detail.userInfo) {
        this.triggerEvent('myevent')
      }
    },
    
  }
})
