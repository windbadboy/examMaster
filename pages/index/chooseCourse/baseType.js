// pages/index/chooseCourse/baseType.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  course : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var temp = JSON.parse(options.course)
    console.log(temp)
    this.setData({
      course: temp
    }) 
  },
  chooseNext: function (e) {
    console.log(e.currentTarget.dataset.basetypeid)

    wx.checkSession({
      success: res => {
        var basetypeid = e.currentTarget.dataset.basetypeid
        wx.request({
          url: app.globalData.url + 'wxlogin/getuserInfo.php?which=setchooseCourse&baseTypeId=' + basetypeid + '&userId=' + app.globalData.userId + '&session_key=' + app.globalData.session_key ,
          success: res => {
            //    console.log(res)
            wx.setStorageSync('currentCourse', basetypeid)
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


   // util.httpRequire(url, this.callback)
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