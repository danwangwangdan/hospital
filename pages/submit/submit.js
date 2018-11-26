//获取应用实例
var app = getApp()
var that;
var myDate = new Date();

//格式化日期
function formate_data(myDate) {
    let month_add = myDate.getMonth() + 1;
    var formate_result = myDate.getFullYear() + '-' +
        month_add + '-' +
        myDate.getDate()
    return formate_result;
}

Page({
    /**
     * 页面的初始数据
     */
    data: {
        showTopTips: false,
        TopTips: '',
        username: app.globalData.nickName,
        office: app.globalData.office,
        imageUrl: "",
        noteMaxLen: 200, //备注最多字数
        content: "",
        noteNowLen: 0, //备注当前字数
        firTypes: ['其他问题'],
        firTypeValue: '',
        firTypeIndex: 0,
        secTypes: ['其他问题'],
        secTypeValue: '',
        secTypeDis: false,
        secTypeIndex: 0,
        src: "",
        isSrc: false,
        ishide: "0",
        autoFocus: true,
        isLoading: false,
        loading: true,
        isdisabled: false
    },

    submitSuc: function () {
        wx.navigateTo({
            url: '/pages/home/submit_suc/submit_suc'
        })
    },
    //字数改变触发事件
    bindTextAreaChange: function (e) {
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        that = this;
        that.setData({ //初始化数据
            src: "",
            isSrc: false,
            ishide: "0",
            autoFocus: true,
            isLoading: false,
            loading: true,
            isdisabled: false
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
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
    },

    //改变活动类别
    firTypeChange: function (e) {
        this.setData({
            firTypeIndex: e.detail.value,
            firTypeValue: this.data.firTypes[e.detail.value]
        });
        //获取一级类型
        wx.request({
            url: app.globalData.localApiUrl + '/common/secTypes?firTypeId=' + this.data.firTypeIndex,
            method: 'GET',
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log(res.data);
                if (res.data.code == 1) {
                    that.setData({
                        secTypes: res.data.data,
                    })
                }
            }
        });

    },
    secTypeChange: function (e) {
        this.setData({
            secTypeIndex: e.detail.value,
            secTypeValue: this.data.secTypes[e.detail.value]
        })
    },

    //上传活动图片
    uploadPic: function () { //选择图标
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original'], //压缩图
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                that.setData({
                    isSrc: true,
                    src: tempFilePaths
                });
                upload(that, path);
            },
        })
    },
    //预览图片
    previewImage: function () {
        wx.previewImage({
            current: this.data.src, // 当前显示图片的http链接
            urls: this.data.src // 需要预览的图片http链接列表
        })

    },

    //删除图片
    clearPic: function () { //删除图片
        that.setData({
            isSrc: false,
            src: ""
        })
    },

    //表单验证
    showTopTips: function () {
        var that = this;
        this.setData({
            showTopTips: true
        });
        setTimeout(function () {
            that.setData({
                showTopTips: false
            });
        }, 3000);
    },

    //提交表单
    submitForm: function (e) {
        var that = this;
        var troubleOwner = this.data.username;
        var office = this.data.office;
        var content = this.data.content;
        var firType = this.data.firType;
        var secType = this.data.secType;
        // var imgSrc = this.data.src;
        //先进行表单非空验证
        if (troubleOwner == "") {
            this.setData({
                showTopTips: true,
                TopTips: '请输入故障人'
            });
        } else if (office == '') {
            this.setData({
                showTopTips: true,
                TopTips: '请输入所属科室'
            });
        } else {
            console.log("校验完毕");
            wx.request({
                url: app.globalData.localApiUrl + '/trouble/submit',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    console.log(res.data);
                    if (res.data.code == 1) {
                        // 跳转到提交成功页面
                        wx.navigateTo({
                            url: '/pages/home/submit_suc/submit_suc'
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
        setTimeout(function () {
            that.setData({
                showTopTips: false
            });
        }, 1000);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

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
        success: function (res) {
            console.log(res);
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
                src: res.data.data[0].url
            })
        },
    })
}