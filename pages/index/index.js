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
    courseInfo: '',
    bgcolor_iPay:'',
    mnNum:0,
    realNum:0,
    vipTitle:'购买vip',
    vip:0,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  realitem: function () {
    if (app.globalData.userInfo && app.globalData.userId) {
      if (app.globalData.vip == 1) {
        wx.navigateTo({
          url: 'mnexam/mnexam_menu?type=2',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        wx.showToast({
          title: '请购买vip',
        })

      }

    } else {
      wx.showToast({
        title: '请先登录',
      })
    }



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
    app.globalData.vip = res.vip
    wx.hideNavigationBarLoading()
    this.setData({
      mnNum : res.mnNum,
      realNum : res.realNum,
    })
    if (app.globalData.vip == 1) {
      this.setData({
        bgcolor_iPay: '#eee',
        vipTitle:'已购买VIP',
        vip:res.vip
      })
    } else {
      this.setData({
        bgcolor_iPay: '#0078d7'
      })      
    }
    if (!wx.getStorageSync('currentCourse')) {
      this.setData({
        bgcolor_syl: '#eee',
        bgcolor_zt: '#eee',
        bgcolor_other: '#eee'

      })
    } else {
      this.setData({
        bgcolor_syl: '#0078d7',
        bgcolor_zt: '#0078d7',
        bgcolor_other: '#eee',


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
        url: 'mnexam/mnexam_menu?type=1',
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
  },
  iPay: function (res) {
    if (app.globalData.userId != '' || app.globalData.userId != null) {
      if(app.globalData.vip!=1) {
        wx.checkSession({
          success: res => {

            wx.showModal({
              title: '购买终身vip',
              content: '¥ 30元',
              success: res => {
                if (res.confirm) {
                  var url = app.globalData.url + 'wxlogin/getuserInfo.php?which=iPay' + '&session_key=' + app.globalData.session_key + '&userId=' + app.globalData.userId + "&fee=3000&mybody=1"
                  util.httpRequire(url, this.iPayReturn)
                }
              }
            })

          },
          fail: res => {
            wx.showToast({
              title: '请先登录',
            })
          }
        })
      } else {
        wx.showToast({
          title: '已获得vip资格',
        })        
      }

    }
   
  },
  iPayReturn: function(res) {
//    console.log(res.data);
    var tempStr = JSON.stringify(res.data)
    tempStr = tempStr.replace(/=/g,"niceequal")
    wx.navigateTo({
      url: 'pay/pay?payInfo=' + tempStr,
    })
    // if(res.data.state==1) {
    //   wx.requestPayment({
    //     timeStamp: res.data.timeStamp,
    //     nonceStr: res.data.nonceStr,
    //     package: res.data.package,
    //     signType: res.data.signType,
    //     paySign: res.data.paySign,
    //     success: res=> {
    //       //支付成功
    //       console.log(res);
    //     },
    //     fail: res=> {
    //       console.log(res)
    //     }
    //   })
    // } else {
    //   wx.showModal({
    //     title: '支付异常',
    //     content: res.data.RETURN_MSG,
    //   })
    // }

  }

})


