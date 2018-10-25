// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  toAll: function () {
    wx.navigateTo({
      url: '/pages/me/all/all'
    })
  },
  toSubmitted: function () {
    wx.navigateTo({
      url: '/pages/me/submited/submited'
    })
  },
  toConfirmed: function () {
    wx.navigateTo({
      url: '/pages/me/confirmed/confirmed'
    })
  },
  toSolved: function () {
    wx.navigateTo({
      url: '/pages/me/solved/solved'
    })
  },
  toSuggest: function () {
    wx.navigateTo({
      url: '/pages/me/suggestion/suggestion'
    })
  },
  toLogout: function () {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})