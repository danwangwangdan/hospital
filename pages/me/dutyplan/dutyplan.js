var app = getApp();
import {
  $stopWuxRefresher
} from '../../../plugins/wux/index'
Page({
  data: {
    notice: "",
    current1: wx.getStorageSync("userInfo").office,
    items: [{
      id: 1,
      name: '是',
    }, {
      id: 2,
      name: '否'
    }],
    isHoliday: '',
    items2: [{
      id: 1,
      name: '是',
    }, {
      id: 2,
      name: '否'
    }],
    isWeekendWork: '',
    items3: [{
        id: 1,
        name: '杨铠华'
      }, {
        id: 2,
        name: '杨庆'
      },
      {
        id: 3,
        name: '文卫东',
      },
      {
        id: 4,
        name: '黄士明',
      },
    ],
    items4: [{
      id: 1,
      name: '屈文'
    }, {
      id: 2,
      name: '曾叙铭'
    },
    {
      id: 3,
      name: '杨仕林',
    },
      {
        id: 4,
        name: '田道君',
      },
    ],
    dutyUser: '',
  },
  bindNoticeChange: function(event) {
    this.setData({
      notice: event.detail.detail.value
    })
  },
  onShow: function(options) {
    var that = this;
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
            notice: data.noticeText
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
    wx.request({
      url: app.globalData.localApiUrl + '/common/getDutyPlan?office=' + wx.getStorageSync("userInfo").office,
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        $stopWuxRefresher() //停止下拉刷新
        if (res.data.code == 1) {
          var data = res.data.data;
          that.setData({
            isHoliday: data.isHoliday,
            isWeekendWork: data.isWeekendWork,
            dutyPerson: data.dutyUser
          });

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
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onRefresh() {
    this.onShow();
    wx.showNavigationBarLoading() //在标题栏中显示加载
  },

  handleChange({
    detail = {}
  }) {
    var that = this;
    that.setData({
      isHoliday: detail.value,
    });
    console.log(detail)
    wx.request({
      url: app.globalData.localApiUrl + '/common/setIsHoliday?isHoliday=' + that.data.isHoliday,
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.code == 1) {
          var data = res.data.data;
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '修改失败，请稍后重试',
            icon: 'none',
            duration: 2000
          });
          that.setData({
            isHoliday: '',
          });
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

  },
  handleChange2({
    detail = {}
  }) {
    var that = this;
    console.log(detail)
    that.setData({
      isWeekendWork: detail.value,
    });
    wx.request({
      url: app.globalData.localApiUrl + '/common/setIsWeekendWork?isWeekendWork=' + that.data.isWeekendWork,
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.code == 1) {
          var data = res.data.data;
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '修改失败，请稍后重试',
            icon: 'none',
            duration: 2000
          });
          that.setData({
            isWeekendWork: '',
          });
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

  },
  handleChange3({
    detail = {}
  }) {
    var that = this;
    console.log(detail)
    that.setData({
      dutyPerson: detail.value,
    });
    wx.request({
      url: app.globalData.localApiUrl + '/common/setDutyPerson?dutyPerson=' + that.data.dutyPerson + '&office=' + wx.getStorageSync("userInfo").office,
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.code == 1) {
          var data = res.data.data;
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '修改失败，请稍后重试',
            icon: 'none',
            duration: 2000
          });
          that.setData({
            dutyPerson: '',
          });
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

  },
  toSave: function() {
    var that = this;
    wx.request({
      url: app.globalData.localApiUrl + '/common/saveNotice?notice=' + that.data.notice,
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.code == 1) {
          var data = res.data.data;
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '保存失败，请稍后重试',
            icon: 'none',
            duration: 2000
          });
         
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
})