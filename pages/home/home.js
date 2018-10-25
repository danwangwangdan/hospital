//获取应用实例
const app = getApp();
Page({
    data: {
      troubleType: ['导航台问题', '电脑问题', '打印机问题', '其他问题'],
        index: 0,
    },

    //事件处理函数
    submitSuc: function () {
      wx.navigateTo({
        url: '/pages/home/submit_suc/submit_suc'
      })
    },
    onLoad: function () {

    },
})