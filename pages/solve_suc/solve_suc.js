const app = getApp()

Page({
  data: {
    troubleId: 0
  },

  toHome: function () {
    wx.reLaunch({
      url: '/pages/submit/submit'
    })
  }
})