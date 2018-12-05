// pages/me/me.js
var app = getApp();
function formatDate(timeStampValue) {
  var now = new Date(timeStampValue);
  var year = now.getFullYear;
  var returnString = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes();
  return returnString;
};
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
    wx.request({
      url: app.globalData.localApiUrl + '/trouble/myAll?userId='+wx.getStorageSync("userInfo").id,
      method: 'GET',
      success(res) {
        console.log(res.data);
        if (res.data.code == 1) {
          var data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            console.log(data[i].submitTime);
            data[i].submitTime = formatDate(data[i].submitTime);
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