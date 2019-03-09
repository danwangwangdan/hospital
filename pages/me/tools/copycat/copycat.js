import { $wuxCalendar } from '../../../../plugins/wux/index';
const app = getApp()

Page({
  data: {
    buttons: [{
      type: 'balanced',
      block: true,
      text: '返回',
      value:''
    }
    ],
  },
  openCalendar() {
    $wuxCalendar().open({
      value: this.data.value,
      onChange: (values, displayValues) => {
        console.log('onChange', values, displayValues)
        this.setData({
          value: displayValues,
        })
      },
    })
  },
  onClick(e) {
    wx.reLaunch({
      url: '/pages/me/me'
    })
  },
  //事件处理函数
  toNew: function() {
   
  },
  onLoad: function() {

  }
})