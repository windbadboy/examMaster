// pages/index/mnexam/mnexam_menu.js
const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [20, 30, 50],
    itemNumber: 0,
    itemType:1,
    vipCourse:{},

  },

  bindPickerChange: function (e) {
    switch (e.detail.value) {
      case "0":
        this.data.itemNumber = 20;
        break;
      case "1":
        this.data.itemNumber = 30;
        break;
      case "2":
        this.data.itemNumber = 50
        break;         
      case "3":
        this.data.itemNumber = 30;
        break;
      case "4":
        this.data.itemNumber = 50;
        break;
   
    }
    wx.navigateTo({
      url: 'mnexam_body?num=' + e.detail.value + "&examPage=1&itemNumber="+this.data.itemNumber+"&examTitle=随意练&examType=1",
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

   //   console.log(options.type)
   this.setData({
     itemType : options.type
   })
   if (options.type==2) {
     wx.checkSession({
       success: res=> {
         wx.request({
           url: app.globalData.url + 'wxlogin/getuserInfo.php?which=getVipCourse&currentCourse=' + wx.getStorageSync('currentCourse') + '&userId=' + app.globalData.userId + '&session_key=' + app.globalData.session_key,
           success: res=> {
//            console.log(res.data)
            //state为1代表有数据
             if (res.data.state==1) {
                this.setData({
                  vipCourse: res.data.data
                })
             } else {
               wx.showModal({
                 title: '提示',
                 content: '题库待更新',
                 showCancel:false,
                 success: res=> {
                   wx.redirectTo({
                     url: '../index',
                   })
                 }
               })
             }
           }
         })
       }
     })
   }

  },
  doexam : function(res) {
//    console.log(res);
    wx.navigateTo({
      url: 'mnexam_body?examType=2&chapterId=' + res.currentTarget.dataset.chapterid +'&examTitle=真题模考',
    })
  },
  syl: function () {

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