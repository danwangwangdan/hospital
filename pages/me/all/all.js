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
  onLoad: function(options) {
    var that = this;
    var isAdmin = wx.getStorageSync('userInfo').isAdmin;
    if(isAdmin==1){
      wx.request({
        url: app.globalData.localApiUrl + '/trouble/all',
        method: 'GET',
        success(res) {
          console.log(res.data);
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
    }else{
    wx.request({
      url: app.globalData.localApiUrl + '/trouble/myAll?userId='+wx.getStorageSync("userInfo").id,
      method: 'GET',
      success(res) {
        console.log(res.data);
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
    }
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