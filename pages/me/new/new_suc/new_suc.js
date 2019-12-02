const app = getApp()

Page({
  data: {
    buttons: [{
      type: 'balanced',
      block: true,
      text: '返回',
    }, {
      type: 'positive',
      block: true,
      text: '再登记一个',
    }],
  },
  onClick(e) {
    const {
      index
    } = e.detail
    index === 0 && wx.reLaunch({
      url: '/pages/me/me'
    })

    index === 1 && wx.reLaunch({
      url: '/pages/me/new/new'
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