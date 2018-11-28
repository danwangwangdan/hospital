const app = getApp()

Page({
  data: {
      troubleId: 0
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
    onLoad: function (options) {
        var troubleId = options.troubleId;
    this.setData({
        troubleId: troubleId
    });
  }
})