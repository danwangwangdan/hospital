const app = getApp()

Page({
  data: {
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
  //事件处理函数
  toHome: function() {
    wx.reLaunch({
        url: '/pages/submit/submit'
    })
  },
  onLoad: function() {

  }
})