// pages/index/chooseCourse/chooseCourse.js

var util = require('../../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: null,
    subtypeHiddenIndex: 0,
    basetypeHiddenIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //    console.log(options.course)
    var temp = JSON.parse(options.course)
//    console.log(temp)
    this.setData({
      course: temp
    })
  },
setCourseId: function(e) {

},
  chooseNext: function (e) {
    //console.log(e.currentTarget.dataset.categoryid)
    //console.log(e.currentTarget.dataset.index)
    //console.log(this.data.course[e.currentTarget.dataset.index].isHidden)
    //    console.log(this.data.course[e.currentTarget.dataset.index].onlyOneSubtype)
    if (this.data.course[e.currentTarget.dataset.index].onlyOneSubtype == 1) {
      //      console.log(this.data.course[e.currentTarget.dataset.index].subType[0].baseType[0].baseTypeId)
      wx.checkSession({
        success: res => {
          var basetypeid = this.data.course[e.currentTarget.dataset.index].subType[0].baseType[0].baseTypeId
          wx.request({
            url: app.globalData.url + 'wxlogin/getuserInfo.php?which=setchooseCourse&baseTypeId=' + basetypeid + '&userId=' + app.globalData.userId + '&session_key=' + app.globalData.session_key,
            success: res => {
              //    console.log(res)
              wx.setStorageSync('currentCourse', basetypeid)
              wx.showToast({
                title: '选课成功',
              })
              wx.redirectTo({
                url: '../index'
              })
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
        }
      })
    } else {
      if (this.data.course[e.currentTarget.dataset.index].isHidden) {
        this.data.course[e.currentTarget.dataset.index].isHidden = false
        this.data.subtypeHiddenIndex = e.currentTarget.dataset.index
        for (var i = 0; i < this.data.course.length; i++) {
          if (i != e.currentTarget.dataset.index) {
            this.data.course[i].isHidden = true
          }
        }
      } else {
        this.data.course[e.currentTarget.dataset.index].isHidden = true
      }
      this.setData({
        course: this.data.course,
        subtypeHiddenIndex: this.data.subtypeHiddenIndex
      })
    }


    // wx.checkSession({
    //   success: res => {
    //     var categoryId = e.currentTarget.dataset.categoryid
    //     var url = app.globalData.url + 'wxlogin/getuserInfo.php?which=subType&categoryId=' + categoryId + '&userId=' + app.globalData.userId + '&session_key=' + app.globalData.session_key
    //     // console.log('cc:'+url)
    //     util.httpRequire(url, this.callback)
    //   },
    //   fail: res=> {
    //     wx.showToast({
    //       title: '登录状态异常',
    //     })
    //     wx.redirectTo({
    //       url: '../index',
    //     })
    //   }
    // })

  },

  chooseSubCourses: function (e) {
    //   console.log(res)

    //subtypeHiddenIndex代表当前选中哪个一级菜单(英语／公务员／事业单位...)
    if (this.data.course[this.data.subtypeHiddenIndex].subType[e.currentTarget.dataset.index].onlyOneBaseType==1) {
      wx.checkSession({
        success: res => {
          var basetypeid = this.data.course[this.data.subtypeHiddenIndex].subType[e.currentTarget.dataset.index].baseType[0].baseTypeId
          wx.request({
            url: app.globalData.url + 'wxlogin/getuserInfo.php?which=setchooseCourse&baseTypeId=' + basetypeid + '&userId=' + app.globalData.userId + '&session_key=' + app.globalData.session_key,
            success: res => {
              //    console.log(res)
              wx.setStorageSync('currentCourse', basetypeid)
              wx.showToast({
                title: '选课成功',
              })
              wx.redirectTo({
                url: '../index'
              })
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
        }
      })
    } else {
      //basetypeHiddenIndex代表选择了哪个2级菜单(理工/综合/卫生...)
      this.data.basetypeHiddenIndex = e.currentTarget.dataset.index
      if (this.data.course[this.data.subtypeHiddenIndex].subType[e.currentTarget.dataset.index].isHidden) {
        this.data.course[this.data.subtypeHiddenIndex].subType[e.currentTarget.dataset.index].isHidden = false
        for (var i = 0; i < this.data.course[this.data.subtypeHiddenIndex].subType.length; i++) {
          if (i != e.currentTarget.dataset.index) {
            this.data.course[this.data.subtypeHiddenIndex].subType[i].isHidden = true
          }
        }
      } else {
        this.data.course[this.data.subtypeHiddenIndex].subType[e.currentTarget.dataset.index].isHidden = true
      }

      this.setData({
        course: this.data.course,
        basetypeHiddenIndex: this.data.basetypeHiddenIndex,
        
      })
    }

  },

  chooseBaseCourses : function (e) {
    wx.checkSession({
      success: res => {
        var basetypeid = this.data.course[this.data.subtypeHiddenIndex].subType[this.data.basetypeHiddenIndex].baseType[e.currentTarget.dataset.index].baseTypeId
        wx.request({
          url: app.globalData.url + 'wxlogin/getuserInfo.php?which=setchooseCourse&baseTypeId=' + basetypeid + '&userId=' + app.globalData.userId + '&session_key=' + app.globalData.session_key,
          success: res => {
            //    console.log(res)
            wx.setStorageSync('currentCourse', basetypeid)
            wx.showToast({
              title: '选课成功',
            })
            wx.redirectTo({
              url: '../index'
            })
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
      }
    })   
  },
  callback: function (res) {
    //        console.log('cc:'+res.data)
    wx.navigateTo({
      url: 'subType?course=' + JSON.stringify(res.data),
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