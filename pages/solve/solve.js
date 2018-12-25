//获取应用实例
var app = getApp()

Page({
  data: {
    troubleId: 0,
    type: '默认解决方案',
    types: ['默认解决方案', '更换耗材', '第三方解决'],
    typeIndex: "0",
    formIds: [],
    noteMaxLen: 200, //备注最多字数
    content: "",
    noteNowLen: 0, //备注当前字数
  },
  bindTypeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value,
      type: this.data.types[e.detail.value]
    })
  },
  toSolve: function(e) {
    var that = this;
    // // 收集formId
    // let formId = e.detail.formId;
    // console.log("formId:" + formId);
    // that.data.formIds.push(formId);
    
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
        });
        // // 设置定时发送formIds
        // setTimeout(function() {
        //   wx.request({
        //     url: app.globalData.localApiUrl + '/common/collectFormIds',
        //     method: 'POST',
        //     header: {
        //       'content-type': 'application/json'
        //     },
        //     data: {
        //       'formIds': that.data.formIds,
        //       'userId': wx.getStorageSync('userInfo').id
        //     },
        //     success(res) {
        //       console.log(res.data);
        //     }
        //   });
        // }, 100);
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
  //字数改变触发事件
  bindTextAreaChange: function(e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      content: value,
      noteNowLen: len
    })
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