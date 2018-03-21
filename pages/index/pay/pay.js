// pages/index/pay/pay.js
const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payInfo : {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 //   console.log(JSON.parse(options.payInfo.replace(/niceequal/g, "=")))
  this.setData({
    payInfo: JSON.parse(options.payInfo.replace(/niceequal/g, "="))
  })

   // console.log(payInfo)
  //  console.log(JSON.parse(payInfo))
  },
pay: function(res) {

    if(this.data.payInfo.state==1) {
      //提交给微信服务器
      wx.requestPayment({
        timeStamp: this.data.payInfo.timeStamp,
        nonceStr: this.data.payInfo.nonceStr,
        package: this.data.payInfo.package,
        signType: this.data.payInfo.signType,
        paySign: this.data.payInfo.paySign,
        success: res=> {
          //支付成功
          wx.checkSession({
            success: res => {
              var url = app.globalData.url + 'wxlogin/getuserInfo.php?which=payResult' + '&session_key=' + app.globalData.session_key + '&userId=' + app.globalData.userId + "&orderNo=" + this.data.payInfo.out_trade_no
              util.httpRequire(url, this.payQuery)
            }
          })

//          console.log("requestPayment:")
//          console.log(res);
        },
        fail: res=> {
//          console.log(res)
          // if (res.errMsg == "requestPayment: fail cancel") {
          //   wx.checkSession({
          //     success: res => {
          //       var url = app.globalData.url + 'wxlogin/getuserInfo.php?which=cancelOrder' + '&session_key=' + app.globalData.session_key + '&userId=' + app.globalData.userId + "&orderNo=" + this.data.payInfo.out_trade_no
          //       util.httpRequire(url, this.payQuery)
          //     }
          //   })
          // }
         
        }
      })
    } else {
      wx.showModal({
        title: '支付异常',
        content: res.data.RETURN_MSG,
      })
    }
},
payQuery: function(res) {

  var temp = res.data[0]
  wx.showModal({
    title: '支付成功',
    content: '恭喜你.',
    success: res => {
      wx.redirectTo({
        url: 'payResult?orderInfo=' + JSON.stringify(temp),
      })
    }
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