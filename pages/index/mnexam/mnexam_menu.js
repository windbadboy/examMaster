// pages/index/mnexam/mnexam_menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [20, 30, 50],
    itemNumber: 0

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
      url: 'mnexam_body?num=' + e.detail.value + "&examPage=1&itemNumber="+this.data.itemNumber,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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