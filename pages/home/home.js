//获取应用实例
const app = getApp();
Page({
    data: {
        src: "",
        isSrc: false,
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
    //上传活动图片
    uploadPic: function () { //选择图标
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], //压缩图
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                that.setData({
                    isSrc: true,
                    src: tempFilePaths
                })
            }
        })
    },

    //删除图片
    clearPic: function () { //删除图片
        that.setData({
            isSrc: false,
            src: ""
        })
    },
})