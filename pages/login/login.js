//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    username: '',
    password: '',
    jsCode: '',
    loginText: "登录",
    isLoading: false,
    isDisabled: false
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
      that.setData({
        isDisabled: true,
        isLoading: true,
        loginText: "登录中..."
      })
      wx.request({
        url: app.globalData.localApiUrl + '/user/login',
        method: 'POST',
        data: {
          "username": username,
          "password": password,
          "jsCode": ''
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res.data);
          if (res.data.code == 1) {
            // 存储用户信息
            wx.setStorageSync("userInfo", res.data.data);
            console.log("登录成功，开始获取微信信息")
            wx.login({
              success(res) {
                console.log(res)
                if (res.code) {
                  // 登录成功，发送jsCode
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
                      wx.switchTab({
                        url: '/pages/submit/submit'
                      });
                    }
                  })
                } else {
                  console.log('登录失败！' + res.errMsg)
                }
              }
            })
          } else {
            // 登录失败
            wx.showToast({
              title: '登录失败，账号或密码错误',
              icon: 'none',
              duration: 2000
            });
            that.setData({
              isDisabled: false,
              isLoading: false,
              loginText: "登录"
            })
          }
        },
        fail() {
          wx.showToast({
            title: '网络请求失败，请稍后重试！',
            icon: 'none',
            duration: 2000
          })
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