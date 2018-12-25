//获取应用实例
const app = getApp();


Page({
  data: {
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
    isHomeShow: true,
    confirmPressContent: 0,
    solveContent: "",
    captureUrl: "",
    captureUrls: [],
    detail: "",
    troubleType: "",
    office: "",
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
        wx.stopPullDownRefresh(); //停止下拉刷新
        console.log(res.data);
        wx.hideLoading();
        if (res.data.code == 1) {
          var trouble = res.data.data;
          that.data.captureUrls.push(trouble.captureUrls);
          that.setData({
            troubleOwner: trouble.troublePersonName,
            submitTime: new Date(trouble.submitTime).format("yyyy-MM-dd HH:mm"),
            office: trouble.office,
            troubleType: trouble.secType == '其他问题' ? trouble.secType : trouble.firType + "-" + trouble.secType,
            detail: trouble.detail,
            comment: trouble.solutionComment,
            captureUrl: trouble.captureUrls
          })
          if (trouble.captureUrls == "") {
            that.setData({
              isPicTextShow: false
            });
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
              isHomeShow: false
            });
            if (isAdmin) {
              that.setData({
                isSolveShow: false,
                isConfirmShow: true,
                isRevokeShow: false,
                isHomeShow: false
              });
            }
          } else if (trouble.status == 2) { // 已确认
            that.setData({
              isConfirmShow: false,
              isRevokeShow: false,
              isHomeShow: true,
              isSolved: "",
              isCommitted:'finish',
              isConfirmed: 'process',
              isCommitContent: false,
              isConfirmContent: true,
              isSolveContent: false,
              isCommentShow: false,
              confirmContent: trouble.confirmer + " 于" + new Date(trouble.confirmTime).format("yyyy-MM-dd HH:mm") + "确认"
            });
            if (isAdmin) {
              that.setData({
                isSolveShow: true,
                isRevokeShow: false,
                isHomeShow: false
              });
            }
          } else if (trouble.status == 3) { // 已完成
            that.setData({
              isRevokeShow: false,
              isSolveShow: false,
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
          } else { // 已撤回
            that.setData({
              isRevokeShow: false,
              isSolveShow: false,
              isHomeShow: true,
              isConfirmed: "finish",
              isCommitted: 'finish',
              isSolved: 'process',
              isCommitContent: false,
              isConfirmContent: false,
              isSolveContent: true,
              isCommentShow: false,
              solveContent: trouble.solver + " 于" + new Date(trouble.solveTime).format("yyyy-MM-dd HH:mm") + "撤回"
            });
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    this.onShow();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  toConfirm: function(e) {
    var that = this;
    // 收集formId
    let formId = e.detail.formId;
    console.log("formId:" + formId);
    that.data.formIds.push(formId);
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