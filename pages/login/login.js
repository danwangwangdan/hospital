//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    username: '',
    password: ''
  },
  // bindUsernameChange: function (event) {
  //   this.setData({
  //     username: event.value
  //   })
  // },
  bindPasswordChange: function(event) {
    this.setData({
      password: event.detail.detail.value
    })
  },
  bindUsernameChange: function(event) {
    this.setData({
      username: event.detail.detail.value
    });
    // console.log(event)
  },
  //事件处理函数
  toLogin: function() {
    var username = this.data.username;
    var password = this.data.password;
    console.log(username + password);
    // 非空检验
    if (username == "" || password == "") {
      wx.showToast({
        title: '账号或密码不能为空',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.request({
        url: app.globalData.localApiUrl + '/user/login',
        method: 'POST',
        data: {
          "username": username,
          "password": password
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res.data);
          if (res.data.code == 1) {
            // 登录成功
            wx.switchTab({
              url: '/pages/submit/submit'
            });
            // 存储用户信息
              wx.setStorage({
                  key: "userInfo",
                  data: res.data.data
              })
            app.globalData.userInfo = res.data.data;
          } else {
            // 登录失败
            wx.showToast({
              title: '登录失败，账号或密码错误',
              icon: 'none',
              duration: 2000
            })
          }
        }
      });
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})