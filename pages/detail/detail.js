//获取应用实例
const app = getApp();
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
    onLoad: function (options) {
        var troubleId = 1;
        this.setData({
            troubleId: troubleId
        });
        wx.request({
            url: app.globalData.localApiUrl + '/trouble/detail?troubleId=' + troubleId,
            method: 'GET',
            success(res) {
                console.log(res.data);
                if (res.data.code == 1) {
                    var trouble = res.data.data;
                    this.setData({
                        troubleOwner: trouble.troublePersonName,
                        submitTime: trouble.submitTime,
                        office: trouble.office,
                        firType: trouble.firType,
                        secType: trouble.secType,
                        detail: trouble.detail,
                        captureUrl: trouble.captureUrls
                    })
                    if (trouble.status == 1) {
                        this.setData({
                            isCommitted: 'process',
                            isSolved: "",
                            isConfirmed: ""
                        });
                    } else if (trouble.status == 2) {
                        this.setData({
                            isSolved: "",
                            isConfirmed: 'process',
                            isCommitted: '',
                        });
                    } else {
                        this.setData({
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