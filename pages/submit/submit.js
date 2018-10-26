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
        notice_status: false,
        accounts: ["微信号", "QQ号", "手机号"],
        accountIndex: 0,
        peopleHide: false,
        isAgree: false,
        date: formate_data(myDate),
        address: '点击选择位置',
        longitude: 0, //经度
        latitude: 0, //纬度
        showTopTips: false,
        TopTips: '',
        noteMaxLen: 200, //备注最多字数
        content: "",
        noteNowLen: 0, //备注当前字数
        type: '其他问题',
        types: ['导航台问题', '电脑问题', '打印机问题', '其他问题'],
        typeIndex: "0",
        showInput: false, //显示输入真实姓名,
    },

    tapNotice: function (e) {
        if (e.target.id == 'notice') {
            this.hideNotice();
        }
    },
    showNotice: function (e) {
        this.setData({
            'notice_status': true
        });
    },
    hideNotice: function (e) {
        this.setData({
            'notice_status': false
        });
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
        wx.hideToast()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var myInterval = setInterval(getReturn, 500); ////半秒定时查询
        function getReturn() {
            wx.getStorage({
                key: 'user_openid',
                success: function (ress) {
                    if (ress.data) {
                        clearInterval(myInterval)
                        that.setData({
                            loading: true
                        })
                    }
                }
            })
        }
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

    //上传活动群二维码
    uploadCodePic: function () { //选择图标
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], //压缩图
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                that.setData({
                    isCodeSrc: true,
                    codeSrc: tempFilePaths
                })
            }
        })
    },

    //删除活动群二维码
    clearCodePic: function () {
        that.setData({
            isCodeSrc: false,
            codeSrc: ""
        })
    },

    //限制人数
    switch1Change: function (e) {
        if (e.detail.value == false) {
            this.setData({
                peopleHide: false
            })
        } else if (e.detail.value == true) {
            this.setData({
                peopleHide: true
            })
        }
    },

    //改变时间
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    //改变活动类别
    bindTypeChange: function (e) {
        this.setData({
            typeIndex: e.detail.value
        })
    },
    //选择地点
    addressChange: function (e) {
        this.addressChoose(e);
    },
    addressChoose: function (e) {
        var that = this;
        wx.chooseLocation({
            success: function (res) {
                that.setData({
                    address: res.name,
                    longitude: res.longitude, //经度
                    latitude: res.latitude, //纬度
                })
                if (e.detail && e.detail.value) {
                    this.data.address = e.detail.value;
                }
            },
            fail: function (e) {
            },
            complete: function (e) {
            }
        })
    },

    //改变联系方式
    bindAccountChange: function (e) {
        this.setData({
            accountIndex: e.detail.value
        })
    },

    //同意相关条例
    bindAgreeChange: function (e) {
        this.setData({
            isAgree: !!e.detail.value.length,
            showInput: !this.data.showInput
        });
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

        if (that.data.showInput == false) {
            wx.showModal({
                title: '提示',
                content: '请先阅读《发起须知》'
            })
            return;
        }
        var title = e.detail.value.title;
        var endtime = this.data.date;
        var typeIndex = this.data.typeIndex;
        var acttype = 1 + parseInt(typeIndex);
        var acttypename = getTypeName(acttype); //获得类型名称
        var address = this.data.address;
        var longitude = this.data.longitude; //经度
        var latitude = this.data.latitude; //纬度
        var switchHide = e.detail.value.switchHide;
        var peoplenum = e.detail.value.peoplenum;
        console.log(peoplenum);
        var content = e.detail.value.content;
        //------发布者真实信息------
        var realname = e.detail.value.realname;
        var contactindex = this.data.accountIndex;
        if (contactindex == 0) {
            var contactWay = "微信号";
        } else if (contactindex == 1) {
            var contactWay = "QQ号";
        } else if (contactindex == 2) {
            var contactWay = "手机号";
        }
        var contactValue = e.detail.value.contactValue;
        var wxReg = new RegExp("^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$");
        var qqReg = new RegExp("[1-9][0-9]{4,}");
        var phReg = /^1[34578]\d{9}$/;
        var nameReg = new RegExp("^[\u4e00-\u9fa5]{2,4}$");
        //先进行表单非空验证
        if (title == "") {
            this.setData({
                showTopTips: true,
                TopTips: '请输入主题'
            });
        } else if (address == '点击选择位置') {
            this.setData({
                showTopTips: true,
                TopTips: '请选择地点'
            });
        } else if (switchHide == true && peoplenum == "") {
            this.setData({
                showTopTips: true,
                TopTips: '请输入人数'
            });
        } else if (content == "") {
            this.setData({
                showTopTips: true,
                TopTips: '请输入活动内容'
            });
        } else if (realname == "") {
            this.setData({
                showTopTips: true,
                TopTips: '请输入真实姓名'
            });
        } else if (realname != "" && !nameReg.test(realname)) {
            this.setData({
                showTopTips: true,
                TopTips: '真实姓名一般为2-4位汉字'
            });
        } else if (contactValue == "") {
            this.setData({
                showTopTips: true,
                TopTips: '请输入联系方式'
            });
        } else if (contactWay == "微信号" && !wxReg.test(contactValue)) {
            this.setData({
                showTopTips: true,
                TopTips: '微信号格式不正确'
            });
        } else if (contactWay == "手机号" && !phReg.test(contactValue)) {
            this.setData({
                showTopTips: true,
                TopTips: '手机号格式不正确'
            });
        } else if (contactWay == "QQ号" && !qqReg.test(contactValue)) {
            this.setData({
                showTopTips: true,
                TopTips: 'QQ号格式不正确'
            });
        } else {
            console.log('校验完毕');
            that.setData({
                isLoading: true,
                isdisabled: true
            })
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

//根据活动类型获取活动类型名称
function getTypeName(acttype) {
    var acttypeName = "";
    if (acttype == 1) acttypeName = "运动";
    else if (acttype == 2) acttypeName = "游戏";
    else if (acttype == 3) acttypeName = "交友";
    else if (acttype == 4) acttypeName = "旅行";
    else if (acttype == 5) acttypeName = "读书";
    else if (acttype == 6) acttypeName = "竞赛";
    else if (acttype == 7) acttypeName = "电影";
    else if (acttype == 8) acttypeName = "音乐";
    else if (acttype == 9) acttypeName = "其他";
    return acttypeName;
}