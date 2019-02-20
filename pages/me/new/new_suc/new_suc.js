const app = getApp()

Page({
  data: {
    buttons: [{
      type: 'balanced',
      block: true,
      text: '返回',
    }
    ],
  },
  onClick(e) {
    wx.reLaunch({
      url: '/pages/me/me'
    })
  },
  //事件处理函数
  toHome: function() {
    wx.reLaunch({
        url: '/pages/me/me'
    })
  },
  onLoad: function() {

  }
})