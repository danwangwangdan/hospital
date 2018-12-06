//获取应用实例
const app = getApp();

function formatDate(timeStampValue) {
  var now = new Date(timeStampValue);
  var year = now.getFullYear;
  var returnString = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes();
  return returnString;
};
Page({
  data: {
    troubleId: 0,
    isCommitted: "",
    isConfirmed: "process",
    isSolved: "",
    isCommitContent: false,
    commitContent: "请耐心等待技术人员确认",
    isConfirmContent: false,
    confirmContent: "",
    isSolveContent: false,
    isRevokeShow: false,
    isPicTextShow: true,
    solveContent: "",
    captureUrl: "",
    captureUrls: [],
    detail: "",
    troubleType: "",
    office: "",
    submitTime: "",
    troubleOwner: ""
  },
  onShow: function() {
    var that = this;
    wx.request({
      url: app.globalData.localApiUrl + '/trouble/detail?troubleId=' + that.data.troubleId,
      method: 'GET',
      success(res) {
        console.log(res.data);
        if (res.data.code == 1) {
          var trouble = res.data.data;
          that.data.captureUrls.push(trouble.captureUrls);
          that.setData({
            troubleOwner: trouble.troublePersonName,
            submitTime: formatDate(trouble.submitTime),
            office: trouble.office,
            troubleType: trouble.secType == '其他问题' ? trouble.secType : trouble.firType + "-" + trouble.secType,
            detail: trouble.detail,
            captureUrl: trouble.captureUrls
          })
          if (trouble.captureUrls == "") {
            that.setData({
              isPicTextShow: false
            });
          }
          if (trouble.detail == "") {
            that.setData({
              detail: "无"
            });
          }
          if (trouble.status == 1) { // 已提交
            that.setData({
              isRevokeShow: true,
              isCommitted: 'process',
              isSolved: "",
              isConfirmed: "",
              isCommitContent: true
            });
          } else if (trouble.status == 2) { // 已确认
            that.setData({
              isRevokeShow: false,
              isSolved: "",
              isConfirmed: 'process',
              isCommitted: '',
              isConfirmContent: true,
              confirmContent: trouble.confirmer + " 于" + formatDate(trouble.confirmTime) + "确认"
            });
          } else if (trouble.status == 3) { // 已完成
            that.setData({
              isRevokeShow: false,
              isConfirmed: "",
              isCommitted: '',
              isSolved: 'process',
              isSolveContent: true,
              solveContent: trouble.solver + " 于" + formatDate(trouble.solveTime) + "解决"
            });
          } else { // 已撤回
            that.setData({
              isRevokeShow: false,
              isConfirmed: "",
              isCommitted: '',
              isSolved: 'process',
              isSolveContent: true,
              solveContent: trouble.solver + " 于" + formatDate(trouble.solveTime) + "撤回"
            });
          }

        }
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
  previewImage: function() {

    wx.previewImage({
      current: this.data.captureUrl, // 当前显示图片的http链接
      urls: this.data.captureUrls // 需要预览的图片http链接列表
    })
  },
  toRevoke: function() {
    var that = this;
    wx.showModal({
      title: '你确定撤回该故障吗？',
      content: '撤回将不再有技术员受理',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.request({
            url: app.globalData.localApiUrl + '/trouble/revoke',
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            data: {
              'troubleId': that.data.troubleId,
              'solverId': wx.getStorageSync("userInfo").id,
              'solver': wx.getStorageSync("userInfo").nickname
            },
            success(res) {
              console.log(res.data);
              if (res.data.code == 1) {
                // 撤回成功
                wx.showToast({
                  title: '撤回成功',
                  icon: 'none',
                  duration: 2000
                });
                that.onShow();
                var troubleId = options.troubleId;
                that.setData({
                  troubleId: troubleId
                });
                // var data = res.data.data;
                // var firTypes = new Array();
                // for (var i in data) {
                //   firTypes.push(data[i].typeName);
                // }
                // console.log(firTypes);
                // that.setData({
                //   firTypes: firTypes,
                // })
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  }

})