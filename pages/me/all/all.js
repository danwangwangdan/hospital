// pages/me/me.js
var app = getApp();
import {
  $stopWuxRefresher
} from '../../../plugins/wux/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 'height:0rpx',
    troubleList: [],
    isNull: true,
    initialText: "加载中..."
  },
  //事件处理函数
  toDetail: function(e) {
    let troubleId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?troubleId=' + troubleId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    console.log("onShow");
    var that = this;
    var isAdmin = wx.getStorageSync('userInfo').isAdmin;
    if (isAdmin == 1) {
      wx.request({
        url: app.globalData.localApiUrl + '/trouble/all',
        method: 'GET',
        success(res) {
          console.log(res.data);
          wx.hideNavigationBarLoading() //完成停止加载
          $stopWuxRefresher() //停止下拉刷新
          if (res.data.code == 1) {
            var data = res.data.data;
            if (data != null && data.length != 0) {
              for (let i = 0; i < data.length; i++) {
                data[i].submitTime = new Date(data[i].submitTime).format("yyyy-MM-dd HH:mm");
              }
              that.setData({
                troubleList: data,
                isNull: false
              });
            } else {
              that.setData({
                troubleList: data,
                isNull: true,
                initialText: "这里什么也没有..."
              });
            }
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
    } else {
      wx.request({
        url: app.globalData.localApiUrl + '/trouble/myAll?userId=' + wx.getStorageSync("userInfo").id,
        method: 'GET',
        success(res) {
          console.log(res.data);
          wx.hideNavigationBarLoading() //完成停止加载
          $stopWuxRefresher() //停止下拉刷新
          if (res.data.code == 1) {
            var data = res.data.data;
            if (data != null && data.length != 0) {
              for (let i = 0; i < data.length; i++) {
                data[i].submitTime = new Date(data[i].submitTime).format("yyyy-MM-dd HH:mm");
              }
              that.setData({
                troubleList: data,
                isNull: false
              });
            } else {
              that.setData({
                troubleList: data,
                isNull: true,
                initialText: "这里什么也没有..."
              });
            }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    console.log("onReady")
    var res = wx.getSystemInfoSync();
    that.setData({
      height: "height:" + res.windowHeight + "px"
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  onload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onRefresh() {
    this.onShow();
    wx.showNavigationBarLoading() //在标题栏中显示加载
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