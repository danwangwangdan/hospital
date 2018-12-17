//获取应用实例
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    clickCount: 0, //button点击次数
    currentTab: 'tab1',
    isAdmin: 0,
    troubleList: [],
    isNull: true,
    submitCount: 0,
    confirCount: 0,
    initialText: "加载中...",
    isLogin: true,
    lastSubmitTime: new Date(),
    formIds: [],
    username: "",
    office: "",
    imageUrl: "",
    noteMaxLen: 200, //备注最多字数
    content: "",
    noteNowLen: 0, //备注当前字数
    firTypes: ['其他问题'],
    firTypeValue: '其他问题',
    firTypeIndex: 0,
    secTypes: ['其他问题'],
    secTypeValue: '其他问题',
    secTypeDis: false,
    secTypeIndex: 0,
    src: "",
    uploadSrc: "",
    srcArray: [],
    isAllOther: true, //是否选择了 其他类型的故障
    isSrc: false,
    ishide: "0",
    autoFocus: true,
    isLoading: false,
    loading: true,
    isdisabled: false
  },
  handleChange({
    detail
  }) {
    var that = this;
    this.setData({
      currentTab: detail.key,
      troubleList: [],
      isNull: true
    });
    console.log("切换至" + detail.key);
    if (detail.key == 'tab1') { //待确认
      wx.request({
        url: app.globalData.localApiUrl + '/trouble/submitted',
        method: 'GET',
        success(res) {
          console.log(res.data);
          if (res.data.code == 1) {
            var data = res.data.data;
            for (let i = 0; i < data.length; i++) {
              data[i].submitTime = new Date(data[i].submitTime).format("yyyy-MM-dd HH:mm");
            }
            if (data.length != 0) {
              that.setData({
                troubleList: data,
                isNull: false,
                submitCount: data.length,
                confirmCount: 0
              });
            } else {
              that.setData({
                troubleList: data,
                isNull: true,
                initialText: "这里什么也没有...",
                submitCount: 0,
                confirmCount: 0
              });
            }
          }
        }
      });
    } else {
      wx.request({
        url: app.globalData.localApiUrl + '/trouble/confirmed',
        method: 'GET',
        success(res) {
          console.log(res.data);
          if (res.data.code == 1) {
            var data = res.data.data;
            for (let i = 0; i < data.length; i++) {
              data[i].submitTime = new Date(data[i].submitTime).format("yyyy-MM-dd HH:mm");
            }
            if (data.length != 0) {
              that.setData({
                troubleList: data,
                isNull: false,
                submitCount: 0,
                confirmCount: data.length
              });
            } else {
              that.setData({
                troubleList: data,
                isNull: true,
                initialText: "这里什么也没有...",
                submitCount: 0,
                confirmCount: 0
              });
            }
          }
        }
      });
    }
  },
  onLoad: function(options) {
    var that = this;
    // 判断是否登录
    wx.checkSession({
      fail() {
        that.setData({
          isLogin: false
        });
      },
    });
    if (wx.getStorageSync("userInfo") == undefined || wx.getStorageSync("userInfo") == "") {
      that.setData({
        isLogin: false
      })
    }
    if (!that.data.isLogin) {
      wx.reLaunch({
        url: '/pages/login/login'
      })
    } else {
      that.setData({ //初始化数据
        username: wx.getStorageSync("userInfo").nickname,
        office: wx.getStorageSync("userInfo").office,
        isAdmin: wx.getStorageSync("userInfo").isAdmin,
      })
      // 分用户和管理员两种情况
      if (that.data.isAdmin == 1) {
        wx.request({
          url: app.globalData.localApiUrl + '/trouble/submitted',
          method: 'GET',
          success(res) {
            console.log(res.data);
            if (res.data.code == 1) {
              var data = res.data.data;
              for (let i = 0; i < data.length; i++) {
                data[i].submitTime = new Date(data[i].submitTime).format("yyyy-MM-dd HH:mm");
              }
              if (data.length != 0) {
                that.setData({
                  troubleList: data,
                  isNull: false,
                  submitCount: data.length,
                  confirmCount: 0
                });
              } else {
                that.setData({
                  troubleList: data,
                  isNull: true,
                  initialText: "这里什么也没有...",
                  submitCount: 0,
                  confirmCount: 0
                });
              }
            }
          }
        });
      } else {
        //获取一级类型
        wx.request({
          url: app.globalData.localApiUrl + '/common/firTypes',
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            console.log(res.data);
            if (res.data.code == 1) {
              var data = res.data.data;
              var firTypes = new Array();
              for (var i in data) {
                firTypes.push(data[i].typeName);
              }
              console.log(firTypes);
              that.setData({
                firTypes: firTypes,
              })
            }
          }
        });
      };
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                console.log(res.userInfo.avatarUrl)
                wx.setStorageSync("imgSrc", res.userInfo.avatarUrl);
              }
            })
          }
        }
      });
    }
  },
  onShow: function() {

  },

  toDetail: function(e) {
    let troubleId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?troubleId=' + troubleId
    });
  },
  submitSuc: function() {
    wx.navigateTo({
      url: '/pages/home/submit_suc/submit_suc'
    })
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
  bindUserChange: function(e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      username: value,
    })
  },
  bindOfficeChange: function(e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      office: value,
    })
  },

  //改变故障类别
  firTypeChange: function(e) {
    var that = this;
    console.log(e.detail.value + "," + this.data.firTypes[e.detail.value]);
    this.setData({
      firTypeIndex: e.detail.value,
      firTypeValue: this.data.firTypes[e.detail.value]
    });
    if (this.data.firTypes[e.detail.value] != '其他问题') {
      this.setData({
        isAllOther: false
      });
    }
    //获取二级类型
    wx.request({
      url: app.globalData.localApiUrl + '/common/secTypes?firTypeId=' + this.data.firTypeIndex,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data);
        if (res.data.code == 1) {
          var data = res.data.data;
          var secTypes = new Array();
          for (var i in data) {
            secTypes.push(data[i].typeName);
          }
          console.log(secTypes);
          that.setData({
            secTypes: secTypes,
            secTypeValue: secTypes[0]
          })
        }
      }
    });

  },
  secTypeChange: function(e) {
    this.setData({
      secTypeIndex: e.detail.value,
      secTypeValue: this.data.secTypes[e.detail.value]
    })
  },

  //上传活动图片
  uploadPic: function() { //选择图标
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], //压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          isSrc: true,
          src: tempFilePaths[0]
        });
        upload(that, tempFilePaths);
      },
    })
  },
  //预览图片
  previewImage: function() {
    wx.previewImage({
      current: this.data.src, // 当前显示图片的http链接
      urls: this.data.srcArray // 需要预览的图片http链接列表
    })
  },

  //删除图片
  clearPic: function() { //删除图片
    this.setData({
      isSrc: false,
      src: "",
      uploadSrc: ""
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      isNull: true,
      submitCount: 0,
      confirCount: 0,
      initialText: "加载中...",
      troubleList: []
    });
    if (that.data.currentTab == 'tab1') { //待确认
      wx.request({
        url: app.globalData.localApiUrl + '/trouble/submitted',
        method: 'GET',
        success(res) {
          console.log(res.data);
          if (res.data.code == 1) {
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
            var data = res.data.data;
            for (let i = 0; i < data.length; i++) {
              data[i].submitTime = new Date(data[i].submitTime).format("yyyy-MM-dd HH:mm");
            }
            if (data.length != 0) {
              that.setData({
                troubleList: data,
                isNull: false,
                submitCount: data.length,
                confirmCount: 0
              });
            } else {
              that.setData({
                troubleList: data,
                isNull: true,
                initialText: "这里什么也没有...",
                submitCount: 0,
                confirmCount: 0
              });
            }
          }
        }
      });
    } else {
      wx.request({
        url: app.globalData.localApiUrl + '/trouble/confirmed',
        method: 'GET',
        success(res) {
          console.log(res.data);
          if (res.data.code == 1) {
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
            var data = res.data.data;
            for (let i = 0; i < data.length; i++) {
              data[i].submitTime = new Date(data[i].submitTime).format("yyyy-MM-dd HH:mm");
            }
            if (data.length != 0) {
              that.setData({
                troubleList: data,
                isNull: false,
                submitCount: 0,
                confirmCount: data.length
              });
            } else {
              that.setData({
                troubleList: data,
                isNull: true,
                initialText: "这里什么也没有...",
                submitCount: 0,
                confirmCount: 0
              });
            }
          }
        }
      });
    }
  },

  //表单验证
  showTopTips: function() {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  //提交表单
  submitTrouble: function(e) {
    var that = this;
    // 收集formId
    let formId = e.detail.formId;

    this.data.formIds.push(formId);
    console.log("clickCount:" + that.data.clickCount);
    if (that.data.clickCount > 0) {
      return;
    }
    var troubleOwner = this.data.username;
    var office = this.data.office;
    var content = this.data.content;
    var firType = this.data.firTypeValue;
    var secType = this.data.secTypeValue;
    var captureUrls = this.data.uploadSrc;
    //先进行表单非空验证
    var isBlankContent = true;
    if (content != "" || captureUrls != "") {
      isBlankContent = false;

    }
    if (troubleOwner == "") {
      wx.showToast({
        title: '故障人不能为空',
        icon: 'none',
        duration: 3000
      });
    } else if (office == '') {
      wx.showToast({
        title: '所属科室不能为空',
        icon: 'none',
        duration: 3000
      });
    } else if (that.data.isAllOther && isBlankContent) {
      wx.showToast({
        title: '选择其他问题时必须输入问题详细信息或上传截图',
        icon: 'none',
        duration: 3000
      });
    } else {
      that.data.clickCount++;
      console.log("clickCount2:" + that.data.clickCount);
      wx.request({
        url: app.globalData.localApiUrl + '/trouble/submit',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          'userId': wx.getStorageSync('userInfo').id,
          'troublePersonName': troubleOwner,
          'office': office,
          'detail': content,
          'firType': firType,
          'secType': secType,
          'captureUrls': captureUrls
        },
        success(res) {
          console.log(res.data);
          if (res.data.code == 1) {
            console.log("提交成功，id为：" + res.data.data.id);
            // 跳转到提交成功页面
            wx.navigateTo({
              url: '/pages/home/submit_suc/submit_suc?troubleId=' + res.data.data.id
            });
            wx.login({
              success(res) {
                if (res.code) {
                  // 登录成功，发送jsCode
                  wx.request({
                    url: app.globalData.localApiUrl + '/user/login',
                    method: 'POST',
                    data: {
                      "username": wx.getStorageSync('userInfo').username,
                      "password": wx.getStorageSync('userInfo').password,
                      "jsCode": res.code
                    },
                    header: {
                      'content-type': 'application/json'
                    },
                    success(res) {

                    }
                  })
                }
              }
            });
            // 设置定时发送formIds
            setTimeout(function() {
              wx.request({
                url: app.globalData.localApiUrl + '/common/collectFormIds',
                method: 'POST',
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  'formIds': that.data.formIds,
                  'userId': wx.getStorageSync('userInfo').id
                },
                success(res) {
                  console.log(res.data);
                }
              });
              that.setData({
                clickCount: 0
              })
            }, 500);
          } else {
            // 提交失败
            wx.showToast({
              title: '提交失败，请稍后重试',
              icon: 'none',
              duration: 2000
            })
          }
        }
      });
    }

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

function upload(page, path) {
  // 成功后直接上传
  wx.uploadFile({
    url: app.globalData.localApiUrl + '/common/uploadPic',
    filePath: path[0],
    name: 'file',
    header: {
      "Content-Type": "multipart/form-data"
    },
    // formData: {
    //   //和服务器约定的token, 一般也可以放在header中
    //   'session_token': wx.getStorageSync('session_token')
    // },
    success: function(res) {
      console.log(res.data)
      var imageList = JSON.parse(res.data);
      console.log(imageList.data);
      console.log(imageList.data[0].url);
      if (res.statusCode != 200) {
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
        return;
      }
      // 设置待上传至后台的图片url
      page.setData({
        uploadSrc: imageList.data[0].url,
        srcArray: path
      })
    },

  })
}