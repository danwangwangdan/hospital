//获取应用实例
const app = getApp();
import {
  $stopWuxRefresher
} from '../../plugins/wux/index'

Page({
  data: {
    clickCount: 0, //确认button点击次数
    height: '',
    troubleId: 0,
    isCommitted: "",
    isConfirmed: "process",
    isSolved: "",
    isCommitContent: false,
    formIds: [],
    commitContent: "请耐心等待技术人员确认",
    isConfirmContent: false,
    confirmContent: "",
    isSolveContent: false,
    isRevokeShow: false,
    isConfirmShow: false,
    isSolveShow: false,
    isPicTextShow: true,
    isCommentShow: false,
    isActiveShow: false,
    isHomeShow: true,
    confirmPressContent: 0,
    solveContent: "",
    captureUrl: "",
    captureUrls: [],
    detail: "",
    troubleType: "",
    office: "",
    mobile: "",
    comment: "",
    submitTime: "",
    troubleOwner: ""
  },
  onShow: function() {
    var that = this;
    var isAdmin = wx.getStorageSync("userInfo").isAdmin;
    wx.showLoading({
      title: "请求中...",
      mask: true
    });
    wx.request({
      url: app.globalData.localApiUrl + '/trouble/detail?troubleId=' + that.data.troubleId,
      method: 'GET',
      success(res) {
        wx.hideNavigationBarLoading(); //完成停止加载
        $stopWuxRefresher() //停止下拉刷新
        console.log(res.data);
        wx.hideLoading();
        if (res.data.code == 1) {
          var trouble = res.data.data;

          that.setData({
            troubleOwner: trouble.troublePersonName,
            submitTime: new Date(trouble.submitTime).format("yyyy-MM-dd HH:mm"),
            office: trouble.office,
            troubleType: trouble.secType == '其他问题' ? trouble.secType : trouble.firType + "-" + trouble.secType,
            detail: trouble.detail,
            mobile: trouble.mobile,
            comment: trouble.solutionComment
          })

          if (trouble.captureUrls == "") {
            that.setData({
              isPicTextShow: false
            });
          } else {
            var crudeCaptureList = trouble.captureUrls;
            // crudeCaptureList = crudeCaptureList.substr(1, crudeCaptureList.length - 1);
            console.log("crudeCaptureList:" + crudeCaptureList);
            if (crudeCaptureList != null) {
              var captureArray = crudeCaptureList.split(",");
              captureArray.pop();
              that.setData({
                captureUrls: captureArray
              });
            }
          }
          if (trouble.solutionComment == "") {
            that.setData({
              comment: "无"
            });
          }
          if (trouble.detail == "") {
            that.setData({
              detail: "无"
            });
          }
          if (trouble.status == 1) { // 已提交
            that.setData({
              isRevokeShow: true,
              isCommitted: 'process',
              isSolved: "",
              isConfirmed: "",
              isCommitContent: true,
              isConfirmContent: false,
              isSolveContent: false,
              isCommentShow: false,
              isActiveShow: false,
              isHomeShow: false
            });
            if (isAdmin) {
              that.setData({
                isSolveShow: false,
                isConfirmShow: true,
                isRevokeShow: false,
                isActiveShow: false,
                isHomeShow: false
              });
            }
          } else if (trouble.status == 2) { // 已确认
            that.setData({
              isConfirmShow: false,
              isRevokeShow: false,
              isHomeShow: true,
              isSolved: "",
              isCommitted: 'finish',
              isConfirmed: 'process',
              isCommitContent: false,
              isConfirmContent: true,
              isSolveContent: false,
              isActiveShow: false,
              isCommentShow: false,
              confirmContent: trouble.confirmer + " 于" + new Date(trouble.confirmTime).format("yyyy-MM-dd HH:mm") + "确认"
            });
            if (isAdmin) {
              that.setData({
                isSolveShow: true,
                isRevokeShow: false,
                isActiveShow: false,
                isHomeShow: false
              });
            }
          } else if (trouble.status == 3) { // 已完成
            that.setData({
              isRevokeShow: false,
              isSolveShow: false,
              isActiveShow: true,
              isHomeShow: true,
              isConfirmed: "finish",
              isCommitted: 'finish',
              isSolved: 'process',
              isCommitContent: false,
              isConfirmContent: false,
              isSolveContent: true,
              isCommentShow: true,
              solveContent: trouble.solver + " 于" + new Date(trouble.solveTime).format("yyyy-MM-dd HH:mm") + "解决"
            });
            if (isAdmin) {
              that.setData({
                isActiveShow: false
              });
            }
          } else { // 已撤回
            that.setData({
              isRevokeShow: false,
              isSolveShow: false,
              isHomeShow: true,
              isActiveShow: true,
              isConfirmed: "finish",
              isCommitted: 'finish',
              isSolved: 'process',
              isCommitContent: false,
              isConfirmContent: false,
              isSolveContent: true,
              isCommentShow: false,
              solveContent: trouble.solver + " 于" + new Date(trouble.solveTime).format("yyyy-MM-dd HH:mm") + "撤回"
            });
            if (isAdmin) {
              that.setData({
                isActiveShow: false
              });
            }
          }
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
  onLoad: function(options) {
    var that = this;

    if (that.data.troubleId == 0) {
      var troubleId = options.troubleId;
      that.setData({
        troubleId: troubleId
      });
    }

  },
  onReady: function() {
    var that = this;
    console.log("onReady")
    var res = wx.getSystemInfoSync();
    that.setData({
      height: "height:" + res.windowHeight + "px"
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onRefresh() {
    console.log("onRefresh")
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    this.onShow();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  clickNumber:function(e){
    var that = this;
    wx.showActionSheet({
      itemList: ['呼叫' ,'添加联系人'],
      success: function (res) {
        console.log("点击电话 res：", res)
        if (res.tapIndex == 0) {//直接呼叫
          wx.makePhoneCall({
            phoneNumber: that.data.mobile,
            success: function (res_makephone) {
              console.log("呼叫电话返回：", res_makephone)
            }
          })
        } else if (res.tapIndex == 1) {//添加联系人
          wx.addPhoneContact({
            firstName: that.data.troubleOwner,
            mobilePhoneNumber: that.data.mobile,
            success: function (res_addphone) {
              wx.showToast({
                title: '添加联系人成功！',
                icon: 'success',
                duration: 2000
              })
            }
          })
        }
      }
    });
  },
  toConfirm: function(e) {
    var that = this;
    // 收集formId
    let formId = e.detail.formId;
    console.log("formId:" + formId);
    that.data.formIds.push(formId);
    if (that.data.clickCount > 0) {
      return;
    }
    that.data.clickCount++;
    console.log("clickCount:" + that.data.clickCount);
    wx.request({
      url: app.globalData.localApiUrl + '/trouble/confirm',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'troubleId': that.data.troubleId,
        'solverId': wx.getStorageSync("userInfo").id,
        'solver': wx.getStorageSync("userInfo").nickname
      },
      success(res) {
        console.log(res.data);
        if (res.data.code == 1) {
          var trouble = res.data.data;
          // 确认成功
          wx.showToast({
            title: '确认成功',
            icon: 'none',
            duration: 2000
          });
          that.setData({
            isRevokeShow: false,
            isConfirmShow: false,
            isSolved: "",
            isConfirmed: 'process',
            isCommitted: '',
            isConfirmContent: true,
            confirmContent: trouble.confirmer + " 于" + new Date(trouble.confirmTime).format("yyyy-MM-dd HH:mm") + "确认"
          });
          that.onShow();
        }
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
            },
            fail() {
              wx.showToast({
                title: '网络请求失败，请稍后重试！',
                icon: 'none',
                duration: 2000
              })
            }
          });
        }, 100);
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
  toSolve: function() {
    wx.navigateTo({
      url: '/pages/solve/solve?troubleId=' + this.data.troubleId
    })
  },
  toHome: function() {
    wx.reLaunch({
      url: '/pages/submit/submit'
    });
  },
  toActive: function() {
    var that = this;
    wx.showModal({
      title: '你确定重新激活该故障吗？',
      content: '激活将通知技术员重新来处理该故障',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.localApiUrl + '/trouble/active',
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            data: {
              'troubleId': that.data.troubleId
            },
            success(res) {
              console.log(res.data);
              if (res.data.code == 1) {
                // 激活成功
                wx.showToast({
                  title: '激活成功',
                  icon: 'none',
                  duration: 2000
                });
                that.onShow();
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  previewImage: function() {

    wx.previewImage({
      current: this.data.captureUrl, // 当前显示图片的http链接
      urls: this.data.captureUrls // 需要预览的图片http链接列表
    })
  },
  toRevoke: function() {
    var that = this;
    wx.showModal({
      title: '你确定撤回该故障吗？',
      content: '撤回将不再有技术员受理',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.request({
            url: app.globalData.localApiUrl + '/trouble/revoke',
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            data: {
              'troubleId': that.data.troubleId,
              'solverId': wx.getStorageSync("userInfo").id,
              'solver': wx.getStorageSync("userInfo").nickname
            },
            success(res) {
              console.log(res.data);
              if (res.data.code == 1) {
                // 撤回成功
                wx.showToast({
                  title: '撤回成功',
                  icon: 'none',
                  duration: 2000
                });
                that.onShow();
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  }

})