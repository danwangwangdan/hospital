//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
      username: '',
      password: ''
  },
    //事件处理函数
    toLogin: function () {
        wx.request({
            url: app.globalData.localApiUrl + '/user/login',
            data: {
                "username": this.data.username,
                "password": this.data.password
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log(res.data);
        wx.switchTab({
            url: '/pages/submit/submit'
        });

            }
        });

    },
    getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})