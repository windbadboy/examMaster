// pages/index/mnexam/mnexam_body.js
const app = getApp()
var utils = require('../../../utils/util.js')
var pause = false
var m = 0
var n = 0
var examData = {}

function countdown(that) {
  //console.log('status:'+pause)
  if (!pause) {
    var temp
    if (n >= 60) {
      m++
      temp = m + '分'
      n = 0
      temp = temp + n + '秒'
    } else {
      temp = m + '分' + n + '秒'
    }
    that.setData({
      clock: temp//格式化时间
    });
    n++;
    if (n > 3600) {

      return;
    }
    setTimeout(function () {
      countdown(that)
    }, 1000)

  } else {
    return
  }


}




Page({

  /**
   * 页面的初始数据
   */
  data: {

    userInfo: {},
    answerShow: true,
    clock: '',
    isPause: '停',
    pauseButton: 'greenyellow',
    examNextPage: 1,
    examCurrentPage: 0,
    examSingleData: {},
    examPrevPage: 1,
    examdid: 0,
    examleft: 0,



  },
  checkboxChange: function (e) {
    //  console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  isPause: function () {
    if (pause) {
      pause = false
      this.setData({
        isPause: '停',
        pauseButton: 'greenyellow'
      })
      countdown(this)
    } else {
      pause = true
      this.setData({
        isPause: '继',
        pauseButton: 'red'
      })

    }

  },

  radioChange: function (e) {
    //   console.log('radio发生change事件，携带value值为：', e)
    // if(e.detail.value!=this.data.examSingleData.userAnswer) {
    //   this.data.examData[this.data.examCurrentPage].isSubmitted=false
    //   this.setData({
    //     'examSingleData.isSubmitted' : false,
    //     examData : this.data.examData,
    //   })
    // }
    //    console.log(e.detail.value)
    this.setData({
      'examSingleData.userAnswer': e.detail.value,

    })

  },
  checkboxChange: function (e) {
    var tempAnswer = ''
    for (var i = 0; i < e.detail.value.length; i++) {
      tempAnswer += e.detail.value[i]
    }
    //    console.log(tempAnswer)
    this.setData({
      'examSingleData.userAnswer': tempAnswer,

    })
  },

  answerAnalysis: function (e) {
    //   console.log(e)
    if (this.data.answerShow) {
      this.setData({
        answerShow: false
      })
    } else {
      this.setData({
        answerShow: true
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    this.setData({
      userInfo: app.globalData.userInfo,
    })
    pause = false
    //计时器开始计时
    countdown(this)
    //错题重做
    if (options.retry == 1) {
      //      console.log(JSON.parse(options.wrongData))
      var wrongData = {}
      wrongData = JSON.parse(options.wrongData)
      this.setData({
        examData: wrongData,
        examSingleData: wrongData[options.examPage],
        examleft: options.num,
      })
    }
    else {
      //获取题库
      wx.checkSession({
        success: res => {
          var url = app.globalData.url + 'wxlogin/getuserInfo.php?which=getExam&courseId=' + wx.getStorageSync('currentCourse') + '&userId=' + app.globalData.userId + '&session_key=' + app.globalData.session_key + '&itemNumber=' + options.itemNumber + '&categoryId=' + app.globalData.categoryId
          //        console.log(url)
          wx.showLoading({
            title: '正在加载数据',
            mask: true,
          })
          //题库获取函数
          utils.httpRequire(url, this.callback)
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


    //      console.log(JSON.parse(options.examData))


  },
  //获取题库成功
  callback: function (res) {
//    console.log(res)
    //获取单前页
    var tempData2 = res.data[this.data.examCurrentPage]
    //  temp2 = temp2.replace(/<br>/g, "\\n");
    //   tempData2.examBody = tempData2.examBody.replace(/<br>/g, "\\n")
    //   console.log(tempData2.examBody)
    this.setData({
      examData: res.data,
      examSingleData: tempData2,
      examleft: res.data.length,
    })
    wx.hideLoading()
  },
  submitbutton: function (res) {
    if (this.data.examSingleData.userAnswer.length == 0) {
      wx.showToast({
        title: '请先选择答案',
      })
    } else {
      //     console.log(this.data.examData[this.data.examCurrentPage].userAnswer)


      //如果从未做过该题（userAnswer为空表示从未做过）
      if (this.data.examData[this.data.examCurrentPage].userAnswer == "") {
        this.setData({
          examdid: parseInt(this.data.examdid) + 1,
          examleft: parseInt(this.data.examleft) - 1,
        })
      }
      this.data.examData[this.data.examCurrentPage].userAnswer = this.data.examSingleData.userAnswer
      this.data.examData[this.data.examCurrentPage].answerButtonShow = 0;
      this.data.examData[this.data.examCurrentPage].isSubmitted = 1;
      this.setData({
        'examSingleData.answerButtonShow': 0,
        examData: this.data.examData,
        'examSingleData.isSubmitted': 1,

      })
      //        console.log(this.data.examSingleData)
      //在单条数据里查找4个选项(根据answer_letter)
      //        console.log()
      for (var i = 0; i < this.data.examSingleData.examAnswer.length; i++) {

        for (var j = 0; j < this.data.examSingleData.userAnswer.length; j++) {
          if (this.data.examSingleData.examAnswer[i].answer_letter == this.data.examSingleData.userAnswer.substr(j,1)) {
            this.data.examSingleData.examAnswer[i].checked = 1
            this.data.examData[this.data.examCurrentPage].examAnswer[i].checked = 1
            this.setData({
              examSingleData: this.data.examSingleData,
              examData: this.data.examData
            })
            break;
          } else {
            this.data.examSingleData.examAnswer[i].checked = 0
            this.data.examData[this.data.examCurrentPage].examAnswer[i].checked = 0
            this.setData({
              examSingleData: this.data.examSingleData,
              examData: this.data.examData
            })

          }
        }


      }
      //        console.log(this.data.examData)        
      wx.showToast({
        title: '提交成功',
        duration: 500
      })




    }

    //   console.log(this.data.examData)
  },

  submitExam: function (res) {
    if (this.data.examleft > 0) {
      wx.showModal({
        title: '提示',
        content: '还未全部作答，确定交卷？',
        cancelText: '返回',
        cancelColor: '#',
        success: res => {
          //如果点击确定
          if (res.confirm) {
            //            console.log('inBody:'+m+':'+n)
            //            console.log(this.data.examData)
            var temp2 = JSON.stringify(this.data.examData)

            temp2 = temp2.replace(/\?/g, "？");
            temp2 = temp2.replace(/'/g, "\\\\'");
            temp2 = temp2.replace(/<br>/g, "\\n");
            temp2 = temp2.replace(/\+/g,"＋");
            temp2 = temp2.replace(/\=/g,"＝");
        //                console.log(temp2)
            wx.redirectTo({
              url: 'mnexam_result?examData=' + temp2 + '&m=' + m + '&s=' + n,
            })
          }
        }
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '答题全部完成,确定交卷？',
        cancelText: '检查',
        cancelColor: '#',
        success: res => {
          //如果点击确定
          if (res.confirm) {
            var temp2 = JSON.stringify(this.data.examData)

            temp2 = temp2.replace(/\?/g, "？");
            temp2 = temp2.replace(/'/g, "\\\\'");
            temp2 = temp2.replace(/<br>/g, "\\n");
            temp2 = temp2.replace(/\+/g, "＋");
            temp2 = temp2.replace(/\=/g, "＝");
            //            console.log(temp2)            
            wx.redirectTo({
              url: 'mnexam_result?examData=' + temp2 + '&m=' + m + '&s=' + n,
            })
          }
        }
      })
    }
  },
  goNextPage: function (res) {
    //    console.log(this.data.examData.length)
    if (this.data.examCurrentPage == this.data.examData.length - 1) {
      wx.showToast({
        title: '最后1题.',
      })
    }
    else {
      this.setData({
        examCurrentPage: parseInt(this.data.examCurrentPage) + 1,
      })

      this.setData({
        examSingleData: this.data.examData[this.data.examCurrentPage]
      })
    }

  },
  goPrevPage: function (res) {
    if (this.data.examCurrentPage == 0) {
      wx.showToast({
        title: '第1题.',
      })
    } else {
      //     console.log(res)
      this.setData({
        examCurrentPage: parseInt(this.data.examCurrentPage) - 1
      })

      this.setData({
        examSingleData: this.data.examData[this.data.examCurrentPage]
      })
    }
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
    m = 0
    n = 0
    pause = true
    examData = {}
    // console.log('unloaded')
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