// pages/me/me.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    troubleList: [],
    isNull: true
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
      url: app.globalData.localApiUrl + '/trouble/byStatus?status=2&userId=' + wx.getStorageSync("userInfo").id,
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        if (res.data.code == 1) {
          var data = res.data.data;
          for (let i = 0; i < data.length; i++) {
      
            data[i].submitTime = new Date(data[i].submitTime).format("yyyy-MM-dd HH:mm");
          }
          if (data.length != 0) {
            that.setData({
              troubleList: data,
              isNull: false
            });
          }
        }
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
  onPullDownRefresh: function () {
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