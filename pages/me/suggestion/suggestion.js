var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    mobile: ''
  },

  toSubmit: function() {
    var that = this;
    var content = that.data.content;
    if (content == "") {
      wx.showToast({
        title: '请先输入遇到的问题或建议...',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: app.globalData.localApiUrl + '/common/submitSug',
        method: 'POST',
        data: {
          "content": that.data.content,
          "mobile": that.data.mobile,
          "submitUserId": 1, //wx.getStorageSync("userInfo").id,
          "submitTime": new Date()
        },
        success(res) {
          console.log(res.data);
          if (res.data.code == 1) {
            wx.navigateTo({
              url: '/pages/me/suggestion/suggest_suc/suggest_suc'
            })
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
    }

  },
  bindContentChange: function(e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      content: value,
    })
  },
  bindMobileChange: function(e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      mobile: value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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