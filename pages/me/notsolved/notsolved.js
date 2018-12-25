
var app = getApp();
import { $stopWuxRefresher } from '../../../plugins/wux/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    troubleList: [],
    isNull: true,
    initialText: "加载中..."
  },
  toDetail: function(e) {
    let troubleId = e.currentTarget.dataset.id;
    console.log("跳转到：" + troubleId);
    wx.navigateTo({
      url: '/pages/detail/detail?troubleId=' + troubleId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    var that = this;
    wx.request({
      url: app.globalData.localApiUrl + '/trouble/byStatus?status=5&userId=' + wx.getStorageSync("userInfo").id,
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideNavigationBarLoading() //完成停止加载
        $stopWuxRefresher()//停止下拉刷新
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
  onRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow();
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