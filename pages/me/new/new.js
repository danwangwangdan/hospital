var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    firTypes: [
      ['网络中心']
    ],
    firTypeValue: '网络中心',
    firTypeIndex: 0,
    secTypes: [
      ['其他问题']
    ],
    secTypeValue: '其他问题',
    secTypeDis: false,
    secTypeIndex: 0,
    status: [
      ['未解决', '已解决']
    ],
    statusValue: '未解决',
    office: "",
    detail: "",
    isDisabled: false,
    isLoading: false,
    buttonText: '登记',
    isShowPicker: false,
    isShowPicker2: false,
    isShowPicker3: false,
    isShowTextarea: ""
  },
  showPicker: function() {
    this.setData({
      isShowPicker: true,
      isShowTextarea: 'none'
    })
  },
  showPicker2: function() {
    this.setData({
      isShowPicker2: true,
      isShowTextarea: 'none'
    })
  },
  showPicker3: function() {
    this.setData({
      isShowPicker3: true,
      isShowTextarea: 'none'
    })
  },
  bindOfficeChange: function(e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      office: value,
    })
  },
  bindDetailValue: function(e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      detail: value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
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
      isShowTextarea: '',
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
      isShowTextarea: '',
      secTypeValue: e.detail.choosedData[0],
      secTypeIndex: JSON.stringify(e.detail.choosedIndexArr)[1]
    });
  },
  statusChange: function(e) {
    this.setData({
      isShowPicker3: false,
      isShowTextarea: '',
      statusValue: e.detail.choosedData[0],
      statusIndex: JSON.stringify(e.detail.choosedIndexArr)[1]
    });
  },
  cancleCallBack3() {
    this.setData({
      isShowPicker3: false,
      isShowTextarea: '',
    })
  },
  cancleCallBack2() {
    this.setData({
      isShowPicker2: false,
      isShowTextarea: '',
    })
  },
  cancleCallBack() {
    this.setData({
      isShowPicker: false,
      isShowTextarea: '',
    })
  },
  //提交表单
  toNew: function(e) {
    var that = this;
    var office = this.data.office;
    var firType = this.data.firTypeValue;
    var secType = this.data.secTypeValue;
    var detail = this.data.detail;
    var status = (this.data.statusValue == '未解决') ? 1 : 3;
    console.log(this.data.statusValue + "," + status)
    //先进行表单非空验证
    if (office == '') {
      wx.showToast({
        title: '所属科室不能为空',
        icon: 'none',
        duration: 3000
      });
    } else {
      that.setData({
        isDisabled: true,
        isLoading: true,
        buttonText: "登记中..."
      })
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
          'troublePersonName': '管理员',
          'office': office,
          'firType': firType,
          'secType': secType,
          'status': status,
          'detail': detail
        },
        success(res) {
          console.log(res.data);
          if (res.data.code == 1) {
            wx.hideLoading();
            // 跳转到提交成功页面
            wx.navigateTo({
              url: '/pages/me/new/new_suc/new_suc'
            });

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
          wx.showToast({
            title: '网络请求失败，请稍后重试！',
            icon: 'none',
            duration: 2000
          })
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onRefresh() {

    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow();

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