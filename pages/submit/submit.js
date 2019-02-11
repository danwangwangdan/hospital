//获取应用实例
var app = getApp()
import {
  $stopWuxRefresher
} from '../../plugins/wux/index'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    clickCount: 0, //提交button点击次数
    currentTab: 'tab1',
    isAdmin: 0,
    troubleList: [],
    isNull: true,
    submitCount: 0,
    confirCount: 0,
    initialText: "加载中...",
    isLogin: true,
    place: "0",
    lastSubmitTime: new Date(),
    formIds: [],

    noticeText: "",
    isLoop: false,
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
    isdisabled: false,

    isShowPicker: false,
    isShowPicker2: false,
  },
  showPicker: function() {
    this.setData({
      isShowPicker: true
    })
  },
  showPicker2: function() {
    this.setData({
      isShowPicker2: true
    })
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
      that.setData({
        confirmCount: 0
      });
      wx.request({
        url: app.globalData.localApiUrl + '/trouble/submitted',
        method: 'GET',
        success(res) {
          console.log(res.data);
          if (res.data.code == 1) {
            var data = res.data.data;
            if (data != null && data.length != 0) {
              for (let i = 0; i < data.length; i++) {
                data[i].submitTime = new Date(data[i].submitTime).format("yyyy-MM-dd HH:mm");
              }
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
        },
        fail() {
          $stopWuxRefresher() //停止下拉刷新
          wx.showToast({
            title: '网络请求失败，请稍后重试！',
            icon: 'none',
            duration: 2000
          })
        }
      });
    } else {
      that.setData({
        submitCount: 0
      });
      wx.request({
        url: app.globalData.localApiUrl + '/trouble/confirmed',
        method: 'GET',
        success(res) {
          console.log(res.data);
          if (res.data.code == 1) {
            var data = res.data.data;
            if (data != null && data.length != 0) {
              for (let i = 0; i < data.length; i++) {
                data[i].submitTime = new Date(data[i].submitTime).format("yyyy-MM-dd HH:mm");
              }
              that.setData({
                troubleList: data,
                isNull: false,
                confirmCount: data.length,
                submitCount: 0
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
        },
        fail() {
          $stopWuxRefresher() //停止下拉刷新
          wx.showToast({
            title: '网络请求失败，请稍后重试！',
            icon: 'none',
            duration: 2000
          })
        }
      });
    }
  },
  onLoad: function(options) {
    var that = this;
    var startLoad = new Date();
    wx.showLoading({
      title: "请求中...",
      mask: true
    });
    //获取公告
    wx.request({
      url: app.globalData.localApiUrl + '/common/notice',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data);
        if (res.data.code == 1) {
          var data = res.data.data;
          console.log(data);
          that.setData({
            noticeText: data.noticeText
          })
        }
      },
      fail() {
        $stopWuxRefresher() //停止下拉刷新
        wx.showToast({
          title: '网络请求失败，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    });
    // 判断是否登录
    wx.checkSession({
      fail() {
        that.setData({
          isLogin: false
        });
      },
    });
    var checkSession = new Date();
    if (wx.getStorageSync("userInfo") == undefined || wx.getStorageSync("userInfo") == "") {
      that.setData({
        isLogin: false
      })
    }
    if (!that.data.isLogin) {
      wx.hideLoading();
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
        var startRquest = new Date();
        wx.request({
          url: app.globalData.localApiUrl + '/trouble/submitted',
          method: 'GET',
          success(res) {
            console.log(res.data);
            wx.hideLoading();
            if (res.data.code == 1) {
              var data = res.data.data;
              var endLoad = new Date();
              console.log('加载耗时：总' + (endLoad - startLoad) + 'ms，checkSession:' + (checkSession - startLoad) + 'ms，request:' + (endLoad - startRquest) + 'ms');
              if (data != null && data.length != 0) {
                for (let i = 0; i < data.length; i++) {
                  data[i].submitTime = new Date(data[i].submitTime).format("yyyy-MM-dd HH:mm");
                }
                that.setData({
                  troubleList: data,
                  isNull: false,
                  submitCount: data.length,
                  confirmCount: 0
                });
              } else {
                console.log("这里什么也没有")
                that.setData({
                  troubleList: data,
                  isNull: true,
                  initialText: "这里什么也没有...",
                  submitCount: 0,
                  confirmCount: 0
                });
              }
            }
          },
          fail() {
            $stopWuxRefresher() //停止下拉刷新
            wx.showToast({
              title: '网络请求失败，请稍后重试！',
              icon: 'none',
              duration: 2000
            })
          }
        });
      } else {
        var startRquest = new Date();
        //获取一级类型
        wx.request({
          url: app.globalData.localApiUrl + '/common/firTypes',
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            console.log(res.data);
            wx.hideLoading();
            if (res.data.code == 1) {
              var data = res.data.data;
              var firTypes = new Array();
              for (var i in data) {
                firTypes.push(data[i].typeName);
              }
              console.log(firTypes);
              that.setData({
                firTypes: [firTypes],
              })
            }
          },
          fail() {
            $stopWuxRefresher() //停止下拉刷新
            wx.showToast({
              title: '网络请求失败，请稍后重试！',
              icon: 'none',
              duration: 2000
            })
          }
        });
      }
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
  cancleCallBack2() {
    this.setData({
      isShowPicker2: false,
    })
  },
  cancleCallBack() {
    this.setData({
      isShowPicker: false,
    })
  },
  //改变故障类别
  firTypeChange: function(e) {
    var that = this;
    wx.showLoading({
      title: "请求中...",
      mask: true
    });
    this.setData({
      isShowPicker: false,
      firTypeValue: e.detail.choosedData[0],
      firTypeIndex: JSON.stringify(e.detail.choosedIndexArr)[1]
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
        wx.hideLoading();
        if (res.data.code == 1) {
          var data = res.data.data;
          var secTypes = new Array();
          for (var i in data) {
            secTypes.push(data[i].typeName);
          }
          console.log(secTypes);
          that.setData({
            secTypes: [secTypes],
            secTypeValue: secTypes[0]
          })
        }
      },
      fail() {
        $stopWuxRefresher() //停止下拉刷新
        wx.showToast({
          title: '网络请求失败，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    });

  },
  secTypeChange: function(e) {
    this.setData({
      isShowPicker2: false,
      secTypeValue: e.detail.choosedData[0],
      secTypeIndex: JSON.stringify(e.detail.choosedIndexArr)[1]
    });
  },

  //上传活动图片
  uploadPic: function() { //选择图标
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], //压缩图
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
  onRefresh() {
    console.log("onRefresh")
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
            $stopWuxRefresher() //停止下拉刷新
            var data = res.data.data;
            if (data != null && data.length != 0) {
              for (let i = 0; i < data.length; i++) {
                data[i].submitTime = new Date(data[i].submitTime).format("yyyy-MM-dd HH:mm");
              }
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
        },
        fail() {
          $stopWuxRefresher() //停止下拉刷新
          wx.showToast({
            title: '网络请求失败，请稍后重试！',
            icon: 'none',
            duration: 2000
          })
        }
      });
    } else {
      wx.request({
        url: app.globalData.localApiUrl + '/trouble/confirmed',
        method: 'GET',
        success(res) {
          console.log(res.data);
          if (res.data.code == 1) {
            $stopWuxRefresher() //停止下拉刷新
            var data = res.data.data;
            if (data != null && data.length != 0) {
              for (let i = 0; i < data.length; i++) {
                data[i].submitTime = new Date(data[i].submitTime).format("yyyy-MM-dd HH:mm");
              }
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
        },
        fail() {
          $stopWuxRefresher() //停止下拉刷新
          wx.showToast({
            title: '网络请求失败，请稍后重试！',
            icon: 'none',
            duration: 2000
          })
        }
      });
    }
  },

  //提交表单
  submitTrouble: function(e) {
    var that = this;
    // 收集formId
    let formId = e.detail.formId;
    this.data.formIds.push(formId);
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
      wx.showLoading({
        title: "提交中...",
        mask: true
      });
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
            wx.hideLoading();
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

                    },
                    fail() {
                      $stopWuxRefresher() //停止下拉刷新
                      wx.showToast({
                        title: '网络请求失败，请稍后重试！',
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  })
                }
              }
            });
            // 设置定时发送formIds
            setTimeout(function() {
              console.log("formIds:" + that.data.formIds);
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
                },
                fail() {
                  $stopWuxRefresher() //停止下拉刷新
                  wx.showToast({
                    title: '网络请求失败，请稍后重试！',
                    icon: 'none',
                    duration: 2000
                  })
                }
              });
              that.setData({
                clickCount: 0
              })
            }, 100);
          } else {
            // 提交失败
            wx.showToast({
              title: '提交失败，请稍后重试',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail() {
          $stopWuxRefresher() //停止下拉刷新
          wx.showToast({
            title: '网络请求失败，请稍后重试！',
            icon: 'none',
            duration: 2000
          })
        }
      });
    }

  },

  onReady: function() {
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
  wx.showLoading({
    title: "图片上传中...",
    mask: true
  });
  wx.uploadFile({
    url: app.globalData.localApiUrl + '/common/uploadPic',
    filePath: path[0],
    name: 'file',
    header: {
      "Content-Type": "multipart/form-data"
    },
    success: function(res) {
      console.log(res.data)
      var imageList = JSON.parse(res.data);
      console.log(imageList.data);
      console.log(imageList.data[0].url);
      if (res.statusCode != 200) {
        wx.showModal({
          title: '提示',
          content: '上传失败，请稍后再试',
          showCancel: false
        })
        return;
      }
      wx.hideLoading();
      wx.showToast({
        title: '图片上传成功',
        icon: 'none',
        duration: 1500
      });
      // 设置待上传至后台的图片url
      page.setData({
        uploadSrc: imageList.data[0].url,
        srcArray: path
      })
    },
    fail() {
      $stopWuxRefresher() //停止下拉刷新
      wx.showToast({
        title: '网络请求失败，请稍后重试！',
        icon: 'none',
        duration: 2000
      })
    }

  })
}