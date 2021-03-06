var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    var that = this;
    wx.showLoading({
      title: "请求中...",
      mask: true
    });
    wx.request({
      url: app.globalData.localApiUrl + '/common/contact',
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.code == 1) {
          var data = res.data.data;
          that.setData({
            contactList: data
          });
        }
      },
      fail() {
        wx.showToast({
          title: '网络请求失败，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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