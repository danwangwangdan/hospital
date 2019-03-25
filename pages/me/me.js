// pages/me/me.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    solveCount: 0,
    isAdmin: 0,
    nickname: '',
    office: '',
    tel: "",
    imgSrc: "",
    logoutText: "退出登录",
    isLoading: false,
    formIds: [],
    isDisabled: false
  },
  toAll: function() {
    wx.navigateTo({
      url: '/pages/me/all/all'
    })
  },
  toNew: function () {
    wx.navigateTo({
      url: '/pages/me/new/new'
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
  toDutyPlan: function() {
    wx.navigateTo({
      url: '/pages/me/dutyplan/dutyplan'
    })
  },
  toTools: function () {
    wx.navigateTo({
      url: '/pages/me/tools/tools'
    })
  },
  toSuggest: function() {
    wx.navigateTo({
      url: '/pages/me/suggestion/suggestion'
    })
  },
  toContact: function() {
    wx.navigateTo({
      url: '/pages/me/contact/contact'
    })
  },
  toReport: function () {
    wx.navigateTo({
      url: '/pages/me/report/report'
    })
  },
  toCollect: function (e) {
    var that = this;
    let formId = e.detail.formId;
    console.log(formId);
    this.data.formIds.push(formId);
    wx.request({
      url: app.globalData.localApiUrl + '/common/collectFormIds',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'formIds': that.data.formIds,
        'userId': wx.getStorageSync('userInfo').id
      },
      success(res) {
        console.log(res.data);
        wx.showToast({
          title: '获取成功！',
          icon: 'none',
          duration: 2000
        })
      },
      fail() {
        $stopWuxRefresher() //停止下拉刷新
        wx.showToast({
          title: '网络请求失败，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  toLogout: function() {
    var that = this;
    wx.clearStorageSync();
    that.setData({
      isDisabled: true,
      isLoading: true,
      loginText: "退出登录中..."
    })
    wx.request({
      url: app.globalData.localApiUrl + '/user/logout',
      method: 'GET',
      success(res) {
        console.log(res.data);
        if (res.data.code == 1) {
          wx.reLaunch({
            url: '/pages/login/login'
          });
          that.setData({

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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.request({
      url: app.globalData.localApiUrl + '/trouble/mySolveCount',
      method: 'GET',
      data: {
        "solver": wx.getStorageSync("userInfo").nickname
      },
      success(res) {
        console.log(res.data);
        if (res.data.code == 1) {
          that.setData({
            solveCount: res.data.data == null ? 0 : res.data.data.count
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