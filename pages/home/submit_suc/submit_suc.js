const app = getApp()

Page({
  data: {
    troubleId: 0,
    buttons: [{
        type: 'balanced',
        block: true,
        text: '去查看',
      },
      {
        type: 'light',
        block: true,
        text: '回首页',
      },
    ],
  },
  //事件处理函数
  toView: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/detail/detail?troubleId=' + that.data.troubleId
    })
  },
  toHome: function() {
    wx.reLaunch({
      url: '/pages/submit/submit'
    })
  },
  onClick(e) {
    var that = this;
    const {
      index
    } = e.detail
    index === 0 && wx.navigateTo({
      url: '/pages/detail/detail?troubleId=' + that.data.troubleId
    })

    index === 1 && wx.reLaunch({
      url: '/pages/submit/submit'
    })
  },
  onLoad: function(options) {
    var troubleId = options.troubleId;
    this.setData({
      troubleId: troubleId
    });
  }
})