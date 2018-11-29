// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '黄士明',
    office: '网络中心',
    tel: "15974040709"
  },
  toAll: function() {
    wx.navigateTo({
      url: '/pages/me/all/all'
    })
  },
  toSubmitted: function() {
    wx.navigateTo({
      url: '/pages/me/submited/submited'
    })
  },
  toConfirmed: function() {
    wx.navigateTo({
      url: '/pages/me/confirmed/confirmed'
    })
  },
  toSolved: function() {
    wx.navigateTo({
      url: '/pages/me/solved/solved'
    })
  },
  toSuggest: function() {
    wx.navigateTo({
      url: '/pages/me/suggestion/suggestion'
    })
  },
  toLogout: function() {
    wx.request({
      url: app.globalData.localApiUrl + '/user/logout',
      method: 'GET',
      success(res) {
        console.log(res.data);
        if (res.data.code == 1) {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        } else {

        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      nickname: wx.getStorageSync("userInfo").nickname,
      office: wx.getStorageSync("userInfo").office,
      tel: wx.getStorageSync("userInfo").mobile
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})