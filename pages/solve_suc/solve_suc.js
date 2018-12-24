const app = getApp()

Page({
  data: {
    troubleId: 0,
    buttons: [{
      type: 'balanced',
      block: true,
      text: '回首页',
    }
    ],
  },
  onClick(e) {
    wx.reLaunch({
      url: '/pages/submit/submit'
    })
  },
  toHome: function () {
    wx.reLaunch({
      url: '/pages/submit/submit'
    })
  }
})