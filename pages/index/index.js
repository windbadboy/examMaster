//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    course: {},
    bgcolor: '',
    bgcolor_syl: '',
    bgcolor_zt: '',
    bgcolor_other: '',
    courseInfo: ''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  realitem: function () {
    wx.showToast({
      title: '暂未开放',
    })
  },
  iSubimit : function() {
    wx.showToast({
      title: '暂未开放',
    })   
  },
  reLogin : function (res) {
    util.getLoginInfo(this.getLogin, app.globalData.url)
  },
  getLogin: function (res) {
    //登录成功后返回session_key(自有)和userId
    //根据是否选课
    wx.hideNavigationBarLoading()
    if (!wx.getStorageSync('currentCourse')) {
      this.setData({
        bgcolor_syl: '#eee',
        bgcolor_zt: '#eee',
        bgcolor_other: '#eee'

      })
    } else {
      this.setData({
        bgcolor_syl: '#0078d7',
        bgcolor_zt: '#eee',
        bgcolor_other: '#eee'

      })
    }
    app.globalData.userInfo = wx.getStorageSync('userInfo')
    app.globalData.userId = wx.getStorageSync('userId')

    this.setData({
      bgcolor: '#0078d7'

    })

    app.globalData.session_key = wx.getStorageSync('session_key')
//    console.log('appSessionKey:' + app.globalData.session_key)
    wx.request({
      url: app.globalData.url + 'wxlogin/getuserInfo.php?which=getcurrentCourse&userId=' + app.globalData.userId + '&session_key=' + app.globalData.session_key,
      success: res => {
//         console.log(res)
        // console.log(Object.prototype.toString.call(res.data[0]) === '[object Array]')
        //  console.log(!(typeof (res.data[0]) == 'undefined'))
        if (!(typeof (res.data[0]) == 'undefined')) {
          wx.setStorageSync('currentCourse', res.data[0].currentCourse)
          wx.setStorageSync('categoryId', res.data[0].categoryId)      

          app.globalData.categoryId = res.data[0].categoryId
          //  console.log('111:'+res.data[0].currentCourse)
          this.setData({
            courseInfo: '己选:' + res.data[0].baseTypeName,
            bgcolor_syl: '#0078d7',
          })
        }
        else {
          wx.setStorageSync('currentCourse', null)
          wx.setStorageSync('categoryId', null) 
          this.setData({
            courseInfo: '请先选择课程'
          })
        }
      }
    })  
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })            
  },
  onLoad: function () {

    //console.log('currentcourse:' + wx.getStorageSync('currentCourse'))
    //调用登录接口
        wx.showNavigationBarLoading();
        util.getLoginInfo(this.getLogin, app.globalData.url)



  },

  chooseCourse: function () {

    wx.checkSession({
      success: res => {
        var url = app.globalData.url + 'wxlogin/getuserInfo.php?which=category' + '&session_key=' + app.globalData.session_key + '&userId=' + app.globalData.userId
        util.httpRequire(url, this.callback)
      },
      fail: res => {
        wx.showToast({
          title: '请先登录',
        })
      }
    })

    //   var url = 'https://www.badteacher.club/wxlogin/getCourse.php?which=category'


  },
  mnexam: function () {
    if (app.globalData.userInfo && app.globalData.userId) {
      wx.navigateTo({
        url: 'mnexam/mnexam_menu',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.showToast({
        title: '请先登录',
      })
    }

  },
  getUserInfo: function (e) {
    //  console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  callback: function (res) {
  //      console.log(res.data)
    wx.navigateTo({
      url: 'chooseCourse/chooseCourse?course=' + JSON.stringify(res.data),
    })
  }

})


