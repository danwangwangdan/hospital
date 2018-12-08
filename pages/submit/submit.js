//获取应用实例
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: true,
    showTopTips: false,
    TopTips: '',
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
    srcArray: [],
    isAllOther: true, //是否选择了 其他类型的故障
    isSrc: false,
    ishide: "0",
    autoFocus: true,
    isLoading: false,
    loading: true,
    isdisabled: false
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("onLoad加载，" + JSON.stringify(wx.getStorageSync("userInfo")));
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
    }else {
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
      that.setData({ //初始化数据
        username: wx.getStorageSync("userInfo").nickname,
        office: wx.getStorageSync("userInfo").office
      })
    }
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo.avatarUrl)
              wx.setStorageSync("imgSrc", res.userInfo.avatarUrl);
            }
          })
        }
      }
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
          isSrc: true
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
    that.setData({
      isSrc: false,
      src: ""
    })
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
    var troubleOwner = this.data.username;
    var office = this.data.office;
    var content = this.data.content;
    var firType = this.data.firTypeValue;
    var secType = this.data.secTypeValue;
    var captureUrls = this.data.src;
    //先进行表单非空验证
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
    } else if (that.data.isAllOther && content == "") {
      wx.showToast({
        title: '选择其他问题时必须输入问题详细信息',
        icon: 'none',
        duration: 3000
      });
    } else {
      wx.request({
        url: app.globalData.localApiUrl + '/trouble/submit',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          'userId': 1,
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
            })
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
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 1000);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

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
        src: imageList.data[0].url,
        srcArray: path
      })
    },
  })
}