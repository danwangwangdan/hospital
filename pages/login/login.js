//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    username: '',
    password: '',
    jsCode: ''
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
  },
  bindGetUserInfo: function(e) {
      
  },
  //事件处理函数
  toLogin: function() {
    var that = this;
    var username = this.data.username;
    var password = this.data.password;
    // 非空检验
    if (username == "" || password == "") {
      wx.showToast({
        title: '账号或密码不能为空',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.login({
        success(res) {
          console.log(res)
          if (res.code) {
            wx.request({
              url: app.globalData.localApiUrl + '/user/login',
              method: 'POST',
              data: {
                "username": username,
                "password": password,
                "jsCode": res.code
              },
              header: {
                'content-type': 'application/json'
              },
              success(res) {
                console.log(res.data);
                if (res.data.code == 1) {
                  // 存储用户信息
                  wx.setStorageSync("userInfo", res.data.data);
                  // 登录成功
                  wx.switchTab({
                    url: '/pages/submit/submit'
                  });
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
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })

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