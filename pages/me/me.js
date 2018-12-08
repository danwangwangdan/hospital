// pages/me/me.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: 0,
    nickname: '',
    office: '',
    tel: "",
    imgSrc: ""
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
  toNotSolved: function() {
    wx.navigateTo({
      url: '/pages/me/notsolved/notsolved'
    })
  },
  toSuggest: function() {
    wx.navigateTo({
      url: '/pages/me/suggestion/suggestion'
    })
  },
  toLogout: function() {
    wx.clearStorageSync();
    wx.request({
      url: app.globalData.localApiUrl + '/user/logout',
      method: 'GET',
      success(res) {
        console.log(res.data);
        if (res.data.code == 1) {
          wx.reLaunch({
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
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    var _imgSrc = wx.getStorageSync("imgSrc");
    if (_imgSrc == "") {
      _imgSrc = "../../pics/me_photo.png"
    }

    this.setData({
      nickname: wx.getStorageSync("userInfo").nickname,
      office: wx.getStorageSync("userInfo").office,
      tel: wx.getStorageSync("userInfo").mobile,
      isAdmin: wx.getStorageSync("userInfo").isAdmin,
      imgSrc: _imgSrc
    });
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