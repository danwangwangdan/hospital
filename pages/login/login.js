//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
  },
  onLoad: function () {

  },
    //事件处理函数
  toLogin: function () {
        wx.switchTab({
            url: '/pages/home/home'
        })
    },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
