//获取应用实例
var app = getApp()

Page({
  data: {
    troubleId: 0,
    type: '默认解决方案',
    types: ['默认解决方案', '更换耗材', '第三方解决'],
    typeIndex: "0",
    noteMaxLen: 200, //备注最多字数
    content: "",
    noteNowLen: 0, //备注当前字数
  },
  toSolve: function() {
    var that = this;
    wx.request({
      url: app.globalData.localApiUrl + '/trouble/solve',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'troubleId': that.data.troubleId,
        'solverId': wx.getStorageSync("userInfo").id,
        'solver': wx.getStorageSync("userInfo").nickname,
        'solutionType': that.data.typeIndex,
        'solutionDetail': that.data.type,
        'solutionComment': that.data.content
      },
      success(res) {
        console.log(res.data);
        wx.navigateTo({
          url: '/pages/solve_suc/solve_suc?troubleId=' + that.data.troubleId
        })
      }
    });

  },
  onLoad: function(options) {
    var that = this;
    if (that.data.troubleId == 0) {
      var troubleId = options.troubleId;
      that.setData({
        troubleId: troubleId
      });
    }
  },
})