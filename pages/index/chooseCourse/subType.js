// pages/index/chooseCourse/subType.js
var util = require('../../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  chooseNext: function (e) {
    //console.log(e.currentTarget.dataset.categoryid)
    var subTypeId = e.currentTarget.dataset.subtypeid
    var onlyonebasetype = e.currentTarget.dataset.onlyonebasetype
    var url = ''
//    console.log('111')
    wx.checkSession({
      success: res=> {
        if (onlyonebasetype) {
          url = app.globalData.url + 'wxlogin/getuserInfo.php?which=baseType&subTypeId=' + subTypeId + '&userId=' + app.globalData.userId + '&session_key=' + app.globalData.session_key
        } else {
          url = app.globalData.url + 'wxlogin/getuserInfo.php?which=baseType&subTypeId=' + subTypeId + '&userId=' + app.globalData.userId + '&session_key=' + app.globalData.session_key
        }
//        console.log(url)
        util.httpRequire(url, this.callback)
      },
      fail: res => {
        wx.showToast({
          title: '登录状态异常',
        })
        wx.redirectTo({
          url: '../index',
        })
      }
    })

  },
  getLogin: function(res) {
    wx.redirectTo({
      url: '../index',
    })
  },
  callback: function (res) {
//        console.log(res.data)
        wx.navigateTo({
          url: 'baseType?course=' + JSON.stringify(res.data),
        })
  },

  onLoad: function (options) {
    var temp = JSON.parse(options.course)
 //     console.log(temp)
    this.setData({
      course: temp
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