//获取应用实例
const app = getApp();
function formatDate(timeStampValue) {
  var now = new Date(timeStampValue);
  return now.toLocaleString(); 
};
Page({
  data: {
    troubleId: 0,
    isCommitted: "",
    isConfirmed: "process",
    isSolved: "",
    captureUrl: "",
    detail: "",
    secType: "",
    firType: "",
    office: "",
    submitTime: "",
    troubleOwner: ""
  },
  onLoad: function(options) {
    var that = this;
    var troubleId = 1;
    that.setData({
      troubleId: troubleId
    });
    wx.request({
      url: app.globalData.localApiUrl + '/trouble/detail?troubleId=' + troubleId,
      method: 'GET',
      success(res) {
        console.log(res.data);
        if (res.data.code == 1) {
          var trouble = res.data.data;
          that.setData({
            troubleOwner: trouble.troublePersonName,
            submitTime: formatDate(trouble.submitTime),
            office: trouble.office,
            firType: trouble.firType,
            secType: trouble.secType,
            detail: trouble.detail,
            captureUrl: trouble.captureUrls
          })
          if (trouble.status == 1) {
            that.setData({
              isCommitted: 'process',
              isSolved: "",
              isConfirmed: ""
            });
          } else if (trouble.status == 2) {
            that.setData({
              isSolved: "",
              isConfirmed: 'process',
              isCommitted: '',
            });
          } else {
            that.setData({
              isConfirmed: "",
              isCommitted: '',
              isSolved: 'process'
            });
          }

        }
      }
    });
  },

})